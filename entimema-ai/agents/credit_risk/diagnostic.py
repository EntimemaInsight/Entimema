from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

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


class RiskDimension(StrEnum):
    PAYMENT_BEHAVIOUR = "PAYMENT_BEHAVIOUR"
    LIQUIDITY = "LIQUIDITY"
    LEVERAGE = "LEVERAGE"
    PROFITABILITY = "PROFITABILITY"
    DEBT_SERVICE = "DEBT_SERVICE"
    COVENANT = "COVENANT"
    EXPOSURE = "EXPOSURE"
    PORTFOLIO_MIGRATION = "PORTFOLIO_MIGRATION"
    DATA_GAP = "DATA_GAP"


class IndicatorDirection(StrEnum):
    IMPROVING = "IMPROVING"
    STABLE = "STABLE"
    DETERIORATING = "DETERIORATING"
    UNKNOWN = "UNKNOWN"


class RiskIndicatorRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    dimension: RiskDimension
    proposition: str
    evidence_ids: list[str]
    direction: IndicatorDirection
    severity: str
    status: str
    horizon: str | None = None
    limitations: list[str] = Field(default_factory=list)


class DiagnosticRuleConfig(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    rule_id: str
    dimension: RiskDimension
    operator: str
    threshold: float
    severity: str
    source: str


CONCEPT_DIMENSION = {
    "payment_behaviour": RiskDimension.PAYMENT_BEHAVIOUR,
    "liquidity": RiskDimension.LIQUIDITY,
    "leverage": RiskDimension.LEVERAGE,
    "profitability": RiskDimension.PROFITABILITY,
    "debt_service": RiskDimension.DEBT_SERVICE,
    "covenant": RiskDimension.COVENANT,
    "exposure": RiskDimension.EXPOSURE,
    "portfolio_migration": RiskDimension.PORTFOLIO_MIGRATION,
}
FORBIDDEN_CONCEPTS = {"hesitation", "silence", "linguistic_style", "tone", "personality", "refusal"}


class CreditRiskDiagnosticAgent(DomainAgent):
    agent_id = "CR_DIAGNOSTIC_001"
    domain = AgentDomain.CREDIT_RISK
    version = "1.0"
    supported_capabilities = ("debt_service_diagnostics",)

    def validate_task(self, task: AgentTask, context: AgentExecutionContext) -> list[str]:
        errors = referenced_input_errors(task, context)
        if task.agent_id != self.agent_id:
            errors.append("AGENT_ID_MISMATCH")
        return errors

    def execute(self, task: AgentTask, context: AgentExecutionContext) -> DomainAgentOutput:
        errors = self.validate_task(task, context)
        if errors:
            return self._result(task, [], errors, AgentResultStatus.INSUFFICIENT_INPUT)
        indicators = []
        for identifier in task.evidence_ids:
            item = context.evidence_by_id[identifier]
            if not item.concept or item.concept in FORBIDDEN_CONCEPTS:
                continue
            dimension = CONCEPT_DIMENSION.get(item.concept)
            if not dimension or not item.indicator_direction:
                continue
            indicators.append(
                RiskIndicatorRecord(
                    id=f"{task.task_id}-indicator-{item.id}",
                    dimension=dimension,
                    proposition=item.proposition,
                    evidence_ids=[item.id],
                    direction=IndicatorDirection(item.indicator_direction),
                    severity=item.indicator_severity or "UNSPECIFIED",
                    status="OBSERVED_DIMENSION",
                    horizon=task.horizon,
                    limitations=["No PD or aggregate risk score is produced."],
                )
            )
        for identifier in task.unknown_ids:
            unknown = context.unknowns_by_id[identifier]
            indicators.append(
                RiskIndicatorRecord(
                    id=f"{task.task_id}-gap-{unknown.id}",
                    dimension=RiskDimension.DATA_GAP,
                    proposition=f"Required information remains unknown: {unknown.variable}.",
                    evidence_ids=[],
                    direction=IndicatorDirection.UNKNOWN,
                    severity="UNSPECIFIED",
                    status="DATA_GAP",
                    horizon=task.horizon,
                    limitations=[
                        "Missing information is not evidence of higher risk or concealment."
                    ],
                )
            )
        limitations = ["No PD, default prediction, or aggregate risk score is produced."]
        return self._result(
            task,
            indicators,
            limitations,
            AgentResultStatus.CONDITIONAL,
            [item.id for item in context.problem_state.contradictions],
        )

    def _result(self, task, indicators, limitations, status, contradictions=None):
        conclusions = [
            AgentConclusionRecord(
                id=f"{item.id}-conclusion",
                proposition=item.proposition,
                conclusion_type=(
                    ConclusionType.DATA_GAP
                    if item.dimension is RiskDimension.DATA_GAP
                    else ConclusionType.EVIDENCE_SYNTHESIS
                ),
                evidence_ids=item.evidence_ids,
                uncertainty="dimension-specific; no aggregation",
            )
            for item in indicators
        ]
        result = AgentResult(
            task_id=task.task_id,
            agent_id=self.agent_id,
            conclusions=[item.proposition for item in conclusions],
            evidence_used=task.evidence_ids,
            assumptions_used=task.assumption_ids,
            calculations=[],
            model_outputs=[],
            alternatives=[],
            contradictions_found=contradictions or [],
            unresolved_unknowns=task.unknown_ids,
            limitations=limitations,
            status=status,
            conclusion_records=conclusions,
        )
        return DomainAgentOutput(agent_result=result, risk_indicators=indicators)
