from pydantic import BaseModel, ConfigDict, Field

from domain.enums import Materiality


class AssumptionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition: str = Field(min_length=1)
    reason: str = Field(min_length=1)
    materiality: Materiality
    validation_required: bool
    source: str | None = None
    scenario_only: bool = False
