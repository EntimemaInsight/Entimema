"""Bounded financial planning methodology and deterministic quality gate."""

from agents.base import (
    AgentExecutionContext,
    DomainAgent,
    DomainAgentOutput,
    referenced_input_errors,
)
from domain.agents import AgentDomain, AgentResult, AgentResultStatus, AgentTask
from domain.financial_planning import (
    DependencyEdge,
    FinancialModelSpecification,
    ModelModule,
    ModelValidationRequirement,
    PlanningAnalysisResult,
    PlanningExecutionRequest,
    PlanningStatus,
    PlanningUnknown,
)


class FinancialPlanningAgent(DomainAgent):
    agent_id = "FIN_FINANCIAL_PLANNING_001"
    domain = AgentDomain.FINANCE
    version = "1.0"
    supported_capabilities = ("financial_planning",)

    def analyse(
        self, request: PlanningExecutionRequest, *, trace_id: str
    ) -> PlanningAnalysisResult:
        blockers: list[str] = []
        unknowns = list(request.unresolved_unknowns)
        if not request.revenue_drivers:
            blockers.append("CRITICAL_REVENUE_LOGIC_UNDEFINED")
            unknowns.append(
                PlanningUnknown(
                    unknown_id=f"{request.case_id}-revenue-driver",
                    variable="revenue driver architecture",
                    why_needed="Revenue cannot be modelled without a validated causal driver.",
                    blocking=True,
                )
            )
        if not request.cost_drivers:
            blockers.append("CRITICAL_COST_LOGIC_UNDEFINED")
        assumption_ids = {item.assumption_id for item in request.assumptions}
        driver_ids = {item.driver_id for item in request.revenue_drivers + request.cost_drivers}
        for scenario in request.scenarios:
            missing = set(scenario.assumption_ids) - assumption_ids
            if missing:
                blockers.append(
                    f"SCENARIO_ASSUMPTIONS_MISSING:{scenario.scenario_id}:{','.join(sorted(missing))}"
                )
        for assumption in request.assumptions:
            if assumption.driver_id not in driver_ids:
                blockers.append(f"SCENARIO_DRIVER_UNMAPPED:{assumption.assumption_id}")
        if request.cash_flow.enabled and not request.cash_flow.opening_cash_evidence_id:
            blockers.append("OPENING_CASH_UNDEFINED")
            unknowns.append(
                PlanningUnknown(
                    unknown_id=f"{request.case_id}-opening-cash",
                    variable="opening cash balance",
                    why_needed="A stock balance is required to derive closing cash.",
                    blocking=True,
                )
            )
        blocking_unknowns = [item for item in unknowns if item.blocking]
        if blocking_unknowns:
            blockers.extend(f"BLOCKING_UNKNOWN:{item.unknown_id}" for item in blocking_unknowns)
        blockers = sorted(set(blockers))
        validations = self._validations()
        if blockers:
            return PlanningAnalysisResult(
                status=PlanningStatus.BLOCKED,
                model_specification=None,
                findings=[],
                validation_results=blockers,
                additional_unknowns=unknowns,
                blockers=blockers,
                evidence_used=request.validated_evidence_ids,
                assumptions_used=sorted(assumption_ids),
                case_version=request.case_version,
                execution_provenance={
                    "agent_id": self.agent_id,
                    "agent_version": self.version,
                    "trace_id": trace_id,
                    "case_version": str(request.case_version),
                },
            )
        dependencies = self._dependencies(request.requested_modules)
        specification = FinancialModelSpecification(
            model_id=f"fm-{request.case_id}-v{request.case_version}",
            case_id=request.case_id,
            case_version=request.case_version,
            planning_type=request.planning_type,
            scope=request.planning_scope,
            business_structure=request.business_structure,
            business_dimensions=request.business_dimensions,
            modules=request.requested_modules,
            revenue_drivers=request.revenue_drivers,
            cost_drivers=request.cost_drivers,
            personnel=request.personnel,
            capex=request.capex,
            working_capital=request.working_capital,
            cash_flow=request.cash_flow,
            scenarios=request.scenarios,
            assumptions=request.assumptions,
            dependencies=dependencies,
            validation_requirements=validations,
            source_evidence_ids=request.validated_evidence_ids,
            unresolved_issues=unknowns,
        )
        return PlanningAnalysisResult(
            status=PlanningStatus.MODEL_SPECIFICATION_READY,
            model_specification=specification,
            findings=[],
            validation_results=["QUALITY_GATE_PASSED"],
            additional_unknowns=unknowns,
            blockers=[],
            evidence_used=request.validated_evidence_ids,
            assumptions_used=sorted(assumption_ids),
            case_version=request.case_version,
            execution_provenance={
                "agent_id": self.agent_id,
                "agent_version": self.version,
                "trace_id": trace_id,
                "case_version": str(request.case_version),
            },
        )

    def validate_task(self, task: AgentTask, context: AgentExecutionContext) -> list[str]:
        errors = referenced_input_errors(task, context)
        if task.agent_id != self.agent_id:
            errors.append("AGENT_ID_MISMATCH")
        if "financial_planning_request" not in context.definitions_by_id:
            errors.append("STRUCTURED_PLANNING_INPUT_REQUIRED")
        return errors

    def execute(self, task: AgentTask, context: AgentExecutionContext) -> DomainAgentOutput:
        errors = self.validate_task(task, context)
        if errors:
            return self._domain_output(task, None, errors)
        request = PlanningExecutionRequest.model_validate(
            context.definitions_by_id["financial_planning_request"]
        )
        result = self.analyse(request, trace_id=context.trace_id)
        return self._domain_output(task, result, result.blockers)

    def _domain_output(self, task, result, blockers):
        ready = result is not None and result.status is PlanningStatus.MODEL_SPECIFICATION_READY
        return DomainAgentOutput(
            agent_result=AgentResult(
                task_id=task.task_id,
                agent_id=self.agent_id,
                conclusions=["Financial model specification ready"] if ready else [],
                evidence_used=result.evidence_used if result else [],
                assumptions_used=result.assumptions_used if result else [],
                calculations=[],
                model_outputs=[result.model_specification.model_id] if ready else [],
                alternatives=[],
                contradictions_found=[],
                unresolved_unknowns=[item.unknown_id for item in result.additional_unknowns]
                if result
                else [],
                limitations=blockers,
                status=AgentResultStatus.COMPLETE
                if ready
                else AgentResultStatus.INSUFFICIENT_INPUT,
            )
        )

    @staticmethod
    def _dependencies(modules):
        present = set(modules)
        candidates = [
            (ModelModule.ACTUALS, ModelModule.REVENUE),
            (ModelModule.INPUTS, ModelModule.REVENUE),
            (ModelModule.INPUTS, ModelModule.PERSONNEL),
            (ModelModule.INPUTS, ModelModule.OPEX),
            (ModelModule.REVENUE, ModelModule.PL),
            (ModelModule.PERSONNEL, ModelModule.PL),
            (ModelModule.OPEX, ModelModule.PL),
            (ModelModule.CAPEX, ModelModule.PL),
            (ModelModule.PL, ModelModule.WORKING_CAPITAL),
            (ModelModule.PL, ModelModule.CASH_FLOW),
            (ModelModule.WORKING_CAPITAL, ModelModule.CASH_FLOW),
            (ModelModule.CAPEX, ModelModule.CASH_FLOW),
            (ModelModule.CASH_FLOW, ModelModule.KPIS),
        ]
        return [
            DependencyEdge(upstream=a, downstream=b)
            for a, b in candidates
            if a in present and b in present
        ]

    @staticmethod
    def _validations():
        return [
            ModelValidationRequirement(
                validation_id="timeline",
                category="TIMELINE",
                expression="every model period is inside the explicit planning horizon",
            ),
            ModelValidationRequirement(
                validation_id="cash-rollforward",
                category="ACCOUNTING",
                expression="opening_cash + net_cash_movement = closing_cash",
            ),
            ModelValidationRequirement(
                validation_id="scenario-map",
                category="SCENARIO",
                expression="every scenario assumption maps to an existing driver",
            ),
            ModelValidationRequirement(
                validation_id="evidence-lineage",
                category="EVIDENCE",
                expression=(
                    "critical baseline values reference validated evidence or admitted assumptions"
                ),
            ),
            ModelValidationRequirement(
                validation_id="dependency-connectivity",
                category="ARCHITECTURE",
                expression="every required module is connected to its upstream drivers",
            ),
        ]
