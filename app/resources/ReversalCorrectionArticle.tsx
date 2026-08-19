import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./reversal-correction.module.css";

export const reversalCorrectionSections = [
  { id: "failure", label: "The deletion failure" }, { id: "semantics", label: "Reversal semantics" },
  { id: "causality", label: "Causal event graph" }, { id: "allocation", label: "Allocation restoration" },
  { id: "state", label: "State compensation" }, { id: "dpd", label: "DPD and cure" },
  { id: "risk", label: "Risk and recovery" }, { id: "accounting", label: "Accounting reconciliation" },
  { id: "ordering", label: "Ordering and orphans" }, { id: "atomicity", label: "Atomic processing" },
  { id: "replay", label: "Replay and decisions" }, { id: "case", label: "Golden reversal stream" },
  { id: "testing", label: "Testing architecture" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Reversal architecture" }, { id: "agent", label: "Correction Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function ReversalCorrectionArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A borrower pays €500. The account becomes current and collections stops. Two days later the payment reverses. Deleting the payment or silently setting its amount to zero may repair today&apos;s balance—but it destroys the explanation of everything that happened between.</p>
    {code(`DELETE FROM payments
WHERE payment_id = 'pmt_501';

-- Equally unsafe without preserved lineage:
UPDATE payments SET amount_minor = 0
WHERE payment_id = 'pmt_501';`)}
    <p>The institution loses the original payment, the cure, the collections hold, the reversal timing and the reason delinquency reopened.</p>
    <Formula label="Compensating history"><span>History = {'{'} E, R(E) {'}'}; not ∅</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>A reversal is a new financial event, not permission to delete history.</strong> The economic effect can cancel; the event and the decisions it caused must remain.</p></KeyObservation>
  </section>

  <section id="semantics"><h2>Compensation records that an event happened and was later undone</h2>
    <Formula label="Full compensation principle"><span>Effect(E) + Effect(R(E)) = 0 for the relevant state dimension</span></Formula>
    <div className={styles.dual}><article><b>DELETION</b><p>Pretends the economic event never occurred and leaves intermediate decisions inexplicable.</p></article><article><b>COMPENSATION</b><p>Preserves the original fact, the later undoing, their timing and causal relationship.</p></article></div>
    {code(`type ReversalEvent = {
  eventId: string;
  eventType: "PAYMENT_REVERSED";
  reversalOf: string;
  amountMinor: bigint;
  effectiveTime: Date;
  reasonCode?: string;
};`)}
    <p>Causal linkage is as important as amount. Do not mutate <code>PAYMENT_SETTLED</code> into <code>PAYMENT_FAILED</code> when it genuinely settled and later reversed: those are two economic events.</p>
    <ResourceTable caption="Reversal and correction semantics" headers={["Event","Meaning","State treatment"]} rows={[
      ["Full reversal","Cancels the remaining original effect","Restore the complete realised allocation"],
      ["Partial reversal","Cancels part of the original effect","Restore only causally specified components"],
      ["Chargeback lifecycle","Dispute/recovery process with its own states","Keep dispute state separate from financial reversal"],
      ["Correction","Original attributes were wrong","Compensate old effect and emit correct replacement where needed"],
      ["Pending reversal","Potential future reversal","Do not undo until the governed economic state is reached"],
    ]} />
  </section>

  <section id="causality"><h2>Corrections form a graph, not merely a chronological list</h2>
    <ResourceFigure label="Causal event graph for payment, reversal and correction." caption="Typed edges distinguish reversal, supersession and correction; branches can represent partial compensation while history stays immutable."><div className={styles.graph}><span>PAYMENT A</span><b>reversed by ↓</b><span>REVERSAL B</span><b>corrected by ↓</b><span>CORRECTION C</span><div><i>PARTIAL R₁</i><i>PARTIAL R₂</i></div></div></ResourceFigure>
    <p>Use different relations such as <code>reversalOf</code>, <code>supersedesEventId</code>, <code>corrects</code>, <code>allocates</code> and <code>derivedFrom</code>; one overloaded parent field hides meaning. Prevent causal cycles such as A reverses B while B reverses A unless domain semantics explicitly support them.</p>
    <p>A wrong-account correction must retain: original application to Account A, reversal from A, and corrected application to Account B. Mutating <code>account_id</code> would silently change both accounts&apos; DPD, collections history, features, statements and reconciliation before the institution knew of the error.</p>
    <EntimemaFramework title="Correction workflow" steps={["Detect", "Validate", "Emit correction", "Restate state", "Rebuild dependencies", "Preserve historical decisions", "Reconcile"]} />
  </section>

  <section id="allocation"><h2>Reverse what actually happened—not what today&apos;s rules would allocate</h2>
    <p>Suppose the €500 payment applied €50 to fees, €100 to interest and €350 to principal. Full reversal restores those exact components. Simply adding €500 to principal corrupts every component balance.</p>
    {code(`type AllocationComponent = {
  component: "FEE" | "INTEREST" | "PRINCIPAL";
  amountMinor: bigint;
};

type CompensationRecord = {
  originalEventId: string;
  compensatingEventId: string;
  compensatedMinor: bigint;
  remainingReversibleMinor: bigint;
};`)}
    <KeyObservation title="Allocation restoration"><p><strong>A reversal should undo the realised allocation, not recompute what allocation would happen under today&apos;s rules.</strong> Retain the original allocation and its rule version.</p></KeyObservation>
    <p>If a €500 payment is reversed by €150 then €200, €150 remains applied. Validate cumulative compensation so <strong>Σ Reversals ≤ Remaining Original Applied Amount</strong>. Partial restoration can be source-defined or component-specific; never invent proportional allocation without economic authority.</p>
  </section>

  <section id="state"><h2>The reducer restores components deterministically</h2>
    {code(`function reverseAllocation(
  state: LoanState,
  allocation: PaymentAllocation
): LoanState {
  return recalculate({
    ...state,
    feeBalanceMinor:
      state.feeBalanceMinor + allocation.feesAppliedMinor,
    accruedInterestMinor:
      state.accruedInterestMinor + allocation.interestAppliedMinor,
    principalMinor:
      state.principalMinor + allocation.principalAppliedMinor,
    version: state.version + 1
  });
}`)}
    <p>This illustration omits product-specific adjustments. The reducer loads the stored original allocation; it does not recalculate unrelated rules. Reopened principal may change interest base, exposure or later accruals, so compensation can trigger downstream recalculation beyond one monetary write.</p>
    <Formula label="Cumulative reversal concurrency invariant"><span>CumulativeReversedAmount ≤ OriginalAppliedAmount</span></Formula>
  </section>

  <section id="dpd"><h2>Rebuild DPD; never “set it back”</h2>
    <ResourceFigure label="Payment cure and reversal dependency chain." caption="A reversal restores contractual unpaid amounts; arrears and DPD are then derived from schedule and calendar state."><div className={styles.flow}>{["PAYMENT","ALLOCATION","ARREARS CLEARED","CURE","PAYMENT REVERSAL","ARREARS REOPEN","DPD RECALCULATED"].map((x,i)=><span key={x}>{x}{i<6?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <p>The unsafe operation is <code>DPD = previous_DPD</code>. Restore the actual payment allocation, rebuild remaining obligations, identify the oldest relevant unpaid due date, then calculate DPD using current approved calendar rules.</p>
    <div className={styles.dual}><article><b>REVERSED CURE</b><p>The curing payment was undone, often indicating returned or corrected payment processing.</p></article><article><b>RE-DEFAULT</b><p>The borrower genuinely cured and later deteriorated again through new behaviour.</p></article></div>
    <p>These paths are not methodologically interchangeable. A promise-to-pay that appeared kept may become reversed or not sustainably fulfilled; retain the original observation and later reversal rather than rewriting it.</p>
  </section>

  <section id="risk"><h2>Compensation propagates into risk, collections and recovery economics</h2>
    <ResourceTable caption="Downstream reversal impact" headers={["Domain","Potential change","Historical control"]} rows={[
      ["Collections","Reopen delinquency and reprioritise","Keep prior hold/contact actions immutable"],
      ["Behavioural features","Missed payment, payment ratio, cure and duration","Version rebuilt features; retain actual feature manifest"],
      ["Risk score","PD restated may differ from actual","Store counterfactual separately"],
      ["Recovery / LGD","Remove reversed realised recovery economics","Preserve cash-flow and reversal timing"],
      ["ECL","DPD, cure, EAD or stage inputs may change","Trace impact under governed reporting rules"],
    ]} />
    <p>A reversed recovery left in LGD data overstates recovery and understates loss. Yet the operational cash-flow event should not simply disappear. Model/accounting policy determines the treatment of original and reversed discounted recovery; the event layer supplies immutable timing and lineage.</p>
    <Formula label="Reversal materiality"><span>Materiality(R) = f(Amount, Exposure, StateDelta, DecisionDelta)</span></Formula>
  </section>

  <section id="accounting"><h2>The event layer reconciles to the ledger; it does not replace it</h2>
    <Formula label="Separation of authority"><span>Event Store ≠ General Ledger</span></Formula>
    <p>Canonical events explain operational and economic history. Accounting remains authoritative for ledger state through debit/credit, clearing and correcting entries. A timing interval where operational reversal state differs from posted accounting state can be legitimate when explicitly classified.</p>
    <EntimemaFramework title="Reversal reconciliation lifecycle" steps={["Reversal event", "Operational state restated", "Accounting posting", "Reconciliation match"]} />
    <p>Track original time, reversal time, posting time and risk-effective time. Collections may need governed early knowledge of likely reversal while monthly Finance waits for formal posting; finality is decision-specific, not one universal status.</p>
  </section>

  <section id="ordering"><h2>Out-of-order reversals wait for their causal parent</h2>
    <p>A reversal with no resolvable original is an <strong>orphan reversal</strong>. It may indicate delivery order, a missing source event or identity mismatch. Do not apply it blindly.</p>
    <div className={styles.queue}><span>REVERSAL WITH MISSING PARENT</span><b>→</b><span>UNRESOLVED DEPENDENCY QUEUE</span><b>→</b><span>WAIT / RETRY / RECONCILE</span></div>
    <p>When the parent arrives, resolve identity and causal linkage, then replay deterministically using effective time, causal order and source sequence where available. A correction to a reversal is another event: <strong>E → R(E) → C(R(E))</strong>.</p>
  </section>

  <section id="atomicity"><h2>Claim, validate, compensate and mutate in one boundary</h2>
    <p>Where possible, reversal processing atomically claims the reversal identity, validates the parent, updates cumulative compensation and updates account state. Two simultaneous partial reversals must not both observe the same remaining amount.</p>
    {code(`await db.transaction(async (tx) => {
  const claimed = await claimEvent(tx, reversal.eventId);
  if (!claimed) return;

  const original = await lockOriginalAllocation(tx, reversal.reversalOf);
  assertReversible(original, reversal.amountMinor);
  await recordCompensation(tx, original, reversal);
  await restoreAllocation(tx, original, reversal);
});`)}
    <p>Database constraints, row locks or expected-version updates enforce the cumulative invariant under concurrency. Duplicate reversal delivery then becomes a no-op instead of an impossible negative economic effect.</p>
  </section>

  <section id="replay"><h2>Backdated reversal repairs economics without changing what was known</h2>
    <p>A reversal effective yesterday but received today can invalidate a later snapshot. Rebuild <strong>State<sup>restated</sup></strong> from a safe boundary while retaining <strong>State<sup>known</sup></strong> for yesterday&apos;s actual decisions.</p>
    <p>Do not rewrite <code>CollectionsDecision = HOLD</code> because the reversal arrived later. Record that corrected state would have produced another action and classify impact: DPD changed, cure reversed, priority changed, PD changed or ECL input changed.</p>
    <Formula label="Snapshot replay parity"><span>State(snapshot + valid reversal tail) = State(full replay)</span></Formula>
  </section>

  <section id="case"><h2>A golden reversal stream proves component restoration</h2>
    <p>A fictional facility draws €5,000, charges a €50 fee and accrues €100 interest. A €500 payment allocates €50 fee, €100 interest and €350 principal, leaving €4,650 outstanding.</p>
    <ResourceTable caption="Golden reversal stream; all values fictional" headers={["Step","Event","Principal","Interest","Fee","Outstanding"]} rows={[
      ["1","Drawdown €5,000","€5,000","€0","€0","€5,000"], ["2","Fee €50","€5,000","€0","€50","€5,050"],
      ["3","Interest €100","€5,000","€100","€50","€5,150"], ["4","Payment €500","€4,650","€0","€0","€4,650"],
      ["5","Partial reversal €200 (restores fee €50, interest €100, principal €50)","€4,700","€100","€50","€4,850"],
      ["6","Duplicate delivery of reversal","€4,700","€100","€50","€4,850"],
      ["7","Second valid reversal €300 (restores remaining principal)","€5,000","€100","€50","€5,150"],
    ]} />
    <p>The final monetary state equals the state before the payment, while history contains payment, two valid compensation events and one suppressed duplicate delivery.</p>
    <Formula label="Full compensation test"><span>State(E, R(E)) = StateWithoutEconomicEffect(E), while EventHistory differs</span></Formula>
  </section>

  <section id="testing"><h2>Test the failure shapes, not only the happy-path balance</h2>
    <ResourceTable caption="Minimum reversal test architecture" headers={["Test","Proof"]} rows={[
      ["Full / partial reversal","Exact realised components restore"], ["Duplicate reversal","Effect occurs once"],
      ["Multiple partials","Cumulative amount stays within original"], ["Over-reversal","Reject or quarantine atomically"],
      ["Orphan / out of order","Wait; parent arrival enables deterministic replay"], ["Wrong-account correction","A reverses; B receives replacement"],
      ["Correction of correction","Causal chain remains complete"], ["After snapshot","Invalidate or use a prior safe snapshot"],
      ["Cure / DPD impact","Rebuild arrears and DPD, never restore cached value"],
    ]} />
    <p>Also inject duplicates of both original and reversal, compare snapshot-tail with full replay, verify allocation conservation after every step and assert that historical decisions remain unchanged.</p>
  </section>

  <section id="observability"><h2>Monitor reversal integrity and downstream materiality</h2>
    <div className={styles.metrics}>{["ReversalRate","ChargebackRate","OrphanReversalRate","CorrectionRate","ReversalProcessingLag","DecisionImpactRate"].map(x=><span key={x}>{x}</span>)}</div>
    <Formula label="Reversal age"><span>ReversalAge = T<sub>reversal</sub> − T<sub>original</sub></span></Formula>
    <p>No universal thresholds apply. Slice by source, event type, product, provider and reason. Long-lag reversals often reach deeper into cure history, recovery, model data and prior decisions. Repeated account-mapping or payment-type corrections reveal structural integration debt.</p>
  </section>

  <section id="architecture"><h2>The Entimema reversal architecture preserves causality end to end</h2>
    <ResourceFigure label="Entimema reversal, compensation and reconciliation architecture." caption="The causal resolver finds the original effect; the compensation engine restores realised allocation before downstream state and decisions are recalculated."><div className={styles.architecture}>{["ORIGINAL EVENT","ALLOCATION / STATE EFFECT","REVERSAL / CHARGEBACK / CORRECTION","CAUSAL RESOLVER","COMPENSATION ENGINE","STATE REPLAY / RECALCULATION","DPD / CURE / RISK STATE","ACCOUNTING RECONCILIATION","DECISION IMPACT"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Entimema reversal decision framework" steps={["Identify original event", "Validate causality", "Determine full / partial compensation", "Restore original allocation", "Recalculate derived state", "Rebuild dependencies", "Preserve decisions", "Reconcile", "Monitor"]} />
  </section>

  <section id="agent"><h2>A Reversal &amp; Correction Integrity Agent can validate compensation evidence</h2>
    <p>A future controlled agent can detect reversals, resolve parents, identify orphans, monitor cumulative compensation, reconstruct original allocation, compare pre/post state, trace DPD and cure changes, quantify recovery/LGD impact and reconcile operational with accounting correction state.</p>
    <KeyObservation title="Bounded role"><p><strong>Causal event integrity + compensation validation + downstream state-impact analysis.</strong> It must not autonomously mutate source transactions or accounting records.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">DPD, cure, behavioural PD and recovery-state correction.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Allocation trace, recovery economics and ledger reconciliation.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Current workflow correction with immutable historical decisions.</Link></p></article></div>
    <p>Continue with <Link href="/resources/late-arriving-events-backdated-corrections">Late-Arriving Events and Backdated Corrections</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State from Financial Events</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Payment and Credit Event Processing</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/cure-redefault-analytics-sustainable-recovery">Cure &amp; Re-Default Analytics</Link>, <Link href="/resources/promise-to-pay-analytics-collections">Promise-to-Pay Analytics</Link>, <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link> and <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>. A dedicated DPD engine and cross-function event reconciliation remain future research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Undo the realised economic effect through explicit compensation; retain the causal record that explains every balance, cure, recovery and decision made along the way.</strong></p></KeyObservation>
  </section>
</div>; }
