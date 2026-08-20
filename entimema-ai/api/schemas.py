from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

from live.session import ConversationTurnView, RuntimeMode

MAX_MESSAGE_CHARACTERS = 8_000


class CreateSessionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    mode: RuntimeMode
    fixture_id: str | None = None


class LiveMessageRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    message: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARACTERS)
    client_turn_id: str = Field(min_length=1, max_length=128)
    selected_unknown_id: str | None = None
    session_context_version: int | None = Field(default=None, ge=0)

    @field_validator("message")
    @classmethod
    def non_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("message must not be blank")
        return value


class RuntimeErrorView(BaseModel):
    code: str
    message: str
    retryable: bool = False


class CreateSessionResponse(BaseModel):
    session_id: str
    mode: RuntimeMode
    workspace_projection: dict[str, Any]
    conversation: list[ConversationTurnView]
    runtime_status: str
    state_version: int


class LiveMessageResponse(BaseModel):
    session_id: str
    accepted_turn_id: str
    assistant_message: str | None = None
    next_best_question: str | None = None
    dialogue_state: str
    problem_state_version: int
    workspace_projection: dict[str, Any]
    conversation: list[ConversationTurnView]
    runtime_actions: list[str]
    epistemic_verdict: str
    decision_readiness: str
    execution_summary: dict[str, Any]
    errors: list[RuntimeErrorView] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
