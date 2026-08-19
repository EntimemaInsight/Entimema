"""Forbidden inference rules implementing INV-005."""

from pydantic import BaseModel, ConfigDict, Field

from core.exceptions import ForbiddenInferenceError
from domain.enums import Severity


class ForbiddenInferenceRule(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    rule_id: str = Field(min_length=1)
    trigger_category: str = Field(min_length=1)
    prohibited_conclusion_category: str = Field(min_length=1)
    description: str = Field(min_length=1)
    severity: Severity


FORBIDDEN_INFERENCE_RULES: tuple[ForbiddenInferenceRule, ...] = tuple(
    ForbiddenInferenceRule(**rule)
    for rule in (
        {
            "rule_id": "FI-001",
            "trigger_category": "hesitation",
            "prohibited_conclusion_category": "deception",
            "description": "Hesitation cannot establish deception.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-002",
            "trigger_category": "silence non-answer refusal",
            "prohibited_conclusion_category": "concealment concealing",
            "description": "Silence or a non-answer cannot establish concealment.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-003",
            "trigger_category": "linguistic style wording",
            "prohibited_conclusion_category": "creditworthiness credit risk",
            "description": "Linguistic style cannot establish creditworthiness.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-004",
            "trigger_category": "linguistic style wording",
            "prohibited_conclusion_category": "personality",
            "description": "Linguistic style cannot establish personality.",
            "severity": Severity.HIGH,
        },
        {
            "rule_id": "FI-005",
            "trigger_category": "conversation signal tone pause",
            "prohibited_conclusion_category": "psychiatric condition state",
            "description": "Conversation signals cannot establish psychiatric state.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-006",
            "trigger_category": "conversation signal hesitation silence tone pause",
            "prohibited_conclusion_category": "stress anxiety",
            "description": "Conversation signals cannot establish stress or anxiety.",
            "severity": Severity.HIGH,
        },
        {
            "rule_id": "FI-007",
            "trigger_category": "user negation",
            "prohibited_conclusion_category": "hidden affirmation",
            "description": "Negation cannot be inverted into hidden affirmation.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-008",
            "trigger_category": "typo slip",
            "prohibited_conclusion_category": "hidden truth",
            "description": "Typos and slips cannot establish hidden truth.",
            "severity": Severity.HIGH,
        },
        {
            "rule_id": "FI-009",
            "trigger_category": "language linguistic style wording",
            "prohibited_conclusion_category": "protected characteristic",
            "description": "Language cannot establish protected characteristics.",
            "severity": Severity.CRITICAL,
        },
        {
            "rule_id": "FI-010",
            "trigger_category": "body voice signal",
            "prohibited_conclusion_category": "trustworthiness",
            "description": "Body or voice signals cannot establish trustworthiness.",
            "severity": Severity.CRITICAL,
        },
    )
)


def _terms(value: str) -> set[str]:
    return {term.strip(".,:;!?/\\-_()").casefold() for term in value.split()}


def validate_candidate_inference(trigger: str, candidate_conclusion: str) -> None:
    """Reject metadata when trigger and conclusion overlap a seeded forbidden pair."""
    trigger_terms = _terms(trigger)
    conclusion_terms = _terms(candidate_conclusion)
    for rule in FORBIDDEN_INFERENCE_RULES:
        if trigger_terms & _terms(rule.trigger_category) and conclusion_terms & _terms(
            rule.prohibited_conclusion_category
        ):
            raise ForbiddenInferenceError(f"{rule.rule_id}: {rule.description}")
