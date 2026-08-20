"""Controlled commands for artifact registration, processing and evidence admission."""

import hashlib
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from evidence.extractors import EXTRACTORS, ExtractionError
from evidence.models import (
    AdmissionStatus,
    Artifact,
    ArtifactStatus,
    Evidence,
    EvidenceRelation,
    EvidenceRelationType,
    ExtractionRecord,
    UnknownResolution,
    ValidationRecord,
)
from evidence.repository import EvidenceRepository
from evidence.store import ArtifactStore, DeferredMalwareScanner, MalwareScanner
from live.session import CaseNotFoundError, SessionStore

SUPPORTED_EXTENSIONS = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "text/csv": ".csv",
}
MAX_ARTIFACT_BYTES = 25 * 1024 * 1024


class EvidenceAccessError(CaseNotFoundError):
    pass


class EvidenceService:
    def __init__(
        self,
        cases: SessionStore,
        repository: EvidenceRepository,
        artifacts: ArtifactStore,
        scanner: MalwareScanner | None = None,
    ) -> None:
        self.cases, self.repository, self.artifacts = cases, repository, artifacts
        self.scanner = scanner or DeferredMalwareScanner()

    def register(self, *, case_id, owner_id, tenant_id, filename, media_type, content, command_id):
        previous = self.repository.command_result(case_id, command_id)
        if previous is not None:
            return previous
        case = self.cases.get(case_id, owner_id=owner_id)
        if case.tenant_id != tenant_id:
            raise EvidenceAccessError(case_id)
        digest = hashlib.sha256(content).hexdigest()
        duplicate = self.repository.find_artifact_by_hash(case_id, digest)
        if duplicate:
            response = {"artifact": duplicate.model_dump(mode="json"), "duplicate": True}
            self.repository.save_command(case_id, command_id, response)
            return response
        artifact_id = str(uuid4())
        status, reason = self._validate(filename, media_type, content)
        security = (
            self.scanner.scan(content) if status is ArtifactStatus.ACCEPTED else "NOT_SCANNED"
        )
        if security == "INFECTED":
            status, reason = ArtifactStatus.REJECTED, "malware scanner rejected artifact"
        reference = (
            self.artifacts.put(case_id, artifact_id, content)
            if status is ArtifactStatus.ACCEPTED
            else "rejected://not-stored"
        )
        artifact = Artifact(
            id=artifact_id,
            case_id=case_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            filename=Path(filename).name,
            media_type=media_type,
            byte_size=len(content),
            content_hash=digest,
            storage_reference=reference,
            status=status,
            security_status=security,
        )
        self.repository.replace_artifact(artifact)
        response = {
            "artifact": artifact.model_dump(mode="json"),
            "duplicate": False,
            "validation_error": reason,
        }
        self.repository.save_command(case_id, command_id, response)
        return response

    def process(self, *, case_id, artifact_id, owner_id, command_id):
        previous = self.repository.command_result(case_id, command_id)
        if previous is not None:
            return previous
        self.cases.get(case_id, owner_id=owner_id)
        artifact = self.repository.get_artifact(artifact_id, case_id)
        if artifact.owner_id != owner_id:
            raise EvidenceAccessError(artifact_id)
        if artifact.status not in {ArtifactStatus.ACCEPTED, ArtifactStatus.EXTRACTED}:
            raise ValueError("artifact has not passed validation")
        existing = [
            x
            for x in self.repository.extractions(case_id)
            if x.artifact_id == artifact_id and x.status == "COMPLETED"
        ]
        if existing:
            response = self._projection(case_id)
            self.repository.save_command(case_id, command_id, response)
            return response
        extraction_id, started = str(uuid4()), datetime.now(UTC)
        errors, warnings = [], []
        try:
            candidates = EXTRACTORS[artifact.media_type].extract(
                artifact_id, extraction_id, self.artifacts.get(artifact.storage_reference)
            )
            candidates = [x.model_copy(update={"case_id": case_id}) for x in candidates]
            for candidate in candidates:
                self.repository.add("candidate", candidate, artifact_id=artifact_id)
            prior = [
                item
                for item in self.repository.candidates(case_id)
                if item.source.artifact_id != artifact_id
            ]
            for candidate in candidates:
                for other in prior:
                    if (
                        candidate.concept
                        and candidate.concept == other.concept
                        and candidate.value != other.value
                    ):
                        relation = EvidenceRelation(
                            id=f"contradiction:{other.id}:{candidate.id}",
                            case_id=case_id,
                            subject_id=other.id,
                            object_id=candidate.id,
                            relation=EvidenceRelationType.CONTRADICTS,
                        )
                        self.repository.add("relation", relation, artifact_id=artifact_id)
            status = "COMPLETED"
            if artifact.media_type == "application/pdf" and not candidates:
                warnings.append("No deterministic text layer found; OCR is not configured.")
        except ExtractionError as exc:
            candidates, status, errors = [], "FAILED", [str(exc)]
        record = ExtractionRecord(
            id=extraction_id,
            artifact_id=artifact_id,
            extractor=EXTRACTORS[artifact.media_type].name,
            extractor_version=EXTRACTORS[artifact.media_type].version,
            started_at=started,
            completed_at=datetime.now(UTC),
            status=status,
            metadata={"candidate_count": len(candidates)},
            structured_output_reference=f"evidence://{case_id}/extractions/{extraction_id}",
            errors=errors,
            warnings=warnings,
        )
        self.repository.add("extraction", record, artifact_id=artifact_id)
        self.repository.replace_artifact(
            artifact.model_copy(
                update={
                    "status": ArtifactStatus.EXTRACTED
                    if status == "COMPLETED"
                    else ArtifactStatus.FAILED
                }
            )
        )
        response = self._projection(case_id)
        self.repository.save_command(case_id, command_id, response)
        return response

    def validate(
        self,
        *,
        case_id,
        candidate_id,
        owner_id,
        command_id,
        outcome,
        rationale,
        expected_version,
        unknown_id=None,
    ):
        previous = self.repository.command_result(case_id, command_id)
        if previous is not None:
            return previous
        case = self.cases.get(case_id, owner_id=owner_id)
        if case.state_version != expected_version:
            raise ValueError("stale case version")
        candidate = next(
            (x for x in self.repository.candidates(case_id) if x.id == candidate_id), None
        )
        if candidate is None:
            raise EvidenceAccessError(candidate_id)
        admission = AdmissionStatus(outcome)
        validation_id, new_version = str(uuid4()), case.state_version + 1
        validation = ValidationRecord(
            id=validation_id,
            candidate_id=candidate_id,
            validator=owner_id,
            outcome=admission,
            rationale=rationale,
            case_version=new_version,
        )
        self.repository.add("validation", validation, artifact_id=candidate.source.artifact_id)
        if admission is AdmissionStatus.VALIDATED_EVIDENCE:
            evidence = Evidence(
                id=str(uuid4()),
                case_id=case_id,
                candidate_id=candidate_id,
                proposition=candidate.proposition,
                concept=candidate.concept,
                value=candidate.value,
                source=candidate.source,
                validation_id=validation_id,
            )
            self.repository.add("evidence", evidence, artifact_id=candidate.source.artifact_id)
            if unknown_id:
                if not any(x.id == unknown_id for x in case.problem_state.unknowns):
                    raise ValueError("unknown does not belong to case")
                resolution = UnknownResolution(
                    id=f"{unknown_id}:{evidence.id}",
                    case_id=case_id,
                    unknown_id=unknown_id,
                    evidence_id=evidence.id,
                    artifact_id=candidate.source.artifact_id,
                    case_version=new_version,
                )
                self.repository.add(
                    "resolution", resolution, artifact_id=candidate.source.artifact_id
                )
        case.state_version = new_version
        case.updated_at = datetime.now(UTC)
        case.current_projection = self.merge_projection(case.current_projection, case_id)
        self.cases.save(case, expected_version=expected_version)
        response = self._projection(case_id) | {"state_version": new_version}
        self.repository.save_command(case_id, command_id, response)
        return response

    def projection(self, *, case_id, owner_id):
        self.cases.get(case_id, owner_id=owner_id)
        return self._projection(case_id)

    def merge_projection(self, base, case_id):
        evidence = self._projection(case_id)
        return base | evidence

    def _projection(self, case_id):
        artifacts = self.repository.artifacts(case_id)
        candidates = self.repository.candidates(case_id)
        validated = self.repository.evidence(case_id)
        validated_candidate_ids = {x.candidate_id for x in validated}
        contradictions = [
            item
            for item in self.repository.relations(case_id)
            if item.relation is EvidenceRelationType.CONTRADICTS
        ]
        return {
            "artifacts": [x.model_dump(mode="json") for x in artifacts],
            "validated_evidence": [x.model_dump(mode="json") for x in validated],
            "unverified_evidence": [
                x.model_dump(mode="json") for x in candidates if x.id not in validated_candidate_ids
            ],
            "evidence_contradictions": [x.model_dump(mode="json") for x in contradictions],
            "evidence_next_best_question": (
                f"Which source should govern the conflicting evidence {contradictions[0].id}?"
                if contradictions
                else None
            ),
            "evidence_resolved_unknowns": [
                x.model_dump(mode="json") for x in self.repository.resolutions(case_id)
            ],
            "extraction_records": [
                x.model_dump(mode="json") for x in self.repository.extractions(case_id)
            ],
        }

    @staticmethod
    def _validate(filename, media_type, content):
        if not content:
            return ArtifactStatus.REJECTED, "empty artifact"
        if len(content) > MAX_ARTIFACT_BYTES:
            return ArtifactStatus.REJECTED, "artifact exceeds size limit"
        extension = Path(filename).suffix.lower()
        if media_type not in SUPPORTED_EXTENSIONS:
            return ArtifactStatus.REJECTED, "unsupported media type"
        if extension != SUPPORTED_EXTENSIONS[media_type]:
            return ArtifactStatus.REJECTED, "filename extension does not match media type"
        signatures_ok = (
            media_type == "text/csv"
            or (media_type == "application/pdf" and content.startswith(b"%PDF-"))
            or (media_type.endswith("spreadsheetml.sheet") and content.startswith(b"PK"))
        )
        if not signatures_ok:
            return ArtifactStatus.REJECTED, "content signature does not match media type"
        return ArtifactStatus.ACCEPTED, None
