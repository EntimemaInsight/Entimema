"""Read-only boundary from structured Q* to client financial language."""

import re
from dataclasses import dataclass

from concierge.question_selection import QuestionCandidate
from domain.contradictions import ContradictionRecord
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord


@dataclass(frozen=True)
class QuestionRealisation:
    """A presentation attached to, never substituted for, a structured Q*."""

    question_id: str
    client_question: str
    target_unknown_ids: tuple[str, ...]
    target_contradiction_id: str | None
    epistemic_reason: str


class InteractionRealizer:
    """Realise an already-selected question without deciding or mutating Case state."""

    _TECHNICAL_TERMS = re.compile(
        r"\b(?:DSO|DPO|FCF|ECL|PD|LGD|vintage|cohort|working capital|debt service)\b",
        re.IGNORECASE,
    )

    def realise(self, question: QuestionCandidate, state: ProblemState) -> QuestionRealisation:
        unknown = self._target_unknown(question, state)
        contradiction = self._target_contradiction(question, state)
        if contradiction:
            text = self._contradiction(contradiction)
        elif unknown:
            text = self._unknown(unknown, state)
        else:
            text = self._reference(question.question, state)
        return QuestionRealisation(
            question_id=question.id,
            client_question=text,
            target_unknown_ids=tuple(question.targets_unknown_ids),
            target_contradiction_id=contradiction.id if contradiction else None,
            epistemic_reason=question.epistemic_reason,
        )

    @staticmethod
    def _target_unknown(question: QuestionCandidate, state: ProblemState) -> UnknownRecord | None:
        targets = set(question.targets_unknown_ids)
        return next((item for item in state.unknowns if item.id in targets), None)

    @staticmethod
    def _target_contradiction(
        question: QuestionCandidate, state: ProblemState
    ) -> ContradictionRecord | None:
        target = (
            question.targets_contradiction_ids[0]
            if question.targets_contradiction_ids
            else question.id.removeprefix("q-contradiction-")
        )
        return next((item for item in state.contradictions if item.id == target), None)

    def _unknown(self, unknown: UnknownRecord, state: ProblemState) -> str:
        variable = unknown.variable.lower().replace("_", " ").replace("-", " ")
        context = " ".join(
            filter(None, [state.declared_problem, state.user_goal, state.decision_required])
        )
        technical = bool(self._TECHNICAL_TERMS.search(context))

        if any(term in variable for term in ("cash shortage", "liquidity", "cash pressure")):
            if technical:
                return (
                    "Where is the liquidity pressure visible first — operating cash flow, "
                    "working-capital absorption, or debt service?"
                )
            return (
                "When cash is tight, where do you feel it first — suppliers, payroll, taxes, "
                "debt payments, or somewhere else?"
            )
        if any(term in variable for term in ("measurement period", "time period", "duration")):
            return "Did this begin recently, or has it been recurring over several months?"
        if any(term in variable for term in ("verification source", "evidence source", "document")):
            if "cash" in context.lower() or "liquidity" in context.lower():
                return (
                    "To see when cash is being absorbed, what recent record is available — "
                    "cash balances, a cash-flow report, or AR/AP ageing? You can add the most "
                    "relevant one with +Evidence."
                )
            return "What record would be most useful to verify this, if one is available?"
        if any(
            term in variable for term in ("budget scope", "business structure", "planning scope")
        ):
            return (
                "Which parts of the business should the budget cover, and at what level of detail?"
            )
        if any(term in variable for term in ("planning horizon", "budget horizon")):
            return "What planning period should the budget cover?"
        if any(term in variable for term in ("vintage", "cohort", "deterioration")):
            return (
                "Which loan vintages are deteriorating, over what observation window, and which "
                "metric is moving — arrears, roll rates, defaults, or loss emergence?"
            )
        label = unknown.variable.replace("_", " ").replace("-", " ").strip()
        return (
            f"What does {label} look like in the business, and why does it matter for the decision?"
        )

    @staticmethod
    def _contradiction(item: ContradictionRecord) -> str:
        refs_a = ", ".join(item.evidence_a_ids) or "the first source"
        refs_b = ", ".join(item.evidence_b_ids) or "the second source"
        return (
            f"I have two different records: {item.proposition_a} ({refs_a}) and "
            f"{item.proposition_b} ({refs_b}). Which should govern this analysis, or is there "
            "a scope or timing difference between them?"
        )

    @staticmethod
    def _reference(machine_question: str, state: ProblemState) -> str:
        context = (state.declared_problem or "this").rstrip(". ")
        return f"When you refer to {context}, what does that mean in practice for this decision?"


def question_priority(variable: str) -> int:
    """Deterministic decision value: formation before evidence convenience."""
    value = variable.lower().replace("_", " ").replace("-", " ")
    if any(term in value for term in ("definition", "cash shortage", "liquidity", "deterioration")):
        return 6
    if any(term in value for term in ("scope", "structure", "horizon", "period")):
        return 4
    if any(term in value for term in ("source", "document", "evidence")):
        return 2
    return 3
