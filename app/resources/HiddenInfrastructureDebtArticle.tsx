import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./hidden-infrastructure-debt.module.css";

export const hiddenInfrastructureDebtSections=[
 {id:"facade",label:"Digital facade"},{id:"debt",label:"Infrastructure debt"},{id:"path",label:"The broken path"},
 {id:"latency",label:"Decision latency"},{id:"truths",label:"Three truths"},{id:"time",label:"Time architecture"},
 {id:"events",label:"Event and state"},{id:"payment",label:"Payment-state case"},{id:"identity",label:"Identity and exposure"},
 {id:"reconciliation",label:"Reconciliation tax"},{id:"modelrisk",label:"Infrastructure model risk"},{id:"architecture",label:"Modernise around core"},
 {id:"diagnostic",label:"Debt diagnostic"},{id:"case",label:"Institution case"},{id:"slices",label:"Vertical slices"},
 {id:"failures",label:"Failure modes"},{id:"agent",label:"Financial State Agent"},
] as const;

const failures=[
 ["Digital front end equals digital institution","Interface speed conceals delayed internal state."],["Legacy means old software","The material issue is the decision path, not product age."],["Replace core first","Cost, migration risk and time can overwhelm decision value."],["Batch used without latency analysis","Value decays before the decision sees changed risk."],
 ["Real time everywhere","Complexity rises where business value does not."],["APIs equal semantic integration","Transport does not align identity, time or state definitions."],["Spreadsheet as permanent integration","Critical lineage and control remain fragile."],["Email as decision workflow","Recurring high-volume action is not reproducible."],
 ["Many state copies without ownership","Refresh and transformation differences make reconciliation structural."],["Operational equals accounting state","Different purposes and timing are collapsed."],["Event time equals posting time","Point-in-time evidence becomes incoherent."],["Late events ignored","Historical analytical state remains wrong."],
 ["Reversals are manual corrections","Event lineage and restatement are broken."],["Customer, account and facility conflated","Total exposure and risk state are incomplete."],["Uptime is semantic quality","Healthy systems can deliver stale or contradictory data."],["Model drift blamed for infrastructure drift","Changed pipelines masquerade as changed risk."],
 ["More controls instead of architecture","Reconciliation effort grows without removing the source."],["Reconciliation is the solution","A detective control becomes permanent middleware."],["AI on fragmented state","Automation accelerates unreconciled semantics."],["Horizontal transformation first","Years of work begin before decision value is proven."],
 ["Broken process automated","Manual debt becomes automation debt."],["Technology disconnected from economics","Architecture optimises elegance rather than outcomes."],
];

export default function HiddenInfrastructureDebtArticle(){return <div className={styles.articleBody}>
 <section id="facade"><p className={styles.lead}>Most modern lenders do not suffer from a shortage of models. They suffer from a broken path between financial events, analytical truth and executable decisions.</p>
  <div className={styles.facade}><article><b>DIGITAL EXPERIENCE</b><strong>Instant onboarding · mobile application · digital signature · real-time notifications</strong></article><i>≠</i><article><b>OPERATING ARCHITECTURE</b><strong>Nightly batch · spreadsheet adjustment · reconciliation · email · another batch</strong></article></div>
  <Formula label="Foundational distinction"><span className={styles.formula}>Digital Experience ≠ Digital Operating Architecture</span></Formula>
  <p>A modern app and API onboarding can sit above delayed ledger postings, disconnected systems and duplicated customer states. <strong>Digitalisation at the interface does not imply digitalisation of institutional cognition.</strong></p>
  <KeyObservation title="The resolve"><p><strong>Keep systems of record where replacement is not economically justified. Modernise the path from event to analytical state to decision.</strong></p></KeyObservation>
 </section>

 <section id="debt"><h2>Infrastructure debt is distributed across thousands of small bridges</h2>
  <Formula label="Conceptual infrastructure debt"><span className={styles.formula}>Infrastructure Debt = Technical Complexity + Manual Integration + Data Latency + Reconciliation Burden + Decision Risk</span></Formula>
  <p>It rarely appears as one incident or cost centre. It appears as analysts downloading files, mapping IDs, fixing dates, reconciling balances, rerunning reports and explaining discrepancies.</p>
  <div className={styles.middleware}>{["Export","Copy","Map","Reconcile","Correct","Explain","Repeat"].map(x=><span key={x}>{x}</span>)}</div>
  <p>These analysts become <strong>human integration middleware</strong>. If senior experts spend 35% of capacity gathering and reconciling fictional portfolio data, only 65% remains for model challenge, strategy, early warning and portfolio analysis.</p>
  <Formula label="Analytical capacity tax"><span className={styles.formula}>Available Analytical Capacity = Total Expert Capacity − Reconciliation Tax</span></Formula>
 </section>

 <section id="path"><h2>One lending decision depends on a hidden system chain</h2>
  <p>Behind an application can sit customer master, servicing, payment processor, bureau, CRM, collections, ledger, warehouse, model platform and rules engine. Multiple systems are not the failure. Incoherent identity, event, timing and state models are.</p>
  <EntimemaFramework title="The Broken Decision Path" steps={["Financial event","System of record","Data copy","Transformation","Reconciliation","Analytical interpretation","Decision","Action","Outcome"]}/>
  <div className={styles.dual}><article><h3>System of Record</h3><p>Authoritative operational or accounting information: servicing, settlement, loan ledger or core.</p></article><article><h3>System of Decision</h3><p>Transforms current evidence into approval, pricing, limit, warning, collections priority or ECL.</p></article></div>
  <p>A system of record does not automatically create a decision architecture. Every handoff adds latency, transformation error, identifier mismatch, timing mismatch and stale-state risk.</p>
 </section>

 <section id="latency"><h2>Batch becomes a risk issue when value decays faster than the pipeline moves</h2>
  <p>Batch is appropriate for periodic decisions and slowly changing data. It becomes economically material when Decision Latency exceeds Risk Change Velocity: today’s warning arrives tomorrow; an intraday utilisation spike reaches limits after exposure has changed; a payment posts after the collections queue is produced.</p>
  <Formula label="Decision latency"><span className={styles.formula}>Decision Latency = Data Latency + Processing Latency + Model Latency + Workflow Latency</span></Formula>
  <ResourceTable caption="Latency components" headers={["Component","What waits","Typical hidden cause"]} rows={[["Data","Event → availability","Batch extraction or delayed source posting"],["Processing","Available data → features","ETL, aggregation and reconciliation"],["Model","Features → score","Daily, weekly or monthly cadence"],["Workflow","Score → action","Email, manual queue or committee cycle"]]}/>
  <Formula label="Freshness chain"><span className={styles.formula}>Freshness Decision = min(Freshness Data, Freshness Features, Freshness Model, Freshness Workflow)</span></Formula>
  <p>A statistically excellent model cannot be more current than its stalest critical dependency.</p>
 </section>

 <section id="truths"><h2>Operational, accounting and analytical truth must reconcile—not collapse</h2>
  <div className={styles.truths}><article><b>OPERATIONAL TRUTH</b><p>What has been initiated, authorised, serviced or settled operationally.</p></article><article><b>ACCOUNTING TRUTH</b><p>What has been posted and recognised under ledger rules.</p></article><article><b>ANALYTICAL TRUTH</b><p>The derived exposure, delinquency, behaviour or risk state required for a decision.</p></article></div>
  <p>Neither operational nor accounting state is inherently wrong when they differ at an instant. They answer different questions. The failure is making those differences implicit and asking humans to discover them repeatedly.</p>
  <Formula label="Canonical analytical state"><span className={styles.formula}>Stateᵢ(T) = coherent, reproducible decision state for customer/account i at time T</span></Formula>
  <p>Canonical does not mean one giant database. It means shared definitions, controlled events, consistent identifiers and reproducible state across a distributed architecture.</p>
 </section>

 <section id="time"><h2>A row can contain five different versions of “now”</h2>
  <p>Balance may be yesterday’s, bureau today’s, income last month’s and payment status this morning’s. The row does not represent one coherent customer state.</p>
  <div className={styles.time}>{["Event time","Processing time","Posting time","Analytical effective time","Decision time"].map(x=><span key={x}>{x}</span>)}</div>
  <p>For decision time T, X(T) should use information valid and legitimately available at or before T. Preserve event, arrival, processing, posting and effective timestamps rather than collapsing them.</p>
  <p>Late-arriving or backdated events require analytical restatement: original state, corrected state, reason and version. This protects model validation, backtesting, EWS and ECL from hindsight leakage.</p>
 </section>

 <section id="events"><h2>Events make financial state reconstructable</h2>
  <Formula label="Event-derived state"><span className={styles.formula}>Stateₜ = Stateₜ₋₁ + Eventsₜ</span></Formula>
  <Formula label="Illustrative balance reconstruction"><span className={styles.formula}>Balanceₜ = Balanceₜ₋₁ + Drawdowns − Payments + Interest + Fees + Corrections</span></Formula>
  <p>Models consume states, but state alone hides timing, direction and cause. Two borrowers with the same balance can have arrived through very different drawdown and payment histories.</p>
  <p>Events also need finality: initiated, authorised, settled, posted and reversed are different. A robust ledger of analytical events supports Event and Reversal(Event) without corrupting history.</p>
 </section>

 <section id="payment"><h2>One €500 payment creates multiple institutional states</h2>
  <ResourceTable caption="Original fictional payment-state case" headers={["Time","Event / system state","Potential institutional interpretation"]} rows={[["09:00","Customer initiates €500 payment","Intent exists; not final"],["09:05","PSP authorises","Operational confidence rises"],["16:00","Settlement completes","Economic cash movement becomes stronger"],["23:00","Servicing posts","Account state updates"],["02:00 next day","Risk warehouse refreshes","Analytical features finally change"],["08:00 next day","Collections queue generated","Decision workflow sees updated state"]]}/>
  <p>If collections evaluates before posting, the borrower may be falsely delinquent and receive the wrong contact, warning or behavioural feature. If a provisional payment appears to cure then reverses, the opposite false cure occurs.</p>
  <ResourceFigure label="Payment event to collections decision." caption="A single economic event traverses several states before it becomes visible to the decision workflow."><div className={styles.payment}>{["Initiated","Authorised","Settled","Posted","Risk refreshed","Queue generated"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
 </section>

 <section id="identity"><h2>Customer, account, facility and exposure are different objects</h2>
  <Formula label="Identity distinction"><span className={styles.formula}>Customer ≠ Account ≠ Facility ≠ Exposure</span></Formula>
  <p>One borrower can have loan, card and overdraft across separate systems, plus customer, account, card, collections-case and ledger identifiers. Weak mapping understates total exposure, affordability burden and behavioural stress.</p>
  <p>The same borrower can be current in loan servicing, overdue on card, flagged in collections and Stage 2 in ECL. A governed cross-facility risk view must preserve source states and explain how the aggregate analytical state was formed.</p>
 </section>

 <section id="reconciliation"><h2>Reconciliation is a control; the reconciliation tax is an architectural symptom</h2>
  <p>Finance–risk differences can arise from scope, timing, write-offs, accrued interest, undrawn exposure, stage definitions and late postings. Reconciliation is essential—but repeated unexplained rebuilding of the same bridge is infrastructure debt.</p>
  <Formula label="Reconciliation difference"><span className={styles.formula}>Difference = Scope + Timing + Definition + Transformation + Error</span></Formula>
  <ResourceTable caption="Fictional monthly reconciliation tax" headers={["Activity","People-days","Decision impact"]} rows={[["Source extracts and ID mapping","18","Late portfolio cut"],["Balance / exposure reconciliation","24","ECL and limit state delayed"],["Manual adjustments and reruns","15","Results lose reproducibility"],["Variance explanation","13","Experts explain plumbing, not risk"],["Total","70","Material analytical-capacity tax"]]}/>
  <p>Adding more controls can detect more differences while leaving the cause intact. The target is controlled lineage and explainable differences by design.</p>
 </section>

 <section id="modelrisk"><h2>Infrastructure drift can masquerade as model drift</h2>
  <p>A feature can move because customer behaviour changed—or because source mapping, refresh cadence, null handling, account scope or posting rules changed. Model monitoring must distinguish population and risk drift from pipeline drift.</p>
  <p><Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> requires point-in-time reconstruction; <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> depends on timely event history; <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 ECL</Link> requires finance–risk lineage. Infrastructure quality is therefore part of model risk.</p>
  <p>Monitor semantic quality beside uptime: freshness, completeness, reconciliation status, event finality, lineage, identifier coverage and reproducibility of past decisions.</p>
 </section>

 <section id="architecture"><h2>Modernise around the core</h2>
  <EntimemaFramework title="Entimema Decision Infrastructure" steps={["Legacy core / SaaS / payments / accounting","Integration and event layer","Canonical financial state","Risk intelligence","Decision layer","Action / feedback"]}/>
  <p>The replacement fallacy assumes core banking must go first. Core systems are designed to record, settle, service and account for contracts; data warehouses are strong for reporting and history. Neither must become a real-time feature platform or experimentation engine.</p>
  <p><strong>Keep systems of record. Modernise the path from data to decision.</strong> APIs help transport data, but semantic integration still requires shared identity, event, time and state contracts.</p>
  <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Model data, ECL lineage, behavioural evidence and portfolio monitoring.</Link></p></article><article><h3>Finance / CFO</h3><p><Link href="/services/cfo-function">Reconciliation, closing integrity and operational/accounting state.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision-ready data, workflows, event-driven action and monitoring.</Link></p></article></div>
 </section>

 <section id="diagnostic"><h2>The Infrastructure Debt Diagnostic starts with one decision</h2>
  <ResourceTable caption="Entimema Infrastructure Debt Diagnostic" headers={["Dimension","Low","Material","Structural"]} rows={[["Fragmentation","Owned interfaces","Repeated copies","No authoritative mapping"],["Latency","Aligned to decision","Value sometimes decays","Decision routinely sees stale state"],["Manual integration","Exception-only","Recurring bridges","Humans are primary middleware"],["Temporal consistency","Explicit timestamps","Mixed snapshots","Decision time cannot be reconstructed"],["Identity","Governed mapping","Coverage gaps","Exposure materially incomplete"],["Reconciliation","Explained exceptions","Persistent differences","Control is permanent production logic"],["Decision reproducibility","Replayable","Partial lineage","Past output cannot be explained"]]}/>
  <p>For the chosen decision ask: What happened? Where was it recorded? When did Risk know? When did Finance know? When did the engine know? What manual bridge existed? Could the decision be reproduced?</p>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Identify decision","Trace required events","Map systems","Measure latency","Identify conflicting states","Quantify reconciliation","Define canonical state","Modernise critical path","Automate","Monitor"]}/>
 </section>

 <section id="case"><h2>A fictional lender looks real-time until the first payment exception</h2>
  <p>A mid-sized lender originates digitally in minutes, but servicing, payments, collections and ECL each copy account state overnight. Risk analysts spend 32% of capacity on ID mapping and balance reconciliation. Collections sees successful payments 14 hours late; ECL exposure closes three days after month-end.</p>
  <ResourceTable caption="Original infrastructure case before and after one decision-path redesign" headers={["Measure","Before","After vertical slice"]} rows={[["Payment → collections-state latency","14 hours","18 minutes after confirmed settlement"],["Manual reconciliation effort","44 person-days / month","12 person-days / month"],["Unmapped cross-facility exposure","6.8% of accounts","0.7%"],["Reproducible collections decisions","61%","96%"],["Core replacement","Not started","Not required for slice"]]}/>
  <p>The solution is not a universal “real-time bank.” It is a controlled payment event, identity mapping, canonical delinquency state and monitored handoff to collections—while the servicing and ledger systems remain authoritative.</p>
 </section>

 <section id="slices"><h2>Modernise one complete decision path before the entire institution</h2>
  <p>A vertical slice connects event to action end-to-end: <strong>Payment Event → Delinquency State → Collections Priority</strong>. It proves decision value, exposes semantics and creates reusable infrastructure.</p>
  <Formula label="Modernisation priority"><span className={styles.formula}>Priority = f(Business Value, Decision Latency, Manual Effort, Risk Materiality, Implementation Complexity)</span></Formula>
  <p>A quick win automates manual transfer. A structural fix establishes canonical event and state semantics. Automation should relieve immediate pain without freezing a broken process into <strong>automation debt</strong>.</p>
  <div className={styles.workflow}>{["Systems inventory","Event inventory","Identity mapping","State definitions","Timestamp mapping","Reconciliation map","Decision dependencies","Priority vertical slice","Engineering design","Monitoring"].map(x=><span key={x}>{x}</span>)}</div>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Infrastructure-modernisation failures" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Financial State & Reconciliation Agent can make decision readiness visible</h2>
  <p>A future Agent can ingest approved sources, map customer/account/facility identifiers, identify stale states, compare operational, accounting and analytical balances, detect timing mismatches and unreconciled events, surface late arrivals, explain differences, trace decisions to state and monitor freshness.</p>
  <p>Its role is <strong>financial-state reconciliation + lineage + decision-readiness monitoring</strong>. It must not autonomously alter accounting records or production source systems.</p>
  <div className={styles.agent}>{["Financial State Agent","Identity Resolution Agent","Feature Integrity Agent","Decision Engine Monitoring Agent","Early Warning / Collections Agents"].map(x=><span key={x}>{x}</span>)}</div>
  <p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>, <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>, <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD & Credit Conversion Factors</Link> and <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link>.</p>
 </section>
</div>}
