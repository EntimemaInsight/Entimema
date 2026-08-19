import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./decision-engine-monitoring.module.css";

export const decisionEngineMonitoringSections=[
  {id:"effective",label:"Configured vs effective"},{id:"architecture",label:"Monitoring architecture"},{id:"population",label:"Population and funnel"},
  {id:"rules",label:"Rule behaviour"},{id:"frontier",label:"Effective frontier"},{id:"offers",label:"Offer drift"},
  {id:"operations",label:"Overrides and fallbacks"},{id:"versions",label:"Version and reproducibility"},{id:"evidence",label:"Evidence maturity"},
  {id:"diagnosis",label:"Attribution and diagnosis"},{id:"case",label:"Six-month case"},{id:"health",label:"Health and escalation"},
  {id:"non-bank",label:"Non-bank perspective"},{id:"failures",label:"Failure modes"},{id:"agent",label:"Monitoring Agent"},
] as const;

const failures=[
 ["Approval rate only","One aggregate hides applicant mix, terms, booking and outcome changes."],["No code change means no drift","Population, models, configuration, overrides and customers alter effective strategy."],
 ["Applicant drift ignored","Decision changes can be wrongly attributed to rules."],["Booked population ignored","Customer choice can materially reshape approved risk."],
 ["Take-up ignored","Approval does not create exposure or economics until acceptance."],["Rule hits without unique contribution","Overlap and shadowing make gross hits misleading."],
 ["Shadowing and dead rules ignored","The effective control architecture can change silently."],["Overrides pooled or omitted","Risk-increasing and conservative interventions have different meaning."],
 ["Configuration omitted","Tables, flags and admin settings can change production logic without deployment."],["Score monitored without PD mapping","Stable score can represent changing absolute risk."],
 ["Stable bad rate means stable strategy","Risk, limit and selection effects can compensate in aggregate."],["Stable EL hides offsets","Lower PD with higher exposure can leave totals unchanged."],
 ["No strategy version","Outcomes cannot be tied to originating logic."],["No model or configuration version","A decision cannot be reconstructed."],
 ["No golden applications","Silent mapping or production drift goes undetected."],["No boundary retesting","Small defects around high-volume thresholds can have large effects."],
 ["Early delinquency ignored","Mature default arrives too late for initial diagnosis."],["Immature success declared","Fast signals cannot replace loss and realised margin."],
 ["No segment analysis","Local channel, product or band deterioration disappears in averages."],["Threshold-only monitoring","Slow persistent drift can remain economically material below alerts."],
 ["Seasonality ignored","Normal recurring movement becomes a false strategy alarm."],["No attribution","Metrics signal movement but not a decision hypothesis."],
 ["Dashboard without decision logic","A collection of KPIs does not explain the effective strategy."],["No feedback loop","Monitoring never becomes governed experimentation or strategy improvement."],
];

export default function DecisionEngineMonitoringArticle(){return <div className={styles.articleBody}>
 <section id="effective"><p className={styles.lead}>A decision engine can drift materially even when no code has changed. Population mix, calibration, overrides, pricing, limits and customer behaviour can change the effective strategy long before the rules themselves are edited.</p>
  <div className={styles.dual}><article><b>CONFIGURED STRATEGY</b><strong>Rules / cut-offs / limits / prices</strong><span>What the lender explicitly set</span></article><i>≠</i><article><b>EFFECTIVE STRATEGY</b><strong>Actual decisions and booked economics</strong><span>What production currently creates</span></article></div>
  <Formula label="Effective strategy"><span className={styles.formula}>Strategy effective = f(Strategy configured, Population, Models, Overrides, Customer response)</span></Formula>
  <p>The monitoring question is not “did we change the rules?” but <strong>is the decision system producing the same economic behaviour?</strong> Identical cut-off and code can coexist with different approvals, booked PD, exposure, affordability and early delinquency.</p>
 </section>

 <section id="architecture"><h2>Decision monitoring is an evidence system, not one KPI</h2>
  <EntimemaFramework title="Entimema Decision Engine Monitoring Architecture" description="Technical configuration and production behaviour meet in one attribution loop." steps={["Applicant population","Decision funnel","Rule / model behaviour","Effective decision frontier","Price / limit / terms","Overrides / fallbacks","Booked population","Early performance","Mature outcomes","Strategy attribution","Champion / challenger hypothesis","Strategy update"]}/>
  <ResourceFigure label="Six monitoring layers from input to outcome." caption="Each layer answers a different diagnostic question; none can independently prove that strategy remains stable."><div className={styles.layers}>{[["01","INPUT POPULATION","Who is entering?"],["02","DECISION LOGIC","Which rules and models fire?"],["03","DECISION OUTPUT","Approve, refer or reject?"],["04","OFFER STRUCTURE","Which price, limit and terms?"],["05","BOOKING BEHAVIOUR","Who accepts?"],["06","PORTFOLIO OUTCOME","How do accounts perform?"]].map(x=><article key={x[0]}><b>{x[0]}</b><strong>{x[1]}</strong><span>{x[2]}</span></article>)}</div></ResourceFigure>
 </section>

 <section id="population"><h2>Applicant, offered and booked populations can drift differently</h2>
  <p>Compare Pₜ(X) with P reference(X) using distribution views, means, medians, segment mix and <Link href="/resources/population-stability-index-credit-risk-model-monitoring">Population Stability Index</Link> where appropriate. PSI is one diagnostic, not the conclusion.</p>
  <div className={styles.population}>{["APPLICANT\nEveryone applying","OFFERED\nLender says yes","BOOKED\nCustomer accepts"].map(x=>{const [a,b]=x.split("\n");return <article key={a}><b>{a}</b><span>{b}</span></article>})}</div>
  <p>P(X | Applicant) and P(X | Booked) are connected by lender decisions and customer choice. Stable applicant risk with weaker booked risk can indicate pricing or offer selection; changed applicants with stable decisions can mean the configured strategy is absorbing population movement.</p>
  <ResourceFigure label="Credit decision funnel." caption="Track counts and conversion at every stage; a changed final approval rate does not identify where the movement originated."><div className={styles.funnel}>{["Applications","Eligibility pass","Policy pass","Affordability pass","Risk pass","Approved","Booked"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <Formula label="Stage conversion"><span className={styles.formula}>Conversionₖ = N after,k / N before,k</span></Formula>
 </section>

 <section id="rules"><h2>Rule monitoring must distinguish activity from decision contribution</h2>
  <Formula label="Rule hit rate"><span className={styles.formula}>Hit rateₖ,ₜ = Hitsₖ,ₜ / Applicationsₜ</span></Formula>
  <p>Track gross hit rate, primary reject cause and <strong>UniqueRejectₖ,ₜ</strong>. One applicant can trigger multiple controls, so summed hits can exceed rejects. A rising hit rate may have no final impact if another earlier rule already declines the same population.</p>
  <ResourceTable caption="Rule-behaviour diagnostics" headers={["Pattern","Interpretation","Review question"]} rows={[["Hit ↑; unique reject stable","Overlap increased","Did another rule absorb the effect?"],["Hit stable; unique reject ↓","Rule is increasingly shadowed","Which earlier control now dominates?"],["Hit ≈ 0 for prolonged period","Dead, broken or irrelevant rule possible","Is data absent, population changed or logic obsolete?"],["Final reject cause ↑; hits stable","Precedence or attribution changed","Did routing or primary-cause logic move?"]]}/>
  <p>Do not automatically remove a dead-looking rule. Broken data and changed population can create the same symptom. Connect recurring review to <Link href="/resources/credit-policy-rules-lending-rulebook-governance">Credit Policy Rules</Link>.</p>
 </section>

 <section id="frontier"><h2>The effective cut-off is a multidimensional production frontier</h2>
  <p>A configured score boundary c = 620 does not guarantee a booked frontier at 620. Policy, affordability, overrides, take-up, price and limits can make actual acceptance behave as if the threshold were higher, lower or non-monotonic.</p>
  <Formula label="Effective decision frontier"><span className={styles.formula}>Approve = f(PD, Affordability, Policy, Limit, Price) &nbsp; | &nbsp; Configured cut-off ≠ Effective frontier</span></Formula>
  <p>Track approval and booking by score band, PD band and risk grade. Unexpected inversions deserve investigation. Monitor average PD for both approved and booked populations: approval rate alone is not a risk measure.</p>
  <KeyObservation title="Recalibration effect"><p>If score 620 represented PD 4% and now represents PD 6%, the unchanged numerical cut-off expresses different absolute risk. Monitor the <Link href="/resources/model-calibration-drift-pd-risk-level">calibration</Link> and score-to-PD mapping—not score distribution alone.</p></KeyObservation>
 </section>

 <section id="offers"><h2>Offer drift changes risk after the binary decision</h2>
  <div className={styles.offerGrid}><article><b>PRICING</b><p>Offered and accepted price, discount and risk alignment by product and band.</p></article><article><b>LIMITS</b><p>Mean and distribution by risk, capacity, product and channel.</p></article><article><b>AFFORDABILITY</b><p>DSTI, residual and stressed residual income for approved and booked populations.</p></article><article><b>EAD</b><p>Utilisation, CCF, undrawn exposure and absolute expected loss.</p></article></div>
  <p>A stable PD mix with larger limits can materially raise exposure and absolute EL. Price can improve nominal yield while reducing low-risk take-up. Density near an affordability boundary means small data shifts can materially change approval. Connect these diagnostics to <Link href="/resources/risk-based-pricing-credit-decisioning">Risk-Based Pricing</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link> and <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>.</p>
  <Formula label="Expected loss at decision"><span className={styles.formula}>ELᵢ = PDᵢ × LGDᵢ × EADᵢ &nbsp; | &nbsp; monitor EL rate and absolute EL</span></Formula>
 </section>

 <section id="operations"><h2>Overrides, latency and fallbacks are production strategy</h2>
  <p>Separate approve, reject, limit, pricing and affordability overrides. Distinguish <strong>OverrideUp</strong>, which increases risk or exposure, from <strong>OverrideDown</strong>, which is conservative. Monitor by channel, product, risk grade, rule and process—not as employee surveillance.</p>
  <p>A rising referral rate can reflect ambiguous applicants, obsolete automation or declining trust in the engine. Slower decision time can reduce booking and change customer mix even if credit logic is stable. Compare overridden outcomes cautiously because intervention is non-random.</p>
  <ResourceTable caption="Data-path monitoring" headers={["Fallback","Why frequency matters"]} rows={[["Bureau fallback","Different information quality can alter model and rule outputs"],["Missing income","Affordability may route through a weaker alternative"],["API timeout","Operational failure changes which checks execute"],["Alternative data path","A different population may receive different evidence"]]}/>
  <p>Unchanged fallback rules with more frequent missing inputs create a changed effective strategy.</p>
 </section>

 <section id="versions"><h2>Configuration is code for monitoring purposes</h2>
  <p>Preserve strategy, rulebook, score model, calibration, affordability model, pricing model, EAD model and configuration versions on every decision. Thresholds, weights, flags, spreadsheets, database tables, price grids and admin settings can change behaviour without a software deployment.</p>
  <Formula label="Historical decision reproducibility"><span className={styles.formula}>Decisionᵢ(T) = f(Inputsᵢ,T, Model versions, Strategy version, Rulebook version, Configuration)</span></Formula>
  <p>Run golden applications periodically and expect stable outputs unless an approved change occurred. Re-test c − ε, c and c + ε around important boundaries after model, mapping, data, rule or platform changes. These controls catch silent configuration drift and production defects.</p>
 </section>

 <section id="evidence"><h2>Evidence matures from input movement to realised economics</h2>
  <ResourceFigure label="Leading-to-lagging decision evidence." caption="Evidence becomes closer to final economics through time, but slower; the layers should be read together."><div className={styles.evidence}>{[["LEADING","Population / funnel / rules / score / capacity / price / limit / overrides"],["INTERMEDIATE","Booking / utilisation / first payment / early delinquency / roll rates"],["LAGGING","Default / LGD / EAD / realised loss / margin"]].map(x=><article key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></article>)}</div></ResourceFigure>
  <Formula label="Strategy-vintage performance"><span className={styles.formula}>Performanceᵥ,ₛ = early delinquency, roll rates, default, loss and margin by vintage v and strategy s</span></Formula>
  <p><Link href="/resources/credit-vintage-analysis">Vintage Analysis</Link> aligns outcomes at equal months on book. <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> supplies Current → 30 DPD and 30 → 60 transitions before default matures. Early indicators inform diagnosis; they do not declare final success.</p>
 </section>

 <section id="diagnosis"><h2>Stable totals can conceal offsetting strategy changes</h2>
  <ResourceFigure label="Population by decision stability matrix." caption="Population and decision movement separate four starting diagnoses; the shifted/shifted quadrant requires full attribution."><div className={styles.matrix}><span></span><b>DECISIONS STABLE</b><b>DECISIONS SHIFTED</b><b>POPULATION STABLE</b><article><strong>Normal</strong></article><article><strong>Model / configuration / override effect</strong></article><b>POPULATION SHIFTED</b><article><strong>Strategy absorbs population change</strong></article><article><strong>Full attribution required</strong></article></div></ResourceFigure>
  <Formula label="Conceptual decision attribution"><span className={styles.formula}>Δ Decisions = Population + Model + Policy + Affordability + Pricing + Limit + Override + Residual</span></Formula>
  <p>This is an attribution architecture, not a promise of exact additive decomposition. A fictional approval decline from 58% to 51% might attribute −3pp to riskier applicants, −2pp to weaker affordability, −1pp to conservative overrides and −1pp to recalibration. Booked PD rising from 3.2% to 4.4% may then combine applicant mix, lender choice, price selection and take-up.</p>
  <ResourceTable caption="Monitoring contradictions and diagnostic direction" headers={["Contradiction","What it suggests"]} rows={[["Approval stable; booked PD rises","Offer or take-up selection changed the booked mix"],["Booked PD stable; defaults rise","Calibration, environment, LGD/EAD or model deterioration deserves review"],["Rule hits stable; overrides rise","Operational trust or exception behaviour changed effective control"],["Expected value rises; realised margin falls","Volume, take-up, loss, revenue or cost forecast error requires attribution"]]}/>
  <p>A lower-risk book with higher limits can leave EL stable. <strong>Stable totals do not imply stable strategy.</strong></p>
 </section>

 <section id="case"><h2>A six-month case shows why diagnosis must evolve with evidence</h2>
  <ResourceTable caption="Fictional lender monitoring case" headers={["Month","Observed signal","Best current diagnosis"]} rows={[["1","Baseline stable","Reference population, funnel, offers and outcomes established"],["2","New digital channel grows","Population/channel effect; segment before judging strategy"],["3","Approval remains 55%","Stable aggregate may reflect offsetting channel and decision effects"],["4","Booked PD rises 3.1% → 3.9%","Customer selection and approved mix now require attribution"],["5","Average limit +14%; low-risk take-up falls","Limit inflation plus pricing-selection hypothesis"],["6","30 DPD and Current → 30 migration worsen","Early outcome supports concern; mature default not yet available"]]}/>
  <p>The responsible conclusion is not “the model failed.” Evidence first points to channel-driven population change, then altered booking selection, larger exposure and finally maturing delinquency. The next action is targeted diagnosis and a governed <Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger</Link> hypothesis—not immediate undifferentiated strategy change.</p>
  <Formula label="Strategy forecast error"><span className={styles.formula}>Realised outcome − Expected outcome = PD + LGD + EAD + Take-up + Volume + Price / margin error + Interaction</span></Formula>
 </section>

 <section id="health"><h2>Health combines effective-strategy stability with outcome stability</h2>
  <ResourceFigure label="Strategy health matrix." caption="Drift without deterioration still requires diagnosis; deterioration without visible strategy drift can indicate model, environment or unmeasured behaviour."><div className={styles.matrix}><span></span><b>OUTCOMES STABLE</b><b>OUTCOMES DETERIORATING</b><b>STRATEGY STABLE</b><article><strong>Stable / stable</strong></article><article><strong>Model, macro or hidden-risk review</strong></article><b>STRATEGY DRIFTING</b><article><strong>Observe and attribute</strong></article><article><strong>Escalate diagnosis</strong></article></div></ResourceFigure>
  <p>Use development, prior period, same season and current-Champion baselines for different questions. Thresholds should reflect volatility, materiality, maturity and appetite; trend and persistence matter because slow drift can be material before any one-period breach.</p>
  <p>A response ladder can be <strong>observe → diagnose → targeted review → challenger → strategy change</strong>. Do not automate escalation from a threshold alone. Collapsing unique rule contribution can trigger rule review; stable mix with worse risk can trigger calibration review; high-DSTI deterioration can trigger affordability review; price-specific selection can trigger pricing review; EAD growth after larger limits can trigger limit review.</p>
 </section>

 <section id="non-bank"><h2>Non-bank lenders gain fast feedback—and fast noise</h2>
  <p>Rapid applications, frequent strategy changes, digital-channel movement and quickly maturing short-tenor outcomes make high-frequency decision monitoring valuable. First-payment default, delinquency and realised margin can close learning loops within months.</p>
  <p>High cadence must not become noisy churn. In high-risk portfolios, modest approval, price or limit changes can create material absolute losses quickly. Monitor exposure and loss beside rates, retain seasonal baselines and require persistent, attributed evidence before strategy action.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Decision-engine monitoring failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Decision Engine Monitoring Agent can find drift—not change strategy</h2>
  <p>A future Agent can ingest application and decision logs; monitor population, funnels, rule hits and unique contribution; estimate effective frontier; track price, limit, affordability, overrides and fallbacks; compare applicant and booked mix; construct vintages; monitor early migration; compare expected with realised outcomes; attribute changes; and generate Challenger hypotheses for human review.</p>
  <p>Its role is <strong>continuous decision surveillance + strategy attribution + challenger discovery</strong>. It must not autonomously change production strategy.</p>
  <div className={styles.agent}>{["Decision Engine Monitoring Agent","Credit Policy Rule Governance Agent","Credit Strategy Experimentation Agent","Affordability Agent","Limit Optimisation Agent","Pricing Optimisation Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Observe population","Reconstruct decisions","Measure effective strategy","Diagnose offer / booking effects","Observe early outcomes","Wait for mature outcomes","Attribute","Generate challenger hypothesis","Update strategy"]}/>
  <div className={styles.workflow}>{["Application feed","Decision logs","Rule hits","Model outputs","Offer terms","Booking data","Strategy version","Vintage outcomes","Attribution layer","Alerts / review","Challenger pipeline"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for strategy monitoring, portfolio risk, policy effectiveness and decision diagnostics.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for recurring monitoring, rule analytics, attribution and evidence pipelines.</p></article></div>
  <KeyObservation title="The closed lifecycle"><p><strong>Design → execute → observe → experiment → improve.</strong> The control question is: is the decision system still producing the strategy we think we configured—and what evidence tells us when it is not?</p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/credit-policy-rules-lending-rulebook-governance">Credit Policy Rules</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/risk-based-pricing-credit-decisioning">Risk-Based Pricing</Link>, <Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger Strategy</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/population-stability-index-credit-risk-model-monitoring">PSI</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> and <Link href="/resources/model-calibration-drift-pd-risk-level">Model Calibration Drift</Link>.</p>
 </section>
</div>}
