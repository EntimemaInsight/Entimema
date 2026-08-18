import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-ecl-validation.module.css";

export const ifrs9EclValidationSections = [
  { id: "problem", label: "What can be backtested" }, { id: "reconstruction", label: "Ex-ante reconstruction" },
  { id: "components", label: "Component validation" }, { id: "staging", label: "SICR and boundaries" },
  { id: "macro", label: "Macro challenge" }, { id: "engine", label: "Engine reconciliation" },
  { id: "portfolio", label: "Static pools and attribution" }, { id: "materiality", label: "Sensitivity and materiality" },
  { id: "evidence", label: "Evidence convergence" }, { id: "case-study", label: "End-to-end case" },
  { id: "operating-model", label: "Operating model" }, { id: "failures", label: "Failure modes" },
  { id: "agent", label: "ECL Validation Agent" },
] as const;

const validationArchitecture = ["Historical Reporting Snapshot", "Reconstruct Ex-Ante ECL", "PD Validation", "Lifetime PD Timing", "LGD Recovery Validation", "EAD / CCF Validation", "SICR / Stage Validation", "Macro / Scenario Challenge", "ECL Engine Reconciliation", "Static-Pool Backtest", "ECL Attribution", "Financial Materiality", "Validation Conclusion", "Monitoring / Remediation"];

const evidenceRows = [
  ["PD", "Are defaults correctly quantified?", "O/E, calibration intercept and slope", "Persistent underprediction", "Recalibrate after diagnosis"],
  ["Lifetime PD", "Are level and timing correct?", "Marginal and cumulative cohort backtests", "Right total, wrong curve shape", "Term-structure review"],
  ["LGD", "Are loss and recovery timing correct?", "Workout vintages, cash-flow curves, censoring", "Recovery level or timing bias", "LGD recovery review"],
  ["EAD / CCF", "Is exposure at default forecast correctly?", "Predicted versus realised EAD and utilisation", "Pre-default utilisation bias", "EAD / CCF review"],
  ["SICR", "Is deterioration recognised early and stably?", "Migration, lead time, cure and boundary density", "Late or volatile Stage 2", "SICR review"],
  ["Macro", "Is transmission coherent?", "Historical, sensitivity and scenario evidence", "Unstable or implausible response", "Macro model review"],
  ["Engine", "Are calculations implemented correctly?", "Account replay and golden portfolio", "Numerical reconciliation error", "Implementation remediation"],
  ["Finance", "Is allowance movement explainable?", "Roll-forward and attribution", "Large unexplained residual", "Joint investigation"],
];

const failures = [
  ["Compare total ECL with next year’s realised loss", "Different horizons, populations and timing bases make the comparison structurally misaligned."],
  ["Treat backtesting as full validation", "Outcome comparison does not establish methodology, implementation, governance or intended-use fitness."],
  ["Use hindsight information", "It replaces the reporting-date estimate with knowledge unavailable when the decision was made."],
  ["Keep no historical snapshots", "The original population, stage, model, scenario and overlay cannot be reconstructed."],
  ["Replay old periods through today’s model", "Model change is confused with historical predictive performance."],
  ["Ignore outcome maturity", "Incomplete default and recovery windows are treated as final outcomes."],
  ["Treat censored cases as fully observed", "Open workouts and incomplete horizons bias PD and LGD evidence."],
  ["Validate lifetime PD only at its final level", "A plausible cumulative total can conceal materially wrong default timing."],
  ["Validate final LGD but not recovery timing", "Equal nominal recovery can produce different discounted economic loss."],
  ["Ignore EAD / CCF", "Pre-default drawdown and amortisation errors remain hidden inside aggregate loss."],
  ["Treat Stage 2 as a binary prediction model", "SICR is a relative deterioration architecture, not simply a future-default classifier."],
  ["Judge scenarios by whether baseline occurred", "Scenarios represent a weighted distribution, not a promise that one named path will happen."],
  ["Ignore parameter interactions", "Joint PD, LGD, EAD, stage and scenario effects are mistaken for independent movements."],
  ["Accept compensating errors", "A correct aggregate may result from wrong components offsetting each other."],
  ["Validate only aggregate ECL", "Component, segment and timing defects disappear in portfolio averaging."],
  ["Use no static pools", "Changing composition is confused with model performance."],
  ["Confuse attribution with backtesting", "Explaining movement does not test whether the original estimate was accurate."],
  ["Omit Finance–Risk–ledger reconciliation", "Technical evidence never reaches the reported allowance or accounting movements."],
  ["Use no golden portfolio", "Implementation defects can recur without an executable expected result."],
  ["Ignore staging boundaries", "Small threshold defects can switch an exposure from 12-month to lifetime loss."],
  ["Ignore financial materiality", "Statistical weakness is reported without showing its allowance consequence."],
  ["Overfit recalibration to the latest period", "Historical fit improves at the expense of stability and future transfer."],
  ["Issue PASS / FAIL without limitations", "Management cannot see scope, uncertainty, required action or monitored conditions."],
  ["Assume one evidence maturity date", "EAD, PD, lifetime PD and LGD outcomes become observable at different speeds."],
];

export default function Ifrs9EclValidationArticle() {
  return <>
    <p className="resource-lead"><em>Expected credit loss cannot be validated by placing one reported allowance beside one later loss number. Trust must be reconstructed from the original prediction, aligned to mature outcomes, tested component by component, reconciled through the engine and translated into financial materiality.</em></p>

    <section id="problem">
      <h2>Aggregate ECL is not one forecast with one outcome</h2>
      <p>A reporting-date allowance contains overlapping claims about default incidence, default timing, recovery amount, recovery timing, exposure, significant increase in credit risk, future economic states, discounting and implementation. The observed loss that later arrives is shaped by collections, cures, write-offs, sales, policy, new lending and incomplete workouts. A simple ECL-versus-loss ratio therefore mixes model error, timing, composition and accounting effects.</p>
      <Formula label="Scenario-weighted expected credit loss"><span className={styles.formulaLine}>ECL = Σ<sub>s</sub> w<sub>s</sub>[Σ<sub>t</sub> MPD<sub>t,s</sub> × LGD<sub>t,s</sub> × EAD<sub>t,s</sub> × DF<sub>t</sub>]</span></Formula>
      <p>Each term has a different evidential clock. Twelve-month PD needs a complete twelve-month performance window. Lifetime PD needs progressively maturing cohorts. EAD is often observable around default. Workout LGD may remain censored for years. Stage 2 effectiveness may be examined earlier through migration and lead time, but its lifetime loss estimate still needs later outcomes.</p>
      <KeyObservation title="Validation lag"><p><strong>There is no single maturity date for the entire ECL framework.</strong> Validation must state which evidence is mature, emerging or unavailable rather than forcing all components into one backtest date.</p></KeyObservation>
      <ResourceFigure label="ECL evidence maturity map" caption="Indicative ordering only: actual evidence speed depends on product horizon, default definition and workout process."><div className={styles.maturity}>{[["FAST", "Stage migration", "Early deterioration and cure"], ["FAST / MEDIUM", "EAD", "Balance and utilisation at default"], ["MEDIUM", "12-month PD", "Complete default horizon"], ["LONGER", "Lifetime PD", "Cohort-level timing and cumulative default"], ["POTENTIALLY LONGEST", "LGD", "Recovery cash flows, costs and closure"]].map(([a,b,c]) => <article key={b}><span>{a}</span><strong>{b}</strong><p>{c}</p></article>)}</div></ResourceFigure>
      <EntimemaFramework title="ECL Validation Architecture" description="Prediction is reconstructed before evidence is interpreted." steps={validationArchitecture}/>
    </section>

    <section id="reconstruction">
      <h2>Backtesting begins with the historical reporting snapshot</h2>
      <p>For reporting date T, preserve the population, balances, contractual schedules, stages, parameter term structures, scenarios, weights, overlays, discount rates, model versions, code version and final booked allowance. Reconstruct ECL using only information available at T. The central question is not “what would today’s model have predicted then?” but “what did the governed system predict then, and what subsequently became observable?”</p>
      <div className={styles.snapshotGrid}>{[["01", "Population", "Account, product, segment, balance and remaining maturity"], ["02", "Decision state", "Stage, SICR triggers, arrears and overrides"], ["03", "Models", "PD, LGD, EAD, macro and engine versions"], ["04", "Judgement", "Scenario paths, weights, overlays and approvals"], ["05", "Result", "Account ECL, allowance, ledger mapping and reporting total"], ["06", "Outcome", "Defaults, exposures, recoveries, write-offs and censoring"]].map(([n,a,b]) => <article key={a}><span>{n}</span><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>Freeze cohorts by the original reporting population. Then align prediction and outcome at account, segment, vintage and portfolio level. Exclude new originations from a static-pool comparison; retain exits with an explicit treatment; distinguish paid-off, sold, cured, defaulted, written-off and still-open cases. This makes evidence reproducible and prevents survivor bias.</p>
      <DecisionImplication><p><strong>Historical snapshots are validation infrastructure.</strong> Without them, apparent backtesting becomes a retrospective simulation whose model, information set and population differ from the original estimate.</p></DecisionImplication>
    </section>

    <section id="components">
      <h2>Validate level, timing and interaction at component level</h2>
      <h3>PD: observed-to-expected is a starting point</h3>
      <Formula label="Observed-to-expected default ratio"><span className={styles.formulaLine}>O/E = Observed Defaults ÷ Expected Defaults</span></Formula>
      <p>Compare counts and exposure-weighted rates by grade, segment, vintage and horizon. Add calibration intercept and slope, uncertainty intervals and persistence. An O/E of 1.24 alongside broadly stable Gini says ordering may remain useful while absolute risk is understated; it does not by itself identify the cause or prescribe a recalibration.</p>
      <h3>Lifetime PD: final level and curve timing are separate claims</h3>
      <ResourceTable caption="Lifetime PD level × timing validation matrix" headers={["Final cumulative level", "Default timing", "Interpretation", "Potential response"]} rows={[["Aligned", "Aligned", "Level and marginal curve broadly supported", "Continue monitoring"], ["Aligned", "Defaults emerge earlier", "Total risk plausible; discounted loss and stage economics misstated", "Reshape term structure"], ["Too low", "Timing aligned", "Systematic lifetime calibration weakness", "Recalibrate level"], ["Too low", "Earlier than predicted", "Both calibration and curve shape deteriorate", "Broader lifetime PD remediation"]]}/>
      <p>Backtest cumulative PD by horizon and marginal PD by period, preserving survival identities. A model can predict the correct five-year cumulative default but place too much risk in years four and five. Because ECL is discounted and EAD/LGD vary through time, this is financially different from predicting defaults in years one and two.</p>
      <h3>LGD: recovery amount and recovery speed both matter</h3>
      <Formula label="Discounted workout LGD"><span className={styles.formulaLine}>LGD = 1 − [Σ<sub>t</sub>(Recovery<sub>t</sub> − Cost<sub>t</sub>) × DF<sub>t</sub>] ÷ EAD<sub>default</sub></span></Formula>
      <p>Rebuild recovery curves by default vintage, security, strategy and resolution state. Compare predicted and realised cumulative net recovery at common months-since-default, recognise open-workout censoring, and separate cure, collateral proceeds, unsecured collections and costs. The same final nominal recovery arriving six months later produces a larger discounted loss.</p>
      <h3>EAD and CCF: test borrower behaviour before default</h3>
      <p>For amortising products, compare contractual and behavioural balance paths, prepayment and arrears capitalisation. For revolving facilities, compare predicted and realised utilisation, undrawn commitment, drawdown timing and CCF by months-to-default. A stable current balance does not validate a forecast of exposure at default.</p>
      <ResourceTable caption="Component backtest workplan" headers={["Component", "Prediction unit", "Outcome alignment", "Primary diagnostic", "Maturity concern"]} rows={[["12m PD", "Default probability at observation date", "Same cohort over full 12 months", "O/E and calibration", "Incomplete recent horizons"], ["Lifetime PD", "Marginal and cumulative term structure", "Cohort by months-on-book / horizon", "Curve level and timing", "Long residual maturities"], ["LGD", "Discounted net recovery process", "Months since default", "Recovery vintage curves", "Open workouts / censoring"], ["EAD / CCF", "Exposure path to default", "Balance and facility at default", "EAD error and utilisation", "Limit and policy changes"]]}/>
    </section>

    <section id="staging">
      <h2>SICR validation asks whether deterioration is recognised early, consistently and usefully</h2>
      <p>Stage 2 is not a conventional binary target. Test whether it identifies a population with materially higher lifetime risk, whether migration occurs before default with useful lead time, whether cure is credible, and whether triggers create stable economic differentiation rather than short-lived noise. Analyse Stage 1→2, Stage 2→1 and Stage 2→3 by trigger, product, vintage and reporting date.</p>
      <Formula label="Boundary test around a staging threshold c"><span className={styles.formulaLine}>c − ε &nbsp; | &nbsp; c &nbsp; | &nbsp; c + ε</span></Formula>
      <p>Two economically similar borrowers immediately around a SICR threshold may receive 12-month and lifetime ECL. The allowance difference can be large while the measured risk difference is tiny. Test exact threshold implementation, sensitivity to small changes, population density around the threshold and stability through time.</p>
      <Formula label="ECL decision density"><span className={styles.formulaLine}>Boundary Materiality ∝ f<sub>R</sub>(c) × Horizon Switch × Exposure</span></Formula>
      <KeyObservation title="ECL decision density"><p>Where many exposures sit close to a staging or parameter boundary, a small methodological or implementation change can generate a large allowance movement. Threshold quality cannot be separated from population density.</p></KeyObservation>
    </section>

    <section id="macro">
      <h2>Scenario validation challenges transmission—not whether the baseline “won”</h2>
      <p>At the historical reporting date, retain the scenario paths and weights actually used. Test whether narratives were internally coherent, variables moved plausibly together, PD/LGD/EAD responses had defensible signs and lags, and scenario-specific ECL was calculated before weighting. Later realised macro data can evaluate forecast and transmission evidence, but should not be inserted into the old model and presented as the original prediction.</p>
      <ResourceTable caption="Macro and scenario challenge" headers={["Question", "Evidence", "Failure signal"]} rows={[["Were paths coherent ex ante?", "Archived narratives, variables and forecast provenance", "Internally inconsistent economic state"], ["Was credit transmission plausible?", "Signs, lags, nonlinear response and segment sensitivity", "Unstable or economically reversed response"], ["Did weighting capture uncertainty?", "Contributions and alternative-weight sensitivity", "Allowance dominated by opaque judgement"], ["Was risk counted once?", "SICR, parameter and overlay map", "Same deterioration repeated across layers"], ["Can the estimate be replayed?", "Scenario/model/version archive", "Historical ECL cannot be reproduced"]]}/>
      <p>A downside weight shock of ±10 percentage points can be an informative original sensitivity, but it is not a required stress magnitude. Scenario choice and sensitivity must follow the portfolio’s nonlinear response and decision need. See <Link href="/resources/forward-looking-macroeconomic-scenarios-ifrs-9">Forward-Looking Macroeconomic Scenarios</Link> for the full transmission architecture.</p>
    </section>

    <section id="engine">
      <h2>The aggregate ECL engine requires independent numerical validation</h2>
      <p>For representative records, reproduce each period and scenario outside the production engine. Confirm marginal PD, survival, EAD, LGD, discount factor, period convention, scenario weight and loss contribution. Reconcile exactly or to a documented precision tolerance; an unexplained difference is not made acceptable by an approximately correct portfolio total.</p>
      <ResourceTable caption="Illustrative independent account-level reconciliation workpaper" headers={["Stage", "Period", "Marginal PD", "Survival", "EAD", "LGD", "DF", "Scenario", "Weight", "Loss contribution"]} rows={[["2", "1", "1.80%", "100.00%", "€98,000", "42%", "0.9615", "Baseline", "60%", "€427.44"], ["2", "2", "2.25%", "98.20%", "€84,000", "43%", "0.9246", "Baseline", "60%", "€450.83"], ["2", "1", "3.50%", "100.00%", "€100,000", "49%", "0.9615", "Downside", "25%", "€412.14"], ["2", "2", "4.60%", "96.50%", "€89,000", "51%", "0.9246", "Downside", "25%", "€506.21"], ["—", "Selected lines", "—", "—", "—", "—", "—", "—", "—", <strong key="subtotal">€1,796.62</strong>]]}/>
      <p>The table is deliberately a workpaper excerpt, not a complete account result: every omitted period and scenario must also be reproduced before reconciling to reported account ECL. Validate discount-rate definition, effective interest rate mapping, cash-flow timing, recovery timing and periodicity. Small convention differences can become material for long Stage 2 horizons, delayed recoveries and large balances.</p>
      <h3>A golden portfolio makes integration validation executable</h3>
      <p>Maintain controlled records spanning Stage 1, Stage 2, methodologically appropriate Stage 3, amortising and revolving exposures, secured and unsecured cases, prepayment, multiple scenarios, missing values and exact boundaries. Store expected parameters, contributions and final ECL. Run the portfolio on each release and investigate every tolerance breach.</p>
    </section>

    <section id="portfolio">
      <h2>Static pools separate outcome evidence from changing portfolio composition</h2>
      <p>Freeze the reporting-date population and follow its outcomes. Compare original ECL with mature loss evidence at consistent horizons, then stratify by original stage, product, risk band, vintage and security. Dynamic portfolio totals include new lending, repayments and mix change; they answer a finance movement question, not the same validation question.</p>
      <Formula label="Allowance roll-forward architecture"><span className={styles.formulaLine}>Closing ECL = Opening ECL + New Business − Derecognition + Stage + PD + LGD + EAD + Macro + Model Change + Other + Residual</span></Formula>
      <p>Attribution explains why allowance moved; backtesting evaluates an earlier prediction against later evidence. Both are needed, but they are not interchangeable. Separate economic change from methodology change through parallel runs of old and new methods on the same reporting-date population.</p>
      <Formula label="Conceptual model-change attribution"><span className={styles.formulaLine}>ΔECL<sub>model</sub> = PD Model + LGD Model + EAD Model + SICR + Macro Model + Interaction</span></Formula>
      <p>Do not imply exact additivity unless the chosen sequential, Shapley or other decomposition supports it. Order effects and interactions can be material. A large unexplained quarter-over-quarter residual is evidence requiring investigation, not merely a balancing line to be forced to zero.</p>
      <ResourceFigure label="Finance Risk Accounting triangulation" caption="Three views answer different questions but must meet at the same reported allowance."><div className={styles.triangulation}>{[["RISK", "PD · LGD · EAD · staging · scenarios"], ["FINANCE", "Impairment charge · allowance movement · forecast impact"], ["ACCOUNTING / LEDGER", "Opening · movements · write-offs · recoveries · closing"]].map(([a,b]) => <article key={a}><span>{a}</span><p>{b}</p></article>)}</div></ResourceFigure>
    </section>

    <section id="materiality">
      <h2>Statistical error becomes a finding only through portfolio economics</h2>
      <Formula label="Parameter error propagation"><span className={styles.formulaLine}>ΔECL = f(ΔPD, ΔLGD, ΔEAD, Stage, Scenario, Horizon, Interactions)</span></Formula>
      <p>A 10% PD understatement does not imply a 10% ECL understatement. The effect depends on stage, exposure profile, LGD, scenario, horizon and other parameters. The same shock can be modest in a short-tenor Stage 1 portfolio and material in long-duration Stage 2 unsecured lending.</p>
      <ResourceTable caption="Original illustrative sensitivity framework—not required or standard stress magnitudes" headers={["Sensitivity", "Illustrative change", "Stage 1 short tenor", "Stage 2 long duration", "Interpretive purpose"]} rows={[["PD", "±10% relative", "Usually concentrated in 12 months", "Propagates across lifetime curve", "Level and horizon dominance"], ["LGD", "±5 percentage points", "Depends on default incidence", "Amplifies lifetime defaults", "Severity dominance"], ["CCF", "±10 percentage points", "Material for undrawn revolving lines", "Can compound with longer exposure", "Utilisation dominance"], ["Downside weight", "±10 percentage points", "Depends on scenario spread", "Can be highly nonlinear", "Judgement sensitivity"]]}/>
      <p>Calculate account or segment ECL under each governed perturbation, then report absolute and percentage ΔECL, affected exposure and interaction caveats. These magnitudes are examples only. A secured portfolio may be dominated by collateral recovery timing; a revolving book by CCF; a large Stage 2 book by lifetime PD.</p>
      <KeyObservation title="Portfolio-specific materiality"><p><strong>Parameter materiality cannot be assessed independently of portfolio structure.</strong> Prioritise validation where Materiality × Uncertainty is greatest.</p></KeyObservation>
      <Formula label="Uncertainty budget as governance architecture"><span className={styles.formulaLine}>Total Uncertainty = f(PD, LGD, EAD, SICR, Macro, Data, Implementation)</span></Formula>
      <p>This is not a universal statistical identity. It is a governance map: identify where uncertainty is concentrated, which evidence can reduce it, and what decision margin remains. The objective is not to pretend uncertainty is zero.</p>
    </section>

    <section id="evidence">
      <h2>Trust is constructed from converging—and sometimes contradictory—evidence</h2>
      <ResourceFigure label="ECL evidence architecture" caption="One threshold cannot establish trust; evidence is accumulated, challenged and translated into action."><div className={styles.evidenceFlow}>{["Prediction", "Outcome", "Component evidence", "Contradictory evidence", "Attribution", "Materiality", "Trust / remediation"].map((item) => <span key={item}>{item}</span>)}</div></ResourceFigure>
      <p>PD O/E rising, a worsening calibration intercept, increased Stage 2→3 migration and deteriorating recent vintages together provide stronger evidence of systematic deterioration than any isolated metric. Conversely, evidence can disagree—and disagreement is often diagnostic.</p>
      <ResourceTable caption="Contradictory-evidence scenarios" headers={["Scenario", "Observed evidence", "Why the aggregate conclusion is unsafe", "Validation response"]} rows={[["A", "PD backtesting weak; total ECL near realised loss", "LGD or EAD overstatement may offset PD understatement", "Retain component finding; quantify compensation"], ["B", "Total ECL differs; components perform well", "Portfolio movement, event timing or unusual loss may dominate", "Reconcile cohort and attribution"], ["C", "SICR leads deterioration; Stage 2 ECL overestimates", "Stage identification and loss calibration are separate claims", "Separate staging and measurement conclusions"]]}/>
      <Formula label="Compensating errors"><span className={styles.formulaLine}>Correct Aggregate ⇏ Correct Components</span></Formula>
      <p>If PD<sub>pred</sub> &lt; PD<sub>actual</sub> while LGD<sub>pred</sub> &gt; LGD<sub>actual</sub>, total ECL may look accurate. <strong>Offsetting errors do not create a valid model.</strong> They create an unstable aggregate whose apparent accuracy can disappear when portfolio mix changes.</p>
      <ResourceTable caption="Validation evidence matrix" headers={["Domain", "Question", "Evidence", "Failure signal", "Possible response"]} rows={evidenceRows}/>
      <div className={styles.heatmap} role="img" aria-label="Validation heatmap concept across performance, stability, materiality and evidence maturity"><div></div>{["PERFORMANCE", "STABILITY", "MATERIALITY", "EVIDENCE MATURITY"].map(x => <strong key={x}>{x}</strong>)}{["PD", "LGD", "EAD", "SICR", "MACRO", "ENGINE", "DATA"].flatMap((row) => [<b key={`${row}-h`}>{row}</b>, ...["Assessment", "Trend", "€ impact", "Maturity"].map((x,i) => <span key={`${row}-${i}`}>{x}</span>)])}</div>
      <p>The heatmap is a governed evidence index, not an arbitrary traffic light. Each cell should link to defined methodology, period, metric, uncertainty and reviewer conclusion.</p>
    </section>

    <section id="case-study">
      <h2>Northstar Finance: an end-to-end €750 million validation</h2>
      <p>Northstar is a fictional consumer lender with €570m Stage 1, €145m Stage 2 and €35m Stage 3 exposure. Its portfolio combines instalment loans and revolving credit. Historical snapshots, model versions and account outcomes are available; the newest LGD workouts remain partly censored.</p>
      <div className={styles.caseGrid}>{[["PD", "12-month O/E rises 1.02 → 1.24 while Gini remains broadly stable.", "Ranking remains useful; absolute risk has drifted. PD recalibration is required."], ["LIFETIME PD", "Final cumulative level is plausible, but defaults emerge earlier than predicted.", "Correct the marginal curve timing; the discounted ECL impact is separate from final level."], ["LGD", "Final recovery is broadly aligned, but cash arrives six months later.", "Recalibrate recovery speed and retain a censoring limitation for open cases."], ["EAD / CCF", "Credit-card CCF underpredicts utilisation immediately before default.", "Remediate revolving EAD; fixed instalment EAD remains supported."], ["SICR", "Stage 2 is riskier and leads default, but one trigger creates short-lived migration.", "Keep the architecture; review that trigger’s threshold and cure behaviour."], ["MACRO", "Downside response is directional and stable across material segments.", "Retain with weight sensitivity and ongoing limited-cycle caveat."]].map(([a,b,c]) => <article key={a}><span>{a}</span><p>{b}</p><strong>{c}</strong></article>)}</div>
      <ResourceTable caption="Illustrative financial impact of Northstar findings" headers={["Finding", "Controlled challenger impact", "Interpretation"]} rows={[["PD recalibration", "+€2.4m", "Corrects absolute default-rate understatement"], ["Earlier lifetime-default timing", "+€0.8m", "Accelerates discounted loss recognition"], ["LGD recovery speed", "+€0.5m", "Reflects later discounted cash recovery"], ["Revolving EAD correction", "+€0.7m", "Captures pre-default utilisation"], ["Gross standalone indications", "+€4.4m", "Not the final booked adjustment: interaction and scope remain"]]}/>
      <p>Northstar should run a controlled integrated challenger because standalone impacts do not guarantee exact additivity. PD timing changes which balances and LGDs are encountered; Stage 2 movement changes horizon; macro response may interact with all three. The final conclusion is not “ECL model failed.”</p>
      <DecisionImplication><p><strong>Fit subject to material remediation:</strong> core ranking, fixed-loan EAD, broad SICR differentiation and macro direction remain trustworthy. PD calibration, lifetime timing, LGD recovery speed and revolving EAD require remediation; one SICR trigger requires review; an integrated challenger must quantify the allowance effect before accounting action.</p></DecisionImplication>
    </section>

    <section id="operating-model">
      <h2>Validation output must serve management, Finance and validators without losing precision</h2>
      <div className={styles.audienceGrid}>{[["MANAGEMENT", "What remains trustworthy? What changed? Where is evidence weak? What is the financial effect? What must change and be monitored?"], ["FINANCE", "Expected allowance and impairment-charge effect, reporting implications, methodology change, uncertainty and forecast consequence."], ["VALIDATOR", "Datasets, tests, metrics, assumptions, reconciliations, sensitivities, contradictory evidence, limitations and reproducible workpapers."]].map(([a,b]) => <article key={a}><span>{a}</span><p>{b}</p></article>)}</div>
      <p>Classify findings using the institution’s convention, based on methodological weakness, financial materiality, persistence, uncertainty and affected exposure. Avoid invented regulatory terminology. Conclusions may be fit for intended use, fit subject to recalibration, fit subject to data remediation, restricted use, material methodology remediation required or redevelopment required. Every conclusion should state evidence, limitation, impact, action and monitoring.</p>
      <p>Validation frequency follows risk: initial validation, periodic deep review, reporting-cycle monitoring and event-driven review. Triggers include material ECL movement, persistent O/E drift, recovery deterioration, utilisation shift, Stage 2 volatility, scenario change, methodology change and product or portfolio change. A failed backtest should not trigger retrofitting until history matches perfectly; future performance, stability, interpretation and governance matter.</p>
      <h3>Proportionality changes architecture, not evidential integrity</h3>
      <p>Smaller and non-bank lenders need not imitate the bureaucracy of a global bank. They still need evidence around default, lifetime PD, recovery, exposure, staging, forward-looking information and reconciliation. <strong>Proportional validation means simpler architecture where justified—not weaker evidence.</strong></p>
      <p>High-risk consumer portfolios may produce defaults and learning loops faster, but collections strategy can move LGD materially. Short-tenor books may mature lifetime PD quickly and have simpler fixed-loan EAD. Their validation should follow actual product economics rather than import unnecessary long-duration complexity.</p>
      <h3>Challengers should target the diagnosed weakness</h3>
      <ResourceTable caption="Recalibration, remediation or redevelopment—evidence-led, not automatic" headers={["Evidence pattern", "Potential response"]} rows={[["PD ranking stable; calibration drift", "PD recalibration after cause and stability review"], ["LGD recovery timing wrong", "Recovery-curve recalibration or redevelopment"], ["EAD utilisation behaviour changed", "CCF / EAD recalibration"], ["SICR instability", "Trigger and staging methodology review"], ["Multiple connected components deteriorate", "Broader framework redevelopment assessment"]]}/>
      <p>Compare challengers on historical and out-of-time evidence, ECL impact, stability, conceptual soundness and implementation risk. Parallel-run material changes on the same reporting-date population and separate economic change from methodology change.</p>
    </section>

    <section id="failures">
      <h2>Twenty-four failure modes that create false assurance</h2>
      <ResourceTable caption="ECL validation failure-mode register" headers={["Failure mode", "Why it fails"]} rows={failures}/>
      <ResourceFigure label="Operational ECL validation workflow" caption="A recurring operating workflow converts archived predictions and mature outcomes into governed action."><div className={styles.workflow}>{["Historical snapshots", "Prediction archive", "Mature outcomes", "Component backtests", "Stage backtests", "Scenario challenge", "ECL reconciliation", "Sensitivities", "Finding assessment", "Finance–Risk attribution", "Validation report", "Monitoring plan"].map((x,i) => <span key={x}><small>{String(i+1).padStart(2,"0")}</small>{x}</span>)}</div></ResourceFigure>
    </section>

    <section id="agent">
      <h2>An IFRS 9 ECL Validation Agent can assemble evidence without owning judgement</h2>
      <p>A future controlled agent could ingest historical reporting snapshots, retrieve model and scenario versions, reconstruct historical ECL, identify mature cohorts, perform PD O/E and calibration tests, validate lifetime level and timing, rebuild recovery curves, backtest LGD and EAD/CCF, analyse Stage 2 migration and lead time, challenge macro evidence, execute the golden portfolio, calculate roll-forwards, identify compensating errors, run sensitivities and draft findings for human review.</p>
      <ResourceFigure label="Entimema IFRS 9 Agent Stack" caption="Specialist evidence flows upward through monitoring and validation; accountable approval remains human."><div className={styles.agentStack}><div>{["Lifetime PD Agent", "LGD & Recovery Agent", "EAD & Utilisation Agent", "SICR Agent", "Macro Scenario Agent"].map(x => <span key={x}>{x}</span>)}</div><strong>ECL Monitoring &amp; Attribution Agent</strong><strong>ECL Validation Agent</strong><strong>Model Validation Agent</strong><em>Human accounting and model authority</em></div></ResourceFigure>
      <p>Its role is <strong>validation automation + evidence assembly + reconciliation + analytical challenge support</strong>. It must not autonomously approve an accounting estimate, sign off a model, determine regulatory compliance or replace independent professional judgement.</p>
      <p>This article completes the first IFRS 9 research architecture: <Link href="/resources/ifrs-9-expected-credit-loss-architecture">Expected Credit Loss</Link>, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR</Link>, <Link href="/resources/lifetime-pd-term-structures-ifrs-9">Lifetime PD</Link>, <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">LGD</Link>, <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD &amp; CCF</Link>, <Link href="/resources/forward-looking-macroeconomic-scenarios-ifrs-9">Forward-Looking Scenarios</Link> and ECL Validation &amp; Backtesting. Supporting evidence connects to <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link>, <Link href="/resources/model-calibration-drift-pd-risk-level">Model Calibration Drift</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>.</p>
      <p>Entimema’s <Link href="/services/credit-risk">Credit Risk</Link> work connects component methodology and independent validation; <Link href="/services/cfo-function">CFO &amp; Finance</Link> connects that evidence to allowance, impairment and forecast decisions.</p>
      <KeyObservation title="Resolve"><p>ECL deserves trust only when the original prediction can be reconstructed, its components survive time-aligned challenge, contradictions are explained, engine results reconcile and remaining uncertainty is financially understood.</p></KeyObservation>
    </section>
  </>;
}
