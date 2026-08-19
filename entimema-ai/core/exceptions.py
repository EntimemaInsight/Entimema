class EpistemicValidationError(ValueError):
    """Base error for invalid epistemic operations."""


class InvariantViolation(EpistemicValidationError):
    """Raised when a core system invariant is violated."""


class InvalidStateTransition(EpistemicValidationError):
    """Raised when a runtime state transition is not allowed."""


class ForbiddenInferenceError(EpistemicValidationError):
    """Raised when candidate inference metadata matches a forbidden rule."""


class TraceabilityError(InvariantViolation):
    """Raised when an object lacks a reconstructable provenance path."""
