import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./promise-to-pay-analytics.module.css";

export const promiseToPayAnalyticsSections=[
 {id:"promise",label:"Promise is not payment"},{id:"architecture",label:"PTP architecture"},{id:"fulfilment",label:"Keeping and fulfilment"},
 {id:"credibility",label:"Promise credibility"},{id:"conversion",label:"Cure conversion"},{id:"contact",label:"Contact and channels"},
 {id:"causal",label:"Incremental value"},{id:"priority",label:"Priority and signals"},{id:"forecast",label:"Cash forecasting"},
 {id:"vintages",label:"PTP vintages"},{id:"case",label:"Portfolio case"},{id:"nonbank",label:"Non-bank perspective"},
 {id:"failures",label:"Failure modes"},{id:"agent",label:"PTP Analytics Agent"},
] as const;

const failures=[
 ["Promise equals payment","A commitment is not realised cash flow."],["Promise equals cure","Even a kept small payment may leave material arrears."],["High PTP rate means strong collections","Volume can reflect loose definitions, mix or incentives."],["No kept definition","The metric cannot be reproduced."],
 ["Partial treated as full","Economic value and commitment fulfilment are overstated."],["Timing ignored","Early, on-time and substantially late payments are collapsed."],["Amount realism ignored","Implausible commitments inflate volume and failure."],["Broken history ignored","A fourth promise is treated like a first."],
 ["PTP and non-PTP compared causally","Engagement and liquidity selection confound outcomes."],["Keeping confused with sustainable cure","Short-term fulfilment says little about durable recovery."],["No re-default analysis","Fragile cure inflates success."],["Promised amounts counted as cash","Forecasts assume perfect keeping and fulfilment."],
 ["No probability weighting","Expected cash ignores credibility and amount uncertainty."],["Contactability ignored","PTP metrics are conditional on engagement."],["Inconsistent contact denominator","Assigned cases and right-party contacts are mixed."],["Channels compared without selection context","Customer composition masquerades as channel effect."],
 ["Incentives reward promise volume","Unrealistic commitments can be manufactured."],["Recent cohorts treated as mature","Promises not yet due contaminate results."],["No PTP vintage","Strategy and macro regimes are mixed."],["Disconnected from priority","Broken promises do not update intervention value coherently."],
 ["Disconnected from LGD","Recovery timing and present value disappear."],["Repeated breaks equal first promise","Path dependence is lost."],["No customer-treatment governance","Analytics can drive disproportionate or intrusive workflows."],
];

export default function PromiseToPayAnalyticsArticle(){return <div className={styles.articleBody}>
 <section id="promise"><p className={styles.lead}>A promise-to-pay is an engagement signal—not cash, cure or recovery. Its value emerges only when the commitment becomes timely, sufficient and durable economic improvement.</p>
  <Formula label="Promise event"><span className={styles.formula}>PTPᵢ = (Aᵢ, Dᵢ), where Aᵢ is promised amount and Dᵢ is promised payment date</span></Formula>
  <div className={styles.distinction}><article><b>PROMISE</b><strong>Intention + expected near-term payment</strong><span>Projected, informative, uncertain</span></article><i>≠</i><article><b>PAYMENT</b><strong>Realised dated cash flow</strong><span>Observable amount, timing and economic value</span></article></div>
  <Formula label="Foundational distinctions"><span className={styles.formula}>PTP ≠ Cash Flow &nbsp; | &nbsp; PTP ≠ Cure</span></Formula>
  <KeyObservation title="The transformation"><p><strong>Did the customer promise? → Did the promise create credible and durable economic improvement?</strong></p></KeyObservation>
 </section>

 <section id="architecture"><h2>The Entimema Promise-to-Pay Architecture</h2>
  <EntimemaFramework title="Promise-to-Pay Architecture" steps={["Right-party contact","Promise made","Promise quality / credibility","Promise due","Payment amount / timing","Kept / partial / broken","Cure","Sustainable cure / re-default","Recovery value","Strategy learning"]}/>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Confirm contact","Record promise precisely","Assess credibility","Monitor due date","Measure fulfilment","Assess cure","Monitor re-default","Quantify recovery value","Learn by vintage"]}/>
  <ResourceFigure label="Promise quality funnel." caption="Every layer removes commitments that did not become meaningful and durable economic outcomes."><div className={styles.funnel}>{["PTP","Kept PTP","Meaningful payment","Technical cure","Sustainable cure"].map((x,i)=><span key={x} style={{width:`${100-i*14}%`}}>{x}</span>)}</div></ResourceFigure>
 </section>

 <section id="fulfilment"><h2>Kept requires explicit amount and timing architecture</h2>
  <Formula label="Promise rate"><span className={styles.formula}>Promise Rate = Accounts making PTP / Eligible contacted accounts</span></Formula>
  <Formula label="Promise kept rate"><span className={styles.formula}>PKR = Promises kept / Promises due</span></Formula>
  <p>“Kept” may mean exact amount, minimum agreed amount, payment within a documented tolerance or full arrears clearance. There is no universal standard, but the definition must be explicit and stable.</p>
  <Formula label="Fulfilment diagnostics"><span className={styles.formula}>Delay = Actual Payment Date − Promised Date &nbsp; | &nbsp; Amount Fulfilment = Actual Payment / Promised Amount</span></Formula>
  <ResourceTable caption="Four original fictional promises" headers={["Account","Promise","Observed payment","Classification"]} rows={[["A","€300","€300 on time","Full kept"],["B","€300","€100 on time","Partial kept; 33% amount fulfilment"],["C","€300","€300 ten days late","Full amount, timing miss"],["D","€300","€0","Broken promise"]]}/>
  <p>Partial payment has economic meaning but is not full promise fulfilment. Preserve amount, date and tolerance evidence rather than forcing every outcome into one Boolean.</p>
 </section>

 <section id="credibility"><h2>Promise credibility is path-dependent</h2>
  <Formula label="Conceptual promise quality"><span className={styles.formula}>Promise Quality = f(Amount Realism, Timing Realism, Prior History, Contact Context)</span></Formula>
  <p>Where lawful and available, Promise Burden = Promised Amount / Available Capacity can support plausibility analysis without prescribing a threshold. A commitment far above demonstrated capacity may be less credible and may indicate the need for deeper support or restructuring assessment rather than repeated short-term promises.</p>
  <div className={styles.credibility}>{["Prior promise history","Affordability / capacity","Promised amount","Delinquency severity","Behavioural risk"].map(x=><span key={x}>{x}</span>)}</div>
  <Formula label="Path-dependent keeping"><span className={styles.formula}>P(Keepₖ₊₁) = f(Current Promise, Promise History)</span></Formula>
  <p>Track N prior promises, N broken promises, historical PKR, time between promises and amount progression. A first promise can be informative engagement; Promise → Break → Promise → Break can become a deterioration signal. Broken severity should distinguish no payment, partial payment, late payment and repeated failure.</p>
 </section>

 <section id="conversion"><h2>Keeping a promise is not curing an account</h2>
  <Formula label="Different probability objects"><span className={styles.formula}>P(Keep PTP) ≠ P(Cure) ≠ P(Sustainable Cure)</span></Formula>
  <p>A borrower can keep a small promise yet remain delinquent. Compare Promised Amount / Arrears and Actual Payment / Arrears where relevant, and link payment timing to subsequent roll state.</p>
  <ResourceTable caption="Original conversion funnel from 1,000 due promises" headers={["Stage","Accounts","Rate from promises due"]} rows={[["Promises due","1,000","100%"],["Kept","650","65%"],["Technical cure","420","42%"],["Performing after six months","290","29%"]]}/>
  <p>A 65% promise-keeping rate becomes only 29% durable recovery. <Link href="/resources/cure-redefault-analytics-sustainable-recovery">Cure & Re-Default Analytics</Link> measures whether cure survives. <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> can compare 30 DPD → Current after kept PTP with 30 → 60 DPD after broken PTP.</p>
 </section>

 <section id="contact"><h2>Promise metrics are conditional on contact</h2>
  <div className={styles.workflow}>{["Accounts assigned","Contact attempt","Right-party contact","Promise","Kept promise","Cure"].map(x=><span key={x}>{x}</span>)}</div>
  <Formula label="Contact-conditioned promise rate"><span className={styles.formula}>PTP Rate RPC = Promises / Right-Party Contacts</span></Formula>
  <p>Digital, human and self-service channels can generate different promise volumes and fulfilment, but selection matters. One channel may produce more promises with lower PKR; another fewer promises with stronger cure conversion. Compare the whole funnel and customer mix.</p>
  <div className={styles.hierarchy}>{["Level 1 · Promise rate","Level 2 · Promise kept rate","Level 3 · Cash fulfilment","Level 4 · Cure conversion","Level 5 · Sustainable cure / economic recovery"].map(x=><span key={x}>{x}</span>)}</div>
  <p>If incentives reward only PTP volume, teams or systems can generate unrealistic amounts and dates. Monitor quality at process level rather than using punitive individual surveillance.</p>
 </section>

 <section id="causal"><h2>Payment after a promise is not payment because of the promise</h2>
  <Formula label="Incremental PTP value"><span className={styles.formula}>Incremental PTP Value = Outcome PTP Strategy − Outcome Alternative</span></Formula>
  <p>Customers willing to promise may already be more engaged, liquid and likely to cure. Observational P(Cure | PTP) therefore combines selection and treatment. PTP uplift is not directly identifiable without assumptions or governed design.</p>
  <p>Champion/challenger testing may compare acceptable reminder timing, structures or channels, but must never withhold required support, hardship options or mandatory communications. <Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger Strategy</Link> supplies the wider governance discipline.</p>
 </section>

 <section id="priority"><h2>Broken promises can update risk without becoming a judgement</h2>
  <p>Upcoming promise, due-today status, partial fulfilment and repeated broken promise can update <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>, but priority still combines exposure, risk, recoverability, contactability and intervention value.</p>
  <div className={styles.workflow}>{["Upcoming PTP","Due today","Defined tolerance","Kept / partial / broken","Approved next workflow"].map(x=><span key={x}>{x}</span>)}</div>
  <p>A broken PTP can precede roll-forward, default or re-default and can feed <Link href="/resources/consumer-credit-early-warning-systems">Early Warning</Link> or <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>. Avoid circularity when scores drive the treatment that generates PTP data. A broken promise does not prove deliberate non-cooperation.</p>
 </section>

 <section id="forecast"><h2>Promises support cash forecasting only after probability weighting</h2>
  <Formula label="Naïve forecast"><span className={styles.formula}>Forecast Cash = Σ Promised Amount &nbsp; — generally overstated when promises are imperfectly kept</span></Formula>
  <Formula label="Probability-weighted PTP cash"><span className={styles.formula}>Expected PTP Cash = Σ P(Keepᵢ) × Expected Fulfilmentᵢ</span></Formula>
  <ResourceTable caption="Original fictional cash forecast" headers={["Promise segment","Promised cash","Keep probability","Expected fulfilment if kept","Expected cash"]} rows={[["First PTP","€500k","72%","92%","€331k"],["Prior kept PTP","€300k","81%","96%","€233k"],["Prior broken PTP","€400k","38%","68%","€103k"],["Total","€1.20m","—","—","€667k"]]}/>
  <p>Expected cash is €667k rather than €1.20m. Track Forecast Error = Actual Cash − Expected PTP Cash by promise vintage. Uncertainty remains, and the same €500 collected now has greater present value than €500 much later—connecting PTP timing to <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>.</p>
 </section>

 <section id="vintages"><h2>PTP vintages make strategy and maturity visible</h2>
  <Formula label="Promise vintage"><span className={styles.formula}>v = Month of Promise; compare PKRᵥ,ₕ, cash, cure and re-default at equal maturity h</span></Formula>
  <p>Collection-entry vintage, contact vintage and PTP vintage answer different questions. A promise due next week is not broken, and a newly cured account is not sustainably cured. Recent cohorts are censored and must not be compared with mature cohorts at unequal observation horizons.</p>
  <p>Interpret changes through customer mix, contactability, amount realism, strategy version and macro context rather than attributing every KPI movement to treatment.</p>
 </section>

 <section id="case"><h2>Fifteen thousand delinquent accounts become 1,350 sustainable cures</h2>
  <ResourceTable caption="Reconciled fictional quarterly PTP funnel" headers={["Stage","Accounts","Conversion from prior stage","Share of delinquent accounts"]} rows={[["Delinquent accounts","15,000","—","100%"],["Right-party contacts","9,000","60.0%","60.0%"],["PTPs","4,500","50.0%","30.0%"],["Kept PTPs","2,900","64.4%","19.3%"],["Technical cures","2,100","72.4%","14.0%"],["Sustainable cures","1,350","64.3%","9.0%"]]}/>
  <ResourceTable caption="Fictional durability by promise history" headers={["Segment","PTPs due","Kept rate","Technical cure","Sustainable cure"]} rows={[["First PTP","2,300","73%","55%","39%"],["Prior kept promise","1,100","82%","63%","48%"],["One prior broken promise","750","47%","31%","17%"],["Repeated broken promises","350","24%","14%","6%"]]}/>
  <p>The 64.4% PKR becomes sustainable cure for only 9% of the original delinquent population. Promise history materially separates durability, but the segment table remains descriptive rather than causal.</p>
 </section>

 <section id="nonbank"><h2>Non-bank portfolios make promise evidence mature quickly</h2>
  <p>High contact volumes, rapid payment cycles and short tenors make PTP analytics operationally valuable. A promise several weeks away can consume a large share of remaining product life, so Days to Promise should be interpreted relative to product velocity.</p>
  <p>Where broken promises are common, a binary PTP flag becomes weak. History, amount fulfilment, delay, cure conversion and sustainable recovery provide stronger differentiation.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Promise-to-pay analytics failures" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Promise-to-Pay Analytics Agent can track commitments—not pressure customers</h2>
  <p>A future Agent can ingest contact and PTP events, match promises to payments, classify full/partial/broken outcomes, calculate timing and amount fulfilment, track history, estimate credibility, monitor due queues, identify repeated breaks, calculate cure conversion, track sustainable cure, create probability-weighted cash forecasts and compare vintages for human review.</p>
  <div className={styles.agent}>{["Collections Prioritisation Agent","Promise-to-Pay Analytics Agent","Cure & Re-Default Agent","LGD & Recovery Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <p>Its role is <strong>PTP tracking + promise credibility + cash forecasting + cure analytics</strong>. It must not autonomously engage in intrusive contact or take ungoverned customer action.</p>
  <div className={styles.workflow}>{["Contact log","PTP event ledger","Promise due queue","Payment matching","Kept / broken classification","Cure / re-default layer","Recovery / cash forecast","Vintage monitoring"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for collections analytics, cure, recovery, cash forecasting and LGD evidence.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for promise tracking, due workflows, payment matching, priority routing and recurring monitoring.</p></article></div>
  <KeyObservation title="The resolve"><p><strong>Contact → promise → quality → due date → kept / broken → payment → cure → re-default → economic value → learning.</strong></p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>, <Link href="/resources/cure-redefault-analytics-sustainable-recovery">Cure & Re-Default Analytics</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> and <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>.</p>
 </section>
</div>}
