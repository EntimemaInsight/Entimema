import pytest
from pydantic import ValidationError

from domain.decisions import DecisionRecord
from domain.enums import EpistemicVerdict


def _data(now) -> dict[str, object]:
    return {
        "decision_id": "d1",
        "problem_id": "p1",
        "recommendation": "Proceed conditionally",
        "evidence_path": ["e1"],
        "inference_path": ["i1"],
        "assumptions": [],
        "unresolved_unknowns": [],
        "epistemic_verdict": EpistemicVerdict.CONDITIONALLY_VALID,
        "human_decision_required": True,
        "created_at": now,
    }


@pytest.mark.parametrize("missing_path", ["evidence_path", "inference_path"])
def test_decision_requires_both_traceability_paths(now, missing_path) -> None:
    data = _data(now)
    data[missing_path] = []
    with pytest.raises(ValidationError, match=missing_path):
        DecisionRecord(**data)


def test_valid_decision_with_both_paths_passes(now) -> None:
    decision = DecisionRecord(**_data(now))
    assert decision.evidence_path == ["e1"]
    assert decision.inference_path == ["i1"]
