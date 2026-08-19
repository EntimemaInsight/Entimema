import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./collections-prioritisation.module.css";

export const collectionsPrioritisationSections=[
 {id:"priority",label:"Risk is not priority"},{id:"architecture",label:"Priority architecture"},{id:"economics",label:"Intervention value"},
 {id:"recoverability",label:"Cure and recoverability"},{id:"contact",label:"Contactability and channels"},{id:"lifecycle",label:"Collections lifecycle"},
 {id:"uplift",label:"Treatment uplift"},{id:"capacity",label:"Capacity constraints"},{id:"queue",label:"Priority queue"},
 {id:"testing",label:"Testing and vintages"},{id:"monitoring",label:"Strategy monitoring"},{id:"case",label:"Capacity example"},
 {id:"non-bank",label:"Non-bank perspective"},{id:"failures",label:"Failure modes"},{id:"agent",label:"Prioritisation Agent"},
] as const;

const failures=[
 ["PD-only priority","Risk does not reveal whether action can change the outcome."],["DPD-only priority","Accounts in the same delinquency state can have different trajectories and cure potential."],["Balance-only priority","Large unrecoverable cases can absorb scarce capacity without incremental value."],
 ["Highest risk means highest action priority","Extreme distress may be least influenceable."],["Natural cure ignored","The strategy pays for outcomes that would occur anyway."],["Cure confused with uplift","High cure probability does not establish treatment-assisted cure."],["Contactability ignored","A strong treatment cannot work without right-party contact or engagement."],
 ["Treatment cost ignored","Gross benefit can conceal negative net value."],["Gross cash is the objective","Timing, natural recovery and cost are omitted."],["No capacity constraint","A ranking that cannot fit operational capacity is not executable."],["No queue stability","Constant reshuffling destroys ownership and workflow usability."],
 ["No backlog monitoring","High-value cases lose value while waiting."],["No delay value","Urgency is disconnected from decaying intervention opportunity."],["One treatment for all","Customers, stages and economics require approved differentiated workflows."],["Historical outcomes treated causally","Selected treatment populations confound borrower quality and treatment effect."],
 ["No strategy version","Outcome changes cannot be linked to deployed logic."],["No collections vintage","Case-entry cohorts and maturity are mixed."],["No re-default tracking","Temporary cure is mistaken for durable resolution."],["Promise treated as payment","Commitment is information, not realised cure."],
 ["No EWS handoff","Credible deterioration is lost until formal delinquency."],["No LGD connection","Recovery timing and cost remain disconnected from loss measurement."],["Re-scoring without information","Noise and queue churn increase without decision value."],["Accuracy over intervention value","A better risk ranker need not create a better action queue."],
];

export default function CollectionsPrioritisationArticle(){return <div className={styles.articleBody}>
 <section id="priority"><p className={styles.lead}>Collections should not ask only who is most likely to default. It should ask where scarce attention can still materially improve the economic outcome.</p>
  <div className={styles.accounts}><article><b>ACCOUNT A</b><strong>PD 95%</strong><span>Low balance · severe delinquency · low contactability · low recovery potential</span></article><i>≠</i><article><b>ACCOUNT B</b><strong>PD 35%</strong><span>High balance · early deterioration · high contactability · high cure potential</span></article></div>
  <p>Account A is riskier. Account B may deserve the earlier intervention because it is more material and more changeable. The objective is <strong>action value</strong>, not a league table of distress.</p>
  <Formula label="Priority as an economic decision"><span className={styles.formula}>Priorityᵢ = f(Riskᵢ, Exposureᵢ, Recoverabilityᵢ, Contactabilityᵢ, Treatment Costᵢ, Intervention Effectᵢ)</span></Formula>
  <KeyObservation title="The transformation"><p><strong>Who is riskiest? → Where can intervention still change the economic outcome?</strong></p></KeyObservation>
 </section>

 <section id="architecture"><h2>The Entimema Collections Prioritisation Architecture</h2>
  <EntimemaFramework title="Collections Prioritisation Architecture" steps={["Behavioural risk / delinquency","Exposure","Natural cure probability","Recoverability","Contactability","Approved treatment options","Incremental intervention effect","Treatment cost","Expected intervention value","Priority queue","Action","Cure / roll / recovery","Learning"]}/>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Assess current state","Estimate risk","Quantify exposure","Estimate natural cure","Assess recoverability","Estimate contactability","Compare treatments","Calculate incremental value","Prioritise","Act","Measure outcome"]}/>
  <p>This is not one universal score or formula. It is a governed decision architecture whose definitions, horizons and constraints must match product, customer-treatment policy and operational capacity.</p>
 </section>

 <section id="economics"><h2>Expected loss is an input; intervention value is the decision</h2>
  <Formula label="Expected loss at risk"><span className={styles.formula}>ELᵢ = PDᵢ × LGDᵢ × EADᵢ</span></Formula>
  <p>Expected loss measures exposure to loss. It does not say how much loss an intervention can prevent. That requires a counterfactual comparison.</p>
  <Formula label="Expected intervention value"><span className={styles.formula}>IVᵢ = ELᵢᴺᵒ ᴬᶜᵗⁱᵒⁿ − ELᵢᴬᶜᵗⁱᵒⁿ − Costᵢᴬᶜᵗⁱᵒⁿ</span></Formula>
  <ResourceFigure label="Treatment value architecture." caption="Only one outcome path is observed, so the no-action comparison must be estimated rather than read directly from history."><div className={styles.counterfactual}><article>NO-ACTION OUTCOME</article><i>versus</i><article>TREATMENT OUTCOME</article><b>→ Incremental cure / recovery → Cost → Net value</b></div></ResourceFigure>
  <p>The critical unknown is ΔLossᵢ = Lossᵢᴺᵒ ᴬᶜᵗⁱᵒⁿ − Lossᵢᴬᶜᵗⁱᵒⁿ. We observe only one path. Causal estimation is therefore difficult, and historical recovery after treatment is not automatically treatment effectiveness.</p>
 </section>

 <section id="recoverability"><h2>Risk and recoverability answer different questions</h2>
  <div className={styles.matrix}><span></span><b>HIGH RECOVERABILITY</b><b>LOW RECOVERABILITY</b><b>HIGH RISK</b><article>High intervention-value candidate</article><article>Late-stage / limited benefit</article><b>LOWER RISK</b><article>Preventive opportunity</article><article>Monitor / low priority</article></div>
  <p>Recoverability can reflect delinquency stage, prior payment and cure history, engagement, available liquidity, collateral where relevant, and legal or workout status. No single variable is sufficient.</p>
  <Formula label="Cure probability"><span className={styles.formula}>P(Cureᵢ | Current State)</span></Formula>
  <p><strong>Natural cure</strong> is recovery likely without intervention. <strong>Treatment-assisted cure</strong> is recovery caused or accelerated by intervention. Collections creates value through the second. High natural cure can make expensive contact unnecessary.</p>
  <ResourceTable caption="Fictional state-level cure pattern; values are illustrative" headers={["State","Natural cure","Potential action value","Interpretation"]} rows={[["1–15 DPD","72%","Moderate","Many cure naturally; low-cost selective outreach"],["16–30 DPD","54%","High","Meaningful recoverable population"],["31–60 DPD","31%","High but narrowing","Urgency rises as cure opportunity falls"],["61–90 DPD","13%","Selective","Recovery focus; intensive action only when justified"]]}/>
  <p>Cure probability often changes with delinquency age d, but there is no universal CureProbability(d) curve. Cure is also not permanent resolution: track P(ReDefault | Cure). A promise to pay signals engagement, but <strong>Promise ≠ Payment</strong>; repeated broken commitments can update priority and recoverability within approved policy.</p>
 </section>

 <section id="contact"><h2>Contactability converts theoretical value into reachable value</h2>
  <p>Distinguish attempted contact, successful contact, right-party contact and meaningful engagement. Counting every attempt equally produces misleading operations metrics.</p>
  <Formula label="Simplified contact-to-cure intuition"><span className={styles.formula}>P(Cure via Contact) ≈ P(Right-Party Contact | Channel) × P(Cure | Contact)</span></Formula>
  <p>Automated reminder, digital message, call and manual review differ in marginal cost, capacity and effectiveness. For channel c: IVᵢ,ᶜ = ExpectedBenefitᵢ,ᶜ − Costᵢ,ᶜ. The cheapest channel is not always best, and the strongest channel is not always justified.</p>
  <p>Digital-first workflows can suit lower-severity, high-volume populations, while vulnerability, complex circumstances or restructuring assessment may require human review. Channel history can improve routing where permitted without invasive profiling. Repeated ineffective contact creates fatigue, cost and relationship harm; automation is not permission for endless contact.</p>
 </section>

 <section id="lifecycle"><h2>Priority logic changes through the collections lifecycle</h2>
  <ResourceFigure label="Early-warning to collections lifecycle." caption="Risk, recoverability, cost and objective change as an account moves from prevention toward workout."><div className={styles.lifecycle}>{["Pre-delinquency","Early delinquency","Persistent delinquency","Severe delinquency","Workout"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <p>Early-stage collections generally offers more cure opportunity and lower-cost treatments; late-stage work places more weight on recovery and timing. Two accounts at 30 DPD can still differ in exposure, prior delinquency, behavioural trajectory, contactability and cure potential.</p>
  <p><Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> supplies P(state → worse) and P(state → cure). A segment likely to move 30 → 60 DPD may deserve different urgency from one likely to return 30 → Current. <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> adds deterioration beyond DPD, while <Link href="/resources/consumer-credit-early-warning-systems">Early Warning</Link> can create a governed pre-collections handoff before formal arrears.</p>
  <div className={styles.ladder}>{["Monitor","Low-cost outreach","Targeted contact","Manual review","Workout / specialist treatment"].map(x=><span key={x}>{x}</span>)}</div>
 </section>

 <section id="uplift"><h2>Highest cure probability is not highest treatment uplift</h2>
  <Formula label="Cure uplift"><span className={styles.formula}>Upliftᵢ = P(Cure | Treatment) − P(Cure | No Treatment)</span></Formula>
  <ResourceTable caption="Original fictional uplift example" headers={["Account","Natural cure","Treatment cure","Incremental uplift","Interpretation"]} rows={[["A","70%","75%","+5 pp","Likely to cure anyway"],["B","30%","55%","+25 pp","Largest changeable outcome"],["C","5%","8%","+3 pp","Very high distress, limited influence"]]}/>
  <p>Account B has neither the highest natural cure nor necessarily the highest risk, yet it has the greatest estimated treatment effect. Exposure, timing and cost would determine whether that uplift becomes the greatest economic value.</p>
  <p>Historical data are selected: high-risk accounts often received stronger treatment, and outcomes also reflect borrower quality, agent behaviour, channel and timing. Outcome | Treatment does not identify the counterfactual.</p>
 </section>

 <section id="capacity"><h2>Scarce capacity turns prioritisation into constrained allocation</h2>
  <Formula label="Capacity constraint"><span className={styles.formula}>Choose 𝒮 such that |𝒮| ≤ K and expected total intervention value is maximised</span></Formula>
  <p>If N cases exceeds K available manual reviews, the queue must choose. Treatment intensity can rise with risk, recoverability, exposure and urgency, but remains bounded by approved customer-treatment policy.</p>
  <Formula label="Value lost to delay"><span className={styles.formula}>Delay Cost = IV now − IV later</span></Formula>
  <p>Backlog volume, ageing and SLA performance matter because a technically excellent model creates no value when high-priority cases wait until their cure opportunity has decayed. Forecast N cases,t by state to align staffing and channel capacity with expected deterioration.</p>
 </section>

 <section id="queue"><h2>The queue needs reasons, treatments and operational stability</h2>
  <ResourceTable caption="Conceptual collections queue" headers={["Priority","Risk","Exposure","Cure potential","Contactability","Reason","Recommended workflow"]} rows={[["1","High","High","High","High","Rapid deterioration; material exposure","Manual review"],["2","Medium","High","High","Medium","Early-stage roll risk; strong uplift","Targeted contact"],["3","High","Low","Low","Low","Severe state; limited influence","Specialist policy route"],["4","Lower","Low","High natural cure","High","Likely self-cure","Monitor"]]}/>
  <p>Every case should answer why it is high priority: rapid behavioural deterioration, high exposure, strong cure potential or repeated broken commitment. The engine should compare A ∈ {`{No Action, Digital, Call, Review, Restructure Assessment}`} and recommend only approved workflows.</p>
  <p>Priority must respond to new risk, treatment history and recoverability without reshuffling the entire queue every hour. Use cadence aligned to product velocity, payment cycle, data freshness and capacity. Stability rules, ownership locks or material-change thresholds can prevent operational churn.</p>
 </section>

 <section id="testing"><h2>Collections evidence needs strategy versions and vintages</h2>
  <p>Champion/challenger testing can compare prioritisation logic, channel or intensity only where multiple acceptable strategies exist. Never withhold mandatory support or required treatment. Record strategy version s and case-entry vintage v, then examine Outcomeᵥ,ₛ through equal maturity.</p>
  <p>Define vintage explicitly: delinquency-entry month, collections-entry month or default month. Track cure, roll forward, re-default, cash collected, discounted recovery, time to cure and treatment cost—never one KPI alone.</p>
  <Formula label="Net recovery value"><span className={styles.formula}>Net Recovery Value = PV(Incremental Recovery) − Treatment Cost</span></Formula>
  <p>A €1,000 recovery today differs economically from €1,000 years later. Gross cash can overstate value when recovery is slow, costly or would have happened naturally. This connects collections directly to <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD and recovery cash flows</Link>.</p>
 </section>

 <section id="monitoring"><h2>Collections strategy drifts even when written rules do not</h2>
  <p>Monitor queue mix, treatment distribution, contact and right-party-contact rates, cure, roll forward, re-default, recovery, cost, backlog and ageing by product, risk state, vintage and strategy version.</p>
  <Formula label="Outcome attribution lens"><span className={styles.formula}>Δ Cure Rate ≈ Mix Effect + Strategy Effect + Operational Effect + Macro Effect + Residual</span></Formula>
  <p>This is a diagnostic framing, not an automatic additive identity. Case mix, staffing, channel usage, contactability, model calibration and macro stress can all move observed performance. Process-level monitoring should improve workflow consistency, not become punitive surveillance of individual agents.</p>
  <p><Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link> supplies the versioning and attribution layer; <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> supplies cohort discipline.</p>
 </section>

 <section id="case"><h2>Ten thousand accounts and five hundred review slots expose the ranking problem</h2>
  <ResourceTable caption="Original fictional daily capacity example; not a universal performance claim" headers={["Strategy","First 500 reviews cover","Estimated incremental net value","Primary weakness"]} rows={[["DPD-only","Latest-severity accounts; €1.8m balance","€41k","Late, low-cure cases dominate"],["PD-only","Highest predicted defaults; €2.4m balance","€52k","Risk without actionability"],["Intervention-value","Recoverable, contactable, material cases; €2.1m balance","€86k","Requires stronger causal and cost evidence"]]}/>
  <p>The intervention-value queue covers less balance than PD-only but more changeable value in this fictional example. Its advantage is not guaranteed: uplift estimates, operational execution and treatment costs require governed validation.</p>
  <ResourceFigure label="Risk versus expected intervention value." caption="Priority follows the vertical value dimension; risk alone cannot determine queue order."><div className={styles.riskValue}><b>HIGH INTERVENTION VALUE</b><article>Preventive opportunity</article><article>Priority intervention candidate</article><b>LOW INTERVENTION VALUE</b><article>Monitor / low-cost route</article><article>High risk, limited influence</article><i>LOWER RISK → HIGHER RISK</i></div></ResourceFigure>
 </section>

 <section id="non-bank"><h2>Non-bank portfolios compress both deterioration and opportunity</h2>
  <p>High volumes, shorter tenors, higher default incidence and fast roll-rate transitions make capacity allocation especially important. In short-tenor lending, a one-week delay can consume much of the intervention window; queue cadence should match product velocity.</p>
  <p>When most customers are high risk, PD loses prioritisation power. Recoverability, exposure, contactability, treatment uplift and value decay become stronger differentiators. Low-balance cases can receive proportionate low-cost treatment where permitted without reducing customer care.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Collections-prioritisation failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Collections Prioritisation Agent can rank work—not coerce customers</h2>
  <p>A future Agent can ingest delinquency and behavioural risk, calculate exposure at risk, estimate cure and roll probabilities, assess recoverability and contactability, compare approved treatments and cost, rank accounts by expected intervention value, generate explainable reasons, produce capacity-aware queues, monitor ageing, analyse outcomes and surface strategy drift for human review.</p>
  <div className={styles.agent}>{["Behavioural Credit Risk Agent","Portfolio Early Warning Agent","Collections Prioritisation Agent","Cure & Re-Default Agent","LGD & Recovery Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <p>Its role is <strong>collections triage + economic prioritisation + capacity allocation + outcome learning</strong>. It must not autonomously engage in coercive activity or take ungoverned adverse customer action.</p>
  <div className={styles.workflow}>{["Account feed","Behavioural score / DPD","Recovery / cure features","Contactability layer","Treatment candidates","Priority engine","Collections queue","Action logging","Outcome warehouse","Vintage / strategy monitoring"].map(x=><span key={x}>{x}</span>)}</div>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for collections analytics, cure modelling, recovery strategy and portfolio-loss reduction.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for priority queues, capacity allocation, governed workflow routing and recurring monitoring.</p></article></div>
  <KeyObservation title="The resolve"><p><strong>Risk → exposure → cure / recovery potential → contactability → treatment cost → intervention effect → priority → action → outcome → learning.</strong></p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems for Consumer Credit</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link> and <Link href="/resources/champion-challenger-credit-strategy-testing">Champion / Challenger Strategy</Link>.</p>
 </section>
</div>}
