# Financial Planning capability

Sprint 7A introduces `financial_planning` as a bounded specialist capability behind the Concierge.
It is one capability family for annual budgets, rolling forecasts, reforecasts, scenario planning,
and reusable financial model builds. It is not a chatbot, an “AI CFO”, or a workbook generator.

## Runtime boundary and authority

`FinancialPlanningAgent` receives a versioned `PlanningExecutionRequest` assembled from canonical
Case state: operational problem, explicit planning scope and horizon, validated evidence references,
admitted assumptions, unresolved Unknowns, requested outputs, and business structure. Raw browser
conversation is not an input. Module B remains the evidence authority; the agent cannot change Case
readiness, validate evidence, resolve contradictions, admit assumptions, or redefine the operational
problem. Its output remains a candidate analytical result subject to the existing post-agent gate.

The central orchestrator routes the canonical `financial_planning` capability only after its existing
epistemic admission gate. Routing does not inspect the word “budget”. The Workspace may present the
activity as **Financial Planning** and preserve Concierge continuity.

## Driver methodology and scope

The immutable planning scope records currency, reporting frequency, organizational dimensions,
actual baseline, scenario/output requirements, and an explicit horizon. The horizon separates locked
Actuals, forecast periods, budget periods, and an optional rolling length; missing periods are never
zero-filled. Calendar years and monthly frequency are never defaults in the agent.

The model specification uses causal drivers. Depending on validated business context this can mean
contracts and utilization for services, volume/price/purchase cost for trading, or production volume,
BOM consumption, input price, labour, energy, and inventory movements for manufacturing. Historical
growth or inflation may only be used when it is an admitted assumption, never as an invented default.

Costs are separate driver specifications rather than a blanket uplift. Personnel distinguishes point-
in-time headcount from time-weighted average FTE and supports hires, leavers, salary, employer charges,
bonus, benefits, and timing. CAPEX is separate from OPEX and records acquisition/payment timing,
value, useful life, and depreciation method. Working capital can use DSO/DPO/inventory days or another
explicit method and requires relevant opening stocks. Cash flow integrates operating, investing, and
financing sources and requires opening cash where enabled.

## Scenario and model architecture

Base, Upside, and Downside are controlled assumption sets evaluated by one model architecture—not
duplicated models. Every assumption has an ID, mapped driver, value/unit, effective period, scenario,
source, and admission status. Unmapped or missing scenario assumptions block the quality gate.

`FinancialModelSpecification` is the authoritative Sprint 7B hand-off. It contains Case identity and
version, taxonomy, scope, dimensions, selected modules, driver/personnel/CAPEX/working-capital/cash
logic, scenarios, explicit assumptions, evidence lineage, unresolved issues, deterministic validation
requirements, and a module dependency graph. Modules are selected by scope from Inputs, Actuals,
Revenue, Personnel, OPEX, CAPEX, Working Capital, P&L, Cash Flow, Scenarios, KPIs, and Validation.

## Quality gate and Unknowns

The deterministic gate blocks missing critical revenue or cost logic, unmapped scenario assumptions,
blocking Unknowns, and missing opening cash for enabled cash modelling. Missing inputs become typed
Unknown proposals; the engine never substitutes zero or arbitrary growth. Validation requirements
cover horizon bounds, cash roll-forward, scenario-to-driver mapping, evidence/assumption lineage, and
dependency connectivity. Findings such as negative closing cash may be reported without silently
changing assumptions.

Sprint 7B may consume a ready specification to construct `Budget_Model.xlsx`. It must not reinterpret
conversation. Spreadsheet generation, formatting, charts, and workbook formula rendering remain out
of scope for this sprint.
