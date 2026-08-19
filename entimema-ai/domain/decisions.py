from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from core.exceptions import TraceabilityError
from domain.enums import EpistemicVerdict


class DecisionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision_id: str = Field(min_length=1)
    problem_id: str = Field(min_length=1)
    recommendation: str = Field(min_length=1)
    evidence_path: list[str]
    inference_path: list[str]
    assumptions: list[str] = Field(default_factory=list)
    unresolved_unknowns: list[str] = Field(default_factory=list)
    epistemic_verdict: EpistemicVerdict
    human_decision_required: bool
    created_at: datetime

    @model_validator(mode="after")
    def require_traceability(self) -> "DecisionRecord":
        if not self.evidence_path:
            raise TraceabilityError("material decisions require a non-empty evidence_path")
        if not self.inference_path:
            raise TraceabilityError("material decisions require a non-empty inference_path")
        return self
