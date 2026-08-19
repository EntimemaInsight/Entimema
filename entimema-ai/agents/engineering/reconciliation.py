from enum import StrEnum

from pydantic import BaseModel, ConfigDict

from agents.base import (
    AgentExecutionContext,
    DomainAgent,
    DomainAgentOutput,
    referenced_input_errors,
)
from domain.agents import (
    AgentConclusionRecord,
    AgentDomain,
    AgentResult,
    AgentResultStatus,
    AgentTask,
    ConclusionType,
)
from epistemic.inference_validation import CalculationRecord


class MatchStatus(StrEnum):
    MATCHED = "MATCHED"
    VALUE_MISMATCH = "VALUE_MISMATCH"
    MISSING_IN_A = "MISSING_IN_A"
    MISSING_IN_B = "MISSING_IN_B"
    DEFINITION_MISMATCH = "DEFINITION_MISMATCH"
    PERIOD_MISMATCH = "PERIOD_MISMATCH"
    UNIT_MISMATCH = "UNIT_MISMATCH"


class ReconciliationItem(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    key: str
    source_a_id: str | None = None
    source_b_id: str | None = None
    match_status: MatchStatus
    value_a: float | None = None
    value_b: float | None = None
    difference: float | None = None
    unit: str | None = None
    period: str | None = None
    issue_type: str | None = None


class ReconciliationAgent(DomainAgent):
    agent_id = "ENG_RECONCILIATION_001"
    domain = AgentDomain.ENGINEERING
    version = "1.0"
    supported_capabilities = ("data_reconciliation",)

    def validate_task(self, task: AgentTask, context: AgentExecutionContext) -> list[str]:
        errors = referenced_input_errors(task, context)
        if task.agent_id != self.agent_id:
            errors.append("AGENT_ID_MISMATCH")
        records = [
            context.evidence_by_id[item]
            for item in task.evidence_ids
            if item in context.evidence_by_id
        ]
        if records and any(not item.canonical_key for item in records):
            errors.append("MISSING_CANONICAL_KEY")
        if not records:
            errors.append("NO_RECONCILIATION_EVIDENCE")
        return errors

    def execute(self, task: AgentTask, context: AgentExecutionContext) -> DomainAgentOutput:
        errors = self.validate_task(task, context)
        if errors:
            return self._failure(task, errors)
        records = [context.evidence_by_id[item] for item in task.evidence_ids]
        by_source = {}
        for item in records:
            by_source.setdefault(item.source_type, {})[item.canonical_key] = item
        sources = sorted(by_source)
        if len(sources) != 2:
            return self._failure(task, ["EXACTLY_TWO_SOURCE_TYPES_REQUIRED"])
        a, b = by_source[sources[0]], by_source[sources[1]]
        items = []
        calculations = []
        for key in sorted(set(a) | set(b)):
            left, right = a.get(key), b.get(key)
            if left is None:
                items.append(self._item(task, key, None, right, MatchStatus.MISSING_IN_A))
            elif right is None:
                items.append(self._item(task, key, left, None, MatchStatus.MISSING_IN_B))
            elif left.definition != right.definition:
                items.append(self._item(task, key, left, right, MatchStatus.DEFINITION_MISMATCH))
            elif (left.period_start, left.period_end) != (right.period_start, right.period_end):
                items.append(self._item(task, key, left, right, MatchStatus.PERIOD_MISMATCH))
            elif left.unit != right.unit:
                items.append(self._item(task, key, left, right, MatchStatus.UNIT_MISMATCH))
            elif left.numeric_value is None or right.numeric_value is None:
                items.append(self._item(task, key, left, right, MatchStatus.VALUE_MISMATCH))
            elif left.numeric_value == right.numeric_value:
                items.append(self._item(task, key, left, right, MatchStatus.MATCHED, 0))
            else:
                difference = left.numeric_value - right.numeric_value
                item = self._item(task, key, left, right, MatchStatus.VALUE_MISMATCH, difference)
                items.append(item)
                calculations.append(
                    CalculationRecord(
                        id=f"{item.id}-difference",
                        formula="source_a - source_b",
                        input_ids=[left.id, right.id],
                        units=[left.unit or "", right.unit or ""],
                        transformations=["exact-key compatible numeric subtraction"],
                        result=difference,
                        output_unit=left.unit or "",
                    )
                )
        conclusions = [
            AgentConclusionRecord(
                id=f"{item.id}-conclusion",
                proposition=f"Key {item.key}: {item.match_status.value}.",
                conclusion_type=ConclusionType.RECONCILIATION_FINDING,
                evidence_ids=[
                    identifier for identifier in (item.source_a_id, item.source_b_id) if identifier
                ],
                calculation_ids=(
                    [f"{item.id}-difference"]
                    if item.match_status is MatchStatus.VALUE_MISMATCH
                    else []
                ),
                uncertainty="exact canonical-key matching only",
            )
            for item in items
        ]
        result = AgentResult(
            task_id=task.task_id,
            agent_id=self.agent_id,
            conclusions=[item.proposition for item in conclusions],
            evidence_used=task.evidence_ids,
            assumptions_used=task.assumption_ids,
            calculations=[item.id for item in calculations],
            model_outputs=[],
            alternatives=[],
            contradictions_found=[item.id for item in context.problem_state.contradictions],
            unresolved_unknowns=task.unknown_ids,
            limitations=["Exact canonical-key matching only; no fuzzy identity resolution."],
            status=AgentResultStatus.COMPLETE,
            conclusion_records=conclusions,
        )
        return DomainAgentOutput(
            agent_result=result, calculations=calculations, reconciliation_items=items
        )

    def _item(self, task, key, left, right, status, difference=None):
        return ReconciliationItem(
            id=f"{task.task_id}-item-{key}",
            key=key,
            source_a_id=left.id if left else None,
            source_b_id=right.id if right else None,
            match_status=status,
            value_a=left.numeric_value if left else None,
            value_b=right.numeric_value if right else None,
            difference=difference,
            unit=(left.unit if left else right.unit),
            period=(left.period_label if left else right.period_label),
            issue_type=(None if status is MatchStatus.MATCHED else status.value),
        )

    def _failure(self, task, errors):
        return DomainAgentOutput(
            agent_result=AgentResult(
                task_id=task.task_id,
                agent_id=self.agent_id,
                conclusions=[],
                evidence_used=[],
                assumptions_used=[],
                calculations=[],
                model_outputs=[],
                alternatives=[],
                contradictions_found=[],
                unresolved_unknowns=[],
                limitations=errors,
                status=AgentResultStatus.INSUFFICIENT_INPUT,
            )
        )
