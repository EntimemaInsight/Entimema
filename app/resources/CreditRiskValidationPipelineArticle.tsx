import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-risk-validation-pipeline.module.css";

export const creditRiskValidationPipelineSections = [
  { id: "tension", label: "From analysis to evidence" }, { id: "run", label: "Reproducible run" },
  { id: "architecture", label: "Eleven-layer architecture" }, { id: "registries", label: "Model and data registries" },
  { id: "builder", label: "Dataset and configuration" }, { id: "runner", label: "Test runner" },
  { id: "benchmarks", label: "Benchmarks and segments" }, { id: "parity", label: "Implementation parity" },
  { id: "exceptions", label: "Exceptions and findings" }, { id: "evidence", label: "Evidence and reproducibility" },
  { id: "change", label: "Change and decision impact" }, { id: "delivery", label: "Monitoring and delivery" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Engine and future agent" },
  { id: "resolve", label: "Engineering resolve" },
] as const;

const pipeline = [
  ["01", "MODEL REGISTRY", "Authoritative model and package identity"], ["02", "DATA SNAPSHOT", "Immutable, reconstructable evidence"],
  ["03", "VALIDATION CONFIG", "Population, horizon, tests and thresholds"], ["04", "DATASET BUILDER", "Point-in-time analytical population"],
  ["05", "TEST RUNNER", "Deterministic execution and output contracts"], ["06", "BENCHMARK LAYER", "Comparable references and challengers"],
  ["07", "EXCEPTION ENGINE", "Material deviations requiring investigation"], ["08", "FINDINGS", "Structured model-risk conclusions"],
  ["09", "EVIDENCE PACK", "Reviewer- and machine-readable lineage"], ["10", "REMEDIATION", "Ownership, status, closure and rerun"],
  ["11", "MONITORING", "Recurring controls and pipeline health"],
] as const;

const failureRows = [
  ["Mutable validation data", "A later rerun sees different records", "Results cannot be reconstructed", "A model decision may rely on evidence nobody can reproduce"],
  ["Undocumented or stale model/calibration", "Tested artefact is ambiguous", "Challenge addresses the wrong model", "Production risk levels or grades may be misstated"],
  ["Hard-coded thresholds or changed metrics", "Methodology changes invisibly", "Exceptions are not comparable through time", "Material change can be missed or falsely escalated"],
  ["Inconsistent benchmark populations", "Comparison bases differ", "Apparent superiority is confounded", "An inferior model may be selected"],
  ["Parity failure", "Reference and production outputs diverge", "Validated behaviour is not deployed behaviour", "Borrowers receive unintended PDs, grades or decisions"],
  ["Skipped test treated as pass", "Evidence is absent", "Control status overstates assurance", "Deployment proceeds with unknown model risk"],
  ["Finding detached from lineage", "Conclusion cannot reach source evidence", "Review and remediation become opinion-led", "Decision owners cannot assess materiality"],
  ["Manually copied report values", "Transcription and staleness enter reporting", "Report and computed result can disagree", "Governance acts on an incorrect conclusion"],
];

export default function CreditRiskValidationPipelineArticle() {
  return <div className={styles.articleBody}>
    <section id="tension">
      <p className={styles.lead}>Model validation becomes scalable only when evidence can be reproduced from versioned data, model artefacts and controlled tests.</p>
      <p>Validation is still often assembled from spreadsheets, notebooks, SQL extracts, one-off scripts, manually copied metrics, screenshots and disconnected documents. Each analysis may be correct while the process remains impossible to reconstruct. Six months later, the dataset, model, calibration, active thresholds, generating code and production parity may all be uncertain.</p>
      <p><Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation: From Statistical Performance to Model Risk Control</Link> defines <em>what</em> should be validated and why. This Engineering article translates those evidence requirements into a system: <strong>Validation Methodology → Validation Pipeline → Evidence → Expert Judgement</strong>.</p>
      <KeyObservation title="The evidence test"><p><strong>A validation metric without lineage is an observation. A reproducible validation run is evidence.</strong> Automation should execute and organise that evidence—not replace expert model-risk judgement.</p></KeyObservation>
    </section>

    <section id="run">
      <h2>Make the validation run the atomic evidence object</h2>
      <Formula label="Version-bound validation run"><span className={styles.formulaLine}>Vᵣ = f(Mᵥ, Dᵥ, Tᵥ, Cᵥ)<br/>Vᵣ → Evidenceᵣ</span></Formula>
      <p><strong>Mᵥ</strong> identifies the model version, <strong>Dᵥ</strong> the data version, <strong>Tᵥ</strong> the test-suite version and <strong>Cᵥ</strong> the validation configuration. Every conclusion should resolve to this tuple and its execution environment.</p>
      <pre className={styles.schema}>{`validation_run_id: VR_2026_08_017
model_version: PD_RETAIL_4.2
dataset_version: OOT_2026Q2
test_suite_version: VAL_3.1
configuration_version: CFG_12`}</pre>
      <p>This illustrative <strong>Validation Run ID</strong> binds model, dataset, configuration, tests, timestamp, environment and results. It is a join key across metrics, exceptions, findings and evidence—not merely a report label.</p>
    </section>

    <section id="architecture">
      <h2>Eleven layers turn validation requirements into a controlled pipeline</h2>
      <ResourceFigure label="Eleven-layer credit risk model validation pipeline and its six diagnostic branches." caption="The test runner fans into controlled diagnostic modules before evidence converges into exceptions, findings, remediation and monitoring.">
        <div className={styles.architecture}>{pipeline.slice(0,5).map(([n,t,c])=><article key={n}><span>{n}</span><strong>{t}</strong><small>{c}</small></article>)}</div>
        <div className={styles.branches}>{["DISCRIMINATION","CALIBRATION","STABILITY","BENCHMARKS","PARITY","SENSITIVITY"].map(x=><span key={x}>{x}</span>)}</div>
        <div className={styles.architecture}>{pipeline.slice(6).map(([n,t,c])=><article key={n}><span>{n}</span><strong>{t}</strong><small>{c}</small></article>)}</div>
      </ResourceFigure>
      <ResourceTable caption="Controlled responsibility and question by layer" headers={["Layer", "Question", "Controlled output"]} rows={pipeline.map(([n,t,c],i)=>[`${n} — ${t}`, i===0?"What exactly are we validating?":i===1?"Against what evidence?":i===2?"Which population, horizon and tests apply?":c, `${t.toLowerCase()} record`])}/>
    </section>

    <section id="registries">
      <h2>Register the model and freeze the evidence base</h2>
      <p>“The PD model” is not a validation object. The model registry must identify the model, version, type, intended population, target, horizon, features, artefact reference, calibration version and implementation status.</p>
      <Formula label="Controlled model package"><span className={styles.formulaLine}>ModelPackage = Specification + Transformations + Parameters + Calibration + Metadata</span></Formula>
      <p>For a scorecard, one versioned package can bind bin maps, WoE maps, coefficients, intercept, score scaling and calibration mapping. These development artefacts are explained in <Link href="/resources/logistic-regression-credit-risk-scorecards">Logistic Regression for Credit Risk Scorecards</Link>; validation consumes them as controlled inputs rather than reconstructing them from prose.</p>
      <h3>Data identity must survive beyond the source query</h3>
      <p><strong>Dᵥ</strong> should identify extraction date, observation and performance periods, population filters, source versions and transformation version. A mutable live table is not that identity.</p>
      <div className={styles.flow}>{["MUTABLE SOURCE","CONTROLLED SNAPSHOT","VALIDATION DATASET"].map(x=><span key={x}>{x}</span>)}</div>
      <p>If historical records change silently, identical code produces different evidence. Immutable or reconstructable snapshots, schema fingerprints and content checks preserve the basis on which the conclusion was made.</p>
    </section>

    <section id="builder">
      <h2>Build the analytical population from reviewed configuration</h2>
      <p>The dataset builder implements eligibility, exclusions, observation dates, performance windows, default target, segmentation, censoring and missingness. Validation should independently verify critical development logic rather than accept unexplained output. <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link> controls the event being measured; <Link href="/resources/pd-model-observation-performance-windows">PD Model Observation and Performance Windows</Link> controls when inputs and outcomes may be observed.</p>
      <pre className={styles.schema}>{`population: retail_unsecured
horizon: 12m
target: default_12m
segments: [product, vintage, risk_grade]
tests:
  discrimination: true
  calibration: true
  stability: true
  parity: true`}</pre>
      <p>Configuration makes assumptions reviewable, reusable and versionable. Thresholds belong here as explicit <strong>Threshold⁽ᵛ⁾</strong> objects with rationale, owner and effective date—not as unexplained literals dispersed through code. No threshold is universal.</p>
      <h3>Tests also need controlled identity</h3>
      <p>A test registry stores <strong>test_id, test_version, test_type, input requirements, calculation, comparison basis, severity logic and output schema</strong>. Otherwise “the same test” can silently change denominator, binning or missing-value treatment between runs.</p>
    </section>

    <section id="runner">
      <h2>The runner executes tests deterministically—and stores context</h2>
      <Formula label="Deterministic test execution"><span className={styles.formulaLine}>Resultsᵣ = Run(Modelᵥ, Dataᵥ, Testsᵥ, Configᵥ)</span></Formula>
      <p>Equivalent versioned inputs should reproduce equivalent outputs. Each result carries not only a number but population, period, segment, horizon, observation count, default count, exposure and missingness. A naked Gini is insufficient evidence, and an extreme metric on a tiny sample must not receive automated confidence it has not earned.</p>
      <div className={styles.moduleGrid}>{[
        ["Discrimination","AUC, Gini, KS and grade ordering, executed from one definition across development, validation and OOT."],
        ["Calibration","Predicted PD versus observed default rate by grade and segment; intercept and slope where appropriate."],
        ["Stability","Score, PD, feature and population distributions plus ranking and calibration through time."],
        ["Out-of-time","Development → Validation → OOT using identical metric contracts."],
        ["Segment runner","Product, channel, vintage, grade and customer type selected deliberately through configuration."],
        ["Sensitivity","Controlled Xᵢ → Xᵢ + Δ perturbations and model-response diagnostics."],
      ].map(([a,b])=><article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p><strong>Population drift</strong> changes the input mix; <strong>relationship drift</strong> changes how inputs relate to outcome. Stability is therefore a diagnostic family, not one PSI number. Segmentation is analytically justified to avoid a combinatorial factory of low-evidence results.</p>
    </section>

    <section id="benchmarks">
      <h2>Benchmarks are valid only on a comparable evidence base</h2>
      <p>Previous, simpler, challenger and historical production models can be compared across discrimination, calibration, stability, complexity and implementation. The champion is current production; a challenger is an alternative specification. Both must run against the same controlled population—or the population difference must be an explicit part of the result.</p>
      <Formula label="Comparable benchmark"><span className={styles.formulaLine}>Performance(Model A | Dᵥ, Cᵥ) ↔ Performance(Benchmark | Dᵥ, Cᵥ)</span></Formula>
      <p>Controlled scenarios—utilisation, affordability or delinquency deterioration and portfolio-mix shift—complement aggregate backtesting. They ask whether direction, magnitude, discontinuity and threshold response remain plausible without pretending that scripted scenarios replace expert challenge.</p>
    </section>

    <section id="parity">
      <h2>Implementation parity is a first-class validation module</h2>
      <Formula label="Reference-production parity"><span className={styles.formulaLine}>Output_reference(X) ≈ Output_production(X)</span></Formula>
      <p>For identical borrower inputs, compare transformations, WoE, coefficients, raw score, calibration, final PD and grade. Every unexpected difference becomes an exception, because statistical validation of one implementation cannot assure another.</p>
      <ResourceTable caption="Golden-borrower regression suite" headers={["Case", "Risk behaviour", "Stored expectation"]} rows={[
        ["A — Lowest risk","Low-risk path","Transformations, score, PD and grade"], ["B — Typical borrower","Central path","Transformations, score, PD and grade"],
        ["C — High risk","High-risk path","Transformations, score, PD and grade"], ["D — Missing value","Declared null path","Imputation or missing bin and output"],
        ["E — Exact bin boundary","Comparison semantics","Declared bin, score, PD and grade"], ["F — Extreme value","Range and capping","Controlled transformation and output"],
      ]}/>
      <Formula label="Boundary test around X = 0.40"><span className={styles.formulaLine}>0.3999 &nbsp; | &nbsp; 0.4000 &nbsp; | &nbsp; 0.4001</span></Formula>
      <p>Boundary errors silently reassign risk. Every feature must also declare behaviour for null, unavailable, malformed and out-of-range input; implementation-language defaults must never choose model behaviour accidentally.</p>
    </section>

    <section id="exceptions">
      <h2>An exception is evidence; a finding is judgement</h2>
      <div className={styles.flow}>{["METRIC","COMPARISON","EXCEPTION","INVESTIGATION","FINDING"].map(x=><span key={x}>{x}</span>)}</div>
      <p>Automated thresholds can identify deviations, but they cannot turn each flag into a model-risk conclusion. Severity should consider materiality, persistence, affected population, decision impact and evidence strength. A small parity error affecting every production decision may be more serious than a large statistical deviation in a tiny segment.</p>
      <pre className={styles.schema}>{`finding_id
validation_run_id
model_version
test_id
observation | evidence | risk | impact
severity | recommendation | status | owner`}</pre>
      <p>Structured findings support workflow and tracking while retaining expert interpretation. Every one must resolve through <strong>Finding → Exception → Test Result → Test Version → Dataset Version → Model Version</strong>.</p>
      <DecisionImplication><p>Findings should never be manually detached summaries. Their evidence chain is part of the control.</p></DecisionImplication>
    </section>

    <section id="evidence">
      <h2>The evidence pack preserves computation; the report interprets it</h2>
      <div className={styles.comparison}><article><h3>Evidence pack</h3><p>Structured run, model and dataset metadata; metrics; HTML visuals; segment and parity results; exceptions, findings and methodology versions.</p></article><article><h3>Validation report</h3><p>Expert interpretation, materiality assessment, challenge and conclusion based on—not substituted for by—the evidence pack.</p></article></div>
      <Formula label="Reproducibility control"><span className={styles.formulaLine}>(Mᵥ, Dᵥ, Tᵥ, Cᵥ) → Resultsᵣ₁ ≈ Resultsᵣ₂</span></Formula>
      <p>Only explicitly controlled computational tolerances may explain differences. Run comparison should answer “what changed, and why?” through a <strong>Model Diff, Data Diff, Configuration Diff, Metric Diff and Finding Diff</strong>. This is the foundation for recurring validation rather than repeated forensic reconstruction.</p>
    </section>

    <section id="change">
      <h2>Model change evidence must reach the decision boundary</h2>
      <p>For <strong>M₄.₁ → M₄.₂</strong>, diff parameters, transformations, calibration, predictions, ranking and segment behaviour. A calibration-only <strong>C₁ → C₂</strong> change should separately show unchanged ranking, changed PD levels, potentially changed grades and potentially changed decisions.</p>
      <div className={styles.flow}>{["MODEL","PD","STRATEGY","DECISION"].map(x=><span key={x}>{x}</span>)}</div>
      <p>Replay old and new outputs through the same strategy to compare approval, manual-review and decline rates; approved-population PD, expected loss, grade and segment mix; and exposure distribution. <Link href="/resources/credit-risk-cut-off-strategy">Credit Risk Cut-Off Strategy</Link> explains the economic boundary, while <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link> controls how PD and policy become action. A statistically small change can be economically material when many applications sit near a boundary.</p>
      <ResourceFigure label="Entimema model change impact matrix using model output change and decision impact." caption="Materiality combines analytical movement with downstream consequence; neither axis is sufficient alone.">
        <div className={styles.matrix}><span className={styles.axisY}>MODEL OUTPUT CHANGE →</span><article><strong>High change / Low impact</strong><small>Material analytical movement; limited current decision consequence.</small></article><article><strong>High change / High impact</strong><small>Major model and strategy consequence requiring strong control.</small></article><article><strong>Low change / Low impact</strong><small>Operationally minor change.</small></article><article><strong>Low change / High impact</strong><small>Dangerous boundary effect requiring investigation.</small></article><span className={styles.axisX}>DECISION IMPACT →</span></div>
      </ResourceFigure>
    </section>

    <section id="delivery">
      <h2>Reuse validation controls without collapsing validation into monitoring</h2>
      <p>Discrimination, calibration, score distribution, population stability, missingness and parity may move from <strong>Validation Test → Production Monitoring Test</strong>. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> can reuse test contracts, data lineage and evidence storage, while comprehensive periodic validation retains broader independent challenge.</p>
      <p>Suites can support monthly monitoring, quarterly diagnostics, periodic comprehensive validation and triggered runs after model, recalibration, data-source, feature or strategy change, or a monitoring exception. Trigger scope should reflect materiality; not every small edit requires the full suite.</p>
      <div className={styles.flow}>{["CHANGE","AUTOMATED TESTS","PARITY","GOLDEN BORROWERS","REGRESSION","DEPLOYMENT GATE"].map(x=><span key={x}>{x}</span>)}</div>
      <p>Borrowing CI/CD controls means critical implementation tests must pass before deployment can proceed. It does not mean ordinary software CI/CD is sufficient governance: automation verifies evidence; authorised governance decides approval.</p>
      <h3>Monitor the pipeline itself</h3>
      <div className={styles.moduleGrid}>{[
        ["Execution","Successful, failed and incomplete runs; runtime."], ["Data","Snapshot availability, missing fields and schema changes."],
        ["Tests","Failures, skipped tests and changed versions."], ["Evidence","Lineage gaps, missing artefacts and unreproducible results."],
        ["Findings","Open, overdue and recurring issues."], ["Triggers","Expected runs, delivery state and deployment-gate status."],
      ].map(([a,b])=><article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <KeyObservation title="Operational control"><p><strong>A validation pipeline that silently fails creates model risk of its own.</strong> Missing execution is an exception—not a model pass.</p></KeyObservation>
    </section>

    <section id="failures">
      <h2>Engineering failures propagate into model-risk and decision consequences</h2>
      <ResourceTable caption="Failure → evidence problem → model-risk consequence → decision consequence" headers={["Failure","Evidence problem","Model-risk consequence","Decision consequence"]} rows={failureRows}/>
      <p>Other serious modes include undocumented versions, stale calibration, inconsistent populations, missing lineage, non-reproducible results, model changes without regression testing and remediation detached from reruns. Every control must distinguish <em>failed</em>, <em>skipped</em>, <em>not applicable</em> and <em>passed</em>.</p>
    </section>

    <section id="agent">
      <h2>A future validation agent should sit above deterministic evidence</h2>
      <div className={styles.comparison}><article><h3>Validation engine</h3><p>Deterministically constructs data, calculates metrics and benchmarks, compares parity and golden borrowers, and detects configured exceptions.</p></article><article><h3>Validation agent</h3><p>Could interpret exceptions, compare runs, synthesise cited evidence, draft finding narratives, surface recurrence and track remediation.</p></article></div>
      <ResourceFigure label="Controlled relationship between validation engine, a future model validation agent and analyst approval." caption="The potential agent operates on structured evidence. It neither replaces deterministic calculations nor independently approves or rejects a model.">
        <div className={styles.agentFlow}>{["VALIDATION ENGINE","STRUCTURED EVIDENCE","EXCEPTIONS","MODEL VALIDATION AGENT","INTERPRETATION / COMPARISON","ANALYST REVIEW","FINDING / REMEDIATION"].map((x,i)=><span className={i===3?styles.agentNode:i===5?styles.humanNode:""} key={x}>{x}</span>)}</div>
      </ResourceFigure>
      <p>A credible future workflow is <strong>Detect → Investigate → Explain → Assemble → Track → Escalate</strong>: what changed, which evidence explains it, why it matters, what supports the finding, whether remediation occurred and what needs expert attention. This describes a future capability, not a claim that the agent currently exists.</p>
      <p>The workflow is inherently recurring because models require monitoring, periodic validation, recalibration assessment, implementation checks, change validation and remediation tracking. Its durable question is: <strong>What changed in the model, portfolio or evidence—and does it matter?</strong></p>
    </section>

    <section id="resolve">
      <h2>Register → Execute → Compare → Explain → Control</h2>
      <EntimemaFramework title="The reproducible validation pipeline" description="Reproduce spans every stage: identities, computation, comparison, judgement support and ongoing control." steps={["Register", "Execute", "Compare", "Explain", "Control"]}/>
      <p><strong>Register</strong> exact model, data and methodology identities. <strong>Execute</strong> deterministic tests. <strong>Compare</strong> results with history, benchmarks and expectations. <strong>Explain</strong> exceptions through traceable evidence and expert findings. <strong>Control</strong> remediation, reruns and monitoring.</p>
      <p>This pipeline differs from <Link href="/resources/credit-portfolio-monitoring-architecture">Credit Portfolio Monitoring Architecture</Link>: portfolio monitoring watches borrower and portfolio risk; model validation challenges the system measuring that risk. Both depend on reliable data and controlled decisions, but they are distinct control layers.</p>
      <p>The validation problem becomes an evidence and control problem; unresolved uncertainty then becomes decision risk. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects model evidence to risk control, <Link href="/services/decision-automation">Decision Automation</Link> connects validated outputs to traceable action, and <Link href="/services/financial-data">Financial Data</Link> addresses the lineage and snapshot architecture when data is the binding constraint.</p>
      <DecisionImplication><p><strong>Controlled validation is not a collection of disconnected analyses.</strong> It is a reproducible evidence pipeline in which every conclusion can be traced to the model, data, tests and configuration that produced it—and expert judgement remains responsible for what that evidence means.</p></DecisionImplication>
    </section>
  </div>;
}
