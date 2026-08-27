import Link from "next/link";
import { DecisionImplication, EntimemaFramework, KeyObservation, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-10 — Financial Data & ERP. The company, amounts and timing are fictional. */
export const monthEndReportingWorkflowSections = [
  { id: "close", label: "Separate close from reporting" },
  { id: "workflow", label: "Control the full workflow" },
  { id: "sources", label: "Prove source completeness" },
  { id: "states", label: "Track two state paths" },
  { id: "mapping", label: "Govern analytical mapping" },
  { id: "controls", label: "Reconcile every boundary" },
  { id: "adjustments", label: "Preserve adjustment evidence" },
  { id: "exceptions", label: "Assign the operating owner" },
  { id: "commentary", label: "Explain stable numbers" },
  { id: "approval", label: "Approve a defined version" },
  { id: "calendar", label: "Schedule dependencies" },
  { id: "example", label: "Inspect a controlled cycle" },
  { id: "readiness", label: "Release by intended use" },
  { id: "quality", label: "Measure speed and quality" },
  { id: "failures", label: "Prevent false efficiency" },
  { id: "execution", label: "Repeat controlled execution" },
] as const;

export default function MonthEndReportingWorkflowArticle() {
  return <>
    <p className={styles.leadParagraph}>The management pack is promised for working day five. By day four, the P&amp;L is exported, the Balance Sheet workbook exists, variance tables are populated and commentary has started. Yet one entity has not closed. A late inventory posting changes gross margin. Two trial balances circulate by email, a new account remains unmapped, intercompany does not reconcile and a controller has inserted an unsupported adjustment. The commentary describes yesterday’s numbers.</p>
    <p>The document looks nearly complete; its reporting state is unsafe. Month-end reporting is often delayed before analysis begins, through uncontrolled movement of sources, mappings, adjustments and versions. Producing another workbook does not settle which population, accounting state or approval it represents.</p>
    <KeyObservation title="Executive thesis">Move the reporting population through controlled states until it supports the intended management decision. Fragmented close inputs become a controlled reporting state, a validated analytical model and decision-ready management information. Repeatability comes from retaining the evidence and responsibilities behind those transitions.</KeyObservation>

    <section id="close">
      <h2>The accounting close is necessary, but it is not the reporting workflow</h2>
      <p>The accounting close establishes completeness and cut-off of accounting records: accruals, provisions, depreciation, inventory, payroll, tax, foreign currency, intercompany, subledger reconciliation and period lock. Its question is whether the selected accounting population is sufficiently complete and controlled.</p>
      <p>The management-reporting workflow translates that population into management structures, comparable periods, budget and forecast views, KPIs, variance bridges, commentary and actions. A locked ledger does not prove correct functional mapping, comparable planning definitions or an explained margin movement. Conversely, preliminary revenue analysis can be useful before every accounting adjustment is final, provided its scope and provisional status remain explicit.</p>
      <p>Define the intended decisions first: group performance, entity accountability, liquidity or product economics. Record entities, consolidation perimeter, reporting period, cut-off, scenarios, currency, units, materiality and required outputs. Monthly flows and closing positions need different temporal definitions. State whether preliminary use is permitted and who may accept a limitation; a day-five deadline cannot silently relax those conditions.</p>
    </section>

    <section id="workflow">
      <h2>Four layers replace a collection of monthly files</h2>
      <EntimemaFramework title="Month-end reporting workflow" description="Each layer has release conditions. Rework returns to the affected dependency; it does not erase previously retained evidence." steps={[
        "Scope and Source Control: calendar → expected source population → registration → completeness → authority and version.",
        "Financial Structuring: extraction → harmonisation → mapping → adjustments → canonical analytical model.",
        "Control and Analysis: reconciliation → exceptions → validation → variance and driver analysis → findings.",
        "Decision and Closure: commentary → review → approval → version freeze → publication → carry-forward context.",
      ]} />
      <p>The layers describe responsibilities, not a waterfall that postpones every control. Reconcile extraction immediately, test mappings as they change and rerun dependent controls after an adjustment. The candidate model becomes validated only after its required gates pass. Independent paths may proceed while an affected finding remains blocked.</p>
      <ResourceTable caption="Stage contract: input, responsibility, release condition and retained proof" headers={["Stage / input", "Responsible role", "Control → output", "Blocking failure / evidence"]} rows={[
        ["Calendar / decision scope", "Reporting lead", "Approve dependencies → registered cycle", "Undefined purpose / scope record"],
        ["Expected population / requirements", "Entity controllers", "Enumerate required sources → inventory", "Missing entity / population manifest"],
        ["Registration / arriving dataset", "Source owner", "Identify origin → registered source", "Unknown provenance / receipt record"],
        ["Completeness / inventory", "Reporting lead", "Compare valid receipts → complete scope", "Missing required input / coverage log"],
        ["Authority / competing versions", "Source owner", "Confirm current version → accepted source", "Unresolved conflict / owner attestation"],
        ["Extraction / accepted source", "Data operator", "Match totals → preserved extract", "Lost rows / source snapshot"],
        ["Harmonisation / extract", "Data controller", "Align dimensions → comparable values", "Unbridged interval / transformation log"],
        ["Mapping / comparable values", "Controlling", "Approve scoped rules → classified values", "Material unknown / mapping history"],
        ["Adjustments / proposed changes", "Preparer and approver", "Evidence and authorise → adjustment layer", "Unsupported change / adjustment register"],
        ["Model / classified adjusted values", "Model owner", "Bind versions → candidate model", "Mixed versions / model manifest"],
        ["Reconciliation / candidate", "Control owner", "Test relationships → reconciled scope", "Critical difference / control results"],
        ["Exceptions / failed gates", "Operating owner", "Resolve or bound → reviewed issue", "Unowned material risk / issue history"],
        ["Validation / reviewed candidate", "Financial reviewer", "Confirm gates → analysis ready", "Open critical issue / release record"],
        ["Drivers / validated model", "FP&A", "Reconcile comparisons → measured drivers", "Invalid baseline / calculation version"],
        ["Findings / drivers", "Analyst", "Test evidence → supported findings", "Unsupported inference / evidence links"],
        ["Commentary / findings", "Management accountant", "Bind narrative → commentary ready", "Stale figures / finding references"],
        ["Review / candidate pack", "Technical and financial reviewers", "Challenge scope → reviewed candidate", "Unresolved challenge / review log"],
        ["Approval / reviewed candidate", "Authorised management", "Approve defined object → authorised pack", "Missing sign-off / dated approval"],
        ["Freeze / authorised pack", "Reporting lead", "Lock manifest → immutable release", "Changed dependency / release identifier"],
        ["Publication / frozen release", "Publisher", "Verify identity → distributed version", "Wrong attachment / distribution record"],
        ["Carry-forward / closed cycle", "Process owner", "Revalidate reusable rules → next-cycle context", "Expired scope / governed precedent"],
      ]} />
    </section>

    <section id="sources">
      <h2>Completeness is measured against what should exist</h2>
      <p>Intake registers the reporting population, not merely uploaded files. Start with ledger or trial balance, statement extracts, receivables and payables ageing, inventory, fixed assets, payroll, debt and cash, intercompany, budget, forecast, operational drivers, adjustment files and consolidation submissions where required. Define entity coverage within every group schedule; one received workbook may still omit an entity.</p>
      <p>Each expected source records name, type, system, entity, period, scenario, currency, unit, owner, expected arrival, dependency and evidence location. Receipt adds extraction timestamp, version, received status, structural checks, authority and supersession. Preserve original evidence separately from transformed data. A newer filename is not sufficient proof of authority.</p>
      <ResourceTable caption="Source states are distinct assertions" headers={["State", "Meaning"]} rows={[
        ["Expected", "Required for this cycle and decision"], ["Received", "A dataset has arrived"],
        ["Structurally valid", "Required fields, rows and structure pass"], ["Period-valid", "Correct interval and cut-off are covered"],
        ["Authoritative", "Owner or system confirms current controlled version"], ["Superseded", "Replaced; retained for lineage, excluded from current input"],
        ["Missing", "Required input is absent; create an exception"], ["Not applicable", "Documented exclusion, approved within scope"],
      ]} />
      <p>Report coverage as authoritative, valid required sources divided by applicable expected sources, alongside the missing list and affected decisions. Count logical sources once, not their duplicate versions. Approved exclusions change the denominator visibly. A 99% receipt rate cannot release liquidity analysis if the missing 1% is the cash schedule.</p>
      <KeyObservation title="Completeness principle">Completeness is measured against an expected population, not against the files that happened to arrive. Received does not mean valid; valid does not mean final. An unreceived source is unknown, never zero.</KeyObservation>
    </section>

    <section id="states">
      <h2>Keep accounting status and reporting state separate</h2>
      <ResourceTable caption="Dual-state model: two paths, one purpose-specific release decision" headers={["Accounting-close path", "Reporting-processing path", "Interpretation"]} rows={[
        ["Open → provisional", "Registered → intake incomplete → sources received", "Preliminary work only within declared scope"],
        ["Subledger closed; adjustments pending", "Harmonisation → mapping in progress", "Structuring can proceed; changes remain possible"],
        ["Reconciliation pending", "Reconciliation required → review required", "Affected numerical findings remain blocked"],
        ["Approved → locked", "Analysis ready → commentary ready → approval pending", "Closed ledger alone does not authorise publication"],
        ["Locked", "Published", "Required accounting and reporting gates support intended use"],
        ["Reopened", "Reopened; dependent approvals invalidated", "New controlled version required"],
      ]} />
      <p>These are illustrative paths, not interchangeable labels or a mandatory sequence for every ledger. Store accounting status by entity and relevant subledger; store reporting state by object and purpose. An inventory issue can block gross margin without invalidating independently reconciled revenue. Group status must expose the blocking entity rather than average its readiness away.</p>
      <p>A transition needs a triggering event, satisfied controls, responsible actor, timestamp and evidence. Reopening a ledger triggers impact assessment, source replacement and dependent revalidation. A message saying “complete” cannot override either state. Final for one use may still be insufficient for another.</p>
    </section>

    <section id="mapping">
      <h2>Reuse meaning only within an approved scope</h2>
      <p>Management structures connect local accounts to reporting lines, cost centres to functions, products to categories, customers to segments, profit centres to business units, projects to dimensions, entities to consolidation and actual accounts to budget lines. <Link href="/resources/financial-data-normalisation">FIR-01 normalisation</Link> establishes comparable periods, signs, units and currencies before those relationships are used.</p>
      <p>One-to-one and many-to-one rules need population checks. Splits need supported allocation drivers whose weights reconcile. Conditional, sign-dependent, entity-specific and period-specific rules require explicit predicates. Preserve source value, label and code, target concept, rule version, effective period, proposer, reviewer, ambiguity, evidence and downstream consequence.</p>
      <p>Unknown values remain unresolved: they must not become zero, Other, last month’s category or the nearest text match. <Link href="/resources/trial-balance-to-financial-statements">FIR-02 mapping</Link> explains why balanced totals do not establish correct classification. Reuse a confirmed rule only when account meaning, entity, policy and effective period still match and no contradictory evidence exists. A new account merits targeted review, not a complete remapping exercise.</p>
    </section>

    <section id="controls">
      <h2>Reconciliation belongs at every transformation boundary</h2>
      <ResourceTable caption="Minimum deterministic control architecture" headers={["Control", "Required relationship"]} rows={[
        ["Source", "Extracted population and totals agree to authoritative evidence"],
        ["Trial balance", "Debits and credits reconcile under the source convention"],
        ["Balance Sheet", "Assets = Liabilities + Equity"],
        ["P&L", "Mapped totals reconcile to validated ledger, with explicit adjustments"],
        ["Subledgers", "Receivables, payables, inventory, fixed assets and cash agree to control accounts or evidenced bridges"],
        ["Intercompany", "Paired balances and transactions reconcile before elimination within approved tolerances"],
        ["Period", "Opening balances + evidenced movements = closing balances over the same interval"],
        ["Plan comparison", "Actual, budget and forecast align periods, entities, currencies, classifications, signs and units"],
        ["Mapping", "Material values are mapped, explicitly unresolved or excluded with reason; no duplication"],
        ["Report", "Every displayed table, KPI and chart agrees to the validated model version"],
      ]} />
      <p>Record expected and actual results, difference, tolerance rationale, severity, execution time and source versions. Tolerances address justified rounding or policy, not unexplained material differences. A zero group residual can conceal offsetting entity errors; retain disaggregated controls. Reconciliation proves a relationship, not every semantic judgement.</p>
      <p>Deterministic code owns arithmetic, accounting equations and fixed rules. A critical failed control blocks affected outputs even when an analyst finds the result plausible. After corrections, rerun changed dependencies and their downstream checks. <Link href="/resources/financial-data-validation-control-layer">FIR-03 validation</Link> supplies this control discipline; source-to-model and model-to-report proof are both necessary.</p>
    </section>

    <section id="adjustments">
      <h2>An adjustment changes a view without erasing its origin</h2>
      <p>An accounting adjustment belongs in the underlying records. A reporting adjustment changes management presentation without changing the ledger. Reclassification moves categories without changing the total; normalisation isolates an exceptional item; allocation distributes shared values using a defined method; budget alignment makes planning and actual structures comparable. These classes need different approvals and reversal rules.</p>
      <p>Retain original and adjusted values, reason, type, entity, period, line, source evidence, preparer, material approver, date, version, reversibility, recurrence and downstream effect. Store changes as a separate layer. An approved accrual later posted to the ledger must be removed from the reporting layer through a documented bridge, preventing double counting.</p>
      <p>An unexplained manual correction improves the appearance of the report while weakening its evidence. Never let workbook ownership confer authority to overwrite sources. Unsupported material accruals remain review-required; omitting a likely obligation is not automatically safe either. Resolve recognition and amount, or block the affected result pending an authorised treatment.</p>
    </section>

    <section id="exceptions">
      <h2>The exception owner follows the operating cause</h2>
      <p>Each exception needs an ID, stage, affected source or relationship, class, materiality, evidence, downstream effect, owner, required action, target date, status, escalation path, resolution, reviewer and provenance. Distinguish warnings, review-required items, blocking failures, accepted limitations, resolved issues and reopened issues. A narrative note is not an actionable queue.</p>
      <ResourceTable caption="Exception ownership matrix" headers={["Exception", "Stage", "Materiality", "Owner", "Blocking effect", "Required action"]} rows={[
        ["Missing invoice cut-off", "Intake", "Expense-sensitive", "Accounting owner", "Affected expense", "Supply cut-off evidence"],
        ["Unknown account", "Mapping", "Classification-sensitive", "Controlling", "Affected margin", "Approve scoped mapping"],
        ["Inventory difference", "Reconciliation", "Material", "Accounting + Operations", "Inventory and gross margin", "Bridge posting and stock evidence"],
        ["Obsolete budget", "Authority", "Comparison-wide", "FP&A", "Budget variances", "Confirm current budget"],
        ["Intercompany mismatch", "Consolidation", "Material", "Paired entity owners", "Final consolidation", "Match and resolve both sides"],
        ["Unsupported adjustment", "Review", "Material", "Proposer + approver", "Affected earnings", "Substantiate or correct treatment"],
      ]} />
      <p>Give jointly owned exceptions one accountable coordinator and named contributors. Escalate when the resolution time threatens a dependent milestone, not only after the deadline passes. <Link href="/resources/confidence-human-review-ai-finance">FIR-04 human review</Link> concentrates judgement on the smallest unresolved material question, while unaffected work continues.</p>
    </section>

    <section id="commentary">
      <h2>Commentary follows numerical readiness</h2>
      <p>The analytical model binds canonical concepts, dimensions, periods, scenario, source lineage, mapping version, adjustment layer, validation status, exceptions and limitations. It can support P&amp;L, Balance Sheet, cash flow, working capital, forecasts, margins, cost centres, business units, products and KPIs, but each output requires its own evidence. Populating every tab does not confer universal readiness.</p>
      <p>Use Observation → Driver → Evidence → Implication → Action. Each material item identifies the measure, comparison, quantified driver, evidence, interpretation, uncertainty, consequence, action and owner. Keep fact, calculation, supported inference, unresolved hypothesis and management decision distinct. <Link href="/resources/variance-analysis-price-volume-mix-cost-drivers">FIR-07 driver analysis</Link> quantifies the bridge before commentary assigns causality.</p>
      <p>For example: margin is 2.1 percentage points below budget; validated price and mix bridges explain 1.3 and 0.5 points; 0.3 points remain under production-usage investigation. Procurement owns the price response and Operations the unresolved usage evidence. This is a qualified explanation, not proof that usage caused the residual. Attach model and finding identifiers; any dependent numerical change invalidates the commentary for revalidation.</p>
    </section>

    <section id="approval">
      <h2>Approve an object that cannot change underneath the reviewer</h2>
      <p>Separate preparation, technical review, financial review, management review, final approval and publication. Approvals may cover source population, mapping change, material adjustment, reconciliation, model, commentary or final pack. Record object, version, approver, timestamp, status, evidence, limitations and conditions. Approval of an adjustment is not approval of the whole report.</p>
      <p>A release manifest binds cycle, period, entity scope, model, mappings, adjustments and source-version references, plus preparation status, approval state and publication timestamp. Distinguish working version, review candidate, approved version, published version and corrected version. A filename such as final-final cannot express these relationships.</p>
      <p>Freeze the reviewed candidate’s dependencies, obtain approval for that candidate and publish the identical immutable release. A post-publication change creates a new version, change record, affected-findings list, appropriate reapproval and explicit superseded-by link. Preserve the old release and notify its recipients; silent replacement destroys accountability and reproducibility.</p>
    </section>

    <section id="calendar">
      <h2>The close calendar schedules dependencies, not wishes</h2>
      <ResourceTable caption="Illustrative close calendar; adapt to complexity, requirements and resources" headers={["Window", "Primary activity", "Required state / dependency"]} rows={[
        ["Pre-close", "Confirm scope, owners, mappings and sources", "Cycle registered before intake"],
        ["Day 0", "Operational cut-off; prepare sources", "Cut-off established"],
        ["Day 1", "Subledgers and initial extracts", "Core sources received, not necessarily authoritative"],
        ["Day 2", "Accruals, inventory, payroll, assets, intercompany", "Complete source scope; accounting changes controlled"],
        ["Day 3", "Ledger close, mapping, primary reconciliation", "Controlled financial structure before final analysis"],
        ["Day 4", "Model, drivers and exceptions", "Analysis ready; limitations explicit before commentary"],
        ["Day 5", "Commentary review, approval, publication", "Defined decision-ready release"],
        ["Post-close", "Corrections, retrospective, carry-forward", "Governed learning; current evidence archived"],
      ]} />
      <p>For every activity retain owner, dependency, start condition, due time, completion evidence, blocking impact and escalation rule. Work backwards from the management decision and identify the critical path. Parallelise independent reconciliations; do not parallelise final commentary with unstable calculations. Entity count, system landscape, regulatory requirements and available reviewers determine the feasible calendar.</p>
    </section>

    <section id="example">
      <h2>A three-entity pack becomes controllable before it becomes presentable</h2>
      <p>Consider a wholly fictional operating group reporting monthly consolidated P&amp;L and Balance Sheet, budget versus actual, working capital and commentary by working day five. Its expected population has twelve logical sources: three entity trial balances and nine group schedules covering receivables ageing, payables ageing, inventory, fixed-asset movement, payroll, intercompany reconciliation, debt and cash, budget, and operational volumes. Each group schedule explicitly covers all three entities.</p>
      <p>On day one, all twelve files arrive, but one trial balance predates late postings and the budget is superseded. Receipt is 12/12; authoritative valid coverage is only 10/12. The other ten sources can be authoritative while failing financial reconciliation. Eight exceptions remain visible rather than being collapsed into a misleading completion percentage.</p>
      <ResourceTable caption="Eight synthetic exceptions and their controlled outcomes" headers={["Issue", "Treatment and evidence", "Release consequence"]} rows={[
        ["Early entity trial balance", "Entity controller supplies post-posting extract; earlier version retained as superseded", "Recalculate dependent model and commentary"],
        ["New expense account", "Controlling approves entity-specific mapping with source support", "Affected classification resumes after controls"],
        ["Inventory subledger EUR 180,000 above ledger", "Accounting and Operations identify omitted receipt: debit inventory, credit trade payables EUR 180,000", "Inventory, working capital and gross-margin findings blocked until rerun"],
        ["Intercompany difference EUR 75,000", "Paired owners identify missing settlement posting: debit intercompany payable, credit cash EUR 75,000", "Final consolidation blocked until both sides match"],
        ["Manual accrual EUR 240,000 unsupported", "Proposer supplies service-acceptance evidence; approver authorises accounting expense and accrual", "Review-required until posted; remove provisional reporting overlay"],
        ["Superseded budget", "FP&A confirms approved version and archives obsolete input", "Budget comparisons cannot progress on old baseline"],
        ["Earlier gross-margin commentary", "Invalidate narrative; analyst rebuilds from released model", "Fresh financial review required"],
        ["Payroll classification uncertainty", "EUR 30,000 allocation between administration functions remains unresolved; total payroll reconciles", "Disclosed limitation for group earnings; affected cost-centre comparison withheld"],
      ]} />
      <p>The inventory receipt increases assets and liabilities equally and has no immediate P&amp;L effect. Separately, the replacement trial balance contains an evidenced EUR 90,000 inventory write-down, increasing cost of sales and reducing inventory. Its gross-margin effect explains why the earlier narrative must change; the EUR 180,000 mismatch itself was not evidence of a margin expense.</p>
      <p>Before these changes, illustrative consolidated revenue is EUR 12.00m and gross profit EUR 3.60m. The write-down reduces gross profit to EUR 3.51m: margin moves from 30.00% to 29.25%, a 0.75-point decline. The EUR 240,000 service accrual is administrative expense below gross profit. If unadjusted operating profit was EUR 1.20m, final operating profit is EUR 0.87m after the write-down and accrual, each recognised once.</p>
      <p>The intercompany settlement reduces recorded cash and a previously unmatched payable; it does not create a second group expense. The payroll issue is material to functional accountability but immaterial to the selected group earnings decision. Management accepts that bounded limitation, while the affected cost-centre view remains unavailable. It is not a general waiver of material uncertainty.</p>
      <ResourceTable caption="Fictional timing comparison, not an Entimema performance claim" headers={["Milestone", "Uncontrolled process", "Controlled workflow"]} rows={[
        ["Source-complete state", "Day 4", "Day 2"], ["First reconciled model", "Day 6", "Day 3"],
        ["Commentary ready", "Day 7", "Day 4"], ["Approved publication", "Day 8", "Day 5"],
        ["Post-publication corrections", "3", "0 material corrections"],
      ]} />
      <p>By day two, replacement sources establish 12/12 coverage; reconciliation still governs release. Day three resolves inventory, intercompany and accrual controls. Day four commentary uses the corrected values. Day five approval names that version and the payroll limitation. The illustrative improvement comes from earlier visibility, dependencies, reusable mappings and targeted ownership, not an unexplained automation effect.</p>
      <p>Inventory, intercompany and unsupported accrual treatment would have blocked the affected final pack if unresolved. Next month retains the approved account mapping, paired settlement control, source cut-off checks and payroll action owner. It retains neither this month’s approval nor an assumption that the same differences will recur.</p>
    </section>

    <section id="readiness">
      <h2>Release the intended use, not the whole workbook</h2>
      <ResourceTable caption="Decision-readiness framework" headers={["Status", "Meaning", "Permitted use"]} rows={[
        ["Source incomplete", "Required input missing or invalid", "No dependent analysis"],
        ["Close provisional", "Accounting population may change", "Preliminary internal analysis"],
        ["Reconciliation required", "Required control failed", "Affected analysis blocked"],
        ["Review required", "Material judgement unresolved", "Pause affected findings"],
        ["Analysis ready", "Sources and controls support execution", "Build metrics and findings"],
        ["Ready with limitations", "Uncertainty bounded and disclosed", "Qualified management use after required authorisation"],
        ["Approval pending", "Model and commentary ready, unauthorised", "No final publication"],
        ["Decision-ready", "Required review, controls and approvals complete", "Intended management use"],
        ["Reopened", "New evidence invalidates released state", "Controlled correction and new release"],
      ]} />
      <p>Revenue may be ready while inventory reconciliation blocks gross margin. Payroll may carry a classification limitation while cash remains blocked by source or settlement issues. <Link href="/resources/profit-vs-cash-flow-reconstruction">FIR-09 cash-flow reconstruction</Link> adds movement and availability requirements beyond a balanced closing statement. Record permitted uses and exclusions alongside the release, so downstream recipients cannot mistake qualified information for universal approval.</p>
    </section>

    <section id="quality">
      <h2>Measure whether speed survives publication</h2>
      <ResourceTable caption="Close speed and quality matrix" headers={["Speed", "Quality", "Stability", "Decision readiness"]} rows={[
        ["Fast publication", "Weak controls; unsupported changes", "Rework and version conflicts", "Apparent completion only"],
        ["Slow publication", "Reconciled and evidenced", "Repeated manual bottlenecks", "Reliable but late; redesign dependencies"],
        ["Fast controlled cycle", "Required controls and approvals pass", "Few recurring failures; reproducible releases", "Timely intended use"],
        ["Slow unstable cycle", "Missing evidence and corrections", "Variable steps; recurring late sources", "Repair source ownership before acceleration"],
      ]} />
      <p>Measure elapsed time to source completeness, ledger close, analysis, commentary, approval and publication separately. Quality measures include first-pass reconciliation rate, unresolved difference count and value, post-close adjustments, reopened periods, manual and unsupported adjustments, mapping exceptions, missing evidence, commentary rework, version conflicts and material publication corrections.</p>
      <p>Stability measures track recurring exceptions, repeated manual mappings, close-step variability, late-source frequency, dependency bottlenecks and approval duration. Keep definitions and observation windows consistent. A faster publication followed by more corrections has moved delay beyond publication. Better control can shorten the cycle by preventing repeated work; publication time alone cannot establish that improvement.</p>
    </section>

    <section id="failures">
      <h2>False efficiency removes the evidence needed for a decision</h2>
      <ResourceTable caption="Failure → apparent efficiency → decision consequence → control" headers={["Failure", "Why it looks efficient", "Consequence", "Required control"]} rows={[
        ["Analyse before completeness", "Start sooner", "Missing entity", "Expected-population gate"],
        ["Receipt treated as validity", "Uploads complete", "Wrong period", "Validity and authority checks"],
        ["Close equals readiness", "One status", "Unvalidated KPIs", "Dual states"],
        ["Reuse unscoped mapping", "Avoid review", "Wrong classification", "Scope validation"],
        ["Unknown becomes Other", "No exceptions", "Hidden materiality", "Explicit unresolved state"],
        ["Reconcile final totals only", "Fewer tests", "Offsetting errors", "Boundary controls"],
        ["Off-system adjustment", "Quick correction", "Lost provenance", "Adjustment register"],
        ["Overwrite source values", "Clean workbook", "Irreproducible result", "Immutable source layer"],
        ["Draft commentary early", "Parallel progress", "Stale explanation", "Numerical readiness gate"],
        ["Approve changing version", "Meet deadline", "Invalid approval", "Bound release manifest"],
        ["Email and memory status", "No administration", "Invisible blockers", "Event and state records"],
        ["Hide issues in notes", "Tidy pack", "Unowned uncertainty", "Exception objects"],
        ["Assign everything to Finance", "Single queue", "Wrong resolver", "Operating ownership"],
        ["Measure days only", "Simple target", "Quality deteriorates", "Balanced metrics"],
        ["Automate unstable steps", "Faster scripts", "Faster errors", "Redesign controls first"],
        ["Copy prior assumptions", "Reuse work", "Stale evidence", "Current-cycle validation"],
        ["Publish failed controls", "Hit target", "Unsafe decisions", "Hard release gates"],
        ["Correct without versioning", "Quiet fix", "Conflicting decisions", "Supersession record"],
        ["Polished irreproducible pack", "Professional appearance", "Unchallengeable claims", "Replayable lineage"],
        ["Speed with more corrections", "Earlier distribution", "Deferred delay", "Post-publication quality window"],
      ]} />
    </section>

    <section id="execution">
      <h2>Recurring value comes from controlled execution</h2>
      <p>Retain validated mappings, source definitions, entity structures, recurring adjustment templates, control rules, calendar dependencies, owners, exception classes, commentary structure and KPI definitions. Renew source files, balances, adjustment evidence, reconciliation results, exceptions, commentary, approvals and published versions every cycle. Reusable context must remain scope-controlled, reviewable, reversible and subordinate to current evidence.</p>
      <p>This gives subscription logic an operational foundation: each month requires renewed completeness, harmonisation, controls, analysis, review and preservation. Validated mappings and known source patterns reduce repeated interpretation; they do not make current evidence optional. The subscription is justified by recurring controlled execution, not repeated access to the same static analysis.</p>
      <p>For Entimema Financial Intelligence, the workflow is the product boundary: register monthly scope; receive and profile sources; confirm completeness; interpret and extract; harmonise; map; validate and reconcile; route adjustments and exceptions; build the model; analyse; produce evidence-linked findings; review; publish a traceable deliverable; carry governed context forward. This is an implementation architecture to specify and validate, not a claim that every close-system integration or approval feature is already deployed.</p>
      <p>Model intelligence interprets structure, proposes mappings, detects ambiguity, classifies exceptions, asks targeted questions, prioritises and drafts commentary from validated findings. Deterministic code owns arithmetic, period transformations, completeness checks, equations, reconciliations, KPIs, variances, state rules and version identifiers. Humans own material mapping and adjustment decisions, unresolved accounting treatment, limitation acceptance, uncertain causality and final approval. Preserve complete per-value lineage across those responsibilities; escalate material ambiguity rather than guess.</p>
      <p>The <Link href="/resources/traceable-financial-analysis-workflow">FIR-05 end-to-end workflow</Link> provides the wider architecture. At month-end, its value is visible when the day-four question changes from “which file is final?” to “which dependency still prevents this decision?” The pack earns release because required sources, controls, exceptions, adjustments and approvals support its use. The deadline becomes a managed dependency, not permission to distribute uncertainty.</p>
      <DecisionImplication><strong>Transform one monthly reporting cycle into a repeatable controlled workflow.</strong> Explore Entimema’s <Link href="/services/financial-data">Financial Data service</Link> or <Link href="/contact">discuss an Entimema Financial Intelligence workflow</Link>.</DecisionImplication>
    </section>
  </>;
}
