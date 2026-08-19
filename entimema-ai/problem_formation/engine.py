"""Deterministic Sprint 3 problem formation inside the shared ProblemState."""

from datetime import UTC, datetime
from enum import StrEnum
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, model_validator

from concierge.repair import RepairStatus
from concierge.routing_gate import ProblemFormationReadiness, evaluate_routing_readiness
from concierge.state_updates import revalidate_problem_state
from core.exceptions import EpistemicValidationError, TraceabilityError
from domain.claims import ClaimRecord
from domain.contradictions import ContradictionStatus
from domain.enums import Materiality
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord, HypothesisStatus
from domain.problem_state import ProblemState
from domain.transitions import StateTransition, TransitionRecord
from domain.unknowns import UnknownRecord
from problem_formation.candidate_problems import (
    CandidateOperationalProblem,
    CandidateProblemScore,
    rank_candidates,
)
from problem_formation.evidence_binding import EvidenceLink
from problem_formation.goal_extraction import preserve_explicit_goal
from problem_formation.hypothesis_space import (
    EvidenceHypothesisImpact,
    HypothesisEligibility,
    evaluate_hypothesis,
)
from problem_formation.problem_objects import (
    ConstraintRecord,
    ConstraintType,
    GoalType,
    GranularityAssessment,
    InterpretationRecord,
    ProblemCompleteness,
    ProblemGranularity,
    ProblemLifecycle,
    ProblemObject,
    ProblemObjectType,
    SourceCategoryMetadata,
    SpeechActRecord,
)
from problem_formation.readiness import OperationalProblemReadiness, evaluate_operational_readiness
from problem_formation.reframing import ReframingRecord, ReframingStatus
from problem_formation.unknown_materiality import UnknownMaterialityAssessment, prioritise_unknowns


class FormationReasonCode(StrEnum):
    MATERIAL_REPAIR_OPEN = "MATERIAL_REPAIR_OPEN"
    INDEXICAL_REFERENCE_UNRESOLVED = "INDEXICAL_REFERENCE_UNRESOLVED"
    FORBIDDEN_HYPOTHESIS = "FORBIDDEN_HYPOTHESIS"
    NO_ADMISSIBLE_CANDIDATE = "NO_ADMISSIBLE_CANDIDATE"
    USER_CONFIRMATION_REQUIRED = "USER_CONFIRMATION_REQUIRED"
    CRITICAL_UNKNOWN_OPEN = "CRITICAL_UNKNOWN_OPEN"
    MATERIAL_CONTRADICTION_OPEN = "MATERIAL_CONTRADICTION_OPEN"
    HYPOTHESIS_SPACE_UNBOUNDED = "HYPOTHESIS_SPACE_UNBOUNDED"
    OPERATIONAL_PROBLEM_READY = "OPERATIONAL_PROBLEM_READY"


class ProblemFormationInput(BaseModel):
    """Typed deterministic inputs; this layer performs no LLM extraction."""

    model_config = ConfigDict(extra="forbid")
    problem_id: str = Field(min_length=1)
    declared_problem: str = Field(min_length=1)
    candidate_object: ProblemObject | None = None
    candidate_goal: GoalType | None = None
    candidate_decision: str | None = None
    candidate_horizon: str | None = None
    candidate_scope: str | None = None
    supplied_claim_ids: list[str] = Field(default_factory=list)
    supplied_evidence_ids: list[str] = Field(default_factory=list)
    supplied_unknowns: list[UnknownRecord] = Field(default_factory=list)
    supplied_hypotheses: list[HypothesisRecord] = Field(default_factory=list)
    embedded_hypotheses: list[HypothesisRecord] = Field(default_factory=list)
    supplied_constraints: list[ConstraintRecord] = Field(default_factory=list)
    candidate_operational_problems: list[CandidateOperationalProblem] = Field(default_factory=list)
    source_category_metadata: list[SourceCategoryMetadata] | None = None
    # Optional deterministic records and relations needed to bind supplied IDs.
    supplied_claims: list[ClaimRecord] = Field(default_factory=list)
    supplied_evidence: list[EvidenceRecord] = Field(default_factory=list)
    evidence_links: list[EvidenceLink] = Field(default_factory=list)
    evidence_hypothesis_impacts: list[EvidenceHypothesisImpact] = Field(default_factory=list)
    problem_granularity: ProblemGranularity = ProblemGranularity.UNKNOWN
    evidence_granularity: ProblemGranularity = ProblemGranularity.UNKNOWN
    unresolved_reference_candidates: list[str] = Field(default_factory=list)
    reframing_records: list[ReframingRecord] = Field(default_factory=list)
    interpretation_history: list[InterpretationRecord] = Field(default_factory=list)
    speech_acts: list[SpeechActRecord] = Field(default_factory=list)

    @model_validator(mode="after")
    def require_unique_records(self) -> "ProblemFormationInput":
        collections = (
            self.supplied_claim_ids,
            self.supplied_evidence_ids,
            [item.id for item in self.supplied_claims],
            [item.id for item in self.supplied_evidence],
            [item.id for item in self.supplied_unknowns],
            [item.id for item in self.supplied_hypotheses + self.embedded_hypotheses],
            [item.id for item in self.candidate_operational_problems],
        )
        if any(len(items) != len(set(items)) for items in collections):
            raise ValueError("formation input record IDs must be unique")
        return self


class OperationalProblem(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    object: ProblemObject
    target_question: str
    goal: GoalType
    target_decision: str
    horizon: str
    scope: str
    material_unknown_ids: list[str]
    hypothesis_ids: list[str]
    contradiction_ids: list[str]
    constraints: list[ConstraintRecord]
    candidate_domains: list[str]


class ProblemFormationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")
    updated_problem_state: ProblemState
    problem_object: ProblemObject
    goal: GoalType
    lifecycle: ProblemLifecycle
    completeness: ProblemCompleteness
    granularity: GranularityAssessment
    active_categories: list[SourceCategoryMetadata]
    evidence_links: list[EvidenceLink]
    evidence_hypothesis_impacts: list[EvidenceHypothesisImpact]
    hypothesis_eligibility: list[HypothesisEligibility]
    unknown_materiality: list[UnknownMaterialityAssessment]
    next_best_unknown_id: str | None
    ranked_candidates: list[CandidateProblemScore]
    selected_candidate_id: str | None
    operational_problem: OperationalProblem | None
    readiness: OperationalProblemReadiness
    routing_ready: bool
    recommended_dialogue_state: StateTransition
    reframing_records: list[ReframingRecord]
    interpretation_history: list[InterpretationRecord]
    speech_acts: list[SpeechActRecord]
    transition: TransitionRecord
    reason_codes: list[FormationReasonCode]


class ProblemFormationEngine:
    """Evaluate formation data without taking ownership of dialogue transitions."""

    def form_problem(
        self, problem_state: ProblemState, formation_input: ProblemFormationInput
    ) -> ProblemFormationResult:
        previous = ProblemState.model_validate(problem_state.model_dump())
        state = ProblemState.model_validate(problem_state.model_dump())
        self._validate_identity(state, formation_input)
        state.declared_problem = formation_input.declared_problem
        self._merge(state.claims, formation_input.supplied_claims, "claim")
        self._merge(state.evidence, formation_input.supplied_evidence, "evidence")
        self._merge(state.unknowns, formation_input.supplied_unknowns, "unknown")
        self._merge(state.hypotheses, formation_input.supplied_hypotheses, "hypothesis")
        embedded_hypotheses = [
            item.model_copy(update={"source": "USER_PROPOSED"})
            for item in formation_input.embedded_hypotheses
        ]
        self._merge(state.hypotheses, embedded_hypotheses, "hypothesis")
        self._validate_references(state, formation_input)

        if formation_input.candidate_goal is not None:
            state.user_goal = preserve_explicit_goal(formation_input.candidate_goal).value
        if formation_input.candidate_decision is not None:
            state.decision_required = formation_input.candidate_decision
        if formation_input.candidate_horizon is not None:
            state.decision_horizon = formation_input.candidate_horizon
        if formation_input.candidate_scope is not None:
            state.domain_scope = [formation_input.candidate_scope]
        for constraint in formation_input.supplied_constraints:
            if constraint.statement not in state.constraints:
                state.constraints.append(constraint.statement)
            if (
                constraint.material
                and constraint.constraint_type in {ConstraintType.ASSUMED, ConstraintType.UNKNOWN}
                and not constraint.basis
            ):
                challenge = UnknownRecord(
                    id=f"constraint-{constraint.id}-basis",
                    variable=f"basis for constraint: {constraint.statement}",
                    why_needed="The constraint materially determines problem formation",
                    materiality=Materiality.HIGH,
                    resolvable=True,
                )
                self._merge(state.unknowns, [challenge], "unknown")
        eligibility = [evaluate_hypothesis(item) for item in state.hypotheses]
        by_id = {item.hypothesis_id: item for item in eligibility}
        for hypothesis in state.hypotheses:
            assessment = by_id[hypothesis.id]
            if not assessment.eligible:
                hypothesis.status = HypothesisStatus.REJECTED
                hypothesis.forbidden_inference = assessment.forbidden_inference

        semantic_ambiguity = len(formation_input.unresolved_reference_candidates) > 1
        ranked = rank_candidates(formation_input.candidate_operational_problems)
        selected = next((candidate for candidate, score in ranked if score.admissible), None)
        if (
            selected is not None
            and selected.formulation != formation_input.declared_problem
            and selected.source.upper() not in {"USER_CONFIRMED", "USER_ORIGINATED"}
        ):
            confirmed = any(
                record.candidate_reframe == selected.formulation
                and record.status is ReframingStatus.CONFIRMED
                for record in formation_input.reframing_records
            )
            if not confirmed:
                selected = selected.model_copy(update={"requires_user_confirmation": True})
        problem_object = (
            formation_input.candidate_object
            or (selected.object if selected else None)
            or ProblemObject(object_type=ProblemObjectType.UNKNOWN, source="UNRESOLVED")
        )
        goal = preserve_explicit_goal(
            formation_input.candidate_goal or (selected.goal if selected else None)
        )
        if selected is not None:
            # Populate only explicit candidate fields; no unstated premise is completed.
            state.user_goal = selected.goal.value
            state.decision_required = selected.decision
            state.decision_horizon = selected.horizon
            state.domain_scope = [selected.scope] if selected.scope else []
        bounded = self._hypothesis_space_bounded(state.hypotheses, eligibility)
        forbidden = any(item.forbidden_inference for item in eligibility)
        readiness = evaluate_operational_readiness(
            state,
            selected,
            hypothesis_space_bounded=bounded,
            forbidden_inference_present=forbidden,
            semantic_ambiguity_present=semantic_ambiguity,
        )

        operational = None
        if readiness.ready and selected is not None:
            operational = OperationalProblem(
                object=selected.object,
                target_question=selected.formulation,
                goal=selected.goal,
                target_decision=selected.decision or "",
                horizon=selected.horizon or "",
                scope=selected.scope or "",
                material_unknown_ids=selected.unresolved_unknown_ids,
                hypothesis_ids=[
                    item.id
                    for item in state.hypotheses
                    if item.status is not HypothesisStatus.REJECTED
                ],
                contradiction_ids=selected.contradiction_ids,
                constraints=formation_input.supplied_constraints,
                candidate_domains=selected.domain_candidates,
            )
            state.operational_problem = operational.target_question
        # A core contradiction reopens the lifecycle without deleting historical formulation.

        state.formation_readiness = ProblemFormationReadiness(
            object_defined=problem_object.object_type is not ProblemObjectType.UNKNOWN,
            goal_defined=goal is not GoalType.UNKNOWN,
            decision_defined=readiness.decision_defined,
            horizon_defined=readiness.horizon_sufficient,
            scope_defined=readiness.scope_sufficient,
        )
        state.routing_ready = readiness.ready
        state = revalidate_problem_state(previous, state, explicit_user_commitment=False)
        routing_ready = readiness.ready and evaluate_routing_readiness(state).ready
        state.routing_ready = routing_ready
        state = ProblemState.model_validate(state.model_dump())

        lifecycle = self._lifecycle(previous, state, readiness, bool(state.hypotheses))
        recommended = self._recommended_state(readiness, state)
        reasons = self._reason_codes(state, readiness, selected, bounded, semantic_ambiguity)
        transition = TransitionRecord(
            transition_id=f"formation-{uuid4()}",
            session_id=state.session_id,
            problem_id=state.problem_id,
            from_state=previous.lifecycle_state,
            to_state=previous.lifecycle_state,
            trigger="problem_formation_evaluation",
            changed_object_type="ProblemState.operational_problem",
            changed_object_id=state.problem_id,
            previous_value=previous.operational_problem,
            new_value=state.operational_problem,
            basis=",".join(code.value for code in reasons),
            timestamp=datetime.now(UTC),
        )
        completeness = ProblemCompleteness(
            object_defined=problem_object.object_type is not ProblemObjectType.UNKNOWN,
            goal_defined=goal is not GoalType.UNKNOWN,
            decision_defined=readiness.decision_defined,
            horizon_defined=readiness.horizon_sufficient,
            scope_defined=readiness.scope_sufficient,
            phenomenon_testable=bool(selected and selected.formulation and bounded),
            critical_repairs_closed=readiness.semantic_clarity,
        )
        unknown_materiality = prioritise_unknowns(state.unknowns)
        return ProblemFormationResult(
            updated_problem_state=state,
            problem_object=problem_object,
            goal=goal,
            lifecycle=lifecycle,
            completeness=completeness,
            granularity=GranularityAssessment(
                problem_granularity=formation_input.problem_granularity,
                evidence_granularity=formation_input.evidence_granularity,
                mismatch=(
                    formation_input.problem_granularity is not ProblemGranularity.UNKNOWN
                    and formation_input.evidence_granularity is not ProblemGranularity.UNKNOWN
                    and formation_input.problem_granularity
                    is not formation_input.evidence_granularity
                ),
            ),
            active_categories=[
                item
                for item in formation_input.source_category_metadata or []
                if item.operationally_relevant
            ],
            evidence_links=formation_input.evidence_links,
            evidence_hypothesis_impacts=formation_input.evidence_hypothesis_impacts,
            hypothesis_eligibility=eligibility,
            unknown_materiality=unknown_materiality,
            next_best_unknown_id=(
                unknown_materiality[0].unknown_id if unknown_materiality else None
            ),
            ranked_candidates=[score for _, score in ranked],
            selected_candidate_id=selected.id if selected else None,
            operational_problem=operational,
            readiness=readiness,
            routing_ready=routing_ready,
            recommended_dialogue_state=recommended,
            reframing_records=formation_input.reframing_records,
            interpretation_history=formation_input.interpretation_history,
            speech_acts=formation_input.speech_acts,
            transition=transition,
            reason_codes=reasons,
        )

    @staticmethod
    def _validate_identity(state: ProblemState, data: ProblemFormationInput) -> None:
        if state.problem_id != data.problem_id:
            raise EpistemicValidationError("formation input identity does not match ProblemState")
        if state.declared_problem and state.declared_problem != data.declared_problem:
            raise EpistemicValidationError(
                "declared_problem is immutable; use a traceable ReframingRecord"
            )

    @staticmethod
    def _merge(target: list, supplied: list, label: str) -> None:
        by_id = {item.id: item for item in target}
        for item in supplied:
            if item.id in by_id and by_id[item.id].model_dump() != item.model_dump():
                raise TraceabilityError(f"{label} {item.id} cannot be silently overwritten")
            if item.id not in by_id:
                target.append(item.model_copy(deep=True))

    @staticmethod
    def _validate_references(state: ProblemState, data: ProblemFormationInput) -> None:
        claim_ids = {item.id for item in state.claims}
        evidence_ids = {item.id for item in state.evidence}
        hypothesis_ids = {item.id for item in state.hypotheses}
        if any(item not in claim_ids for item in data.supplied_claim_ids):
            raise TraceabilityError("supplied_claim_ids must resolve to atomic ClaimRecords")
        if any(item not in evidence_ids for item in data.supplied_evidence_ids):
            raise TraceabilityError("supplied_evidence_ids must resolve to EvidenceRecords")
        if any(
            link.claim_id not in claim_ids or link.evidence_id not in evidence_ids
            for link in data.evidence_links
        ):
            raise TraceabilityError("EvidenceLink endpoints must resolve")
        if any(
            impact.evidence_id not in evidence_ids or impact.hypothesis_id not in hypothesis_ids
            for impact in data.evidence_hypothesis_impacts
        ):
            raise TraceabilityError("EvidenceHypothesisImpact endpoints must resolve")

    @staticmethod
    def _hypothesis_space_bounded(
        hypotheses: list[HypothesisRecord], eligibility: list[HypothesisEligibility]
    ) -> bool:
        eligible = {item.hypothesis_id for item in eligibility if item.eligible}
        active = [item for item in hypotheses if item.id in eligible]
        return bool(active) and all(
            item.observable_implications and item.falsification_condition for item in active
        )

    @staticmethod
    def _core_premise_contradicted(state: ProblemState) -> bool:
        return any(
            item.status is ContradictionStatus.TRUE_CONTRADICTION for item in state.contradictions
        )

    @staticmethod
    def _lifecycle(
        previous: ProblemState,
        state: ProblemState,
        readiness: OperationalProblemReadiness,
        has_hypotheses: bool,
    ) -> ProblemLifecycle:
        if previous.operational_problem and ProblemFormationEngine._core_premise_contradicted(
            state
        ):
            return ProblemLifecycle.REOPENED
        if readiness.ready:
            return ProblemLifecycle.OPERATIONALISED
        if has_hypotheses:
            return ProblemLifecycle.HYPOTHESIS_ACTIVE
        if any(repair.status is RepairStatus.OPEN for repair in state.repairs):
            return ProblemLifecycle.CLARIFYING
        return ProblemLifecycle.STRUCTURED if state.declared_problem else ProblemLifecycle.DECLARED

    @staticmethod
    def _recommended_state(
        readiness: OperationalProblemReadiness, state: ProblemState
    ) -> StateTransition:
        if not readiness.semantic_clarity:
            return StateTransition.REPAIR
        if readiness.forbidden_inference_present:
            return StateTransition.FORBIDDEN_INFERENCE
        if readiness.material_contradictions_open:
            return StateTransition.EPISTEMIC_CHALLENGE
        if readiness.ready:
            return StateTransition.ROUTING_READY
        return (
            StateTransition.HYPOTHESIS_DISCRIMINATION
            if state.hypotheses
            else StateTransition.PROBLEM_FORMATION
        )

    @staticmethod
    def _reason_codes(
        state: ProblemState,
        readiness: OperationalProblemReadiness,
        selected: CandidateOperationalProblem | None,
        bounded: bool,
        semantic_ambiguity: bool,
    ) -> list[FormationReasonCode]:
        result = []
        if any(r.material and r.status is RepairStatus.OPEN for r in state.repairs):
            result.append(FormationReasonCode.MATERIAL_REPAIR_OPEN)
        if semantic_ambiguity:
            result.append(FormationReasonCode.INDEXICAL_REFERENCE_UNRESOLVED)
        if readiness.forbidden_inference_present:
            result.append(FormationReasonCode.FORBIDDEN_HYPOTHESIS)
        if selected is None:
            result.append(FormationReasonCode.NO_ADMISSIBLE_CANDIDATE)
        elif selected.requires_user_confirmation:
            result.append(FormationReasonCode.USER_CONFIRMATION_REQUIRED)
        if readiness.critical_unknowns_open:
            result.append(FormationReasonCode.CRITICAL_UNKNOWN_OPEN)
        if readiness.material_contradictions_open:
            result.append(FormationReasonCode.MATERIAL_CONTRADICTION_OPEN)
        if not bounded:
            result.append(FormationReasonCode.HYPOTHESIS_SPACE_UNBOUNDED)
        if readiness.ready:
            result.append(FormationReasonCode.OPERATIONAL_PROBLEM_READY)
        return result or [FormationReasonCode.NO_ADMISSIBLE_CANDIDATE]
