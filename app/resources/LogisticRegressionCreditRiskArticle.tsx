import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./logistic-regression-credit-risk.module.css";

export const logisticRegressionCreditRiskSections = [
  { id: "link", label: "From outcome to log-odds" },
  { id: "coefficients", label: "Coefficients and conventions" },
  { id: "examples", label: "Original logistic examples" },
  { id: "estimation", label: "Likelihood, rarity and sampling" },
  { id: "specification", label: "Non-linearity and diagnostics" },
  { id: "validation", label: "Ranking and calibration" },
  { id: "scaling", label: "Score scaling and points" },
  { id: "borrower", label: "End-to-end borrower example" },
  { id: "strategy", label: "From score to decision" },
  { id: "production", label: "Production implementation" },
  { id: "monitoring", label: "Monitoring and intervention" },
  { id: "nbfi", label: "Non-bank lenders" },
  { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Scorecard Development Agent" },
] as const;

const architecture = ["Borrower data","Binning / WoE","Linear predictor","Log-odds","PD","Odds","Score scaling","Credit score","Calibration","Decision strategy","Production monitoring"];

export default function LogisticRegressionCreditRiskArticle() {
  return <>
    <p className="resource-lead"><em>Logistic regression remains powerful in credit risk not because it is mathematically sophisticated, but because it creates a disciplined bridge between borrower characteristics, odds of default, explainable ranking and production decisions.</em></p>
    <KeyObservation><p><strong>The logistic equation is only the middle of the scorecard lifecycle.</strong></p></KeyObservation>

    <section id="link">
      <h2>A binary outcome needs a probability architecture that survives production</h2>
      <Formula label="Governed target and model objective"><span>Y<sub>i</sub> = 1 Default / Bad; &nbsp; Y<sub>i</sub> = 0 Non-default / Good<br />Estimate P(Y<sub>i</sub>=1 | X<sub>i</sub>)</span></Formula>
      <p>The target inherits the institution&apos;s <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>, observation point, performance horizon and maturity rules. <Link href="/resources/pd-model-observation-performance-windows">Observation and Performance Windows</Link> determine which features and outcomes are legitimate. A technically correct estimator cannot rescue a contaminated target.</p>
      <p>A linear probability model, <strong>P(Y=1|X)=β<sub>0</sub>+β<sub>1</sub>X</strong>, can predict below zero or above one, imposes a raw linear probability effect and has heteroskedastic errors. Its limitation motivates a bounded link rather than a detour into ordinary regression.</p>
      <h3>Odds make the convention explicit</h3>
      <Formula label="Default odds"><span>Odds<sub>bad</sub> = PD / (1−PD)</span></Formula>
      <p>At PD=10%, default-to-survival odds are 0.10/0.90=0.1111, or approximately <strong>1:9 Bad:Good</strong>. Credit scorecards often use the reciprocal <strong>Good:Bad</strong> odds. Every implementation must name the convention and preserve it through scaling and interpretation.</p>
      <Formula label="Logit and linear predictor"><span>logit(PD<sub>i</sub>) = ln(PD<sub>i</sub>/(1−PD<sub>i</sub>)) = z<sub>i</sub><br />z<sub>i</sub> = β<sub>0</sub> + Σ<sub>j</sub>β<sub>j</sub>X<sub>ij</sub></span></Formula>
      <Formula label="Return from log-odds to probability"><span>PD<sub>i</sub> = 1 / (1 + exp(−z<sub>i</sub>))</span></Formula>
      <p>The probability is nonlinear and bounded, while effects remain additive in log-odds. Operationally, that means variable contributions can be reconciled before conversion to PD and points.</p>
      <ResourceFigure label="Entimema logistic scorecard architecture." caption="The estimator connects evidence to risk; calibration, strategy and monitoring complete the lending system."><div className={styles.architecture}>{architecture.map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
    </section>

    <section id="coefficients">
      <h2>Coefficients describe conditional odds—not percentage-point probability changes</h2>
      <p>β<sub>j</sub> is the change in log default odds for a one-unit increase in X<sub>j</sub>, holding other model variables constant. Exponentiating gives the odds ratio:</p>
      <Formula label="Odds ratio"><span>OR<sub>j</sub> = e<sup>βj</sup>; &nbsp; β<sub>j</sub>=0.30 ⇒ OR≈1.35</span></Formula>
      <p>The example means approximately 35% higher default odds per unit under the specified scale and model—not a 35% increase in PD. The probability effect depends on the borrower&apos;s starting risk and all other contributions.</p>
      <h3>WoE sign conventions must agree with the target</h3>
      <Formula label="Traditional WoE logistic specification"><span>logit(PD<sub>i</sub>) = β<sub>0</sub> + Σ<sub>j</sub>β<sub>j</sub>WoE<sub>ij</sub></span></Formula>
      <p>Under <strong>WoE=ln(DistGood/DistBad)</strong>, higher WoE indicates better relative credit quality. With Y=1=Bad, a standalone coefficient should generally be negative: increasing “good” evidence should lower bad log-odds. Multivariate correlation can complicate signs, so investigate rather than mechanically constrain them. Reversing the target, reversing WoE or reversing only the interpretation creates a production error.</p>
      <p><Link href="/resources/weight-of-evidence-information-value-credit-scoring">Weight of Evidence &amp; Information Value</Link> develops binning, stability and univariate evidence. WoE controls raw non-linearity and extremes; it does not validate the multivariate specification.</p>
    </section>

    <section id="examples">
      <h2>A single WoE predictor makes every transformation visible</h2>
      <Formula label="Illustrative DTI model"><span>logit(PD) = −2.80 − 0.75 × WoE<sub>DTI</sub></span></Formula>
      <ResourceTable caption="Original single-variable transformations" headers={["DTI WoE","Log-odds z","Bad odds","PD"]} rows={[
        ["1.20 — stronger quality","−3.700","0.0247","2.41%"],
        ["0.00 — neutral","−2.800","0.0608","5.73%"],
        ["−1.00 — weaker quality","−2.050","0.1287","11.41%"],
      ]}/>
      <p>A positive +0.75 coefficient under this target and WoE convention would predict higher bad odds for better-quality bins. That is not impossible in a correlated model, but it is a sign anomaly demanding investigation.</p>
      <h3>A four-variable model decomposes borrower risk</h3>
      <Formula label="Original multivariate model"><span>z = −3.20 − 0.65WoE<sub>DTI</sub> − 0.55WoE<sub>Util</sub> − 0.80WoE<sub>History</sub> − 0.35WoE<sub>Tenure</sub></span></Formula>
      <p>For any borrower, <strong>Contribution<sub>ij</sub>=β<sub>j</sub>X<sub>ij</sub></strong> and <strong>z<sub>i</sub>=β<sub>0</sub>+ΣContribution<sub>ij</sub></strong>. That additive audit trail becomes points, diagnostics and candidate reason-code evidence.</p>
    </section>

    <section id="estimation">
      <h2>Maximum likelihood estimates probabilities—not accuracy at an arbitrary threshold</h2>
      <Formula label="Borrower likelihood"><span>P(Y<sub>i</sub>=y<sub>i</sub>) = PD<sub>i</sub><sup>yi</sup>(1−PD<sub>i</sub>)<sup>1−yi</sup></span></Formula>
      <Formula label="Log-likelihood"><span>ℓ(β) = Σ<sub>i</sub>[y<sub>i</sub>ln(PD<sub>i</sub>) + (1−y<sub>i</sub>)ln(1−PD<sub>i</sub>)]</span></Formula>
      <p>Estimation chooses coefficients that make the observed pattern of Goods and Bads most probable under the assumed functional form. It does not maximise classification accuracy. Credit risk normally needs ranking, probability estimation and strategy simulation—not one binary classification threshold.</p>
      <h3>Rare defaults expose the weakness of accuracy</h3>
      <p>At a 2% bad rate, predicting Good for every account achieves 98% accuracy and zero useful discrimination. AUC/Gini, KS, calibration and proper scoring rules address more relevant properties.</p>
      <h3>Oversampling changes the probability level</h3>
      <Formula label="Case-control sampling"><span>P<sub>sample</sub>(Y=1) ≠ P<sub>population</sub>(Y=1)</span></Formula>
      <p>Bad oversampling can support coefficient estimation and ranking, but raw model probabilities reflect altered prevalence. Use a documented intercept correction or recalibration to the intended population; do not report development-sample PDs as production probabilities.</p>
    </section>

    <section id="specification">
      <h2>Apparent simplicity can conceal specification failure</h2>
      <p>A raw continuous X assumes a linear effect on log-odds unless transformed. Binning/WoE, splines, polynomial terms and domain transformations can represent non-linearity. Interactions such as <strong>Utilisation × Tenure</strong> may capture genuine conditional risk, but an interaction zoo built to optimise in-sample metrics weakens stability and explainability.</p>
      <ResourceTable caption="Core coefficient diagnostics" headers={["Issue","Observed symptom","Practitioner response"]} rows={[
        ["Multicollinearity","Sign reversal, large standard errors, unstable coefficients","Correlation, VIF where useful, variable families and resampling stability"],
        ["Complete / quasi separation","Perfect or near-perfect class separation; |β| grows without bound","Investigate tiny groups, leakage, merging, penalisation or variable removal"],
        ["Weak temporal stability","β<sub>j,dev</sub> and β<sub>j,oot</sub> change sign or magnitude","Revisit bins, population, interactions and structural change"],
        ["P-value selection","Sample-specific significance drives the specification","Combine incrementality, stability, economics, governance and availability"],
      ]}/>
      <Formula label="Conceptual coefficient drift"><span>Δβ<sub>j</sub> = β<sub>j,oot</sub> − β<sub>j,dev</sub></span></Formula>
      <p>A model can rank well while individual coefficients are unstable and explanations are economically incoherent. Random development/validation splitting tests sample generalisation; out-of-time evidence challenges temporal robustness.</p>
      <h3>Regularisation and ML belong in the challenger set</h3>
      <Formula label="Ridge and Lasso penalties"><span>Ridge: λΣβ<sub>j</sub><sup>2</sup> &nbsp;&nbsp; Lasso: λΣ|β<sub>j</sub>|</span></Formula>
      <p>Shrinkage can control correlated predictors and overfitting, but changes coefficient and selection interpretation. Machine learning can add nonlinear and interaction power. Compare all challengers through incremental decision value, stability, explainability, operational cost and governance—not novelty.</p>
    </section>

    <section id="validation">
      <h2>Ranking and calibration answer different model-risk questions</h2>
      <ResourceTable caption="Separate validation dimensions" headers={["Dimension","Question","Evidence"]} rows={[
        ["Ranking","Who is relatively riskier?","ROC, AUC, Gini, KS and segment ordering"],
        ["Calibration","What absolute risk does the rank represent?","Observed/predicted rates, intercept, slope and curves"],
      ]}/>
      <Formula label="Gini"><span>Gini = 2AUC − 1</span></Formula>
      <p>A logistic model can discriminate well and still be badly calibrated. If predicted PD is 5% for a coherent group, approximately 5% should realise the governed default event over the matching horizon under the intended interpretation. <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link> develops these cases in depth.</p>
      <Formula label="Brier score"><span>BS = (1/N)Σ<sub>i</sub>(PD<sub>i</sub>−Y<sub>i</sub>)<sup>2</sup></span></Formula>
      <Formula label="Log loss"><span>LogLoss = −(1/N)Σ<sub>i</sub>[Y<sub>i</sub>ln(PD<sub>i</sub>)+(1−Y<sub>i</sub>)ln(1−PD<sub>i</sub>)]</span></Formula>
      <p>Brier score evaluates probabilistic error while combining discrimination and calibration characteristics. Log loss penalises confident wrong predictions heavily. Neither is a universal decision rule; interpret them with ranking, calibration, stability and portfolio use.</p>
      <EntimemaFramework title="Development → Validation → Out-of-Time" description="Random holdout tests repeatability; OOT evidence asks whether the model travels forward." steps={["Development specification","Validation challenge","Untouched OOT period","Ranking","Calibration","Stability","Use conclusion"]}/>
    </section>

    <section id="scaling">
      <h2>Score scaling turns odds into a controlled operating language</h2>
      <p>Using Good:Bad odds so higher score means lower risk:</p>
      <Formula label="Good:Bad score scale"><span>Score = Offset + Factor × ln(Odds<sub>good:bad</sub>)</span></Formula>
      <p>For base score 600, base Good:Bad odds 20:1 and 50 Points to Double the Odds:</p>
      <Formula label="Scale constants"><span>Factor = 50/ln(2) = 72.135<br />Offset = 600 − 72.135ln(20) = 383.904</span></Formula>
      <ResourceTable caption="PDO arithmetic verification" headers={["Score","Good:Bad odds","Meaning"]} rows={[["600","20:1","Base"],["650","40:1","Odds double"],["700","80:1","Odds double again"]]}/>
      <p>Because log Good:Bad odds = −log Bad:Good odds = −z, the equivalent model mapping is <strong>Score=Offset−Factor×z</strong>.</p>
      <Formula label="Variable points under this convention"><span>Points<sub>jk</sub> = −Factor × β<sub>j</sub>WoE<sub>jk</sub></span></Formula>
      <p>The intercept becomes base points: <strong>Offset−Factor×β<sub>0</sub></strong>. It can be held once or distributed across variables, but development and production must use identical architecture. A score is a monotonic transformation of odds, not PD without its scale and calibration mapping.</p>
      <h3>Recover PD from a score</h3>
      <Formula label="Score to PD under Good:Bad convention"><span>ln(Odds<sub>good:bad</sub>) = (S−Offset)/Factor<br />PD = 1/(1+Odds<sub>good:bad</sub>)</span></Formula>
      <p>At S=600, odds are exp((600−383.904)/72.135)=20, so PD=1/(1+20)=<strong>4.76%</strong>.</p>
    </section>

    <section id="borrower">
      <h2>An original end-to-end borrower from raw data to production score</h2>
      <p>Consider a fictional scorecard developed on 200,000 consumer-loan applications. One applicant maps to these governed bins and Good/Bad WoE values:</p>
      <ResourceTable caption="Borrower data, transformations, coefficients and contributions" headers={["Variable","Raw value / bin","WoE","β","β×WoE","Score points"]} rows={[
        ["DTI","58% / 50–65%","−0.734","−0.65","+0.477","−34.4"],
        ["Utilisation","82% / 75–90%","−0.400","−0.55","+0.220","−15.9"],
        ["Bureau history","Recent serious delinquency","−0.900","−0.80","+0.720","−51.9"],
        ["Relationship tenure","4+ years","+0.300","−0.35","−0.105","+7.6"],
      ]}/>
      <Formula label="Linear predictor and PD"><span>z = −3.200 + 0.477 + 0.220 + 0.720 − 0.105 = −1.888<br />PD = 1/(1+e<sup>1.888</sup>) = 13.15%</span></Formula>
      <Formula label="Odds and scaled score"><span>Good:Bad odds = (1−0.1315)/0.1315 = 6.60:1<br />Score = 383.904 + 72.135ln(6.60) ≈ 520</span></Formula>
      <p>Base points are 383.904−72.135(−3.20)=614.736. Adding the rounded variable points gives approximately 520. Rounding explains small display differences; the governed engine should calculate with full precision and round only at the specified stage.</p>
      <p>This chain—<strong>Borrower data → Bin → WoE → Contribution → Logit → PD → Odds → Score</strong>—makes statistical and operational reconciliation possible. Largest adverse contributions can inform explanations, but a mathematical contribution is not automatically a legally valid customer-facing reason code.</p>
    </section>

    <section id="strategy">
      <h2>The logistic model produces risk information, not the lending decision</h2>
      <ResourceFigure label="From logistic model to lending action." caption="Calibration and economics stand between statistical ranking and an accountable decision."><div className={styles.decision}>{["Logistic model","Score","Calibration","Economics","Cut-off","Decision"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
      <p><Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link> connects PD and score to expected loss, revenue, affordability, policy, risk appetite and marginal economics. The same score can support different actions under different products or constraints.</p>
      <p>A model fitted only on historical accepts estimates relationships within a selected population. If policy expands beyond that region, <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> explains the overlap and identifiability problem. Logistic regression does not remove selection bias.</p>
    </section>

    <section id="production">
      <h2>Production replication is part of model validity</h2>
      <ResourceTable caption="Implementation checklist" headers={["Layer","Required reconciliation"]} rows={[
        ["Inputs","Source, timing, units, currency, percentage/decimal convention"],
        ["Transformation","Missing rules, exact boundary inclusivity, category mapping and unseen-value fallback"],
        ["Model","WoE version, coefficients, intercept and target convention"],
        ["Scaling","Odds convention, Factor, Offset, base points and rounding stage"],
        ["Output","Total score, PD mapping, reason-code inputs and version lineage"],
      ]}/>
      <Formula label="Implementation parity"><span>Score<sub>development</sub> = Score<sub>production</sub> within documented tolerance</span></Formula>
      <p>Annual versus monthly income, percentage versus decimal, or one currency versus another can destroy model meaning without any software exception. New categorical values need a governed Other bucket, fallback or model exception—never arbitrary WoE.</p>
      <p>Rounding each variable&apos;s points can differ from rounding only the final total, especially at a cut-off. Test boundary records, missing values, unseen categories and exact bin edges at contribution, PD and score level.</p>
      <DecisionImplication>Version the complete transformation-and-scaling package as the model. A coefficient file alone is not a deployable scorecard.</DecisionImplication>
    </section>

    <section id="monitoring">
      <h2>Monitor who arrives and whether risk relationships still hold</h2>
      <Formula label="Two forms of drift"><span>Population drift: P<sub>t</sub>(X) changes<br />Relationship drift: P<sub>t</sub>(Y|X) changes</span></Formula>
      <p>Track score and input distributions, bin populations, missing rates, discrimination, calibration, realised bad rates, approval rates and overrides. A stable applicant population does not guarantee stable coefficients or PD relationships. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> connects these signals to investigation and action.</p>
      <p>If ranking remains useful while risk level moves, recalibration may suffice. If coefficients, variable relationships or ordering materially deteriorate, re-estimation or broader redevelopment is required. Mathematical transparency does not protect an obsolete model.</p>
    </section>

    <section id="nbfi">
      <h2>Logistic scorecards remain practical for high-volume non-bank lending</h2>
      <p>Consumer finance, fintech, digital instalments and short-tenor portfolios often need lightweight deployment, high-volume decisions and explainable logic with limited modelling resources. Logistic models provide a compact deterministic path from features to score.</p>
      <p>Rapid population drift, strategy changes, thin history and higher-risk mix increase the need for OOT testing, frequent calibration review, vintage analysis and transformation monitoring. Fast outcomes shorten feedback; they do not remove target, sample or selection risk.</p>
    </section>

    <section id="failures">
      <h2>Twenty failure modes between equation and decision</h2>
      <ResourceTable caption="Logistic scorecard failure mechanisms" headers={["Failure mode","Why it fails"]} rows={[
        ["Black-box classifier treatment","Contributions, probability meaning and use disappear"],
        ["Accuracy optimised","Class imbalance rewards useless all-Good predictions"],
        ["Odds confused with probability","Risk changes are misinterpreted"],
        ["Good:Bad / Bad:Good mixed","Score direction and PD mapping reverse"],
        ["WoE sign reversed","Coefficient meaning and points invert"],
        ["Leakage","Future information inflates performance"],
        ["Raw non-linearity ignored","Log-odds specification is wrong"],
        ["Multicollinearity","Coefficients and explanations destabilise"],
        ["Separation ignored","Sparse or leaked predictors drive extreme β"],
        ["Oversampling uncorrected","Raw PD reflects sample prevalence"],
        ["P-values select variables","Stability and economic meaning are omitted"],
        ["Gini without calibration","Ranking is mistaken for probability"],
        ["No OOT challenge","Temporal robustness remains unknown"],
        ["Scaling arithmetic wrong","Operational score no longer represents model odds"],
        ["Rounding mismatch","Boundary decisions differ across implementations"],
        ["Production bins differ","A different effective model is deployed"],
        ["Unit conversion error","Inputs move onto an alien scale"],
        ["Unseen category improvised","Arbitrary risk evidence enters production"],
        ["Score treated as decision","Economics, policy and appetite vanish"],
        ["Logistic assumed explainable","Hundreds of obscure features remain operationally opaque"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Scorecard Development Agent can automate evidence work—not borrower decisions</h2>
      <p>A future agent could fit candidate logistic models, test coefficient stability, flag sign anomalies, diagnose multicollinearity and separation, compare regularised challengers, calculate discrimination, perform OOT validation, generate score scaling, reconcile score-to-PD mapping, test implementation parity and prepare development evidence.</p>
      <p>Its role is <strong>model-development automation + diagnostics + validation support</strong>. It must not autonomously approve or reject borrowers. Human owners govern model purpose, lawful variables, target meaning, risk appetite and adverse decisions.</p>
      <p>The broader <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link> pillar connects this estimator to population, target, binning, scaling, calibration, strategy and monitoring. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice supports that lifecycle; <Link href="/services/decision-automation">Decision Automation</Link> turns approved model and policy logic into controlled execution.</p>
      <EntimemaFramework title="Practitioner decision framework" description="The logistic equation sits inside a governed lifecycle." steps={["Estimate","Interpret","Validate","Scale","Calibrate","Decide","Monitor"]}/>
    </section>
  </>;
}
