from synthesis.reconciliation import CrossAgentReconciler
from tests.agent_helpers import evidence, state
from tests.synthesis_helpers import plan_for, validated_result


def test_mixed_risk_dimensions_remain_separate_without_forced_coherence() -> None:
    rows = [
        evidence("p", "payment_behaviour", direction="IMPROVING"),
        evidence("l", "liquidity", direction="DETERIORATING"),
    ]
    result = validated_result(
        "CR_DIAGNOSTIC_001", "Payment behaviour improving", ["p"], task_id="t1"
    )
    second = validated_result("CR_DIAGNOSTIC_001", "Liquidity deteriorating", ["l"], task_id="t2")
    plan = plan_for(
        [
            ("t1", result.agent_result.agent_id, ["p"], "current", "entity"),
            ("t2", second.agent_result.agent_id, ["l"], "current", "entity"),
        ]
    )
    output = CrossAgentReconciler().reconcile(state(rows), plan, [result, second])
    propositions = {item.proposition for item in output.findings}
    assert propositions == {"Payment behaviour improving", "Liquidity deteriorating"}
    assert not any("overall" in item.casefold() for item in propositions)


def test_missing_information_is_preserved_as_unknown_not_hidden() -> None:
    from domain.unknowns import UnknownRecord

    unknown = UnknownRecord(
        id="u", variable="debt", why_needed="risk", materiality="MEDIUM", resolvable=True
    )
    problem = state([], unknowns=[unknown])
    result = validated_result("CR_DIAGNOSTIC_001", "Debt remains unknown", [], task_id="t1")
    result.agent_result.unresolved_unknowns.append("u")
    output = CrossAgentReconciler().reconcile(
        problem, plan_for([("t1", result.agent_result.agent_id, [], "current", "entity")]), [result]
    )
    assert output.unresolved_unknowns == ["u"]
    assert "hidden" not in output.findings[0].proposition.casefold()
