from domain.agents import (
    AgentConclusionRecord,
    AgentResult,
    AgentResultStatus,
    ConclusionType,
)
from domain.enums import EpistemicVerdict
from epistemic.controller import EpistemicController
from epistemic.inference_validation import CalculationRecord
from tests.agent_helpers import evidence, state, task


def result(agent_id, conclusion, **updates):
    values = dict(
        task_id="t1",
        agent_id=agent_id,
        conclusions=[conclusion.proposition],
        evidence_used=conclusion.evidence_ids,
        assumptions_used=conclusion.assumption_ids,
        calculations=conclusion.calculation_ids,
        model_outputs=[],
        alternatives=[],
        contradictions_found=[],
        unresolved_unknowns=[],
        limitations=["Bounded to supplied inputs."],
        status=AgentResultStatus.COMPLETE,
        conclusion_records=[conclusion],
    )
    values.update(updates)
    return AgentResult(**values)


def conclusion(proposition="NWC increased", **updates):
    values = dict(
        id="c1",
        proposition=proposition,
        conclusion_type=ConclusionType.CALCULATION,
        evidence_ids=["e1"],
        uncertainty="low",
    )
    values.update(updates)
    return AgentConclusionRecord(**values)


def validate(agent_result, problem, calculations=None):
    assignment = task(agent_result.agent_id, task_id="t1", evidence_ids=["e1"])
    return EpistemicController.validate_agent_result(
        agent_result, problem, assignment, calculations or []
    )


def test_pa_001_valid_finance_result_is_validated() -> None:
    problem = state([evidence("e1", "accounts_receivable", 1)])
    assert (
        validate(result("FIN_WORKING_CAPITAL_001", conclusion()), problem).verdict
        is EpistemicVerdict.VALIDATED
    )


def test_pa_002_unregistered_assumption_is_blocked() -> None:
    problem = state([evidence("e1", "accounts_receivable", 1)])
    item = conclusion(assumption_ids=["missing"])
    assert (
        validate(result("FIN_WORKING_CAPITAL_001", item), problem).verdict
        is EpistemicVerdict.TRACEABILITY_FAILURE
    )


def test_pa_003_calculation_missing_provenance_fails_traceability() -> None:
    problem = state([evidence("e1", "accounts_receivable", 1)])
    item = conclusion(calculation_ids=["calc"])
    calc = CalculationRecord(
        id="calc",
        formula="x",
        input_ids=["missing"],
        units=["EUR"],
        transformations=[],
        result=1,
        output_unit="EUR",
    )
    assert (
        validate(result("FIN_WORKING_CAPITAL_001", item), problem, [calc]).verdict
        is EpistemicVerdict.TRACEABILITY_FAILURE
    )


def test_pa_004_hesitation_inference_is_forbidden() -> None:
    problem = state([evidence("e1", "liquidity", 1)])
    item = conclusion("Hesitation shows deception", trigger="hesitation")
    assert (
        validate(result("CR_DIAGNOSTIC_001", item), problem).verdict
        is EpistemicVerdict.FORBIDDEN_INFERENCE
    )


def test_pa_005_finance_pd_claim_is_out_of_scope() -> None:
    problem = state([evidence("e1", "liquidity", 1)])
    assert (
        validate(
            result("FIN_WORKING_CAPITAL_001", conclusion("Probability of default increased")),
            problem,
        ).verdict
        is EpistemicVerdict.OUT_OF_SCOPE
    )


def test_pa_006_engineering_profitability_recommendation_is_rejected() -> None:
    problem = state([evidence("e1", "amount", 1)])
    item = conclusion("Increase margin through a profitability recommendation")
    assert (
        validate(result("ENG_RECONCILIATION_001", item), problem).verdict
        is EpistemicVerdict.OUT_OF_SCOPE
    )
