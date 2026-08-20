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
from live.session import (
    ConversationTurnView,
    PersistenceBundle,
    RuntimeMode,
    SessionStore,
    StaleCaseVersionError,
)
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
        previous = self.store.command_result(session_id, request.client_turn_id)
        if previous is not None:
            return LiveMessageResponse.model_validate(previous)
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
        previous_readiness = session.problem_state.decision_readiness.value
        previous_blockers = list(session.problem_state.blockers)
        session.problem_state, session.current_projection = result.state, result.projection
        session.state_version += 1
        session.updated_at = now
        executed = (
            [x.agent_id for x in result.analysis.orchestration_plan.agent_assignments]
            if result.analysis
            else []
        )
        response = LiveMessageResponse(
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
        version = session.state_version
        audit_id = str(uuid4())
        events = [
            {
                "event_id": str(uuid4()),
                "case_id": session_id,
                "event_type": "CaseStateAdvanced",
                "case_version": version,
                "occurred_at": now.isoformat(),
                "command_id": command.command_id,
                "actor": "USER",
                "source": "CONCIERGE_API",
                "correlation_id": request.client_turn_id,
                "causation_id": command.command_id,
                "payload": {"previous_version": version - 1},
                "schema_version": 1,
            }
        ]
        if previous_readiness != result.state.decision_readiness.value:
            events.append(
                {
                    "event_id": str(uuid4()),
                    "case_id": session_id,
                    "event_type": "DecisionReadinessChanged",
                    "case_version": version,
                    "occurred_at": now.isoformat(),
                    "command_id": command.command_id,
                    "actor": "MODULE_B",
                    "source": "CANONICAL_RUNTIME",
                    "correlation_id": request.client_turn_id,
                    "causation_id": audit_id,
                    "payload": {
                        "previous": previous_readiness,
                        "new": result.state.decision_readiness.value,
                        "blockers_added": sorted(
                            set(result.state.blockers) - set(previous_blockers)
                        ),
                        "blockers_cleared": sorted(
                            set(previous_blockers) - set(result.state.blockers)
                        ),
                    },
                    "schema_version": 1,
                }
            )
        clarification = None
        if result.question:
            target_ids = [item.id for item in result.state.unknowns if item.blocks_routing]
            clarification = {
                "clarification_id": str(uuid4()),
                "case_id": session_id,
                "state_version": version,
                "source_record_ids": target_ids,
                "question": result.question,
                "status": "OPEN",
                "user_answer_reference": None,
                "resolution_state": "BLOCKING",
                "created_at": now.isoformat(),
                "updated_at": now.isoformat(),
                "schema_version": 1,
            }
            events.append(
                {
                    "event_id": str(uuid4()),
                    "case_id": session_id,
                    "event_type": "ClarificationRequested",
                    "case_version": version,
                    "occurred_at": now.isoformat(),
                    "command_id": command.command_id,
                    "actor": "MODULE_B",
                    "source": "CANONICAL_RUNTIME",
                    "correlation_id": request.client_turn_id,
                    "causation_id": audit_id,
                    "payload": {
                        "clarification_id": clarification["clarification_id"],
                        "source_record_ids": target_ids,
                    },
                    "schema_version": 1,
                }
            )
        analysis_run = None
        if result.analysis:
            analysis_run = {
                "analysis_run_id": str(uuid4()),
                "case_id": session_id,
                "input_state_version": version,
                "requested_capabilities": command.requested_capabilities,
                "orchestrator_decision": "ADMITTED",
                "capabilities_invoked": executed,
                "execution_status": "COMPLETED",
                "provenance": {"command_id": command.command_id},
                "reconciliation_result": (
                    result.analysis.final_synthesis_result.reconciliation_result.model_dump(
                        mode="json"
                    )
                ),
                "synthesis_result": result.analysis.final_synthesis_result.model_dump(mode="json"),
                "final_admissibility_result": result.state.decision_readiness.value,
                "started_at": now.isoformat(),
                "ended_at": datetime.now(UTC).isoformat(),
                "schema_version": 1,
            }
        bundle = PersistenceBundle(
            command_id=command.command_id,
            expected_version=command.expected_version,
            actor_id=session.owner_id,
            correlation_id=request.client_turn_id,
            command_payload=command.model_dump(mode="json"),
            response=response.model_dump(mode="json"),
            events=events,
            audit={
                "audit_id": audit_id,
                "case_id": session_id,
                "state_version_audited": version,
                "timestamp": now.isoformat(),
                "decision": result.state.epistemic_verdict.value,
                "blockers": result.state.blockers,
                "contradiction_ids": [item.id for item in result.state.contradictions],
                "evidence_chain_violations": [],
                "critical_unknown_ids": [
                    item.id for item in result.state.unknowns if item.blocks_routing
                ],
                "readiness": result.state.decision_readiness.value,
                "record_references": [item.id for item in result.state.claims],
                "schema_version": 1,
            },
            clarification=clarification,
            analysis_run=analysis_run,
        )
        try:
            self.store.save(session, expected_version=command.expected_version, bundle=bundle)
        except StaleCaseVersionError as exc:
            raise RuntimeAPIError(
                409, "STALE_STATE", "The workspace changed; refresh it before submitting again."
            ) from exc
        return response
