from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from domain.enums import EpistemicType


class EvidenceRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition: str = Field(min_length=1)
    evidence_type: EpistemicType
    source: str = Field(min_length=1)
    source_type: str = Field(min_length=1)
    timestamp: datetime
    period_start: datetime | None = None
    period_end: datetime | None = None
    provenance: list[str] = Field(default_factory=list)
    transformations: list[str] = Field(default_factory=list)
    reliability: float = Field(ge=0, le=1)
    scope: str | None = None
    unit: str | None = None
    definition: str | None = None
    concept: str | None = None
    numeric_value: float | None = None
    canonical_key: str | None = None
    period_label: str | None = None
    indicator_direction: str | None = None
    indicator_severity: str | None = None

    @model_validator(mode="after")
    def validate_period(self) -> "EvidenceRecord":
        if self.period_start and self.period_end and self.period_end < self.period_start:
            raise ValueError("period_end cannot precede period_start")
        return self
