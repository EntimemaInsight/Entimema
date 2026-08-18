import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-ead.module.css";

export const ifrs9EadSections = [
  { id: "definition", label: "EAD is a future state" },
  { id: "amortising", label: "Amortising exposure" },
  { id: "revolving", label: "Revolving exposure & CCF" },
  { id: "temporal", label: "Reference date & utilisation" },
  { id: "diagnostics", label: "CCF diagnostics" },
  { id: "products", label: "Product architecture" },
  { id: "term-structure", label: "EAD term structures" },
  { id: "survival", label: "Prepayment & survival" },
  { id: "dependence", label: "Dependence & scenarios" },
  { id: "estimation", label: "Estimation & segmentation" },
  { id: "validation", label: "Backtesting & drift" },
  { id: "operations", label: "Data & implementation" },
  { id: "portfolio", label: "End-to-end portfolio" },
  { id: "agent", label: "EAD analytics agent" },
] as const;

const failures = [
  ["Current balance used as EAD", "Ignores amortisation, drawdown, prepayment and default timing."],
  ["One CCF for every product", "Erases different contractual and behavioural mechanisms."],
  ["Undefined reference date", "Makes observation-to-default development irreproducible."],
  ["Tiny undrawn denominator", "Creates unstable and extreme empirical CCF values."],
  ["Negative or >100% CCF floored blindly", "Conceals repayment, limit changes, accruals or data defects."],
  ["Limit changes ignored", "Confuses borrower drawdown with lender intervention."],
  ["Contractual schedule equals behavioural EAD", "Misses missed payments, arrears, restructuring and prepayment."],
  ["Exposure survival omitted", "Retains facilities after prepayment, maturity or cancellation."],
  ["Static EAD across lifetime", "Misaligns exposure with the period-specific marginal PD."],
  ["Scenario-average parameters multiplied", "Can lose joint nonlinear PD–LGD–EAD behaviour."],
  ["Portfolio-average calibration only", "Allows segment and utilisation-band biases to offset."],
  ["Policy drift called model failure", "Misdiagnoses a changed limit-management intervention regime."],
] as const;

export default function Ifrs9EadArticle() {
  return <>
    <p className={styles.lead}><em>A borrower has €4,000 drawn today. That is an observation—not yet an estimate of what will be outstanding when default occurs. Exposure at Default begins where the balance snapshot ends.</em></p>
    <EntimemaFramework title="EAD & CCF architecture" description="Translate a reporting-date position into a time-aligned, behaviourally conditioned exposure forecast." steps={["Current Exposure", "Contractual Profile", "Behavioural Utilisation", "Undrawn Commitment", "CCF", "Default Timing", "EAD Term Structure", "Backtesting", "ECL Integration"]}/>

    <section id="definition">
      <h2>EAD is exposure at a future default state</h2>
      <Formula label="Exposure at default"><span className={styles.formulaLine}>EAD<sub>τ</sub> = Exposure outstanding at default time τ</span></Formula>
      <p>For future-period IFRS 9 expected credit loss, EAD<sub>t</sub> is expected exposure if default occurs during period t. It is time-dependent. Balance<sub>today</sub> can differ from EAD<sub>t</sub> because of contractual amortisation, repayments, drawdowns, accrued interest, relevant fees, prepayment, arrears and limit changes.</p>
      <div className={styles.contrast}><article><span>OBSERVED</span><strong>Balance today</strong><p>A known reporting-date position.</p></article><div>≠</div><article><span>FORECAST</span><strong>EAD<sub>t</sub></strong><p>Exposure conditional on future behaviour and default timing.</p></article></div>
      <DecisionImplication><p>Every EAD number needs an exposure definition, reference date, default horizon, product logic and balance-component contract. Without them, it is not reproducible.</p></DecisionImplication>
    </section>

    <section id="amortising">
      <h2>Amortising exposure has a contractual path—and a behavioural path</h2>
      <p>For a simple term loan, EAD<sub>t</sub> ≈ ScheduledBalance<sub>t</sub> can be a useful starting point. It is not an identity. Missed principal, arrears, restructuring and interest accrual can raise exposure; prepayment can remove it earlier.</p>
      <ResourceTable caption="Original four-year €20,000 loan example; behavioural path includes illustrative prepayment survival" headers={["Year", "Contractual EAD", "Exposure survival", "Behavioural EAD", "Marginal PD", "LGD", "ECL contribution"]} rows={[
        ["1", "€16,000", "94%", "€15,040", "2.0%", "40%", "€120.32"],
        ["2", "€12,000", "85%", "€10,200", "2.5%", "40%", "€102.00"],
        ["3", "€8,000", "73%", "€5,840", "3.0%", "40%", "€70.08"],
        ["4", "€4,000", "60%", "€2,400", "3.5%", "40%", "€33.60"],
        [<strong key="total">Total</strong>, "—", "—", "—", "—", "—", <strong key="ecl">€326.00</strong>],
      ]}/>
      <p>Using the contractual balances with the same illustrative PD and LGD assumptions gives €440.00 before discounting; recognising expected prepayment reduces it to €326.00. The 25.9% difference is not a generic prepayment effect—it follows from this fictional path and shows why exposure survival belongs in lifetime ECL.</p>
      <Formula label="Scheduled versus behavioural exposure"><span className={styles.formulaLine}>Adjustment<sub>t</sub> = EAD<sup>behavioural</sup><sub>t</sub> / EAD<sup>contract</sup><sub>t</sub></span></Formula>
    </section>

    <section id="revolving">
      <h2>Revolving EAD is centred on conversion of unused capacity</h2>
      <p>A revolving borrower with €4,000 drawn and a €10,000 limit has €6,000 undrawn. If financial stress leads to additional drawdown before default, €4,000 materially understates exposure at default.</p>
      <Formula label="Credit conversion factor"><span className={styles.formulaLine}>CCF = (EAD − Drawn<sub>reference</sub>) / Undrawn<sub>reference</sub></span></Formula>
      <Formula label="Revolving exposure at default"><span className={styles.formulaLine}>EAD = Drawn + CCF × Undrawn</span></Formula>
      <ResourceTable caption="CCF sensitivity for €4,000 drawn and €6,000 undrawn" headers={["CCF", "Additional draw", "EAD", "Increase over current balance"]} rows={[["20%", "€1,200", "€5,200", "30%"], ["50%", "€3,000", "€7,000", "75%"], ["80%", "€4,800", "€8,800", "120%"]]}/>
      <KeyObservation><p><strong>CCF is not a static accounting coefficient.</strong> It is a behavioural parameter describing how undrawn availability converts into exposure between observation and default.</p></KeyObservation>
    </section>

    <section id="temporal">
      <h2>Reference date and look-back design determine what CCF measures</h2>
      <p>Let Drawn<sub>t₀</sub> and Limit<sub>t₀</sub> be known at observation, with default at τ. The development window t₀ → τ must be fixed consistently. A very short look-back may capture only immediate distress and reduce sample size; a long horizon may dilute default-related behaviour. There is no universal window.</p>
      <Formula label="Utilisation ratio"><span className={styles.formulaLine}>Utilisation<sub>t</sub> = Drawn<sub>t</sub> / Limit<sub>t</sub></span></Formula>
      <ResourceTable caption="Fictional utilisation run-up before default" headers={["Month to default", "Limit", "Drawn", "Utilisation"]} rows={[["−6", "€10,000", "€3,000", "30%"], ["−3", "€10,000", "€5,500", "55%"], ["−1", "€10,000", "€8,000", "80%"], ["Default", "€10,000", "€8,700", "87%"]]}/>
      <Formula label="Absolute and relative exposure run-up"><span className={styles.formulaLine}>RunUp = EAD<sub>τ</sub> − Drawn<sub>t₀</sub>; &nbsp; RunUpRate = RunUp / Undrawn<sub>t₀</sub></span></Formula>
      <p>From month −6, the borrower adds €5,700 and converts 81.4% of the €7,000 initially undrawn. The path—not only its endpoints—reveals when utilisation accelerates and whether delinquency, collections or limit action coincide with it.</p>
    </section>

    <section id="diagnostics">
      <h2>Extreme CCF values are diagnostic evidence</h2>
      <p>If EAD<sub>τ</sub> &lt; Drawn<sub>t₀</sub>, empirical CCF becomes negative. Repayment, exposure sale, closure, limit action or timing defects may explain it. If CCF &gt; 100%, limit increases, accrued balances, fees, over-limit use or a very small denominator may explain it. Neither should be mechanically floored or capped before the data-generating process is understood.</p>
      <Formula label="Historical account-level CCF"><span className={styles.formulaLine}>CCF<sub>i</sub> = (EAD<sub>τ,i</sub> − Drawn<sub>0,i</sub>) / (Limit<sub>0,i</sub> − Drawn<sub>0,i</sub>)</span></Formula>
      <p>When Undrawn<sub>0</sub> ≈ 0, the ratio is unstable; when Undrawn = 0, CCF is undefined or economically irrelevant. Forecast the drawn balance directly instead of forcing a conversion ratio onto a fully utilised account.</p>
      <p>Limit<sub>t₀</sub> ≠ Limit<sub>τ</sub> also changes interpretation. A lender may cut limits after early-warning deterioration, so observed EAD contains both borrower behaviour and lender intervention. Historical CCF can therefore encode the former limit-management regime. A changed policy is a treatment shift, not automatically model deterioration.</p>
    </section>

    <section id="products">
      <h2>Product architecture determines exposure mechanics</h2>
      <ResourceTable caption="Product-specific EAD logic" headers={["Product", "Primary exposure mechanism", "Central modelling question"]} rows={[
        ["Instalment / term loan", "Scheduled decline, arrears, prepayment", "How does behavioural balance depart from amortisation?"],
        ["Credit card", "Dynamic repayments and drawdown", "How does utilisation evolve before default?"],
        ["Overdraft", "Rapid liquidity-stress use", "How quickly can available capacity convert?"],
        ["Revolving credit line", "Drawn plus material undrawn", "Which CCF architecture fits timing and segment?"],
        ["Guarantee / commitment", "Off-balance-sheet conversion", "What portion becomes funded exposure?"],
      ]}/>
      <Formula label="Conceptual off-balance-sheet EAD"><span className={styles.formulaLine}>EAD = CCF × Commitment</span></Formula>
      <p>Nominal cancellation rights do not automatically eliminate exposure: legal enforceability, operational timing and actual cancellation practice matter. Balance-component definitions for principal, accrued interest and relevant fees must match between the model and ECL engine.</p>
    </section>

    <section id="term-structure">
      <h2>EAD must occupy the same period as marginal PD</h2>
      <Formula label="Period-specific expected credit loss"><span className={styles.formulaLine}>ECL<sub>t</sub> = MPD<sub>t</sub> × LGD<sub>t</sub> × EAD<sub>t</sub> × DF<sub>t</sub></span></Formula>
      <p>The sequence EAD₁, EAD₂, …, EAD<sub>T</sub> is the exposure counterpart to the lifetime PD term structure. An instalment balance normally declines; revolving EAD may rise as utilisation builds and later fall as closure, maturity or prepayment remove exposure.</p>
      <ResourceTable caption="Same fictional PD and LGD assumptions; contrasting exposure paths before discounting" headers={["Year", "Marginal PD", "LGD", "Instalment EAD", "Instalment ECL", "Revolving EAD", "Revolving ECL"]} rows={[
        ["1", "2.0%", "40%", "€16,000", "€128.00", "€7,000", "€56.00"],
        ["2", "2.5%", "40%", "€12,000", "€120.00", "€8,000", "€80.00"],
        ["3", "3.0%", "40%", "€8,000", "€96.00", "€7,500", "€90.00"],
        ["4", "3.5%", "40%", "€4,000", "€56.00", "€6,000", "€84.00"],
        [<strong key="total">Total</strong>, "—", "—", "—", <strong key="a">€400.00</strong>, "—", <strong key="b">€310.00</strong>],
      ]}/>
      <p>The revolving account starts smaller but its rising exposure shifts more loss into later periods. ECL depends on the alignment of default timing and exposure shape, not a single closing balance.</p>
    </section>

    <section id="survival">
      <h2>Exposure survival is distinct from credit survival</h2>
      <p>Credit survival asks whether default has not yet occurred. Exposure survival asks whether the facility still exists. Prepayment, maturity, cancellation and closure compete with default; once a facility exits, it cannot generate a later default exposure.</p>
      <Formula label="Conceptual behavioural EAD with exposure survival"><span className={styles.formulaLine}>EAD<sup>behavioural</sup><sub>t</sub> = EAD<sup>conditional</sup><sub>t</sub> × P(Facility active at t)</span></Formula>
      <p>A conceptual PP<sub>t</sub> can represent prepayment probability, but implementation must avoid double-counting exits already embedded in marginal PD or behavioural balance estimates. Scheduled amortisation, behavioural prepayment and competing-risk eligibility should reconcile as one architecture.</p>
      <p>Stage 2 does not mechanically change EAD. Deteriorating Stage 2 accounts may nevertheless have different repayment or utilisation paths. Staging and exposure remain distinct even when they share behavioural evidence.</p>
    </section>

    <section id="dependence">
      <h2>PD, LGD and EAD can deteriorate together</h2>
      <p>Under household or business liquidity stress, PD may rise while revolving borrowers use more available credit, so EAD also rises. Recovery conditions may weaken at the same time, producing PD ↑, LGD ↑ and EAD ↑. This wrong-way interaction can make ECL increase by more than isolated one-parameter sensitivities suggest.</p>
      <Formula label="Scenario-specific ECL"><span className={styles.formulaLine}>ECL<sub>s</sub> = Σ<sub>t</sub> MPD<sub>t,s</sub> × LGD<sub>t,s</sub> × EAD<sub>t,s</sub> × DF<sub>t</sub>; &nbsp; ECL = Σ<sub>s</sub>w<sub>s</sub>ECL<sub>s</sub></span></Formula>
      <p>Unemployment, income stress, interest rates, household liquidity and business cash flow may influence utilisation where evidence supports the mechanism. Calculate full scenario-level loss before weighting when joint and nonlinear responses are material; multiplying separately averaged parameters can lose dependence.</p>
      <p>LGD usually uses exposure at default as its denominator. Inconsistent EAD definitions can therefore distort LGD as well as the exposure term in ECL. PD, LGD and EAD are separate parameters, but their data architecture is not independent.</p>
    </section>

    <section id="estimation">
      <h2>Model the economic target—not the most convenient ratio</h2>
      <ResourceTable caption="Illustrative CCF by current utilisation; fictional values, not a universal relationship" headers={["Current utilisation", "Mean CCF"]} rows={[["0–25%", "65%"], ["25–50%", "50%"], ["50–75%", "35%"], ["75–100%", "15%"]]}/>
      <p>Lower-utilisation accounts have more capacity available to convert, but CCF can also decline mechanically because undrawn amount is its denominator. Similar absolute drawdowns can create different ratios. Review ΔDrawn and utilisation-at-default alongside CCF.</p>
      <p>Potential segments include product, utilisation band, risk grade, limit size, tenure, delinquency, channel, borrower type and months to default. Excess segmentation produces sparse defaults and unstable estimates. Direct EAD models avoid some ratio pathology; CCF can normalise across limits. Neither target is universally superior.</p>
      <Formula label="Two-part additional drawdown model"><span className={styles.formulaLine}>Expected Additional Draw = P(Draw) × E(Amount | Draw)</span></Formula>
      <p>Two-part models can handle many zero drawdowns. Segment averages, linear or censored models, bounded-ratio models and tree-based challengers are possible. Complexity earns its place only through stability, calibration, implementation control and ECL materiality.</p>
    </section>

    <section id="validation">
      <h2>Backtesting must find bias where it matters</h2>
      <p>For defaults, compare predicted EAD with realised EAD<sub>τ</sub>; compare predicted and realised CCF only where reference definitions and denominators are stable. Review mean error, MAE, RMSE or weighted error by product, segment, utilisation band, forecast horizon and default vintage. Calibration is generally more central than ranking, though differentiated models should also order future exposure sensibly.</p>
      <ResourceFigure label="EAD validation matrix" caption="Portfolio fit is insufficient when economically material subgroups are biased."><div className={styles.validationGrid}>{[["LEVEL","Predicted versus realised EAD"],["RATIO","CCF where denominator is stable"],["TIME","Default horizon and vintage"],["SEGMENT","Product and utilisation band"],["DRIFT","Behaviour and policy regime"],["MATERIALITY","EAD error × PD × LGD × volume"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong></article>)}</div></ResourceFigure>
      <p>An error of €1,000 has different economic significance depending on PD, LGD and portfolio volume. Exposure-weighted or ECL-linked diagnostics should complement statistical loss functions. Default-vintage backtests can reveal changing drawdown behaviour caused by economic stress, digital usage, product redesign, competing lenders or limit policy.</p>
      <Formula label="Conceptual EAD model materiality"><span className={styles.formulaLine}>EAD Model Materiality = f(EAD Error, PD, LGD, Exposure Volume)</span></Formula>
    </section>

    <section id="operations">
      <h2>A temporal exposure ledger is the modelling foundation</h2>
      <EntimemaFramework title="EAD data spine" steps={["Observation Date", "Limit", "Drawn Balance", "Undrawn Amount", "Payments", "Drawdowns", "Limit Changes", "Default Date", "EAD at Default"]}/>
      <p>Monthly or transaction-level history reconstructs repayments, drawdowns, utilisation and limit intervention; observation and default endpoints alone cannot explain behaviour. Preserve facility, borrower and default-episode keys. Cure and re-default may create multiple episodes, and the selected episode logic must align with PD and LGD.</p>
      <ResourceTable caption="Minimum implementation controls" headers={["Control", "Evidence"]} rows={[
        ["Temporal integrity", "Point-in-time limits, balances, transactions and default dates"],
        ["Definition alignment", "Principal, interest, fees, off-balance-sheet and default scope"],
        ["Population reconciliation", "Eligible, excluded, closed, prepaid and fully utilised accounts"],
        ["Intervention lineage", "Limit and collections actions separated from borrower events"],
        ["Versioning", "Data snapshot, model, segments, calibration and ECL-engine mapping"],
        ["Outcome maturity", "Comparable default horizons and documented censoring"],
      ]}/>
      <p>For non-bank and high-risk consumer lenders, shorter tenors and faster portfolio turnover can make utilisation changes rapid and data-rich, while frequent refinancing, restructures, digital limit management and product redesign create strong regime effects. Proportionality may simplify model form, but not timing, definitions or reconciliation.</p>
      <ResourceTable caption="Common EAD and CCF architecture failures" headers={["Failure mode", "Why it fails"]} rows={failures.map(row=>[...row])}/>
    </section>

    <section id="portfolio">
      <h2>End-to-end examples connect account mechanics to ECL</h2>
      <p>A fictional revolving account has a €12,000 limit, €4,500 drawn and 37.5% utilisation. Default is modelled in period 2 with CCF of 55%.</p>
      <Formula label="Revolving account EAD"><span className={styles.formulaLine}>EAD = €4,500 + 55% × (€12,000 − €4,500) = €8,625</span></Formula>
      <p>With period-2 marginal PD of 3.0%, LGD of 45% and discount factor of 0.94, its contribution is €8,625 × 3.0% × 45% × 0.94 = <strong>€109.46</strong>. Using current drawn balance would produce €57.11 and understate this illustrative loss by €52.35.</p>
      <ResourceTable caption="Fictional portfolio EAD bridge and one-period ECL" headers={["Segment", "Accounts", "Current drawn", "Undrawn", "EAD method", "Forecast EAD", "MPD", "LGD", "ECL"]} rows={[
        ["Term loans", "1,200", "€12.0m", "—", "Behavioural amortisation", "€10.2m", "2.4%", "38%", "€93.0k"],
        ["Credit cards", "4,000", "€8.0m", "€12.0m", "42% CCF", "€13.04m", "3.2%", "62%", "€258.7k"],
        ["Overdrafts", "900", "€3.0m", "€4.0m", "60% CCF", "€5.40m", "4.1%", "55%", "€121.8k"],
        ["Guarantees", "160", "€0", "€2.5m", "30% conversion", "€0.75m", "1.8%", "48%", "€6.5k"],
        [<strong key="t">Portfolio</strong>, "6,260", "€23.0m", "€18.5m", "Product-specific", <strong key="e">€29.39m</strong>, "—", "—", <strong key="l">€480.0k</strong>],
      ]}/>
      <p>All figures are original and illustrative. The portfolio demonstrates why one balance proxy cannot represent amortising, revolving and contingent exposures coherently.</p>
    </section>

    <section id="agent">
      <h2>An EAD & CCF Analytics Agent should investigate exposure—not set policy</h2>
      <p>A future <strong>EAD & CCF Analytics Agent</strong> could reconstruct observation-to-default paths; calculate utilisation and CCF under approved definitions; flag unstable denominators, negative and above-100% cases; compare contractual and behavioural term structures; monitor vintages and segments; detect behaviour or policy drift; run approved scenario sensitivities; reconcile EAD into ECL; and prepare validation evidence.</p>
      <ResourceFigure label="EAD analytics agent ecosystem" caption="The agent connects controlled exposure data and deterministic calculations to review; limits, accounting estimates and customer actions remain human-governed."><div className={styles.agentFlow}>{["EXPOSURE LEDGER","EAD / CCF ENGINE","UTILISATION & VINTAGE MONITORING","SCENARIO ECL","MODEL VALIDATION","HUMAN RISK & FINANCE REVIEW"].map((step,index)=><span className={index===1?styles.agentNode:index===5?styles.humanNode:""} key={step}>{step}</span>)}</div></ResourceFigure>
      <p>Its bounded role is <strong>exposure reconstruction + diagnostics + monitoring + ECL integration + validation support</strong>. It should not invent CCFs, change limits, select collection treatments or approve impairment estimates.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> capability connects EAD/CCF development, validation and monitoring. The <Link href="/services/cfo-function">CFO Function</Link> bridge connects exposure assumptions to reported allowance and impairment movement; <Link href="/services/risk-ai-agents">Risk AI Agents</Link> provides the governed automation bridge. Continue through <Link href="/resources/ifrs-9-expected-credit-loss-architecture">IFRS 9 Expected Credit Loss</Link>, <Link href="/resources/lifetime-pd-term-structures-ifrs-9">Lifetime PD Term Structures</Link>, <Link href="/resources/ifrs-9-lgd-recovery-cash-flows">IFRS 9 LGD</Link>, <Link href="/resources/significant-increase-credit-risk-ifrs-9-stage-2">Significant Increase in Credit Risk</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>, <Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/credit-risk-model-validation">Model Validation</Link>.</p>
      <KeyObservation title="Resolve"><p><strong>Current Exposure → Contractual Profile → Behavioural Utilisation → Undrawn Commitment → CCF → Default Timing → EAD Term Structure → Backtesting → ECL Integration.</strong> EAD becomes decision-useful when exposure is forecast as a product-specific path, not copied from a balance snapshot.</p></KeyObservation>
    </section>
  </>;
}
