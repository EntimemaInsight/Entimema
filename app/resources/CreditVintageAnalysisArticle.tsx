import Link from "next/link";
import { DecisionImplication, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import { creditVintageModel as model } from "./credit-vintage-model";
import styles from "./resources.module.css";

export const creditVintageSections = [
  { id:"credit-age", label:"Calendar time and credit age" }, { id:"framework-04", label:"Entimema Framework 04" },
  { id:"metric", label:"Cohorts and metric discipline" }, { id:"illustrative-vintages", label:"Illustrative vintages" },
  { id:"same-age", label:"Compare credit at the same age" }, { id:"investigation", label:"From divergence to investigation" },
  { id:"monitoring", label:"Monitoring and data" }, { id:"principles", label:"Principles and limitations" },
] as const;

const pct = (value: number | null) => value === null ? "—" : `${value.toFixed(1)}%`;
const chart = { left:45, top:20, width:590, height:230, max:5 };
const point = (mob:number,value:number) => `${chart.left + (mob - 1) * chart.width / 3},${chart.top + chart.height - value / chart.max * chart.height}`;

export default function CreditVintageAnalysisArticle() {
  return <>
    <p className={styles.leadParagraph}>Portfolio averages describe the credit book at a point in time. Vintage analysis reveals how different origination cohorts develop as they age. By aligning exposures at comparable months on book, it can show whether newer cohorts are following the historical performance path—or diverging from it.</p>
    <p>That divergence can provide a cohort-level signal before it becomes dominant in the aggregate portfolio result. It is not, by itself, a diagnosis. A vintage curve shows a pattern that justifies investigation; segmentation, hypothesis testing and validation are required before a credit-policy decision follows.</p>
    <KeyObservation>A portfolio can look stable in aggregate while newer cohorts are already deteriorating underneath the average.</KeyObservation>

    <section id="credit-age">
      <h2>Calendar time and credit age answer different questions</h2>
      <p>A calendar-time view asks what the portfolio delinquency rate is in August. That measure combines exposures originated at different dates and therefore at different stages of their credit life. It remains essential for portfolio reporting, provisioning, collections planning and current risk assessment.</p>
      <p>A vintage view asks how loans originated in March perform at MOB 1, MOB 2, MOB 3 and later points. MOB means months on book: time since origination under the definition used by the portfolio. Aligning cohorts by credit age enables a more meaningful comparison of development paths.</p>
      <ResourceTable caption="Complementary views of portfolio performance" headers={["Calendar-time view","Vintage / cohort view"]} rows={[
        ["What does the portfolio look like today?","How does each origination cohort develop as it ages?"],
        ["Combines multiple credit ages","Aligns exposures at comparable MOB"],
        ["Supports current portfolio management","Supports cohort comparison and divergence analysis"],
        ["May be dominated by larger mature cohorts","Can expose smaller recent cohorts separately"],
      ]}/>
      <p>Neither view is inherently superior. They organise risk information around different questions. Management needs the current portfolio position and the development path underneath it. Confusing the two can make maturity effects look like credit-quality effects.</p>
      <p>The views should also reconcile conceptually. Calendar-time results are produced by the vintages that compose the book, weighted by their balances or accounts under the selected metric. A vintage dashboard that cannot be connected back to portfolio reporting may contain definition, population or timing differences that need resolution before interpretation.</p>
    </section>

    <section id="framework-04">
      <h2>Entimema Framework 04: Credit Vintage Architecture</h2>
      <p>Framework 04 extends beyond the vintage chart. An origination cohort is aligned by MOB; a defined performance path develops; comparable cohorts are examined for divergence; a risk signal triggers segmentation; hypotheses are generated and validated; only then does evidence enter a credit decision.</p>
      <ResourceFigure label="Entimema Framework 04. Origination cohort flows through months on book, performance path, cohort comparison, risk signal, segmentation, hypothesis, validation and credit decision. A decision dimension moves from observation through segmentation, hypothesis and validation to decision." caption="A vintage pattern is evidence for investigation, not automatic proof of its cause. Decisions remain conditional on segmentation and validation.">
        <div className={styles.framework04}><ol>{["Origination cohort","MOB / credit age","Performance path","Cohort comparison","Risk signal","Segmentation","Driver hypothesis","Validation","Credit decision"].map((x,i)=><li key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></li>)}</ol><div>{["Observation","Segmentation","Hypothesis","Validation","Decision"].map(x=><span key={x}>{x}</span>)}</div></div>
      </ResourceFigure>
      <p>Suppose newer vintages deteriorate faster at equivalent MOB. The observation may be segmented by channel, score band, product, customer type, geography or policy version where relevant. Analysts then test hypotheses against origination mix, policy changes, macro conditions, operations, fraud and collections. The sequence is signal → investigation → validation → decision, never signal → automatic policy change.</p>
      <p>The architecture deliberately separates detection from action. A monitoring threshold can identify unusual divergence, but the threshold itself should reflect cohort size, normal variation, metric maturity and the cost of false escalation. A visible deviation is not necessarily statistically or economically material. The framework structures the questions; it does not manufacture certainty.</p>
    </section>

    <section id="metric">
      <h2>Cohort and metric definitions shape the result</h2>
      <p>A vintage may be an origination month, quarter or another economically meaningful period. Monthly cohorts provide granularity but may be noisy when origination volumes are small. Quarterly cohorts may improve stability but delay visibility. The appropriate interval depends on portfolio size, product, risk horizon, data availability and decision cadence.</p>
      <p>Origination itself also needs a consistent event definition. Application date, approval date, booking date, first draw and first repayment can place the same exposure in different cohorts. Revolving products may require a different cohort architecture from instalment lending. The chosen event should match the risk process and remain stable across the comparison history.</p>
      <p>Vintage architecture can be applied to 30+, 60+ or 90+ days past due, default, cumulative default, loss, charge-off or another consistently defined outcome. These measures are not interchangeable. The illustrative portfolio uses one metric throughout: the point-in-time percentage of accounts that are 30 or more days past due at each MOB.</p>
      <h3>Numerator and denominator discipline</h3>
      <p>Account-count rates can differ from balance-weighted rates. Original balance, current exposure and number of accounts answer different economic questions. Point-in-time delinquency, ever-delinquent and cumulative bad rates also describe different paths. Prepayment and attrition can change the remaining denominator as a cohort ages.</p>
      <p>The example uses account count for a point-in-time 30+ DPD rate. It does not describe cumulative default or loss severity. A production implementation should document numerator, denominator, observation timing, cures, write-offs and cohort eligibility explicitly so that comparisons remain consistent.</p>
      <p>Balance-weighted and count-weighted views can be complementary. A small number of high-balance exposures may dominate an exposure rate while a broad deterioration in small accounts dominates a count rate. Management should select the measure aligned to the decision and, where material, compare both before concluding that a cohort shift is broad or concentrated.</p>
    </section>

    <section id="illustrative-vintages">
      <h2>Illustrative portfolio: newer cohorts diverge earlier</h2>
      <p>The hypothetical dataset contains four monthly cohorts. January and February develop similarly. March is worse at every observed MOB and reaches 4.6% at MOB 4. April begins higher and reaches 4.5% by MOB 3, but it has not matured to MOB 4. No April MOB 4 value is interpolated.</p>
      <ResourceTable caption={`Illustrative portfolio — ${model.metric}`} headers={["Vintage",...model.mobs.map(m=>`MOB ${m}`)]} rows={model.cohorts.map(c=>[c.name,...c.values.map(pct)])}/>
      <ResourceFigure label="Illustrative point-in-time 30 plus days past due account rates by months on book. January rises from 1.2 to 3.2 percent, February from 1.3 to 3.5, March from 1.5 to 4.6, and April from 1.8 to 4.5 through MOB 3 with MOB 4 not yet observed." caption="Illustrative portfolio. Lines use distinct dash patterns and direct labels as well as colour. April ends at MOB 3 because MOB 4 is immature.">
        <div className={styles.vintageChart}><span>30+ DPD ACCOUNT RATE</span><svg viewBox="0 0 680 290" role="presentation">{[0,1,2,3,4,5].map(v=><g key={v}><line x1="45" x2="635" y1={250-v*46} y2={250-v*46}/><text x="7" y={254-v*46}>{v}%</text></g>)}{model.mobs.map((m,i)=><text x={45+i*590/3} y="277" textAnchor="middle" key={m}>MOB {m}</text>)}{model.cohorts.map((c,ci)=>{const pts=c.values.map((v,i)=>v===null?null:point(i+1,v)).filter(Boolean).join(" ");const last=c.values.reduce((a,v,i)=>v===null?a:i,0);const value=c.values[last] as number;return <g className={styles[`vintageSeries${ci+1}`]} key={c.name}><polyline points={pts}/>{c.values.map((v,i)=>v===null?null:<circle key={i} cx={point(i+1,v).split(",")[0]} cy={point(i+1,v).split(",")[1]} r="4"/>)}<text x={Number(point(last+1,value).split(",")[0])+8} y={Number(point(last+1,value).split(",")[1])-7}>{c.name}</text></g>})}</svg></div>
      </ResourceFigure>
      <ResourceFigure label="Matrix of the same illustrative 30 plus days past due account rates. Values increase from 1.2 to 3.2 percent for January, 1.3 to 3.5 for February, 1.5 to 4.6 for March and 1.8 to 4.5 through MOB 3 for April; April MOB 4 is missing." caption="The matrix uses the same validated dataset as the chart. Numeric values preserve meaning independently of background intensity.">
        <div className={styles.vintageMatrix}><div/><>{model.mobs.map(m=><strong key={m}>MOB {m}</strong>)}</>{model.cohorts.flatMap(c=>[<strong key={`${c.name}-label`}>{c.name}</strong>,...c.values.map((v,i)=><span data-level={v===null?"missing":Math.ceil(v)} key={`${c.name}-${i}`}>{pct(v)}</span>)])}</div>
      </ResourceFigure>
      <p>At MOB 2, January is 2.1%, February 2.2%, March 2.7% and April 3.1%. At MOB 3, the sequence is 2.8%, 3.0%, 3.8% and 4.5%. Newer cohorts are performing worse at comparable ages. That is a material pattern for investigation, but the table cannot identify why it occurred.</p>
      <p>The curve shape provides additional descriptive information. January and February rise gradually and remain close. March separates more clearly after MOB 1. April begins above the other cohorts and continues to diverge through the observed horizon. These differences can help prioritise questions about origination and early account management, but they do not establish whether the mechanism sits in policy, mix, macro conditions, fraud, operations or collections.</p>
    </section>

    <section id="same-age">
      <h2>Compare credit at the same age</h2>
      <p>Comparing January at MOB 8 with April at MOB 2 confounds cohort and maturity. Delinquency frequently develops with time on book, so an older cohort has had more opportunity to reach the measured state. A more meaningful vintage comparison aligns January, February, March and April at MOB 2, then repeats that comparison at later MOB as data matures.</p>
      <p>Recent vintages are therefore incomplete by design. April may look worse through MOB 3, but its later path remains unknown. Analysts should not extrapolate an unobserved point merely to complete the line. Maturity markers, cohort sizes and observation cut-off dates should remain visible in production reporting.</p>
      <p>Seasonality can complicate same-age comparisons even when MOB is aligned. A cohort originated before a holiday period, tax deadline or seasonal employment cycle may encounter different conditions at MOB 2 from a cohort originated six months earlier. Calendar and credit age may both matter, so vintage interpretation should retain macro and seasonal context rather than treating alignment as complete control.</p>
      <h3>Aggregate stability can hide cohort deterioration</h3>
      <p>Older cohorts may be larger, more mature and historically stronger, and therefore dominate the portfolio denominator. Deterioration in smaller recent cohorts may initially have limited effect on the aggregate delinquency rate. Aggregate stability does not guarantee cohort stability.</p>
      <p>This is the qualified early-signal value of vintage analysis: it can reveal divergence in newer cohorts before those cohorts dominate portfolio averages. Signal does not mean prediction, and it does not establish causality. It identifies where analytical attention should begin.</p>
      <p>Conversely, a stable vintage path does not guarantee that every risk dimension is stable. Loss severity, exposure growth, prepayment, fraud or concentration may move without appearing in a 30+ DPD count rate. The metric should therefore be positioned inside a wider monitoring system rather than treated as a complete representation of portfolio risk.</p>
    </section>

    <section id="investigation">
      <h2>Divergence becomes useful through decomposition</h2>
      <p>The first question is where the divergence is concentrated. Depending on portfolio design and data, useful dimensions may include score band, product, origination channel, customer type, purpose, ticket size, LTV, geography, tenor, policy version, pricing band or manual override. Not every dimension applies to every portfolio, and small cells can create unstable comparisons.</p>
      <p>A concentration in one channel suggests a different investigation from broad deterioration across all segments. A shift in score distribution may motivate review of cut-offs, approval rates, overrides or score calibration. A policy-version difference may point towards specific rule changes. None of these patterns alone validates or invalidates a scorecard or policy.</p>
      <p>Segmentation introduces its own risks. Repeated slicing can produce small, unstable groups and apparently extreme rates by chance. Segment definitions should be economically meaningful, cohort volumes visible and comparisons planned around credible hypotheses. Material findings may require confidence intervals, controlled tests or multivariate analysis beyond a descriptive vintage view.</p>
      <ResourceFigure label="Signal-to-decision sequence: vintage divergence, segment, hypothesis, validate and decide. Observation is not causality." caption="A cohort pattern narrows investigation. Material policy action should follow evidence appropriate to the decision and portfolio."><div className={styles.signalDecision}>{["Vintage divergence","Segment","Hypothesis","Validate","Decide"].map((x,i)=><span key={x}><b>{String(i+1).padStart(2,"0")}</b><strong>{x}</strong></span>)}<p>OBSERVATION ≠ CAUSALITY</p></div></ResourceFigure>
      <p>Potential explanations include origination mix, score cut-off or policy changes, channel composition, pricing, macroeconomic conditions, fraud, operational changes, data definitions and collection strategy. These are hypotheses. Validation may require controlled comparisons, policy and model analysis, operational evidence, statistical testing or additional observation periods.</p>
      <p>Policy chronology is especially important. If a rule changed midway through a monthly cohort, the cohort may blend two policy populations. Approval strategy, manual overrides, score distribution, limits and risk-based pricing should be aligned to effective dates. Otherwise, apparent vintage differences may be attributed to a policy version that did not actually govern every exposure in the group.</p>
      <DecisionImplication>Credit-policy, pricing, limit, channel, manual-review or collection changes should be proportionate to validated evidence—not triggered mechanically by one diverging curve.</DecisionImplication>
      <h3>A complementary transition view</h3>
      <p>Vintage analysis asks how a cohort develops as it ages. Transition analysis asks how exposures migrate between risk or delinquency states. The views are complementary: one organises development by origination cohort, while the other organises movement between states. Transition matrices require their own methodology and are not developed here.</p>
    </section>

    <section id="monitoring">
      <h2>Vintage analysis is a monitoring system, not a one-off chart</h2>
      <p>A repeatable process connects new originations to performance observation, vintage updates, cohort comparison, divergence detection, investigation and policy feedback. The cadence should match portfolio scale, data latency, performance horizon and decision needs; no one frequency is appropriate for every credit business.</p>
      <p>Typical data include origination date, observation date, exposure identifier, performance status, delinquency or default indicator, balance or original amount where required, and relevant segmentation variables. Stable exposure keys and observation snapshots are necessary to reconstruct comparable paths.</p>
      <p>Consistent definitions across vintages are critical. A change in delinquency logic, cure treatment, write-off timing, observation cut-off or source-system mapping can create artificial divergence. Data-quality and definition checks should occur before a portfolio pattern is interpreted economically. This is where contextual <Link href="/services/financial-data">financial data architecture</Link> supports risk monitoring.</p>
      <p>A monitoring system should retain reproducible snapshots rather than recompute history using current definitions without disclosure. When a definition legitimately changes, analysts may need parallel measures, restated history or a clear break marker. Governance should record the change so that a visual discontinuity is not mistaken for credit deterioration.</p>
    </section>

    <section id="principles">
      <h2>Three principles—and the limits around them</h2>
      <div className={styles.principles}><article><span>PRINCIPLE 01</span><h3>Compare credits at the same age.</h3><p>Align cohorts at equivalent stages of development.</p></article><article><span>PRINCIPLE 02</span><h3>Aggregate stability can hide cohort deterioration.</h3><p>Recent-vintage performance may move before the portfolio average.</p></article><article><span>PRINCIPLE 03</span><h3>A vintage signal is not a diagnosis.</h3><p>Divergence identifies where investigation should begin, not why it occurred.</p></article></div>
      <h3>Limitations are part of risk interpretation</h3>
      <p>Recent vintages are immature and small cohorts can be noisy. Seasonality, portfolio mix, policy changes and macroeconomic conditions may affect cohorts differently. Collection practice influences observed delinquency. Metric definition and denominator choice matter; prepayment, attrition, cures and write-offs can alter the observed path.</p>
      <p>Vintage analysis is descriptive and diagnostic evidence, not automatic causal proof. Statistical validation and additional portfolio evidence may be required before material policy changes. Curves can also react slowly when the selected metric develops late, so a vintage system should sit beside—not replace—other portfolio, model, operational and macro monitoring.</p>
      <p>Actions can also change the subsequent path. Collection strategy, hardship treatment, restructures and sales of delinquent exposures affect observed performance. This feedback is not a defect, but it means the curve reflects both borrower behaviour and portfolio management. Comparisons should account for material treatment changes when interpreting the mechanism.</p>
      <h3>The purpose is investigation that improves decisions</h3>
      <p>The objective is not to produce a collection of cohort curves. It is to make the development of credit risk visible clearly enough for management to investigate what is changing. When cohorts are aligned by age, definitions remain consistent and divergence is decomposed responsibly, vintage analysis becomes part of a controlled path from risk signal to credit decision.</p>
    </section>
  </>;
}
