import Link from "next/link";
import { KeyObservation, ResourceFigure } from "./ResourceElements";
import styles from "./credit-risk-model-validation.module.css";

export const creditRiskModelValidationSections = [
  { id: "validation-question", label: "The validation question" },
  { id: "evidence-architecture", label: "Seven layers of evidence" },
  { id: "data-and-design", label: "Target, data and sample" },
  { id: "performance", label: "Performance is multidimensional" },
  { id: "challenge", label: "Stability, sensitivity and challenge" },
  { id: "implementation-use", label: "Implementation and use" },
  { id: "findings", label: "Findings, scope and remediation" },
  { id: "decision", label: "From evidence to decision" },
  { id: "automation", label: "A reproducible validation system" },
] as const;

const lifecycle = ["Purpose", "Target", "Data", "Sample", "Features", "Model", "Discrimination", "Calibration", "Stability", "Implementation", "Use", "Monitoring / validation"];
const layers = [
  ["01", "Purpose", "What decision is the model designed to support?"], ["02", "Definition", "What exactly is predicted, at what level and horizon?"],
  ["03", "Evidence", "Are data lineage and sample construction credible?"], ["04", "Structure", "Is the methodology conceptually and economically sound?"],
  ["05", "Performance", "Does it rank and estimate risk adequately and stably?"], ["06", "Implementation", "Does production reproduce the approved method?"],
  ["07", "Use", "Are decisions confined to the validated purpose and population?"],
] as const;

export default function CreditRiskModelValidationArticle() {
  return <>
    <p className="resource-lead"><em>A credit model is not validated because its AUC is high. It is validated when its design, data, assumptions, performance, stability, implementation and decision use are sufficiently understood and controlled.</em></p>

    <section id="validation-question">
      <h2>The validation question is not “does the model perform?”</h2>
      <p>A model can report strong Gini, acceptable AUC and stable historical performance—and still be dangerous. Its target may be inconsistent, predictors may contain future information, probabilities may be biased, production code may map a boundary incorrectly, or users may apply the output to a population and decision it was never designed to support. Statistical strength does not neutralise those failures; it can conceal them.</p>
      <p>Model development asks, <strong>can we build a useful model?</strong> Model validation asks a harder question: <strong>do we have sufficient evidence to trust how this model behaves, where it fails and how it should be used?</strong> Validation is therefore an independent—or sufficiently objective—challenge of conceptual design, data, methodology, assumptions, implementation, performance, stability and use. Backtesting contributes evidence; it is not the whole exercise.</p>
      <KeyObservation title="The control proposition"><p>Model risk exists when a model is statistically weak. It also exists when a statistically strong model is misunderstood, misimplemented or used outside the conditions for which it was designed. <strong>Validation is not a single test. It is an evidence architecture.</strong></p></KeyObservation>
    </section>

    <section id="evidence-architecture">
      <h2>Seven layers connect model purpose to controlled use</h2>
      <p>The Entimema validation architecture makes dependencies explicit. A failure in an upstream layer changes the meaning of downstream evidence: excellent calibration against the wrong target is not reassuring, and perfect production parity cannot legitimise an incoherent model.</p>
      <div className={styles.layerGrid}>{layers.map(([n, name, question]) => <article key={name}><span>{n}</span><h3>{name}</h3><p>{question}</p></article>)}</div>
      <p><strong>Purpose → Definition → Evidence → Structure → Performance → Implementation → Use.</strong> Monitoring forms the continuous control loop around all seven. It observes change, preserves evidence and triggers renewed challenge; it does not convert a weak layer into a sound one.</p>
      <ResourceFigure label="Credit-risk model validation lifecycle from purpose through target, data, sample, features, model, discrimination, calibration, stability, implementation and use to continuous monitoring and validation." caption="The test sequence follows the causal chain. Evidence at the end cannot repair an unchallenged premise at the beginning.">
        <ol className={styles.lifecycle}>{lifecycle.map((step, i) => <li key={step}><small>{String(i + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol>
      </ResourceFigure>
      <ResourceFigure label="Validation evidence stack combining conceptual soundness, data evidence, performance evidence, implementation evidence and use evidence into a validation conclusion." caption="A validation conclusion is a synthesis of mutually reinforcing evidence—not the output of one metric.">
        <div className={styles.evidenceStack}>{["Conceptual soundness", "Data evidence", "Performance evidence", "Implementation evidence", "Use evidence"].map((x) => <span key={x}>{x}</span>)}<b>=</b><strong>Validation conclusion</strong></div>
      </ResourceFigure>
    </section>

    <section id="data-and-design">
      <h2>Purpose, target and data determine what the metrics mean</h2>
      <h3>Begin with the decision contract</h3>
      <p>Record the intended population, product, borrower type, decision point, prediction horizon, target outcome and downstream use before evaluating performance. A ranking model may be adequate for collection prioritisation yet unsuitable for expected-loss estimation if its probability levels are not meaningful. Acceptability is purpose-dependent.</p>
      <h3>Validate the target before estimating against it</h3>
      <p>The default event, timing, borrower-versus-facility level, cure, re-default, exclusions and historical consistency must be reconstructed. As <Link href="/resources/pd-default-definition-target-construction">Default Definition: The Boundary That Shapes Every PD Model</Link> explains, target construction determines which observations become “bad”. Conceptually, <strong>Y<sup>wrong</sup> ⇒ Model<sup>wrong</sup></strong>, even when estimation is flawless.</p>
      <p>The <Link href="/resources/pd-model-observation-performance-windows">observation and performance window architecture</Link> then establishes the observation date, predictor information set, performance horizon, overlap, censoring, seasoning and temporal consistency. A predictor populated after the decision can make discrimination look exceptional while invalidating the exercise through leakage.</p>
      <h3>Reconstruct lineage, not merely completeness</h3>
      <p>For every key input, validation should trace <strong>Source → Transformation → Feature → Model</strong>: source system, extraction logic, aggregation, missing-value treatment, unit, timestamp and version. A “99% complete” field can still be wrong in unit, stale at decision time or derived differently in production.</p>
      <div className={styles.auditTable} role="table" aria-label="Data quality model risk effects"><div role="row"><b>Evidence dimension</b><b>Model-risk question</b></div>{[["Completeness & missingness","Is absence informative, selective, newly coded or silently imputed?"],["Accuracy & consistency","Do reconciliations support values and definitions across sources and periods?"],["Uniqueness","Can duplicate facilities or repeated borrowers leak across samples and distort weight?"],["Timeliness","Was the value genuinely available at the decision timestamp?"],["Coverage & outliers","Do truncation, thin history or extreme values change estimated relationships?"]].map(([a,b])=><div role="row" key={a}><strong>{a}</strong><span>{b}</span></div>)}</div>
      <h3>Challenge population and sample construction</h3>
      <p>Eligibility, exclusions, products, geography, channels, new versus existing customers, time period and rejected applications where relevant must match intended use. <strong>Population<sub>development</sub> ≠ Population<sub>production</sub></strong> creates risk without any algorithm change.</p>
      <p>Random train/validation splitting is rarely enough when the operational challenge is future portfolio behaviour. Inspect out-of-time samples, class rebalancing and its correction, repeated borrowers, temporal dependence, censoring and segment coverage. Oversampling defaults may aid estimation, but probability levels must be restored to the population base rate.</p>
      <h3>Challenge feature construction and specification</h3>
      <p>For scorecards, reproduce binning, missing bins, transformations, monotonicity, outlier handling and WoE mappings. High information value is not proof of valid predictive content: the relationship may be leakage, a transient policy artefact or unavailable operationally. The companion topic, <strong>Weight of Evidence and Information Value</strong>, should be linked when it is published; no unpublished route is invented here.</p>
      <p>Predictor selection, coefficient signs, significance, multicollinearity, interactions, economic interpretation and specification stability must cohere. <strong>A statistically significant coefficient can still be economically incoherent.</strong> The modelling chain in <Link href="/resources/logistic-regression-credit-risk-scorecards">Logistic Regression for Credit Risk Scorecards</Link> provides the relevant structural context.</p>
    </section>

    <section id="performance">
      <h2>Performance is a vector, not a trophy metric</h2>
      <p>ROC, AUC, Gini and KS address a focused question: does the model assign higher risk to borrowers who default more frequently? They do not answer whether the predicted probabilities are correct.</p>
      <div className={styles.modelCompare}><article><span>MODEL A</span><strong>48% Gini</strong><p>Probability estimates are reasonable across grades and time.</p></article><article><span>MODEL B</span><strong>55% Gini</strong><p>Risk ordering is stronger, but probability estimates materially understate default.</p></article></div>
      <p>For prioritisation, Model B&apos;s stronger ordering may be useful. For pricing, provisioning or expected loss, automatically selecting it could cause systematically wrong decisions. Intended use determines the weight assigned to each property.</p>
      <h3>Calibration is a separate claim</h3>
      <p>Compare average predicted PD with observed default, then inspect calibration intercept, slope, grade, segment and temporal calibration. The comparison must share horizon, population and target, and account for sample size and macroeconomic conditions. As <Link href="/resources/pd-model-ranking-calibration">PD Model Ranking vs Calibration</Link> develops, <strong>discrimination ≠ calibration</strong>. Formal tests can quantify uncertainty or distribution differences, but no single p-value validates the model; statistical evidence supports judgement rather than replacing it.</p>
      <div className={styles.caseGrid}><article><h3>Case 1 · Recalibration candidate</h3><ul><li>Development Gini: 52%</li><li>Out-of-time Gini: 49%</li><li>Predicted PD: 2.8%</li><li>Observed default: 4.1%</li><li>Population mix stable</li><li>Production parity correct</li></ul><p>Ranking has weakened modestly but remains credible; absolute risk is understated by 1.3 percentage points. With stable mix and correct implementation, recalibration—not automatic redevelopment—is the focused response.</p></article><article><h3>Case 2 · Structural challenge</h3><ul><li>Development Gini: 52%</li><li>Out-of-time Gini: 24%</li><li>Predicted PD: 2.8%</li><li>Observed default: 5.0%</li><li>New channel share: 12% → 46%</li><li>Utilisation relationship reverses</li></ul><p>The collapse in ranking, population shift and reversal of a key relationship challenge structure and representativeness. Moving the calibration intercept cannot restore lost ordering; segmentation or redevelopment is required.</p></article></div>
    </section>

    <section id="challenge">
      <h2>Future behaviour is the real generalisation test</h2>
      <p><strong>Performance level</strong> and <strong>performance stability</strong> are distinct. Evaluate time, vintage, product, channel, segment and macroeconomic conditions. A substantial <strong>Development → OOT</strong> test preserves temporal order and exposes underwriting, macroeconomic, channel-mix, product and data changes that a random holdout can distribute harmlessly across both samples.</p>
      <p>Population Stability Index can summarise distribution movement, but it is neither a diagnosis nor a universal decision threshold. Distinguish <strong>population drift</strong> from <strong>relationship drift</strong>: inputs can move while relationships remain useful; a superficially stable population can coexist with deteriorating predictor–outcome relationships.</p>
      <h3>Sensitivity, boundaries and stress</h3>
      <p>Change one input at a time under controlled, plausible scenarios. If utilisation rises, delinquency worsens or affordability weakens, does output move in an economically coherent direction? For every bin boundary, test a value just below, exactly at and just above the threshold. This catches artificial discontinuities, inclusive/exclusive errors and unexpected missing-value routes.</p>
      <p>Validation sensitivity is not the same as enterprise macro stress testing. Still, controlled adverse cases—default prevalence doubling, risk distribution shifting or a key predictor becoming unavailable—reveal brittleness and contingency needs. There is no single stress design suitable for every model.</p>
      <h3>Benchmark complexity</h3>
      <p>Compare the champion with a previous model, simple scorecard, segment baseline and alternative specification. A challenger must be compared on discrimination, calibration, stability, interpretability and implementation complexity—not merely lift. Similar performance with better stability, explainability and reproducibility can make the simpler model safer. <strong>Incremental complexity must earn its place.</strong></p>
    </section>

    <section id="implementation-use">
      <h2>The approved model and the used model must be the same model</h2>
      <p>For equivalent inputs, validation requires <strong>f<sub>development</sub>(X) = f<sub>production</sub>(X)</strong>. Reconcile bin mapping, WoE, coefficients, calibration, score scaling, missing values, rounding, units and model versions. This is not a clerical check: a unit conversion or boundary defect can invalidate every downstream decision while aggregate monitoring remains temporarily calm.</p>
      <h3>Golden borrowers create executable evidence</h3>
      <p>Maintain fixed cases spanning ordinary, missing, extreme and boundary conditions. Store raw inputs, transformed features, model score, PD and risk grade, then run each case through production on every release. Any mismatch requires investigation. This bridges validation to the production implementation described in the Engineering treatment of <Link href="/resources/logistic-regression-credit-risk-scorecards">logistic regression scorecards</Link>.</p>
      <h3>Decision use belongs inside validation scope</h3>
      <p>A valid probability may still be applied with the wrong cut-off, outside its segment, ignored through manual practice or used for pricing without adequate calibration. The <Link href="/resources/credit-risk-cut-off-strategy">Credit Risk Cut-Off Strategy</Link> and <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link> show why model output, policy and economics are different control layers.</p>
      <p>Analyse overrides by frequency, direction, reason, segment and eventual performance. High rates may indicate model weakness, strategy weakness, missing policy logic, poor implementation or distrust; overrides are not inherently bad. Their evidence must explain whether expert judgement adds information or merely creates uncontrolled inconsistency.</p>
      <ResourceFigure label="Two by two model risk diagnostic matrix crossing statistical performance and control integrity." caption="Strong performance cannot compensate for weak implementation, governance or use controls.">
        <div className={styles.matrix}><span className={styles.yLabel}>Statistical performance →</span><div><small>WEAK PERFORMANCE / STRONG CONTROLS</small><strong>Known underperformance</strong><p>Visible issue requiring remediation</p></div><div className={styles.good}><small>STRONG PERFORMANCE / STRONG CONTROLS</small><strong>Controlled model</strong><p>Evidence supports bounded use</p></div><div className={styles.bad}><small>WEAK PERFORMANCE / WEAK CONTROLS</small><strong>High model-risk state</strong><p>Neither behaviour nor use is reliable</p></div><div><small>STRONG PERFORMANCE / WEAK CONTROLS</small><strong>Hidden model risk</strong><p>Good metrics conceal fragile control</p></div><span className={styles.xLabel}>Control integrity →</span></div>
      </ResourceFigure>
    </section>

    <section id="findings">
      <h2>Validation becomes control through explicit findings</h2>
      <p>Severity should reflect impact on use, not editorial tone. A practical local scale might identify <strong>Critical</strong> material risk to use, <strong>Significant</strong> required remediation, <strong>Moderate</strong> improvement or control weakness, and an <strong>Observation</strong> as non-blocking advice. These are disciplined concepts, not universal regulatory categories.</p>
      <p>Each finding should contain <strong>Observation → Risk → Evidence → Impact → Recommendation</strong>. Closure then follows <strong>Finding → Owner → Action → Due date → Evidence → Closure</strong>. An issued but unresolved finding remains ongoing model risk.</p>
      <h3>Validation depth follows scope and change</h3>
      <p><strong>Initial validation</strong> precedes first use; <strong>periodic validation</strong> provides recurring comprehensive review; <strong>triggered validation</strong> responds to material model, data or strategy change. New variables or coefficients, recalibration, segmentation or target changes, new data sources, implementation changes and major portfolio expansion may be material. Materiality depends on whether change can alter model behaviour or decision use—not an arbitrary count of edited fields.</p>
      <h3>Monitoring is evidence for validation, not its synonym</h3>
      <p>Monitoring asks, <strong>is something changing?</strong> Validation asks, <strong>is the model still conceptually and operationally acceptable?</strong> Evidence from <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link>—discrimination decline, calibration drift, population shift, missingness and overrides—can trigger validation.</p>
      <p>Other portfolio lenses deepen the challenge. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> can expose underwriting and temporal change; <Link href="/resources/roll-rate-analysis-migration-matrices">roll rates and migration matrices</Link> reveal deterioration and cure dynamics hidden by aggregates; <Link href="/resources/early-warning-indicators-credit-risk">early-warning indicators</Link> detect borrower or portfolio deterioration. They may share data with validation but answer different questions about behaviour.</p>
    </section>

    <section id="decision">
      <h2>A conclusion must change how the model may be used</h2>
      <p>The Entimema decision chain is <strong>Validation evidence → Model conclusion → Usage constraint → Decision impact</strong>. A conclusion without a corresponding operating consequence is documentation, not model-risk control.</p>
      <div className={styles.conclusions}>{[["Accept","No material issue; normal bounded use."],["Accept with conditions","Use continues with owned remediation and enhanced monitoring."],["Restrict use","Constrain to validated segments, populations or purposes."],["Recalibrate","Ranking is credible but probability level is weak."],["Redevelop","Core structure or relationships are no longer credible."],["Suspend / escalate","Severe data, implementation or control failure prevents safe use."]].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div>
      <p>Possible impacts include increased monitoring frequency, a restricted segment, a temporary cut-off overlay, recalibration or redevelopment. These labels are not offered as a universal governance taxonomy. Their value lies in connecting the specific evidence and uncertainty to an explicit boundary on real decisions.</p>
    </section>

    <section id="automation">
      <h2>Reproducibility turns validation into a durable capability</h2>
      <p>A future Engineering article—<strong>Credit Risk Model Validation Pipeline: Automating Reproducible Tests, Benchmarks and Monitoring</strong>—should answer how to execute the tests consistently. This Insights analysis establishes what should be validated and why.</p>
      <p>A future <strong>Model Validation Agent</strong> could run diagnostics, compare development with current performance, monitor ranking and calibration, track drift, execute golden-borrower cases, compare versions, surface exceptions, assemble evidence packs and track remediation. It should assist a controlled workflow; it should not autonomously “approve” models without expert judgement.</p>
      <p>Monitoring, periodic validation, model change, recalibration, portfolio evolution and finding closure all regenerate evidence. That recurring work is a credible foundation for controlled automation and subscription delivery—not because judgement can be removed, but because repeatable collection, reconciliation and exception surfacing make judgement better informed.</p>
      <p>Entimema&apos;s existing <Link href="/services/credit-risk">Credit Risk capability</Link> connects PD model review, calibration diagnostics, portfolio analytics, monitoring architecture and model governance to the decisions those controls are intended to protect.</p>
      <KeyObservation title="Resolve"><p>A credit-risk model can support real decisions when its purpose and failure boundaries are explicit, each causal layer has credible evidence, implementation matches approval, use remains within scope, and findings remain controlled through closure. <strong>That—not a high AUC—is validation.</strong></p></KeyObservation>
    </section>
  </>;
}
