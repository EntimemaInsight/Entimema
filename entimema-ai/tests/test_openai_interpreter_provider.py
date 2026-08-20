import io
import json
import logging
from urllib import error

import pytest

from api.errors import RuntimeAPIError
from api.schemas import LiveMessageRequest
from live.controller import LiveSessionController
from live.interpreter import (
    InterpretationError,
    InterpreterFailureCategory,
    LinguisticInterpreter,
    OpenAIInterpreterProvider,
    openai_interpretation_schema,
)
from live.response import empty_projection
from live.session import InMemorySessionStore, RuntimeMode


def complete_candidate(**updates):
    candidate = {
        "conversational_action": "CLAIM",
        "declared_problem_candidate": None,
        "claim_candidates": [],
        "unresolved_reference_candidates": [],
        "definition_ambiguities": [],
        "user_goal_candidate": None,
        "decision_candidate": None,
        "horizon_candidate": None,
        "scope_candidate": None,
        "explicit_assumption_candidates": [],
        "embedded_hypothesis_candidates": [],
        "candidate_unknowns": [],
        "repair_candidate": None,
        "confidence_metadata": {},
    }
    candidate.update(updates)
    return candidate


class Response:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return None

    def read(self):
        return json.dumps(self.payload).encode()


def provider(monkeypatch, payload=None, exception=None):
    def urlopen(req, timeout):
        assert timeout == 30
        if exception:
            raise exception
        return Response(payload)

    monkeypatch.setattr("live.interpreter.request.urlopen", urlopen)
    return OpenAIInterpreterProvider(api_key="super-secret", model="configured-model")


def envelope(candidate):
    return {"output": [{"content": [{"type": "output_text", "text": json.dumps(candidate)}]}]}


def walk_objects(schema):
    if isinstance(schema, dict):
        if schema.get("type") == "object":
            yield schema
        for value in schema.values():
            yield from walk_objects(value)
    elif isinstance(schema, list):
        for value in schema:
            yield from walk_objects(value)


def test_provider_schema_has_strict_required_objects_and_nullable_optionals():
    schema = openai_interpretation_schema()
    for obj in walk_objects(schema):
        assert obj["additionalProperties"] is False
        assert set(obj.get("required", [])) == set(obj.get("properties", {}))
    assert schema["properties"]["declared_problem_candidate"]["type"] == ["string", "null"]
    assert set(schema["required"]) == set(schema["properties"])


@pytest.mark.parametrize(
    ("status", "code", "category"),
    [
        (400, "invalid_request_error", InterpreterFailureCategory.PROVIDER_HTTP_ERROR),
        (401, None, InterpreterFailureCategory.PROVIDER_AUTH_ERROR),
        (403, None, InterpreterFailureCategory.PROVIDER_AUTH_ERROR),
        (429, "rate_limit_exceeded", InterpreterFailureCategory.PROVIDER_RATE_LIMIT),
        (400, "model_not_found", InterpreterFailureCategory.PROVIDER_MODEL_ERROR),
    ],
)
def test_http_failures_are_classified(monkeypatch, status, code, category):
    body = io.BytesIO(json.dumps({"error": {"code": code, "message": "sensitive"}}).encode())
    failure = error.HTTPError("https://example.invalid", status, "secret", {}, body)
    with pytest.raises(InterpretationError) as caught:
        provider(monkeypatch, exception=failure).interpret_turn(message="private", context=[])
    assert caught.value.category is category
    assert caught.value.http_status == status
    assert caught.value.provider_error_code == code
    assert "sensitive" not in str(caught.value)


def test_transport_failure_is_classified(monkeypatch):
    with pytest.raises(InterpretationError) as caught:
        provider(monkeypatch, exception=error.URLError("network secret")).interpret_turn(
            message="private", context=[]
        )
    assert caught.value.category is InterpreterFailureCategory.PROVIDER_TRANSPORT_ERROR
    assert caught.value.retryable


@pytest.mark.parametrize(
    ("payload", "category"),
    [
        ({}, InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR),
        ({"output": []}, InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR),
        (
            {"output": [{"content": [{"type": "refusal", "refusal": "no"}]}]},
            InterpreterFailureCategory.PROVIDER_REFUSAL,
        ),
        (
            {"output": [{"content": [{"type": "output_text", "text": "{"}]}]},
            InterpreterFailureCategory.OUTPUT_JSON_ERROR,
        ),
    ],
)
def test_response_outcomes_are_explicit(monkeypatch, payload, category):
    with pytest.raises(InterpretationError) as caught:
        provider(monkeypatch, payload).interpret_turn(message="private", context=[])
    assert caught.value.category is category


@pytest.mark.parametrize(
    "mutation,location",
    [
        ({"conversational_action": "INVALID"}, "conversational_action"),
        ({"unexpected": "property"}, "unexpected"),
        (
            {"candidate_unknowns": [{"variable": "cash", "why_needed": "", "materiality": "HIGH"}]},
            "candidate_unknowns.0.why_needed",
        ),
    ],
)
def test_candidate_validation_remains_strict(mutation, location):
    class FakeProvider:
        def interpret_turn(self, **_):
            return complete_candidate(**mutation)

    with pytest.raises(InterpretationError) as caught:
        LinguisticInterpreter(FakeProvider()).interpret(message="x", context=[])
    assert caught.value.category is InterpreterFailureCategory.CANDIDATE_VALIDATION_ERROR
    assert location in caught.value.validation_locations


def test_bulgarian_turn_is_admitted_deterministically_without_epistemic_promotion():
    input_message = "Имаме ръст на приходите, но паричният поток се влошава."

    class BulgarianProvider:
        def interpret_turn(self, *, message, context):
            assert message == input_message
            assert context == []
            return complete_candidate(
                claim_candidates=[{"text": message, "source": "USER"}],
                candidate_unknowns=[
                    {
                        "variable": "Причина за влошения паричен поток",
                        "why_needed": "Не е посочена",
                        "materiality": "HIGH",
                    }
                ],
            )

    store = InMemorySessionStore()
    session = store.create(RuntimeMode.LIVE, empty_projection())
    request = LiveMessageRequest(message=input_message, client_turn_id="bg-1")
    response = LiveSessionController(
        store, LinguisticInterpreter(BulgarianProvider())
    ).process_message(session.session_id, request)
    state = store.get(session.session_id).problem_state
    assert response.problem_state_version == 1
    assert [claim.proposition for claim in state.claims] == [input_message]
    assert len(state.unknowns) == 1
    assert state.assumptions == []
    assert state.hypotheses == []
    assert response.workspace_projection["validated_evidence"] == []


def test_provider_failure_logging_is_sanitized(caplog):
    secret = "sk-do-not-log"
    private = "full private user message"
    provider_body = '{"error":{"message":"complete sensitive provider response"}}'

    class FailedProvider:
        model = "safe-model"

        def interpret_turn(self, **_):
            cause = ValueError(f"{secret} {private} {provider_body}")
            raise InterpretationError(
                InterpreterFailureCategory.PROVIDER_AUTH_ERROR,
                http_status=401,
                provider_error_code="invalid_api_key",
            ) from cause

    store = InMemorySessionStore()
    session = store.create(RuntimeMode.LIVE, empty_projection())
    with caplog.at_level(logging.WARNING, logger="entimema.live"):
        with pytest.raises(RuntimeAPIError) as caught:
            LiveSessionController(store, LinguisticInterpreter(FailedProvider())).process_message(
                session.session_id, LiveMessageRequest(message=private, client_turn_id="safe-turn")
            )
    assert caught.value.status == 503
    assert caught.value.code == "INTERPRETER_PROVIDER_UNAVAILABLE"
    assert caught.value.message == "The live linguistic interpreter is temporarily unavailable."
    rendered = caplog.text
    assert secret not in rendered
    assert private not in rendered
    assert provider_body not in rendered
    record = caplog.records[-1]
    event = json.loads(record.getMessage())
    assert event == {
        "event": "interpreter_failure",
        "failure_category": "PROVIDER_AUTH_ERROR",
        "provider": "FailedProvider",
        "model": "safe-model",
        "http_status": 401,
        "provider_error_code": "invalid_api_key",
        "validation_locations": [],
        "session_id": session.session_id,
        "turn_id": "safe-turn",
        "retryable": False,
        "timestamp": event["timestamp"],
    }
    assert record.failure_category == "PROVIDER_AUTH_ERROR"
    assert record.model == "safe-model"
    assert record.http_status == 401
