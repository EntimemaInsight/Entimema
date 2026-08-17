import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./logistic-regression-scorecard.module.css";

export const logisticRegressionScorecardSections = [
  { id: "modelling-chain", label: "The controlled modelling chain" },
  { id: "mathematical-model", label: "From log-odds to PD" },
  { id: "borrower-example", label: "A reproducible borrower" },
  { id: "model-development", label: "Develop and validate" },
  { id: "ranking-calibration", label: "Ranking is not calibration" },
  { id: "scorecard", label: "From model to scorecard" },
  { id: "production", label: "Production implementation" },
  { id: "parity", label: "Development–production parity" },
  { id: "failure-monitoring", label: "Failure and monitoring" },
  { id: "decision-automation", label: "From PD to decision" },
] as const;

const borrowerRows = [
  ["Debt-service-to-income", "47.0%", "40%–50%", "0.4200", "1.1500", "0.483000"],
  ["Recent delinquency", "One 30-day event", "1 event in 6 months", "0.6500", "1.4000", "0.910000"],
  ["Revolving utilisation", "82.0%", "75%–90%", "0.5100", "0.9000", "0.459000"],
  ["Credit history", "3.5 years", "2–5 years", "0.1800", "0.7000", "0.126000"],
];

const failureRows = [
  ["Target leakage / wrong observation date", "Inflated apparent separation", "Unavailable future information enters scoring", "Weak applicants are misclassified when the signal disappears"],
  ["Unstable bins or wrong WoE map", "Relationships and contributions move", "Equivalent values receive different features", "PD, price or cut-off treatment becomes arbitrary"],
  ["Multicollinearity / excessive selection", "Unstable signs, errors and coefficients", "Small data changes move outputs", "Reasons and risk ordering become fragile"],
  ["Sampling prevalence treated as portfolio prevalence", "Intercept and probability level are wrong", "Raw output is labelled final PD", "Expected loss and pricing are misstated"],
  ["Version or transformation mismatch", "Approved model is not the executed model", "Stale coefficients, bins or units run silently", "Applicants receive decisions from an ungoverned model"],
  ["Missing or silent feature failure", "Contribution is replaced or omitted", "Fallback differs from approved logic", "Risk can be systematically under- or overstated"],
];

export default function LogisticRegressionScorecardArticle() {
  return <div className={styles.articleBody}>
    <p className={styles.lead}>A credit scorecard is not the regression equation. It is a controlled translation of borrower information into an estimate of risk that must survive validation, implementation and real credit decisions.</p>
    <p>A logistic regression can be statistically valid yet unusable as a credit-risk system. A poorly defined target, leaked feature, unstable coefficient, incorrect probability transform or changed production bin can each preserve the appearance of a model while breaking its meaning. The engineering problem is not merely to estimate coefficients. It is to make the entire modelling chain reproducible.</p>
    <KeyObservation title="The completion criterion"><p><strong>Model development is complete only when the analytical logic can be reproduced consistently outside the development environment.</strong></p></KeyObservation>

    <section id="modelling-chain">
      <h2>The controlled modelling chain starts before regression</h2>
      <p>The target must first say who can default, what default means and within which future horizon it is observed. Entimema&apos;s work on <Link href="/resources/pd-default-definition-target-construction">default definition</Link> establishes the event boundary; <Link href="/resources/pd-model-observation-performance-windows">observation and performance windows</Link> establishes the prediction clock. Regression inherits both. It cannot correct them.</p>
      <div className={styles.frameworkWrap}><EntimemaFramework title="Credit scorecard engineering chain" description="Methodology becomes an executable risk signal through a sequence of controlled translations." steps={["Default definition", "Observation / performance architecture", "Development population", "Raw variables", "Binning / WoE", "Feature matrix", "Logistic regression", "Log-odds", "Raw PD", "Ranking", "Calibration", "Scorecard", "Production", "Monitoring"]} /></div>
      <h3>What the model actually receives</h3>
      <p>Source systems must reproduce a historical snapshot at a declared observation date. Eligibility rules then select the correct unit—borrower or facility—and predictor extraction must use information available at that instant. Multiple facilities require an explicit aggregation or row-selection rule; duplicated borrowers cannot quietly become independent observations. Exclusions, missing values, category definitions and temporal joins are model specifications, not data-cleaning footnotes.</p>
      <p>The resulting feature matrix needs lineage back to source fields, extract timestamp, rules and model population. A categorical value not known in development needs an approved fallback. A currency, percentage or day count needs a stable unit. Rebuilding the same snapshot should produce the same eligible rows and features.</p>
      <ResourceFigure label="End-to-end analytical engineering chain distinguishing data, transformations, model, probability and decision stages." caption="The scorecard is a controlled chain. Each colour identifies a different type of artefact and control responsibility.">
        <div className={styles.chain}>{[
          ["data", "DATA", "Borrower data"], ["data", "DATA", "Observation snapshot"], ["transform", "TRANSFORM", "Feature engineering"], ["transform", "TRANSFORM", "Binning / WoE"], ["transform", "TRANSFORM", "Feature vector"],
          ["model", "MODEL", "Logistic regression"], ["model", "MODEL", "Log-odds"], ["probability", "PROBABILITY", "Raw PD"], ["probability", "PROBABILITY", "Calibration / final PD"], ["decision", "DECISION", "Score / risk grade"],
          ["decision", "DECISION", "Decision engine"], ["decision", "DECISION", "Approve / review / decline"],
        ].map(([tone, label, name]) => <div className={styles[tone]} key={name}><span>{label}</span><strong>{name}</strong></div>)}</div>
      </ResourceFigure>
    </section>

    <section id="mathematical-model">
      <h2>The model translates predictors into log-odds, then probability</h2>
      <Formula label="Binary default target"><span className={styles.formulaLine}>Yᵢ ∈ &#123;0, 1&#125;, where Yᵢ = 1 means default within the defined performance window</span></Formula>
      <p>For borrower <em>i</em>, <strong>PDᵢ = P(Yᵢ = 1 | Xᵢ)</strong>: the conditional probability of default given the controlled predictor vector. Odds express default probability relative to survival probability, <strong>PD/(1−PD)</strong>. Log-odds place that positive ratio on an unbounded additive scale:</p>
      <Formula label="Logistic regression and linear predictor"><span className={styles.formulaLine}>log(PDᵢ / (1 − PDᵢ)) = zᵢ = β₀ + Σⱼ βⱼXⱼᵢ</span></Formula>
      <Formula label="Logistic probability transformation"><span className={styles.formulaLine}>PDᵢ = 1 / (1 + e⁻ᶻⁱ)</span></Formula>
      <p>The <strong>intercept β₀</strong> is baseline log-odds when every encoded predictor equals zero. Each <strong>coefficient βⱼ</strong> changes log-odds for a one-unit change in predictor Xⱼ while other included predictors remain fixed. Its sign gives the conditional direction; it is not a constant percentage-point change in PD because the logistic curve is nonlinear. The final transform constrains the output to zero through one.</p>
      <p>The conditional odds multiplier is <strong>e<sup>βⱼ</sup></strong>. In a WoE model, that statement applies to a one-unit change in WoE—not directly to one percentage point of utilisation. Interpretation also depends on convention. This article defines <strong>WoE = ln(distribution of defaults / distribution of non-defaults)</strong>, so positive WoE denotes a riskier bin and positive coefficients preserve that direction. Reversing the WoE convention should reverse expected coefficient signs.</p>
      <h3>Why logistic regression fits traditional credit scorecards</h3>
      <p>Its binary target, explicit probability link, additive contributions, transparent coefficients and deterministic implementation suit validation, governance and score conversion. Risk committees can challenge driver direction; validators can reproduce contributions; engineers can execute the same arithmetic. That does not make it universally superior. Additivity in log-odds can miss interactions, estimates can be unstable under correlated predictors, extrapolation can be unsafe and changing populations can invalidate relationships. Interpretability is earned by coherent design, not conferred by an algorithm name.</p>
      <h3>WoE makes structure inspectable—not automatically valid</h3>
      <Formula label="WoE logistic scorecard"><span className={styles.formulaLine}>logit(PDᵢ) = β₀ + β₁WoE(X₁ᵢ) + … + βₖWoE(Xₖᵢ)</span></Formula>
      <p>Binning can represent nonlinear raw relationships, isolate missing values and turn deployment into explicit range-to-value mappings. WoE aligns bins to target separation and makes contributions easier to inspect. Yet WoE transformation does not make a predictor automatically suitable for regression. Stability, redundancy, economic interpretation, leakage, interactions, coefficient behaviour and production availability still need challenge.</p>
    </section>

    <section id="borrower-example">
      <h2>One borrower, reproduced from raw values to raw PD</h2>
      <p>Consider a hypothetical applicant scored by an original four-variable model. No proprietary data is used. Every WoE and coefficient below is illustrative; the declared positive-risk WoE convention applies.</p>
      <ResourceTable caption="Raw values, bins, WoE values, coefficients and reconciled contributions" headers={["Predictor", "Raw value", "Assigned bin", "WoE", "β", "β × WoE"]} rows={borrowerRows} />
      <p>The estimated intercept is <strong>β₀ = −3.200000</strong>. Individual contributions retain six decimal places:</p>
      <div className={styles.calculation}>
        <div><header>INTERCEPT</header><strong>−3.200000</strong></div><div><header>DSTI</header><span>1.1500 × 0.4200</span><strong>+0.483000</strong></div><div><header>DELINQUENCY</header><span>1.4000 × 0.6500</span><strong>+0.910000</strong></div><div><header>UTILISATION</header><span>0.9000 × 0.5100</span><strong>+0.459000</strong></div><div><header>HISTORY</header><span>0.7000 × 0.1800</span><strong>+0.126000</strong></div><div className={styles.total}><header>LINEAR PREDICTOR</header><span>−3.200000 + 1.978000</span><strong>z = −1.222000</strong></div><div className={styles.total}><header>RAW PD</header><span>1 / (1 + e¹·²²²)</span><strong>PD = 0.227584</strong></div>
      </div>
      <p>Using the unrounded linear predictor, <strong>e<sup>1.222</sup> ≈ 3.39406</strong>, so <strong>PD = 1/(1 + 3.39406) = 0.227584</strong>, or <strong>22.7584%</strong>. A production golden-borrower test should retain the approved coefficient precision and tolerance rather than copy a displayed rounded number.</p>
      <p>Recent delinquency contributes <strong>+0.910000</strong>, the largest upward movement in log-odds. All four positive coefficients mean riskier positive-WoE bins raise conditional odds under this convention. These contributions describe the model&apos;s relative structure; they do not prove causality. Nor does 22.7584% automatically represent the portfolio&apos;s final PD: sampling and the development-period default level may require a separately approved calibration layer.</p>
    </section>

    <section id="model-development">
      <h2>Variable selection is controlled judgement, not a leaderboard</h2>
      <p>Candidate selection should combine univariate discrimination and Information Value with business meaning, missingness, operational availability, leakage review, correlation, coefficient stability, significance and out-of-time behaviour. Automatic stepwise selection can optimise noise and repeatedly test the development sample until chance structure looks intentional. Statistical significance cannot rescue an economically incoherent model.</p>
      <h3>Multicollinearity destabilises the explanation</h3>
      <p>Utilisation, revolving balance and minimum-payment burden may encode the same behaviour. Together they can produce unstable coefficients, unexpected signs, inflated standard errors and sensitivity to minor sample changes. Correlation matrices and VIF help, but no mechanical threshold answers whether variables are economically redundant. Compare nested models and coefficient direction across development, validation, time and segments. A sign reversal may reveal correlation or a suppressor effect, not a newly discovered economic law.</p>
      <h3>Statistical significance is not economic materiality</h3>
      <p>With enough rows, a tiny effect can produce <strong>p &lt; 0.05</strong> while adding negligible separation. A conceptually strong driver can look unstable in a limited default sample. Selection therefore requires <strong>Statistics + Economics + Stability + Implementation</strong>. Committee-ready evidence should show not just a p-value, but incremental contribution, plausible direction, temporal behaviour and dependable availability at decision time.</p>
      <h3>Logistic regression is linear in log-odds, not raw economics</h3>
      <p>Binning and WoE can represent nonlinear raw effects. Explicit interaction terms or segmentation can represent conditional effects—for example, high utilisation may be materially more dangerous when recent delinquency is present. Interactions need prior rationale, sufficient observations, stability assessment and executable definitions. Uncontrolled interaction mining simply enlarges the space in which development noise can win.</p>
      <h3>Defaults are scarce—and sampling changes prevalence</h3>
      <p>Oversampling defaults, undersampling non-defaults or weighting observations can support estimation and learning from scarce events. The estimation population then differs from the calibration population. A sampling strategy can help model estimation while simultaneously changing observed default frequency. Unless the method explicitly corrects that shift, especially its effect on baseline odds, raw logistic output must not be labelled portfolio-level calibrated PD.</p>
      <h3>Validation needs time, not only a random split</h3>
      <p>Use distinct development, validation and out-of-time samples. Random splitting tests repeatability within a mixed historical population; it can distribute the same macro regime, policy, channels and products across both sides. Credit portfolios evolve through economic conditions, underwriting, product design, channel mix, customer mix and data collection. Out-of-time evidence asks whether relationships travel. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> helps identify when cohort behaviour reflects changing origination conditions rather than a stable model relationship.</p>
    </section>

    <section id="ranking-calibration">
      <h2>A model can rank correctly and estimate the wrong probability</h2>
      <p>ROC, AUC, Gini and KS are useful only insofar as they answer an economic question: <strong>does the model consistently assign higher estimated risk to borrowers who subsequently default?</strong> They assess ordering or separation, not whether 5% predictions default at approximately 5%.</p>
      <ResourceTable caption="Two models can have comparable discrimination but different decision usefulness" headers={["Model", "Risk ordering", "Probability level", "Implication"]} rows={[["A", "Excellent", "Materially too low", "Useful ordering; unreliable expected loss, price and limits"], ["B", "Similar", "Aligned to comparable realised outcomes", "Ordering and probability level support risk-sensitive decisions"]]} />
      <p>This is the central transition from discrimination to calibration. Pricing, expected loss, provisioning, limits and risk-adjusted return require meaningful probability levels. Entimema&apos;s analysis of <Link href="/resources/pd-model-ranking-calibration">PD Model Ranking vs Calibration</Link> develops that distinction; here it becomes an implementation requirement: <strong>Borrower characteristics → contributions → log-odds → raw probability → calibration → final PD.</strong></p>
    </section>

    <section id="scorecard">
      <h2>Score scaling changes representation, not borrower risk</h2>
      <p>A traditional scorecard may express the same model on a points scale. If odds mean <strong>non-default/default</strong>, a generic increasing-goodness convention is:</p>
      <Formula label="Generic score scaling"><span className={styles.formulaLine}>Score = Offset + Factor × ln(Odds), where Factor = PDO / ln(2)</span></Formula>
      <p>The <strong>base score</strong> is assigned at declared <strong>base odds</strong>. <strong>Points to double the odds (PDO)</strong> defines how far score moves when good-to-bad odds double. With base score 500 at good:bad odds of 20:1 and PDO 40, Factor = 40/ln(2) = <strong>57.7078</strong> and Offset = 500 − 57.7078×ln(20) = <strong>327.1229</strong>. At 40:1, score is 540. Reversing the odds definition or desired score direction changes signs; it does not change PD.</p>
      <p>Score and PD are different representations. Production documentation must state odds convention, offset, factor, rounding and whether calibration occurs before or after a score-to-PD mapping. An incorrectly signed scaling formula can make the riskiest borrower appear best even while the underlying regression is correct.</p>
    </section>

    <section id="production">
      <h2>The analytical model becomes executable through explicit artefacts</h2>
      <p>The deployed chain is <strong>Source data → feature pipeline → transformation rules → WoE mapping → coefficients → linear predictor → logistic transform → calibration layer → PD → score / risk grade → decision engine</strong>. Each stage needs deterministic transformations, schema validation, explicit missing and unknown-category behaviour, timestamp consistency, feature availability checks, audit logs and fallback logic.</p>
      <p>A production model version must bind <strong>target definition, population rules, feature definitions, bin maps, coefficients, calibration, score scaling and decision interface</strong>. Changing any one can change the effective model. Version identity should appear in every scored record with input timestamp, feature values, mapped bins, contributions, raw PD, calibrated PD and decision response sufficient for reconstruction.</p>
      <DecisionImplication><p>The approved implementation should produce the same result as the approved analytical model for the same equivalent input. “Approximately the same model” is not a controlled production state.</p></DecisionImplication>
    </section>

    <section id="parity">
      <h2>Development–production parity is a model-risk control</h2>
      <Formula label="Parity requirement"><span className={styles.formulaLine}>f<sub>development</sub>(X) = f<sub>production</sub>(X)</span></Formula>
      <p>Equivalent input must yield equivalent bins, WoE values, contributions, raw PD, calibrated PD and score within approved numerical tolerances. Different missing rules, rounding, category maps, data types, units, coefficients, bins or versions break parity. A statistically perfect model can therefore fail operationally.</p>
      <ResourceFigure label="Development and production implementations joined by parity tests and fixed golden borrowers." caption="Golden borrowers turn an approved analytical expectation into an executable contract across environments.">
        <div className={styles.parity}><article><h3>Development</h3><ol><li>Model specification</li><li>Transformation rules</li><li>Approved coefficients</li><li>Expected outputs</li></ol></article><div><strong>PARITY TESTS<br/>/ GOLDEN BORROWERS</strong></div><article><h3>Production</h3><ol><li>Live equivalent data</li><li>Same transformations</li><li>Same model version</li><li>Equivalent outputs</li></ol></article></div>
      </ResourceFigure>
      <div className={styles.testing}>{[
        ["01", "Unit tests", "Test calculations, parsing and each transformation."], ["02", "Feature tests", "Verify bin assignment and WoE mapping."], ["03", "Model tests", "Reconcile contributions, z and logistic output."], ["04", "Golden borrowers", "Fix known inputs and approved expected outputs."], ["05", "Boundary tests", "Test values below, at and above every threshold."], ["06", "Missing-value tests", "Exercise explicit null, blank and unknown behaviour."], ["07", "End-to-end tests", "Compare analytical and production results across a representative fixture set."],
      ].map(([n,title,copy]) => <div key={n}><span>{n}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      <p>This is not ordinary software QA alone. A mapping error changes the statistical model being used and therefore belongs to model-risk control, validation evidence and release approval.</p>
    </section>

    <section id="failure-monitoring">
      <h2>Failure propagates from statistics to real decisions</h2>
      <ResourceTable caption="Selected scorecard failure pathways" headers={["Failure", "Statistical consequence", "Production consequence", "Decision consequence"]} rows={failureRows} />
      <p>Other recurring failures include coefficient sign instability, overfitting, incorrect probability code, wrong score scaling and stale coefficients. Controls should fail visibly: a silent default value is not resilient fallback unless its statistical treatment, allowed use and escalation were approved.</p>
      <h3>Monitor the whole chain after deployment</h3>
      <div className={styles.layers}>{[
        ["Input", "Missingness, schema errors, feature distributions"], ["Transformation", "Bin and WoE distributions, unexpected categories"], ["Model", "Score and PD distributions, ranking, calibration"], ["Portfolio", "Default rate, vintages, population drift"], ["Decision", "Approval, decline, review and cut-off effects"],
      ].map(([title,copy]) => <div key={title}><strong>{title}</strong><p>{copy}</p></div>)}</div>
      <p>A stable final score can conceal a broken feature whose effect is offset elsewhere. Monitoring must connect layer signals and retain model version and policy chronology. Entimema&apos;s <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> develops this diagnostic architecture from input integrity through realised portfolio and decision effects.</p>
    </section>

    <section id="decision-automation">
      <h2>The PD model supplies risk; it does not make the credit decision</h2>
      <p>The next layer is <strong>PD model → decision strategy → decision engine → automated credit decision</strong>. The engine may combine calibrated PD with affordability, policy rules, exposure, price, limits, fraud indicators and manual-review rules. Keeping those layers separate preserves a crucial distinction: changing a cut-off or affordability rule changes strategy; changing a bin map or calibration changes the effective model.</p>
      <p>A credible future workflow is a <strong>PD Model Implementation &amp; Parity Monitor</strong>. It could repeatedly compare development and production outputs, run golden borrowers, validate WoE maps, detect version or feature-pipeline changes, monitor missingness and score distributions, flag unexpected PD movement and prepare diagnostics for human model owners. This is an automation opportunity, not a claim that such an Entimema agent currently exists.</p>
      <div className={styles.bridge}><article><span>ENGINEERING PROBLEM → MODEL RISK</span><h3>Turn approved methodology into a controlled implementation.</h3><p>Entimema Credit Risk connects target architecture, modelling evidence, validation and production controls to the decision use.</p><Link href="/services/credit-risk">Explore Credit Risk consulting →</Link></article><article><span>RISK SIGNAL → DECISION IMPACT</span><h3>Connect model output to governed decision automation.</h3><p>Decision Automation provides the architectural context for combining model signals with policy and operational rules.</p><Link href="/services/decision-automation">Explore Decision Automation →</Link></article></div>
      <KeyObservation title="The engineering resolve"><p><strong>A scorecard becomes a decision component only when target, data, transformations, coefficients, calibration, score scaling and production execution remain one governed model.</strong> The regression equation is central—but it is not the system.</p></KeyObservation>
    </section>
  </div>;
}
