from enum import IntEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

from core.exceptions import ForbiddenInferenceError
from core.guardrails import validate_candidate_inference
from domain.enums import EpistemicType
from domain.hypotheses import HypothesisRecord, HypothesisStatus
from domain.problem_state import ProblemState
from epistemic.assumptions import detect_assumption_leakage


class InferenceRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    conclusion: str
    premise_ids: list[str] = Field(default_factory=list)
    methodology: str
    rule: str
    assumption_ids: list[str] = Field(default_factory=list)
    alternative_hypothesis_ids: list[str] = Field(default_factory=list)
    uncertainty: str
    falsification_condition: str | None = None
    source: str
    trigger: str = ""
    material: bool = True
    scope: str | None = None
    population_match: bool = True
    horizon_match: bool = True
    domain_match: bool = True
    method_match: bool = True


class InferenceAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    inference_id: str
    premises_registered: bool
    premises_admissible: bool
    assumptions_registered: bool
    methodology_applicable: bool
    scope_match: bool
    forbidden_inference: bool
    traceable: bool
    admissible: bool
    blocking_reasons: list[str] = Field(default_factory=list)


def assess_inference(inference: InferenceRecord, state: ProblemState) -> InferenceAssessment:
    registration = detect_assumption_leakage(state, inference.premise_ids, inference.assumption_ids)
    forbidden = False
    try:
        validate_candidate_inference(inference.trigger, inference.conclusion)
    except ForbiddenInferenceError:
        forbidden = True
    methodology = bool(
        inference.methodology.strip() and inference.rule.strip() and inference.method_match
    )
    scope = all(
        (
            inference.population_match,
            inference.horizon_match,
            inference.domain_match,
            not state.domain_scope
            or inference.scope is None
            or inference.scope in state.domain_scope,
        )
    )
    reasons = []
    if registration.assumption_leakage:
        reasons.append("ASSUMPTION_LEAKAGE:" + ",".join(registration.unregistered))
    if forbidden:
        reasons.append("FORBIDDEN_INFERENCE")
    if not methodology:
        reasons.append("METHODOLOGY_NOT_APPLICABLE")
    if not scope:
        reasons.append("OUT_OF_SCOPE")
    traceable = bool(inference.premise_ids) and not registration.assumption_leakage
    if inference.material and not traceable:
        reasons.append("TRACEABILITY_FAILURE")
    admissible = not reasons
    return InferenceAssessment(
        inference_id=inference.id,
        premises_registered=not registration.assumption_leakage,
        premises_admissible=not registration.assumption_leakage,
        assumptions_registered=all(
            item in {record.id for record in state.assumptions} for item in inference.assumption_ids
        ),
        methodology_applicable=methodology,
        scope_match=scope,
        forbidden_inference=forbidden,
        traceable=traceable,
        admissible=admissible,
        blocking_reasons=reasons,
    )


class HypothesisAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    hypothesis_id: str
    testable: bool
    observable_implications_present: bool
    falsification_condition_present: bool
    evidence_for: list[str]
    evidence_against: list[str]
    admissible: bool
    status: HypothesisStatus


def assess_hypothesis(hypothesis: HypothesisRecord) -> HypothesisAssessment:
    observable = bool(hypothesis.observable_implications)
    falsifiable = bool(hypothesis.falsification_condition)
    admissible = (
        hypothesis.testable and observable and falsifiable and not hypothesis.forbidden_inference
    )
    status = hypothesis.status if admissible else HypothesisStatus.UNTESTABLE
    return HypothesisAssessment(
        hypothesis_id=hypothesis.id,
        testable=hypothesis.testable,
        observable_implications_present=observable,
        falsification_condition_present=falsifiable,
        evidence_for=hypothesis.supporting_evidence_ids,
        evidence_against=hypothesis.contradicting_evidence_ids,
        admissible=admissible,
        status=status,
    )


class ClassificationMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    classification: str
    classification_source: str
    scope: str
    horizon: str
    authority: str
    essentialised: bool = False

    @property
    def admissible(self) -> bool:
        return not self.essentialised and all(
            (self.classification_source, self.scope, self.horizon, self.authority)
        )


class ModelOutputAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    model_output_id: str
    model_id: str
    model_version: str
    target: str
    horizon: str
    population: str
    input_ids: list[str]
    population_match: bool
    horizon_match: bool
    admissible: bool
    issues: list[str] = Field(default_factory=list)


class CalculationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    formula: str
    input_ids: list[str]
    units: list[str]
    transformations: list[str]
    result: Any
    output_unit: str

    def inputs_resolve(self, registered_ids: set[str]) -> bool:
        return bool(self.input_ids) and set(self.input_ids) <= registered_ids


class CausalLanguageLevel(IntEnum):
    ASSOCIATION = 1
    CONTRIBUTION = 2
    PRIMARY_DRIVER = 3
    CAUSAL_CONCLUSION = 4


class CausalClaimAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    requested_level: CausalLanguageLevel
    evidence_support_level: CausalLanguageLevel
    admissible_level: CausalLanguageLevel
    downgraded: bool
    rationale: str


def assess_causal_claim(
    requested: CausalLanguageLevel, supported: CausalLanguageLevel
) -> CausalClaimAssessment:
    admissible = min(requested, supported)
    return CausalClaimAssessment(
        requested_level=requested,
        evidence_support_level=supported,
        admissible_level=admissible,
        downgraded=admissible < requested,
        rationale="Causal language cannot exceed structured evidence support",
    )


class QuantifiedLabel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    label: str
    threshold: str | None = None
    comparative_basis: str | None = None
    qualitative_basis: str | None = None

    @model_validator(mode="after")
    def require_basis(self) -> "QuantifiedLabel":
        if not any((self.threshold, self.comparative_basis, self.qualitative_basis)):
            raise ValueError("materiality label requires an explicit basis")
        return self


def validate_evidence_type(actual: EpistemicType, represented_as: EpistemicType) -> bool:
    return actual is represented_as
