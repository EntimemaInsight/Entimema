import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

export const financialDataValidationSections = [
  { id: "false-assurance", label: "Extraction is not validation" },
  { id: "control-layer", label: "The control layer" },
  { id: "deterministic-controls", label: "Deterministic controls" },
  { id: "period-semantics", label: "Period and meaning" },
  { id: "duplicates-missing-signs", label: "Duplicates, gaps and signs" },
  { id: "cross-document", label: "Cross-document evidence" },
  { id: "materiality", label: "Materiality and exceptions" },
  { id: "worked-example", label: "A controlled reconciliation" },
  { id: "failure-modes", label: "Hidden failure modes" },
  { id: "decision-status", label: "Decision readiness" },
  { id: "operating-model", label: "The operating model" },
] as const;

export default function FinancialDataValidationArticle() {
  return <>
    <p className={styles.leadParagraph}>A reported value has been extracted perfectly from a financial statement. It matches the source cell digit for digit. Yet it belongs to the wrong period, breaks the cash bridge and causes the resulting liquidity conclusion to be false. Nothing failed at the point of reading. The failure occurred because extraction fidelity was mistaken for financial validity.</p>
    <p>A system can locate the correct cell, preserve its decimals, reproduce the table and render an immaculate dashboard while the Balance Sheet does not balance, a subtotal omits a source row or two mapping errors offset. Successful extraction is an input event. It is not a control conclusion.</p>
    <KeyObservation title="Executive thesis">Financial data becomes decision-ready only through distinct controls for source fidelity, completeness, arithmetic, accounting, cross-statement relationships, periods and meaning. Material exceptions must resolve, remain bounded and disclosed, or block the affected analysis. The result is an explicit validation state—not a vague quality score.</KeyObservation>

    <section id="false-assurance">
      <h2>A number may be faithful to its source and false for the decision</h2>
      <p>Extraction accuracy asks a narrow and valuable question: <strong>was the value read faithfully from the identified source location?</strong> Numeric fidelity, decimal and thousands separators, brackets, negative signs, percentages, currencies, units, row and column association, table boundaries and the retained source location all belong here.</p>
      <p>A pass proves that the captured representation agrees with the identified evidence. It does not prove that the source population is complete, the column is the intended period, the row has the assumed accounting meaning, the mapping is correct, related statements agree or the value is safe for a management decision.</p>
      <p>That distinction matters because financial errors can preserve appearances. Assets may equal liabilities plus equity because an omitted asset and an omitted liability offset. Operating profit may be right while gross margin is wrong because a logistics cost sits below rather than above gross profit. Closing cash may agree with a bank export while the cash-flow schedule uses a different consolidation scope. Arithmetic consistency is evidence about relationships, not universal proof about meaning.</p>
      <DecisionImplication>Replace “the data was read” with a stronger claim: “the data was controlled, reconciled and assigned an explicit decision-readiness status.”</DecisionImplication>
    </section>

    <section id="control-layer">
      <h2>Validation is a layered control architecture, not one final check</h2>
      <EntimemaFramework title="The Validation Control Layer" description="Each gate proves a different property. A critical failure stops the affected analytical path rather than being diluted by successful low-risk checks." steps={["Extracted Data", "Completeness", "Arithmetic", "Accounting", "Cross-Statement", "Period & Semantics", "Validation Status", "Analysis"]} />
      <p>The layers are cumulative but not interchangeable. Structural completeness establishes whether the expected population exists. Arithmetic controls recalculate relationships. Accounting controls test required statement equations. Cross-statement controls build bridges between related evidence. Period controls establish comparability. Semantic review tests whether the value means what the analytical model assumes. Materiality and exception logic then determine the permitted downstream action.</p>
      <ResourceTable caption="What each validation layer proves" headers={["Layer", "Core question", "What a pass proves", "What remains unproven"]} rows={[
        ["Extraction", "Was the identified source read faithfully?", "Captured value, label and location agree with the source", "Completeness, period, mapping and financial meaning"],
        ["Structure", "Is the expected financial population present?", "Required sections, rows, periods and metadata are accounted for", "Correct totals, classification and relationships"],
        ["Arithmetic", "Can totals and movements be reproduced?", "Components, totals and bridges calculate within an explicit tolerance", "Accounting interpretation and semantic correctness"],
        ["Accounting", "Do required statement relationships hold?", "Defined accounting equations reconcile", "Correctness of every component or classification"],
        ["Cross-statement", "Can related evidence be bridged?", "Differences between statements and schedules are explained", "That every source uses the same meaning or authority"],
        ["Period", "Are dates, versions and period types comparable?", "Point-in-time and flow values refer to controlled periods", "Correct economic classification"],
        ["Semantic", "Does the value mean what the model assumes?", "Concept, scope, sign and analytical use have sufficient support", "Unrelated populations or controls not tested"],
      ]} />
      <p>Each material value or statement line therefore needs a control profile: source fidelity, structural presence, arithmetic relationship, accounting relationship, cross-document agreement, period alignment, semantic evidence, materiality and unresolved exceptions. A single aggregate score is unsafe because <strong>a critical failure cannot be averaged away by several successful low-risk checks.</strong></p>
    </section>

    <section id="deterministic-controls">
      <h2>Recalculation must be deterministic and evidence-bearing</h2>
      <p>Displayed totals are claims made by a source. Validation independently recomputes them from the controlled population. The included components, exclusions, formula, scale, rounding rule and observed variance must remain reproducible.</p>
      <Formula label="Subtotal control">Recalculated subtotal = Σ Included components<br />Subtotal variance = Reported subtotal − Recalculated subtotal</Formula>
      <Formula label="Balance movement control">Closing balance = Opening balance + Valid period movements + Explicit adjustments</Formula>
      <p>Component-to-total tests detect omitted or duplicated contribution. Percentage recomputation exposes a margin calculated from inconsistent bases. Opening-to-closing tests make unexplained adjustments visible. Duplicate-contribution controls test whether the same source record reaches a total more than once. None should depend on a language model performing arithmetic that fixed code can execute exactly and repeatably.</p>
      <p>Tolerance is part of the control specification, not an afterthought. It may reflect source precision, display rounding, currency scale and the analytical use. A one-unit difference in a statement reported in thousands can be a legitimate presentation effect; the same nominal difference in a unit-level covenant calculation may matter. Every pass should state the tolerance applied and why it is appropriate.</p>
      <h3>Accounting equations test relationships, not classifications</h3>
      <Formula label="Core accounting controls">Assets = Liabilities + Equity<br />Revenue − Cost of Sales = Gross Profit<br />Gross Profit − Operating Expenses ± Other Operating Items = Operating Profit<br />Opening Cash + Net Cash Movement = Closing Cash</Formula>
      <p>Where the evidence permits, opening retained earnings plus the current-period result and valid equity movements should reproduce closing retained earnings. Passing these equations establishes internal relationship between controlled totals. It cannot prove that an expense belongs in cost of sales, that cash is unrestricted or that debt is current rather than non-current.</p>
      <p>Cross-statement controls are usually bridges, not simplistic equalities. P&amp;L profit may connect to retained earnings after dividends, prior-period adjustments and other equity movements. Depreciation expense connects to accumulated depreciation after additions, disposals, impairments, reclassifications, foreign exchange and scope changes. Debt movement connects to financing cash flows after non-cash leases, accrued interest, fees and FX. Tax expense connects to tax balances only after current, deferred, paid and directly recognised tax are distinguished.</p>
      <KeyObservation title="Control boundary">A cross-statement bridge explains why two related values differ. It need not force them into a direct one-line equality.</KeyObservation>
    </section>

    <section id="period-semantics">
      <h2>Period alignment and semantic validity catch errors that totals cannot</h2>
      <p>Period validation controls reporting start and end dates; month, quarter and year-to-date definitions; fiscal and calendar periods; actual, budget and forecast scenarios; current and prior-year comparatives; point-in-time balances and flow values; partial periods; restatements; and document versions. A comparison becomes valid only when these attributes agree or an explicit transformation reconciles them.</p>
      <Formula label="Deriving a monthly flow from cumulative values">Monthly valueₜ = YTDₜ − YTD₍ₜ₋₁₎</Formula>
      <p>The derivation is valid only if definitions remain stable, entity scope is unchanged or adjusted explicitly, currency and scale agree, and the earlier cumulative value has not been restated without traceability. Otherwise subtraction creates a precise answer to the wrong question.</p>
      <p>Semantic validity asks: <strong>does the value mean what the analytical model assumes it means?</strong> Evidence may be required for the financial concept, gross or net treatment, recurring status, current or non-current classification, entity and consolidation scope, dimensions, sign rule and relationship to the intended KPI.</p>
      <p>Arithmetic often cannot decide this. Mapping a logistics cost to administrative expenses instead of cost of sales preserves total operating profit and may leave the Balance Sheet untouched. It nevertheless overstates gross margin and can reverse a pricing, sourcing or operating-efficiency conclusion. Model intelligence can interpret structure, language and ambiguity; human review resolves material unsupported judgement. Neither changes the responsibility of deterministic controls for arithmetic and fixed rules.</p>
    </section>

    <section id="duplicates-missing-signs">
      <h2>Duplicates, missing values and unusual signs require identity-aware controls</h2>
      <p>Equal amounts are not sufficient evidence of duplication. A duplicate may be an exact repeated row, a page header mistaken for data, the same document ingested twice, or one trial-balance account mapped to two canonical lines. The same amount may also appear legitimately in two documents or two transactions. Detection should compare source identity, document and row lineage, account and dimensions, period, mapping path and contribution to controlled totals.</p>
      <p>Missing data needs more than one status. A value may be absent from the source; present but not extracted; extracted but unmapped; deliberately excluded with evidence; or structurally expected but unavailable. These conditions have different owners and remedies. Substituting zero conceals the distinction and can make a failed population appear complete.</p>
      <DecisionImplication><strong>Unknown ≠ Zero.</strong> Preserve the evidence state until the missing value is obtained, bounded or explicitly excluded from the affected analysis.</DecisionImplication>
      <p>Signs must be tested relative to account nature, source convention, statement presentation, historical behaviour, mapped concept and analytical operator. Negative revenue, a credit expense, debit liability or negative inventory may indicate a reversal, return, correction, reclassification, genuine exception, extraction error or mapping failure. The control should classify and investigate it—not silently flip the sign to make a total look familiar.</p>
    </section>

    <section id="cross-document">
      <h2>Conflicting documents remain explicit until authority is proved</h2>
      <p>The same concept may appear in a PDF financial statement, ERP export, trial balance, management workbook, budget, forecast and supporting schedule. Differences can arise from period definitions, entity scope, posting cut-off, currency, scale, accounting basis, management adjustments, version timing, mapping logic or a genuine source error.</p>
      <p>No source is automatically authoritative for every purpose. A signed financial statement may govern statutory presentation but lack transaction detail. The trial balance may be complete at posting level but precede a late adjustment. A management workbook may contain approved analytical reclassifications but not change the ledger. Authority should be determined from intended purpose, provenance, completeness, approval state, recency, accounting role and evidence quality.</p>
      <p>A reconciliation record should identify both values, their documents and versions, the comparison rule, variance, suspected cause, authority decision and any adjustment. Until that decision is supported, the conflict remains visible. Selecting whichever source makes a control pass is not reconciliation.</p>
    </section>

    <section id="materiality">
      <h2>Materiality determines escalation, not truth</h2>
      <p><strong>Technical tolerance</strong> handles machine precision and source rounding. <strong>Accounting tolerance</strong> defines acceptable residuals for a stated control. <strong>Analytical materiality</strong> considers whether an issue changes a metric or interpretation. <strong>Decision materiality</strong> considers whether it could alter an action, covenant, threshold or communicated conclusion.</p>
      <p>An immaterial Balance Sheet rounding variance and a small classification error near a gross-margin threshold do not deserve the same treatment. Assessment may consider absolute amount, percentage of the relevant base, effect on a covenant or threshold, trend direction, material KPI, recurrence, concentration and uncertainty of cause. No universal percentage captures all of these.</p>
      <p>Materiality controls escalation priority. It does not convert an unexplained error into valid data. A small residual may support “validated with limitations” when bounded and disclosed; an unexplained issue with a critical evidence chain may still block the affected conclusion.</p>
      <ResourceTable caption="Operational exception taxonomy" headers={["Class", "Meaning", "Typical action"]} rows={[
        ["Extraction", "Source value or structure may have been read incorrectly", "Inspect the location and re-extract"],
        ["Completeness", "A required row, period or statement element is absent", "Request evidence or identify the omission"],
        ["Arithmetic", "Components do not reproduce the reported total", "Recalculate and isolate the variance"],
        ["Accounting", "A required accounting relationship fails", "Block the affected statement"],
        ["Cross-statement", "Related statements or schedules disagree", "Build and evidence a reconciliation bridge"],
        ["Period", "Dates, period types or versions are inconsistent", "Harmonise or exclude the comparison"],
        ["Semantic", "Meaning or classification lacks support", "Review the mapping or definition"],
        ["Source conflict", "Credible documents provide inconsistent evidence", "Resolve authority, scope and version"],
        ["Warning", "Behaviour is unusual but not necessarily incorrect", "Disclose, investigate and monitor"],
      ]} />
      <p>Every exception retains the affected value or relationship, source evidence, control performed, observed variance, materiality, suspected cause, validation state, owner where applicable, resolution and downstream impact. A warning permits attention without asserting failure. An exception records a failed or unresolved control. A blocking failure withdraws permission for the affected downstream use.</p>
      <ResourceFigure label="Exception-to-decision logic from detected exception through materiality assessment, classification and treatment to downstream validation status." caption="Exceptions are resolved, bounded and disclosed, or used to block the affected analytical path.">
        <EntimemaFramework title="Exception-to-Decision Logic" steps={["Exception", "Materiality", "Classification", "Resolve / Disclose / Block", "Downstream Status"]} />
      </ResourceFigure>
    </section>

    <section id="worked-example">
      <h2>A favourable margin disappears when the evidence is controlled</h2>
      <p>Northstar Components is fictional. It supplies a PDF P&amp;L and Balance Sheet, a trial-balance export, a cash-flow schedule and a management-reporting workbook for June. The initial dashboard reports revenue of €1,500k, cost of sales of €900k and gross profit of €600k: a 40.0% gross margin, apparently up from 36.0% in May.</p>
      <p>The revenue amount was extracted perfectly—but from the May column. June revenue is €1,400k. The PDF subtotal omits €40k of operating expense. A €60k trial-balance expense account is mapped twice. Balance Sheet cash is €224k while the cash-flow schedule reports €220k. A €10k maintenance line carries a credit sign. Reported profit does not fully explain retained earnings. Finally, €70k of inbound logistics has been mapped to administrative expense rather than cost of sales.</p>
      <ResourceTable caption="Controlled issue set for Northstar Components (€000)" headers={["Control", "Observed evidence", "Classification", "Treatment"]} rows={[
        ["Period", "Revenue 1,500 is May; June is 1,400", "Period — material", "Replace analytical input with the evidenced June value"],
        ["P&L subtotal", "Reported operating expenses 320 omit a 40 line", "Arithmetic — material to profit", "Recalculate subtotal to 360"],
        ["TB population", "One 60 expense reaches two mappings", "Completeness / duplicate", "Retain one contribution; remove duplicate path"],
        ["Cash bridge", "Balance Sheet 224 versus schedule 220", "Cross-statement — immaterial", "Identify €4 display rounding; disclose limitation"],
        ["Maintenance sign", "10 credit against normal debit pattern", "Warning", "Confirm supplier credit note; retain source sign"],
        ["Equity bridge", "Closing retained earnings 514 versus 500 explained", "Cross-statement", "Add evidenced €14 prior-period adjustment"],
        ["Logistics", "70 administrative, economically inbound", "Semantic — material to margin", "Map to cost of sales using reviewed shipment evidence"],
      ]} />
      <p>The control sequence begins with source lineage and the expected document set. Structural checks confirm all required statements and periods are present, then identify the omitted P&amp;L row and duplicate mapping path. Arithmetic recalculation removes the duplicate contribution and restores the €40k line. Accounting controls then reproduce the corrected P&amp;L and Balance Sheet relationships.</p>
      <p>Cross-statement review treats the €4k cash difference separately from the equity bridge. The cash schedule is presented to the nearest €10k while the Balance Sheet is in €1k units; underlying records reconcile at €224k. This is a bounded, immaterial presentation difference. The €14k retained-earnings difference is explained by an approved prior-period adjustment recorded directly in equity. It is not forced into current profit.</p>
      <p>The maintenance credit is a valid supplier credit note, so the unusual sign becomes a monitored warning rather than an automatic correction. Semantic review then moves €70k of inbound freight into cost of sales. This reclassification preserves operating profit but changes the margin used in the management conclusion.</p>
      <ResourceTable caption="Reconciled analytical result (€000)" headers={["Measure", "Initial dashboard", "Controlled result", "Reason"]} rows={[
        ["Revenue", "1,500", "1,400", "Correct June column"],
        ["Cost of sales", "900", "970", "Inbound logistics classified by function"],
        ["Gross profit", "600", "430", "1,400 − 970"],
        ["Gross margin", "40.0%", "30.7%", "430 ÷ 1,400"],
        ["Operating expenses before credit", "320", "290", "360 complete subtotal − 60 duplicate − 10 logistics reclass"],
        ["Maintenance supplier credit", "Included as −10", "Included as −10", "Valid credit note retained"],
        ["Operating profit", "290", "150", "430 − 290 + 10"],
        ["Cash", "224 / 220 conflict", "224; limitation disclosed", "Underlying reconciliation; schedule rounding"],
        ["Retained earnings bridge", "Unexplained 14", "500 profit movement + 14 adjustment = 514", "Approved direct-to-equity adjustment"],
      ]} />
      <p>The apparent improvement is not merely reduced; it reverses. June gross margin is 30.7%, below May’s 36.0%. The period error contributed €100k of false revenue, while semantic classification understated cost of sales by €70k. The duplicate and omitted expense issues affected operating profit rather than gross margin. Keeping these effects separate shows which conclusion each exception contaminates.</p>
      <p>The document set is therefore <strong>validated with limitations</strong> for cash analysis because the €4k presentation difference is bounded and disclosed. The P&amp;L and gross-margin finding become <strong>validated</strong> after the material period, duplicate, omission and classification exceptions resolve. Before those resolutions, the gross-margin conclusion was <strong>blocked</strong>. One global document pass would have concealed that change in permission.</p>
    </section>

    <section id="failure-modes">
      <h2>The most dangerous validation failures preserve a plausible output</h2>
      <ResourceTable caption="Failure modes and required controls" headers={["Failure", "Why it remains hidden", "Decision consequence", "Required control"]} rows={[
        ["Treat OCR confidence as financial confidence", "Character recognition can be accurate while context is wrong", "A precise value enters the wrong period or concept", "Source fidelity plus period and semantic tests"],
        ["Validate only displayed totals", "The source total may itself omit a row", "Profit or position is overstated", "Independent component recalculation"],
        ["Allow offsetting errors", "Net variance is zero", "Composition-sensitive metrics remain wrong", "Row, mapping-path and metric-level controls"],
        ["Use one global tolerance", "Large bases absorb sensitive errors", "Thresholds and trends can change silently", "Control- and decision-specific tolerances"],
        ["Convert missing values to zero", "The dataset appears complete", "Absence becomes a false economic claim", "Explicit missing-data states"],
        ["Silently correct signs", "Totals look conventional", "Reversals and genuine exceptions disappear", "Contextual sign classification and review"],
        ["Compare incompatible periods", "Labels look similar", "Trend and variance conclusions are false", "Period, scenario and version controls"],
        ["Assume one source is authoritative", "Conflicts are overwritten", "Unsupported adjustments become facts", "Purpose-based source hierarchy"],
        ["Use model intelligence for arithmetic", "Fluent output looks credible", "Controls are non-reproducible", "Deterministic calculation code"],
        ["Use fixed rules for semantic ambiguity", "A plausible label receives a forced class", "KPI composition is distorted", "Evidence-aware interpretation and human review"],
        ["Report one document-level pass", "Granular failures are aggregated", "A material metric is relied upon", "Status at value, row, statement and finding level"],
        ["Continue after a critical failure", "The pipeline treats validation as advisory", "Invalid analysis acquires institutional authority", "Executable downstream blocking"],
      ]} />
    </section>

    <section id="decision-status">
      <h2>Validation status is permission for a defined analytical use</h2>
      <ResourceTable caption="Validation status framework" headers={["Status", "Evidence condition", "Downstream decision"]} rows={[
        ["Validated", "All critical controls pass and material exceptions are resolved", "Analysis may proceed"],
        ["Validated with limitations", "Residual exceptions are immaterial or clearly bounded", "Proceed with explicit disclosure"],
        ["Review required", "Material uncertainty can be resolved through targeted review", "Pause the affected metrics"],
        ["Blocked", "A critical accounting, period or evidence-chain failure affects the decision", "Stop affected downstream analysis"],
        ["Source insufficient", "Required evidence is unavailable", "Request additional data"],
      ]} />
      <p>Status exists at the value, row, statement, period, document-set and analytical-finding levels. It should inherit conservatively: a validated document set does not make an unresolved material margin calculation valid, while a blocked margin finding need not prohibit an unrelated, fully supported balance analysis.</p>
      <p>Before financial analysis may be relied upon, its intended use must be known; critical structures must be complete; required arithmetic and accounting controls must pass; material cross-statement differences must be explained; periods and versions must be consistent; semantic classifications must be sufficiently supported; exceptions must be resolved, bounded or disclosed; evidence lineage must remain available; and the validation status must be explicit.</p>
      <DecisionImplication>Analysis may proceed only when the validation state is appropriate to the materiality and purpose of the decision.</DecisionImplication>
    </section>

    <section id="operating-model">
      <h2>The controlled output is a defensible decision boundary</h2>
      <p>Within Entimema Financial Intelligence, the path is <strong>Intelligent Intake → Document and Data Understanding → Financial Extraction → Period Harmonisation → Canonical Mapping → Deterministic Validation and Reconciliation → Confidence and Exceptions → Human Review → Validated Financial Model → Financial Analysis and Findings → Traceable Export.</strong></p>
      <p>This article concerns the deterministic validation and reconciliation layer, but that layer is not one checkbox at the end. It operates after extraction, after harmonisation, after mapping, before analysis and, where a finding exposes a new contradiction, during analytical interpretation. The workflow—not an isolated agent—is the product boundary.</p>
      <p>The responsibility split remains strict. Model intelligence interprets structure, meaning and ambiguity. Deterministic code owns arithmetic, fixed rules, control totals and reconciliations. Human review resolves material ambiguity and unsupported judgement. Confidence and exceptions preserve what is known, what is unresolved and what each state permits.</p>
      <p>This framework extends FIR-01, <Link href="/resources/financial-data-normalisation">Financial Data Normalisation</Link>, and FIR-02, <Link href="/resources/trial-balance-to-financial-statements">Trial Balance Mapping</Link>. It also connects to Entimema’s <Link href="/services/financial-data">Financial Data service</Link>, the broader <Link href="/resources/from-erp-data-to-management-intelligence">ERP and management intelligence research</Link> and a traceable route from source evidence to management action.</p>
      <p>The opening value was read correctly but belonged to the wrong period, failed the cash bridge and supported a false liquidity conclusion. A controlled workflow does not reward that extraction with a polished answer. It retains the evidence, exposes the contradictions and withholds analytical permission until the relevant state is defensible.</p>
      <DecisionImplication>Run a controlled validation before relying on the analysis. <Link href="/contact">Discuss a financial intelligence engagement</Link>.</DecisionImplication>
    </section>
  </>;
}
