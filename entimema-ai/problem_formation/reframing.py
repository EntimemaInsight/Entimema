from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator

from core.exceptions import TraceabilityError
from domain.enums import Materiality


class ReframingStatus(StrEnum):
    PROPOSED = "PROPOSED"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    SUPERSEDED = "SUPERSEDED"


class ReframingRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    original_problem: str = Field(min_length=1)
    candidate_reframe: str = Field(min_length=1)
    evidence_basis_ids: list[str] = Field(default_factory=list)
    assumptions_required: list[str] = Field(default_factory=list)
    confidence: Materiality
    requires_user_confirmation: bool
    status: ReframingStatus = ReframingStatus.PROPOSED
    changes_decision_objective: bool = False
    changes_problem_object: bool = False
    changes_domain: bool = False
    changes_scope: bool = False

    @model_validator(mode="after")
    def require_traceable_basis(self) -> "ReframingRecord":
        if not self.evidence_basis_ids:
            raise TraceabilityError("problem reframing requires an evidence basis")
        if self.status is ReframingStatus.CONFIRMED and self.requires_user_confirmation:
            raise ValueError("a materially changed reframe requires explicit confirmation first")
        material_change = any(
            (
                self.changes_decision_objective,
                self.changes_problem_object,
                self.changes_domain,
                self.changes_scope,
            )
        )
        if (
            material_change
            and not self.requires_user_confirmation
            and self.status is not ReframingStatus.CONFIRMED
        ):
            raise ValueError("material reframing requires user confirmation")
        return self
