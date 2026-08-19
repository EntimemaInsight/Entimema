from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AgentDomain(StrEnum):
    FINANCE = "FINANCE"
    CREDIT_RISK = "CREDIT_RISK"
    ENGINEERING = "ENGINEERING"


class AgentResultStatus(StrEnum):
    COMPLETE = "COMPLETE"
    CONDITIONAL = "CONDITIONAL"
    INSUFFICIENT_INPUT = "INSUFFICIENT_INPUT"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"
    FAILED_VALIDATION = "FAILED_VALIDATION"


class ConclusionType(StrEnum):
    CALCULATION = "CALCULATION"
    EVIDENCE_SYNTHESIS = "EVIDENCE_SYNTHESIS"
    DIAGNOSTIC_INFERENCE = "DIAGNOSTIC_INFERENCE"
    DATA_GAP = "DATA_GAP"
    RECONCILIATION_FINDING = "RECONCILIATION_FINDING"


class AgentConclusionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    proposition: str = Field(min_length=1)
    conclusion_type: ConclusionType
    evidence_ids: list[str] = Field(default_factory=list)
    calculation_ids: list[str] = Field(default_factory=list)
    inference_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    uncertainty: str = Field(min_length=1)
    causal_level: str | None = None
    trigger: str = ""


class AgentDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")

    agent_id: str = Field(min_length=1)
    domain: AgentDomain
    capabilities: list[str]
    accepted_problem_types: list[str] = Field(default_factory=lambda: ["*"])
    required_inputs: list[str]
    optional_inputs: list[str]
    supported_horizons: list[str]
    supported_populations: list[str]
    supported_methods: list[str] = Field(default_factory=lambda: ["*"])
    output_schema: dict[str, Any]
    enabled: bool = True
    version: str | None = None


class AgentTask(BaseModel):
    model_config = ConfigDict(extra="forbid")

    task_id: str = Field(min_length=1)
    agent_id: str = Field(min_length=1)
    operational_problem: str = Field(min_length=1)
    target_decision: str = Field(min_length=1)
    evidence_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    unknown_ids: list[str] = Field(default_factory=list)
    horizon: str | None = None
    scope: str | None = None
    required_output: str = Field(min_length=1)


class AgentResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    task_id: str = Field(min_length=1)
    agent_id: str = Field(min_length=1)
    conclusions: list[str]
    evidence_used: list[str]
    assumptions_used: list[str]
    calculations: list[str]
    model_outputs: list[str]
    alternatives: list[str]
    contradictions_found: list[str]
    unresolved_unknowns: list[str]
    limitations: list[str]
    status: AgentResultStatus
    conclusion_records: list[AgentConclusionRecord] = Field(default_factory=list)
