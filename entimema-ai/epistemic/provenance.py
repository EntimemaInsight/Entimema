from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.claims import ClaimRecord
from domain.evidence import EvidenceRecord


class EvidenceProvenance(StrEnum):
    USER_ORIGINATED = "USER_ORIGINATED"
    SYSTEM_PROPOSED = "SYSTEM_PROPOSED"
    USER_CONFIRMED_SYSTEM_PROPOSAL = "USER_CONFIRMED_SYSTEM_PROPOSAL"
    DOMAIN_AGENT_PRODUCED = "DOMAIN_AGENT_PRODUCED"


class ProvenanceAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    evidence_id: str
    complete: bool
    source_known: bool
    transformation_chain_complete: bool
    scope_known: bool
    period_known: bool
    issues: list[str] = Field(default_factory=list)


def assess_provenance(evidence: EvidenceRecord) -> ProvenanceAssessment:
    source_known = bool(evidence.source.strip() and evidence.source_type.strip())
    transformations_complete = bool(evidence.provenance) and all(
        item.strip() for item in evidence.transformations
    )
    scope_known = bool(evidence.scope)
    period_known = evidence.period_start is not None and evidence.period_end is not None
    issues = []
    if not source_known:
        issues.append("SOURCE_UNKNOWN")
    if not transformations_complete:
        issues.append("TRANSFORMATION_CHAIN_INCOMPLETE")
    if not scope_known:
        issues.append("SCOPE_UNKNOWN")
    if not period_known:
        issues.append("PERIOD_UNKNOWN")
    return ProvenanceAssessment(
        evidence_id=evidence.id,
        complete=not issues,
        source_known=source_known,
        transformation_chain_complete=transformations_complete,
        scope_known=scope_known,
        period_known=period_known,
        issues=issues,
    )


class ClaimValidationStatus(StrEnum):
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    UNSUPPORTED = "UNSUPPORTED"
    CONTRADICTED = "CONTRADICTED"
    INSUFFICIENT = "INSUFFICIENT"


class ClaimValidationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    claim_id: str
    supporting_evidence_ids: list[str] = Field(default_factory=list)
    contradicting_evidence_ids: list[str] = Field(default_factory=list)
    status: ClaimValidationStatus
    rationale: str


def validate_claim(
    claim: ClaimRecord,
    supporting_evidence_ids: list[str],
    contradicting_evidence_ids: list[str] | None = None,
) -> ClaimValidationRecord:
    contradicting = contradicting_evidence_ids or []
    if contradicting and supporting_evidence_ids:
        status = ClaimValidationStatus.PARTIALLY_SUPPORTED
    elif contradicting:
        status = ClaimValidationStatus.CONTRADICTED
    elif supporting_evidence_ids:
        status = ClaimValidationStatus.SUPPORTED
    else:
        status = ClaimValidationStatus.INSUFFICIENT
    return ClaimValidationRecord(
        claim_id=claim.id,
        supporting_evidence_ids=supporting_evidence_ids,
        contradicting_evidence_ids=contradicting,
        status=status,
        rationale="Separate validation relation; ClaimRecord remains unchanged",
    )
