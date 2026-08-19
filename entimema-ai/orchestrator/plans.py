from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentDomain, AgentTask
from domain.enums import EpistemicVerdict


class PlanType(StrEnum):
    SINGLE_AGENT = "SINGLE_AGENT"
    PARALLEL_AGENTS = "PARALLEL_AGENTS"
    SEQUENTIAL_AGENTS = "SEQUENTIAL_AGENTS"
    CROSS_DOMAIN = "CROSS_DOMAIN"
    NO_ADMISSIBLE_AGENT = "NO_ADMISSIBLE_AGENT"


class RoutingSource(StrEnum):
    USER_REQUEST = "USER_REQUEST"
    PROBLEM_FORMATION = "PROBLEM_FORMATION"
    ORCHESTRATOR_DECOMPOSITION = "ORCHESTRATOR_DECOMPOSITION"


class ValidationGate(StrEnum):
    PRE_AGENT = "PRE_AGENT"
    POST_AGENT = "POST_AGENT"
    PRE_SYNTHESIS = "PRE_SYNTHESIS"


class IndependenceType(StrEnum):
    SAME_EVIDENCE = "SAME_EVIDENCE"
    SAME_MODEL = "SAME_MODEL"
    SAME_ASSUMPTION = "SAME_ASSUMPTION"
    DIFFERENT_METHOD = "DIFFERENT_METHOD"


class TaskSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    task_id: str
    parent_problem_id: str
    objective: str
    domain: AgentDomain
    required_capabilities: list[str]
    target_decision: str
    horizon: str | None = None
    scope: str | None = None
    evidence_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    unknown_ids: list[str] = Field(default_factory=list)
    dependency_ids: list[str] = Field(default_factory=list)
    required_output: str
    population: str = "*"
    method: str = "*"
    problem_type: str = "*"
    routing_source: RoutingSource = RoutingSource.ORCHESTRATOR_DECOMPOSITION


class AgentAssignment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    task_id: str
    agent_id: str


class RejectedAgent(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    agent_id: str
    task_id: str
    reasons: list[str]


class RoutingRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    routing_id: str
    problem_id: str
    candidate_agent_ids: list[str]
    selected_agent_ids: list[str]
    rejected_agent_ids: list[str]
    selection_basis: list[str]
    required_capabilities: list[str]
    source_of_routing_need: RoutingSource
    epistemic_verdict: EpistemicVerdict
    timestamp: datetime


class ReconciliationContext(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    task_ids: list[str]
    shared_evidence_ids: list[str]
    shared_assumption_ids: list[str]
    definition_links: list[str]
    horizon_differences: list[str]
    scope_differences: list[str]
    independence_metadata: list[IndependenceType]


class OrchestrationPlan(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    plan_id: str
    problem_id: str
    plan_type: PlanType
    tasks: list[TaskSpecification]
    agent_tasks: list[AgentTask]
    agent_assignments: list[AgentAssignment]
    dependencies: list[object]
    translation_requirements: list[object]
    validation_gates: list[ValidationGate]
    rejected_agents: list[RejectedAgent]
    unresolved_requirements: list[str]
    routing_record: RoutingRecord | None
    reconciliation_context: ReconciliationContext | None
    ready: bool
    blocking_reason: str | None = None
