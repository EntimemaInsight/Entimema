"""Thin live adapter: interpretation in, typed canonical command out."""

import json
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
from domain.unknowns import UnknownRecord
from live.canonical_runtime import CanonicalConciergeRuntime
from live.commands import ApplyInterpretedTurn
from live.interpreter import ConversationalAction, InterpretationError, LinguisticInterpreter
from live.session import ConversationTurnView, RuntimeMode, SessionStore
from problem_formation.candidate_problems import CandidateOperationalProblem
from problem_formation.problem_objects import ProblemObject

LOGGER = logging.getLogger("entimema.live")
MAX_TURNS = int(os.getenv("ENTIMEMA_MAX_TURNS", "40"))


class LiveSessionController:
    def __init__(
        self,
        store: SessionStore,
        interpreter: LinguisticInterpreter | None,
        runtime: CanonicalConciergeRuntime | None = None,
    ) -> None:
        self.store, self.interpreter = store, interpreter
        self.runtime = runtime or CanonicalConciergeRuntime()

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
        if sum(turn.actor == "USER" for turn in session.conversation_turns) >= MAX_TURNS:
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
                503, "INTERPRETER_UNAVAILABLE", "The live linguistic interpreter is not configured."
            )
        try:
            candidate = self.interpreter.interpret(
                message=request.message,
                context=[turn.model_dump(mode="json") for turn in session.conversation_turns[-10:]],
            )
        except InterpretationError as exc:
            provider = self.interpreter.provider
            telemetry = {
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
            }
            LOGGER.warning(json.dumps(telemetry, separators=(",", ":")), extra=telemetry)
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

        now = datetime.now(UTC)
        declared = (
            session.problem_state.declared_problem
            or candidate.declared_problem_candidate
            or request.message
        )
        claims = [
            ClaimRecord(id=str(uuid4()), proposition=x.text, source=x.source, timestamp=now)
            for x in candidate.claim_candidates
        ]
        assumptions = [
            AssumptionRecord(
                id=str(uuid4()),
                proposition=x.text,
                reason="Explicit user scenario instruction",
                materiality=Materiality.HIGH,
                validation_required=True,
                source="USER_EXPLICIT",
                scenario_only=True,
            )
            for x in candidate.explicit_assumption_candidates
        ]
        hypotheses = [
            HypothesisRecord(id=str(uuid4()), proposition=x.text, source=x.source)
            for x in candidate.embedded_hypothesis_candidates
        ]
        unknowns = [
            UnknownRecord(
                id=str(uuid4()),
                variable=x.variable,
                why_needed=x.why_needed,
                materiality=x.materiality,
                resolvable=True,
                blocks_routing=True,
            )
            for x in candidate.candidate_unknowns
        ]
        object_candidate = (
            ProblemObject(
                object_type=candidate.problem_object_type_candidate, source="INTERPRETER_CANDIDATE"
            )
            if candidate.problem_object_type_candidate
            else None
        )
        operational = []
        if (
            candidate.operational_problem_candidate
            and object_candidate
            and candidate.goal_type_candidate
        ):
            operational.append(
                CandidateOperationalProblem(
                    id=str(uuid4()),
                    formulation=candidate.operational_problem_candidate,
                    object=object_candidate,
                    goal=candidate.goal_type_candidate,
                    decision=candidate.decision_candidate,
                    horizon=candidate.horizon_candidate,
                    scope=candidate.scope_candidate,
                    unresolved_unknown_ids=[x.id for x in unknowns],
                    source=(
                        "USER_CONFIRMED"
                        if candidate.conversational_action is ConversationalAction.COMMITMENT
                        else "INTERPRETER_CANDIDATE"
                    ),
                )
            )
        command = ApplyInterpretedTurn(
            command_id=request.client_turn_id,
            expected_version=session.state_version,
            declared_problem=declared,
            candidate_object=object_candidate,
            candidate_goal=candidate.goal_type_candidate,
            decision=candidate.decision_candidate,
            horizon=candidate.horizon_candidate,
            scope=candidate.scope_candidate,
            claims=claims,
            assumptions=assumptions,
            hypotheses=hypotheses,
            unknowns=unknowns,
            operational_candidates=operational,
            unresolved_references=candidate.unresolved_reference_candidates
            + candidate.definition_ambiguities,
            requested_capabilities=candidate.requested_capabilities,
        )
        result = self.runtime.apply(session.problem_state, command)
        session.conversation_turns.append(
            ConversationTurnView(
                turn_id=request.client_turn_id,
                actor="USER",
                text=request.message,
                timestamp=now,
                action_type=candidate.conversational_action.value,
            )
        )
        if result.question:
            session.conversation_turns.append(
                ConversationTurnView(
                    turn_id=str(uuid4()),
                    actor="ENTIMEMA",
                    text=result.question,
                    timestamp=now,
                    action_type="CLARIFICATION",
                )
            )
        session.problem_state, session.current_projection = result.state, result.projection
        session.state_version += 1
        session.updated_at = now
        self.store.save(session)
        executed = (
            [x.agent_id for x in result.analysis.orchestration_plan.agent_assignments]
            if result.analysis
            else []
        )
        return LiveMessageResponse(
            session_id=session_id,
            accepted_turn_id=request.client_turn_id,
            assistant_message=result.question,
            next_best_question=result.question,
            dialogue_state=result.state.workspace_phase.value,
            problem_state_version=session.state_version,
            workspace_projection=result.projection,
            conversation=session.conversation_turns,
            runtime_actions=["CANONICAL_STATE_UPDATED"]
            + (["ANALYSIS_ORCHESTRATED"] if result.analysis else ["MODULE_B_EVALUATED"]),
            epistemic_verdict=result.state.epistemic_verdict.value,
            decision_readiness=result.state.decision_readiness.value,
            execution_summary={
                "agents_executed": executed,
                "stopped": not bool(result.analysis),
                "reason": None if result.analysis else "CANONICAL_READINESS_GUARD",
            },
            errors=[]
            if result.question or result.analysis
            else [
                RuntimeErrorView(
                    code="INSUFFICIENT_EVIDENCE", message="Analysis has not been admitted."
                )
            ],
        )
