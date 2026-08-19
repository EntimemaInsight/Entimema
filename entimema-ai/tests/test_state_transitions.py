import pytest

from core.exceptions import InvalidStateTransition
from core.validators import TERMINAL_STATES, validate_state_transition
from domain.transitions import StateTransition


def test_repair_to_problem_formation_is_valid() -> None:
    validate_state_transition(StateTransition.REPAIR, StateTransition.PROBLEM_FORMATION)


def test_intake_to_agent_running_is_invalid() -> None:
    with pytest.raises(InvalidStateTransition):
        validate_state_transition(StateTransition.INTAKE, StateTransition.AGENT_RUNNING)


@pytest.mark.parametrize("terminal", TERMINAL_STATES)
def test_terminal_states_have_no_outgoing_transitions(terminal) -> None:
    with pytest.raises(InvalidStateTransition):
        validate_state_transition(terminal, StateTransition.INTAKE)
