from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentDomain, AgentResult, AgentTask
from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord
from epistemic.inference_validation import CalculationRecord
from epistemic.verdicts import EpistemicValidationResult


class AgentExecutionContext(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    problem_state: ProblemState
    evidence_by_id: dict[str, EvidenceRecord]
    claims_by_id: dict[str, ClaimRecord]
    assumptions_by_id: dict[str, AssumptionRecord]
    unknowns_by_id: dict[str, UnknownRecord]
    hypotheses_by_id: dict[str, HypothesisRecord]
    definitions_by_id: dict[str, Any] = Field(default_factory=dict)
    validation_result: EpistemicValidationResult
    trace_id: str


class DomainAgentOutput(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    agent_result: AgentResult
    calculations: list[CalculationRecord] = Field(default_factory=list)
    risk_indicators: list[Any] = Field(default_factory=list)
    reconciliation_items: list[Any] = Field(default_factory=list)


class DomainAgent(ABC):
    agent_id: str
    domain: AgentDomain
    version: str
    supported_capabilities: tuple[str, ...]

    @abstractmethod
    def validate_task(self, task: AgentTask, context: AgentExecutionContext) -> list[str]: ...

    @abstractmethod
    def execute(self, task: AgentTask, context: AgentExecutionContext) -> DomainAgentOutput: ...


def referenced_input_errors(task: AgentTask, context: AgentExecutionContext) -> list[str]:
    registries = (
        (task.evidence_ids, context.evidence_by_id, "evidence"),
        (task.claim_ids, context.claims_by_id, "claim"),
        (task.assumption_ids, context.assumptions_by_id, "assumption"),
        (task.unknown_ids, context.unknowns_by_id, "unknown"),
    )
    return [
        f"MISSING_REFERENCED_{kind.upper()}:{identifier}"
        for identifiers, registry, kind in registries
        for identifier in identifiers
        if identifier not in registry
    ]
