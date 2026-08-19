from concierge.question_selection import (
    OrdinalLevel,
    QuestionCandidate,
    select_next_best_question,
)
from concierge.repair import SELF_REPAIR_PREFERRED
from concierge.routing_gate import evaluate_routing_readiness
from domain.enums import Materiality
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord


def test_self_repair_policy_is_explicit() -> None:
    assert SELF_REPAIR_PREFERRED is True


def test_question_tie_breaks_by_id() -> None:
    candidates = [
        QuestionCandidate(
            id="q-b",
            question="B?",
            information_gain=OrdinalLevel.HIGH,
            user_cost=OrdinalLevel.LOW,
            presupposition_risk=OrdinalLevel.LOW,
        ),
        QuestionCandidate(
            id="q-a",
            question="A?",
            information_gain=OrdinalLevel.HIGH,
            user_cost=OrdinalLevel.LOW,
            presupposition_risk=OrdinalLevel.LOW,
        ),
    ]
    assert select_next_best_question(candidates).id == "q-a"


def test_all_reflexively_invalid_questions_return_none() -> None:
    candidate = QuestionCandidate(
        id="q1",
        question="Loaded?",
        information_gain=OrdinalLevel.HIGH,
        user_cost=OrdinalLevel.LOW,
        presupposition_risk=OrdinalLevel.LOW,
        artificially_narrows_response=True,
    )
    assert select_next_best_question([candidate]) is None


def test_routing_readiness_reports_each_gate() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="critical",
        why_needed="decision",
        materiality=Materiality.CRITICAL,
        resolvable=True,
    )
    readiness = evaluate_routing_readiness(
        ProblemState(session_id="s", problem_id="p", unknowns=[unknown])
    )
    assert not readiness.operational_problem_defined
    assert not readiness.decision_defined
    assert readiness.critical_unknowns_open
    assert not readiness.ready
