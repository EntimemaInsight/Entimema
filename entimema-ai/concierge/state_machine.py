from datetime import UTC, datetime
from uuid import uuid4

from concierge.dialogue_actions import ConciergeActionType, DialogueAction
from concierge.dialogue_turns import DialogueTurnInput, DialogueTurnResult
from concierge.question_selection import select_next_best_question
from concierge.reason_codes import DialogueReasonCode
from concierge.repair import RepairRecord, RepairStatus, RepairType
from concierge.routing_gate import evaluate_routing_readiness
from concierge.state_updates import revalidate_problem_state
from core.exceptions import EpistemicValidationError, ForbiddenInferenceError
from core.guardrails import validate_candidate_inference
from core.validators import validate_state_transition
from domain.contradictions import ContradictionRecord, ContradictionStatus, ContradictionType
from domain.conversation import ConversationMode
from domain.enums import EpistemicVerdict, Materiality
from domain.problem_state import ProblemState
from domain.transitions import StateTransition, TransitionRecord

PROHIBITED_HYPOTHESIS_CATEGORIES = (
    "hidden motive",
    "deception",
    "stress",
    "anxiety",
    "personality",
    "psychiatric",
    "unconscious motive",
    "concealing",
)

CONTRADICTION_RESOLUTION_ORDER = (
    ContradictionType.DEFINITIONAL,
    ContradictionType.TEMPORAL,
    ContradictionType.SCOPE,
    ContradictionType.MEASUREMENT,
    ContradictionType.SOURCE,
    ContradictionType.TRUE_LOGICAL_CONTRADICTION,
)


class ConciergeStateMachine:
    """Deterministic, non-LLM state machine for the Module A dialogue lifecycle."""

    def process_turn(
        self, problem_state: ProblemState, turn: DialogueTurnInput
    ) -> DialogueTurnResult:
        self._validate_identity(problem_state, turn)
        previous = problem_state.model_copy(deep=True)
        updated = problem_state.model_copy(deep=True)
        previous_state = updated.lifecycle_state
        actions: list[DialogueAction] = []
        reason: DialogueReasonCode
        blocking_reason: str | None = None

        self._apply_supplied_records(updated, turn, actions)
        explicit_commitment = (
            turn.requested_mode is ConversationMode.COMMITMENT
            and turn.explicit_action_type is not None
        )
        if turn.requested_mode is not None:
            updated.conversation_state.mode = turn.requested_mode

        match previous_state:
            case StateTransition.INTAKE:
                new_state, reason = self._handle_intake(updated, turn, actions)
            case StateTransition.CONTEXTUALISING:
                new_state, reason = self._handle_contextualising(updated, turn, actions)
            case StateTransition.REPAIR:
                new_state, reason = self._handle_repair(updated, turn, actions)
            case StateTransition.PROBLEM_FORMATION:
                new_state, reason = self._handle_problem_formation(updated, turn, actions)
            case StateTransition.HYPOTHESIS_DISCRIMINATION:
                new_state, reason, blocking_reason = self._handle_discrimination(
                    updated, turn, actions
                )
            case StateTransition.EPISTEMIC_CHALLENGE:
                new_state, reason = self._handle_challenge(updated, actions)
            case _:
                raise EpistemicValidationError(
                    f"Concierge cannot process terminal/downstream state {previous_state}"
                )

        selected = select_next_best_question(turn.question_candidates)
        if selected is not None and new_state not in {
            StateTransition.ROUTING_READY,
            StateTransition.INSUFFICIENT_EVIDENCE,
            StateTransition.FORBIDDEN_INFERENCE,
        }:
            updated.next_best_question = selected.question
            actions.append(
                DialogueAction(
                    action_type=ConciergeActionType.ASK_NEXT_BEST_QUESTION,
                    object_ids=[selected.id],
                )
            )
            if reason is DialogueReasonCode.ROUTING_GATE_FAIL:
                reason = DialogueReasonCode.QUESTION_SELECTED
        else:
            updated.next_best_question = None

        updated.lifecycle_state = new_state
        updated.routing_ready = new_state is StateTransition.ROUTING_READY
        if new_state is StateTransition.INSUFFICIENT_EVIDENCE:
            updated.epistemic_verdict = EpistemicVerdict.INSUFFICIENT_EVIDENCE
            blocking_reason = blocking_reason or reason.value
        elif new_state is StateTransition.FORBIDDEN_INFERENCE:
            updated.epistemic_verdict = EpistemicVerdict.FORBIDDEN_INFERENCE
            blocking_reason = blocking_reason or reason.value

        updated.formation_readiness.object_defined = bool(
            updated.operational_problem or updated.declared_problem
        )
        updated.formation_readiness.goal_defined = bool(updated.user_goal)
        updated.formation_readiness.decision_defined = bool(updated.decision_required)
        updated.formation_readiness.horizon_defined = bool(updated.decision_horizon)
        updated.formation_readiness.scope_defined = bool(updated.domain_scope)

        validate_state_transition(previous_state, new_state)
        updated = revalidate_problem_state(
            previous,
            updated,
            explicit_user_commitment=explicit_commitment,
        )
        transition = TransitionRecord(
            transition_id=str(uuid4()),
            session_id=turn.session_id,
            problem_id=turn.problem_id,
            from_state=previous_state,
            to_state=new_state,
            trigger=turn.explicit_action_type.value
            if turn.explicit_action_type
            else "DIALOGUE_TURN",
            changed_object_type="ProblemState.lifecycle_state",
            changed_object_id=turn.problem_id,
            previous_value=previous_state,
            new_value=new_state,
            basis=reason.value,
            timestamp=datetime.now(UTC),
        )
        return DialogueTurnResult(
            previous_state=previous_state,
            new_state=new_state,
            actions=actions or [DialogueAction(action_type=ConciergeActionType.LISTEN)],
            updated_problem_state=updated,
            next_best_question=updated.next_best_question,
            repair_required=any(repair.status is RepairStatus.OPEN for repair in updated.repairs),
            routing_ready=updated.routing_ready,
            blocking_reason=blocking_reason,
            transition_record=transition,
        )

    @staticmethod
    def _validate_identity(problem_state: ProblemState, turn: DialogueTurnInput) -> None:
        if (
            problem_state.session_id != turn.session_id
            or problem_state.problem_id != turn.problem_id
        ):
            raise EpistemicValidationError("turn identity does not match ProblemState")

    @staticmethod
    def _apply_supplied_records(
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> None:
        record_groups = (
            (turn.supplied_claims, state.claims, ConciergeActionType.RECORD_CLAIM),
            (turn.supplied_evidence, state.evidence, ConciergeActionType.RECORD_EVIDENCE),
            (turn.supplied_unknowns, state.unknowns, ConciergeActionType.MARK_UNKNOWN),
            (
                turn.supplied_assumptions,
                state.assumptions,
                ConciergeActionType.REGISTER_ASSUMPTION,
            ),
            (
                turn.supplied_hypotheses,
                state.hypotheses,
                ConciergeActionType.GENERATE_HYPOTHESIS,
            ),
            (
                turn.supplied_contradictions,
                state.contradictions,
                ConciergeActionType.REGISTER_CONTRADICTION,
            ),
        )
        for supplied, target, action_type in record_groups:
            known = {item.id for item in target}
            additions = [item for item in supplied if item.id not in known]
            target.extend(additions)
            if additions:
                actions.append(
                    DialogueAction(
                        action_type=action_type,
                        object_ids=[item.id for item in additions],
                    )
                )

    @staticmethod
    def _handle_intake(
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> tuple[StateTransition, DialogueReasonCode]:
        if not turn.utterance.strip():
            return StateTransition.INTAKE, DialogueReasonCode.MATERIAL_AMBIGUITY
        if not state.declared_problem:
            state.declared_problem = turn.utterance.strip()
        actions.append(DialogueAction(action_type=ConciergeActionType.LISTEN))
        return (
            StateTransition.CONTEXTUALISING,
            DialogueReasonCode.PROBLEM_CONTEXT_SUFFICIENT,
        )

    def _handle_contextualising(
        self,
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> tuple[StateTransition, DialogueReasonCode]:
        if turn.unresolved_reference_candidates:
            self._open_repairs(state, RepairType.REFERENCE, turn.unresolved_reference_candidates)
            actions.append(DialogueAction(action_type=ConciergeActionType.REPAIR))
            return StateTransition.REPAIR, DialogueReasonCode.UNRESOLVED_REFERENCE
        if turn.definition_mismatches:
            self._open_repairs(state, RepairType.DEFINITION, turn.definition_mismatches)
            actions.append(DialogueAction(action_type=ConciergeActionType.REPAIR))
            return StateTransition.REPAIR, DialogueReasonCode.DEFINITION_MISMATCH
        if turn.ambiguity_flags:
            self._open_repairs(state, RepairType.SCOPE, turn.ambiguity_flags)
            actions.append(DialogueAction(action_type=ConciergeActionType.REPAIR))
            return StateTransition.REPAIR, DialogueReasonCode.MATERIAL_AMBIGUITY
        if not state.declared_problem:
            return StateTransition.CONTEXTUALISING, DialogueReasonCode.MATERIAL_AMBIGUITY
        return (
            StateTransition.PROBLEM_FORMATION,
            DialogueReasonCode.PROBLEM_CONTEXT_SUFFICIENT,
        )

    @staticmethod
    def _open_repairs(state: ProblemState, repair_type: RepairType, targets: list[str]) -> None:
        existing = {(record.repair_type, record.target) for record in state.repairs}
        for target in targets:
            if (repair_type, target) not in existing:
                state.repairs.append(
                    RepairRecord(
                        id=f"repair-{len(state.repairs) + 1}",
                        repair_type=repair_type,
                        target=target,
                        description=f"User clarification required for {target}",
                        candidate_interpretations=[],
                        opened_at=datetime.now(UTC),
                    )
                )

    @staticmethod
    def _handle_repair(
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> tuple[StateTransition, DialogueReasonCode]:
        open_repairs = [repair for repair in state.repairs if repair.status is RepairStatus.OPEN]
        unresolvable = any(flag.casefold() == "unresolvable" for flag in turn.ambiguity_flags)
        if unresolvable:
            for repair in open_repairs:
                repair.status = RepairStatus.UNRESOLVABLE
            actions.append(DialogueAction(action_type=ConciergeActionType.STOP_INSUFFICIENT))
            return (
                StateTransition.INSUFFICIENT_EVIDENCE,
                DialogueReasonCode.REPAIR_UNRESOLVABLE,
            )
        still_ambiguous = bool(
            turn.unresolved_reference_candidates
            or turn.definition_mismatches
            or turn.ambiguity_flags
        )
        if still_ambiguous or not turn.utterance.strip():
            actions.append(DialogueAction(action_type=ConciergeActionType.REPAIR))
            return StateTransition.REPAIR, DialogueReasonCode.UNRESOLVED_REFERENCE
        for repair in open_repairs:
            repair.status = RepairStatus.RESOLVED
            repair.resolved_at = datetime.now(UTC)
        actions.append(
            DialogueAction(
                action_type=ConciergeActionType.RESOLVE_REFERENCE,
                object_ids=[repair.id for repair in open_repairs],
            )
        )
        return StateTransition.PROBLEM_FORMATION, DialogueReasonCode.REPAIR_RESOLVED

    @staticmethod
    def _handle_problem_formation(
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> tuple[StateTransition, DialogueReasonCode]:
        if any(repair.status is RepairStatus.OPEN and repair.material for repair in state.repairs):
            raise EpistemicValidationError("problem formation cannot bypass a material repair")
        for hypothesis in state.hypotheses:
            proposition = hypothesis.proposition.casefold()
            try:
                validate_candidate_inference(hypothesis.proposition, hypothesis.proposition)
            except ForbiddenInferenceError:
                hypothesis.forbidden_inference = True
            if any(category in proposition for category in PROHIBITED_HYPOTHESIS_CATEGORIES):
                hypothesis.forbidden_inference = True
            if hypothesis.forbidden_inference:
                actions.append(DialogueAction(action_type=ConciergeActionType.CHALLENGE))
                return (
                    StateTransition.FORBIDDEN_INFERENCE,
                    DialogueReasonCode.FORBIDDEN_INFERENCE,
                )
        if not state.declared_problem or not (
            state.operational_problem or state.formation_readiness.object_defined
        ):
            return StateTransition.PROBLEM_FORMATION, DialogueReasonCode.MATERIAL_AMBIGUITY
        if any(not hypothesis.testable for hypothesis in state.hypotheses):
            return StateTransition.PROBLEM_FORMATION, DialogueReasonCode.MATERIAL_AMBIGUITY
        return (
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            DialogueReasonCode.HYPOTHESIS_ELIGIBLE,
        )

    @staticmethod
    def _handle_discrimination(
        state: ProblemState,
        turn: DialogueTurnInput,
        actions: list[DialogueAction],
    ) -> tuple[StateTransition, DialogueReasonCode, str | None]:
        for mismatch in turn.definition_mismatches:
            contradiction_id = f"contradiction-definition-{len(state.contradictions) + 1}"
            state.contradictions.append(
                ContradictionRecord(
                    id=contradiction_id,
                    proposition_a=f"Previously clarified definition for {mismatch}",
                    proposition_b=f"New conflicting definition for {mismatch}",
                    contradiction_type=ContradictionType.DEFINITIONAL,
                )
            )
            actions.append(
                DialogueAction(
                    action_type=ConciergeActionType.REGISTER_CONTRADICTION,
                    object_ids=[contradiction_id],
                )
            )
        for hypothesis in state.hypotheses:
            proposition = hypothesis.proposition.casefold()
            try:
                validate_candidate_inference(hypothesis.proposition, hypothesis.proposition)
            except ForbiddenInferenceError:
                hypothesis.forbidden_inference = True
            if any(category in proposition for category in PROHIBITED_HYPOTHESIS_CATEGORIES):
                hypothesis.forbidden_inference = True
            if hypothesis.forbidden_inference:
                actions.append(DialogueAction(action_type=ConciergeActionType.CHALLENGE))
                return (
                    StateTransition.FORBIDDEN_INFERENCE,
                    DialogueReasonCode.FORBIDDEN_INFERENCE,
                    DialogueReasonCode.FORBIDDEN_INFERENCE.value,
                )
        open_contradictions = [
            contradiction
            for contradiction in state.contradictions
            if contradiction.status is not ContradictionStatus.RESOLVED
        ]
        if open_contradictions:
            order = {
                contradiction_type: index
                for index, contradiction_type in enumerate(CONTRADICTION_RESOLUTION_ORDER)
            }
            open_contradictions.sort(key=lambda item: (order[item.contradiction_type], item.id))
            actions.append(
                DialogueAction(
                    action_type=ConciergeActionType.CHALLENGE,
                    object_ids=[item.id for item in open_contradictions],
                )
            )
            return (
                StateTransition.EPISTEMIC_CHALLENGE,
                DialogueReasonCode.MATERIAL_CONTRADICTION,
                DialogueReasonCode.MATERIAL_CONTRADICTION.value,
            )
        critical = [
            unknown for unknown in state.unknowns if unknown.materiality is Materiality.CRITICAL
        ]
        if any(not unknown.resolvable for unknown in critical):
            actions.append(DialogueAction(action_type=ConciergeActionType.STOP_INSUFFICIENT))
            return (
                StateTransition.INSUFFICIENT_EVIDENCE,
                DialogueReasonCode.CRITICAL_UNKNOWN,
                DialogueReasonCode.CRITICAL_UNKNOWN.value,
            )
        readiness = evaluate_routing_readiness(state)
        if readiness.ready:
            actions.append(DialogueAction(action_type=ConciergeActionType.ROUTE))
            return (
                StateTransition.ROUTING_READY,
                DialogueReasonCode.ROUTING_GATE_PASS,
                None,
            )
        return (
            StateTransition.HYPOTHESIS_DISCRIMINATION,
            DialogueReasonCode.ROUTING_GATE_FAIL,
            DialogueReasonCode.ROUTING_GATE_FAIL.value,
        )

    @staticmethod
    def _handle_challenge(
        state: ProblemState, actions: list[DialogueAction]
    ) -> tuple[StateTransition, DialogueReasonCode]:
        unresolved_without_information = any(
            contradiction.status is ContradictionStatus.INSUFFICIENT_INFORMATION
            for contradiction in state.contradictions
        )
        if unresolved_without_information:
            actions.append(DialogueAction(action_type=ConciergeActionType.STOP_INSUFFICIENT))
            return (
                StateTransition.INSUFFICIENT_EVIDENCE,
                DialogueReasonCode.INSUFFICIENT_EVIDENCE,
            )
        actions.append(DialogueAction(action_type=ConciergeActionType.CHALLENGE))
        return (
            StateTransition.EPISTEMIC_CHALLENGE,
            DialogueReasonCode.MATERIAL_CONTRADICTION,
        )
