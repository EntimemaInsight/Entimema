import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./cure-redefault-analytics.module.css";

export const cureRedefaultAnalyticsSections=[
 {id:"distinction",label:"Cure is not recovery"},{id:"architecture",label:"Cure architecture"},{id:"quality",label:"Cure quality"},
 {id:"survival",label:"Survival after cure"},{id:"vintages",label:"Cure vintages"},{id:"path",label:"Path dependence"},
 {id:"behaviour",label:"Post-cure risk"},{id:"hysteresis",label:"Cure hysteresis"},{id:"treatment",label:"Treatment and uplift"},
 {id:"lgd",label:"LGD connection"},{id:"models",label:"Models and data"},{id:"case",label:"Portfolio case"},
 {id:"nonbank",label:"Non-bank perspective"},{id:"failures",label:"Failure modes"},{id:"agent",label:"Cure Analytics Agent"},
] as const;

const failures=[
 ["Returning to current equals recovery","A state transition says nothing about whether improvement persists."],["Technical cure equals sustainable cure","Operational exit criteria omit subsequent risk."],["No re-default tracking","Fragile cures inflate performance."],["One cure rate across states","Starting severity materially changes opportunity."],
 ["Delinquency duration ignored","Time under stress and cure speed disappear."],["Prior cure count ignored","Repeated cycles can signal structural instability."],["Path dependence ignored","Current status cannot describe how the borrower arrived there."],["No cure vintage","Macro and strategy regimes are mixed."],
 ["Recent cures treated as mature","Censored cohorts have not had time to fail."],["Immediate cure optimised alone","Short-term status can displace durable recovery."],["Promise treated as cure","Commitment is not realised payment or stability."],["Restructured cures pooled blindly","Modified cash flows and risk can differ."],
 ["Treatment rates compared causally","Selected populations confound borrower quality and treatment effect."],["One model across products","Revolving, instalment and secured cure processes differ."],["Current state without history","Episodes, durations and repeated cures cannot be reconstructed."],["No episode ledger","Targets and outcomes cannot be reproduced."],
 ["No post-cure monitoring","Residual behavioural risk is ignored."],["Cure disconnected from LGD","Timing, repeat default and cost are lost from economic loss."],["Cure disconnected from priority","Natural cure and treatment uplift cannot inform scarce attention."],["Headline KPI without durability","Top-line cure rewards temporary status."],
 ["No macro or strategy attribution","Changing environment and treatment policy are mistaken for model performance."],
];

export default function CureRedefaultAnalyticsArticle(){return <div className={styles.articleBody}>
 <section id="distinction"><p className={styles.lead}>A delinquency flag can disappear before the borrower has genuinely become lower risk. Cure is an event; recovery is a claim about what survives afterward.</p>
  <div className={styles.paths}><article><b>APPARENT CURE</b><strong>Delinquent → Current → Delinquent</strong><span>The status clears, then stress returns.</span></article><i>≠</i><article><b>SUSTAINABLE CURE</b><strong>Delinquent → Current → Current</strong><span>Improvement persists through an evidence horizon.</span></article></div>
  <Formula label="Foundational distinction"><span className={styles.formula}>Cure Event ≠ Sustainable Recovery</span></Formula>
  <p><strong>Technical cure</strong> satisfies the approved operational condition for leaving delinquency or default. <strong>Behavioural cure</strong> adds improved subsequent payment behaviour. <strong>Sustainable cure</strong> requires the improvement to persist through a defined, decision-relevant observation horizon—without prescribing one universal horizon.</p>
  <KeyObservation title="The transformation"><p><strong>Has the delinquency flag disappeared? → Has risk improved durably enough to call the borrower recovered?</strong></p></KeyObservation>
 </section>

 <section id="architecture"><h2>The Entimema Cure & Re-Default Architecture</h2>
  <EntimemaFramework title="Cure & Re-Default Architecture" steps={["Delinquency","Cure event","Technical cure","Post-cure behaviour","Persistence / observation","Re-default risk","Sustainable cure","Economic recovery","LGD / collections outcome","Monitoring"]}/>
  <EntimemaFramework title="Practitioner Decision Logic" steps={["Identify cure","Assess prior severity","Observe behaviour","Estimate re-default risk","Test persistence","Classify sustainable cure","Adjust monitoring / collections","Feed LGD / strategy learning"]}/>
  <Formula label="Sustainable cure"><span className={styles.formula}>Sustainable Cureₕ = P(No Re-Default within h | Cure)</span></Formula>
  <p>Re-default means default after cure within a defined relevant horizon. Its event definition must align with the wider default architecture; operational cure, default cure, accounting staging and economic recovery are related but not interchangeable.</p>
 </section>

 <section id="quality"><h2>Cures have quality, not just count</h2>
  <Formula label="Conceptual cure quality"><span className={styles.formula}>Cure Quality = f(Payment Normalisation, Behavioural Risk, Liquidity, Persistence, Re-Default Risk)</span></Formula>
  <ResourceTable caption="Three original fictional borrowers" headers={["Borrower","Cure path","Post-cure evidence","Classification"]} rows={[["A","Clears arrears","Current for 12 months; behaviour normalises","Strong sustainable-cure evidence"],["B","Clears arrears","Returns to delinquency after two months","Technical cure; re-default"],["C","Partially normalises","Current status not reached; behavioural risk remains high","Improvement, not binary cure"]]}/>
  <Formula label="Headline cure rate"><span className={styles.formula}>Cure Rate = Accounts Cured / Eligible Delinquent Accounts</span></Formula>
  <p>Both numerator and denominator require governance. Report by starting state—early, mid-stage, severe delinquency or default/workout—because P(state → Current) differs materially. A cure from 5 DPD is not equivalent to one after 90 DPD.</p>
  <ResourceFigure label="Cure funnel." caption="Each layer removes accounts whose apparent improvement does not become durable recovery."><div className={styles.funnel}>{["Delinquent population","Technical cure","Behavioural stabilisation","Sustainable cure"].map((x,i)=><span key={x} style={{width:`${100-i*16}%`}}>{x}</span>)}</div></ResourceFigure>
 </section>

 <section id="survival"><h2>Re-default turns cure into a survival problem</h2>
  <Formula label="Re-default rate"><span className={styles.formula}>Re-Default Rateₕ = P(Re-Default within h | Cure)</span></Formula>
  <Formula label="Survival after cure"><span className={styles.formula}>S cure(t) = P(No Re-Default by t | Cure)</span></Formula>
  <p>The re-default hazard hᵣ(t) asks for the probability of re-default at time t conditional on remaining cured until then. It can rise or fall with months since cure; no universal shape should be imposed. Time to re-default is T re-default − T cure.</p>
  <ResourceTable caption="Original fictional cure cohort of 1,000 accounts" headers={["Month since cure","At risk at start","Re-defaults in interval","Surviving cured","Cumulative re-default"]} rows={[["1","1,000","90","910","9.0%"],["3","910","80","830","17.0%"],["6","830","70","760","24.0%"],["12","760","50","710","29.0%"]]}/>
  <p>Immediate failures suggest fragile technical cure; later failures may reflect renewed stress. Surveillance is most valuable where the post-cure hazard remains elevated and evidence can still affect a governed workflow.</p>
 </section>

 <section id="vintages"><h2>Cure vintage separates durability through time</h2>
  <Formula label="Cure vintage"><span className={styles.formula}>v = Month of Cure; track Re-Defaultᵥ,ₜ by Months Since Cure</span></Formula>
  <p>A borrower simultaneously belongs to an origination vintage, a delinquency-entry vintage and a cure vintage. Origination vintage describes booking conditions; delinquency vintage describes entry into stress; cure vintage describes the regime under which recovery appeared.</p>
  <p>Compare cohorts at equal months since cure. A cure from last week cannot be classified as a sustainable 12-month cure. Recent cohorts are right-censored: they have not yet had enough time to demonstrate stability.</p>
  <p>Cure quality can differ by macro environment, collections strategy, product and origination cohort. Record strategy version alongside cure date so changing composition is not mistaken for improving treatment.</p>
 </section>

 <section id="path"><h2>Post-cure risk depends on the path, not only the current state</h2>
  <Formula label="Path-dependent post-cure risk"><span className={styles.formula}>Risk post-cure = f(Current State, Prior Path)</span></Formula>
  <div className={styles.state}>{["Current","30 DPD","Current","60 DPD","Current","Re-Default"].map((x,i)=><span key={`${x}-${i}`}>{x}</span>)}</div>
  <p>Maintain Episode₁, Episode₂, … rather than collapsing repeat delinquency into one event. Useful history includes N prior cures, maximum prior severity, delinquency duration, time to cure, treatment, payment path and whether cure was lump-sum, gradual or restructuring-driven.</p>
  <p>A simple Markov transition P(Stateₜ₊₁ | Stateₜ) can miss duration and repeat episodes. A semi-Markov or richer multi-state view can incorporate time in state and prior path without requiring excessive complexity.</p>
  <p>Partial cure also matters: Severe → Moderate → Early → Current is a different trajectory from an instantaneous jump to Current. Neither path is automatically superior; subsequent sustainability supplies the evidence.</p>
 </section>

 <section id="behaviour"><h2>Current status can conceal a post-cure risk premium</h2>
  <p><Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> can reveal that a technically cured borrower still has high utilisation, weak payment ratios or elevated PD. Whether PD post-cure exceeds PD never-delinquent is an empirical question, not an assumption.</p>
  <ResourceTable caption="Original fictional 12-month default comparison" headers={["Population","12-month default","Interpretation"]} rows={[["Never delinquent","2%","Performing reference"],["Recently cured","8%","Residual risk after technical cure"],["Repeatedly cured","15%","History reveals structural instability"]]}/>
  <p>Compare cured and continuously performing accounts on subsequent delinquency, default, utilisation and loss. A post-cure <Link href="/resources/consumer-credit-early-warning-systems">Early Warning</Link> window can track payment deterioration, liquidity pressure and repeated lateness without prescribing a universal monitoring duration.</p>
 </section>

 <section id="hysteresis"><h2>Evidence to exit distress should differ from evidence to enter it</h2>
  <div className={styles.hysteresis}><article><b>ENTRY</b><span>Deterioration evidence sufficient to identify stress</span></article><i>≠</i><article><b>EXIT</b><span>Improvement evidence sufficient to establish persistence</span></article></div>
  <p>Cure hysteresis avoids oscillation when an account alternates around one status threshold. Operational delinquency cure does not automatically reverse <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR or Stage 2</Link>, nor does it necessarily establish Stage 3 exit or removal of a credit-impaired assessment. Each serves a different purpose and must follow its own governed definition.</p>
 </section>

 <section id="treatment"><h2>Treatment should be judged on sustainable cure, not immediate status</h2>
  <Formula label="Cure uplift"><span className={styles.formula}>Uplift cure = P(Cure | Treatment) − P(Cure | No Treatment)</span></Formula>
  <p>Natural cure and treatment-assisted cure are counterfactual objects. Historical comparison is selected because stronger treatments often went to harder cases. If Cure Rate A is lower than Cure Rate B, that does not prove treatment A is worse.</p>
  <ResourceTable caption="Original fictional treatment comparison" headers={["Treatment","30-day cure","Re-default by month 6","Sustainable cure among treated","Interpretation"]} rows={[["A","68%","40% of cures","40.8%","High immediate cure, fragile outcome"],["B","57%","16% of cures","47.9%","Lower immediate cure, stronger durability"]]}/>
  <p>Treatment B produces fewer immediate cures yet more sustainable cures. Rewarding teams only on Cure Rate 30d can optimise a temporary status rather than durable recovery.</p>
  <Formula label="Sustainable cure KPI"><span className={styles.formula}>Sustainable Cure Rateₕ = Cures remaining performing through h / Eligible accounts</span></Formula>
  <p>Restructuring-driven cure should be analysed separately where material: reduced payments, extended tenor or other modifications change contractual cash flows and may have distinct P(Re-Default | Restructured Cure).</p>
 </section>

 <section id="lgd"><h2>Cure durability changes economic loss</h2>
  <Formula label="Conceptual cure-adjusted LGD"><span className={styles.formula}>LGD ≈ P(Cure) × LGD cure + P(No Cure) × LGD workout, with re-default adjustment where relevant</span></Formula>
  <p>A rapid sustainable cure can restore cash flows and reduce loss. Cure followed by re-default can lengthen workout, add operational cost and delay recoveries. Status cure means the account becomes current; economic cure means expected contractual cash flows are restored sufficiently for the loss objective.</p>
  <p><Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link> makes timing explicit through discounted recovery cash flows. <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link> uses natural cure and treatment uplift to decide where scarce action can still improve that economic outcome.</p>
 </section>

 <section id="models"><h2>Targets, models and episode data must describe the same process</h2>
  <p>Possible targets include P(Cure within h), P(Cure and no re-default through h), and P(Re-Default within h | Cure). Transition rates, logistic models, survival models, multi-state models and governed tree-based challengers answer different questions.</p>
  <ResourceFigure label="Multi-state cure architecture." caption="History matters: Current after a first cure is not necessarily equivalent to continuously performing Current."><div className={styles.multi}>{["Current","Delinquent","Cured","Re-Default","Closed"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  <p>Build an episode-level ledger with account ID, episode ID, event date, state, payment, treatment, cure flag and re-default flag. Current status alone cannot reconstruct prior cures, duration or sequence.</p>
  <div className={styles.workflow}>{["State history","Episode builder","Cure identification","Post-cure snapshot","Re-default model","Cure vintage","Sustainable cure metrics","LGD / collections integration","Monitoring"].map(x=><span key={x}>{x}</span>)}</div>
 </section>

 <section id="case"><h2>A 54% headline cure rate becomes 40.5% durable recovery</h2>
  <p>A fictional non-bank consumer lender observes 20,000 accounts entering delinquency during one quarter. After six months, 10,800 have technically cured, 6,200 remain delinquent and 3,000 have defaulted. Among the cured group, 2,700 re-default and 8,100 remain current.</p>
  <ResourceTable caption="Reconciled six-month multi-state cohort" headers={["Outcome","Accounts","Share of original 20,000"]} rows={[["Technical cure","10,800","54.0%"],["Still delinquent","6,200","31.0%"],["Defaulted without cure","3,000","15.0%"],["Of technical cures: remain current","8,100","40.5%"],["Of technical cures: re-default","2,700","13.5%"]]}/>
  <p>The headline cure rate is 54.0%; six-month sustainable cure is only 40.5%. Re-default consumes one quarter of technical cures.</p>
  <ResourceTable caption="Fictional cure by starting state" headers={["Starting state","Technical cure","Six-month sustainable cure"]} rows={[["1–15 DPD","72%","59%"],["16–30 DPD","58%","44%"],["31–60 DPD","39%","25%"],["61–90 DPD","21%","11%"]]}/>
  <ResourceTable caption="Fictional cure by treatment; descriptive, not causal" headers={["Observed treatment","Technical cure","Six-month re-default among cures"]} rows={[["Digital outreach","61%","19%"],["Targeted call","56%","24%"],["Manual review / modification assessment","43%","17%"]]}/>
  <p>The treatment table cannot identify effectiveness because account mix differs. The cure-vintage view, equal maturity and approved causal testing are needed before attributing the differences.</p>
 </section>

 <section id="nonbank"><h2>Non-bank portfolios compress the cure-learning cycle</h2>
  <p>Short tenors, frequent payment events, higher default incidence and repeat borrowing can produce multiple delinquency and cure cycles quickly. A single Current flag discards especially valuable history in these portfolios.</p>
  <p>Post-cure risk may decay—or recur—within weeks rather than quarters. Monitoring cadence, maturity windows and workflow speed should match product velocity, while avoiding premature sustainable-cure classification.</p>
 </section>

 <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Cure and re-default analytics failures" headers={["Failure","Why it fails"]} rows={failures}/></section>

 <section id="agent"><h2>A Cure & Re-Default Analytics Agent can monitor durability—not change treatment autonomously</h2>
  <p>A future Agent can reconstruct episodes, identify technical cures, track post-cure behaviour, calculate cure vintages, estimate sustainable cure and re-default risk, measure time to re-default, identify fragile or repeated cures, compare quality by strategy, feed risk into Early Warning and quantify LGD implications for human review.</p>
  <div className={styles.agent}>{["Collections Prioritisation Agent","Cure & Re-Default Agent","Behavioural Credit Risk Agent","LGD & Recovery Agent","Portfolio Early Warning Agent"].map(x=><span key={x}>{x}</span>)}</div>
  <p>Its role is <strong>cure durability analytics + re-default surveillance + post-cure monitoring + LGD support</strong>. It must not autonomously change customer treatment.</p>
  <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for cure modelling, re-default analytics, collections strategy, LGD and portfolio monitoring.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for post-cure surveillance, cure-quality classification, governed routing and recurring evidence.</p></article></div>
  <KeyObservation title="The resolve"><p><strong>Delinquency → cure event → cure quality → observation → re-default risk → sustainable cure → economic recovery → monitoring.</strong></p></KeyObservation>
  <h3>Related research</h3><p>Continue with <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link> and <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">Significant Increase in Credit Risk</Link>.</p>
 </section>
</div>}
