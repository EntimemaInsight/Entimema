from datetime import UTC, datetime

from domain.claims import ClaimRecord, ClaimStatus
from domain.contradictions import ContradictionRecord, ContradictionType
from domain.enums import DecisionReadiness, Materiality
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord
from live.canonical_runtime import CanonicalConciergeRuntime
from live.commands import ApplyInterpretedTurn
from problem_formation.candidate_problems import CandidateOperationalProblem
from problem_formation.problem_objects import GoalType, ProblemObject, ProblemObjectType


def state(**changes):
    return ProblemState(session_id="session", problem_id="problem", **changes)


def command(**changes):
    values = {
        "command_id": "command",
        "expected_version": 0,
        "declared_problem": "Reported cash pressure",
    }
    values.update(changes)
    return ApplyInterpretedTurn(**values)


def operational(**changes):
    values = {
        "id": "candidate",
        "formulation": "Diagnose the bounded cash conversion change",
        "object": ProblemObject(object_type=ProblemObjectType.SYSTEM, source="USER_ORIGINATED"),
        "goal": GoalType.DIAGNOSE,
        "decision": "Choose a corrective action",
        "horizon": "next quarter",
        "scope": "operating working capital",
        "source": "USER_ORIGINATED",
    }
    values.update(changes)
    return CandidateOperationalProblem(**values)


def test_declaration_is_not_operational_and_claim_is_not_fact():
    claim = ClaimRecord(
        id="claim", proposition="Profit rose", source="USER", timestamp=datetime.now(UTC)
    )
    result = CanonicalConciergeRuntime().apply(state(), command(claims=[claim]))
    assert result.state.operational_problem is None
    assert result.projection["operational_problem"] is None
    assert result.state.claims[0].status is ClaimStatus.REPORTED
    assert result.projection["validated_evidence"] == []


def test_blocking_unknown_remains_unknown_and_generates_targeted_q_star():
    unknown = UnknownRecord(
        id="cash",
        variable="closing cash balance",
        why_needed="It bounds the decision",
        materiality=Materiality.CRITICAL,
        resolvable=True,
        blocks_routing=True,
    )
    result = CanonicalConciergeRuntime().apply(
        state(), command(unknowns=[unknown], operational_candidates=[operational()])
    )
    assert result.state.unknowns == [unknown]
    assert result.state.decision_readiness is DecisionReadiness.BLOCKED
    assert "closing cash balance" in result.question
    assert result.projection["unknowns"][0]["id"] == "cash"


def test_module_b_contradiction_veto_blocks_analysis():
    contradiction = ContradictionRecord(
        id="conflict",
        proposition_a="Cash is 10",
        proposition_b="Cash is 20",
        contradiction_type=ContradictionType.MEASUREMENT,
    )
    result = CanonicalConciergeRuntime().apply(
        state(contradictions=[contradiction]),
        command(
            operational_candidates=[operational()],
            requested_capabilities=["working_capital_analysis"],
        ),
    )
    assert result.state.decision_readiness is DecisionReadiness.BLOCKED
    assert result.analysis is None
    assert "conflict" in result.projection["epistemic_veto"]["contradiction_ids"]


def test_resolved_state_reaches_orchestration_without_bot_handoff():
    result = CanonicalConciergeRuntime().apply(
        state(),
        command(
            operational_candidates=[operational()],
            requested_capabilities=["working_capital_analysis"],
        ),
    )
    assert result.analysis is not None
    assert result.analysis.orchestration_plan.plan_id == "plan-problem"
    assert "bot" not in result.projection
    assert result.projection["operational_problem"] != result.projection["declared_problem"]


def test_controller_cannot_override_auditor_or_transition_guard():
    unknown = UnknownRecord(
        id="critical",
        variable="decision threshold",
        why_needed="Required for decision",
        materiality=Materiality.CRITICAL,
        resolvable=True,
        blocks_routing=True,
    )
    result = CanonicalConciergeRuntime().apply(
        state(decision_readiness=DecisionReadiness.ANALYSIS_READY),
        command(
            unknowns=[unknown],
            operational_candidates=[operational()],
            requested_capabilities=["working_capital_analysis"],
        ),
    )
    assert result.state.decision_readiness is DecisionReadiness.BLOCKED
    assert result.analysis is None
