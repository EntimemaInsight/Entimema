from synthesis.conflicts import ConflictCategory
from synthesis.reconciliation import CrossAgentReconciler, FindingStatus
from tests.agent_helpers import evidence, state
from tests.synthesis_helpers import plan_for, validated_result


def reconcile(results, specs, rows):
    problem = state(rows)
    return CrossAgentReconciler().reconcile(problem, plan_for(specs), results)


def test_horizon_difference_is_not_true_conflict() -> None:
    rows = [evidence("e1", "liquidity", 1), evidence("e2", "liquidity", 2)]
    results = [
        validated_result("FIN_WORKING_CAPITAL_001", "Liquidity is adequate", ["e1"], task_id="t1"),
        validated_result("CR_DIAGNOSTIC_001", "Liquidity is inadequate", ["e2"], task_id="t2"),
    ]
    specs = [
        ("t1", "FIN_WORKING_CAPITAL_001", ["e1"], "current", "entity"),
        ("t2", "CR_DIAGNOSTIC_001", ["e2"], "12m-stress", "entity"),
    ]
    output = reconcile(results, specs, rows)
    assert output.true_conflicts == []
    assert output.horizon_differences[0].category is ConflictCategory.TEMPORAL


def test_shared_evidence_is_not_independent_confirmation() -> None:
    rows = [evidence("e1", "liquidity", 1)]
    results = [
        validated_result("FIN_WORKING_CAPITAL_001", "Liquidity is adequate", ["e1"], task_id="t1"),
        validated_result("CR_DIAGNOSTIC_001", "Liquidity is adequate", ["e1"], task_id="t2"),
    ]
    specs = [
        ("t1", results[0].agent_result.agent_id, ["e1"], "current", "x"),
        ("t2", results[1].agent_result.agent_id, ["e1"], "current", "x"),
    ]
    output = reconcile(results, specs, rows)
    assert output.shared_evidence_ids == ["e1"]
    assert not output.independence_assessments[0].independent
    assert output.aligned_findings[0].status is FindingStatus.ALIGNED


def test_aligned_context_with_opposed_findings_is_true_conflict() -> None:
    rows = [evidence("e1", "liquidity", 1), evidence("e2", "liquidity", 2)]
    results = [
        validated_result("FIN_WORKING_CAPITAL_001", "Liquidity is adequate", ["e1"], task_id="t1"),
        validated_result("CR_DIAGNOSTIC_001", "Liquidity is inadequate", ["e2"], task_id="t2"),
    ]
    specs = [
        ("t1", results[0].agent_result.agent_id, ["e1"], "current", "x"),
        ("t2", results[1].agent_result.agent_id, ["e2"], "current", "x"),
    ]
    output = reconcile(results, specs, rows)
    assert output.true_conflicts
    assert not output.synthesis_ready


def test_shared_assumption_propagates_conditionality_and_non_independence() -> None:
    rows = [evidence("e1", "liquidity", 1), evidence("e2", "liquidity", 2)]
    results = [
        validated_result(
            "FIN_WORKING_CAPITAL_001",
            "Liquidity is adequate",
            ["e1"],
            task_id="t1",
            assumptions=["a1"],
        ),
        validated_result(
            "CR_DIAGNOSTIC_001",
            "Liquidity is adequate",
            ["e2"],
            task_id="t2",
            assumptions=["a1"],
        ),
    ]
    specs = [
        ("t1", results[0].agent_result.agent_id, ["e1"], "current", "x"),
        ("t2", results[1].agent_result.agent_id, ["e2"], "current", "x"),
    ]
    output = reconcile(results, specs, rows)
    assert output.shared_assumption_ids == ["a1"]
    assert not output.independence_assessments[0].independent
    assert output.findings[0].status is FindingStatus.CONDITIONAL
