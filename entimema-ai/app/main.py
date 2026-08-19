"""Importable runtime entry point; execution is intentionally deferred."""

from domain.problem_state import ProblemState


def create_problem_state(**data: object) -> ProblemState:
    """Create the central typed state without starting an orchestration runtime."""
    return ProblemState.model_validate(data)
