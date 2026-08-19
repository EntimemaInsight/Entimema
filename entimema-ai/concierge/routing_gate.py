from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict

from concierge.repair import RepairStatus
from domain.contradictions import ContradictionStatus
from domain.enums import EpistemicVerdict, Materiality

if TYPE_CHECKING:
    from domain.problem_state import ProblemState


class ProblemFormationReadiness(BaseModel):
    model_config = ConfigDict(extra="forbid")

    object_defined: bool = False
    goal_defined: bool = False
    decision_defined: bool = False
    horizon_defined: bool = False
    scope_defined: bool = False


class RoutingReadiness(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    operational_problem_defined: bool
    decision_defined: bool
    material_repairs_open: bool
    critical_unknowns_open: bool
    high_unknowns_blocking: bool
    material_contradictions_open: bool
    forbidden_inference_present: bool
    epistemic_verdict: EpistemicVerdict | None
    ready: bool


BLOCKING_VERDICTS = frozenset(
    {
        EpistemicVerdict.INSUFFICIENT_EVIDENCE,
        EpistemicVerdict.CONTRADICTED,
        EpistemicVerdict.OUT_OF_SCOPE,
        EpistemicVerdict.FORBIDDEN_INFERENCE,
        EpistemicVerdict.TRACEABILITY_FAILURE,
    }
)


def evaluate_routing_readiness(problem_state: "ProblemState") -> RoutingReadiness:
    material_repairs = any(
        repair.material and repair.status is RepairStatus.OPEN for repair in problem_state.repairs
    )
    critical_unknowns = any(
        unknown.materiality is Materiality.CRITICAL for unknown in problem_state.unknowns
    )
    high_unknowns = any(
        unknown.materiality is Materiality.HIGH and unknown.blocks_routing is not False
        for unknown in problem_state.unknowns
    )
    contradictions = any(
        contradiction.status
        in {
            ContradictionStatus.OPEN,
            ContradictionStatus.TRUE_CONTRADICTION,
            ContradictionStatus.INSUFFICIENT_INFORMATION,
        }
        for contradiction in problem_state.contradictions
    )
    forbidden = problem_state.epistemic_verdict is EpistemicVerdict.FORBIDDEN_INFERENCE or any(
        hypothesis.forbidden_inference for hypothesis in problem_state.hypotheses
    )
    operational = bool(problem_state.operational_problem)
    decision = bool(problem_state.decision_required)
    verdict_blocking = problem_state.epistemic_verdict in BLOCKING_VERDICTS
    ready = not any(
        (
            not operational,
            not decision,
            material_repairs,
            critical_unknowns,
            high_unknowns,
            contradictions,
            forbidden,
            verdict_blocking,
        )
    )
    return RoutingReadiness(
        operational_problem_defined=operational,
        decision_defined=decision,
        material_repairs_open=material_repairs,
        critical_unknowns_open=critical_unknowns,
        high_unknowns_blocking=high_unknowns,
        material_contradictions_open=contradictions,
        forbidden_inference_present=forbidden,
        epistemic_verdict=problem_state.epistemic_verdict,
        ready=ready,
    )
