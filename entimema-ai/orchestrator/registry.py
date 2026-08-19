from domain.agents import AgentDefinition, AgentDomain


def _agent(
    agent_id: str,
    domain: AgentDomain,
    capabilities: list[str],
    *,
    required_inputs: list[str] | None = None,
    methods: list[str] | None = None,
) -> AgentDefinition:
    return AgentDefinition(
        agent_id=agent_id,
        domain=domain,
        capabilities=capabilities,
        accepted_problem_types=["*"],
        required_inputs=required_inputs or ["operational_problem", "target_decision"],
        optional_inputs=["evidence", "claims", "assumptions", "unknowns"],
        supported_horizons=["*"],
        supported_populations=["*"],
        supported_methods=methods or ["*"],
        output_schema={"type": "structured_agent_result"},
        version="0.1-contract",
    )


SEEDED_AGENTS = (
    _agent("FIN_LIQUIDITY_001", AgentDomain.FINANCE, ["liquidity_diagnostics"]),
    _agent("FIN_WORKING_CAPITAL_001", AgentDomain.FINANCE, ["working_capital_analysis"]),
    _agent("FIN_MARGIN_001", AgentDomain.FINANCE, ["margin_analysis"]),
    _agent("FIN_BUDGET_FORECAST_001", AgentDomain.FINANCE, ["budget_forecasting"]),
    _agent("CR_DIAGNOSTIC_001", AgentDomain.CREDIT_RISK, ["debt_service_diagnostics"]),
    _agent("CR_PD_001", AgentDomain.CREDIT_RISK, ["pd_assessment"]),
    _agent("CR_PORTFOLIO_MONITORING_001", AgentDomain.CREDIT_RISK, ["portfolio_monitoring"]),
    _agent("CR_EARLY_WARNING_001", AgentDomain.CREDIT_RISK, ["early_warning"]),
    _agent(
        "ENG_RECONCILIATION_001",
        AgentDomain.ENGINEERING,
        ["data_reconciliation"],
        required_inputs=["operational_problem", "target_decision", "evidence"],
    ),
    _agent("ENG_DATA_PIPELINE_001", AgentDomain.ENGINEERING, ["data_pipeline_diagnostics"]),
    _agent("ENG_WORKFLOW_001", AgentDomain.ENGINEERING, ["workflow_transformation"]),
)


class AgentRegistry:
    def __init__(self, definitions: list[AgentDefinition] | None = None) -> None:
        agents = definitions if definitions is not None else list(SEEDED_AGENTS)
        self._agents = {agent.agent_id: agent.model_copy(deep=True) for agent in agents}
        if len(self._agents) != len(agents):
            raise ValueError("agent IDs must be unique")

    def get(self, agent_id: str) -> AgentDefinition | None:
        agent = self._agents.get(agent_id)
        return agent.model_copy(deep=True) if agent else None

    def list(self, available_agent_ids: list[str] | None = None) -> list[AgentDefinition]:
        allowed = set(available_agent_ids) if available_agent_ids is not None else None
        return [
            self._agents[key].model_copy(deep=True)
            for key in sorted(self._agents)
            if allowed is None or key in allowed
        ]
