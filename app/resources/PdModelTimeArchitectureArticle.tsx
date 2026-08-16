import Link from "next/link";
import { EntimemaFramework, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pd-model-time-architecture.module.css";

export const pdModelTimeArchitectureSections = [
  { id: "prediction-clock", label: "The prediction clock" },
  { id: "time-zero", label: "Time zero and leakage" },
  { id: "performance-window", label: "What horizon defines risk?" },
  { id: "sample-architecture", label: "The sample is a temporal model" },
  { id: "design-sequence", label: "Define the clock before the probability" },
] as const;

const failures = [
  ["Unclear time zero", "Records are assembled around convenient dates", "Feature availability and outcomes vary between observations", "Performance looks portable when the prediction question is not consistent"],
  ["Predictor–outcome overlap", "Aggregates cross the reference boundary", "Future behaviour enters the predictor set", "Discrimination is overstated and collapses in production"],
  ["Immature vintages", "Recent accounts are labelled before the horizon completes", "Defaults have not had time to emerge", "Recent lending appears artificially safe"],
  ["One-regime sample", "Availability or recency dominates sample selection", "Risk relationships reflect a narrow macro state", "Validation outside that state reveals instability"],
  ["Repeated observations", "Monthly snapshots are counted as independent rows", "Borrowers, accounts and macro conditions recur", "Nominal sample size exaggerates independent information"],
  ["Changing definitions", "Default or source fields change across periods", "The target or predictors cease to mean the same thing", "Temporal change is mistaken for risk differentiation"],
];

export default function PdModelTimeArchitectureArticle() {
  return (
    <>
      <p className={styles.lead}><em>A probability-of-default model can be statistically excellent and still answer the wrong risk question. The failure may have happened before regression, WoE or variable selection—when the development sample was placed on the wrong clock.</em></p>

      <section id="prediction-clock">
        <h2>The model begins with a prediction clock</h2>
        <p>Every PD model needs two temporal definitions. The <strong>observation window</strong> determines the historical information available at the decision or reference point. The <strong>performance window</strong> determines the subsequent period over which default is observed. Between them sits <strong>time zero</strong>: the instant at which prediction is made.</p>
        <p>The architecture is simple to state and consequential to design:</p>

        <ResourceFigure label="The PD model prediction clock. Historical information in the observation window stops at time zero. The performance window begins after time zero and ends at the outcome. A leakage path shows impermissible information crossing the boundary." caption="The PD model prediction clock: information belongs to the past; the target belongs to the future. Leakage occurs when that boundary is breached.">
          <div className={styles.clock}>
            <header><span>WHAT THE MODEL MAY KNOW</span><span>WHAT THE MODEL MUST PREDICT</span></header>
            <div className={styles.clockBody}>
              <div className={styles.observation}><small>HISTORICAL DATA</small><strong>Observation window</strong><i aria-hidden="true" /></div>
              <div className={styles.timeZero}><span>TIME ZERO</span><strong>Decision / snapshot</strong></div>
              <div className={styles.performance}><small>FUTURE OUTCOME</small><strong>Performance window</strong><i aria-hidden="true" /><b>OUTCOME</b></div>
              <div className={styles.leakage}><span>LEAKAGE</span><i aria-hidden="true" /></div>
            </div>
          </div>
        </ResourceFigure>

        <p>For an application scorecard, time zero may be the application decision. For a behavioural model, it may be a month-end portfolio snapshot or review date. Account opening can be appropriate for another purpose. These choices are not interchangeable: they define the economic question the model learns.</p>
        <KeyObservation title="The foundational distinction"><p><strong>Past information → decision / reference date → future outcome.</strong> The sample is valid only when every predictor and every target respects that direction of time.</p></KeyObservation>
      </section>

      <section id="time-zero">
        <h2>Time zero is an information boundary</h2>
        <p>An ambiguous reference date creates more than untidy data. It permits different observations to contain different information sets, starts outcome measurement from inconsistent points and makes rows that look comparable answer different questions.</p>
        <p>The core rule—<strong>the model must not know the future</strong>—is therefore stricter than removing an explicit default flag. Leakage can enter through a status field updated after decision, delinquency or restructuring information recorded inside the performance period, subsequent collections activity, or an aggregate whose calculation window quietly crosses time zero. A feature can be historically named yet temporally unavailable.</p>
        <p>This is precisely why leakage is dangerous: it often improves validation statistics. The model appears powerful because it has been given early evidence of the event it is supposed to predict. Once deployed at the real decision point, that information does not exist.</p>

        <ResourceFigure label="Three sample timelines compare a valid observation, a leaked observation and an immature observation. The valid row has historical observation before time zero and a complete future performance window. Leakage crosses time zero. The immature row contains only partial performance." caption="Good sample, leaked sample and immature sample: three rows can look complete in a table while carrying fundamentally different evidential status.">
          <div className={styles.sampleStates}>
            <article className={styles.valid}><header><span>A</span><strong>VALID</strong></header><div><b>Observation</b><i /><em>Time zero</em><i /><b>Full performance</b></div><p>Known before decision · outcome fully matured</p></article>
            <article className={styles.leaked}><header><span>B</span><strong>LEAKAGE</strong></header><div><b>Observation</b><i className={styles.crossing} /><em>Time zero</em><i /><b>Performance</b></div><p>Predictor information crosses the boundary</p></article>
            <article className={styles.immature}><header><span>C</span><strong>IMMATURE</strong></header><div><b>Observation</b><i /><em>Time zero</em><i className={styles.partial} /><b>Partial</b></div><p>Outcome horizon has not completed</p></article>
          </div>
        </ResourceFigure>

        <h3>A compact application example</h3>
        <p>A lender wants to predict 12-month default risk at application. An applicant applies on <strong>31 January 2025</strong>. The permitted information set ends that day; performance runs from <strong>1 February 2025 to 31 January 2026</strong>. If a behavioural aggregate uses transactions through March 2025, the model is no longer an application-time model. Better Gini would not repair the interpretation—it would evidence an easier, contaminated question.</p>
        <p>Now consider another applicant accepted on 31 October 2025 when the dataset is extracted on 31 January 2026. Only three months of performance exist. Treating that account as non-default simply because no default has yet appeared converts incomplete observation into a “good” label. The resulting bias is temporal, not statistical.</p>
      </section>

      <section id="performance-window">
        <h2>The performance horizon defines what “risk” means</h2>
        <p>A shorter and a longer performance window do not produce alternative versions of the same target. They ask different questions. Horizon selection must connect the business use of the PD, the model purpose, default emergence, portfolio seasoning, censoring and the amount of mature data available.</p>
        <p>A one-year horizon is common in particular PD and regulatory contexts, but it is not a universal methodological answer. The correct design is the horizon that matches the model&apos;s stated purpose and is supported by comparable, sufficiently mature outcomes. Mixing six-, nine- and twelve-month performance in one binary target does not enlarge evidence; it changes the meaning of “non-default” across rows.</p>
        <h3>Seasoning makes recent lending look safer</h3>
        <p>Suppose Vintage A has been observed for 12 months and Vintage B for four. Their observed default rates are not directly comparable: B has had less time for risk to reveal itself. This is the same maturity problem viewed from two analytical directions. In model development it governs target eligibility; in <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> it governs cohort comparison.</p>
        <p>The issue extends to censoring. Accounts that close, leave the observable system or reach extraction before the horizon ends do not automatically become good outcomes. Their status depends on an explicit eligibility and censoring treatment consistent with the prediction question.</p>
        <h3>More rows are not necessarily more information</h3>
        <p>Monthly behavioural snapshots can increase observations rapidly, but the same borrowers, accounts and macro environment recur. Overlapping performance windows generate correlated outcomes; repeated rows create serial dependence; one concentrated period may dominate the sample. The nominal row count can therefore rise much faster than independent information. Development and validation design should recognise clusters and time structure rather than treating every row as a fresh experiment.</p>
      </section>

      <section id="sample-architecture">
        <h2>The development sample is a temporal model of the decision problem</h2>
        <EntimemaFramework title="PD Model Time Architecture" description="The sample construction sequence, governed by five temporal controls." steps={["Data history", "Observation window", "Reference date / time zero", "Performance window", "Outcome", "Development sample"]} />
        <div className={styles.controls}><span>Information availability</span><span>Seasoning</span><span>Censoring</span><span>Economic representativeness</span><span>Data consistency</span></div>
        <p>This architecture determines which facts exist, which outcome is allowed to emerge and which observations become eligible. The resulting sample is not a neutral extract fed into a model. <strong>It is a temporal representation of the decision itself.</strong></p>
        <h3>Recency competes with representativeness</h3>
        <p>A sample drawn mainly from benign conditions may encode a risk structure that weakens under stress. Extending history can improve cycle coverage, yet older observations may represent discontinued products, policies, channels, customer behaviour or data definitions. Neither maximum history nor maximum recency is automatically correct.</p>
        <p>The design question is: <strong>what economic conditions does the sample contain, and are its risk relationships relevant to the environment in which the model will operate?</strong> Periods should be selected and weighted with that tension visible, then challenged through temporal and out-of-time validation.</p>

        <ResourceTable caption="Temporal sample-design failure modes" headers={["Failure", "Why it happens", "What it distorts", "How performance misleads"]} rows={failures} />

        <p>Mixing application and behavioural logic deserves particular attention. Application variables describe information available at origination; behavioural variables describe an account after experience has accumulated. Combining them without a single coherent time zero changes the model&apos;s use case inside the sample. Likewise, a default definition or source-field definition that changes across periods can create apparent signal that is actually measurement drift.</p>
      </section>

      <section id="design-sequence">
        <h2>Define the clock before the probability</h2>
        <div className={styles.sequence}>
          {[
            ["01", "What decision will the model support?"], ["02", "When is that decision made?"], ["03", "What information exists at that moment?"], ["04", "What future outcome must be predicted?"], ["05", "How long must performance mature?"], ["06", "Which observations are eligible?"], ["07", "Are periods and definitions comparable?"], ["08", "Does the sample represent the operating environment?"],
          ].map(([number, question]) => <div key={number}><span>{number}</span><strong>{question}</strong></div>)}
        </div>
        <p>Only after this sequence should modelling transformations begin. <Link href="/resources/pd-model-ranking-calibration">ranking and calibration</Link> depend on a target whose horizon is coherent; <Link href="/resources/pd-model-monitoring">PD model monitoring</Link> depends on development and current outcomes being temporally comparable. Default definition, WoE and IV, logistic regression, scorecard development and model validation all inherit the clock established here.</p>
        <p>Dataset construction is also a recurring control problem. Analytical workflow automation can enforce reference dates, test feature availability, flag aggregates that cross time zero, check outcome maturity and vintage eligibility, identify repeated observations, and produce development-dataset QA. The <Link href="/agents">AI Agents Library</Link> is a contextual route for such controlled workflows—not a substitute for deciding model purpose, representativeness or acceptable evidence.</p>
        <p>In practice, observation and performance architecture requires alignment across model purpose, data, default definition, portfolio behaviour, validation and the business decision. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk consulting</Link> connects those elements when development or redevelopment moves from methodology into implementation.</p>
        <KeyObservation title="The prediction-clock principle"><p><strong>Good PD modelling starts by defining time correctly.</strong> Before a model can learn risk, we must define when information exists and when risk is allowed to reveal itself.</p></KeyObservation>
      </section>
    </>
  );
}
