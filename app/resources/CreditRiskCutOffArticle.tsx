import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-risk-cut-off.module.css";

export const creditRiskCutOffSections = [
  { id: "probability-not-decision", label: "Score is not a decision" },
  { id: "economics", label: "Expected and marginal economics" },
  { id: "application-example", label: "100,000-application example" },
  { id: "decision-zones", label: "From one cut-off to decision zones" },
  { id: "portfolio-frontier", label: "The cut-off frontier" },
  { id: "strategy-system", label: "Pricing, limits, policy and appetite" },
  { id: "selection", label: "Reject inference and segmentation" },
  { id: "robustness", label: "Constraints, stress and experimentation" },
  { id: "decision-engine", label: "From cut-off to decision engine" },
  { id: "monitoring", label: "Monitoring and strategy drift" },
  { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Strategy Optimisation Agent" },
] as const;

const decisionChain = ["Borrower information", "Model score", "Calibrated PD", "Expected loss", "Economics", "Policy", "Decision zones", "Portfolio outcome"];

export default function CreditRiskCutOffArticle() {
  return <>
    <p className="resource-lead"><em>A risk model produces information. A decision strategy determines what the lender actually does with it.</em></p>
    <KeyObservation>There is no statistically optimal credit cut-off in isolation. A cut-off is an economic decision boundary where risk appetite, expected loss, margin, approval volume and uncertainty meet.</KeyObservation>

    <section id="probability-not-decision">
      <h2>A score ranks risk; it does not choose an action</h2>
      <p>Suppose an applicant has a calibrated probability of default of <strong>4.2%</strong>. Is the borrower acceptable? The number alone cannot answer. The same PD can support approval, a modified offer, manual review or decline once margin, LGD, exposure, price, operating cost, affordability, capital, policy, portfolio objectives and risk appetite enter the decision.</p>
      <Formula label="A risk model maps borrower information to probability of default"><span>Model(X<sub>i</sub>) → PD<sub>i</sub></span></Formula>
      <Formula label="Higher score means lower risk in this convention"><span>Approve<sub>i</sub> = I(Score<sub>i</sub> ≥ c) &nbsp;&nbsp;|&nbsp;&nbsp; Approve<sub>i</sub> = I(PD<sub>i</sub> ≤ PD*)</span></Formula>
      <Formula label="A decision system maps risk, economics, policy and constraints to an action"><span>Decision(PD<sub>i</sub>, Economics<sub>i</sub>, Policy<sub>i</sub>, Constraints<sub>i</sub>)<br />→ &#123;Approve, Review, Decline&#125;</span></Formula>
      <p>These are separate systems. The model asks, <em>How risky is this borrower?</em> The strategy asks, <em>Given that risk and this transaction&apos;s economics, what should we do?</em> A credible PD is an input to judgement, not a substitute for it.</p>
      <ResourceTable caption="Three analytical layers that must not be conflated" headers={["Layer","Question","Output"]} rows={[["Ranking","Who is riskier?","Relative order from the score"],["Calibration","How risky are they?","PD over a defined horizon"],["Decision strategy","What should we do?","Approve, review, reject, price, limit and terms"]]}/>
      <p><strong>Score cut-off ≠ universal risk boundary.</strong> Its meaning depends on the scorecard, calibration, population, product economics, strategy and time period. The same numeric score from another model need not represent the same PD or decision.</p>
      <EntimemaFramework title="From risk signal to portfolio consequence" description="Measurement acquires decision meaning only through economics and constraints." steps={decisionChain} />

      <h3>Why a statistical threshold is not automatically a business cut-off</h3>
      <p>ROC curves, AUC, Gini, KS, accuracy, sensitivity and specificity describe ranking or classification behaviour at candidate thresholds. They do not directly price a false approval, a false decline, expected credit loss, forgone margin, customer acquisition value, operating expense or capital usage.</p>
      <p>A KS-maximising threshold can be economically inferior to a neighbouring threshold because the two errors have different consequences—and those consequences vary by exposure and offer. <strong>Classification error has asymmetric economic value in lending.</strong> Statistical diagnostics remain valuable, but they cannot choose the institution&apos;s commercial and risk posture.</p>
      <KeyObservation><p><strong>The model estimates risk. The decision strategy determines which risks the institution will accept, under what economics, and under which constraints.</strong></p></KeyObservation>
    </section>

    <section id="economics">
      <h2>The economics of approval</h2>
      <p>A useful starting architecture estimates the incremental value of approving exposure <em>i</em>:</p>
      <Formula label="Simplified expected value of an approved exposure"><span>EV<sub>i</sub> = Expected Revenue<sub>i</sub> − Expected Credit Loss<sub>i</sub> − Operating and Other Risk Cost<sub>i</sub></span></Formula>
      <Formula label="Expanded conceptual value architecture"><span>EV<sub>i</sub> = Revenue<sub>i</sub> − FundingCost<sub>i</sub> − OperatingCost<sub>i</sub> − ExpectedLoss<sub>i</sub> − CapitalCost<sub>i</sub></span></Formula>
      <Formula label="Expected credit loss"><span>EL<sub>i</sub> = PD<sub>i</sub> × LGD<sub>i</sub> × EAD<sub>i</sub></span></Formula>
      <p>Revenue is the expected income attributable to the exposure, on a horizon consistent with the risk estimate. PD measures default likelihood; LGD measures the share lost if default occurs; EAD measures exposure at default. Cost represents acquisition, servicing and other included costs. This is a deliberately simplified decision framework—not a universal pricing model. Timing, prepayment, utilisation, recoveries, funding, capital, tax, lifetime behaviour and option effects may all require richer treatment.</p>

      <h3>The break-even PD</h3>
      <p>Setting the simplified expected value to zero makes the economic boundary visible:</p>
      <Formula label="Simplified break-even probability of default"><span>Revenue − PD × LGD × EAD − Cost = 0<br /><strong>PD* = (Revenue − Cost) / (LGD × EAD)</strong></span></Formula>
      <p><strong>PD*</strong> is the maximum probability consistent with zero expected value under these assumptions. It is not automatically the production cut-off. Capital and funding charges, risk appetite, portfolio constraints, estimation uncertainty, lifetime economics, policy, regulatory requirements and operational capacity can move the adopted boundary below—or reshape the offer before it reaches—that simplified point.</p>

      <h3>A borrower-level example</h3>
      <p>Consider a synthetic application with €10,000 EAD, €1,000 expected revenue, 45% LGD, €250 operating and acquisition cost, and 8% calibrated PD. Expected loss is <strong>8% × 45% × €10,000 = €360</strong>. Simplified expected value is therefore <strong>€1,000 − €360 − €250 = €390</strong>.</p>
      <p>The break-even PD is <strong>(€1,000 − €250) / (45% × €10,000) = 16.67%</strong>. At precisely that PD, expected loss is €750 and EV is zero.</p>
      <ResourceTable caption="Borrower comparison with identical €10,000 EAD, 45% LGD, €1,000 revenue and €250 cost. Synthetic illustration." headers={["Calibrated PD", "Expected loss", "Expected value", "Economic reading"]} rows={[
        ["2%", "€90", "€660", "Strong positive cushion"], ["8%", "€360", "€390", "Positive before omitted charges"], ["14%", "€630", "€120", "Nearer the boundary"], ["16.67%", "€750", "€0", "Simplified break-even"], ["20%", "€900", "−€150", "Value-destructive on these terms"],
      ]} />
      <p>This progression makes the boundary intuitive, but not universal. Change the price, collateral, limit, tenor, utilisation or cost and the economic boundary changes. Two borrowers can have PD<sub>A</sub> = PD<sub>B</sub> while Decision<sub>A</sub> ≠ Decision<sub>B</sub> because their LGD, EAD, price and cost differ. <strong>Risk is only one side of risk-adjusted economics.</strong></p>
      <h3>The marginal applicant—not the average book—sets the boundary</h3>
      <Formula label="Incremental value from relaxing cut-off c to c′"><span>ΔValue(c→c′) = Value(Newly Approved Band) − Incremental Constraints and Risk Cost</span></Formula>
      <p>The question is not whether approved borrowers are profitable on average. It is whether admitting the <strong>next marginal risk band</strong> still creates sufficient value. A highly profitable existing book can conceal a newly admitted band that destroys value; average profitability is not evidence that the current edge of acceptance is sound.</p>
    </section>

    <section id="application-example">
      <h2>An original 100,000-application cut-off analysis</h2>
      <p>The fictional lender below evaluates five score bands. Higher scores imply lower risk. Revenue, EAD, PD, LGD and cost assumptions are original and illustrative; they are not institutional thresholds or a universal pricing formula.</p>
      <ResourceTable caption="Original score-band economics" headers={["Score band","Applications","PD","Avg EAD","LGD","Revenue / booked","Funding + operating cost","EL / booked","Contribution / booked"]} rows={[
        ["700+","15,000","1.0%","€8,000","40%","€900","€350","€32","€518"],
        ["650–699","25,000","2.5%","€7,500","42%","€850","€340","€78.75","€431.25"],
        ["600–649","30,000","5.0%","€7,000","45%","€800","€330","€157.50","€312.50"],
        ["550–599","20,000","10.0%","€6,500","48%","€760","€320","€312","€128"],
        ["<550","10,000","18.0%","€6,000","50%","€720","€310","€540","−€130"],
      ]}/>
      <ResourceTable caption="Three candidate strategies; all values are expected and simplified" headers={["Strategy","Cut-off","Approval rate","Booked exposure","Expected defaults","Expected revenue","Expected loss","Expected contribution"]} rows={[
        ["A","Approve ≥650","40%","€307.5m","775","€34.75m","€2.449m","€18.551m"],
        ["B","Approve ≥600","70%","€517.5m","2,275","€58.75m","€7.174m","€27.926m"],
        ["C","Approve ≥550","90%","€647.5m","4,275","€73.95m","€13.414m","€30.486m"],
      ]}/>
      <p>Strategy C produces the highest simplified total contribution, but its marginal 550–599 band adds only <strong>€2.56m</strong> across 20,000 bookings while materially increasing expected defaults, loss, exposure and servicing demand. The next &lt;550 band contributes <strong>−€1.30m</strong> before any added capital or collections constraint. The frontier therefore turns on marginal economics, not the attractive average return of applicants already approved under A or B.</p>
      <DecisionImplication>Strategy C is not automatically the production answer. The additional value must remain acceptable under risk appetite, capital, liquidity, concentration, operational capacity and stressed PD/LGD assumptions.</DecisionImplication>
    </section>

    <section id="decision-zones">
      <h2>From one cut-off to decision zones</h2>
      <h3>The single cut-off</h3>
      <Formula label="Single credit risk cut-off"><span>PD<sub>i</sub> ≤ c ⇒ Approve &nbsp;&nbsp;|&nbsp;&nbsp; PD<sub>i</sub> &gt; c ⇒ Decline</span></Formula>
      <p>A single boundary is transparent, operationally efficient and easy to monitor. It is also a cliff: two applicants on opposite sides can receive different decisions despite economically immaterial risk differences. It creates no uncertainty zone, offers weak differentiation by transaction economics and leaves no structured route for evidence that the model does not capture.</p>

      <h3>The three-zone strategy</h3>
      <ResourceFigure label="Probability of default continuum from lower to higher risk, divided by c1 and c2 into approve, manual review and decline zones." caption="The review-zone width is itself an economic and operational choice, not a neutral gap between two thresholds.">
        <div className={styles.zones}>
          <header><span>LOWER RISK</span><span>PROBABILITY OF DEFAULT →</span><span>HIGHER RISK</span></header>
          <div className={styles.zoneBar}><div><strong>APPROVE</strong><small>PD &lt; c₁</small></div><i><b>c₁</b></i><div><strong>MANUAL REVIEW</strong><small>c₁ ≤ PD &lt; c₂</small></div><i><b>c₂</b></i><div><strong>DECLINE</strong><small>PD ≥ c₂</small></div></div>
        </div>
      </ResourceFigure>
      <p>The middle zone is useful when uncertainty is higher, additional evidence can change the decision, borderline economics need judgement, an exception is possible, or collateral and affordability require review. But review consumes analyst time, delays the customer, introduces inconsistency risk and has finite capacity. A broad review band may merely replace model error with expensive operational noise.</p>
      <DecisionImplication><p>Design c₁, c₂ and review capacity together. A case belongs in review only when the expected value of obtaining and interpreting additional information exceeds its cost and delay.</p></DecisionImplication>
    </section>

    <section id="portfolio-frontier">
      <h2>The portfolio strategy frontier</h2>
      <p>Making a cut-off more permissive generally raises approval and portfolio risk. Tightening it generally lowers bad rate and expected loss, but also sacrifices volume, revenue, acquisition and potentially diversification. The choice is therefore a frontier, not a single statistical optimum.</p>
      <ResourceTable caption="Illustrative annual outcomes per 10,000 applications. Revenue equals €900 per approved account; expected loss reflects the displayed bad rate, 45% LGD and €10,000 EAD; other cost equals €250 per approval. All values are synthetic." headers={["Maximum PD", "Approval rate", "Expected bad rate", "Revenue", "Expected loss", "Expected value"]} rows={[
        ["3%", "25%", "1.5%", "€2.250m", "€0.169m", "€1.456m"],
        ["6%", "45%", "2.4%", "€4.050m", "€0.486m", <strong key="best">€2.439m</strong>],
        ["10%", "65%", "4.1%", "€5.850m", "€1.199m", "€3.026m"],
        ["15%", "78%", "6.7%", "€7.020m", "€2.352m", <strong key="peak">€2.718m</strong>],
        ["20%", "86%", "9.2%", "€7.740m", "€3.560m", "€2.030m"],
      ]} />
      <p>Here the lowest bad rate does not create the highest value, and the highest approval rate is not best. The 10% policy produces the largest simplified EV (€3.026m); loosening to 15% adds revenue but expected loss grows faster. Values reconcile as revenue minus expected loss minus €250 per approval. They exclude capital, funding and other effects, so they demonstrate logic rather than prescribe a threshold.</p>
      <ResourceFigure label="Strategy frontier contrasting strict and loose credit cut-offs with expected value as the optimisation layer." caption="Expected value mediates the volume–loss trade-off; constraints determine which economically attractive point is admissible.">
        <div className={styles.frontierCurve}><span className={styles.frontierY}>EXPECTED RISK-ADJUSTED VALUE ↑</span><svg viewBox="0 0 720 330" role="img" aria-label="Conceptual cut-off frontier where expected value rises with approval rate, reaches a constrained decision region, then falls as marginal risk exceeds economics"><line x1="70" y1="285" x2="680" y2="285"/><line x1="70" y1="285" x2="70" y2="35"/><path d="M78 272 C160 225 245 155 340 105 C430 58 510 78 585 150 C625 190 650 235 675 270"/><line className={styles.constraintLine} x1="485" y1="55" x2="485" y2="285"/><circle cx="340" cy="105" r="7"/><circle className={styles.constraintPoint} cx="485" cy="96" r="7"/><text x="300" y="80">UNCONSTRAINED PEAK</text><text x="495" y="118">ADMISSIBLE BOUNDARY</text><text x="245" y="320">APPROVAL RATE →</text></svg><p>Marginal value positive <b>→</b> constraints bind <b>→</b> marginal value negative</p></div>
      </ResourceFigure>
      <p>The curve is conceptual, not a claim that every portfolio has a smooth universal frontier. Empirical strategies are often stepped by score band, policy rule and offer. Its purpose is to distinguish the value peak from the highest <em>admissible</em> point under constraints.</p>
    </section>

    <section id="strategy-system">
      <h2>Pricing, limits, policy and appetite shape the boundary</h2>
      <h3>Cut-off versus pricing and limit</h3>
      <Formula label="Conceptual risk-based price"><span>Price = f(PD, LGD, EAD, Funding, Capital, Cost, Margin)</span></Formula>
      <p>Decline is not the only possible response to higher risk. Subject to affordability, competition, regulation, customer behaviour, adverse selection and appetite, the institution might charge a higher price, reduce the limit, request collateral, shorten tenor or seek review. Price cannot rescue every risk: a theoretically compensating rate may be unaffordable, unlawful, commercially implausible or itself attract adverse selection.</p>
      <p>Likewise, the strategy may solve for <strong>Approve(EAD<sub>i</sub>)</strong>, not simply approve or decline. Lower-PD customers may receive higher allowable limits; higher-PD customers lower limits, always subject to affordability and policy. This changes expected loss through EAD while preserving access on controlled terms.</p>

      <h3>Segment-specific cut-offs</h3>
      <p>Different boundaries can be justified across products, customer groups, acquisition channels, secured and unsecured lending, or new and existing customers where economics, risk, available data, policy or strategy genuinely differ. Uncontrolled segmentation, however, turns historical artefacts into policy. Each distinction needs an explicit rationale, adequate evidence, stable implementation and monitoring for unintended segment effects.</p>

      <h3>Risk appetite and hard policy are not model outputs</h3>
      <p>A profitable exposure may remain outside institutional risk appetite; a low-risk exposure can remain economically weak. The decision must combine <strong>risk measurement × economic value × risk appetite</strong>. It must also apply deterministic eligibility: affordability, minimum documentation, legal restrictions, exposure concentration and product rules can reject an applicant who passes the model cut-off.</p>
      <Formula label="Decision requires both model acceptance and policy eligibility"><span>Decision = Model Decision ∩ Policy Eligibility</span></Formula>
      <EntimemaFramework title="Risk Appetite → Portfolio Constraint → Decision Rule → Application Action" description="Risk appetite becomes operational only when it changes executable lending boundaries." steps={["Risk appetite", "Portfolio constraint", "Decision rule", "Application action"]}/>
      <h3>Ordering policy, fraud, affordability and risk can change the observed funnel</h3>
      <EntimemaFramework title="Eligibility → Policy → Fraud → Risk Model → Affordability → Strategy → Final Decision" description="A production waterfall should make ordering, exclusions and reason codes explicit." steps={["Eligibility", "Policy", "Fraud", "Risk model", "Affordability", "Strategy", "Final decision"]}/>
      <p>Approve, decline and review overrides need reason codes, authority limits and outcome tracking. High override rates can reveal poor model fit, inappropriate boundaries, missing policy logic, cultural resistance or misuse. Performance of overridden cases should be compared with cases where the engine&apos;s original action stood.</p>
    </section>

    <section id="selection">
      <h2>Historical optimisation sees accepted borrowers more clearly than rejected ones</h2>
      <p>Performance outcomes are normally observed for booked applicants. For rejected applicants, the counterfactual default outcome under the lender&apos;s offer is usually missing. The historical sample is therefore truncated by prior policy: the very boundary being optimised determined which outcomes became observable.</p>
      <Formula label="Rejected-applicant outcome is commonly unobserved"><span>Y<sup>default</sup><sub>i</sub> = ? &nbsp;&nbsp; when &nbsp;&nbsp; Decision<sub>i</sub> = Reject</span></Formula>
      <p>This creates accepted-population bias, reject-inference uncertainty and extrapolation risk. A new, looser cut-off enters populations with less direct performance evidence; a back-test that treats accepted history as representative can overstate confidence. Reject inference techniques can support analysis, but none manufactures ground truth. Strategy recommendations should disclose assumptions, sensitivity and the distance from observed support.</p>
      <h3>Segment-specific boundaries spend governance capacity</h3>
      <p>Product, channel, new versus existing customer, scorecard, risk segment, justified geography and customer relationship can support different cut-offs when economics or information differ. Every split also reduces sample stability, increases implementation complexity, creates fairness and consistency questions, and expands monitoring. Segmentation should solve a documented economic or risk problem—not endlessly search for a higher back-tested result.</p>
    </section>

    <section id="robustness">
      <h2>Optimise for robustness, not one point estimate</h2>
      <Formula label="Maximum expected value is not automatically the production cut-off"><span>Optimal Cut-Off ≠ arg max<sub>c</sub> Expected Profit(c)</span></Formula>
      <p>A candidate cut-off should be stressed against PD, LGD, revenue, funding cost, operating cost and macroeconomic assumptions. The nominal optimum can migrate materially when defaults rise or recoveries fall. <strong>Decision robustness</strong> asks whether a strategy remains acceptable across credible states; <strong>point estimate optimisation</strong> merely identifies the best answer under one assumed state.</p>
      <p>PD itself is an estimate, <strong>PD̂</strong>, not observed truth. Calibration uncertainty, sparse segments, estimation error and changing conditions justify explicit margins of safety, review zones or conservative overlays where evidence supports them. These controls should be quantified and governed, not used to disguise intuition as precision.</p>

      <h3>Borrower value does not automatically maximise portfolio value</h3>
      <p>A cut-off changes volume, risk, revenue, concentration, capital and operational workload simultaneously. The conceptual objective can therefore be written as:</p>
      <Formula label="Conceptual portfolio optimisation under constraints"><span>max Σ EV<sub>i</sub><br />subject to Expected Loss ≤ L; Approval Volume ≤ V; Capital Usage ≤ K</span></Formula>
      <Formula label="Stress can move both default probability and loss severity"><span>PD<sup>stress</sup><sub>i</sub> &gt; PD<sup>base</sup><sub>i</sub> &nbsp;&nbsp; and &nbsp;&nbsp; LGD<sup>stress</sup><sub>i</sub> ≥ LGD<sup>base</sup><sub>i</sub></span></Formula>
      <p>This is decision architecture, not a universal optimisation prescription. Real portfolios may require concentration, fairness, liquidity, service-capacity and regulatory constraints as well as uncertainty-aware objectives.</p>

      <h3>Champion and challenger</h3>
      <p>The production strategy is the <strong>champion</strong>; an alternative boundary, zone width, price or limit rule is a <strong>challenger</strong>. Compare them through controlled evidence on approval, expected and realised loss, realised default, EV, segment impact and operational workload. Where live experimentation is inappropriate, shadow evaluation and back-testing can still expose consequences. Strategy should evolve through governed evidence, not arbitrary threshold movement.</p>
    </section>

    <section id="decision-engine">
      <h2>From cut-off strategy to decision engine</h2>
      <p>Cut-off economics are only as credible as the PDs entering them. A ranking-only model can support relative thresholding, but economic interpretation requires meaningful probability calibration. If PD is understated, apparently profitable approvals can be illusory. Entimema&apos;s analysis of <Link href="/resources/pd-model-ranking-calibration">PD model ranking versus calibration</Link> develops that distinction.</p>
      <p>The upstream chain matters. <Link href="/resources/logistic-regression-credit-risk-scorecards">Logistic regression engineering</Link> constructs a reproducible model signal; calibration establishes probability meaning; strategy determines action. The PD must also predict a clearly defined event, as explained in <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>, over a horizon compatible with the economics, as developed in <Link href="/resources/pd-model-observation-performance-windows">Observation and Performance Windows</Link>. Earlier still, Weight of Evidence and Information Value can help structure risk drivers where that methodology is appropriate. Together: <strong>risk drivers → predictive structure → model → PD → cut-off → decision</strong>.</p>
      <p>A spreadsheet can simulate a boundary. Production lending must execute the full logic consistently, explainably and at scale.</p>
      <Formula label="Modern credit-decision function"><span>D<sub>i</sub> = f(Risk<sub>i</sub>, Affordability<sub>i</sub>, Policy<sub>i</sub>, Fraud<sub>i</sub>, Economics<sub>i</sub>, RiskAppetite)</span></Formula>
      <Formula label="Decision and offer outputs"><span>D<sub>i</sub> ∈ &#123;Approve, Review, Reject&#125; &nbsp;&nbsp; + &nbsp;&nbsp; (Limit<sub>i</sub>, Price<sub>i</sub>, Terms<sub>i</sub>)</span></Formula>
      <ResourceFigure label="Decision engine architecture combining probability of default, affordability, policy, pricing, limits and risk appetite into approve, modify, review or decline actions." caption="A production decision engine operationalises the strategy; it does not reduce the strategy to a score comparison.">
        <div className={styles.engine}><div>{["PD", "Affordability", "Policy rules", "Pricing", "Limits", "Risk appetite"].map(item => <span key={item}>{item}</span>)}</div><b>↓</b><strong>DECISION ENGINE</strong><b>↓</b><footer>APPROVE <i>·</i> MODIFY <i>·</i> REVIEW <i>·</i> DECLINE</footer></div>
      </ResourceFigure>
      <div className={styles.layers}>{[["01", "Risk", "What is the probability and severity of loss?"], ["02", "Economics", "Does return compensate for expected risk and cost?"], ["03", "Policy", "Is the transaction permissible and within appetite?"], ["04", "Action", "Approve, modify, review or decline."]].map(([n,title,text]) => <article key={n}><small>{n}</small><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      <KeyObservation title="The Entimema decision architecture"><p><strong>Risk → Economics → Policy → Action.</strong> Cut-off design is where statistical risk measurement becomes economic decision architecture.</p></KeyObservation>
      <ResourceFigure label="Nine-stage Entimema decision architecture from model through recalibration." caption="Model development is one component of the lending decision system; portfolio outcomes return evidence to strategy and calibration.">
        <div className={styles.decisionArchitecture}>{["Model","Calibration","Economics","Constraints","Strategy","Decision","Portfolio outcome","Monitoring","Recalibration"].map((stage,index)=><span key={stage}><b>{String(index+1).padStart(2,"0")}</b><strong>{stage}</strong></span>)}</div>
      </ResourceFigure>
    </section>

    <section id="monitoring">
      <h2>Monitor the decision strategy as a system</h2>
      <p>A cut-off is a governed production policy, not a one-time model setting. Monitoring must connect leading decision signals to seasoned outcomes:</p>
      <div className={styles.monitor}>{[
        ["Volume", "Applications · approval · decline · review"], ["Risk", "Observed bad rate · expected and realised loss · PD distribution"], ["Economics", "Revenue · margin · expected value · risk-adjusted return"], ["Strategy", "Overrides · cut-off population · review performance · segments"], ["Stability", "Vintages · macro conditions · model calibration"],
      ].map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      <h3>Model stability and strategy stability are different controls</h3>
      <p>A technically unchanged model can support a changing effective strategy when applicant mix, acquisition channel, manual overrides, pricing, policy rules or limit assignment move. Monitor approval and review rates, booked volume, score and PD distributions, overrides, realised default, expected versus realised loss, vintage development, <Link href="/resources/roll-rate-analysis-migration-matrices">roll rates</Link>, <Link href="/resources/early-warning-indicators-credit-risk">early-warning indicators</Link> and profitability together. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> tests the model; strategy monitoring tests the decisions built around it.</p>

      <h3>The Entimema strategy diagnostic</h3>
      <p>A simple 2×2 can sharpen diagnosis before detailed analysis:</p>
      <div className={styles.matrix} aria-label="Conceptual matrix of portfolio risk and economic value"><div className={styles.yAxis}>PORTFOLIO RISK <span>HIGH</span><span>LOW</span></div><div className={styles.matrixGrid}><article><strong>High risk / Low value</strong><span>Natural decline candidate</span></article><article><strong>High risk / High value</strong><span>Pricing, limit or appetite question</span></article><article><strong>Low risk / Low value</strong><span>Economically weak despite low risk</span></article><article><strong>Low risk / High value</strong><span>Strong acceptance zone</span></article></div><footer>LOW ← ECONOMIC VALUE → HIGH</footer></div>
      <p>The matrix is conceptual; it cannot replace account economics, constraints or causal diagnosis. Its value is preventing “low risk” from becoming synonymous with “good business.”</p>

      <p>The resolution is not a universally “correct” PD threshold. It is a transparent, economically coherent and monitored architecture that states which risks are acceptable, on which terms, under which constraints—and how the institution will know when that judgement no longer holds.</p>
    </section>

    <section id="failures">
      <h2>Fifteen failure modes that weaken cut-off design</h2>
      <ResourceTable caption="Why apparently precise boundaries fail in practice" headers={["Failure mode","Mechanism of failure"]} rows={[
        ["KS or Gini chooses the cut-off","Ranking diagnostics contain no revenue, loss or capacity economics"],
        ["Score treated as value","A rank carries no intrinsic PD, margin or decision meaning"],
        ["Calibration ignored","Expected loss and marginal economics inherit biased PD"],
        ["Average economics optimised","A profitable existing book conceals a destructive marginal band"],
        ["Rejected-population bias ignored","Historical policy truncates observable outcomes"],
        ["LGD or EAD ignored","Default likelihood is mistaken for loss consequence"],
        ["Funding and operating cost omitted","Gross revenue overstates economic contribution"],
        ["Capital constraints ignored","Positive expected value can still be inadmissible"],
        ["Risk appetite ignored","Policy intent never reaches application-level action"],
        ["One cut-off across incompatible populations","Different calibration and economics are forced into one boundary"],
        ["Cut-offs changed without governance","Short-term volume actions create untracked portfolio consequences"],
        ["Manual overrides ignored","The effective strategy differs from the coded strategy"],
        ["Approval optimised alone","Volume is detached from seasoned loss and value"],
        ["Historical economics assumed stable","PD, LGD, funding, demand and pricing regimes move"],
        ["Treated as only a modelling problem","Business constraints, operations and accountability disappear"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Strategy Optimisation Agent can support strategy decisions—not make adverse decisions autonomously</h2>
      <p>A future <strong>Credit Strategy Optimisation Agent</strong> could ingest scores and calibrated PDs, combine realised performance, calculate approval distributions and expected economics, compare current and alternative cut-offs, stress PD/LGD assumptions, identify marginal bands, monitor strategy drift and prepare champion/challenger evidence for human review.</p>
      <p>Its role is <strong>strategy analytics + simulation + monitoring + decision support</strong>. Deterministic calculations, governed assumptions, permissions and human approval should remain explicit. It must not autonomously make individual adverse lending decisions.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice connects model evidence, cut-off design, portfolio strategy and risk-appetite translation. <Link href="/services/decision-automation">Decision Automation</Link> turns the approved strategy into a controlled, traceable execution architecture. Ongoing monitoring creates the recurring value: a boundary that was defensible last year is not automatically defensible under today&apos;s mix, economics and constraints.</p>
    </section>
  </>;
}
