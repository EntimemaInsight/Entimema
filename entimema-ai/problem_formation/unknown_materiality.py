from enum import IntEnum
from fractions import Fraction

from pydantic import BaseModel, ConfigDict, Field

from domain.enums import Materiality
from domain.unknowns import UnknownRecord

MATERIALITY_VALUE = {
    Materiality.LOW: 1,
    Materiality.MEDIUM: 2,
    Materiality.HIGH: 3,
    Materiality.CRITICAL: 4,
}


class AcquisitionCost(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


class UnknownMaterialityAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    unknown_id: str
    decision_impact: Materiality
    hypothesis_discrimination: Materiality
    resolvability: bool
    acquisition_cost: AcquisitionCost
    blocking: bool
    rationale: str = Field(min_length=1)


def _ordinal_cost(value: float | None) -> AcquisitionCost:
    if value is None or value <= 1:
        return AcquisitionCost.LOW
    if value <= 2:
        return AcquisitionCost.MEDIUM
    if value <= 3:
        return AcquisitionCost.HIGH
    return AcquisitionCost.CRITICAL


def assess_unknown(unknown: UnknownRecord) -> UnknownMaterialityAssessment:
    blocking = unknown.materiality is Materiality.CRITICAL or (
        unknown.materiality is Materiality.HIGH and unknown.blocks_routing is not False
    )
    return UnknownMaterialityAssessment(
        unknown_id=unknown.id,
        decision_impact=unknown.materiality,
        hypothesis_discrimination=unknown.materiality,
        resolvability=unknown.resolvable,
        acquisition_cost=_ordinal_cost(unknown.acquisition_cost),
        blocking=blocking,
        rationale=(
            "CRITICAL/HIGH unknown blocks problem formation under explicit routing policy"
            if blocking
            else "MEDIUM/LOW or explicitly non-blocking HIGH unknown"
        ),
    )


def prioritise_unknowns(
    unknowns: list[UnknownRecord],
) -> list[UnknownMaterialityAssessment]:
    assessments = [assess_unknown(unknown) for unknown in unknowns]

    def priority(item: UnknownMaterialityAssessment) -> tuple[Fraction, str]:
        # Fraction preserves the ratio exactly without artificial decimal precision.
        numerator = (
            MATERIALITY_VALUE[item.decision_impact]
            * MATERIALITY_VALUE[item.hypothesis_discrimination]
        )
        return (-Fraction(numerator, int(item.acquisition_cost)), item.unknown_id)

    return sorted(assessments, key=priority)
