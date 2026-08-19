from agents.credit_risk import CreditRiskDiagnosticAgent, RiskDimension
from domain.unknowns import UnknownRecord
from tests.agent_helpers import context, evidence, state, task


def execute(records, **state_updates):
    problem = state(records, **state_updates)
    assignment = task(
        "CR_DIAGNOSTIC_001",
        [item.id for item in records],
        unknown_ids=[item.id for item in problem.unknowns],
    )
    return CreditRiskDiagnosticAgent().execute(assignment, context(problem))


def test_cr_001_payment_and_cr_002_liquidity_deterioration() -> None:
    output = execute(
        [
            evidence("p", "payment_behaviour", direction="DETERIORATING"),
            evidence("l", "liquidity", direction="DETERIORATING"),
        ]
    )
    assert {item.dimension for item in output.risk_indicators} == {
        RiskDimension.PAYMENT_BEHAVIOUR,
        RiskDimension.LIQUIDITY,
    }


def test_cr_003_mixed_dimensions_preserved_without_cr_004_aggregation() -> None:
    output = execute(
        [
            evidence("p", "payment_behaviour", direction="IMPROVING"),
            evidence("l", "liquidity", direction="DETERIORATING"),
        ]
    )
    assert {item.direction.value for item in output.risk_indicators} == {
        "IMPROVING",
        "DETERIORATING",
    }
    assert not any(
        "overall" in item.casefold() or "probability" in item.casefold()
        for item in output.agent_result.conclusions
    )


def test_cr_005_hesitation_never_creates_indicator() -> None:
    assert execute([evidence("h", "hesitation", direction="DETERIORATING")]).risk_indicators == []


def test_cr_006_missing_debt_is_data_gap_not_concealment() -> None:
    unknown = UnknownRecord(
        id="u1", variable="debt", why_needed="leverage", materiality="MEDIUM", resolvable=True
    )
    output = execute([], unknowns=[unknown])
    assert output.risk_indicators[0].dimension is RiskDimension.DATA_GAP
    assert "concealment" not in output.risk_indicators[0].proposition.casefold()


def test_cr_007_no_pd_is_generated() -> None:
    output = execute([evidence("l", "liquidity", direction="DETERIORATING")])
    assert output.agent_result.model_outputs == []
    assert all("default" not in item.proposition.casefold() for item in output.risk_indicators)
