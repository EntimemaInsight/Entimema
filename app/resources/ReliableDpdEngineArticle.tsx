import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./reliable-dpd-engine.module.css";

export const reliableDpdEngineSections = [
  { id: "failure", label: "The DPD failure" }, { id: "schedule", label: "Schedule and due items" },
  { id: "allocation", label: "Payment allocation" }, { id: "derive", label: "Deriving DPD" },
  { id: "calendar", label: "Calendar and policy" }, { id: "payments", label: "Partial and excess payment" },
  { id: "cure", label: "Cure and reversal" }, { id: "temporal", label: "Known and restated DPD" },
  { id: "contract", label: "Contract changes" }, { id: "boundaries", label: "State boundaries" },
  { id: "implementation", label: "DPD implementation" }, { id: "golden", label: "Golden DPD streams" },
  { id: "testing", label: "Testing and migration" }, { id: "observability", label: "Reconciliation and observability" },
  { id: "architecture", label: "DPD architecture" }, { id: "agent", label: "DPD Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function ReliableDpdEngineArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A loan owes €500 on 1 August. The borrower pays €300 on 10 August and €200 on 20 August. At 31 August, is the account current, partially delinquent, cured—or 30 days past due?</p>
    <div className={styles.timeline}><article><b>01 AUG</b><span>€500 DUE</span></article><article><b>10 AUG</b><span>€300 PAYMENT</span></article><article><b>20 AUG</b><span>€200 PAYMENT</span></article><article><b>31 AUG</b><span>DERIVE STATE</span></article></div>
    <p>The answer depends on the due-item structure, allocation, effective dates, calendar, materiality and grace policy. A standalone <code>dpd</code> field cannot establish any of those semantics.</p>
    <Formula label="DPD is derived credit state"><span>DPD(T) = f(Schedule, Payments, Allocation, Adjustments, Calendar, T)</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Days Past Due is not a raw field.</strong> It is trustworthy only when contractual obligations and the exact events that satisfied—or reopened—them are reconstructible.</p></KeyObservation>
  </section>

  <section id="schedule"><h2>Start with versioned contractual obligations</h2>
    {code(`type DueItem = {
  dueItemId: string;
  dueDate: string;
  contractualAmountMinor: bigint;
  currency: string;
  scheduleVersion: string;
  effectiveFrom: string;
};`)}
    <p>A schedule is an ordered set of due items. Restructure, reschedule, payment holiday, maturity change or correction creates new effective-dated schedule state; it must not overwrite the schedule that governed a historical decision.</p>
    <Formula label="Due-item state"><span>RemainingDueⱼ(T) = Dueⱼ − AppliedPaymentⱼ(T) − ApprovedAdjustmentⱼ(T)</span></Formula>
    <p>Each obligation remains individually reconstructible. Total arrears alone cannot reveal which due date remains open, so it cannot fully explain DPD.</p>
    <ResourceTable caption="Schedule lineage required for point-in-time DPD" headers={["Element","Question"]} rows={[
      ["Due item identity","Which contractual obligation is this?"], ["Due date and amount","What became payable, and when?"],
      ["Schedule version","Which contract state governed the account?"], ["Effective interval","Was this schedule valid at decision time?"],
      ["Adjustment lineage","Why did the obligation change?"],
    ]} />
  </section>

  <section id="allocation"><h2>A payment event does not identify the obligation it satisfied</h2>
    <Formula label="Versioned allocation"><span>Allocate(Payment, OpenDueItems, Rules<sub>v</sub>) → AllocationResult</span></Formula>
    {code(`type DueAllocation = {
  paymentEventId: string;
  dueItemId: string;
  amountMinor: bigint;
  allocationVersion: string;
};`)}
    <p>One payment can create several allocation rows. An illustrative oldest-due-first rule applies €300 to the 1 August €500 item, leaving €200. That is not a universal hierarchy; the engine injects a governed, versioned policy and preserves the realised result.</p>
    <Formula label="Payment conservation"><span>PaymentAmount = AllocatedAmount + UnappliedAmount</span></Formula>
    <KeyObservation><p><strong>DPD depends on which obligation remains unpaid, not on whether some payment happened.</strong></p></KeyObservation>
  </section>

  <section id="derive"><h2>The oldest relevant unpaid obligation anchors DPD</h2>
    <Formula label="Oldest unpaid due"><span>OldestUnpaidDueDate(T) = min {'{'} DueDateⱼ : RemainingDueⱼ(T) &gt; threshold {'}'}</span></Formula>
    <Formula label="Conceptual DPD calculation"><span>DPD(T) = DateDifference(OldestUnpaidDueDate(T), BusinessDate(T))</span></Formula>
    <p>The threshold, inclusivity and day-count convention are policy inputs—not universal assumptions. If no relevant overdue item exists, current-state representation normally returns DPD = 0 rather than a negative number.</p>
    <ResourceFigure label="DPD dependency chain from financial events to delinquency state." caption="Payment, reversal and restructure change due-item state; DPD is derived only after remaining obligations and the oldest relevant due date are known."><div className={styles.flow}>{["PAYMENT / REVERSAL / RESTRUCTURE","DUE-ITEM STATE","ARREARS","OLDEST UNPAID DUE","DPD","DELINQUENCY STATE"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div></ResourceFigure>
  </section>

  <section id="calendar"><h2>DPD policy belongs in explicit versioned inputs</h2>
    <div className={styles.dual}><article><b>CALENDAR</b><p>Calendar days, business days or contractual business date; define the convention and holiday source.</p></article><article><b>MATERIALITY / GRACE</b><p>Version thresholds and tolerance rules. Unpaid-with-grace is not the same as paid.</p></article></div>
    <p>Many DPD methods operate at date granularity. Do not use a 23h59m timestamp difference to create a day transition. Store machine instants consistently, then derive contractual dates in the correct business timezone.</p>
    <p>A payment effective at 23:58 local on 31 August may be stored as 1 September UTC. A naïve <code>DATE(utc_timestamp)</code> creates false delinquency. Preserve source zone and convert before deriving business date.</p>
    {code(`interface DpdPolicy {
  version: string;
  materialityMinor: bigint;
  daysBetween(
    dueDate: LocalDate,
    asOfDate: LocalDate
  ): number;
  isGraceEligible(dueItem: DueItemState, asOfDate: LocalDate): boolean;
}`)}
  </section>

  <section id="payments"><h2>Partial, excess and advance payments have explicit state</h2>
    <ResourceTable caption="Payment scenarios" headers={["Scenario","Due-item effect","DPD consequence"]} rows={[
      ["Partial €300 against €500","€200 remains on original obligation","DPD can continue from original due date"],
      ["€600 against August €500 and September €500","August clears; €100 applies to September","Oldest unpaid shifts to September; DPD steps down"],
      ["Excess beyond arrears","Principal, future due or unapplied cash per policy","Never guess from amount alone"],
      ["Advance payment","May prepay, reduce principal or remain unapplied","Future items change only under contract rules"],
      ["Settled, not allocated","Cash exists while due item remains open","Operational hold may be warranted; not cure"],
    ]} />
    <p>DPD can move 45 → 14 when payment clears the oldest instalment but leaves a more recent one unpaid. This step-down matters to roll rates. Cross-account payments require facility-aware allocation; customer-level payment totals cannot determine facility DPD.</p>
    <p>Payment finality is also explicit: authorised, settled, posted and reversible are different states. Some systems may justify provisional operational DPD and confirmed DPD, but the trade-off and consumer contract must be visible.</p>
  </section>

  <section id="cure"><h2>Cure and reopen emerge from rebuilt obligations</h2>
    <p>Technical cure can be defined when no relevant overdue due item remains and DPD returns to zero under the approved policy. An explicit <code>ACCOUNT_CURED</code> event may support downstream orchestration, but it must remain explainable from the underlying state.</p>
    <ResourceFigure label="Curing payment and later reversal reconstruct delinquency." caption="The reversal restores the realised allocation; the engine recalculates due items, oldest unpaid date and DPD rather than restoring a cached value."><div className={styles.flow}>{["PAYMENT","ARREARS CLEARED","CURE","PAYMENT REVERSED","ARREARS RESTORED","DPD RECOMPUTED"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <div className={styles.dual}><article><b>CURE REVERSAL</b><p>The payment that created technical cure was undone.</p></article><article><b>RE-DEFAULT</b><p>The borrower genuinely cured, then later deteriorated through a new event path.</p></article></div>
    <KeyObservation title="Derived-state principle"><p><strong>Do not mutate DPD. Mutate the financial facts that determine DPD, then derive it again.</strong></p></KeyObservation>
  </section>

  <section id="temporal"><h2>Late payments create known and restated DPD</h2>
    <div className={styles.dual}><article><b>DPD<sup>known</sup>(T)</b><p>Uses schedule and events available at T; reproduces historical collections and model decisions.</p></article><article><b>DPD<sup>restated</sup>(T)</b><p>Uses later evidence economically effective by T; supports reconciliation and corrected analysis.</p></article></div>
    <p>A decision made at known DPD = 5 remains historically reproducible even if a backdated payment later makes restated DPD = 0. Do not overwrite the decision, model input or known-state series.</p>
    <ResourceFigure label="Known and restated DPD for one historical time." caption="The late payment changes corrected economic delinquency, not the information that production possessed at the decision time."><div className={styles.compare}><span>KNOWN AT T<br/><b>DPD = 5</b></span><i>late payment arrives</i><span>RESTATED AT T<br/><b>DPD = 0</b></span></div></ResourceFigure>
  </section>

  <section id="contract"><h2>Contract changes transform schedule state explicitly</h2>
    <ResourceTable caption="Contractual changes and DPD" headers={["Change","Required event/state","Control"]} rows={[
      ["Restructure","Old/new schedule versions and effective date","Historical DPD retains old schedule"],
      ["Payment holiday","Explicit schedule transformation","Never force DPD to zero silently"],
      ["Waiver / adjustment","Due-item adjustment event","Do not disguise as payment allocation"],
      ["Write-off","Accounting/lifecycle event","Does not automatically imply DPD = 0"],
      ["Reallocation","Corrected due-item allocation lineage","Restate DPD from obligations"],
    ]} />
    <p>Default can use DPD among several criteria, but <strong>Default ≠ DPD</strong>. The DPD engine derives delinquency state; it is not the full default or accounting-stage engine.</p>
  </section>

  <section id="boundaries"><h2>Raw DPD, bucket, facility and customer state are distinct</h2>
    <p>Store raw DPD separately from a policy-versioned delinquency bucket. Bands such as CURRENT, EARLY, MID and LATE are illustrative; changing thresholds must not rewrite raw historical DPD.</p>
    <ResourceTable caption="State boundaries" headers={["Object","Meaning"]} rows={[
      ["Facility/account DPD","Contractual obligation state for one consistency boundary"],
      ["Customer delinquency","A later aggregation such as max, rule-based or exposure-aware state"],
      ["DPD bucket","Versioned decision classification derived from raw DPD"],
      ["Default state","Broader credit-risk outcome with criteria beyond DPD"],
      ["Technical cure","No relevant overdue obligation; not sustainable recovery evidence"],
    ]} />
    <p>Joint borrower identity does not change facility DPD. Behavioural scoring, roll rates, vintage curves, collections, PTP analysis and ECL consume this state differently, so the engine must expose levels and versions rather than one overloaded field.</p>
  </section>

  <section id="implementation"><h2>The calculation function consumes reconstructed due-item state</h2>
    {code(`type DelinquencyState = {
  accountId: string;
  asOfDate: string;
  arrearsMinor: bigint;
  oldestUnpaidDueDate?: string;
  daysPastDue: number;
  scheduleVersion: string;
  allocationVersion: string;
  dpdLogicVersion: string;
  bucketPolicyVersion: string;
  stateMode: "KNOWN" | "RESTATED";
};`)}
    {code(`function calculateDpd(
  asOfDate: LocalDate,
  dueItems: DueItemState[],
  policy: DpdPolicy
): number {
  const overdue = dueItems
    .filter((x) => x.remainingMinor > policy.materialityMinor)
    .filter((x) => !policy.isGraceEligible(x, asOfDate))
    .filter((x) => x.dueDate < asOfDate);

  if (overdue.length === 0) return 0;
  const oldest = overdue
    .map((x) => x.dueDate)
    .sort(compareDates)[0];
  return policy.daysBetween(oldest, asOfDate);
}`)}
    <p>The example assumes comparable local dates and simple policy hooks. Production code must define inclusive boundaries, missing dates, contractual calendars and validated schedule state. The function recomputes after payment, reversal, adjustment or restructure; it never applies arithmetic such as <code>dpd -= 30</code>.</p>
  </section>

  <section id="golden"><h2>Golden streams make DPD arithmetic inspectable</h2>
    <ResourceTable caption="Golden cure and reopen stream" headers={["Checkpoint","Remaining 01 Aug","Oldest unpaid","DPD result"]} rows={[
      ["01 Aug · €500 due","€500","01 Aug","Policy-defined day zero"], ["10 Aug · €300 paid","€200","01 Aug","9"],
      ["15 Aug · €200 paid","€0","None","0 · technical cure"], ["20 Aug · €200 reversed","€200","01 Aug","19 · reopened"],
    ]} />
    <p>Values assume calendar-day difference and no grace; they are fictional test semantics, not a universal convention.</p>
    <ResourceTable caption="Multi-instalment golden case; oldest-due-first illustration" headers={["Checkpoint","01 Aug due","01 Sep due","01 Oct due","Oldest unpaid","DPD"]} rows={[
      ["14 Sep before payment","€500","€500","Future","01 Aug","44"],
      ["15 Sep payment €700","€0","€300","Future","01 Sep","14"],
      ["01 Oct new due","€0","€300","€500","01 Sep","30"],
      ["10 Oct payment €400","€0","€0","€400","01 Oct","9"],
    ]} />
    <p>The second stream proves DPD step-down: payments clear older obligations and expose newer unpaid dates. It also proves that payment amount and total arrears alone are insufficient.</p>
  </section>

  <section id="testing"><h2>Replay and migration tests protect the definition</h2>
    <ResourceTable caption="Minimum DPD test architecture" headers={["Test","Proof"]} rows={[
      ["Partial / excess payment","Configured allocation; no accidental reset"], ["Cure reversal","Arrears, oldest due and DPD rebuild"],
      ["Backdated payment","Known and restated DPD both survive"], ["Restructure","Old and new schedule versions reproduce"],
      ["Midnight / timezone","Business-date result remains stable"], ["Duplicate payment","Idempotency leaves DPD unchanged"],
      ["Allocation version","Historical replay uses original rules"], ["Snapshot parity","Snapshot + tail equals full replay"],
    ]} />
    <div className={styles.invariants}>{["DPD ≥ 0","No oldest unpaid due ⇒ DPD = 0","DPD > 0 ⇒ relevant arrears > 0","Remaining due reconciles to due-item effects","Allocated + unapplied = payment"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Apply invariants only where product semantics permit. Before a system migration, replay representative historical accounts through old and new logic, compare distributions and investigate every material difference. Otherwise infrastructure change can masquerade as credit-risk drift.</p>
  </section>

  <section id="observability"><h2>Reconcile definitions; do not force-match outputs</h2>
    <ResourceTable caption="DPD reconciliation evidence" headers={["Account","Servicing DPD","Derived DPD","Difference","Reason"]} rows={[
      ["acc_1042","30","29","−1","Business-date boundary"], ["acc_2208","0","12","+12","Payment allocation pending"],
      ["acc_3191","45","14","−31","Schedule version mismatch"],
    ]} />
    <p>Classify timing, schedule, allocation, reversal, materiality/grace and source defects. Monitor DPD distribution, zero-to-positive transitions, cure, reopen and reconciliation-difference rates without universal thresholds.</p>
    <p>Sudden DPD collapse, spikes at one exact value, unusually high cure after batch or repeated next-day reopen can indicate infrastructure rather than borrower behaviour. Nightly-only transitions can also create artificial daily patterns.</p>
  </section>

  <section id="architecture"><h2>The Entimema DPD architecture makes every day traceable</h2>
    <ResourceFigure label="Entimema DPD and delinquency-state architecture." caption="Contractual obligations and canonical events remain separate until versioned allocation constructs remaining due; only then does the DPD engine classify state for consumers."><div className={styles.architecture}>{["CONTRACTUAL SCHEDULE","DUE ITEMS","CANONICAL PAYMENTS / ADJUSTMENTS","ALLOCATION ENGINE","REMAINING DUE","OLDEST UNPAID OBLIGATION","DPD ENGINE","DELINQUENCY / CURE STATE","RISK / COLLECTIONS / ECL"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Entimema DPD decision framework" steps={["Define schedule", "Define allocation", "Define effective payments", "Reconstruct remaining due", "Identify oldest unpaid obligation", "Apply calendar policy", "Derive DPD", "Classify delinquency", "Test replay", "Reconcile"]} />
  </section>

  <section id="agent"><h2>A DPD Integrity &amp; Delinquency Reconstruction Agent can explain state</h2>
    <p>A future controlled agent can reconstruct due items, match payments, identify unexplained arrears, compare servicing and derived DPD, trace payment/reversal transitions, find false cure or delinquency candidates, detect schedule mismatch, compare known/restated DPD and monitor migration drift.</p>
    <KeyObservation title="Bounded role"><p><strong>Delinquency-state reconstruction + DPD reconciliation + downstream impact analysis.</strong> It must not autonomously alter authoritative customer delinquency status.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Stable behavioural, roll-rate, vintage, cure and ECL inputs.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Due-item, payment and servicing reconciliation evidence.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Fresh, explainable delinquency for collections and customer treatment.</Link></p></article></div>
    <p>Continue with <Link href="/resources/reversals-chargebacks-corrections-risk-state">Reversals, Chargebacks and Corrections</Link>, <Link href="/resources/late-arriving-events-backdated-corrections">Late-Arriving Events and Backdated Corrections</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Event Processing</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>, <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>, <Link href="/resources/cure-redefault-analytics-sustainable-recovery">Cure &amp; Re-Default Analytics</Link> and <Link href="/resources/promise-to-pay-analytics-collections">Promise-to-Pay Analytics</Link>. Credit data models, point-in-time features and cross-function reconciliation are future research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>A DPD value is trustworthy only when the platform can trace it to a specific obligation, the exact allocation that did or did not satisfy it, and the policy version that counted the days.</strong></p></KeyObservation>
  </section>
</div>; }
