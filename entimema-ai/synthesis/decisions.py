from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class RecommendationType(StrEnum):
    INVESTIGATE = "INVESTIGATE"
    MONITOR = "MONITOR"
    ADJUST = "ADJUST"
    ESCALATE = "ESCALATE"
    RECONCILE = "RECONCILE"
    REVIEW = "REVIEW"
    ACT = "ACT"


class DecisionSeverity(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Reversibility(StrEnum):
    REVERSIBLE = "REVERSIBLE"
    PARTIALLY_REVERSIBLE = "PARTIALLY_REVERSIBLE"
    IRREVERSIBLE = "IRREVERSIBLE"


class RecommendationAdmissibility(StrEnum):
    PENDING = "PENDING"
    VALIDATED = "VALIDATED"
    CONDITIONAL = "CONDITIONAL"
    REJECTED = "REJECTED"


class CandidateRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    proposition: str
    recommendation_type: RecommendationType
    supporting_finding_ids: list[str]
    evidence_ids: list[str]
    assumption_ids: list[str] = Field(default_factory=list)
    expected_effect: str | None = None
    risks: list[str] = Field(default_factory=list)
    reversibility: Reversibility
    decision_severity: DecisionSeverity
    human_decision_required: bool
    admissibility_status: RecommendationAdmissibility = RecommendationAdmissibility.PENDING

    @model_validator(mode="after")
    def enforce_human_boundary(self):
        if (
            self.decision_severity in {DecisionSeverity.HIGH, DecisionSeverity.CRITICAL}
            or self.reversibility is Reversibility.IRREVERSIBLE
        ) and not self.human_decision_required:
            raise ValueError("high-impact or irreversible recommendations require human decision")
        return self
