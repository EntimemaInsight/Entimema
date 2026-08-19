from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.enums import EpistemicVerdict
from domain.problem_state import ProblemState
from orchestrator.plans import PlanType


class EvaluationSeverity(StrEnum):
    S1_COSMETIC = "S1_COSMETIC"
    S2_EFFICIENCY = "S2_EFFICIENCY"
    S3_ANALYTICAL = "S3_ANALYTICAL"
    S4_EPISTEMIC = "S4_EPISTEMIC"
    S5_ARCHITECTURE_CRITICAL = "S5_ARCHITECTURE_CRITICAL"


class AssertionType(StrEnum):
    STATE_EQUALS = "STATE_EQUALS"
    VERDICT_EQUALS = "VERDICT_EQUALS"
    AGENT_SELECTED = "AGENT_SELECTED"
    AGENT_NOT_SELECTED = "AGENT_NOT_SELECTED"
    UNKNOWN_PRESENT = "UNKNOWN_PRESENT"
    ASSUMPTION_ABSENT = "ASSUMPTION_ABSENT"
    FORBIDDEN_INFERENCE_ABSENT = "FORBIDDEN_INFERENCE_ABSENT"
    TRACEABILITY_COMPLETE = "TRACEABILITY_COMPLETE"
    TRUE_CONFLICT_ABSENT = "TRUE_CONFLICT_ABSENT"
    TRUE_CONFLICT_PRESENT = "TRUE_CONFLICT_PRESENT"
    HUMAN_DECISION_REQUIRED = "HUMAN_DECISION_REQUIRED"
    RECOMMENDATION_PRESENT = "RECOMMENDATION_PRESENT"
    RECOMMENDATION_ABSENT = "RECOMMENDATION_ABSENT"


class EvaluationAssertion(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    assertion_type: AssertionType
    expected: str | bool | None = None


class EvaluationExpectedState(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    properties: dict = Field(default_factory=dict)


class EvaluationCase(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    case_id: str
    category: str
    severity: EvaluationSeverity
    initial_problem_state: ProblemState
    expected_pre_routing_verdict: EpistemicVerdict
    expected_orchestration_plan_type: PlanType
    expected_agent_ids: list[str]
    expected_agent_result_statuses: dict[str, str] = Field(default_factory=dict)
    expected_reconciliation_properties: dict = Field(default_factory=dict)
    expected_final_verdict: EpistemicVerdict
    required_assertions: list[EvaluationAssertion] = Field(default_factory=list)
    forbidden_assertions: list[EvaluationAssertion] = Field(default_factory=list)
    requested_capabilities: list[str] = Field(default_factory=list)
    evidence_ids_by_capability: dict[str, list[str]] = Field(default_factory=dict)


class AssertionResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    assertion: EvaluationAssertion
    passed: bool
    detail: str


class EvaluationResult(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    case_id: str
    passed: bool
    severity: EvaluationSeverity
    hard_failures: list[str]
    soft_failures: list[str]
    assertion_results: list[AssertionResult]
    final_synthesis_result: object | None = None
    traceability_complete: bool
    forbidden_inference_detected: bool
    notes: list[str]
