from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ContradictionType(StrEnum):
    DEFINITIONAL = "DEFINITIONAL"
    TEMPORAL = "TEMPORAL"
    SCOPE = "SCOPE"
    MEASUREMENT = "MEASUREMENT"
    SOURCE = "SOURCE"
    TRUE_LOGICAL_CONTRADICTION = "TRUE_LOGICAL_CONTRADICTION"


class ContradictionStatus(StrEnum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"
    TRUE_CONTRADICTION = "TRUE_CONTRADICTION"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"


class ContradictionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition_a: str = Field(min_length=1)
    proposition_b: str = Field(min_length=1)
    evidence_a_ids: list[str] = Field(default_factory=list)
    evidence_b_ids: list[str] = Field(default_factory=list)
    contradiction_type: ContradictionType
    status: ContradictionStatus = ContradictionStatus.OPEN
    possible_resolution: str | None = None

    @model_validator(mode="after")
    def preserve_distinct_propositions(self) -> "ContradictionRecord":
        if self.proposition_a == self.proposition_b:
            raise ValueError("a contradiction requires two distinct propositions")
        return self
