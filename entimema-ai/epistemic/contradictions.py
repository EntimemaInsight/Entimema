from pydantic import BaseModel, ConfigDict

from domain.contradictions import ContradictionRecord, ContradictionStatus, ContradictionType
from epistemic.verdicts import RequiredNextAction

CONTRADICTION_EVALUATION_ORDER = (
    ContradictionType.DEFINITIONAL,
    ContradictionType.TEMPORAL,
    ContradictionType.SCOPE,
    ContradictionType.MEASUREMENT,
    ContradictionType.SOURCE,
    ContradictionType.TRUE_LOGICAL_CONTRADICTION,
)


class ContradictionAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    contradiction_id: str
    evaluated_dimensions: list[ContradictionType]
    likely_type: ContradictionType
    resolved: bool
    blocking: bool
    required_next_action: RequiredNextAction


def assess_contradiction(record: ContradictionRecord) -> ContradictionAssessment:
    index = CONTRADICTION_EVALUATION_ORDER.index(record.contradiction_type)
    evaluated = list(CONTRADICTION_EVALUATION_ORDER[: index + 1])
    resolved = record.status is ContradictionStatus.RESOLVED
    return ContradictionAssessment(
        contradiction_id=record.id,
        evaluated_dimensions=evaluated,
        likely_type=record.contradiction_type,
        resolved=resolved,
        blocking=not resolved,
        required_next_action=(
            RequiredNextAction.PROCEED if resolved else RequiredNextAction.RESOLVE_CONTRADICTION
        ),
    )
