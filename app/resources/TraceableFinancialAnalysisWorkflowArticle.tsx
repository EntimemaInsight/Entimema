import Link from "next/link";
import { DecisionImplication, EntimemaFramework, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

export const traceableFinancialAnalysisWorkflowSections = [
  { id: "unsafe-answer", label: "A fluent but unsafe answer" },
  { id: "workflow", label: "End-to-end workflow" },
  { id: "responsibilities", label: "Three responsibilities" },
  { id: "state-lineage", label: "State, lineage and exceptions" },
  { id: "stage-contracts", label: "Stage contracts" },
  { id: "example", label: "Worked example" },
  { id: "readiness", label: "Decision readiness" },
  { id: "failure-modes", label: "Failure modes" },
  { id: "deliverable", label: "Traceable deliverable" },
  { id: "resolve", label: "From evidence to decision" },
] as const;

export default function TraceableFinancialAnalysisWorkflowArticle() {
  return <>
    <p className={styles.leadParagraph}>Three files are uploaded and, minutes later, a system produces a polished liquidity analysis. Its calculations are mathematically correct. But the P&amp;L is monthly, the trial balance is year-to-date, restricted cash is included as available liquidity, and the current portion of a loan remains classified as non-current. The response is fluent. The decision is unsafe.</p>
    <p>Extraction and ratio calculation solve bounded tasks; they do not establish that evidence is comparable, complete or fit for a decision. A controlled financial-analysis workflow must preserve meaning, definition consistency, arithmetic control, exception visibility, judgement, processing state, source lineage and accountability from the first file to the final action.</p>
    <KeyObservation title="Executive thesis">Financial Intelligence is not the generated answer. It is the controlled evidence-to-decision workflow that makes the answer defensible: <strong>Raw financial files → Controlled financial model → Evidence-linked findings → Management decision.</strong></KeyObservation>

    <section id="unsafe-answer">
      <h2>A collection of capable tools can still produce an uncontrolled conclusion</h2>
      <p>A finance team may use document extraction, spreadsheet cleaning, trial-balance mapping, ratio workbooks, reconciliations, dashboards and generative commentary. Every tool can work correctly within its local boundary while the complete process fails. Definitions change between stages, manual corrections happen outside the system, exceptions become footnotes, calculations cannot be reproduced and the final narrative loses its path to source evidence.</p>
      <p>Document state is not financial state. A PDF may be parsed successfully while its period remains ambiguous. A trial balance may balance while its accounts are mapped wrongly. A report may be complete as a document while evidence for a liquidity conclusion is blocked. “Done” in conversation cannot replace an evidenced processing state.</p>
      <ResourceTable caption="Conversational response versus repeatable workflow" headers={["Conversational response", "Repeatable financial workflow"]} rows={[
        ["Generates an answer from current context", "Executes defined stages and evidence-driven transitions"],
        ["May combine interpretation and calculation", "Separates semantic, deterministic and human responsibilities"],
        ["May resolve ambiguity implicitly", "Routes material exceptions and records resolution"],
        ["May not retain per-value lineage", "Preserves source location through every transformation"],
        ["Difficult to reproduce exactly", "Uses governed transformations and calculations"],
        ["Ends with text", "Ends with a traceable deliverable and decision state"],
      ]} />
      <p>Conversation remains useful for intake, clarification and explanation. It is an interface to the workflow, not its control architecture.</p>
    </section>

    <section id="workflow">
      <h2>The workflow advances only when its evidence permits</h2>
      <ResourceFigure label="End-to-end financial intelligence workflow grouped into four conceptual layers." caption="Twelve stages create one controlled path. A failed critical control holds the affected downstream use.">
        <div>
          <EntimemaFramework title="Source Understanding" steps={["Intake", "Interpretation", "Extraction"]} />
          <EntimemaFramework title="Financial Structuring" steps={["Harmonisation", "Mapping"]} />
          <EntimemaFramework title="Control and Review" steps={["Validation", "Exceptions", "Human Review", "Financial Model"]} />
          <EntimemaFramework title="Analysis and Decision" steps={["Analysis", "Findings", "Decision"]} />
        </div>
      </ResourceFigure>
      <h3>Intake → sources registered and structurally profiled</h3>
      <p>Intake identifies files, file types, entity, reporting period, likely statement type, scenario, currency, version, source provenance and apparent dependencies. It establishes execution scope: which entity, reporting basis and intended decisions the run concerns. A missing debt schedule may be irrelevant to a revenue trend but decisive for liquidity. Intake is acquisition infrastructure, not the standalone commercial product.</p>
      <h3>Interpretation → source structure and meaning hypotheses</h3>
      <p>Model intelligence identifies table boundaries, headers, hierarchy, statement type, terminology, likely period structure, local naming and semantic relationships. Crucially, it separates observed evidence from supported inference and unresolved hypothesis. “Column headed July” is observed; “monthly movement” may still be a hypothesis until cumulative behaviour or documentation confirms it.</p>
      <h3>Extraction → source-linked financial values</h3>
      <p>Every value retains its original label, unit, currency, sign representation, period, row and column context, source file, source location and extraction confidence. Successful extraction proves that a value was captured; it does not prove the value’s accounting meaning, period comparability or fitness for downstream analysis.</p>
      <h3>Harmonisation → comparable financial observations</h3>
      <p>Monthly and year-to-date periods, fiscal and calendar definitions, units and thousands, source and reporting currency, actual and forecast scenarios, and stored and presentation signs are aligned through explicit rules. The original value survives beside each transformation, so a reviewer can reproduce the reporting value and reverse the treatment. The <Link href="/resources/financial-data-normalisation">financial data normalisation method</Link> develops this translation layer.</p>
      <h3>Canonical mapping → concepts with mapping evidence</h3>
      <p>Local lines and accounts enter a governed analytical taxonomy through one-to-one, many-to-one, split, conditional and contra mappings. Each mapping carries confidence, rule scope and lineage. A label such as “logistics” may require dimensions or policy evidence before it can be split between cost of sales and distribution. Unknown categories never silently become zero or “Other”. See <Link href="/resources/trial-balance-to-financial-statements">controlled trial-balance mapping</Link> for the account-level method.</p>
      <h3>Validation → values with explicit control results</h3>
      <p>Deterministic controls recalculate subtotals, detect duplicate and omitted accounts, test Assets = Liabilities + Equity, reconcile opening plus movements to closing, test P&amp;L structure, cross-statement and period consistency, verify source-value preservation and identify sign anomalies. The result is not one pass badge but explicit control evidence at the value, statement and model levels. <Link href="/resources/financial-data-validation-control-layer">Deterministic financial validation</Link> explains why fixed relationships belong to reproducible code.</p>
      <h3>Confidence and exceptions → governed routing</h3>
      <p>Confidence scope, validation result, source sufficiency, ambiguity, materiality and downstream impact determine whether an item is automated, review required, blocked or abstained. High semantic support cannot override a failed accounting equation, and a precisely extracted loan label cannot supply missing maturity evidence. The output is a population of explicit treatments, not an averaged document confidence.</p>
      <h3>Human review → a decision with provenance</h3>
      <p>The reviewer receives the affected value, source evidence, proposed interpretation, alternatives, failed or missing controls, materiality, downstream consequence and a targeted question. The review resolves the smallest material uncertainty rather than reproducing the full workflow manually. Its decision records authority, rationale and scope; deterministic controls then rerun. <Link href="/resources/confidence-human-review-ai-finance">Confidence and human review</Link> details this exception architecture.</p>
      <h3>Validated financial model → a decision-capable representation</h3>
      <p>The model coherently represents P&amp;L, Balance Sheet, cash and movement relationships, relevant dimensions, periods, scenarios, canonical concepts, validation status, unresolved limitations and evidence lineage. It remains linked to source observations rather than flattening evidence irreversibly. Analysis can therefore use one controlled definition of revenue, available cash or current debt.</p>
      <h3>Analysis → validated metrics and observations</h3>
      <p>Deterministic code owns arithmetic, ratios, variances, bridges, control totals and defined thresholds. Model intelligence may interpret relationships, compare hypotheses and prioritise what matters. Growth, margins, profitability, liquidity, working capital, leverage, cash conversion, budget variance, trends and concentrations all inherit the readiness and limitations of their inputs.</p>
      <h3>Findings → evidence-linked statements</h3>
      <p>A material finding contains an observation, supporting metric, comparison or threshold, evidence path, interpretation, uncertainty, business implication and required decision or investigation. “Margins weakened” is not enough. A controlled finding identifies which margin, on what definition, across which periods, why it changed, whether classification contributed, and what evidence supports the explanation.</p>
      <h3>Decision → consequence, limitations and ownership</h3>
      <p>The explicit outcomes are proceed, investigate, correct, defer, escalate, request evidence, change plan, monitor or block. The workflow presents the evidence and limitations that make action defensible. It does not obscure who owns the management judgement or pretend that a generated recommendation has decision authority.</p>
    </section>

    <section id="responsibilities">
      <h2>Quality comes from composition, not one method applied everywhere</h2>
      <ResourceTable caption="Three-part responsibility architecture" headers={["Model intelligence", "Deterministic calculations", "Human judgement"]} rows={[
        ["Structural and semantic interpretation", "Arithmetic, signs and period transformations", "Material unresolved classification"],
        ["Mapping proposals and ambiguity detection", "Control totals, equations and reconciliations", "Policy-dependent treatment"],
        ["Targeted clarification", "Ratios, variances, bridges and fixed rules", "Competing valid interpretations"],
        ["Contextual interpretation and prioritisation", "Reproducible calculation evidence", "Non-recurring adjustments and source conflicts"],
        ["Explanation of relationships", "Fixed thresholds where governed", "Approval of exceptions and final decision"],
      ]} />
      <DecisionImplication><strong>Interpretation proposes. Controls test. Human judgement resolves material uncertainty.</strong> Model intelligence used for fixed arithmetic weakens reproducibility; rigid rules used for semantic ambiguity conceal judgement inside code.</DecisionImplication>
    </section>

    <section id="state-lineage">
      <h2>Processing state belongs to the evidence, not the conversation</h2>
      <ResourceTable caption="Governed processing states" headers={["State", "Meaning"]} rows={[
        ["Received", "Source registered but not interpreted"], ["Interpreted", "Structure and likely meaning identified"], ["Extracted", "Values captured with source locations"], ["Harmonised", "Period, sign, unit and currency treatments applied"], ["Mapped", "Values assigned to canonical concepts"], ["Validated", "Required controls passed"], ["Review required", "A targeted material exception remains"], ["Blocked", "Critical evidence or control failure prevents progression"], ["Analysis ready", "Model is sufficiently controlled for intended use"], ["Completed", "Findings and traceable deliverable produced"],
      ]} />
      <p>Transitions require evidence: a mapping decision, control result, reviewer resolution or new source. State is scoped, so a document, value, metric and intended decision may occupy different states at the same time. A conversational response saying “completed” cannot advance a blocked maturity classification.</p>
      <ResourceFigure label="Evidence lineage from management decision back to source location." caption="Lineage survives extraction, harmonisation, mapping, correction, aggregation, calculation and interpretation.">
        <EntimemaFramework title="Evidence Lineage" steps={["Decision", "Finding", "Metric", "Canonical Value", "Transformation", "Source Value", "Source Location"]} />
      </ResourceFigure>
      <p>A Finance Director challenging available liquidity should reach its definition, validated cash and current-debt values, restricted-cash exclusion, maturity split, mapping and harmonisation rules, extracted values and exact source locations. Manual correction adds a provenance event; it does not overwrite the original proposal. Without that chain, a final report is narrative output rather than a fully traceable financial deliverable.</p>
      <p>Exceptions are first-class workflow objects. Each retains the affected value or relationship, current stage, exception class, evidence, materiality, downstream effect, responsible owner, required action, status, resolution and provenance. Warnings, review-required exceptions, blocking failures, disclosed limitations and resolved exceptions remain distinct; they cannot be compressed safely into one generic confidence score.</p>
    </section>

    <section id="stage-contracts">
      <h2>Every stage needs a contract, not merely a sequence position</h2>
      <p>A workflow diagram becomes operational only when each stage has an input contract, transformation responsibility, output contract, control boundary and failure policy. “Extraction completed” is meaningful only if the system can state which sources were in scope, which values were expected, which locations were read, which values were not recovered and which downstream stages are permitted to use the result. The same discipline applies throughout the workflow.</p>
      <p>The intake contract defines the source population and intended use. It prevents an analysis from quietly proceeding on the files that happened to arrive while omitting a schedule required by the decision. The interpretation contract distinguishes evidence from inference and records unresolved structural questions. Its failure policy can hold one table or period without discarding unrelated sources. The extraction contract requires value-level location and context, not a detached matrix of numbers.</p>
      <p>Harmonisation has a particularly important contract because apparently simple transformations can change economic meaning. A monthly value derived from a year-to-date source requires the prior cumulative observation, compatible scope and an explicit subtraction rule. A currency conversion requires source currency, reporting currency, rate, rate date and policy. A sign change requires a declared source convention and target convention. If any required input is absent, the workflow must preserve the original observation and abstain from the derived one.</p>
      <p>Mapping contracts govern both taxonomy and scope. A mapping rule identifies the source concept it recognises, the canonical concept it produces, applicable entity or chart, dimensional conditions, effective dates, transformation, approval and evidence. A reviewer’s decision may create an entity-specific precedent without becoming a global rule. Many-to-one mappings retain every contributing account; split mappings retain allocation evidence; conditional mappings record which condition fired. This prevents a clean canonical model from concealing how it was assembled.</p>
      <p>Validation contracts distinguish required controls from informative diagnostics. A required Balance Sheet equation blocks statement readiness when it fails beyond the governed tolerance. A warning about unusual margin movement may prompt investigation without invalidating the arithmetic model. Control scope also matters: passing a statement total does not prove that every classification is correct, while a failed gross-margin classification need not block a cash-balance conclusion. Controls should therefore identify the object tested, expected relationship, actual result, tolerance, severity, affected downstream uses and remediation owner.</p>
      <p>The exception contract turns uncertainty into operable work. An exception has a class—structural, lexical, accounting, temporal, dimensional, source conflict, policy-dependent or evidence absence—and a treatment. It states what is affected, why the issue matters, which decisions depend on it and what minimum evidence can resolve it. This makes review queues economically selective. Reviewers spend time on material judgement and novel ambiguity rather than rechecking every correctly extracted value.</p>
      <p>The financial-model contract defines which canonical values are current, which transformations produced them, which controls passed, which limitations remain and which intended uses are allowed. Metrics inherit those states. A current ratio cannot become analysis ready if its current-liability input remains under review; a revenue trend may proceed if its own period and scope controls pass. Findings then inherit the evidence, definitions and limitations of their metrics rather than receiving an independent narrative status.</p>
      <ResourceTable caption="Stage contracts and blocking conditions" headers={["Stage", "Required output evidence", "Example blocking condition"]} rows={[
        ["Intake", "Complete source inventory, scope and dependencies", "Debt schedule required for liquidity is absent"],
        ["Interpretation", "Observed structure, supported meanings and open hypotheses", "Period basis cannot be distinguished"],
        ["Extraction", "Value, context, location and extraction state", "Material table region is unreadable"],
        ["Harmonisation", "Original value plus explicit comparable treatment", "Prior cumulative period needed for monthly derivation is missing"],
        ["Mapping", "Canonical concept, rule scope, confidence and lineage", "Material account has competing valid classifications"],
        ["Validation", "Named controls, results, tolerances and affected uses", "Balance Sheet equation or account population fails"],
        ["Review", "Decision, evidence, rationale, authority and scope", "Required policy owner has not resolved treatment"],
        ["Financial model", "Current values, states, limitations and permitted uses", "Critical input remains blocked"],
        ["Finding", "Metric, comparison, interpretation, uncertainty and evidence path", "Finding depends on a non-ready metric"],
        ["Decision", "Action, owner, limitations and supporting findings", "Evidence chain is incomplete for the intended action"],
      ]} />
      <h3>Materiality determines the breadth of the block</h3>
      <p>A controlled workflow does not choose between stopping everything and allowing everything. It blocks the smallest defensible downstream scope. An unresolved logistics split can block gross margin and product profitability while allowing operating-profit and cash analysis if totals reconcile. A missing debt maturity schedule can block liquidity runway and covenant conclusions while leaving high-level revenue analysis available. A source-authority conflict over the closing cash balance blocks every metric that consumes cash, regardless of extraction confidence.</p>
      <p>This selective propagation requires dependency information. Each metric declares its input concepts and required controls; each finding declares its metrics; each decision declares its required findings and evidence standard. When an exception opens or closes, the workflow can recalculate the affected readiness states without relying on a person to remember every consequence. The result is faster controlled throughput, not indiscriminate automation.</p>
      <h3>Manual intervention is a transformation and must be governed as one</h3>
      <p>A spreadsheet correction often appears harmless because the revised total reconciles. Yet without provenance it destroys the evidence chain. A governed override retains the system proposal, reviewer decision, rationale, supporting source, person, time, entity, period, policy version, affected values, downstream recalculation and reuse conditions. The original remains inspectable. The corrected value becomes current only after the required controls rerun.</p>
      <p>Not every intervention should become reusable automation. A one-time source repair, temporary exception, policy choice, source-specific override and general mapping rule have different scopes. Reuse requires evidence that the new case shares the approved entity or group, account meaning, dimensions, policy, structure and effective period. Otherwise the earlier decision is a reviewer hint, not authority.</p>
      <h3>Completion should be measured as controlled decision throughput</h3>
      <p>Automation rate alone rewards systems for avoiding abstention and reducing review, even when uncertainty has merely moved into the final report. A better operating objective is maximum controlled throughput subject to acceptable material decision risk. Useful measures include false-automation rate, unnecessary-review rate, blocked-decision age, repeated-exception rate, override concentration, reviewer consistency, time to first meaningful result and time from evidence arrival to a decision-ready state.</p>
      <p>Repeated exceptions can reveal missing source standards, taxonomy gaps or an ungoverned policy. Reviewer disagreement can reveal that the organisation itself lacks a stable definition. A rising automation rate is valuable only when it comes from stronger evidence, validated rules and governed precedent—not weaker escalation discipline.</p>
    </section>

    <section id="example">
      <h2>Worked example: correct arithmetic, unsafe liquidity</h2>
      <p>Fictional Meridian Components supplies a July management P&amp;L in Excel, a 31 July statutory Balance Sheet in PDF expressed in EUR thousands, a year-to-date trial balance and a debt schedule. P&amp;L expenses are positive; the ledger uses debit/credit orientation. Restricted cash is grouped with cash. A €1.8m facility needs a €0.6m current split. Logistics labels cross management and accounting structures, one trial-balance account duplicates after naïve mapping, and €0.9m of non-recurring income sits in operating profit.</p>
      <ResourceTable caption="Meridian Components evidence-to-decision summary (€m)" headers={["Stage", "Control or observation", "Result"]} rows={[
        ["Intake", "Four sources and dependencies profiled", "P&L monthly; TB YTD; Balance Sheet in €000"],
        ["Interpretation", "Statement structures and hypotheses separated", "July management column confirmed monthly; TB remains cumulative"],
        ["Extraction", "Values captured with cell and page locations", "Source labels, units, signs and confidence retained"],
        ["Harmonisation", "Units, signs and periods normalised", "Original values retained; July movement derived only where supported"],
        ["Mapping", "Logistics split; duplicated account detected", "€2.4m proposed as €1.6m cost of sales / €0.8m distribution"],
        ["Validation", "Balance Sheet and population controls", "Duplicate removed; Assets = Liabilities + Equity at €24.6m"],
        ["Exception", "High-confidence cash mapping fails liquidity control", "€1.2m restricted cash excluded; confidence cannot pass the failure"],
        ["Review", "Debt maturity and non-recurring treatment evidenced", "€0.6m moved current; €0.9m separated from underlying operations"],
        ["Analysis", "Reported versus controlled metrics", "Margin 12.0% reported, 7.5% underlying; liquidity €3.1m, not €4.3m"],
        ["Decision", "Liquidity and operating deterioration combined", "Defer capex; renegotiate maturity; launch logistics review"],
      ]} />
      <p>July revenue is €20.0m and reported operating profit €2.4m, a 12.0% margin. Removing €0.9m of non-recurring income gives €1.5m and a 7.5% underlying margin. The logistics classification does not change total operating profit, but source dimensions support €1.6m as inbound freight within cost of sales and €0.8m as outbound distribution, changing the gross-margin explanation.</p>
      <p>The semantic mapping for cash has high confidence because both the PDF label and trial-balance descriptions are clear. It nevertheless fails a deterministic availability control when the debt schedule’s restricted-cash note is linked. Confidence answered “is this cash?”; it did not answer “is this cash available for the decision?”</p>
      <p>The review package does not ask the controller to approve the complete model. For restricted cash it presents the €4.8m Balance Sheet cash line, its PDF location, the matched ledger accounts, the €1.2m restriction in the debt schedule and the exact liquidity formulas affected. For debt it presents the €1.8m facility, payment dates and proposed €0.6m current portion. For logistics it presents the source accounts, cost-centre dimensions, two classification alternatives and gross-margin impact. Three bounded questions replace an open-ended request to “check the numbers”.</p>
      <p>Balance Sheet cash is €4.8m, of which €1.2m is restricted; undrawn committed facilities are €0.7m and the immediate operating cash requirement is €1.2m. Available liquidity is therefore €4.8m − €1.2m + €0.7m − €1.2m = <strong>€3.1m</strong>, not €4.3m. Current debt rises from €2.2m to €2.8m after the maturity split. The duplicated trial-balance account had overstated a liability subtotal and a working-capital input, but population and Balance Sheet controls caught it.</p>
      <p>The final finding distinguishes presentation effects from economics. Debt reclassification changes timing; restricted cash changes availability; the non-recurring item changes underlying profitability; and inbound logistics evidence shows real operational deterioration. Management defers €1.0m of discretionary capital expenditure, asks treasury to address the next twelve months of maturities and commissions a logistics cost review. Every action links to its supporting evidence.</p>
      <p>The deliverable records that revenue trend analysis is ready, operating-margin analysis is ready with the disclosed non-recurring adjustment, and liquidity is analysis ready only after the restricted-cash and maturity reviews. If the debt schedule had remained unavailable, the correct output would have been source insufficient for liquidity—not an estimated classification hidden inside commentary.</p>
    </section>

    <section id="readiness">
      <h2>Decision readiness is purpose-specific</h2>
      <ResourceTable caption="Decision-readiness framework" headers={["Status", "Meaning", "Permitted use"]} rows={[
        ["Analysis ready", "Critical controls pass and material uncertainty is resolved", "Full intended analysis"], ["Ready with limitations", "Residual uncertainty is bounded and disclosed", "Qualified analysis"], ["Review required", "Material judgement remains", "Pause affected metrics or findings"], ["Blocked", "Critical control or evidence-chain failure", "No affected downstream decision"], ["Source insufficient", "Required information is unavailable", "Request additional evidence"],
      ]} />
      <p>A source set can support revenue trend analysis while remaining insufficient for a covenant or liquidity decision, because the latter requires restricted-cash and maturity evidence. Readiness must therefore declare the intended use, critical controls, material unresolved items and permitted scope.</p>
      <KeyObservation title="Decision-readiness principle">Decision readiness is not a universal property of the file. It is a controlled relationship between evidence and intended use.</KeyObservation>
    </section>

    <section id="failure-modes">
      <h2>Polish can conceal an incomplete control architecture</h2>
      <ResourceTable caption="Implementation failures and controls" headers={["Failure", "Why it looks successful", "Decision consequence", "Required control"]} rows={[
        ["Treat extraction as completion", "Every value was captured", "Wrong meanings reach analysis", "Financial readiness gates"], ["Calculate before periods align", "Formulas run", "Monthly and YTD values are compared", "Explicit period rules"], ["Map without lineage", "Canonical totals look clean", "Corrections cannot be traced", "Per-value mapping evidence"], ["Use model intelligence for arithmetic", "Output is plausible", "Controls are not reproducible", "Deterministic calculations"], ["Use fixed rules for ambiguity", "Automation rate rises", "Valid alternatives are forced", "Exception routing"], ["Hide exceptions in notes", "The report stays tidy", "Material uncertainty is missed", "First-class exceptions"], ["Allow unrecorded corrections", "A reviewer fixed it", "Result cannot be reproduced", "Override provenance and rerun"], ["Average document confidence", "One score is simple", "Material field failure disappears", "Field- and decision-level state"], ["Analyse before reconciliation", "Metrics arrive sooner", "Narrative explains invalid values", "Hard readiness gate"], ["Treat one response as a workflow", "The answer looks complete", "Execution cannot be repeated", "Persistent stages and state"], ["Declare universal readiness", "One status is convenient", "Unsupported decisions proceed", "Purpose-specific readiness"], ["Publish without evidence links", "The report looks authoritative", "Claims cannot be challenged", "Complete lineage"], ["Optimise automation rate", "Throughput appears efficient", "Risk moves downstream", "Controlled decision throughput"],
      ]} />
    </section>

    <section id="deliverable">
      <h2>The deliverable is an inspectable analytical structure</h2>
      <p>A traceable deliverable contains the source inventory, processing status, validated statements, principal transformations, control results, unresolved limitations, exception log, key metrics, findings, evidence links, management implications, decision-readiness status and an exportable analytical structure. The narrative is one view over that structure, not its substitute.</p>
      <p>Within Entimema Financial Intelligence, the commercial product boundary is the workflow: bring financial data; interpret and structure it; extract and harmonise values; map them to a canonical financial structure; validate and reconcile; surface confidence and exceptions; review material judgement; build a validated financial model; analyse; and produce traceable findings. Intelligent Intake enables acquisition. Model intelligence, deterministic code and human judgement retain separate responsibilities.</p>
      <p>The first result should already be meaningful: a profiled source inventory, an initial controlled model, visible exceptions or a bounded analytical finding. Material ambiguity is escalated rather than guessed, and targeted review strengthens the model without turning the entire process back into manual analysis.</p>
    </section>

    <section id="resolve">
      <h2>The reliable answer is the one whose path remains visible</h2>
      <p>The opening liquidity analysis failed despite correct arithmetic because its inputs were not controlled for period, availability or maturity. In a traceable workflow those issues become explicit states and exceptions: the P&amp;L and trial balance cannot be compared without a supported period bridge; restricted cash is excluded; the debt schedule creates a current split; and the affected conclusion remains blocked until controls pass.</p>
      <p><Link href="/resources/financial-data-normalisation">Financial data normalisation</Link> establishes comparable meaning, <Link href="/resources/trial-balance-to-financial-statements">controlled trial-balance mapping</Link> governs canonical classification, <Link href="/resources/financial-data-validation-control-layer">deterministic financial validation</Link> proves fixed relationships and <Link href="/resources/confidence-human-review-ai-finance">confidence and human review</Link> routes material uncertainty. This workflow composes them into one operating architecture whose result can be inspected, challenged and repeated.</p>
      <DecisionImplication><strong>Bring your financial data → receive a meaningful first result.</strong> Explore Entimema’s <Link href="/services/financial-data">Financial Data service</Link> or <Link href="/contact">discuss a Financial Intelligence workflow</Link>.</DecisionImplication>
    </section>
  </>;
}
