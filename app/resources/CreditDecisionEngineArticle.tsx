import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-decision-engine.module.css";

export const creditDecisionEngineSections = [
  { id: "model-versus-engine", label: "Model versus engine" },
  { id: "architecture", label: "Thirteen-layer architecture" },
  { id: "validation", label: "Validation and eligibility" },
  { id: "models-and-rules", label: "Models, rules and precedence" },
  { id: "orchestration", label: "Decision orchestration" },
  { id: "outputs", label: "Zones, price and limits" },
  { id: "explainability", label: "Output, reasons and trace" },
  { id: "versioning", label: "Versioning and replay" },
  { id: "experimentation", label: "Champion, challenger and overrides" },
  { id: "determinism", label: "Determinism and parity" },
  { id: "testing", label: "Testing architecture" },
  { id: "failure-modes", label: "Failure modes" },
  { id: "monitoring", label: "Monitoring architecture" },
  { id: "resolve", label: "Engineering resolve" },
] as const;

const architecture = [
  ["data", "01", "APPLICATION", "Borrower, facility and context"], ["control", "02", "DATA VALIDATION", "Safe to execute?"], ["rule", "03", "ELIGIBILITY", "Applicant and product permissible?"], ["data", "04", "FEATURE ENGINEERING", "Controlled model-ready inputs"],
  ["model", "05", "PD MODEL", "Versioned raw risk output"], ["model", "06", "CALIBRATION", "Versioned final PD"], ["rule", "07", "AFFORDABILITY", "Repayment-capacity constraints"], ["rule", "08", "POLICY RULES", "Explicit policy results"],
  ["strategy", "09", "CUT-OFF / STRATEGY", "Zones and risk appetite"], ["strategy", "10", "PRICING & LIMITS", "Economic terms and exposure"], ["decision", "11", "DECISION ORCHESTRATOR", "Precedence and conflict resolution"], ["decision", "12", "APPROVE / REVIEW / DECLINE", "Structured action and terms"],
  ["control", "13", "REASON CODES + AUDIT LOG", "Evidence and reconstruction"], ["control", "14", "MONITORING", "Behaviour, outcomes and controls"],
] as const;

const layerRows = [
  ["1 — Application data", "Borrower, facility and contextual information", "Immutable decision input snapshot"], ["2 — Data validation", "Required fields, types, values, dates, units and freshness", "Valid, incomplete or invalid"], ["3 — Eligibility", "Legal, product and exposure permissibility", "Proceed, review or stop"],
  ["4 — Feature engineering", "Approved transformations", "Model-ready feature vector"], ["5 — Risk models", "PD and relevant risk signals", "Versioned model output"], ["6 — Affordability", "Repayment capacity against defined constraints", "Pass, review or fail"],
  ["7 — Policy", "Deterministic credit-policy rules", "Rule results and reasons"], ["8 — Economics", "Expected loss, funding, price, margin and exposure", "Economic result"], ["9 — Strategy", "Cut-offs, review zones, limits and authorities", "Strategy recommendation"],
  ["10 — Orchestration", "Precedence and conflict resolution", "One controlled decision"], ["11 — Explainability", "Controlled reason taxonomy", "Decision evidence"], ["12 — Audit", "Inputs, versions, results and overrides", "Reconstructable state"], ["13 — Monitoring", "Flow, decision and outcome measures", "Alerts and governed action"],
];

const failureRows = [
  ["Rule-order conflict or contradictory duplicate", "Two paths produce incompatible results", "Outcome depends on execution path", "Inconsistent risk selection and customer treatment"],
  ["Stale strategy or wrong model version", "Runtime binds unapproved artefacts", "Cut-offs or PD differ from the intended release", "Portfolio mix moves without authorised intent"],
  ["Calibration layer missing", "Raw score probability is treated as final PD", "Wrong zone, price or limit", "Expected loss and risk appetite can be misstated"],
  ["Rounding at a cut-off", "Comparison uses display rather than canonical precision", "Boundary cases cross zones", "Systematic edge-case leakage or over-decline"],
  ["Null handling or silent rule failure", "Missing state becomes accidental pass/fail", "Application proceeds on unknown evidence", "Uncontrolled adverse selection or avoidable decline"],
  ["Hidden override or missing trace", "Automated and human actions cannot be separated", "Decision cannot be reconstructed", "Weak accountability and unreliable monitoring"],
  ["Development/production mismatch", "Rules, defaults or ordering diverge", "Approved tests do not describe live behaviour", "Strategy performance differs from backtest"],
  ["Strategy change without replay/backtest", "Interactions and capacity effects remain unknown", "Unmeasured approval, review and decline changes", "Unexpected losses, margin or operational congestion"],
];

export default function CreditDecisionEngineArticle() {
  return <div className={styles.articleBody}>
    <section id="model-versus-engine">
      <p className={styles.lead}>A lender can possess a validated PD model, calibrated probabilities, affordability rules, eligibility policy, pricing logic, exposure limits, risk appetite and cut-offs—and still lack a coherent automated decision system.</p>
      <p>The tension lies between owning the components and controlling their execution order, dependencies, conflicts, versions, overrides, evidence, deployment and monitoring. <strong>A credit model estimates risk. A decision engine determines what the institution does with that risk.</strong></p>
      <Formula label="Risk model"><span className={styles.formulaLine}>Model(Xᵢ) → PDᵢ</span></Formula>
      <Formula label="Decision engine"><span className={styles.formulaLine}>DecisionEngine(PDᵢ, Policyᵢ, Affordabilityᵢ, Economicsᵢ, Exposureᵢ, Strategyᵢ) → Actionᵢ</span></Formula>
      <Formula label="Controlled action set"><span className={styles.formulaLine}>Actionᵢ ∈ &#123; Approve, Review, Decline &#125;</span></Formula>
      <div className={styles.comparison}><article><h3>The model asks</h3><p><strong>How risky is this borrower?</strong> It estimates an uncertain outcome from defined inputs.</p></article><article><h3>The engine asks</h3><p><strong>Given risk, policy, affordability and economics, what action should the institution take?</strong></p></article></div>
      <KeyObservation title="Engineering proposition"><p>Decision automation is not the replacement of credit policy by software. It is the controlled translation of credit policy, model outputs and economic logic into executable decisions.</p></KeyObservation>
    </section>

    <section id="architecture">
      <h2>Thirteen layers turn evidence into one governed action</h2>
      <p>The transformation is a chain: <strong>Application data → validation → eligibility → feature engineering → PD model → calibration → affordability → policy → strategy → pricing and limits → orchestration → reasons and decision → audit → monitoring.</strong> Every boundary defines an interface, owner, version and failure behaviour.</p>
      <ResourceFigure label="Credit decision engine architecture from application through monitoring, with colour-coded data, model, rule, strategy, decision and control stages." caption="The architecture keeps evidence, estimation, constraints, strategy, action and control distinguishable while joining them through explicit interfaces.">
        <div className={styles.architecture}>{architecture.map(([tone, number, title, copy]) => <article className={styles[tone]} key={title}><span>{number}</span><strong>{title}</strong><small>{copy}</small></article>)}</div>
      </ResourceFigure>
      <ResourceTable caption="The thirteen controlled decision layers" headers={["Layer", "Responsibility", "Output contract"]} rows={layerRows} />
    </section>

    <section id="validation">
      <h2>Decision automation begins before model scoring</h2>
      <p>Required fields, data types, permitted values, missing information, impossible values, staleness, duplicate applications, inconsistent units and invalid dates determine whether scoring is safe. A model accepting a malformed value does not make that value valid. <strong>Invalid input should not silently become a credit decision.</strong></p>
      <div className={styles.layers}>{[["VALID", "Continue", "Schema and semantic checks pass."], ["INCOMPLETE", "Request / review", "Required evidence is not yet available."], ["INVALID", "Stop / exception", "Unsafe input enters a controlled failure path."]].map(([state,title,copy])=><article key={state}><span>{state}</span><strong>{title}</strong><p>{copy}</p></article>)}</div>
      <h3>Hard eligibility belongs in explicit policy</h3>
      <p>Product eligibility, minimum required information, legal eligibility, permitted exposure type, hard affordability constraints and defined product restrictions determine whether the application can proceed. They should generally be evaluated explicitly, not hidden inside a coefficient. A statistical model estimates uncertainty; it should not be forced to impersonate a known constraint.</p>
      <p>Every model and rule interface also needs an explicit missing state. <code>null</code> must not become an accidental pass or fail through language semantics. Depending on the approved component, missingness may fail validation, enter a dedicated state, trigger review or follow a documented imputation path.</p>
    </section>

    <section id="models-and-rules">
      <h2>Models estimate uncertainty; rules express constraints</h2>
      <p>The PD signal should enter as <strong>validated inputs → feature transformation → model version → raw output → calibration version → final PD</strong>. The engine consumes that versioned contract; it does not informally reproduce model logic. The companion Engineering article, <Link href="/resources/logistic-regression-credit-risk-scorecards">Logistic Regression for Credit Risk Scorecards</Link>, develops the model chain from risk drivers to production PD.</p>
      <div className={styles.comparison}><article><h3>Models</h3><p>Estimate uncertain outcomes: PD, propensity or fraud probability. Their output is evidence with statistical meaning.</p></article><article><h3>Rules</h3><p>Represent explicit eligibility, affordability, maximum exposure, authority or documentation constraints.</p></article></div>
      <p>A <strong>hard rule</strong> prevents automatic approval when it fails. A <strong>soft rule</strong> can change review, pricing, limit, verification or strategy path. Soft does not mean optional; it means its consequence is not necessarily decline. This distinction must live in executable metadata rather than institutional folklore.</p>
      <h3>Precedence is a designed policy, not an incidental code order</h3>
      <p>If PD recommends approval, affordability recommends review and hard eligibility requires decline, one result must win. A simplified design might prioritise <strong>invalid/ineligible → hard decline → manual review → strategy/pricing/limit → approve</strong>. That order is not universal. The essential control is that precedence is declared, reviewed, tested and versioned rather than inherited from whichever condition runs last.</p>
    </section>

    <section id="orchestration">
      <h2>The orchestrator resolves recommendations into a decision</h2>
      <p>Consider an illustrative final <strong>PD of 2.4%</strong> inside the model approval region. Affordability is borderline, exposure exceeds automatic approval authority and a policy condition requires review. PD alone cannot decide the case.</p>
      <ResourceFigure label="Four decision inputs resolving through precedence into manual review." caption="Orchestration combines independent results under an explicit strategy; it does not average incompatible outcomes.">
        <div className={styles.resolution}><div><span>MODEL RESULT</span><strong>Approve zone</strong></div><div><span>POLICY RESULT</span><strong>Review</strong></div><div><span>AFFORDABILITY</span><strong>Borderline</strong></div><div><span>AUTHORITY</span><strong>Exceeded</strong></div><div><span>ORCHESTRATED ACTION</span><strong>MANUAL REVIEW</strong></div></div>
      </ResourceFigure>
      <h3>Use a decision graph, not a giant if/else engine</h3>
      <ResourceFigure label="Modular decision graph from application to final action." caption="Nodes expose dependencies and make each branch independently testable and versionable."><div className={styles.graph}>{["Application", "Eligible?", "Data complete?", "Affordability?", "Score model", "PD zone?", "Policy exceptions?", "Determine limit", "Determine price", "Final action"].map(node=><span key={node}>{node}</span>)}</div></ResourceFigure>
      <p>Hundreds of nested conditions create hidden dependencies, untestable combinations, duplicated logic, conflicts, release risk and weak explanations. Modular nodes with typed inputs and outputs make transparency, testing, versioning, auditability and targeted change possible. Orchestration should compose results; it should not bury their origins.</p>
    </section>

    <section id="outputs">
      <h2>The decision is more than approve or decline</h2>
      <p>PD zones are one strategy input, not the final engine:</p>
      <Formula label="Illustrative three-zone cut-off strategy"><span className={styles.formulaLine}>PD &lt; c₁ ⇒ ApproveZone<br/>c₁ ≤ PD &lt; c₂ ⇒ ReviewZone<br/>PD ≥ c₂ ⇒ DeclineZone</span></Formula>
      <p><Link href="/resources/credit-risk-cut-off-strategy">Credit Risk Cut-Off Strategy</Link> develops how those boundaries connect to economics and risk appetite. The orchestrator must still apply eligibility, affordability, policy, exposure and authority.</p>
      <Formula label="Risk-sensitive pricing"><span className={styles.formulaLine}>Priceᵢ = f(PDᵢ, LGDᵢ, EADᵢ, Funding, Cost, Margin)</span></Formula>
      <Formula label="Credit limit determination"><span className={styles.formulaLine}>Limitᵢ = f(Riskᵢ, Affordabilityᵢ, Exposureᵢ, Policyᵢ)</span></Formula>
      <p>Pricing can determine interest rate, fee, risk premium or product variant, but its approved logic should remain separate from the PD model. Limit logic similarly converts classification into a usable offer: <strong>Approve €5,000</strong>, not merely <strong>Approve</strong>. The move is from predicting a class toward optimising a controlled decision under constraints.</p>
    </section>

    <section id="explainability">
      <h2>A structured result is an operational contract</h2>
      <p>Downstream origination, servicing, communications, workflow and monitoring systems need machine-readable fields with stable semantics—not prose scraped from a log.</p>
      <pre className={styles.schema} aria-label="Illustrative credit decision output schema">{`decision: APPROVE
approved_limit: 5000
price_band: B
risk_grade: 4
pd: 0.023
model_version: PD_2026_03
calibration_version: CAL_04
strategy_version: STRATEGY_12
policy_version: POLICY_08
reason_codes:
  - AFFORDABILITY_PASS
  - PD_APPROVE_ZONE
timestamp: 2026-08-17T10:30:00Z`}</pre>
      <h3>Reason codes explain material outcomes</h3>
      <p>Controlled codes can identify insufficient affordability, PD above the automatic threshold, missing required information, exposure limit exceeded or policy eligibility failure. They support customer communication, operations, audit, model governance, debugging and monitoring. External wording can map from stable internal codes without exposing raw implementation details or sensitive controls.</p>
      <h3>A decision is not a decision trace</h3>
      <p>The decision says what happened. The trace captures <strong>input snapshot → rules evaluated → model output → strategy version → intermediate outcomes → final action</strong>. Store the timestamp, feature/transformation and calibration versions, policy and strategy versions, rule results, overrides and final output. Months later, the question is not only “what is today&apos;s logic?” but “what exact logic existed then?”</p>
      <DecisionImplication><p>Store enough decision state to reproduce the logic that existed when the decision was made.</p></DecisionImplication>
    </section>

    <section id="versioning">
      <h2>Version the complete decision function</h2>
      <Formula label="Versioned production decision"><span className={styles.formulaLine}>D = f(X, Mᵥ, Cᵥ, Pᵥ, Sᵥ)</span></Formula>
      <p><strong>X</strong> is the input state; <strong>Mᵥ</strong> the model; <strong>Cᵥ</strong> calibration; <strong>Pᵥ</strong> policy; and <strong>Sᵥ</strong> strategy. Any one can change a decision while borrower data remain identical. A release manifest should bind compatible immutable artefacts, effective dates and checksums or equivalent identifiers.</p>
      <h3>Model and strategy are not the same version</h3>
      <p>If an approval boundary changes from <strong>c₁ = 3%</strong> to <strong>c₁ = 2.5%</strong>, the model has not changed; strategy has. Separate identities permit controlled cut-off changes without pretending the PD model was redeveloped, and they let monitoring attribute effects correctly.</p>
      <h3>Decision replay serves reconstruction and analysis</h3>
      <p>Historical input plus historical model, calibration, policy and strategy versions should reconstruct the original action. A second replay mode holds the historical population fixed while applying a new strategy to estimate changed approvals, reviews, declines, limits, price bands and queue volumes. That counterfactual is strategy analysis—not a rewrite of history—and should be labelled accordingly.</p>
    </section>

    <section id="experimentation">
      <h2>Challenge strategy without gambling with live decisions</h2>
      <p>The <strong>champion</strong> is the production strategy. A <strong>challenger</strong> changes selected cut-offs, review zones, limits, pricing or rules on the same eligible population, potentially while the model stays fixed.</p>
      <ResourceFigure label="Champion produces the live decision while a challenger produces a stored shadow decision." caption="Shadow execution measures disagreement and operational consequences without allowing the challenger to affect the customer outcome."><div className={styles.shadow}><article><h3>Champion → actual decision</h3><p>Authorised production path; response is returned to the live workflow.</p></article><article><h3>Challenger → shadow decision</h3><p>Same eligible input; output is isolated, stored and compared later.</p></article></div></ResourceFigure>
      <h3>Overrides are decisions with their own evidence</h3>
      <p>Manual approve, decline, limit and pricing overrides should capture the original automated decision, override action, reason, authorised actor, timestamp and eventual performance. Override rates, concentrations, outcomes and reason quality are monitoring signals—not noise to erase from the automated result.</p>
      <h3>Manual review is a first-class workflow</h3>
      <p>A review package should contain application context, model output, triggered rules, reason codes and missing or exception information. The reviewer should not reconstruct the engine. Queues need prioritisation, service levels, ageing and capacity monitoring because an elegant review rule can still fail operationally if it creates more work than the institution can process.</p>
    </section>

    <section id="determinism">
      <h2>Equivalent state must produce equivalent action</h2>
      <Formula label="Deterministic execution"><span className={styles.formulaLine}>Decision(X, V) = Decision(X, V)</span></Formula>
      <p>A production decision must be reproducible: the same validated inputs, model version, rule version and strategy version should produce the same decision. Probabilistic AI may exist elsewhere, but controlled final decision boundaries can still require deterministic interfaces, validated outputs and explicit exception paths. This is an Engineering-integrity principle, not a universal regulatory claim.</p>
      <Formula label="Development and production parity"><span className={styles.formulaLine}>Strategy_test(X, V) = Strategy_production(X, V)</span></Formula>
      <p>Parity fails through different rule ordering, stale cut-offs, outdated policy tables, rounding, missing deployments, inconsistent models or default handling. The scorecard article&apos;s parity principle therefore extends beyond model arithmetic to the entire strategy function.</p>
    </section>

    <section id="testing">
      <h2>Testing must prove rules and their interactions</h2>
      <div className={styles.testGrid}>{[
        ["Unit tests", "Execute each rule in isolation."], ["Boundary tests", "Test immediately below, at and above cut-offs."], ["Model interface tests", "Verify versioned PD enters with approved precision."], ["Rule interaction tests", "Exercise precedence and contradictory combinations."],
        ["Golden applications", "Fix inputs, versions, trace and expected outputs."], ["Override tests", "Verify authority, reasons and immutable original action."], ["Version tests", "Bind compatible model, calibration, policy and strategy."], ["End-to-end tests", "Validate application through downstream response and audit."],
      ].map(([title,copy])=><div key={title}><strong>{title}</strong><span>{copy}</span></div>)}</div>
      <h3>Golden applications are executable strategy contracts</h3>
      <ResourceTable caption="Illustrative golden application suite" headers={["Case", "Purpose", "Expected path"]} rows={[
        ["A — Clear approve", "Baseline happy path", "Approve with expected terms"], ["B — Exact cut-off", "Comparison semantics", "Declared boundary zone"], ["C — Clear decline", "High-risk path", "Decline with correct reason"], ["D — Manual review", "Soft-rule interaction", "Review package created"],
        ["E — Missing data", "Null behaviour", "Controlled missing state"], ["F — Policy failure", "Hard-rule precedence", "Policy action wins"], ["G — High risk / strong affordability", "Conflicting evidence", "Strategy-defined result"], ["H — Low risk / policy failure", "Model-policy distinction", "Policy action wins"],
      ]} />
      <p>Rerun the suite after every strategy change. Golden cases are necessary but not sufficient: add representative combinatorial, property and end-to-end coverage so the suite does not only memorialise known examples.</p>
      <h3>Boundary precision is decision logic</h3>
      <Formula label="Boundary test around c = 0.0300"><span className={styles.formulaLine}>PD = 0.0299 &nbsp; | &nbsp; PD = 0.0300 &nbsp; | &nbsp; PD = 0.0301</span></Formula>
      <p>Test the exact comparison operator, canonical numerical precision, input scale and rounding stage. Comparing rounded display values or mixing percentages with decimals can materially redirect cases at a decision boundary.</p>
    </section>

    <section id="failure-modes">
      <h2>Small implementation failures propagate into portfolio outcomes</h2>
      <ResourceTable caption="Failure → system effect → decision effect → portfolio consequence" headers={["Failure", "System effect", "Decision effect", "Portfolio consequence"]} rows={failureRows} />
      <p>Incorrect reason codes, uncontrolled manual table edits and strategy changes without backtesting deserve the same visibility. Controls should fail closed or enter an approved exception state according to design; “resilience” must never mean silently skipping a material rule.</p>
    </section>

    <section id="monitoring">
      <h2>Monitor the decision system, not only the PD model</h2>
      <p>Model discrimination and calibration remain important, but production health also requires operational and strategy evidence. Segment every measure by product, channel, customer group and version where meaningful so aggregate stability does not conceal a local break.</p>
      <div className={styles.monitor}>{[
        ["Input", "Schema failures, missingness, freshness, duplicates and exception volume."], ["Model interface", "Model/calibration version, latency, errors and PD distribution."], ["Rules", "Trigger, conflict, failure and missing-state rates by rule version."],
        ["Decisions", "Approve, review and decline rates; terms, limits and reasons."], ["Operations", "Review inflow, ageing, capacity, overrides and service levels."], ["Outcomes", "Defaults, vintages, loss, margin and performance by decision path."],
        ["Strategy", "Cut-off migration, champion/challenger disagreement and replay impact."], ["Audit", "Trace completeness, version binding and replay success."], ["Change", "Deployment parity, unauthorised edits, rollback and alert closure."],
      ].map(([title,copy])=><div key={title}><strong>{title}</strong><p>{copy}</p></div>)}</div>
      <p>Thresholds should have owners, severity, response and escalation—not merely dashboard colours. Join decision-time state to eventual outcomes so the institution can distinguish a model shift, policy change, operational bottleneck and portfolio change before choosing an intervention.</p>
    </section>

    <section id="resolve">
      <h2>The resolve is one reproducible decision architecture</h2>
      <p>The finished engine does not blur model, policy and economics into one opaque score. It preserves their identities, executes them in an approved order, resolves conflicts explicitly, produces structured decisions and reasons, and retains enough state for replay.</p>
      <KeyObservation title="The Engineering resolve"><p><strong>A production decision must be reproducible: the same validated inputs, model version, rule version and strategy version should produce the same decision.</strong> A model supplies risk evidence. A governed decision architecture turns that evidence—together with policy, affordability, economics and authority—into the action the institution is prepared to take.</p></KeyObservation>
    </section>
  </div>;
}
