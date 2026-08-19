from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class HypothesisStatus(StrEnum):
    ACTIVE = "ACTIVE"
    SUPPORTED = "SUPPORTED"
    WEAKENED = "WEAKENED"
    CONTRADICTED = "CONTRADICTED"
    REJECTED = "REJECTED"
    UNTESTABLE = "UNTESTABLE"


class HypothesisRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition: str = Field(min_length=1)
    status: HypothesisStatus = HypothesisStatus.ACTIVE
    supporting_evidence_ids: list[str] = Field(default_factory=list)
    contradicting_evidence_ids: list[str] = Field(default_factory=list)
    unresolved_unknown_ids: list[str] = Field(default_factory=list)
    observable_implications: list[str] = Field(default_factory=list)
    falsification_condition: str | None = None
    source: str = Field(min_length=1)
