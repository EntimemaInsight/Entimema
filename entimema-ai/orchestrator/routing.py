from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentDefinition, AgentTask
from domain.problem_state import ProblemState
from epistemic.verdicts import EpistemicValidationResult
from orchestrator.capability_matching import CapabilityMatchAssessment, match_capabilities
from orchestrator.plans import TaskSpecification


class OrchestrationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    validated_problem_state: ProblemState
    epistemic_validation_result: EpistemicValidationResult
    available_agent_ids: list[str] | None = None
    requested_capabilities: list[str] | None = None
    evidence_ids_by_capability: dict[str, list[str]] = Field(default_factory=dict)


def available_inputs(state: ProblemState, task: TaskSpecification) -> set[str]:
    result = set(task.evidence_ids + task.claim_ids + task.assumption_ids + task.unknown_ids)
    if state.operational_problem:
        result.add("operational_problem")
    if state.decision_required:
        result.add("target_decision")
    if task.evidence_ids:
        result.add("evidence")
    if task.claim_ids:
        result.add("claims")
    if task.assumption_ids:
        result.add("assumptions")
    if task.unknown_ids:
        result.add("unknowns")
    return result


def assess_agents(
    agents: list[AgentDefinition], state: ProblemState, task: TaskSpecification
) -> list[CapabilityMatchAssessment]:
    inputs = available_inputs(state, task)
    return [match_capabilities(agent, task, inputs) for agent in agents]


def build_agent_task(
    state: ProblemState, specification: TaskSpecification, agent: AgentDefinition
) -> AgentTask:
    evidence_ids = {item.id for item in state.evidence}
    claim_ids = {item.id for item in state.claims}
    assumption_ids = {item.id for item in state.assumptions}
    unknown_ids = {item.id for item in state.unknowns}
    if not set(specification.evidence_ids) <= evidence_ids:
        raise ValueError("task references non-canonical evidence IDs")
    return AgentTask(
        task_id=specification.task_id,
        agent_id=agent.agent_id,
        operational_problem=state.operational_problem or specification.objective,
        target_decision=specification.target_decision,
        evidence_ids=[item for item in specification.evidence_ids if item in evidence_ids],
        claim_ids=[item for item in specification.claim_ids if item in claim_ids],
        assumption_ids=[item for item in specification.assumption_ids if item in assumption_ids],
        unknown_ids=[item for item in specification.unknown_ids if item in unknown_ids],
        horizon=specification.horizon,
        scope=specification.scope,
        required_output=specification.required_output,
    )
