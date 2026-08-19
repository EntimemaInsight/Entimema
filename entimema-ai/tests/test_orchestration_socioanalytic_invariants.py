"""Permanent socioanalytic routing regressions for OR-SA-001 through OR-SA-009."""

from domain.enums import EpistemicVerdict
from domain.problem_state import ProblemState
from epistemic.verdicts import EpistemicValidationResult, RequiredNextAction, TraceabilityStatus
from orchestrator.controller import CentralOrchestrator
from orchestrator.plans import PlanType, RoutingSource
from orchestrator.routing import OrchestrationRequest


def plan(problem: str, capabilities: list[str]):
    state = ProblemState(
        session_id="s",
        problem_id="p",
        operational_problem=problem,
        decision_required="Choose operational action",
        relevant_entities=["HIGH_RISK"],
    )
    validation = EpistemicValidationResult(
        verdict=EpistemicVerdict.VALIDATED,
        traceability_status=TraceabilityStatus.COMPLETE,
        required_next_action=RequiredNextAction.PROCEED,
    )
    return CentralOrchestrator().create_plan(
        OrchestrationRequest(
            validated_problem_state=state,
            epistemic_validation_result=validation,
            requested_capabilities=capabilities,
        )
    )


def test_or_sa_001_irrelevant_category_does_not_route_risk() -> None:
    result = plan("Transform an existing report workflow", ["workflow_transformation"])
    assert [item.agent_id for item in result.agent_assignments] == ["ENG_WORKFLOW_001"]


def test_or_sa_003_practical_logic_controls_finance_keyword_trap() -> None:
    result = plan(
        "Bank asks us to submit an existing liquidity report in another format",
        ["workflow_transformation"],
    )
    assert result.agent_assignments[0].agent_id == "ENG_WORKFLOW_001"


def test_or_017_risk_keyword_does_not_route_credit_risk() -> None:
    result = plan("Move the risk report through a workflow", ["workflow_transformation"])
    assert all(not item.agent_id.startswith("CR_") for item in result.agent_assignments)


def test_or_018_late_invoice_reconciliation_does_not_route_risk() -> None:
    # Missing reconciliation evidence rejects the contract; Risk is never guessed.
    result = plan(
        "Customer is late paying one invoice; reconcile whether payment was booked",
        ["data_reconciliation"],
    )
    assert result.plan_type is PlanType.NO_ADMISSIBLE_AGENT
    assert all(not item.agent_id.startswith("CR_") for item in result.agent_assignments)


def test_or_019_behavioural_signal_never_creates_risk_routing() -> None:
    result = plan(
        "The user hesitated while requesting a workflow change", ["workflow_transformation"]
    )
    assert result.agent_assignments[0].agent_id == "ENG_WORKFLOW_001"


def test_or_sa_004_semiosphere_boundary_is_explicit() -> None:
    result = plan(
        "Assess liquidity and debt-service implications",
        ["liquidity_diagnostics", "debt_service_diagnostics"],
    )
    assert result.translation_requirements[0].mapping_type.value == "CAUSAL_LINK"


def test_or_sa_005_tasks_retain_parent_problem_trace() -> None:
    result = plan("Assess workflow", ["workflow_transformation"])
    assert result.tasks[0].parent_problem_id == "p"
    assert "Assess workflow" in result.tasks[0].objective


def test_or_sa_006_reflexive_routing_source_is_preserved() -> None:
    result = plan("Assess workflow", ["workflow_transformation"])
    assert result.tasks[0].routing_source is RoutingSource.PROBLEM_FORMATION
    assert result.routing_record.source_of_routing_need is RoutingSource.PROBLEM_FORMATION


def test_or_sa_007_hypothesis_domain_is_not_used_without_requested_capability() -> None:
    result = plan(
        "A risk hypothesis exists but the task is workflow conversion", ["workflow_transformation"]
    )
    assert [item.agent_id for item in result.agent_assignments] == ["ENG_WORKFLOW_001"]


def test_or_sa_008_missing_information_never_creates_hidden_motive_task() -> None:
    result = plan("Information is missing", [])
    assert not result.tasks
    assert result.plan_type is PlanType.NO_ADMISSIBLE_AGENT
