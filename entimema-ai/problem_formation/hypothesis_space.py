from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator

from core.exceptions import EpistemicValidationError, ForbiddenInferenceError
from core.guardrails import validate_candidate_inference
from domain.hypotheses import HypothesisRecord


class HypothesisSource(StrEnum):
    USER_PROPOSED = "USER_PROPOSED"
    SYSTEM_PROPOSED = "SYSTEM_PROPOSED"
    DOMAIN_PROPOSED = "DOMAIN_PROPOSED"


USER_PROPOSED_HYPOTHESIS = HypothesisSource.USER_PROPOSED


class HypothesisImpact(StrEnum):
    SUPPORTS = "SUPPORTS"
    WEAKENS = "WEAKENS"
    CONTRADICTS = "CONTRADICTS"
    NEUTRAL = "NEUTRAL"
    INSUFFICIENT = "INSUFFICIENT"


class HypothesisEligibility(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    hypothesis_id: str
    testable: bool
    observable_implications_present: bool
    forbidden_inference: bool
    eligible: bool
    rationale: str


class EvidenceHypothesisImpact(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    evidence_id: str = Field(min_length=1)
    hypothesis_id: str = Field(min_length=1)
    independent_interpretation: str = Field(min_length=1)
    impact: HypothesisImpact

    @model_validator(mode="after")
    def require_independent_interpretation(self) -> "EvidenceHypothesisImpact":
        if not self.independent_interpretation.strip():
            raise EpistemicValidationError(
                "SA-007: evidence requires independent interpretation before hypothesis impact"
            )
        return self


FORBIDDEN_HYPOTHESIS_TERMS = (
    "hidden motive",
    "deception",
    "stress",
    "anxiety",
    "personality",
    "psychiatric",
    "unconscious motive",
    "concealment",
    "concealing",
)


def evaluate_hypothesis(hypothesis: HypothesisRecord) -> HypothesisEligibility:
    forbidden = hypothesis.forbidden_inference or any(
        term in hypothesis.proposition.casefold() for term in FORBIDDEN_HYPOTHESIS_TERMS
    )
    try:
        validate_candidate_inference(hypothesis.proposition, hypothesis.proposition)
    except ForbiddenInferenceError:
        forbidden = True
    observable = bool(hypothesis.observable_implications)
    eligible = hypothesis.testable and observable and not forbidden
    return HypothesisEligibility(
        hypothesis_id=hypothesis.id,
        testable=hypothesis.testable,
        observable_implications_present=observable,
        forbidden_inference=forbidden,
        eligible=eligible,
        rationale=(
            "testable, observable, and guardrail-safe"
            if eligible
            else "hypothesis lacks testability/observability or violates inference guardrails"
        ),
    )
