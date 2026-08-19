from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ConciergeActionType(StrEnum):
    LISTEN = "LISTEN"
    RESOLVE_REFERENCE = "RESOLVE_REFERENCE"
    REPAIR = "REPAIR"
    RECORD_CLAIM = "RECORD_CLAIM"
    RECORD_EVIDENCE = "RECORD_EVIDENCE"
    MARK_UNKNOWN = "MARK_UNKNOWN"
    REGISTER_ASSUMPTION = "REGISTER_ASSUMPTION"
    GENERATE_HYPOTHESIS = "GENERATE_HYPOTHESIS"
    UPDATE_HYPOTHESIS = "UPDATE_HYPOTHESIS"
    REGISTER_CONTRADICTION = "REGISTER_CONTRADICTION"
    ASK_NEXT_BEST_QUESTION = "ASK_NEXT_BEST_QUESTION"
    CHALLENGE = "CHALLENGE"
    ROUTE = "ROUTE"
    SYNTHESISE = "SYNTHESISE"
    STOP_INSUFFICIENT = "STOP_INSUFFICIENT"


class DialogueAction(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    action_type: ConciergeActionType
    object_ids: list[str] = Field(default_factory=list)
    detail: str | None = None
