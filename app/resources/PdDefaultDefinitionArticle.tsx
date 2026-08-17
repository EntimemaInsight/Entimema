import Link from "next/link";
import { KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pd-default-definition.module.css";

export const pdDefaultDefinitionSections = [
  { id: "analytical-boundary", label: "The boundary before the model" },
  { id: "event", label: "What is a default event?" },
  { id: "architecture", label: "Seven-layer architecture" },
  { id: "target", label: "Default as the target" },
  { id: "example", label: "Two valid models, two questions" },
  { id: "time-ranking", label: "Time, ranking and calibration" },
  { id: "failure-modes", label: "Failure modes" },
  { id: "monitoring", label: "Monitoring and validation" },
  { id: "decisions", label: "From target to decision" },
] as const;

const layers = [
  ["Event", "Which observable conditions constitute default?"],
  ["Materiality", "When is deterioration economically meaningful?"],
  ["Timing", "Which date fixes the event inside the prediction horizon?"],
  ["Scope", "Does default attach to a facility, an obligor or a connected group?"],
  ["Cure", "What sustained evidence permits return to non-default?"],
  ["Re-default", "When is renewed deterioration a new event rather than continuation?"],
  ["Data", "Can every rule be reconstructed consistently across history?"],
] as const;

const exampleRows: string[][] = [
  ["Qualifying events", "90+ DPD above materiality; insolvency; write-off", "Definition A plus validated unlikely-to-pay and distressed forbearance"],
  ["Defaulted borrowers", "360", "520"],
  ["Observed default rate", "3.6%", "5.2%"],
  ["Median recognition after first distress signal", "74 days", "31 days"],
  ["Borrowers unique to definition", "20 late-payment cases excluded by B's validity rules", "180 qualitative / early-distress cases"],
  ["Illustrative mean fitted 12-month PD", "3.6%", "5.2%"],
  ["Calibration target", "Narrow realised-default frequency", "Broader realised-default frequency"],
] as const;

const failureRows: string[][] = [
  ["Inconsistent historical flags", "A binary column combines different recognition policies across vintages.", "Coefficients and backtests treat policy change as borrower-risk change."],
  ["Facility / obligor mixing", "One facility defaults while propagation varies by source or period.", "The unit of observation, default rate and dependency structure become incoherent."],
  ["Incomplete unlikely-to-pay history", "Current qualitative triggers are unavailable in older systems.", "Earlier positives are systematically undercounted; time trends and calibration are biased."],
  ["Missing means non-default", "Absence of an event feed is converted to zero rather than unknown.", "False negatives dilute signal and reward poorly observed portfolios."],
  ["Cure inconsistency", "Operational closure, zero arrears and methodological cure are treated as equivalent.", "Default duration, eligible population and realised outcomes cease to reconcile."],
  ["Re-default double counting", "Repeated status records become independent defaults without an at-risk reset.", "Incidence is overstated and frequent reporters dominate event counts."],
  ["Temporal leakage", "Post-observation trigger or revised default date enters the information set.", "Discrimination is inflated and cannot be reproduced at decision time."],
  ["Acquired portfolios", "Imported default histories use incompatible triggers, scope or dates.", "Portfolio effects are confounded with definition effects."],
  ["Definition change without recalibration", "The target broadens while the deployed PD scale remains fixed.", "Ranking may look stable although expected default levels are materially wrong."],
  ["Development / operations divergence", "Production rules implement a practical proxy for the approved methodology.", "The model is monitored against an outcome different from the one it learned."],
] as const;

export default function PdDefaultDefinitionArticle() {
  return <>
    <p className={styles.lead}><em>A PD model does not discover default independently. It learns the definition of default embedded in its target.</em></p>

    <section id="analytical-boundary">
      <h2>The most consequential model choice can occur before modelling begins</h2>
      <p>Give two analysts the same borrowers, predictors, sample period and estimation technique. If one defines default as material 90-days-past-due, insolvency or write-off, while the other also recognises validated unlikely-to-pay and distressed restructuring events, they are not producing alternative estimates of one fixed quantity. They are estimating different conditional probabilities.</p>
      <p>That distinction creates the central tension in default definition for credit risk. The label appears to sit upstream of model development, yet its consequences propagate through the full architecture:</p>
      <ResourceFigure label="Default definition propagates through target construction, sample design, estimation, validation and credit decisions." caption="The default boundary is inherited by every downstream statistic and decision rule; it is not neutralised by a sophisticated modelling technique.">
        <div className={styles.propagation}>{["Default definition","Target construction","Observation + performance windows","Development sample","Observed default rate","Model estimation","Ranking","Calibration","Validation + monitoring","Credit decision"].map((step, index)=><div key={step}><small>{String(index+1).padStart(2,"0")}</small><strong>{step}</strong></div>)}</div>
      </ResourceFigure>
      <p>The chain has no clean break. Change the event boundary and the identities of positives can change; change their dates and sample eligibility can change; change their frequency and calibration must change. Segmentation, IFRS 9 expected credit loss analytics, model validation and lending policy then inherit the revised meaning of PD.</p>
      <KeyObservation title="The analytical boundary"><p><strong>Default definition is part of the estimand.</strong> A statistically correct model can only estimate the probability of the event encoded in <em>its</em> target—not an institution&apos;s unstated economic intuition about default.</p></KeyObservation>
    </section>

    <section id="event">
      <h2>What is a default event?</h2>
      <p>Contractual delinquency is a missed or incomplete payment under agreed terms. Days past due measures its duration. Material arrears add an economic threshold so immaterial or technical amounts do not automatically determine status. These are evidence about payment performance; they are not, by themselves, the entire economic concept of default.</p>
      <p>Unlikely-to-pay indicators address cases in which full repayment is improbable without realisation of collateral or other intervention, potentially before a numerical arrears threshold is crossed. Distressed restructuring or forbearance can be evidence when a concession responds to financial difficulty, but not every term modification is default. Insolvency and bankruptcy events provide legal evidence; a write-off records an accounting or recovery conclusion. Their dates may lag the onset of economic deterioration and therefore cannot be substituted mechanically for the date of default.</p>
      <div className={styles.concepts}>
        <article><small>01</small><h3>Economic deterioration</h3><p>The borrower&apos;s capacity or willingness to repay has weakened. This latent condition may begin before any system flag exists.</p></article>
        <article><small>02</small><h3>Operational trigger</h3><p>An observable DPD, restructuring, legal, collections or write-off event activates a rule and provides auditable evidence.</p></article>
        <article><small>03</small><h3>Model target</h3><p>Approved rules transform valid triggers into a dated outcome at the chosen analytical unit and horizon.</p></article>
      </div>
      <p><strong>Default identification</strong> is the controlled inference connecting those three concepts. <strong>Cure</strong> is not merely removal of an operational flag: it is the point at which defined, sustained evidence supports exit from default. <strong>Re-default</strong> requires an intervening valid cure and renewed at-risk period; otherwise repeated records describe one continuing episode. The design objective is neither maximum trigger count nor minimum ambiguity. It is a coherent, purpose-aligned economic event that can be reproduced in data.</p>
    </section>

    <section id="architecture">
      <h2>The Entimema seven-layer default-definition architecture</h2>
      <p>A policy sentence is insufficient for modelling. The definition must be decomposed into interacting layers whose rules can be approved, implemented, tested and historically reconstructed.</p>
      <div className={styles.layers}>{layers.map(([name, question], index)=><article key={name}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{name} layer</h3><p>{question}</p></div></article>)}</div>
      <p>The layers constrain one another. A materiality rule changes whether a delinquency trigger is valid. Scope rules determine whether one facility event propagates to the obligor. Timing rules determine whether that propagated event falls inside a performance window. Cure and re-default rules determine when the borrower becomes eligible for a new observation. The data layer is the proof: if the approved architecture cannot be reconstructed consistently, the historical target does not represent it.</p>
      <p>Before modelling, governance should therefore approve a versioned rule specification, trigger hierarchy, analytical unit, event-date precedence, cure state machine, re-default eligibility rule, exception policy and source-to-target lineage. This turns default definition from prose into controlled data architecture.</p>
    </section>

    <section id="target">
      <h2>Default becomes the dependent variable</h2>
      <div className={styles.equation} aria-label="Y sub i equals one if borrower i defaults during the performance window, and zero otherwise"><span>Y<sub>i</sub> =</span><span className={styles.brace}>{`{`}</span><span><b>1,</b> if borrower <i>i</i> defaults during the performance window<br/><b>0,</b> otherwise</span></div>
      <p>For borrower information <em>X<sub>i</sub></em> available at the observation date, a PD model estimates:</p>
      <div className={styles.formula} aria-label="PD sub i equals probability that Y sub i equals one conditional on X sub i">PD<sub>i</sub> = P(Y<sub>i</sub> = 1 | X<sub>i</sub>)</div>
      <p>The notation exposes the methodological issue. Changing what qualifies as <em>Y = 1</em>, the unit <em>i</em>, the event date or the horizon changes the statistical problem. “A 4% PD” is incomplete without the event definition, forecast horizon, population and calibration basis. A probability cannot be interpreted independently of the outcome whose probability it expresses.</p>
      <p>Target construction also determines negatives. A borrower without a captured default is not automatically a demonstrated non-default: its horizon may be immature, its event feed may be missing or it may have exited before outcome ascertainment. Eligibility, censoring and unknown states must be explicit so that zero means “observed without qualifying default,” not “no evidence found.”</p>
    </section>

    <section id="example">
      <h2>Analytical example: two valid models, two different risk questions</h2>
      <p>Consider 10,000 synthetic borrowers observed at the same date with complete 12-month outcomes. Definition A is narrow: material 90+ DPD, insolvency or write-off. Definition B applies the same validity rules but also recognises documented unlikely-to-pay and distressed-forbearance events. The figures are hypothetical and illustrate target sensitivity, not a preferred universal definition.</p>
      <ResourceTable caption="Target sensitivity in a hypothetical 10,000-borrower portfolio" headers={["Measure","Definition A — narrow","Definition B — broader"]} rows={exampleRows} />
      <p>Definition B adds 180 earlier qualitative or restructuring defaults but excludes 20 Definition A records whose arrears fail its event-validity tests. The net increase is 160 defaults, yet the effect is not a simple uplift. Borrower identities, recognition dates and class composition change. Predictors associated with early financial distress may gain relevance; predictors of late arrears may weaken. Segments with richer qualitative-event capture may appear riskier even when their underlying economics are unchanged.</p>
      <p>If each model&apos;s average fitted PD reconciles to its own 3.6% or 5.2% calibration target and validates on outcomes constructed identically, both may be statistically correct. Definition A answers “who will reach the narrow realised-default boundary?” Definition B answers “who will reach the broader validated distress boundary?” Applying Model A&apos;s scale to Definition B outcomes creates underprediction by construction, not necessarily model decay.</p>
      <KeyObservation title="Interpretation"><p><strong>The model may be statistically correct under both definitions while answering two different risk questions.</strong> Comparisons are meaningful only after the target semantics are aligned.</p></KeyObservation>
    </section>

    <section id="time-ranking">
      <h2>Default definition and the prediction clock are one design problem</h2>
      <ResourceFigure label="Observation date leads from the borrower information set into the performance window and a qualifying default event." caption="The information boundary determines what the model may know; the event boundary determines what it must predict.">
        <div className={styles.clock}>{["Observation date","Borrower information set","Performance window","Qualifying default event"].map((item,index)=><div key={item}><small>{index===0?"t₀":index===2?"t₀ → t₁":""}</small><strong>{item}</strong></div>)}</div>
      </ResourceFigure>
      <p>The framework in <Link href="/resources/pd-model-observation-performance-windows">PD Model Observation and Performance Windows</Link> defines the prediction clock. Default definition supplies the event inside it. If a distressed restructuring is dated when a committee records it rather than when valid evidence first existed, the same episode can move into or out of the horizon. If post-observation information is used to reconstruct a trigger as though it were known at time zero, leakage is created. If a borrower has not completed the horizon, labelling it non-default creates false negatives.</p>
      <h3>Ranking changes when the positive class changes</h3>
      <p>Discrimination depends on which borrowers are positives and how early their distress becomes observable. Adding qualitative early-distress events can reorder borrower pairs, alter variable relationships and change AUC or Gini. But ranking can also remain superficially stable when both definitions capture substantially overlapping risk order.</p>
      <h3>Calibration changes when outcome frequency changes</h3>
      <p>Calibration anchors predicted levels to the incidence of the defined event. A broadened definition can lift observed default frequency even when rank ordering barely moves. This is why stable discrimination can coexist with materially wrong PD levels. As explored in <Link href="/resources/pd-model-ranking-calibration">PD Model Ranking vs Calibration</Link>, ranking and probability accuracy are separate questions; a definition change can disturb either or both through different mechanisms.</p>
    </section>

    <section id="failure-modes">
      <h2>Failure modes: how target defects become model defects</h2>
      <ResourceTable caption="Default-target failure modes and their analytical consequences" headers={["Failure mode","Mechanism","Analytical consequence"]} rows={failureRows} />
      <p>The most dangerous failures are often internally consistent enough to pass routine checks. A complete binary field can conceal a regime change; a high Gini can conceal leakage; a well-calibrated portfolio average can conceal offsetting segment errors. Validation must test the provenance and semantics of the outcome, not merely its populatedness.</p>
    </section>

    <section id="monitoring">
      <h2>Monitor the definition, not only the model</h2>
      <p>A controlled monitoring framework separates borrower-risk movement from event-recognition movement. Its minimum diagnostic set should include:</p>
      <div className={styles.monitorGrid}>
        {[["Incidence","Default rate by portfolio, segment, vintage and event month; reconcile counts to source episodes."],["Trigger mix","Share and overlap of DPD, unlikely-to-pay, forbearance, insolvency and write-off triggers."],["Lifecycle","Cure rate, time in default, probation outcomes and re-default rate using episode-level denominators."],["Timing","Time from first distress evidence to identification, and migrations through delinquency and default states."],["Flag reconciliation","Operational versus modelling flags, propagation exceptions and event-date differences."],["Data integrity","Missing feeds, reconstructed events, rule-version coverage and unknown-outcome rates."]].map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}
      </div>
      <p>Diagnostics require control limits and attribution, not only time-series charts. A jump in defaults concentrated in a newly introduced unlikely-to-pay trigger, with unchanged arrears migration, suggests recognition change rather than proportionate deterioration in borrowers. Falling cure rates after a workflow change may reflect delayed status closure. A shorter time-to-default can signal earlier identification, not weaker model ranking.</p>
      <p><Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> should therefore include a target-stability layer before performance escalation. <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> then helps distinguish origination-quality shifts from calendar effects and definition regimes, provided each vintage is measured against comparable outcomes. Validation should independently reperform rules on event-level data, sample flag disagreements, test sensitivity to plausible definitions, reconcile calibration denominators and confirm production parity.</p>
      <p>This is also a credible recurring automation workflow—but not a substitute for methodological ownership. A future <strong>Default Definition Consistency &amp; Monitoring</strong> capability could reconcile operational and modelling flags, detect trigger-mix breaks, monitor cure and re-default episodes, flag lineage anomalies and generate diagnostics. Human governance must still approve economic meaning, materiality, exceptions and model use.</p>
    </section>

    <section id="decisions">
      <h2>Target engineering becomes decision engineering</h2>
      <p>The boundary eventually reaches customers and balance sheets. Approval cut-offs select against predicted instances of the defined event. Pricing and limits translate its estimated likelihood into risk appetite and economics. Collections timing depends on which deterioration states are recognised and when. Portfolio monitoring compares realised events with expectations built on the same target.</p>
      <p>For IFRS 9 and expected credit loss analytics, PD meaning affects default-event forecasts, stage and lifetime-risk interpretations, calibration evidence and the point at which recovery assumptions become relevant. Capital and risk measurement require their own purpose-aligned definitions and documented bridges where concepts differ. Governance must prevent one familiar “PD” field from being reused across purposes without establishing semantic compatibility.</p>
      <div className={styles.decisionLogic}><span>Approved default architecture</span><b>→</b><span>Interpretable PD</span><b>→</b><span>Consistent policy thresholds</span><b>→</b><span>Traceable portfolio decisions</span></div>
      <p>The resolve is practical: treat default definition as a controlled modelling design decision and data architecture. Establish the event and its layers; version the rules; reconstruct comparable history; quantify sensitivity; validate implementation parity; monitor recognition alongside risk; and translate PDs into decisions only within the meaning of their target.</p>
      <p>When organisations need to move from research principle to an operational model and decision framework, Entimema&apos;s <Link href="/services/credit-risk">Credit Risk capability</Link> connects default methodology to model development and review, portfolio analytics, validation, monitoring and governed credit decisions. The purpose is not to impose a generic boundary, but to make the chosen boundary economically defensible, statistically coherent and operationally reproducible.</p>
      <KeyObservation title="The governing principle"><p><strong>Define the event before estimating its probability—and govern the definition for as long as that probability informs a decision.</strong></p></KeyObservation>
    </section>
  </>;
}
