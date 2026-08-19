from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ConversationMode(StrEnum):
    EXPLORATION = "EXPLORATION"
    ANALYSIS = "ANALYSIS"
    DECISION = "DECISION"
    COMMITMENT = "COMMITMENT"


class ConversationState(BaseModel):
    model_config = ConfigDict(extra="forbid")

    current_activity: str | None = None
    active_sequence: str | None = None
    unresolved_references: list[str] = Field(default_factory=list)
    open_repairs: list[str] = Field(default_factory=list)
    user_invoked_categories: list[str] = Field(default_factory=list)
    rejected_interpretations: list[str] = Field(default_factory=list)
    explicit_commitments: list[str] = Field(default_factory=list)
    mode: ConversationMode = ConversationMode.EXPLORATION
