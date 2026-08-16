import Link from "next/link";
import { DecisionImplication, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./pd-model-recalibration.module.css";

export const pdModelRecalibrationSections = [
  { id: "wrong-repair", label: "The wrong repair" },
  { id: "four-states", label: "Four diagnostic states" },
  { id: "example", label: "Two deterioration patterns" },
  { id: "decision", label: "Recalibrate or rebuild?" },
  { id: "repair-button", label: "Not a repair button" },
  { id: "resolve", label: "Match action to failure" },
] as const;

export default function PdModelRecalibrationArticle() {
  return <>
    <p className={styles.lead}>A PD model has deteriorated. The fastest response is to move its probabilities back towards observed default rates. That response is also capable of making a structurally obsolete model look repaired.</p>
    <p>The opposite mistake is just as costly. If the model still separates relative risk well and only the absolute risk level has shifted, full redevelopment can add estimation uncertainty, implementation risk and governance burden without solving a deeper problem. The decision is not whether performance is poor. It is <strong>what kind of performance failed</strong>.</p>
    <KeyObservation title="The intervention principle">Recalibration changes the probability attached to a risk ordering. Redevelopment changes how that ordering is produced. Neither is proportionate until the failure mode is diagnosed.</KeyObservation>

    <section id="wrong-repair">
      <h2>Recalibration and redevelopment repair different things</h2>
      <p><strong>Recalibration</strong> preserves the model’s underlying score or ranking relationship while revising the mapping from that output to probability of default. It is plausible when ranking remains sufficiently useful, the population is relevant, structural relationships are stable enough, and the observed calibration shift can be estimated from representative outcomes.</p>
      <p><strong>Redevelopment</strong> revisits the model’s predictive architecture: variables, transformations, segmentation, functional form, interactions, estimation sample or modelling method. It becomes more plausible when relative ordering weakens, relationships no longer generalise, important populations sit outside the model’s support, or repeated adjustments cannot restore stable performance.</p>
      <p>This is a continuum, not a clean binary. A concentrated segment may need a new submodel while the wider portfolio needs only recalibration. A decision-policy correction may improve outcomes without changing the model. A data defect must be repaired before either intervention is assessed. <Link href="/resources/pd-model-monitoring">PD model monitoring</Link> detects and decomposes these signals; intervention begins only after that diagnostic work.</p>
    </section>

    <section id="four-states">
      <h2>Four states organise the first decision</h2>
      <p>Discrimination and calibration answer different questions. Discrimination asks whether higher-risk borrowers still rank above lower-risk borrowers. Calibration asks whether predicted PD levels correspond to realised risk. Their combination provides a compact starting map.</p>
      <ResourceFigure label="Four model states matrix. Stable discrimination with stable calibration supports monitoring; stable discrimination with poor calibration makes recalibration a candidate; weakening discrimination with stable aggregate calibration requires structural diagnosis; weakening discrimination with poor calibration makes redevelopment increasingly plausible." caption="The matrix guides investigation. It does not replace evidence on data, population, segments, vintages, policy or governance judgement.">
        <div className={styles.matrix}>
          <div className={styles.matrixAxis}><b>CALIBRATION</b><span>STABLE</span><span>POOR</span></div>
          <div className={styles.matrixBody}>
            <div className={styles.discrimination}><b>DISCRIMINATION</b><span>STABLE</span><span>WEAKENING</span></div>
            <article><small>STATE 1</small><strong>Monitor</strong><p>No fundamental intervention indicated by these measures alone.</p></article>
            <article className={styles.candidate}><small>STATE 2</small><strong>Recalibration candidate</strong><p>Ranking survives; test whether the probability mapping can be repaired.</p></article>
            <article><small>STATE 3</small><strong>Structural diagnosis</strong><p>Acceptable aggregate calibration may conceal deteriorating ordering.</p></article>
            <article className={styles.rebuild}><small>STATE 4</small><strong>Redevelopment increasingly plausible</strong><p>Both relative and absolute risk performance have weakened.</p></article>
          </div>
          <p>Before action: verify data integrity · population relevance · segment behaviour · vintage maturity · decision-policy chronology</p>
        </div>
      </ResourceFigure>
      <p>State 3 is easily missed. Aggregate predicted and observed default rates can align even while risk ordering deteriorates inside the portfolio. Offsetting errors may make the calibration total look acceptable. A level correction cannot restore lost separation, and acceptable O/E does not prove that account-level probabilities remain decision-useful. The distinction is developed further in <Link href="/resources/pd-model-ranking-calibration">PD ranking and calibration research</Link>.</p>
    </section>

    <section id="example">
      <h2>Two similar symptoms, two different interventions</h2>
      <p>Consider a fictional consumer-credit model evaluated on mature, comparable twelve-month outcome windows. The figures are synthetic and demonstrate reasoning rather than universal action thresholds.</p>
      <ResourceTable caption="Synthetic deterioration scenarios" headers={["Period", "AUC", "Predicted PD", "Observed DR", "O/E"]} rows={[
        ["Reference", "0.76", "4.1%", "4.3%", "1.05"],
        ["Scenario A", "0.75", "4.2%", "6.1%", "1.45"],
        ["Scenario B", "0.66", "4.3%", "6.2%", "1.44"],
      ]}/>
      <p>In Scenario A, AUC changes only modestly while observed risk rises far above predicted risk. The ranking relationship appears broadly intact; absolute risk has shifted. If the movement is persistent, outcomes are representative and calibration error is not hiding segment failure, recalibration is a credible candidate. It is not yet the decision.</p>
      <p>Scenario B has almost the same aggregate calibration error, but AUC falls materially. A recalibration might improve portfolio-level O/E while preserving a weakened ordering underneath. The investigation now belongs at relationship, variable and segment level: rank ordering by band, stability of coefficients or feature effects, population support, missingness and policy selection. Redevelopment becomes materially more plausible.</p>
      <DecisionImplication>O/E describes the level of error, not the architecture required to repair it. The same O/E can coexist with a usable ranking relationship or a structurally weakened model.</DecisionImplication>
      <p>Vintage evidence also matters. If deterioration is concentrated in recent originations after a cut-off or channel change, <Link href="/resources/credit-vintage-analysis">same-age vintage analysis</Link> can separate a new-book effect from broad model failure. Immature cohorts or temporary macro pressure can make an immediate intervention premature.</p>
    </section>

    <section id="decision">
      <h2>Recalibrate or rebuild? Follow the cause, not the alarm</h2>
      <ResourceFigure label="Diagnostic framework from model deterioration to proportionate intervention. Stable discrimination leads to calibration, population, segment, data and decision-policy checks before recalibration can become a candidate. Weakening discrimination leads to structural investigation and may support segment intervention, use constraints, redevelopment or governance escalation." caption="The branches are conditional. Population, data, segment and policy evidence can redirect the intervention at every stage.">
        <div className={styles.tree}>
          <header><small>SIGNAL</small><strong>MODEL DETERIORATION DETECTED</strong></header>
          <div className={styles.split}><span>DISCRIMINATION SUFFICIENTLY STABLE?</span></div>
          <div className={styles.branches}>
            <article><b>YES</b><h3>Has calibration deteriorated?</h3><p>Test persistence, outcome maturity, representativeness and error by segment.</p><strong>RECALIBRATION MAY BECOME A CANDIDATE</strong></article>
            <article><b>NO</b><h3>Which relationships weakened?</h3><p>Investigate variables, segmentation, functional form, population support and implementation.</p><strong>STRUCTURAL INTERVENTION BECOMES MORE PLAUSIBLE</strong></article>
          </div>
          <div className={styles.checks}>{["Data issue?", "Population change?", "Segment-specific?", "Vintage effect?", "Decision-policy change?"].map(x=><span key={x}>{x}</span>)}</div>
          <div className={styles.outcomes}>{["Monitor", "Repair data", "Recalibrate", "Segment intervention", "Adjust strategy", "Constrain use", "Redevelop", "Validation / governance"].map(x=><span key={x}>{x}</span>)}</div>
          <footer>Signal → diagnosis → cause → proportionate intervention → effectiveness review</footer>
        </div>
      </ResourceFigure>
      <p>If deterioration is segment-specific, a portfolio-wide change may dilute the real problem. Investigate eligibility, overrides, feature coverage and a segment treatment before rebuilding everything. If a new cut-off, pricing strategy or acquisition campaign changed the booked population, assess the strategy and selection effect before blaming model methodology. If upstream data changed, restore implementation integrity before estimating any new parameters.</p>
      <p>Governance escalation is not reserved for redevelopment. A material recalibration changes risk estimates and may affect approvals, pricing, provisions or capital. The required validation, approval and change classification depend on model use, materiality and the applicable regime. No universal statistical boundary can make that decision safely.</p>
    </section>

    <section id="repair-button">
      <h2>Recalibration is not a repair button</h2>
      <p>It becomes one when speed is mistaken for diagnosis. Recalibrating before analysing population movement can fit the model to a changed mix it was never intended to represent. Recalibrating on too few mature outcomes can turn noise into a production parameter. Correcting only the portfolio average can leave serious underprediction in one segment offset by overprediction in another.</p>
      <p>Repeated recalibration is a particularly valuable warning. If each adjustment loses relevance quickly, the baseline may not merely be moving; the relationships or operating environment may be unstable. Continuing to adjust the output scale can accumulate methodological patches while postponing the structural decision.</p>
      <p>Nor should temporary macro movement be treated mechanically. The model’s rating philosophy, observation horizon and intended use determine how economic conditions should appear in estimates. Diagnosis should test whether the deviation is persistent, systematic and decision-material, not simply whether one period is adverse.</p>
    </section>

    <section id="resolve">
      <h2>Choose the smallest intervention that repairs the actual failure</h2>
      <p>The model did not deteriorate in the abstract. Its data, population relevance, ranking, probability mapping, segment behaviour or operating environment deteriorated in a particular way. The defensible response is the smallest governed intervention that addresses that cause without concealing residual risk.</p>
      <p>The recurring sequence is <strong>monitor → detect → diagnose → classify → prepare investigation → human decision</strong>. Calculation, historical comparison, exception prioritisation and evidence assembly can be systematically augmented. Model-change decisions, materiality judgements and accountability remain human-governed.</p>
      <div className={styles.bridges}>
        <article><span>IMPLEMENTATION</span><h3>Diagnose before changing the model.</h3><p>Entimema Credit Risk connects performance evidence, portfolio change and governance to a proportionate intervention.</p><Link href="/services/credit-risk">Explore Credit Risk consulting <b>→</b></Link></article>
        <article><span>OPERATIONALISATION</span><h3>Make recurring diagnosis reproducible.</h3><p>A future PD Model Monitoring Agent could prepare signals, classifications and investigation routes for human review. It is a product direction, not a live-agent claim.</p><Link href="/agents">Explore the AI Agents Library <b>→</b></Link></article>
      </div>
      <h3>Methodological boundary</h3>
      <p>The framework is original Entimema reasoning grounded in general model-risk principles. The <a href="https://www.occ.treas.gov/news-issuances/bulletins/2026/bulletin-2026-13.html">2026 US interagency model-risk guidance</a> explicitly positions adjustment, recalibration and redevelopment as outcomes informed by validation; the <a href="https://www.eba.europa.eu/single-rule-book-qa/qna/view/publicId/2023_6747">EBA’s PD calibration guidance</a> requires analysis of why realised and estimated default rates deviate; and the <a href="https://www.bis.org/basel_framework/chapter/CRE/36.htm">Basel Framework</a> requires ongoing review of performance, stability, model relationships and outcomes. Institution-specific standards remain governed by portfolio, use and regulatory context.</p>
    </section>
  </>;
}
