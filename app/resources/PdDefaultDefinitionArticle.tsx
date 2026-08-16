import Link from "next/link";
import { KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pd-default-definition.module.css";

export const pdDefaultDefinitionSections = [
  { id: "target-construction", label: "The target is part of the model" },
  { id: "default-signals", label: "From credit event to default" },
  { id: "scope-and-time", label: "Scope, timing, cure and re-default" },
  { id: "target-contamination", label: "When the target changes through history" },
  { id: "design-sequence", label: "Define the event before the model" },
] as const;

const failureRows = [
  ["DPD-only logic", "A measurable field is mistaken for the economic event", "Qualitative distress is labelled performing", "The model learns late recognition rather than intended default"],
  ["Mixed scope", "Borrower and facility records are combined without propagation rules", "Default frequency and observation unit", "Coefficients reflect inconsistent contagion logic"],
  ["Unstable default date", "Operational dates are used without event reconciliation", "Performance-window assignment and time to event", "Backtests compare differently timed outcomes"],
  ["Changing restructuring treatment", "Policy or systems change mid-history", "Who is classified as default and when", "Drift can be target change rather than portfolio change"],
  ["Inconsistent cure and re-default", "Statuses are reset or repeated mechanically", "Event counts, durations and subsequent eligibility", "Monitoring and calibration use incompatible populations"],
];

const architecture = ["Credit event", "Default criteria", "Validity / materiality", "Borrower / facility scope", "Default date", "Target label", "Cure / re-default", "Modelling outcome"];

export default function PdDefaultDefinitionArticle() {
  return (
    <>
      <p className={styles.lead}><em>Two analysts can use the same borrowers, the same predictors and the same algorithm—and build materially different PD models. They need only disagree about which economic events are allowed to become “default.”</em></p>

      <section id="target-construction">
        <h2>The target is part of the model</h2>
        <p>A probability-of-default model does not learn an abstract substance called credit risk. It learns the target label constructed from operational evidence. Change that construction and the number, identity and timing of defaults may change with it. Model coefficients, borrower ordering, discrimination, calibration, validation and downstream decisions can all move before the modelling algorithm changes at all.</p>
        <p>This makes default definition a modelling decision, not a preliminary data-cleaning task. The relationship is direct:</p>
        <KeyObservation title="The target-construction principle"><p><strong>Default definition → target construction → model learning.</strong> A model cannot be more methodologically coherent than the outcome it is trained to reproduce.</p></KeyObservation>
        <p>The task is not to choose the broadest or narrowest possible definition. It is to define an economically meaningful event, align it with model purpose and applicable requirements, and reconstruct it consistently enough that every historical label means the same thing.</p>

        <ResourceFigure label="The Entimema Default Target Architecture transforms raw credit events through criteria, validity and materiality, borrower or facility scope, default dating, target labelling, and cure or re-default logic before producing the modelling outcome." caption="Raw operational events do not become model labels automatically. Each transition requires an explicit, reviewable methodological rule.">
          <div className={styles.targetArchitecture}>
            <header><span>RAW OPERATIONAL EVIDENCE</span><strong>METHODOLOGICAL TRANSFORMATION</strong><span>MODEL-READY OUTCOME</span></header>
            <ol>{architecture.map((step, index) => <li key={step} className={index === 0 || index === architecture.length - 1 ? styles.endpoint : undefined}><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></li>)}</ol>
            <footer><span>Consistency</span><span>Temporal alignment</span><span>Data quality</span><span>Business meaning</span></footer>
          </div>
        </ResourceFigure>
        <p>The architecture shows why default definition is simultaneously a data, methodology and decision problem. A credit event may be observable, yet still require tests of validity, materiality, scope and timing before it can support a defensible target.</p>
      </section>

      <section id="default-signals">
        <h2>Default is an economic state, not only a delinquency count</h2>
        <p>Days past due is attractive because it is observable, systematic and operationally available. Delinquency can provide an important quantitative signal, and a 90-days-past-due concept is prominent in particular regulatory frameworks. But a number alone is not a complete universal default definition. Its application depends on purpose, jurisdiction and implementation—and on whether the underlying arrears are economically meaningful.</p>
        <p>Materiality, technical arrears, payment-allocation logic, operational delays and data quality can all alter a mechanical DPD measure. Multiple facilities introduce another question: is delinquency assessed at account level, or does evidence on one obligation affect the borrower as a whole?</p>
        <p>Qualitative evidence addresses the other side of identification. A borrower may become economically distressed before crossing a mechanical delinquency threshold. Distressed restructuring, insolvency evidence, material concessions, enforcement or write-off expectations may indicate unlikeliness to pay. The exact trigger set is implementation-specific; the methodological point is universal: <strong>default can be an economic state before it becomes a delinquency count.</strong></p>

        <ResourceFigure label="A synthetic portfolio of ten thousand borrowers produces 430 defaults under Definition A using a specified delinquency criterion and 510 defaults under Definition B after valid qualitative default events are also mapped. The same portfolio produces a different target population." caption="Target sensitivity, not a universal preference: broader recognition is appropriate only when the additional events are valid, economically meaningful and aligned with the model purpose.">
          <div className={styles.targetSensitivity}>
            <header><span>SAME PORTFOLIO</span><strong>10,000 synthetic borrowers</strong><span>SAME PREDICTORS</span></header>
            <div className={styles.definitions}>
              <article><small>DEFINITION A</small><h3>Delinquency criterion</h3><strong>430</strong><span>observed defaults · 4.3%</span></article>
              <div aria-hidden="true">≠</div>
              <article><small>DEFINITION B</small><h3>Delinquency + valid qualitative events</h3><strong>510</strong><span>observed defaults · 5.1%</span></article>
            </div>
            <footer>Same portfolio + different target construction = different model estimation and validation evidence</footer>
          </div>
        </ResourceFigure>
        <p>Consider one synthetic borrower who remains below the delinquency threshold but enters a distressed restructuring during the performance window. A delinquency-only target labels the borrower good. A target that recognises a valid qualitative default event labels the same borrower default. Neither classification is a trivial database choice: each tells the model to learn a different economic boundary.</p>
      </section>

      <section id="scope-and-time">
        <h2>Scope determines who defaults; time determines when</h2>
        <p>The unit of default may be a borrower or a facility. Facility-level construction isolates an account; borrower-level construction can propagate qualifying distress across obligations according to defined contagion logic. The choice changes the unit of observation, default frequency, target interpretation and portfolio monitoring. Mixing both units without explicit rules creates labels whose meaning depends on how the source system happened to record the event.</p>
        <p>Default also has a lifecycle. When does it begin? Which evidence establishes the default date? Under what conditions can an exposure cure? Is a probation concept required before performing status is restored? How is a subsequent default treated? There is no arbitrary cure or probation duration that is universally correct. There is, however, a universal need for consistent first-default, cure, re-default and repeated-event logic.</p>

        <ResourceFigure label="The default event inside the PD prediction clock. Historical information ends at time zero. A default event occurs inside the future performance window, followed by optional cure and re-default states after the initial event." caption="Target definition and time architecture cannot be designed independently: the event must be valid, correctly dated and located inside the intended performance logic.">
          <div className={styles.eventClock}>
            <header><span>INFORMATION AVAILABLE</span><span>OUTCOME OBSERVED</span></header>
            <div className={styles.eventClockBody}>
              <div className={styles.history}><strong>Observation window</strong><i /></div>
              <div className={styles.zero}><small>TIME ZERO</small><strong>Prediction</strong></div>
              <div className={styles.horizon}><strong>Performance window</strong><i /><b>DEFAULT EVENT</b><em>Cure</em><em>Re-default</em></div>
            </div>
          </div>
        </ResourceFigure>
        <p>The preceding research on <Link href="/resources/pd-model-observation-performance-windows">observation and performance windows</Link> established the prediction clock. Default definition supplies the event placed inside it. Post-window events must not be pulled backward into the target; immature observations must not be labelled good; event dates must not drift with batch-processing dates. Time architecture and target architecture are one design problem viewed from opposite sides.</p>
      </section>

      <section id="target-contamination">
        <h2>A changing definition contaminates the historical target</h2>
        <p>Suppose Period A uses one operational definition, Period B introduces new qualitative triggers and Period C changes restructuring treatment. A single target column may still contain zeros and ones, but “default” no longer means the same thing through history. The development sample now mixes target regimes.</p>
        <p>The consequences propagate. Development estimates relationships against inconsistent outcomes. Calibration combines incompatible default rates. Validation may report deterioration caused by recognition change rather than model failure. Monitoring can mistake a new trigger or system migration for portfolio drift. Backtesting compares predictions and outcomes whose definitions do not align.</p>
        <p>Historical reconciliation may require mapping legacy events to a common methodological definition, documenting irreducible gaps, segmenting periods or restricting the usable history. Simply appending more years can reduce comparability while appearing to strengthen sample size.</p>
        <ResourceTable caption="High-impact default-target failure modes" headers={["Failure", "Why it happens", "What it changes", "How the model is distorted"]} rows={failureRows} />
        <p>This is also why <Link href="/resources/pd-model-monitoring">PD model monitoring</Link>, <Link href="/resources/pd-model-ranking-calibration">ranking and calibration</Link>, and <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> all depend on stable target semantics. Observed default movement is interpretable only when recognition, timing and population scope remain comparable—or when their changes are explicitly isolated.</p>
      </section>

      <section id="design-sequence">
        <h2>Define the economic event before optimizing the model</h2>
        <div className={styles.sequence}>{[
          "What economic event should the model predict?", "What constitutes default?", "Which signals identify it?", "What is the unit of default?", "When does default begin?", "How is materiality treated?", "How are cure and re-default handled?", "Is the definition consistent through history?", "Can it be reconstructed reliably from data?", "Only then: build the target.",
        ].map((question, index) => <div key={question}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong></div>)}</div>
        <p>This sequence is the foundation for the next modelling questions. WoE and IV cannot rescue a contaminated dependent variable. Logistic-regression coefficients faithfully estimate the target supplied to them, not the target practitioners intended. Scorecard development, model validation and IFRS 9 or ECL implementation all require a defensible outcome before they can produce defensible risk measures.</p>
        <p>Default identification is also a recurring controlled workflow: new portfolio data create new credit events, status changes, cures and re-defaults. Analytical automation can consolidate events, map qualitative evidence, test borrower/facility propagation, reconcile dates, track lifecycle states and flag historical exceptions. The <Link href="/agents">AI Agents Library</Link> provides the relevant operational context, while human governance remains responsible for economic meaning, materiality and methodological approval.</p>
        <p>Implementation requires alignment across methodology, source data, model purpose, portfolio operations, validation and governance. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk consulting</Link> connects those elements when a default policy must become a reproducible development and monitoring dataset.</p>
        <KeyObservation title="The default-target principle"><p><strong>Define the economic event before optimizing its probability.</strong> The model learns exactly the boundary encoded in the target—even when that boundary is inconsistent, incomplete or wrong.</p></KeyObservation>
      </section>
    </>
  );
}
