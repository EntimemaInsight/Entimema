from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.enums import EpistemicVerdict


class RequiredNextAction(StrEnum):
    PROCEED = "PROCEED"
    REPAIR = "REPAIR"
    REQUEST_EVIDENCE = "REQUEST_EVIDENCE"
    RESOLVE_CONTRADICTION = "RESOLVE_CONTRADICTION"
    REMOVE_FORBIDDEN_INFERENCE = "REMOVE_FORBIDDEN_INFERENCE"
    RECALCULATE = "RECALCULATE"
    REVALIDATE_MODEL = "REVALIDATE_MODEL"
    STOP_INSUFFICIENT = "STOP_INSUFFICIENT"


class TraceabilityStatus(StrEnum):
    COMPLETE = "COMPLETE"
    INCOMPLETE = "INCOMPLETE"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class EpistemicAuditRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    audit_id: str = Field(min_length=1)
    object_id: str = Field(min_length=1)
    validation_type: str = Field(min_length=1)
    previous_status: str | None = None
    new_status: str = Field(min_length=1)
    rule_id: str = Field(min_length=1)
    basis_ids: list[str] = Field(default_factory=list)
    timestamp: datetime


class EpistemicValidationResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    verdict: EpistemicVerdict
    validated_object_ids: list[str] = Field(default_factory=list)
    rejected_object_ids: list[str] = Field(default_factory=list)
    unresolved_object_ids: list[str] = Field(default_factory=list)
    critical_assumption_ids: list[str] = Field(default_factory=list)
    contradiction_ids: list[str] = Field(default_factory=list)
    forbidden_inference_ids: list[str] = Field(default_factory=list)
    traceability_status: TraceabilityStatus
    blocking_reasons: list[str] = Field(default_factory=list)
    required_next_action: RequiredNextAction
    audit_records: list[EpistemicAuditRecord] = Field(default_factory=list)
