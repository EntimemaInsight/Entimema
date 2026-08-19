import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./point-in-time-credit-features.module.css";

export const pointInTimeCreditFeaturesSections = [
  { id: "failure", label: "The hidden leakage" }, { id: "eligibility", label: "Event eligibility" },
  { id: "snapshots", label: "Snapshot leakage" }, { id: "identity", label: "Historical entity state" },
  { id: "features", label: "Event and state features" }, { id: "labels", label: "Label separation" },
  { id: "manifest", label: "Dataset manifest" }, { id: "builder", label: "PIT feature builder" },
  { id: "revisions", label: "Known and restated features" }, { id: "coherence", label: "Temporal coherence" },
  { id: "taxonomy", label: "Leakage taxonomy" }, { id: "tests", label: "Temporal unit tests" },
  { id: "timeline", label: "Golden feature timeline" }, { id: "validation", label: "Replay validation" },
  { id: "observability", label: "Observability" }, { id: "architecture", label: "PIT feature architecture" },
  { id: "agent", label: "PIT Validation Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function PointInTimeCreditFeaturesArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A historical warehouse says <code>MaxDPD_90d = 12</code> for a decision made at 2026-08-18 14:00. Production would have seen 28: the payment correction that reduced DPD had not reached the institution yet. Both values describe the same economic period; only one was available to the model.</p>
    <div className={styles.failure}><span><b>KNOWN @ 14:00</b>MaxDPD_90d = 28</span><i>late correction arrives</i><span><b>RESTATED TODAY</b>MaxDPD_90d = 12</span></div>
    <Formula label="Decision cut-off"><span>T<sub>d</sub> = exact timestamp the historical decision would be made</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Most credit-model leakage is a subtle violation of historical availability</strong>—corrected events, end-of-day state, current identities, late bureau responses or windows that cross the decision boundary.</p></KeyObservation>
  </section>
  <section id="eligibility"><h2>Observation windows and availability windows are not the same</h2>
    <p>For feature X, <strong>W<sub>X</sub>(T<sub>d</sub>)</strong> defines the economic period it may inspect. A governed 90-day convention might be (T<sub>d</sub>−90d, T<sub>d</sub>]. The timestamp basis and inclusive boundaries must be explicit.</p>
    <Formula label="Two-axis feature eligibility"><span>T<sub>effective</sub> ∈ W(T<sub>d</sub>) and T<sub>available</sub> ≤ T<sub>d</sub></span></Formula>
    <Formula label="Eligibility indicator"><span>Eligible(E,T<sub>d</sub>) = I(EffectiveTime(E) ∈ W) × I(AvailableTime(E) ≤ T<sub>d</sub>)</span></Formula>
    {code(`WHERE effective_time > :decision_time - INTERVAL '90 days'
  AND effective_time <= :decision_time
  AND available_time <= :decision_time`)}
    <p>Effective time alone leaks later-known corrections. Load time alone can admit a future-effective change. Both axes are mandatory. For intraday decisions, a date is not a timestamp: an 18:00 event must not enter a 10:00 feature because they share a date.</p>
  </section>
  <section id="snapshots"><h2>An end-of-day snapshot can leak thirteen hours into a morning decision</h2>
    <ResourceFigure label="Same-day information after the decision is still future information." caption="Joining a 23:59 daily customer snapshot to every decision on that date is unsafe for intraday decisioning."><div className={styles.day}><span>00:00</span><strong>10:00<br/><b>DECISION CUT-OFF</b></strong><i>future same-day events →</i><span>23:59<br/><b>EOD SNAPSHOT</b></span></div></ResourceFigure>
    <p>A table named <code>customer_state_daily</code> says nothing about its usable cut-off. Every snapshot needs <code>effective_as_of</code> and <code>available_as_of</code>, not only <code>snapshot_date</code>.</p>
    <ResourceTable caption="Why common historical joins fail" headers={["Join","Leakage"]} rows={[
      ["effective_time ≤ decision_time","Includes records learned later"], ["loaded_at ≤ decision_time","May include future-effective state"],
      ["snapshot_date = decision_date","Includes later same-day facts"], ["historical decision → current master","Injects current identity, segment and ownership"],
    ]} />
  </section>
  <section id="identity"><h2>Resolve historical membership before aggregating historical events</h2>
    <div className={styles.sequence}><span>IDENTITY + RELATIONSHIPS KNOWN @ T</span><b>→</b><span>ELIGIBLE FACILITIES + EVENTS</span><b>→</b><span>AGGREGATE FEATURE</span></div>
    <p>The reverse—aggregate today&apos;s canonical entities and attach an old decision date—creates identity and relationship leakage. A later party merge can consolidate exposure production saw separately; a later co-borrower edge can introduce an unknown facility.</p>
    {code(`SELECT ...
FROM decisions d
JOIN customer_attribute_history a
  ON a.party_id = d.party_id
 AND a.valid_from <= d.decision_time
 AND (a.valid_to IS NULL OR a.valid_to > d.decision_time)
 AND a.system_from <= d.decision_time
 AND (a.system_to IS NULL OR a.system_to > d.decision_time);`)}
    <p>SCD Type 2 preserves validity but not necessarily when a backdated correction became known. Critical mutable dimensions need valid and system time. Historical exposure includes only known, valid facility relationships and point-in-time state.</p>
  </section>
  <section id="features"><h2>Event features count eligible events; state features reconstruct the path</h2>
    <ResourceTable caption="Feature architecture by economic grain" headers={["Feature","Required history","PIT control"]} rows={[
      ["PaymentCount_90d","Discrete payment events","Finality, effective time, availability and reversal semantics"],
      ["PaymentRatio_90d","Payments, schedule and allocation","Eligible numerator and denominator under one state mode"],
      ["MaxDPD_180d","Historical delinquency path","Known DPD states or schedule/payment replay"],
      ["AverageUtilisation_30d","Utilisation state path","Time-weighted intervals or documented daily approximation"],
      ["TotalInternalDrawn","Historical facility membership and state","Resolve entity membership before aggregation"],
    ]} />
    <p>Current DPD cannot produce historical max DPD, and start/end utilisation cannot produce average utilisation. Store constant-state intervals where precision matters:</p>
    <Formula label="Time-weighted state feature"><span>AverageX = (1 / (T₂−T₁)) ∫<sub>T₁</sub><sup>T₂</sup> X(t)dt</span></Formula>
    <p>A daily approximation can be valid methodology, but document it rather than claiming continuous-time exactness.</p>
  </section>
  <section id="labels"><h2>Observation ends before performance begins</h2>
    <ResourceFigure label="Features and labels occupy separate temporal regions." caption="No event after the decision cut-off may influence a pre-decision feature; performance labels use a separately versioned outcome methodology."><div className={styles.windows}><span><b>OBSERVATION WINDOW</b>T−90d → T</span><strong>DECISION<br/>CUT-OFF</strong><span><b>PERFORMANCE WINDOW</b>T → T+12m</span></div></ResourceFigure>
    <Formula label="Feature/label boundary"><span>ObservationEnd ≤ DecisionTime &lt; PerformanceStart</span></Formula>
    <p>Future default, restructuring, collections outcomes and post-decision payments cannot enter features. Labels may use eventual restated outcomes, but methodology must say so. If data end before T<sub>d</sub> + horizon, the row is censored—not automatically non-default.</p>
    <Formula label="Dataset maturity"><span>T<sub>latest eligible decision</sub> = T<sub>dataset end</sub> − PerformanceHorizon</span></Formula>
  </section>
  <section id="manifest"><h2>The dataset manifest declares which historical world was built</h2>
    {code(`type FeatureDatasetManifest = {
  datasetId: string;
  generatedAt: Date;
  populationStart: Date;
  populationEnd: Date;
  decisionTimeField: string;
  featureSetVersion: string;
  stateMode: "KNOWN" | "RESTATED";
  labelDefinitionVersion: string;
  performanceHorizon: string;
};`)}
    <p>Given the manifest and governed sources, the dataset should rebuild. A hash of schema, row keys and metadata can detect mutation but cannot replace lineage. Do not combine restated DPD, known exposure and today&apos;s identity into a synthetic past.</p>
  </section>
  <section id="builder"><h2>One semantic builder should serve research, validation and replay</h2>
    {code(`buildFeatureVector({
  entityId,
  decisionTime,
  featureSetVersion,
  stateMode: "KNOWN"
});`)}
    {code(`name: payment_count_90d
entity: facility
source_event: PAYMENT_APPLIED
window: 90d
time_basis: effective_time
availability_constraint: true
aggregation: count
version: v1`)}
    <p>A declarative registry pins source, grain, window, aggregation and null handling without requiring a full feature DSL. Where research SQL and production code remain separate, equivalence tests are mandatory.</p>
    {code(`SELECT d.decision_id, COUNT(e.event_id) AS payment_count_90d
FROM decisions d
LEFT JOIN financial_events e
  ON e.facility_id = d.facility_id
 AND e.event_type = 'PAYMENT_APPLIED'
 AND e.effective_time > d.decision_time - INTERVAL '90 days'
 AND e.effective_time <= d.decision_time
 AND e.available_time <= d.decision_time
GROUP BY d.decision_id;`)}
  </section>
  <section id="revisions"><h2>One feature can have known and corrected histories</h2>
    <div className={styles.histories}><article><b>X<sup>known</sup>(T)</b><p>Latest immutable revision available by T. Replicates production information.</p></article><article><b>X<sup>restated</sup>(T)</b><p>Current best economic reconstruction after corrections.</p></article><article><b>X<sup>improved infrastructure</sup>(T)</b><p>Controlled simulation of faster availability or better resolution.</p></article></div>
    <p>Keep a <code>feature_revision_id</code> or system-time chain rather than overwriting a row. A production-like backfill reconstructs historical availability; a restated backfill uses corrected knowledge. The choice of known or restated training must be intentional.</p>
  </section>
  <section id="coherence"><h2>The training-serving time contract is part of the model</h2>
    <Formula label="Temporal coherence"><span>FeatureVector(T) = one identity, state mode, availability horizon and feature-version set</span></Formula>
    <p>Record effective time, available time and state mode. Refresh improvements can shift distributions even when model code is unchanged; treat them as data-generating-process and infrastructure-version changes requiring validation. Improved identity resolution and upstream semantic changes can do the same.</p>
  </section>
  <section id="taxonomy"><h2>Leakage has six engineering forms</h2>
    <ResourceFigure label="Entimema feature leakage taxonomy." caption="The obvious future target is only one path. Most operational leakage enters through time, identity, relationships, snapshots or silent definition changes."><div className={styles.taxonomy}>{[["TEMPORAL","future or unavailable facts"],["IDENTITY","future party mapping"],["RELATIONSHIP","future facility links"],["SNAPSHOT","end-of-period state"],["LABEL","future outcome in feature"],["SEMANTIC","definition embeds outcome knowledge"]].map(([a,b])=><span key={a}><b>{a}</b>{b}</span>)}</div></ResourceFigure>
    <p>Prioritise deep PIT review for DPD, payment behaviour, utilisation, internal exposure, bureau and cross-entity features where temporal complexity is higher.</p>
  </section>
  <section id="tests"><h2>Temporal unit tests attack every boundary where leakage hides</h2>
    <ResourceTable caption="Mandatory point-in-time tests" headers={["Test","Expected result"]} rows={[
      ["Cut-off","Event at 14:00:01 is excluded from a 14:00 decision"], ["Timestamp tie","Explicit ordering governs an event exactly at T"],
      ["Late event","Monday-effective, Wednesday-available event is excluded on Tuesday"], ["Restated mode","The same event can enter Tuesday’s corrected feature"],
      ["Window boundary","Event exactly T−90d follows the declared rule"], ["Identity correction","Decision before merge uses old mapping"],
      ["Facility creation","Facility opened after T never enters exposure"], ["Reversal","Payment feature follows each decision-time state"],
      ["End-of-day","18:00 event never enters a 10:00 daily feature"], ["Future sentinel","Synthetic post-cut-off event has zero influence"],
    ]} />
  </section>
  <section id="timeline"><h2>A golden timeline makes temporal correctness executable</h2>
    <div className={styles.timeline}>{[["T0","P1 + F1"],["T1","payment"],["T2","decision A"],["T3","late payment"],["T4","reversal"],["T5","identity merge"],["T6","new facility"],["T7","decision B"]].map(([a,b],i)=><span key={a}><b>{a}</b>{b}{i<7?<i>→</i>:null}</span>)}</div>
    <p>Fix expected payment count, ratio, DPD, utilisation and exposure at each decision. Build a small golden dataset with fixed rows, features and labels. Any code change must reproduce it unless intentionally versioned.</p>
    <Formula label="Offline replay equality"><span>Features<sup>reconstructed</sup><sub>i</sub> = Features<sup>stored production</sup><sub>i</sub></span></Formula>
  </section>
  <section id="validation"><h2>Model validation must test whether the dataset was possible</h2>
    <p>A statistically strong model trained on impossible information is operationally invalid. Audit each feature’s entity grain, sources, window, timestamp basis, availability constraint, identity semantics and label relationship.</p>
    <ResourceTable caption="Leakage incident response" headers={["Step","Evidence"]} rows={[
      ["Identify","Affected definitions, revisions and datasets"], ["Rebuild","Correct known-state PIT dataset"],
      ["Measure","Performance and calibration change"], ["Assess","Historical and prospective decision impact"], ["Remediate","Retrain, revalidate or constrain use as required"],
    ]} />
  </section>
  <section id="observability"><h2>Monitor point-in-time integrity as an ongoing control</h2>
    <div className={styles.metrics}>{["PITMismatchRate","LateDataFeatureImpactRate","FeatureRevisionRate","HistoricalReplayMismatchRate","SameDayLeakageTestFailures","TemporalCoherenceFailureRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal thresholds apply. Compare reconstructed features with stored production snapshots, monitor revision impact by feature and cohort, and run fixed replay cases after identity, state, pipeline or schema changes.</p>
  </section>
  <section id="architecture"><h2>The Entimema architecture filters knowledge before computing features</h2>
    <ResourceFigure label="Entimema point-in-time credit feature architecture." caption="Historical entity state establishes population; effective and availability constraints establish evidence; the known snapshot feeds training, validation and replay."><div className={styles.architecture}>{["DECISION TIME","HISTORICAL IDENTITY / RELATIONSHIPS","ELIGIBLE EVENTS + STATE · EFFECTIVE ≤ T AND AVAILABLE ≤ T","OBSERVATION WINDOW","FEATURE COMPUTATION VERSION","KNOWN FEATURE SNAPSHOT","TRAINING / VALIDATION / DECISION REPLAY"].map((x,i)=><span key={x}>{x}{i<6?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Define → Cut → Join → Test → Validate" steps={["Anchor decision time", "Resolve historical entity state", "Define observation window", "Filter effective time", "Filter availability time", "Compute pinned feature version", "Freeze snapshot", "Separate performance window", "Test leakage boundaries", "Validate replay"]} />
  </section>
  <section id="agent"><h2>A Point-in-Time Feature Validation Agent can find impossible historical inputs</h2>
    <p>A controlled agent can inspect temporal definitions, validate window boundaries, detect availability violations, compare reconstructed with stored features, find current-master, identity and relationship leakage, test late events and same-day cut-offs, and identify affected models and datasets.</p>
    <KeyObservation title="Bounded role"><p><strong>Temporal feature validation + leakage detection + historical replay support.</strong> It prepares evidence for model validation and engineering teams; it must not autonomously approve model changes or modify production features.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Validate temporal legitimacy alongside discrimination, calibration and stability.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Preserve exact cut-offs and production feature snapshots.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Maintain bitemporal events, identity, relationships and state.</Link></p></article></div>
    <p>Continue with <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store That Actually Respects Time</Link>, <Link href="/resources/point-in-time-customer-state-reconstruction">Point-in-Time Customer State Reconstruction</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/late-arriving-events-backdated-corrections">Late-Arriving Events and Backdated Corrections</Link> and <Link href="/resources/why-customer-id-is-not-enough-entity-resolution-lending">Why Customer ID Is Not Enough</Link>. Event-driven risk, streaming features and infrastructure-driven feature drift remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>For every historical feature, prove that the institution could genuinely have known that exact information at the decision cut-off.</strong></p></KeyObservation>
  </section>
</div>; }
