"""Authoritative live-turn controller joining interpretation to deterministic state control."""

from __future__ import annotations

import logging
import os
from datetime import UTC, datetime
from uuid import uuid4

from api.errors import RuntimeAPIError
from api.schemas import LiveMessageRequest, LiveMessageResponse, RuntimeErrorView
from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.enums import Materiality
from domain.hypotheses import HypothesisRecord
from domain.transitions import StateTransition
from domain.unknowns import UnknownRecord
from live.interpreter import InterpretationError, LinguisticInterpreter
from live.response import project_state
from live.session import ConversationTurnView, InMemorySessionStore, RuntimeMode

LOGGER = logging.getLogger("entimema.live")
MAX_TURNS = int(os.getenv("ENTIMEMA_MAX_TURNS", "40"))


class LiveSessionController:
    """Admits linguistic candidates deterministically; the provider never mutates state."""

    def __init__(
        self, store: InMemorySessionStore, interpreter: LinguisticInterpreter | None
    ) -> None:
        self.store, self.interpreter = store, interpreter

    def process_message(self, session_id: str, request: LiveMessageRequest) -> LiveMessageResponse:
        try:
            session = self.store.get(session_id)
        except KeyError as exc:
            raise RuntimeAPIError(
                404, "SESSION_NOT_FOUND", "The lab session no longer exists."
            ) from exc
        if (
            request.session_context_version is not None
            and request.session_context_version != session.state_version
        ):
            raise RuntimeAPIError(
                409, "STALE_STATE", "The workspace changed; refresh it before submitting again."
            )
        user_turns = sum(turn.actor == "USER" for turn in session.conversation_turns)
        if user_turns >= MAX_TURNS:
            raise RuntimeAPIError(
                429, "TURN_LIMIT_REACHED", "This lab session reached its configured turn limit."
            )
        if session.runtime_mode is RuntimeMode.FIXTURE:
            raise RuntimeAPIError(
                409,
                "VALIDATION_FAILED",
                "Fixture mode advances through deterministic scenario controls, not free text.",
            )
        if self.interpreter is None:
            raise RuntimeAPIError(
                503,
                "INTERPRETER_UNAVAILABLE",
                "The live linguistic interpreter is not configured.",
                retryable=False,
            )

        context = [turn.model_dump(mode="json") for turn in session.conversation_turns[-10:]]
        try:
            candidate = self.interpreter.interpret(message=request.message, context=context)
        except InterpretationError as exc:
            provider = self.interpreter.provider
            LOGGER.warning(
                "interpreter_failure",
                extra={
                    "event": "interpreter_failure",
                    "failure_category": exc.category.value,
                    "provider": type(provider).__name__,
                    "model": getattr(provider, "model", None),
                    "http_status": exc.http_status,
                    "provider_error_code": exc.provider_error_code,
                    "validation_locations": exc.validation_locations,
                    "session_id": session_id,
                    "turn_id": request.client_turn_id,
                    "retryable": exc.retryable,
                    "timestamp": datetime.now(UTC).isoformat(),
                },
            )
            if exc.is_provider_failure:
                raise RuntimeAPIError(
                    503,
                    "INTERPRETER_PROVIDER_UNAVAILABLE",
                    "The live linguistic interpreter is temporarily unavailable.",
                    retryable=exc.retryable,
                ) from exc
            raise RuntimeAPIError(
                422,
                "INTERPRETATION_FAILED",
                "The turn could not be safely structured. Please restate it.",
                retryable=True,
            ) from exc

        state = session.problem_state.model_copy(deep=True)
        now = datetime.now(UTC)
        if not state.declared_problem:
            state.declared_problem = candidate.declared_problem_candidate or request.message
        state.user_goal = candidate.user_goal_candidate or state.user_goal
        state.decision_required = candidate.decision_candidate or state.decision_required
        state.decision_horizon = candidate.horizon_candidate or state.decision_horizon
        if candidate.scope_candidate and candidate.scope_candidate not in state.domain_scope:
            state.domain_scope.append(candidate.scope_candidate)
        for item in candidate.claim_candidates:
            state.claims.append(
                ClaimRecord(
                    id=str(uuid4()), proposition=item.text, source=item.source, timestamp=now
                )
            )
        for item in candidate.explicit_assumption_candidates:
            state.assumptions.append(
                AssumptionRecord(
                    id=str(uuid4()),
                    proposition=item.text,
                    reason="Explicit user scenario instruction",
                    materiality=Materiality.HIGH,
                    validation_required=True,
                    source="USER_EXPLICIT",
                    scenario_only=True,
                )
            )
        for item in candidate.embedded_hypothesis_candidates:
            state.hypotheses.append(
                HypothesisRecord(id=str(uuid4()), proposition=item.text, source=item.source)
            )
        for item in candidate.candidate_unknowns:
            try:
                materiality = Materiality(item.materiality)
            except ValueError:
                materiality = Materiality.HIGH
            state.unknowns.append(
                UnknownRecord(
                    id=str(uuid4()),
                    variable=item.variable,
                    why_needed=item.why_needed,
                    materiality=materiality,
                    resolvable=True,
                    blocks_routing=True,
                )
            )

        ambiguity = candidate.definition_ambiguities or candidate.unresolved_reference_candidates
        forbidden = any(
            term in (candidate.repair_candidate or "").lower()
            for term in ("psycholog", "deception", "mental state", "hidden motive")
        )
        question = candidate.repair_candidate
        if ambiguity and not question:
            question = f"What do you mean by {ambiguity[0]}?"
        if forbidden:
            question = "What observable evidence about the reported information should we examine?"
        # Executable one-question rule: one scalar is selected and one assistant turn is emitted.
        if question:
            question = question.strip().split("\n", 1)[0]
            state.next_best_question = question
            state.lifecycle_state = StateTransition.REPAIR
            state.routing_ready = False
        else:
            state.next_best_question = None
            state.lifecycle_state = StateTransition.CONTEXTUALISING
            state.routing_ready = False

        user_view = ConversationTurnView(
            turn_id=request.client_turn_id,
            actor="USER",
            text=request.message,
            timestamp=now,
            action_type=candidate.conversational_action.value,
        )
        session.conversation_turns.append(user_view)
        if question:
            session.conversation_turns.append(
                ConversationTurnView(
                    turn_id=str(uuid4()),
                    actor="ENTIMEMA",
                    text=question,
                    timestamp=now,
                    action_type="CLARIFICATION",
                )
            )
        projection = project_state(state, question=question, forbidden=forbidden)
        session.problem_state, session.current_projection = state, projection
        session.state_version += 1
        session.updated_at = now
        LOGGER.info(
            "live_turn",
            extra={
                "session_id": session_id,
                "turn_id": request.client_turn_id,
                "interpreter_status": "OK",
                "schema_validation_status": "VALID",
                "runtime_action": "CLARIFY" if question else "UPDATE",
                "epistemic_verdict": projection["epistemic_verdict"],
            },
        )
        return LiveMessageResponse(
            session_id=session_id,
            accepted_turn_id=request.client_turn_id,
            assistant_message=question,
            next_best_question=question,
            dialogue_state=state.lifecycle_state.value,
            problem_state_version=session.state_version,
            workspace_projection=projection,
            conversation=session.conversation_turns,
            runtime_actions=["STATE_UPDATED", "CLARIFICATION_REQUIRED"]
            if question
            else ["STATE_UPDATED", "PRE_ROUTING_VETO"],
            epistemic_verdict=projection["epistemic_verdict"],
            decision_readiness=projection["decision_readiness"],
            execution_summary={
                "agents_executed": [],
                "stopped": True,
                "reason": "CLARIFICATION_REQUIRED" if question else "INSUFFICIENT_EVIDENCE",
            },
            errors=[
                RuntimeErrorView(
                    code="INSUFFICIENT_EVIDENCE", message="Analysis has not been admitted."
                )
            ]
            if not question
            else [],
        )
