import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./late-event-restatement.module.css";

export const lateEventRestatementSections = [
  { id: "failure", label: "The late-event failure" }, { id: "histories", label: "Two histories" },
  { id: "lineage", label: "Correction lineage" }, { id: "boundary", label: "Replay boundary" },
  { id: "ordering", label: "Economic ordering" }, { id: "propagation", label: "Dependency propagation" },
  { id: "decisions", label: "Decision impact" }, { id: "bitemporal", label: "Bitemporal state" },
  { id: "workflow", label: "Correction workflow" }, { id: "urgency", label: "Operational correction" },
  { id: "case", label: "End-to-end case" }, { id: "testing", label: "Restatement testing" },
  { id: "observability", label: "Observability" }, { id: "architecture", label: "Late-event architecture" },
  { id: "agent", label: "Restatement Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function LateEventRestatementArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A payment is economically effective on 17 August at 09:15 but reaches the controlled platform on 19 August at 07:30. On 18 August, the account was delinquent, behavioural PD increased and collections generated an action.</p>
    <div className={styles.timeline}>{[["17 AUG · 09:15","PAYMENT EFFECTIVE"],["18 AUG","DPD / PD / COLLECTIONS DECISION"],["19 AUG · 07:30","PAYMENT RECEIVED"]].map(([t,e])=><article key={t}><b>{t}</b><span>{e}</span></article>)}</div>
    <p>The platform must now answer three questions: what did it know on 18 August, what does it now believe was economically true on 18 August, and which downstream states and decisions changed?</p>
    <Formula label="Material late event"><span>T<sub>received</sub> &gt; T<sub>effective</sub>, with potential state or decision impact</span></Formula>
    <p>Late does not mean wrong. The payment can be structurally valid and economically correct while arriving after the decision window. Discarding it merely because it is delayed preserves the wrong state.</p>
    <KeyObservation title="The central control"><p><strong>Correct the financial state. Do not falsify the historical information state.</strong></p></KeyObservation>
  </section>

  <section id="histories"><h2>Actual knowledge and corrected economics are both history</h2>
    <ResourceFigure label="Known and economic histories diverge until the late payment arrives." caption="Production correctly records that the payment was unknown on Tuesday; restatement correctly places its economic effect on Monday."><div className={styles.histories}><div><b>WHAT WAS KNOWN</b><span>MON · NO PAYMENT</span><i></i><span>TUE · DELINQUENT / ACTION</span><i></i><span>WED · PAYMENT ARRIVES</span></div><div><b>WHAT WAS ECONOMICALLY TRUE</b><span>MON · PAYMENT EFFECTIVE</span><i></i><span>TUE · CURRENT</span><i></i><span>WED · EVIDENCE KNOWN</span></div></div></ResourceFigure>
    <div className={styles.dual}><article><b>S<sup>known</sup>(T)</b><p>Uses only events available by T. It reproduces production decisions, model inputs and incident chronology.</p></article><article><b>S<sup>restated</sup>(T)</b><p>Uses later evidence economically valid by T. It supports corrected reporting, reconciliation and portfolio analysis.</p></article></div>
    <Formula label="Dual-history principle"><span>History<sup>known</sup> ≠ History<sup>restated</sup> when information arrives late</span></Formula>
    <p>Historical model validation must use known state to avoid hindsight advantage. Data-quality analysis deliberately compares known and restated state to quantify what source latency changed. Mixing these purposes silently corrupts both.</p>
  </section>

  <section id="lineage"><h2>A correction is a new event, not a hidden mutation</h2>
    {code(`interface CorrectionEvent extends FinancialEvent {
  correctionReason: string;
  supersedesEventId?: string;
  correctionType:
    | "BACKDATED"
    | "SOURCE_REPAIR"
    | "MANUAL"
    | "RESTATEMENT";
}`)}
    <p>A direct update such as changing <code>payments.effective_time</code> without retaining its old value destroys evidence. Preserve the original event, correction identity, causal link, reason, producer, received time and corrected effective semantics.</p>
    <ResourceTable caption="Late and correction classification" headers={["Class","Meaning","Control"]} rows={[
      ["Late but expected","Source contract naturally delivers later","Encode cadence; do not misclassify as incident"],
      ["Infrastructure delay","Event breached expected delivery","Trace failure and affected decisions"],
      ["Backdated correction","New evidence changes earlier state","Version lineage and restate"],
      ["Source repair","Source republishes corrected data","Validate source identity and supersession"],
      ["Manual correction","Human-governed evidence","Require reason, identity and approval where applicable"],
    ]} />
    <p>Supersession can replace the current interpretation while retaining the previous record. If a correction is corrected again, preserve <strong>E₁ → Correction₁ → Correction₂</strong>. Corrections are also idempotent events: redelivery must not multiply their economic effect.</p>
  </section>

  <section id="boundary"><h2>Replay from the earliest affected safe point</h2>
    <p>A late event does not always require replay from origination. Determine <strong>T<sub>replay</sub></strong>, then select a verified snapshot strictly before the late event&apos;s effective position.</p>
    <ResourceFigure label="A late event invalidates snapshots and projections after its effective position." caption="Snapshot v100 remains a safe base; the late event is inserted into the ordered tail and versions 101 onward are rebuilt."><div className={styles.boundary}><span>SNAPSHOT v100 · VALID</span><b>→</b><strong>LATE EVENT EFFECTIVE HERE</strong><b>→</b><span>INVALIDATE / REPLAY v101+</span></div></ResourceFigure>
    {code(`async function restateAggregate(
  aggregateId: string,
  lateEvent: FinancialEvent
) {
  const snapshot = await snapshots.findBefore(
    aggregateId,
    lateEvent.effectiveTime
  );
  const events = await eventStore.loadFrom(
    aggregateId,
    snapshot.version
  );
  return replay(snapshot.state, orderForReplay(events, lateEvent));
}`)}
    <p>This omits production concerns such as locking, idempotency, schema versions and atomic projection replacement, but preserves the core boundary. Mark invalid snapshots stale, rebuild, verify and replace; never silently mutate snapshot contents. Lineage should retain source version, event range, reducer version and creation time.</p>
  </section>

  <section id="ordering"><h2>Late events belong in economic order, not arrival order</h2>
    <p><code>effectiveTime</code> may place a payment economically, but some streams also require source sequence, causal reference or aggregate rules. Sorting by one timestamp blindly can put a reversal before its payment or violate a contractual transition.</p>
    <ResourceTable caption="Replay ordering evidence" headers={["Signal","Use","Risk if ignored"]} rows={[
      ["Effective time","Economic position","Late facts remain at arrival position"], ["Source sequence","Declared source order","Equal-time events reorder unpredictably"],
      ["Causal reference","Reversal or correction relationship","Correction applies before its subject"], ["Aggregate version / rule","Valid state transition","Replay creates impossible intermediate state"],
    ]} />
    <p>A late payment whose reversal arrived earlier in system time still requires identity and causal linkage to determine the valid economic sequence. If evidence cannot establish order safely, quarantine rather than guess.</p>
  </section>

  <section id="propagation"><h2>One late payment can change a temporal graph of dependants</h2>
    <ResourceFigure label="Late-event propagation from payment to customer decision." caption="Dependency metadata enables targeted rebuilding rather than a blind portfolio-wide rerun."><div className={styles.flow}>{["LATE PAYMENT","BALANCE","ARREARS","DPD","FEATURES","PD","COLLECTIONS PRIORITY"].map((x,i)=><span key={x}>{x}{i<6?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <Formula label="Impact graph"><span>E → S → F → M → D</span></Formula>
    <p>Identify affected account, facility, customer, feature windows, model outputs and decisions. Recompute that radius, not the whole portfolio. Feature metadata should expose source event types, lookback window and calculation version.</p>
    <p>A payment effective on day t can affect <code>LatePaymentCount_90d</code> across scoring dates in an interval conceptually resembling <strong>[t, t + 90 days]</strong>, subject to exact feature boundaries and availability rules. The impact is a range, not one row.</p>
    <Formula label="Conceptual restatement depth"><span>ImpactRadius(E) = affected states + windows + models + decisions + reports</span></Formula>
    <p>Classify shallow corrections to one balance, medium corrections across state components, and deep restatements reaching features, decisions or reporting. This guides orchestration and urgency.</p>
  </section>

  <section id="decisions"><h2>Restate the counterfactual; preserve the actual decision</h2>
    <Formula label="Immutable decision history"><span>D<sup>actual</sup>(T) remains; D<sup>restated</sup>(T) is a separate analytical result</span></Formula>
    <p>If rebuilt features change from X<sup>actual</sup> to X<sup>restated</sup>, the restated PD may differ. Never overwrite the historical score or action; otherwise the institution can no longer explain what it did with the information it had.</p>
    <ResourceTable caption="Fictional decision-impact example" headers={["Measure","Actual Tuesday history","Restated Tuesday economics"]} rows={[
      ["DPD","5","0"], ["Behavioural PD","9.2%","4.8%"], ["Collections priority","HIGH","NONE"],
    ]} />
    <p>The actual collections action remains evidence. The counterfactual shows the action would not have occurred if the payment were available. Classify impacts such as unchanged, approve → reject, no action → contact, or limit increase → hold using domain-specific severity.</p>
    <Formula label="Late-event materiality"><span>Materiality(E) = f(StateDelta, Exposure, DecisionDelta, Volume)</span></Formula>
    <p>Finance may restate balances under controlled accounting rules while Decisioning records counterfactual impact only. Reporting-date and ECL corrections can affect stage, EAD, PD, cure or default, but the architecture does not prescribe whether a reporting period is reopened.</p>
  </section>

  <section id="bitemporal"><h2>Bitemporal state preserves economic truth and institutional knowledge</h2>
    {code(`CREATE TABLE account_state_history (
  account_id     TEXT NOT NULL,
  balance_minor  BIGINT NOT NULL,
  valid_from     TIMESTAMPTZ NOT NULL,
  valid_to       TIMESTAMPTZ,
  system_from    TIMESTAMPTZ NOT NULL,
  system_to      TIMESTAMPTZ,
  state_version  TEXT NOT NULL,
  CHECK (valid_to IS NULL OR valid_from < valid_to),
  CHECK (system_to IS NULL OR system_from < system_to)
);`)}
    <div className={styles.dual}><article><b>ECONOMIC QUERY</b><p>What do we now believe the balance was on 18 August? Use valid time with the current system-time view.</p></article><article><b>KNOWLEDGE QUERY</b><p>What did the platform believe at 18:00 on 18 August? Constrain both valid and system time.</p></article></div>
    <p>Do not bitemporalise every field automatically. Use the second axis where late correction, decision reproducibility and audit value justify storage and query complexity. Never delete known-state history after restatement.</p>
  </section>

  <section id="workflow"><h2>A correction ledger governs detection through closure</h2>
    <ResourceTable caption="Correction ledger" headers={["Field","Purpose"]} rows={[
      ["Correction ID / affected aggregate","Stable workflow and state scope"], ["Effective / detected time","Replay position and latency"],
      ["Source / reason / evidence","Lineage and validation"], ["State / decision impact","Materiality and prioritisation"],
      ["Status","Detected → validated → replayed → downstream rebuilt → reconciled → closed"],
    ]} />
    <p>These are engineering workflow states, not accounting statuses. Human-created corrections require user identity, timestamp, reason, source evidence and approval where appropriate. Anonymous mutable fixes are not an operational control.</p>
    {code(`{
  "aggregateId": "acc_9012",
  "restatedFrom": "2026-08-17T09:15:00Z",
  "reason": "LATE_PAYMENT",
  "affectedStateVersion": "state_v42"
}`)}
    <p>After verified state replay, an illustrative <code>STATE_RESTATED</code> event can notify downstream consumers. Each consumer decides whether and when its dependency window requires rebuilding; do not trigger blind full rebuilds.</p>
  </section>

  <section id="urgency"><h2>Correct current treatment quickly; complete history reproducibly</h2>
    <div className={styles.dual}><article><b>OPERATIONAL CORRECTION</b><p>Fast, targeted current-state repair to stop stale collections or exposure action.</p></article><article><b>ANALYTICAL RESTATEMENT</b><p>Complete, versioned replay across history, features, models and reporting dependencies.</p></article></div>
    <p>A direct current-state patch is acceptable only when lineage is explicit and eventual replay must reconcile to it.</p>
    <Formula label="Patch convergence invariant"><span>State<sup>patched</sup> = State<sup>replayed</sup></span></Formula>
    <p>Compare state before and after replay and explain the entire delta through correction events. Current collections may correct immediately while monthly monitoring rebuilds later. Track each consumer separately so online correction does not silently coexist with stale offline history.</p>
    <Formula label="Consumer restatement lag"><span>RestatementLag = T<sub>downstream corrected</sub> − T<sub>correction received</sub></span></Formula>
  </section>

  <section id="case"><h2>A Wednesday payment repairs Tuesday economics without erasing Tuesday history</h2>
    <ol className={styles.steps}><li>Detect the Wednesday 07:30 arrival as a payment effective Monday 09:15.</li><li>Validate identity, economic meaning and expected/source latency class.</li><li>Load the last verified account snapshot before Monday.</li><li>Insert the payment into causal economic order and replay the account.</li><li>Restate Tuesday DPD from 1 to 0.</li><li>Rebuild affected behavioural feature windows and calculate restated PD.</li><li>Retain the actual Tuesday collections action and input manifest.</li><li>Record that corrected state would have generated no contact.</li><li>Update the current queue and reconcile all downstream consumers.</li></ol>
    <ResourceFigure label="Known-to-restated correction propagation." caption="The historical decision stays immutable while state, features and counterfactual outputs are rebuilt through explicit dependencies."><div className={styles.propagation}>{["LATE EVENT","STATE REPLAY","FEATURE REBUILD","MODEL RECOMPUTE","DECISION IMPACT","AUDIT RECORD"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <KeyObservation><p>The platform now holds two correct Tuesday records: what production knew and did, and what later evidence says was economically true.</p></KeyObservation>
  </section>

  <section id="testing"><h2>Golden restatement tests prove both histories survive</h2>
    <ResourceTable caption="Minimum correction test matrix" headers={["Test","Required proof"]} rows={[
      ["Late payment","Known state excludes; restated state includes"], ["Backdated fee","Balance delta begins at corrected effective position"],
      ["Event-time correction","Original timestamp remains in lineage"], ["Amount correction","Supersession changes effect once"],
      ["Account remapping","Both aggregates rebuild consistently"], ["After snapshot","Affected snapshot is invalidated and replaced"],
      ["After decision","Actual and counterfactual decisions remain separate"], ["Duplicate correction","Idempotency prevents repeated effect"],
      ["Correction of correction","Complete chain remains explainable"],
    ]} />
    <p>A golden stream combines ordinary events, a late payment, correction, reversal and decision timestamp. Assert known and restated state at several instants, plus expected actual decision, restated counterfactual and impact class.</p>
    <Formula label="Late-arrival equivalence property"><span>Replay(E<sub>on-time</sub>) = Restate(E<sub>late</sub>) for final economic state</span></Formula>
    <p>This equality assumes identical business semantics and ordering. Also verify full replay equals snapshot-based replay, patch convergence holds, and every state delta reconciles to correction lineage.</p>
  </section>

  <section id="observability"><h2>Monitor lateness, correction depth and completion</h2>
    <div className={styles.metrics}>{["LateEventRate","BackdatedCorrectionRate","RestatementLag","DecisionImpactRate","SnapshotInvalidationRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal threshold is appropriate. Track median, p95, p99 and extreme delay by source, event type, product and provider. Some next-day sources meet contract; a five-minute source suddenly taking hours is an incident.</p>
    <p>Repeated backdating can reveal mapping weakness, source-process failure or a temporal contract mismatch. Data contracts should define event-time meaning, expected arrival cadence, correction behaviour and identity stability. Monitor hotspots as structural infrastructure debt rather than isolated tickets.</p>
  </section>

  <section id="architecture"><h2>The Entimema late-event architecture separates repair from evidence</h2>
    <ResourceFigure label="Entimema late-event and restatement architecture." caption="Detection and replay repair economic state while impact and audit layers preserve what production actually knew and decided."><div className={styles.architecture}>{["SOURCE","CANONICAL EVENT STORE","LATE-EVENT DETECTOR","CORRECTION / RESTATEMENT ORCHESTRATOR","SNAPSHOT BOUNDARY","STATE REPLAY","FEATURE REBUILD","DECISION IMPACT LAYER","RECONCILIATION / AUDIT"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Entimema late-event decision framework" steps={["Detect late event", "Validate economic meaning", "Preserve original history", "Determine replay boundary", "Rebuild state", "Rebuild dependencies", "Compare known vs restated", "Measure decision impact", "Reconcile", "Close"]} />
    <p>Banks can use this around corrections from servicing, accounting and legacy batch interfaces; non-bank lenders face the same need across PSP webhooks, SaaS synchronisation, statement lag and external collections. Modern APIs do not eliminate temporal repair.</p>
  </section>

  <section id="agent"><h2>A Late-Event &amp; Restatement Integrity Agent can orchestrate evidence</h2>
    <p>A future controlled agent can detect and classify late events, identify invalid snapshots, propose replay boundaries, reconstruct corrected state, compare histories, map affected features and models, quantify decision impact, track consumer completion and surface repeated source failures.</p>
    <KeyObservation title="Bounded role"><p><strong>Late-data detection + restatement orchestration + decision-impact analysis.</strong> It must not autonomously rewrite authoritative financial history.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Known-state validation, corrected PD/DPD and ECL impact lineage.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Controlled restatement, balance reconciliation and reporting evidence.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Current-state correction, immutable decisions and counterfactual replay.</Link></p></article></div>
    <p>Continue with <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State from Financial Events</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Payment and Credit Event Processing</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/why-batch-risk-is-becoming-a-business-risk">Why Batch Risk Is Becoming a Business Risk</Link> and <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>. Reversals, DPD and point-in-time features are future Engineering directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Repair economic truth through explicit correction and replay; preserve knowledge and decision history so the institution never claims it knew tomorrow&apos;s information yesterday.</strong></p></KeyObservation>
  </section>
</div>; }
