import pytest

from core.exceptions import ForbiddenInferenceError
from core.guardrails import FORBIDDEN_INFERENCE_RULES, validate_candidate_inference


def test_all_ten_rules_are_seeded() -> None:
    assert {rule.rule_id for rule in FORBIDDEN_INFERENCE_RULES} == {
        f"FI-{number:03}" for number in range(1, 11)
    }


def test_hesitation_cannot_support_deception() -> None:
    with pytest.raises(ForbiddenInferenceError, match="FI-001"):
        validate_candidate_inference("hesitation", "probable deception")


def test_non_answer_cannot_support_concealing_debt() -> None:
    with pytest.raises(ForbiddenInferenceError, match="FI-002"):
        validate_candidate_inference("non-answer", "concealing debt")


def test_unrelated_candidate_is_not_blocked() -> None:
    validate_candidate_inference("quarterly filing", "revenue increased")
