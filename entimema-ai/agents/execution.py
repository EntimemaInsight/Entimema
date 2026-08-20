from pydantic import BaseModel, ConfigDict, Field

from agents.base import AgentExecutionContext, DomainAgentOutput
from agents.credit_risk import CreditRiskDiagnosticAgent
from agents.engineering import ReconciliationAgent
from agents.finance import FinancialPlanningAgent, WorkingCapitalAgent
from domain.agents import AgentResult, AgentResultStatus, AgentTask
from domain.enums import EpistemicVerdict
from domain.problem_state import ProblemState
from epistemic.controller import EpistemicController
from epistemic.verdicts import EpistemicValidationResult, TraceabilityStatus
from orchestrator.dependencies import DependencyEdgeType
from orchestrator.plans import OrchestrationPlan
from orchestrator.registry import AgentRegistry


class ValidatedAgentResult(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    agent_result: AgentResult
    epistemic_validation_result: EpistemicValidationResult
    admissible_conclusion_ids: list[str]
    rejected_conclusion_ids: list[str]
    conditional_conclusion_ids: list[str]
    traceability_status: TraceabilityStatus
    ready_for_reconciliation: bool
    calculations: list[object] = Field(default_factory=list)
    risk_indicators: list[object] = Field(default_factory=list)
    reconciliation_items: list[object] = Field(default_factory=list)


class PlanExecutionResult(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    plan_id: str
    results: list[ValidatedAgentResult]
    blocked_task_ids: list[str]
    complete: bool


class AgentExecutionController:
    def __init__(self, registry: AgentRegistry | None = None) -> None:
        self.registry = registry or AgentRegistry()
        self.epistemic = EpistemicController()
        self.agents = {
            agent.agent_id: agent
            for agent in (
                WorkingCapitalAgent(),
                FinancialPlanningAgent(),
                CreditRiskDiagnosticAgent(),
                ReconciliationAgent(),
            )
        }

    def execute_task(
        self,
        task: AgentTask,
        state: ProblemState,
        validation_result: EpistemicValidationResult,
        *,
        trace_id: str,
        definitions_by_id: dict | None = None,
    ) -> ValidatedAgentResult:
        if validation_result.verdict not in {
            EpistemicVerdict.VALIDATED,
            EpistemicVerdict.CONDITIONALLY_VALID,
        }:
            return self._failure(task, "MODULE_B_PRE_ROUTING_VETO")
        definition = self.registry.get(task.agent_id)
        agent = self.agents.get(task.agent_id)
        if definition is None or agent is None:
            return self._failure(task, "UNKNOWN_OR_NON_EXECUTABLE_AGENT")
        if not set(agent.supported_capabilities) & set(definition.capabilities):
            return self._failure(task, "AGENT_CAPABILITY_CONTRACT_MISMATCH")
        context = AgentExecutionContext(
            problem_state=state,
            evidence_by_id={item.id: item for item in state.evidence},
            claims_by_id={item.id: item for item in state.claims},
            assumptions_by_id={item.id: item for item in state.assumptions},
            unknowns_by_id={item.id: item for item in state.unknowns},
            hypotheses_by_id={item.id: item for item in state.hypotheses},
            definitions_by_id=definitions_by_id or {},
            validation_result=validation_result,
            trace_id=trace_id,
        )
        output = agent.execute(task, context)
        post = self.epistemic.validate_agent_result(
            output.agent_result, state, task, output.calculations
        )
        return self._validated(output, post)

    def execute_plan(
        self,
        plan: OrchestrationPlan,
        state: ProblemState,
        validation_result: EpistemicValidationResult,
    ) -> PlanExecutionResult:
        tasks = {item.task_id: item for item in plan.agent_tasks}
        dependencies = {
            task_id: {
                edge.source_task_id
                for edge in plan.dependencies
                if edge.target_task_id == task_id
                and edge.edge_type
                in {
                    DependencyEdgeType.REQUIRES_OUTPUT_FROM,
                    DependencyEdgeType.REQUIRES_VALIDATION_OF,
                }
            }
            for task_id in tasks
        }
        results = []
        completed = set()
        failed = set()
        blocked = []
        while len(completed | failed | set(blocked)) < len(tasks):
            progressed = False
            for task_id in sorted(tasks):
                if task_id in completed or task_id in failed or task_id in blocked:
                    continue
                requirements = dependencies[task_id]
                if requirements & failed:
                    blocked.append(task_id)
                    progressed = True
                    continue
                if not requirements <= completed:
                    continue
                result = self.execute_task(
                    tasks[task_id], state, validation_result, trace_id=f"{plan.plan_id}:{task_id}"
                )
                results.append(result)
                if result.ready_for_reconciliation:
                    completed.add(task_id)
                else:
                    failed.add(task_id)
                progressed = True
            if not progressed:
                blocked.extend(sorted(set(tasks) - completed - failed - set(blocked)))
        return PlanExecutionResult(
            plan_id=plan.plan_id,
            results=results,
            blocked_task_ids=sorted(blocked),
            complete=len(completed) == len(tasks),
        )

    @staticmethod
    def _validated(output: DomainAgentOutput, post: EpistemicValidationResult):
        return ValidatedAgentResult(
            agent_result=output.agent_result,
            epistemic_validation_result=post,
            admissible_conclusion_ids=post.validated_object_ids,
            rejected_conclusion_ids=post.rejected_object_ids,
            conditional_conclusion_ids=post.unresolved_object_ids,
            traceability_status=post.traceability_status,
            ready_for_reconciliation=(
                post.verdict in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID}
                and not post.rejected_object_ids
            ),
            calculations=output.calculations,
            risk_indicators=output.risk_indicators,
            reconciliation_items=output.reconciliation_items,
        )

    def _failure(self, task, reason):
        result = AgentResult(
            task_id=task.task_id,
            agent_id=task.agent_id,
            conclusions=[],
            evidence_used=[],
            assumptions_used=[],
            calculations=[],
            model_outputs=[],
            alternatives=[],
            contradictions_found=[],
            unresolved_unknowns=[],
            limitations=[reason],
            status=AgentResultStatus.FAILED_VALIDATION,
        )
        post = EpistemicValidationResult(
            verdict=EpistemicVerdict.INSUFFICIENT_EVIDENCE,
            traceability_status=TraceabilityStatus.INCOMPLETE,
            blocking_reasons=[reason],
            required_next_action="STOP_INSUFFICIENT",
        )
        return self._validated(DomainAgentOutput(agent_result=result), post)
