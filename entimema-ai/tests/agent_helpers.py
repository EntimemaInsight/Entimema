from datetime import UTC, datetime

from agents.base import AgentExecutionContext
from domain.agents import AgentTask
from domain.enums import EpistemicType, EpistemicVerdict
from domain.evidence import EvidenceRecord
from domain.problem_state import ProblemState
from epistemic.verdicts import (
    EpistemicValidationResult,
    RequiredNextAction,
    TraceabilityStatus,
)


def evidence(
    identifier: str,
    concept: str,
    value: float | None = None,
    *,
    period: str | None = "current",
    source_type: str = "ledger_a",
    key: str | None = None,
    unit: str = "EUR",
    direction: str | None = None,
) -> EvidenceRecord:
    return EvidenceRecord(
        id=identifier,
        proposition=f"{concept} observation",
        evidence_type=EpistemicType.RETRIEVED,
        source=source_type,
        source_type=source_type,
        timestamp=datetime.now(UTC),
        provenance=[f"{source_type}:{identifier}"],
        reliability=1,
        concept=concept,
        numeric_value=value,
        canonical_key=key,
        period_label=period,
        unit=unit,
        indicator_direction=direction,
        indicator_severity="MATERIAL" if direction else None,
    )


def state(evidence_records=None, **updates) -> ProblemState:
    values = {
        "session_id": "s-agent",
        "problem_id": "p-agent",
        "operational_problem": "Execute bounded domain analysis",
        "decision_required": "Review validated findings",
        "evidence": evidence_records or [],
    }
    values.update(updates)
    return ProblemState(**values)


def validation(verdict=EpistemicVerdict.VALIDATED) -> EpistemicValidationResult:
    return EpistemicValidationResult(
        verdict=verdict,
        traceability_status=TraceabilityStatus.COMPLETE,
        required_next_action=RequiredNextAction.PROCEED,
    )


def task(agent_id: str, evidence_ids=None, **updates) -> AgentTask:
    values = {
        "task_id": f"task-{agent_id.lower()}",
        "agent_id": agent_id,
        "operational_problem": "Execute bounded domain analysis",
        "target_decision": "Review validated findings",
        "evidence_ids": evidence_ids or [],
        "required_output": "typed atomic findings",
    }
    values.update(updates)
    return AgentTask(**values)


def context(problem: ProblemState) -> AgentExecutionContext:
    return AgentExecutionContext(
        problem_state=problem,
        evidence_by_id={item.id: item for item in problem.evidence},
        claims_by_id={item.id: item for item in problem.claims},
        assumptions_by_id={item.id: item for item in problem.assumptions},
        unknowns_by_id={item.id: item for item in problem.unknowns},
        hypotheses_by_id={item.id: item for item in problem.hypotheses},
        validation_result=validation(),
        trace_id="trace-1",
    )
