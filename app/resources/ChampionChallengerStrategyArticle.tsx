import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./champion-challenger-strategy.module.css";

export const championChallengerStrategySections=[
  {id:"definition",label:"Champion and challenger"},{id:"architecture",label:"Testing architecture"},{id:"replay",label:"Decision migration"},
  {id:"support",label:"Common support"},{id:"examples",label:"Challenger examples"},{id:"evidence",label:"Simulation vs evidence"},
  {id:"deployment",label:"Controlled deployment"},{id:"maturity",label:"Outcome maturity"},{id:"attribution",label:"Strategy attribution"},
  {id:"operations",label:"Production constraints"},{id:"governance",label:"Graduation and rollback"},{id:"non-bank",label:"Non-bank perspective"},
  {id:"failures",label:"Failure modes"},{id:"agent",label:"Experimentation Agent"},
] as const;

const failures=[
  ["Simulation declares the winner","Replay shows changed decisions, not the unobserved outcomes those decisions would have caused."],["Rejected outcomes treated as known","Historically rejected applicants usually have no lender performance."],
  ["Take-up ignored","Approval is not booking; changed offers alter customer choice."],["Limit utilisation assumed","Historical use under one limit does not reveal use under another."],
  ["Several changes without attribution","Cut-off, limit, price and policy effects cannot be separated."],["No hypothesis","Testing becomes strategy churn without a refutable mechanism."],
  ["No versioning","Rules, models, prices and limits cannot be tied to outcomes."],["No holdout","Calendar and portfolio changes become indistinguishable from treatment."],
  ["Immature results called final","Fast operational signals cannot substitute for default, LGD or realised margin."],["Macro or channel confounding ignored","Deployment context can make a weak strategy look strong—or the reverse."],
  ["Approvals replace bookings","Portfolio risk and economics arise only after acceptance."],["Operational cost and latency ignored","Manual review or delay can erase simulated value."],
  ["Bad rate optimised","Approval growth can raise volume while destroying risk-adjusted economics."],["Value without risk constraints","A point estimate cannot bypass affordability, policy or portfolio appetite."],
  ["Uncertainty hidden","Small simulated advantage may be dominated by PD, LGD, EAD or take-up error."],["No rollback","Production deterioration has no controlled path back to safety."],
  ["No kill criteria","Known early-warning conditions do not stop exposure growth."],["Blind p-value decisioning","Statistical detection can be economically trivial or risk-irrelevant."],
  ["One deployment everywhere","A challenger may work only in one product, channel or risk band."],["No strategy vintages","Seasoning and strategy effects cannot be separated."],
  ["No forecast attribution","The organisation learns that a forecast missed, not why."],["Continuous churn","Implementation burden grows while hypotheses and evidence remain unresolved."],
];

export default function ChampionChallengerStrategyArticle(){return <div className={styles.articleBody}>
  <section id="definition"><p className={styles.lead}>A challenger strategy is not better because a replay simulation says so. It is better only when the evidence survives selection bias, counterfactual uncertainty, implementation effects and real portfolio outcomes.</p>
    <div className={styles.dual}><article><b>CHAMPION</b><strong>Dᵢᶜ = Sᶜ(Xᵢ)</strong><span>Current production strategy</span></article><i>↔</i><article><b>CHALLENGER</b><strong>Dᵢʰ = Sʰ(Xᵢ)</strong><span>Alternative governed strategy</span></article></div>
    <Formula label="Conceptual decision change"><span className={styles.formula}>ΔDᵢ = Dᵢʰ − Dᵢᶜ</span></Formula>
    <p>Strategy is more than cut-off. Eligibility, policy rules, affordability, referrals, limits, pricing and product alternatives can all change. A single-change challenger is easier to interpret; a multi-change challenger can create larger value but weaker attribution.</p>
    <KeyObservation title="Signature distinction"><p><strong>Simulation tells you what the strategy would have decided. It does not automatically tell you what would have happened.</strong></p></KeyObservation>
  </section>

  <section id="architecture"><h2>Strategy testing moves from hypothesis to mature evidence</h2>
    <EntimemaFramework title="Entimema Champion / Challenger Architecture" description="Replay narrows the question; controlled production and mature outcomes answer it." steps={["Strategy hypothesis","Champion definition","Challenger design","Historical replay","Common-support / counterfactual assessment","Sensitivity","Controlled deployment","Leading indicators","Mature vintage outcomes","Expected vs realised attribution","Graduate / modify / reject","New champion"]}/>
    <p>Every version must preserve rulebook, models, thresholds, affordability logic, limits, pricing and effective dates. Without <strong>StrategyVersionₜ</strong>, the decision cannot be reconstructed and the outcome cannot be attributed.</p>
    <EntimemaFramework title="Strategy Hypothesis Template" steps={["Problem","Hypothesis","Strategy change","Expected mechanism","Metrics","Risk constraints","Maturity horizon","Decision rule"]}/>
    <p>A useful hypothesis is specific: “Reducing limits for marginal-score approvals will allow controlled cut-off expansion without excessive EAD growth.” It defines both the mechanism and the evidence that could refute it.</p>
  </section>

  <section id="replay"><h2>Decision migration locates where strategies actually disagree</h2>
    <Formula label="Approval-rate change"><span className={styles.formula}>Δ Approval rate = Approval rate challenger − Approval rate champion</span></Formula>
    <ResourceTable caption="Champion-to-challenger decision migration matrix" headers={["Champion","Challenger","Interpretation","Outcome evidence"]} rows={[["Approve","Approve","Stable acceptance","Usually observed"],["Reject","Reject","Stable rejection","Usually unobserved"],["Approve","Reject","Challenger tightening","Usually observed under Champion"],["Reject","Approve","Challenger expansion","Usually unobserved"]]}/>
    <p>The migration framework can extend to refer, lower limit or different price. The off-diagonal populations carry most information. Tightening can estimate avoided historical losses and revenue, subject to customer lifetime effects. Expansion enters asymmetric evidence: outcomes are absent precisely where the new strategy proposes lending.</p>
    <div className={styles.workflow}>{["Historical applications","Champion replay","Challenger replay","Decision migration","Expected economics","Counterfactual risk","Test population","Champion / Challenger routing","Outcome warehouse","Vintage analysis","Governance decision"].map(x=><span key={x}>{x}</span>)}</div>
  </section>

  <section id="support"><h2>Common support determines how far replay can credibly travel</h2>
    <Formula label="Conceptual strategy distance"><span className={styles.formula}>Strategy distance = f(Decision changes, Population support, Limit changes, Price changes)</span></Formula>
    <p><strong>Support(X)</strong> asks whether challenger-approved applicants resemble historically approved populations. A local challenger near the production frontier has more directly relevant evidence than a radical challenger entering unobserved borrower, price or limit space. Strategy distance is a reasoning framework—not a universal scalar.</p>
    <p>Historical data contain P(Y | Aᶜ = 1), not necessarily P(Y) for every applicant. Similar approved borrowers, overrides, external outcomes where valid and controlled tests may add evidence, but none manufactures the missing counterfactual. <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> develops this selective-observation problem.</p>
    <Formula label="Potential outcome intuition"><span className={styles.formula}>Observe Yᵢ(Dᵢ actual), not both Yᵢ(Dᵢ champion) and Yᵢ(Dᵢ challenger)</span></Formula>
    <ResourceFigure label="Strategy evidence ladder from replay to mature outcomes." caption="Each step can reduce counterfactual uncertainty, but only controlled deployment and mature observed outcomes directly expose performance under the challenger."><div className={styles.ladder}>{["Historical replay","Similar-population evidence","Overrides / natural experiments","Controlled challenger","Mature outcome evidence"].map((x,i)=><span key={x} style={{transform:`translateX(${i*5}%)`}}>{x}</span>)}</div></ResourceFigure>
  </section>

  <section id="examples"><h2>A cut-off challenger can expand approval faster than evidence</h2>
    <ResourceTable caption="Fictional cut-off replay on 10,000 applications" headers={["Strategy / band","Applications","Approvals","Predicted PD","Evidence status"]} rows={[["Champion: score ≥620","10,000","5,200","2.8%","Observed outcomes for historic bookings"],["Challenger: score ≥600","10,000","6,100","3.2%","900 incremental approvals are model-based"],["Incremental 600–619","900","900","5.5%","Limited direct support; predicted, not observed"]]}/>
    <p>The challenger adds 900 approvals and modelled expected value may rise. Yet the incremental band’s PD and loss are predictions. If apparent advantage is +2% while PD, LGD, take-up or cost uncertainty is wider, the win is fragile.</p>
    <ResourceTable caption="Fictional multi-strategy replay" headers={["Strategy","Approvals","Expected EAD","Expected loss","Simulated EV"]} rows={[["Champion: ≥620, standard limit","5,200","€18.2m","€480k","€1.12m"],["Challenger A: ≥600, same limit","6,100","€22.0m","€690k","€1.24m"],["Challenger B: ≥600, reduced 600–619 limits","6,100","€20.1m","€605k","€1.29m"]]}/>
    <p>B illustrates an interaction: lower cut-off plus lower marginal limits behaves differently from cut-off alone. These are <strong>simulated expectations</strong>, not realised results. Test higher PD, LGD and CCF, lower take-up and revenue. A robust challenger survives reasonable sensitivity; a fragile one wins only in optimistic assumptions.</p>
  </section>

  <section id="evidence"><h2>Simulation, expectation and observed evidence answer different questions</h2>
    <ResourceFigure label="Three-level simulation versus evidence framework." caption="Decision replay is deterministic strategy output; model-based expectation predicts consequences; controlled observed outcomes reveal what happened in production."><div className={styles.levels}><article><b>LEVEL 1 — SIMULATION</b><strong>What would the engine decide?</strong></article><article><b>LEVEL 2 — MODEL-BASED EXPECTATION</b><strong>What do models predict would happen?</strong></article><article><b>LEVEL 3 — OBSERVED EVIDENCE</b><strong>What actually happened under controlled production?</strong></article></div></ResourceFigure>
    <p>Price replay cannot observe historical take-up at the challenger price. Limit replay cannot observe utilisation under a different line. Affordability expansion cannot observe outcomes for applicants the champion rejected. EVᶜ and EVʰ remain model-based until customer response, loss and cost mature.</p>
    <p>Statistical evidence, economic materiality and risk relevance belong together. A statistically detectable change can be trivial; an economically large result can remain too immature or sparse to trust.</p>
  </section>

  <section id="deployment"><h2>Controlled learning belongs inside a safe exploration region</h2>
    <p>Where operationally, legally and ethically appropriate, route a limited eligible population into a Champion holdout and Challenger cell. Random assignment can improve causal interpretation, but mandatory policy, affordability and risk appetite remain non-negotiable. Testing is not permission to approve clearly unacceptable applicants.</p>
    <ResourceFigure label="Governed champion holdout and challenger-cell architecture." caption="Only applicants inside approved exploration bounds enter controlled routing; outcomes return to a common evidence system."><div className={styles.test}><b>SAFE EXPLORATION POPULATION</b><div><span>CHAMPION HOLDOUT</span><span>CHALLENGER CELL</span></div><em>COMMON OUTCOME WAREHOUSE → VINTAGE COMPARISON</em></div></ResourceFigure>
    <p>Compare cells on score, income, product, channel, geography where justified and application timing. A challenger deployed only in one channel confounds strategy with acquisition. A launch before economic deterioration confounds treatment with macro conditions. Sample size, exposure and expected event count determine whether meaningful differences can mature; 100 accounts may be insufficient even when early rates look dramatic.</p>
  </section>

  <section id="maturity"><h2>Outcome clocks mature at different speeds</h2>
    <div className={styles.timeline}><article><b>LEADING</b><strong>Approval, take-up, risk mix, utilisation, first payment</strong></article><article><b>INTERMEDIATE</b><strong>30+ DPD, roll rates, cure and review outcomes</strong></article><article><b>MATURE</b><strong>Default, LGD, lifetime value and realised margin</strong></article></div>
    <Formula label="Strategy vintage"><span className={styles.formula}>Performanceᵥ,ₛ = outcomes by origination vintage v and strategy version s</span></Formula>
    <p>Compare Champion and Challenger vintages on approval, booking, booked risk, delinquency, loss, revenue and margin at equal months on book. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> provides the cohort architecture; <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> exposes Current → 30 DPD and 30 → 60 migration before terminal default.</p>
    <p>Book rate = approval rate × take-up rate. A challenger can approve more but book less if price, amount or terms weaken acceptance. Portfolio economics arise from booked accounts, so monitor P(Risk | Booked), not only P(Risk | Approved).</p>
  </section>

  <section id="attribution"><h2>Strategy learning asks which assumptions were wrong</h2>
    <Formula label="Expected-versus-realised attribution"><span className={styles.formula}>EV realised − EV expected = Volume error + Take-up error + PD error + LGD error + EAD error + Revenue error + Cost error + Interaction</span></Formula>
    <p>The question after a test is not only “did it win?” but “what did the decision system teach us?” If cut-off, limit and price all change, improved performance cannot be assigned to one lever. Sequential challengers increase interpretation but slow learning; governed factorial thinking can test multiple factors and interactions where sophistication and sample size permit.</p>
    <p>Cut-off × limit and price × affordability interactions matter. A lower cut-off with reduced marginal limits may control EAD better than the same cut-off at standard limits. Attribution should connect expected mechanism to observed deviation rather than produce a post-hoc story.</p>
  </section>

  <section id="operations"><h2>A challenger must work at production scale</h2>
    <p>Higher approval changes underwriting load, funding, servicing and collections. A manual-review challenger must measure review rate, turnaround, conversion, overrides, incremental value and cost. Decision latency can increase abandonment and reduce value even when the credit logic improves.</p>
    <p>Applicant-level profitability can still create concentration, excessive growth, high Stage 2 exposure or capital and liquidity pressure. Mandatory policy, affordability and portfolio appetite remain constraints unless governance explicitly changes them.</p>
    <p>The Champion can drift through population, macro conditions, calibration or behaviour even when code is unchanged. It is the current control—not permanent truth. Continuous improvement should remain <strong>Champion → Challenger → Evidence → Graduate / Reject → New Champion → Next material hypothesis</strong>, without endless low-value testing.</p>
  </section>

  <section id="governance"><h2>Graduation, partial deployment and rollback are designed before launch</h2>
    <p>Graduation criteria should cover risk, economics, customer response, operations and stability without relying on universal numeric thresholds. Replace the Champion only after expected value improvement, acceptable risk, feasibility, stable evidence and governance requirements align.</p>
    <p>A Challenger may win only in one product, risk band or channel; partial graduation can be more credible than universal deployment. Predefined kill criteria can pause unexpected delinquency, affordability issues, data failures or operational breakdown. Every production test needs explicit rollback logic and more frequent monitoring while evidence is immature.</p>
  </section>

  <section id="non-bank"><h2>Non-bank lenders can learn quickly—and lose quickly</h2>
    <p>Digital decisioning, frequent strategy changes, larger volumes and short-tenor outcomes can create a powerful <strong>strategy → vintage → outcome → update</strong> loop. First-payment default and early delinquency can mature quickly in high-risk consumer portfolios.</p>
    <p>Speed also increases uncontrolled strategy churn and can accumulate material losses rapidly. Fast evidence does not justify reckless exploration. Explicit risk bounds, balanced test cells, versioning, outcome maturity and rollback become more important—not less.</p>
  </section>

  <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Champion / challenger failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

  <section id="agent"><h2>A Credit Strategy Experimentation Agent can assemble evidence—not deploy risk</h2>
    <p>A future Agent can ingest Champion and Challenger versions; replay both; create migration matrices; identify common-support gaps; estimate economics; run sensitivities; flag unsafe expansion; design governed test cells; monitor early delinquency; construct vintages; compare outcomes; and attribute expected-versus-realised differences for human governance.</p>
    <p>Its role is <strong>strategy simulation + experiment analytics + monitoring + evidence assembly</strong>. It must not autonomously deploy challengers or expand risk appetite.</p>
    <div className={styles.agent}>{["Credit Policy Rule Governance Agent","Affordability Agent","Limit Optimisation Agent","Pricing Optimisation Agent","Credit Strategy Experimentation Agent","Credit Decision Strategy Agent"].map(x=><span key={x}>{x}</span>)}</div>
    <EntimemaFramework title="Practitioner Decision Logic" steps={["State hypothesis","Replay strategy","Identify unobserved outcomes","Stress assumptions","Deploy safely","Observe early signals","Wait for maturity","Attribute outcomes","Graduate or reject"]}/>
    <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for cut-off testing, policy evaluation, portfolio risk and strategy optimisation.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for replay, challenger routing, experiment infrastructure and monitoring.</p></article></div>
    <KeyObservation title="The resolve"><p><strong>Champion strategy → challenger design → replay → counterfactual limits → controlled test → outcome maturity → vintage comparison → economic attribution → governance decision.</strong></p></KeyObservation>
    <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/credit-policy-rules-lending-rulebook-governance">Credit Policy Rules</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/risk-based-pricing-credit-decisioning">Risk-Based Pricing</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>.</p>
  </section>
</div>}
