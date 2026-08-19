"""Executable checks for the six foundational Entimema invariants."""

from collections.abc import Mapping, Sequence

from core.exceptions import InvariantViolation, TraceabilityError
from domain.claims import ClaimRecord, ClaimStatus
from domain.conversation import ConversationMode, ConversationState
from domain.decisions import DecisionRecord
from domain.enums import EpistemicType
from domain.evidence import EvidenceRecord
from domain.transitions import TransitionRecord


def require_explicit_unknown_to_assumption_transition(
    unknown_id: str, assumption_id: str, transition: TransitionRecord | None
) -> None:
    """INV-001: require an auditable transition and basis for a type promotion."""
    if (
        transition is None
        or transition.changed_object_type != "UnknownRecord->AssumptionRecord"
        or transition.changed_object_id != unknown_id
        or transition.previous_value != EpistemicType.UNKNOWN
        or transition.new_value != EpistemicType.ASSUMPTION
        or not transition.basis.strip()
        or not assumption_id.strip()
    ):
        raise InvariantViolation(
            "INV-001: UNKNOWN may become ASSUMPTION only through an explicit, based transition"
        )


def validate_claim_support(
    claim: ClaimRecord, evidence_by_id: Mapping[str, EvidenceRecord]
) -> None:
    """INV-002: supported claims must cite separate evidence objects."""
    if claim.status is ClaimStatus.REPORTED:
        return
    if not claim.evidence_links:
        raise InvariantViolation("INV-002: a promoted claim requires separate evidence")
    if any(link not in evidence_by_id for link in claim.evidence_links):
        raise InvariantViolation("INV-002: claim evidence links must resolve to EvidenceRecords")


def validate_hypothesis_decision_chain(
    hypothesis_id: str, decision: DecisionRecord, validated_inference_ids: Sequence[str]
) -> None:
    """INV-003: hypotheses cannot directly become final decisions."""
    if hypothesis_id in decision.inference_path or not any(
        item in validated_inference_ids for item in decision.inference_path
    ):
        raise InvariantViolation(
            "INV-003: decisions require an intermediate validated inference/evidence chain"
        )


def validate_epistemic_relabel(previous_type: EpistemicType, new_type: EpistemicType) -> None:
    """INV-004: model-produced output is never an observation."""
    if previous_type is EpistemicType.MODEL_PRODUCED and new_type is EpistemicType.OBSERVED:
        raise InvariantViolation("INV-004: MODEL_PRODUCED cannot be relabelled OBSERVED")


def validate_exploration_commitment(
    previous: ConversationState,
    candidate: ConversationState,
    explicit_user_commitment: bool = False,
) -> None:
    """Exploratory language cannot silently create commitment."""
    if (
        previous.mode is ConversationMode.EXPLORATION
        and candidate.mode is ConversationMode.COMMITMENT
        and not explicit_user_commitment
    ):
        raise InvariantViolation("EXPLORATION cannot automatically produce COMMITMENT")


def validate_decision_traceability(
    decision: DecisionRecord,
    evidence_by_id: Mapping[str, EvidenceRecord] | None = None,
    inference_by_id: Mapping[str, object] | None = None,
) -> None:
    """INV-006: require non-empty and, when registries are supplied, resolvable paths."""
    if not decision.evidence_path or not decision.inference_path:
        raise TraceabilityError("INV-006: material decisions require both traceability paths")
    if evidence_by_id is not None and any(
        item not in evidence_by_id for item in decision.evidence_path
    ):
        raise TraceabilityError("INV-006: evidence_path is not reconstructable")
    if inference_by_id is not None and any(
        item not in inference_by_id for item in decision.inference_path
    ):
        raise TraceabilityError("INV-006: inference_path is not reconstructable")
