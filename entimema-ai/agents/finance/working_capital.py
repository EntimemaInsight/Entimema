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


class WorkingCapitalAgent(DomainAgent):
    agent_id = "FIN_WORKING_CAPITAL_001"
    domain = AgentDomain.FINANCE
    version = "1.0"
    supported_capabilities = ("working_capital_analysis", "liquidity_diagnostics")

    def validate_task(self, task: AgentTask, context: AgentExecutionContext) -> list[str]:
        errors = referenced_input_errors(task, context)
        if task.agent_id != self.agent_id:
            errors.append("AGENT_ID_MISMATCH")
        return errors

    def execute(self, task: AgentTask, context: AgentExecutionContext) -> DomainAgentOutput:
        errors = self.validate_task(task, context)
        if errors:
            return self._failure(task, errors)
        evidence = [context.evidence_by_id[item] for item in task.evidence_ids]
        values = {
            (item.concept, item.period_label): item
            for item in evidence
            if item.concept and item.numeric_value is not None
        }
        calculations: list[CalculationRecord] = []
        conclusions: list[AgentConclusionRecord] = []
        limitations = [
            "Working-capital analysis does not explain financing or investing cash flows."
        ]

        current = self._nwc("current", values, calculations)
        prior = self._nwc("prior", values, calculations)
        if current and prior:
            delta = current[0] - prior[0]
            input_ids = current[1] + prior[1]
            calculations.append(
                CalculationRecord(
                    id=f"{task.task_id}-delta-nwc",
                    formula="NWC_current - NWC_prior",
                    input_ids=input_ids,
                    units=[current[2], prior[2]],
                    transformations=["subtract prior-period NWC from current-period NWC"],
                    result=delta,
                    output_unit=current[2],
                )
            )
            direction = "operating cash absorption" if delta > 0 else "operating cash release"
            conclusions.extend(
                [
                    AgentConclusionRecord(
                        id=f"{task.task_id}-c-delta",
                        proposition=f"Net working capital changed by {delta} {current[2]}.",
                        conclusion_type=ConclusionType.CALCULATION,
                        evidence_ids=input_ids,
                        calculation_ids=[f"{task.task_id}-delta-nwc"],
                        uncertainty="bounded to supplied working-capital balances",
                    ),
                    AgentConclusionRecord(
                        id=f"{task.task_id}-c-cash-effect",
                        proposition=(
                            f"The change represents {direction} of {abs(delta)} {current[2]}."
                        ),
                        conclusion_type=ConclusionType.DIAGNOSTIC_INFERENCE,
                        evidence_ids=input_ids,
                        calculation_ids=[f"{task.task_id}-delta-nwc"],
                        uncertainty="does not explain total cash movement",
                        causal_level="CONTRIBUTION",
                    ),
                ]
            )
        else:
            limitations.append("Current and prior AR, inventory, and AP are required for DeltaNWC.")

        self._ratios(task, values, calculations, conclusions, limitations)
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
            limitations=limitations,
            status=(AgentResultStatus.CONDITIONAL if limitations else AgentResultStatus.COMPLETE),
            conclusion_records=conclusions,
        )
        return DomainAgentOutput(agent_result=result, calculations=calculations)

    def _nwc(self, period, values, calculations):
        records = [
            values.get((name, period))
            for name in ("accounts_receivable", "inventory", "accounts_payable")
        ]
        if any(item is None for item in records):
            return None
        ar, inventory, ap = records
        if len({ar.unit, inventory.unit, ap.unit}) != 1 or ar.unit is None:
            return None
        result = ar.numeric_value + inventory.numeric_value - ap.numeric_value
        ids = [ar.id, inventory.id, ap.id]
        calculations.append(
            CalculationRecord(
                id=f"nwc-{period}",
                formula="AR + Inventory - AP",
                input_ids=ids,
                units=[ar.unit, inventory.unit, ap.unit],
                transformations=["sum AR and inventory; subtract AP"],
                result=result,
                output_unit=ar.unit,
            )
        )
        return result, ids, ar.unit

    def _ratios(self, task, values, calculations, conclusions, limitations):
        days = values.get(("period_days", "current"))
        ratio_specs = (
            ("DSO", "accounts_receivable", "revenue"),
            ("DIO", "inventory", "cogs"),
            ("DPO", "accounts_payable", "purchases_or_cogs"),
        )
        for name, numerator_name, denominator_name in ratio_specs:
            numerator = values.get((numerator_name, "current"))
            denominator = values.get((denominator_name, "current"))
            if not numerator or not denominator or not days or denominator.numeric_value == 0:
                limitations.append(
                    f"{name} not calculated: explicit denominator/time basis unavailable."
                )
                continue
            value = numerator.numeric_value / denominator.numeric_value * days.numeric_value
            calculation_id = f"{task.task_id}-{name.casefold()}"
            calculations.append(
                CalculationRecord(
                    id=calculation_id,
                    formula=f"{numerator_name} / {denominator_name} * days",
                    input_ids=[numerator.id, denominator.id, days.id],
                    units=[numerator.unit or "", denominator.unit or "", days.unit or "days"],
                    transformations=[
                        "divide numerator by explicit denominator and multiply by days"
                    ],
                    result=value,
                    output_unit="days",
                )
            )
            conclusions.append(
                AgentConclusionRecord(
                    id=f"{task.task_id}-c-{name.casefold()}",
                    proposition=f"{name} is {value} days.",
                    conclusion_type=ConclusionType.CALCULATION,
                    evidence_ids=[numerator.id, denominator.id, days.id],
                    calculation_ids=[calculation_id],
                    uncertainty="mechanical ratio from supplied values",
                )
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
