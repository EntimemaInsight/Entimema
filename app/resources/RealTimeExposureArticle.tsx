import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./real-time-exposure.module.css";

export const realTimeExposureSections = [
  { id: "failure", label: "The synchronisation failure" }, { id: "semantics", label: "Exposure semantics" },
  { id: "coherence", label: "Temporal coherence" }, { id: "reservations", label: "Reservation lifecycle" },
  { id: "concurrency", label: "Concurrency control" }, { id: "posting", label: "Pending to posted" },
  { id: "repayments", label: "Repayments and reversals" }, { id: "authority", label: "Canonical exposure layer" },
  { id: "aggregation", label: "Exposure and EAD" }, { id: "triggers", label: "Utilisation triggers" },
  { id: "history", label: "History and features" }, { id: "testing", label: "Golden exposure stream" },
  { id: "reconciliation", label: "Reconciliation" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Exposure architecture" }, { id: "agent", label: "Exposure Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function RealTimeExposureArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A revolving facility has a €10,000 limit and €4,000 posted draw: 40% utilisation. The customer initiates €3,000 of new usage. Authorisation updates immediately, servicing posts later, and risk still reports 40% even though near-term operational exposure is €7,000—or 70%.</p>
    <div className={styles.failure}><span><b>LIMIT</b>€10,000</span><span><b>POSTED DRAWN</b>€4,000</span><span><b>PENDING USAGE</b>€3,000</span><strong><b>POSTED UTILISATION</b>40%</strong><strong><b>OPERATIONAL UTILISATION</b>70%</strong></div>
    <KeyObservation title="The central thesis"><p><strong>Exposure monitoring is trustworthy only when limit, drawn amount, pending usage, repayments and facility state are synchronised to the same point in time.</strong> Fast but incoherent utilisation can mislead more than slower coherent state.</p></KeyObservation>
  </section>

  <section id="semantics"><h2>Exposure is a versioned state—not a balance column</h2>
    <Formula label="Decision-specific exposure"><span>Exposure<sub>t</sub> = f(Drawn<sub>t</sub>, Pending<sub>t</sub>, Undrawn<sub>t</sub>, FacilityState<sub>t</sub>)</span></Formula>
    <ResourceTable caption="Explicit exposure views" headers={["View","Definition","Use"]} rows={[
      ["Posted drawn","Formally applied facility usage","Servicing and confirmed exposure"], ["Pending usage","Authorised or initiated, not final","Provisional operational state"],
      ["Posted utilisation","PostedDrawn / EffectiveLimit","Confirmed utilisation view"], ["Operational utilisation","(PostedDrawn + RelevantPending) / EffectiveLimit","Near-term decision view"],
      ["Available credit","Limit − Drawn − RelevantPending − Blocked","Authorisation/limit headroom under declared semantics"],
    ]} />
    <p>Use <code>posted_utilisation</code>, <code>operational_utilisation</code> and <code>available_credit</code>, not one ambiguous <code>utilisation</code>. Pending exposure is not final draw; preserve <strong>provisional</strong> and <strong>confirmed</strong> state where decisions need both.</p>
    {code(`type ExposureState = {
  facilityId: string;
  limitMinor: bigint;
  postedDrawnMinor: bigint;
  pendingMinor: bigint;
  blockedMinor: bigint;
  availableMinor: bigint;
  postedUtilisation: number;
  operationalUtilisation: number;
  effectiveAsOf: Date;
  generatedAt: Date;
  stateVersion: string;
};`)}
  </section>

  <section id="coherence"><h2>The numerator, denominator and pending state need component time</h2>
    {code(`type ExposureComponent<T> = {
  value: T;
  effectiveAsOf: Date;
  availableAsOf: Date;
};`)}
    <ResourceFigure label="A coherent exposure view validates asynchronous component clocks." caption="A fresh drawn balance with an old limit can understate or overstate risk; component timestamps must remain visible to the state engine."><div className={styles.clocks}><span>LIMIT TIME<br/><b>06:00</b></span><span>DRAWN TIME<br/><b>14:00</b></span><span>PENDING TIME<br/><b>14:01</b></span><i>→</i><strong>COHERENCE + FRESHNESS GUARD</strong></div></ResourceFigure>
    <p>A limit reduction from €10,000 to €8,000 with €7,000 drawn changes utilisation from 70% to 87.5%. A stale denominator understates risk; a stale numerator can overstate available credit. Validate each component against the decision-specific freshness budget.</p>
    <p>A future-effective limit change can be known today without changing today&apos;s denominator. Represent current limit and scheduled change separately.</p>
  </section>

  <section id="reservations"><h2>Pending usage is a lifecycle, not a free-standing amount</h2>
    <ResourceFigure label="Reservation lifecycle conserves one authorisation." caption="A reservation confirms into posted usage or releases/expires. Stable transaction identity prevents pending and posted representations from becoming two exposures."><div className={styles.lifecycle}><span>RESERVE</span><b>→</b><strong>PENDING</strong><b>→</b><div><span>CAPTURE / POST</span><span>RELEASE / EXPIRE</span></div></div></ResourceFigure>
    <p>Use causal events such as <code>AUTHORIZATION_RESERVED</code>, <code>AUTHORIZATION_POSTED</code> and <code>AUTHORIZATION_RELEASED</code>. Timeouts or source finality release abandoned reservations; otherwise available credit stays understated.</p>
    <Formula label="Partial-capture conservation"><span>OriginalReservation = PostedCapture + ReleasedAmount + RemainingPending</span></Formula>
    <p>A €1,000 reservation posting €700 releases €300. Where multiple captures are allowed, one reservation maps to several causal postings without losing the original conservation identity.</p>
  </section>

  <section id="concurrency"><h2>Availability checks and reservations must be one concurrency boundary</h2>
    <p>Two simultaneous €2,000 requests can both read €3,000 available and both approve if the system follows “read, approve, update later.” Reserve atomically against facility aggregate state.</p>
    {code(`UPDATE facility_state
SET reserved_minor = reserved_minor + :amount,
    version = version + 1
WHERE facility_id = :id
  AND version = :expected_version;`)}
    <p>If zero rows update, reload and retry against the new state. Optimistic compare-and-swap supports concurrency; pessimistic aggregate locking can simplify correctness at lower throughput. Choose from workload and failure semantics, not fashion.</p>
    <Formula label="Reservation identity"><span>One authorization_id → one pending economic effect</span></Formula>
  </section>

  <section id="posting"><h2>Posting moves exposure; it must not add it twice</h2>
    <div className={styles.transition}><span>PENDING<br/><b>−A</b></span><i>posting transition</i><span>POSTED DRAWN<br/><b>+A</b></span><strong>OPERATIONAL EXPOSURE<br/><b>≈ UNCHANGED</b></strong></div>
    <Formula label="Pending-to-posted invariant"><span>ΔPending = −A; ΔPosted = +A; ΔOperationalExposure ≈ 0</span></Formula>
    <p>Stable transaction identity links authorisation and final posting. If pending is not removed, <code>PostedDrawn + Pending</code> counts the same transaction twice. A pending cancellation decreases pending without ever increasing drawn; it is not a drawdown reversal.</p>
  </section>

  <section id="repayments"><h2>Repayment affects exposure only at the defined finality state</h2>
    <ResourceTable caption="Payment and reversal effects" headers={["State","Exposure treatment"]} rows={[
      ["PAYMENT_INITIATED","Usually not final; do not assume exposure reduction"], ["PAYMENT_SETTLED","May support provisional relief where policy permits"],
      ["PAYMENT_APPLIED","Confirmed facility draw reduction under servicing semantics"], ["REPAYMENT_REVERSED","Draw rises again; utilisation and available credit recompute"],
      ["DRAW_REVERSED","Posted draw decreases with causal reversal lineage"],
    ]} />
    <p>A payment can settle externally before servicing applies it. Whether available credit increases provisionally or waits is a governed product decision. Preserve both the event and the state transition rather than mutating history.</p>
  </section>

  <section id="authority"><h2>A canonical exposure engine composes field-level authority</h2>
    <ResourceTable caption="Illustrative field authority" headers={["Component","Owning domain"]} rows={[
      ["Effective facility limit","Servicing / facility domain"], ["Pending authorisation","Processor / authorisation domain"],
      ["Posted facility balance","Core / servicing"], ["Accounting balance","Ledger"], ["Repayment finality","Payment and servicing semantics"],
    ]} />
    <div className={styles.sources}><span>LIMIT EVENTS</span><span>USAGE EVENTS</span><span>PAYMENT EVENTS</span><b>↓</b><strong>FACILITY STATE ENGINE</strong><b>↓</b><span>CANONICAL EXPOSURE STATE</span></div>
    <p>Operational exposure and general-ledger balance can legitimately differ at an instant. The first serves timely decisions; the second serves accounting truth. Keep both views, label them, and reconcile at aligned cut-offs.</p>
  </section>

  <section id="aggregation"><h2>Preserve exposure components before risk aggregation</h2>
    <Formula label="Usable undrawn"><span>UsableUndrawn = Limit − Drawn − Reserved − Blocked</span></Formula>
    <Formula label="Illustrative EAD relationship"><span>EAD = Drawn + CCF × Undrawn</span></Formula>
    <p>Whether pending enters drawn or undrawn is methodology-specific. Supply <code>posted_drawn</code>, <code>pending_usage</code>, <code>contractual_undrawn</code>, <code>usable_undrawn</code> and <code>limit</code> separately. One opaque EAD cannot explain limit, draw or utilisation changes.</p>
    <p>Party exposure aggregates canonical facilities under role/attribution policy. Portfolio economic exposure sums unique facilities, so joint-borrower relationships never multiply the money.</p>
  </section>

  <section id="triggers"><h2>Trigger risk only after exposure coherence is proven</h2>
    <Formula label="Utilisation velocity"><span>Velocity<sub>U</sub> = (U<sub>t</sub> − U<sub>t−k</sub>) / k</span></Formula>
    <p>Monitor level, velocity, exposure growth and headroom. A 45% → 88% spike can feed EWS only when its numerator and denominator are coherent. Versioned hysteresis can stabilise NORMAL, ELEVATED, HIGH and CRITICAL states without prescribing universal thresholds.</p>
    <KeyObservation title="Do not clamp away risk"><p><strong>A negative available amount can be a signal.</strong> Turning it into zero for presentation may erase over-limit usage, stale limits, duplicate pending, posting lag or authorised overage that risk needs to classify.</p></KeyObservation>
  </section>

  <section id="history"><h2>Exposure features need sufficient intraday history</h2>
    <Formula label="Known and corrected exposure"><span>Exposure<sup>known</sup>(T) ≠ Exposure<sup>restated</sup>(T)</span></Formula>
    <p>Historical decisions replay known state; late posting or corrections produce restated analysis. Store <code>exposureStateVersion</code> or an immutable input manifest.</p>
    <p>End-of-day sampling erases intraday peaks and understates <code>MaxUtilisation_24h</code>. Define whether each feature uses end-of-day, intraday maximum or time-weighted average. Current utilisation, 30-day max, 7-day exposure growth and headroom all trace to canonical exposure state.</p>
  </section>

  <section id="testing"><h2>A golden exposure stream proves conservation and concurrency</h2>
    <ResourceTable caption="Deterministic exposure stream" headers={["Step","Event","Expected state effect"]} rows={[
      ["1","Set limit €10,000","Limit 10,000; available 10,000"], ["2","Draw €4,000","Posted 4,000; available 6,000"],
      ["3","Reserve €2,000","Pending 2,000; operational exposure 6,000"], ["4","Post €1,500","Pending 500; posted 5,500; operational unchanged"],
      ["5","Release €500","Pending 0; available rises"], ["6","Apply repayment €1,000","Posted falls to 4,500"],
      ["7","Reverse repayment €1,000","Posted returns to 5,500"], ["8","Reduce limit to €8,000","Available, utilisation and over-limit flag recompute"],
    ]} />
    <ResourceTable caption="Exposure-state invariant tests" headers={["Test","Proof"]} rows={[
      ["Pending to posted","Operational exposure does not double"], ["Duplicate reservation","Repeated authorisation reserves once"],
      ["Partial capture","Reservation conservation holds exactly"], ["Concurrent reservations","Version control prevents unauthorised oversubscription"],
      ["Late repayment","Known history stays fixed; restated state changes"], ["Incremental/full replay","Same events yield identical exposure state"],
    ]} />
  </section>

  <section id="reconciliation"><h2>Reconcile operational, servicing and accounting state at aligned cut-offs</h2>
    <p>Compare canonical posted drawn with servicing balance and relevant ledger state. Classify timing, pending, missing event, duplicate or correction differences. Pending-to-posted transition and partial-capture conservation make discrepancies explainable rather than opaque.</p>
    <Formula label="Exposure engine invariant"><span>ExposureState<sup>incremental</sup> = ExposureState<sup>full replay</sup></span></Formula>
    <p>Periodic authoritative reconciliation controls the streaming projection; it should not create a second ungoverned exposure truth.</p>
  </section>

  <section id="observability"><h2>Monitor coherence, pending lifecycle and decision readiness</h2>
    <div className={styles.metrics}>{["ExposureStateLag","PendingAge","ReservationExpiryRate","OperationalVsPostedDifference","OverLimitRate","DuplicateReservationRate","ExposureReconciliationDifference","DecisionReadyExposureLag"].map(x=><span key={x}>{x}</span>)}</div>
    <Formula label="Pending age"><span>PendingAge = CurrentTime − ReservationTime</span></Formula>
    <p>Track limit, draw, authorisation and repayment source health. A “real-time” view is only as reliable as its weakest critical feed. Sudden utilisation shifts after a limit-system migration may be denominator drift, not borrower deterioration.</p>
    <p>Before high-impact decisions, gate on freshness, completeness, source health and reconciliation status. Fail-silent pending feeds can overstate available credit.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture synchronises lifecycle state before serving risk</h2>
    <ResourceFigure label="Entimema real-time utilisation and exposure architecture." caption="Canonical transaction lifecycles prevent duplicate pending/posted effects; coherent facility state serves explainable utilisation, EAD inputs and risk decisions before authoritative reconciliation."><div className={styles.architecture}>{["LIMIT / AUTHORISATION / DRAWDOWN / REPAYMENT EVENTS","CANONICAL FACILITY EVENT LAYER","RESERVATION / PENDING STATE","POSTED DRAWN STATE","CANONICAL EXPOSURE ENGINE","AVAILABLE / UTILISATION / HEADROOM","FEATURE STORE / EAD INPUTS","LIMIT / EWS / RISK DECISIONS","AUTHORITATIVE RECONCILIATION"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Reconstruct → Synchronise → Monitor → Trigger → Reconcile" steps={["Define facility exposure semantics", "Define limit authority", "Define drawn and pending state", "Link transaction lifecycle", "Enforce concurrency", "Derive available and utilisation", "Validate freshness", "Trigger risk decision", "Reconcile", "Replay and monitor"]} />
  </section>

  <section id="agent"><h2>An Exposure State Integrity Agent can diagnose discrepancies without changing limits</h2>
    <p>A controlled agent can monitor limit/drawn/pending synchronisation, detect stale components, duplicate or long-lived reservations, compare operational and posted exposure, identify over-limit anomalies, compare incremental with replayed state and trace affected historical decisions.</p>
    <KeyObservation title="Bounded role"><p><strong>Exposure-state synchronisation + utilisation integrity + reconciliation + decision-impact support.</strong> It prepares evidence for risk and engineering teams; it must not autonomously change credit limits or approve exposure.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern utilisation, exposure, EAD inputs and over-limit monitoring.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Gate limit and EWS decisions on coherent exposure state.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Canonicalise transaction lifecycle and reconcile authoritative balances.</Link></p></article></div>
    <p>Continue with <Link href="/resources/streaming-behavioural-features-early-warning">Streaming Behavioural Features for Early Warning</Link>, <Link href="/resources/batch-etl-event-driven-credit-risk-architecture">From Batch ETL to Event-Driven Credit Risk Architecture</Link>, <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store</Link>, <Link href="/resources/customer-facility-account-exposure-credit-data-model">Customer, Facility, Account and Exposure</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link> and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD &amp; Credit Conversion Factors</Link>. Event-driven triggers, backpressure recovery and real-time collections state remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Prove that limit, drawn amount and pending usage describe the same economic moment—and that no lifecycle transition counts exposure twice.</strong></p></KeyObservation>
  </section>
</div>; }
