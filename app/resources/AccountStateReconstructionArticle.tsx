import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./account-state-reconstruction.module.css";

export const accountStateReconstructionSections = [
  { id: "problem", label: "The state problem" }, { id: "aggregate", label: "Aggregate and state" },
  { id: "reducer", label: "Deterministic reducer" }, { id: "allocation", label: "Payment allocation" },
  { id: "balances", label: "Balance reconstruction" }, { id: "exposure", label: "Exposure state" },
  { id: "delinquency", label: "Delinquency state" }, { id: "lifecycle", label: "Lifecycle and versions" },
  { id: "snapshots", label: "Snapshots and replay" }, { id: "late-events", label: "Late events and logic" },
  { id: "hybrid", label: "Hybrid architecture" }, { id: "invariants", label: "Invariants and tests" },
  { id: "case", label: "Golden account case" }, { id: "operations", label: "Operate and reconcile" },
  { id: "api", label: "State API" }, { id: "agent", label: "State Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function AccountStateReconstructionArticle() { return <div className={styles.articleBody}>
  <section id="problem">
    <p className={styles.lead}>A loan draws €10,000, accrues €80 interest, receives €500, incurs a €20 fee, receives €1,000 and then reverses that €1,000. What, exactly, is the account state at 10 March 18:00?</p>
    <div className={styles.stream}>{[["01 JAN","DRAWDOWN · €10,000"],["31 JAN","INTEREST · €80"],["05 FEB","PAYMENT · €500"],["28 FEB","FEE · €20"],["03 MAR","PAYMENT · €1,000"],["10 MAR","REVERSAL · €1,000"]].map(([d,e])=><article key={d}><b>{d}</b><span>{e}</span></article>)}</div>
    <p>The answer must not depend on the latest mutable snapshot, a spreadsheet adjustment or an opaque balance column. It should emerge from a complete, ordered and validated history plus explicit transition rules.</p>
    <Formula label="Account-state reconstruction"><span>S<sub>t</sub> = F(S<sub>0</sub>, E<sub>1:t</sub>)</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>A trustworthy lending state is reconstructible.</strong> Balances, exposure, delinquency and behavioural state should explain how the account arrived there—not merely assert what a mutable field says now.</p></KeyObservation>
  </section>

  <section id="aggregate"><h2>The event stream explains how; state answers what</h2>
    <div className={styles.dual}><article><b>EVENT STREAM</b><p>The ordered sequence of economically meaningful changes and corrections.</p></article><article><b>STATE</b><p>The result of reducing those events through a versioned business transition function.</p></article></div>
    <Formula label="Event stream to state"><span>State<sub>t</sub> = Reduce(State<sub>0</sub>, E<sub>1</sub>, …, E<sub>t</sub>)</span></Formula>
    <p>The <strong>aggregate</strong> is the consistency boundary. It may be a loan facility, revolving facility or account depending on which events must update one economic balance atomically. Customer-level aggregation is not a default: a boundary that is too small splits one state; one that is too broad creates contention and unrelated complexity.</p>
    {code(`type LoanState = {
  facilityId: string;
  principalMinor: bigint;
  accruedInterestMinor: bigint;
  feeBalanceMinor: bigint;
  unappliedCashMinor: bigint;
  totalOutstandingMinor: bigint;
  arrearsMinor: bigint;
  daysPastDue: number;
  availableLimitMinor?: bigint;
  version: number;
  lastEventTime?: Date;
};`)}
    <ResourceTable caption="State classification" headers={["Class","Examples","Rule"]} rows={[
      ["Primitive / direct","Principal, accrued interest, fees, unapplied cash","Changed by explicit event effects"],
      ["Derived","Total outstanding, availability, utilisation, DPD","Calculated from governed inputs"],
      ["Cached derived","Persisted total or projection for query speed","Rebuildable and checked against source components"],
    ]} />
    <p>Avoid duplicated state unless performance justifies it. If a total is cached, central calculation and invariants must prevent it drifting from its components.</p>
  </section>

  <section id="reducer"><h2>The reducer is a pure, versioned state transition</h2>
    <Formula label="Reducer transition"><span>S<sub>n+1</sub> = R(S<sub>n</sub>, E<sub>n+1</sub>)</span></Formula>
    {code(`function reduceLoanState(
  state: LoanState,
  event: FinancialEvent
): LoanState {
  switch (event.eventType) {
    case "DRAWDOWN":
      return recalculate({
        ...state,
        principalMinor: state.principalMinor + event.amountMinor,
        version: state.version + 1
      });
    case "INTEREST_ACCRUED":
      return recalculate({
        ...state,
        accruedInterestMinor:
          state.accruedInterestMinor + event.amountMinor,
        version: state.version + 1
      });
    case "FEE_CHARGED":
      return recalculate({
        ...state,
        feeBalanceMinor: state.feeBalanceMinor + event.amountMinor,
        version: state.version + 1
      });
    default:
      return state;
  }
}`)}
    {code(`function recalculate(state: LoanState): LoanState {
  return {
    ...state,
    totalOutstandingMinor:
      state.principalMinor +
      state.accruedInterestMinor +
      state.feeBalanceMinor
  };
}`)}
    <p>The reducer validates applicability, applies the economic effect and returns new state. It does not send messages, write databases or call APIs. Central recalculation prevents each handler from inventing its own balance formula and makes local, CI and recovery replay deterministic.</p>
  </section>

  <section id="allocation"><h2>A payment is an input to allocation—not one subtraction</h2>
    <Formula label="Versioned payment allocation"><span>Allocation(Payment, State, Rules<sub>v</sub>) → (FeesPaid, InterestPaid, PrincipalPaid, Unapplied)</span></Formula>
    {code(`type PaymentAllocation = {
  paymentEventId: string;
  amountMinor: bigint;
  feesAppliedMinor: bigint;
  interestAppliedMinor: bigint;
  principalAppliedMinor: bigint;
  unappliedMinor: bigint;
  allocationRuleVersion: string;
};`)}
    <p>A €500 payment might settle fees, then interest, then principal—or follow a different contractual hierarchy. This article does not prescribe one. It requires an explicit result that answers “where did the money go?” for servicing, accounting, delinquency, reconciliation and disputes.</p>
    <Formula label="Allocation conservation"><span>PaymentAmount = AllocatedAmount + UnappliedAmount</span></Formula>
    <p><strong>Unapplied cash</strong> is legitimate state when receipt exists but allocation cannot yet complete. Do not force a fictitious balance mutation. Where appropriate, distinguish <code>PAYMENT_SETTLED</code> from <code>PAYMENT_APPLIED</code>.</p>
    <p>Allocation rules are versioned business logic. Reproducing production state uses the version that actually ran; changing policy later does not silently rewrite history. A separately authorised restatement may calculate <strong>State<sup>recalculated</sup></strong> while preserving <strong>State<sup>actual</sup></strong>.</p>
  </section>

  <section id="balances"><h2>Financial components reconstruct explicitly</h2>
    <div className={styles.formulaGrid}><Formula label="Principal composition"><span>P<sub>t</sub> = P<sub>t−1</sub> + Drawdowns − PrincipalPayments + Corrections</span></Formula><Formula label="Interest composition"><span>I<sub>t</sub> = I<sub>t−1</sub> + Accruals − InterestPayments + Adjustments</span></Formula><Formula label="Fee composition"><span>F<sub>t</sub> = F<sub>t−1</sub> + FeesCharged − FeesPaid + Adjustments</span></Formula></div>
    <Formula label="Total outstanding"><span>Outstanding<sub>t</sub> = Principal<sub>t</sub> + Interest<sub>t</sub> + Fees<sub>t</sub> + product-specific components</span></Formula>
    <p>These are illustrative compositions, not universal product rules. Their value is that every total can be traced to components, events and allocation outputs. A write-off should therefore be an explicit economic/accounting event—not <code>balance = 0</code>—because contractual balance, accounting write-off and recoverable amount may diverge. Recovery can occur after write-off.</p>
    <p>Interest may be explicit <code>INTEREST_ACCRUED</code> events or computed from rate, day-count and period state. Events improve audit lineage; computation can reduce volume. Either approach must retain enough versioned inputs to reproduce the number.</p>
  </section>

  <section id="exposure"><h2>Outstanding balance is not the whole exposure</h2>
    {code(`type RevolvingFacilityState = {
  drawnMinor: bigint;
  limitMinor: bigint;
  blockedLimitMinor: bigint;
  pendingDrawMinor: bigint;
  availableMinor: bigint;
  utilisation: number;
};`)}
    <Formula label="Illustrative available-limit relationship"><span>Available = Limit − Drawn − Blocked − Pending</span></Formula>
    <p>Revolving exposure can depend on undrawn commitments, pending drawdowns, guarantees and contingencies as well as outstanding balance. Availability must not be calculated from one stale field. Prefer an explicit desired-state event such as <code>LIMIT_SET 5000</code> over an ambiguous incremental change where the business semantics allow it.</p>
    <p>A limit may be known today and effective tomorrow. Point-in-time <strong>Exposure(T)</strong> therefore applies effective time and the known/restated mode described in <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>.</p>
  </section>

  <section id="delinquency"><h2>DPD is derived from obligations, allocation and time</h2>
    <Formula label="Delinquency state"><span>DPD(T) = f(Schedule, AmountsDue, EffectiveAllocations, Calendar, T)</span></Formula>
    {code(`type Instalment = {
  scheduleVersion: string;
  dueDate: string;
  amountDueMinor: bigint;
  appliedMinor: bigint;
  adjustmentMinor: bigint;
};`)}
    <Formula label="Remaining due"><span>RemainingDue = ScheduledAmount − AppliedPayment − ApprovedAdjustment</span></Formula>
    <Formula label="Conceptual oldest unpaid obligation"><span>OldestUnpaidDueDate = min(DueDateⱼ : RemainingDueⱼ &gt; 0)</span></Formula>
    <p>DPD may then measure from that date using approved calendar and business-day rules. This is a conceptual pattern, not a universal delinquency policy. A payment applied to the newest instalment may leave the oldest arrears unchanged; payment amount alone cannot prove cure.</p>
    <Formula label="Cure state"><span>Cure(T) = f(RemainingArrears, DPD, ApplicableRules)</span></Formula>
    <ResourceFigure label="Event-to-risk-state dependency graph." caption="Payment allocation changes amounts due; amounts due change arrears and DPD; those states feed cure and behavioural features."><div className={styles.flow}>{["EVENTS","MONETARY COMPONENTS","AMOUNTS DUE","ARREARS","DPD","CURE / DELINQUENCY","BEHAVIOURAL FEATURES"].map((x,i)=><span key={x}>{x}{i<6?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <p>A payment reversal can move an account from current back to delinquent. The reducer must propagate the correction through balance, allocation, arrears, DPD and downstream behavioural state while retaining the original and reversal events.</p>
  </section>

  <section id="lifecycle"><h2>Monetary state and lifecycle state are separate</h2>
    <div className={styles.lifecycle}>{["PENDING","ACTIVE","DELINQUENT","DEFAULTED","CLOSED"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div>
    <p>The reducer applies event effects; a state machine validates lifecycle transitions. <code>CLOSED → ACTIVE</code> may be invalid without an explicit reopen event. Yet zero balance does not necessarily close an account, and write-off can leave accounting or recovery artefacts. One enum cannot replace monetary state.</p>
    <Formula label="Aggregate version invariant"><span>Version<sub>n+1</sub> = Version<sub>n</sub> + 1</span></Formula>
    <p>Where strict sequencing is required, apply only when expected version equals current version. Persist <code>schemaVersion</code>, <code>reducerVersion</code>, <code>allocationVersion</code> and <code>scheduleLogicVersion</code> where material to reproduction.</p>
  </section>

  <section id="snapshots"><h2>A snapshot accelerates history; it does not replace it</h2>
    {code(`type StateSnapshot = {
  aggregateId: string;
  version: number;
  reducerVersion: string;
  state: LoanState;
  stateHash: string;
  createdAt: Date;
};`)}
    <Formula label="Snapshot-tail replay"><span>S<sub>n</sub> = Reduce(Snapshot<sub>k</sub>, E<sub>k+1:n</sub>)</span></Formula>
    <ResourceFigure label="Snapshot and tail events reconstruct the same final version as full replay." caption="Snapshot v100 plus events 101–125 must equal genesis replay through event 125."><div className={styles.snapshot}><span>SNAPSHOT v100</span><b>+</b><span>EVENTS 101–125</span><b>→</b><strong>STATE v125</strong><i>= FULL REPLAY HASH</i></div></ResourceFigure>
    <p>Frequent snapshots recover faster but cost storage and management; sparse snapshots replay longer. Each snapshot must correspond exactly to aggregate version k. Manual mutation without event lineage makes history irreproducible.</p>
    <KeyObservation title="Signature principle"><p><strong>A snapshot is a performance optimisation over state history, not an excuse to abandon explainability.</strong></p></KeyObservation>
  </section>

  <section id="late-events"><h2>Late events and reducer upgrades create explicit replay choices</h2>
    <EntimemaFramework title="Late-event restatement workflow" steps={["Late event", "Determine effective position", "Locate prior safe snapshot", "Replay", "Produce restated state", "Recompute dependants"]} />
    <p>A late event effective before the latest snapshot can invalidate that snapshot. The state engine finds a safe boundary and rebuilds affected projections while retaining <strong>S<sup>known</sup>(T)</strong> and <strong>S<sup>restated</sup>(T)</strong>. Restatement supports a counterfactual decision but never overwrites <strong>Decision<sup>actual</sup></strong>.</p>
    <ResourceTable caption="Reducer change-management choices" headers={["Need","Logic","Result"]} rows={[
      ["Production forward fix","New reducer for future events","Original history remains reproducible"],
      ["Historical restatement","Replay old streams with corrected reducer","Separate corrected state and impact evidence"],
      ["Incident comparison","Retain original and corrected logic","Quantify state and decision difference"],
    ]} />
    <p>A restructure similarly changes schedule, rate, principal or maturity through explicit effective-dated events. Never rewrite the previous schedule silently; DPD reconstruction needs the schedule version applicable at T.</p>
  </section>

  <section id="hybrid"><h2>Deterministic state does not require replacing the core ledger</h2>
    <Formula label="Hybrid reconstruction"><span>State<sub>t</sub> = AuthoritativeSnapshot<sub>t₀</sub> + CanonicalEvents<sub>t₀:t</sub></span></Formula>
    <p>A practical bank architecture can anchor to controlled core snapshots, apply canonical events between checkpoints and reconcile periodically. The state layer can serve risk, decisioning and collections without recreating the general ledger. Non-bank lenders can use the same pattern across fragmented PSP, servicing, collections and risk platforms.</p>
    <ResourceTable caption="Reconciliation difference taxonomy" headers={["Difference","Meaning","Response"]} rows={[
      ["Timing","Expected cut-off or posting difference","Age and clear at agreed checkpoint"], ["Allocation","Rules or hierarchy differ","Compare versioned allocation traces"],
      ["Missing event","Integrity gap","Trace ingestion and replay"], ["Duplicate event","Integrity gap","Verify idempotency and reverse impact if needed"],
      ["Source correction","Authoritative fact changed","Restate from controlled boundary"],
    ]} />
    <p>Use exact monetary reconciliation where required; rounding tolerance for one analytical metric must not become a blanket financial tolerance.</p>
  </section>

  <section id="invariants"><h2>Correctness is a set of properties, not one expected balance</h2>
    <div className={styles.invariantGrid}>{["Outstanding ≥ 0 where product permits","Available ≤ Limit","Allocated ≤ Payment","Payment = Allocated + Unapplied","Version increments exactly once","Drawn + Available + Blocked reconciles to limit"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Apply only invariants that are economically valid for the product. Property-based tests can generate valid drawdown, payment, fee, reversal and limit-change sequences and assert conservation after every event without adding a new dependency to production.</p>
    <ResourceTable caption="State-engine test architecture" headers={["Test","Proof"]} rows={[
      ["Replay checkpoints","Replay(E₁:ₖ) equals expected state k"], ["Duplicate injection","Idempotent preprocessing leaves final state unchanged"],
      ["Ordering","Causal swaps are reordered, rejected or quarantined"], ["Reversal","Monetary effect returns correctly; history remains"],
      ["Late event","Known and restated states remain queryable"], ["Snapshot parity","Full replay equals snapshot plus tail"],
    ]} />
    <Formula label="Snapshot parity invariant"><span>S<sup>full replay</sup> = S<sup>snapshot replay</sup></span></Formula>
  </section>

  <section id="case"><h2>A golden account stream makes the arithmetic inspectable</h2>
    <p>Assume an illustrative allocation order of fees, interest, then principal. The €500 payment on 5 February clears €80 interest and reduces principal by €420. The later €1,000 payment reduces principal, then its full reversal restores principal.</p>
    <ResourceTable caption="Fictional reconciled monetary checkpoints" headers={["Version","Event","Principal","Interest","Fees","Outstanding"]} rows={[
      ["1","Drawdown €10,000","€10,000","€0","€0","€10,000"],
      ["2","Interest €80","€10,000","€80","€0","€10,080"],
      ["3","Payment €500","€9,580","€0","€0","€9,580"],
      ["4","Fee €20","€9,580","€0","€20","€9,600"],
      ["5","Payment €1,000","€8,600","€0","€0","€8,600"],
      ["6","Reverse payment €1,000","€9,580","€0","€20","€9,600"],
    ]} />
    <p>The reversal restores the exact allocation it reverses: €980 principal and €20 fee, not a fresh allocation under today&apos;s balances. Now assume €600 was contractually due on 5 February and only €500 remained effectively applied after the reversal sequence. Remaining arrears are €100; DPD at 10 March follows the approved calendar from the oldest relevant unpaid due date. A payment exists, but cure is false.</p>
    <ResourceFigure label="Entimema account-state architecture." caption="Canonical history passes through idempotency and ordering before one aggregate reducer constructs query-efficient, explainable decision state."><div className={styles.architecture}>{["CANONICAL EVENTS","IDEMPOTENCY / ORDERING","AGGREGATE STREAM","REDUCER + ALLOCATION","MONETARY STATE","SCHEDULE / DELINQUENCY","SNAPSHOT / PROJECTION","STATE API","RISK / COLLECTIONS / FINANCE"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
  </section>

  <section id="operations"><h2>Projection state is rebuildable; correctness stays above throughput</h2>
    <p>The event store preserves lineage; the projection store serves efficient current queries. If a projection corrupts, create a clean projection, replay history, verify hashes and invariants, then switch consumers. Snapshotting, state caches, partitioning and aggregate-local processing improve throughput only after correctness is stable.</p>
    <p>High-event accounts can become hot partitions. Adjust aggregate boundaries or incremental projections carefully, but do not fragment one economic consistency boundary merely to improve throughput. A fast incorrect state engine is useless.</p>
    <div className={styles.consumers}>{["BEHAVIOURAL SCORING","LIMIT MANAGEMENT","EARLY WARNING","COLLECTIONS","ECL"].map(x=><span key={x}>{x}</span>)}</div>
    <p>These consumers should use one governed state service rather than independently reinventing balance, exposure and delinquency calculations.</p>
  </section>

  <section id="api"><h2>The state API declares time mode and preserves explanation</h2>
    {code(`interface AccountStateService {
  getCurrentState(accountId: string): Promise<LoanState>;
  getKnownState(accountId: string, asOf: Date): Promise<LoanState>;
  getRestatedState(accountId: string, asOf: Date): Promise<LoanState>;
  getExposure(
    facilityId: string,
    asOf: Date,
    stateMode: "current" | "known" | "restated"
  ): Promise<ExposureState>;
}`)}
    {code(`{
  "principalMinor": 958000,
  "derivedFrom": ["draw_01", "payment_07", "payment_09_reversal"],
  "allocationRuleVersion": "allocation_3.1",
  "aggregateVersion": 6
}`)}
    <p>Not every request needs full trace, but the service must answer why outstanding equals €9,600 through components, applied events and allocations. State without lineage is not sufficiently explainable for a financial decision platform.</p>
  </section>

  <section id="agent"><h2>A Financial State Integrity Agent can reconstruct evidence without altering authority</h2>
    <p>A future controlled agent can replay account streams, compare derived and authoritative states, detect invariant or snapshot failures, identify allocation mismatches, trace balances to source events, explain reversals and late changes, reconstruct DPD inputs and quantify decision impact.</p>
    <KeyObservation title="Bounded role"><p><strong>State reconstruction + invariant monitoring + reconciliation support.</strong> It must not autonomously alter authoritative balances or ledger entries.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Governed balance, DPD, exposure and behavioural state.</Link></p></article><article><h3>Finance</h3><p><Link href="/services/cfo-function">Component reconciliation, allocation evidence and write-off lineage.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Explainable current and point-in-time state for automated decisions.</Link></p></article></div>
    <p>Continue with <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Payment and Credit Event Processing</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link> and <Link href="/resources/why-batch-risk-is-becoming-a-business-risk">Why Batch Risk Is Becoming a Business Risk</Link>. Late corrections, chargebacks and a dedicated DPD engine are future Engineering directions, not fabricated routes.</p>
    <EntimemaFramework title="Entimema account-state decision framework" steps={["Define aggregate", "Define primitive state", "Define event effects", "Separate allocation", "Derive secondary state", "Define invariants", "Snapshot", "Replay", "Reconcile", "Expose state API"]} />
    <KeyObservation title="Engineering resolve"><p><strong>If the platform cannot replay an account and explain the same balance, exposure and delinquency state every time, it does not yet possess trustworthy financial state.</strong></p></KeyObservation>
  </section>
</div>; }
