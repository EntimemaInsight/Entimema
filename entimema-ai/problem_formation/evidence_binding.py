from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class EvidenceRelationship(StrEnum):
    SUPPORTS = "SUPPORTS"
    PARTIALLY_SUPPORTS = "PARTIALLY_SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    NEUTRAL = "NEUTRAL"
    INSUFFICIENT = "INSUFFICIENT"


class EvidenceLink(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    claim_id: str = Field(min_length=1)
    evidence_id: str = Field(min_length=1)
    relationship: EvidenceRelationship
