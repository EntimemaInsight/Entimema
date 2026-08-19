import pytest
from pydantic import ValidationError

from domain.claims import ClaimRecord, ClaimStatus
from domain.contradictions import (
    ContradictionRecord,
    ContradictionStatus,
    ContradictionType,
)
from domain.enums import EpistemicType
from domain.evidence import EvidenceRecord
from domain.problem_state import ProblemState


def test_claim_and_evidence_remain_distinct_models(now) -> None:
    claim = ClaimRecord(id="c1", proposition="Revenue grew", source="user", timestamp=now)
    evidence = EvidenceRecord(
        id="e1",
        proposition="Revenue grew 5%",
        evidence_type=EpistemicType.RETRIEVED,
        source="audited-report",
        source_type="filing",
        timestamp=now,
        provenance=["report:2025"],
        transformations=[],
        reliability=0.95,
    )
    assert claim.status is ClaimStatus.REPORTED
    assert type(claim) is not type(evidence)
    with pytest.raises(ValidationError):
        EvidenceRecord.model_validate(claim.model_dump())


def test_contradiction_preserves_both_propositions_without_selecting_one() -> None:
    contradiction = ContradictionRecord(
        id="x1",
        proposition_a="Cash is 10",
        proposition_b="Cash is 12",
        evidence_a_ids=["e1"],
        evidence_b_ids=["e2"],
        contradiction_type=ContradictionType.MEASUREMENT,
    )
    assert contradiction.proposition_a == "Cash is 10"
    assert contradiction.proposition_b == "Cash is 12"
    assert contradiction.status is ContradictionStatus.OPEN
    assert contradiction.possible_resolution is None


def test_problem_state_rejects_duplicate_record_ids(now) -> None:
    claims = [
        ClaimRecord(id="c1", proposition="A", source="user", timestamp=now),
        ClaimRecord(id="c1", proposition="B", source="user", timestamp=now),
    ]
    with pytest.raises(ValidationError, match="record IDs must be unique"):
        ProblemState(session_id="s1", problem_id="p1", claims=claims)
