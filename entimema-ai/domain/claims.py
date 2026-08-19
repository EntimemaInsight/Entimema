from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ClaimStatus(StrEnum):
    REPORTED = "REPORTED"
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    CONTRADICTED = "CONTRADICTED"


class ClaimRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition: str = Field(min_length=1)
    status: ClaimStatus = ClaimStatus.REPORTED
    source: str = Field(min_length=1)
    timestamp: datetime
    scope: str | None = None
    evidence_links: list[str] = Field(default_factory=list)
