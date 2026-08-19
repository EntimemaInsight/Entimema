from agents.engineering import MatchStatus, ReconciliationAgent
from domain.agents import AgentResultStatus
from tests.agent_helpers import context, evidence, state, task


def reconcile(records):
    problem = state(records)
    assignment = task("ENG_RECONCILIATION_001", [item.id for item in records])
    return ReconciliationAgent().execute(assignment, context(problem))


def pair(a=10, b=10, **right_updates):
    left = evidence("a", "amount", a, source_type="a", key="k")
    right_unit = right_updates.pop("unit", "EUR")
    right = evidence("b", "amount", b, source_type="b", key="k", unit=right_unit, **right_updates)
    return [left, right]


def test_eng_001_exact_match() -> None:
    assert reconcile(pair()).reconciliation_items[0].match_status is MatchStatus.MATCHED


def test_eng_002_numeric_difference_and_eng_007_traceability() -> None:
    output = reconcile(pair(15, 10))
    item = output.reconciliation_items[0]
    assert item.match_status is MatchStatus.VALUE_MISMATCH and item.difference == 5
    assert output.calculations[0].input_ids == ["a", "b"]
    assert output.agent_result.conclusion_records[0].calculation_ids == [output.calculations[0].id]


def test_eng_003_missing_item() -> None:
    rows = pair() + [evidence("a2", "amount", 1, source_type="a", key="extra")]
    statuses = {item.match_status for item in reconcile(rows).reconciliation_items}
    assert MatchStatus.MISSING_IN_B in statuses


def test_eng_004_period_mismatch_has_no_arithmetic() -> None:
    rows = pair()
    rows[0] = rows[0].model_copy(update={"period_start": rows[0].timestamp})
    output = reconcile(rows)
    assert output.reconciliation_items[0].match_status is MatchStatus.PERIOD_MISMATCH
    assert output.calculations == []


def test_eng_005_unit_mismatch() -> None:
    assert (
        reconcile(pair(unit="USD")).reconciliation_items[0].match_status
        is MatchStatus.UNIT_MISMATCH
    )


def test_eng_006_missing_key_is_insufficient() -> None:
    output = reconcile([evidence("a", "amount", 1, source_type="a", key=None)])
    assert output.agent_result.status is AgentResultStatus.INSUFFICIENT_INPUT
