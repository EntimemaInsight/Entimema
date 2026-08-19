from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentDefinition
from orchestrator.plans import TaskSpecification


class CapabilityMatchAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    agent_id: str
    requested_capabilities: list[str]
    matched_capabilities: list[str]
    missing_capabilities: list[str]
    domain_match: bool
    horizon_match: bool
    population_match: bool
    method_match: bool
    required_inputs_available: bool
    admissible: bool
    rejection_reasons: list[str] = Field(default_factory=list)


def match_capabilities(
    agent: AgentDefinition, task: TaskSpecification, available_inputs: set[str]
) -> CapabilityMatchAssessment:
    requested = set(task.required_capabilities)
    supported = set(agent.capabilities)
    matched = sorted(requested & supported)
    missing = sorted(requested - supported)
    domain = agent.domain is task.domain
    horizon = "*" in agent.supported_horizons or task.horizon in agent.supported_horizons
    population = (
        "*" in agent.supported_populations or task.population in agent.supported_populations
    )
    method = "*" in agent.supported_methods or task.method in agent.supported_methods
    problem_type = (
        "*" in agent.accepted_problem_types or task.problem_type in agent.accepted_problem_types
    )
    missing_inputs = sorted(set(agent.required_inputs) - available_inputs)
    reasons = []
    if not agent.enabled:
        reasons.append("AGENT_DISABLED")
    if missing:
        reasons.append("MISSING_CAPABILITY:" + ",".join(missing))
    if not domain:
        reasons.append("DOMAIN_MISMATCH")
    if not horizon:
        reasons.append("UNSUPPORTED_HORIZON")
    if not population:
        reasons.append("UNSUPPORTED_POPULATION")
    if not method:
        reasons.append("UNSUPPORTED_METHOD")
    if not problem_type:
        reasons.append("UNSUPPORTED_PROBLEM_TYPE")
    if missing_inputs:
        reasons.append("MISSING_REQUIRED_INPUT:" + ",".join(missing_inputs))
    return CapabilityMatchAssessment(
        agent_id=agent.agent_id,
        requested_capabilities=sorted(requested),
        matched_capabilities=matched,
        missing_capabilities=missing,
        domain_match=domain,
        horizon_match=horizon,
        population_match=population,
        method_match=method,
        required_inputs_available=not missing_inputs,
        admissible=not reasons,
        rejection_reasons=reasons,
    )
