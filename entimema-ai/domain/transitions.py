from datetime import datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class StateTransition(StrEnum):
    INTAKE = "INTAKE"
    CONTEXTUALISING = "CONTEXTUALISING"
    REPAIR = "REPAIR"
    PROBLEM_FORMATION = "PROBLEM_FORMATION"
    HYPOTHESIS_DISCRIMINATION = "HYPOTHESIS_DISCRIMINATION"
    EPISTEMIC_CHALLENGE = "EPISTEMIC_CHALLENGE"
    ROUTING_READY = "ROUTING_READY"
    AGENT_RUNNING = "AGENT_RUNNING"
    RESULT_VALIDATION = "RESULT_VALIDATION"
    SYNTHESIS = "SYNTHESIS"
    CLOSED = "CLOSED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    FORBIDDEN_INFERENCE = "FORBIDDEN_INFERENCE"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"
    TRACEABILITY_FAILURE = "TRACEABILITY_FAILURE"


class TransitionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    transition_id: str = Field(min_length=1)
    session_id: str = Field(min_length=1)
    problem_id: str = Field(min_length=1)
    from_state: StateTransition
    to_state: StateTransition
    trigger: str = Field(min_length=1)
    changed_object_type: str = Field(min_length=1)
    changed_object_id: str | None = None
    previous_value: Any | None = None
    new_value: Any | None = None
    basis: str = Field(min_length=1)
    timestamp: datetime
