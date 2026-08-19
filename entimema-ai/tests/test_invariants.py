import pytest

from core.exceptions import InvariantViolation, TraceabilityError
from core.invariants import (
    require_explicit_unknown_to_assumption_transition,
    validate_claim_support,
    validate_decision_traceability,
    validate_epistemic_relabel,
    validate_exploration_commitment,
    validate_hypothesis_decision_chain,
)
from domain.claims import ClaimRecord, ClaimStatus
from domain.conversation import ConversationMode, ConversationState
from domain.decisions import DecisionRecord
from domain.enums import EpistemicType, EpistemicVerdict
from domain.evidence import EvidenceRecord
from domain.transitions import StateTransition, TransitionRecord


def _decision(now, **overrides) -> DecisionRecord:
    values = {
        "decision_id": "d1",
        "problem_id": "p1",
        "recommendation": "Run a limited pilot",
        "evidence_path": ["e1"],
        "inference_path": ["i1"],
        "epistemic_verdict": EpistemicVerdict.CONDITIONALLY_VALID,
        "human_decision_required": True,
        "created_at": now,
    }
    values.update(overrides)
    return DecisionRecord(**values)


def test_unknown_cannot_silently_become_assumption() -> None:
    with pytest.raises(InvariantViolation, match="INV-001"):
        require_explicit_unknown_to_assumption_transition("u1", "a1", None)


def test_unknown_conversion_requires_correct_explicit_transition(now) -> None:
    transition = TransitionRecord(
        transition_id="t1",
        session_id="s1",
        problem_id="p1",
        from_state=StateTransition.EPISTEMIC_CHALLENGE,
        to_state=StateTransition.HYPOTHESIS_DISCRIMINATION,
        trigger="scenario analysis",
        changed_object_type="UnknownRecord->AssumptionRecord",
        changed_object_id="u1",
        previous_value=EpistemicType.UNKNOWN,
        new_value=EpistemicType.ASSUMPTION,
        basis="User explicitly approved a scenario assumption",
        timestamp=now,
    )
    require_explicit_unknown_to_assumption_transition("u1", "a1", transition)


def test_supported_claim_requires_separate_evidence(now) -> None:
    claim = ClaimRecord(
        id="c1",
        proposition="Revenue grew",
        status=ClaimStatus.SUPPORTED,
        source="user",
        timestamp=now,
        evidence_links=["e1"],
    )
    with pytest.raises(InvariantViolation, match="INV-002"):
        validate_claim_support(claim, {})
    evidence = EvidenceRecord(
        id="e1",
        proposition="Revenue grew",
        evidence_type=EpistemicType.RETRIEVED,
        source="filing",
        source_type="document",
        timestamp=now,
        provenance=["filing"],
        transformations=[],
        reliability=0.9,
    )
    validate_claim_support(claim, {evidence.id: evidence})


def test_model_output_cannot_become_observation() -> None:
    with pytest.raises(InvariantViolation, match="INV-004"):
        validate_epistemic_relabel(EpistemicType.MODEL_PRODUCED, EpistemicType.OBSERVED)


def test_exploration_does_not_automatically_create_commitment() -> None:
    exploratory = ConversationState(
        mode=ConversationMode.EXPLORATION,
        current_activity="Maybe we should stop the product",
    )
    committed = exploratory.model_copy(update={"mode": ConversationMode.COMMITMENT})
    with pytest.raises(InvariantViolation, match="EXPLORATION"):
        validate_exploration_commitment(exploratory, committed)


def test_hypothesis_requires_validated_inference_before_decision(now) -> None:
    with pytest.raises(InvariantViolation, match="INV-003"):
        validate_hypothesis_decision_chain("h1", _decision(now), [])
    validate_hypothesis_decision_chain("h1", _decision(now), ["i1"])


def test_traceability_paths_are_reconstructable(now) -> None:
    decision = _decision(now)
    with pytest.raises(TraceabilityError, match="evidence_path"):
        validate_decision_traceability(decision, {}, {"i1": object()})
