from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

SELF_REPAIR_PREFERRED = True


class RepairType(StrEnum):
    REFERENCE = "REFERENCE"
    DEFINITION = "DEFINITION"
    ENTITY = "ENTITY"
    UNIT = "UNIT"
    PERIOD = "PERIOD"
    SCOPE = "SCOPE"
    SEQUENCE = "SEQUENCE"


class RepairStatus(StrEnum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"
    UNRESOLVABLE = "UNRESOLVABLE"


class RepairRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    repair_type: RepairType
    target: str = Field(min_length=1)
    description: str = Field(min_length=1)
    candidate_interpretations: list[str] = Field(default_factory=list)
    status: RepairStatus = RepairStatus.OPEN
    material: bool = True
    opened_at: datetime
    resolved_at: datetime | None = None
