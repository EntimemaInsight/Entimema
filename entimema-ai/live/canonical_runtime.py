"""Canonical command, formation, audit, transition, analysis and projection pipeline."""

from dataclasses import dataclass

from concierge.question_selection import OrdinalLevel, QuestionCandidate, select_next_best_question
from domain.enums import DecisionReadiness, EpistemicVerdict, WorkspacePhase
from domain.problem_state import ProblemState
from epistemic.controller import EpistemicController
from epistemic.verdicts import RequiredNextAction
from live.commands import ApplyInterpretedTurn
from live.response import project_state
from problem_formation.engine import ProblemFormationEngine, ProblemFormationInput
from synthesis.runtime import EndToEndRuntime, EndToEndRuntimeResult


@dataclass(frozen=True)
class CanonicalTurnResult:
    state: ProblemState
    projection: dict
    question: str | None
    analysis: EndToEndRuntimeResult | None


class CanonicalConciergeRuntime:
    """The sole live aggregate mutation and lifecycle transition authority."""

    def __init__(self) -> None:
        self.formation = ProblemFormationEngine()
        self.auditor = EpistemicController()
        self.analysis = EndToEndRuntime()

    def apply(self, state: ProblemState, command: ApplyInterpretedTurn) -> CanonicalTurnResult:
        formation = self.formation.form_problem(
            state,
            ProblemFormationInput(
                problem_id=state.problem_id,
                declared_problem=command.declared_problem,
                candidate_object=command.candidate_object,
                candidate_goal=command.candidate_goal,
                candidate_decision=command.decision,
                candidate_horizon=command.horizon,
                candidate_scope=command.scope,
                supplied_claims=command.claims,
                supplied_assumptions=command.assumptions,
                supplied_claim_ids=[item.id for item in command.claims],
                supplied_unknowns=command.unknowns,
                embedded_hypotheses=command.hypotheses,
                candidate_operational_problems=command.operational_candidates,
                unresolved_reference_candidates=command.unresolved_references,
            ),
        )
        updated = formation.updated_problem_state
        audit = self.auditor.validate_pre_routing(updated)
        updated.epistemic_verdict = audit.verdict
        updated.blockers = list(audit.blocking_reasons)
        updated.workspace_phase = self._phase(updated, formation.operational_problem is not None)
        ready = (
            formation.routing_ready
            and audit.required_next_action is RequiredNextAction.PROCEED
            and audit.verdict in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID}
        )
        updated.decision_readiness = (
            DecisionReadiness.ANALYSIS_READY
            if ready
            else DecisionReadiness.FORMATION_READY
            if formation.operational_problem
            else DecisionReadiness.BLOCKED
        )
        updated.routing_ready = ready
        question = self._question(
            updated, formation.next_best_unknown_id, audit, command.unresolved_references
        )
        updated.next_best_question = question
        analysis = None
        if ready and command.requested_capabilities:
            updated.workspace_phase = WorkspacePhase.ANALYSIS
            updated.decision_readiness = DecisionReadiness.ANALYSIS_IN_PROGRESS
            analysis = self.analysis.run(updated, command.requested_capabilities)
            updated.workspace_phase = WorkspacePhase.DECISION_SUPPORT
            updated.decision_readiness = (
                DecisionReadiness.DECISION_SUPPORT_READY
                if analysis.final_synthesis_result.user_synthesis_ready
                else DecisionReadiness.BLOCKED
            )
        return CanonicalTurnResult(
            state=updated,
            projection=project_state(updated, audit=audit, analysis=analysis),
            question=question,
            analysis=analysis,
        )

    @staticmethod
    def _phase(state: ProblemState, formed: bool) -> WorkspacePhase:
        if state.contradictions:
            return WorkspacePhase.EPISTEMIC_REVIEW
        if formed:
            return WorkspacePhase.EPISTEMIC_REVIEW
        return WorkspacePhase.PROBLEM_DISCOVERY

    @staticmethod
    def _question(state, next_unknown_id, audit, unresolved_references) -> str | None:
        candidates = []
        for target in unresolved_references:
            candidates.append(
                QuestionCandidate(
                    id=f"q-reference-{target}",
                    question=f"What precise definition should be used for {target}?",
                    information_gain=OrdinalLevel.HIGH,
                    user_cost=OrdinalLevel.LOW,
                    presupposition_risk=OrdinalLevel.LOW,
                )
            )
        unknowns = {item.id: item for item in state.unknowns}
        if next_unknown_id in unknowns:
            item = unknowns[next_unknown_id]
            candidates.append(
                QuestionCandidate(
                    id=f"q-{item.id}",
                    question=f"What is {item.variable}, and what source can verify it?",
                    targets_unknown_ids=[item.id],
                    information_gain=OrdinalLevel.HIGH,
                    user_cost=OrdinalLevel.LOW,
                    presupposition_risk=OrdinalLevel.LOW,
                )
            )
        for contradiction_id in audit.contradiction_ids:
            candidates.append(
                QuestionCandidate(
                    id=f"q-{contradiction_id}",
                    question=f"Which source should resolve contradiction {contradiction_id}?",
                    information_gain=OrdinalLevel.HIGH,
                    user_cost=OrdinalLevel.MEDIUM,
                    presupposition_risk=OrdinalLevel.LOW,
                )
            )
        selected = select_next_best_question(candidates)
        return selected.question if selected else None
