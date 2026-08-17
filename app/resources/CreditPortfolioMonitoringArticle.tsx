import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-portfolio-monitoring.module.css";

export const creditPortfolioMonitoringSections = [
  { id: "signal-to-action", label: "Signal to action" },
  { id: "architecture", label: "End-to-end architecture" },
  { id: "temporal-data", label: "Temporal data" },
  { id: "detection", label: "Indicators and detection" },
  { id: "alerts", label: "Signals and alerts" },
  { id: "cases", label: "Consolidation and cases" },
  { id: "priority", label: "Priority and capacity" },
  { id: "workflow", label: "Workflow and action" },
  { id: "feedback", label: "Feedback and outcomes" },
  { id: "control", label: "Versioning and control" },
  { id: "testing", label: "Testing architecture" },
  { id: "system-monitoring", label: "Monitoring the system" },
  { id: "credit-lifecycle", label: "Credit lifecycle" },
  { id: "agent", label: "Engine and future agent" },
  { id: "resolve", label: "Engineering resolve" },
] as const;

const pipeline = [
  ["data", "01", "SOURCE SYSTEMS", "Servicing, payments, collections, customer, financial and external data"],
  ["data", "02", "PORTFOLIO SNAPSHOT", "Point-in-time borrower and exposure state"],
  ["analysis", "03", "INDICATOR ENGINE", "Deterministic, versioned measures"],
  ["analysis", "04", "CHANGE DETECTION", "Level, direction, velocity and persistence"],
  ["signal", "05", "SIGNAL ENGINE", "Explicit warning conditions"],
  ["signal", "06", "ALERT ENGINE", "Structured monitoring events"],
  ["workflow", "07", "DEDUPLICATION / CONSOLIDATION", "One deterioration episode, evidence retained"],
  ["workflow", "08", "PRIORITISATION", "Severity, exposure, impact and urgency"],
  ["workflow", "09", "CASE MANAGEMENT", "Analyst-ready investigation object"],
  ["workflow", "10", "ANALYST ACTION", "Review, intervention and reasons"],
  ["control", "11", "OUTCOME", "Cure, stability, worsening or default"],
  ["control", "12", "FEEDBACK", "Learning and controlled recalibration"],
  ["control", "13", "MONITORING", "Portfolio and system controls"],
] as const;

const goldenCases = [
  ["A — Stable borrower", "No material change", "No alert"], ["B — Weak temporary signal", "One low-severity observation", "Monitor or no case"],
  ["C — Persistent deterioration", "Repeated qualifying change", "Create warning case"], ["D — Confirming signals", "Independent evidence agrees", "High-priority case"],
  ["E — Active case", "Duplicate evidence", "Update, do not duplicate"], ["F — Severe new change", "Material deterioration during review", "Escalate existing case"],
  ["G — Missing critical data", "Unsafe monitoring state", "Controlled data exception"],
];

export default function CreditPortfolioMonitoringArticle() {
  return <div className={styles.articleBody}>
    <section id="signal-to-action">
      <p className={styles.lead}>A lender may have hundreds of useful indicators and still possess a poor monitoring system. If every movement becomes an analyst task, duplication, contradictory warnings, false positives and backlog replace timely intervention.</p>
      <p>The problem is not detecting more changes. It is turning many raw observations into a manageable sequence of risk actions. <strong>A monitoring system creates value only when it can transform changing portfolio data into prioritised, explainable and actionable risk cases.</strong></p>
      <Formula label="The central separation"><span className={styles.formulaLine}>Signal ≠ Alert ≠ Case ≠ Action</span></Formula>
      <div className={styles.fourUp}>{[["Signal", "A measured condition or change."], ["Alert", "A structured event created when signal logic satisfies defined criteria."], ["Case", "A consolidated borrower or exposure investigation object."], ["Action", "The operational response selected for that case."]].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <KeyObservation title="Operational unit"><p>The operational unit of monitoring is not the indicator. It is the controlled case that survives prioritisation, explanation, assignment, action and feedback. Collapsing these layers makes every analytical observation compete directly for scarce analyst attention.</p></KeyObservation>
    </section>

    <section id="architecture">
      <h2>Thirteen layers convert portfolio evidence into controlled action</h2>
      <p>The production chain is <strong>Source Data → Portfolio Snapshot → Indicator Engine → Change Detection → Signal Persistence and Confirmation → Alert Generation → Deduplication → Priority → Case → Workflow → Action → Outcome → Feedback</strong>. Interfaces preserve the distinction between data, analytical transformation, signals, workflow and controls.</p>
      <ResourceFigure label="End-to-end credit portfolio monitoring architecture with thirteen colour-coded data, analytical, signal, workflow and control stages." caption="Evidence moves downward into action; outcomes return through feedback. Every stage emits a durable, versioned contract rather than an untraceable dashboard state.">
        <div className={styles.architecture}>{pipeline.map(([tone, number, title, copy]) => <article className={styles[tone]} key={number}><span>{number}</span><strong>{title}</strong><small>{copy}</small></article>)}</div>
      </ResourceFigure>
      <ResourceTable caption="Production responsibilities by monitoring layer" headers={["Layer", "Responsibility", "Controlled output"]} rows={pipeline.map(([, number, title, copy]) => [`${number} — ${title}`, copy, title === "MONITORING" ? "Metrics and exceptions" : `Versioned ${title.toLowerCase()} record`])} />
    </section>

    <section id="temporal-data">
      <h2>Monitoring begins with point-in-time correct portfolio states</h2>
      <p>Loan servicing, transactions, payments, collections, customer master, financial statements and appropriate external data arrive with different keys and clocks. Account, borrower and facility data must be resolved alongside payment history, days-past-due status, balances, utilisation, behavioural measures and financial ratios. The monitoring date must never see information that was not available then.</p>
      <Formula label="Borrower snapshot"><span className={styles.formulaLine}>Snapshotᵢ,ₜ = known state of borrower i at monitoring time t</span></Formula>
      <p>Immutable or reconstructable daily, weekly or monthly snapshots support trend calculation, investigation, backtesting and decision replay. Cadence is a design choice driven by source latency, signal economics and action speed—not a universal rule.</p>
      <div className={styles.comparison}><article><h3>Batch monitoring</h3><p>Calculates indicators on a schedule. It offers simple governance, a consistent portfolio view and easier reconciliation.</p></article><article><h3>Event-driven monitoring</h3><p>Responds to a missed payment, statement, exposure change or transaction event. It lowers latency but needs event ordering, idempotency and replay control.</p></article></div>
      <p>Many architectures combine both: event processing raises time-sensitive candidates while scheduled runs create the reconciled portfolio state.</p>
      <h3>Freshness and missingness are explicit states</h3>
      <Formula label="Source age"><span className={styles.formulaLine}>Age(Data) = Tmonitoring − Tsource</span></Formula>
      <p>Missing current values, absent historical baselines, delayed systems, partial statements and unknown external observations require declared behaviour at every layer. A pipeline failure must not become a borrower pass or fail through language defaults. Data-quality warnings belong on a separate control channel; deteriorating availability may be operationally meaningful, but it is not automatically credit deterioration.</p>
    </section>

    <section id="detection">
      <h2>The indicator engine makes temporal change reproducible</h2>
      <p>Behavioural, delinquency, financial, migration, vintage and external indicators become engineering assets only when each has a definition, source, calculation rule, observation horizon, missing-value behaviour and implementation version.</p>
      <Formula label="Versioned indicator"><span className={styles.formulaLine}>Iₖ⁽ᵛ⁾</span></Formula>
      <p>A new denominator, horizon, null treatment or threshold can materially change output. Store historical values <strong>Iᵢ,ₜ</strong> in a temporal feature layer so the engine can distinguish current level from change.</p>
      <Formula label="Change and persistence"><span className={styles.formulaLine}>ΔIᵢ,ₜ = Iᵢ,ₜ − Iᵢ,ₜ₋ₖ<br/>Persistenceᵢ,ₜ = Στ=t−m…t 𝟙(Signalᵢ,τ = 1)</span></Formula>
      <div className={styles.metricGrid}>{[["Level", "Current state"], ["Direction", "Improving or deteriorating"], ["Velocity", "Speed of movement"], ["Persistence", "Duration of the pattern"], ["Acceleration", "Change in deterioration speed, where useful"]].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div>
      <p>These need not be mathematically elaborate. They must be explicit, deterministic and reproducible.</p>
    </section>

    <section id="alerts">
      <h2>Signal generation is not alert generation</h2>
      <Formula label="Versioned signal logic"><span className={styles.formulaLine}>Signalᵢ,ₖ,ₜ = g(Iᵢ,ₖ,ₜ, ΔIᵢ,ₖ,ₜ, Persistenceᵢ,ₖ,ₜ, Contextᵢ,ₜ)</span></Formula>
      <p>Critical warning logic belongs in tested, auditable code—not ad hoc spreadsheets. A signal can carry severity derived from magnitude, direction and persistence: weak deviation, meaningful deterioration or urgent event. Severity describes evidence strength; it does not yet determine operational priority.</p>
      <h3>Confirmation trades noise for latency</h3>
      <p>A single signal can remain observational while persistent, severe, cross-source or independently corroborated evidence becomes confirmed deterioration. Confirmation reduces noise, but excessive waiting destroys early-warning value. Each signal family therefore needs an explicit tolerance for evidence and delay.</p>
      <p>Qualifying signals become alerts containing borrower or exposure ID, alert type, trigger, severity, timestamp, relevant values and all applicable versions. <strong>An alert is a structured event, not a red icon.</strong></p>
    </section>

    <section id="cases">
      <h2>Multiple signals may describe one deterioration episode</h2>
      <p>A borrower can simultaneously produce utilisation, payment-ratio, delinquency, liquidity and migration alerts. Five analyst tasks are usually not five risks; they may be five observations of one episode.</p>
      <Formula label="Deduplication and consolidation"><span className={styles.formulaLine}>Alertsraw → Alertsunique<br/>Signal₁ + Signal₂ + … + Signalₖ → Case</span></Formula>
      <p>Deduplication can consider borrower, facility, signal type, time window and episode identity. It must never erase evidence: raw events remain attached to the consolidated case. Controlled cooling periods prevent alert spam, while a material new change updates or escalates the case. Too short a period creates noise; too long hides renewed deterioration.</p>
      <h3>The case is the operational monitoring object</h3>
      <p>An analyst-ready case brings together borrower and exposure, current risk state, active alerts, signal history, PD or grade, migration behaviour, previous cases, reason for review, priority, owner and workflow status. Suppression is acceptable when an active investigation already covers unchanged evidence, but the rule, version and suppressed event remain visible and auditable.</p>
      <DecisionImplication><p>Consolidate the investigation, not the evidence. The case should tell one coherent deterioration story while preserving every contributing observation.</p></DecisionImplication>
    </section>

    <section id="priority">
      <h2>Priority connects analytical evidence to finite capacity</h2>
      <Formula label="Conceptual case priority"><span className={styles.formulaLine}>Priorityᵢ = f(Severityᵢ, Persistenceᵢ, Exposureᵢ, RiskChangeᵢ, Confidenceᵢ, TimeSensitivityᵢ)</span></Formula>
      <p>No universal formula is implied. <strong>Severity asks how strong deterioration is; priority asks how urgently the institution should act.</strong> Priority may also reflect strategic importance, timing and capacity.</p>
      <Formula label="Exposure-aware impact"><span className={styles.formulaLine}>ExpectedImpactᵢ ≈ Exposureᵢ × ChangeInRiskᵢ</span></Formula>
      <p>A moderate warning on a large exposure may outrank a severe warning on a small one. This is portfolio economics rather than dismissal of the smaller borrower. If the system detects 2,000 cases but analysts can investigate 200, ranking is part of the risk architecture.</p>
      <Formula label="Queue dynamics"><span className={styles.formulaLine}>Backlogₜ₊₁ = Backlogₜ + NewCasesₜ − ResolvedCasesₜ</span></Formula>
      <p>When daily cases exceed daily capacity, backlog grows even if every analytical rule is technically accurate. Queues should support new, active, escalated, resolved and suppressed or dismissed cases, ordered as appropriate by priority, SLA, exposure, severity, age and assignment. Calibration must therefore test workload and lead time, not detection alone.</p>
    </section>

    <section id="workflow">
      <h2>The workspace should explain why the borrower is here now</h2>
      <p>A useful workspace presents the trigger, current state, historical trend, material changes, exposure, PD movement, delinquency migration, previous interventions and relevant evidence. Analysts should not recreate monitoring logic manually.</p>
      <div className={styles.explanation}><span>CONTROLLED EXPLANATION</span><strong>Payment behaviour worsened across three periods; utilisation increased materially; two persistent signals confirmed.</strong><small>Not: “High Risk” without evidence.</small></div>
      <h3>Cases move through an explicit state machine</h3>
      <div className={styles.stateFlow}>{["NEW", "ASSIGNED", "UNDER REVIEW", "ACTIONED", "MONITORING", "CLOSED"].map(x=><span key={x}>{x}</span>)}<span className={styles.escalated}>ESCALATED</span></div>
      <p>Escalation can follow increased severity, additional signals, worsening risk, inaction or SLA expiry—conceptually <strong>Warning → High Priority → Critical Review</strong>. Explicit transitions improve ownership, control and reporting without imposing one institution&apos;s labels.</p>
      <p>Possible actions include continued monitoring, customer contact, enhanced or limit review, collections escalation, collateral review, manual assessment and closure. Record the selected action and reason.</p>
      <pre className={styles.schema} aria-label="Conceptual monitoring action record">{`case_id
borrower_id
priority
triggering_signals
analyst_action
action_reason
timestamp`}</pre>
    </section>

    <section id="feedback">
      <h2>Outcome closes the loop—but intervention changes the outcome</h2>
      <div className={styles.feedbackFlow}>{["SIGNAL", "CASE", "ACTION", "OUTCOME", "FEEDBACK"].map(x=><span key={x}>{x}</span>)}</div>
      <p>Capture stabilised, cured, worsened, defaulted, false-alert and unresolved outcomes, together with recurrence and time to action. This makes the monitoring system evaluable rather than merely busy.</p>
      <KeyObservation title="Methodological caution"><p>A warned borrower who does not default after intervention is not necessarily a false positive. The intervention may have changed the trajectory, so observed outcome is partly endogenous to treatment. Compare carefully designed cohorts, action pathways and lead times rather than labelling every non-defaulted warning an error.</p></KeyObservation>
    </section>

    <section id="control">
      <h2>Every historical case must remain reconstructable</h2>
      <p>Retain the original alert, creation time, signals, indicator and priority versions, assignments, actions, overrides, suppression decisions and closure reason. Version effective dates and compatible components as a release manifest.</p>
      <Formula label="Monitoring decision replay"><span className={styles.formulaLine}>MonitoringEngine(Xₜ, V) → Alertsₜ</span></Formula>
      <p>Replay supports backtesting, debugging, regression testing and strategy comparison. A production <strong>champion</strong> can be compared with a <strong>challenger</strong> using historical or isolated shadow data: alerts, consolidated cases, detection, lead time, false positives, workload and eventual outcomes. The challenger must not silently control live treatment.</p>
    </section>

    <section id="testing">
      <h2>Tests must span calculation, time and workflow</h2>
      <div className={styles.testGrid}>{[["Unit", "Indicator calculations"], ["Temporal", "Change and persistence"], ["Boundary", "Exact threshold behaviour"], ["Missing value", "Explicit null paths"], ["Deduplication", "Repeated alert identity"], ["Consolidation", "Correct episode grouping"], ["Priority", "Stable case ordering"], ["Workflow", "Permitted state transitions"], ["Replay", "Historical reproducibility"], ["End to end", "Snapshot → action"]].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div>
      <h3>Golden borrowers are executable monitoring contracts</h3>
      <ResourceTable caption="Controlled portfolio regression suite" headers={["Case", "Evidence", "Expected result"]} rows={goldenCases} />
      <p>Rerun expected outcomes after every monitoring-rule change. Add representative portfolio, combinatorial and property tests so golden cases do not merely memorialise known examples.</p>
    </section>

    <section id="system-monitoring">
      <h2>The monitoring architecture must monitor itself</h2>
      <p><strong>Portfolio monitoring</strong> asks whether borrowers and exposures are deteriorating. <strong>Monitoring-system monitoring</strong> asks whether sources, calculations, warnings and workflows remain healthy. A sudden alert explosion, disappearance of alerts, abnormal distribution, failed source, growing backlog or changing closure pattern is itself a control event.</p>
      <ResourceTable caption="System-level monitoring measures" headers={["Layer", "Measures", "Failure question"]} rows={[
        ["Data", "Completeness, freshness, failed calculations", "Did evidence arrive safely?"], ["Signal", "Count, frequency, persistence", "Did analytical behaviour change?"], ["Alert", "Created, rate, duplicates suppressed", "Is alert logic stable?"], ["Case", "Created, open, backlog, SLA breach", "Can operations absorb output?"], ["Action", "Action, escalation, closure", "Is workflow behaving as designed?"], ["Outcome", "Cure, deterioration, default", "Is warning connected to value?"]]} />
      <h3>Different drift needs different diagnosis</h3>
      <p><strong>Population drift</strong> changes borrower mix; <strong>indicator drift</strong> changes measure distributions; <strong>signal drift</strong> changes warning frequency; and <strong>workflow drift</strong> changes analyst behaviour. They can share symptoms but have different causes, owners and responses.</p>
    </section>

    <section id="credit-lifecycle">
      <h2>Monitoring operationalises research across the credit lifecycle</h2>
      <p><Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators in Credit Risk</Link> asks what constitutes meaningful deterioration; this Engineering architecture asks how to operationalise it continuously and at scale. That distinction is the bridge from Insights evidence to production execution.</p>
      <div className={styles.lifecycle}>{["ORIGINATION DECISION ENGINE", "ACCEPTED EXPOSURE", "PORTFOLIO MONITORING ENGINE", "EARLY-WARNING CASE", "INTERVENTION"].map(x=><span key={x}>{x}</span>)}</div>
      <p><Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link> governs a point-in-time application: <em>Should we accept this borrower now?</em> Monitoring repeats temporal assessment: <em>Has the accepted borrower&apos;s risk changed enough to require action?</em></p>
      <p><Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis and Migration Matrices</Link> supplies transition evidence that can become a portfolio signal, alert and case. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> can trigger segment investigation or underwriting review when cohorts diverge. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> asks whether a model remains stable and effective; portfolio monitoring asks whether borrowers deteriorate. The two may share infrastructure but not purpose.</p>
    </section>

    <section id="agent">
      <h2>A future agent should sit above controlled risk logic</h2>
      <p>A potential <strong>Portfolio Early Warning Agent</strong> could ingest deterministic monitoring outputs, identify new deterioration, consolidate context, rank cases, prepare analyst-ready summaries, surface unresolved high-priority work, compare behaviour with historical baselines and track recurrence and outcomes. This is a future capability, not a claim of a currently available product.</p>
      <div className={styles.comparison}><article><h3>Monitoring engine</h3><p>Deterministically and reproducibly calculates indicators, thresholds, signals, alerts and priorities.</p></article><article><h3>Agent layer</h3><p>Could assist interpretation, summarisation, workflow coordination, investigation support and contextual explanation.</p></article></div>
      <p>The agent must not replace approved risk logic or invent final policy outcomes. It sits above controlled interfaces, cites the evidence it received and leaves consequential actions inside authorised workflows.</p>
      <p>Portfolio conditions change daily, weekly and monthly, making the workflow inherently recurring. Its continuing economic question is: <strong>What changed, what matters, and what requires action now?</strong></p>
    </section>

    <section id="resolve">
      <h2>Observe → Detect → Prioritise → Act</h2>
      <div className={styles.framework}>{[["OBSERVE", "Capture current and historical state"], ["DETECT", "Identify meaningful change"], ["PRIORITISE", "Determine which changes matter most"], ["ACT", "Convert evidence into controlled intervention"]].map(([a,b])=><article key={a}><strong>{a}</strong><span>{b}</span></article>)}</div>
      <p><strong>Feedback</strong> is the learning and control loop around all four layers. The resolve is not a larger dashboard. It is an operational system in which evidence survives transformation into a controlled case, scarce capacity reaches the most consequential work, actions are recorded and outcomes improve the next monitoring cycle.</p>
      <p>The engineering problem creates operational risk when noise delays investigation; that delay affects exposure and intervention economics. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects risk evidence and monitoring design, while <Link href="/services/decision-automation">Decision Automation</Link> connects explicit logic to traceable workflow. Where source consistency is the binding constraint, <Link href="/services/financial-data">Financial Data</Link> provides the relevant data-architecture bridge.</p>
      <DecisionImplication><p>A controlled monitoring architecture does not merely show that risk changed. It determines which change deserves a case, explains why it matters, assigns action and learns from what happened next.</p></DecisionImplication>
    </section>
  </div>;
}
