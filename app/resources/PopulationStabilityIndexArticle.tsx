import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./population-stability-index.module.css";

export const populationStabilityIndexSections=[
 {id:"measure",label:"What PSI measures"},{id:"example",label:"Bin-level example"},{id:"direction",label:"Distance, not direction"},
 {id:"drift",label:"Population vs model drift"},{id:"construction",label:"Thresholds and construction"},{id:"baseline",label:"Baselines and segment mix"},
 {id:"performance",label:"PSI and performance"},{id:"monitoring",label:"12-month monitoring example"},{id:"workflow",label:"Operational workflow"},
 {id:"nbfi",label:"Non-bank lenders"},{id:"failures",label:"Failure modes"},{id:"automation",label:"Drift Monitoring Agent"},
] as const;
const diagnostic=["Distribution change","Bin contribution","Direction","Segment / mix","Persistence","Data quality","Ranking","Calibration","Business materiality","Diagnosis","Action"];

export default function PopulationStabilityIndexArticle(){return <>
 <p className="resource-lead"><em>PSI does not tell you whether a model is still predictive. It tells you that the population distribution has changed. What that change means for risk must be diagnosed separately.</em></p>
 <KeyObservation><p><strong>PSI measures distance, not economic direction—and a threshold is a governance rule, not a law of statistics.</strong></p></KeyObservation>

 <section id="measure"><h2>PSI compares two empirical distributions</h2>
  <Formula label="Population Stability Index"><span>PSI = Σ<sub>j=1</sub><sup>K</sup>(A<sub>j</sub>−E<sub>j</sub>)ln(A<sub>j</sub>/E<sub>j</sub>)</span></Formula>
  <p>E<sub>j</sub> is the reference proportion in bin j; A<sub>j</sub> is the current proportion. The difference records movement, the log ratio scales relative change, and the sum produces a non-negative empirical divergence. It says nothing directly about AUC, Gini, calibration or realised losses.</p>
  <Formula label="Diagnostic decomposition"><span>PSI<sub>j</sub>=(A<sub>j</sub>−E<sub>j</sub>)ln(A<sub>j</sub>/E<sub>j</sub>); &nbsp; PSI=ΣPSI<sub>j</sub></span></Formula>
  <p>Bin contributions reveal whether movement concentrates in one tail, several middle bands, a missing category or a newly dominant segment. A total without its decomposition is an alert without a diagnosis.</p>
 </section>

 <section id="example"><h2>An original score shift produces PSI of 0.0963</h2>
  <ResourceTable caption="Reference-to-current movement toward lower scores" headers={["Score band","E","A","A−E","ln(A/E)","PSI contribution"]} rows={[["<550","10%","18%","+0.08","0.5878","0.0470"],["550–599","20%","25%","+0.05","0.2231","0.0112"],["600–649","30%","28%","−0.02","−0.0690","0.0014"],["650–699","25%","19%","−0.06","−0.2744","0.0165"],["700+","15%","10%","−0.05","−0.4055","0.0203"],["Total","100%","100%","—","—","0.0963"]]}/>
  <p>The lowest band alone contributes 0.0470—almost half the total. The arithmetic detects redistribution; score ordering supplies the adverse direction. Whether default risk actually worsened requires outcome evidence.</p>
 </section>

 <section id="direction"><h2>Nearly identical PSI can describe opposite portfolio stories</h2>
  <ResourceTable caption="Same reference; different current distributions" headers={["Scenario","<550","550–599","600–649","650–699","700+","PSI","Direction"]} rows={[["A: worse","18%","25%","28%","19%","10%","0.0963","Toward lower score"],["B: better","5%","14%","28%","31%","22%","0.0972","Toward higher score"]]}/>
  <p>Scenario A and B are almost equally distant from development, yet their likely economic interpretations oppose each other. Add directional diagnostics such as ΔMeanScore=MeanScore<sub>t</sub>−MeanScore<sub>ref</sub>, tail movement and bad-oriented characteristic direction.</p>
  <p>A low total can still matter if a strategically important high-risk tail moves. A high total can be benign if a planned seasonal campaign or channel expansion caused it. A moderate, persistent trajectory may be more important than a single spike.</p>
 </section>

 <section id="drift"><h2>Population drift and model deterioration are different states</h2>
  <ResourceTable caption="Separate the distributions" headers={["State","Definition","What it can mean"]} rows={[["Covariate / population shift","P<sub>prod</sub>(X) ≠ P<sub>dev</sub>(X)","Applicant or input mix changed; P(Y|X) may remain stable"],["Concept / relationship drift","P<sub>prod</sub>(Y|X) ≠ P<sub>dev</sub>(Y|X)","Risk relationship changed through stress, behaviour, product, pricing or collections"],["Label shift","P<sub>prod</sub>(Y) changes","Portfolio incidence and calibration can move without ranking collapse"]]}/>
  <p>Score PSI asks whether aggregate model output moved. Characteristic PSI asks which inputs moved. Score stability can hide offsetting input shifts—for example, worse utilisation and better tenure contributions cancel. Conversely, stable input distributions can coexist with rising bad rates inside every bin.</p>
  <Formula label="Characteristic relationship evidence"><span>Distribution: P<sub>t</sub>(X) &nbsp;&nbsp; Risk relationship: P<sub>t</sub>(Y|X)<br/>ΔWoE<sub>j</sub>=WoE<sub>j,t</sub>−WoE<sub>j,dev</sub></span></Formula>
  <p><Link href="/resources/weight-of-evidence-information-value-credit-scoring">WoE drift</Link> can reveal changing bin-to-target relationships. PSI only says bin population moved.</p>
 </section>

 <section id="construction"><h2>PSI depends on monitoring design—not only the population</h2>
  <p>Common “low / moderate / high” ranges are conventions. Meaning depends on sample size, binning, portfolio volatility, seasonality, variable importance and decision sensitivity. N=1,000 fluctuates more than N=1,000,000; use confidence bands, rolling aggregation and materiality rather than pretending empirical noise is fixed.</p>
  <p>PSI<sub>5 bins</sub> need not equal PSI<sub>20 bins</sub>. Preserve governed development bins where diagnostic continuity matters, avoid sparse partitions and never change edges silently. If A<sub>j</sub>=0 or E<sub>j</sub>=0, combine bins or apply a documented floor such as A*<sub>j</sub>=max(A<sub>j</sub>,ε). Smoothing changes the metric.</p>
  <p>A missing rate moving from 2% to 18% may signal upstream failure, new channel or bureau coverage—not borrower deterioration. Treat Missing as a monitored category and investigate it before model conclusions.</p>
  <Formula label="Trajectory and persistence"><span>ΔPSI<sub>t</sub>=PSI<sub>t</sub>−PSI<sub>t−1</sub><br/>Persistence<sub>t</sub>(k)=Σ<sub>h=0</sub><sup>k−1</sup>I(PSI<sub>t−h</sub>&gt;c)</span></Formula>
 </section>

 <section id="baseline"><h2>Different baselines answer different questions</h2>
  <ResourceTable caption="Reference architecture" headers={["Baseline","Question"]} rows={[["Development","How far has production moved from model origin?"],["Last period","What changed incrementally?"],["Rolling","Is recent operation drifting?"],["Same season prior year","Is movement beyond recurring seasonality?"],["Champion reference","Did a controlled portfolio change settle as intended?"]]}/>
  <p>A five-year-old development sample may remain essential for model lineage yet become uninformative as the only operational comparison. Keep both original-development and current-operating references. Holiday, tax, agricultural and promotion cycles require seasonal comparators.</p>
  <Formula label="Portfolio mix"><span>P<sub>portfolio</sub>(X)=Σ<sub>s</sub>w<sub>s</sub>P(X|s)</span></Formula>
  <p>If digital share rises from 20% to 55%, portfolio score PSI may rise while within-digital and within-branch PSI remain modest. That is primarily a mix effect: w<sub>s</sub> changed, not necessarily P(X|s). Segment by product, channel, vintage, customer type or justified geography—but avoid noisy over-segmentation.</p>
  <p>Applicant PSI measures incoming demand; approved PSI reflects demand after policy. A tighter cut-off can shift approved scores mechanically while applicant distribution stays stable. Connect this to <Link href="/resources/credit-risk-cut-off-strategy">Cut-Off Strategy</Link> and the selected-outcome problem in <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>. Vintage-level PSI can expose underwriting and channel changes across cohorts; see <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>.</p>
 </section>

 <section id="performance"><h2>Pair population stability with performance stability</h2>
  <ResourceFigure label="PSI and model-performance decision matrix." caption="Distribution evidence and outcome evidence answer separate questions."><div className={styles.matrix}><div><small>Stable population / stable performance</small><strong>Normal monitoring</strong><p>No obvious issue; retain trajectory watch.</p></div><div><small>Shifted population / stable performance</small><strong>Diagnose the population change</strong><p>Model may still rank and calibrate adequately.</p></div><div><small>Stable population / deteriorating performance</small><strong>Investigate concept or calibration drift</strong><p>Low PSI is not reassurance.</p></div><div><small>Shifted population / deteriorating performance</small><strong>Full model and population review</strong><p>Combined issue may require remediation, recalibration or redevelopment.</p></div></div></ResourceFigure>
  <p>High PSI does not imply AUC↓; low PSI does not imply stable AUC. Monitor PSI beside Gini, observed/expected default, calibration intercept and slope, Brier score and outcome-by-band evidence. A shift toward worse scores with correct score-to-PD calibration is genuine population deterioration, not calibration failure. Stable scores with rising defaults point elsewhere.</p>
  <p>Prioritise characteristic investigations through PSI, model importance and business materiality together. A moderate movement in a dominant variable can outweigh large movement in a weak predictor.</p>
 </section>

 <section id="monitoring"><h2>A 12-month example shows PSI leading—and outcomes arriving later</h2>
  <ResourceTable caption="Original fictional consumer portfolio monitoring" headers={["Month","Score PSI","Utilisation PSI","Mean score","Approval","Bad rate*","Gini*","O/E*"]} rows={[["1","0.018","0.022","641","61%","4.1%","0.46","1.00"],["2","0.024","0.031","639","60%","4.1%","0.46","0.99"],["3","0.039","0.052","636","59%","4.2%","0.45","1.01"],["4","0.061","0.083","632","57%","4.3%","0.46","1.02"],["5","0.087","0.118","628","55%","4.5%","0.45","1.04"],["6","0.112","0.149","624","53%","4.7%","0.45","1.05"],["7","0.128","0.162","622","52%","5.0%","0.44","1.09"],["8","0.141","0.171","620","51%","5.3%","0.44","1.14"],["9","0.153","0.176","619","50%","5.7%","0.43","1.20"],["10","0.159","0.181","618","49%","6.0%","0.42","1.25"],["11","0.164","0.184","617","49%","6.2%","0.41","1.29"],["12","0.168","0.186","616","48%","6.4%","0.40","1.33"]]}/>
  <p><small>*Outcome metrics refer to matured cohorts and therefore lag current applications.</small></p>
  <p>Months 3–6 show distribution movement and lower mean score while Gini and O/E remain broadly stable: diagnose channel, mix, inputs and policy; do not declare model failure. From month 7, O/E rises and later Gini falls. Calibration deterioration and then discrimination weakening become outcome-supported concerns. PSI was an early warning, not proof of loss deterioration.</p>
  <DecisionImplication>Use <strong>Detect → Diagnose → Test → Monitor Outcome</strong>. PopulationShift does not automatically imply LossDeterioration.</DecisionImplication>
 </section>

 <section id="workflow"><h2>Replace threshold reflexes with a diagnostic operating system</h2>
  <ResourceFigure label="Entimema PSI diagnostic architecture." caption="A threshold can open the workflow; it cannot complete it."><div className={styles.architecture}>{diagnostic.map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
  <EntimemaFramework title="Practitioner monitoring workflow" description="Reproducible evidence from production population to governed action." steps={["Reproduce model population","Score and characteristic PSI","Bin driver decomposition","Data-quality checks","Segment and mix comparison","Gini and calibration tests","Materiality assessment","Diagnosis and action","Document evidence"]}/>
  <p>Cadence depends on volume, portfolio velocity, maturity and outcome availability. Distribution, feature and approval monitoring can run weekly or monthly; Gini, calibration and vintage evidence may mature quarterly. Combine leading signals—PSI, inputs, score and approval—with lagging outcomes—defaults, Gini, calibration and vintage performance. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> provides the broader control architecture.</p>
  <p>Population shift + stable ranking + calibration drift may support recalibration; falling discrimination or unstable variable relationships may support redevelopment; data-quality-driven PSI demands operational remediation. These are diagnostic pathways, not automatic rules.</p>
 </section>

 <section id="nbfi"><h2>Non-bank lenders can operate a tighter drift-to-outcome loop</h2>
  <p>Fintech, consumer-finance and instalment portfolios can change rapidly through acquisition channels, risk appetite and new customer groups. PSI supplies fast distribution-level warning. Shorter tenors can also mature outcomes sooner than traditional long-tenor books, allowing characteristic drift, Gini, calibration and cohort loss evidence to be joined more quickly.</p>
  <p>High PSI may confirm that a deliberate channel expansion, new product, geography or eligibility rule reached production. The question is whether the model remains fit for that population—not whether a conventional number turned red.</p>
 </section>

 <section id="failures"><h2>Twenty failure modes turn a diagnostic into false certainty</h2>
  <ResourceTable caption="PSI failure mechanisms" headers={["Failure","Mechanism"]} rows={[["1. PSI treated as performance","Distribution distance substitutes for ranking/calibration"],["2. Universal thresholds","Context and materiality disappear"],["3. Direction ignored","Safer and riskier shifts look equivalent"],["4. Total only","Local tail or missing-bin movement is hidden"],["5. Contributions ignored","No driver diagnosis"],["6. Bins changed","Time comparison loses meaning"],["7. Sample size ignored","Noise becomes an alert"],["8. Zero treatment hidden","Undocumented smoothing changes PSI"],["9. Missing drift ignored","Data failure masquerades as population risk"],["10. Seasonality ignored","Expected cycles become incidents"],["11. Development baseline only","Permanent known change produces stale alarms"],["12. Score PSI only","Offsetting input drift is hidden"],["13. Characteristic PSI ignored","Drivers remain unknown"],["14. Segment mix ignored","Composition is mistaken for within-segment deterioration"],["15. Approved equals applicant","Policy selection contaminates interpretation"],["16. Strategy change ignored","Intended impact is called failure"],["17. Gini/calibration ignored","Model implications remain untested"],["18. Low PSI means stable","Concept drift goes unseen"],["19. High PSI means rebuild","Stable performance is discarded"],["20. Breaches not trends","Slow structural movement arrives unnoticed"]]}/>
 </section>

 <section id="automation"><h2>A Model Stability &amp; Drift Monitoring Agent can make diagnosis recurring</h2>
  <EntimemaFramework title="Model Stability & Drift Monitoring Agent" description="Continuous surveillance + diagnostic prioritisation + evidence generation—not autonomous model governance." steps={["Ingest governed populations","Calculate score and characteristic PSI","Rank bin contributions","Detect direction and persistence","Compare applicant and approved","Decompose segment mix","Flag data-quality shifts","Join Gini and calibration","Produce human-review evidence"]}/>
  <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> work connects monitoring, stability analysis, validation, recalibration and redevelopment diagnostics. <Link href="/services/decision-automation">Decision Automation</Link> can operationalise recurring monitoring controls while leaving model-governance conclusions with accountable humans.</p>
  <p>Continue through <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>, <Link href="/resources/logistic-regression-credit-risk-production-scorecard">Logistic Regression</Link>, <Link href="/resources/score-scaling-points-to-double-odds-credit-scores">Score Scaling &amp; PDO</Link>, <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link> and <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>.</p>
 </section>
</>}
