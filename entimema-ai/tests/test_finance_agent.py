from agents.finance import WorkingCapitalAgent
from domain.agents import AgentResultStatus
from tests.agent_helpers import context, evidence, state, task


def finance_output(records):
    problem = state(records)
    assignment = task("FIN_WORKING_CAPITAL_001", [item.id for item in records])
    return WorkingCapitalAgent().execute(assignment, context(problem))


def balances(include_prior_inventory=True):
    rows = [
        evidence("ar-c", "accounts_receivable", 140, period="current"),
        evidence("inv-c", "inventory", 90, period="current"),
        evidence("ap-c", "accounts_payable", 60, period="current"),
        evidence("ar-p", "accounts_receivable", 100, period="prior"),
        evidence("ap-p", "accounts_payable", 50, period="prior"),
    ]
    if include_prior_inventory:
        rows.append(evidence("inv-p", "inventory", 80, period="prior"))
    return rows


def test_fin_001_delta_nwc_and_fin_002_cash_absorption() -> None:
    output = finance_output(balances())
    delta = next(item for item in output.calculations if item.formula == "NWC_current - NWC_prior")
    assert delta.result == 40
    assert any(
        "cash absorption" in item.proposition for item in output.agent_result.conclusion_records
    )


def test_fin_003_missing_prior_inventory_is_not_zero() -> None:
    output = finance_output(balances(False))
    assert not any(item.formula == "NWC_current - NWC_prior" for item in output.calculations)
    assert output.agent_result.status is AgentResultStatus.CONDITIONAL


def test_fin_004_missing_cogs_omits_dio_and_fin_005_limits_scope() -> None:
    output = finance_output(balances())
    assert not any(item.formula.startswith("inventory / cogs") for item in output.calculations)
    assert any("financing or investing" in item for item in output.agent_result.limitations)


def test_fin_006_calculations_trace_to_evidence() -> None:
    rows = balances()
    output = finance_output(rows)
    ids = {item.id for item in rows}
    assert all(set(item.input_ids) <= ids for item in output.calculations)


def test_fin_007_state_contradictions_are_preserved() -> None:
    from domain.contradictions import ContradictionRecord, ContradictionType

    problem = state(
        balances(),
        contradictions=[
            ContradictionRecord(
                id="x1",
                proposition_a="A",
                proposition_b="B",
                contradiction_type=ContradictionType.DEFINITIONAL,
            )
        ],
    )
    assignment = task("FIN_WORKING_CAPITAL_001", [item.id for item in problem.evidence])
    output = WorkingCapitalAgent().execute(assignment, context(problem))
    assert output.agent_result.contradictions_found == ["x1"]
