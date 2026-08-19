from datetime import UTC, datetime

import pytest

from concierge.dialogue_actions import ConciergeActionType
from concierge.dialogue_turns import DialogueTurnInput
from concierge.question_selection import OrdinalLevel, QuestionCandidate
from concierge.repair import RepairRecord, RepairStatus, RepairType
from concierge.state_machine import ConciergeStateMachine
from core.exceptions import EpistemicValidationError, InvalidStateTransition, InvariantViolation
from core.validators import validate_state_transition
from domain.contradictions import ContradictionRecord, ContradictionType
from domain.conversation import ConversationMode, ConversationState
from domain.enums import Materiality
from domain.hypotheses import HypothesisRecord, HypothesisStatus
from domain.problem_state import ProblemState
from domain.transitions import StateTransition
from domain.unknowns import UnknownRecord


def state_at(state: StateTransition, **updates) -> ProblemState:
    data = {
        "session_id": "s1",
        "problem_id": "p1",
        "lifecycle_state": state,
    }
    data.update(updates)
    return ProblemState(**data)


def turn(**updates) -> DialogueTurnInput:
    data = {"session_id": "s1", "problem_id": "p1", "utterance": "clarification"}
    data.update(updates)
    return DialogueTurnInput(**data)


def hypothesis(identifier: str, proposition: str) -> HypothesisRecord:
    return HypothesisRecord(id=identifier, proposition=proposition, source="deterministic-test")


def test_intake_records_raw_problem_and_contextualises() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.INTAKE), turn(utterance="Assess product viability")
    )
    assert result.new_state is StateTransition.CONTEXTUALISING
    assert result.updated_problem_state.declared_problem == "Assess product viability"
    assert result.updated_problem_state.operational_problem is None


def test_empty_intake_remains_intake_with_audit() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.INTAKE), turn(utterance="")
    )
    assert result.new_state is StateTransition.INTAKE
    assert result.transition_record.basis == "MATERIAL_AMBIGUITY"


def test_reference_ambiguity_has_repair_priority() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.CONTEXTUALISING, declared_problem="Assess това"),
        turn(
            unresolved_reference_candidates=["това"],
            supplied_hypotheses=[hypothesis("h1", "Demand fell")],
        ),
    )
    assert result.new_state is StateTransition.REPAIR
    assert result.repair_required
    assert result.updated_problem_state.hypotheses[0].status is HypothesisStatus.ACTIVE
    assert all(action.action_type is not ConciergeActionType.ROUTE for action in result.actions)


def test_definition_ambiguity_enters_repair() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.CONTEXTUALISING, declared_problem="Margin = 12%"),
        turn(definition_mismatches=["margin definition"]),
    )
    assert result.new_state is StateTransition.REPAIR
    assert result.updated_problem_state.repairs[0].repair_type is RepairType.DEFINITION


def test_material_ambiguity_enters_repair() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.CONTEXTUALISING, declared_problem="Assess results"),
        turn(ambiguity_flags=["period unclear"]),
    )
    assert result.new_state is StateTransition.REPAIR


def test_repair_resolution_uses_user_clarification() -> None:
    repair = RepairRecord(
        id="r1",
        repair_type=RepairType.REFERENCE,
        target="it",
        description="Resolve it",
        opened_at=datetime.now(UTC),
    )
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.REPAIR, declared_problem="Assess product", repairs=[repair]),
        turn(
            utterance="By it, I mean Product A",
            explicit_action_type=ConciergeActionType.RESOLVE_REFERENCE,
        ),
    )
    assert result.new_state is StateTransition.PROBLEM_FORMATION
    assert result.updated_problem_state.repairs[0].status is RepairStatus.RESOLVED


def test_unresolved_repair_remains_repair() -> None:
    repair = RepairRecord(
        id="r1",
        repair_type=RepairType.REFERENCE,
        target="it",
        description="Resolve it",
        opened_at=datetime.now(UTC),
    )
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.REPAIR, declared_problem="Assess product", repairs=[repair]),
        turn(utterance="", unresolved_reference_candidates=["it"]),
    )
    assert result.new_state is StateTransition.REPAIR


def test_unresolvable_material_repair_stops_insufficient() -> None:
    repair = RepairRecord(
        id="r1",
        repair_type=RepairType.DEFINITION,
        target="margin",
        description="Resolve margin",
        opened_at=datetime.now(UTC),
    )
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.REPAIR, declared_problem="Assess margin", repairs=[repair]),
        turn(ambiguity_flags=["UNRESOLVABLE"]),
    )
    assert result.new_state is StateTransition.INSUFFICIENT_EVIDENCE
    assert result.blocking_reason == "REPAIR_UNRESOLVABLE"


def test_exploratory_hypothetical_does_not_create_commitment() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.INTAKE,
            conversation_state=ConversationState(mode=ConversationMode.EXPLORATION),
        ),
        turn(
            utterance="Maybe we should stop the product",
            requested_mode=ConversationMode.EXPLORATION,
        ),
    )
    assert result.updated_problem_state.conversation_state.mode is ConversationMode.EXPLORATION
    assert result.updated_problem_state.conversation_state.explicit_commitments == []


def test_commitment_mode_requires_explicit_action() -> None:
    with pytest.raises(InvariantViolation):
        ConciergeStateMachine().process_turn(
            state_at(StateTransition.INTAKE),
            turn(utterance="Maybe stop", requested_mode=ConversationMode.COMMITMENT),
        )


def test_problem_formation_enters_hypothesis_discrimination() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.PROBLEM_FORMATION,
            declared_problem="Assess churn",
            operational_problem="Identify causes of churn",
        ),
        turn(supplied_hypotheses=[hypothesis("h1", "Pricing increased churn")]),
    )
    assert result.new_state is StateTransition.HYPOTHESIS_DISCRIMINATION


def test_multiple_hypotheses_remain_distinct_and_active() -> None:
    candidates = [
        hypothesis(f"h{i}", proposition)
        for i, proposition in enumerate(
            ["Pricing changed", "Service degraded", "Competition increased"], start=1
        )
    ]
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.PROBLEM_FORMATION,
            declared_problem="Assess churn",
            operational_problem="Identify causes",
        ),
        turn(supplied_hypotheses=candidates),
    )
    assert [item.id for item in result.updated_problem_state.hypotheses] == ["h1", "h2", "h3"]
    assert all(
        item.status is HypothesisStatus.ACTIVE for item in result.updated_problem_state.hypotheses
    )


def test_untestable_hypothesis_does_not_advance() -> None:
    candidate = hypothesis("h1", "Something happened")
    candidate.testable = False
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.PROBLEM_FORMATION,
            declared_problem="Assess",
            operational_problem="Assess event",
        ),
        turn(supplied_hypotheses=[candidate]),
    )
    assert result.new_state is StateTransition.PROBLEM_FORMATION


def test_forbidden_hypothesis_enters_terminal_guardrail_state() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.PROBLEM_FORMATION,
            declared_problem="Assess debt",
            operational_problem="Assess debt",
        ),
        turn(
            supplied_hypotheses=[hypothesis("h1", "User is concealing debt because of hesitation")]
        ),
    )
    assert result.new_state is StateTransition.FORBIDDEN_INFERENCE
    assert not result.routing_ready


def test_contradiction_enters_challenge_and_preserves_both_sides() -> None:
    contradiction = ContradictionRecord(
        id="x1",
        proposition_a="Reported profit",
        proposition_b="Evidence shows loss",
        evidence_a_ids=[],
        evidence_b_ids=["e1"],
        contradiction_type=ContradictionType.MEASUREMENT,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            declared_problem="Profit",
            operational_problem="Reconcile profit",
            decision_required="Approve report",
        ),
        turn(supplied_contradictions=[contradiction]),
    )
    assert result.new_state is StateTransition.EPISTEMIC_CHALLENGE
    stored = result.updated_problem_state.contradictions[0]
    assert (stored.proposition_a, stored.proposition_b) == (
        "Reported profit",
        "Evidence shows loss",
    )
    assert not result.routing_ready


def test_challenge_remains_blocked_while_contradiction_open() -> None:
    contradiction = ContradictionRecord(
        id="x1",
        proposition_a="A",
        proposition_b="B",
        contradiction_type=ContradictionType.SOURCE,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.EPISTEMIC_CHALLENGE, contradictions=[contradiction]), turn()
    )
    assert result.new_state is StateTransition.EPISTEMIC_CHALLENGE
    assert not result.routing_ready


def test_late_definition_mismatch_becomes_challenge_not_repair() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess margin",
            decision_required="Approve report",
        ),
        turn(definition_mismatches=["margin"]),
    )
    assert result.new_state is StateTransition.EPISTEMIC_CHALLENGE
    assert (
        result.updated_problem_state.contradictions[0].contradiction_type
        is ContradictionType.DEFINITIONAL
    )
    assert not result.repair_required


def test_contradictions_are_challenged_in_resolution_category_order() -> None:
    source = ContradictionRecord(
        id="source",
        proposition_a="A",
        proposition_b="B",
        contradiction_type=ContradictionType.SOURCE,
    )
    definition = ContradictionRecord(
        id="definition",
        proposition_a="C",
        proposition_b="D",
        contradiction_type=ContradictionType.DEFINITIONAL,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess",
            decision_required="Decide",
            contradictions=[source, definition],
        ),
        turn(),
    )
    challenge = next(
        action for action in result.actions if action.action_type is ConciergeActionType.CHALLENGE
    )
    assert challenge.object_ids == ["definition", "source"]


def test_critical_unresolvable_unknown_stops_insufficient() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="cash",
        why_needed="decision",
        materiality=Materiality.CRITICAL,
        resolvable=False,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess cash",
            decision_required="Lend",
            unknowns=[unknown],
        ),
        turn(),
    )
    assert result.new_state is StateTransition.INSUFFICIENT_EVIDENCE


def test_low_unknown_does_not_block_routing() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="minor",
        why_needed="context",
        materiality=Materiality.LOW,
        resolvable=True,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess",
            decision_required="Decide",
            unknowns=[unknown],
        ),
        turn(),
    )
    assert result.new_state is StateTransition.ROUTING_READY


def test_high_unknown_blocks_by_default() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="high",
        why_needed="decision",
        materiality=Materiality.HIGH,
        resolvable=True,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess",
            decision_required="Decide",
            unknowns=[unknown],
        ),
        turn(),
    )
    assert result.new_state is StateTransition.HYPOTHESIS_DISCRIMINATION


def test_high_unknown_can_be_explicitly_non_blocking() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="high",
        why_needed="context",
        materiality=Materiality.HIGH,
        resolvable=True,
        blocks_routing=False,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess",
            decision_required="Decide",
            unknowns=[unknown],
        ),
        turn(),
    )
    assert result.new_state is StateTransition.ROUTING_READY


def test_routing_gate_fails_without_operational_problem() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.HYPOTHESIS_DISCRIMINATION, decision_required="Decide"), turn()
    )
    assert result.new_state is StateTransition.HYPOTHESIS_DISCRIMINATION
    assert result.blocking_reason == "ROUTING_GATE_FAIL"


def test_routing_gate_passes_when_requirements_are_clear() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            operational_problem="Assess viability",
            decision_required="Continue product",
        ),
        turn(),
    )
    assert result.new_state is StateTransition.ROUTING_READY
    assert result.routing_ready
    assert any(action.action_type is ConciergeActionType.ROUTE for action in result.actions)


def test_question_selection_exposes_exactly_one_question() -> None:
    questions = [
        QuestionCandidate(
            id="q1",
            question="Low gain?",
            information_gain=OrdinalLevel.LOW,
            user_cost=OrdinalLevel.LOW,
            presupposition_risk=OrdinalLevel.LOW,
        ),
        QuestionCandidate(
            id="q2",
            question="Best question?",
            information_gain=OrdinalLevel.HIGH,
            user_cost=OrdinalLevel.LOW,
            presupposition_risk=OrdinalLevel.LOW,
        ),
        QuestionCandidate(
            id="q3",
            question="Costly?",
            information_gain=OrdinalLevel.HIGH,
            user_cost=OrdinalLevel.HIGH,
            presupposition_risk=OrdinalLevel.HIGH,
        ),
    ]
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.HYPOTHESIS_DISCRIMINATION), turn(question_candidates=questions)
    )
    assert result.next_best_question == "Best question?"
    assert result.question_count == 1


def test_reflexivity_rejects_high_information_presupposition() -> None:
    unsafe = QuestionCandidate(
        id="q1",
        question="Why did you conceal it?",
        information_gain=OrdinalLevel.HIGH,
        user_cost=OrdinalLevel.LOW,
        presupposition_risk=OrdinalLevel.LOW,
        assumes_unproven_premise=True,
    )
    safe = QuestionCandidate(
        id="q2",
        question="What information is available?",
        information_gain=OrdinalLevel.MEDIUM,
        user_cost=OrdinalLevel.LOW,
        presupposition_risk=OrdinalLevel.LOW,
    )
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.HYPOTHESIS_DISCRIMINATION),
        turn(question_candidates=[unsafe, safe]),
    )
    assert result.next_best_question == safe.question


def test_transition_record_is_created_for_every_turn() -> None:
    result = ConciergeStateMachine().process_turn(
        state_at(StateTransition.INTAKE), turn(utterance="Assess")
    )
    assert result.transition_record.from_state is StateTransition.INTAKE
    assert result.transition_record.to_state is StateTransition.CONTEXTUALISING
    assert result.transition_record.basis


def test_turn_identity_mismatch_is_rejected() -> None:
    with pytest.raises(EpistemicValidationError):
        ConciergeStateMachine().process_turn(
            state_at(StateTransition.INTAKE),
            DialogueTurnInput(session_id="wrong", problem_id="p1", utterance="Assess"),
        )


def test_terminal_state_cannot_process_another_turn() -> None:
    with pytest.raises(EpistemicValidationError):
        ConciergeStateMachine().process_turn(state_at(StateTransition.FORBIDDEN_INFERENCE), turn())


def test_intake_cannot_bypass_to_routing_ready() -> None:
    with pytest.raises(InvalidStateTransition):
        validate_state_transition(StateTransition.INTAKE, StateTransition.ROUTING_READY)
