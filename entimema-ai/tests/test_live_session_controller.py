import pytest

from api.errors import RuntimeAPIError
from api.schemas import LiveMessageRequest
from live.controller import LiveSessionController
from live.interpreter import LinguisticInterpreter
from live.response import empty_projection
from live.session import InMemorySessionStore, RuntimeMode


class FakeProvider:
    def interpret_turn(self, **_):
        return {
            "conversational_action": "CLAIM",
            "definition_ambiguities": ["profit definition"],
            "repair_candidate": "Do you mean gross, operating, or net profit?",
        }


def test_version_isolation_and_one_question_rule():
    store = InMemorySessionStore()
    first = store.create(RuntimeMode.LIVE, empty_projection())
    second = store.create(RuntimeMode.LIVE, empty_projection())
    controller = LiveSessionController(store, LinguisticInterpreter(FakeProvider()))
    response = controller.process_message(
        first.session_id,
        LiveMessageRequest(message="20% profit", client_turn_id="t1", session_context_version=0),
    )
    assert response.problem_state_version == 1
    assert sum(turn.actor == "ENTIMEMA" for turn in response.conversation) == 1
    assert store.get(second.session_id).state_version == 0
    with pytest.raises(RuntimeAPIError) as stale:
        controller.process_message(
            first.session_id,
            LiveMessageRequest(message="again", client_turn_id="t2", session_context_version=0),
        )
    assert stale.value.code == "STALE_STATE"
