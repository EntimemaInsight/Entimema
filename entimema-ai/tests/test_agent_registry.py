from domain.agents import AgentDefinition, AgentDomain
from orchestrator.capability_matching import match_capabilities
from orchestrator.plans import TaskSpecification
from orchestrator.registry import AgentRegistry


def task(**updates) -> TaskSpecification:
    values = {
        "task_id": "t1",
        "parent_problem_id": "p1",
        "objective": "Reconcile records",
        "domain": AgentDomain.ENGINEERING,
        "required_capabilities": ["data_reconciliation"],
        "target_decision": "Accept or repair dataset",
        "required_output": "validated dataset",
    }
    values.update(updates)
    return TaskSpecification(**values)


def test_registry_contains_only_seeded_specialist_domains() -> None:
    agents = AgentRegistry().list()
    assert len(agents) == 11
    assert {item.domain for item in agents} == {
        AgentDomain.FINANCE,
        AgentDomain.CREDIT_RISK,
        AgentDomain.ENGINEERING,
    }
    assert all("GENERAL" not in item.domain.value for item in agents)


def custom(**updates) -> AgentDefinition:
    values = {
        "agent_id": "CUSTOM",
        "domain": AgentDomain.ENGINEERING,
        "capabilities": ["data_reconciliation"],
        "required_inputs": ["evidence"],
        "optional_inputs": [],
        "supported_horizons": ["current"],
        "supported_populations": ["entity"],
        "supported_methods": ["ledger_match"],
        "output_schema": {"type": "object"},
    }
    values.update(updates)
    return AgentDefinition(**values)


def test_or_006_missing_required_input_rejects_agent() -> None:
    result = match_capabilities(
        custom(), task(horizon="current", population="entity", method="ledger_match"), set()
    )
    assert not result.admissible
    assert any(item.startswith("MISSING_REQUIRED_INPUT") for item in result.rejection_reasons)


def test_or_007_unsupported_horizon_rejects_agent() -> None:
    result = match_capabilities(
        custom(required_inputs=[]),
        task(horizon="12m", population="entity", method="ledger_match"),
        set(),
    )
    assert "UNSUPPORTED_HORIZON" in result.rejection_reasons


def test_or_008_unsupported_population_rejects_agent() -> None:
    result = match_capabilities(
        custom(required_inputs=[]),
        task(horizon="current", population="portfolio", method="ledger_match"),
        set(),
    )
    assert "UNSUPPORTED_POPULATION" in result.rejection_reasons
