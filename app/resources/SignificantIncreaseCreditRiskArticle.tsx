import Link from "next/link";
import { Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./significant-increase-credit-risk.module.css";

export const significantIncreaseCreditRiskSections = [
  { id: "change-state", label: "A change-in-risk state" },
  { id: "baseline", label: "The initial benchmark" },
  { id: "measures", label: "Measuring deterioration" },
  { id: "lifetime", label: "Lifetime risk and term structure" },
  { id: "evidence", label: "Evidence and triggers" },
  { id: "migration", label: "Migration, stock and flow" },
  { id: "ecl-impact", label: "ECL impact and attribution" },
  { id: "case-study", label: "Portfolio case study" },
  { id: "validation", label: "Validation and backtesting" },
  { id: "non-bank", label: "High-risk non-bank portfolios" },
  { id: "failure-modes", label: "Failure modes" },
  { id: "agent", label: "SICR monitoring agent" },
] as const;

const borrowerRows = [
  ["A", "1.0%", "3.0%", "+2.0 pp", "3.00×", "+1.12", "Current", "Sector outlook weakened"],
  ["B", "8.0%", "10.0%", "+2.0 pp", "1.25×", "+0.25", "Current", "None"],
  ["C", "0.5%", "1.2%", "+0.7 pp", "2.40×", "+0.88", "Current", "Repeated liquidity stress"],
  ["D", "4.0%", "7.0%", "+3.0 pp", "1.75×", "+0.59", "18 DPD", "Covenant headroom reduced"],
  ["E", "15.0%", "18.0%", "+3.0 pp", "1.20×", "+0.22", "Current", "Long-standing watchlist"],
];

const failureRows = [
  ["Stage 2 as a high-risk bucket", "Confuses current level with deterioration since initial recognition."],
  ["Current PD only", "Erases the origination benchmark and makes SICR path-independent."],
  ["Ignoring initial recognition", "Removes the reference state that gives ‘increase’ its meaning."],
  ["Mechanical relative threshold", "Overreacts to small moves from very low starting PDs and hides context."],
  ["Mechanical absolute threshold", "Can miss proportionally severe deterioration at low risk levels."],
  ["Incomparable model versions", "Turns changes in measurement scale into apparent borrower deterioration."],
  ["Recalibration-induced migration", "Moves accounts because the PD scale changed, not necessarily the borrower."],
  ["Ignoring the lifetime horizon", "Uses a one-year signal for a lifetime-risk assessment without reconciliation."],
  ["No qualitative evidence", "Waits for model variables to catch up with borrower reality."],
  ["Delinquency only", "Detects deterioration late and mistakes one symptom for the full concept."],
  ["Excessive volatility", "Creates unstable lifetime ECL and operational review populations."],
  ["Symmetric entry and exit", "Encourages Stage 1 ↔ Stage 2 oscillation after temporary improvement."],
  ["Weak cure logic", "Treats a momentary recovery as durable evidence."],
  ["Opaque macro effects", "Cannot distinguish borrower change from scenario-architecture change."],
  ["Trigger double counting", "Inflates apparent evidence and obscures the real reason for entry."],
  ["No reason attribution", "Prevents explanation, monitoring and trigger-level challenge."],
  ["No vintage analysis", "Hides underwriting, product, channel and cohort effects."],
  ["No backtesting", "Leaves timeliness, persistence and economic meaning untested."],
  ["Optimising default prediction only", "Ignores timely recognition, stability and accounting purpose."],
  ["Ignoring ECL impact", "Disconnects staging judgement from its material financial consequence."],
  ["Stage 2 stock without flows", "Cannot explain whether the population grew through entries, slow cures or defaults."],
  ["No Finance–Risk bridge", "Reports an allowance movement without explaining its mechanics."],
  ["Unchallenged legacy rules", "Preserves historical practice without evidence that it remains relevant."],
];

export default function SignificantIncreaseCreditRiskArticle() {
  return <>
    <p className={styles.lead}>Stage 2 is not a warehouse for risky borrowers. It is a measurement state triggered when credit risk has increased significantly since initial recognition. That distinction changes the benchmark, the evidence, the monitoring design and the financial explanation.</p>
    <KeyObservation title="The central distinction"><p>A borrower can be high-risk today yet broadly unchanged from origination. Another can remain moderate-risk in absolute terms yet have deteriorated sharply. <strong>High risk and significant increase in risk are different analytical objects.</strong></p></KeyObservation>
    <ResourceFigure label="Entimema SICR architecture" caption="SICR begins with an initial reference state, assembles comparable lifetime-risk and corroborating evidence, then tests whether migration and its financial effect remain meaningful through time.">
      <ol className={styles.architecture}>{["Initial Credit Risk", "Current Lifetime Risk", "Relative / Absolute Deterioration", "Behavioural Evidence", "Qualitative Evidence", "Forward-Looking Information", "Persistence / Overrides", "SICR Assessment", "Stage 2", "Lifetime ECL", "Backtesting & Monitoring"].map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol>
    </ResourceFigure>

    <section id="change-state">
      <h2>Stage 2 is a change-in-risk state</h2>
      <p>The practitioner error begins when the question “How risky is this borrower now?” replaces “How much has this borrower’s credit risk changed since we first recognised the exposure?” Current risk matters, but it is only one input.</p>
      <Formula label="Conceptual SICR assessment"><span className={styles.formulaLine}>SICR<sub>i</sub> = f(Risk<sub>current,i</sub>, Risk<sub>initial,i</sub>, Horizon, Evidence)</span></Formula>
      <Formula label="Risk change as the central analytical object"><span className={styles.formulaLine}>ΔRisk = Risk<sub>current</sub> − Risk<sub>initial</sub></span></Formula>
      <p>No single transformation universally defines SICR. A governed methodology must decide how lifetime risk, behavioural evidence, qualitative indicators, forward-looking information, backstops and judgement combine. The analytical shift is nevertheless precise: move from <strong>current risk</strong> to <strong>change in risk</strong>, and from <strong>high risk</strong> to <strong>significant deterioration</strong>.</p>
      <ResourceFigure label="Current risk level and deterioration diagnostic matrix" caption="The two axes prevent persistently high risk from being confused with a significant increase, while exposing emerging deterioration before the borrower reaches a high absolute risk level.">
        <div className={styles.riskMatrix}>
          <div className={styles.corner}>CURRENT RISK →<br />DETERIORATION ↓</div><div className={styles.axis}>LOW CURRENT RISK</div><div className={styles.axis}>HIGH CURRENT RISK</div>
          <div className={styles.axis}>LOW DETERIORATION</div><article><h3>Stable low-risk</h3><p>Low level, little change. Ordinarily the least compelling SICR case.</p></article><article><h3>Persistently high-risk</h3><p>High level, but close to origination risk. Not Stage 2 merely because risk is high.</p></article>
          <div className={styles.axis}>HIGH DETERIORATION</div><article className={styles.emphasis}><h3>Emerging SICR candidate</h3><p>Still moderate in level, but the path from origination may be significant.</p></article><article className={styles.emphasis}><h3>Severe deterioration</h3><p>High level and substantial change; evidence may be mutually reinforcing.</p></article>
        </div>
      </ResourceFigure>
      <p>This makes SICR path-dependent: <strong>SICR ≠ f(Current State)</strong> alone. Two borrowers with identical current PD can receive different assessments when their initial PDs, paths and evidence differ.</p>
    </section>

    <section id="baseline">
      <h2>A credible initial-recognition benchmark is non-negotiable</h2>
      <Formula label="Account-level initial risk benchmark"><span className={styles.formulaLine}>PD<sup>initial</sup><sub>i</sub></span></Formula>
      <p>The benchmark should represent risk at initial recognition under the relevant methodology. It is not simply the oldest PD still stored in a warehouse. Origination score, grade, approved application data, contractual term and the risk information available at recognition must be aligned to a reproducible reference date.</p>
      <p>Legacy contracts create the hardest cases: origination scores may be missing; portfolios may have migrated systems; risk scales may have changed; historical variables may be incomplete; or the original model may no longer exist. Back-casting, score reconstruction, a mapped segment benchmark or proxy origination risk can provide analytical routes, but each introduces assumptions. The proxy, uncertainty and limitations should be visible in assessment and validation—not hidden behind a precise-looking ratio.</p>
      <h3>Current risk is useful only when it is comparable</h3>
      <p>Current estimates may incorporate updated borrower characteristics, behaviour, delinquency, macroeconomic conditions and a newer PD model. If Model<sub>initial</sub> ≠ Model<sub>current</sub>, or Calibration<sub>initial</sub> ≠ Calibration<sub>current</sub>, raw PD ratios can move even when underlying borrower risk does not.</p>
      <ResourceFigure label="SICR comparability control" caption="The measurement scale must be stabilised before account-level deterioration is interpreted."><div className={styles.comparability}>{["ORIGINATION DATA", "ORIGINAL RISK SCALE", "COMMON / MAPPED SCALE", "CURRENT RISK SCALE", "BORROWER CHANGE"].map((step) => <span key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Model version changes, recalibration, score-to-PD mapping revisions and portfolio migration should therefore be decomposed. Possible approaches include a common risk scale, a mapped benchmark or reconstructed origination risk. None is universally superior; all require consistent application, version control and validation. <strong>SICR can be distorted when the ruler changes even if the borrower does not.</strong></p>
    </section>

    <section id="measures">
      <h2>Relative, absolute and log-odds change answer different questions</h2>
      <div className={styles.measureGrid}>
        <article><span>RELATIVE MULTIPLE</span><strong>PD<sub>current</sub> / PD<sub>initial</sub></strong><p>Scale-free and intuitive, but highly sensitive to very low starting PDs.</p></article>
        <article><span>ABSOLUTE CHANGE</span><strong>PD<sub>current</sub> − PD<sub>initial</sub></strong><p>Shows probability-point movement, but can understate proportional deterioration from a low base.</p></article>
        <article><span>LOG-ODDS CHANGE</span><strong>logit(PD<sub>current</sub>) − logit(PD<sub>initial</sub>)</strong><p>A more scale-aware analytical comparison; useful reasoning, not an IFRS 9 requirement.</p></article>
      </div>
      <p>Borrower A moves from 1% lifetime PD to 3%; Borrower B moves from 8% to 10%. B remains riskier in absolute level. A triples, while B rises by 25%. Both increase by two percentage points. The measures rank deterioration differently because they preserve different information.</p>
      <ResourceTable caption="Original fictional borrower comparison; PDs and indicators are illustrative, not thresholds" headers={["Borrower", "Initial PD", "Current PD", "Absolute", "Multiple", "Δ log-odds", "Delinquency", "Qualitative evidence"]} rows={borrowerRows}/>
      <p>Borrower D has the largest absolute change and direct delinquency evidence. A has the largest relative and log-odds movement. E is the riskiest today but has the smallest proportional and log-odds deterioration. C remains low-risk in absolute terms, yet its path and liquidity signal deserve attention. A robust assessment asks whether these measures and evidence corroborate one another; it does not outsource judgement to one number or prescribe a universal threshold.</p>
    </section>

    <section id="lifetime">
      <h2>SICR is a lifetime-risk question, not a 12-month shortcut</h2>
      <p>IFRS 9 staging concerns the change in the risk of default over the relevant expected life. PD<sub>12m</sub> and PD<sub>lifetime</sub> can move differently when near-term conditions, longer-run vulnerability, maturity or the shape of the hazard curve changes. A one-year point estimate can therefore be directionally incomplete.</p>
      <Formula label="Initial and current default-risk term structures"><span className={styles.formulaLine}>PD<sup>initial</sup><sub>t</sub> ↔ PD<sup>current</sup><sub>t</sub>, &nbsp; t = 1 … remaining life</span></Formula>
      <p>Deterioration may be concentrated near term, emerge only later or affect the full curve. Two borrowers can have the same cumulative lifetime PD while carrying different timing of default risk—and therefore different discounted ECL profiles. The future dedicated Lifetime PD architecture should develop marginal and conditional term structures in depth; for SICR, the immediate control is to avoid treating a single 12-month ratio as automatically representative of lifetime change.</p>
      <p>Remaining maturity matters. A one-year loan and a ten-year loan do not have comparable lifetime-risk architecture. Long remaining terms create more horizons over which risk and ECL can accumulate. In short-tenor lending, 12-month and lifetime ECL may be closer, but staging remains meaningful for timing, governance and risk recognition.</p>
    </section>

    <section id="evidence">
      <h2>SICR is an evidence architecture, not a trigger inventory</h2>
      <p>Days past due can be powerful evidence, but <strong>DPD is evidence, not the entire SICR concept</strong>. Deterioration can emerge before a missed payment; temporary operational delinquency may not represent persistent risk. Publicly established backstop-type criteria provide governance protection where observable conditions are sufficiently strong to override softer model evidence, but they should not replace the broader assessment.</p>
      <ResourceFigure label="SICR trigger hierarchy" caption="Primary measurement, corroborating evidence, governed overrides and backstops remain explainable and separately attributable."><div className={styles.triggerLayers}>
        <article><span>01</span><h3>Quantitative primary</h3><p>Comparable lifetime-risk deterioration using approved measures.</p></article>
        <article><span>02</span><h3>Behavioural evidence</h3><p>Delinquency, repeated payment stress and changing account behaviour.</p></article>
        <article><span>03</span><h3>Qualitative evidence</h3><p>Watchlist, restructuring, covenant pressure, distress, sector and borrower events.</p></article>
        <article><span>04</span><h3>Forward-looking information</h3><p>Borrower, sector and portfolio sensitivity under approved macro views.</p></article>
        <article><span>05</span><h3>Backstop / override</h3><p>Strong observable evidence and controlled human judgement with reason codes.</p></article>
      </div></ResourceFigure>
      <p>Qualitative indicators matter when quantitative models lag reality. Manual additions can capture emerging risk; manual removals can correct known model artefacts. High override rates can also reveal model gaps or unstable methodology, so additions and removals should be monitored separately.</p>
      <h3>Early warning and SICR answer adjacent questions</h3>
      <p><Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link> ask whether meaningful deterioration is emerging. SICR asks whether the deterioration is sufficient to change impairment measurement. A signal can warrant investigation before it supports Stage 2; conversely, multiple weaker signals may jointly form compelling evidence.</p>
      <p>Trigger overlap matters. If the same borrower meets relative-PD, delinquency and watchlist criteria, the framework should preserve intersections rather than count three independent deteriorations. Reason codes such as relative PD deterioration, delinquency, qualitative deterioration, macro-sensitive deterioration and manual override support attribution and validation; they are internal governance evidence, not customer-facing labels.</p>
      <h3>Macro scenarios need a diagnostic split</h3>
      <p>Forward-looking macro conditions can raise current lifetime PD before borrower behaviour changes. But a mechanical macro-triggered migration can make Stage 2 a scenario artefact. Compare PD<sup>current,scenario</sup> with a controlled PD<sup>current,constantMacro</sup> view to diagnose borrower or portfolio deterioration separately from scenario severity and weight changes. This is analytical decomposition, not a prescribed accounting policy.</p>
    </section>

    <section id="migration">
      <h2>Stage migration should be managed as stock, flow and persistence</h2>
      <Formula label="Conceptual stage migration matrix"><span className={styles.matrixFormula}>M<sub>t</sub> = [ P(1→1)&nbsp; P(1→2)&nbsp; P(1→3)<br />P(2→1)&nbsp; P(2→2)&nbsp; P(2→3)<br />P(3→1)&nbsp; P(3→2)&nbsp; P(3→3) ]</span></Formula>
      <p>The matrix distinguishes Stage 1 → 2 deterioration, Stage 2 → 1 cure and Stage 2 → 3 default migration. <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> provides the wider state-transition architecture.</p>
      <div className={styles.metricGrid}>
        <Formula label="Stage 2 rate"><span>Stage2 Exposure<sub>t</sub> / Total Exposure<sub>t</sub></span></Formula>
        <Formula label="Stage 2 entry rate"><span>Exposure<sub>1→2,t</sub> / Stage1 Exposure<sub>t−1</sub></span></Formula>
        <Formula label="Stage 2 exit rate"><span>Exposure<sub>2→1,t</sub> / Stage2 Exposure<sub>t−1</sub></span></Formula>
      </div>
      <p>A volatile Stage 2 rate can reflect genuine deterioration, threshold instability, recalibration, policy change, cure logic or macro assumptions. Decompose it. Entry and exit evidence need not be symmetrical: stronger evidence for reversal can create useful cure hysteresis and reduce Stage 1 ↔ Stage 2 oscillation. The design should test sustained improvement rather than one favourable observation.</p>
      <Formula label="Conceptual sustained-improvement diagnostic"><span className={styles.formulaLine}>SustainedImprovement<sub>h</sub> = P(Stage1<sub>t+h</sub> | Stage2Exit<sub>t</sub>)</span></Formula>
      <ResourceTable caption="Practitioner Stage 2 exposure roll-forward" headers={["Movement", "Treatment", "Management meaning"]} rows={[
        ["Opening Stage 2", "Opening stock", "Population carried into the period"],
        ["Stage 1 → Stage 2", "+ Entries", "New significant deterioration"],
        ["Stage 2 → Stage 1", "− Cures / exits", "Improvement assessed as sufficiently durable"],
        ["Stage 2 → Stage 3", "− Defaults", "Further deterioration into credit-impaired state"],
        ["Repayment / derecognition", "− Other exits", "Portfolio mechanics rather than cure"],
        ["Other relevant movements", "± Controlled items", "Transfers, FX or defined scope effects where relevant"],
        ["Closing Stage 2", "= Closing stock", "Reconciled population and exposure"],
      ]}/>
      <p>Duration completes the picture. Very short Stage 2 spells may signal sensitivity without persistence; very long durations can reflect prolonged risk, weak cure criteria or sticky logic. Track stock, entries, exits, defaults, duration and reason codes together.</p>
    </section>

    <section id="ecl-impact">
      <h2>Stage 2 can create a nonlinear ECL consequence</h2>
      <Formula label="Stage migration changes the recognised loss horizon"><span className={styles.formulaLine}>12-month ECL → Lifetime ECL</span></Formula>
      <p>For a fictional loan, Stage 1 ECL is €120. After SICR, Stage 2 ECL becomes €540 even though 12-month PD rises only moderately. The principal effect is not the incremental one-year PD movement; it is recognition of expected losses over the remaining life.</p>
      <div className={styles.eclComparison}><article><span>STAGE 1</span><strong>€120</strong><p>12-month expected credit loss</p></article><div>→</div><article><span>STAGE 2</span><strong>€540</strong><p>Lifetime expected credit loss</p></article></div>
      <p>Consider a separate fictional €300m portfolio. Stage 2 exposure rises from 12% (€36m) to 18% (€54m). If the €18m entering Stage 2 moves from an illustrative 0.7% Stage 1 allowance rate to 4.0% lifetime allowance, the volume/migration effect is about <strong>€0.594m</strong>. If the opening €36m Stage 2 stock also moves from 4.0% to 4.8%, risk change within Stage 2 adds about <strong>€0.288m</strong>. The combined illustrative increase is €0.882m before other movements. This separates “more exposure entered Stage 2” from “existing Stage 2 became riskier.”</p>
      <Formula label="Conceptual SICR attribution"><span className={styles.formulaLine}>ΔStage2 ≈ Borrower Deterioration + Macro Effect + Portfolio Mix + Model Change + Policy Change + Residual</span></Formula>
      <p>Effects can interact, so the expression is not automatically additive. A controlled methodology must specify ordering or another allocation convention. The Finance–Risk question is practical: why did Stage 2 allowance increase by €X? The answer should identify migrations, deteriorating vintages, macro changes, calibration effects and slower cures—not merely restate the closing balance.</p>
    </section>

    <section id="case-study">
      <h2>A fictional 200,000-loan portfolio: is the increase coherent?</h2>
      <p>Consider a €400m EAD consumer portfolio. At the opening quarter, Stage 2 is 10%, or €40m. Over two quarters, recent vintages weaken, the unemployment forecast worsens, delinquency rises modestly and PD model calibration remains stable. Stage 2 reaches 16%, or €64m.</p>
      <ResourceTable caption="Stage 2 roll-forward over two quarters" headers={["Movement", "Exposure", "Evidence"]} rows={[
        ["Opening Stage 2", "€40m", "10% of portfolio"], ["Stage 1 → 2 entries", "+€32m", "Recent-vintage, behavioural, qualitative and macro-sensitive evidence"], ["Stage 2 → 1 cure", "−€5m", "Improvement passed persistence review"], ["Stage 2 → 3", "−€2m", "Default / credit-impaired migration"], ["Repayment / derecognition", "−€1m", "Contractual exits"], ["Closing Stage 2", <strong key="close">€64m</strong>, <strong key="rate">16% of portfolio</strong>],
      ]}/>
      <ResourceTable caption="Primary reason attribution for the €32m of entries; overlaps retained separately in the evidence store" headers={["Primary reason", "Entry exposure", "Concentration"]} rows={[
        ["Relative / absolute lifetime PD deterioration", "€13m", "Recent digital vintages"], ["Delinquency evidence", "€7m", "Early missed-payment patterns"], ["Qualitative deterioration", "€5m", "Watchlist and payment stress"], ["Macro-sensitive deterioration", "€4m", "Unemployment-sensitive segments"], ["Manual override", "€3m", "Cases outside model coverage"],
      ]}/>
      <p>Stage 2 allowance rises illustratively from €12.6m to €17.7m. Of the €5.1m increase, €3.0m is attributed to net Stage 2 volume, €1.0m to higher risk within Stage 2, €0.8m to macro scenarios, €0.2m to portfolio mix and €0.1m to interaction/residual. Calibration contributes zero because the model scale remained stable.</p>
      <h3>Vintage analysis distinguishes portfolio-wide stress from origination effects</h3>
      <ResourceTable caption="Illustrative Stage 2 rate by origination vintage" headers={["Vintage", "Opening", "Quarter 1", "Quarter 2", "Interpretation"]} rows={[
        ["Older vintages", "11%", "12%", "12%", "Broadly stable"], ["Prior-year vintages", "10%", "13%", "15%", "Moderate deterioration"], ["Recent digital vintages", "8%", "15%", "24%", "Concentrated deterioration"], ["Portfolio", "10%", "13%", "16%", "Increase driven disproportionately by recent cohorts"],
      ]}/>
      <p>Over the subsequent twelve-month observation window, 9.6% of opening Stage 2 accounts reach Stage 3/default versus 2.1% of Stage 1; the recent digital Stage 2 vintages reach 13.0%. Median lead time from Stage 2 entry to Stage 3 is five months, while 72% of Stage 2 exits remain in Stage 1 six months later. These results do not prove the methodology, but they make the increase economically coherent: deterioration is concentrated where underwriting/channel and macro evidence indicated, Stage 2 is materially riskier than Stage 1, and cure is mostly sustained.</p>
      <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> should then investigate whether underwriting, product, channel or macro conditions explain the cohort pattern. Segment views by product, customer type, risk band, channel, vintage and justified geography can deepen diagnosis; over-segmentation creates unstable rates and false narratives.</p>
    </section>

    <section id="validation">
      <h2>Validation tests sensitivity, stability, timeliness and economic meaning</h2>
      <ResourceFigure label="SICR validation framework" caption="A complete test follows the claim from its reconstructed benchmark through migration, persistence, outcome and financial consequence."><ol className={styles.validationFlow}>{["Initial Benchmark", "Current Risk", "SICR Trigger", "Stage Migration", "Persistence", "Subsequent Deterioration / Default", "ECL Impact"].map((step) => <li key={step}>{step}</li>)}</ol></ResourceFigure>
      <p>Historical backtesting should ask: Did Stage 2 accounts deteriorate or default more frequently? How much earlier were they identified? Did cures remain cured? Which trigger families drove entry? Which generated temporary or non-material migration? Stage 2 should ideally identify deterioration before Stage 3; a framework that moves accounts only immediately before default has limited early-recognition value.</p>
      <Formula label="Stage 2 lead time"><span className={styles.formulaLine}>LeadTime = T<sub>Default / Impairment</sub> − T<sub>Stage2 Entry</sub></span></Formula>
      <p>For each trigger family k, compare DefaultRate<sub>Stage2|Trigger k</sub>, CureRate<sub>Trigger k</sub> and LeadTime<sub>Trigger k</sub>. Analyse trigger intersections and manual overrides. A trigger with low subsequent default may still identify meaningful persistent deterioration early; therefore precision alone is not the objective.</p>
      <Formula label="Conceptual classification trade-off"><span className={styles.formulaLine}>Expected Cost = C<sub>FP</sub>P(FP) + C<sub>FN</sub>P(FN)</span></Formula>
      <p>A false positive recognises lifetime ECL for temporary or non-material deterioration, increasing allowance volatility and review burden. A false negative delays lifetime recognition and management attention. The expression illustrates asymmetric consequences; SICR is not reducible to a statistical classifier optimised on one loss function.</p>
      <p>At reporting date T, reproduce the initial benchmark, current risk, active triggers, stage assignment, model version, macro scenario and override. <Link href="/resources/model-calibration-drift-pd-risk-level">Calibration Drift</Link> is especially important: upward recalibration can raise PD<sub>current</sub>/PD<sub>initial</sub> mechanically. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> and <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> connect production evidence with independent challenge.</p>
    </section>

    <section id="non-bank">
      <h2>High-risk non-bank portfolios need their own SICR architecture</h2>
      <p>In high-risk consumer lending, absolute PDs may already be high, contractual tenors short, early delinquency frequent, cures rapid and portfolio turnover substantial. A staging design copied from a long-duration prime bank portfolio can become either insensitive or so broad that Stage 2 means “almost everybody except Stage 3.”</p>
      <p>Relative measures behave differently at high starting PDs; absolute changes may carry more information, but neither should act alone. Short remaining life can narrow the financial difference between 12-month and lifetime ECL, while high turnover makes entry/exit cohorts and exposure-weighted flows essential. Frequent early delinquency requires separating transient payment behaviour from persistent deterioration without waiting until default is imminent.</p>
      <p>The architecture should remain proportionate, not simplistic: comparable initial and current lifetime risk, product-appropriate behaviour, rapid but governed cure assessment, trigger attribution and outcome testing. <Link href="/resources/high-risk-consumer-lending-risk-adjusted-economics">High-Risk Consumer Lending</Link> provides the wider risk-adjusted economics and control context.</p>
    </section>

    <section id="failure-modes">
      <h2>Twenty-three failure modes that weaken Stage 2</h2>
      <ResourceTable caption="Common SICR failure modes and why they fail" headers={["Failure mode", "Why it fails"]} rows={failureRows}/>
      <p>The recurring pattern is loss of architecture: the baseline disappears, scales become incomparable, evidence is duplicated, flows are hidden or outcomes are never tested. The operational decision logic should remain explicit: <strong>Benchmark → Measure Change → Corroborate Evidence → Assess Materiality → Stage → Monitor Persistence → Validate Outcome.</strong></p>
    </section>

    <section id="agent">
      <h2>A SICR agent should assemble evidence—not make accounting policy</h2>
      <p>A future <strong>SICR &amp; Stage Migration Monitoring Agent</strong> could reconstruct initial-risk benchmarks; ingest current lifetime PD; calculate relative, absolute and log-odds deterioration; track delinquency and approved qualitative signals; incorporate governed forward-looking inputs; identify trigger overlap; attribute Stage 2 entries and exits; produce migration matrices; analyse persistence, vintage and segment behaviour; compare subsequent Stage 3/default outcomes; and reconcile Stage 2 ECL movement.</p>
      <ResourceFigure label="SICR monitoring agent ecosystem" caption="Continuous surveillance and attribution feed specialist measurement and validation workflows while governed humans retain methodology and accounting judgement."><div className={styles.agentFlow}>{["SICR MONITORING AGENT", "LIFETIME PD AGENT", "ECL MONITORING & ATTRIBUTION AGENT", "MODEL VALIDATION AGENT", "HUMAN RISK & ACCOUNTING REVIEW"].map((step, index) => <span className={index === 0 ? styles.agentNode : index === 4 ? styles.humanNode : ""} key={step}>{step}</span>)}</div></ResourceFigure>
      <p>The proposition is <strong>continuous SICR surveillance + Stage migration attribution + validation support</strong>. It must not autonomously determine accounting treatment, invent thresholds or override governed methodology. Recurring value comes from rebuilding the evidence every reporting cycle and presenting exceptions for human review.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects staging design, parameter architecture, validation and portfolio diagnosis. The <Link href="/services/cfo-function">CFO Function</Link> bridge connects migration with allowance, impairment expense and management explanation. The parent <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 Expected Credit Loss architecture</Link> shows why staging is financially consequential; <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/model-calibration-drift-pd-risk-level">Calibration Drift</Link> and <Link href="/resources/credit-risk-model-validation">Model Validation</Link> provide the adjacent evidence system.</p>
      <KeyObservation title="Resolve"><p><strong>Initial Risk → Current Risk → Change in Risk → Evidence → SICR Assessment → Stage Migration → Lifetime ECL.</strong> Stage 2 becomes decision-useful when the organisation can explain the path, reproduce the evidence, test persistence and reconcile the financial consequence.</p></KeyObservation>
    </section>
  </>;
}
