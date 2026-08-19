from agents.execution import AgentExecutionController
from domain.agents import AgentResultStatus
from domain.enums import EpistemicVerdict
from orchestrator.dependencies import DependencyEdgeType, TaskDependency
from orchestrator.plans import OrchestrationPlan
from tests.agent_helpers import evidence, state, task, validation


def finance_records():
    return [
        evidence(f"{name}-{period}", name, value, period=period)
        for period, values in (
            ("current", (140, 90, 60)),
            ("prior", (100, 80, 50)),
        )
        for name, value in zip(
            ("accounts_receivable", "inventory", "accounts_payable"), values, strict=True
        )
    ]


def test_ex_001_pre_routing_veto_blocks_execution() -> None:
    result = AgentExecutionController().execute_task(
        task("FIN_WORKING_CAPITAL_001"),
        state(),
        validation(EpistemicVerdict.INSUFFICIENT_EVIDENCE),
        trace_id="x",
    )
    assert result.agent_result.status is AgentResultStatus.FAILED_VALIDATION


def test_ex_002_unknown_agent_is_structured_failure() -> None:
    result = AgentExecutionController().execute_task(
        task("UNKNOWN"), state(), validation(), trace_id="x"
    )
    assert "UNKNOWN_OR_NON_EXECUTABLE_AGENT" in result.agent_result.limitations


def test_ex_003_missing_referenced_evidence_fails() -> None:
    result = AgentExecutionController().execute_task(
        task("FIN_WORKING_CAPITAL_001", ["missing"]), state(), validation(), trace_id="x"
    )
    assert result.agent_result.status is AgentResultStatus.INSUFFICIENT_INPUT


def test_ex_004_valid_task_dispatch_and_ex_007_determinism() -> None:
    records = finance_records()
    problem = state(records)
    assignment = task("FIN_WORKING_CAPITAL_001", [item.id for item in records])
    controller = AgentExecutionController()
    first = controller.execute_task(assignment, problem, validation(), trace_id="same")
    second = controller.execute_task(assignment, problem, validation(), trace_id="same")
    assert first.agent_result.agent_id == "FIN_WORKING_CAPITAL_001"
    assert first.model_dump(
        exclude={"epistemic_validation_result": {"audit_records"}}
    ) == second.model_dump(exclude={"epistemic_validation_result": {"audit_records"}})


def plan(tasks, dependencies):
    return OrchestrationPlan.model_construct(
        plan_id="plan-1", agent_tasks=tasks, dependencies=dependencies
    )


def test_ex_005_sequential_dependency_executes_after_validated_t1() -> None:
    rows = [
        evidence("a", "amount", 1, source_type="a", key="k"),
        evidence("b", "amount", 1, source_type="b", key="k"),
        *finance_records(),
    ]
    first = task("ENG_RECONCILIATION_001", ["a", "b"], task_id="t1")
    second = task(
        "FIN_WORKING_CAPITAL_001",
        [item.id for item in rows if item.id not in {"a", "b"}],
        task_id="t2",
    )
    result = AgentExecutionController().execute_plan(
        plan(
            [first, second],
            [
                TaskDependency(
                    source_task_id="t1",
                    target_task_id="t2",
                    edge_type=DependencyEdgeType.REQUIRES_VALIDATION_OF,
                )
            ],
        ),
        state(rows),
        validation(),
    )
    assert [item.agent_result.task_id for item in result.results] == ["t1", "t2"]
    assert result.complete


def test_ex_006_failed_t1_blocks_t2() -> None:
    first = task("ENG_RECONCILIATION_001", ["a"], task_id="t1")
    second = task("FIN_WORKING_CAPITAL_001", task_id="t2")
    result = AgentExecutionController().execute_plan(
        plan(
            [first, second],
            [
                TaskDependency(
                    source_task_id="t1",
                    target_task_id="t2",
                    edge_type=DependencyEdgeType.REQUIRES_VALIDATION_OF,
                )
            ],
        ),
        state([evidence("a", "amount", 1, source_type="a", key=None)]),
        validation(),
    )
    assert result.blocked_task_ids == ["t2"]
    assert not result.complete
