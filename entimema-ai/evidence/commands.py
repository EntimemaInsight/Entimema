"""Typed authoritative evidence mutation contracts."""

from pydantic import BaseModel, ConfigDict, Field

from evidence.models import AdmissionStatus


class RegisterArtifact(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    command_id: str = Field(min_length=1)
    case_id: str = Field(min_length=1)
    expected_version: int = Field(ge=0)
    filename: str = Field(min_length=1)
    media_type: str = Field(min_length=1)


class ProcessArtifact(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    command_id: str = Field(min_length=1)
    case_id: str = Field(min_length=1)
    artifact_id: str = Field(min_length=1)


class ValidateEvidence(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    command_id: str = Field(min_length=1)
    case_id: str = Field(min_length=1)
    candidate_id: str = Field(min_length=1)
    expected_version: int = Field(ge=0)
    outcome: AdmissionStatus
    rationale: str = Field(min_length=1)
    unknown_id: str | None = None


class AdmitEvidence(ValidateEvidence):
    outcome: AdmissionStatus = AdmissionStatus.VALIDATED_EVIDENCE
