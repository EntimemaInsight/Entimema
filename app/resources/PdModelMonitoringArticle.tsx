import Link from "next/link";
import { DecisionImplication, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pd-model-monitoring.module.css";

export const pdModelMonitoringSections = [
  { id: "silent-drift", label: "The silent failure" },
  { id: "architecture", label: "Monitoring architecture" },
  { id: "signals", label: "What each signal means" },
  { id: "portfolio", label: "Illustrative portfolio" },
  { id: "diagnosis", label: "From signal to diagnosis" },
  { id: "failure-modes", label: "Why monitoring fails" },
  { id: "decision-system", label: "From diagnosis to action" },
  { id: "operationalise", label: "Operationalising the system" },
] as const;

const periods = [
  ["Q0 reference", "0.00", "0.78", "1.9%", "2.0%", "1.05", "1.00"],
  ["Q1", "0.06", "0.78", "2.0%", "2.1%", "1.05", "0.98"],
  ["Q2", "0.14", "0.77", "2.1%", "2.7%", "1.29", "0.91"],
  ["Q3", "0.21", "0.76", "2.2%", "3.3%", "1.50", "0.84"],
];

const signalRows = [
  ["PSI", "0.00", "0.06", "0.14", "0.21"],
  ["AUC", "0.78", "0.78", "0.77", "0.76"],
  ["O/E", "1.05", "1.05", "1.29", "1.50"],
  ["Observed default rate", "2.0%", "2.1%", "2.7%", "3.3%"],
];

export default function PdModelMonitoringArticle() {
  return <>
    <p className={styles.lead}>A probability-of-default model does not announce when it becomes unreliable. It can keep accepting inputs, producing valid-looking probabilities and ordering applicants sensibly while the meaning of those probabilities changes underneath it.</p>
    <p>That is the dangerous form of drift: not a broken model, but a functioning model inside a changed system. Portfolio composition moves. A source field is recoded. Acquisition strategy reaches a different customer population. Defaults rise while score ranking remains almost unchanged. The dashboard is green because its metrics are read independently; the credit decision is already using stale risk.</p>
    <KeyObservation title="The monitoring problem">A functioning model is not necessarily a reliable model. Reliability depends on the data, population, model relationships, probability scale and decision environment remaining fit for the use being made of them.</KeyObservation>

    <section id="silent-drift">
      <h2>A metric can detect movement. It cannot supply the diagnosis.</h2>
      <p>Model monitoring is often reduced to a timetable and a traffic-light pack: population stability index, Gini, observed default rate, perhaps a calibration chart. Those measures matter, but none identifies cause on its own. A rising PSI says distributions moved. It does not say the rank ordering failed. A falling AUC says separation weakened. It does not reveal whether an upstream mapping error, policy change or genuinely weaker relationship produced the fall. An observed-to-expected ratio above one shows underprediction; it cannot distinguish a broad calibration shift from one concentrated segment.</p>
      <p>The practical unit of monitoring is therefore not the metric. It is the chain from <strong>metric to signal, signal to hypothesis, hypothesis to investigation, and investigation to a governed decision</strong>. The same signal can justify different responses depending on materiality, model use, sample size, timing and economic consequence.</p>
      <p>This also separates monitoring from periodic validation. Monitoring provides recurring surveillance, evidence and escalation. Validation provides a sufficiently independent challenge of conceptual soundness, implementation and outcomes. Strong monitoring may trigger validation work; it does not replace it.</p>
    </section>

    <section id="architecture">
      <h2>The Entimema PD monitoring architecture</h2>
      <p>A useful monitoring programme observes seven connected domains. The order below is investigative, not a claim of linear causality. A signal may appear in calibration while its cause sits in data engineering, portfolio selection, policy or the economy. Business consequences feed back into later populations because approvals, limits and pricing change who enters the book.</p>
      <ResourceFigure label="The Entimema PD model monitoring architecture connects data integrity, population stability, discrimination, calibration, outcome and vintage behaviour, the decision environment, and business consequences. Cross-layer paths distinguish where a signal appears from where its cause may originate." caption="A diagnostic architecture, not seven independent tests. Signals travel across layers; policy and business actions create feedback into the next monitored population.">
        <div className={styles.architecture}>
          <div className={styles.architectureHeader}><span>WHERE THE CAUSE MAY ORIGINATE</span><span>WHERE THE SIGNAL MAY APPEAR</span></div>
          <ol>
            {[
              ["01", "Data integrity", "Definitions, mapping, timing, transformations"],
              ["02", "Population stability", "Applicant, borrower and product composition"],
              ["03", "Discrimination", "Relative risk ordering"],
              ["04", "Calibration", "Absolute probability accuracy"],
              ["05", "Outcome / vintage", "Realised risk by time and cohort"],
              ["06", "Decision environment", "Cut-offs, pricing, limits, overrides"],
              ["07", "Business consequences", "Loss, approval, capital and customer effects"],
            ].map(([n, title, note]) => <li key={n}><b>{n}</b><strong>{title}</strong><span>{note}</span></li>)}
          </ol>
          <div className={styles.crossLinks} aria-hidden="true"><span>DATA / IMPLEMENTATION</span><i/><span>MODEL RELATIONSHIPS</span><i/><span>POLICY / ENVIRONMENT</span></div>
          <p>Feedback: decisions reshape the next population and its observed outcomes.</p>
        </div>
      </ResourceFigure>
      <p>Start with data integrity because apparent model deterioration can begin before the model. Missingness, stale values, a changed category definition, transformation failure, revised source system or feature mapping can alter outputs without any deterioration in the statistical relationship. That distinction changes the response: correct and reprocess an implementation defect; do not reflexively recalibrate a sound model to corrupted inputs.</p>
      <DecisionImplication>Every performance exception should be traceable to a defined owner, investigation route and permissible action. Otherwise monitoring produces observations without control.</DecisionImplication>
    </section>

    <section id="signals">
      <h2>Separate movement, ranking, probability and outcome</h2>
      <h3>Population stability: where the inputs and scores moved</h3>
      <p>The population stability index compares the proportions of a reference and monitoring population across common bins:</p>
      <Formula label="Population stability index. PSI is the sum across bins i of actual proportion minus expected proportion, multiplied by the natural logarithm of actual proportion divided by expected proportion.">
        <span>PSI = </span><span className={styles.sigma}>Σ</span><sub>i</sub><span> (A<sub>i</sub> − E<sub>i</sub>) × ln(A<sub>i</sub> / E<sub>i</sub>)</span>
      </Formula>
      <p><em>A<sub>i</sub></em> is the monitoring-period share in bin <em>i</em>; <em>E<sub>i</sub></em> is the reference-period share. PSI increases when corresponding shares separate. It is useful for locating score, feature and segment distribution movement, but it is sensitive to binning, sample size and zero-cell treatment. It also discards direction once contributions are summed.</p>
      <p>No universal PSI boundary can decide model validity. A shift may be expected after an intentional channel expansion and leave performance intact. A smaller aggregate shift can hide a severe movement in a high-value segment. Treat PSI as evidence that composition changed, then inspect contribution by bin, variable, channel and policy cohort.</p>

      <h3>Discrimination: whether relative ordering still works</h3>
      <p>ROC-AUC, Gini, KS and bad-rate ordering test whether the model still separates relatively higher-risk from lower-risk cases. They should be evaluated with uncertainty and on comparable outcome windows. Gini is commonly expressed as <em>2 × AUC − 1</em>; neither measure establishes that a predicted PD of 3% represents a 3% default risk.</p>
      <p>This is the central distinction developed in <Link href="/resources/pd-model-ranking-calibration">our research on PD ranking and calibration</Link>: <strong>ranking is not calibration</strong>. A model can maintain almost the same AUC while every PD is too low. Conversely, absolute default levels may remain close in aggregate while ranking weakens inside important bands.</p>

      <h3>Calibration: whether probability still means what it says</h3>
      <p>Calibration compares predicted risk with realised risk at portfolio, band, segment and temporal levels. Useful views include calibration-in-the-large, calibration slope, reliability curves and observed-to-expected analysis:</p>
      <Formula label="Observed-to-expected ratio. O over E equals observed defaults divided by expected defaults.">
        <span>O/E = observed defaults / expected defaults</span>
      </Formula>
      <p>Expected defaults are the sum of account-level PDs over a compatible population and outcome horizon; observed defaults are the realised count under the same definition and window. An O/E above one indicates more defaults than predicted. It does not identify which accounts, segments or mechanisms explain the gap, and an immature or mismatched observation window can make the comparison invalid.</p>
      <p>Calibration-in-the-large identifies a broad level shift. Calibration slope helps diagnose whether predictions are too extreme or too compressed. A curve by score band shows local departures that an aggregate ratio can offset. All require sufficient realised outcomes; early monitoring must distinguish unavailable evidence from reassuring evidence.</p>

      <h3>Outcome and vintage behaviour: what realised risk is doing through time</h3>
      <p>A rise in defaults is not automatic proof of model deterioration. Newer originations may be immature, product mix may have changed, portfolio growth may alter weighting, or underwriting and acquisition policy may have shifted. Compare like outcome windows and align cohorts by credit age. <Link href="/resources/credit-vintage-analysis">Credit vintage analysis</Link> is especially useful when aggregate performance conceals deterioration in recent cohorts.</p>
      <p>Calendar time and time on book answer different questions. Monitoring should retain both: calendar views reveal common environmental pressure, while vintage views distinguish how origination cohorts season. Without that separation, a model may be blamed for a denominator, maturity or policy effect.</p>
      <h3>The operating environment belongs inside model monitoring</h3>
      <p>An unchanged model can produce materially different portfolio outcomes when cut-offs, pricing, limits, manual overrides, pre-approval rules, campaigns or channel mix change. Lowering a cut-off admits borrowers the prior production book scarcely represented. A pricing change can alter acceptance and adverse selection. Overrides can improve or weaken realised ordering beyond the raw score.</p>
      <p>Monitoring only the model treats the decision system as fixed when it is not. A production pack should align model signals with dated policy releases, approval rates, override incidence, limit and pricing changes, channel campaigns and product changes. That chronology often contains the missing causal clue.</p>
    </section>

    <section id="portfolio">
      <h2>Illustrative portfolio: stable ranking, unstable risk</h2>
      <p>Consider a fictional unsecured personal-loan portfolio observed from a reference quarter Q0 through Q3. Each period uses a comparable twelve-month default definition and a mature outcome sample. In Q2, the lender expands an affiliate channel and lowers the cut-off for thin-file applicants. Data controls remain clean. The figures are synthetic and designed to demonstrate diagnostic reasoning, not benchmark acceptable performance.</p>
      <ResourceTable caption="Synthetic Entimema portfolio monitoring summary" headers={["Period", "PSI", "AUC", "Mean PD", "Observed DR", "O/E", "Calibration slope"]} rows={periods}/>
      <ResourceFigure label="Multi-signal monitoring panel from Q0 to Q3. PSI rises from zero to 0.21, AUC changes only from 0.78 to 0.76, observed-to-expected rises from 1.05 to 1.50 and observed defaults rise from 2.0 to 3.3 percent." caption="The signals diverge. Ranking remains comparatively stable while population movement, probability underestimation and realised defaults increase.">
        <div className={styles.signalPanel}>
          <div className={styles.signalHead}><span>Q0</span><span>Q1</span><span>Q2</span><span>Q3</span></div>
          {signalRows.map(([label, ...values], row) => <div className={styles.signalRow} key={label}>
            <strong>{label}</strong><div>{values.map((value, i) => <span key={i} data-alert={row !== 1 && i > 1 ? "true" : undefined}><i style={{ height: `${row === 1 ? 44 + (Number(value) - .75) * 400 : 18 + i * (row === 0 ? 16 : 13)}px` }}/><b>{value}</b></span>)}</div>
          </div>)}
          <p><b>RELATIVE RANKING</b> changes modestly <span>while</span> <b>ABSOLUTE RISK</b> moves materially.</p>
        </div>
      </ResourceFigure>
      <p>What changed? PSI rises as the booked population shifts, while AUC declines only two points. Mean predicted PD rises modestly from 1.9% to 2.2%, but the observed default rate reaches 3.3%; O/E therefore reaches 1.50. The calibration slope falls, consistent with probabilities becoming too dispersed or the model overstating relative differences at the extremes.</p>
      <p>What does this suggest? The model still ranks risk reasonably well, but its absolute probabilities have become materially optimistic. The timing aligns with a decision-policy and channel change. What does it not prove? It does not prove the model coefficients decayed, that the channel caused the entire shift, or that recalibration alone is sufficient.</p>
      <p>Decomposition provides the decisive clue. In Q3, the affiliate thin-file segment represents 18% of accounts but 39% of observed defaults. Its mean PD is 3.4% against a 6.8% realised default rate, an O/E of 2.00. The remainder of the portfolio records an O/E of 1.20. Deterioration is concentrated but not wholly confined to the new segment.</p>
      <ResourceTable caption="Q3 diagnostic decomposition" headers={["Population", "Account share", "Default share", "Mean PD", "Observed DR", "O/E"]} rows={[
        ["Affiliate thin-file", "18%", "39%", "3.4%", "6.8%", "2.00"],
        ["All other accounts", "82%", "61%", "2.0%", "2.4%", "1.20"],
        ["Total", "100%", "100%", "2.2%", "3.3%", "1.50"],
      ]}/>
      <DecisionImplication>The next step is not automatic redevelopment. Verify thin-file feature availability and mapping, reproduce policy chronology, compare discrimination and calibration inside and outside the segment, examine same-age vintages, and assess whether a bounded recalibration, policy correction or redevelopment study addresses the identified cause.</DecisionImplication>
    </section>

    <section id="diagnosis">
      <h2>Experienced monitoring follows pathways, not alarms</h2>
      <h3>Pathway 1: population movement with stable performance</h3>
      <p><strong>Signal:</strong> PSI rises, but discrimination and calibration remain stable within uncertainty. <strong>Hypothesis:</strong> an intentional product or channel change has altered mix without breaking the risk relationship. <strong>Investigation:</strong> locate PSI contributions, verify eligibility and data definitions, compare new and incumbent segments, and check policy chronology. <strong>Decision:</strong> continue intensified monitoring if the population remains within the model’s intended use; initiate scope or validation review if it does not.</p>
      <h3>Pathway 2: stable ranking with calibration deterioration</h3>
      <p><strong>Signal:</strong> AUC is broadly stable while O/E, calibration intercept or reliability curves deteriorate. <strong>Hypothesis:</strong> baseline risk moved while relative ordering survived. <strong>Investigation:</strong> align performance windows, separate broad from segment-level error, inspect macro and vintage effects, and test whether mapping from score to PD remains appropriate. <strong>Decision:</strong> assess recalibration where ranking is sound and the shift is estimable; do not use a level adjustment to conceal structural segment failure.</p>
      <h3>Pathway 3: discrimination and calibration both weaken</h3>
      <p><strong>Signal:</strong> rank separation falls and probability error increases. <strong>Hypothesis:</strong> relationships changed, a key variable failed, the population moved outside development support, or strategy introduced a new selection mechanism. <strong>Investigation:</strong> start with implementation and feature diagnostics, then test stability by segment and time. <strong>Decision:</strong> correct data defects where present; otherwise consider use constraints, independent validation and redevelopment assessment.</p>
      <h3>Pathway 4: outcomes deteriorate but model measures appear stable</h3>
      <p><strong>Signal:</strong> losses or delinquency rise while mature discrimination and calibration tests show little change. <strong>Hypothesis:</strong> exposure, LGD, collections, vintage mix or operational treatment changed rather than PD accuracy. <strong>Investigation:</strong> reconcile default, loss and exposure definitions; align vintages; inspect limits, cures, collections and severity. <strong>Decision:</strong> direct action to the affected decision or portfolio process instead of forcing a PD-model remedy.</p>
    </section>

    <section id="failure-modes">
      <h2>Why apparently disciplined monitoring still fails</h2>
      <p><strong>Dashboard theatre begins with convenience.</strong> A stable pack is easy to produce, compare and govern. It fails when recurring metrics become the deliverable rather than prompts for investigation. The consequence is a large evidence archive with no explanation of what changed, why it matters or who must act.</p>
      <p><strong>Threshold-only monitoring feels objective.</strong> Red, amber and green remove argument from committee packs. It fails because uncertainty, portfolio scale, model use and economic consequence differ. A marginal breach in a small noisy segment can receive more attention than a persistent sub-threshold shift in a material exposure. Thresholds should trigger proportional inquiry, not substitute for judgement.</p>
      <p><strong>PSI attracts excessive authority because it is early and outcome-free.</strong> It can be calculated before defaults mature. It fails as a validity test because distribution movement neither proves performance loss nor identifies cause. Teams can redevelop a useful model after an expected mix change, or ignore calibration deterioration because PSI remains modest.</p>
      <p><strong>Aggregate reporting appears stable and senior-friendly.</strong> It fails when offsetting errors cancel, new vintages are diluted by mature books, or a high-risk segment is small by count but large by loss. Segment, vintage and policy-version views should be selected for economic meaning, with sample size visible to prevent false precision.</p>
      <p><strong>Incompatible windows create confident but invalid comparisons.</strong> A twelve-month PD cannot be judged against six months of realised outcomes without a justified method. Recent cohorts are not evidence of good performance simply because defaults have not had time to emerge. The practical consequence is delayed escalation followed by sudden apparent deterioration as accounts season.</p>
      <p><strong>Premature remediation mistakes symptom for cause.</strong> Recalibration is attractive because it is faster than redevelopment; redevelopment can feel safer because it is comprehensive. Both fail when selected before cause classification. Recalibrating corrupted data institutionalises an error. Redeveloping a sound rank-order model after a temporary baseline shift destroys useful history and consumes governance capacity.</p>
    </section>

    <section id="decision-system">
      <h2>The model-monitoring decision system</h2>
      <p>A signal becomes actionable only after materiality and cause are assessed. Materiality is specific to portfolio, model purpose, sample size, model risk tier, governance, regulation, risk appetite and business consequence. The architecture below deliberately branches after classification: no metric points mechanically to one remedy.</p>
      <ResourceFigure label="From monitoring signal to model action: signal, materiality, diagnostic decomposition, cause classification, decision, action and follow-up. Possible actions include continued monitoring, data investigation, implementation correction, recalibration, strategy adjustment, redevelopment assessment and governance escalation." caption="Monitoring is a diagnostic decision process. The response follows evidence about cause and consequence, not the colour of a threshold.">
        <div className={styles.decisionSystem}>
          <ol>{["Signal", "Materiality", "Decompose", "Classify cause", "Decide", "Act", "Follow up"].map((step, i) => <li key={step}><b>{String(i + 1).padStart(2, "0")}</b><strong>{step}</strong></li>)}</ol>
          <div className={styles.causes}><span>DATA / IMPLEMENTATION</span><span>POPULATION / ENVIRONMENT</span><span>MODEL / CALIBRATION</span><span>POLICY / USE</span></div>
          <div className={styles.actions}>{["Continue monitoring", "Investigate data or segment", "Correct implementation", "Recalibrate", "Adjust decision strategy", "Constrain use", "Assess redevelopment", "Validation / governance escalation"].map(action => <span key={action}>{action}</span>)}</div>
          <p>Named owner · due date · evidence retained · residual risk · effectiveness review</p>
        </div>
      </ResourceFigure>
      <p>Follow-up closes the loop. A corrected mapping needs reprocessed outputs and confirmation that monitoring normalised. A recalibration needs out-of-time assessment and approval. A policy change needs cohort tracking to determine whether realised outcomes improved without unacceptable approval or customer effects. An escalation without a named owner and review date is documentation, not control.</p>
    </section>

    <section id="operationalise">
      <h2>Make monitoring a living decision process</h2>
      <p>The opening problem is resolved only when valid-looking model outputs are no longer accepted as evidence of reliability by themselves. A mature system connects <strong>data → signal → diagnosis → decision → ownership → action → follow-up</strong>. It records not only what the metrics were, but which hypotheses were tested, what changed in the operating environment and whether the response worked.</p>
      <p>Much of that work is recurring, data-intensive and evidence-heavy: metric calculation, distribution comparison, calibration and segment exception detection, historical comparison, monitoring-pack production, trigger management and diagnostic drill-down preparation. Those activities are suitable for systematic augmentation. Causal interpretation, materiality, policy choice, approval and regulatory accountability remain human responsibilities.</p>
      <div className={styles.bridgeGrid}>
        <article><span>IMPLEMENTATION</span><h3>Build the monitoring architecture around the decision.</h3><p>Entimema Credit Risk connects model evidence, portfolio behaviour, policy and governance into an operational monitoring system.</p><Link href="/services/credit-risk">Explore Credit Risk consulting <b>→</b></Link></article>
        <article><span>OPERATIONALISATION</span><h3>From recurring signals to repeatable workflows.</h3><p>A future PD Model Monitoring Agent could prepare calculations, exceptions, history and investigation pathways for human review. This is a product direction, not a claim of a currently launched agent.</p><Link href="/agents">Explore the AI Agents Library <b>→</b></Link></article>
      </div>
      <h3>Evidence base and methodological boundary</h3>
      <p>This framework synthesises general monitoring principles with original Entimema diagnostic reasoning. Relevant authoritative foundations include the <a href="https://www.bis.org/bcbs/publ/d595.htm">Basel Committee’s current credit-risk principles</a>, the <a href="https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/model-validation/guidelines-pd-estimation-lgd">EBA guidelines on PD estimation and validation</a>, and the <a href="https://www.occ.treas.gov/news-issuances/bulletins/2026/bulletin-2026-13.html">2026 US interagency model-risk guidance</a>. Institution-specific thresholds, validation standards and actions must follow the applicable portfolio, use, governance and regulatory context.</p>
    </section>
  </>;
}
