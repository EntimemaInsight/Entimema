from datetime import UTC, datetime

from core.invariants import validate_claim_support, validate_exploration_commitment
from domain.problem_state import ProblemState


def revalidate_problem_state(
    previous: ProblemState,
    updated: ProblemState,
    *,
    explicit_user_commitment: bool,
) -> ProblemState:
    """Revalidate all Sprint 1 invariants applicable to shared problem state."""
    evidence = {record.id: record for record in updated.evidence}
    for claim in updated.claims:
        validate_claim_support(claim, evidence)
    validate_exploration_commitment(
        previous.conversation_state,
        updated.conversation_state,
        explicit_user_commitment=explicit_user_commitment,
    )
    updated.updated_at = datetime.now(UTC)
    return ProblemState.model_validate(updated.model_dump())
