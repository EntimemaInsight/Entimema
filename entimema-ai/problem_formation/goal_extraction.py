"""Deterministic goal validation; no natural-language extraction occurs here."""

from problem_formation.problem_objects import GoalType


def preserve_explicit_goal(candidate_goal: GoalType | None) -> GoalType:
    """Return only the supplied goal, never promote analysis to DECIDE implicitly."""
    return candidate_goal or GoalType.UNKNOWN
