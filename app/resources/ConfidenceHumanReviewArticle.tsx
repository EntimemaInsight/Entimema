import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

export const confidenceHumanReviewSections = [
  { id: "confidence-accuracy", label: "Confidence is not accuracy" },
  { id: "calibration", label: "Calibration and scope" },
  { id: "decision-architecture", label: "Decision architecture" },
  { id: "materiality-matrix", label: "Materiality × confidence" },
  { id: "ambiguity", label: "Ambiguity and escalation" },
  { id: "review-workflow", label: "Focused human review" },
  { id: "provenance", label: "Overrides and reuse" },
  { id: "worked-example", label: "Seven routed decisions" },
  { id: "failure-modes", label: "False certainty" },
  { id: "monitoring", label: "Monitoring the system" },
  { id: "resolve", label: "Controlled throughput" },
] as const;

export default function ConfidenceHumanReviewArticle() {
  return <>
    <p className={styles.leadParagraph}>A system assigns very high confidence to mapping a loan-related account into non-current liabilities. The label is clear and resembles prior cases. But the source contains no maturity evidence, and a material portion is due within twelve months. The system may be confident in its interpretation of the label while remaining incapable of proving the required financial classification.</p>
    <p>Users often read 97% confidence as a 97% probability that the accounting treatment is correct. That inference can be false. The score may describe extraction certainty, similarity to prior labels or model support within a particular task. It may be uncalibrated, outside its validated population or blind to evidence the accounting decision requires.</p>
    <KeyObservation title="Executive thesis">Confidence informs routing. Evidence and materiality determine whether the result may be trusted. High confidence cannot override missing required evidence or a failed deterministic control; low confidence should trigger proportionate review, escalation or abstention rather than universal manual processing.</KeyObservation>

    <section id="confidence-accuracy">
      <h2>Confidence is a claim about support; accuracy is evidence about performance</h2>
      <p><strong>Confidence</strong> is a system-generated estimate or score expressing support for a prediction, extraction, mapping or interpretation under a particular model and context. It exists when the output is produced. Its meaning depends on the implementation: a similarity score, a class margin and an empirically calibrated probability are not interchangeable.</p>
      <p><strong>Accuracy</strong> is observed correctness against an appropriate validated reference population. It is estimated after outcomes or reviewed labels exist. High confidence can accompany an incorrect result; low confidence can accompany a correct one. The score becomes operationally useful only when its scope, definition and empirical behaviour are known.</p>
      <p>The loan example separates the claims. High lexical support establishes that the account concerns a loan. It does not establish maturity, covenant treatment, currency, effective date or current/non-current presentation. A correct label interpretation can therefore support an incorrect statement classification.</p>
      <DecisionImplication>Never display or route a confidence score without naming what it measures, the unit it applies to and the evidence it does not provide.</DecisionImplication>
    </section>

    <section id="calibration">
      <h2>Calibration is conditional evidence, not a universal warranty</h2>
      <p>If a score is designed to be probability-like and well calibrated, outputs assigned confidence near a given level should, across a sufficiently comparable population, be correct at broadly that rate. The comparison is empirical rather than rhetorical.</p>
      <Formula label="Calibration gap">Calibration gap = |Observed accuracy − Stated confidence|</Formula>
      <p>This interpretation requires sufficient validated outcomes, a comparable task, stable data distribution, a meaningful confidence definition, representative sampling and appropriate segmentation. Small samples widen uncertainty. A global curve can hide overconfidence for one entity, document structure or financial concept and underconfidence for another.</p>
      <p><strong>Overconfidence</strong> means observed correctness trails the stated support; it creates false automation. <strong>Underconfidence</strong> creates unnecessary review despite reliable performance. Calibration drift appears when sources, policies, language, entities or document formats change. Calibration must therefore be task-specific and monitored by relevant segments rather than certified once.</p>
      <h3>The unit of confidence must match the unit of decision</h3>
      <ResourceTable caption="Confidence has multiple scopes" headers={["Scope", "Question answered", "What it cannot establish alone"]} rows={[
        ["Field extraction", "Was this value or label read as represented?", "Accounting meaning, completeness or period"],
        ["Structure", "Are headers, rows and table boundaries interpreted plausibly?", "Correct mapping or reconciliation"],
        ["Semantic mapping", "How strongly does the evidence support this concept?", "That required accounting facts exist"],
        ["Document", "What is the aggregate evidence state of this source?", "Safety of every material field"],
        ["Reconciliation", "How strongly are related values and bridges supported?", "Economic appropriateness of classifications"],
        ["Analytical finding", "How strongly does validated evidence support the conclusion?", "Permission for a material decision"],
        ["Decision readiness", "May this defined downstream use proceed?", "Unrelated uses not assessed"],
      ]} />
      <p>Averages conceal critical exceptions. Ninety-nine per cent of fields may be read correctly while the uncertain one is a material debt balance. Minimum confidence can be too conservative when one immaterial optional field is weak. Record counts ignore value concentration. Unrelated high-confidence fields cannot dilute a failed cash reconciliation.</p>
      <p>A document status should therefore reflect critical-field outcomes, validation controls, unresolved material exceptions, evidence completeness and downstream use. It is a policy conclusion built from granular evidence, not the arithmetic mean of model scores.</p>
    </section>

    <section id="decision-architecture">
      <h2>Confidence belongs inside a broader decision architecture</h2>
      <Formula label="Operational treatment">Treatment = f(Confidence, Evidence, Validation, Materiality, Ambiguity, Decision Impact)</Formula>
      <p>The expression is conceptual, not an invitation to manufacture one decorative score. Each component answers a different question. Model confidence describes support. Source quality and extraction evidence describe provenance. Structural and mapping evidence support meaning. Deterministic controls establish fixed relationships. Cross-document agreement tests consistency. Historical precedent supplies bounded context. Materiality and decision sensitivity determine the cost of residual uncertainty.</p>
      <ResourceFigure label="Exception workflow from output through confidence scope, validation evidence, materiality and ambiguity to automated processing, review, escalation or abstention." caption="Routing combines independent evidence dimensions; confidence never bypasses a critical control.">
        <EntimemaFramework title="Confidence and Exception Layer" description="Interpret uncertainty, test evidence and route only the affected decision path." steps={["Output", "Confidence Scope", "Validation Evidence", "Materiality", "Ambiguity", "Automate / Review / Escalate / Abstain"]} />
      </ResourceFigure>
      <p>Required evidence acts as a gate. No level of model support can replace a missing maturity schedule, unresolved consolidation scope or absent policy definition. Failed arithmetic and accounting controls also override confidence because they provide direct contradictory evidence.</p>
      <p>The permitted transition is <strong>Interpret → Assess evidence → Validate → Evaluate materiality → Process, review, escalate or abstain.</strong> Binary automation—automate or review everything—wastes review capacity on low-risk items while exposing material judgement to simplistic thresholds.</p>
    </section>

    <section id="materiality-matrix">
      <h2>Materiality changes what uncertainty is allowed to do</h2>
      <ResourceTable caption="Materiality × confidence × control routing" headers={["Materiality", "Confidence", "Validation and evidence", "Additional factors", "Treatment"]} rows={[
        ["Low", "High", "Required controls pass", "Reversible, familiar, unconcentrated", "Automated processing with lineage and monitoring"],
        ["High", "High", "Required evidence exists; critical controls pass", "Sensitive downstream use", "Controlled processing with critical-field checks and appropriate approval"],
        ["Any", "High", "Critical control fails or required evidence is absent", "Any ambiguity", "Review or block; confidence cannot override failure"],
        ["Low", "Low", "No critical contradiction", "Reversible, non-essential", "Efficient queue, grouped review, sampling or bounded abstention"],
        ["High", "Low", "Material classification or finding affected", "Costly or asymmetric error", "Mandatory escalation and blocked affected decision"],
        ["Any", "Any", "Source contradiction affects the decision", "Authority unresolved", "Block the affected path pending reconciliation"],
      ]} />
      <p>Low materiality and high confidence may support automation when deterministic controls pass, lineage is retained and monitoring remains active. High materiality and high confidence still requires source sufficiency and critical validation. Confidence reduces routing uncertainty; it does not eliminate control responsibility.</p>
      <p>Low materiality and low confidence calls for economic review design. Similar exceptions may be grouped, sampled or treated provisionally when reversible. If the value is unnecessary, explicit abstention may be better than spending more on review than the decision is worth. High materiality and low confidence requires targeted evidence, mandatory escalation and a blocked affected metric.</p>
      <p>Materiality may be absolute, relative, classification-sensitive, covenant-sensitive, trend-sensitive, liquidity-sensitive, recurring, concentrated or governance-sensitive. A small amount can change a covenant threshold, reverse a trend, alter current/non-current classification or reveal a recurring control weakness. No universal percentage captures those consequences.</p>
      <KeyObservation title="Central decision rule">Automation is permitted only when confidence is appropriate to the task, required evidence exists, validation controls pass and residual uncertainty is acceptable for the decision’s materiality.</KeyObservation>
    </section>

    <section id="ambiguity">
      <h2>Ambiguity must be classified before it can be routed</h2>
      <p>Low technical quality is only one source of uncertainty. A perfectly legible account can remain economically ambiguous. Classification identifies what evidence or authority can resolve the issue.</p>
      <ResourceTable caption="Ambiguity classes and required treatment" headers={["Class", "Example", "Required treatment"]} rows={[
        ["Structural", "Unclear headers, periods or table boundaries", "Resolve structure before semantic processing"],
        ["Lexical", "Abbreviated or non-standard account description", "Use context and scoped validated evidence"],
        ["Accounting", "Competing valid financial classifications", "Apply accounting evidence or expert review"],
        ["Temporal", "Period, maturity or cut-off is unclear", "Request temporal evidence"],
        ["Dimensional", "Entity, cost centre or functional scope is uncertain", "Resolve dimensional context"],
        ["Source conflict", "Credible documents disagree", "Establish authority and reconcile versions"],
        ["Policy-dependent", "Treatment depends on an organisation definition", "Apply governed policy or escalate"],
        ["Evidence absence", "A required fact is unavailable", "Abstain or block"],
      ]} />
      <p>An escalation threshold is therefore a decision policy, not merely a confidence cut-off. It should reflect calibrated task performance, materiality, ambiguity, validation status, reversibility, error and review costs, downstream use, governance requirements and historical exception outcomes.</p>
      <p>Extracting a non-material invoice reference, mapping revenue, classifying debt maturity, calculating a covenant and producing a board-level liquidity conclusion cannot share one threshold. Their evidence requirements and consequences differ even if the same model emits the same numeric score.</p>
      <h3>Some conditions require review regardless of nominal confidence</h3>
      <p>Mandatory review applies when required evidence is missing; material credible sources contradict; a deterministic control fails; current/non-current classification is unresolved; a material non-recurring adjustment or competing accounting treatment exists; consolidation or intercompany scope is ambiguous; an organisation-specific KPI policy governs treatment; a material source structure is unfamiliar; confidence lies outside its calibrated population; or consequences are asymmetric or difficult to reverse.</p>
      <p>The review should answer the smallest material question. It should not repeat the whole workflow manually.</p>
    </section>

    <section id="review-workflow">
      <h2>A reviewer needs an evidence package, not an approve button</h2>
      <EntimemaFramework title="Targeted Reviewer Workflow" steps={["Exception Detected", "Materiality & Impact", "Evidence Presented", "Targeted Question", "Reviewer Decision", "Validation Rerun", "Provenance Retained", "Workflow Resumed"]} />
      <p>The review package contains the source value and location, proposed interpretation, confidence scope, failed or missing controls, materiality, downstream impact, relevant alternatives, prior validated context where appropriate and the exact decision required. An unexplained score beside approve and reject transfers uncertainty without transferring evidence.</p>
      <p>After the decision, deterministic validation reruns. A reviewer can resolve a classification but cannot waive arithmetic consequences silently. Only the affected workflow resumes; unrelated valid work need not wait.</p>
      <h3>Abstention is a controlled outcome</h3>
      <p>Abstention means the system explicitly declines to classify, calculate or conclude because available evidence does not support a sufficiently reliable result for the intended use. It identifies the affected value or decision, states what is unknown, explains why it matters, requests the minimum additional evidence, preserves completed valid work and blocks only the affected path where possible.</p>
      <p>It is not a crash, generic refusal, silent omission, zero substitution or indiscriminate transfer to manual review. <strong>A controlled “not yet” is more valuable than an unsupported answer.</strong></p>
    </section>

    <section id="provenance">
      <h2>An override must preserve the proposal it changes</h2>
      <p>Every material reviewer decision records the original proposal, alternatives, final decision, reviewer identity, decision date, rationale, supporting evidence, entity, period, materiality, downstream consequences, reusability and expiry or revalidation condition.</p>
      <ResourceFigure label="Reviewer decision provenance from system proposal through evidence and reviewer decision to validation rerun and governed precedent." caption="The original proposal remains visible; a correction becomes reusable context only after its scope is governed.">
        <EntimemaFramework title="Decision Provenance" steps={["System Proposal", "Evidence", "Reviewer Decision", "Validation Rerun", "Governed Precedent"]} />
      </ResourceFigure>
      <p>Decision types remain distinct: confirmation, correction, policy selection, temporary exception, source-specific override, entity-specific precedent and global mapping rule. The retained chain is <strong>System proposal → Reviewer decision → Evidence → Resulting transformation.</strong></p>
      <p>Confirmed mappings can reduce repeated review only when the new case matches the precedent’s entity or approved group, account meaning, source structure, policy, period and evidence conditions; no contradiction exists; the rule remains valid; and the approval level is sufficient. A reusable deterministic rule is not the same as a semantic precedent, reviewer hint, temporary mapping or one-time exception.</p>
      <DecisionImplication>Governed memory narrows future review. It must never turn one correction into an uncontrolled global rule.</DecisionImplication>
    </section>

    <section id="worked-example">
      <h2>The same confidence level can justify opposite treatments</h2>
      <p>A fictional group, Alder Manufacturing, submits a trial balance, debt schedule, management P&amp;L and supporting note. Seven items reach the confidence and exception layer.</p>
      <ResourceTable caption="Alder Manufacturing routing decisions" headers={["Item", "Confidence scope", "Materiality", "Validation state", "Ambiguity", "Treatment"]} rows={[
        ["Office supplies", "High semantic", "Low", "Population and subtotal controls pass", "None", "Automate with monitoring"],
        ["Loan balance", "High label", "High", "Maturity evidence absent", "Temporal / evidence absence", "Abstain; request maturity schedule; block liquidity classification"],
        ["‘Mkt adj.’ account", "Low semantic", "Low", "Totals pass", "Lexical", "Grouped review or bounded provisional treatment"],
        ["Inbound logistics", "Low semantic", "High", "Operating profit preserved", "Accounting / dimensional", "Mandatory review; block gross-margin finding"],
        ["Closing cash", "High extraction", "High", "Cash bridge fails by €180k", "Source conflict", "Block; reconcile despite high confidence"],
        ["Warranty provision", "High precedent similarity", "High", "Prior rule belongs to another entity policy", "Policy-dependent", "Do not reuse; obtain Alder policy decision"],
        ["Debt fee treatment", "Low semantic", "High", "Contract note unavailable", "Evidence absence", "Abstain and ask whether fees are embedded in effective interest"],
      ]} />
      <p>Office supplies and the loan both have high confidence, yet their routes differ. The first is low-value, familiar and reconciled. The second is material and lacks the fact required for maturity classification. High support for “loan” is irrelevant to the missing twelve-month evidence.</p>
      <h3>One complete reviewer cycle</h3>
      <p>The system proposes that €2.4m of inbound logistics belongs in distribution expense, with low semantic confidence because cost-centre descriptions contain both factory-receipt and customer-delivery activity. Operating profit reconciles whichever functional line is used, so deterministic totals cannot resolve the gross-margin effect.</p>
      <p>The exception layer identifies a classification-sensitive material issue: moving €1.6m above gross profit changes the reported gross margin by 2.3 percentage points. It presents source rows, cost-centre dimensions, the two alternatives and asks one question: which activities bring inventory to its present location, and which deliver finished goods to customers?</p>
      <p>The controller supplies the approved logistics policy and route analysis. The reviewer assigns €1.6m to cost of sales and €0.8m to distribution, records rationale, entity, period and evidence, then marks the policy reusable for Alder when the same dimensions and policy version apply. Deterministic subtotals and the P&amp;L hierarchy rerun successfully; the gross-margin finding resumes with the corrected basis.</p>
      <p>The override is not global. Another group entity uses outsourced logistics under a different policy and chart design. Its superficially similar label must not inherit Alder’s split automatically. The decision becomes an entity-specific governed precedent and a reviewer hint elsewhere.</p>
      <p>Closing cash illustrates the other direction. Extraction confidence is high because €7.82m is read exactly from the Balance Sheet, but the cash schedule closes at €8.00m. The €180k failed reconciliation blocks the liquidity finding until a late bank transfer and version cut-off are resolved. Confidence did its job; it identified that reading the value again was unlikely to help.</p>
    </section>

    <section id="failure-modes">
      <h2>False certainty survives when routing logic is too simple</h2>
      <ResourceTable caption="Confidence and review failure modes" headers={["Failure", "Why it appears credible", "Decision consequence", "Required control"]} rows={[
        ["Treat confidence as accounting probability", "The score looks precise", "Unsupported classifications appear proven", "Name scope and empirical meaning"],
        ["Use uncalibrated fixed thresholds", "One number simplifies policy", "Overconfident segments automate errors", "Task- and segment-level calibration"],
        ["Average fields into a document pass", "Most fields are easy", "One material exception disappears", "Critical-field and decision-level status"],
        ["Ignore materiality", "Equal scores receive equal treatment", "Review is wasted while material risk escapes", "Materiality-aware routing"],
        ["Override failed reconciliation", "Model support remains high", "Contradictory evidence reaches analysis", "Hard validation gates"],
        ["Review every low score", "It sounds cautious", "Queues grow without reducing material risk", "Grouped, sampled and value-based review"],
        ["Force classification without evidence", "The workflow always returns an answer", "False precision enters statements", "Governed abstention"],
        ["Treat abstention as failure", "Automation rate becomes the objective", "Systems guess to protect a KPI", "Measure controlled throughput and risk"],
        ["Undocumented override", "A human approved it", "The decision cannot be reproduced", "Complete decision provenance"],
        ["Reuse outside valid scope", "A correction resembles a rule", "Entity policy is silently overwritten", "Scoped precedent and expiry"],
        ["Ignore calibration drift", "Past performance looked stable", "New sources receive stale trust", "Ongoing segmented monitoring"],
        ["Weak ‘human in the loop’", "An approval step exists", "Reviewers endorse without evidence", "Targeted evidence packages"],
        ["One threshold for every task", "Governance looks consistent", "Consequences are treated as equal", "Task-specific decision policy"],
      ]} />
    </section>

    <section id="monitoring">
      <h2>Monitor material decision risk, not automation rate alone</h2>
      <p>Monitoring begins with a reviewed sample design and validated outcome labels. Error rates should be measured by task and confidence band, then segmented by source, entity, document type, concept and period. Calibration gaps, material errors and drift reveal whether routing assumptions remain defensible.</p>
      <p>Operational measures include false-automation rate, unnecessary-review rate, abstention rate, override rate, repeated-exception rate, reviewer consistency and review turnaround time. Concentration matters: ten similar overrides may indicate a missing governed rule, while disagreement among reviewers may expose an ambiguous policy rather than a model problem.</p>
      <p>A higher automation rate can mean better evidence and rules, or weakened escalation discipline. The governing objective is <strong>maximum controlled throughput subject to acceptable material decision risk.</strong> Review capacity should move towards material judgement, novel ambiguity and policy change—not every processed item.</p>
    </section>

    <section id="resolve">
      <h2>Human control becomes strongest when review is selective and evidence-led</h2>
      <p>Within Entimema Financial Intelligence, the path is <strong>Intelligent Intake → Document and Data Understanding → Financial Extraction → Period Harmonisation → Canonical Mapping → Deterministic Validation and Reconciliation → Confidence and Exceptions → Human Review → Validated Financial Model → Financial Analysis and Findings → Traceable Export.</strong></p>
      <p>The Confidence and Exception Layer connects <strong>Interpretation → Confidence → Validation Evidence → Materiality → Exception Classification → Automate / Review / Escalate / Abstain → Decision Provenance → Validated Financial Model.</strong> It is a routing architecture, not an accuracy badge.</p>
      <p>Model intelligence interprets structure, semantics and ambiguity. Deterministic code owns arithmetic, fixed rules, control totals and reconciliations. Human review owns material unresolved judgement. The workflow—not an individual agent—is the product boundary.</p>
      <p>The high-confidence loan from the opening is not rejected because the model is untrustworthy. It is held because the model answered a lexical question while the decision requires maturity evidence. Once that evidence arrives, the classification can be reviewed, validated and resumed with complete provenance.</p>
      <p>Selective review begins with evidence produced by <Link href="/resources/financial-data-normalisation">financial data normalisation</Link>, <Link href="/resources/trial-balance-to-financial-statements">controlled trial-balance mapping</Link> and <Link href="/resources/financial-data-validation-control-layer">deterministic financial validation</Link>. The <Link href="/resources/traceable-financial-analysis-workflow">traceable financial analysis workflow</Link> then carries each resolved or unresolved state into the affected findings. Entimema’s <Link href="/services/financial-data">Financial Data service</Link> provides the wider financial-data context.</p>
      <DecisionImplication>Evaluate how uncertainty and material exceptions should be routed between automation and human judgement. <Link href="/contact">Discuss the review architecture with Entimema</Link>.</DecisionImplication>
    </section>
  </>;
}
