import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./consumer-credit-early-warning.module.css";

export const consumerCreditEarlyWarningSections=[
 {id:"meaning",label:"Warning to intervention"},{id:"architecture",label:"Early warning architecture"},{id:"trajectory",label:"Level and trajectory"},
 {id:"signals",label:"Signal taxonomy"},{id:"confirmation",label:"Confirmation and baseline"},{id:"context",label:"Product and portfolio context"},
 {id:"priority",label:"Intervention priority"},{id:"capacity",label:"Capacity and lead time"},{id:"actions",label:"Alert lifecycle"},
 {id:"evidence",label:"Outcome evidence"},{id:"portfolio",label:"Portfolio case"},{id:"accounting",label:"SICR and ECL"},
 {id:"non-bank",label:"Non-bank perspective"},{id:"failures",label:"Failure modes"},{id:"agent",label:"Early Warning Agent"},
] as const;

const failures=[
 ["EWS is a list of alerts","Detection never becomes ranked, owned intervention."],["Every signal equal","Severity, persistence, evidence quality and materiality differ."],
 ["Risk level without trajectory","Stable high risk and rapid deterioration are treated alike."],["One signal means distress","Technical and temporary events create false positives."],
 ["Redundant triggers counted independently","Correlated utilisation signals exaggerate evidence."],["No behavioural baseline","Normal customer-specific patterns become warnings."],
 ["No persistence","One-period noise drives unstable treatment."],["No exposure materiality","Scarce attention ignores financial risk at stake."],
 ["Highest PD is highest priority","Late, unavoidable defaults can displace actionable cases."],["Prediction equals actionability","A strong forecast may offer no plausible intervention benefit."],
 ["No capacity constraint","Alert volume overwhelms servicing and collections."],["Alert volume unmonitored","Data defects or threshold changes look like deterioration."],
 ["No lead-time analysis","The system cannot balance early noise against useful intervention time."],["No alert lifecycle","Cases have no triage, follow-up or accountable resolution."],
 ["No resolution state","The system cannot learn cure, escalation or default outcomes."],["Treatment outcomes read causally","Higher-risk customers receive stronger interventions non-randomly."],
 ["EWS equals SICR","Operational intervention and accounting staging are different decisions."],["Warning begins after delinquency","The most valuable pre-delinquency window is missed."],
 ["No model or rule versions","Alert changes cannot be reconstructed."],["No alert vintages","Outcome maturity and strategy changes are mixed."],
 ["Threshold-only monitoring","Trajectory, persistence and capacity remain invisible."],["Warning-rule graveyard","Temporary, duplicated and obsolete triggers accumulate noise."],
 ["No portfolio aggregation","Systemic deterioration is mistaken for isolated cases."],["High-frequency strategy noise","Fast signals provoke churn before evidence confirms movement."],
];

export default function ConsumerCreditEarlyWarningArticle(){return <div className={styles.articleBody}>
 <section id="meaning"><p className={styles.lead}>An early warning system is not a list of alerts. It is a prioritisation architecture that converts weak signals of deterioration into timely, proportional and economically justified intervention.</p>
  <div className={styles.dual}><article><b>PD MODEL</b><strong>P(Default | X)</strong><span>How likely is default?</span></article><i>≠</i><article><b>EARLY WARNING SYSTEM</b><strong>Change → confirmation → priority → action</strong><span>Has deterioration become actionable now?</span></article></div>
  <p>A borrower rarely moves from performing to default without intermediate behaviour, yet most signals are noisy. If every observation becomes an alert, operations collapse. If evidence requirements are too conservative, the useful intervention window closes.</p>
  <KeyObservation title="The operating question"><p><strong>Which deteriorating customers deserve attention now—and why is intervention likely to matter?</strong></p></KeyObservation>
 </section>

 <section id="architecture"><h2>Warning becomes useful only when it resolves into priority</h2>
  <EntimemaFramework title="Entimema Consumer Credit Early Warning Architecture" description="Risk change is confirmed before exposure, actionability and constrained operational capacity determine priority." steps={["Account behaviour","Raw signals","Persistence / severity / corroboration","Risk change / velocity","Exposure and materiality","Intervention value","Priority","Action","Outcome","Feedback / recalibration"]}/>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Observe","Detect change","Confirm evidence","Assess severity","Quantify exposure","Estimate actionability","Prioritise","Intervene","Observe outcome","Learn"]}/>
 </section>

 <section id="trajectory"><h2>Early warning cares about direction—not only current risk level</h2>
  <Formula label="Risk change and velocity"><span className={styles.formula}>ΔRiskₜ = Riskₜ − Riskₜ₋₁ &nbsp; | &nbsp; Velocityₜ = Riskₜ − Riskₜ₋₁</span></Formula>
  <Formula label="Deterioration acceleration"><span className={styles.formula}>Accelerationₜ = Velocityₜ − Velocityₜ₋₁</span></Formula>
  <p>A customer can be high risk but stable; another can be moderate risk and deteriorating rapidly. Velocity and acceleration are conceptual views, not universal metrics, but they prevent a static level from hiding worsening trajectory.</p>
  <ResourceTable caption="Same current utilisation; different warning meaning" headers={["Customer","Normal utilisation","Current utilisation","Trajectory","Interpretation"]} rows={[["A","Around 80%","80%","Stable","High level; limited new information"],["B","Around 20%","80%","Rapid 20% → 80%","Material relative-to-self deterioration"]]}/>
  <p>Absolute rules such as utilisation &gt; c and relative rules such as Δ utilisation &gt; c′ answer different questions. Meaning also depends on whether change occurred over a day, month or six months. Recency, persistence and time windows must follow product mechanics.</p>
 </section>

 <section id="signals"><h2>Signals need a structured taxonomy before they need a score</h2>
  <div className={styles.signalGrid}>{[
   ["PAYMENT BEHAVIOUR","Missed, partial, late or returned payment"],["UTILISATION","Rising use, repeated full use, limit exhaustion"],
   ["LIQUIDITY","Declining balance, overdraft dependence, cash-flow compression"],["EXTERNAL CREDIT","New borrowing, bureau deterioration, multiple enquiries"],
   ["AFFORDABILITY","Income decline, rising debt service, shrinking residual"],["CONTACT / COLLECTIONS","Failed promises, broken arrangements, repeated unreachable status"],
  ].map(x=><article key={x[0]}><b>{x[0]}</b><p>{x[1]}</p></article>)}</div>
  <p>Not every lender has, needs or may appropriately use every input. Revolving credit can emphasise utilisation, payment-to-balance ratio, cash advances or exhaustion; instalment lending can emphasise delay, partial payment, rescheduling and failed debit. First-payment problems may indicate fraud, onboarding, affordability or payment setup—not one universal cause.</p>
  <p>Some apparent deterioration is operational: missing feeds, failed bureau refresh or duplicated payment events. Route evidence first as <strong>credit deterioration, data/system issue or customer-contact issue</strong>.</p>
 </section>

 <section id="confirmation"><h2>A signal is an observation; a risk state is an interpretation</h2>
  <ResourceFigure label="Signal confirmation architecture." caption="Persistence and genuinely distinct corroboration convert a weak observation into a more credible risk state."><div className={styles.confirm}>{["Signal","Persistence","Corroboration","Risk state"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <Formula label="Evidence strength"><span className={styles.formula}>Evidence strength = f(Number, Consistency, Persistence, Severity)</span></Formula>
  <p>Utilisation ↑, balance ↓ and payment delay ↑ can corroborate distress. But high utilisation, low available credit and limit exhaustion often describe the same mechanism; counting them as independent evidence inflates confidence. Track trigger overlap, unique alert contribution and primary reason.</p>
  <p>Compare behaviour with <strong>Baselineᵢ</strong>, compatible segments, portfolio, vintage and seasonal reference. A late payment’s severity can depend on amount, DPD, recurrence and account history. Recent evidence may deserve more weight, but no universal decay function fits all portfolios.</p>
  <p>Warning rules can form a graveyard just like policy rules: duplicated crisis triggers and obsolete temporary controls remain after their purpose expires. Review hit rate, unique contribution, overlap, persistence and subsequent meaningful deterioration.</p>
 </section>

 <section id="context"><h2>Account warning gains meaning from migration, vintage and segment context</h2>
  <p><Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> structures Current → 30 DPD and 30 → 60 transitions. The highest warning value is often before 30 DPD, when utilisation spikes, worsening payment amount, liquidity compression or new indebtedness can still precede formal delinquency.</p>
  <ResourceTable caption="Fictional signal development by origination vintage" headers={["Vintage","MOB 2","MOB 4","Interpretation"]} rows={[["A","Stable warning incidence","Stable early delinquency","Reference trajectory"],["B","Utilisation stress +22%","30 DPD still near baseline","Pre-delinquency concern before mature loss"],["C","Partial payments +18%","Current → 30 roll rises","Origination or channel hypothesis strengthens"]]}/>
  <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> separates seasoning from cohort quality. Segment by product, tenure, customer type, risk grade and channel because one-size triggers create noise. Broad simultaneous warnings can be systemic macro deterioration rather than independent borrower events.</p>
  <p>Origination score is not a lifetime risk view. Behavioural scores and PD migration update as activity evolves; track Scoreₜ → Scoreₜ₊₁, Δ score or ΔPD with persistence and model-monitoring controls.</p>
 </section>

 <section id="priority"><h2>Highest default risk is not highest intervention priority</h2>
  <Formula label="Risk at stake"><span className={styles.formula}>Risk at stakeᵢ = PDᵢ × LGDᵢ × EADᵢ</span></Formula>
  <Formula label="Conceptual priority"><span className={styles.formula}>Priorityᵢ = f(Deterioration, Default risk, Exposure, Urgency, Intervention value)</span></Formula>
  <p>A €500 and €50,000 exposure with the same deterioration signal do not create equal financial materiality. Yet EL alone is insufficient: a predictive macro signal may offer no account-specific action, while moderate risk with early recoverability can justify prompt attention.</p>
  <Formula label="Expected intervention value"><span className={styles.formula}>Expected intervention value = Expected loss without action − Expected loss with action − Intervention cost</span></Formula>
  <p>This is a decision concept, not an easily observed causal quantity. It separates <strong>predictive value</strong> from <strong>intervention value</strong>.</p>
  <ResourceTable caption="Fictional account priorities" headers={["Account","PD / state","Exposure","Trajectory","Actionability","Priority interpretation"]} rows={[["A","42%; severe delinquency","€8,000","Already late-stage","Low remaining window","High risk; not necessarily first preventive case"],["B","14%; current","€35,000","Rapid multi-signal decline","Early and plausibly actionable","Highest preventive priority"],["C","28%; early arrears","€700","Moderate deterioration","Actionable but low materiality","Lower queue priority"]]}/>
  <ResourceFigure label="Default risk by intervention value matrix." caption="Risk and actionability are separate dimensions; the highest-risk account can be too late for the highest preventive value."><div className={styles.matrix}><span></span><b>HIGH INTERVENTION VALUE</b><b>LOW INTERVENTION VALUE</b><b>HIGH DEFAULT RISK</b><article><strong>Priority intervention</strong><small>Material and still actionable</small></article><article><strong>Manage / contain</strong><small>Risk high; benefit may be limited</small></article><b>LOWER DEFAULT RISK</b><article><strong>Early preventive opportunity</strong><small>Moderate risk, strong window</small></article><article><strong>Monitor</strong><small>Low urgency and value</small></article></div></ResourceFigure>
 </section>

 <section id="capacity"><h2>Operational capacity turns alerting into optimisation</h2>
  <Formula label="Capacity constraint"><span className={styles.formula}>If alerts &gt; Capacity and only K cases can be reviewed, rank the K highest expected intervention values</span></Formula>
  <p>Precision asks how many alerts later represent meaningful deterioration; recall asks how many deteriorating accounts were found. Neither alone resolves a capacity-limited queue. False positives create workload, poor experience and unnecessary restrictions; false negatives delay help and increase loss.</p>
  <Formula label="Alert rate and confirmation"><span className={styles.formula}>Alert rateₜ = Alertsₜ / Accountsₜ &nbsp; | &nbsp; Meaningful deterioration rate = Confirmed later / Alerts</span></Formula>
  <ResourceFigure label="Early detection lead-time frontier." caption="Earlier signals create more intervention time but may be noisier; later evidence is often more precise but leaves less room to change the outcome."><div className={styles.frontier}><b>SIGNAL PRECISION ↑</b><span></span><i>USEFUL OPERATING REGION</i><em>LEAD TIME BEFORE DEFAULT →</em></div></ResourceFigure>
  <p>Lead time = T default/collections − T alert. A 30- or 90-day horizon may be operationally useful, but product and intervention window determine the right horizon. Very early does not automatically mean better.</p>
 </section>

 <section id="actions"><h2>Intervention must be proportional, explainable and resolved</h2>
  <ResourceFigure label="Alert lifecycle from trigger through outcome." caption="Every alert needs ownership, a proportional response and an explicit resolution state so the system can learn."><div className={styles.lifecycle}>{["Trigger","Triage","Intervention","Follow-up","Resolution","Outcome"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <p>A conceptual ladder is <strong>monitor → soft outreach → review → risk mitigation → collections</strong>. Possible action families include information request, reminder, financial review, limit review, restructuring assessment or manual contact. The correct choice depends on policy, evidence, customer situation and applicable requirements—not a universal trigger table.</p>
  <p>Use watch, elevated and critical states where appropriate. Persistence can escalate a watch; severe corroborated evidence can create critical review. Entry and exit hysteresis can prevent Alert → No Alert → Alert oscillation. Resolution should distinguish resolved, monitoring, escalated, defaulted and cured.</p>
  <p>Internal explanations should identify primary reason, secondary reasons and evidence strength: utilisation spike, repeated late payments, rapid PD increase or external indebtedness change. Opaque scores alone do not support accountable triage.</p>
 </section>

 <section id="evidence"><h2>Intervention outcomes are selected—not automatically causal</h2>
  <p>The riskiest customers often receive the strongest intervention. Therefore Outcome | Treatment cannot be compared naively: high loss after intensive treatment does not show treatment caused loss. Track cure, normalisation, stability and further deterioration, but preserve treatment-selection bias.</p>
  <Formula label="Alert vintage outcomes"><span className={styles.formula}>Outcomeᵥ,ₜ = delinquency, default, cure and collections entry by alert vintage v and months since alert t</span></Formula>
  <p>Evaluate at portfolio-relevant horizons such as 30, 90 or 180 days and default maturity. Controlled intervention tests may improve evidence where safe and governed, but necessary customer support and mandatory actions should never be withheld for experimentation.</p>
  <p><Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger Strategy</Link> can test alert thresholds, priority functions and signal combinations inside approved boundaries. Model/rule versions and action logs must travel with every alert.</p>
 </section>

 <section id="portfolio"><h2>Portfolio aggregation can reveal deterioration before default rises</h2>
  <div className={styles.evidence}>{[["LEADING","Utilisation stress / score migration / warning rate"],["INTERMEDIATE","Partial payments / early delinquency / roll rates"],["LAGGING","Default / EAD / loss / realised collections outcome"]].map(x=><article key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></article>)}</div>
  <ResourceTable caption="Fictional consumer lender: five-month deterioration" headers={["Month","Observed portfolio signal","What the EWS learns"]} rows={[["1","Stable utilisation and payments","Behavioural baseline"],["2","Utilisation rises modestly","Weak leading signal; watch, do not overreact"],["3","Repeated partial payments increase","Independent corroboration strengthens deterioration state"],["4","Current → 30 DPD roll worsens","Intermediate migration confirms portfolio concern"],["5","Defaults rise","Lagging outcome validates earlier signal sequence"]]}/>
  <p>The useful evidence was not utilisation alone. Its persistence plus partial-payment breadth and later roll-rate deterioration created a confirmed portfolio warning before default became visible. Investigate whether movement is systemic, channel-specific or vintage-specific before applying account-level narratives.</p>
 </section>

 <section id="accounting"><h2>Early warning and SICR can share evidence without sharing a decision</h2>
  <div className={styles.dual}><article><b>EARLY WARNING</b><strong>Operational deterioration and intervention</strong><span>Who needs attention and what response is proportionate?</span></article><i>≠</i><article><b>SICR</b><strong>IFRS 9 impairment staging</strong><span>Has credit risk increased significantly for accounting?</span></article></div>
  <p>Warning evidence can affect PD, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR</Link>, Stage 2 assessment and <Link href="/resources/ifrs-9-expected-credit-loss-architecture">ECL</Link>, but it should not mechanically equal accounting staging. Operational and accounting decisions have different purposes, thresholds and governance.</p>
  <p>The lifecycle can be <strong>performing → warning → pre-collections → collections</strong>, with institutional state definitions kept explicit. Early warning should make that transition smoother without prescribing coercive treatment.</p>
 </section>

 <section id="non-bank"><h2>Non-bank lenders have a compressed warning window</h2>
  <p>High default incidence, short tenors, rapid outcomes and frequent digital interactions can make consumer-credit EWS powerful. For a three- to six-month product, weekly or transaction-level evidence may matter more than annual risk measures, provided cadence follows payment mechanics.</p>
  <p>Alert noise can overwhelm small operations. In high-risk populations, static high PD is often less informative than deterioration velocity, payment behaviour, utilisation, exposure and remaining intervention opportunity. High frequency should improve prioritisation—not create strategy noise.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Consumer-credit early-warning failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Portfolio Early Warning Agent can prioritise evidence—not take adverse action</h2>
  <p>A future Agent can ingest behaviour, monitor payments and utilisation, detect score/PD migration, identify multi-signal deterioration, suppress redundancy, measure persistence and severity, combine risk with exposure, estimate intervention priority, generate reason codes, construct queues, monitor alert vintages and surface portfolio-wide deterioration for human review.</p>
  <p>Its role is <strong>continuous deterioration surveillance + prioritisation + intervention evidence</strong>. It must not autonomously take adverse customer actions without governed decision logic.</p>
  <div className={styles.agent}>{["Decision Engine Monitoring Agent","Portfolio Early Warning Agent","Collections Strategy Agent","ECL / SICR Monitoring Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.workflow}>{["Account data feed","Behavioural features","Rule / model signals","Alert evidence","Priority engine","Intervention queue","Action logging","Outcome tracking","Vintage analysis","Monitoring / challenger"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for behavioural risk, portfolio monitoring, early-warning and collections strategy.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for continuous surveillance, prioritisation, queues and evidence workflows.</p></article></div>
  <KeyObservation title="The resolve"><p><strong>Account behaviour → deterioration signals → confirmation → risk escalation → priority → intervention → outcome → feedback.</strong> The system succeeds when scarce attention reaches cases where timely action can plausibly change the outcome.</p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link>, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR</Link>, <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 ECL</Link>, <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> and <Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger Strategy</Link>.</p>
 </section>
</div>}
