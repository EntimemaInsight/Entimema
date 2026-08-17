import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-risk-model-validation.module.css";

export const creditRiskModelValidationSections = [
  { id: "decision-fitness", label: "Begin with intended use" }, { id: "claims", label: "Claim–evidence architecture" },
  { id: "architecture", label: "Validation architecture" }, { id: "data", label: "Data, population and outcome" },
  { id: "method", label: "Methodology and variables" }, { id: "performance", label: "Ranking and calibration" },
  { id: "stability", label: "Stability and evidence graph" }, { id: "uncertainty", label: "Sensitivity and uncertainty" },
  { id: "implementation", label: "Implementation integrity" }, { id: "decision-impact", label: "Decision impact" },
  { id: "case-study", label: "End-to-end case" }, { id: "conclusion", label: "Conclusion and governance" },
  { id: "proportionality", label: "Non-bank framework" }, { id: "agent", label: "Validation Agent" },
] as const;

const domains = [
  ["01", "Intended use", "What decision, population and horizon define fitness?"], ["02", "Conceptual soundness", "Why should the design and predictors work?"],
  ["03", "Data & population", "Are lineage, availability and coverage credible?"], ["04", "Outcome architecture", "Is the target mature, consistent and decision-relevant?"],
  ["05", "Development methodology", "Are estimation, sampling and transformations defensible?"], ["06", "Discrimination", "Does ranking work, including within key segments?"],
  ["07", "Calibration", "Do predicted probabilities represent absolute risk?"], ["08", "Stability", "Do population, relationships and outputs remain applicable?"],
  ["09", "Sensitivity", "Do reasonable assumptions or stresses change the conclusion?"], ["10", "Implementation", "Does production reproduce the approved logic?"],
  ["11", "Decision impact", "How do errors change approvals, exposure and value?"], ["12", "Governance & monitoring", "Who accepts limitations, acts and keeps trust current?"],
] as const;

const evidenceRows = [
  ["Purpose", "Is use consistent with design?", "Scope, strategy and user interviews", "Use outside scope", "Restrict use"],
  ["Concept", "Is the causal story credible?", "Design rationale and challenger", "Operational proxy drives lift", "Limit or redevelop"],
  ["Data", "Are inputs reliable and timely?", "Lineage, quality and timestamp tests", "Missingness drift or leakage", "Remediate data"],
  ["Outcome", "Is the model tested against its target?", "Default and window reconstruction", "Immature or inconsistent labels", "Rebuild evidence"],
  ["Discrimination", "Does ranking work?", "AUC, Gini, KS, OOT and segments", "Ranking decline", "Diagnose or redevelop"],
  ["Calibration", "Are PDs sufficiently accurate?", "O/E, intercept, slope and curves", "Risk-level drift", "Recalibrate"],
  ["Stability", "Has applicability changed?", "PSI, characteristics and vintages", "Persistent distribution shift", "Diagnose and constrain"],
  ["Sensitivity", "Is the conclusion robust?", "Alternative assumptions and stress", "Decision flips under small change", "Add margin or remediate"],
  ["Implementation", "Is production faithful?", "Golden dataset and boundary tests", "Score or PD mismatch", "Fix deployment"],
  ["Decision", "Does error matter?", "Cut-off and economic simulation", "Material boundary impact", "Review strategy"],
  ["Governance", "Can trust be maintained?", "Owners, limitations and triggers", "Unowned residual risk", "Escalate or restrict"],
];

const failureRows = [
  ["Validation as a checklist", "Tests accumulate without a claim, dependency or decision consequence."], ["Gini-only validation", "Good ordering says nothing about PD accuracy, implementation or use."],
  ["Mechanical thresholds", "A universal cut-off hides sample, portfolio and decision context."], ["PSI treated as failure", "Distribution change is a signal to diagnose, not proof that relationships failed."],
  ["Stable ranking treated as validity", "Calibration, leakage, scope and production can still be wrong."], ["No out-of-time evidence", "Random splits can distribute one historical regime across both samples."],
  ["Lineage and leakage ignored", "A predictive field may be unavailable when the decision is made."], ["Historical selection ignored", "Accepted borrowers may not represent future applicants."],
  ["Unsupported populations ignored", "Aggregate evidence is silently extended beyond its support."], ["Implementation and boundaries ignored", "A rounding or comparison defect can change many marginal decisions."],
  ["Economic materiality ignored", "Statistical size and decision consequence are not the same object."], ["All findings treated equally", "Severity becomes detached from exposure, persistence and uncertainty."],
  ["No sensitivity or monitoring plan", "Trust is asserted without testing fragility or specifying how it expires."], ["PASS / FAIL only", "A binary label conceals limitations, conditions and required action."],
  ["Governance theatre", "Complex process without evidence ownership adds delay, not assurance."],
];

export default function CreditRiskModelValidationArticle() {
  return <>
    <p className="resource-lead"><em>Model validation is not the calculation of a collection of metrics. It is the construction of evidence that a model is conceptually sound, statistically reliable, operationally reproducible and fit for the decisions it is expected to support.</em></p>

    <section id="decision-fitness">
      <h2>A model can pass its tests and still fail its decision</h2>
      <p>Strong Gini, acceptable KS, reasonable aggregate calibration and low PSI can coexist with a wrong target, a biased development population, data leakage, a production mismatch or use outside the evidenced population. A strategy can magnify a small score error because thousands of applicants sit close to its cut-off. <strong>Passing metrics is not equivalent to validating a model.</strong></p>
      <p>The first question is therefore not “what is the AUC?” It is <strong>what decision is this model supposed to support?</strong> Application underwriting, behavioural assessment, collections prioritisation, pricing, limits, portfolio monitoring and impairment place different weight on ranking, probability accuracy, horizon and operational reliability. The same model can be credible for one use and unsuitable for another.</p>
      <Formula label="Fitness is conditional on intended use"><span className={styles.formulaLine}>Fitness = f(Model, Population, Horizon, Decision)</span></Formula>
      <p>A model is never valid in the abstract. Its evidence must identify the population, product, channel, observation point, prediction horizon, outcome and downstream strategy. Those elements form a <strong>decision contract</strong>: the boundary within which the conclusion has meaning.</p>
      <KeyObservation title="Decision fitness"><p><strong>Is the evidence strong enough for this model to influence the decision we intend to make?</strong> Predictive performance matters, but only alongside calibration, stability, implementation integrity, decision materiality and uncertainty.</p></KeyObservation>
    </section>

    <section id="claims">
      <h2>Validation is a claim–evidence problem</h2>
      <p>Development asks, “can we build a useful model?” Independent validation asks, “what could make us wrong?” Independence is not reporting lines alone. It is objective reconstruction, alternative explanations, adversarial testing and willingness to narrow use when evidence is weak.</p>
      <ResourceFigure label="Entimema claim to conclusion validation framework" caption="Every conclusion should preserve the chain from the claim being made to the challenge applied to its evidence."><div className={styles.claimFlow}>{["CLAIM", "EVIDENCE", "CHALLENGE", "CONCLUSION"].map((item) => <span key={item}>{item}</span>)}</div></ResourceFigure>
      <div className={styles.claimGrid}>
        <article><span>CLAIM 01</span><h3>The model ranks borrowers by risk</h3><p>AUC, Gini, KS, grade ordering, segments and OOT periods—challenged for selection, concentration and deterioration.</p></article>
        <article><span>CLAIM 02</span><h3>Predicted probabilities represent risk</h3><p>O/E, intercept, slope, curves, grades and vintages—challenged for target consistency, maturity and aggregation.</p></article>
        <article><span>CLAIM 03</span><h3>Relationships remain applicable</h3><p>Population, characteristic, relationship and output stability—challenged for policy, channel and macro change.</p></article>
        <article><span>CLAIM 04</span><h3>Production reproduces development</h3><p>Golden records, boundaries, nulls, scaling and versions—challenged for units, rounding and unseen values.</p></article>
        <article><span>CLAIM 05</span><h3>The model supports sensible decisions</h3><p>Cut-off, exposure, loss and value simulations—challenged for boundary density, overrides and asymmetric error costs.</p></article>
      </div>
      <p>A metric without a claim is an observation. A claim without challenge is advocacy. A conclusion without a decision consequence is documentation. This framework explains what proposition is supported, what could defeat it, and what use remains justified.</p>
    </section>

    <section id="architecture">
      <h2>The Entimema Model Validation Architecture</h2>
      <p>The domains follow the causal chain from intended decision to continuing trust. They are not independent boxes: an upstream error changes every downstream test. Excellent calibration against the wrong outcome is not reassuring, and perfect production parity cannot legitimise an incoherent model.</p>
      <div className={styles.domainGrid}>{domains.map(([n, name, question]) => <article key={name}><span>{n}</span><h3>{name}</h3><p>{question}</p></article>)}</div>
      <ResourceFigure label="Entimema end-to-end model validation architecture" caption="The architecture moves from intended decision through evidence and challenge to a governed conclusion, then closes the trust loop through monitoring.">
        <ol className={styles.architectureFlow}>{["Intended Decision", "Conceptual Soundness", "Data & Population", "Outcome Architecture", "Development Methodology", "Discrimination", "Calibration", "Stability", "Sensitivity", "Implementation", "Decision Impact", "Governance Conclusion", "Monitoring"].map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol>
      </ResourceFigure>
    </section>

    <section id="data">
      <h2>Concept, data and outcome define what performance means</h2>
      <h3>Conceptual soundness</h3>
      <p>Ask why the variables predict risk, why the model family fits the purpose, why the horizon matches the decision, and what economic mechanism connects inputs with outcome. A field may be predictive because it encodes a temporary manual process, historical approval policy or post-decision event rather than borrower risk. Statistical success can be conceptually fragile.</p>
      <h3>Lineage and point-in-time availability</h3>
      <p>Reconstruct <strong>Source system → Extraction → Transformation → Development dataset → Model input</strong>, including ownership, timestamps, joins, filters, duplicates, missing values and historical availability.</p>
      <Formula label="Point-in-time predictor availability"><span className={styles.formulaLine}>AvailableTime(X<sub>j</sub>) ≤ DecisionTime</span></Formula>
      <p>If that condition fails, leakage may exist. “Days to first payment” could look highly predictive in an application model precisely because it is observed after lending. No metric rescues that design.</p>
      <h3>Population, sampling and selection</h3>
      <p>Compare P<sub>development</sub>(X) with P<sub>production</sub>(X) across product, customer, channel, geography, policy and time. Validate inclusions, exclusions, development, validation and OOT samples, repeated borrowers, stratification and bad oversampling. If P<sub>sample</sub>(Y=1) differs from P<sub>population</sub>(Y=1), ranking may survive while probability calibration requires correction.</p>
      <p>Where outcomes are observed mainly for historical accepts, P(X,Y | A=1) may not represent future applicants. <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> explains selective observation. Reconstruct historical policy, rejection patterns and overlap; neither demand reject inference automatically nor accept its assumptions without challenge.</p>
      <h3>Default and time architecture</h3>
      <p>Validate event, horizon, cure and re-default, restructuring, write-off, indeterminate outcomes and consistency. The <Link href="/resources/pd-default-definition-target-construction">default definition</Link> determines what is estimated; <Link href="/resources/pd-model-observation-performance-windows">observation and performance windows</Link> determine when inputs and outcomes may be observed. Recent cohorts with immature outcomes cannot provide complete evidence merely because they are current.</p>
    </section>

    <section id="method">
      <h2>Challenge development methodology, not only output</h2>
      <p>For important predictors inspect business meaning, availability, missingness, stability, transformation, direction and redundancy. In scorecards, reproduce bin populations, zero-count treatment, smoothing, monotonicity, rare bins, in-time and OOT IV, and WoE stability. <Link href="/resources/weight-of-evidence-information-value-credit-scoring">WoE and Information Value</Link> shows why mechanical IV thresholds cannot replace reasoning.</p>
      <Formula label="Logistic PD model specification"><span className={styles.formulaLine}>logit(PD) = β<sub>0</sub> + Σ β<sub>j</sub>X<sub>j</sub></span></Formula>
      <p>For logistic models, challenge functional form, coefficient signs, interactions, multicollinearity, separation and coefficient stability. The <Link href="/resources/logistic-regression-credit-risk-production-scorecard">Logistic Regression</Link> pillar and <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link> provide the modelling context.</p>
      <p>A challenger asks whether a simpler or different model could perform equally well: a reduced or regularised logistic model, alternative binning, calibration or justified ML challenger. It need not replace the champion. It tests whether conclusions depend excessively on one architecture and whether complexity earns its operational cost.</p>
    </section>

    <section id="performance">
      <h2>Ranking and calibration are different claims</h2>
      <p>Discrimination asks whether higher-risk borrowers receive riskier rankings. AUC can be interpreted as the probability that a randomly selected bad receives a riskier ordering than a good; Gini = 2AUC − 1. KS identifies the maximum separation between cumulative good and bad score distributions:</p>
      <Formula label="Kolmogorov–Smirnov statistic"><span className={styles.formulaLine}>KS = max<sub>s</sub> |F<sub>G</sub>(s) − F<sub>B</sub>(s)|</span></Formula>
      <p>These measures are aggregate and sample-dependent. They do not establish calibration, may hide segment weakness and relate only indirectly to economic value. Compare development, OOT and production by product, channel, vintage, customer type and risk band. A strong aggregate Gini can conceal failure in the channel driving growth.</p>
      <h3>Calibration tests absolute risk</h3>
      <p>Compare average predicted PD with observed default, O/E, curves, intercept and slope. A common diagnostic fits logit(Y) = α + β logit(PD), where α ≈ 0 and β ≈ 1 under the relevant sampling and target interpretation. Inspect score bands, products, channels and vintages: aggregate fit may come from offsetting errors.</p>
      <ResourceTable caption="Ranking × calibration diagnostic matrix" headers={["Ranking", "Calibration", "Interpretation", "Likely response"]} rows={[
        ["Strong", "Strong", "Model broadly performs for the evidenced use.", "Continue bounded use and monitoring."], ["Strong", "Weak", "Ordering survives but absolute risk is wrong.", "Diagnose drift; consider recalibration."],
        ["Weak", "Strong aggregate", "Average fit hides inadequate ordering.", "Diagnose segments or redevelop."], ["Weak", "Weak", "Relative and absolute risk evidence are poor.", "Restrict use and assess redevelopment."],
      ]}/>
      <p><Link href="/resources/pd-model-ranking-calibration">PD Ranking & Calibration</Link> develops the distinction; <Link href="/resources/model-calibration-drift-pd-risk-level">Model Calibration Drift</Link> addresses changing risk levels. Universal decline thresholds and single p-values cannot replace sample-aware judgement.</p>
    </section>

    <section id="stability">
      <h2>Stability concerns three different objects</h2>
      <div className={styles.triad}><article><span>POPULATION</span><strong>P<sub>t</sub>(X)</strong><p>Who arrives and how input distributions change.</p></article><article><span>RELATIONSHIP</span><strong>P<sub>t</sub>(Y|X)</strong><p>Whether predictors retain their relationship with outcome.</p></article><article><span>MODEL OUTPUT</span><strong>P<sub>t</sub>(Score)</strong><p>How scores and PDs move through time.</p></article></div>
      <p><Link href="/resources/population-stability-index-credit-risk-model-monitoring">Population Stability Index</Link> summarizes movement as Σ(A<sub>j</sub>−E<sub>j</sub>) ln(A<sub>j</sub>/E<sub>j</sub>). <strong>PSI is evidence of distribution change, not proof of model failure.</strong> Inspect characteristic populations, missing rates, WoE and bad rates because a stable score can conceal offsetting input changes.</p>
      <p>Track Metric<sub>t</sub> through time: level, trend, volatility, structural breaks and persistence tell different stories. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> adds the cohort view, separating recent underwriting, policy and macro effects.</p>
      <h3>Conclusions emerge from an evidence graph</h3>
      <p>PSI↑ alone does not establish failure. PSI↑ + Gini↓ + calibration slope↓ + deteriorating vintages is stronger because independent signals converge on reduced applicability.</p>
      <ResourceTable caption="When validation metrics disagree" headers={["Scenario", "Evidence", "Interpretation", "Action"]} rows={[
        ["A", "High PSI; stable Gini and calibration", "Population moved; observed performance remains credible.", "Identify drivers and intensify monitoring."],
        ["B", "Low PSI; falling Gini", "Stable marginals can coexist with relationship drift.", "Inspect conditional bad rates, segments and lineage."],
        ["C", "Stable Gini; poor calibration", "Ranking survives while absolute risk shifts.", "Assess recalibration."],
        ["D", "Strong metrics; production mismatch", "The used model is not the validated implementation.", "Remediate deployment first."],
      ]}/>
      <DecisionImplication><p><strong>Converging evidence changes confidence.</strong> Thresholds flag observations; the evidence graph explains whether they support, contradict or qualify decision fitness.</p></DecisionImplication>
    </section>

    <section id="uncertainty">
      <h2>Sensitivity asks whether conclusions survive reasonable alternatives</h2>
      <Formula label="Decision under an assumption set"><span className={styles.formulaLine}>Decision(θ), where θ represents modelling and strategy assumptions</span></Formula>
      <p>Change binning, missing treatment, calibration, sample period, reject-inference assumptions, stress PD and cut-off within defensible ranges. If small changes in θ produce large model or decision changes, the system is fragile even when its central estimate looks acceptable.</p>
      <p>Stress testing goes beyond multiplying every PD. Ask whether ranking survives, calibration remains interpretable, borrowers move outside development support and strategy remains viable. PD<sup>stress</sup> &gt; PD<sup>base</sup> is an expectation, not a complete stress architecture.</p>
      <div className={styles.uncertaintyGrid}>{[["Parameter uncertainty", "Coefficients and calibration estimates vary."], ["Data uncertainty", "Samples, labels and measurements are imperfect."], ["Model-form uncertainty", "Alternative specifications imply different risk."], ["Population uncertainty", "Future borrowers differ from history."], ["Decision uncertainty", "The economic cost of errors is estimated."]].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>State which sources were tested, which remain unresolved, and whether the decision has sufficient margin for error. Pretending uncertainty disappeared is information loss.</p>
    </section>

    <section id="implementation">
      <h2>The approved and production models must be identical</h2>
      <p>Reconcile variables, units, bin boundaries, missing rules, WoE, coefficients, intercept, calibration, scaling, rounding and PD mapping. For identical inputs, Score<sub>dev</sub> and Score<sub>prod</sub>, then PD<sub>dev</sub> and PD<sub>prod</sub>, should match within documented tolerances.</p>
      <h3>A golden dataset makes parity executable</h3>
      <p>Store controlled records with known raw inputs, transformations, scores, PDs and grades. Cover typical, low-risk, high-risk, missing, malformed, unseen, out-of-range and exact-boundary cases. Run them against every release and preserve model, code and data versions.</p>
      <Formula label="Boundary testing for every bin boundary b"><span className={styles.formulaLine}>b − ε &nbsp; | &nbsp; b &nbsp; | &nbsp; b + ε</span></Formula>
      <p>Undefined values must never fall silently into an arbitrary branch. <Link href="/resources/score-scaling-points-to-double-odds-credit-scores">Score Scaling & PDO</Link> requires reconciliation of Base Score, Base Odds, PDO, odds convention, Factor, Offset, point contributions and rounding. A correct PD model with incorrect scaling still makes wrong decisions.</p>
    </section>

    <section id="decision-impact">
      <h2>Validate the system that changes the decision</h2>
      <ResourceFigure label="Model to portfolio outcome decision chain" caption="Strategy translates estimation error into portfolio consequence."><div className={styles.claimFlow}>{["MODEL", "STRATEGY", "DECISION", "PORTFOLIO OUTCOME"].map((item) => <span key={item}>{item}</span>)}</div></ResourceFigure>
      <p>For cut-off c, simulate c−Δ, c and c+Δ. Measure approval, defaults, exposure, expected loss and value. <Link href="/resources/credit-risk-cut-off-strategy">Credit Risk Cut-Off Strategy</Link> provides the economic architecture; validation asks whether plausible model or implementation errors change its result.</p>
      <h3>Decision density makes small errors material</h3>
      <Formula label="Conceptual decision sensitivity relationship"><span className={styles.formulaLine}>DecisionSensitivity ∝ f<sub>S</sub>(c) = DensityNearCutoff</span></Formula>
      <p>If many applicants sit near the threshold, a one-point rounding difference changes thousands of outcomes. Error is not equally expensive everywhere. A PD error on a small exposure far from a boundary may matter little; the same error on a large exposure at the boundary may be critical. Apply <strong>decision-weighted materiality</strong>.</p>
      <p>Where relevant, test expected loss, margin, funding, capital, acquisition and collections cost—not to turn validation into profitability modelling, but to establish whether errors matter economically. Analyse overrides by direction, reason, segment and outcome; they may reveal model limitations or operational mistrust and also create selection effects.</p>
      <Formula label="Finding materiality is multidimensional"><span className={styles.formulaLine}>Materiality = f(Model Impact, Decision Impact, Exposure, Persistence, Uncertainty)</span></Formula>
    </section>

    <section id="case-study">
      <h2>A fictional validation: strong ranking, qualified use</h2>
      <p>Northstar Consumer Finance receives 300,000 unsecured-loan applications. Its logistic scorecard uses eight predictors, a 12-month default target and three years of history. It supports straight-through approval at higher scores, manual review around the boundary and decline below it.</p>
      <div className={styles.caseGrid}>
        <article><h3>Discrimination</h3><ul><li>Development Gini: 51%</li><li>OOT Gini: 49%</li><li>Current Gini: 48%</li><li>Grade ordering preserved</li></ul><p>Ranking remains strong and broadly stable; no universal threshold is invoked.</p></article>
        <article><h3>Calibration</h3><ul><li>Predicted PD: 4.2%</li><li>Observed default: 5.1%</li><li>O/E: 1.21</li><li>Slope: 0.91</li></ul><p>The model moderately underpredicts risk, concentrated in the riskiest grades.</p></article>
        <article><h3>Stability and segments</h3><ul><li>Score PSI: 0.18</li><li>Partner share: 9% → 27%</li><li>Partner Gini: 34%</li><li>Recent vintages deteriorate</li></ul><p>The evidence graph localises concern rather than declaring global failure.</p></article>
        <article><h3>Implementation and decision</h3><ul><li>One PD-to-score rounding mismatch</li><li>Occurs around cut-off 612</li><li>8,400 cases within ±2 points</li><li>1,130 decisions would differ</li></ul><p>A small numerical defect is material because decision density is high.</p></article>
      </div>
      <p>The mature conclusion is not “passed.” It is: <strong>ranking remains fit for core-channel underwriting; recalibration and rounding remediation are required before unrestricted continued use; the partner channel requires restricted use, enhanced monitoring and targeted redevelopment analysis.</strong></p>
    </section>

    <section id="conclusion">
      <h2>The conclusion should describe usable trust</h2>
      <ResourceTable caption="Validation evidence matrix" headers={["Domain", "Question", "Evidence", "Potential finding", "Decision consequence"]} rows={evidenceRows}/>
      <p>Findings may be Observation, Minor, Material or Critical Limitation—or use the institution&apos;s convention. Terminology matters less than connecting severity to decision impact, evidence strength and exposure. A technically interesting issue may be immaterial; a small implementation defect may be critical when repeated across thousands of decisions.</p>
      <p>Replace bare PASS / FAIL with <strong>fit for intended use</strong>, <strong>fit subject to limitations</strong>, <strong>recalibration required</strong>, <strong>remediation required</strong>, <strong>restricted use</strong> or <strong>redevelopment required</strong>. Every limitation needs an owner, action, due date, acceptance authority and closure evidence.</p>
      <h3>Monitoring belongs in the conclusion</h3>
      <p>Specify Gini, calibration, PSI, score and characteristic distributions, approvals, overrides, vintages and cut-off outcomes. Initial, periodic, event-driven and redevelopment validation differ; cadence follows complexity, materiality and change. Population, product, strategy, source, default-definition or macro changes can trigger renewed challenge.</p>
      <p><Link href="/resources/pd-model-monitoring">Model monitoring</Link> provides continuous evidence; validation is the periodic or triggered deep challenge. The cycle is <strong>Validation → Monitoring requirements → Production evidence → Next validation</strong>. Audit may address wider governance and compliance; validation focuses on technical fitness without insisting on rigid organisational boundaries.</p>
      <p>A strong record lets another practitioner reconstruct what was tested, why, on which data and assumptions, what was found, what uncertainty remains and what decision followed. Name the model owner, validator, decision authority, remediation owner and escalation path.</p>
      <ResourceTable caption="Failure modes that weaken validation" headers={["Failure mode", "Why it fails"]} rows={failureRows}/>
    </section>

    <section id="proportionality">
      <h2>Non-bank lenders need proportional rigour, not borrowed bureaucracy</h2>
      <p>Consumer finance, fintech, digital and instalment lenders may have smaller teams, faster policy cycles and thinner histories. They need not imitate a global bank whose model inventory differs. They still need evidence around target, population, ranking, calibration, stability, implementation and decision consequence.</p>
      <KeyObservation title="Proportionality principle"><p><strong>Validation depth should be proportional to model complexity, portfolio materiality and decision risk—not organisational prestige.</strong></p></KeyObservation>
      <div className={styles.layerGrid}>{[["01", "Definition", "Population, target, observation point and horizon."], ["02", "Performance", "Ranking and calibration in material segments."], ["03", "Stability", "Population, variables, score, relationships and vintages."], ["04", "Implementation", "Development–production reconciliation and boundaries."], ["05", "Decision", "Approval, cut-off, exposure and loss impact."], ["06", "Monitoring", "Recurring evidence, triggers, owners and escalation."]].map(([n,a,b]) => <article key={a}><span>{n}</span><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>This framework is lightweight because it removes ceremony, not integrity. A small team can execute it with controlled data, reproducible calculations, a limitations register and an accountable decision meeting.</p>
    </section>

    <section id="agent">
      <h2>The Credit Model Validation Agent should assemble evidence—not approve models</h2>
      <p>A future agent could ingest documentation, reconstruct populations, reproduce AUC/Gini/KS and calibration diagnostics, calculate PSI, compare vintages and segments, test coefficient and WoE stability, run golden-dataset reconciliation, probe boundaries, simulate cut-off sensitivity, identify contradictions and draft cited workpapers for human review.</p>
      <ResourceFigure label="Credit risk model lifecycle agent architecture" caption="Specialist agents form a controlled lifecycle; final acceptance remains a governed human decision."><div className={styles.agentFlow}>{["SCORECARD DEVELOPMENT AGENT", "MODEL VALIDATION AGENT", "STABILITY & DRIFT MONITORING AGENT", "PD CALIBRATION & DRIFT AGENT", "HUMAN DECISION AUTHORITY"].map((item, index) => <span className={index === 1 ? styles.agentNode : index === 4 ? styles.humanNode : ""} key={item}>{item}</span>)}</div></ResourceFigure>
      <p>Its role is <strong>validation automation + evidence assembly + challenge support + documentation</strong>. It must not autonomously approve production. Periodic validation, accumulating monitoring evidence, recalibrations and changes create a durable recurring workflow without transferring authority to an agent.</p>
      <p>The <Link href="/resources/credit-risk-model-validation-pipeline">Model Validation Pipeline</Link> shows how deterministic versioned tests produce reproducible evidence. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects independent validation, PD review, monitoring and recalibration with protected decisions; <Link href="/services/decision-automation">Decision Automation</Link> bridges governed evidence to traceable recurring workflows.</p>
      <KeyObservation title="Resolve"><p>Validation quality is not the number of tests completed. It is the strength, independence and convergence of evidence supporting a particular model, population, horizon and decision—and the clarity with which weak evidence changes use.</p></KeyObservation>
    </section>
  </>;
}
