from pydantic import BaseModel, ConfigDict, Field

from domain.enums import Materiality


class UnknownRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    variable: str = Field(min_length=1)
    why_needed: str = Field(min_length=1)
    materiality: Materiality
    resolvable: bool
    acquisition_cost: float | None = Field(default=None, ge=0)
    hypotheses_affected: list[str] = Field(default_factory=list)
