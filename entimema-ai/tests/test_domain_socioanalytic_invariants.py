from agents.credit_risk import CreditRiskDiagnosticAgent, RiskDimension
from agents.finance import WorkingCapitalAgent
from domain.agents import AgentTask
from domain.unknowns import UnknownRecord
from tests.agent_helpers import context, evidence, state, task


def test_da_sa_004_behavioural_signal_is_not_risk_signal() -> None:
    row = evidence("tone", "tone", direction="DETERIORATING")
    problem = state([row])
    output = CreditRiskDiagnosticAgent().execute(
        task("CR_DIAGNOSTIC_001", [row.id]), context(problem)
    )
    assert output.risk_indicators == []


def test_da_sa_003_unknown_is_not_hidden() -> None:
    unknown = UnknownRecord(
        id="u", variable="debt", why_needed="leverage", materiality="MEDIUM", resolvable=True
    )
    problem = state([], unknowns=[unknown])
    output = CreditRiskDiagnosticAgent().execute(
        task("CR_DIAGNOSTIC_001", unknown_ids=["u"]), context(problem)
    )
    assert output.risk_indicators[0].dimension is RiskDimension.DATA_GAP
    assert "hidden" not in output.risk_indicators[0].proposition.casefold()


def test_da_sa_001_agent_uses_typed_operational_problem_only() -> None:
    assert "raw_conversation" not in AgentTask.model_fields


def test_da_sa_006_conclusions_have_reflexive_provenance_type() -> None:
    rows = [
        evidence(f"{name}-{period}", name, value, period=period)
        for period, values in (("current", (2, 2, 1)), ("prior", (1, 1, 1)))
        for name, value in zip(
            ("accounts_receivable", "inventory", "accounts_payable"), values, strict=True
        )
    ]
    problem = state(rows)
    output = WorkingCapitalAgent().execute(
        task("FIN_WORKING_CAPITAL_001", [item.id for item in rows]), context(problem)
    )
    assert all(item.conclusion_type for item in output.agent_result.conclusion_records)
