import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./event-driven-credit-architecture.module.css";

export const eventDrivenCreditArchitectureSections = [
  { id: "failure", label: "The batch question" }, { id: "modes", label: "Processing modes" },
  { id: "ingestion", label: "CDC and ingestion" }, { id: "state", label: "State and features" },
  { id: "triggers", label: "Decision triggers" }, { id: "time", label: "Time and ordering" },
  { id: "backpressure", label: "Backpressure" }, { id: "replay", label: "Safe replay" },
  { id: "reconciliation", label: "Batch reconciliation" }, { id: "migration", label: "Vertical-slice migration" },
  { id: "shadow", label: "Shadow and rollout" }, { id: "latency", label: "Latency economics" },
  { id: "case", label: "Payment suppression case" }, { id: "testing", label: "Golden stream tests" },
  { id: "observability", label: "Observability" }, { id: "architecture", label: "Event-driven architecture" },
  { id: "agent", label: "Infrastructure Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function EventDrivenCreditArchitectureArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>Core and servicing data flow through a nightly extract, warehouse transformation and feature mart before models update collections, limits and early warning. Nothing is inherently wrong with that pipeline. The question is whether its cadence matches the economic half-life of each downstream decision.</p>
    <div className={styles.batchFlow}>{["CORE / SERVICING","NIGHTLY EXTRACT","DWH","FEATURE MART","MODEL SCORE","COLLECTIONS / LIMITS / EWS"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <Formula label="Architecture becomes a risk parameter"><span>PipelineLatency &gt; DecisionLatencyBudget</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>The objective is not to eliminate batch processing.</strong> It is to ensure economically important state changes reach the decisions that depend on them before the value of those decisions decays.</p></KeyObservation>
  </section>

  <section id="modes"><h2>A mature credit platform can use four processing modes</h2>
    <ResourceFigure label="Select processing mode from decision economics, not fashion." caption="Latency requirement, volume, state complexity, cost and failure tolerance determine the least complex reliable mode."><div className={styles.modes}>{[["BATCH","Monthly ECL · close · backfills","low urgency / high completeness"],["MICRO-BATCH","15-minute behavioural refresh","bounded freshness / simpler operations"],["EVENT-DRIVEN","Settled payment suppresses collections","material state change / low latency"],["ON-DEMAND","Bureau retrieval during underwriting","request-scoped current evidence"]].map(([a,b,c])=><article key={a}><b>{a}</b><p>{b}</p><small>{c}</small></article>)}</div></ResourceFigure>
    <Formula label="Decision-driven mode"><span>Mode(W) = f(LatencyRequirement, Volume, StateComplexity, Cost, FailureTolerance)</span></Formula>
    <p>Monthly ECL does not need second-by-second recomputation. A 15-minute micro-batch may capture most value without streaming complexity. Start with payment settled, drawdown, limit changed, DPD changed or bureau received—then map the state and decisions each business event affects.</p>
  </section>

  <section id="ingestion"><h2>Source transport changes; canonical business meaning should not</h2>
    <ResourceTable caption="Three source-change mechanisms" headers={["Mechanism","Strength","Boundary"]} rows={[
      ["API / webhook","Source actively publishes application events","Validate delivery and source semantics"],
      ["CDC","Captures database changes without modifying legacy application","A row change is not automatically a business event"],
      ["Scheduled file","Works where sources remain batch-only","Rows can still become canonical events downstream"],
    ]} />
    <div className={styles.cdc}><span>CDC CHANGE<br/><small>loan_account.balance 500 → 250</small></span><b>→</b><span>SOURCE ADAPTER</span><b>→</b><span>SEMANTIC MAPPING</span><b>→</b><strong>CANONICAL EVENT</strong></div>
    <p>The database delta does not explain payment, correction, write-off or migration. Preserve raw source lineage for audit and reprocessing, but serve downstream consumers canonical semantics such as <code>PAYMENT_SETTLED</code>, <code>FACILITY_LIMIT_CHANGED</code> and <code>ACCOUNT_STATE_CHANGED</code>.</p>
    <p>Ingestion validates structure, assigns canonical metadata, enforces idempotency and routes invalid events. Source contracts declare identity, semantics, latency, ordering and correction behaviour. <code>schemaVersion</code> and compatibility/upcasting protect consumers as events evolve.</p>
  </section>

  <section id="state"><h2>Canonical events produce rebuildable state and targeted feature updates</h2>
    <Formula label="Deterministic state projection"><span>S<sub>t+1</sub> = R(S<sub>t</sub>, E<sub>t+1</sub>)</span></Formula>
    <div className={styles.dependency}>{["EVENT","ACCOUNT / FACILITY STATE","AFFECTED FEATURES","MODEL","DECISION"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div>
    <p>Query-optimised projections such as <code>account_state</code>, <code>facility_state</code> and <code>customer_credit_state</code> are derived and rebuildable. A settled payment can update payment state, DPD, <code>payment_ratio_90d</code> and a behavioural score without recomputing unrelated income or bureau features.</p>
    <KeyObservation title="Real-time restraint"><p><strong>A real-time decision only requires the inputs that materially change that decision to be sufficiently fresh.</strong> A valid vector can combine two-second utilisation, five-second payment state, two-hour behavioural PD and 30-day income.</p></KeyObservation>
    <p>Each projection carries <code>effective_as_of</code>, <code>available_as_of</code> and <code>updated_at</code>. The decision freshness guard verifies critical input age against versioned policy budgets.</p>
  </section>

  <section id="triggers"><h2>State changes trigger decisions only when policy says they should</h2>
    <ResourceTable caption="Trigger semantics" headers={["Trigger","Example","Control"]} rows={[
      ["Event trigger","Payment settlement updates collections suppression","Idempotent trigger identity"],
      ["State trigger","Utilisation crosses 79% → 81%","Versioned threshold and prior state"],
      ["Debounced trigger","Many card events coalesce into one score","Short governed window"],
      ["No trigger","Feature changes without material decision effect","Update state only"],
    ]} />
    <p>Repeated updates must not create repeated actions. Stable decision and action IDs protect exactly-once business effect even when delivery is at-least-once. Coalescing is micro-batching inside an event-driven path; it prevents event storms from turning into noisy rescoring and operational overload.</p>
  </section>

  <section id="time"><h2>Streaming reduces latency; it does not eliminate temporal complexity</h2>
    <p>Preserve event, effective and processing time. Partition by a stable aggregate such as facility or account when same-aggregate ordering matters; global institutional ordering is usually unnecessary.</p>
    <ResourceTable caption="Out-of-order controls" headers={["Concept","Meaning","Caveat"]} rows={[
      ["Sequence / causal reference","Detect gaps and dependencies","Source quality and aggregate scope matter"],
      ["Watermark","Confidence that earlier event time is sufficiently complete","Not financial finality"],
      ["Allowed lateness","Wait for bounded late data in a window","Decisions cannot wait indefinitely"],
      ["Provisional state","Act before completeness where permitted","Must later reconcile to confirmed state"],
    ]} />
    <p>Late events, reversals and corrections still require restatement and replay. Duplicate delivery is normal: unique event identity, idempotent consumers and transactional state mutation protect the business effect.</p>
  </section>

  <section id="backpressure"><h2>Consumer lag is decision staleness, not merely infrastructure health</h2>
    <Formula label="Backpressure condition"><span>ArrivalRate &gt; ProcessingRate</span></Formula>
    <Formula label="Queue lag"><span>QueueLag = CurrentTime − OldestUnprocessedEventTime</span></Formula>
    <p>If a payment consumer falls behind, collections state goes stale. Monitor lag by stream, consumer and event type. Scale, prioritise material events, degrade non-critical work or coalesce safely—but never drop financial events silently.</p>
    <div className={styles.failureState}><span>CONSUMER STOPS<br/><b>11:00</b></span><i>events queue</i><span>LAG BREACH<br/><b>11:30</b></span><i>freshness guard</i><strong>STOP / FALLBACK / REFER</strong></div>
    <p>The worst failure is silent: an API remains healthy while serving yesterday&apos;s state as current. Staleness must be visible to decision policy.</p>
  </section>

  <section id="replay"><h2>Replay rebuilds state without replaying external consequences</h2>
    <div className={styles.sideEffects}><span>CANONICAL EVENTS</span><b>→</b><span>STATE + FEATURES</span><b>→</b><span>DECISIONS</span><b>→</b><strong>ACTION EXECUTOR</strong></div>
    <p>Consumers distinguish <code>LIVE</code> from <code>REPLAY</code>. Replay rebuilds projections and features but must not resend emails, repeat collections actions or issue external commands. Action executors use stable IDs so a repeated decision event cannot duplicate its effect.</p>
    {code(`type ProcessingContext = "LIVE" | "REPLAY";

if (context === "LIVE") {
  await actionExecutor.executeOnce(actionId, command);
}`)}
    <p>Durable canonical history makes state rebuild, feature rebuild and incident recovery possible. Event loss is worse than delay; source-to-canonical count and financial-total reconciliation must expose missing records.</p>
  </section>

  <section id="reconciliation"><h2>Fast operational state and slower authoritative reconciliation complement each other</h2>
    <ResourceFigure label="Event-driven operation with batch control." caption="Streaming serves timely decisions. Batch verifies completeness, authoritative totals and recovery without becoming a competing ungoverned state."><div className={styles.dual}><article><b>FAST EVENT-DRIVEN STATE</b><p>Operational projections · features · triggers</p></article><i>+</i><article><b>AUTHORITATIVE BATCH CONTROL</b><p>Full-state reconciliation · portfolio completeness · recovery</p></article></div></ResourceFigure>
    <Formula label="One semantic core"><span>Reducer<sub>batch</sub> = Reducer<sub>stream</sub></span></Formula>
    <p>Compare derived state with system-of-record state and classify timing, missing event, duplicate, correction or mapping differences. Avoid separate batch and speed codebases with divergent business logic. One path is the operational projection; the other is its reference/control—not a second truth.</p>
  </section>

  <section id="migration"><h2>Migrate the vertical slice with the largest material latency gap</h2>
    <Formula label="Migration priority"><span>LatencyGap = ActualLatency − RequiredLatency</span></Formula>
    <ResourceFigure label="Payment-to-collections vertical slice." caption="The payment, DPD and suppression path moves end-to-end. Finance, ECL and historical warehousing remain deliberately batch."><div className={styles.migration}><div><b>BEFORE · BATCH</b><span>Payment file</span><i>→</i><span>Nightly DWH</span><i>→</i><span>DPD</span><i>→</i><span>Collections</span></div><div><b>AFTER · EVENT</b><span>PAYMENT_SETTLED</span><i>→</i><span>State / DPD</span><i>→</i><span>Suppression</span><em>Finance + ECL remain batch</em></div></div></ResourceFigure>
    <p>A 24-hour process can first become a 15-minute micro-batch. A legacy core can use Core DB → CDC → Adapter → Canonical Event. A daily file can be parsed into canonical events today, allowing later API or CDC transport without changing downstream semantics.</p>
  </section>

  <section id="shadow"><h2>Shadow, align cut-offs, canary and preserve rollback</h2>
    <div className={styles.shadow}><span>EXISTING BATCH PATH</span><b>↘</b><strong>ALIGNED CUT-OFF<br/>STATE / FEATURE / DECISION DIFF</strong><b>↗</b><span>NEW EVENT PATH</span></div>
    <p>Do not compare 14:00 real-time state with end-of-day batch state. Align effective cut-offs, store mismatch reasons and track latency improvement. Run new decisions without executing them, then canary a controlled population with rollback.</p>
    <p>Rollback must preserve event history. Before reactivation, replay events accumulated while the old path ran. Irreversible cutovers turn a recoverable consumer defect into data loss.</p>
  </section>

  <section id="latency"><h2>Measure the complete event-to-action path and its tail</h2>
    <Formula label="Latency decomposition"><span>L<sub>total</sub> = L<sub>capture</sub> + L<sub>ingestion</sub> + L<sub>state</sub> + L<sub>feature</sub> + L<sub>decision</sub> + L<sub>action</sub></span></Formula>
    <p>Measure p50, p95 and p99; an average hides operationally damaging tails. Feature update lag is feature availability minus source-event time, decision trigger lag is decision time minus material-event time, and action lag completes the business path.</p>
    <Formula label="Latency investment"><span>ROI<sub>latency</sub> = (LossAvoided + OperationalSavings + DecisionImprovement) / IncrementalPlatformCost</span></Formula>
    <p>Streaming introduces stateful operations, cost and observability burden. Formal reporting can remain periodic while risk signals update quickly. Use low latency only where its decision value justifies that burden.</p>
  </section>

  <section id="case"><h2>A settled payment should stop a same-day collections action</h2>
    <ResourceTable caption="Fictional lender: one vertical slice" headers={["Stage","Before","After"]} rows={[
      ["Source","PSP daily file","PSP webhook"], ["Payment","Settled at 09:10; visible next batch","Canonical PAYMENT_SETTLED near-immediately"],
      ["State","DWH refresh overnight","Account state and DPD projection update"], ["Action","Customer contacted at 15:00","Collections suppression trigger before contact"],
      ["Finance / ECL","Batch posting and controlled snapshot","Unchanged batch processing"], ["Control","Manual exception review","End-of-day authoritative reconciliation"],
    ]} />
    <p>The new slice reduces action latency without weakening accounting control or forcing monthly ECL into streaming.</p>
  </section>

  <section id="testing"><h2>A golden event stream tests state, triggers and side effects together</h2>
    <ResourceTable caption="Event-driven credit architecture tests" headers={["Test","Expected proof"]} rows={[
      ["Golden stream","Payment, drawdown, limit, reversal, late and duplicate events produce fixed state/features/triggers"],
      ["Batch/stream equivalence","Same canonical events and cut-off yield identical final state"],
      ["Latency regression","Controlled event reaches state/decision within the test budget"],
      ["Backpressure","Artificial slowdown produces lag alert, no loss, stale guard and recoverable replay"],
      ["Replay safety","State and features rebuild; external actions do not execute"],
      ["Shadow consistency","Aligned batch/event outputs match or carry explained differences"],
      ["Idempotency","Duplicate event and trigger create one business effect"],
      ["Schema compatibility","Old consumers tolerate compatible event evolution"],
    ]} />
  </section>

  <section id="observability"><h2>Operate the pipeline through decision-centric evidence</h2>
    <div className={styles.metrics}>{["SourceToCanonicalLag","ConsumerLag","StateUpdateLag","FeatureUpdateLag","DecisionLag","ActionLag","ReplayFailureRate","BatchStreamMismatchRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Monitor event counts, payment amounts, drawdown volumes, reversal rates and DPD transitions. A technically healthy pipeline can still carry wrong economics after a silent semantic change.</p>
    <ResourceTable caption="Decision-centric incident classification" headers={["Incident","Broken link"]} rows={[
      ["Source","Event not emitted"], ["Ingestion","Event delayed, rejected or lost"], ["State","Projection incorrect"],
      ["Feature","Dependent value stale"], ["Trigger","Decision not fired or duplicated"], ["Action","Decision not executed or repeated"],
    ]} />
  </section>

  <section id="architecture"><h2>The Entimema architecture connects source change to controlled action</h2>
    <ResourceFigure label="Entimema event-driven credit risk architecture." caption="Transport-specific changes become canonical events before deterministic projections, features and decisions; isolated actions and periodic reconciliation keep replay safe and state controlled."><div className={styles.architecture}>{["SYSTEMS OF RECORD · CORE / PAYMENTS / CRM / COLLECTIONS","API / WEBHOOK / CDC / FILES","SOURCE ADAPTERS","CANONICAL FINANCIAL EVENTS","VALIDATION / IDEMPOTENCY / ORDERING","STATE PROJECTIONS","FEATURE LAYER","DECISION TRIGGERS","DECISION ENGINE","ACTION EXECUTORS","OUTCOME EVENTS","AUTHORITATIVE RECONCILIATION / REPLAY"].map((x,i)=><span key={x}>{x}{i<11?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Diagnose → Partition → Migrate → Operate → Reconcile" steps={["Identify decision", "Define latency budget", "Map critical events", "Select processing mode", "Canonicalise events", "Build state projection", "Update dependent features", "Trigger decision", "Isolate actions", "Reconcile, replay and monitor"]} />
  </section>

  <section id="agent"><h2>An Event-Driven Risk Infrastructure Agent can diagnose flow without changing production</h2>
    <p>A controlled agent can monitor ingestion and consumer lag, compare source and canonical counts, identify backpressure and stale decision paths, compare batch with stream projections, trace material events to actions and surface latency-budget breaches by business impact.</p>
    <KeyObservation title="Bounded role"><p><strong>Event-flow observability + latency diagnostics + state consistency + decision-impact support.</strong> It prepares migration and reconciliation evidence for engineers; it must not autonomously alter production routing or financial records.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Canonicalise source changes, preserve lineage and reconcile state.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Connect material state changes to governed decisions and actions.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern feature freshness, behavioural state and decision latency.</Link></p></article></div>
    <p>Continue with <Link href="/resources/point-in-time-correct-features-credit-models">Point-in-Time Correct Features</Link>, <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store</Link>, <Link href="/resources/point-in-time-customer-state-reconstruction">Point-in-Time Customer State Reconstruction</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Payment and Credit Event Processing</Link>, <Link href="/resources/why-batch-risk-is-becoming-a-business-risk">Why Batch Risk Is Becoming a Business Risk</Link> and <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>. Canonical event modelling, streaming early-warning features and backpressure recovery remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>For each material event, identify the decision it must reach, the latency value requires and the least complex architecture that can achieve it reliably.</strong></p></KeyObservation>
  </section>
</div>; }
