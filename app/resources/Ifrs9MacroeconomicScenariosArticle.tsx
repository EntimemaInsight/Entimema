import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-macroeconomic-scenarios.module.css";

export const ifrs9MacroeconomicScenariosSections = [
  { id: "architecture", label: "Forward-looking architecture" }, { id: "nonlinearity", label: "Why averaging fails" },
  { id: "scenario-design", label: "Scenario design" }, { id: "macro-model", label: "Macro transmission" },
  { id: "scenario-ecl", label: "Scenario-specific ECL" }, { id: "contribution", label: "Contribution and sensitivity" },
  { id: "horizon", label: "Forecast horizon" }, { id: "sicr", label: "SICR and double counting" },
  { id: "overlays", label: "Management overlays" }, { id: "attribution", label: "Attribution and reproducibility" },
  { id: "validation", label: "Validation and challenge" }, { id: "non-bank", label: "Non-bank portfolios" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Macro Scenario Agent" },
] as const;

const architecture = ["Macroeconomic Narrative", "Scenario Paths", "Likelihood / Weights", "PD Response", "LGD Response", "EAD Response", "SICR / Stage Impact", "Scenario-Specific ECL", "Probability Weighting", "Overlay Assessment", "ECL Attribution", "Validation & Governance"];
const failures = [
  ["Overlay-only forward-looking information", "Leaves modelled PD, LGD, EAD and staging disconnected from economic risk."],
  ["Averaging macro inputs first", "Suppresses material convexity and tail-loss response."],
  ["Weighting PD alone", "Misses co-movement in severity and exposure."],
  ["Incoherent scenario variables", "Creates an economic state with no defensible joint narrative."],
  ["Correlated-variable accumulation", "Duplicates information and destabilises coefficients."],
  ["Significance-led selection", "Mistakes a historical p-value for economic transmission."],
  ["Ignoring limited cycles", "Presents sparse macro evidence as if millions of accounts created many recessions."],
  ["Excessive complexity or wrong lags", "Fits noise, obscures causality and weakens out-of-time transfer."],
  ["One sensitivity for every segment", "Ignores materially different product and borrower economics."],
  ["Unlimited forecast confidence", "Treats year ten as if it were forecast with year-one support."],
  ["Fixed or mechanically precise weights", "Conceals judgement and changing forecast uncertainty."],
  ["SICR + parameters + overlay duplication", "Counts the same deterioration through several measurement layers."],
  ["Permanent overlays", "Turns a temporary control into an undocumented model substitute."],
  ["IFRS 9 scenario treated as stress test", "Confuses an expected-outcome architecture with resilience analysis."],
  ["No contribution or path/weight attribution", "Prevents management from explaining why allowance changed."],
  ["No scenario versioning", "Makes reporting-date ECL irreproducible."],
  ["Look-ahead backtesting", "Uses realised information unavailable when the historical estimate was produced."],
  ["Mix or strategy mistaken for macro", "Attributes channel, underwriting or cut-off changes to the economy."],
  ["Forecast treated as certainty", "Hides model and forecast error behind a single path."],
  ["More scenarios assumed better", "Adds false precision and governance noise without capturing new material non-linearity."],
];

export default function Ifrs9MacroeconomicScenariosArticle() {
  return <>
    <p className="resource-lead"><em>Forward-looking IFRS 9 is not the act of adding a downside scenario to a model. It is the disciplined translation of uncertain macroeconomic paths into coherent changes in PD, LGD, EAD and ultimately probability-weighted expected credit loss.</em></p>
    <section id="architecture">
      <h2>Forward-looking information is a transmission architecture, not an add-on</h2>
      <p>A historical credit model may explain yesterday&apos;s borrower risk well and still mismeasure tomorrow&apos;s loss. The simplistic response—create baseline, upside and downside paths, then average them—does not answer where unemployment, rates, growth, inflation, property prices or sector conditions enter the impairment system.</p>
      <p>Forward-looking information can affect <strong>PD, LGD, EAD, SICR and overlays</strong>. The design problem is therefore omission and double counting at the same time: <strong>where does each economic risk transmission belong?</strong></p>
      <ResourceFigure label="Entimema forward-looking ECL architecture" caption="A macro forecast becomes accounting measurement only through explicit, governed credit-risk transmission."><ol className={styles.architecture}>{architecture.map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol></ResourceFigure>
      <DecisionImplication><p>The operating sequence is: <strong>design scenario → validate coherence → translate risk parameters → calculate scenario ECL → weight outcomes → test sensitivity → check double counting → attribute change → govern and monitor.</strong></p></DecisionImplication>
    </section>
    <section id="nonlinearity">
      <h2>One average economic scenario can produce the wrong expected loss</h2>
      <Formula label="Non-linearity at the centre of probability-weighted ECL"><span className={styles.formulaLine}>ECL(E[M]) ≠ E[ECL(M)]</span></Formula>
      <p>Suppose favourable conditions reduce PD modestly but severe stress increases it sharply. The credit response is convex in the adverse region: evaluating a model at the average macro input can understate the loss obtained by evaluating each plausible path and weighting the outcomes.</p>
      <ResourceTable caption="Illustrative Jensen-type PD example" headers={["Scenario", "PD", "Weight", "Weighted PD"]} rows={[["Upside", "2.0%", "20%", "0.4%"], ["Baseline", "4.0%", "60%", "2.4%"], ["Downside", "10.0%", "20%", "2.0%"], ["Expected", "—", "100%", <strong key="pd">4.8%</strong>]]}/>
      <p>The probability-weighted PD is <strong>4.8%</strong>. A hypothetical model evaluated once at the average macro input might produce <strong>4.5%</strong>. Both numbers are illustrative; the 0.3 percentage-point gap demonstrates why probability weighting should usually operate on loss outcomes when material nonlinearities exist.</p>
      <KeyObservation title="The practical rule"><p><strong>Do not average away the state in which the loss function bends.</strong> Severity and likelihood remain separate dimensions, and a low-probability tail can dominate the expected-loss contribution.</p></KeyObservation>
    </section>
    <section id="scenario-design">
      <h2>A scenario is a coherent joint economic narrative</h2>
      <Formula label="Scenario path"><span className={styles.formulaLine}>M<sub>s</sub> = &#123;GDP<sub>s</sub>, Unemployment<sub>s</sub>, Rates<sub>s</sub>, Inflation<sub>s</sub>, …&#125;</span></Formula>
      <p>A baseline is a credible central path; an upside is a credible favourable state; a downside is a credible adverse state. Three scenarios are neither universally mandatory nor automatically sufficient. The architecture must be rich enough to capture material non-linearity, but no richer than the evidence can support.</p>
      <p>A downside is not baseline made slightly worse variable by variable. GDP, unemployment, rates and inflation must move together plausibly under a shared narrative. Independently shocking every series can create combinations that have no economic interpretation.</p>
      <div className={styles.criteriaGrid}>{["Economic link", "Statistical evidence", "Stability", "Forecast availability", "Interpretability", "Production feasibility"].map(item => <article key={item}><strong>{item}</strong></article>)}</div>
      <p>Variable selection is the product of these six tests—not a contest for the lowest p-value. GDP, unemployment, income growth and confidence may carry overlapping information. Parsimony, sign, lag, stability and economic interpretation matter because correlated predictors can double-count a cycle or make the response unstable.</p>
      <h3>Likelihood and severity are different axes</h3>
      <div className={styles.matrix}><article><span>HIGH LIKELIHOOD / LOW SEVERITY</span><p>Often a large weight, but modest loss uplift.</p></article><article><span>HIGH LIKELIHOOD / HIGH SEVERITY</span><p>Potentially dominant expected-loss contribution.</p></article><article><span>LOW LIKELIHOOD / HIGH SEVERITY</span><p>Small weight can still create a large contribution.</p></article><article><span>LOW LIKELIHOOD / LOW SEVERITY</span><p>Usually limited contribution and may add little architecture value.</p></article></div>
      <p>An IFRS 9 scenario supports a probability-weighted expected outcome. A stress test assesses resilience under adversity and is often not weighted as an expected outcome. Severity alone does not convert one into the other.</p>
    </section>
    <section id="macro-model">
      <h2>Forecast quality and credit-risk transmission are separate questions</h2>
      <Formula label="Scenario-conditioned borrower risk"><span className={styles.formulaLine}>PD<sub>i,t,s</sub> = f(BorrowerRisk<sub>i</sub>, Seasoning<sub>t</sub>, Macro<sub>t,s</sub>)</span></Formula>
      <p>Unemployment can weaken income capacity; rates can increase debt-service burden; GDP and sector contraction can impair household or business cash flow. The same shock can depress collateral prices, lengthen recoveries and reduce cure, raising LGD. It can also increase utilisation, drawdown and balance persistence, raising EAD.</p>
      <ResourceFigure label="Entimema macro transmission map" caption="One economic shock can travel through distinct borrower, recovery and utilisation mechanisms before becoming ECL."><div className={styles.transmission}>{[["ECONOMIC SHOCK", "Rates, jobs, output, prices"], ["BORROWER CAPACITY", "Income and debt service"], ["DEFAULT RISK", "PD path and survival"], ["RECOVERY SEVERITY", "Collateral, cure, time and cost"], ["UTILISATION", "Drawdown and balance persistence"], ["EXPECTED LOSS", "Scenario-specific ECL"]].map(([a,b]) => <article key={a}><span>{a}</span><p>{b}</p></article>)}</div></ResourceFigure>
      <p>Under stress, PD↑, LGD↑ and EAD↑ can occur together. Independent parameter averages suppress their covariance. A reputable external GDP forecast is useful input, but it is not a PD model; forecast consensus and dispersion still require a governed transmission design.</p>
      <h3>Sparse macro history creates structural uncertainty</h3>
      <Formula label="False comfort from account-level scale"><span className={styles.formulaLine}>N<sub>borrowers</sub> ≫ N<sub>independent macro periods</sub></span></Formula>
      <p>Millions of monthly account rows do not create millions of economic cycles. Short histories, common trends, policy regimes, structural breaks and product redesign can create spurious relationships. An institution may have one recession and a short digital-lending history. Complex regression does not remove that uncertainty.</p>
      <p>Lag choices should reflect mechanism: PD<sub>t</sub> may depend on Macro<sub>t</sub>, Macro<sub>t−1</sub> and Macro<sub>t−2</sub>, but adding lags mechanically creates over-parameterisation. Sign, magnitude and lag must survive out-of-time and regime challenge.</p>
    </section>
    <section id="scenario-ecl">
      <h2>Calculate loss inside each scenario before weighting</h2>
      <Formula label="Scenario-specific lifetime expected credit loss"><span className={styles.formulaLine}>ECL<sub>s</sub> = Σ<sub>t</sub> MPD<sub>t,s</sub> × LGD<sub>t,s</sub> × EAD<sub>t,s</sub> × DF<sub>t</sub></span></Formula>
      <Formula label="Probability-weighted expected credit loss"><span className={styles.formulaLine}>ECL = Σ<sub>s</sub> w<sub>s</sub>ECL<sub>s</sub>, &nbsp; Σ<sub>s</sub>w<sub>s</sub> = 1</span></Formula>
      <p>Consider a fictional one-period €10 million revolving portfolio. Values are original, simplified and illustrative; EAD differs because utilisation responds to conditions.</p>
      <ResourceTable caption="Original scenario-level ECL example" headers={["Scenario", "Marginal PD", "LGD", "EAD", "Scenario ECL", "Weight", "Contribution"]} rows={[["Upside", "1.20%", "32%", "€9.20m", "€35,328", "20%", "€7,066"], ["Baseline", "2.40%", "38%", "€9.50m", "€86,640", "60%", "€51,984"], ["Downside", "6.50%", "50%", "€10.00m", "€325,000", "20%", "€65,000"], ["Weighted ECL", "—", "—", "—", "—", "100%", <strong key="ecl">€124,050</strong>]]}/>
      <p>If PD alone were weighted (3.13%) and then multiplied by weighted-average LGD (40%) and EAD (€9.54m), the result would be about <strong>€119,441</strong>—€4,609 below the correct scenario-level calculation. The shortcut loses the adverse co-movement of PD, LGD and EAD.</p>
      <p>For lifetime PD, each scenario generates hazard h<sub>t,s</sub>, survival S<sub>t,s</sub>, marginal PD and cumulative PD. The identities described in <Link href="/resources/lifetime-pd-term-structures-ifrs-9">Lifetime PD Term Structures</Link> must remain valid after scenario conditioning.</p>
    </section>
    <section id="contribution">
      <h2>Scenario probability is not scenario contribution</h2>
      <Formula label="Scenario contribution"><span className={styles.formulaLine}>Contribution<sub>s</sub> = w<sub>s</sub>ECL<sub>s</sub></span></Formula>
      <ResourceFigure label="Scenario probability, loss and weighted contribution" caption="The downside carries 20% probability but contributes 52.4% of total weighted ECL."><div className={styles.contribution}>{[["UPSIDE", "20% probability", "€35k ECL", "5.7% contribution"], ["BASELINE", "60% probability", "€87k ECL", "41.9% contribution"], ["DOWNSIDE", "20% probability", "€325k ECL", "52.4% contribution"]].map(([a,b,c,d]) => <article key={a}><span>{a}</span><strong>{b}</strong><p>{c}</p><em>{d}</em></article>)}</div></ResourceFigure>
      <p>Holding paths constant but moving weights from <strong>20 / 60 / 20</strong> to <strong>10 / 50 / 40</strong> increases weighted ECL from €124,050 to <strong>€176,853</strong>: a €52,803 weight effect. Holding the original weights but increasing downside ECL from €325,000 to €400,000 increases weighted ECL by <strong>€15,000</strong>: a path or severity effect.</p>
      <Formula label="Macro movement attribution"><span className={styles.formulaLine}>Macro Effect = Scenario Path Effect + Weight Effect</span></Formula>
      <p>This separation tells Finance whether allowance rose because the economic paths worsened, management assigned more likelihood to downside, or both. Monitor Δw<sub>s</sub> and its ΔECL rather than describing all macro movement as “the outlook.”</p>
    </section>
    <section id="horizon">
      <h2>Forecast confidence should decay as horizon extends</h2>
      <p>Short-term forecasts can support detailed paths; medium-term uncertainty widens; beyond a reasonable and supportable horizon, methodology may transition toward longer-run relationships. A model should not pretend equal confidence at years one and ten.</p>
      <Formula label="Long-run convergence"><span className={styles.formulaLine}>Macro<sub>t</sub> → LongRunLevel &nbsp; and &nbsp; PD<sub>t</sub> → LongRunRiskRelationship</span></Formula>
      <p>Speed, shape and validation are portfolio-specific. Abrupt jumps from forecast PD to a long-run PD create artificial term-structure discontinuities; controlled mean reversion should preserve probability identities and an economically coherent transition.</p>
      <p>Exposure horizon is decisive. A six-month product gains little from a ten-year macro path. Forecast horizon should align with expected exposure life, while longer-duration portfolios require explicit tail and convergence treatment.</p>
    </section>
    <section id="sicr">
      <h2>Macroeconomic deterioration can change both stage and measurement</h2>
      <p>Forward-looking deterioration can increase current lifetime PD and affect <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR and Stage 2</Link> even when borrower data are unchanged. That can be economically coherent, but governance must explain whether migration arises from borrower-specific deterioration, broad macro deterioration or both—and track a conceptual Stage2<sub>macro effect</sub>.</p>
      <ResourceTable caption="Entimema double-counting map" headers={["Economic risk driver", "SICR", "PD", "LGD", "EAD", "Weights", "Overlay", "Control question"]} rows={[["Rising unemployment", "Stage test", "Income stress", "—", "Possible", "Outlook likelihood", "Possible gap", "Which effects are distinct?"], ["Property-price decline", "Possible", "Possible", "Collateral severity", "—", "Scenario state", "Model blind spot only", "Is collateral response already modelled?"], ["Rate shock", "Possible", "Debt service", "Workout timing", "Utilisation", "Scenario state", "Residual only", "Where is the primary path?"]]}/>
      <p>Every material driver needs one coherent primary transmission path, or a documented reason for appearing across components. Stress that moves accounts to Stage 2, raises the PD curve, raises LGD and then receives a duplicate overlay is not conservatism; it is an uncontrolled measurement stack.</p>
    </section>
    <section id="overlays">
      <h2>An overlay needs an entry condition and an exit condition</h2>
      <p>A management overlay may be justified by an unprecedented event, delayed data, a structural break or a known model blind spot. It requires rationale, quantification, approval, sensitivity, double-counting assessment, review frequency and release logic.</p>
      <div className={styles.overlayFlow}>{["Origin", "Reason", "Evidence", "Quantification", "Current relevance", "Release condition"].map((item, index) => <article key={item}><small>{String(index + 1).padStart(2, "0")}</small><strong>{item}</strong></article>)}</div>
      <p>An overlay should not remain because it existed last quarter. The boundary question is: <strong>is this risk temporary and outside model design, or persistent enough to require redevelopment?</strong> Repeated overlays often reveal structural model deficiency.</p>
    </section>
    <section id="attribution">
      <h2>Versioned attribution makes the allowance explainable and reproducible</h2>
      <Formula label="Conceptual ECL movement architecture"><span className={styles.formulaLine}>ΔECL = Portfolio + Stage + PD + LGD + EAD + Scenario Path + Scenario Weight + Overlay + Model Change + Residual</span></Formula>
      <p>Compare M<sub>t,s</sub><sup>Q1</sup> with M<sub>t,s</sub><sup>Q2</sup>, trace forecast revisions into parameters, and separate them from portfolio composition and strategy. If defaults rise while the lender enters a riskier acquisition channel or loosens its <Link href="/resources/credit-risk-cut-off-strategy">cut-off strategy</Link>, observed deterioration is Macro Effect + Mix Effect—not proof of a larger macro coefficient.</p>
      <p>Each reporting cycle should retain scenario ID, forecast date, complete paths, weights, source, approvals and effective period, alongside model, parameter and overlay versions. For reporting date T, the institution should be able to reconstruct ECL<sub>T</sub> exactly.</p>
      <p><Link href="/resources/credit-vintage-analysis">Vintage analysis</Link> protects another distinction: portfolios under the same current economy can differ because origination standards, pricing, channels and customer mix differed. Macro attribution should not erase those cohort effects.</p>
    </section>
    <section id="validation">
      <h2>Validate the economic claim, not only the regression fit</h2>
      <ResourceTable caption="Macro-model validation and scenario challenge" headers={["Layer", "Challenge"]} rows={[["Economic rationale", "Is the sign, mechanism and segment response credible?"], ["Stability", "Do coefficient, lag and response shape survive time and regime changes?"], ["Forecast evidence", "Were forecast-time inputs used without look-ahead information?"], ["Sensitivity", "Which paths, weights and nonlinearities dominate ECL?"], ["Scenario coherence", "Are joint variable movements plausible and tails sufficiently represented?"], ["Implementation", "Can exact reporting-date paths, parameters and results be reproduced?"]]}/>
      <p>Backtesting should compare historical forecast-time predictions with outcomes using only information available at that reporting date. Realised macro data inserted retrospectively create look-ahead bias. Out-of-time performance, coefficient stability, sign, lag, horizon and sensitivity matter more than a polished in-sample fit.</p>
      <p>Challenge should ask whether downside is sufficiently adverse, upside plausible, correlations coherent, weights defensible, non-linearity captured, extrapolation visible and double counting absent. Scenario weights remain governed judgement—not objective truth merely because they sum to 100%.</p>
    </section>
    <section id="non-bank">
      <h2>Short-tenor non-bank portfolios need their own economic clock</h2>
      <p>In high-risk consumer lending, macro transmission can emerge quickly, data matures quickly, customer mix changes rapidly, acquisition channels can dominate and seasonality can be strong. An unsecured six-month product should not imitate a long-duration mortgage architecture.</p>
      <p>Segment sensitivity should follow portfolio economics: mortgages may respond to rates and property prices; unsecured consumers to unemployment and income stress; SMEs to GDP and sector conditions. Product, channel, vintage and strategy effects must be separated before a movement is labelled macroeconomic.</p>
    </section>
    <section id="failures"><h2>Twenty failure modes that weaken forward-looking ECL</h2><ResourceTable caption="Diagnostic failure-mode register" headers={["Failure", "Why it fails"]} rows={failures}/></section>
    <section id="agent">
      <h2>A Macro Scenario &amp; ECL Sensitivity Agent can maintain evidence—not approve judgement</h2>
      <p>A bounded recurring agent could ingest approved forecasts, maintain scenario versions, validate path coherence, apply governed PD/LGD/EAD models, calculate scenario and weighted ECL, test alternative weights, measure contributions, flag nonlinearities and possible double counting, compare quarters, and prepare attribution evidence.</p>
      <ResourceFigure label="Macro Scenario & ECL Sensitivity Agent ecosystem" caption="Scenario analytics orchestrate governed specialist components while approval remains human."><div className={styles.agentFlow}>{["Macro Scenario Agent", "Lifetime PD Agent", "LGD Agent", "EAD Agent", "SICR Agent", "ECL Monitoring & Attribution Agent", "Model Validation Agent"].map(item => <article key={item}><strong>{item}</strong></article>)}</div></ResourceFigure>
      <p>Its role is <strong>scenario analytics + ECL sensitivity + attribution + governance support</strong>. It must not autonomously approve economic scenarios, accounting judgements, weights or overlays. The service architecture connects naturally to <Link href="/services/credit-risk">Credit Risk</Link> and <Link href="/services/cfo-function">CFO &amp; Finance</Link>, because the same assumptions affect risk measurement and reported impairment.</p>
      <p>Continue through the IFRS 9 research chain: <Link href="/resources/ifrs-9-expected-credit-loss-architecture">Expected Credit Loss</Link>, <Link href="/resources/lifetime-pd-term-structures-ifrs-9">Lifetime PD</Link>, <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">LGD</Link>, <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD &amp; CCF</Link>, and <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR</Link>. Related diagnostic foundations include <Link href="/resources/model-calibration-drift-pd-risk-level">Model Calibration Drift</Link>, <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> and <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>.</p>
    </section>
  </>;
}
