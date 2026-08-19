from agents.execution import ValidatedAgentResult
from domain.agents import AgentConclusionRecord, AgentResult, AgentResultStatus, ConclusionType
from epistemic.verdicts import EpistemicValidationResult, RequiredNextAction, TraceabilityStatus
from orchestrator.plans import OrchestrationPlan
from tests.agent_helpers import task


def validated_result(
    agent_id: str,
    proposition: str,
    evidence_ids: list[str],
    *,
    task_id: str,
    assumptions: list[str] | None = None,
) -> ValidatedAgentResult:
    conclusion = AgentConclusionRecord(
        id=f"c-{task_id}",
        proposition=proposition,
        conclusion_type=ConclusionType.EVIDENCE_SYNTHESIS,
        evidence_ids=evidence_ids,
        assumption_ids=assumptions or [],
        uncertainty="low",
    )
    result = AgentResult(
        task_id=task_id,
        agent_id=agent_id,
        conclusions=[proposition],
        evidence_used=evidence_ids,
        assumptions_used=assumptions or [],
        calculations=[],
        model_outputs=[],
        alternatives=[],
        contradictions_found=[],
        unresolved_unknowns=[],
        limitations=["Bounded to supplied evidence."],
        status=AgentResultStatus.COMPLETE,
        conclusion_records=[conclusion],
    )
    validation = EpistemicValidationResult(
        verdict="VALIDATED",
        validated_object_ids=[conclusion.id],
        traceability_status=TraceabilityStatus.COMPLETE,
        required_next_action=RequiredNextAction.PROCEED,
    )
    return ValidatedAgentResult(
        agent_result=result,
        epistemic_validation_result=validation,
        admissible_conclusion_ids=[conclusion.id],
        rejected_conclusion_ids=[],
        conditional_conclusion_ids=[],
        traceability_status=TraceabilityStatus.COMPLETE,
        ready_for_reconciliation=True,
    )


def plan_for(specs):
    return OrchestrationPlan.model_construct(
        plan_id="plan-synthesis",
        problem_id="p-agent",
        agent_tasks=[
            task(
                agent_id,
                evidence_ids,
                task_id=task_id,
                horizon=horizon,
                scope=scope,
            )
            for task_id, agent_id, evidence_ids, horizon, scope in specs
        ],
        dependencies=[],
        reconciliation_context=None,
    )
