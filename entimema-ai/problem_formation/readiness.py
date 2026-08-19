from pydantic import BaseModel, ConfigDict, Field

from concierge.repair import RepairStatus
from domain.contradictions import ContradictionStatus
from domain.enums import Materiality
from domain.problem_state import ProblemState
from problem_formation.candidate_problems import CandidateOperationalProblem


class OperationalProblemReadiness(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    semantic_clarity: bool
    object_defined: bool
    goal_defined: bool
    decision_defined: bool
    scope_sufficient: bool
    horizon_sufficient: bool
    critical_unknowns_open: bool
    material_contradictions_open: bool
    forbidden_inference_present: bool
    assumption_burden: int = Field(ge=0)
    hypothesis_space_bounded: bool
    ready: bool


def evaluate_operational_readiness(
    state: ProblemState,
    candidate: CandidateOperationalProblem | None,
    *,
    hypothesis_space_bounded: bool,
    forbidden_inference_present: bool,
    semantic_ambiguity_present: bool = False,
) -> OperationalProblemReadiness:
    material_repairs = any(
        repair.material and repair.status is RepairStatus.OPEN for repair in state.repairs
    )
    critical_unknowns = any(
        unknown.materiality is Materiality.CRITICAL
        or (unknown.materiality is Materiality.HIGH and unknown.blocks_routing is not False)
        for unknown in state.unknowns
    )
    contradictions = any(
        contradiction.status is not ContradictionStatus.RESOLVED
        for contradiction in state.contradictions
    )
    object_defined = bool(candidate and candidate.object.object_type.value != "UNKNOWN")
    goal_defined = bool(candidate and candidate.goal.value != "UNKNOWN")
    decision_defined = bool(candidate and candidate.decision)
    scope = bool(candidate and candidate.scope)
    horizon = bool(candidate and candidate.horizon)
    assumptions = len(candidate.required_assumption_ids) if candidate else 0
    confirmation_clear = bool(candidate and not candidate.requires_user_confirmation)
    semantic_clarity = not material_repairs and not semantic_ambiguity_present
    ready = all(
        (
            semantic_clarity,
            object_defined,
            goal_defined,
            decision_defined,
            scope,
            horizon,
            not critical_unknowns,
            not contradictions,
            not forbidden_inference_present,
            hypothesis_space_bounded,
            confirmation_clear,
        )
    )
    return OperationalProblemReadiness(
        semantic_clarity=semantic_clarity,
        object_defined=object_defined,
        goal_defined=goal_defined,
        decision_defined=decision_defined,
        scope_sufficient=scope,
        horizon_sufficient=horizon,
        critical_unknowns_open=critical_unknowns,
        material_contradictions_open=contradictions,
        forbidden_inference_present=forbidden_inference_present,
        assumption_burden=assumptions,
        hypothesis_space_bounded=hypothesis_space_bounded,
        ready=ready,
    )
