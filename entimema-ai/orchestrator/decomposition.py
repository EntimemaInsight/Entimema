from domain.agents import AgentDomain
from domain.problem_state import ProblemState
from orchestrator.plans import RoutingSource, TaskSpecification

CAPABILITY_DOMAIN = {
    "liquidity_diagnostics": AgentDomain.FINANCE,
    "working_capital_analysis": AgentDomain.FINANCE,
    "margin_analysis": AgentDomain.FINANCE,
    "financial_planning": AgentDomain.FINANCE,
    "debt_service_diagnostics": AgentDomain.CREDIT_RISK,
    "pd_assessment": AgentDomain.CREDIT_RISK,
    "portfolio_monitoring": AgentDomain.CREDIT_RISK,
    "early_warning": AgentDomain.CREDIT_RISK,
    "data_reconciliation": AgentDomain.ENGINEERING,
    "data_pipeline_diagnostics": AgentDomain.ENGINEERING,
    "workflow_transformation": AgentDomain.ENGINEERING,
}

CAPABILITY_OUTPUT = {
    "liquidity_diagnostics": "structured liquidity driver assessment",
    "working_capital_analysis": "structured working-capital contribution assessment",
    "margin_analysis": "structured margin impact assessment",
    "financial_planning": "authoritative financial model specification",
    "debt_service_diagnostics": "structured debt-service implication assessment",
    "pd_assessment": "structured PD model input assessment",
    "portfolio_monitoring": "structured portfolio monitoring assessment",
    "early_warning": "structured early-warning signal assessment",
    "data_reconciliation": "validated reconciliation result contract",
    "data_pipeline_diagnostics": "structured pipeline diagnostic assessment",
    "workflow_transformation": "structured workflow transformation assessment",
}


class TaskDecomposer:
    def decompose(
        self,
        state: ProblemState,
        requested_capabilities: list[str],
        evidence_ids_by_capability: dict[str, list[str]] | None = None,
        routing_source: RoutingSource = RoutingSource.PROBLEM_FORMATION,
    ) -> list[TaskSpecification]:
        evidence_map = evidence_ids_by_capability or {}
        capabilities = sorted(dict.fromkeys(requested_capabilities))
        tasks = []
        for index, capability in enumerate(capabilities, start=1):
            domain = CAPABILITY_DOMAIN.get(capability)
            if domain is None:
                continue
            tasks.append(
                TaskSpecification(
                    task_id=f"{state.problem_id}-task-{index:02d}",
                    parent_problem_id=state.problem_id,
                    objective=f"{state.operational_problem}: {CAPABILITY_OUTPUT[capability]}",
                    domain=domain,
                    required_capabilities=[capability],
                    target_decision=state.decision_required or "unresolved decision",
                    horizon=state.decision_horizon,
                    scope=state.domain_scope[0] if state.domain_scope else None,
                    evidence_ids=sorted(set(evidence_map.get(capability, []))),
                    required_output=CAPABILITY_OUTPUT[capability],
                    routing_source=routing_source,
                )
            )
        return tasks
