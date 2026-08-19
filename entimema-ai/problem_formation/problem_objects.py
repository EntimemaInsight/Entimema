from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ProblemObjectType(StrEnum):
    ENTITY = "ENTITY"
    PROCESS = "PROCESS"
    TRANSACTION = "TRANSACTION"
    PORTFOLIO = "PORTFOLIO"
    PRODUCT = "PRODUCT"
    MODEL = "MODEL"
    DECISION = "DECISION"
    RELATIONSHIP = "RELATIONSHIP"
    WORKFLOW = "WORKFLOW"
    SYSTEM = "SYSTEM"
    UNKNOWN = "UNKNOWN"


class GoalType(StrEnum):
    DIAGNOSE = "DIAGNOSE"
    EXPLAIN = "EXPLAIN"
    FORECAST = "FORECAST"
    DECIDE = "DECIDE"
    MONITOR = "MONITOR"
    COMPARE = "COMPARE"
    VALIDATE = "VALIDATE"
    AUTOMATE = "AUTOMATE"
    RECONCILE = "RECONCILE"
    UNKNOWN = "UNKNOWN"


class ProblemGranularity(StrEnum):
    STRATEGIC = "STRATEGIC"
    TACTICAL = "TACTICAL"
    OPERATIONAL = "OPERATIONAL"
    TRANSACTIONAL = "TRANSACTIONAL"
    UNKNOWN = "UNKNOWN"


class ProblemLifecycle(StrEnum):
    DECLARED = "DECLARED"
    CLARIFYING = "CLARIFYING"
    STRUCTURED = "STRUCTURED"
    HYPOTHESIS_ACTIVE = "HYPOTHESIS_ACTIVE"
    OPERATIONALISED = "OPERATIONALISED"
    ROUTED = "ROUTED"
    REOPENED = "REOPENED"
    CLOSED = "CLOSED"


class ConstraintType(StrEnum):
    HARD = "HARD"
    SOFT = "SOFT"
    ASSUMED = "ASSUMED"
    UNKNOWN = "UNKNOWN"


class CategoryProvenance(StrEnum):
    USER_ORIGINATED = "USER_ORIGINATED"
    SYSTEM_PROPOSED = "SYSTEM_PROPOSED"
    USER_CONFIRMED = "USER_CONFIRMED"


class SpeechActType(StrEnum):
    EXPLORATION = "EXPLORATION"
    CLAIM = "CLAIM"
    DECISION = "DECISION"
    COMMITMENT = "COMMITMENT"


class InterpretationStatus(StrEnum):
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    SUPERSEDED = "SUPERSEDED"


class ProblemCompleteness(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    object_defined: bool
    goal_defined: bool
    decision_defined: bool
    horizon_defined: bool
    scope_defined: bool
    phenomenon_testable: bool
    critical_repairs_closed: bool


class ConstraintRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    id: str = Field(min_length=1)
    statement: str = Field(min_length=1)
    constraint_type: ConstraintType = ConstraintType.UNKNOWN
    source: str = Field(min_length=1)
    basis: str | None = None
    material: bool = True


class SourceCategoryMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    category: str = Field(min_length=1)
    provenance: CategoryProvenance
    source_domain: str | None = None
    definition: str | None = None
    scope: str | None = None
    horizon: str | None = None
    operationally_relevant: bool = True
    supersedes: str | None = None


class InterpretationRecord(BaseModel):
    """Sequential interpretation history, including user self-repair."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    value: str = Field(min_length=1)
    source: CategoryProvenance
    status: InterpretationStatus = InterpretationStatus.ACTIVE
    supersedes: str | None = None


class SpeechActRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    content: str = Field(min_length=1)
    act_type: SpeechActType
    source: str = Field(min_length=1)


class ProblemObject(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    object_type: ProblemObjectType
    identifier: str | None = None
    source: str = Field(min_length=1)


class GranularityAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    problem_granularity: ProblemGranularity
    evidence_granularity: ProblemGranularity
    mismatch: bool
