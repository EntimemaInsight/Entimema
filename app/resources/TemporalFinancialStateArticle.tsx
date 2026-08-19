import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./temporal-financial-state.module.css";

export const temporalFinancialStateSections = [
  { id: "failure", label: "Start with the failure" }, { id: "timestamps", label: "Timestamp model" },
  { id: "histories", label: "Two histories" }, { id: "point-in-time", label: "Point-in-time SQL" },
  { id: "bitemporal", label: "Bitemporal state" }, { id: "late-events", label: "Late events" },
  { id: "replay", label: "Decision replay" }, { id: "features", label: "Feature stores" },
  { id: "calendar", label: "Calendar semantics" }, { id: "api", label: "State API" },
  { id: "contracts", label: "Temporal contracts" }, { id: "observability", label: "Observability" },
  { id: "case", label: "End-to-end case" }, { id: "testing", label: "Testing" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Temporal Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function TemporalFinancialStateArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A payment occurs at 09:15. The platform receives it at 09:17. The loan system posts it at 23:45. The risk warehouse receives that posting at 01:30 the next day. Collections made a decision at 18:00. Was the borrower delinquent at 18:00?</p>
    <div className={styles.timeline}>{[["09:15","PAYMENT OCCURS"],["09:17","PLATFORM RECEIVES"],["18:00","COLLECTIONS DECIDES"],["23:45","LOAN SYSTEM POSTS"],["01:30 +1D","WAREHOUSE LOADS"]].map(([t,l])=><article key={t}><b>{t}</b><span>{l}</span></article>)}</div>
    <p>Economically, perhaps not: the payment was already effective. Operationally, perhaps yes: the collections engine may not have possessed a validated payment state. Accounting may answer differently again until formal posting. The defect is not that one answer must be chosen. It is that a schema such as <code>payment_date TIMESTAMP</code> destroys the evidence needed to answer each question.</p>
    <KeyObservation title="The central thesis"><p><strong>A financial record does not have one meaningful timestamp.</strong> Credit systems must distinguish when an event happened, became economically effective, became known, became technically usable and was formally posted.</p></KeyObservation>
  </section>

  <section id="timestamps"><h2>One timestamp cannot represent six questions</h2>
    {code(`interface TemporalFinancialEvent {
  eventId: string;
  eventTime: Instant;
  effectiveTime: Instant;
  receivedTime: Instant;
  processedTime: Instant;
  postingTime?: Instant;
  sourceSystem: string;
}`)}
    <ResourceTable caption="Entimema timestamp matrix" headers={["Timestamp","Symbol","Question","Engineering meaning"]} rows={[
      ["Event time","Tₑ","When did it happen?","Source assertion about the real-world event"],
      ["Effective time","Tᵥ","When should it affect economic state?","Valid time for the domain being modelled"],
      ["Received time","Tᵣ","When did we learn about it?","First arrival at the controlled platform boundary"],
      ["Processing time","Tₚ","When was it technically ready?","Canonical validation and transformation completed"],
      ["Posting time","Tpost","When was it formally recorded?","Servicing or accounting system posted the item"],
      ["Decision time","Tᵈ","When did we act?","Immutable time of approval, alert, limit or collections action"],
    ]} />
    <p><strong>Event time</strong> may be initiation, utilisation change or an external bureau occurrence. <strong>Effective time</strong> is when the fact becomes valid for balance, exposure or delinquency and need not equal event time. <strong>Received time</strong> establishes institutional knowledge. <strong>Processing time</strong> measures infrastructure readiness. <strong>Posting time</strong> is a formal system-of-record fact, not a synonym for payment or economic validity. <strong>Decision time</strong> freezes the information boundary for reproducibility.</p>
    <div className={styles.metrics}><Formula label="Data arrival latency"><span>Tᵣ − Tₑ</span></Formula><Formula label="Canonical processing latency"><span>Tₚ − Tᵣ</span></Formula></div>
  </section>

  <section id="histories"><h2>Credit architecture contains two histories</h2>
    <ResourceFigure label="Economic and knowledge histories diverging when a payment arrives late." caption="Valid time places the payment in Monday's economic history; system time places institutional knowledge on Wednesday."><div className={styles.histories}><div><b>ECONOMIC HISTORY</b><span>MON 09:15 · PAYMENT EFFECTIVE</span><i></i><span>TUE 18:00 · CURRENT</span></div><div><b>KNOWLEDGE HISTORY</b><span>TUE 18:00 · PAYMENT UNKNOWN</span><i></i><span>WED 07:10 · PAYMENT RECEIVED</span></div></div></ResourceFigure>
    <Formula label="Known state"><span>State<sup>known</sup>(T) = fold(Events with availability ≤ T)</span></Formula>
    <p>The availability predicate normally includes <code>receivedTime ≤ T</code> and may additionally require successful processing, source eligibility or finality appropriate to the decision. This reconstructs what production could have known.</p>
    <Formula label="Restated state"><span>State<sup>restated</sup>(T) = fold(All currently known events with effectiveTime ≤ T)</span></Formula>
    <p>Restated state uses later arrivals and corrections to express today&apos;s best view of what was economically true at T. It is appropriate for reconciliation and corrected portfolio history, but it is not a faithful decision input.</p>
    <Formula label="The two-history principle"><span>State<sup>known</sup>(T) ≠ State<sup>restated</sup>(T) when information arrives late or is corrected</span></Formula>
    <p>If a Monday payment arrives Wednesday and a model scored Tuesday, training or validation built from Wednesday&apos;s corrected history gives the model information production lacked. That is <strong>hindsight leakage</strong>.</p>
  </section>

  <section id="point-in-time"><h2>Effective before the decision does not mean available before the decision</h2>
    <p>The dangerous query is attractive because it looks temporal:</p>
    {code(`SELECT *
FROM payments
WHERE effective_time <= :decision_time;`)}
    <p>It admits a fact effective on Monday even when the platform first received it on Wednesday. A conceptual known-state filter begins with both axes:</p>
    {code(`SELECT *
FROM financial_events
WHERE effective_time <= :decision_time
  AND received_time <= :decision_time
  AND processed_time <= :decision_time
  AND processing_status = 'ACCEPTED';`)}
    <p>Production semantics may also constrain source availability, version, finality and corrections. The SQL must implement the decision&apos;s availability contract, not a universal folklore rule.</p>
    <h3>As-of joins select what was available then</h3>
    {code(`SELECT d.decision_id, d.decision_time, s.balance_minor
FROM decisions d
LEFT JOIN LATERAL (
  SELECT s.balance_minor
  FROM account_state_history s
  WHERE s.account_id = d.account_id
    AND s.available_from <= d.decision_time
    AND (s.available_to > d.decision_time OR s.available_to IS NULL)
  ORDER BY s.available_from DESC, s.state_version DESC
  LIMIT 1
) s ON TRUE;`)}
    <p><code>LATERAL</code> is supported by PostgreSQL and some related engines; other dialects use <code>APPLY</code>, a correlated subquery or <code>ROW_NUMBER()</code>. The invariant is stable: never join a historical decision to today&apos;s customer row.</p>
    <ResourceFigure label="Availability-aware feature construction before a decision." caption="The availability filter is applied before the observation window and aggregation, preventing future knowledge from entering a historical feature."><div className={styles.flow}>{["EVENT HISTORY","AVAILABILITY FILTER","OBSERVATION WINDOW","FEATURE","DECISION TIME"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div></ResourceFigure>
  </section>

  <section id="bitemporal"><h2>SCD Type 2 preserves one history; some decisions need two</h2>
    <p>A conventional slowly changing dimension can preserve when an attribute was valid yet discard when the institution learned or corrected it. Bitemporal data keeps both <strong>valid time</strong> and <strong>system time</strong>: <code>Fact(validTime, systemTime)</code>.</p>
    {code(`CREATE TABLE account_state (
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
    <p>A payment effective Monday and received Wednesday has <code>valid_from = Monday</code> and <code>system_from = Wednesday</code>. Tuesday&apos;s known state excludes it; today&apos;s restated view of Tuesday includes it. A current row has an open system interval; correction closes that interval and inserts a new system version rather than erasing evidence.</p>
    <KeyObservation title="Use bitemporality selectively"><p>Balances, delinquency, exposure, limits, customer relationships, material risk features and strategy versions may justify two axes. A decorative UI label probably does not. Historical reproducibility, correction frequency and audit value must pay for the complexity.</p></KeyObservation>
  </section>

  <section id="late-events"><h2>Late events are a controlled state transition, not an edge case</h2>
    <Formula label="Late-arrival condition"><span>Tᵣ ≫ Tᵥ relative to the decision-specific tolerance</span></Formula>
    <ResourceTable caption="Late-event classification" headers={["Class","Cause","Response"]} rows={[
      ["Expected late","Known source cadence","Encode availability contract; do not mislabel as incident"],
      ["Operational delay","Backlog or failed dependency","Recover pipeline and measure affected decisions"],
      ["Correction","New fact supersedes old state","Version state, restate dependencies, retain lineage"],
      ["Unexpected late","Source or semantic failure","Quarantine or investigate according to materiality"],
    ]} />
    <Formula label="Decision-specific late-event rate"><span>LateEventRate<sub>D</sub> = LateEvents beyond tolerance<sub>D</sub> / TotalEvents<sub>D</sub></span></Formula>
    <p>A stream watermark means events before T are believed sufficiently complete for a computation. It is an engineering completeness assumption—not payment settlement or financial finality. Allowed lateness may reopen a window, but reopening propagates through dependencies:</p>
    <EntimemaFramework title="Late-event dependency graph" steps={["Late payment", "Balance", "DPD", "Behavioural features", "PD", "Monitoring"]} />
    <p>Recalculate the affected account, aggregate and descendants rather than rebuilding the entire portfolio. The dependency graph should make the blast radius explicit.</p>
  </section>

  <section id="replay"><h2>Restating state must not rewrite what the institution actually decided</h2>
    <p>A historical production decision is itself immutable evidence. Store decision time, output, reason codes, input references, model, rule, strategy and configuration versions. A correction may produce a separate counterfactual—never a silent overwrite.</p>
    <div className={styles.dual}><article><b>DECISIONᵃᶜᵗᵘᵃˡ(T)</b><p>What production produced from contemporaneously available information.</p></article><article><b>DECISIONʳᵉˢᵗᵃᵗᵉᵈ(T)</b><p>What the same governed logic would produce with corrected information.</p></article></div>
    <Formula label="Decision impact of later information"><span>ΔD<sub>T</sub> = D<sup>restated</sup><sub>T</sub> − D<sup>actual</sup><sub>T</sub></span></Formula>
    <p>A limit increase issued Tuesday can remain the actual event even if a bureau item received Wednesday but effective Monday would have changed the answer to “no increase.” The difference measures data-incident impact, challenger opportunity or control weakness; it does not alter history.</p>
    {code(`{
  "decisionId": "dec_102",
  "decisionTime": "2026-08-18T18:00:00Z",
  "strategyVersion": "limit_7.3",
  "features": {
    "behaviouralPd": {
      "version": "pd_4.2",
      "effectiveAsOf": "2026-08-18T06:00:00Z",
      "availableAsOf": "2026-08-18T06:08:14Z"
    }
  }
}`)}
  </section>

  <section id="features"><h2>A point-in-time feature store answers what was available at T</h2>
    <Formula label="Point-in-time correct production feature"><span>Xᵢ(T) = f(Events available by T)</span></Formula>
    {code(`interface FeatureValue<T> {
  value: T;
  effectiveAsOf: Date;
  availableAsOf: Date;
  calculatedAt: Date;
  definitionVersion: string;
}`)}
    <p><code>calculatedAt</code> is not freshness: a feature computed one second ago can use week-old data. <code>effectiveAsOf</code> describes economic age; <code>availableAsOf</code> describes when it could be served.</p>
    <div className={styles.metrics}><Formula label="Feature age"><span>Tᵈ − effectiveAsOf</span></Formula><Formula label="Serving lag"><span>Tᵈ − availableAsOf</span></Formula></div>
    <p>Online and offline stores need shared semantic definitions. Identical feature code still creates training-serving skew when offline training uses corrected history while online scoring saw delayed information. Availability-aware training is mandatory when the objective is production replication.</p>
    <p>For <strong>PaymentsLast90Days</strong>, define the clock (event or effective time), exact inclusive/exclusive boundaries, timezone and availability cutoff. At 2026-08-18 12:00, a payment exactly 90 days earlier at 14:00 lies outside a duration-based window even if both dates look included after truncation.</p>
  </section>

  <section id="calendar"><h2>Business dates and instants answer different questions</h2>
    <ResourceTable caption="Temporal representation rules" headers={["Concern","Rule","Failure prevented"]} rows={[
      ["Time zones","Store UTC instants where appropriate and retain source offset/zone","Mixed-zone ordering errors"],
      ["DST","Never store ambiguous local wall time without zone","Duplicated or missing local times"],
      ["Business date","Preserve alongside physical timestamp","After-midnight posting assigned to wrong operating day"],
      ["Calendar logic","Use contractual holiday and day-count rules","Incorrect DPD or schedule state"],
      ["Precision","Match source and ordering need; do not invent digits","False deterministic ordering"],
      ["Clock skew","Compare source and platform clocks","Impossible negative or extreme latency hidden"],
    ]} />
    <p><code>DATE(event_time)</code> discards ordering and zone information; use it only when the domain definition genuinely operates at date granularity. A transaction processed after midnight may belong to yesterday&apos;s business date. DPD should not be inferred from raw elapsed hours when contracts operate on calendar and holiday rules.</p>
    <p>Future-dated input requires classification. It may be a timezone defect, source-clock error, or a legitimate future-effective rate or limit change. The institution can know today that a change becomes valid tomorrow; <strong>known now / effective later</strong> is a valid state, not necessarily an anomaly.</p>
  </section>

  <section id="api"><h2>Make the temporal question explicit in the API</h2>
    {code(`interface TemporalStateStore {
  getKnownState(accountId: string, asOf: Date): Promise<AccountState>;
  getRestatedState(accountId: string, asOf: Date): Promise<AccountState>;
}

const decisionState = await stateStore.getKnownState(
  "acc_9012", new Date("2026-08-18T18:00:00Z")
);

const financeState = await stateStore.getRestatedState(
  "acc_9012", new Date("2026-08-18T18:00:00Z")
);`)}
    <p>Known-state APIs support historical decision reconstruction, incident analysis and model validation. Restated-state APIs support Finance/Risk reconciliation and corrected portfolio analysis. Every exported dataset should declare which state it contains; a generic <code>getState</code> silently invites misuse.</p>
    {code(`type TemporalEvent = {
  eventTime: Date;
  effectiveTime: Date;
  receivedTime: Date;
  processedTime?: Date;
};

function validateTemporalEvent(event: TemporalEvent): string[] {
  const errors: string[] = [];
  if (event.processedTime && event.processedTime < event.receivedTime) {
    errors.push("processedTime precedes receivedTime");
  }
  return errors;
}`)}
    <p>Keep generic invariants narrow. <code>receivedTime ≥ eventTime</code> often holds, but source clock skew can violate it without proving the business event invalid. Domain validators should classify unexpected negative latency, future times, overlaps and duplicates with source-aware tolerances.</p>
  </section>

  <section id="contracts"><h2>There is no universal financial-state freshness requirement</h2>
    <ResourceTable caption="Temporal contracts by decision" headers={["Decision","State requirement","Primary concern"]} rows={[
      ["Collections","Fresh known state","Avoid stale or harmful action"],
      ["Behavioural scoring","Point-in-time known features","Hindsight leakage"],
      ["Limit decision","Current exposure state","New exposure creation"],
      ["ECL","Complete reporting-date state","Cut-off and reproducibility"],
      ["Model validation","Historical known state","Credible performance estimate"],
    ]} />
    <p>Collections may require current payment, DPD and promise state. Limit management may combine fast utilisation with slower income or bureau facts. Monthly ECL values completeness and a controlled reporting cut-off more than milliseconds. Mixed cadence is legitimate when explicit, tested and visible.</p>
  </section>

  <section id="observability"><h2>Temporal integrity is business observability</h2>
    <div className={styles.metrics}><Formula label="Event lag"><span>Tᵣ − Tₑ</span></Formula><Formula label="Processing lag"><span>Tₚ − Tᵣ</span></Formula><Formula label="Feature lag"><span>T<sub>available</sub> − T<sub>effective</sub></span></Formula></div>
    <p>Monitor completeness, freshness, ordering, late arrival and temporal consistency. Use median, p95 and p99 rather than average alone: a small tail can concentrate in high-risk products, material exposures or one source. Slice by source, event type, product and time of day.</p>
    <Formula label="Temporal materiality"><span>f(EventLag, Exposure, DecisionImpact, Volume)</span></Formula>
    <p>Do not alert on every late row. Alert on persistent source degradation, abnormal tails or material decision impact. Compare known and restated decisions where feasible; one decision-changing late event can matter more than thousands of harmless delays.</p>
  </section>

  <section id="case"><h2>A late payment creates two valid Tuesday states</h2>
    <p>A fictional lender receives a payment on Wednesday at 07:10 that was effective Monday at 09:15. Its behavioural score and collections queue ran Tuesday at 18:00.</p>
    <ResourceTable caption="Fictional end-to-end temporal case" headers={["View at Tuesday 18:00","State","Decision"]} rows={[
      ["Production-known","Payment unavailable; account delinquent","CONTACT"],
      ["Restated economic","Payment effective Monday; account current","NO CONTACT"],
    ]} />
    <p>The CONTACT event remains immutable because that is what the institution did. Model backtesting uses known state because it reproduces the available evidence. Finance may use restated state to reconcile economic history. Infrastructure monitoring classifies the payment as decision-material late data because the counterfactual changed.</p>
    <ResourceFigure label="Entimema temporal state architecture from source event to replay." caption="Known-state construction and restatement are separate paths; both feed explicit point-in-time consumers while the original decision manifest remains immutable."><div className={styles.architecture}><div>SOURCE EVENT</div><b>↓</b><div>EVENT / EFFECTIVE TIME</div><b>↓</b><div>RECEIVED TIME</div><b>↓</b><div>CANONICAL EVENT STORE</div><section><span>KNOWN-STATE BUILDER</span><span>RESTATEMENT ENGINE</span></section><b>↓</b><div>POINT-IN-TIME FEATURE LAYER</div><b>↓</b><div>DECISION / MODEL → MANIFEST</div><b>↓</b><div>REPLAY / VALIDATION</div></div></ResourceFigure>
  </section>

  <section id="testing"><h2>Temporal correctness needs deterministic regression evidence</h2>
    <p>A <strong>golden temporal stream</strong> should contain a normal payment, late-arriving payment, reversal and future-effective limit change. Assert known and restated state at several exact instants—not only end-of-day snapshots.</p>
    <ResourceTable caption="Minimum temporal test architecture" headers={["Test","Assertion"]} rows={[
      ["On-time event","Known and restated state converge after processing"], ["Late event","Historical known state excludes; restated state includes"],
      ["Backdated correction","Old system interval closes; valid history restates"], ["Future-effective event","Known schedule exists; current valid state is unchanged"],
      ["Duplicate","Idempotent ingestion does not double-apply"], ["Reversal","Original evidence remains; derived state reverses once"],
      ["Timezone / DST boundary","Instant ordering remains unambiguous"], ["Business-date boundary","Contractual date follows approved calendar rule"],
    ]} />
    <p>Also test non-overlapping valid/system ranges where exclusivity is required, duplicate effective states, impossible system ranges, clock anomalies and date-boundary inclusivity. A <strong>golden decision replay</strong> stores expected known state, feature manifest and output for representative historical decision times and runs after every temporal-engine change.</p>
  </section>

  <section id="failures"><h2>Eighteen failure modes that corrupt historical state</h2>
    <div className={styles.failureGrid}>{[
      ["One timestamp","Collapses incompatible business, availability and accounting meanings."],["Undefined payment_date","Consumers invent semantics independently."],
      ["Effective = available","Introduces later knowledge into earlier decisions."],["Corrected validation history","Inflates historical model evidence through hindsight."],
      ["Today’s customer join","Applies future attributes to past decisions."],["SCD2 solves time","Often retains validity but not knowledge history."],
      ["Everything bitemporal","Adds write, query and control complexity without decision value."],["Offset discarded","Makes cross-zone ordering ambiguous."],
      ["Business date = instant","Breaks cut-off, holiday and end-of-day semantics."],["Early date truncation","Destroys ordering and window boundaries."],
      ["Late events ignored","Leaves balances, DPD and features silently wrong."],["Decision overwritten","Erases evidence of actual institutional action."],
      ["Calculated = fresh","Hides stale source state behind a recent computation."],["Average latency only","Conceals decision-material tail events."],
      ["Watermark = finality","Confuses compute completeness with economic settlement."],["Cleaner offline features","Creates temporal training-serving skew."],
      ["No input manifest","Makes exact replay impossible."],["No temporal regression","Allows boundary and correction bugs to recur."],
    ].map(([h,p])=><article key={h}><b>{h}</b><p>{p}</p></article>)}</div>
  </section>

  <section id="agent"><h2>A Temporal Integrity Agent can support evidence, not rewrite history</h2>
    <p>A future agent can monitor event, effective, received and processing timestamps; detect late or impossible sequences; measure latency distributions; compare known and restated state; identify affected historical decisions; test point-in-time feature integrity; surface potential hindsight leakage; and prepare incident evidence for engineers and validators.</p>
    <KeyObservation title="Bounded role"><p><strong>Temporal data integrity + decision replay + point-in-time validation support.</strong> The agent must not rewrite historical production decisions or improvise financial-state semantics.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Point-in-time modelling, behavioural scoring, validation and ECL state.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Restated reporting state, reconciliation and controlled cut-offs.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Freshness-aware decisions, immutable manifests and governed replay.</Link></p></article></div>
    <p>Related live research: <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>, <Link href="/resources/why-batch-risk-is-becoming-a-business-risk">Why Batch Risk Is Becoming a Business Risk</Link>, <Link href="/resources/credit-risk-model-validation-pipeline">Credit Risk Model Validation Pipeline</Link> and <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link>. Future Engineering work can extend this foundation into idempotency, event-sourced account reconstruction, corrections, reversals, point-in-time feature stores and DPD engines; these are research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>The correct historical state depends on the question. Preserve economic history and knowledge history separately, then force every feature, decision and replay to declare which one it uses.</strong></p></KeyObservation>
  </section>
</div>; }
