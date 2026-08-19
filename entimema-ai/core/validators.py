"""Deterministic state-transition validation."""

from core.exceptions import InvalidStateTransition
from domain.transitions import StateTransition, TransitionRecord

TERMINAL_STATES = frozenset(
    {
        StateTransition.INSUFFICIENT_EVIDENCE,
        StateTransition.FORBIDDEN_INFERENCE,
        StateTransition.OUT_OF_SCOPE,
        StateTransition.TRACEABILITY_FAILURE,
        StateTransition.CLOSED,
    }
)

ALLOWED_TRANSITIONS: dict[StateTransition, frozenset[StateTransition]] = {
    StateTransition.INTAKE: frozenset({StateTransition.INTAKE, StateTransition.CONTEXTUALISING}),
    StateTransition.CONTEXTUALISING: frozenset(
        {
            StateTransition.CONTEXTUALISING,
            StateTransition.REPAIR,
            StateTransition.PROBLEM_FORMATION,
            StateTransition.INSUFFICIENT_EVIDENCE,
        }
    ),
    StateTransition.REPAIR: frozenset(
        {
            StateTransition.REPAIR,
            StateTransition.PROBLEM_FORMATION,
            StateTransition.INSUFFICIENT_EVIDENCE,
        }
    ),
    StateTransition.PROBLEM_FORMATION: frozenset(
        {
            StateTransition.PROBLEM_FORMATION,
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            StateTransition.FORBIDDEN_INFERENCE,
            StateTransition.INSUFFICIENT_EVIDENCE,
        }
    ),
    StateTransition.HYPOTHESIS_DISCRIMINATION: frozenset(
        {
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            StateTransition.EPISTEMIC_CHALLENGE,
            StateTransition.ROUTING_READY,
            StateTransition.INSUFFICIENT_EVIDENCE,
            StateTransition.FORBIDDEN_INFERENCE,
        }
    ),
    StateTransition.EPISTEMIC_CHALLENGE: frozenset(
        {
            StateTransition.EPISTEMIC_CHALLENGE,
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            StateTransition.INSUFFICIENT_EVIDENCE,
        }
    ),
    StateTransition.ROUTING_READY: frozenset({StateTransition.AGENT_RUNNING}),
    StateTransition.AGENT_RUNNING: frozenset({StateTransition.RESULT_VALIDATION}),
    StateTransition.RESULT_VALIDATION: frozenset({StateTransition.SYNTHESIS}),
    StateTransition.SYNTHESIS: frozenset({StateTransition.CLOSED}),
}


def validate_state_transition(from_state: StateTransition, to_state: StateTransition) -> None:
    if from_state in TERMINAL_STATES or to_state not in ALLOWED_TRANSITIONS.get(
        from_state, frozenset()
    ):
        raise InvalidStateTransition(f"transition {from_state} -> {to_state} is not allowed")


def validate_transition_record(record: TransitionRecord) -> None:
    validate_state_transition(record.from_state, record.to_state)
