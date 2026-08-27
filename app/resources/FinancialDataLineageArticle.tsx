import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-13. All example entities, amounts, locations, rules and events are fictional. */
export const financialDataLineageSections = [
  { id: "objects", label: "Define the evidence objects" },
  { id: "architecture", label: "Traverse the complete chain" },
  { id: "fields", label: "Locate the actual evidence" },
  { id: "transformations", label: "Preserve changes and meaning" },
  { id: "calculations", label: "Retain calculation dependencies" },
  { id: "evidence", label: "Separate evidence from explanation" },
  { id: "history", label: "Govern review and versions" },
  { id: "example", label: "Trace available liquidity" },
  { id: "readiness", label: "Test decision readiness" },
  { id: "failures", label: "Recognise incomplete lineage" },
  { id: "execution", label: "Inspect the final deliverable" },
] as const;

export default function FinancialDataLineageArticle() {
  return <>
    <p className={styles.leadParagraph}>Available liquidity declined by EUR 1.8 million. Gross margin fell by 2.1 percentage points. Operating cash conversion deteriorated, with one business unit responsible for most of the movement. The CFO receives a polished report: formulas calculate, figures look plausible, and every repeated number agrees. Then comes a simple question: where did the EUR 1.8 million come from?</p>
    <p>The analyst identifies a workbook linked to a consolidated tab containing pasted values. One mapping was corrected manually. The source file has since been replaced; its exact row and column are unknown. Commentary describes an earlier version. The conclusion may be correct, but its evidence path cannot be defended. Precision, plausibility and reproducibility are different claims.</p>
    <KeyObservation title="Executive thesis">A financial number without a provable connection to its source remains difficult to challenge, reproduce and defend. Financial data lineage is the evidence structure that allows a reported number to be inspected in both directions—from source to conclusion and from conclusion back to source. It operates at the value and relationship level.</KeyObservation>

    <section id="objects">
      <h2>Define objects before drawing connections</h2>
      <p>A filename is not a lineage model. Nor is a workbook formula, report footnote, generic data catalogue, document confidence score or narrative reconstructed after calculation. A user-action audit log explains who clicked approve; unless it connects exact inputs, transformations and outputs, it cannot explain which evidence produced the approved number.</p>
      <ResourceTable caption="Minimum financial lineage objects" headers={["Object", "What it preserves", "Connection required"]} rows={[
        ["Source document", "Submitted evidence container, authority and version", "Contains source locations"],
        ["Source location", "Exact coordinates inside a particular source version", "Supports an observed field"],
        ["Extracted value", "Raw observation, local context and extraction event", "Supplies transformation inputs"],
        ["Transformation event", "Rule, parameters, before and after values", "Derives a new state without erasing its input"],
        ["Canonical mapping", "Local meaning linked to an analytical concept", "Explains classification and its scope"],
        ["Calculation node", "Deterministic operation and versioned dependencies", "Produces a metric from identified inputs"],
        ["Validation result", "Test, tolerance, observed residual and status", "Qualifies specific versions for a defined use"],
        ["Reviewer intervention", "Evidence, judgement, prior state and approved change", "Authorises or rejects a proposed state"],
        ["Finding", "Material analytical statement and its limitations", "Cites values, controls and interpretations"],
        ["Decision or action", "Owner, authority, response and review date", "Uses a finding without changing its evidence"],
      ]} />
      <p>Give each object a stable identifier and each state an explicit version. Label the relationships: extracted from, transformed by, mapped to, calculated from, validated by, reviewed by, supports and used in. An untyped arrow hides whether two values are added, compared, reclassified or merely associated.</p>
      <p>The <a href="https://www.w3.org/TR/prov-dm/">W3C PROV data model</a> provides a general vocabulary for entities, activities, derivation and responsible agents. The financial model here adds decision-specific meaning: reporting perimeter, accounting controls, materiality and approval. It is an Entimema methodology, not a claim of certification or a prescribed software implementation.</p>
    </section>

    <section id="architecture">
      <h2>One evidence chain, two directions of inspection</h2>
      <ResourceFigure label="Financial lineage in four layers, from decision back to source" caption="Read down to inspect a finding; read up to discover where a source field contributes. The four layers organise the same dependency graph, not four disconnected workflows.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>FINDING AND DECISION</span><strong>Decision ← Finding</strong><small>Authorised action, evidence boundary and responsible owner.</small></div>
          <ol>
            <li><b>↓ ↑</b><span>Calculation and Validation: Metric or relationship ← Calculated value ← Validated canonical values. Exact input versions and applicable controls remain attached.</span></li>
            <li><b>↓ ↑</b><span>Structuring and Transformation: Transformations and mappings ← Extracted source fields. Preserve original values, semantic proposals and reviewer intervention.</span></li>
            <li><b>↓ ↑</b><span>Source Evidence: Source locations ← Source documents. Resolve the exact field in the registered version, including its period, entity and units.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <p>Forward lineage asks: where did this source value contribute? Backward lineage asks: which evidence produced this reported value or finding? Both must work. A cash restriction may affect coverage, liquidity commentary and a funding recommendation; it need not affect gross margin. Dependency edges make that distinction explicit.</p>
      <p>Register the source and location, preserve the observation, record extraction, retain transformations and map meaning before validating the value. Capture intervention, aggregate through explicit dependencies, then connect metrics to findings and decisions. This extends the <Link href="/resources/traceable-financial-analysis-workflow">FIR-05 analysis workflow</Link> with an inspectable evidence contract at every transition.</p>
      <p>A document can support many fields, and one calculation can depend on several documents. The diagram is a readable view of a graph. Shared source nodes should be referenced, not copied into disconnected narratives whose histories later diverge.</p>
    </section>

    <section id="fields">
      <h2>Document provenance identifies the container; field lineage identifies the evidence</h2>
      <p>Register source identifier, file or system type, entity, reporting period, scenario, currency, unit, source system, received timestamp, version, owner and authority status. Keep an integrity identifier where implemented. A checksum can detect changed bytes; it does not establish accounting authority, completeness or economic truth.</p>
      <p>A workbook may combine entities, hidden worksheets, comparative periods, calculated cells, pasted values, revised tables and inconsistent units. A PDF may contain subtotals, continuation tables, restatements and notes with different scales. Linking to either container leaves the reviewer to guess which observation was used.</p>
      <ResourceTable caption="Source locations must resolve inside the retained version" headers={["Source type", "Minimum useful location"]} rows={[
        ["Workbook", "Worksheet, cell or table row and column; retain formula and observed result where relevant"],
        ["PDF", "Page, table, row, period column and bounding region where available"],
        ["Document", "Section, field and contextual qualifier"],
        ["Database or API", "Table and record, or object and field; retain snapshot or response version"],
        ["ERP report", "Document and line, or report dimension coordinates and extraction cut-off"],
      ]} />
      <p>The extracted record retains raw label, raw value, data type, sign representation, currency, unit, period, row and column context, extraction method, timestamp, confidence and source-location reference. Preserve a displayed dash as an observation until its meaning is established; converting it immediately to zero destroys the distinction between absence and amount.</p>
      <p>For each material value, the reviewer must inspect origin, interpretation, transformation, mapping, passed controls, intervention, downstream uses, current version and earlier states. Successful document classification proves none of these individually. A confidently recognised Balance Sheet may still have cash scaled incorrectly, current and non-current debt reversed, the comparative column selected or restricted cash treated as available.</p>
      <p>Extraction confidence therefore belongs to the field and method it describes. Mapping confidence addresses meaning; validation addresses defined constraints. The <Link href="/resources/confidence-human-review-ai-finance">confidence and human-review framework</Link> keeps these separate. High confidence cannot repair a missing location or authorise an unsupported liquidity interpretation.</p>
    </section>

    <section id="transformations">
      <h2>Preserve arithmetic changes and semantic changes separately</h2>
      <Formula label="A transformation derives a new value from retained inputs">Output value = f(Input value₁, …, Input valueₙ, Rule, Parameters)</Formula>
      <p>Every transformation event records input and output, type, rule, parameters, reason, timestamp, actor or process, version, reversibility, upstream references and downstream uses. Unit conversion is a multiplication; currency translation additionally requires rate source, effective date and convention. Neither permits replacement of the observed source value.</p>
      <p>Sign normalisation, period harmonisation, monthly extraction from year-to-date flows, scaling, aggregation, splits, reclassification, elimination, normalisation adjustments, rounding and duplicate removal all need explicit operations. A monthly amount derived from two cumulative values depends on both snapshots and their comparable scope. An elimination depends on both counterpart populations and the approved matching rule.</p>
      <p>Record whether an operation is reversible. Rounding and aggregation usually lose information if only the output survives; retaining inputs makes the path inspectable without pretending an inverse function can recreate them. Duplicate removal retains the excluded record and identity rationale, so a reviewer can distinguish deliberate exclusion from missing evidence. These controls extend <Link href="/resources/financial-data-normalisation">financial data normalisation</Link>.</p>
      <p>Canonical mapping is a semantic transformation with its own provenance. Retain source label and code, context, proposed and final concept, mapping type, scope, effective period, confidence, ambiguity, supporting evidence, alternatives, reviewer decision, mapping version and downstream impact. A numerically unchanged value can acquire a materially different meaning.</p>
      <p>One-to-one and many-to-one mappings differ from splits, conditional, sign-dependent, entity-specific and period-specific rules. A split needs a supported allocation basis and a preservation check. An unresolved mapping is a valid state, not a defective record to conceal. Unknown values must not silently become zero, Other, the nearest label or the previous-period concept.</p>
      <p>Reuse confirmed mappings only within their approved entity, account population, purpose and effective period. Contradictory current evidence reopens the rule even when its label and code are unchanged. The <Link href="/resources/trial-balance-to-financial-statements">trial-balance mapping method</Link> explains why accounting balance cannot substitute for semantic validity.</p>
    </section>

    <section id="calculations">
      <h2>A formula needs a population and an input version</h2>
      <p>Calculation lineage is the dependency graph connecting source-linked values to calculated results. Retain calculation identifier, formula or operation, input nodes and versions, output node, unit, period, currency, sign convention, calculation timestamp, deterministic rule version, validation result and rounding policy. A formula referencing whatever is currently in a cell cannot reproduce last month’s approved result.</p>
      <Formula label="Examples of deterministic financial dependencies">Gross profit = Revenue − Cost of sales<br />Gross margin = Gross profit / Revenue<br />Available cash = Total cash − Restricted cash</Formula>
      <p>The ratio requires compatible numerator and denominator populations and a defined zero-denominator treatment. Calculate using controlled precision, then round for presentation; do not feed a rounded displayed percentage back into another calculation. A validation result attaches to the tested versions, not indefinitely to a concept called Gross Margin.</p>
      <Formula label="Aggregate preservation, with separately traceable adjustments and eliminations">Reported total = Σ Contributing values + Adjustments − Eliminations</Formula>
      <p>Hundreds of accounts or thousands of transactions may contribute across entities and currencies. Retain every child reference or a reproducible governed query identifying the exact population. A query alone is insufficient when its underlying table changes: retain the data snapshot, query version, parameters, cut-off and membership evidence needed to recover the same rows.</p>
      <p>Test population completeness, duplicate prevention, sign, unit, period, currency, mapping coverage and aggregation reconciliation. Retain explicit excluded populations and reasons. Adjustments and eliminations are separate nodes, never unexplained constants inside a total. Every material component must remain inspectable beyond the summary tab.</p>
      <p>Equal totals can conceal offsetting omissions. Reconciliation establishes agreement under a test; it does not establish complete contributing-field lineage. Use <Link href="/resources/financial-data-validation-control-layer">deterministic validation</Link> alongside dependency coverage. The same discipline supports <Link href="/resources/profit-vs-cash-flow-reconstruction">cash-flow reconstruction</Link>, where non-cash movements cannot be mistaken for cash evidence.</p>
    </section>

    <section id="evidence">
      <h2>Traceability does not turn explanation into observation</h2>
      <ResourceTable caption="Four evidence states: never flatten them into one narrative" headers={["State", "Example", "Required boundary"]} rows={[
        ["Evidence", "Source field, reconciled subtotal or deterministic variance", "Observed or calculated; preserve its provenance and test scope"],
        ["Inference", "Receivables growing faster than revenue suggests weaker collection or changing terms", "Supported interpretation, not a directly observed cause"],
        ["Hypothesis", "A disputed customer balance caused DSO deterioration", "Requires ageing, dispute, timing and alternative-explanation evidence"],
        ["Decision", "Escalate disputed invoices and revise the liquidity forecast", "Authorised response with owner, uncertainty and review date"],
      ]} />
      <KeyObservation>Lineage proves where the number came from. It does not automatically prove why the business changed.</KeyObservation>
      <p>A finding should identify supporting metrics, comparisons, calculation versions, materiality, evidence state and limitations. If it combines observation and inference, label each clause. “Available cash is below current debt” can be calculated; “the company cannot pay tomorrow” requires maturity, inflow, facility and payment-timing evidence that the ratio does not contain.</p>
      <p>A hypothesis may remain open while a reversible information-gathering action proceeds. The action’s approval does not retrospectively validate the hypothesis. <Link href="/resources/financial-kpi-trees">Financial KPI trees</Link> organise dependencies and competing explanations; lineage provides the evidence path needed to challenge each relationship.</p>
    </section>

    <section id="history">
      <h2>Correct the current output without erasing how it became current</h2>
      <p>Reviewer intervention is a first-class event. Preserve the value before review, proposed interpretation, reason for review, evidence presented, alternatives, reviewer decision, resulting value or classification, permitted identity or role, timestamp, scope, version, downstream recalculations and approval status. A correction demonstrates that review changed the machine proposal; it is not evidence that the original proposal was accurate.</p>
      <p>Distinguish confirmation, correction, reclassification, split, exception acceptance, override, rejection, abstention and request for evidence. Acceptance of a bounded limitation does not turn it into resolved evidence. An override must identify its authority and affected use; abstention must leave dependent conclusions blocked where the unanswered question is material.</p>
      <ResourceFigure label="Editable current state and retained historical states" caption="Immutable history is an architectural principle here, not a claim that technically immutable storage is deployed. Every arrow creates a retained event or version; none deletes its predecessor.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>RETAINED OBSERVATION</span><strong>Original source and extracted field</strong><small>The observation remains available alongside all later interpretations.</small></div>
          <ol>
            <li><b>01</b><span>Machine proposal → retained proposal version, confidence and proposed mapping.</span></li>
            <li><b>02</b><span>Reviewer intervention → evidence, before/after classification, reason and approval event.</span></li>
            <li><b>03</b><span>Approved current state → explicit pointer to an approved version. Historical proposals, decisions, calculations and published outputs remain separately retained.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <p>Version source documents, fields, transformation rules, mappings, adjustments, calculations, analytical models, findings, reports and reviewer decisions. Each change event records event and object identifiers, prior and new versions, change type, timestamp, actor or process, reason, evidence, downstream invalidation and approval status.</p>
      <p>Separate reporting effective time from processing time. A correction received in August may concern July. Store both meanings with an explicit time zone and event ordering; a timestamp alone does not establish which concurrent approval prevailed. Publish a coherent model snapshot, not a mixture of whichever inputs were most recently edited.</p>
      <p>On upstream change, enumerate dependent outputs. Recalculate deterministic values, invalidate affected approvals and flag findings for review, or retain them explicitly as historical outputs tied to earlier inputs. Even an unchanged numerical result may need renewed review if its authority or classification changed. Never silently refresh an approved finding while keeping its old approval status.</p>
      <p>Editable current state supports controlled correction. Historical record preserves observation, transformation, intervention, publication and later revision. An implementation claiming immutability needs evidenced storage permissions, retention, deletion controls, recovery and change-detection behaviour; an append-only table convention alone is not proof. This article claims no blockchain, write-once storage, cryptographic immutability or legally certified audit trail.</p>
    </section>

    <section id="example">
      <h2>One cash finding, two critical evidence locations</h2>
      <p>Consider a fictional manufacturer assessing ordinary debt-service liquidity at 31 July. Every amount, location and event below is invented. Its registered population comprises a Balance Sheet PDF v2 in EUR thousands, a trial-balance Excel export v1 in EUR, a debt schedule v1, a restricted-cash note v1, a prior mapping rule M1 and one Controller intervention.</p>
      <p>The PDF’s page 3, financial-position table, Cash row, current-period column contains 5,000. The note’s page 2, Restrictions table, ordinary-debt-service row, current-period column contains 1,200 EUR thousands. Both refer to the same entity and date. These are separate source locations; the note qualifies the cash population rather than adding another cash asset.</p>
      <p>The fictional trial balance’s Cash worksheet, rows 8–10, closing-EUR column contains 2,400,000, 1,400,000 and 1,200,000. Their sum is EUR 5.0m. The debt schedule’s Maturity worksheet, closing-EUR column D, identifies current debt of EUR 5.1m in row 6 and non-current debt of EUR 5.4m in row 7. Coverage uses current debt only; total debt is EUR 10.5m.</p>
      <p>At the fictional 09:00 UTC extraction event, retain the raw PDF field as 5,000 and its unit as EUR thousands. Transformation T1 multiplies by 1,000, producing EUR 5,000,000. A separately recorded application converts the note’s 1,200 into EUR 1,200,000. Canonical Total Cash reconciles to the three trial-balance children with zero residual.</p>
      <p>Prior rule M1 proposes that every cash account is Available Cash, producing EUR 5.0m. The current note contradicts that interpretation. The workflow retains M1’s proposal, routes the EUR 1.2m restriction for review and withholds the dependent liquidity finding. It does not allow historical mapping convenience to override current evidence.</p>
      <p>At 09:20 UTC, the Controller confirms that the note identifies cash unavailable for ordinary debt service. Intervention R1 records the contradictory note, rejected all-available alternative, unchanged total and revised classification. Approved mapping M2 applies to this entity, date and purpose; EUR 1.2m is Restricted Cash. This is one reclassification event, not an unexplained reduction in reported cash.</p>
      <p>Pin the approved calculation to Total Cash TC1 v1, derived from PDF field E1 v1 through T1 v1, and Restricted Cash RC1 v2, derived from note field E2 v1 through scale event T2 v1 and reviewed mapping M2. Available Cash C1 v2 uses those two nodes. Coverage C2 v2 uses C1 v2 and debt field D1 v1 at Maturity!D6 in debt schedule v1. Finding F1 v2 references C2 v2, both cash branches and R1. These identifiers are illustrative, but their dependency contract is essential.</p>
      <p>The source register records receipt and authority separately from approval. Here all four documents are accepted for the July snapshot before calculation; validation V1 records zero cash reconciliation residual against the retained trial-balance population. At 09:25 UTC, recalculation completes and F1 v2 is approved for the limited cash-versus-current-debt comparison. Approval does not extend to a daily funding forecast.</p>
      <Formula label="Available cash, calculated in EUR before presentation in millions">EUR 5.0m − EUR 1.2m = EUR 3.8m</Formula>
      <Formula label="Immediate cash coverage of current debt; rounded only for display">EUR 3.8m / EUR 5.1m × 100 ≈ 74.5%</Formula>
      <ResourceFigure label="Worked-example cash lineage with supporting note and debt schedule" caption="Backward inspection of the finding reaches both cash source locations and the debt denominator. The trial balance corroborates total cash; it is not added to the PDF amount.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>SOURCE EVIDENCE</span><strong>PDF cash 5,000 and Note restriction 1,200</strong><small>Separate locations, both EUR thousands; trial balance corroborates EUR 5.0m.</small></div>
          <ol>
            <li><b>01</b><span>Scale both fields × 1,000 → Total Cash EUR 5.0m and Restricted Cash EUR 1.2m; R1 confirms M2 instead of M1.</span></li>
            <li><b>02</b><span>Available Cash EUR 3.8m → divide by current debt EUR 5.1m from the debt schedule → Cash Coverage approximately 74.5%.</span></li>
            <li><b>03</b><span>Liquidity Finding → available cash alone is below current debt → Treasury reviews maturities, inflows and short-term funding requirements.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <ResourceTable caption="Compact fictional lineage record" headers={["Layer", "Example object", "Retained evidence"]} rows={[
        ["Document", "Balance Sheet PDF v2", "Entity, July period, actual scenario, EUR thousands and authority"],
        ["Location", "Page 3, financial-position table, Cash row, current column", "Field reference inside v2"],
        ["Extraction", "5,000 EUR thousands, field E1 v1", "Raw label, value, scale, method and 09:00 UTC event"],
        ["Transformation", "T1 v1: multiply E1 v1 by 1,000", "Input 5,000; output EUR 5,000,000"],
        ["Mapping", "Total Cash; M2 replaces M1 for availability", "Purpose, entity, effective date and retained proposal"],
        ["Support", "Note v1, page 2, Restrictions table, current column", "1,200 EUR thousands; separate conversion and source reference"],
        ["Review", "R1 at 09:20 UTC", "Controller confirms restricted classification; prior state retained"],
        ["Calculation", "Available Cash C1 v2 = 5.0 − 1.2", "TC1 v1 less RC1 v2, using M2 and R1; EUR 3.8m"],
        ["Validation", "Trial-balance cash sum EUR 5.0m", "Three child references; zero reconciliation residual"],
        ["Coverage", "C2 v2 = 3.8 / 5.1", "C1 v2 and D1 v1, debt schedule v1 Maturity!D6; 74.5% displayed"],
        ["Finding", "F1 v2: cash available below current debt", "Both source locations, debt field, R1 and limitations"],
        ["Decision", "Review short-term funding requirement", "Treasury owner; CFO authorisation for review, not borrowing"],
      ]} />
      <p>The earlier proposal implied approximately 98.0% coverage. M2 invalidates that proposal’s dependent finding; C1 v2 and C2 v2 are recalculated and reviewed. The original EUR 5.0m available-cash state remains historical. Total Cash is still EUR 5.0m: source agreement did not change, analytical availability did.</p>
      <KeyObservation title="Traceable finding">Reported cash is EUR 5.0 million, but EUR 1.2 million is restricted and unavailable for ordinary debt service. Available cash is therefore EUR 3.8 million, covering approximately 74.5% of current debt. This conclusion depends on the supporting note and reviewer-confirmed restricted-cash classification.</KeyObservation>
      <p>The EUR 1.3m difference is a point-in-time comparison, not a funding forecast or proof of default. Current debt is not necessarily payable immediately; future receipts, committed facilities and minimum operating cash remain outside this calculation. Treasury must align maturities and accessible inflows before recommending financing. The CFO can authorise that investigation without accepting an unsupported insolvency conclusion.</p>
    </section>

    <section id="readiness">
      <h2>Completeness is necessary; decision sufficiency is separate</h2>
      <p>Assess seven dimensions: completeness of required connections; precision of field locations; reproducibility of outputs; integrity of retained states and interventions; currency of approved versions; interpretability of rules; and decision relevance of evidence. A technically complete graph may still lack the contractual information needed to establish cash availability.</p>
      <ResourceTable caption="Purpose-specific decision-readiness states" headers={["Status", "Meaning", "Permitted use"]} rows={[
        ["Source unverified", "Authority or version unresolved", "No dependent conclusion"],
        ["Field untraceable", "Exact location missing", "Affected value blocked"],
        ["Transformation unresolved", "Rule or parameter unclear", "No affected calculation"],
        ["Mapping review required", "Canonical meaning uncertain", "Pause dependent metrics"],
        ["Reconciliation failed", "Required deterministic control fails", "Downstream finding blocked"],
        ["Traceable with limitations", "Complete chain, bounded evidence gaps", "Qualified use within disclosed limits"],
        ["Decision-ready", "Evidence, controls and material review support purpose", "Full intended decision only"],
        ["Reopened", "Upstream evidence changed after approval", "Recalculate and review before renewed use"],
      ]} />
      <p>Apply status to affected nodes and their dependent findings, not indiscriminately to the whole report. An unresolved liquidity restriction may block a borrowing recommendation while leaving a reconciled revenue comparison usable. Define who can accept limitations, for which purpose, until when, and what evidence would reopen the conclusion.</p>
      <p>Test one material finding backwards to every contributor, then change one upstream version and inspect forward invalidation. Reproduce an older published result from its retained snapshot. Ask a reviewer unfamiliar with the preparation to locate the source and explain the adjustment. These tests expose both missing edges and technically complete but unusable evidence paths.</p>
    </section>

    <section id="failures">
      <h2>Controls that look complete can still conceal a broken path</h2>
      <ResourceTable caption="Failure → Why it looks controlled → Decision consequence → Required control" headers={["Failure", "Appearance", "Consequence", "Required control"]} rows={[
        ["Document link only", "Source attached", "Wrong field selected", "Versioned field coordinates"],
        ["Final value only", "Clean dataset", "Observation lost", "Retain raw value and context"],
        ["Transformation overwrite", "Corrected number", "Change cannot be inspected", "Separate input and output states"],
        ["Formula without input versions", "Transparent arithmetic", "Old result unreproducible", "Version-pinned dependencies"],
        ["Mapping without scope or period", "Approved rule", "Invalid reuse", "Effective scope contract"],
        ["Prior mapping beats current evidence", "Consistent classification", "Known contradiction ignored", "Reopen conflicting rule"],
        ["Aggregate ends at summary tab", "Drill-down exists", "Population hidden", "Child references or reproducible snapshot query"],
        ["Manual adjustment hidden", "Formula reconciles", "Judgement unaccountable", "Explicit adjustment node"],
        ["Approval without prior state", "Reviewer signed", "Correction concealed", "Before and after evidence"],
        ["Audit log substitutes for lineage", "Actions recorded", "Inputs unknown", "Connect values and events"],
        ["Document confidence substitutes for accuracy", "High score", "Material field error", "Field-specific evidence and tests"],
        ["Inference presented as evidence", "Persuasive narrative", "Unsupported cause", "Distinct evidence states"],
        ["Upstream change leaves approval intact", "Current figures", "Stale finding authorised", "Dependency invalidation"],
        ["Editable output without history", "Easy correction", "Published state lost", "Retained publication snapshot"],
        ["Immutability merely asserted", "Strong assurance language", "Unsupported reliance", "Verify storage and retention architecture"],
        ["Unresolved lineage forced into Other", "Full mapping coverage", "Unknown meaning concealed", "Visible unresolved state"],
        ["Reconciled total, incomplete children", "Zero residual", "Offsetting omissions survive", "Population coverage test"],
        ["Attractive untraceable report", "Executive polish", "Finding cannot be challenged", "Material finding inspection"],
        ["Lineage added after analysis", "Documentation complete", "Actual processing history absent", "Capture events during processing"],
        ["Metadata overwhelms reviewer", "Technical completeness", "Evidence path unusable", "Progressive, purpose-specific inspection"],
      ]} />
    </section>

    <section id="execution">
      <h2>The deliverable must carry its evidence architecture</h2>
      <p>For Entimema Financial Intelligence, lineage is a principal methodological differentiation layer: material values retain source context, transformations stay explicit, mappings preserve provenance, calculations retain dependencies, reviewer decisions remain visible, historical states are preserved and findings reconnect to validated evidence. Ambiguity is escalated rather than guessed. This is an architecture to scope and validate, not a claim that every control or integration is already deployed.</p>
      <EntimemaFramework title="From registered evidence to traceable deliverable" steps={[
        "Source registration → Field-level extraction → Transformation history",
        "Canonical mapping → Deterministic validation → Calculation lineage",
        "Confidence and exceptions → Reviewer intervention → Validated model",
        "Finding → Decision → Traceable deliverable",
      ]} />
      <p>Model intelligence may interpret documents and fields, propose semantic mappings, detect ambiguity, suggest evidence relationships, request clarification and interpret financial relationships. Deterministic code owns transformations, arithmetic, aggregation, accounting controls, reconciliation, calculation dependencies, version propagation and fixed lineage rules. Human judgement owns material classification, policy-dependent mapping, authority conflicts, acceptance of limitations, intervention and the final management decision.</p>
      <p>The <Link href="/resources/month-end-reporting-workflow">month-end workflow</Link> governs when these states advance; <Link href="/resources/management-reporting-for-cfo-decisions">management reporting</Link> determines which findings reach the CFO. Neither should detach the executive message from the evidence version that supports it. A delivered report needs stable finding references and an authorised inspection path, with source access governed by confidentiality and retention requirements.</p>
      <p>Returning to the opening EUR 1.8m decline, the useful answer is an inspectable movement calculation, its exact inputs, transformations and review history. If that path is missing, reopen the conclusion instead of defending its formatting. The final analytical number is the visible endpoint of an evidence chain that must remain inspectable.</p>
      <DecisionImplication><strong>Inspect how a reported value travels from source evidence to final finding.</strong> Explore the <Link href="/services/financial-data">Financial Data service</Link> and <Link href="/services/management-reporting">Management Reporting</Link>, or <Link href="/contact">request an Entimema Financial Intelligence demonstration</Link> around one material value and its complete evidence path.</DecisionImplication>
    </section>
  </>;
}
