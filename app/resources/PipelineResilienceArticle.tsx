import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pipeline-resilience.module.css";

export const pipelineResilienceSections = [
  { id: "failure", label: "Healthy-looking stale truth" }, { id: "lag", label: "Lag and freshness" },
  { id: "degradation", label: "Decision degradation" }, { id: "retries", label: "Retries and quarantine" },
  { id: "priority", label: "Priority and blast radius" }, { id: "commit", label: "Checkpoint semantics" },
  { id: "recovery", label: "Catch-up and replay" }, { id: "health", label: "Four health layers" },
  { id: "revalidation", label: "Decision revalidation" }, { id: "snapshots", label: "Snapshot recovery" },
  { id: "testing", label: "Golden failure stream" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Resilience architecture" }, { id: "agent", label: "Resilience Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function PipelineResilienceArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>At 10:00, 200 payment events per second meet 220 events per second of consumer capacity. At 10:15, upstream retry traffic pushes arrival to 600 while capacity stays 220. By 10:25, payment state is nine minutes stale—but collections APIs still return HTTP 200 and health checks remain green.</p>
    <div className={styles.incident}><span><b>10:00</b>λ = 200/s<br/>μ = 220/s</span><i>retry burst</i><span><b>10:15</b>λ = 600/s<br/>μ = 220/s</span><i>queue grows</i><strong><b>10:25</b>STATE 9 MIN STALE<br/>API STILL GREEN</strong></div>
    <Formula label="Backpressure"><span>λ<sub>in</sub> &gt; μ<sub>out</sub>; dQ/dt = λ<sub>in</sub> − μ<sub>out</sub></span></Formula>
    <KeyObservation title="The dangerous failure"><p><strong>Healthy-looking infrastructure can serve stale financial truth.</strong> A real-time platform is safe only when it knows—and exposes—when it is no longer real time.</p></KeyObservation>
  </section>

  <section id="lag"><h2>Oldest critical event age matters more than queue depth alone</h2>
    <p>Ten thousand events can be harmless at high throughput; one hundred can be dangerous when the oldest payment is 30 minutes old.</p>
    <Formula label="Time-based consumer lag"><span>ConsumerLag = T<sub>now</sub> − T<sub>oldest unprocessed</sub></span></Formula>
    <ResourceTable caption="Lag must be decision-aware" headers={["Event","Illustrative lag","Potential impact"]} rows={[
      ["CRM_CONTACT_UPDATED","30 minutes","Possibly tolerable for some paths"], ["PAYMENT_SETTLED","30 minutes","Collections suppression may be unsafe"],
      ["DRAWDOWN","10 minutes","Exposure and available credit may be stale"], ["DPD_CHANGED","10 minutes","EWS/collections state may lag"],
    ]} />
    <Formula label="Decision safety condition"><span>Lag<sub>critical event</sub> ≤ Budget<sub>D</sub></span></Formula>
    {code(`type StateFreshness = {
  component: string;
  effectiveAsOf: Date;
  availableAsOf: Date;
  status: "FRESH" | "STALE" | "UNKNOWN";
};`)}
    <KeyObservation title="Availability without freshness"><p><strong>Availability without freshness can be a failure mode.</strong> Decision engines consume both the value and its health.</p></KeyObservation>
  </section>

  <section id="degradation"><h2>Degrade decisions deliberately and by dependency</h2>
    <ResourceTable caption="Decision modes under stale critical state" headers={["Mode","Meaning","Engineering behaviour"]} rows={[
      ["NORMAL","All critical inputs within budget","Execute standard versioned path"], ["DEGRADED","Approved fallback exists","Record mode, stale components and fallback version"],
      ["REFER","Automation cannot decide safely","Route to governed alternate process"], ["SUSPEND","Action must not execute","Fail closed for that decision path"],
    ]} />
    <p>A fallback hierarchy might use fresh real-time state, a recent reconciled batch snapshot, an approved conservative rule, then manual review—but only where policy permits. A 06:00 exposure snapshot may support low-risk monitoring yet be unacceptable for a limit increase.</p>
    <p>Dependency-aware degradation keeps unaffected decisions alive: fresh payment and DPD may permit collections suppression even if a slower behavioural feature is stale. Do not take the whole platform offline for an unrelated dependency.</p>
  </section>

  <section id="retries"><h2>Retries must relieve transient failure—not amplify it</h2>
    <ResourceFigure label="Retry amplification is a positive feedback loop." caption="Unbounded immediate retry turns one downstream failure into additional load and more failure."><div className={styles.retry}>{["FAILURE","RETRY","ADDED LOAD","MORE FAILURE"].map((x,i)=><span key={x}>{x}{i<3?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <Formula label="Bounded backoff"><span>Delay<sub>n</sub> = min(D<sub>max</sub>, D₀ × 2ⁿ) + jitter</span></Formula>
    <ResourceTable caption="Failure classification" headers={["Class","Treatment"]} rows={[
      ["Transient","Bounded retry with exponential backoff and jitter"], ["Permanent invalid","Quarantine with reason and lineage"],
      ["Unknown","Bounded retry, then isolate and investigate"], ["Poison event","Prevent repeated consumer crash; quarantine where economically safe"],
    ]} />
    {code(`type QuarantinedEvent = {
  eventId: string;
  reason: string;
  failedAt: Date;
  retryCount: number;
};`)}
    <p>Never discard financial events silently. If E<sub>k+1</sub> depends on quarantined E<sub>k</sub>, mark that facility/account <code>STATE_INCOMPLETE</code> rather than applying later effects into an invalid sequence.</p>
  </section>

  <section id="priority"><h2>Limit blast radius and prioritise by decision dependency</h2>
    <p>One bad account should not halt the institution. Partition by aggregate where possible, isolating incomplete state while unrelated facilities continue.</p>
    <div className={styles.priority}><article><b>CRITICAL</b><p>Payments · drawdowns · reversals</p></article><article><b>HIGH</b><p>DPD transitions · limit changes</p></article><article><b>LOWER</b><p>Non-critical metadata</p></article></div>
    <p>Priority is illustrative and cannot ignore prerequisites: an identity event may control which facility belongs to a high-impact decision. Follow Event → State → Decision dependencies, not labels alone.</p>
    <p>Under load, defer non-critical processing; never equate load shedding with event loss. Give live traffic protected pools/quotas and throttle replay so historical rebuild cannot starve current financial events.</p>
  </section>

  <section id="commit"><h2>A broker checkpoint is not automatically a financial-state commit</h2>
    <Formula label="Commit boundary"><span>OffsetCommitted ≠ FinancialStateCommitted</span></Formula>
    <ResourceTable caption="Two dangerous failure windows" headers={["Sequence","Risk","Control"]} rows={[
      ["State commits → process crashes → offset not committed","Redelivery applies effect twice","Idempotent event/effect identity"],
      ["Offset commits → state transaction fails","Event may be skipped","Atomic claim/state/status or detectable reliable pattern"],
    ]} />
    <p>Where possible, claim event, mutate state and persist processing status atomically. Across systems, use inbox/outbox or equivalent reliable patterns. A checkpoint records offset, state version and processing time, but correctness depends on their transactional relationship.</p>
  </section>

  <section id="recovery"><h2>Recovery ends after catch-up, reconciliation and decision revalidation—not restart</h2>
    <ResourceFigure label="Deterministic recovery timeline." caption="Automated decisions remain guarded until backlog drains, state and features catch up, reconciliation clears and affected decisions are identified."><div className={styles.timeline}>{["FAILURE","DEGRADED MODE","RESTART","IDEMPOTENT REPLAY","CATCH-UP","RECONCILE","REVALIDATE DECISIONS","NORMAL MODE"].map((x,i)=><span key={x}>{x}{i<7?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <Formula label="Net drain rate"><span>NetDrainRate = μ<sub>out</sub> − λ<sub>in</sub> &gt; 0</span></Formula>
    <Formula label="Approximate catch-up time"><span>T<sub>catchup</sub> = Backlog / NetDrainRate</span></Formula>
    <p>Autoscaling helps compute bottlenecks but not database locks, external latency or hot partitions. Monitor freshness per partition; global averages hide one high-volume facility serialising its ordered events.</p>
    <p>Replay may pause live on an affected partition or merge backlog/live under strict ordering. Both are valid trade-offs; neither may violate aggregate causality.</p>
  </section>

  <section id="health"><h2>Transport health, data health and decision health are distinct</h2>
    <ResourceTable caption="Four-layer health model" headers={["Layer","Question"]} rows={[
      ["Source health","Is upstream producing complete, valid events?"], ["Pipeline health","Are events durably ingested and processed?"],
      ["State health","Is derived state coherent, complete and current?"], ["Decision health","Are decisions using inputs within their budgets?"],
    ]} />
    <p>A circuit breaker can stop hammering a failing dependency, but it cannot detect a successful response containing stale data. Heartbeats can distinguish true business silence from source outage. Incomplete feature windows must return <code>INCOMPLETE</code>, never a normal scalar without warning.</p>
    <Formula label="End-to-end staleness"><span>L<sub>total</sub> = L<sub>ingestion</sub> + L<sub>state</sub> + L<sub>feature</sub> + L<sub>decision</sub></span></Formula>
    <p>The slowest critical dependency dominates decision freshness. Define budgets by path—Payment → Collections, Drawdown → Exposure, DPD → EWS—not one platform-wide SLA.</p>
  </section>

  <section id="revalidation"><h2>Backlog catch-up can reveal decisions made on incomplete state</h2>
    <p>If the payment stream lagged from 10:15 to 10:42, identify payment-dependent decisions in that interval. Reconstruct state as known during the incident and corrected state after recovery, then compare outcomes.</p>
    <div className={styles.revalidation}><span>INCIDENT WINDOW</span><b>→</b><span>IMPACTED ENTITIES</span><b>→</b><span>RESTATED STATE</span><b>→</b><span>COUNTERFACTUAL DECISION</span><b>→</b><strong>IMPACT CLASSIFICATION</strong></div>
    <Formula label="Business-level reliability"><span>StaleDecisionRate = DecisionsUsingOutOfBudgetInputs / TotalDecisions</span></Formula>
    <p>Incident materiality depends on lag, exposure, decision count, decision delta and action impact. Do not automatically reverse historical actions; prepare evidence for governance.</p>
    <ResourceTable caption="Recovery gate" headers={["Gate","Proof"]} rows={[
      ["Backlog","Within normal operating range"], ["Freshness","Critical state and features caught up"],
      ["Replay","Errors and quarantined dependencies resolved"], ["Reconciliation","Recovered state matches authority at aligned cut-off"],
      ["Decision impact","Affected decision population identified"],
    ]} />
  </section>

  <section id="snapshots"><h2>Snapshots accelerate replay but do not become truth</h2>
    <Formula label="Snapshot recovery"><span>State<sub>n</sub> = Snapshot<sub>k</sub> + Events<sub>k+1:n</sub></span></Formula>
    <p>Verify snapshot version and integrity. If corrupted, replay from an earlier valid point. Recover one affected aggregate instead of the whole portfolio where possible.</p>
    <p>Durable event history is a business control: without it, deterministic recovery is impossible. Recovery-point and recovery-time goals are decision-specific; collections suppression may tolerate less delay than monthly ECL.</p>
  </section>

  <section id="testing"><h2>A golden failure stream tests the failure windows—not only the happy path</h2>
    <ResourceTable caption="Deterministic resilience test suite" headers={["Test","Expected proof"]} rows={[
      ["Burst","Lag rises, events remain durable, degradation activates"], ["Sustained overload","Catch-up plan and freshness guards remain explicit"],
      ["Retry storm","Backoff/jitter prevent retry amplification"], ["Poison event","Quarantine limits blast radius and marks dependent aggregate incomplete"],
      ["Checkpoint crash","Crash after state commit causes no duplicate financial effect"], ["Stale decision","Held payment consumer blocks/degrades collections according to policy"],
      ["Live + replay","Replay capacity never starves critical live traffic"], ["Recovery replay","Final state equals full deterministic replay"],
      ["Incident impact","Decisions in stale interval compare with corrected state"], ["Recovery gate","Normal mode returns only after all gates pass"],
    ]} />
    <p>The golden sequence includes normal payments, slowdown, growing backlog, a duplicate, a poison event, restart, replay, catch-up and reconciliation. Expected outcomes include no loss, no duplicate financial effect and a visible stale-state guard.</p>
  </section>

  <section id="observability"><h2>Technical green can still mean business red</h2>
    <div className={styles.metrics}>{["QueueDepth","OldestEventAge","ConsumerLag","RetryRate","QuarantineRate","CatchUpRate","StaleDecisionRate","ReplayFailureRate","RecoveryReconciliationDifference"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Monitor p50, p95, p99 and maximum event-to-state latency by event type, source, partition and decision consumer. Prioritise alerts by decision-impact potential, not every lag equally.</p>
    <p>A broker can be healthy while the payment source has stopped, risk state is stale and decisions are wrong. Business observability must link infrastructure lag to financial state and affected decisions.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture protects decisions while the pipeline recovers</h2>
    <ResourceFigure label="Entimema financial event pipeline resilience architecture." caption="Durable ingestion and priority processing feed state under freshness guards, while the parallel control path detects lag, degrades decisions, replays deterministically, reconciles and revalidates impact."><div className={styles.architecture}><div>{["SOURCES","DURABLE INGESTION","PRIORITY QUEUE / BUFFER","CONSUMERS","STATE / FEATURE LAYERS","FRESHNESS GUARD","DECISION ENGINE"].map((x,i)=><span key={x}>{x}{i<6?<b>↓</b>:null}</span>)}</div><i>PARALLEL CONTROL PATH</i><div>{["LAG / HEALTH MONITORING","DEGRADATION CONTROLLER","REPLAY / RECOVERY","RECONCILIATION","DECISION REVALIDATION"].map((x,i)=><span key={x}>{x}{i<4?<b>↓</b>:null}</span>)}</div></div></ResourceFigure>
    <EntimemaFramework title="Detect → Protect → Recover → Reconcile → Resume" steps={["Detect lag", "Identify critical decision dependencies", "Expose state freshness", "Degrade deliberately", "Protect event durability", "Isolate bad events", "Recover from checkpoint", "Replay idempotently", "Reconcile state", "Revalidate affected decisions", "Resume normal mode"]} />
  </section>

  <section id="agent"><h2>A Risk Infrastructure Resilience Agent can diagnose recovery without altering financial state</h2>
    <p>A controlled agent can monitor lag and backpressure, identify decision paths outside freshness budgets, classify bottlenecks and retry amplification, detect poison patterns, track catch-up, compare replayed with authoritative state and identify decisions requiring revalidation.</p>
    <KeyObservation title="Bounded role"><p><strong>Pipeline resilience + freshness protection + recovery validation + decision-impact diagnostics.</strong> It prepares evidence for engineering and risk incident review; it must not autonomously alter customer decisions or financial state.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Preserve durable events, state lineage and reconciliation evidence.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Apply freshness guards and explicit degradation modes.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Quantify stale-state decision and incident materiality.</Link></p></article></div>
    <p>Continue with <Link href="/resources/event-driven-decision-triggers-lending-systems">Event-Driven Decision Triggers</Link>, <Link href="/resources/real-time-utilisation-exposure-monitoring">Real-Time Utilisation and Exposure Monitoring</Link>, <Link href="/resources/streaming-behavioural-features-early-warning">Streaming Behavioural Features</Link>, <Link href="/resources/batch-etl-event-driven-credit-risk-architecture">From Batch ETL to Event-Driven Credit Risk Architecture</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Payment and Credit Event Processing</Link> and <Link href="/resources/late-arriving-events-backdated-corrections">Late-Arriving Events and Backdated Corrections</Link>. Silent schema detection, real-time collections state and decision-system observability remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>When the pipeline falls behind, preserve financial truth, expose staleness, recover without duplicate effects and prove which decisions were affected.</strong></p></KeyObservation>
  </section>
</div>; }
