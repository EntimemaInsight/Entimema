import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

export const financialDataNormalisationSections = [
  { id: "before-analysis", label: "The error before analysis" },
  { id: "meaning", label: "Formatting is not meaning" },
  { id: "framework", label: "Seven-stage framework" },
  { id: "canonical", label: "Canonical translation" },
  { id: "period-sign-currency", label: "Periods, signs and currency" },
  { id: "worked-example", label: "Two P&Ls, one view" },
  { id: "confidence", label: "Confidence and unknowns" },
  { id: "validation", label: "Validation and readiness" },
  { id: "automation", label: "Controlled automation" },
  { id: "resolve", label: "From sources to findings" },
] as const;

export default function FinancialDataNormalisationArticle() {
  return <>
    <p className={styles.leadParagraph}>Two profit and loss statements can describe the same economic reality and still produce different margins after consolidation. The arithmetic may be flawless. The structures are not: one classifies cost by nature, the other by function; one is monthly, the other year-to-date; one stores expenses as positive values, the other as negatives. A polished dashboard can therefore be mathematically correct and economically false.</p>
    <p>Financial analysis does not begin with ratios, charts or commentary. It begins by proving that values from different statements, entities, periods, ERP systems and spreadsheet models have been translated into a coherent analytical structure without losing their economic meaning or evidential lineage. That proof is financial data normalisation.</p>
    <KeyObservation title="Executive thesis">Normalisation is a controlled translation from heterogeneous financial evidence to decision-fit information. Structure is detected, meaning is interpreted, periods are aligned, concepts are mapped, arithmetic is validated, exceptions remain visible and material ambiguity reaches a human reviewer.</KeyObservation>

    <section id="before-analysis">
      <h2>The decisive analytical error often happens before the analysis</h2>
      <p>Availability is not readiness. A file can open and still conceal merged headers, implicit scaling or cumulative periods. Extraction can recover every number without establishing what any number represents. Cleaning can standardise dates and column names while leaving incompatible definitions untouched. Reconciliation can prove that totals balance while composition remains wrong.</p>
      <ResourceTable caption="The maturity of financial information" headers={["State", "Control gained", "Residual risk"]} rows={[
        ["Available", "A source can be accessed", "Scope, structure and completeness are unknown"],
        ["Extracted", "Values and labels are captured", "Context may be detached from values"],
        ["Structured", "Headers, rows, periods and totals are identified", "Accounting meaning is not yet established"],
        ["Interpreted", "Economic meaning and qualifiers are understood", "Sources may still use incompatible definitions"],
        ["Harmonised", "Periods, scenarios, signs, scale and currency are controlled", "Concepts are not yet in a common taxonomy"],
        ["Mapped", "Source concepts enter a canonical structure", "Mappings may be ambiguous or incomplete"],
        ["Reconciled", "Transformations and accounting identities are tested", "Offsetting semantic errors can still survive"],
        ["Analysis-ready", "Evidence is fit for the intended decision", "Disclosed limitations remain decision-relative"],
      ]} />
      <p>The sequence is cumulative: <strong>Available → Extracted → Structured → Interpreted → Harmonised → Mapped → Reconciled → Analysis-Ready.</strong> Skipping a stage does not remove its risk. It merely transfers that risk into a later metric, chart or conclusion where it becomes harder to see.</p>
      <p>This is why a consolidated gross margin can be misleading even when every source total agrees. Logistics may sit in external services for one entity and cost of sales for another. Depreciation may be explicit by nature but embedded within production and administration by function. If labels are combined before these differences are understood, the resulting comparison measures reporting design as much as operating performance.</p>
      <DecisionImplication>Do not ask whether the numbers were imported successfully. Ask which claims about comparability the evidence now supports—and which it does not.</DecisionImplication>
    </section>

    <section id="meaning">
      <h2>Formatting consistency is not economic equivalence</h2>
      <p>Syntactic normalisation makes data technically consistent: date formats, decimal separators, numeric types, column names, currency codes, signs, units and file structures. It is necessary because a value stored as text cannot be added reliably and “1,250” may mean different things under different locale conventions.</p>
      <p>Semantic normalisation answers the harder questions. What does the value represent? Which entity, reporting scope, period and scenario apply? Is it gross or net, recurring or exceptional, point-in-time or a flow? Which product, customer, cost centre or geography qualifies its meaning? Can it responsibly be compared with another value?</p>
      <p>Identical labels are not proof of identical meaning. “Other operating income” can contain recurring service income in one source and an exceptional disposal gain in another. Similar labels are not proof either: “freight”, “distribution” and “logistics” may overlap, but their accounting and management treatment depends on where the activity occurs and what decision the analysis is meant to support.</p>
      <Formula label="A source value is more than an amount">vᵢ = (xᵢ, lᵢ, eᵢ, pᵢ, sᵢ, cᵢ, uᵢ, dᵢ, mᵢ, qᵢ)</Formula>
      <p>Here <em>xᵢ</em> is the amount; the remaining fields preserve original label, entity and scope, period, scenario, currency, unit, dimensions, canonical mapping and the evidence or review state. Successfully extracting <em>xᵢ</em> is not sufficient. The control chain is <strong>Source value → Transformation rule → Canonical value → Analytical use.</strong></p>
    </section>

    <section id="framework">
      <h2>Seven stages turn heterogeneous statements into a controlled dataset</h2>
      <EntimemaFramework title="Financial Data Normalisation" description="Each stage adds a specific control; exceptions remain visible rather than being forced through the pipeline." steps={["Heterogeneous Sources", "Structural Detection", "Semantic Interpretation", "Period Harmonisation", "Canonical Mapping", "Validation & Exceptions", "Analysis-Ready Dataset"]} />
      <h3>1. Structural detection</h3>
      <p>Financial sources are often designed for human reading rather than computation. They use multi-row headers, merged cells, indentation, subtotal hierarchies, horizontal periods, hidden scaling notes and visually bounded PDF tables. Detection must identify statement boundaries, headers, row hierarchy, periods, value fields, totals, dimensions and structural qualifiers before values are interpreted.</p>
      <p>Extraction confidence and accounting confidence are different. A system may be highly confident that a cell contains 1,240 while having weak evidence about whether it is monthly revenue, year-to-date revenue or a subtotal in EUR thousands. Optical or structural certainty must never be presented as certainty about meaning.</p>
      <h3>2. Semantic interpretation</h3>
      <p>Interpretation combines label, structural position, statement context, neighbouring rows, notes, dimensional qualifiers and known precedents. Exact label matching is only one signal. Lexical similarity asks whether words resemble each other; accounting equivalence asks whether their recognition and presentation are comparable; analytical equivalence asks whether they can serve the same decision.</p>
      <h3>3–4. Harmonisation and mapping</h3>
      <p>Period, scenario, sign, scale and currency are made explicit before source concepts enter the canonical structure. Mapping may be one-to-one, many-to-one, one-to-many, conditional or unresolved. A many-to-one map can combine several local payroll accounts into personnel expense. A one-to-many map requires evidence to split a source line—for example, external services between production logistics and administrative services. Without that evidence, the split is unresolved, not estimated for convenience.</p>
      <h3>5–7. Validation, exceptions and readiness</h3>
      <p>Deterministic controls test arithmetic and transformation integrity. Evidence states decide whether a mapping can proceed automatically, requires targeted review or blocks the intended analysis. Only then is a dataset released for a defined analytical use. Human review is not a parallel manual process; it is concentrated exactly where material meaning cannot be established safely.</p>
    </section>

    <section id="canonical">
      <h2>A canonical structure is a translation layer, not a replacement for evidence</h2>
      <p>A canonical financial record can hold the source document and location, entity, reporting scope, original label and amount, canonical concept, reporting period and type, scenario, currency, scale, sign convention, dimensions, mapping rule, confidence, validation state, review state and provenance. The structure creates a stable analytical vocabulary while preserving the source’s own expression.</p>
      <p>This distinction matters when management views legitimately differ. A statutory statement may classify expenses by nature; an internal view may assign them by function; a contribution analysis may separate variable and structural economics. Normalisation should support those translations without pretending one view erases the others.</p>
      <ResourceTable caption="Mapping patterns and their control requirements" headers={["Pattern", "Example", "Control"]} rows={[
        ["One-to-one", "Local revenue line → Revenue", "Confirm scope, gross/net basis and period"],
        ["Many-to-one", "Several payroll accounts → Personnel expense", "Prove completeness and prevent duplicates"],
        ["One-to-many", "External services → production logistics + administration", "Require a defensible split driver or retain unresolved"],
        ["Conditional", "Depreciation → cost of sales or administration by cost centre", "Apply an explicit dimension-dependent rule"],
        ["Unresolved", "Other operating income without supporting detail", "Preserve value and block material downstream use"],
      ]} />
      <p>Dimensions are part of meaning, not optional decoration. Entity, business unit, cost centre, profit centre, product, customer, geography, channel, scenario and reporting version determine which comparisons are valid. Group totals can reconcile while customer or product composition is incomparable because one entity reports at transaction level and another at a broad segment.</p>
    </section>

    <section id="period-sign-currency">
      <h2>Periods, signs, units and currencies require purpose-specific rules</h2>
      <p>Month, year-to-date, quarter, cumulative quarter, fiscal period and calendar period are not interchangeable. Actual, budget and forecast also need aligned definitions. Balance-sheet values describe a point in time; P&amp;L values describe flows. Partial periods and different cut-offs must be disclosed or aligned before variance analysis.</p>
      <Formula label="Deriving a monthly flow from cumulative values">Monthly valueₜ = YTDₜ − YTD₍ₜ₋₁₎</Formula>
      <p>The formula is valid only when entity scope, accounting definitions, currency treatment and prior-period adjustments remain consistent. A restated prior month or changed consolidation perimeter breaks the naïve subtraction and requires a controlled adjustment.</p>
      <p>Signs have at least four layers: stored sign, debit or credit orientation, presentation sign and analytical operator. An expense stored as a debit may be presented as positive in one P&amp;L and negative in another. A global sign reversal is unsafe because revenue, contra-revenue, reversals, provisions and balance-sheet accounts do not share one universal presentation rule.</p>
      <p>Scale must be explicit. A workbook can mix units with thousands through labels, formatting or hidden assumptions. Converting silently destroys the evidence chain; retaining original amount and unit allows the transformation to be reproduced. Rounding differences should be controlled with justified tolerances rather than erased.</p>
      <p>Currency conversion is concept- and purpose-dependent. P&amp;L flows may use average rates, balance-sheet positions closing rates and equity historical rates under the relevant reporting policy. Constant-currency analysis answers a different question from reported-currency consolidation. The source currency, reporting currency, rate type, rate date and transformation must remain identifiable.</p>
    </section>

    <section id="worked-example">
      <h2>Two P&amp;Ls can reconcile and still tell the wrong margin story</h2>
      <p>Consider two fictional entities with similar operations. Source A reports July by nature in EUR, with expenses shown as positive values. Source B reports January–July by function in EUR thousands, with deductions shown as negative values. Its July amount is derived from consecutive year-to-date statements. Both report operating profit of €1.20m for July after scale and period alignment.</p>
      <ResourceTable caption="Compact source comparison before normalisation (€m after period and scale conversion)" headers={["Source A — by nature", "July", "Source B — by function", "July"]} rows={[
        ["Revenue", "10.00", "Revenue", "10.00"],
        ["Change in inventories", "0.20", "Cost of sales", "−6.10"],
        ["Materials", "4.10", "Gross profit", "3.90"],
        ["Personnel expenses", "2.30", "Distribution expenses", "−1.00"],
        ["Depreciation", "0.50", "Administrative expenses", "−1.30"],
        ["External services", "1.40", "Other operating income", "+0.10"],
        ["Other operating income", "0.20", "Other operating expenses", "−0.50"],
        ["Other operating expenses", "0.90", "Operating profit", "1.20"],
        ["Operating profit", "1.20", "", ""],
      ]} />
      <p>A naïve comparison reports Source B’s gross margin as 39%. Source A has no gross-profit line, so an analyst might map materials plus inventory movement to cost of sales and infer 57%. That 18-point apparent advantage is not an operating conclusion. Source A’s external services include €0.90m of production logistics, and its payroll and depreciation contain €0.70m and €0.30m respectively attributable to production. After those supported mappings, its comparable cost of sales is €5.80m and gross margin is 42%.</p>
      <p>Source B’s cost of sales includes logistics and production depreciation, but a note shows €0.30m of exceptional shutdown cost. Management chooses to show both reported and recurring views, not silently remove the item. On a recurring basis B’s cost of sales is €5.80m and its gross margin is also 42%. The apparent structural advantage disappears.</p>
      <ResourceFigure label="By-nature and by-function profit and loss statements converging into a controlled analytical view while one unsupported allocation remains visible for review." caption="The canonical view preserves reported values, explicit transformation rules and unresolved distinctions; it does not manufacture a false precision.">
        <div className={styles.framework04}><ol>{["A: by nature", "Detect", "Interpret", "Align period", "Normalise sign/scale", "Map concepts", "Review exception", "Reconcile", "Comparable view"].map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol><div>{["Source evidence", "Controlled rules", "Canonical concepts", "Visible exceptions", "Decision use"].map(x => <span key={x}>{x}</span>)}</div></div>
      </ResourceFigure>
      <ResourceTable caption="Normalised management output for July (€m)" headers={["Measure", "Entity A", "Entity B", "Interpretation"]} rows={[
        ["Revenue", "10.00", "10.00", "Comparable monthly scope"],
        ["Reported cost of sales", "5.80", "6.10", "B includes exceptional shutdown cost"],
        ["Reported gross margin", "42.0%", "39.0%", "Difference is classification-sensitive"],
        ["Recurring cost of sales", "5.80", "5.80", "Explicit €0.30 adjustment for B"],
        ["Recurring gross margin", "42.0%", "42.0%", "No structural advantage established"],
        ["Operating profit", "1.20", "1.20", "Both source totals reconcile"],
        ["Unallocated support cost", "0.20 review", "—", "Insufficient dimension for product margin"],
      ]} />
      <p>The progression was structural detection, semantic interpretation, period alignment, sign and scale normalisation, canonical mapping, ambiguity identification, targeted review and deterministic reconciliation. The unresolved €0.20m support-cost split is immaterial for entity gross margin but material for product profitability. Entity-level analysis can proceed with a limitation; product-margin analysis cannot.</p>
      <DecisionImplication>Classification, scale and period inconsistencies made one entity appear structurally stronger. Controlled normalisation changed the management conclusion from “investigate Entity B’s weak margin” to “no margin gap is established; investigate the exceptional shutdown and the unresolved product allocation.”</DecisionImplication>
    </section>

    <section id="confidence">
      <h2>Confidence is an evidence state, not an arbitrary percentage</h2>
      <p>Mapping evidence can include label specificity, structural position, statement context, precedent, period certainty, unit and sign certainty, dimensional compatibility, cross-document agreement, reconciliation support and unresolved contradictions. The result should be operational: high-confidence mapping, conditional mapping, review required, unresolved or blocked.</p>
      <p><strong>Unknown ≠ Zero.</strong> An unknown must not silently become zero, “Other”, the nearest familiar category or an assumed mapping. Preserve the original value and lineage. Request a supporting note, account detail or owner clarification; disclose an immaterial limitation; or block the affected analysis when the uncertainty is material.</p>
      <ResourceTable caption="Decision states for normalised financial data" headers={["State", "Evidence condition", "Permitted action"]} rows={[
        ["Ready", "Structure, meaning and controls are sufficiently supported", "Proceed to analysis"],
        ["Ready with limitations", "Residual uncertainty is immaterial and disclosed", "Analyse with explicit caveats"],
        ["Review required", "A material mapping or definition remains ambiguous", "Route the specific exception"],
        ["Blocked", "Reconciliation or evidence-chain failure affects the decision", "Stop downstream analysis"],
        ["Source insufficient", "Required meaning cannot be established responsibly", "Request another source or clarification"],
      ]} />
      <p>Materiality is tied to the intended decision, not merely the size of a line. A small amount can be important if it changes a covenant, regulatory classification or product decision. Conversely, an unresolved dimension may not prevent a group EBITDA trend while still blocking customer profitability.</p>
    </section>

    <section id="validation">
      <h2>Reconciliation is necessary—and insufficient</h2>
      <p>Deterministic code should own arithmetic, period logic, fixed transformations and control totals. Relevant identities include:</p>
      <Formula label="Core financial controls">Revenue − Cost of Sales = Gross Profit<br />Gross Profit − Operating Expenses ± Other Operating Items = Operating Profit<br />Assets = Liabilities + Equity<br />Opening Cash + Net Cash Movement = Closing Cash</Formula>
      <Formula label="Transformation control">Σ Normalised Values + Explicit Transformation Adjustments = Σ Source Values</Formula>
      <p>Opening balance plus period movements and valid adjustments should equal closing balance. These tests detect omissions, duplication, sign errors and unexplained transformations. Yet a balanced statement is not semantic proof: two errors can offset, wrong categories can preserve totals, a duplicate can be concealed by an omission and an incorrect hierarchy can still add correctly.</p>
      <p>A dataset is analysis-ready only when relevant structures are identified; values have sufficient meaning; periods and scenarios align; sign, currency and scale are controlled; material mappings meet evidence requirements; reconciliations pass within justified tolerances; material exceptions are resolved or disclosed; lineage remains available; and the data is fit for the intended decision.</p>
      <KeyObservation title="Readiness principle">Analysis readiness is decision-relative, not a claim of perfect data. The same dataset may be ready for group trend analysis, ready with limitations for entity comparison and blocked for product profitability.</KeyObservation>
    </section>

    <section id="automation">
      <h2>Automation should accelerate evidence, not conceal exceptions</h2>
      <ResourceTable caption="Failure, distortion, consequence and required control" headers={["Failure", "Hidden distortion", "Decision consequence", "Required control"]} rows={[
        ["Exact or similarity-only label mapping", "Context and accounting basis disappear", "False comparability", "Use structure, context, precedent and reconciliation evidence"],
        ["Unknown treated as zero or Other", "Uncertainty becomes a fabricated fact", "Margins and variances are understated", "Preserve unknown; review or block when material"],
        ["Global sign reversal", "Contra-items and account orientations are corrupted", "Direction of performance is wrong", "Concept-specific sign rules"],
        ["Silent scale conversion", "Amounts can move by 1,000×", "Materiality and liquidity decisions fail", "Retain source unit and explicit transformation"],
        ["Monthly and YTD mixed", "Flows cover different horizons", "Variance and run-rate conclusions are false", "Period typing and cumulative controls"],
        ["One FX rule for every concept", "Flows and positions use inappropriate rates", "Consolidated performance is distorted", "Purpose- and concept-specific rate policy"],
        ["Balanced total accepted as proof", "Misclassification survives", "Wrong margin or KPI interpretation", "Composition tests plus accounting reconciliation"],
        ["Undocumented override", "Learning and accountability disappear", "Recurring analysis becomes inconsistent", "Versioned rule, rationale, reviewer and effective date"],
      ]} />
      <p>Model intelligence is useful for semantic interpretation, mapping proposals, ambiguity detection and high-value interpretation. It should not be asked to perform deterministic arithmetic that code can reproduce exactly. Conversely, rigid rules should not force genuinely ambiguous accounting meaning. Corrections can improve mapping knowledge only through governed precedents with scope, effective dates and ownership.</p>
      <p>The objective is controlled automation with visible exceptions. High-evidence routine transformations should become fast and repeatable. Human judgement should be retained exactly where the evidence cannot support safe automation.</p>
    </section>

    <section id="resolve">
      <h2>Normalisation creates a reusable financial evidence architecture</h2>
      <p>Once structures, meanings and controls are explicit, entities and periods become comparable; actual-versus-budget analysis uses aligned definitions; margin and profitability measures stabilise; exceptions remain visible; mapping knowledge becomes reusable; and recurring analysis becomes faster without weakening governance.</p>
      <p>The Entimema Financial Intelligence workflow carries this responsibility end to end: <strong>Intelligent Intake → Document and Data Understanding → Financial Extraction → Period Harmonisation → Canonical Mapping → Deterministic Validation and Reconciliation → Confidence and Exceptions → Human Review → Validated Financial Model → Financial Analysis and Findings → Traceable Export.</strong></p>
      <p>The workflow—not an isolated agent—is the product boundary. Model intelligence proposes and interprets. Deterministic code owns arithmetic and fixed controls. Finance professionals own material judgement where evidence remains insufficient. Every analytical finding can retain a backward trace through metric, canonical concept, transformation rule, source value and source location.</p>
      <p>This architecture complements Entimema’s research on <Link href="/resources/from-erp-data-to-management-intelligence">ERP data and management intelligence</Link> and the <Link href="/services/financial-data">Financial Data service</Link>. It also creates the controlled input required by forecasting, profitability and management-reporting systems.</p>
      <h3>The resolve is not cleaner data. It is defensible comparison.</h3>
      <p>Financial statements will continue to reflect different systems, policies, organisational structures and management needs. Normalisation should not flatten those differences blindly. It should make them explicit, translate what can be translated, preserve what remains distinct and stop analysis where the evidence chain fails.</p>
      <DecisionImplication>Bring a financial statement and see how it is transformed into a validated analytical structure. <Link href="/contact">Discuss a financial intelligence engagement</Link>.</DecisionImplication>
    </section>
  </>;
}
