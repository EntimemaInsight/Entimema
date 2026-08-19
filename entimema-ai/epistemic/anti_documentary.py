from pydantic import BaseModel, ConfigDict, Field


class ConfirmationDependencyRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    hypothesis_id: str
    originating_evidence_ids: list[str] = Field(default_factory=list)
    later_evidence_id: str
    independent_interpretation_present: bool
    dependency_detected: bool
    blocking: bool


def assess_confirmation_dependency(
    hypothesis_id: str,
    originating_evidence_ids: list[str],
    later_evidence_id: str,
    independent_interpretation: str | None,
) -> ConfirmationDependencyRecord:
    independent = bool(independent_interpretation and independent_interpretation.strip())
    detected = bool(originating_evidence_ids) and not independent
    return ConfirmationDependencyRecord(
        hypothesis_id=hypothesis_id,
        originating_evidence_ids=originating_evidence_ids,
        later_evidence_id=later_evidence_id,
        independent_interpretation_present=independent,
        dependency_detected=detected,
        blocking=detected,
    )
