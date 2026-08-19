import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./behavioural-credit-scoring.module.css";

export const behaviouralCreditScoringSections=[
 {id:"transition",label:"Origination vs behaviour"},{id:"architecture",label:"Scoring architecture"},{id:"dataset",label:"Snapshots and panel data"},
 {id:"features",label:"Behavioural features"},{id:"seasoning",label:"Seasoning and cold start"},{id:"borrower",label:"Borrower transformation"},
 {id:"migration",label:"Risk migration"},{id:"decisions",label:"Lifecycle decisions"},{id:"models",label:"Model design"},
 {id:"validation",label:"Validation and lead time"},{id:"feedback",label:"Treatment feedback"},{id:"portfolio",label:"Portfolio case"},
 {id:"non-bank",label:"Non-bank perspective"},{id:"failures",label:"Failure modes"},{id:"agent",label:"Behavioural Risk Agent"},
] as const;

const failures=[
 ["Origination score used forever","Application information becomes stale while observed behaviour accumulates."],["Behavioural score is bureau refresh","Internal payment, balance, utilisation and cure evidence is discarded."],
 ["Wrong horizon for decision","A 12-month target may be weak for a 30-day intervention."],["Observation/performance leakage","Future information contaminates predictors."],
 ["Random split leaks accounts","Snapshots from one borrower appear in development and validation."],["Repeated observations ignored","Panel dependence makes performance look more certain than it is."],
 ["Current level only","Change, trend and persistence information disappears."],["One-month noise drives action","Temporary events create volatile scores and false deterioration."],
 ["Seasoning ignored","Sparse young accounts are judged like long-observed accounts."],["One model across incompatible products","Revolving and instalment behaviour encode different processes."],
 ["Delinquency-only model","The score becomes a late state label rather than early risk measurement."],["Detection after obvious arrears","Cross-sectional accuracy hides poor pre-delinquency usefulness."],
 ["No migration analysis","Operational trajectory and transition speed remain unknown."],["AUC without calibration","Ranking does not establish the absolute PD used in decisions."],
 ["No lead-time evaluation","The model may move too late for action."],["Scored too frequently","Slow information generates artificial volatility."],
 ["Scored too slowly","Fast deterioration in short products is missed."],["One score for every decision","Early warning, limits, cure and collections need different targets."],
 ["Treatment effects ignored","Intervention changes the outcomes used to judge risk."],["No strategy context","Historical data mix limit, price and collections regimes."],
 ["No behavioural lineage","Snapshot dates, transformations and source events cannot be reconstructed."],["No recalibration monitoring","Absolute risk level drifts unnoticed."],
];

export default function BehaviouralCreditScoringArticle(){return <div className={styles.articleBody}>
 <section id="transition"><p className={styles.lead}>Origination score describes the borrower at approval. Behavioural score describes how risk evolves once actual payment, utilisation and liquidity behaviour become observable.</p>
  <div className={styles.dual}><article><b>ORIGINATION SCORE</b><strong>Risk at t = 0</strong><span>Application, bureau, income, affordability and obligations</span></article><i>→</i><article><b>BEHAVIOURAL SCORE</b><strong>Risk at t &gt; 0</strong><span>Observed payments, balances, utilisation, liquidity and migration</span></article></div>
  <Formula label="Dynamic account risk"><span className={styles.formula}>Riskᵢ,ₜ = f(Origination information, Behaviourᵢ,₁:ₜ)</span></Formula>
  <p>Information set Iₜ = I₀ + Behaviour₁:ₜ. The behavioural model is not merely a refreshed bureau score: it uses internal account history that did not exist when credit was granted.</p>
  <KeyObservation title="The transformation"><p><strong>A borrower stops being only an application and becomes an observed behavioural history.</strong></p></KeyObservation>
 </section>

 <section id="architecture"><h2>Behavioural scoring turns account history into current risk</h2>
  <EntimemaFramework title="Entimema Behavioural Scoring Architecture" description="Risk is repeatedly reconstructed for a decision horizon, not treated as a permanent borrower property." steps={["Origination risk","Account history","Payment / utilisation / liquidity features","Level + change + trend + persistence","Behavioural model","Current risk estimate","Risk migration / velocity","Early warning / limit / collections decision","Outcome","Monitoring / recalibration"]}/>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Define decision horizon","Build historical snapshots","Engineer behavioural features","Estimate current risk","Measure change","Validate lead time","Integrate with action","Monitor migration","Recalibrate"]}/>
 </section>

 <section id="dataset"><h2>Snapshot design protects time before modelling begins</h2>
  <Formula label="Behavioural target"><span className={styles.formula}>Yᵢ,ₜ₊ₕ = I(Default in (t, t+h]) &nbsp; using snapshot Xᵢ,ₜ from observation window [t−k,t]</span></Formula>
  <p>The horizon h should match the decision: early warning, limit review and collections may require different forward windows. Observation and performance windows must remain separate, and every predictor must satisfy <strong>Timestamp(X) ≤ ScoreDate</strong>.</p>
  <ResourceFigure label="Behavioural snapshot and target architecture." caption="Each score date freezes only information available then; the subsequent performance window supplies the target."><div className={styles.snapshot}><span>OBSERVATION [t−k,t]</span><b>SCORE DATE t</b><span>PERFORMANCE (t,t+h]</span></div></ResourceFigure>
  <p>An account can contribute (i,t₁), (i,t₂), …, creating panel data. Repeated snapshots are dependent. Random row splits can place one account’s earlier history in development and later history in validation, inflating performance. Use account-aware and out-of-time validation where appropriate: <strong>development period → validation period → production monitoring</strong>.</p>
  <p>Document scoring population and exclusions such as defaulted, closed, fraud or missing-history accounts. Every exclusion changes the production population.</p>
 </section>

 <section id="features"><h2>Behavioural features need level, movement and memory</h2>
  <div className={styles.featureGrid}>{[
   ["PAYMENT","Missed or partial payments, payment ratio, days late, failed debits"],["BALANCE","Current, average, peak, trend and volatility"],
   ["UTILISATION","Current, maximum, change, volatility and exhaustion months"],["DELINQUENCY","Current/max DPD, episodes, migration and cure history"],
   ["LIQUIDITY","Available balance, overdraft dependence and cash-flow stress"],["EXTERNAL CREDIT","Bureau migration, new debt and enquiries"],
  ].map(x=><article key={x[0]}><b>{x[0]}</b><p>{x[1]}</p></article>)}</div>
  <Formula label="Level and change"><span className={styles.formula}>Utilisationₜ = Drawnₜ / Limitₜ &nbsp; | &nbsp; ΔUtilisationₜ = Utilisationₜ − Utilisationₜ₋ₖ</span></Formula>
  <Formula label="Payment-to-balance ratio"><span className={styles.formula}>PBRₜ = Paymentₜ / Balanceₜ</span></Formula>
  <p>A stable 80% user differs from a borrower moving 20% → 80%. Use trend slopes, months since delinquency, counts of late payments, maximum DPD and consecutive high-utilisation months to encode direction, recency, frequency, severity and persistence.</p>
  <p>Limit changes can mechanically alter utilisation; interpret Δ utilisation beside Δ limit. Current DPD is useful, but a behavioural model should add information before delinquency becomes obvious rather than reproduce a bucket label.</p>
  <p>Multi-window features—current utilisation, 3-month average and 6-month average—can balance responsiveness and stability. Recent inputs react quickly but are noisy; longer windows stabilise but lag.</p>
 </section>

 <section id="seasoning"><h2>Behavioural evidence replaces application evidence gradually</h2>
  <ResourceFigure label="Information transition as accounts season." caption="Origination information dominates initially; realised behaviour becomes increasingly informative as months on book accumulate."><div className={styles.transition}><article><b>ORIGINATION INFORMATION DOMINANCE</b><span></span></article><article><b>MIXED INFORMATION</b><span></span></article><article><b>BEHAVIOURAL INFORMATION DOMINANCE</b><span></span></article></div></ResourceFigure>
  <p>A two-month account has less history than a two-year account. Months on book belongs in model design, calibration and monitoring. Cold-start responses can retain more origination information, use a limited-history model or blend scores; no one method is universal.</p>
  <Formula label="Conceptual origination-behaviour blend"><span className={styles.formula}>Riskₜ = wₜ Risk origination + (1−wₜ) Risk behaviour, where wₜ may decline as evidence accumulates</span></Formula>
  <p>Compare performance at 3, 6, 12 and 24+ MOB. A model can require seasoning-sensitive calibration or segmentation across new versus mature, revolving versus instalment and secured versus unsecured accounts.</p>
 </section>

 <section id="borrower"><h2>One fictional borrower moves from strong application to emerging stress</h2>
  <ResourceTable caption="Original behavioural-risk transformation" headers={["Point","Observed information","Risk interpretation"]} rows={[["Origination","PD₀ 2.5%; affordable; clean history","Strong initial estimate"],["Month 3","Utilisation 35% → 60%; payment ratio declining; no delinquency","Behavioural risk rises before arrears"],["Month 6","Utilisation 85%; one partial payment; external debt increases","Corroborated stress; behavioural PD₆ 7.2%"]]}/>
  <p>The origination score has not “become wrong”; it answers an older information question. Payment compression, utilisation acceleration and new debt now support a different current PD. Early-warning architecture combines <strong>RiskLevelₜ</strong> with <strong>ΔRiskₜ</strong> and actionability.</p>
 </section>

 <section id="migration"><h2>Score migration turns dynamic risk into a portfolio object</h2>
  <Formula label="Risk-band transition"><span className={styles.formula}>Mⱼₖ = P(Gₜ₊₁ = k | Gₜ = j)</span></Formula>
  <ResourceTable caption="Fictional monthly behavioural-risk migration matrix; rows sum to 100%" headers={["From / to","Low","Medium","High","Default"]} rows={[["Low","88%","10%","1.5%","0.5%"],["Medium","12%","70%","15%","3%"],["High","3%","14%","68%","15%"]]}/>
  <p>Low → Medium and Medium → High can feed pre-default warning; High → Medium can indicate genuine improvement. Track transition speed, persistence and score volatility. A score that oscillates wildly month to month can be operationally unusable even with good cross-sectional discrimination.</p>
  <ResourceFigure label="Behavioural risk migration architecture." caption="Both deterioration and improvement matter; persistence and speed determine whether a state change should alter downstream action."><div className={styles.migration}><span>LOW RISK</span><i>↔</i><span>MEDIUM RISK</span><i>↔</i><span>HIGH RISK</span><i>→</i><span>DEFAULT</span></div></ResourceFigure>
  <p>Use persistence or entry/exit hysteresis for actions so every small score move does not change intervention state.</p>
 </section>

 <section id="decisions"><h2>One behavioural score should not serve every lifecycle decision</h2>
  <ResourceTable caption="Decision-specific target architecture" headers={["Decision","Potential target","Why horizon differs"]} rows={[["Early warning","Short-horizon deterioration/default","Intervention window is near-term"],["Limit review","Future risk plus utilisation","Exposure and customer response matter"],["Collections","Roll, default or cure","Post-delinquency outcomes differ"],["Portfolio monitoring","Current behavioural PD","Risk level and migration are central"]]}/>
  <p>A model optimised for 12-month default can be weak for 30-day warning, limit response or cure. Observed behaviour can reveal affordability stress through minimum payments, balance growth and cash-flow compression. Strong behaviour may inform governed <Link href="/resources/credit-limit-assignment-exposure-strategy">limit review</Link>; deterioration can argue against more exposure. It must not trigger autonomous adverse action.</p>
  <p><Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link> use current behavioural risk plus change, corroboration, exposure and intervention value. Once delinquency begins, collections may need different targets and features.</p>
 </section>

 <section id="models"><h2>Complexity is justified only when it improves the decision</h2>
  <p>Logistic regression and behavioural scorecards can provide transparency, stable reason codes and operational simplicity. Survival models can represent time to event. Tree-based or gradient-boosting challengers can capture nonlinearities and interactions, but require explainability, stability, monitoring and implementation controls.</p>
  <p>Default definition must match model use and remain consistent with wider risk architecture. Including already-defaulted or severely delinquent accounts in a future-default target can trivialise the problem. Data lineage should preserve source event, transformation, observation window, score date and model version.</p>
  <p>Choose daily, weekly or monthly cadence from product velocity, data arrival, horizon and operational use. More frequent scoring is not inherently more informative; quarterly scoring can be blind for fast products.</p>
 </section>

 <section id="validation"><h2>Lead time and calibration matter beside discrimination</h2>
  <p>Monitor AUC, Gini and KS where appropriate, but also compare PredictedPDₜ,ₕ with ObservedDefaultₜ,ₜ₊ₕ by score band, vintage, product and MOB. Validate intended horizons separately: 30-day, 90-day and 12-month performance can differ materially.</p>
  <Formula label="Early-warning lead time"><span className={styles.formula}>Lead time = T default − T risk escalation</span></Formula>
  <p>Ask whether risk escalates before delinquency and whether the lead time is long enough for action. A model can discriminate defaulted from non-defaulted accounts yet offer little warning if most defaults jump Low → Default with no earlier migration.</p>
  <ResourceTable caption="Fictional migration concentration before default" headers={["Path in three months before default","Defaulted accounts","Non-defaulted accounts"]} rows={[["Low → Medium → High → Default","46%","—"],["Medium → High → Default","31%","—"],["Low/Medium → Default with no High state","23%","—"],["Remain Low/Medium","—","91%"],["Temporary High then improve","—","9%"]]}/>
  <p>Balance <strong>responsive score</strong> against <strong>stable score</strong>. Response lag between observable deterioration and score movement can reveal excessive smoothing; extreme volatility can reveal noise. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> and calibration-drift research provide the wider control system.</p>
 </section>

 <section id="feedback"><h2>Risk decisions change the data used to rebuild risk</h2>
  <ResourceFigure label="Behavioural score policy feedback loop." caption="Interventions alter customer behaviour and observed outcomes, so future model data encode prior strategy."><div className={styles.loop}>{["Behavioural score","Intervention","Changed customer behaviour","Future model data"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <p>Limit reduction, contact or restructuring can change future exposure and performance. High-risk accounts receive more treatment, so observed outcomes are no longer pure natural risk. Historical redevelopment data encode prior limit, pricing, collections and intervention regimes.</p>
  <p>Link each observation to relevant risk strategy, limit policy and treatment version. Compare performance cautiously across treated populations and surface regime changes during redevelopment and recalibration.</p>
 </section>

 <section id="portfolio"><h2>A 100,000-account portfolio can deteriorate while origination scores remain fixed</h2>
  <ResourceTable caption="Fictional six-month revolving portfolio" headers={["Month","Average utilisation","Mean behavioural PD","Low / Medium / High risk","30 DPD","Default"]} rows={[["1","42%","3.0%","70% / 23% / 7%","2.1%","1.2%"],["2","44%","3.2%","68% / 24% / 8%","2.2%","1.2%"],["3","48%","3.7%","64% / 26% / 10%","2.5%","1.3%"],["4","53%","4.4%","58% / 29% / 13%","3.0%","1.5%"],["5","58%","5.1%","52% / 32% / 16%","3.8%","1.9%"],["6","61%","5.7%","47% / 34% / 19%","4.6%","2.5%"]]}/>
  <p>The application score stored at booking does not change, yet actual use, payment and external behaviour move 23,000 accounts out of Low risk by month 6. Behavioural PD rises before default fully responds. Early Warning can then prioritise rapid multi-signal migration with material EAD instead of contacting every High-risk account.</p>
  <p>Analyse by vintage and MOB: a recent digital cohort may explain utilisation and High-risk migration, while seasoned accounts remain stable. This separates emerging underwriting or channel effects from broad behavioural deterioration.</p>
 </section>

 <section id="non-bank"><h2>Non-bank portfolios can produce rich behaviour at compressed speed</h2>
  <p>Short tenors, rapid payment cycles, higher default incidence and repeat borrowing can generate valuable behavioural history. For three- to six-month products, monthly scoring may leave little intervention time; weekly or event-based signals can be more appropriate where data and decisions genuinely move that quickly.</p>
  <p>Repeat-customer repayment history can strengthen a new origination decision, but behavioural account score and new application score remain distinct objects. In high-risk populations, stable high risk, accelerating risk and recoverable deterioration can be more useful distinctions than high versus low alone.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Behavioural credit-scoring failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Behavioural Credit Risk Agent can refresh evidence—not take adverse action</h2>
  <p>A future Agent can construct account snapshots, calculate payment and utilisation features, track short and long windows, monitor score/PD migration, identify rapid deterioration, compare current with origination risk, calculate velocity, segment by product and MOB, monitor calibration, prepare reason codes and feed approved signals to Early Warning and Limit workflows.</p>
  <p>Its role is <strong>dynamic account-risk surveillance + behavioural feature engineering + migration analytics</strong>. It must not autonomously take adverse customer actions.</p>
  <div className={styles.agent}>{["Behavioural Credit Risk Agent","Portfolio Early Warning Agent","Credit Limit Optimisation Agent","Collections Strategy Agent","Decision Engine Monitoring Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.workflow}>{["Account history","Snapshot builder","Behavioural feature store","Model scoring","Risk band / migration","EWS / limit / collections","Outcome warehouse","Vintage / calibration monitoring"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for behavioural modelling, account monitoring, limits, portfolio risk and collections analytics.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for recurring scoring, migration, warning routing and lifecycle decisions.</p></article></div>
  <KeyObservation title="The resolve"><p><strong>Origination risk → account behaviour → dynamic features → behavioural score → migration → lifecycle decision → outcome → recalibration.</strong></p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems for Consumer Credit</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link>, <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link> and <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link>.</p>
 </section>
</div>}
