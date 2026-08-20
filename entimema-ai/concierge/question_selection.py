from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class OrdinalLevel(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


ORDINAL_VALUE = {OrdinalLevel.LOW: 1, OrdinalLevel.MEDIUM: 2, OrdinalLevel.HIGH: 3}


class QuestionCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    id: str = Field(min_length=1)
    # Canonical selection metadata. `question` remains machine-facing; presentation is
    # delegated to the interaction boundary after selection.
    question: str = Field(min_length=1)
    targets_unknown_ids: list[str] = Field(default_factory=list)
    targets_repair_ids: list[str] = Field(default_factory=list)
    targets_blocker_ids: list[str] = Field(default_factory=list)
    targets_contradiction_ids: list[str] = Field(default_factory=list)
    evidence_record_ids: list[str] = Field(default_factory=list)
    hypotheses_affected_ids: list[str] = Field(default_factory=list)
    required_information: list[str] = Field(default_factory=list)
    provenance: str = "CANONICAL_RUNTIME"
    information_gain: OrdinalLevel
    user_cost: OrdinalLevel
    presupposition_risk: OrdinalLevel
    introduces_unverified_category: bool = False
    assumes_unproven_premise: bool = False
    artificially_narrows_response: bool = False
    decision_priority: int = Field(default=0, ge=0, le=6)
    epistemic_reason: str = "CLARIFICATION_REQUIRED"

    @property
    def reflexive(self) -> bool:
        return not (
            self.introduces_unverified_category
            or self.assumes_unproven_premise
            or self.artificially_narrows_response
        )


def select_next_best_question(
    candidates: list[QuestionCandidate],
) -> QuestionCandidate | None:
    """Rank valid questions by exact ordinal ratio, then stable candidate ID."""
    valid = [candidate for candidate in candidates if candidate.reflexive]
    if not valid:
        return None

    def rank(candidate: QuestionCandidate) -> tuple[int, float, str]:
        denominator = (
            ORDINAL_VALUE[candidate.user_cost] + ORDINAL_VALUE[candidate.presupposition_risk]
        )
        score = ORDINAL_VALUE[candidate.information_gain] / max(denominator, 1)
        return (-candidate.decision_priority, -score, candidate.id)

    return min(valid, key=rank)
