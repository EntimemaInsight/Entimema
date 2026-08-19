import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./streaming-behavioural-features.module.css";

export const streamingBehaviouralFeaturesSections = [
  { id: "failure", label: "The lost intervention window" }, { id: "state", label: "Stateful features" },
  { id: "windows", label: "Rolling windows" }, { id: "time", label: "Event time and correction" },
  { id: "behaviour", label: "Velocity and deterioration" }, { id: "stability", label: "Signal stabilisation" },
  { id: "triggers", label: "Rescore and trigger policy" }, { id: "health", label: "Freshness and source health" },
  { id: "controls", label: "Recompute controls" }, { id: "latency", label: "Lead-time economics" },
  { id: "case", label: "Behavioural case" }, { id: "timers", label: "Time-driven state" },
  { id: "testing", label: "Golden stream tests" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Streaming architecture" }, { id: "agent", label: "Signal Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function StreamingBehaviouralFeaturesArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A borrower&apos;s utilisation moves from 35% to 92% in one day while payment behaviour deteriorates. The behavioural score refreshes overnight and sees the change at 08:00—after more exposure may have been drawn and the intervention window narrowed.</p>
    <div className={styles.failure}><span><b>09:00</b>UTILISATION 35%</span><i>→</i><span><b>17:00</b>UTILISATION 92%<br/>PAYMENT DETERIORATES</span><i>nightly batch</i><strong><b>NEXT DAY 08:00</b>SIGNAL APPEARS</strong></div>
    <Formula label="Operational early-warning lead time"><span>LeadTime<sub>usable</sub> = LeadTime<sub>model</sub> − FeatureLatency − DecisionLatency − ActionLatency</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Behavioural early warning creates value when features evolve quickly enough to preserve intervention time, but not so noisily that every transaction becomes a false alarm.</strong></p></KeyObservation>
  </section>

  <section id="state"><h2>Update affected feature state instead of replaying all history</h2>
    <Formula label="Stateful feature principle"><span>Feature<sub>t+1</sub> = Update(Feature<sub>t</sub>, Event<sub>t+1</sub>)</span></Formula>
    {code(`type BehaviouralFeatureState = {
  partyId: string;
  utilisationCurrent?: number;
  utilisation30dAvg?: number;
  paymentCount30d: number;
  latePaymentCount90d: number;
  maxDpd90d: number;
  effectiveAsOf: Date;
  updatedAt: Date;
  featureSetVersion: string;
};`)}
    <ResourceTable caption="Base and derived streaming features" headers={["Type","Examples","Required state"]} rows={[
      ["Base","Current utilisation, current DPD, recent payment amount","Latest canonical facility/account state"],
      ["Derived","30-day average utilisation, payment trend, DPD velocity","Window history, baseline and expiry semantics"],
    ]} />
    <p>Drawdown, repayment, limit change and reversal update canonical facility state first. Utilisation then uses a point-in-time-consistent numerator and denominator; consuming raw vendor events independently can combine fresh drawn with a stale limit.</p>
  </section>

  <section id="windows"><h2>A rolling window must add new evidence and expire old evidence</h2>
    <ResourceFigure label="Incremental rolling-window mechanics." caption="Window state retains enough ordered evidence to add arrivals, remove expired contributions and rebuild the same feature from canonical history."><div className={styles.window}><span>OLD EVENTS<br/><small>expire beyond T−30d</small></span><i>→</i><strong>ACTIVE WINDOW<br/>(T−30d, T]</strong><i>←</i><span>NEW EVENTS<br/><small>enter by event time</small></span></div></ResourceFigure>
    {code(`type TimedValue = { time: Date; value: number };
type RollingWindowState = { events: TimedValue[]; sum: number };

function updateRollingSum(
  state: RollingWindowState,
  event: TimedValue,
  cutoff: Date
): RollingWindowState {
  const events = [...state.events, event]
    .filter((x) => x.time > cutoff);
  return { events, sum: events.reduce((s, x) => s + x.value, 0) };
}`)}
    <p>The example favours clarity over performance. High-volume paths use deques, ordered state or time buckets. Hourly counts and daily averages reduce state, but bucket granularity must preserve the decision semantics; a daily bucket can erase an intraday deterioration path.</p>
  </section>

  <section id="time"><h2>Event-time windows must converge under late and out-of-order arrival</h2>
    <p>A payment effective Monday but received Wednesday belongs economically to Monday if the feature contract uses effective time. Processing it as Wednesday distorts the trend.</p>
    <Formula label="Historical feature modes"><span>Feature<sup>known</sup>(T) ≠ Feature<sup>restated</sup>(T)</span></Formula>
    <p>The live current feature may correct when the late payment arrives; the historical decision snapshot remains immutable. Insert the late event into window state, recompute affected aggregates and preserve revision lineage.</p>
    <ResourceTable caption="Order behaviour by feature type" headers={["Feature class","Examples","State requirement"]} rows={[
      ["Commutative fixed-set","Sum, count, maximum","Converges for same eligible event set"],
      ["Sequence-sensitive","Missed-payment streak, time since last payment","Ordered events and explicit tie semantics"],
      ["Non-monotonic rolling","Max DPD in last 90 days","Retain candidates when current maximum expires"],
    ]} />
  </section>

  <section id="behaviour"><h2>Level, velocity and deterioration describe different borrower paths</h2>
    <Formula label="Current utilisation"><span>Utilisation<sub>t</sub> = Drawn<sub>t</sub> / Limit<sub>t</sub></span></Formula>
    <Formula label="Utilisation velocity"><span>Velocity<sub>util</sub> = (Utilisation<sub>t</sub> − Utilisation<sub>t−k</sub>) / k</span></Formula>
    <Formula label="Payment deterioration"><span>ΔPaymentRatio = PaymentRatio<sub>recent 30d</sub> − PaymentRatio<sub>previous 30d</sub></span></Formula>
    <p>A move from 20% to 60% can convey different information from a stable 65%; the path matters alongside level. Velocity can apply to exposure, DPD, payment ratio or behavioural PD. Acceleration is possible, but added sophistication must prove operational value.</p>
    <p>Payment ratio itself needs versioned applied-payment, scheduled-amount, allocation and reversal semantics. These are engineering inputs, not merely arithmetic.</p>
  </section>

  <section id="stability"><h2>Persistence, hysteresis, debounce and cooldown solve different noise problems</h2>
    <ResourceFigure label="Signal stabilisation state machine." caption="A breach becomes WATCH before ALERT; a lower clearance boundary and post-action cooldown prevent oscillation and workflow spam."><div className={styles.machine}>{["NORMAL","FEATURE BREACH","PERSISTENCE","WATCH","CONFIRMED BREACH","ALERT","COOLDOWN / CLEAR","NORMAL"].map((x,i)=><span key={`${x}-${i}`}>{x}{i<7?<b>→</b>:null}</span>)}</div></ResourceFigure>
    {code(`type SignalState = {
  consecutiveBreaches: number;
  firstBreachAt?: Date;
  lastBreachAt?: Date;
};`)}
    <Formula label="Hysteresis"><span>Trigger when X &gt; c<sub>high</sub>; clear when X &lt; c<sub>low</sub>, where c<sub>low</sub> &lt; c<sub>high</sub></span></Formula>
    <ResourceTable caption="Stabilisation controls" headers={["Control","When it acts","Purpose"]} rows={[
      ["Persistence","After repeated/durable breach","Reject transient deterioration"], ["Hysteresis","Across trigger and clear state","Prevent boundary oscillation"],
      ["Debounce","Before scoring","Coalesce rapid events while state settles"], ["Cooldown","After decision/action","Suppress repeated workflow without material new state"],
    ]} />
  </section>

  <section id="triggers"><h2>Feature updates do not imply continuous model rescoring</h2>
    <p>Rescore on material DPD transition, utilisation change, payment failure or a governed schedule. A streaming feature can also fire a direct rule without model execution. Hybrid event and periodic triggers are often safer.</p>
    {code(`type BehaviouralScoreState = {
  partyId: string;
  score: number;
  pd?: number;
  scoredAt: Date;
  featureSnapshotId: string;
  modelVersion: string;
  triggerType: string;
};`)}
    <p>Record triggering event/state, feature versions, model version, score and rule path. Require a governed material score change such as |ΔPD| &gt; ε plus persistence before operational routing; no universal ε applies.</p>
    <Formula label="Multi-signal layer"><span>EWSScore = g(UtilisationTrend, PaymentTrend, DPD, PDChange)</span></Formula>
    <p>Rules above the model encode data quality, persistence, cooldown and operational materiality. They must remain separate from the model’s risk estimate.</p>
  </section>

  <section id="health"><h2>A missing source is not negative borrower behaviour</h2>
    {code(`type FeatureHealth = {
  status: "FRESH" | "STALE" | "MISSING" | "ERROR";
  asOf: Date;
};`)}
    <Formula label="Signal confidence inputs"><span>SignalConfidence = f(FeatureFreshness, SourceHealth, StateCompleteness)</span></Formula>
    <p>True silence—an expected salary or payment did not arrive—is different from a failed source feed. Do not trigger missed-payment risk when payment data are unavailable. A low-confidence risk signal can route differently from a high-confidence one according to policy.</p>
    <p>Mixed-cadence vectors must expose exact freshness. If a critical feature breaches its age budget, use an approved fallback, defer or refer; never silently replace missing with zero.</p>
  </section>

  <section id="controls"><h2>Periodic full replay controls persistent incremental error</h2>
    <Formula label="Streaming feature invariant"><span>Feature<sup>incremental</sup><sub>T</sub> = Feature<sup>full replay</sup><sub>T</sub></span></Formula>
    <p>Incremental corruption persists until detected. Recompute sampled populations from canonical history and compare live state to catch missed expiry, duplicate events and reducer bugs. Keep a periodic full rescore as safety for missed events, stale state and non-event features.</p>
    <div className={styles.control}><span>EVENT-DRIVEN UPDATE<br/><small>material changes</small></span><i>+</i><span>SCHEDULED RECOMPUTE<br/><small>completeness control</small></span><i>→</i><strong>CONSISTENT EWS STATE</strong></div>
  </section>

  <section id="latency"><h2>Measure event-to-intervention latency, not feature speed alone</h2>
    <Formula label="End-to-end EWS latency"><span>L<sub>EWS</sub> = L<sub>event</sub> + L<sub>feature</sub> + L<sub>score</sub> + L<sub>trigger</sub> + L<sub>workflow</sub></span></Formula>
    <p>A 20-hour feature-latency improvement creates little value if operations still review once daily. Signals have different half-lives: payment failure may justify faster reaction than a long-term utilisation trend.</p>
    <Formula label="Selective streaming"><span>Prioritise when LatencyReduction → MaterialDecisionValue</span></Formula>
    <p>Early-warning quality combines predictive value with operational usability. Monitor subsequent deterioration, action utility and false-positive burden—not sensitivity alone.</p>
  </section>

  <section id="case"><h2>A two-day deterioration should become WATCH before it becomes noise</h2>
    <ResourceTable caption="Fictional revolving borrower: incremental behavioural state" headers={["Checkpoint","Utilisation","Payment state","Signal state"]} rows={[
      ["Start","38%","Ratio 1.0; DPD 0","NORMAL"], ["First drawdown","72%","Unchanged","WATCH candidate; persistence starts"],
      ["Second drawdown","91%","Unchanged","WATCH confirmed by velocity"], ["Scheduled payment missed","91%","Ratio deteriorates; DPD moves","ALERT / controlled review"],
      ["Partial payment","Lower drawn","Partial cure evidence","Remain governed by persistence/hysteresis"], ["Behavioural rescore","Updated vector","Worse score","Route to review, not automatic adverse action"],
    ]} />
    <p>A nightly path sees the combined change next morning. Streaming preserves more lead time. By contrast, one isolated utilisation spike followed by immediate repayment does not survive persistence and hysteresis, so it should not create an alert.</p>
  </section>

  <section id="timers"><h2>Event-driven does not mean event-only</h2>
    <KeyObservation title="Time is an input"><p><strong>Some behavioural state changes because an event occurred. Other behavioural state changes because time passed without one.</strong></p></KeyObservation>
    <p>Window contributions expire even when no new transaction arrives. <code>TimeSinceLastPayment</code> changes continuously. Use timers, on-read computation or periodic refresh according to latency needs.</p>
    <p>Absence can be a signal only when an expected-event definition exists and source health is good. A timer must never confuse pipeline silence with customer silence.</p>
  </section>

  <section id="testing"><h2>A golden behavioural stream proves state at every checkpoint</h2>
    <ResourceTable caption="Streaming behavioural feature tests" headers={["Test","Expected proof"]} rows={[
      ["Golden stream","Utilisation, payment, missed due, partial payment, reversal and late payment produce fixed features and trigger states"],
      ["Incremental equality","Incremental features equal full replay at every checkpoint"], ["Out-of-order","Late insertion converges to ordered-stream final state"],
      ["Window expiry","Old contributions expire when time advances without a transaction"], ["Hysteresis","79 → 81 → 79 → 82 → 78 does not churn alerts"],
      ["Debounce/cooldown","Rapid events create one score; repeated unchanged risk creates no action spam"], ["Known/restated","Late correction adjusts current state but not stored historical decision"],
      ["Source outage","Missing feed blocks absence-based alert"], ["Periodic control","Scheduled full recompute detects injected incremental corruption"],
    ]} />
  </section>

  <section id="observability"><h2>Monitor feature integrity, signal stability and intervention value</h2>
    <div className={styles.metrics}>{["FeatureUpdateLag","RollingWindowCorrectionRate","IncrementalReplayMismatchRate","EWSAlertRate","AlertPersistenceRate","AlertClearRate","SourceHealthFailureRate","EventToInterventionLatency"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Track customers across NORMAL, WATCH, ALERT and COOLDOWN. Analyse trigger concentration by feature, event type, product and source. A sudden alert-rate increase can reflect genuine deterioration, a source change, a state-engine bug or late-event surge.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture updates quickly and acts deliberately</h2>
    <ResourceFigure label="Entimema streaming behavioural early-warning architecture." caption="Canonical state feeds incremental rolling features; model output passes through persistence, hysteresis and cooldown before any controlled workflow."><div className={styles.architecture}>{["CANONICAL FINANCIAL EVENTS","ACCOUNT / FACILITY STATE","STATEFUL ROLLING FEATURE ENGINE","FEATURE STORE","BEHAVIOURAL MODEL","SIGNAL STABILISATION · PERSISTENCE / HYSTERESIS / COOLDOWN","EWS DECISION TRIGGER","CONTROLLED WORKFLOW","OUTCOME / MONITORING"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <div className={styles.dependency}>{["PAYMENT EVENT","PAYMENT STATE","DPD","PAYMENT FEATURES","BEHAVIOURAL SCORE","EWS SIGNAL"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <EntimemaFramework title="Observe → Update → Stabilise → Trigger → Intervene" steps={["Identify material behavioural state", "Define canonical event inputs", "Define rolling window", "Define incremental update", "Handle time expiry", "Handle late events", "Stabilise signal", "Define rescore trigger", "Measure lead time", "Monitor outcomes"]} />
  </section>

  <section id="agent"><h2>A Behavioural Signal Integrity Agent can diagnose alerts without acting on customers</h2>
    <p>A controlled agent can monitor feature freshness, compare incremental with full replay, detect rolling-window inconsistencies and late corrections, inspect abnormal utilisation or payment changes, detect source-health false signals, measure alert churn and quantify intervention lead time.</p>
    <KeyObservation title="Bounded role"><p><strong>Behavioural feature integrity + signal stability + EWS observability + lead-time diagnostics.</strong> It prepares evidence for risk and engineering teams; it must not autonomously take adverse customer action.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern behavioural signals, validation and alert performance.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Stabilise model and rule triggers before controlled workflows.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Preserve event time, rolling state, corrections and lineage.</Link></p></article></div>
    <p>Continue with <Link href="/resources/batch-etl-event-driven-credit-risk-architecture">From Batch ETL to Event-Driven Credit Risk Architecture</Link>, <Link href="/resources/point-in-time-correct-features-credit-models">Point-in-Time Correct Features</Link>, <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link> and <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>. Real-time exposure, event triggers and production EWS monitoring remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Update the signal fast enough to preserve intervention value, then stabilise it enough to remain explainable, trustworthy and operationally usable.</strong></p></KeyObservation>
  </section>
</div>; }
