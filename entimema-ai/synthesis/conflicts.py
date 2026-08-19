from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ConflictCategory(StrEnum):
    DEFINITIONAL = "DEFINITIONAL"
    TEMPORAL = "TEMPORAL"
    SCOPE = "SCOPE"
    ASSUMPTION = "ASSUMPTION"
    METHODOLOGICAL = "METHODOLOGICAL"
    SCENARIO = "SCENARIO"
    EVIDENCE = "EVIDENCE"
    TRUE_CONFLICT = "TRUE_CONFLICT"


class ConflictRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    finding_ids: list[str] = Field(min_length=2)
    category: ConflictCategory
    rationale: str
