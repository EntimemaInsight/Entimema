import pytest

from live.interpreter import InterpretationError, LinguisticInterpreter


class FakeProvider:
    def __init__(self, output):
        self.output = output

    def interpret_turn(self, *, message, context):
        return self.output


def test_interpreter_returns_candidates_without_state_access():
    output = {
        "conversational_action": "EXPLORATION",
        "claim_candidates": [{"text": "Sales grow"}],
        "embedded_hypothesis_candidates": [{"text": "Customers pay late"}],
    }
    result = LinguisticInterpreter(FakeProvider(output)).interpret(
        message="Sales grow so customers pay late", context=[]
    )
    assert [claim.text for claim in result.claim_candidates] == ["Sales grow"]
    assert [hypothesis.text for hypothesis in result.embedded_hypothesis_candidates] == [
        "Customers pay late"
    ]
    assert not hasattr(result, "problem_state")


def test_malformed_provider_output_is_rejected_without_guessing():
    with pytest.raises(InterpretationError):
        LinguisticInterpreter(FakeProvider({"conversational_action": "invented"})).interpret(
            message="x", context=[]
        )
