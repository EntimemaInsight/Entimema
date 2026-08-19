from pydantic import BaseModel, ConfigDict

from domain.assumptions import AssumptionRecord
from domain.enums import Materiality
from domain.problem_state import ProblemState


class AssumptionAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    assumption_id: str
    explicit: bool
    basis_present: bool
    materiality: Materiality
    sensitivity_required: bool
    admissible: bool
    blocking: bool


def assess_assumption(assumption: AssumptionRecord) -> AssumptionAssessment:
    explicit = bool(assumption.proposition.strip())
    basis = bool(assumption.reason.strip() and assumption.source)
    material = assumption.materiality in {Materiality.HIGH, Materiality.CRITICAL}
    admissible = explicit and basis
    return AssumptionAssessment(
        assumption_id=assumption.id,
        explicit=explicit,
        basis_present=basis,
        materiality=assumption.materiality,
        sensitivity_required=material or assumption.validation_required,
        admissible=admissible,
        blocking=not admissible,
    )


class PremiseRegistration(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    registered: list[str]
    unregistered: list[str]
    assumption_leakage: bool


def detect_assumption_leakage(
    state: ProblemState, premise_ids: list[str], assumption_ids: list[str]
) -> PremiseRegistration:
    evidence = {item.id for item in state.evidence}
    claims = {item.id for item in state.claims}
    assumptions = {item.id for item in state.assumptions}
    unknowns = {item.id for item in state.unknowns}
    known = evidence | claims | assumptions | unknowns | {item.id for item in state.hypotheses}
    referenced = set(premise_ids) | set(assumption_ids)
    unregistered = sorted(referenced - known)
    return PremiseRegistration(
        registered=sorted(referenced & known),
        unregistered=unregistered,
        assumption_leakage=bool(unregistered),
    )
