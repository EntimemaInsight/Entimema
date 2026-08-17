import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./roll-rate-migration.module.css";

export const rollRateMigrationSections = [
  { id: "states", label: "State architecture" }, { id: "roll-rates", label: "From state to roll rate" },
  { id: "matrix", label: "The migration matrix" }, { id: "stock-flow", label: "Stock and flow" },
  { id: "multi-period", label: "Multi-period migration" }, { id: "warning", label: "Early warning and vintages" },
  { id: "decisions", label: "Collections and prioritisation" }, { id: "weighting", label: "Weighting and segmentation" },
  { id: "boundaries", label: "Population boundaries" }, { id: "monitoring", label: "Monitoring architecture" },
  { id: "diagnostic", label: "Migration diagnostic" }, { id: "failure-modes", label: "Failure modes" },
] as const;

const states = ["Current", "1–30 DPD", "31–60 DPD", "61–90 DPD", "Default"];
const counts = [
  [7600, 320, 48, 16, 16], [270, 360, 225, 27, 18], [50, 125, 150, 125, 50], [6, 15, 60, 129, 90], [0, 0, 0, 0, 300],
];
const probabilities = [
  [95, 4, .6, .2, .2], [30, 40, 25, 3, 2], [10, 25, 30, 25, 10], [2, 5, 20, 43, 30], [0, 0, 0, 0, 100],
];
const fmt = (n: number) => `${n.toFixed(n % 1 ? 1 : 0)}%`;
const cellType = (row: number, col: number) => col === 4 ? "default" : col < row ? "improve" : col === row ? "stable" : "deteriorate";

export default function RollRateMigrationArticle() {
  return <>
    <p className={styles.lead}>Two portfolios can report the same delinquency rate and carry materially different future risk. In one, missed payments are temporary and borrowers frequently return to current. In the other, accounts are moving rapidly into deeper delinquency. The stock is identical; the dynamics are not.</p>
    <KeyObservation>Portfolio risk is not defined only by how many accounts are delinquent today, but by the probability that exposures migrate from one risk state to another tomorrow.</KeyObservation>
    <p>A delinquency stock is a snapshot. A migration matrix describes the dynamics that created it. The analytical chain is <strong>account state at t → observed transition → roll rate → migration matrix → cure, deterioration and stability → multi-period default path → portfolio forecast → intervention</strong>.</p>

    <section id="states">
      <h2>State architecture comes before matrix mathematics</h2>
      <p>A migration system begins by assigning every eligible observation to one—and only one—state at each observation date. An illustrative monthly architecture is:</p>
      <div className={styles.stateDefinitions}>{[["S₀","Current"],["S₁","1–30 DPD"],["S₂","31–60 DPD"],["S₃","61–90 DPD"],["Sᴅ","Default"]].map(([s,n])=><span key={s}><b>{s}</b><i>=</i><strong>{n}</strong></span>)}</div>
      <p>These buckets are not universal. Product, payment frequency, default definition, collections process and modelling objective determine a defensible architecture. A weekly-pay product may need shorter intervals; revolving facilities may need utilisation or over-limit signals; closure may require a distinct <strong>S<sub>C</sub></strong> state.</p>
      <h3>Definitions determine what a transition means</h3>
      <p>Days past due depends on due-date logic, payment allocation, grace periods and data cut-off. Cure rules, write-off, restructuring and closure must be explicit. Multiple facilities raise a unit-of-analysis decision: does one defaulted facility move the borrower into default, or is migration measured facility by facility? A matrix built on inconsistent states can be mathematically correct and analytically misleading.</p>
      <p>The terminal state must inherit the governed boundary developed in <Link href="/resources/pd-default-definition-target-construction">Default Definition: The Boundary That Shapes Every PD Model</Link>. Changing that boundary changes transition counts, absorption, cure, cumulative default probability and historical comparability.</p>
    </section>

    <section id="roll-rates">
      <h2>A roll rate is a conditional transition probability</h2>
      <Formula label="Probability of moving from state i at t to state j at t+1"><span>p<sub>ij</sub> = P(S<sub>t+1</sub> = j | S<sub>t</sub> = i)</span></Formula>
      <Formula label="Empirical transition probability"><span>p̂<sub>ij</sub> = N<sub>ij</sub> / ∑<sub>j</sub> N<sub>ij</sub></span></Formula>
      <p><strong>N<sub>ij</sub></strong> is the number of eligible accounts beginning in state i and ending in state j. The denominator is all eligible accounts that began the period in i—not the total portfolio and not the destination population. Thus p<sub>23</sub> asks: among accounts that were 31–60 DPD at opening, what fraction were 61–90 DPD one month later?</p>
      <ResourceFigure label="Credit deterioration path with forward arrows toward default and backward arrows toward current." caption="Forward movement measures deterioration velocity. Backward movement records improvement, which is not automatically formal cure.">
        <div className={styles.path}><span className={styles.pathLabel}>ROLL FORWARD →</span><div>{states.map((state,i)=><span key={state}><b>{state}</b>{i<4?<i>→</i>:null}</span>)}</div><span className={styles.pathLabel}>← ROLL BACK / CURE PATH</span></div>
      </ResourceFigure>
      <div className={styles.threeConcepts}>
        <article><span>FORWARD</span><h3>Deterioration</h3><p>Current → 1–30, 1–30 → 31–60 and 31–60 → 61–90 reveal the velocity with which risk deepens.</p></article>
        <article><span>BACK</span><h3>Improvement</h3><p>Backward migration can reflect payment recovery, collections, temporary delinquency or restored liquidity. It is an observed state change—not necessarily cure.</p></article>
        <article><span>i → i</span><h3>Persistence</h3><p>Remaining in 61–90 DPD is severe unresolved risk. No migration does not mean no economic risk change.</p></article>
      </div>
      <p>A formal cure may require a sustained cure period, exit from default status and treatment of re-default under policy. A one-month improvement cannot silently override those rules. Similarly, setting <strong>P(Default → Default) = 1</strong> creates a useful absorbing-state model, but operational portfolios may later cure, recover, restructure or close. Permanent absorption is a modelling choice, not universal reality.</p>
    </section>

    <section id="matrix">
      <h2>An original 10,000-account one-month portfolio</h2>
      <p>The hypothetical portfolio below contains no institutional data. Opening populations are 8,000 current, 900 at 1–30 DPD, 500 at 31–60 DPD, 300 at 61–90 DPD and 300 already in default. Every row reconciles to its opening population.</p>
      <ResourceTable caption="Illustrative transition counts; rows are opening states and columns are month-end destinations" headers={["State at t",...states,"Opening total"]} rows={counts.map((row,i)=>[states[i],...row.map(n=>n.toLocaleString("en-GB")),row.reduce((a,b)=>a+b,0).toLocaleString("en-GB")])}/>
      <ResourceFigure label="Five by five migration probability matrix. Every cell includes its numeric probability and directional classification." caption="Illustrative account-weighted one-month matrix. Rows sum to 100%; labels preserve meaning without reliance on colour.">
        <div className={styles.matrixWrap}><div className={styles.matrixLegend}><span data-kind="improve">↙ Improve</span><span data-kind="stable">● Stable</span><span data-kind="deteriorate">↗ Deteriorate</span><span data-kind="default">■ Default</span></div><div className={styles.matrix}>
          <span className={styles.corner}>t ↓ / t+1 →</span>{states.map(s=><strong key={s}>{s}</strong>)}
          {probabilities.flatMap((row,i)=>[<strong key={`r-${i}`}>{states[i]}</strong>,...row.map((p,j)=><span key={`${i}-${j}`} data-kind={cellType(i,j)}><b>{fmt(p)}</b><small>{cellType(i,j)}</small></span>)])}
        </div></div>
      </ResourceFigure>
      <Formula label="The actual illustrative one-month transition matrix"><span className={styles.matrixFormula}>P = [ [ .950, .040, .006, .002, .002 ], [ .300, .400, .250, .030, .020 ], [ .100, .250, .300, .250, .100 ], [ .020, .050, .200, .430, .300 ], [ 0, 0, 0, 0, 1.000 ] ]</span></Formula>
      <h3>Read the rows as competing destinations</h3>
      <ul>
        <li><strong>Current is highly persistent:</strong> 95.0% remain current. Yet 5.0% leave current, including 4.0% into early delinquency; at this scale, a small percentage is operationally meaningful.</li>
        <li><strong>1–30 DPD is a leverage point:</strong> 30.0% return current, 40.0% persist, and 30.0% deteriorate. Intervention can be valuable before deeper arrears become entrenched.</li>
        <li><strong>31–60 DPD is balanced on divergent paths:</strong> 35.0% improve, 30.0% persist and 35.0% worsen, including 10.0% directly to default.</li>
        <li><strong>61–90 DPD is severe:</strong> only 27.0% improve, 43.0% remain unresolved and 30.0% default within the month.</li>
        <li><strong>Default is absorbing here:</strong> the 100% diagonal is an analytical convention, not evidence that recovery is impossible.</li>
      </ul>
      <DecisionImplication>A high P(31–60 → 61–90) describes a fundamentally different outlook from a high P(31–60 → 1–30), even when the opening 31–60 stock is identical.</DecisionImplication>
    </section>

    <section id="stock-flow">
      <h2>Stock reports position; flow explains its formation</h2>
      <div className={styles.stockFlow}><article><span>STOCK<sub>t</sub></span><p>How many exposures occupy each state now?</p></article><b>≠</b><article><span>FLOW<sub>t→t+1</sub></span><p>How do those exposures move between states?</p></article></div>
      <p>A rising delinquency stock can reflect more deterioration inflow, lower cure, slower exit, or all three. Each mechanism implies a different management question. A stock measure alone cannot separate them.</p>
      <EntimemaFramework title="The Risk Stock–Flow Identity" description="A portfolio accounting identity for any consistently defined risk state." steps={["Opening risk stock", "+ Deterioration inflow", "− Cure / recovery outflow", "− Closure / exit", "= Closing risk stock"]}/>
      <p>The identity forces reconciliation. If closing 31–60 DPD rises, the analyst can attribute the movement to inflows from better states, outflows to cure or worse states, and legitimate exits. It also exposes missing statuses: an unexplained residual is often a population, snapshot or closure problem before it is a credit insight.</p>
    </section>

    <section id="multi-period">
      <h2>One-period movement compounds into a default path</h2>
      <Formula label="Multi-period migration under a time-homogeneous transition system"><span>P<sup>(2)</sup> = P² &nbsp;&nbsp; and &nbsp;&nbsp; P<sup>(n)</sup> = Pⁿ</span></Formula>
      <p>Matrix multiplication sums every feasible intermediate path. The two-month probability of moving from 31–60 DPD to default includes direct default followed by absorption and indirect routes through every state. Using the illustrative matrix, it is <strong>21.02%</strong>: (10% × 0.2%) + (25% × 2%) + (30% × 10%) + (25% × 30%) + (10% × 100%).</p>
      <p>The one-month roll-to-default from 31–60 is 10.0%; the two-month cumulative probability of occupying default is 21.02%. These answer different horizon questions. In general, <strong>P(S<sub>t+n</sub> = Default | S<sub>t</sub> = i)</strong> is the i-to-default element of Pⁿ when default is absorbing.</p>
      <h3>The Markov assumption is useful—and restrictive</h3>
      <Formula label="First-order Markov assumption"><span>P(S<sub>t+1</sub> | S<sub>t</sub>, S<sub>t−1</sub>, …) = P(S<sub>t+1</sub> | S<sub>t</sub>)</span></Formula>
      <p>This assumes the current state contains all information needed for the next transition and that one matrix remains applicable through time. Real behaviour may depend on prior delinquency, number of cures, borrower characteristics, vintage, macro conditions, collections actions, product and seasonality. Simple matrices are powerful descriptive and scenario tools; they are not automatically complete behavioural models or forecasts.</p>
    </section>

    <section id="warning">
      <h2>Transition drift can reveal risk acceleration early</h2>
      <p>The transition system should be written as <strong>P<sub>t</sub></strong>, not assumed permanent. Comparing rolling monthly or quarterly matrices—or P<sub>2025</sub> with P<sub>2026</sub>—shows whether the mechanism is changing. If P(Current → 1–30) rises and, later, P(1–30 → 31–60) rises, default may not yet have changed materially. The portfolio is nevertheless accelerating toward worse states.</p>
      <KeyObservation title="Early-warning bridge">Migration behaviour can reveal risk acceleration before terminal outcomes become visible. The signal warrants investigation; it does not identify its cause.</KeyObservation>
      <h3>Vintage → migration behaviour → portfolio outcome</h3>
      <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> aligns cohorts at the same credit age. Adding migration reveals why similarly delinquent vintages may develop differently. Vintage A may cure frequently while Vintage B rolls forward. Underwriting, acquisition mix, product design or macro conditions are hypotheses to test—not explanations to assume.</p>
      <p>Transition estimates should therefore be compared at equivalent months on book, with enough observations for stability. A mix shift between vintages can change the aggregate matrix even if every within-vintage transition remains constant.</p>
    </section>

    <section id="decisions">
      <h2>Collections can respond to state and trajectory</h2>
      <p>Early delinquency may support low-cost reminders or contact, intermediate delinquency more intensive engagement, and severe delinquency specialised treatment. These are conceptual treatment tiers, not institution-specific prescriptions. The methodological principle is that collections strategy should respond not only to current state but also to transition probability.</p>
      <div className={styles.borrowers}><article><span>BORROWER A</span><b>1–30 DPD</b><p>High probability of returning current</p></article><article><span>BORROWER B</span><b>1–30 DPD</b><p>High probability of rolling to 31–60</p></article></div>
      <p>The observed state is identical; the expected trajectory differs. Combining <strong>state + transition risk</strong> can support prioritisation, provided any borrower-level estimate is separately developed, validated, monitored and governed. An aggregate matrix alone is not a borrower prediction model.</p>
    </section>

    <section id="weighting">
      <h2>Account flow and exposure flow can disagree</h2>
      <Formula label="Count-weighted and exposure-weighted roll rates"><span>RollRate<sup>accounts</sup><sub>ij</sub> = N<sub>ij</sub>/N<sub>i·</sub> &nbsp;&nbsp; | &nbsp;&nbsp; RollRate<sup>EAD</sup><sub>ij</sub> = EAD<sub>ij</sub>/EAD<sub>i·</sub></span></Formula>
      <p>Each account contributes equally to an account-weighted matrix; exposure weighting gives influence in proportion to balance or EAD. Neither is universally superior. Counts describe behavioural breadth and workload; EAD better describes capital at risk and balance concentration.</p>
      <ResourceTable caption="Compact weighting example: ten accounts begin in 1–30 DPD" headers={["Destination","Accounts","Opening EAD","Account roll rate","EAD roll rate"]} rows={[["Current / improve","8","£8,000","80%","28.6%"],["31–60 / deteriorate","2","£20,000","20%","71.4%"],["Total","10","£28,000","100%","100%"]]}/>
      <p>Most accounts cure, yet the two large exposures deteriorate. Count-level migration improves while exposure-level risk worsens. Reports must label weighting explicitly and reconcile the EAD basis—opening, closing or average—rather than mixing it across periods.</p>
      <h3>Segment only where structure can be distinguished from noise</h3>
      <p>Product, vintage, risk grade, acquisition channel, customer type, geography where relevant, and secured versus unsecured status can conceal genuine heterogeneity. But every split reduces cell counts. Minimum denominators, uncertainty intervals, pooling rules and economic rationale are needed to prevent sparse-state instability from becoming false precision.</p>
    </section>

    <section id="boundaries">
      <h2>Entry, exit and contract changes belong in the architecture</h2>
      <h3>New business and seasoning</h3><p>New originations, acquisitions and portfolio transfers have no previous observed state. Inserting them into an existing-state denominator manufactures transitions. Use a new-entry state or exclude them until two comparable snapshots exist; report seasoning separately where early-life behaviour differs.</p>
      <h3>Closure and prepayment</h3><p>Contractual maturity, prepayment, refinancing and closure remove accounts without default. Closure is not automatically cure. A separate closed state can preserve row reconciliation and distinguish repayment exit from credit improvement.</p>
      <h3>Restructuring</h3><p>Changed contractual terms can reset DPD and make an account appear to improve without genuine economic recovery. Operational status and economic risk state can diverge; restructuring flags and original delinquency history should remain available.</p>
      <h3>Time interval</h3><p>Consistent observation dates are essential. Monthly and quarterly p<sub>ij</sub> have different meanings and should not be casually combined. The temporal discipline in <Link href="/resources/pd-model-observation-performance-windows">PD Model Observation and Performance Windows</Link> applies equally here: define snapshots, eligibility and interval before estimating movement.</p>
      <h3>Migration is related to PD—not identical to it</h3>
      <p>A borrower-level PD asks <strong>P(Default within horizon | X)</strong>. Migration asks <strong>P(S<sub>t+1</sub> = j | S<sub>t</sub> = i)</strong>. State transitions can enrich PD monitoring, scenario analysis and collections, while PD can differentiate borrowers within the same state. Conflating the two discards either horizon or borrower information.</p>
    </section>

    <section id="monitoring">
      <h2>A practical portfolio monitoring architecture</h2>
      <div className={styles.monitorGrid}>{[
        ["Stock metrics","Current, delinquent and default stock"],["Flow metrics","Roll-forward, roll-back, cure and default entry"],
        ["Transition metrics","Full matrix probabilities and state persistence"],["Segmentation","Vintage, product, risk grade and channel"],
        ["Exposure","Account-weighted and EAD-weighted views"],["Time","Current matrix, rolling history and baseline comparison"],
      ].map(([h,p])=><article key={h}><span>{h}</span><p>{p}</p></article>)}</div>
      <p>Production monitoring should retain counts beneath rates, row totals, missing-state reconciliation, definition versions and action chronology. Compare both level and change: a 25% roll-forward rate may be normal for one state, while a move from 10% to 16% may be material even if its absolute level remains below another state.</p>
    </section>

    <section id="diagnostic">
      <h2>The Entimema Migration Diagnostic</h2>
      <p>Plot deterioration inflow against cure capacity using portfolio-specific, empirically justified baselines. The quadrants are a diagnostic language—not a universal regulatory classification or fixed-threshold score.</p>
      <ResourceFigure label="Two by two migration diagnostic with deterioration inflow on the horizontal axis and cure capacity on the vertical axis." caption="Interpret both dimensions relative to a documented portfolio baseline. Movement between quadrants is often more informative than a single placement.">
        <div className={styles.diagnostic}><span className={styles.yAxis}>CURE CAPACITY ↑</span><span className={styles.xAxis}>DETERIORATION INFLOW →</span><article><b>Low deterioration / High cure</b><p>Healthy dynamics; test whether improvement is broad and sustainable.</p></article><article><b>High deterioration / High cure</b><p>High churn; diagnose inflow sources and treatment dependence.</p></article><article><b>Low deterioration / Low cure</b><p>Persistent stock; resolution capacity may be constrained.</p></article><article><b>High deterioration / Low cure</b><p>Strong deterioration; both inflow and weak recovery require attention.</p></article></div>
      </ResourceFigure>
    </section>

    <section id="failure-modes">
      <h2>Failure modes that invalidate interpretation</h2>
      <ResourceTable caption="Migration analysis controls" headers={["Failure mode","Analytical consequence","Control"]} rows={[
        ["Inconsistent DPD logic","Artificial movement between states","Version due-date and payment-allocation rules"],
        ["Inconsistent observation dates","Different transition horizons","Fix cut-off cadence and snapshot timing"],
        ["Mixed count and EAD weighting","Rates answer different questions","Label and reconcile parallel matrices"],
        ["Closure ignored","Rows fail or exits resemble cure","Model closure explicitly where material"],
        ["Roll-back treated as cure","Recovery is overstated","Apply governed cure period and re-default rules"],
        ["Sparse states or segments","Extreme, unstable probabilities","Show counts; pool or suppress weak cells"],
        ["New accounts in denominators","Non-transitions dilute rates","Require a prior eligible state"],
        ["Restructures reset DPD","Contract change resembles recovery","Retain economic-risk and restructure flags"],
        ["One permanent matrix","Regime change is hidden","Monitor Pₜ and challenge homogeneity"],
        ["Default boundary changes","History becomes incomparable","Restate, bridge or mark the definition break"],
      ]}/>
      <h3>Resolve: from backward-looking stock to behavioural system</h3>
      <p>Migration analysis does not replace delinquency stocks, PD models, vintages or collections judgement. It connects them. Stable state definitions turn two snapshots into transitions; transitions become conditional rates; rates form a matrix; repeated matrices expose default paths and changing portfolio velocity; and those dynamics focus investigation and intervention.</p>
      <KeyObservation>A portfolio is not only where its exposures are. It is the set of probabilities governing where they may move next.</KeyObservation>
    </section>
  </>;
}
