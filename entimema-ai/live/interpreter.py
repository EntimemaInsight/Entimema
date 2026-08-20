"""Schema-constrained natural-language boundary for the live runtime."""

from __future__ import annotations

import json
import os
from abc import ABC, abstractmethod
from enum import StrEnum
from typing import Any
from urllib import error, request

from pydantic import BaseModel, ConfigDict, Field, ValidationError

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
    materiality: str = "HIGH"


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


class InterpretationError(RuntimeError):
    pass


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
            raise InterpretationError("LIVE interpreter is not configured")

    def interpret_turn(self, *, message: str, context: list[dict[str, Any]]) -> dict[str, Any]:
        body = {
            "model": self.model,
            "input": [
                {"role": "system", "content": INTERPRETER_SYSTEM_CONTRACT},
                {"role": "user", "content": json.dumps({"context": context, "turn": message})},
            ],
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "interpretation_candidate",
                    "strict": True,
                    "schema": InterpretationCandidate.model_json_schema(),
                }
            },
        }
        req = request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(body).encode(),
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=30) as response:  # noqa: S310 - fixed HTTPS endpoint
                payload = json.load(response)
            return json.loads(payload["output"][0]["content"][0]["text"])
        except (error.URLError, KeyError, ValueError, json.JSONDecodeError) as exc:
            raise InterpretationError("Interpreter request failed") from exc


class LinguisticInterpreter:
    def __init__(self, provider: LanguageModelProvider) -> None:
        self.provider = provider

    def interpret(self, *, message: str, context: list[dict[str, Any]]) -> InterpretationCandidate:
        try:
            raw = self.provider.interpret_turn(message=message, context=context)
            return InterpretationCandidate.model_validate(raw)
        except ValidationError as exc:
            raise InterpretationError("Interpreter output failed schema validation") from exc
