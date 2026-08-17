import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-expected-credit-loss.module.css";

export const ifrs9ExpectedCreditLossSections = [
  { id: "economic-object", label: "The economic object" }, { id: "time", label: "Time-dependent ECL" },
  { id: "staging", label: "Staging and SICR" }, { id: "parameters", label: "PD, LGD and EAD" },
  { id: "loan-example", label: "Lifetime ECL example" }, { id: "scenarios", label: "Forward-looking scenarios" },
  { id: "double-counting", label: "Double-counting risk" }, { id: "attribution", label: "ECL attribution" },
  { id: "portfolio-case", label: "€500m portfolio case" }, { id: "validation", label: "Validation and data" },
  { id: "management", label: "Finance–Risk bridge" }, { id: "non-bank", label: "Non-bank perspective" },
  { id: "agent", label: "ECL Agent architecture" },
] as const;

const architecture = ["Exposure", "Credit Risk State", "Stage / SICR", "PD Term Structure", "LGD Term Structure", "EAD Profile", "Macroeconomic Scenario", "Discounting", "Probability-Weighted ECL", "Portfolio Aggregation", "Finance–Risk Reconciliation", "Attribution", "Validation & Monitoring"];
const validation = ["Definition", "Data", "Staging", "PD", "LGD", "EAD", "Scenario", "Discounting", "Aggregation", "Accounting Reconciliation", "Backtesting", "Sensitivity"];

const failureRows = [
  ["Static PD × LGD × EAD", "Suppresses time, staging, scenarios, exposure dynamics and discounting."],
  ["Cumulative PD used each period", "Counts earlier default risk again in later loss contributions."],
  ["Inconsistent default definitions", "PD frequency and LGD severity no longer refer to the same event."],
  ["Wrong horizon or no survival", "Timing and probability mass become economically incoherent."],
  ["Constant LGD or EAD without evidence", "Ignores recoveries, amortisation, drawdown, prepayment and CCF behaviour."],
  ["Mechanical SICR", "Confuses a measurement judgement with one universal threshold."],
  ["Risk level confused with deterioration", "Misses change since initial recognition—the central SICR comparison."],
  ["Macro non-linearity ignored", "ECL at an average forecast may differ from probability-weighted scenario ECL."],
  ["Scenario weights without sensitivity", "A material modelling judgement is presented as immaterial."],
  ["Macro captured twice", "Staging, parameters and overlays can duplicate the same deterioration."],
  ["Permanent overlays", "Judgement becomes a substitute for diagnosing and repairing limitations."],
  ["Portfolio growth and mix ignored", "Allowance movement is incorrectly described as credit deterioration."],
  ["No attribution or Finance–Risk reconciliation", "The number cannot be translated into management explanation."],
  ["Immature outcomes", "Incomplete defaults or recoveries create misleading backtests."],
  ["No snapshots or version control", "Historical estimates cannot be reproduced or challenged."],
  ["Model output treated as explanation", "A higher number says nothing about which economics changed."],
];

export default function Ifrs9ExpectedCreditLossArticle() {
  return <>
    <p className="resource-lead"><em>IFRS 9 ECL is not PD × LGD × EAD placed inside an accounting formula. It is a forward-looking measurement architecture in which risk definition, horizon, staging, exposure dynamics, recoveries, macroeconomic scenarios and discounting must remain internally coherent.</em></p>

    <section id="economic-object">
      <h2>Expected credit loss begins with a cash-flow shortfall</h2>
      <p>The economic object is the probability-weighted present value of credit losses: the difference between contractual cash flows due and cash flows expected to be received, measured within the applicable IFRS 9 architecture. This starting point matters because it keeps the calculation connected to timing, recoveries and contractual economics before risk parameters are introduced.</p>
      <p>The familiar one-period representation is useful intuition:</p>
      <Formula label="Simplified one-period expected credit loss"><span className={styles.formulaLine}>ECL ≈ PD × LGD × EAD</span></Formula>
      <p><strong>PD</strong> represents the probability that default occurs. <strong>LGD</strong> represents the proportion of exposure expected to be lost conditional on default. <strong>EAD</strong> represents exposure expected to exist when default occurs. Each component is already a modelling problem. For lifetime ECL, each also varies through time.</p>
      <KeyObservation title="The coherence test"><p>A technically credible PD multiplied by an LGD built on another default concept and an EAD profile using another horizon does not create a credible ECL. <strong>Component quality cannot compensate for system incoherence.</strong></p></KeyObservation>
      <ResourceFigure label="Entimema IFRS 9 expected credit loss architecture" caption="The measurement chain connects exposure and credit-risk state to a reproducible allowance, management explanation and continuing evidence."><ol className={styles.architecture}>{architecture.map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol></ResourceFigure>
    </section>

    <section id="time">
      <h2>Lifetime ECL is a time-aligned term structure</h2>
      <Formula label="Discrete time lifetime expected credit loss"><span className={styles.formulaLine}>ECL = Σ<sub>t=1</sub><sup>T</sup> MPD<sub>t</sub> × LGD<sub>t</sub> × EAD<sub>t</sub> × DF<sub>t</sub></span></Formula>
      <p>The period contribution uses <strong>marginal</strong> default probability because losses are summed through time. If cumulative probability is multiplied into every period, default risk already counted in earlier years is counted again.</p>
      <div className={styles.conceptGrid}><article><span>CUMULATIVE PD</span><strong>CPD<sub>t</sub> = P(τ ≤ t)</strong><p>Probability that default has occurred by time t.</p></article><article><span>MARGINAL PD</span><strong>MPD<sub>t</sub> = P(t−1 &lt; τ ≤ t)</strong><p>Probability mass assigned to period t.</p></article></div>
      <Formula label="Marginal probability from a cumulative curve"><span className={styles.formulaLine}>MPD<sub>t</sub> = CPD<sub>t</sub> − CPD<sub>t−1</sub></span></Formula>
      <p>The survival or hazard view makes the same logic explicit. If S<sub>t</sub> = P(τ &gt; t) and h<sub>t</sub> = P(τ = t | τ ≥ t), then MPD<sub>t</sub> = S<sub>t−1</sub>h<sub>t</sub>, with S<sub>t</sub> = ∏<sub>k=1</sub><sup>t</sup>(1−h<sub>k</sub>). Later-period default is possible only if the exposure survived earlier periods.</p>
      <h3>12-month and lifetime ECL are measurement horizons</h3>
      <p>12-month ECL is not simply the cash losses expected to occur during the next twelve months. Conceptually, it reflects lifetime cash shortfalls associated with default events possible within the defined 12-month default horizon. Lifetime ECL includes default probability across the relevant expected life. A scalar lifetime PD remains insufficient because default timing changes EAD, LGD and discounting.</p>
      <p>The lifetime curve—PD<sub>1</sub>, PD<sub>2</sub>, …, PD<sub>T</sub> or CPD(t)—is therefore a term structure, not a single number. Discount factors can be represented conceptually as DF<sub>t</sub> = 1/(1+r)<sup>t</sup>, while actual implementation must follow the applicable effective-interest-rate requirements.</p>
    </section>

    <section id="staging">
      <h2>Staging is a nonlinear measurement switch</h2>
      <div className={styles.stageGrid}><article><span>STAGE 1</span><h3>12-month ECL</h3><p>Broadly performing assets without the relevant significant deterioration requiring lifetime measurement.</p></article><article><span>STAGE 2</span><h3>Lifetime ECL</h3><p>Assets with a significant increase in credit risk under the governed methodology.</p></article><article><span>STAGE 3</span><h3>Credit-impaired</h3><p>Assets requiring the applicable credit-impaired measurement and interest treatment.</p></article></div>
      <p>A Stage 1 → Stage 2 migration changes the loss-recognition horizon. The resulting allowance can move sharply even when borrower economics deteriorate gradually. That non-linearity is a property of the architecture, not automatically a model defect.</p>
      <h3>SICR concerns change since initial recognition</h3>
      <p>Significant increase in credit risk is not merely a current high-risk test. Evidence may include relative and absolute PD movement, delinquency, watchlists, qualitative indicators, restructuring, borrower financial deterioration and macro context. No institution-neutral threshold resolves the judgement.</p>
      <ResourceTable caption="Risk level and deterioration are different questions" headers={["Borrower", "Initial lifetime PD", "Current lifetime PD", "Absolute change", "Relative change", "Interpretive point"]} rows={[
        ["A", "1.0%", "2.5%", "+1.5 pp", "+150%", "Large proportional deterioration from a low starting risk."],
        ["B", "10.0%", "12.0%", "+2.0 pp", "+20%", "Higher current risk and larger absolute movement, but smaller proportional change."],
      ]}/>
      <p>Borrower A can begin low-risk and deteriorate sharply; Borrower B can remain relatively risky without the same proportional deterioration. A staging architecture must combine evidence without converting either absolute or relative change into a universal rule. <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link> provides related deterioration signals, but early warning and SICR remain distinct uses.</p>
    </section>

    <section id="parameters">
      <h2>PD, LGD and EAD must describe the same event and time</h2>
      <h3>Default is the shared boundary</h3>
      <p>The <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link> is not a PD-only choice. PD frequency, LGD recovery population, EAD-at-default observations and Stage 3 logic must refer to a coherent event. If Default<sub>PD</sub> ≠ Default<sub>LGD</sub>, the probability and severity components describe different worlds. Cure, probation and re-default treatment also affect default datasets, lifetime interpretation, staging and recovery measurement.</p>
      <h3>PD: the probability term structure</h3>
      <p>Point-in-time, through-the-cycle, 12-month, lifetime, conditional, marginal and cumulative PD are not interchangeable labels. IFRS 9 measurement should reflect current and forward-looking conditions: PD<sub>PIT</sub> = f(Borrower risk, current conditions, forward-looking information). Pure long-run averages can suppress current risk, while an ungoverned short-run adjustment can create volatility without evidence.</p>
      <h3>LGD: discounted recovery economics</h3>
      <Formula label="Recovery cash-flow view of loss given default"><span className={styles.formulaLine}>LGD = 1 − PV(Expected recoveries net of relevant costs) / EAD</span></Formula>
      <p>LGD depends on cash recoveries, collateral proceeds, collection strategy, legal costs, cure, seniority where relevant, macro conditions and recovery timing. It may change over the lifetime rather than remain a single constant. Realised LGD also remains censored until workout cash flows mature.</p>
      <h3>EAD: exposure when default occurs</h3>
      <p>For amortising loans, EAD<sub>t</sub> may decline through repayments and prepayments. Revolving exposures can rise before default. For undrawn commitments, EAD = Drawn + CCF × Undrawn, where the credit conversion factor is behavioural: distressed borrowers may draw more heavily before default.</p>
      <DecisionImplication><p>For each t, align MPD<sub>t</sub>, LGD<sub>t</sub>, EAD<sub>t</sub> and DF<sub>t</sub>. Models developed independently cannot be combined casually at the end.</p></DecisionImplication>
    </section>

    <section id="loan-example">
      <h2>A four-year loan makes the timing architecture visible</h2>
      <p>Consider an original illustrative €10,000 amortising loan with four years remaining. The table uses hypothetical period-specific parameters and a 5% illustrative discount rate; it is not a recommended methodology.</p>
      <ResourceTable caption="Illustrative lifetime ECL by period" headers={["Year", "Marginal PD", "EAD", "LGD", "DF", "Expected loss contribution"]} rows={[
        ["1", "1.50%", "€9,000", "40%", "0.9524", "€51.43"], ["2", "2.00%", "€7,000", "42%", "0.9070", "€53.33"],
        ["3", "2.30%", "€4,500", "44%", "0.8638", "€39.34"], ["4", "2.20%", "€2,000", "46%", "0.8227", "€16.65"],
      ]}/>
      <Formula label="Reconciled illustrative lifetime ECL"><span className={styles.formulaLine}>Lifetime ECL = €51.43 + €53.33 + €39.34 + €16.65 = <strong>€160.75</strong></span></Formula>
      <p>Year 3 does not multiply a three-year cumulative PD by year-3 exposure. It uses only the default probability assigned to year 3 after survival through earlier periods. Timing also explains why later losses contribute less when exposure amortises and cash shortfalls are discounted, even if marginal risk rises.</p>
    </section>

    <section id="scenarios">
      <h2>Forward-looking ECL is a scenario architecture</h2>
      <p>Current conditions and reasonable and supportable forecasts may involve unemployment, GDP, rates, inflation, property values or sector variables—only where economically relevant. Let scenario weights w<sub>s</sub> sum to one:</p>
      <Formula label="Probability-weighted scenario expected credit loss"><span className={styles.formulaLine}>ECL = Σ<sub>s</sub> w<sub>s</sub>ECL<sub>s</sub></span></Formula>
      <p>If risk parameters respond nonlinearly to macro conditions, ECL(E[X]) need not equal E[ECL(X)]. A severe downside can contribute disproportionately, so probability weighting is not cosmetic averaging.</p>
      <ResourceTable caption="Original illustrative scenario weighting for the four-year loan" headers={["Scenario", "Illustrative ECL", "Weight", "Weighted contribution"]} rows={[
        ["Upside", "€128.00", "20%", "€25.60"], ["Baseline", "€160.75", "60%", "€96.45"], ["Downside", "€251.00", "20%", "€50.20"], ["Weighted ECL", "", "100%", <strong key="scenario-total">€172.25</strong>],
      ]}/>
      <p>Changing the illustrative weights to 10% upside, 50% baseline and 40% downside increases weighted ECL to <strong>€193.58</strong>. The €21.33 movement is scenario-architecture risk, even though the scenario-specific parameter sets did not change.</p>
      <h3>Modelled response and overlays are separate controls</h3>
      <p>A modelled macro effect enters through PD, LGD or EAD under scenarios. A management overlay or post-model adjustment addresses limitations or exceptional conditions outside that response. An overlay can compensate for a model limitation. <strong>It should not become a substitute for understanding that limitation.</strong> Repeated permanent overlays often signal a missing driver, weak scenario design or delayed redevelopment.</p>
    </section>

    <section id="double-counting">
      <h2>The same deterioration must not enter ECL twice</h2>
      <p>Macroeconomic stress may already increase downside PD. Applying an overlay for the same deterioration can count it again. A weakening borrower may migrate to Stage 2, receive lifetime PD, higher downturn LGD and an overlay—all legitimate only if each layer captures a distinct effect.</p>
      <ResourceFigure label="Entimema ECL double-counting diagnostic" caption="Trace one risk driver across the measurement stack before accepting an incremental adjustment."><div className={styles.diagnostic}>{[
        ["DRIVER", "What changed economically?"], ["CAPTURE", "Where is it already reflected?"], ["INCREMENT", "What distinct risk remains?"], ["EVIDENCE", "How is the increment supported?"], ["REVERSAL", "When should it unwind?"],
      ].map(([a,b]) => <article key={a}><span>{a}</span><p>{b}</p></article>)}</div></ResourceFigure>
      <p>The control inventory should identify whether each driver enters staging, PD, LGD, EAD, scenario weights or overlay; whether effects overlap; the evidence for incremental capture; and the release condition. This converts “prudence” from an untraceable multiplier into a governed measurement judgement.</p>
    </section>

    <section id="attribution">
      <h2>Attribution turns an allowance movement into an explanation</h2>
      <Formula label="Conceptual ECL movement attribution"><span className={styles.formulaLine}>ΔECL ≈ Stage + PD + LGD + EAD + Macro + Portfolio + Model + Overlay + Residual</span></Formula>
      <p>The decomposition is conceptual: effects can interact, so an implementation must specify ordering or another controlled allocation method rather than imply universal exact additivity. Its purpose is management interpretation.</p>
      <ResourceFigure label="Entimema ECL attribution architecture from opening to closing allowance" caption="A reproducible bridge distinguishes portfolio mechanics, credit deterioration, model effects and governed judgement."><ol className={styles.attributionFlow}>{["Opening ECL", "Portfolio Movement", "Stage Migration", "PD Effect", "LGD Effect", "EAD Effect", "Macro / Scenario", "Model / Methodology", "Overlay", "Closing ECL"].map((step, i) => <li key={step}><small>{String(i + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol></ResourceFigure>
      <p>Stage migration may dominate because the horizon changes. New business can raise ECL even when risk quality is stable. Runoff and derecognition can reduce it. Product, tenor, channel or customer mix can move allowance without model deterioration—an interpretation connected to <Link href="/resources/population-stability-index-credit-risk-model-monitoring">population drift</Link>.</p>
      <p>A practitioner roll-forward is: <strong>Opening ECL + New business − Derecognition / repayment ± Stage migration ± PD ± LGD ± EAD ± Macro / scenario ± Model change ± Overlay = Closing ECL.</strong> The accounting bridge must additionally consider write-offs, FX where relevant and other applicable movements; closing allowance minus opening allowance is not automatically the simple impairment P&amp;L charge.</p>
    </section>

    <section id="portfolio-case">
      <h2>A fictional €500 million portfolio: what changed and why?</h2>
      <p>Consider an original consumer-lending portfolio at quarter start. The parameters below are deliberately simplified portfolio averages for illustration, not institutional data or recommended assumptions.</p>
      <ResourceTable caption="Opening portfolio ECL by stage" headers={["Stage", "Exposure", "Illustrative risk basis", "LGD", "Opening ECL"]} rows={[
        ["Stage 1", "€350m", "2.0% 12-month PD", "35%", "€2.45m"], ["Stage 2", "€110m", "18.0% lifetime PD", "42%", "€8.32m"], ["Stage 3", "€40m", "55.0% loss expectation", "—", "€22.00m"], ["Total", <strong key="exp">€500m</strong>, "", "", <strong key="ecl">€32.77m</strong>],
      ]}/>
      <p>During the quarter, the portfolio grows, recent digital vintages deteriorate, Stage 2 increases, downside weight rises and LGD remains broadly stable. A controlled bridge produces:</p>
      <ResourceTable caption="Illustrative quarter-over-quarter ECL movement" headers={["Driver", "Movement", "Interpretation"]} rows={[
        ["Opening ECL", "€32.8m", "Rounded opening allowance."], ["New business", "+€1.5m", "Growth, not deterioration."], ["Repayment / derecognition", "−€0.8m", "Runoff and exits."],
        ["Stage migration", "+€4.2m", "Lifetime horizon applied to migrated exposures."], ["PD change", "+€1.6m", "Deterioration concentrated in recent digital vintages."], ["LGD change", "+€0.3m", "Broadly stable severity with small mix effect."],
        ["EAD change", "+€0.4m", "Exposure profile and drawdown movement."], ["Macro / scenario", "+€2.1m", "Greater downside weight and nonlinear response."], ["Overlay", "+€0.5m", "Governed residual uncertainty."], ["Closing ECL", <strong key="close">€41.1m</strong>, "Reconciled closing allowance."],
      ]}/>
      <div className={styles.twoLayer}><article><span>MANAGEMENT / FINANCE</span><h3>“ECL increased by €8.3m.”</h3><p>The reported movement affects allowance, impairment expense interpretation, forecasts and profitability.</p></article><article><span>RISK</span><h3>“Stage migration and scenarios explain most of it.”</h3><p>New business added €1.5m; migration €4.2m; PD €1.6m; scenario change €2.1m; other movements partly offset.</p></article></div>
      <p><Link href="/resources/credit-vintage-analysis">Vintage analysis</Link> isolates cohort effects. Segment views by product, customer, grade, stage, vintage, channel and collateral can deepen diagnosis, but excessive segmentation creates unstable parameters and false narratives.</p>
    </section>

    <section id="validation">
      <h2>Validation challenges the complete measurement system</h2>
      <ResourceFigure label="IFRS 9 ECL validation architecture" caption="Component backtesting is necessary, while aggregation and accounting reconciliation test whether the system remains coherent."><ol className={styles.validationFlow}>{validation.map((step) => <li key={step}>{step}</li>)}</ol></ResourceFigure>
      <p><Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> provides the claim–evidence architecture. For ECL, backtesting compares predicted and observed defaults by horizon, grade, segment and vintage; predicted LGD with sufficiently mature recoveries; predicted EAD and CCF with exposure at default; and Stage 2 behaviour with subsequent deterioration. Lifetime ECL cannot be validated by waiting for one simple realised number—component, cohort and timing evidence is often more informative.</p>
      <p><Link href="/resources/model-calibration-drift-pd-risk-level">Calibration Drift</Link> helps diagnose predicted versus observed defaults; <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> and <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> add production and migration evidence. Incomplete workouts and immature outcomes must be treated as censoring, not convenient zeros.</p>
      <h3>Data, snapshots and versions make evidence reproducible</h3>
      <p>The practical stack is <strong>Contract → Borrower → Payment history → Delinquency → Risk rating / score → Exposure schedule → Collateral / recoveries → Default → Macro variables → Accounting balances</strong>. Stable identifiers and point-in-time joins are essential.</p>
      <p>At reporting date T, reproduce ECL<sub>T</sub> from the data snapshot, PD/LGD/EAD model versions, staging methodology, scenarios, weights, overlays, engine code and accounting mapping. A current-state database cannot reconstruct what was known at an earlier close. Without historical snapshots and versioning, attribution, audit trail and validation become forensic guesswork.</p>
      <h3>Sensitivity identifies dominant drivers</h3>
      <p>Illustrative PD ±10%, LGD ±10% and scenario-weight changes can reveal where ΔECL concentrates; they are not prescribed shocks. ∂ECL/∂PD, ∂ECL/∂LGD and ∂ECL/∂EAD vary by portfolio. A long-duration Stage 2 book can respond very differently from a short-tenor Stage 1 book. Model risk is systemic across parameters, staging, scenarios, overlays and aggregation.</p>
    </section>

    <section id="management">
      <h2>Finance reports the number; Risk must explain its mechanics</h2>
      <ResourceFigure label="Finance and Risk reconciliation chain" caption="The distinctive management layer translates model movements into accounting movement and an evidence-backed explanation."><div className={styles.bridgeFlow}>{["RISK PARAMETER MOVEMENT", "ECL ENGINE", "ACCOUNTING MOVEMENT", "MANAGEMENT EXPLANATION"].map((step) => <span key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Risk produces staging, PD, LGD, EAD and scenario evidence. Finance reports the allowance, impairment charge and balance-sheet movement. A robust close reconciles population, exposure, calculated ECL, controlled adjustments, write-offs and ledger balances before narrative is drafted.</p>
      <p>ECL also connects to budget, forecast, capital planning, profitability and risk appetite. A forward-looking finance function should understand sensitivity before reporting date. Conceptually, ECL<sub>t+h</sub> = f(Portfolio, origination, runoff, risk migration, macro, models). That forecast is a separate future research architecture, but the current measurement system must provide its foundations.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects parameter development, validation and portfolio diagnosis. The <Link href="/services/cfo-function">CFO Function</Link> and <Link href="/services/budgets-and-forecasting">Budgets &amp; Forecasting</Link> bridges connect the allowance with close, performance explanation and forward planning.</p>
    </section>

    <section id="non-bank">
      <h2>Proportional architecture does not mean a flat provision rate</h2>
      <p>For non-bank lenders applying IFRS 9, implementation depth should reflect portfolio size, product complexity, maturity, data history and risk materiality. A smaller lender can use fewer segments, simpler term structures and more focused governance. It still needs coherent default, staging, PD, LGD, EAD, forward-looking information and validation. “Flat rate × balance” without evidence is simplicity without architecture.</p>
      <p>Short-tenor consumer loans behave differently from long-duration assets: contractual maturity can narrow the difference between 12-month and lifetime horizons, but does not remove staging, timing or forward-looking requirements. In higher-default portfolios, calibration, cure, collections treatment and recovery data become especially consequential; LGD can vary materially by treatment path.</p>
      <ResourceTable caption="Common ECL failure modes" headers={["Failure mode", "Why it fails"]} rows={failureRows}/>
    </section>

    <section id="agent">
      <h2>The ECL Agent should reconcile and explain—not approve the estimate</h2>
      <p>A future <strong>IFRS 9 ECL Monitoring &amp; Attribution Agent</strong> could ingest reporting-date snapshots, stage allocation, PD/LGD/EAD parameters and scenarios; reconcile opening and closing portfolios; calculate and attribute movements; identify Stage 1 → Stage 2 migrations; detect unusual parameter changes; compare predicted and realised risk; and prepare Finance–Risk evidence and management explanation.</p>
      <ResourceFigure label="Future IFRS 9 model lifecycle agent architecture" caption="Specialist analytical agents can feed a recurring ECL workflow while validation and final accounting judgement remain governed human responsibilities."><div className={styles.agentFlow}>{["SICR MONITORING AGENT", "LIFETIME PD AGENT", "LGD / RECOVERY AGENT", "EAD / CCF AGENT", "ECL MONITORING & ATTRIBUTION AGENT", "MODEL VALIDATION AGENT", "HUMAN ACCOUNTING & RISK JUDGEMENT"].map((step, index) => <span className={index === 4 ? styles.agentNode : index === 6 ? styles.humanNode : ""} key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Its role is <strong>ECL monitoring + attribution + reconciliation + analytical decision support</strong>. It must not autonomously approve an accounting estimate or replace governed judgement. The repeated reporting cycle makes this a strong recurring workflow: the value lies in controlled evidence assembly and explanation, not generated numbers.</p>
      <p>The existing Engineering research, <Link href="/resources/r-ifrs9-ecl-ai-assisted-provisioning">From R-Based IFRS 9 ECL to an AI-Assisted Provisioning Engine</Link>, shows how deterministic calculation can sit beneath controlled orchestration. This pillar establishes what the system must mean before it is automated.</p>
      <KeyObservation title="Resolve"><p><strong>Measure → Decompose → Diagnose → Challenge → Explain → Validate → Forecast.</strong> ECL becomes decision-useful when the organisation can explain why it changed, reproduce how it was measured and identify which uncertainty still requires judgement.</p></KeyObservation>
    </section>
  </>;
}
