import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./woe-information-value.module.css";

export const woeInformationValueSections = [
  { id: "binning", label: "Binning creates the structure" },
  { id: "woe", label: "What WoE measures" },
  { id: "example", label: "Original DTI example" },
  { id: "iv", label: "What IV measures" },
  { id: "fragility", label: "Zero counts, rare bins and missingness" },
  { id: "monotonicity", label: "Monotonicity and automation" },
  { id: "stability", label: "Time, vintage and segment stability" },
  { id: "model", label: "Multivariate model value" },
  { id: "drift", label: "Production drift and rebinning" },
  { id: "framework", label: "Variable assessment framework" },
  { id: "nbfi", label: "Non-bank lenders" },
  { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Scorecard Development Agent" },
] as const;

export default function WoeInformationValueArticle() {
  return <>
    <p className="resource-lead"><em>Weight of Evidence and Information Value are useful because they impose structure on messy borrower data. They become dangerous when practitioners mistake that structure for truth.</em></p>
    <KeyObservation><p><strong>Do not ask only “What is this variable&apos;s IV?” Ask what risk structure the variable reveals, how the modeller created it, and whether it will survive production.</strong></p></KeyObservation>

    <section id="binning">
      <h2>Weight of Evidence begins with a modelling decision: the bins</h2>
      <Formula label="A variable is partitioned before WoE exists"><span>B(X) ∈ &#123;b<sub>1</sub>, b<sub>2</sub>, …, b<sub>k</sub>&#125;</span></Formula>
      <p>WoE is calculated only after the analyst divides a continuous variable or groups categories. Change the boundaries and the Goods/Bads distribution changes; so do WoE and IV. <strong>WoE is partly a property of the variable and partly a property of the binning architecture chosen by the modeller.</strong></p>
      <p>Binning can capture non-linearity, isolate missingness, reduce extreme-value influence, group categories, make risk shape interpretable and support stable production rules. It also discards granularity and local structure.</p>
      <Formula label="The core binning trade-off"><span>Interpretability + Stability ↔ Information Resolution</span></Formula>
      <h3>Fine classing discovers; coarse classing decides what to preserve</h3>
      <ResourceTable caption="Two stages of scorecard binning" headers={["Stage","Purpose","Questions"]} rows={[
        ["Fine classing","Create granular initial partitions","Where do bad rates move, reverse, become sparse or expose data defects?"],
        ["Coarse classing","Combine groups into defensible production bins","Are counts, bads, risk direction, economic meaning and future stability adequate?"],
      ]}/>
      <p>Continuous variables may begin with quantiles, equal-width bands, supervised splits or domain boundaries. Categorical variables require attention to order, rare levels, high cardinality and business meaning. No method is universally best, and categories should not be combined merely because one grouping maximises IV.</p>
      <ResourceFigure label="Variable information funnel from raw data to incremental model value." caption="Each layer removes ambiguity, but each transformation can also remove genuine information."><div className={styles.funnel}>{["Raw data","Bins","Risk structure","WoE","IV","Stability","Incremental model value"].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
    </section>

    <section id="woe">
      <h2>WoE compares class distributions, not merely the bad rate inside a bin</h2>
      <Formula label="Class-conditional distributions"><span>DistGood<sub>j</sub> = Good<sub>j</sub> / ΣGood &nbsp;&nbsp; DistBad<sub>j</sub> = Bad<sub>j</sub> / ΣBad</span></Formula>
      <Formula label="Good-over-Bad convention"><span>WoE<sub>j</sub> = ln(DistGood<sub>j</sub> / DistBad<sub>j</sub>)</span></Formula>
      <p>Under this convention, positive WoE means the bin contains a greater share of all Goods than of all Bads; negative WoE means the opposite. The reverse <strong>ln(DistBad/DistGood)</strong> convention is equally workable. Consistency across target coding, coefficient direction, points and production matters more than which sign is chosen.</p>
      <Formula label="Within-bin bad rate"><span>BadRate<sub>j</sub> = Bad<sub>j</sub> / (Good<sub>j</sub> + Bad<sub>j</sub>)</span></Formula>
      <p>Bad rate describes risk among observations inside the bin. WoE locates that bin relative to the total Goods and total Bads across the sample. They usually move together, but answer different questions. WoE&apos;s connection to relative log odds helps explain its natural use in traditional logistic scorecards.</p>
    </section>

    <section id="example">
      <h2>An original Debt-to-Income WoE example</h2>
      <p>This fictional accepted-account sample contains 10,000 Goods and 1,200 Bads. The Missing group is retained because absence may represent a separate information mechanism. Percentages and WoE are rounded.</p>
      <ResourceTable caption="Synthetic DTI bin distributions, bad rates and Good/Bad WoE" headers={["DTI bin","Goods","Bads","DistGood","DistBad","Bad rate","WoE"]} rows={[
        ["<20%","2,700","90","27.00%","7.50%","3.23%","1.281"],
        ["20–35%","3,000","200","30.00%","16.67%","6.25%","0.588"],
        ["35–50%","2,300","330","23.00%","27.50%","12.55%","−0.179"],
        ["50–65%","1,200","300","12.00%","25.00%","20.00%","−0.734"],
        [">65%","500","220","5.00%","18.33%","30.56%","−1.299"],
        ["Missing","300","60","3.00%","5.00%","16.67%","−0.511"],
      ]}/>
      <Formula label="Arithmetic for the under-20% bin"><span>WoE = ln((2,700/10,000) / (90/1,200)) = ln(0.27/0.075) = 1.281</span></Formula>
      <p>The observed relationship deteriorates monotonically across known DTI bands. Missing DTI is riskier than 35–50% but less risky than 50–65%, showing why missingness should not be automatically placed at either extreme. The economic question is why DTI is missing and whether that process will persist.</p>
    </section>

    <section id="iv">
      <h2>IV aggregates separation created by this population, target, period and partition</h2>
      <Formula label="Bin contribution and total Information Value"><span>IV<sub>j</sub> = (DistGood<sub>j</sub> − DistBad<sub>j</sub>)WoE<sub>j</sub><br />IV = Σ<sub>j</sub> IV<sub>j</sub></span></Formula>
      <p>The synthetic DTI example produces total IV of approximately <strong>0.615</strong>. That describes substantial univariate separation in this constructed sample. It does not establish that DTI is lawful, stable, incremental, correctly timed or production-ready.</p>
      <p>IV measures how differently Goods and Bads are distributed across the chosen bins. It depends on the population, default definition, observation period, binning and data quality. It is not a permanent intrinsic property of “DTI”. Common weak/moderate/strong bands can be orientation aids, never laws.</p>
      <KeyObservation><p><strong>A variable does not become production-worthy because its IV is large. Extraordinary IV should trigger suspicion before admiration.</strong></p></KeyObservation>
      <p>Target leakage, later delinquency, collection activity, post-origination status, tiny cells, granular optimisation and historical policy can all generate impressive IV. A variable may describe what the previous decision strategy allowed into the portfolio rather than pure applicant risk. <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> develops that selective-observation problem.</p>
    </section>

    <section id="fragility">
      <h2>Infinite or extreme WoE is often a warning about evidence quantity</h2>
      <p>If Good<sub>j</sub>=0 or Bad<sub>j</sub>=0, raw WoE is undefined or infinite. A bin with three Goods and zero Bads can look extraordinarily protective even though its evidence is negligible.</p>
      <Formula label="Reliability is not magnitude"><span>Magnitude of WoE ≠ Reliability of WoE</span></Formula>
      <p>Possible responses include merging economically similar bins, imposing minimum observations and bads, or applying a documented continuity adjustment. Conceptually:</p>
      <Formula label="Smoothed calculation"><span>WoE<sub>j</sub> ≈ ln(((Good<sub>j</sub>+ε)/(Bad<sub>j</sub>+ε)) × C)</span></Formula>
      <p>Smoothing prevents numerical infinity; it does not manufacture evidence. Arbitrary ε can conceal structural sparsity and materially change IV. Report the adjustment, sensitivity and effective counts.</p>
      <h3>Missing values deserve causal diagnosis</h3>
      <p>Missing may mean no credit history, unavailable bureau data, a new customer, a different channel or process failure. A distinct bin can be predictive, but a model built around a temporary system defect deteriorates when operations improve. Ask not only whether missingness predicts, but why it occurs and whether its mechanism will continue.</p>
      <DecisionImplication>Every binning report should show observations, bads, missingness, boundary logic, smoothing and temporal support beside WoE and IV.</DecisionImplication>
    </section>

    <section id="monotonicity">
      <h2>Monotonicity is a governance preference, not an economic law</h2>
      <Formula label="Plausible DTI relationship"><span>DTI ↑ ⇒ Risk ↑</span></Formula>
      <p>Monotonic bad rates or WoE can improve interpretation, reduce local reversals and simplify governance. But real borrower relationships can be U-shaped, threshold-driven, segmented or interaction-dependent. Forcing monotonic bins can erase genuine structure.</p>
      <p>Automated binning may maximise IV subject to monotonicity, minimum size and maximum bins. That is a constrained in-sample optimisation, not proof of future validity. A numerically optimal split can be economically implausible, driven by one period, or unstable under a small boundary change. Compare candidate partitions out of time and prefer boundaries that production can implement and explain.</p>
    </section>

    <section id="stability">
      <h2>Stable moderate information can be more valuable than unstable high information</h2>
      <Formula label="Bin-level WoE drift"><span>ΔWoE<sub>j</sub> = WoE<sub>j,oot</sub> − WoE<sub>j,dev</sub></span></Formula>
      <p>For development, validation and out-of-time samples, compare direction, magnitude, bin rank order, population and bad rate. A high-IV variable whose strongest bin reverses risk order may be less defensible than a moderate-IV variable with consistent structure.</p>
      <ResourceTable caption="Three fictional variable profiles" headers={["Variable","Development IV","Temporal evidence","Selection implication"]} rows={[
        ["A — acquisition device signal","0.54","0.60 → 0.51 → 0.12; channel break","High separation, weak durability"],
        ["B — verified debt burden","0.24","0.23 → 0.25 → 0.22; stable bins","Moderate, repeatable evidence"],
        ["C — relationship tenure","0.07","Stable; adds value with utilisation interaction","Low standalone IV, useful incrementally"],
      ]}/>
      <p>Ranking only by IV<sub>A</sub>&gt;IV<sub>B</sub>&gt;IV<sub>C</sub> would favour the least durable variable and discard interaction value.</p>
      <h3>Test time, vintage and segment—not only one aggregate sample</h3>
      <p>Track IV<sub>t</sub>, WoE<sub>j,v</sub> and IV<sub>v</sub> across months and origination vintages. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> helps separate cohort and underwriting regimes. Repeat by product, channel, new/existing customer and relevant risk segment. Aggregate predictiveness can conceal opposite subgroup relationships—a form of Simpson&apos;s paradox.</p>
    </section>

    <section id="model">
      <h2>Univariate separation is not incremental multivariate value</h2>
      <Formula label="WoE logistic scorecard"><span>logit(PD<sub>i</sub>) = β<sub>0</sub> + Σ<sub>j</sub>β<sub>j</sub>WoE<sub>ij</sub></span></Formula>
      <p>Binning can approximate non-linearity, limit extreme-value influence and give categorical variables a common log-odds-related representation. It often supports stable coefficients, but cannot guarantee the correct logistic specification.</p>
      <p>Total debt, debt-to-income, monthly obligations and utilisation may each have respectable IV while encoding overlapping capacity information. Review correlation, variable families, coefficient stability and incremental likelihood or validation performance. A low-IV variable can matter through an economically sensible interaction: <strong>Risk=f(X,Z)</strong>, not merely f(X)+f(Z).</p>
      <p>This article is the specialist binning and screening node beneath <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>. The later multivariate stage must still govern coefficients, likelihood, interactions, calibration, stability and validation. Entimema&apos;s existing <Link href="/resources/logistic-regression-credit-risk-scorecards">logistic scorecard engineering research</Link> develops that translation.</p>
    </section>

    <section id="drift">
      <h2>Population drift and risk-relationship drift are different diagnoses</h2>
      <Formula label="Who enters a bin versus how risky the bin is"><span>P<sub>t</sub>(B<sub>j</sub>) &nbsp; versus &nbsp; P<sub>t</sub>(Y=1 | B<sub>j</sub>)</span></Formula>
      <p>More applicants can move into a high-risk bin while its WoE remains stable; the score distribution and approvals still change. Conversely, bin populations can stay stable while bad rates and WoE deteriorate. Monitor bin population, missing rate, bad rate, WoE and IV together. PSI may summarise population movement but does not diagnose relationship drift.</p>
      <p><Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> should connect these characteristic signals to ranking, calibration, overrides and strategy outcomes. Rebinning may be justified by structural population change, new categories, products or unstable economic relationships—but it changes the model&apos;s transformation and often its effective ranking. It therefore requires versioning, validation, calibration review and governance.</p>
    </section>

    <section id="framework">
      <h2>The Entimema variable assessment framework</h2>
      <div className={styles.frameworkWrap}><EntimemaFramework title="A variable must survive seven dimensions" description="IV contributes to predictive separation; it does not replace the other six tests." steps={["Predictive separation","Stability","Interpretability","Incremental value","Data reliability","Production availability","Governance"]}/></div>
      <EntimemaFramework title="Practitioner WoE / IV workflow" description="IV is one analytical step, not the selection decision." steps={["Raw variable","Data quality","Fine classing","Risk inspection","Coarse classing","WoE","IV","Stability testing","Redundancy analysis","Multivariate testing","Production review"]}/>
    </section>

    <section id="nbfi">
      <h2>WoE and IV are attractive—and especially fragile—in fast-changing non-bank portfolios</h2>
      <p>Consumer finance, digital and short-tenor lending, fintechs and other NBFIs may combine large application volumes, small modelling teams, rapid strategy changes and strong explainability needs. WoE/IV offers transparent variable diagnostics and deterministic deployment.</p>
      <p>The same speed can destabilise static bins as channels, policy, product design and applicant mix move. Use shorter stability intervals where performance matures quickly, retain strategy chronology, compare vintages and channels, and refuse apparent precision where bads per bin remain small.</p>
    </section>

    <section id="failures">
      <h2>Seventeen failure modes that turn structure into false confidence</h2>
      <ResourceTable caption="WoE and IV failure mechanisms" headers={["Failure mode","Why it fails"]} rows={[
        ["Universal IV thresholds","Context-dependent separation is treated as law"],
        ["Maximising IV only","In-sample fit replaces stability"],
        ["Too many bins","Sparse partitions overfit local noise"],
        ["Tiny high-WoE bins","Magnitude disguises weak evidence"],
        ["Zero counts ignored","Infinite estimates enter the model"],
        ["Arbitrary smoothing","A numerical fix hides structural sparsity"],
        ["Monotonicity forced","Real non-monotonic economics is erased"],
        ["Missingness mechanism ignored","Operational defects become borrower risk"],
        ["Variables selected by IV alone","Suitability and incrementality disappear"],
        ["Correlation ignored","Duplicated information destabilises coefficients"],
        ["Interactions ignored","Useful conditional signal is discarded"],
        ["Historical selection ignored","Old policy is mistaken for risk"],
        ["Post-decision leakage","Future outcomes masquerade as prediction"],
        ["OOT stability omitted","Temporary relationships reach production"],
        ["Sign convention assumed universal","Transform and points logic reverse"],
        ["Production rebinning treated casually","The effective model changes without validation"],
        ["Separation confused with meaning","A statistical pattern lacks economic credibility"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Scorecard Development Agent should accelerate evidence—not mechanically choose variables</h2>
      <p>A specialised workflow could profile variables and missingness, propose fine and supervised classing, calculate WoE and IV, diagnose zero counts, test monotonicity, compare OOT and segment stability, screen redundancy and prepare candidate-variable reports.</p>
      <p>Its role is <strong>analytical acceleration + diagnostics + evidence generation</strong>. Human modellers must judge economic meaning, lawful use, interactions, stability trade-offs and final model architecture.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice connects variable architecture to scorecard development, validation, redevelopment and production monitoring.</p>
      <KeyObservation><p><strong>WoE and IV are strongest when they make a variable&apos;s evidence easier to challenge—not when they end the challenge.</strong></p></KeyObservation>
    </section>
  </>;
}
