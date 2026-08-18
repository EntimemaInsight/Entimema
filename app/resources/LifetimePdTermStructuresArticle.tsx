import Link from "next/link";
import { Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./lifetime-pd-term-structures.module.css";

export const lifetimePdTermStructuresSections = [
  { id: "probability-architecture", label: "Probability architecture" },
  { id: "constant-hazard", label: "Constant-hazard example" },
  { id: "curve-shape", label: "Non-constant curves" },
  { id: "ecl-timing", label: "ECL timing" },
  { id: "development", label: "Development approaches" },
  { id: "exposure-horizon", label: "Exposure horizon" },
  { id: "censoring-tail", label: "Censoring and the tail" },
  { id: "macro-scenarios", label: "Macro scenarios" },
  { id: "sicr", label: "Lifetime PD and SICR" },
  { id: "validation", label: "Level and shape validation" },
  { id: "anchor-example", label: "End-to-end ECL example" },
  { id: "non-bank", label: "Short-tenor lending" },
  { id: "agent", label: "Lifetime PD agent" },
] as const;

const constantHazardRows = [
  ["1", "3.000%", "100.000%", "3.000%", "3.000%"],
  ["2", "3.000%", "97.000%", "2.910%", "5.910%"],
  ["3", "3.000%", "94.090%", "2.823%", "8.733%"],
  ["4", "3.000%", "91.267%", "2.738%", "11.471%"],
  ["5", "3.000%", "88.529%", "2.656%", "14.127%"],
];

const nonConstantRows = [
  ["1", "2.000%", "100.000%", "2.000%", "2.000%"],
  ["2", "3.000%", "98.000%", "2.940%", "4.940%"],
  ["3", "4.000%", "95.060%", "3.802%", "8.742%"],
  ["4", "3.500%", "91.258%", "3.194%", "11.936%"],
  ["5", "3.000%", "88.064%", "2.642%", "14.578%"],
];

const failureRows = [
  ["12-month PD × maturity", "Ignores survival and can exceed coherent default probability."],
  ["Summing hazards", "Adds conditional risks as if every borrower remained exposed in every period."],
  ["Cumulative PD in every ECL period", "Counts earlier defaults repeatedly."],
  ["Ignoring survival", "Applies later-period risk to borrowers who already defaulted."],
  ["Hazard confused with marginal PD", "Mixes risk among survivors with today’s period-specific default probability."],
  ["Unsupported flat hazard", "Suppresses seasoning, selection and macro dynamics."],
  ["Ignoring seasoning", "Misses early peaks, gradual build, decline or hump-shaped risk."],
  ["Ignoring amortisation", "Disconnects default timing from declining loss exposure."],
  ["Ignoring prepayment", "Leaves exposure alive after an economically competing exit."],
  ["Ignoring competing risks", "Treats default, closure, maturity and prepayment as independent possibilities."],
  ["Censored accounts treated as permanent goods", "Biases long-horizon risk downward."],
  ["Unsupported tail extrapolation", "Replaces weak evidence with false precision."],
  ["One curve for incompatible segments", "Hides product, risk-grade and vintage differences."],
  ["Ignoring macro timing", "Treats an immediate shock and gradual slowdown as economically equivalent."],
  ["Premature scenario averaging", "Can lose nonlinear interactions among PD, LGD and EAD."],
  ["Final lifetime PD validation only", "Cannot detect defaults placed in the wrong periods."],
  ["Ignoring timing miscalibration", "Can preserve final CPD while materially misstating ECL."],
  ["Mixing model versions", "Breaks historical reproduction and drift interpretation."],
  ["Inconsistent time units", "Combines monthly and annual objects without valid conversion."],
  ["Premature rounding", "Breaks survival and probability reconciliation."],
  ["Annual curves for short-tenor products", "Conceals monthly seasoning and early default timing."],
  ["Lifetime PD as one scalar", "Discards the curve required for loss timing and validation."],
];

export default function LifetimePdTermStructuresArticle() {
  return <>
    <p className={styles.lead}>Lifetime PD is not a 12-month probability multiplied by maturity. It is a term structure of conditional default risk built through time, survival and changing economic conditions—and lifetime ECL needs the timing of default, not merely its final cumulative probability.</p>
    <KeyObservation title="The central transformation"><p>A lender may hold a well-calibrated PD<sub>12m</sub> of 3%. For a five-year horizon, 3% × 5 = 15% is not a coherent lifetime construction. <strong>Default can occur only once, and future risk applies only to borrowers that survived earlier periods.</strong></p></KeyObservation>
    <ResourceFigure label="Entimema Lifetime PD architecture" caption="The architecture converts conditional period risk into mutually exclusive default timing, scenario-specific loss and evidence that can be calibrated through time."><ol className={styles.architecture}>{["12-Month / Period Risk", "Conditional Hazard", "Survival", "Marginal PD", "Cumulative PD", "Lifetime PD Curve", "Scenario Conditioning", "ECL Integration", "Backtesting & Calibration"].map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol></ResourceFigure>

    <section id="probability-architecture">
      <h2>One default event creates four distinct probability objects</h2>
      <p>Let τ represent default time over discrete periods t = 1, 2, …, T. P(τ = t) asks whether default occurs specifically in period t. P(τ ≤ t) asks whether default has occurred by t. Confusing them is the root of many lifetime-PD errors.</p>
      <div className={styles.definitionGrid}>
        <article><span>HAZARD / CONDITIONAL PD</span><strong>h<sub>t</sub> = P(τ = t | τ ≥ t)</strong><p>Default risk during t among borrowers alive at its start.</p></article>
        <article><span>SURVIVAL</span><strong>S<sub>t</sub> = P(τ &gt; t)</strong><p>The probability of remaining non-defaulted through period t.</p></article>
        <article><span>MARGINAL PD</span><strong>MPD<sub>t</sub> = P(τ = t)</strong><p>Today’s probability of default specifically in period t.</p></article>
        <article><span>CUMULATIVE PD</span><strong>CPD<sub>t</sub> = P(τ ≤ t)</strong><p>Probability of default at any time up to and including t.</p></article>
      </div>
      <Formula label="Discrete survival probability"><span className={styles.formulaLine}>S<sub>t</sub> = ∏<sup>t</sup><sub>k=1</sub>(1 − h<sub>k</sub>)</span></Formula>
      <Formula label="Marginal default probability"><span className={styles.formulaLine}>MPD<sub>t</sub> = S<sub>t−1</sub>h<sub>t</sub></span></Formula>
      <Formula label="Cumulative and lifetime probability of default"><span className={styles.formulaLine}>CPD<sub>t</sub> = Σ<sup>t</sup><sub>k=1</sub>MPD<sub>k</sub> = 1 − S<sub>t</sub>; &nbsp; Lifetime PD = CPD<sub>T</sub></span></Formula>
      <p>The sequence matters. Conditional risk is applied to the surviving population; survival shrinks; marginal PD allocates mutually exclusive default timing; cumulative PD adds those allocations. A reported 12-month PD may equal P(τ ≤ 1), and in a one-year discrete setting the first marginal PD. Practitioners must still document what each model output means rather than assume every “12-month PD” is constructed identically.</p>
    </section>

    <section id="constant-hazard">
      <h2>A constant 3% hazard does not produce 15% lifetime PD</h2>
      <Formula label="Five-year lifetime PD under constant annual hazard"><span className={styles.formulaLine}>Lifetime PD = 1 − (1 − 0.03)<sup>5</sup> = 14.1266%</span></Formula>
      <p>The naïve 15% sum overstates the coherent result by 0.8734 percentage points because it applies 3% in later years to the original population rather than the survivors. At low hazards and short horizons, summation may look close; that is an approximation, not the probability architecture.</p>
      <ResourceTable caption="Original constant-hazard example; displayed values are rounded after calculation" headers={["Year", "Hazard", "Survival at start", "Marginal PD", "Cumulative PD"]} rows={constantHazardRows}/>
      <p>The marginal PDs sum to 14.1266%, exactly the unrounded CPD<sub>5</sub>. They decline despite a flat 3% hazard because the population capable of first default becomes smaller each year.</p>
    </section>

    <section id="curve-shape">
      <h2>Real risk has a shape, not merely a final value</h2>
      <p>Consider annual hazards of 2%, 3%, 4%, 3.5% and 3%. Risk builds through seasoning, peaks in year 3 and then moderates. The curve retains information that a 14.578% lifetime scalar discards.</p>
      <ResourceTable caption="Original non-constant five-year term structure" headers={["Year", "Hazard", "Survival at start", "Marginal PD", "Cumulative PD"]} rows={nonConstantRows}/>
      <h3>The same lifetime PD can hide radically different timing</h3>
      <p>Curve A has hazards [5%, 4%, 2%, 1%, 1%]; Curve B reverses them to [1%, 1%, 2%, 4%, 5%]. Because both contain the same survival factors, each produces a lifetime PD of <strong>12.4026%</strong>. Yet on an amortising €100k-equivalent exposure profile [100, 80, 60, 40, 20], 40% LGD and discount factors [0.96, 0.92, 0.88, 0.84, 0.80], Curve A produces an illustrative ECL of <strong>€3.601k</strong> versus <strong>€1.901k</strong> for Curve B.</p>
      <ResourceFigure label="Same lifetime PD with different default timing" caption="Equal final cumulative default risk does not imply equal economic loss when EAD, LGD and discounting vary through time."><div className={styles.timingComparison}><article><span>CURVE A / FRONT-LOADED</span><div className={styles.bars}>{[5,4,2,1,1].map((v,i)=><i style={{height:`${v*15}px`}} key={i}/>)}</div><strong>12.403% lifetime PD</strong><small>€3.601k illustrative ECL</small></article><article><span>CURVE B / BACK-LOADED</span><div className={styles.bars}>{[1,1,2,4,5].map((v,i)=><i style={{height:`${v*15}px`}} key={i}/>)}</div><strong>12.403% lifetime PD</strong><small>€1.901k illustrative ECL</small></article></div></ResourceFigure>
      <p>Seasoning can create early peaks, gradual build, decline or a hump. Burn-out can also lower later hazards: if higher-risk borrowers default early, the surviving pool may be healthier even under unchanged macro conditions.</p>
    </section>

    <section id="ecl-timing">
      <h2>Lifetime ECL consumes marginal PD, not cumulative PD</h2>
      <Formula label="Period-specific lifetime expected credit loss"><span className={styles.formulaLine}>ECL = Σ<sup>T</sup><sub>t=1</sub> MPD<sub>t</sub> × LGD<sub>t</sub> × EAD<sub>t</sub> × DF<sub>t</sub></span></Formula>
      <p>MPD<sub>t</sub> assigns each possible default to one period. Using CPD<sub>t</sub> in every period—Σ CPD<sub>t</sub> × LGD<sub>t</sub> × EAD<sub>t</sub>—repeatedly counts defaults already included in earlier cumulative probabilities. Lifetime PD is a useful end-of-horizon summary; the marginal curve is the integration object.</p>
      <p>PD timing interacts with the other ECL dimensions. Amortising loans usually have EAD<sub>t</sub> ↓, so early default carries more exposure. Revolving facilities may be drawn before default, making EAD flat or increasing and strengthening the future <strong>EAD / CCF</strong> research bridge. LGD and discount factors can also vary, so identical marginal-PD shapes need not produce identical losses.</p>
    </section>

    <section id="development">
      <h2>Term structures can be developed through several methodological families</h2>
      <ResourceTable caption="Lifetime PD development families and their principal assumptions" headers={["Architecture", "Strength", "Principal challenge"]} rows={[
        ["Direct multi-horizon modelling", "Estimates P(τ ≤ t | X) at chosen horizons", "Cross-horizon consistency, maturity and CPD monotonicity"],
        ["Survival / hazard modelling", "Explicit survival, time-varying covariates and natural MPD derivation", "Longitudinal data, censoring and implementation complexity"],
        ["Transition matrices", "Generates multi-period state and default probabilities", "Transition stability, Markov and duration assumptions"],
        ["Vintage / cohort curves", "Reveals maturity, seasoning and empirical cumulative emergence", "Historical underwriting, channel and macro-regime contamination"],
        ["12-month PD extrapolation", "Practical where only one-year models exist", "Imports unobserved assumptions on curve shape and the tail"],
        ["Hybrid approaches", "Combines borrower ranking, segment shape and macro conditioning", "Reconciliation, governance and overlapping adjustments"],
      ]}/>
      <p>Direct horizon models must preserve CPD<sub>t+1</sub> ≥ CPD<sub>t</sub>. Hazard models estimate h<sub>t</sub> = f(X<sub>t</sub>, t), naturally incorporating survival and time-varying covariates. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> can supply CPD<sub>v</sub>(m) shapes, but historical vintages may reflect different underwriting, channels and macro regimes.</p>
      <p>A transition approach may use P<sup>t</sup> to derive default-state probability under stability and first-order Markov assumptions: P(S<sub>t+1</sub> | S<sub>t</sub>, S<sub>t−1</sub>, …) = P(S<sub>t+1</sub> | S<sub>t</sub>). Real credit risk often retains memory through previous delinquency, cure count, time in state, collections actions and seasoning. <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> provides the connected diagnostic.</p>
      <p>Where only a 12-month model exists, historical cumulative-default shapes, hazard scaling, segment curves or macro adjustments can extend it. Flat h<sub>t</sub> = h<sub>1</sub> is a transparent benchmark, but not a default truth. Every extrapolation imports assumptions beyond the observed one-year model and must be validated as such.</p>
    </section>

    <section id="exposure-horizon">
      <h2>Credit survival and exposure survival are different processes</h2>
      <p>The relevant horizon may depend on contractual maturity, behavioural maturity, prepayment, revolving behaviour and applicable extension options. A static contractual end date is not automatically the correct expected exposure period.</p>
      <p>Prepayment or closure removes the exposure before default can occur on it. This creates competing risks: default, prepayment, maturity and closure are mutually relevant exits. Credit survival asks whether the borrower remains non-defaulted; exposure survival asks whether the facility remains capable of generating loss. A coherent ECL architecture must avoid projecting PD beyond an exposure that no longer exists.</p>
      <ResourceFigure label="Exposure and credit survival architecture" caption="Default timing is integrated only while both the borrower and exposure remain relevant to the loss calculation."><div className={styles.dualSurvival}><span>CREDIT SURVIVAL</span><strong>×</strong><span>EXPOSURE SURVIVAL</span><strong>→</strong><span>LOSS-RELEVANT MARGINAL PD</span></div></ResourceFigure>
    </section>

    <section id="censoring-tail">
      <h2>Incomplete observation is uncertainty—not evidence of permanent survival</h2>
      <p>A recent loan observed for 18 months in a five-year product is right-censored: τ &gt; T<sub>obs</sub> is known, but its eventual five-year outcome is not. Treating every censored account as a permanent good biases lifetime risk downward. Survival methods incorporate partial time-at-risk more naturally than naïve final classification.</p>
      <p>Long horizons require mature history. If T<sub>obs</sub> &lt; T<sub>required</sub>, the unobserved tail must be estimated. A flat tail, decay assumption, external benchmark or long-run segment curve can each be defensible in context; none creates evidence where none exists. Governance should expose the assumption and sensitivity.</p>
      <Formula label="Conceptual tail ECL materiality"><span className={styles.formulaLine}>Tail Materiality = Σ<sup>T required</sup><sub>t=T obs+1</sub> MPD<sub>t</sub>LGD<sub>t</sub>EAD<sub>t</sub>DF<sub>t</sub></span></Formula>
      <p>A long contractual tail need not dominate ECL when EAD has amortised, marginal risk is low or discounting is material. Conversely, sparse long-tail data in low-default portfolios can dominate model uncertainty. Preserve that uncertainty through alternatives and sensitivity rather than fabricated precision.</p>
    </section>

    <section id="macro-scenarios">
      <h2>Future macro paths change the timing of default</h2>
      <Formula label="Macro-conditioned period hazard"><span className={styles.formulaLine}>h<sub>t,s</sub> = f(Borrower Risk, Seasoning<sub>t</sub>, Macro<sub>t,s</sub>)</span></Formula>
      <p>Economically justified drivers may include unemployment, GDP, rates, inflation, property prices or sector conditions. A severe immediate shock followed by recovery can have the same five-year average unemployment as gradual deterioration but a different hazard path—and therefore different ECL.</p>
      <Formula label="Scenario-specific and probability-weighted ECL"><span className={styles.formulaLine}>ECL<sub>s</sub> = Σ<sub>t</sub>MPD<sub>t,s</sub>LGD<sub>t,s</sub>EAD<sub>t,s</sub>DF<sub>t</sub>; &nbsp; ECL = Σ<sub>s</sub>w<sub>s</sub>ECL<sub>s</sub></span></Formula>
      <p>Calculating one weighted PD curve first and then one deterministic loss can lose nonlinear interactions among PD, LGD and EAD. Scenario-specific loss followed by probability weighting may be more coherent where those interactions are material; this is a methodological question, not a universal implementation edict. Through-the-cycle curves provide smoother long-run risk, while IFRS 9 point-in-time architecture should respond to relevant current and expected conditions without collapsing every use case into one label.</p>
    </section>

    <section id="sicr">
      <h2>SICR can depend on curve shape, not only a lifetime-PD ratio</h2>
      <p><Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">Significant Increase in Credit Risk</Link> may compare LifetimePD<sup>initial</sup> with LifetimePD<sup>current</sup>. Yet two accounts can share the same ratio while one deteriorates mainly in years 1–2 and the other in years 4–5. The first may create more immediate management concern and a larger ECL increase on an amortising exposure.</p>
      <p>Instead of comparing only CPD<sub>T</sub>, analyse the full sets {'{'}CPD<sub>t</sub>{'}'} or {'{'}h<sub>t</sub>{'}'} across the remaining horizon. A curve-distance diagnostic can summarise where deterioration concentrates, but no one distance statistic should be treated as a universal SICR rule.</p>
      <div className={styles.sicrGrid}><article><span>BORROWER A</span><h3>Near-term deterioration</h3><p>Lifetime PD ratio 1.5×; incremental risk concentrated in years 1–2.</p></article><article><span>BORROWER B</span><h3>Tail deterioration</h3><p>Lifetime PD ratio 1.5×; incremental risk concentrated in years 4–5.</p></article></div>
    </section>

    <section id="validation">
      <h2>Validate level, shape and timing—not one final percentage</h2>
      <ResourceFigure label="Lifetime PD level and shape validation matrix" caption="A model can reach the right final lifetime PD for the wrong temporal reason; ECL reveals why timing is a first-class validation dimension."><div className={styles.validationMatrix}><div/><div className={styles.axis}>CORRECT SHAPE</div><div className={styles.axis}>WRONG SHAPE / TIMING</div><div className={styles.axis}>CORRECT LIFETIME LEVEL</div><article><h3>Level and shape coherent</h3><p>Early risk, peak, tail and final CPD are aligned.</p></article><article className={styles.warning}><h3>Correct lifetime, wrong timing</h3><p>Final CPD matches; ECL can still be materially wrong.</p></article><div className={styles.axis}>WRONG LIFETIME LEVEL</div><article className={styles.warning}><h3>Level drift</h3><p>Shape is useful but the whole curve is too high or low.</p></article><article className={styles.warning}><h3>Level and shape failure</h3><p>Both total risk and its emergence require challenge.</p></article></div></ResourceFigure>
      <p>For mature vintages, compare PredictedCPD<sub>t</sub> with ObservedCPD<sub>t</sub> by horizon and PredictedMPD<sub>t</sub> with observed period incidence. A model can match CPD<sub>T</sub> while placing defaults in the wrong years. Vintage backtesting compares CPD<sup>pred</sup><sub>v,t</sub> with CPD<sup>obs</sup><sub>v,t</sub>; segment tests should cover product, risk grade, score, channel, customer and vintage only where default counts support inference.</p>
      <p><Link href="/resources/model-calibration-drift-pd-risk-level">Calibration Drift</Link> distinguishes a level shift from a shape shift. A simple intercept adjustment may repair level but cannot necessarily move defaults to the right periods. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> and <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link> extend the evidence to production and decision fitness.</p>
      <h3>Probability identities are powerful production controls</h3>
      <p>Enforce 0 ≤ CPD<sub>t</sub> ≤ 1, CPD<sub>t+1</sub> ≥ CPD<sub>t</sub>, MPD<sub>t</sub> ≥ 0, S<sub>t</sub> + CPD<sub>t</sub> = 1 and Σ MPD<sub>k</sub> = CPD<sub>t</sub>. Calculate at controlled internal precision and round only for display. Version model, calibration date, macro scenario, curve, segment and effective date so historical ECL is reproducible.</p>
    </section>

    <section id="anchor-example">
      <h2>A five-year loan connects every probability to ECL</h2>
      <p>Consider an original fictional amortising loan with a €100,000 opening exposure, the non-constant hazard curve above, evolving LGD and discount factors. Values are illustrative, calculated at full precision and rounded only for presentation.</p>
      <ResourceTable caption="End-to-end lifetime PD and ECL calculation" headers={["Year", "Hazard", "Start survival", "Marginal PD", "Cumulative PD", "EAD", "LGD", "DF", "ECL contribution"]} rows={[
        ["1", "2.000%", "100.000%", "2.000%", "2.000%", "€100,000", "35%", "0.96", "€672.00"],
        ["2", "3.000%", "98.000%", "2.940%", "4.940%", "€82,000", "36%", "0.92", "€798.46"],
        ["3", "4.000%", "95.060%", "3.802%", "8.742%", "€63,000", "38%", "0.88", "€801.06"],
        ["4", "3.500%", "91.258%", "3.194%", "11.936%", "€43,000", "40%", "0.84", "€461.47"],
        ["5", "3.000%", "88.064%", "2.642%", "14.578%", "€22,000", "42%", "0.80", "€195.29"],
        ["Total", "—", "—", <strong key="mpd">14.578%</strong>, <strong key="cpd">14.578%</strong>, "—", "—", "—", <strong key="ecl">€2,928.28</strong>],
      ]}/>
      <h3>A modest lifetime-PD change can conceal a material timing shock</h3>
      <p>Under an early-stress curve [4%, 5%, 3%, 2%, 1.5%], lifetime PD becomes 14.606%—only 0.027 percentage points above baseline. Yet ECL rises to <strong>€3,575.75</strong>, an increase of €647.48 or 22.1%, because marginal loss moves into years with higher EAD and less discounting. This is the practical difference between validating final level and validating shape.</p>
      <ResourceFigure label="Baseline versus early-stress ECL comparison" caption="The final lifetime probability barely changes, while earlier loss timing materially increases expected loss."><div className={styles.stressBridge}><article><span>BASELINE</span><strong>14.578%</strong><small>Lifetime PD</small><strong>€2,928.28</strong><small>Lifetime ECL</small></article><div>→</div><article><span>EARLY STRESS</span><strong>14.606%</strong><small>Lifetime PD</small><strong>€3,575.75</strong><small>Lifetime ECL</small></article></div></ResourceFigure>
    </section>

    <section id="non-bank">
      <h2>Short-tenor and high-risk lending need monthly architecture</h2>
      <p>For six- or twelve-month consumer products, full lifetime can be short, data can mature quickly and hazard can be highly front-loaded. Monthly t = 1, …, 12 structures expose first-payment default, early seasoning, collections effects and rapid cure patterns that annual bank curves conceal.</p>
      <p>When conditional monthly risk is high, Σh<sub>t</sub> can diverge materially from 1 − ∏(1 − h<sub>t</sub>), making survival mathematics especially important. High turnover and prepayment also mean exposure survival must be integrated explicitly. A copied annual long-duration curve is not proportionate sophistication; it is the wrong time unit.</p>
      <p>For sparse long-tail or low-default portfolios, the opposite challenge applies: tail uncertainty may dominate. Governance should use materiality, sensitivity and clearly labelled extrapolation rather than pretending the tail is precisely observed.</p>
      <ResourceTable caption="Common Lifetime PD failure modes" headers={["Failure mode", "Why it fails"]} rows={failureRows}/>
    </section>

    <section id="agent">
      <h2>A Lifetime PD agent should construct and challenge curves—not approve assumptions</h2>
      <p>A future <strong>Lifetime PD Term Structure Agent</strong> could assemble panel and vintage performance data; calculate empirical hazards and survival; derive marginal and cumulative PD; compare segments; identify immature tails; test alternative extrapolations; condition curves on approved macro scenarios; reconcile probability identities; compare predicted and realised curves; and detect level-versus-shape drift.</p>
      <ResourceFigure label="Lifetime PD agent ecosystem" caption="Specialist curve construction feeds SICR, ECL and validation while model and accounting assumptions remain governed human decisions."><div className={styles.agentFlow}>{["LIFETIME PD AGENT", "SICR MONITORING AGENT", "ECL MONITORING & ATTRIBUTION AGENT", "MODEL VALIDATION AGENT", "HUMAN MODEL & ACCOUNTING REVIEW"].map((step,index)=><span className={index===0?styles.agentNode:index===4?styles.humanNode:""} key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Its role is <strong>term-structure construction + validation + scenario analysis + monitoring support</strong>. It must not autonomously approve accounting policy, tail assumptions, macro scenarios or model calibration. Recurring value comes from recalibration, macro updates, monitoring and validation every reporting cycle.</p>
      <p>The practitioner workflow is: <strong>Define Horizon → Estimate Conditional Risk → Apply Survival → Build Marginal Curve → Reconcile Cumulative PD → Condition on Scenario → Integrate with EAD/LGD → Validate Level &amp; Shape → Monitor Drift.</strong></p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects PD development, staging, validation and portfolio evidence. The <Link href="/services/cfo-function">CFO Function</Link> bridge connects default timing with reported allowance and impairment explanation. The parent <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 Expected Credit Loss architecture</Link>, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">SICR research</Link>, <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link> form the surrounding evidence system.</p>
      <KeyObservation title="Resolve"><p><strong>Hazard → Survival → Marginal PD → Cumulative PD → Lifetime PD → ECL Timing.</strong> A lifetime curve is decision-useful when every probability reconciles, loss timing is explicit and both level and shape survive validation.</p></KeyObservation>
    </section>
  </>;
}
