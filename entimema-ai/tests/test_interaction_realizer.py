from copy import deepcopy

from concierge.interaction_realizer import InteractionRealizer
from concierge.question_selection import OrdinalLevel, QuestionCandidate
from domain.contradictions import ContradictionRecord, ContradictionType
from domain.enums import Materiality
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord
from live.canonical_runtime import CanonicalConciergeRuntime
from live.commands import ApplyInterpretedTurn


def make_state(**changes):
    return ProblemState(session_id="session", problem_id="problem", **changes)


def unknown(identifier: str, variable: str, materiality=Materiality.HIGH):
    return UnknownRecord(
        id=identifier,
        variable=variable,
        why_needed="Required to define the decision",
        materiality=materiality,
        resolvable=True,
        blocks_routing=True,
    )


def question(target: str):
    return QuestionCandidate(
        id=f"q-{target}",
        question="Machine epistemic requirement",
        targets_unknown_ids=[target],
        information_gain=OrdinalLevel.HIGH,
        user_cost=OrdinalLevel.LOW,
        presupposition_risk=OrdinalLevel.LOW,
    )


def test_cash_shortage_is_naturalised_without_resolving_the_unknown():
    target = unknown("cash", "cash_shortage_definition", Materiality.CRITICAL)
    state = make_state(
        declared_problem="We are profitable, but we are constantly short of cash.",
        unknowns=[target],
    )
    before = deepcopy(state)
    result = InteractionRealizer().realise(question("cash"), state)
    assert "where do you feel it first" in result.client_question
    assert "source can verify" not in result.client_question
    assert state == before
    assert state.unknowns == [target]


def test_question_priority_asks_definition_before_evidence_source():
    state = make_state(declared_problem="Cash is tight")
    command = ApplyInterpretedTurn(
        command_id="turn",
        expected_version=0,
        declared_problem="Cash is tight",
        unknowns=[
            unknown("source", "verification_source"),
            unknown("meaning", "cash_shortage_definition"),
        ],
    )
    result = CanonicalConciergeRuntime().apply(state, command)
    assert "where do you feel it first" in result.question
    assert {item.id for item in result.state.unknowns} == {"source", "meaning"}


def test_budget_scope_is_progressive_not_a_questionnaire():
    state = make_state(
        declared_problem="I need a budget for next year.",
        unknowns=[unknown("scope", "business_structure")],
    )
    result = InteractionRealizer().realise(question("scope"), state)
    assert result.client_question.count("?") == 1
    assert "parts of the business" in result.client_question


def test_credit_vintage_language_retains_demonstrated_technical_depth():
    state = make_state(
        declared_problem="Our new loan vintages are deteriorating.",
        unknowns=[unknown("vintage", "vintage_deterioration_scope")],
    )
    result = InteractionRealizer().realise(question("vintage"), state)
    assert "loan vintages" in result.client_question
    assert "roll rates" in result.client_question


def test_evidence_guidance_is_contextual_and_non_factual():
    state = make_state(
        declared_problem="We are short of cash.",
        unknowns=[unknown("source", "verification_source")],
    )
    result = InteractionRealizer().realise(question("source"), state)
    assert "AR/AP ageing" in result.client_question
    assert "+Evidence" in result.client_question
    assert "Your problem is" not in result.client_question


def test_contradiction_preserves_both_values_and_evidence_references():
    conflict = ContradictionRecord(
        id="revenue",
        proposition_a="FY2025 revenue is €10.8m",
        proposition_b="FY2025 revenue is €12.4m",
        evidence_a_ids=["financial-statements"],
        evidence_b_ids=["management-workbook"],
        contradiction_type=ContradictionType.MEASUREMENT,
    )
    state = make_state(contradictions=[conflict])
    candidate = question("unused").model_copy(
        update={"id": "q-contradiction-revenue", "targets_unknown_ids": []}
    )
    result = InteractionRealizer().realise(candidate, state)
    for value in ("€10.8m", "€12.4m", "financial-statements", "management-workbook"):
        assert value in result.client_question


def test_adaptation_uses_only_observable_financial_vocabulary():
    state = make_state(
        declared_problem="DSO is rising and FCF is compressed.",
        unknowns=[unknown("cash", "liquidity_pattern")],
    )
    result = InteractionRealizer().realise(question("cash"), state)
    assert "working-capital absorption" in result.client_question
    source = InteractionRealizer._unknown.__doc__ or ""
    assert "personality" not in source and "mental state" not in source
