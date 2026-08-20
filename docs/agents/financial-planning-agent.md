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

## Workbook-generation architecture (Sprint 7B)

`FinancialWorkbookBuilder` is a deterministic execution component downstream of the capability. It
accepts only an immutable `FinancialModelSpecification`; it never receives or reinterprets a
conversation and has no authority to validate evidence, admit assumptions, repair missing inputs, or
change a plan. It returns a typed result containing stable workbook identity, filename,
specification/Case references, XLSX bytes, generation version and timestamp, validations, lineage,
liquidity findings, and registration/download references. Missing authoritative opening cash or a
blocking Unknown returns `WORKBOOK_BLOCKED` and no workbook bytes.

The implementation uses `openpyxl` and does not require Microsoft Excel. It selects sheets strictly
from the requested module list, plus Navigation and hidden model metadata. The active modules are
numbered dynamically in Navigation. Monthly, quarterly, and annual axes are derived exclusively from
the horizon; locked periods are labelled ACTUAL, and their cells accept only specified actual values,
while forecast/budget cells retain formulas. Inputs, linked evidence, formulas, and outputs are also
identified in labels/comments and font semantics rather than relying on colour alone.

Driver modules translate each declared input token to a visible row and replace those tokens with
plain Excel cell references in the declared formula (for example, `volume * price`). Cost drivers use
the same transparent translation without inflation or growth defaults. Personnel keeps Closing
Headcount and Average FTE as distinct rows. CAPEX keeps acquisitions, depreciation and cash payment
separate; Working Capital states and applies only its specified method; P&L links declared driver
outputs; and Cash Flow emits an opening-cash roll-forward and check. Unsupported or missing inputs are
not silently converted into planning assumptions.

One Scenarios sheet owns a validated selection cell and named `Selected_Scenario`; assumption lookup
formulas select the relevant controlled set without duplicating model sheets. Scenario comparison is
kept concise and does not invent unsupported metrics. The dedicated Validation sheet reports check,
PASS/WARNING/FAIL, difference, tolerance, and detail for formula structure, timeline, scenario
mapping, provenance, connectivity, and cash roll-forward. Formula references are inspected after
construction, while metadata explicitly distinguishes **formula structure validated** from **formula
results recalculated**. Excel-compatible clients are instructed to fully recalculate on open.

Evidence IDs remain on the artifact result and in hidden metadata. Detailed lineage records retain
artifact, source location, and Case version; reproduced actual cells carry compact comments. Metadata
also records generator/model version, Case/version, analysis run, specification, timestamp, currency,
horizon, and evidence set. A deterministic specification hash provides workbook identity; timestamps
are operational metadata and are not inputs to formula/layout construction.

`build_and_register` passes successful XLSX bytes to the existing artifact registration service using
the XLSX media type and an idempotent generation command. Registration does not call evidence
admission: the result is a generated `Artifact`, not validated `Evidence`. Its storage reference is
returned as the Concierge/workspace download reference for a **Financial model ready / Download
workbook** action. Critical validation failure never produces a production-ready delivery.

### Limitations

Python validates workbook serialization and formula structure but does not calculate Excel formulas.
Liquidity diagnostics are returned directly only when all cash movements are authoritative numeric
specification values; otherwise Excel recalculates the editable model on open. Sprint 7B does not add
charts, macros, aggressive protection, OCR, a balance-sheet module, or an alternative spreadsheet
agent. Formula vocabulary is deliberately limited to understandable formulas supplied by the
authoritative specification.
