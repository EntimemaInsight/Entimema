import Link from "next/link";
import { EntimemaFramework, Formula, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./payment-is-not-balance.module.css";

export const paymentIsNotBalanceSections = [
  { id: "distinction", label: "Event versus state" },
  { id: "lifecycle", label: "Payment lifecycle" },
  { id: "truths", label: "Five institutional states" },
  { id: "delinquency", label: "DPD, cure and allocation" },
  { id: "time", label: "Time and restatement" },
  { id: "integrity", label: "Event integrity" },
  { id: "reconciliation", label: "Reconciliation architecture" },
  { id: "case", label: "End-to-end case" },
  { id: "implementation", label: "Implementation" },
  { id: "agent", label: "Agent bridge" },
] as const;

const lifecycle = ["Instruction", "Authorisation", "Processing", "Settlement", "Posting", "Final / reversed"];
const controlDimensions = ["Event integrity", "Identity", "Timing", "Finality", "Allocation", "Reconciliation"];

export default function PaymentIsNotBalanceArticle() {
  return <div className={styles.articleBody}>
    <p className={styles.lead}>A customer sees <strong>Paid</strong>. The processor sees <strong>Authorised</strong>. Settlement is pending, servicing has not posted, collections still sees overdue, Risk has increased DPD and Finance sees no ledger movement. Potentially every view is correct—at a different stage of the same financial event.</p>
    <p>The persistent error is to ask, “What is the payment status?” as though one field could answer every downstream question. The better questions are: <strong>Which event occurred, when did it become economically effective, when did it become final, and which state should this decision consume?</strong></p>

    <section id="distinction"><h2>A payment is an event. A balance is a state.</h2>
      <div className={styles.eventState}><article><b>EVENT</b><h3>Something happened</h3><p>A payment record describes an amount, event time, status, source, account and reference. It is evidence of occurrence—not a complete customer position.</p></article><span aria-hidden="true">≠</span><article><b>STATE</b><h3>What is true now</h3><p>A balance is the accumulated result after relevant drawdowns, payments, interest, fees, reversals and corrections have been applied.</p></article></div>
      <Formula label="Conceptual payment event"><span className={styles.formula}>Eₚ = (Amount, EventTime, Status, Source, Account, Reference)</span></Formula>
      <Formula label="State accumulation"><span className={styles.formula}>Balanceₜ = Balanceₜ₋₁ + Eventsₜ</span></Formula>
      <p><strong>Payment received</strong> is an event. <strong>Account current</strong> is a derived state. Payment amount alone cannot tell us whether arrears were covered, how cash was allocated, whether the payment is final or whether another event reversed it.</p>
      <blockquote>Do not ask every system to agree on one balance at every moment. Make every system agree on the event history and the rules used to derive its state.</blockquote>
    </section>

    <section id="lifecycle"><h2>“Paid” contains a lifecycle, not a binary fact</h2>
      <ResourceFigure label="Conceptual payment lifecycle" caption="The stages show progression, not a universal taxonomy for every payment rail."><div className={styles.flow}>{lifecycle.map(x => <span key={x}>{x}</span>)}</div></ResourceFigure>
      <ResourceTable caption="What each lifecycle stage can—and cannot—establish" headers={["Stage", "What it establishes", "What it does not establish"]} rows={[
        ["Instruction", "The customer submitted a payment request", "Funds availability, settlement or balance reduction"],
        ["Authorisation", "A payment mechanism accepted the transaction", "Settlement or posting"],
        ["Processing", "The transaction is moving through an operational path", "Accounting recognition"],
        ["Settlement", "Funds became economically settled under the relevant architecture", "That servicing or ledger state has updated"],
        ["Posting", "Servicing or accounting applied the payment", "That the payment can never return or reverse"],
        ["Final / reversed", "Subsequent evidence confirms or offsets the event", "That history should be silently overwritten"],
      ]}/>
      <div className={styles.signature}><span>Authorised ≠ Settled</span><span>Settled ≠ Posted</span><span>Real-time payment ≠ Real-time decision</span></div>
      <p>Instant settlement does not repair a batch risk warehouse. Conversely, an instant signal should not automatically create cure when finality or allocation remains unresolved. Freshness and correctness sit on a decision-specific frontier.</p>
    </section>

    <section id="truths"><h2>One payment can produce five legitimate institutional states</h2>
      <div className={styles.fiveStates}>{[
        ["Customer", "I instructed the payment and received confirmation."], ["Operational", "The processor accepted or completed its work."], ["Settlement", "Funds have—or have not—settled."], ["Accounting", "The account and ledger have—or have not—posted."], ["Risk", "The event has—or has not—met the policy for analytical recognition."],
      ].map(([title, text], i) => <article key={title}><b>0{i + 1}</b><h3>{title} state</h3><p>{text}</p></article>)}</div>
      <p>These states should reconcile; they need not be identical at every instant. Collections may stop contact after sufficiently confirmed settlement, Finance may wait for posting, and Risk may use a controlled effective-payment state. The governance question is not which team owns “the truth”, but which definition and minimum finality each decision requires.</p>
      <ResourceTable caption="One €500 scheduled payment, several system truths" headers={["Time", "Observed event", "Customer / Operations", "Servicing / Finance", "Risk / Collections"]} rows={[
        ["08:15", "Instruction", "Customer believes paid", "€500 remains outstanding", "Overdue state unchanged"],
        ["08:16", "Authorised", "Processor accepted", "No posting", "Policy may treat as provisional only"],
        ["13:00", "Settled", "Operational cash confirmed", "Still not posted", "Collections hold may be justified"],
        ["22:45", "Posted", "Account updated", "Balance and ledger movement recorded", "Warehouse still stale"],
        ["01:30 next day", "Risk refresh", "No new customer event", "Posted state available", "DPD and features recalculate"],
        ["07:00", "Queue generated", "—", "—", "Collections consumes refreshed state"],
      ]}/>
    </section>

    <section id="delinquency"><h2>DPD is downstream from payment semantics</h2>
      <Formula label="Conceptual DPD engine"><span className={styles.formula}>DPDₜ = f(Schedule, DueAmounts, PaymentAllocation, EffectivePayments, Reversals, Dateₜ)</span></Formula>
      <ResourceFigure label="Payment-to-DPD chain" caption="A payment cannot determine delinquency until identity, allocation, due amounts and reversals are resolved."><div className={styles.flow}>{["Payment", "Allocation", "Amount due", "Arrears", "DPD", "Cure / deterioration"].map(x => <span key={x}>{x}</span>)}</div></ResourceFigure>
      <div className={styles.dual}><article><h3>False delinquency</h3><p>The customer paid before collections evaluation, but the event has not reached the DPD source. System DPD is positive while the economic state is already changing. The result can be an inappropriate contact, false EWS alert, missed-payment feature or complaint.</p></article><article><h3>False cure</h3><p>A provisional payment is recognised and the account appears current. The payment later returns or reverses. A temporary technical cure was mistaken for durable recovery.</p></article></div>
      <p>A €500 payment against €900 arrears is real but does not cure. A partial payment can reduce exposure and collections priority while leaving DPD unchanged. An excess payment may reduce principal, cover future dues or create credit depending on product rules. Allocation to fees, interest, principal or due items changes arrears even when payment amount is constant.</p>
      <p>This is why <Link href="/resources/cure-redefault-analytics-sustainable-recovery">Cure & Re-Default Analytics</Link> must consume reconstructed account state, and why <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> and <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link> must separate genuine deterioration from processing latency. A promise can likewise appear broken before its matching payment posts; see <Link href="/resources/promise-to-pay-analytics-collections">Promise-to-Pay Analytics</Link>.</p>
    </section>

    <section id="time"><h2>Six timestamps answer six different questions</h2>
      <div className={styles.timeGrid}>{[["Tevent", "When the underlying event occurred"], ["Tauthorisation", "When the mechanism accepted it"], ["Tsettlement", "When economic settlement occurred"], ["Tposting", "When account or ledger state updated"], ["Trisk", "When methodology recognises it"], ["Tdecision", "When downstream action was produced"]].map(([t, d]) => <article key={t}><code>{t}</code><p>{d}</p></article>)}</div>
      <p>Processing time is vital for latency and pipeline monitoring, but it does not automatically carry economic meaning. Risk-effective time is a policy definition, not a synonym for arrival or posting time. Decision records must say which state and information set were available at that instant.</p>
      <ResourceTable caption="Late-arriving and backdated information" headers={["State", "Meaning", "Use"]} rows={[
        ["Stateᵏⁿᵒʷⁿₜ", "What the institution legitimately knew at T", "Backtesting, decision replay, operational accountability"],
        ["Stateʳᵉˢᵗᵃᵗᵉᵈₜ", "What later evidence says was economically true at T", "Correction, data-quality analysis, economic reconstruction"],
      ]}/>
      <p>If arrival time is later than effective time, historical DPD may change. Both original and corrected state should be preserved. Model validation that silently substitutes corrected future information into the past creates hindsight leakage.</p>
    </section>

    <section id="integrity"><h2>Correct history with events, not silent mutation</h2>
      <Formula label="Reversal pattern"><span className={styles.formula}>Payment(+€500) → Reversal(−€500, reference = original event)</span></Formula>
      <p>Where the architecture supports it, preserve the original event and append a linked correction, return, chargeback or reversal. Silent overwriting weakens auditability, lineage and reproducibility. Accounting posting is itself an event, distinct from—and reconciled to—the economic payment event.</p>
      <div className={styles.controls}>{controlDimensions.map(x => <span key={x}>{x}</span>)}</div>
      <p>A stable event identity allows deduplication, lineage and reversal linkage. Retry, message duplication or file resend must not apply the same payment twice. Identity must map the event to customer, account, facility and schedule item; otherwise cash can exist in suspense while the loan balance remains unchanged.</p>
      <blockquote>Correct financial history by adding corrective events, not by silently rewriting what happened.</blockquote>
    </section>

    <section id="reconciliation"><h2>Reconciliation should explain differences, not erase them</h2>
      <EntimemaFramework title="Entimema Payment-to-State Architecture" steps={["Payment source", "Canonical payment event", "Identity / allocation", "Settlement & finality", "Servicing state", "Accounting posting", "Analytical account state", "DPD / cure / features", "Collections / risk / ECL decisions", "Reconciliation"]}/>
      <p>A canonical event can preserve source complexity while shielding consumers from vendor-specific statuses. Useful attributes include event identity, customer/account/facility mapping, event type, amount, event, processing and effective times, controlled status and reversal reference. Canonical does not mean simplistic; it means a stable semantic contract.</p>
      <ResourceTable caption="A reconciliation model richer than match / no match" headers={["Status", "Interpretation", "Control response"]} rows={[
        ["Pending settlement", "Lifecycle progression remains incomplete", "Observe within expected window"],
        ["Pending expected posting", "Settled but servicing or ledger has not yet updated", "Hold or inform selected consumers"],
        ["Pending allocation", "Cash exists but account mapping or allocation remains unresolved", "Surface to operations and customer-treatment controls"],
        ["Unexplained mismatch", "Difference exceeds expected timing or semantics", "Investigate as anomaly"],
        ["Corrected", "A linked corrective event resolved the difference", "Retain lineage and both historical states"],
      ]}/>
      <p>The expected latency window is decision- and architecture-specific. Finance, Risk and Operations should not manually investigate predictable timing differences every day. That is the <Link href="/resources/hidden-infrastructure-debt-modern-lending">reconciliation tax created by hidden infrastructure debt</Link>.</p>
      <div className={styles.diagnostic}><h3>When two systems disagree</h3><ol><li>Are they using the same event set?</li><li>Are they using the same effective time?</li><li>Are different but valid state rules being applied?</li><li>Is one state missing, duplicating or misallocating an event?</li></ol></div>
    </section>

    <section id="case"><h2>A €250 payment removes three false signals without weakening accounting control</h2>
      <p>Consider a fictional consumer lender using a PSP, SaaS servicing platform, accounting system, risk warehouse and collections platform. A €250 payment settles at 14:00; servicing posts it overnight; the collections queue runs at 18:00.</p>
      <ResourceTable caption="Original fictional end-to-end case" headers={["Consumer", "Existing architecture at 18:00", "Improved architecture at 18:00"]} rows={[
        ["Collections", "Account appears overdue; message generated", "Settled event creates a bounded payment hold"],
        ["Promise-to-pay", "Promise marked broken", "Payment is matched as settled, pending posting"],
        ["Behavioural risk", "Missed-payment feature worsens", "Feature records pending-effective payment, not a confirmed miss"],
        ["Accounting", "Waits for overnight posting", "Still waits for controlled posting"],
        ["Next morning", "All systems reconcile after customer harm risk", "Posting reconciles the event and closes provisional states"],
      ]}/>
      <p>The improved design does not pretend the ledger has posted. It fans one governed event into consumer-specific state: servicing, Risk, Collections and Finance reconciliation. Three false signals disappear while Finance retains posting control.</p>
      <p>In a bank, payment rails and core controls may be mature while last-mile risk consumption remains fragmented. A non-bank may combine PSP, statement feed, SaaS servicing, collections and accounting providers. APIs change the transport, not the semantic problem: both need identity, finality, timestamps and reconciliation.</p>
    </section>

    <section id="implementation"><h2>Implementation starts with decision-specific finality</h2>
      <ResourceFigure label="Latency versus finality frontier" caption="Earlier states are faster but less final. Each decision chooses the minimum justified confirmation—not one universal timestamp."><div className={styles.frontier}><div><b>Decision confidence ↑</b><span>Final recovery / ledger</span><span>Risk-effective state</span><span>Collections hold</span><span>Customer acknowledgement</span></div><i>Time / confirmation →</i></div></ResourceFigure>
      <ResourceTable caption="Illustrative—not universal—decision thresholds" headers={["Consumer", "Possible minimum evidence", "Why"]} rows={[
        ["Customer notification", "Early acknowledgement", "Confirm receipt without claiming final posting"],
        ["Collections hold", "Sufficiently confirmed settlement", "Avoid inappropriate contact while preserving expiry and exceptions"],
        ["Ledger", "Formal posting", "Protect accounting authority and control"],
        ["LGD realised recovery", "Final cash flow and allocation", "Protect recovery timing and discounting"],
      ]}/>
      <EntimemaFramework title="Practitioner Decision Logic" steps={["Capture event", "Identify account", "Preserve timestamps", "Determine finality", "Allocate payment", "Derive state", "Apply risk logic", "Trigger decision", "Reconcile"]}/>
      <EntimemaFramework title="Operational Workflow" steps={["Payment feed", "Normalisation", "Deduplication", "Identity resolution", "Settlement / finality", "Allocation", "Account-state builder", "DPD engine", "Risk / collections", "Accounting reconciliation"]}/>
      <p>Payment errors reach beyond collections. Recovery dates and allocation distort <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>; delinquency, SICR, behavioural PD and exposure can affect <Link href="/resources/ifrs-9-expected-credit-loss-architecture">ECL</Link> and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD</Link>. Payment infrastructure is therefore a Credit Risk, CFO and engineering control—not back-office plumbing.</p>
      <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Strengthen DPD, behavioural scoring, cure, ECL and collections evidence.</Link></p></article><article><h3>Finance / CFO</h3><p><Link href="/services/cfo-function">Control cash allocation, posting reconciliation, timing differences and ledger integrity.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Build payment-triggered holds, event-driven workflows and monitored reconciliation.</Link></p></article></div>
    </section>

    <section id="agent"><h2>A Payment State & Reconciliation Agent can support decision readiness</h2>
      <p>A future bounded Agent could ingest approved payment events, normalise status, preserve event/processing/posting times, detect duplicates, link reversals, map account and facility, surface unallocated cash, compare settlement with posting, reconstruct payment state, identify likely false delinquency or inconsistent cure and explain differences to human reviewers.</p>
      <p>Its role is <strong>payment-state integrity + reconciliation + decision-readiness support</strong>. It must not autonomously modify ledger postings, reverse transactions or take adverse customer action.</p>
      <div className={styles.agentChain}>{["Payment State Agent", "Financial State & Reconciliation Agent", "Behavioural Credit Risk Agent", "Early Warning Agent", "Collections Prioritisation Agent"].map(x => <span key={x}>{x}</span>)}</div>
      <p>This methodology prepares the Engineering sequence: canonical financial event models; event, processing and posting time; idempotency; account-state reconstruction; late events; reversals; a reliable DPD engine; and reconciliation across Risk, Finance and Collections. Those are engineering briefs—not fabricated live routes.</p>
      <p>The practical sequence is simple: <strong>Capture Event → Identify Account → Preserve Time → Determine Finality → Allocate → Derive State → Decide → Reconcile.</strong> The hard part is preserving each distinction all the way to the decision.</p>
    </section>
  </div>;
}
