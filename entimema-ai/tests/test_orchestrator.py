from datetime import UTC, datetime

from domain.agents import AgentDomain
from domain.enums import EpistemicType, EpistemicVerdict
from domain.evidence import EvidenceRecord
from domain.problem_state import ProblemState
from epistemic.verdicts import EpistemicValidationResult, RequiredNextAction, TraceabilityStatus
from orchestrator.controller import CentralOrchestrator
from orchestrator.dependencies import DependencyEdgeType, TaskDependency, build_dependency_graph
from orchestrator.plans import PlanType, TaskSpecification
from orchestrator.routing import OrchestrationRequest


def state(problem: str = "Assess validated operating issue", **updates) -> ProblemState:
    values = {
        "session_id": "s1",
        "problem_id": "p1",
        "operational_problem": problem,
        "decision_required": "Choose next action",
        "decision_horizon": "*",
    }
    values.update(updates)
    return ProblemState(**values)


def validation(verdict=EpistemicVerdict.VALIDATED) -> EpistemicValidationResult:
    action = (
        RequiredNextAction.PROCEED
        if verdict in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID}
        else RequiredNextAction.REQUEST_EVIDENCE
    )
    return EpistemicValidationResult(
        verdict=verdict,
        traceability_status=TraceabilityStatus.COMPLETE,
        required_next_action=action,
    )


def request(
    capabilities, *, problem_state=None, verdict=EpistemicVerdict.VALIDATED, evidence_map=None
):
    return OrchestrationRequest(
        validated_problem_state=problem_state or state(),
        epistemic_validation_result=validation(verdict),
        requested_capabilities=capabilities,
        evidence_ids_by_capability=evidence_map or {},
    )


def evidence(identifier="e1") -> EvidenceRecord:
    now = datetime.now(UTC)
    return EvidenceRecord(
        id=identifier,
        proposition="Canonical ledger record",
        evidence_type=EpistemicType.RETRIEVED,
        source="ledger",
        source_type="system",
        timestamp=now,
        reliability=1,
    )


def test_or_001_module_b_veto_prevents_routing() -> None:
    plan = CentralOrchestrator().create_plan(
        request(["liquidity_diagnostics"], verdict=EpistemicVerdict.INSUFFICIENT_EVIDENCE)
    )
    assert not plan.ready and plan.plan_type is PlanType.NO_ADMISSIBLE_AGENT
    assert not plan.agent_assignments and "MODULE_B_VETO" in plan.blocking_reason


def test_or_002_single_admissible_agent() -> None:
    plan = CentralOrchestrator().create_plan(request(["liquidity_diagnostics"]))
    assert plan.ready and plan.plan_type is PlanType.SINGLE_AGENT
    assert plan.agent_assignments[0].agent_id == "FIN_LIQUIDITY_001"


def test_or_003_cross_domain_problem_creates_two_typed_tasks() -> None:
    plan = CentralOrchestrator().create_plan(
        request(["liquidity_diagnostics", "debt_service_diagnostics"])
    )
    assert plan.ready and plan.plan_type is PlanType.CROSS_DOMAIN
    assert {item.agent_id for item in plan.agent_assignments} == {
        "FIN_LIQUIDITY_001",
        "CR_DIAGNOSTIC_001",
    }
    assert len(plan.translation_requirements) == 1


def test_or_004_sequential_dependency_is_valid_dag() -> None:
    item = evidence()
    plan = CentralOrchestrator().create_plan(
        request(
            ["data_reconciliation", "margin_analysis"],
            problem_state=state(evidence=[item]),
            evidence_map={"data_reconciliation": ["e1"]},
        )
    )
    assert plan.ready and plan.plan_type is PlanType.SEQUENTIAL_AGENTS
    assert plan.dependencies[0].edge_type is DependencyEdgeType.REQUIRES_VALIDATION_OF


def spec(identifier) -> TaskSpecification:
    return TaskSpecification(
        task_id=identifier,
        parent_problem_id="p1",
        objective="bounded task",
        domain=AgentDomain.ENGINEERING,
        required_capabilities=["workflow_transformation"],
        target_decision="decide",
        required_output="structured output",
    )


def test_or_005_dependency_cycle_is_rejected() -> None:
    tasks = [spec("a"), spec("b")]
    graph = build_dependency_graph(
        tasks,
        [
            TaskDependency(
                source_task_id="a",
                target_task_id="b",
                edge_type=DependencyEdgeType.REQUIRES_OUTPUT_FROM,
            ),
            TaskDependency(
                source_task_id="b",
                target_task_id="a",
                edge_type=DependencyEdgeType.REQUIRES_OUTPUT_FROM,
            ),
        ],
    )
    assert graph.cycle_detected and not graph.valid


def test_or_009_no_admissible_agent_is_valid_outcome() -> None:
    plan = CentralOrchestrator().create_plan(request(["unsupported_capability"]))
    assert plan.plan_type is PlanType.NO_ADMISSIBLE_AGENT and not plan.ready


def test_or_010_raw_chat_cannot_enter_agent_task() -> None:
    plan = CentralOrchestrator().create_plan(request(["liquidity_diagnostics"]))
    assert "chat" not in type(plan.agent_tasks[0]).model_fields


def test_or_011_only_referenced_evidence_is_supplied() -> None:
    items = [evidence("e1"), evidence("e2")]
    plan = CentralOrchestrator().create_plan(
        request(
            ["data_reconciliation"],
            problem_state=state(evidence=items),
            evidence_map={"data_reconciliation": ["e2"]},
        )
    )
    assert plan.agent_tasks[0].evidence_ids == ["e2"]


def test_or_012_shared_evidence_keeps_canonical_id() -> None:
    item = evidence()
    plan = CentralOrchestrator().create_plan(
        request(
            ["liquidity_diagnostics", "debt_service_diagnostics"],
            problem_state=state(evidence=[item]),
            evidence_map={"liquidity_diagnostics": ["e1"], "debt_service_diagnostics": ["e1"]},
        )
    )
    assert [task.evidence_ids for task in plan.agent_tasks] == [["e1"], ["e1"]]


def test_or_013_shared_evidence_is_not_independent_confirmation() -> None:
    item = evidence()
    plan = CentralOrchestrator().create_plan(
        request(
            ["liquidity_diagnostics", "debt_service_diagnostics"],
            problem_state=state(evidence=[item]),
            evidence_map={"liquidity_diagnostics": ["e1"], "debt_service_diagnostics": ["e1"]},
        )
    )
    assert plan.reconciliation_context.shared_evidence_ids == ["e1"]
    assert "SAME_EVIDENCE" in plan.reconciliation_context.independence_metadata


def test_or_016_routing_provenance_is_stored() -> None:
    plan = CentralOrchestrator().create_plan(request(["liquidity_diagnostics"]))
    assert plan.routing_record.problem_id == "p1"
    assert plan.routing_record.required_capabilities == ["liquidity_diagnostics"]


def test_or_020_identical_input_is_deterministic() -> None:
    orchestrator = CentralOrchestrator()
    item = request(["liquidity_diagnostics"])
    assert (
        orchestrator.create_plan(item).model_dump() == orchestrator.create_plan(item).model_dump()
    )
