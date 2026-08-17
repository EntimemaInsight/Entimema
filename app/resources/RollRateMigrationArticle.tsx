import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./roll-rate-migration.module.css";

export const rollRateMigrationSections = [
  { id: "states", label: "State architecture" }, { id: "roll-rates", label: "From state to roll rate" },
  { id: "denominators", label: "Denominator discipline" }, { id: "matrix", label: "100,000-account matrix" },
  { id: "stock-flow", label: "Stock and flow" }, { id: "time-cure", label: "Time and sustained cure" },
  { id: "vintage-segments", label: "Vintage and segmentation" }, { id: "multi-period", label: "Default paths" },
  { id: "warning", label: "Early-warning architecture" }, { id: "decisions", label: "Collections decisions" },
  { id: "monitoring", label: "Monitoring and ownership" }, { id: "operationalisation", label: "Operationalisation" },
  { id: "failure-modes", label: "Failure modes" }, { id: "automation", label: "Automation bridge" },
] as const;

const states = ["Current", "1–30 DPD", "31–60 DPD", "61–90 DPD", "Default"];
const counts = [
  [76000, 3200, 480, 160, 160], [2700, 3600, 2250, 270, 180], [500, 1250, 1500, 1250, 500], [60, 150, 600, 1290, 900], [0, 0, 0, 0, 3000],
];
const probabilities = [
  [95, 4, .6, .2, .2], [30, 40, 25, 3, 2], [10, 25, 30, 25, 10], [2, 5, 20, 43, 30], [0, 0, 0, 0, 100],
];
const fmt = (n: number) => `${n.toFixed(n % 1 ? 1 : 0)}%`;
const cellType = (row: number, col: number) => col === 4 ? "default" : col < row ? "improve" : col === row ? "stable" : "deteriorate";

export default function RollRateMigrationArticle() {
  return <>
    <p className={styles.lead}>Default is the end of the story. Roll rates show how the story develops. Two portfolios can report the same default stock and carry materially different near-term risk: one may be curing upstream arrears while the other is feeding them rapidly into deeper delinquency.</p>
    <KeyObservation>A portfolio can look stable in stock while deteriorating in flow.</KeyObservation>
    <p>Default rates are necessary, but inherently late. Roll-rate analysis changes the unit of attention from <strong>stock to movement</strong> and from <strong>terminal outcome to transition process</strong>. The practical chain is <strong>state → transition → baseline deviation → persistent pattern → diagnosis → decision → monitored result</strong>.</p>

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

    <section id="denominators">
      <h2>Denominator discipline determines the economic question</h2>
      <p>A roll rate is only interpretable when its origin population, eligibility rules and weight are fixed. The conventional account-count rate divides transitions from i to j by every eligible account that started in i. A surviving-population rate removes closures or missing observations; an eligible-only rate may remove hardship or restructure cases. Each can be internally correct and still answer a different question.</p>
      <Formula label="Account-count roll rate from opening state i"><span>RR<sub>i→j</sub> = N(S<sub>t</sub>=i, S<sub>t+1</sub>=j) / N(S<sub>t</sub>=i)</span></Formula>
      <Formula label="Opening-exposure-weighted roll rate"><span>RR<sup>EAD</sup><sub>i→j</sub> = ∑ EAD<sub>t</sub> I(S<sub>t</sub>=i,S<sub>t+1</sub>=j) / ∑ EAD<sub>t</sub> I(S<sub>t</sub>=i)</span></Formula>
      <ResourceTable caption="The same portfolio can support different valid denominators" headers={["Design choice","Question answered","Primary risk"]} rows={[
        ["Opening account count","How broadly did borrowers move?","Small and large balances count equally"],
        ["Opening EAD","How much opening exposure moved?","Balance changes after t are not represented"],
        ["Surviving population","How did accounts still observed at t+1 move?","Exit can disappear from the story"],
        ["Eligible accounts only","How did the governed analytical population move?","Eligibility changes can create false trends"],
      ]}/>
      <p>Two analysts can therefore produce different, mathematically correct roll rates from the same extract because one measures behavioural breadth and the other measures capital at risk. A production pack should publish the denominator beside every rate, retain the raw cell count and reconcile exclusions. Unlabelled denominator changes are methodology changes, not presentation choices.</p>
    </section>

    <section id="matrix">
      <h2>An original 100,000-account one-month portfolio</h2>
      <p>This fictional consumer lending portfolio contains no institutional data. Opening populations are 80,000 current, 9,000 at 1–30 DPD, 5,000 at 31–60 DPD, 3,000 at 61–90 DPD and 3,000 already in default. Every row reconciles to its opening population.</p>
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
      <h3>Stable default can conceal an upstream shock</h3>
      <ResourceTable caption="Illustrative flow deterioration before the 90+ stock responds" headers={["Metric","Baseline month","Current month","Interpretation"]} rows={[
        ["90+ / default stock","3.0%","3.1%","Headline appears approximately stable"],
        ["Current → 1–30","4.0%","5.6%","New delinquency inflow is 40% above baseline"],
        ["1–30 → 31–60","25.0%","32.0%","Early arrears are deepening faster"],
        ["31–60 → Current cure","10.0%","6.5%","Full one-period cure capacity has weakened"],
        ["31–60 persistence","30.0%","38.0%","Unresolved arrears are accumulating"],
      ]}/>
      <p>The 90+ stock barely moves because exits, write-offs and recoveries still offset new entries. That balance can persist temporarily even while the pipeline feeding default worsens. The correct response is not to declare a default increase inevitable; it is to diagnose whether the upstream changes are persistent, material and concentrated in specific vintages, products or strategies.</p>
      <DecisionImplication>Stock answers “Where is the portfolio now?” Flow answers “How is it moving?” Risk management needs both, reconciled through the same population architecture.</DecisionImplication>
    </section>

    <section id="time-cure">
      <h2>Observation frequency changes the transition being measured</h2>
      <p>Weekly transitions are responsive and useful for operational collections, but can be noisy and sensitive to payroll calendars. Monthly transitions align naturally with many payment cycles and portfolio packs. Quarterly transitions are smoother but compress intervening paths. None is intrinsically superior: cadence must match contractual behaviour, decision latency and data reliability.</p>
      <p>An observed endpoint transition <strong>Current<sub>t</sub> → 31–60<sub>t+1</sub></strong> does not prove a direct jump. The account may have passed through 1–30 DPD between snapshots. Endpoint matrices describe where accounts were observed, not their complete behavioural paths. Event-level data is required when sequence, duration and treatment timing matter.</p>
      <h3>Cure is a path, not a single backward movement</h3>
      <p><strong>61–90 → 31–60</strong> is roll-back, not full cure. <strong>31–60 → Current</strong> is an observed cure under a one-period state definition, but it may be temporary. Separate partial recovery, full cure, sustained cure and re-default after cure.</p>
      <Formula label="Probability that an observed cure remains current h periods later"><span>Sustained Cure<sub>h</sub> = P(S<sub>t+h</sub>=Current | Cure<sub>t</sub>)</span></Formula>
      <p>Collections teams should compare treatment groups on sustained cure and re-default, not only one-month roll-back. Otherwise a strategy that briefly resets arrears can appear effective while failing to restore durable payment behaviour.</p>
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
      <h2>Early warning requires deviation, persistence and diagnosis</h2>
      <p>The transition system should be written as <strong>P<sub>t</sub></strong>, not assumed permanent. Comparing rolling monthly or quarterly matrices—or P<sub>2025</sub> with P<sub>2026</sub>—shows whether the mechanism is changing. If P(Current → 1–30) rises and, later, P(1–30 → 31–60) rises, default may not yet have changed materially. The portfolio is nevertheless accelerating toward worse states.</p>
      <Formula label="Transition signal relative to a governed baseline"><span>Signal<sub>ij,t</sub> = RR<sub>ij,t</sub> − Baseline(RR<sub>ij</sub>)</span></Formula>
      <EntimemaFramework title="Transition → Baseline → Deviation → Persistence → Diagnosis → Action" description="A single rate becomes an early-warning indicator only when it is interpreted against context and connected to an owned response." steps={["Measure the transition", "Select comparable history", "Quantify change", "Confirm persistence", "Locate the driver", "Assign a decision"]}/>
      <KeyObservation title="Early-warning bridge">Migration behaviour can reveal risk acceleration before terminal outcomes become visible. The signal warrants investigation; it does not identify its cause.</KeyObservation>
      <p>Before escalation, test statistical noise, seasonality, vintage mix, rapid portfolio growth, policy changes, treatment allocation and macroeconomic conditions. A single monthly deviation should normally create an investigation, not an automatic intervention. Repetition, exposure materiality, cross-signal confirmation and downstream emergence strengthen the case.</p>
    </section>

    <section id="decisions">
      <h2>Collections can respond to state and trajectory</h2>
      <p>Early delinquency may support low-cost reminders or contact, intermediate delinquency more intensive engagement, and severe delinquency specialised treatment. These are conceptual treatment tiers, not institution-specific prescriptions. The methodological principle is that collections strategy should respond not only to current state but also to transition probability.</p>
      <div className={styles.borrowers}><article><span>BORROWER A</span><b>1–30 DPD</b><p>High probability of returning current</p></article><article><span>BORROWER B</span><b>1–30 DPD</b><p>High probability of rolling to 31–60</p></article></div>
      <p>The observed state is identical; the expected trajectory differs. Combining <strong>state + transition risk</strong> can support prioritisation, provided any borrower-level estimate is separately developed, validated, monitored and governed. An aggregate matrix alone is not a borrower prediction model.</p>
      <ResourceTable caption="Transition patterns create decision hypotheses, not universal treatment rules" headers={["Observed pattern","Decision hypothesis","Evidence to validate"]} rows={[
        ["High Current → 1–30","Reduce payment friction; test reminders or autopay","Failure reason, due-date timing, contactability, experiment lift"],
        ["High 1–30 → 31–60","Challenge early collections and affordability stress","Contact strategy, promise-to-pay, income shock, channel and vintage"],
        ["High 31–60 persistence","Re-segment treatment and assess restructuring","Duration, prior cures, treatment history, sustainable affordability"],
        ["High 61–90 → Default","Review late-stage recovery economics and provisioning impact","Expected recovery, legal cost, restructuring viability, EAD"],
      ]}/>
      <EntimemaFramework title="Observe → Compare → Diagnose → Segment → Test → Intervene → Monitor" description="Analytics becomes risk management only when every observation has a route to a testable, owned decision." steps={["Observe", "Compare", "Diagnose", "Segment", "Test", "Intervene", "Monitor"]}/>
    </section>

    <section id="vintage-segments">
      <h2>Vintage and segment views separate mix from deterioration</h2>
      <p>Aggregate roll rates mix borrowers originated under different underwriting policies, scorecards, pricing regimes, channels and macroeconomic environments. Estimate <strong>RR<sup>(v)</sup><sub>i→j</sub></strong> for vintage v at comparable months on book. If every vintage is worsening, the evidence supports a portfolio-wide diagnosis; if one recent vintage diverges, the first investigation should focus on its origination and early-life conditions.</p>
      <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> establishes the cohort view; roll rates explain the transition mechanism beneath each cumulative vintage curve.</p>
      <h3>Account flow and exposure flow can disagree</h3>
      <Formula label="Count-weighted and exposure-weighted roll rates"><span>RollRate<sup>accounts</sup><sub>ij</sub> = N<sub>ij</sub>/N<sub>i·</sub> &nbsp;&nbsp; | &nbsp;&nbsp; RollRate<sup>EAD</sup><sub>ij</sub> = EAD<sub>ij</sub>/EAD<sub>i·</sub></span></Formula>
      <p>Each account contributes equally to an account-weighted matrix; exposure weighting gives influence in proportion to balance or EAD. Neither is universally superior. Counts describe behavioural breadth and workload; EAD better describes capital at risk and balance concentration.</p>
      <ResourceTable caption="Compact weighting example: ten accounts begin in 1–30 DPD" headers={["Destination","Accounts","Opening EAD","Account roll rate","EAD roll rate"]} rows={[["Current / improve","8","£8,000","80%","28.6%"],["31–60 / deteriorate","2","£20,000","20%","71.4%"],["Total","10","£28,000","100%","100%"]]}/>
      <p>Most accounts cure, yet the two large exposures deteriorate. Count-level migration improves while exposure-level risk worsens. Reports must label weighting explicitly and reconcile the EAD basis—opening, closing or average—rather than mixing it across periods.</p>
      <h3>Segment only where structure can be distinguished from noise</h3>
      <p>Product, vintage, risk grade, acquisition channel, customer type, geography where relevant, and secured versus unsecured status can conceal genuine heterogeneity. But every split reduces cell counts. Minimum denominators, uncertainty intervals, pooling rules and economic rationale are needed to prevent sparse-state instability from becoming false precision.</p>
      <KeyObservation>The governing trade-off is diagnostic resolution versus statistical stability. More cells do not automatically produce more information.</KeyObservation>
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
      <p>Every review should answer five questions: <strong>What changed? Where did it change? Is it persistent? Why might it have changed? What decision should follow?</strong> The pack should include account and EAD transitions, cure and persistence, vintage and segment views, historical level and volatility, alert thresholds, economic materiality, and later default emergence.</p>
      <p>Thresholds need named owners, escalation paths and evidence requirements. Without decision ownership, monitoring becomes an increasingly elaborate description of the past.</p>
    </section>

    <section id="diagnostic">
      <h2>The Entimema Migration Diagnostic</h2>
      <p>Plot deterioration inflow against cure capacity using portfolio-specific, empirically justified baselines. The quadrants are a diagnostic language—not a universal regulatory classification or fixed-threshold score.</p>
      <ResourceFigure label="Two by two migration diagnostic with deterioration inflow on the horizontal axis and cure capacity on the vertical axis." caption="Interpret both dimensions relative to a documented portfolio baseline. Movement between quadrants is often more informative than a single placement.">
        <div className={styles.diagnostic}><span className={styles.yAxis}>CURE CAPACITY ↑</span><span className={styles.xAxis}>DETERIORATION INFLOW →</span><article><b>Low deterioration / High cure</b><p>Healthy dynamics; test whether improvement is broad and sustainable.</p></article><article><b>High deterioration / High cure</b><p>High churn; diagnose inflow sources and treatment dependence.</p></article><article><b>Low deterioration / Low cure</b><p>Persistent stock; resolution capacity may be constrained.</p></article><article><b>High deterioration / Low cure</b><p>Strong deterioration; both inflow and weak recovery require attention.</p></article></div>
      </ResourceFigure>
    </section>

    <section id="operationalisation">
      <h2>Production begins with a reproducible account-state spine</h2>
      <EntimemaFramework title="Account data → state assignment → transitions → segmentation → baseline → anomaly → diagnosis → recommendation → monitoring" description="A production chain that preserves reconciliation from raw account observations to an owned decision." steps={["Account snapshots", "Governed states", "Paired transitions", "Segment views", "Comparable baseline", "Material anomaly", "Diagnostic evidence", "Decision recommendation", "Outcome monitoring"]}/>
      <p>The minimum data spine includes a persistent account identifier, observation date, delinquency status or sufficient payment fields to derive it, opening balance or EAD, product, origination date, risk grade or score band, and closure/default/restructure flags. Collections diagnosis also needs treatment, contact, promise-to-pay and outcome history. Definition versions and data lineage are control data, not optional metadata.</p>
      <p>Build transitions by pairing consecutive eligible snapshots at the chosen cadence. Preserve unmatched openings, entries and exits as reconciliation categories. Store numerator, denominator and weight beside each rate. Baselines should be comparable by season, months on book and policy regime; alert logic should combine statistical departure with business materiality.</p>
    </section>

    <section id="failure-modes">
      <h2>Failure modes that invalidate interpretation</h2>
      <ResourceTable caption="Migration analysis controls" headers={["Failure mode","Analytical consequence","Control"]} rows={[
        ["Stocks mixed with flows","Position is mistaken for movement","Reconcile opening, inflow, outflow and closing stock"],
        ["Inconsistent DPD logic","Artificial movement between states","Version due-date and payment-allocation rules"],
        ["Inconsistent observation dates","Different transition horizons","Fix cut-off cadence and snapshot timing"],
        ["Mixed count and EAD weighting","Rates answer different questions","Label and reconcile parallel matrices"],
        ["Closure ignored","Rows fail or exits resemble cure","Model closure explicitly where material"],
        ["Roll-back treated as cure","Recovery is overstated","Apply governed cure period and re-default rules"],
        ["Sparse states or segments","Extreme, unstable probabilities","Show counts; pool or suppress weak cells"],
        ["Vintages mixed","Origination-regime deterioration is diluted","Compare at equivalent months on book"],
        ["Portfolio growth ignored","Young current accounts dilute aggregate rates","Control for entry and seasoning"],
        ["Seasonality ignored","Calendar effects resemble structural drift","Use comparable seasonal baselines"],
        ["New accounts in denominators","Non-transitions dilute rates","Require a prior eligible state"],
        ["Restructures reset DPD","Contract change resembles recovery","Retain economic-risk and restructure flags"],
        ["One permanent matrix","Regime change is hidden","Monitor Pₜ and challenge homogeneity"],
        ["Default boundary changes","History becomes incomparable","Restate, bridge or mark the definition break"],
        ["Correlation treated as cause","An association drives an unjustified action","Form hypotheses and test competing explanations"],
        ["No decision owner","Alerts accumulate without intervention","Assign thresholds, owner, evidence and response SLA"],
      ]}/>
      <h3>Resolve: from backward-looking stock to behavioural system</h3>
      <p>Migration analysis does not replace delinquency stocks, PD models, vintages or collections judgement. It connects them. Stable state definitions turn two snapshots into transitions; transitions become conditional rates; rates form a matrix; repeated matrices expose default paths and changing portfolio velocity; and those dynamics focus investigation and intervention.</p>
      <KeyObservation>A portfolio is not only where its exposures are. It is the set of probabilities governing where they may move next.</KeyObservation>
    </section>

    <section id="automation">
      <h2>Roll-rate monitoring is a natural candidate for controlled automation</h2>
      <p>A future <strong>Portfolio Migration &amp; Early Warning Agent</strong> could ingest periodic portfolio data, reconstruct governed states, calculate count- and exposure-weighted transitions, compare them with historical baselines, and locate abnormal changes by vintage and segment. It could then distinguish isolated noise from persistent deterioration, assemble diagnostic evidence and prioritise cases for human review.</p>
      <p>The calculation layer should remain deterministic and reproducible. The Agent’s role is orchestration: selecting approved comparisons, navigating drill-downs, documenting evidence and routing recommendations within explicit permissions. This is valuable because the workflow is repetitive, data-intensive and decision-oriented—not because judgement should be removed.</p>
      <p>Related implementation research on <Link href="/resources/automating-roll-rate-migration-analysis-r-ai-collections-analyst">automating roll-rate and migration analysis</Link> develops the engineering bridge. Entimema’s <Link href="/services/credit-risk">Credit Risk</Link> practice connects portfolio methodology, monitoring design and controlled decision systems.</p>
    </section>
  </>;
}
