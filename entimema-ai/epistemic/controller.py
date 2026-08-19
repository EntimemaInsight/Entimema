from datetime import UTC, datetime
from uuid import uuid4

from pydantic import BaseModel, ConfigDict

from concierge.repair import RepairStatus
from concierge.routing_gate import evaluate_routing_readiness
from core.exceptions import ForbiddenInferenceError
from core.guardrails import validate_candidate_inference
from domain.agents import AgentResult, AgentResultStatus, AgentTask
from domain.contradictions import ContradictionType
from domain.enums import EpistemicVerdict, Materiality
from domain.problem_state import ProblemState
from epistemic.assumptions import AssumptionAssessment, assess_assumption
from epistemic.contradictions import ContradictionAssessment, assess_contradiction
from epistemic.inference_validation import (
    InferenceAssessment,
    InferenceRecord,
    assess_hypothesis,
    assess_inference,
)
from epistemic.provenance import assess_provenance
from epistemic.requests import (
    EpistemicValidationRequest,
    SynthesisContract,
    ValidationStage,
)
from epistemic.traceability import (
    TraceabilityAssessment,
    TraceabilityGraph,
    validate_traceability,
)
from epistemic.verdicts import (
    EpistemicAuditRecord,
    EpistemicValidationResult,
    RequiredNextAction,
    TraceabilityStatus,
)


class DeferredValidationResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    stage: ValidationStage
    implemented: bool = False
    object_id: str
    reason: str


class EpistemicController:
    """Module B: deterministic veto and admissibility controller."""

    def validate(
        self, request: EpistemicValidationRequest
    ) -> EpistemicValidationResult | DeferredValidationResult:
        if request.validation_stage is ValidationStage.PRE_ROUTING:
            return self.validate_pre_routing(request.problem_state, request.candidate_inferences)
        if request.validation_stage is ValidationStage.POST_AGENT:
            if request.agent_result is None:
                raise ValueError("POST_AGENT requires an AgentResultContract")
            if request.agent_result.agent_result is None or request.agent_result.agent_task is None:
                raise ValueError("POST_AGENT requires a typed agent result and task")
            return self.validate_agent_result(
                request.agent_result.agent_result,
                request.problem_state,
                request.agent_result.agent_task,
                request.agent_result.calculations,
            )
        if request.synthesis is None:
            raise ValueError(f"{request.validation_stage} requires a SynthesisContract")
        return self.validate_synthesis(request.synthesis, request.validation_stage)

    def validate_pre_routing(
        self,
        problem_state: ProblemState,
        candidate_inferences: list[InferenceRecord] | None = None,
    ) -> EpistemicValidationResult:
        state = ProblemState.model_validate(problem_state.model_dump())
        inferences = candidate_inferences or []
        inference_results = [self.validate_inference(item, state) for item in inferences]
        assumptions = self.validate_assumptions(state)
        contradictions = self.validate_contradictions(state)
        provenance = [assess_provenance(item) for item in state.evidence]
        hypotheses = [assess_hypothesis(item) for item in state.hypotheses]
        forbidden_ids = [
            item.inference_id for item in inference_results if item.forbidden_inference
        ] + [item.id for item in state.hypotheses if item.forbidden_inference]
        leakage_ids = [
            item.inference_id
            for item in inference_results
            if any(reason.startswith("ASSUMPTION_LEAKAGE") for reason in item.blocking_reasons)
        ]
        trace_failures = [
            item.inference_id
            for item in inference_results
            if not item.traceable and item.inference_id not in leakage_ids
        ]
        out_of_scope_ids = [
            item.inference_id
            for item in inference_results
            if not item.scope_match or not item.methodology_applicable
        ]
        open_repairs = [
            item.id for item in state.repairs if item.material and item.status is RepairStatus.OPEN
        ]
        critical_unknowns = [
            item.id
            for item in state.unknowns
            if item.materiality is Materiality.CRITICAL
            or (item.materiality is Materiality.HIGH and item.blocks_routing is not False)
        ]
        true_contradictions = [
            item.contradiction_id
            for item in contradictions
            if item.blocking and item.likely_type is ContradictionType.TRUE_LOGICAL_CONTRADICTION
        ]
        other_contradictions = [
            item.contradiction_id
            for item in contradictions
            if item.blocking and item.contradiction_id not in true_contradictions
        ]
        provenance_failures = [item.evidence_id for item in provenance if not item.complete]
        inadmissible_hypotheses = [item.hypothesis_id for item in hypotheses if not item.admissible]
        invalid_assumptions = [item.assumption_id for item in assumptions if item.blocking]
        conditional_assumptions = [
            item.assumption_id
            for item in assumptions
            if item.admissible and item.sensitivity_required
        ]
        routing = evaluate_routing_readiness(state)

        reasons = []
        reasons.extend(f"FORBIDDEN_INFERENCE:{item}" for item in forbidden_ids)
        reasons.extend(f"TRACEABILITY_FAILURE:{item}" for item in trace_failures)
        reasons.extend(f"MATERIAL_CONTRADICTION:{item}" for item in true_contradictions)
        reasons.extend(f"ASSUMPTION_LEAKAGE:{item}" for item in leakage_ids)
        reasons.extend(f"CRITICAL_UNKNOWN:{item}" for item in critical_unknowns)
        reasons.extend(f"PROVENANCE_FAILURE:{item}" for item in provenance_failures)
        reasons.extend(f"OUT_OF_SCOPE:{item}" for item in out_of_scope_ids)
        reasons.extend(f"OPEN_REPAIR:{item}" for item in open_repairs)
        reasons.extend(f"UNRESOLVED_CONTRADICTION:{item}" for item in other_contradictions)
        reasons.extend(f"INADMISSIBLE_HYPOTHESIS:{item}" for item in inadmissible_hypotheses)
        reasons.extend(f"INVALID_ASSUMPTION:{item}" for item in invalid_assumptions)
        if not state.operational_problem:
            reasons.append("OPERATIONAL_PROBLEM_MISSING")
        if not state.decision_required:
            reasons.append("TARGET_DECISION_MISSING")

        verdict, action = self._verdict(
            forbidden_ids=forbidden_ids,
            trace_failures=trace_failures,
            leakage_ids=leakage_ids,
            true_contradictions=true_contradictions,
            other_contradictions=other_contradictions,
            open_repairs=open_repairs,
            critical_unknowns=critical_unknowns,
            provenance_failures=provenance_failures,
            inadmissible_hypotheses=inadmissible_hypotheses,
            invalid_assumptions=invalid_assumptions,
            out_of_scope_ids=out_of_scope_ids,
            conditional_assumptions=conditional_assumptions,
            base_ready=routing.ready,
            operational=bool(state.operational_problem and state.decision_required),
        )
        unresolved = sorted(
            set(
                critical_unknowns
                + open_repairs
                + other_contradictions
                + provenance_failures
                + inadmissible_hypotheses
            )
        )
        rejected = sorted(
            set(
                forbidden_ids
                + trace_failures
                + leakage_ids
                + true_contradictions
                + out_of_scope_ids
            )
        )
        validated = [item.inference_id for item in inference_results if item.admissible]
        if verdict in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID}:
            validated.append(state.problem_id)
        audit = self._audits(state.problem_id, verdict, reasons, validated + rejected + unresolved)
        trace_status = (
            TraceabilityStatus.NOT_APPLICABLE
            if not inferences
            else TraceabilityStatus.COMPLETE
            if not trace_failures and not leakage_ids
            else TraceabilityStatus.INCOMPLETE
        )
        return EpistemicValidationResult(
            verdict=verdict,
            validated_object_ids=sorted(set(validated)),
            rejected_object_ids=rejected,
            unresolved_object_ids=unresolved,
            critical_assumption_ids=conditional_assumptions + invalid_assumptions,
            contradiction_ids=true_contradictions + other_contradictions,
            forbidden_inference_ids=forbidden_ids,
            traceability_status=trace_status,
            blocking_reasons=reasons,
            required_next_action=action,
            audit_records=audit,
        )

    @staticmethod
    def _verdict(**values) -> tuple[EpistemicVerdict, RequiredNextAction]:
        if values["forbidden_ids"]:
            return (
                EpistemicVerdict.FORBIDDEN_INFERENCE,
                RequiredNextAction.REMOVE_FORBIDDEN_INFERENCE,
            )
        if values["trace_failures"]:
            return EpistemicVerdict.TRACEABILITY_FAILURE, RequiredNextAction.REQUEST_EVIDENCE
        if values["true_contradictions"]:
            return EpistemicVerdict.CONTRADICTED, RequiredNextAction.RESOLVE_CONTRADICTION
        if values["leakage_ids"]:
            return EpistemicVerdict.TRACEABILITY_FAILURE, RequiredNextAction.REQUEST_EVIDENCE
        if values["open_repairs"]:
            return EpistemicVerdict.INSUFFICIENT_EVIDENCE, RequiredNextAction.REPAIR
        if values["other_contradictions"]:
            return EpistemicVerdict.INSUFFICIENT_EVIDENCE, RequiredNextAction.RESOLVE_CONTRADICTION
        if (
            any(
                values[name]
                for name in (
                    "critical_unknowns",
                    "provenance_failures",
                    "inadmissible_hypotheses",
                    "invalid_assumptions",
                )
            )
            or not values["operational"]
        ):
            return EpistemicVerdict.INSUFFICIENT_EVIDENCE, RequiredNextAction.REQUEST_EVIDENCE
        if values["out_of_scope_ids"]:
            return EpistemicVerdict.OUT_OF_SCOPE, RequiredNextAction.REVALIDATE_MODEL
        if values["conditional_assumptions"] and values["base_ready"]:
            return EpistemicVerdict.CONDITIONALLY_VALID, RequiredNextAction.PROCEED
        if values["base_ready"]:
            return EpistemicVerdict.VALIDATED, RequiredNextAction.PROCEED
        return EpistemicVerdict.INSUFFICIENT_EVIDENCE, RequiredNextAction.STOP_INSUFFICIENT

    @staticmethod
    def _audits(
        problem_id: str,
        verdict: EpistemicVerdict,
        reasons: list[str],
        object_ids: list[str],
    ) -> list[EpistemicAuditRecord]:
        ids = object_ids or [problem_id]
        return [
            EpistemicAuditRecord(
                audit_id=f"audit-{uuid4()}",
                object_id=object_id,
                validation_type="PRE_ROUTING",
                new_status=verdict.value,
                rule_id=(reasons[index] if index < len(reasons) else "EC-PRE-ROUTING"),
                basis_ids=[],
                timestamp=datetime.now(UTC),
            )
            for index, object_id in enumerate(ids)
        ]

    @staticmethod
    def validate_inference(inference: InferenceRecord, state: ProblemState) -> InferenceAssessment:
        return assess_inference(inference, state)

    @staticmethod
    def validate_traceability(root_object: str, graph: TraceabilityGraph) -> TraceabilityAssessment:
        return validate_traceability(root_object, graph)

    @staticmethod
    def validate_assumptions(state: ProblemState) -> list[AssumptionAssessment]:
        return [assess_assumption(item) for item in state.assumptions]

    @staticmethod
    def validate_contradictions(state: ProblemState) -> list[ContradictionAssessment]:
        return [assess_contradiction(item) for item in state.contradictions]

    @staticmethod
    def validate_forbidden_inference(inference: InferenceRecord, state: ProblemState) -> bool:
        return assess_inference(inference, state).forbidden_inference

    @staticmethod
    def validate_agent_result(
        agent_result: AgentResult,
        state: ProblemState,
        task: AgentTask,
        calculations: list[object] | None = None,
    ) -> EpistemicValidationResult:
        evidence_ids = {item.id for item in state.evidence}
        assumption_ids = {item.id for item in state.assumptions}
        calculation_by_id = {item.id: item for item in calculations or []}
        rejected = []
        conditional = []
        reasons = []
        if agent_result.task_id != task.task_id or agent_result.agent_id != task.agent_id:
            reasons.append(f"OUT_OF_SCOPE:{agent_result.task_id}")
        if set(agent_result.assumptions_used) - assumption_ids:
            reasons.append(f"TRACEABILITY_FAILURE:{agent_result.task_id}:ASSUMPTION")
        unresolved_contradictions = {item.id for item in state.contradictions} - set(
            agent_result.contradictions_found
        )
        if unresolved_contradictions:
            conditional.extend(sorted(unresolved_contradictions))
            reasons.extend(
                f"UNRESOLVED_CONTRADICTION:{item}" for item in sorted(unresolved_contradictions)
            )
        for conclusion in agent_result.conclusion_records:
            missing_evidence = set(conclusion.evidence_ids) - evidence_ids
            missing_assumptions = set(conclusion.assumption_ids) - assumption_ids
            missing_calculations = set(conclusion.calculation_ids) - set(calculation_by_id)
            if missing_evidence or missing_assumptions or missing_calculations:
                rejected.append(conclusion.id)
                reasons.append(f"TRACEABILITY_FAILURE:{conclusion.id}")
                continue
            try:
                validate_candidate_inference(conclusion.trigger, conclusion.proposition)
            except ForbiddenInferenceError:
                rejected.append(conclusion.id)
                reasons.append(f"FORBIDDEN_INFERENCE:{conclusion.id}")
                continue
            proposition = conclusion.proposition.casefold()
            if agent_result.agent_id.startswith("FIN_") and (
                "probability of default" in proposition or " pd " in f" {proposition} "
            ):
                rejected.append(conclusion.id)
                reasons.append(f"OUT_OF_SCOPE:{conclusion.id}")
            elif agent_result.agent_id.startswith("ENG_") and (
                "profitability recommendation" in proposition or "increase margin" in proposition
            ):
                rejected.append(conclusion.id)
                reasons.append(f"OUT_OF_SCOPE:{conclusion.id}")
            elif conclusion.assumption_ids or conclusion.uncertainty != "low":
                conditional.append(conclusion.id)
        for calculation in calculations or []:
            if set(calculation.input_ids) - evidence_ids:
                reasons.append(f"TRACEABILITY_FAILURE:{calculation.id}")
        validated = [
            item.id
            for item in agent_result.conclusion_records
            if item.id not in rejected and item.id not in conditional
        ]
        if any(item.startswith("FORBIDDEN_INFERENCE") for item in reasons):
            verdict = EpistemicVerdict.FORBIDDEN_INFERENCE
            action = RequiredNextAction.REMOVE_FORBIDDEN_INFERENCE
        elif any(item.startswith("TRACEABILITY_FAILURE") for item in reasons):
            verdict = EpistemicVerdict.TRACEABILITY_FAILURE
            action = RequiredNextAction.RECALCULATE
        elif any(item.startswith("OUT_OF_SCOPE") for item in reasons):
            verdict = EpistemicVerdict.OUT_OF_SCOPE
            action = RequiredNextAction.REVALIDATE_MODEL
        elif agent_result.status in {
            AgentResultStatus.INSUFFICIENT_INPUT,
            AgentResultStatus.FAILED_VALIDATION,
        }:
            verdict = EpistemicVerdict.INSUFFICIENT_EVIDENCE
            action = RequiredNextAction.REQUEST_EVIDENCE
        elif conditional or agent_result.status is AgentResultStatus.CONDITIONAL:
            verdict = EpistemicVerdict.CONDITIONALLY_VALID
            action = RequiredNextAction.PROCEED
        else:
            verdict = EpistemicVerdict.VALIDATED
            action = RequiredNextAction.PROCEED
        return EpistemicValidationResult(
            verdict=verdict,
            validated_object_ids=validated,
            rejected_object_ids=sorted(set(rejected)),
            unresolved_object_ids=sorted(set(conditional)),
            traceability_status=(
                TraceabilityStatus.INCOMPLETE
                if any(item.startswith("TRACEABILITY_FAILURE") for item in reasons)
                else TraceabilityStatus.COMPLETE
            ),
            blocking_reasons=reasons,
            required_next_action=action,
            audit_records=EpistemicController._audits(
                state.problem_id,
                verdict,
                reasons,
                [item.id for item in agent_result.conclusion_records],
            ),
        )

    @staticmethod
    def validate_synthesis(
        synthesis: SynthesisContract, stage: ValidationStage = ValidationStage.PRE_SYNTHESIS
    ) -> DeferredValidationResult:
        return DeferredValidationResult(
            stage=stage,
            object_id=synthesis.id,
            reason="Typed hook only; synthesis execution and validation are deferred",
        )
