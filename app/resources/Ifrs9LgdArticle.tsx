import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-lgd.module.css";

export const ifrs9LgdSections = [
  { id: "economic-lgd", label: "Economic LGD" },
  { id: "timing", label: "Timing and costs" },
  { id: "recovery-ledger", label: "Recovery ledger" },
  { id: "cure-workout", label: "Cure and workout" },
  { id: "collateral", label: "Collateral recovery" },
  { id: "vintages", label: "Vintages and censoring" },
  { id: "segmentation", label: "Segments and strategy" },
  { id: "downturn", label: "Downturn sensitivity" },
  { id: "validation", label: "LGD validation" },
  { id: "operations", label: "Data and operations" },
  { id: "failures", label: "Failure modes" },
  { id: "agent", label: "LGD analytics agent" },
] as const;

const recoveryRows = [
  ["1", "€800", "€80", "€720", "€715.40", "€715.40", "€9,284.60"], ["2", "€650", "€65", "€585", "€577.54", "€1,292.94", "€8,707.06"],
  ["3", "€500", "€50", "€450", "€441.42", "€1,734.37", "€8,265.63"], ["4", "€450", "€45", "€405", "€394.74", "€2,129.11", "€7,870.89"],
  ["5", "€400", "€40", "€360", "€348.64", "€2,477.75", "€7,522.25"], ["6", "€350", "€35", "€315", "€303.11", "€2,780.86", "€7,219.14"],
  ["7", "€320", "€32", "€288", "€275.36", "€3,056.21", "€6,943.79"], ["8", "€300", "€30", "€270", "€256.50", "€3,312.71", "€6,687.29"],
  ["9", "€280", "€28", "€252", "€237.87", "€3,550.58", "€6,449.42"], ["10", "€260", "€26", "€234", "€219.46", "€3,770.04", "€6,229.96"],
  ["11", "€240", "€24", "€216", "€201.29", "€3,971.33", "€6,028.67"], ["12", "€220", "€22", "€198", "€183.33", "€4,154.66", "€5,845.34"],
  ["13", "€200", "€20", "€180", "€165.60", "€4,320.26", "€5,679.74"], ["14", "€180", "€18", "€162", "€148.09", "€4,468.35", "€5,531.65"],
  ["15", "€160", "€16", "€144", "€130.79", "€4,599.14", "€5,400.86"], ["16", "€150", "€15", "€135", "€121.83", "€4,720.98", "€5,279.02"],
  ["17", "€140", "€14", "€126", "€112.98", "€4,833.96", "€5,166.04"], ["18", "€130", "€13", "€117", "€104.24", "€4,938.20", "€5,061.80"],
  ["19", "€120", "€12", "€108", "€95.61", "€5,033.81", "€4,966.19"], ["20", "€110", "€11", "€99", "€87.08", "€5,120.90", "€4,879.10"],
  ["21", "€100", "€10", "€90", "€78.66", "€5,199.56", "€4,800.44"], ["22", "€90", "€9", "€81", "€70.34", "€5,269.90", "€4,730.10"],
  ["23", "€80", "€8", "€72", "€62.13", "€5,332.02", "€4,667.98"], ["24", "€70", "€7", "€63", "€54.01", "€5,386.03", "€4,613.97"],
  [<strong key="total">Total</strong>, <strong key="gross">€6,300</strong>, <strong key="cost">€630</strong>, <strong key="net">€5,670</strong>, <strong key="pv">€5,386.03</strong>, "—", <strong key="loss">€4,613.97</strong>],
];

const failures = [
  ["LGD = 1 − nominal recovery rate", "Erases costs, timing and the economic value of cash flows."], ["Ignoring recovery timing", "Treats cash received next month as equal to cash received years later."],
  ["Ignoring costs", "Overstates recoveries and understates loss severity."], ["Wrong EAD denominator", "Mixes origination, reporting-date and default exposure into an incoherent ratio."],
  ["Collateral value = recovery value", "Ignores priority, forced-sale conditions, delay, cost and enforceability."], ["Static haircuts without evidence", "Creates false stability across assets, markets and workout states."],
  ["Ignoring cure", "Misses a material recovery path."], ["Temporary cure = final recovery", "Ignores re-default and continuing economic loss."],
  ["Open workouts treated as final", "Biases loss upward and fast recovery downward through censoring."], ["Unsupported tail recovery", "Turns an unobserved horizon into false precision."],
  ["One LGD for incompatible populations", "Hides distinct collateral, product and collection processes."], ["Ignoring PD–LGD dependence", "Misses conditions that raise defaults while weakening recoveries."],
  ["Ignoring macro sensitivity", "Leaves forward-looking loss severity disconnected from economic conditions."], ["Premature scenario averaging", "Can lose nonlinear and joint PD, LGD and EAD responses."],
  ["Ignoring collections strategy", "Attributes lender treatment effects entirely to borrower risk."], ["Naïve treatment comparison", "Confuses case selection with treatment effectiveness."],
  ["Final recovery level only", "Cannot detect a recovery curve with wrong timing."], ["Mixing default episodes", "Misallocates recoveries between cure, re-default and distinct defaults."],
  ["Ignoring post-write-off cash", "Drops real economic recoveries because accounting and cash timelines differ."], ["No recovery ledger or attribution", "Prevents reconstruction, monitoring and management explanation."],
];

export default function Ifrs9LgdArticle() {
  return <>
    <p className={styles.lead}>LGD is not one minus a recovery rate. It is a discounted, time-dependent estimate of economic loss conditional on default, shaped by recovery timing, collateral, cure behaviour, workout strategy and macroeconomic conditions.</p>
    <EntimemaFramework title="LGD architecture" description="The post-default process becomes an economic loss only after cash flows, costs and time are made explicit." steps={["Default", "EAD at Default", "Recovery Path", "Cure / Workout / Collateral", "Gross Recoveries", "Workout Costs", "Recovery Timing", "Discounted Net Recoveries", "LGD", "Scenario Conditioning", "Backtesting & Monitoring"]}/>

    <section id="economic-lgd">
      <h2>Economic LGD begins with what remains unrecovered</h2>
      <p>The intuitive identity LGD = 1 − Recovery Rate is a useful starting point, but only if “recovery” already means consistently defined, discounted net cash flows. Otherwise it hides the questions that determine economic loss: what was owed at default, which recovery channels produced cash, what they cost and when they paid.</p>
      <Formula label="Economic LGD"><span className={styles.formulaLine}>LGD = Economic Loss / EAD = 1 − PV(Expected Net Recoveries) / EAD<sub>τ</sub></span></Formula>
      <p>EAD<sub>τ</sub> is exposure at the defined default date. Origination balance, current reporting balance and exposure at default are not interchangeable. A €4,000 discounted net recovery on €10,000 EAD implies 60% LGD; it does not imply the same result against a different balance date.</p>
      <div className={styles.definitionGrid}><article><span>GROSS RECOVERIES</span><strong>Cash collected before cost</strong><p>Borrower payments, collections, collateral proceeds, guarantees, insurance where relevant, receivable sale and legal enforcement.</p></article><article><span>NET RECOVERIES</span><strong>Gross cash less attributable workout cost</strong><p>Legal, collection, repossession, sale and appropriate servicing costs belong to the same timed cash-flow architecture.</p></article></div>
      <Formula label="Net recovery at time t"><span className={styles.formulaLine}>Net Recovery<sub>t</sub> = Gross Recovery<sub>t</sub> − Workout Cost<sub>t</sub></span></Formula>
    </section>

    <section id="timing">
      <h2>Identical nominal recovery can produce different economic LGD</h2>
      <p>Consider two fictional loans, each with €10,000 EAD and €6,000 nominal recovery. Using an illustrative 8% annual discount rate, Case A pays after six months; Case B pays after three years. The amount is identical. Its economic value is not.</p>
      <ResourceTable caption="Original recovery-timing example at an illustrative 8% annual discount rate" headers={["Case", "EAD", "Nominal recovery", "Timing", "Recovery PV", "Nominal LGD", "Discounted LGD"]} rows={[["A", "€10,000", "€6,000", "0.5 years", "€5,773.50", "40.00%", "42.26%"], ["B", "€10,000", "€6,000", "3 years", "€4,762.99", "40.00%", "52.37%"]]}/>
      <Formula label="Present value of a recovery"><span className={styles.formulaLine}>PV(Recovery<sub>t</sub>) = Recovery<sub>t</sub> / (1 + r)<sup>t</sup></span></Formula>
      <ResourceFigure label="Recovery amount and timing framework" caption="Economic LGD depends jointly on how much net value returns and how long the return takes."><div className={styles.amountTiming}><article><span>AMOUNT</span><strong>Gross cash − costs</strong><p>Determines the nominal recovery level.</p></article><div>×</div><article><span>TIMING</span><strong>Cash-flow date + discounting</strong><p>Determines the economic value of that level.</p></article><div>=</div><article className={styles.result}><span>ECONOMIC LGD</span><strong>Residual discounted loss</strong><p>Same amount, slower cash, higher severity.</p></article></div></ResourceFigure>
      <h3>Costs change the severity before time does</h3>
      <p>Suppose €5,000 gross recovery costs €700 to obtain and the €4,300 net cash arrives after 18 months. At 8%, its PV is €3,831.18 and LGD is 61.69%. Ignoring cost would produce 55.45%—a 6.24 percentage-point understatement in this example.</p>
    </section>

    <section id="recovery-ledger">
      <h2>The recovery cash-flow curve is the mathematical core</h2>
      <Formula label="Discounted net recovery curve"><span className={styles.formulaLine}>PV(Net Recoveries) = Σ<sub>t=1</sub><sup>T</sup> R<sub>t</sub>DF<sub>t</sub>; &nbsp; LGD = 1 − Σ<sub>t</sub>R<sub>t</sub>DF<sub>t</sub> / EAD<sub>τ</sub></span></Formula>
      <p>R<sub>t</sub> should be a net cash flow at a controlled time grain, not a final percentage detached from its path. The original profile below follows a €10,000 default through 24 months at 8%. Gross cash totals €6,300, cost totals €630, nominal net recovery is €5,670, but discounted net recovery is €5,386.03—an economic LGD of 46.14% rather than nominal LGD of 43.30%.</p>
      <ResourceTable caption="Original 24-month recovery profile; illustrative values, 8% annual discount rate" headers={["Month", "Gross recovery", "Costs", "Net recovery", "Discounted recovery", "Cumulative discounted recovery", "Remaining economic loss"]} rows={recoveryRows}/>
      <p>Recovery speed is not a cosmetic diagnostic. Even if ultimate nominal cash is unchanged, Time to Recovery ↑ makes PV(Recovery) ↓. A six-month delay sensitivity therefore belongs beside Recovery Amount ±10% and Collateral Value −15%, with ΔLGD reported rather than hidden inside a new average.</p>
    </section>

    <section id="cure-workout">
      <h2>LGD is a mixture of cure and workout paths</h2>
      <Formula label="Cure-adjusted expected loss"><span className={styles.formulaLine}>Expected Loss = P(Cure) × Loss<sub>Cure</sub> + P(No Cure) × Loss<sub>Workout</sub></span></Formula>
      <p>A cure can reduce economic loss, but cure is not automatically permanent recovery. Define temporary and sustained cure, attach cash flows and costs to the correct default episode, and observe re-default. A borrower who cures, pays briefly and defaults again may lengthen the workout and change realised LGD. Cure ≠ Permanent Recovery.</p>
      <p>Workout LGD reconstructs observed post-default cash flows: <strong>Default Date → Recoveries → Costs → Discounting → Realised Economic Loss.</strong> It provides strong empirical grounding when history is sufficiently mature and default, recovery and closure definitions are stable. Market LGD, implied LGD, regulatory downturn LGD and IFRS 9 expected LGD answer different questions; labels must not substitute for use-case alignment.</p>
      <p>Accounting write-off can precede economic recovery. Post-write-off cash remains part of the recovery record under the chosen methodology. If a defaulted receivable is sold, sale proceeds may be a recovery cash flow, while the decision to sell remains a treatment that can influence observed LGD.</p>
    </section>

    <section id="collateral">
      <h2>Collateral value is not recovery value</h2>
      <Formula label="Collateral value is not recovery present value"><span className={styles.formulaLine}>Market Value ≠ Net Recovery PV</span></Formula>
      <p>Collateral is one recovery channel, governed by value, priority and seniority, enforceability, liquidity, price volatility, time to sale and sale or legal costs. A haircut is not an explanation unless evidence supports how those components translate a valuation into cash.</p>
      <p>LTV = Exposure / Collateral Value remains useful, but identical LTV can conceal different asset liquidity, lien position, borrower behaviour, enforcement and timing. Unsecured portfolios rely more on borrower payments, collections, cure and legal recovery; secured portfolios add collateral dynamics rather than replacing the rest of the workout.</p>
      <ResourceTable caption="Original collateral stress example; €90,000 EAD and illustrative 8% discount rate" headers={["Scenario", "Collateral market value", "Sale cost", "Nominal net proceeds", "Delay", "Net recovery PV", "LGD"]} rows={[["Baseline", "€100,000", "€8,000", "€92,000", "1 year", "€85,185", "5.35%"], ["Downside", "€80,000", "€8,000", "€72,000", "2 years", "€61,728", "31.41%"]]}/>
      <p>The downside changes both amount and speed. It does not assert a market benchmark or proprietary haircut: it isolates why a €20,000 valuation shock, unchanged €8,000 sale cost and one additional year of delay can move LGD by 26.06 percentage points.</p>
    </section>

    <section id="vintages">
      <h2>Recovery vintages reveal development, censoring and the tail</h2>
      <p>For default vintage v, track Recovery<sub>v,t</sub> and cumulative recovery CR<sub>v</sub>(m) by months since default. Curves expose collections effectiveness, legal change, macro conditions and portfolio mix. Compare like recovery ages: a six-month-old vintage cannot be judged against the final recovery of a four-year-old vintage.</p>
      <ResourceFigure label="Recovery vintage development" caption="Each vintage develops on months-since-default time; open cohorts require comparable ages or explicit completion estimates."><div className={styles.vintageCurves}>{[["V1",92,74,61,51],["V2",88,68,53,42],["V3",82,59,43,31]].map(([v,...points])=><div key={String(v)}><span>{v}</span>{points.map((point,index)=><i key={index} style={{height:`${point}%`}}/>)}<small>3m</small><small>6m</small><small>12m</small><small>24m</small></div>)}</div></ResourceFigure>
      <p>Open cases, restructuring, legal enforcement and unresolved collateral are right-censored workouts—not final losses. Mature-cohort comparisons or survival-style methods can use partial information without pretending every case is closed. If T<sub>obs</sub> &lt; T<sub>recovery</sub>, tail recovery must be estimated and its assumption disclosed.</p>
      <p>Tail materiality is economic, not merely nominal. Discount distant cash and test whether it changes LGD enough to affect decisions. Very small distant recoveries may have limited PV; long legal or collateral tails may remain material and uncertain.</p>
    </section>

    <section id="segmentation">
      <h2>Segmentation should follow recovery economics, not available columns</h2>
      <p>Potential dimensions include secured status, product, collateral type, default path, exposure size, borrower type, geography and collections strategy. Variables measured at origination X<sub>origination</sub> differ from recovery-relevant state at default X<sub>default</sub>. For prospective ECL, post-default information unavailable at the reporting date must not leak into the estimate.</p>
      <ResourceTable caption="Original multi-segment comparison; fictional examples, not market benchmarks" headers={["Segment", "EAD", "Nominal recovery", "Cost", "Timing", "Nominal LGD", "Discounted LGD"]} rows={[["A · Unsecured consumer", "€5,000", "€1,500", "€300", "1.5 years", "76.00%", "78.62%"], ["B · Vehicle-secured", "€20,000", "€14,000", "€1,200", "1 year", "36.00%", "40.74%"], ["C · Property-secured", "€120,000", "€100,000", "€7,000", "2.5 years", "22.50%", "36.05%"]]}/>
      <p>In unsecured consumer lending, delinquency stage, payment behaviour, balance, cure history, legal state, collections strategy and time since default can be central. Frequent defaults may create larger empirical samples and faster learning, but only when account-level cash flows and episode logic are reliable. Short contractual tenor does not imply a short LGD horizon: workout can continue long after maturity.</p>
      <h3>Collections strategy makes LGD partly operational</h3>
      <p>Early settlement, restructuring, legal action, receivable sale, internal teams and agencies can change amount, timing and cost. If difficult cases systematically receive aggressive treatment, outcomes reflect <strong>Borrower Risk + Treatment</strong>. Naïve strategy comparisons therefore suffer selection bias. This is a monitoring and experimental-design warning, not an invitation to automate collection decisions.</p>
    </section>

    <section id="downturn">
      <h2>Default risk and loss severity can deteriorate together</h2>
      <p>The same conditions that increase default frequency can reduce recoveries: unemployment can weaken borrower payments, house or used-car prices can fall, markets and courts can slow, and collection capacity can become constrained. PD ↑ may coincide with LGD ↑. Assuming independence can understate tail loss.</p>
      <Formula label="Scenario-specific IFRS 9 ECL"><span className={styles.formulaLine}>ECL<sub>s</sub> = Σ<sub>t</sub> MPD<sub>t,s</sub> × LGD<sub>t,s</sub> × EAD<sub>t,s</sub> × DF<sub>t</sub>; &nbsp; ECL = Σ<sub>s</sub>w<sub>s</sub>ECL<sub>s</sub></span></Formula>
      <p>For IFRS 9, the objective is expected, forward-looking LGD under relevant scenario conditions—not a mechanical import of regulatory downturn LGD. Economically justified drivers may include unemployment, GDP, rates, property or vehicle prices and legal recovery conditions. Scenario-specific ECL followed by probability weighting may preserve joint and nonlinear PD–LGD–EAD behaviour better than averaging each parameter first.</p>
      <p>LGD<sub>t,s</sub> can vary with expected default timing as balances amortise, collateral values evolve, workout horizons change and macro paths unfold. One static LGD across all future periods is an approximation that needs evidence.</p>
      <p>SICR remains primarily a change-in-credit-risk question, not a severity trigger. Yet LGD changes materially affect ECL. In Stage 3 or other credit-impaired exposures, cash-flow and recovery expectations become especially central to measurement; staging and severity should remain conceptually distinct.</p>
    </section>

    <section id="validation">
      <h2>Validate recovery level and timing separately</h2>
      <p>Calibration-in-the-large compares Mean Predicted LGD with Mean Realised LGD on sufficiently mature defaults, but portfolio averages can hide offsetting errors. Analyse segments, default vintages, recovery age and collateral type. If predictions differentiate severity, test whether higher predicted LGD corresponds to worse realised economic loss, with care for censored outcomes.</p>
      <ResourceFigure label="Recovery level and timing validation matrix" caption="A model can predict the final recovery reasonably while placing cash in the wrong periods—and therefore misstate discounted LGD."><div className={styles.validationMatrix}><div/><div className={styles.axis}>CORRECT TIMING</div><div className={styles.axis}>WRONG TIMING</div><div className={styles.axis}>CORRECT LEVEL</div><article><h3>Coherent fit</h3><p>Amount and cash-flow curve align.</p></article><article className={styles.warning}><h3>Right level, wrong time</h3><p>Nominal recovery fits; discounted LGD can fail.</p></article><div className={styles.axis}>WRONG LEVEL</div><article className={styles.warning}><h3>Severity miscalibration</h3><p>Timing aligns but total recovery does not.</p></article><article className={styles.warning}><h3>Major model issue</h3><p>Both amount and timing require challenge.</p></article></div></ResourceFigure>
      <p>Backtest CR<sup>pred</sup><sub>t</sub> against CR<sup>obs</sup><sub>t</sub>, not only final recovery. Drift can arise from borrower mix, macro conditions, collateral markets, legal process, recovery cost or collections operations—even if the PD model remains stable. An improved agency contract may reduce observed LGD because the process changed, not because borrowers became safer.</p>
      <Formula label="LGD movement attribution"><span className={styles.formulaLine}>ΔLGD ≈ Collateral + Recovery Level + Timing + Cost + Mix + Macro + Strategy + Residual</span></Formula>
      <p>This is a management decomposition, not a universal accounting identity. It connects LGD to ECL attribution: management should know whether impairment moved because collateral fell, cash slowed, cost rose, mix changed or scenario weights shifted.</p>
    </section>

    <section id="operations">
      <h2>Reliable LGD starts with an account-level recovery ledger</h2>
      <p>The practical data chain is <strong>Default Event → EAD → Recovery Cash Flow → Recovery Type → Cost → Collateral → Cure / Re-default → Legal Status → Closure Date.</strong> Each ledger event should carry account or facility ID, default date, cash-flow date, amount, type, cost and source.</p>
      <p>Borrower, facility and default episode are distinct keys. Explicit episode logic prevents a cured exposure and later re-default from being merged automatically. Ledger versioning, late cash, reversals, post-write-off recovery and sale proceeds should remain reproducible.</p>
      <ResourceFigure label="LGD operational workflow" caption="A controlled ledger connects post-default events to estimation, ECL and recurring validation."><ol className={styles.workflow}>{["Default Population", "Recovery Ledger", "Recovery Curves", "Workout Costs", "Collateral", "Cure / Re-default", "Discounting", "LGD Estimation", "Scenario Conditioning", "ECL Engine", "Backtesting"].map((step,index)=><li key={step}><small>{String(index+1).padStart(2,"0")}</small><strong>{step}</strong></li>)}</ol></ResourceFigure>
      <p>LGD feeds EL = PD × LGD × EAD and can change cut-off economics, pricing, collateral policy and collection prioritisation. See <Link href="/resources/credit-risk-cut-off-strategy">Cut-Off Strategy</Link> for the decision bridge; governance should keep measurement evidence separate from autonomous action.</p>
    </section>

    <section id="failures">
      <h2>Common failure modes are usually architecture failures</h2>
      <ResourceTable caption="Common IFRS 9 LGD and recovery-modelling failure modes" headers={["Failure mode", "Why it fails"]} rows={failures}/>
    </section>

    <section id="agent">
      <h2>An LGD & Recovery Analytics Agent should build evidence—not approve estimates</h2>
      <p>A future <strong>LGD & Recovery Analytics Agent</strong> could reconstruct default episodes; ingest recovery cash flows; identify cure and re-default; calculate nominal and discounted recovery; construct curves; analyse collateral and workout cost; estimate segment LGD; test timing; compare forecast with realised cash; detect vintage drift; run approved sensitivities; attribute movement; and prepare validation evidence.</p>
      <ResourceFigure label="LGD and recovery agent ecosystem" caption="Specialist recovery analytics connects parameter engines and monitoring while accounting estimates and collections actions remain governed human decisions."><div className={styles.agentFlow}>{["LGD & RECOVERY AGENT", "LIFETIME PD AGENT", "EAD / CCF AGENT", "ECL MONITORING & ATTRIBUTION", "MODEL VALIDATION AGENT", "HUMAN ACCOUNTING & RISK REVIEW"].map((step,index)=><span className={index===0?styles.agentNode:index===5?styles.humanNode:""} key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Its bounded role is <strong>recovery analytics + LGD monitoring + attribution + validation support</strong>. It must not autonomously determine accounting estimates, approve macro assumptions or select collections action. Recurring value comes from continuously evolving cash flows, costs, open workouts and default vintages.</p>
      <p>The practitioner logic is: <strong>Define Default Episode → Measure EAD → Reconstruct Recoveries → Net Costs → Discount Cash Flows → Segment → Stress / Scenario → Validate Level &amp; Timing → Monitor.</strong></p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects LGD development, validation and portfolio evidence. The <Link href="/services/cfo-function">CFO Function</Link> bridge connects recovery assumptions with allowance, impairment movement and management explanation. Continue through <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 Expected Credit Loss</Link>, <Link href="/resources/lifetime-pd-term-structures-ifrs-9">Lifetime PD Term Structures</Link>, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">Significant Increase in Credit Risk</Link>, <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>, <Link href="/resources/model-calibration-drift-pd-risk-level">Model Calibration Drift</Link>, <Link href="/resources/credit-risk-model-validation">Model Validation</Link> and <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>.</p>
      <KeyObservation title="Resolve"><p><strong>Default → Recovery Process → Cash Flows → Costs → Timing → Discounting → LGD → Scenario Sensitivity → Backtesting.</strong> Loss severity becomes decision-useful when the whole recovery process is measurable, time-consistent and open to challenge.</p></KeyObservation>
    </section>
  </>;
}
