"""Canonical models for artifacts, extraction, provenance and admission."""

from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


def utc_now() -> datetime:
    return datetime.now(UTC)


class ArtifactStatus(StrEnum):
    REGISTERED = "REGISTERED"
    VALIDATING = "VALIDATING"
    SECURITY_REVIEW = "SECURITY_REVIEW"
    ACCEPTED = "ACCEPTED"
    EXTRACTING = "EXTRACTING"
    EXTRACTED = "EXTRACTED"
    FAILED = "FAILED"
    REJECTED = "REJECTED"


class AdmissionStatus(StrEnum):
    UNVERIFIED = "UNVERIFIED"
    VALIDATED_EVIDENCE = "VALIDATED_EVIDENCE"
    CONTRADICTED = "CONTRADICTED"
    REQUIRES_CLARIFICATION = "REQUIRES_CLARIFICATION"
    REJECTED = "REJECTED"


class EvidenceRelationType(StrEnum):
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    DERIVES_FROM = "DERIVES_FROM"
    VALIDATES = "VALIDATES"
    SUPERSEDES = "SUPERSEDES"
    RECONCILES_WITH = "RECONCILES_WITH"


class Artifact(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    case_id: str
    owner_id: str
    tenant_id: str
    filename: str
    media_type: str
    byte_size: int = Field(ge=1)
    hash_algorithm: str = "SHA-256"
    content_hash: str
    uploaded_at: datetime = Field(default_factory=utc_now)
    storage_reference: str
    status: ArtifactStatus = ArtifactStatus.REGISTERED
    security_status: str = "NOT_SCANNED"
    schema_version: int = 1


class EvidenceLocation(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    page: int | None = Field(default=None, ge=1)
    region: str | None = None
    sheet: str | None = None
    cell: str | None = None
    row: int | None = Field(default=None, ge=1)
    column: str | None = None


class EvidenceSource(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    artifact_id: str
    extraction_id: str
    location: EvidenceLocation


class EvidenceCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    case_id: str
    proposition: str
    concept: str | None = None
    value: str | float | bool | None = None
    raw_value: str | None = None
    displayed_value: str | None = None
    formula: str | None = None
    value_kind: str = "HARDCODED"
    data_type: str | None = None
    source: EvidenceSource
    extraction_method: str
    confidence: float | None = Field(default=None, ge=0, le=1)
    admission_status: AdmissionStatus = AdmissionStatus.UNVERIFIED
    created_at: datetime = Field(default_factory=utc_now)


class Evidence(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    case_id: str
    candidate_id: str
    proposition: str
    concept: str | None = None
    value: str | float | bool | None = None
    source: EvidenceSource
    validated_at: datetime = Field(default_factory=utc_now)
    validation_id: str
    schema_version: int = 1


class ExtractionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    artifact_id: str
    extractor: str
    extractor_version: str
    started_at: datetime
    completed_at: datetime
    status: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    structured_output_reference: str
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class ValidationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    candidate_id: str
    validator: str
    outcome: AdmissionStatus
    rationale: str
    validated_at: datetime = Field(default_factory=utc_now)
    case_version: int


class EvidenceRelation(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    case_id: str
    subject_id: str
    object_id: str
    relation: EvidenceRelationType
    created_at: datetime = Field(default_factory=utc_now)


class UnknownResolution(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    case_id: str
    unknown_id: str
    evidence_id: str
    artifact_id: str
    resolved_at: datetime = Field(default_factory=utc_now)
    case_version: int
