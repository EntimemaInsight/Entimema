import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-14. The manufacturing example and all amounts are fictional. */
export const governedSpreadsheetWorkflowSections = [
  { id: "strengths", label: "Preserve analytical flexibility" },
  { id: "model", label: "Separate model and workflow" },
  { id: "risks", label: "Locate operational risk" },
  { id: "dependencies", label: "Make dependencies explicit" },
  { id: "assessment", label: "Choose the right boundary" },
  { id: "architecture", label: "Govern the repeatable core" },
  { id: "migration", label: "Migrate incrementally" },
  { id: "example", label: "Reconcile product profitability" },
  { id: "export", label: "Return controlled results to Excel" },
  { id: "failures", label: "Avoid false progress" },
  { id: "execution", label: "Evaluate one recurring process" },
] as const;

export default function GovernedSpreadsheetWorkflowArticle() {
  return <>
    <p className={styles.leadParagraph}>The monthly workbook calculates correctly. Its sophisticated formulas have been refined over years; management trusts its schedules and receives the required report. Yet one analyst must download seven source files, rename them, paste into hidden tabs, update external links, extend formulas, repair a recurring mapping and resolve broken or circular references before anyone can use it.</p>
    <p>The analyst saves several review versions, explains which output is final and removes formulas before distribution. The financial model is valuable. The operating sequence remains dependent on memory, local files and unrecorded intervention. Analytical quality and operational control are separate achievements.</p>
    <KeyObservation title="Executive thesis">Excel is an exceptionally powerful analytical tool. It becomes an unstable operating environment when a recurring financial process depends on files, hidden formulas, manual versions and undocumented execution. The goal is to move repeatable execution, control and provenance into a workflow that can still produce Excel where Excel remains useful.</KeyObservation>

    <section id="strengths">
      <h2>Flexibility is a strength worth preserving</h2>
      <p>Excel gives finance professionals direct access to relationships. An analyst can inspect a formula, change an assumption, test a sensitivity and explain the result without commissioning a new application. Familiar interaction, immediate visual feedback, a broad ecosystem and low implementation friction matter when management questions change faster than formal requirements.</p>
      <p>Rapid exploration, ad hoc analysis, prototypes, scenarios and one-off investigations benefit from this freedom. Financial schedules, small controlled datasets, human-readable calculations, review and challenge, custom presentation and handover also remain legitimate spreadsheet uses. A model that is still discovering the right question should not be frozen prematurely into production logic.</p>
      <p>The case for finance-workflow automation therefore starts with the decision, not the file extension. A low-frequency analysis with one competent owner, effective review and limited decision impact may need no migration. A material monthly process with stable rules and several reviewers has a different control requirement, even when both use equally elegant formulas.</p>
      <p>Flexibility becomes a control problem when an exploratory environment quietly becomes the production environment for a recurring material process. The right response is selective: protect the repeatable core while retaining direct analyst interaction where it improves judgement. Removing that interaction can make a process less reviewable, not more reliable.</p>
    </section>

    <section id="model">
      <h2>A model calculates; a workflow establishes how the result is produced</h2>
      <ResourceTable caption="Financial model versus governed workflow" headers={["Dimension", "Financial model", "Governed workflow"]} rows={[
        ["Analytical purpose", "Represents financial relationships and scenarios", "Executes a controlled recurring sequence"],
        ["Execution", "May depend on analyst interaction", "Makes prerequisites and dependencies explicit"],
        ["State", "Calculated values can coexist with unresolved ambiguity", "Separates received, blocked, validated and approved states"],
        ["Control", "Formulas and assumptions may be changed directly", "Separates inputs, rules, tests and approved changes"],
        ["Lineage", "May not retain event history", "Retains source, transformation and version relationships"],
        ["Ownership", "Does not inherently assign required actions", "Routes material exceptions to accountable reviewers"],
        ["Output", "A calculation or analytical view", "A validated state and versioned deliverable"],
      ]} />
      <p>The same allocation relationship can exist in either object. The distinction is execution, state, control, evidence, ownership and reproducibility. A model answers what a relationship calculates. A workflow answers how the organisation produces, validates, reviews and approves that result every cycle. Software alone does not provide those answers; its contracts must be defined.</p>
      <p>Risk concentrates when one workbook becomes input interface, data store, transformation engine, calculation engine, workflow tracker, exception log, approval mechanism, version history, evidence archive and final deliverable. Those roles become difficult to distinguish across formulas, hidden sheets, copied values, linked files, emails and folders. A formula can reveal arithmetic without revealing why a reviewer accepted its input.</p>
      <p>Start by labelling those roles in the current process. Preserve the analytical model; document the sequence surrounding it. This extends the <Link href="/resources/traceable-financial-analysis-workflow">end-to-end financial analysis workflow</Link>: the output is usable because its evidence permits a particular decision, not merely because calculation has finished.</p>
    </section>

    <section id="risks">
      <h2>Diagnose the failure mechanism before choosing automation</h2>
      <ResourceTable caption="Seven distinct operational risk mechanisms" headers={["Risk", "How it enters", "Control response"]} rows={[
        ["Formula", "Overwritten or incomplete ranges; constants, circular references, wrong signs or rounding", "Consistency tests, explicit error states and reconciled populations"],
        ["Link", "Changed paths, unavailable sources, cached values or circular workbook dependencies", "Versioned dependency register and freshness checks"],
        ["Data", "Incomplete pastes, changed columns, duplicates, missing records or incompatible units", "Schema, population, period, currency and type validation"],
        ["Version", "Competing attachments, superseded reviews and post-approval edits", "Pinned input versions and controlled publication history"],
        ["Process", "Undocumented sequence, hidden dependencies and unowned exceptions", "Explicit states, prerequisites and required actions"],
        ["Knowledge", "Personal macros, local scripts, inaccessible links and undocumented assumptions", "Transferable operating instructions and reviewable rules"],
        ["Governance", "Overwritten source values, unsupported adjustments or uncontrolled mappings", "Separate events, evidence, approval and mapping history"],
      ]} />
      <p>Not every workbook contains every risk. Test the actual process and its material decisions. Formula complexity is not itself a failure; an uncomplicated copied subtotal can be more dangerous than a sophisticated model with strong controls. Text-formatted numbers, currency mismatch and a wrong reporting period are data defects even when every formula is consistent.</p>
      <p>Reasonable totals are weak evidence of formula integrity. A copied range can stop before the final material; a named range can exclude new records; a subtotal can miss an inserted line. A hard-coded override may survive its original exception, a reference may point to a prior-period column, or two sign errors may cancel at company level while distorting individual products.</p>
      <p>Microsoft documents that <a href="https://support.microsoft.com/en-us/excel/functions/iferror-function">IFERROR returns a specified alternative when a formula errors</a>. Choosing zero can conceal a missing input. Its guidance on <a href="https://support.microsoft.com/en-us/excel/how-to-avoid-broken-formulas-in-excel">broken formulas</a> also identifies manual calculation as a reason formulas do not recalculate. A displayed value is therefore not evidence that the latest inputs were processed.</p>
      <p>Combine formula-consistency checks with control totals, expected-population tests, duplicate and omission detection, source-to-output reconciliation, input-version validation and explicit recalculation verification. Check refresh state for pivot-based outputs as well. Test missing inputs and new rows deliberately. Spreadsheet review alone cannot reliably detect every formula error; each control proves only the property it actually tests.</p>
    </section>

    <section id="dependencies">
      <h2>Turn hidden dependencies into evidence and state</h2>
      <p>An external link expresses a dependency without necessarily giving it an explicit workflow state. Its source may be moved, renamed, missing, replaced, refreshed at a different time or updated after review. A visible cached value may outlive the source relationship. Microsoft warns that <a href="https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/control-startup-message">suppressing updates and their warning can leave users unaware of stale data</a>.</p>
      <p>A governed dependency records expected source, received source, source version, extraction time, authority, reporting period, validation result and superseded state. Missing is different from received but unvalidated; accessible is different from approved. A value remaining visible after its source relationship breaks is a dangerous form of apparent continuity. Block the affected use rather than treating visibility as freshness.</p>
      <p>The progression from Report.xlsx to Report_v2.xlsx, Report_v2_final.xlsx, Report_v2_final_reviewed.xlsx and Report_v2_final_reviewed_NEW.xlsx is not a naming problem. It obscures which sources and formulas were used, which adjustments were approved, which commentary belongs to which figures, what was distributed and whether publication was later overwritten.</p>
      <p>A governed run retains cycle, reporting period, source versions, model version, mapping version, adjustment version, processing state, reviewer, approval, publication timestamp and superseded-by relationship. Freeze a coherent release snapshot. A later source correction creates a new run or revision, invalidates dependent reviews and preserves the earlier publication as history.</p>
      <p>Transformations change value, meaning, scope or presentation: sign conversion, scaling, currency translation, period harmonisation, mapping, aggregation, allocation, exclusion, reclassification, adjustment and duplicate removal. Retain input, output, rule, parameters, business reason, effective period, timestamp, version, actor, evidence and downstream use. The <Link href="/resources/financial-data-lineage">financial data lineage framework</Link> explains why retaining a formula is not equivalent to retaining this evidence.</p>
      <p>Expertise is not the defect. The analyst who interprets variation, challenges assumptions and resolves exceptions remains essential. Dependency becomes fragile when only that person knows execution order, formula extensions, ignored links, reversing adjustments and trustworthy outputs. Document those facts so expertise can move towards judgement, model improvement and management findings instead of repetitive reconstruction.</p>
      <p>Separate business effective time from processing time. A correction received in August may belong to July; an allocation approved today may apply only from next month. Record both dates and the rule’s permitted scope. Otherwise a technically reproducible rerun can still apply the wrong policy to the right source population.</p>
    </section>

    <section id="assessment">
      <h2>Choose a boundary, not a universal replacement policy</h2>
      <ResourceTable caption="Automation-potential matrix: compare the process, not the file" headers={["Dimension", "Lower orchestration need", "Higher orchestration need"]} rows={[
        ["Frequency and output", "One-off or infrequent investigation", "Monthly, weekly or daily management deliverable"],
        ["Financial materiality", "Limited decision impact", "Decision-critical amounts or sensitive governance"],
        ["Source complexity", "One small stable population", "Heterogeneous sources and cross-document dependencies"],
        ["Logic stability", "Exploratory relationships change materially", "Stable repeatable transformations and calculations"],
        ["Exceptions and mappings", "Rare, immaterial and easily reviewed", "Recurring material ambiguity, mappings and adjustments"],
        ["Review and versions", "One owner with effective independent review", "Several owners, approvals and competing versions"],
        ["Lineage requirement", "Simple inspection path", "Field-level evidence and persistent processing state"],
        ["Retained flexibility", "Direct scenario changes dominate the work", "Stable core with a separately flexible analytical edge"],
      ]} />
      <p>This is a judgement framework, not a numerical score. High exception frequency may justify routing while making unattended execution inappropriate. Unstable sources increase the need for intake controls but also migration effort. Frequent execution alone cannot justify moving a model whose economic definitions still change every cycle.</p>
      <p>Assess the supported decision, materiality, frequency, source count and heterogeneity, source and logic stability, manual steps, formula complexity, mapping requirements, exception rate, approvals, key-person dependency, version conflict, lineage need and output recurrence. Compare expected control benefit with implementation, testing, maintenance and adoption cost. Include rework and recoverability, not just minutes saved.</p>
      <ResourceTable caption="Four valid recommendations" headers={["Recommendation", "Appropriate boundary"]} rows={[
        ["Retain in Excel", "Exploratory, low-frequency or rapidly changing work; migration cost exceeds control benefit"],
        ["Strengthen Excel controls", "The model fits; improve formula checks, reconciliation, ownership and version discipline"],
        ["Hybrid workflow", "Externalise stable intake, transformations and validation; retain Excel analysis and review"],
        ["Governed workflow", "Material recurring execution with stable logic, multiple sources and owned review gates"],
      ]} />
      <p>Record the current decision and operating sequence, source population, stable versus flexible logic, material risks, failed controls, recurring exceptions and owners. Define the migration boundary, retained Excel role, expected benefit, implementation cost and next stage. Distinguish technically automatable, economically justified, control-improving and operationally adoptable: these are four separate tests.</p>
      <p>For the business case, name the failure being reduced and how improvement will be observed. Replacing manual source selection should reduce wrong-period intake; controlled mapping should reduce unsupported classification changes. Estimate implementation and ongoing review effort separately. Reject a migration whose apparent savings depend on removing a necessary reviewer or assuming away unresolved source quality.</p>
      <EntimemaFramework title="Make the migration decision explicit" steps={["Process → Risk", "Stable logic → Workflow boundary", "Retained flexibility → Decision"]} />
    </section>

    <section id="architecture">
      <h2>Govern the repeatable core; preserve the analytical edge</h2>
      <ResourceFigure label="Flexible analytical layer above governed execution" caption="Sources move through governed execution to validated output, then optionally to Excel. Analytical proposals return through definition, testing, review, approval and versioning; they never overwrite the core silently.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>FLEXIBLE ANALYTICAL LAYER</span><strong>Review · Scenarios · Sensitivities · Excel consumption</strong><small>Ad hoc analysis, custom presentation, local commentary and controlled supplementary schedules.</small></div>
          <ol>
            <li><b>↑</b><span>Validated output → versioned export or report → flexible consumption. Proposed recurring changes return through controlled approval.</span></li>
            <li><b>CORE</b><span>Governed Execution Layer: registered sources → extraction → harmonisation → canonical mapping → deterministic calculation and reconciliation → validated output.</span></li>
            <li><b>STATE</b><span>Source completeness, exceptions, reviewer decisions, versions and evidence lineage govern every transition in the execution layer.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <p>Excel may remain an input template, adjustment-proposal surface, review interface, scenario environment, supplementary schedule or exported deliverable. Define which fields are observations, which are assumptions and which are approved calculations. Imported proposals require validation and authority checks; a workbook upload must not become an unrestricted route into production values.</p>
      <p>Stable rules belong in a reviewable specification before code. State the population, units, sign convention, period, rounding, exclusions and allocation basis. Preserve source values alongside derived values. <Link href="/resources/financial-data-normalisation">Normalisation</Link>, <Link href="/resources/trial-balance-to-financial-statements">canonical mapping</Link> and <Link href="/resources/financial-data-validation-control-layer">deterministic validation</Link> solve different parts of that contract.</p>
      <p>If an exploratory change becomes recurring, define it, test representative and adverse cases, obtain review and approval, then version the rule. Keep one authoritative production calculation. A scenario formula may intentionally differ, but it must carry its own assumptions and non-production status rather than compete silently with the governed result.</p>
    </section>

    <section id="migration">
      <h2>Advance by controlled stages with an exit test at each boundary</h2>
      <ResourceFigure label="Eight migration steps grouped into four responsive layers" caption="Observe → Stabilise → Externalise Intake → Externalise Logic → Add Controls → Add Workflow State → Validated Output → Excel Export. Monitoring continues after every stage; not every process must complete the sequence.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>01 · UNDERSTAND</span><strong>Observe → Stabilise</strong><small>Document the actual sequence; separate inputs, calculations and outputs; establish baseline controls.</small></div>
          <ol>
            <li><b>02</b><span>Externalise Intake → Externalise Logic: register expected sources; move stable harmonisation, mapping, aggregation and duplicate rules.</span></li>
            <li><b>03</b><span>Add Controls → Add Workflow State: deterministic reconciliation, completeness gates, exceptions, owners and versioned review.</span></li>
            <li><b>04</b><span>Validated Output → Excel Export: release evidence-linked findings and a controlled workbook; monitor corrections and rework.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <p>Observe a real cycle, including work outside the workbook. Record sources, execution steps, formulas, mappings, adjustments, controls, owners, outputs and recurring failures. Stabilise clear input, calculation and output areas; introduce control totals, documented assumptions, formula checks, version naming and appropriate structural protection. The exit test is that another competent analyst can repeat the documented process.</p>
      <p>Externalise intake next: expected versus received populations, extraction cut-off, source version and completeness. Detect structural changes before positional extraction. Then move stable unit conversion, sign rules, period alignment, mapping, aggregation and duplicate handling. Compare results on identical pinned inputs; investigate differences rather than forcing agreement with a potentially defective workbook.</p>
      <p>Add deterministic controls for accounting equations, reconciliations, control totals, coverage and exceptions. Define permissible tolerances by purpose, with exact preservation where appropriate. Introduce states such as Awaiting sources, Blocked, Calculated, Validated, In review, Approved and Published. Each transition needs prerequisites, an actor and retained evidence; a progress indicator is not a control.</p>
      <p>Make reruns safe: repeating a run must not duplicate adjustments or publish another final output accidentally. Resume only from known successful checkpoints. Changed inputs invalidate affected downstream results and approvals. Version the release boundary and retain a recovery route to the last approved process while defects are resolved.</p>
      <p>Define exception ownership before launch. Each exception needs an affected value or population, severity, evidence, required action, owner and permitted next state. Distinguish a missing source from ambiguous meaning and a failed arithmetic test. Resolving one does not resolve the others. A reviewer may accept a documented limitation for one use while the same output remains blocked for another.</p>
      <p>Review decisions should bind to the exact run and affected objects. Approval must not float above whichever figures happen to be current. Escalation and absence cover matter: if the normal owner is unavailable, an authorised substitute needs the same evidence and decision boundaries. Removing key-person dependency requires an operating arrangement as well as documented code.</p>
      <p>Run a limited parallel comparison across representative cycles, including a correction and an exception case. Agree acceptance criteria before comparing outputs, name the authoritative engine at cutover and retire duplicate production logic. Monitor recurring exceptions, intervention, failed controls, cycle time, rework, user corrections and model changes. A hybrid boundary can remain the durable endpoint.</p>
    </section>

    <section id="example">
      <h2>A reconciled company total can conceal the wrong product margin</h2>
      <p>Consider a fictional manufacturer’s monthly profitability process. All amounts and circumstances are invented. Seven current-cycle inputs arrive: trial balance, production volumes, material consumption, inventory, energy costs, payroll allocation and budget. A retained prior-period management report is the eighth reference, used for comparison rather than as another current-period cost source.</p>
      <p>The analyst renames and copies files into designated folders, pastes into hidden worksheets, converts kilograms to tonnes, maps accounts and materials, allocates shared energy, calculates product costs and margins, reconciles to the ledger, writes variance commentary and removes formulas and links for publication.</p>
      <p>This cycle, one source changes column order. A formula range omits the final material, an external allocation link points to the prior-period budget and a material is manually mapped to the wrong product family. A hard-coded allocation correction obscures the rule. Four competing report versions circulate; the final static workbook cannot identify the source behind one margin.</p>
      <p>For Product Family A, reported contribution margin is EUR 1.84 million; corrected contribution margin is EUR 1.57 million. Here contribution means revenue less the costs assigned under the stated management allocation policy, including shared energy. It is not presented as a universal statutory subtotal or a pure variable-cost measure.</p>
      <ResourceTable caption="Product Family A: non-overlapping correction components" headers={["Failure", "Margin overstatement", "Where the cost remained"]} rows={[
        ["Final material omitted from the product range", "EUR 110,000", "Unallocated production-cost pool"],
        ["Stale budget driver underallocated current energy cost", "EUR 90,000", "Other product families through the balancing allocation"],
        ["Material mapped to the wrong product family", "EUR 70,000", "Product Family B"],
        ["Total correction", "EUR 270,000", "Redistribution of existing ledger costs; no new company cost"],
      ]} />
      <Formula label="Exact correction of the reported product margin">EUR 110,000 + EUR 90,000 + EUR 70,000 = EUR 270,000<br />EUR 1,840,000 − EUR 270,000 = EUR 1,570,000</Formula>
      <p>The omission is from A’s product schedule, not from the ledger or the company expense total. The energy pool contains current actual cost, but its outdated allocation driver assigns too little to A. The manual correction is part of that same EUR 90,000 net allocation error, not a fourth component. Changed column order is an intake defect caught during investigation, not an additional quantified loss.</p>
      <ResourceTable caption="Company preservation does not prove product classification — EUR" headers={["Contribution bucket", "Reported", "Corrected", "Movement"]} rows={[
        ["Product Family A", "1,840,000", "1,570,000", "−270,000"],
        ["Other product families", "2,050,000", "2,210,000", "+160,000"],
        ["Unallocated production costs", "−110,000", "0", "+110,000"],
        ["Company contribution", "3,780,000", "3,780,000", "0"],
      ]} />
      <p>Other product families recover EUR 90,000 of energy and EUR 70,000 of misclassified material. The EUR 110,000 pool clears into A. Company contribution remains EUR 3.78 million and, with unchanged other expenses, the company P&amp;L still reconciles. A company-only check cannot detect whether the right product bears the right cost; allocation coverage and semantic classification need separate tests.</p>
      <p>The migrated workflow registers expected sources and detects the changed schema before extraction. Source-linked observations retain raw kilograms; a versioned transformation divides by 1,000 to obtain tonnes. Accounts and materials map into the canonical structure. An approved current-period energy rule allocates the actual pool using retained driver quantities and a documented rounding policy.</p>
      <p>Deterministic cost calculations test source coverage, unique assignment, allocation preservation and ledger agreement. The new material remains a visible mapping exception until a targeted Controller review confirms its product family with evidence. The workflow retains the proposal, correction, reason and approval; it does not silently reuse last month’s interpretation.</p>
      <p>The release package records source snapshots, the quantity conversion, current energy-driver version, revised material mapping and the superseded manual correction. The reviewer can travel from A’s margin to its assigned costs and back to each source location. A preserved company total is one passed control; complete product assignment and supported classification are additional, separately evidenced release conditions.</p>
      <KeyObservation title="Worked-example management finding">The original workbook overstated Product Family A’s contribution margin by EUR 270,000. Company totals remained reconciled, but omitted product cost, a stale allocation link and incorrect mapping distorted product profitability. The corrected model reports EUR 1.57 million, with the evidence path retained and Excel preserved for review and scenarios.</KeyObservation>
      <p>Release the validated profitability model, evidence-linked management findings and controlled review workbook. Management can reconsider pricing or product mix using the corrected margin, but the example does not establish a pricing recommendation by itself: capacity, demand, avoidable costs and commercial constraints still require judgement.</p>
    </section>

    <section id="export">
      <h2>A controlled Excel export is a deliberate architecture choice</h2>
      <p>Export validated statements, canonical mappings, comparative periods, deterministic metrics, exceptions, principal transformations, findings, evidence references and decision-readiness status. Include stable identifiers, source references, model version, export timestamp and current-state status. These allow a reviewer to identify what was delivered even when the workbook is forwarded separately from its originating workflow.</p>
      <p>Distinguish governed output from editable analysis, assumptions, scenarios and local commentary. Clearly mark supplementary calculations and local changes. Protection can reduce accidental edits, but it does not make unrestricted copies authoritative. A governed export preserves the provenance of what was delivered; it cannot govern every change after the file leaves the workflow.</p>
      <p>If an edited export returns, treat it as a proposed change against an identified baseline. Compare differences, validate affected inputs, resolve conflicts and approve a new version before reuse. An old export cannot certify current readiness after its upstream evidence changes. Evidence links must respect access permissions and retention; an exported identifier is not permission to disclose a confidential source.</p>
      <p>Specify the intended consumer before designing the export. A Controller needs reconciliation and exception detail; a manager needs findings and limitations; an analyst may need scenario inputs and transparent supplementary formulas. They can share one approved baseline without receiving identical workbooks. Reconcile each delivered view to that baseline and record its purpose, rather than creating another independent production model.</p>
    </section>

    <section id="failures">
      <h2>Recognise automation that removes effort but not risk</h2>
      <ResourceTable caption="Failure → Why it looks progressive → Consequence → Required control" headers={["Failure", "Apparent progress", "Operational consequence", "Required control"]} rows={[
        ["Replace Excel before discovery", "Modern platform", "Hidden process lost", "Observe real execution"],
        ["Automate a broken sequence", "Faster cycle", "Defects repeat faster", "Repair rules first"],
        ["Code every formula without definitions", "Complete conversion", "Meaning becomes implicit", "Business specifications"],
        ["Treat every spreadsheet as high-risk", "Uniform policy", "Wasteful migration", "Materiality assessment"],
        ["Lose analyst reviewability", "Centralised logic", "Errors resist challenge", "Inspectable calculations"],
        ["Rebuild an opaque black box", "Clean interface", "Dependence on hidden rules", "Evidence and rule access"],
        ["Remove scenario flexibility", "Standardisation", "Management questions constrained", "Separate analytical layer"],
        ["Externalise without lineage", "Managed calculations", "Results cannot be defended", "Source-linked dependencies"],
        ["Automate extraction only", "Fast intake", "Manual mapping remains uncontrolled", "Version mapping decisions"],
        ["Add state without reconciliation", "Visible progress", "Completed but wrong output", "Deterministic release gates"],
        ["Hide exceptions", "High automation rate", "Uncertainty becomes a number", "Visible blocked states"],
        ["Export without identifiers", "Familiar deliverable", "Unknown baseline", "Version and timestamp"],
        ["Trust locally edited exports", "Continued flexibility", "Unapproved changes reused", "Controlled re-entry"],
        ["Retain competing engines", "Parallel assurance", "Conflicting final results", "Authoritative cutover"],
        ["Migrate everything at once", "Broad transformation", "Unmanageable change risk", "Bounded stages"],
        ["Measure only time saved", "Quick return", "Control deterioration ignored", "Rework and control metrics"],
        ["Replace analyst dependency with vendor dependency", "External expertise", "Rules cannot be maintained", "Transferable specifications"],
        ["Confuse static model with execution", "Model delivered", "Recurring ownership absent", "Run and review contracts"],
        ["Orchestrate because AI is available", "Technical novelty", "Unjustified operating cost", "Decision-led business case"],
      ]} />
    </section>

    <section id="execution">
      <h2>Evaluate recurring value through controlled execution</h2>
      <p>Entimema does not replace Excel. Its Financial Intelligence methodology converts repeatable financial logic into a controlled workflow while preserving Excel where flexibility, review and scenario analysis remain valuable. The sequence below is an architecture to scope and validate against a particular process, not a claim that every capability, integration or export is already deployed.</p>
      <EntimemaFramework title="From recurring Excel-heavy process to controlled deliverable" steps={[
        "Register source population → Interpret files and structures → Extract source-linked values",
        "Harmonise periods, units, currencies and signs → Map canonical financial structure",
        "Run deterministic transformations and controls → Surface exceptions → Route material review",
        "Build validated analytical model → Produce findings → Export controlled results to Excel or another agreed supported deliverable",
      ]} />
      <p>Model intelligence may interpret structure and semantics, propose mappings, detect ambiguity, classify exceptions, request targeted clarification and support analytical interpretation. Deterministic code owns transformations, arithmetic, approved allocations, reconciliation, accounting controls, fixed workflow rules, versioned calculations and control totals. Human judgement owns migration scope, material mappings, allocation-policy approval, exceptions, exploratory changes, accepted limitations and the final financial decision.</p>
      <p>Compatibility must be tested against the actual inputs, formulas, macros, add-ins and output requirements. There is no assumption of universal Excel compatibility, one-click migration or automatic support for every local script. The <Link href="/resources/month-end-reporting-workflow">month-end reporting framework</Link> governs recurring release; <Link href="/resources/management-reporting-for-cfo-decisions">management reporting</Link> connects the approved output to decisions.</p>
      <p>Recurring commercial value is justified only if each new cycle receives current-source interpretation, harmonisation, mapping validation, deterministic controls, exception handling, review, findings, versioned output and retained lineage. Governed context can preserve validated mappings, transformation rules, source patterns, exception classes, review precedents and approved calculations. It must remain scope-controlled, reviewable, reversible and subordinate to current evidence.</p>
      <p>The opening analyst should still improve the model and challenge its assumptions. What changes is the need to reconstruct an undocumented operating sequence before every review. The strongest finance architecture separates exploratory modelling from recurring controlled execution: a repeatable process, a defensible output and continued freedom to ask a different question.</p>
      <DecisionImplication><strong>Bring one recurring Excel-heavy process and evaluate its automation potential.</strong> Explore the <Link href="/services/financial-data">Financial Data service</Link> and <Link href="/services/management-reporting">Management Reporting</Link>, or <Link href="/contact">request an Entimema Financial Intelligence demonstration</Link> using that process, its current controls and its intended Excel role.</DecisionImplication>
    </section>
  </>;
}
