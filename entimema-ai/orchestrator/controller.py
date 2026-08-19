from datetime import UTC

from domain.agents import AgentTask
from domain.enums import EpistemicVerdict
from epistemic.verdicts import RequiredNextAction
from orchestrator.capability_matching import CapabilityMatchAssessment
from orchestrator.decomposition import TaskDecomposer
from orchestrator.dependencies import (
    DependencyEdgeType,
    TaskDependency,
    TaskDependencyGraph,
    build_dependency_graph,
)
from orchestrator.plans import (
    AgentAssignment,
    IndependenceType,
    OrchestrationPlan,
    PlanType,
    ReconciliationContext,
    RejectedAgent,
    RoutingRecord,
    RoutingSource,
    TaskSpecification,
    ValidationGate,
)
from orchestrator.registry import AgentRegistry
from orchestrator.routing import OrchestrationRequest, assess_agents, build_agent_task
from orchestrator.translation import DefinitionRegistry, MappingType, TranslationRecord

BLOCKING_VERDICTS = {
    EpistemicVerdict.FORBIDDEN_INFERENCE,
    EpistemicVerdict.TRACEABILITY_FAILURE,
    EpistemicVerdict.CONTRADICTED,
    EpistemicVerdict.INSUFFICIENT_EVIDENCE,
    EpistemicVerdict.OUT_OF_SCOPE,
}


class CentralOrchestrator:
    """Deterministic decomposition, routing, translation, and reconciliation preparation."""

    def __init__(
        self,
        registry: AgentRegistry | None = None,
        definitions: DefinitionRegistry | None = None,
    ) -> None:
        self.registry = registry or AgentRegistry()
        self.definitions = definitions or DefinitionRegistry()
        self.decomposer = TaskDecomposer()

    def create_plan(self, request: OrchestrationRequest) -> OrchestrationPlan:
        state = request.validated_problem_state
        validation = request.epistemic_validation_result
        if (
            validation.verdict in BLOCKING_VERDICTS
            or validation.required_next_action is not RequiredNextAction.PROCEED
        ):
            return self._blocked_plan(state.problem_id, "MODULE_B_VETO", validation.verdict)

        capabilities = sorted(set(request.requested_capabilities or []))
        tasks = self.decompose_problem(request, capabilities)
        if not tasks:
            return self._blocked_plan(
                state.problem_id,
                "NO_ADMISSIBLE_AGENT:MISSING_CAPABILITY",
                validation.verdict,
            )
        dependencies = self.build_dependency_graph(tasks)
        if not dependencies.valid:
            return self._plan(
                request,
                tasks,
                [],
                [],
                dependencies,
                [],
                [],
                [*dependencies.issues],
                PlanType.NO_ADMISSIBLE_AGENT,
                False,
                "DEPENDENCY_CYCLE",
            )

        agents = self.registry.list(request.available_agent_ids)
        assignments: list[AgentAssignment] = []
        agent_tasks: list[AgentTask] = []
        rejected: list[RejectedAgent] = []
        unresolved: list[str] = []
        for task in tasks:
            assessments = self.match_agents(agents, state, task)
            admissible = [item for item in assessments if item.admissible]
            for item in assessments:
                if not item.admissible:
                    rejected.append(
                        RejectedAgent(
                            agent_id=item.agent_id,
                            task_id=task.task_id,
                            reasons=item.rejection_reasons,
                        )
                    )
            if not admissible:
                unresolved.extend(
                    sorted(
                        {reason for item in assessments for reason in item.rejection_reasons}
                        or {"NO_ADMISSIBLE_AGENT"}
                    )
                )
                continue
            selected = sorted(admissible, key=lambda item: item.agent_id)[0]
            definition = self.registry.get(selected.agent_id)
            if definition is None:
                unresolved.append(f"AGENT_NOT_REGISTERED:{selected.agent_id}")
                continue
            assignments.append(AgentAssignment(task_id=task.task_id, agent_id=selected.agent_id))
            agent_tasks.append(build_agent_task(state, task, definition))

        translations = self.identify_translation_requirements(tasks)
        unresolved.extend(
            f"SEMANTIC_MAPPING_FAILURE:{item.translation_id}"
            for item in translations
            if not item.admissible
        )
        assigned_ids = {item.task_id for item in assignments}
        ready = (
            len(assigned_ids) == len(tasks)
            and dependencies.valid
            and not unresolved
            and bool(assignments)
        )
        plan_type = self._plan_type(tasks, dependencies, ready)
        return self._plan(
            request,
            tasks,
            agent_tasks,
            assignments,
            dependencies,
            translations,
            rejected,
            sorted(set(unresolved)),
            plan_type,
            ready,
            None if ready else "NO_ADMISSIBLE_AGENT",
        )

    def decompose_problem(
        self, request: OrchestrationRequest, capabilities: list[str]
    ) -> list[TaskSpecification]:
        return self.decomposer.decompose(
            request.validated_problem_state,
            capabilities,
            request.evidence_ids_by_capability,
            RoutingSource.PROBLEM_FORMATION,
        )

    @staticmethod
    def match_agents(agents, state, task) -> list[CapabilityMatchAssessment]:
        return assess_agents(agents, state, task)

    @staticmethod
    def build_dependency_graph(tasks: list[TaskSpecification]) -> TaskDependencyGraph:
        by_capability = {
            capability: task for task in tasks for capability in task.required_capabilities
        }
        edges = []
        reconciliation = by_capability.get("data_reconciliation")
        margin = by_capability.get("margin_analysis")
        if reconciliation and margin:
            edges.append(
                TaskDependency(
                    source_task_id=reconciliation.task_id,
                    target_task_id=margin.task_id,
                    edge_type=DependencyEdgeType.REQUIRES_VALIDATION_OF,
                )
            )
        for index, left in enumerate(tasks):
            for right in tasks[index + 1 :]:
                if set(left.evidence_ids) & set(right.evidence_ids):
                    edges.append(
                        TaskDependency(
                            source_task_id=left.task_id,
                            target_task_id=right.task_id,
                            edge_type=DependencyEdgeType.SHARES_EVIDENCE_WITH,
                        )
                    )
        return build_dependency_graph(tasks, edges)

    def identify_translation_requirements(
        self, tasks: list[TaskSpecification]
    ) -> list[TranslationRecord]:
        capabilities = {item for task in tasks for item in task.required_capabilities}
        if {"liquidity_diagnostics", "debt_service_diagnostics"} <= capabilities:
            return [
                self.definitions.translate(
                    "fin-cash-conversion",
                    "cr-debt-service",
                    MappingType.CAUSAL_LINK,
                )
            ]
        return []

    @staticmethod
    def build_agent_tasks(
        request: OrchestrationRequest,
        tasks: list[TaskSpecification],
        assignments: list[AgentAssignment],
        registry: AgentRegistry,
    ) -> list[AgentTask]:
        by_task = {item.task_id: item for item in tasks}
        result = []
        for assignment in assignments:
            definition = registry.get(assignment.agent_id)
            if definition:
                result.append(
                    build_agent_task(
                        request.validated_problem_state,
                        by_task[assignment.task_id],
                        definition,
                    )
                )
        return result

    @staticmethod
    def validate_plan(plan: OrchestrationPlan) -> bool:
        return plan.ready and len(plan.agent_assignments) == len(plan.tasks)

    @staticmethod
    def _plan_type(
        tasks: list[TaskSpecification], graph: TaskDependencyGraph, ready: bool
    ) -> PlanType:
        if not ready:
            return PlanType.NO_ADMISSIBLE_AGENT
        if len(tasks) == 1:
            return PlanType.SINGLE_AGENT
        if any(
            edge.edge_type
            in {
                DependencyEdgeType.REQUIRES_OUTPUT_FROM,
                DependencyEdgeType.REQUIRES_VALIDATION_OF,
                DependencyEdgeType.PROVIDES_INPUT_TO,
            }
            for edge in graph.edges
        ):
            return PlanType.SEQUENTIAL_AGENTS
        if len({task.domain for task in tasks}) > 1:
            return PlanType.CROSS_DOMAIN
        return PlanType.PARALLEL_AGENTS

    def _plan(
        self,
        request,
        tasks,
        agent_tasks,
        assignments,
        dependencies,
        translations,
        rejected,
        unresolved,
        plan_type,
        ready,
        blocking_reason,
    ) -> OrchestrationPlan:
        state = request.validated_problem_state
        selected = sorted({item.agent_id for item in assignments})
        candidate = [item.agent_id for item in self.registry.list(request.available_agent_ids)]
        routing_record = RoutingRecord(
            routing_id=f"routing-{state.problem_id}",
            problem_id=state.problem_id,
            candidate_agent_ids=candidate,
            selected_agent_ids=selected,
            rejected_agent_ids=sorted({item.agent_id for item in rejected}),
            selection_basis=sorted(set(request.requested_capabilities or [])),
            required_capabilities=sorted(set(request.requested_capabilities or [])),
            source_of_routing_need=RoutingSource.PROBLEM_FORMATION,
            epistemic_verdict=request.epistemic_validation_result.verdict,
            timestamp=state.updated_at.astimezone(UTC),
        )
        return OrchestrationPlan(
            plan_id=f"plan-{state.problem_id}",
            problem_id=state.problem_id,
            plan_type=plan_type,
            tasks=tasks,
            agent_tasks=agent_tasks,
            agent_assignments=assignments,
            dependencies=dependencies.edges,
            translation_requirements=translations,
            validation_gates=list(ValidationGate),
            rejected_agents=rejected,
            unresolved_requirements=unresolved,
            routing_record=routing_record,
            reconciliation_context=self._reconciliation(tasks, translations),
            ready=ready,
            blocking_reason=blocking_reason,
        )

    @staticmethod
    def _reconciliation(tasks, translations) -> ReconciliationContext | None:
        if len(tasks) < 2:
            return None
        evidence_sets = [set(task.evidence_ids) for task in tasks]
        assumption_sets = [set(task.assumption_ids) for task in tasks]
        shared_evidence = sorted(set.intersection(*evidence_sets)) if evidence_sets else []
        shared_assumptions = sorted(set.intersection(*assumption_sets)) if assumption_sets else []
        independence = []
        if shared_evidence:
            independence.append(IndependenceType.SAME_EVIDENCE)
        if shared_assumptions:
            independence.append(IndependenceType.SAME_ASSUMPTION)
        return ReconciliationContext(
            task_ids=[task.task_id for task in tasks],
            shared_evidence_ids=shared_evidence,
            shared_assumption_ids=shared_assumptions,
            definition_links=[item.translation_id for item in translations],
            horizon_differences=sorted({task.horizon or "UNRESOLVED" for task in tasks}),
            scope_differences=sorted({task.scope or "UNRESOLVED" for task in tasks}),
            independence_metadata=independence,
        )

    @staticmethod
    def _blocked_plan(problem_id, reason, verdict) -> OrchestrationPlan:
        return OrchestrationPlan(
            plan_id=f"plan-{problem_id}",
            problem_id=problem_id,
            plan_type=PlanType.NO_ADMISSIBLE_AGENT,
            tasks=[],
            agent_tasks=[],
            agent_assignments=[],
            dependencies=[],
            translation_requirements=[],
            validation_gates=list(ValidationGate),
            rejected_agents=[],
            unresolved_requirements=[reason],
            routing_record=None,
            reconciliation_context=None,
            ready=False,
            blocking_reason=f"{reason}:{verdict.value}",
        )
