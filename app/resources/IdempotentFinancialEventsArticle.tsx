import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./idempotent-financial-events.module.css";

export const idempotentFinancialEventsSections = [
  { id: "failure", label: "The duplicate failure" }, { id: "effect", label: "Delivery vs effect" },
  { id: "identity", label: "Event identity" }, { id: "consumer", label: "Atomic consumer" },
  { id: "boundaries", label: "Failure boundaries" }, { id: "inbox-outbox", label: "Inbox and outbox" },
  { id: "retry", label: "Retry and replay" }, { id: "side-effects", label: "External effects" },
  { id: "financial", label: "Financial semantics" }, { id: "files", label: "Files and snapshots" },
  { id: "concurrency", label: "Versions and ordering" }, { id: "case", label: "End-to-end case" },
  { id: "testing", label: "Failure testing" }, { id: "observability", label: "Observability" },
  { id: "framework", label: "Engineering framework" }, { id: "agent", label: "Processing Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function IdempotentFinancialEventsArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A consumer receives payment <code>pmt_55192</code>, applies €500 to a loan and crashes before acknowledging the message. The source retries. One real payment now threatens to create €1,000 of state effect.</p>
    {code(`{
  "sourceEventId": "pmt_55192",
  "accountId": "acc_1042",
  "amountMinor": 50000,
  "currency": "EUR"
}`)}
    <ResourceFigure label="One economic payment delivered repeatedly but applied once." caption="Delivery is an infrastructure occurrence. Financial effect is a business invariant."><div className={styles.effectDiagram}><span>1 ECONOMIC EVENT</span><b>→</b><div><i>DELIVERY 1</i><i>DELIVERY 2</i><i>DELIVERY N</i></div><b>→</b><span>1 STATE EFFECT</span></div></ResourceFigure>
    <p>Without protection, the balance is wrong, cure and DPD may be false, behavioural features change, collections can stop incorrectly and servicing no longer reconciles. This is not merely a repeated message. It is corrupted lending state.</p>
    <KeyObservation title="The central thesis"><p><strong>Duplicate delivery is normal. Duplicate economic effect is not.</strong> The same business event may be received many times, but must change financial state only once.</p></KeyObservation>
  </section>

  <section id="effect"><h2>Exactly-once delivery is not the financial objective</h2>
    <div className={styles.metrics}><Formula label="Delivery and occurrence"><span>DeliveryCount(E) = n; EconomicOccurrence(E) = 1</span></Formula><Formula label="Idempotent handling"><span>F(F(S,E),E) = F(S,E)</span></Formula></div>
    <p>The handler must produce one complete business effect; every low-level write need not be naturally idempotent. Network timeouts, consumer crashes, producer retries, queue redelivery, batch resends, API retries, disaster recovery and manual replay ensure that <strong>DuplicateDelivery &gt; 0</strong> eventually.</p>
    <div className={styles.dual}><article><b>EXACTLY-ONCE DELIVERY</b><p>An infrastructure claim whose boundary may not include the business database or external action.</p></article><article><b>EXACTLY-ONCE EFFECT</b><p>A business invariant achieved through at-least-once delivery, stable identity, idempotent consumers and transactional persistence.</p></article></div>
    <p>Broker offsets and checkpoints record delivery progress. They do not, by themselves, prove a payment changed the balance exactly once.</p>
  </section>

  <section id="identity"><h2>Deduplication starts with authoritative business identity</h2>
    <p>A canonical event should preserve <code>eventId</code>, <code>sourceSystem</code> and <code>sourceEventId</code>. An internal event ID identifies the canonical record; the source ID links repeated deliveries to one source fact.</p>
    {code(`// Unsafe: each retry becomes a new canonical identity.
const event = { eventId: randomUUID(), ...sourcePayload };

// Conceptual stable source-scoped key.
function idempotencyKey(event: SourceEvent): string {
  return event.sourceSystem + ":" + event.sourceEventId;
}`)}
    <p>The key must be deterministic across retries, scoped to the domain where the source identifier is unique and collision-resistant for real business events. <code>12345</code> may be unique only within one provider; source scope is therefore material.</p>
    <ResourceTable caption="Entimema event-identity hierarchy" headers={["Level","Evidence","Control posture"]} rows={[
      ["1","Authoritative source event ID","Use source-scoped stable identity"],
      ["2","Stable source document or business key","Validate uniqueness contract and lifecycle"],
      ["3","Controlled deterministic composite","Measure collision risk and retain components"],
      ["4","Unresolved identity","Quarantine material events for reconciliation"],
    ]} />
    <p>A fingerprint such as <code>hash(source, account, amount, currency, eventTime, reference)</code> can be evidence where no source ID exists, but two legitimate payments may share those values. False suppression loses a real payment and is as dangerous as duplicate application. Do not manufacture certainty at lower identity levels.</p>
    <h3>Commands and events need distinct semantics</h3>
    <p>A command asks to create a payment; an event states that a payment settled. An API command may accept an <code>Idempotency-Key</code> so a client retry refers to the same created operation. The resulting event still needs stable consumer identity. Producer controls help, but every state-changing consumer remains a final protection boundary.</p>
  </section>

  <section id="consumer"><h2>Check-then-write is a concurrency bug</h2>
    {code(`async function handle(event: FinancialEvent) {
  await applyToLoanState(event);
  await markProcessed(event.eventId);
}`)}
    <p>If state application succeeds and the process dies before <code>markProcessed</code>, retry applies the event twice. A preliminary <code>SELECT</code> is also unsafe: workers A and B can both observe absence before either inserts.</p>
    <ResourceFigure label="Two workers race after independently checking for a duplicate." caption="Application-level check-then-insert has a time-of-check/time-of-use gap. Database uniqueness must arbitrate the claim."><div className={styles.race}><div><b>WORKER A</b><span>CHECK · ABSENT</span><span>APPLY €500</span></div><div><b>WORKER B</b><span>CHECK · ABSENT</span><span>APPLY €500</span></div><strong>DUPLICATE EFFECT</strong></div></ResourceFigure>
    {code(`CREATE TABLE processed_events (
  consumer_name   TEXT NOT NULL,
  source_system   TEXT NOT NULL,
  source_event_id TEXT NOT NULL,
  processed_at    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (consumer_name, source_system, source_event_id)
);`)}
    {code(`INSERT INTO processed_events (
  consumer_name, source_system, source_event_id, processed_at
)
VALUES ($1, $2, $3, NOW())
ON CONFLICT DO NOTHING
RETURNING source_event_id;`)}
    <p>If no row returns, this consumer already claimed the event. Other SQL dialects use different conflict or merge syntax; the requirement is one atomic uniqueness operation backed by a constraint.</p>
    {code(`await db.transaction(async (tx) => {
  const claimed = await tx.processedEvents.insertIfAbsent({
    consumerName: "account-state-v3",
    sourceSystem: event.sourceSystem,
    sourceEventId: event.sourceEventId
  });
  if (!claimed) return;
  await applyEventToState(tx, event);
});`)}
    <p>The unique claim and complete financial mutation share one transaction. Either both commit or neither does.</p>
  </section>

  <section id="boundaries"><h2>Transaction order determines the failure window</h2>
    <ResourceTable caption="Unsafe split-transaction sequences" headers={["Sequence","Failure","Result on retry"]} rows={[
      ["Dedupe record commits first","State mutation fails","Retry skips a missing financial effect"],
      ["State mutation commits first","Dedupe record fails","Retry applies the financial effect twice"],
    ]} />
    <Formula label="Preferred local consistency boundary"><span>BEGIN → claim event → mutate complete financial state → COMMIT</span></Formula>
    <ResourceFigure label="Crash windows around one atomic consumer transaction." caption="Before commit, rollback permits retry. After commit but before acknowledgement, the duplicate claim converts redelivery into a no-op."><div className={styles.windows}>{[["A","BEFORE TX","Nothing committed · retry applies"],["B","INSIDE TX","Atomic rollback · retry applies"],["C","AFTER COMMIT / BEFORE ACK","Claim exists · retry suppresses"]].map(([n,h,p])=><article key={n}><b>WINDOW {n}</b><strong>{h}</strong><span>{p}</span></article>)}</div></ResourceFigure>
    <p>When the event store, state database and broker are separate systems, one local ACID transaction cannot cover all three. Reliable architecture then narrows the atomic boundary and uses durable handoff patterns rather than pretending a distributed commit occurred.</p>
  </section>

  <section id="inbox-outbox"><h2>Inbox and outbox close different reliability gaps</h2>
    <EntimemaFramework title="Entimema idempotent processing architecture" steps={["Producer / source", "Message / file / API", "Canonical event", "Inbox / idempotency boundary", "Unique event claim", "Transactional state mutation", "Outbox", "Downstream actions", "Acknowledgement"]} />
    {code(`CREATE TABLE event_inbox (
  consumer_name   TEXT NOT NULL,
  source_system   TEXT NOT NULL,
  source_event_id TEXT NOT NULL,
  payload         JSONB NOT NULL,
  received_at     TIMESTAMPTZ NOT NULL,
  processed_at    TIMESTAMPTZ,
  PRIMARY KEY (consumer_name, source_system, source_event_id)
);`)}
    <p>The consumer inbox durably stores delivery under a unique business identity. Local processing can then mutate consumer state and mark the inbox row processed inside one database transaction.</p>
    {code(`CREATE TABLE event_outbox (
  event_id      TEXT PRIMARY KEY,
  aggregate_id  TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  payload       JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL,
  published_at  TIMESTAMPTZ
);`)}
    <p>The producer writes domain state and its publication intent together; a publisher sends unsent rows. This prevents “business state committed, event lost.” It does not remove consumer idempotency because publication may repeat after an uncertain acknowledgement.</p>
  </section>

  <section id="retry"><h2>Retry count must not affect financial state</h2>
    <Formula label="Retry invariant"><span>FinalState(attempt 1) = FinalState(attempt 10)</span></Formula>
    <p>Retry transient timeouts and temporary database failures with bounded backoff. Route invalid schemas and impossible references to controlled failure or quarantine; endless retry does not repair permanent data. Unknown failures require evidence and investigation.</p>
    <h3>Replay has a destination and a purpose</h3>
    <ResourceTable caption="Replay semantics" headers={["Replay","Idempotency posture","Purpose"]} rows={[
      ["New projection from empty state","Apply every source event once in the new consumer namespace","Rebuild or new analytical consumer"],
      ["Existing production projection","Existing claims suppress already-applied events","Recovery without duplicate state"],
      ["Controlled simulation","Isolated namespace and state","Testing or counterfactual analysis"],
    ]} />
    <p>One canonical event may feed account, collections and feature projections. Idempotency is therefore often <code>(consumer, event)</code>, not a global “processed somewhere” flag. Consumer A completing must never cause Consumer B to skip its legitimate projection work. Dedupe records must also outlive plausible late retry, replay and audit horizons; no universal retention period fits every source.</p>
  </section>

  <section id="side-effects"><h2>An idempotent database update can still send two customer actions</h2>
    <p>Email, collections messages, API calls and payment instructions may sit outside the database transaction. Give each outgoing economic action a stable <code>actionId</code> or <code>decisionId</code>, persist execution state under a unique constraint and require downstream retry recognition where possible.</p>
    {code(`actionId = "collections_notification:dec_8821"`)}
    <p>If the same state triggers recalculation twice, distinguish model recomputation, a genuinely new decision and re-execution of the existing action. A conceptual decision identity might include account, decision type, trigger event and strategy version—but only where those fields match the business lifecycle.</p>
    {code(`CREATE TABLE executed_actions (
  action_id    TEXT PRIMARY KEY,
  action_type  TEXT NOT NULL,
  executed_at  TIMESTAMPTZ NOT NULL
);`)}
    <KeyObservation><p>Test the full business effect. <code>SET status = &apos;CLOSED&apos;</code> may be naturally idempotent while its audit event and notification still duplicate.</p></KeyObservation>
  </section>

  <section id="financial"><h2>Protect the whole allocation, not just the input message</h2>
    <p>One €500 payment can allocate €50 to fees, €100 to interest and €350 to principal. The idempotency boundary must protect the complete allocation transaction. A crash after principal but before interest cannot be recovered safely by re-running untracked additive writes.</p>
    <Formula label="Balanced posting invariant"><span>Σ Debit = Σ Credit within the relevant accounting scope</span></Formula>
    <p>Event infrastructure does not replace a ledger. It preserves identity and delivery evidence while servicing and accounting enforce their own balanced, controlled mutations.</p>
    <p>A reversal has its own stable identity and a <code>reversalOf</code> relationship. It must also be idempotent: duplicate delivery of a reversal must not reverse twice. Do not dedupe it merely because it references the original; different corrections can legitimately refer to the same event.</p>
    <Formula label="Full reversal invariant"><span>Effect(E) + Effect(R(E)) = 0 for the defined state dimension</span></Formula>
  </section>

  <section id="files"><h2>Streams, files and snapshots require different layers</h2>
    <ResourceTable caption="Source-specific idempotency" headers={["Input","Controls","Important limitation"]} rows={[
      ["Webhook / message","Source-scoped event key and consumer inbox","Provider retries after timeout are expected"],
      ["Batch file","File checksum plus row business identity","A corrected file must not be discarded as an exact duplicate"],
      ["Snapshot","Version/cut-off identity and desired-state semantics","Snapshot is not an additive event"],
    ]} />
    <p>An identical balance snapshot can be harmless when handling means <code>SET balance = 500</code>, while <code>balance += 500</code> is not. Likewise, “set limit to €5,000” is easier to retry safely than “increase limit by €1,000” where business semantics permit an absolute desired-state command. The analogy resembles PUT versus POST, but HTTP method labels alone do not establish financial idempotency.</p>
  </section>

  <section id="concurrency"><h2>Idempotency, ordering, finality and immutability solve different problems</h2>
    {code(`UPDATE loan_state
SET balance_minor = $1,
    version = version + 1
WHERE account_id = $2
  AND version = $3;`)}
    <p>If zero rows update, the aggregate changed concurrently. Expected-version control is an additional safeguard for sequence and concurrency; it is not a replacement for event identity.</p>
    <ResourceTable caption="Do not collapse the controls" headers={["Control","Question"]} rows={[
      ["Idempotency","Was the same event applied more than once?"], ["Ordering","Were different events applied in the required sequence?"],
      ["Finality","Can a unique processed event still be reversed or superseded?"], ["Immutability","Can we retain evidence of what occurred?"],
      ["Deduplication","Which mechanism identifies a repeated delivery?"],
    ]} />
    <p>A payment and reversal can each apply once but in the wrong order. A unique payment can later be legitimately reversed. Immutable history records both; idempotency prevents either effect from multiplying.</p>
  </section>

  <section id="case"><h2>One provider payment, two deliveries, one €250 effect</h2>
    {code(`{
  "sourceSystem": "payment-provider",
  "sourceEventId": "pmt_10001",
  "eventType": "PAYMENT_SETTLED",
  "accountId": "acc_4002",
  "amountMinor": 25000,
  "currency": "EUR"
}`)}
    <div className={styles.dual}><article><b>UNSAFE CONSUMER</b><p>Delivery one reduces balance by €250. ACK times out. Delivery two generates a new UUID and reduces balance again.</p></article><article><b>SAFE CONSUMER</b><p>Delivery one inserts the inbox identity and applies €250 atomically. Delivery two hits the same unique key and makes no state change.</p></article></div>
    <p>If the worker crashes inside the transaction, claim and mutation roll back together; retry performs both. If it crashes after commit but before ACK, retry finds the committed claim and returns success without mutation. Correctness no longer depends on the exact crash instant.</p>
  </section>

  <section id="testing"><h2>Inject duplicates and crashes where production will</h2>
    <Formula label="Duplicate-injection property"><span>State(E₁:ₙ) = State(DuplicateInjected(E₁:ₙ))</span></Formula>
    <p>For any valid ordered event stream, inserting arbitrary duplicate payments, fees, limit changes and reversals must leave the final state unchanged. This property catches paths missed by example-only testing.</p>
    <ResourceTable caption="Golden duplicate stream; all amounts fictional" headers={["Step","Event","Expected effect"]} rows={[
      ["1","Drawdown €1,000","Balance +€1,000"], ["2","Payment €300","Balance −€300"],
      ["3","Same payment duplicate","No effect"], ["4","Fee €10","Balance +€10"],
      ["5","Same fee duplicate","No effect"], ["6","Payment reversal","Balance +€300"],
      ["7","Same reversal duplicate","No effect; final balance €1,010"],
    ]} />
    <p>Crash-injection tests stop the worker before claim, after claim, after mutation, around commit and before acknowledgement. Where the claim and mutation are one transaction, intermediate failures roll back; after commit, redelivery suppresses. Add deliberate failure around outbox publication and external action execution.</p>
    <div className={styles.testGrid}>{["One payment affects exposure once","One reversal offsets once","Retry count never changes state","Duplicate creates no extra cure","Aggregate version progresses consistently","Notifications execute once"].map(x=><span key={x}>{x}</span>)}</div>
  </section>

  <section id="observability"><h2>Observe suppression, collision risk and reconciliation</h2>
    <div className={styles.metricGrid}>{["DuplicateDeliveryRate","DuplicateSuppressionRate","IdempotencyConflictRate","RetryRate","ProcessingFailureRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Some redelivery is normal in at-least-once systems. Investigate sudden change, concentration by source/event type/provider/time window, financial materiality or failed suppression—not a universal threshold.</p>
    <p>False suppression is harder to see. Audit collisions, suspicious same-key/different-payload cases and unresolved identities. Quarantine material ambiguity rather than guessing. Operational reconciliation should explain <strong>SourceEventCount → CanonicalUniqueEventCount → AppliedBusinessEventCount</strong>; financial reconciliation should connect unique settled payments to servicing application and accounting posting subject to timing and allocation differences.</p>
  </section>

  <section id="framework"><h2>Design every retry from the economic event outward</h2>
    <EntimemaFramework title="Entimema idempotency decision framework" steps={["Identify economic event", "Find stable identity", "Define idempotency scope", "Persist uniqueness atomically", "Apply complete business effect", "Make side effects idempotent", "Retry safely", "Replay safely", "Monitor and reconcile"]} />
    <p>Banks face batch resend, message redelivery and internal integration retries. API-first lenders face webhook retries whenever a response is uncertain. Legacy and cloud-native estates therefore share the same requirement: <strong>could this event arrive again after failure, and can we prove state and action remain correct?</strong></p>
  </section>

  <section id="agent"><h2>An Event Duplication &amp; Processing Integrity Agent can turn retries into evidence</h2>
    <p>A future controlled agent can monitor duplicate delivery, idempotency-key conflicts and retry patterns; attribute suppression by source; compare source, canonical and applied counts; identify likely false collisions or unsafe consumer sequences; reconstruct incident impact; and prepare evidence for human engineers.</p>
    <KeyObservation title="Bounded role"><p><strong>Processing-integrity observability + duplicate-impact analysis + engineering support.</strong> It must never delete, merge or alter financial events autonomously.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Correct balance, DPD, behavioural features and collections state.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Payment application, posting reconciliation and duplicate controls.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Reliable retries, event-driven workflows and safe action execution.</Link></p></article></div>
    <p>Continue with <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time in Credit Systems</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>, <Link href="/resources/why-batch-risk-is-becoming-a-business-risk">Why Batch Risk Is Becoming a Business Risk</Link> and <Link href="/resources/credit-risk-model-validation-pipeline">Credit Risk Model Validation Pipeline</Link>. Future Engineering work can develop account-state reconstruction, backdated corrections, reversals, DPD, event-driven triggers and historical replay; these are research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Let infrastructure deliver again. Make stable identity, atomic persistence and replay-safe actions prove that the business effect happened once.</strong></p></KeyObservation>
  </section>
</div>; }
