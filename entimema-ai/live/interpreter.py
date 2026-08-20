"""Schema-constrained natural-language boundary for the live runtime."""

from __future__ import annotations

import json
import os
from abc import ABC, abstractmethod
from enum import StrEnum
from typing import Any
from urllib import error, request

from pydantic import BaseModel, ConfigDict, Field, ValidationError

from domain.enums import Materiality

INTERPRETER_SYSTEM_CONTRACT = """You are a linguistic structuring component.
You do not solve the problem or provide financial conclusions. Extract only what is
linguistically supported. UNKNOWN remains UNKNOWN and CLAIM remains REPORTED. An unstated
variable is not an assumption. Do not infer deception, stress, motive, personality,
psychiatric state, protected characteristics, or other hidden psychology. Exploration is
not a decision or commitment. Keep ambiguous references unresolved and ambiguous financial
definitions ambiguous; never choose between material interpretations. Respect the active
sequence and explicit user correction. Do not fit a statement to an active hypothesis.
Return only the supplied JSON schema; never include reasoning or prose."""


class ConversationalAction(StrEnum):
    EXPLORATION = "EXPLORATION"
    CLAIM = "CLAIM"
    DECISION = "DECISION"
    COMMITMENT = "COMMITMENT"
    CORRECTION = "CORRECTION"
    QUESTION = "QUESTION"


class TextCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    text: str = Field(min_length=1)
    source: str = "USER"


class UnknownCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    variable: str = Field(min_length=1)
    why_needed: str = Field(min_length=1)
    materiality: Materiality = Materiality.HIGH


class InterpretationCandidate(BaseModel):
    """Candidates only: this object has no reference to, and cannot mutate, ProblemState."""

    model_config = ConfigDict(extra="forbid", frozen=True)
    conversational_action: ConversationalAction
    declared_problem_candidate: str | None = None
    claim_candidates: list[TextCandidate] = Field(default_factory=list)
    unresolved_reference_candidates: list[str] = Field(default_factory=list)
    definition_ambiguities: list[str] = Field(default_factory=list)
    user_goal_candidate: str | None = None
    decision_candidate: str | None = None
    horizon_candidate: str | None = None
    scope_candidate: str | None = None
    explicit_assumption_candidates: list[TextCandidate] = Field(default_factory=list)
    embedded_hypothesis_candidates: list[TextCandidate] = Field(default_factory=list)
    candidate_unknowns: list[UnknownCandidate] = Field(default_factory=list)
    repair_candidate: str | None = None
    confidence_metadata: dict[str, float] = Field(default_factory=dict)


class InterpreterFailureCategory(StrEnum):
    PROVIDER_HTTP_ERROR = "PROVIDER_HTTP_ERROR"
    PROVIDER_AUTH_ERROR = "PROVIDER_AUTH_ERROR"
    PROVIDER_RATE_LIMIT = "PROVIDER_RATE_LIMIT"
    PROVIDER_MODEL_ERROR = "PROVIDER_MODEL_ERROR"
    PROVIDER_TRANSPORT_ERROR = "PROVIDER_TRANSPORT_ERROR"
    PROVIDER_RESPONSE_ENVELOPE_ERROR = "PROVIDER_RESPONSE_ENVELOPE_ERROR"
    PROVIDER_REFUSAL = "PROVIDER_REFUSAL"
    OUTPUT_JSON_ERROR = "OUTPUT_JSON_ERROR"
    OUTPUT_SCHEMA_ERROR = "OUTPUT_SCHEMA_ERROR"
    CANDIDATE_VALIDATION_ERROR = "CANDIDATE_VALIDATION_ERROR"


class InterpretationError(RuntimeError):
    """Sanitized interpreter failure carrying safe operational metadata."""

    def __init__(
        self,
        category: InterpreterFailureCategory,
        *,
        http_status: int | None = None,
        provider_error_code: str | None = None,
        validation_locations: list[str] | None = None,
        retryable: bool = False,
    ) -> None:
        super().__init__(category.value)
        self.category = category
        self.http_status = http_status
        self.provider_error_code = provider_error_code
        self.validation_locations = validation_locations or []
        self.retryable = retryable

    @property
    def is_provider_failure(self) -> bool:
        return self.category not in {
            InterpreterFailureCategory.OUTPUT_JSON_ERROR,
            InterpreterFailureCategory.OUTPUT_SCHEMA_ERROR,
            InterpreterFailureCategory.CANDIDATE_VALIDATION_ERROR,
        }


def openai_interpretation_schema() -> dict[str, Any]:
    """Explicit transport schema; Pydantic remains the semantic authority."""

    nullable_string = {"type": ["string", "null"]}
    text_candidate = {
        "type": "object",
        "additionalProperties": False,
        "properties": {"text": {"type": "string", "minLength": 1}, "source": {"type": "string"}},
        "required": ["text", "source"],
    }
    unknown_candidate = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "variable": {"type": "string", "minLength": 1},
            "why_needed": {"type": "string", "minLength": 1},
            "materiality": {"type": "string", "enum": [item.value for item in Materiality]},
        },
        "required": ["variable", "why_needed", "materiality"],
    }
    properties: dict[str, Any] = {
        "conversational_action": {
            "type": "string",
            "enum": [item.value for item in ConversationalAction],
        },
        "declared_problem_candidate": nullable_string,
        "claim_candidates": {"type": "array", "items": text_candidate},
        "unresolved_reference_candidates": {"type": "array", "items": {"type": "string"}},
        "definition_ambiguities": {"type": "array", "items": {"type": "string"}},
        "user_goal_candidate": nullable_string,
        "decision_candidate": nullable_string,
        "horizon_candidate": nullable_string,
        "scope_candidate": nullable_string,
        "explicit_assumption_candidates": {"type": "array", "items": text_candidate},
        "embedded_hypothesis_candidates": {"type": "array", "items": text_candidate},
        "candidate_unknowns": {"type": "array", "items": unknown_candidate},
        "repair_candidate": nullable_string,
        # Confidence is deliberately opaque to admission and restricted to an empty object.
        "confidence_metadata": {
            "type": "object",
            "properties": {},
            "required": [],
            "additionalProperties": False,
        },
    }
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": properties,
        "required": list(properties),
    }


class LanguageModelProvider(ABC):
    @abstractmethod
    def interpret_turn(self, *, message: str, context: list[dict[str, Any]]) -> dict[str, Any]:
        """Return schema-shaped JSON, never runtime state."""


class OpenAIInterpreterProvider(LanguageModelProvider):
    """Single server-only OpenAI adapter using strict JSON-schema output."""

    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model or os.getenv("ENTIMEMA_INTERPRETER_MODEL")
        if not self.api_key or not self.model:
            raise InterpretationError(InterpreterFailureCategory.PROVIDER_AUTH_ERROR)

    def interpret_turn(self, *, message: str, context: list[dict[str, Any]]) -> dict[str, Any]:
        body = {
            "model": self.model,
            "input": [
                {"role": "system", "content": INTERPRETER_SYSTEM_CONTRACT},
                {
                    "role": "user",
                    "content": json.dumps(
                        {"context": context, "turn": message}, ensure_ascii=False
                    ),
                },
            ],
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "interpretation_candidate",
                    "strict": True,
                    "schema": openai_interpretation_schema(),
                }
            },
        }
        req = request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(body, ensure_ascii=False).encode(),
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=30) as response:  # noqa: S310 - fixed HTTPS endpoint
                payload = json.load(response)
        except error.HTTPError as exc:
            code = self._safe_error_code(exc)
            category = InterpreterFailureCategory.PROVIDER_HTTP_ERROR
            if exc.code in {401, 403}:
                category = InterpreterFailureCategory.PROVIDER_AUTH_ERROR
            elif exc.code == 429:
                category = InterpreterFailureCategory.PROVIDER_RATE_LIMIT
            elif code in {"model_not_found", "unsupported_model"}:
                category = InterpreterFailureCategory.PROVIDER_MODEL_ERROR
            raise InterpretationError(
                category,
                http_status=exc.code,
                provider_error_code=code,
                retryable=exc.code == 429 or exc.code >= 500,
            ) from exc
        except (error.URLError, TimeoutError) as exc:
            raise InterpretationError(
                InterpreterFailureCategory.PROVIDER_TRANSPORT_ERROR, retryable=True
            ) from exc
        except (json.JSONDecodeError, ValueError) as exc:
            raise InterpretationError(
                InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR, retryable=True
            ) from exc
        return self._extract_output(payload)

    @staticmethod
    def _safe_error_code(exc: error.HTTPError) -> str | None:
        try:
            payload = json.loads(exc.read().decode("utf-8"))
            code = payload.get("error", {}).get("code")
            return code if isinstance(code, str) and len(code) <= 80 else None
        except (AttributeError, UnicodeDecodeError, ValueError):
            return None

    @staticmethod
    def _extract_output(payload: Any) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise InterpretationError(InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR)
        output = payload.get("output")
        if not isinstance(output, list) or not output:
            raise InterpretationError(InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR)
        for item in output:
            if not isinstance(item, dict):
                continue
            content = item.get("content")
            if not isinstance(content, list):
                continue
            for part in content:
                if not isinstance(part, dict):
                    continue
                if part.get("type") == "refusal" or "refusal" in part:
                    raise InterpretationError(InterpreterFailureCategory.PROVIDER_REFUSAL)
                text = part.get("text")
                if part.get("type") in {"output_text", None} and isinstance(text, str):
                    try:
                        parsed = json.loads(text)
                    except json.JSONDecodeError as exc:
                        raise InterpretationError(
                            InterpreterFailureCategory.OUTPUT_JSON_ERROR
                        ) from exc
                    if not isinstance(parsed, dict):
                        raise InterpretationError(InterpreterFailureCategory.OUTPUT_SCHEMA_ERROR)
                    return parsed
        raise InterpretationError(InterpreterFailureCategory.PROVIDER_RESPONSE_ENVELOPE_ERROR)


class LinguisticInterpreter:
    def __init__(self, provider: LanguageModelProvider) -> None:
        self.provider = provider

    def interpret(self, *, message: str, context: list[dict[str, Any]]) -> InterpretationCandidate:
        raw = self.provider.interpret_turn(message=message, context=context)
        try:
            return InterpretationCandidate.model_validate(raw)
        except ValidationError as exc:
            locations = [".".join(map(str, error["loc"])) for error in exc.errors()]
            raise InterpretationError(
                InterpreterFailureCategory.CANDIDATE_VALIDATION_ERROR,
                validation_locations=locations,
            ) from exc
