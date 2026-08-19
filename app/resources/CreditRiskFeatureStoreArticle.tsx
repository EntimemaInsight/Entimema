import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-risk-feature-store.module.css";

export const creditRiskFeatureStoreSections = [
  { id: "failure", label: "The unexplained feature" }, { id: "contract", label: "Feature contract" },
  { id: "time", label: "Time semantics" }, { id: "stores", label: "Online and offline" },
  { id: "pit", label: "Point-in-time retrieval" }, { id: "registry", label: "Feature registry" },
  { id: "versioning", label: "Version compatibility" }, { id: "freshness", label: "Freshness and serving lag" },
  { id: "computation", label: "Incremental computation" }, { id: "late", label: "Late events and backfills" },
  { id: "lineage", label: "Lineage and dependencies" }, { id: "leakage", label: "Leakage controls" },
  { id: "serving", label: "Serving contract" }, { id: "deployment", label: "Deployment evidence" },
  { id: "testing", label: "Golden feature tests" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Feature-store architecture" }, { id: "agent", label: "Feature Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function CreditRiskFeatureStoreArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>A production decision at 2026-08-18 14:00 used <code>MissedPayments_90d = 2</code>. Today, the offline warehouse says the historical value was 1. Was the difference caused by a late payment, a correction, new feature logic, a window boundary, stale online state or a changed identity mapping?</p>
    <div className={styles.mismatch}><span><b>PRODUCTION @ 14:00</b>MissedPayments_90d = 2</span><i>≠</i><span><b>OFFLINE TODAY</b>MissedPayments_90d = 1</span></div>
    <p>If the platform cannot answer why, it is not a controlled model-input layer. Serving matching column names online and offline is not enough.</p>
    <KeyObservation title="The central thesis"><p><strong>A reliable feature store preserves semantic definition, observation window, effective time, availability time, lineage, version and reproducible point-in-time retrieval for every value.</strong></p></KeyObservation>
  </section>

  <section id="contract"><h2>A feature store is a semantic contract, not a scalar cache</h2>
    {code(`type FeatureDefinition = {
  featureName: string;
  entityType: "PARTY" | "FACILITY" | "ACCOUNT";
  valueType: "NUMBER" | "BOOLEAN" | "CATEGORY";
  definitionVersion: string;
  observationWindow?: string;
  sourceDomains: string[];
};`)}
    <p>Attach a feature to its economic object: payment volatility may be account-level, utilisation facility-level and total internal exposure party-level. Putting every feature under <code>customer_id</code> hides aggregation and duplication errors.</p>
    <Formula label="Feature grain"><span>FeatureGrain = (Entity, Time) or (Entity, DecisionContext, Time)</span></Formula>
    <p>For <code>PaymentRatio_90d</code>, define the exact interval—such as (T−90d, T]—and which timestamp admits an event. Event, effective and posting time are not interchangeable SQL conveniences. Boundary conventions belong in the contract and in tests.</p>
  </section>

  <section id="time"><h2>Effective, available and calculated time answer different questions</h2>
    <ResourceFigure label="Availability—not merely economic effectiveness—controls decision eligibility." caption="A feature can describe state through 13:00, run at 13:45 and reach serving at 14:00. A 13:30 decision cannot use it."><div className={styles.timeline}>{[["EVENT / STATE","effective evidence"],["FEATURE EFFECTIVE","13:00"],["CALCULATED","13:45"],["AVAILABLE","14:00"],["DECISION","14:10"]].map(([a,b],i)=><span key={a}><b>{a}</b>{b}{i<4?<i>→</i>:null}</span>)}</div></ResourceFigure>
    <Formula label="Operational sequence"><span>T<sub>available</sub> ≥ T<sub>effective</sub></span></Formula>
    <Formula label="Signature distinction"><span>CalculatedAt ≠ EffectiveAsOf</span></Formula>
    {code(`type FeatureValue<T> = {
  entityId: string;
  featureName: string;
  value: T;
  effectiveAsOf: Date;
  availableAsOf: Date;
  calculatedAt: Date;
  definitionVersion: string;
};`)}
  </section>

  <section id="stores"><h2>One definition feeds two serving layers with different workloads</h2>
    <ResourceFigure label="Same definition and known state must converge on the same value." caption="The online store optimises current key lookup; the offline store supports training, validation and replay while preserving historical availability."><div className={styles.consistency}><strong>SAME DEFINITION + SAME KNOWN STATE</strong><b>↓</b><div><span>ONLINE STORE<br/><small>low-latency current serving</small></span><span>OFFLINE PIT STORE<br/><small>training · validation · replay</small></span></div><b>↓</b><em>IDENTICAL FEATURE VALUE</em></div></ResourceFigure>
    <Formula label="Semantic consistency"><span>FeatureDefinition<sub>online</sub> = FeatureDefinition<sub>offline</sub></span></Formula>
    <p>The physical code path may differ, but event inclusion, null handling, identity mapping, reversals and window boundaries may not. An online store alone has no historical modelling capability; an offline store without availability time creates hindsight leakage.</p>
  </section>

  <section id="pit"><h2>Point-in-time retrieval chooses the latest value legitimately available</h2>
    {code(`getFeatureAsKnown(
  entityId,
  featureName,
  decisionTime
) // latest value with availableAsOf <= decisionTime`)}
    <p>A restated API answers a different question: today&apos;s corrected feature for an historical effective time. Keep <code>getFeatureAsKnown</code> and <code>getRestatedFeature</code> separate.</p>
    {code(`SELECT d.decision_id, d.party_id, f.value
FROM decisions d
LEFT JOIN LATERAL (
  SELECT value
  FROM feature_history f
  WHERE f.party_id = d.party_id
    AND f.feature_name = 'payment_ratio_90d'
    AND f.available_as_of <= d.decision_time
  ORDER BY f.available_as_of DESC
  LIMIT 1
) f ON TRUE;`)}
    <p>SQL dialects differ. The invariant does not: joining current features is wrong, and filtering only <code>effective_as_of</code> still admits a value computed later. An immutable <code>feature_snapshot_id</code> can simplify replay; dynamic retrieval lowers duplication but demands an immutable temporal store. A hybrid preserves critical scalars, a snapshot reference and reconstructible history.</p>
  </section>

  <section id="registry"><h2>The registry turns feature names into governed contracts</h2>
    {code(`type FeatureRegistryEntry = {
  name: string;
  entityType: string;
  definitionVersion: string;
  owner: string;
  sourceDependencies: string[];
  observationWindow?: string;
  online: boolean;
  offline: boolean;
};`)}
    <ResourceTable caption="Minimum feature contract" headers={["Dimension","Required meaning"]} rows={[
      ["Business definition","What economic behaviour does the value represent?"], ["Entity grain","Party, facility, account or explicit context"],
      ["Type and range","Representation and expected domain"], ["Null semantics","Unavailable, not applicable, missing source or failed computation"],
      ["Time semantics","Window boundaries, membership timestamp and freshness"], ["Sources","Exact governed upstream domains and semantic fields"],
      ["Owner","Definition, change control and quality accountability"], ["Serving mode","Online, offline or both"],
    ]} />
    <p><code>NULL → 0</code> can silently change meaning. Missingness flags are valid only when online and offline computation preserve identical missing semantics.</p>
  </section>

  <section id="versioning"><h2>Definition changes create new feature versions</h2>
    <Formula label="Semantic version boundary"><span>Feature<sub>v1</sub> ≠ Feature<sub>v2</sub></span></Formula>
    <p>Changing <code>utilisation_30d</code> from average drawn/limit to maximum drawn/limit is a new definition even if the label stays. A pure rename may not be. Never overwrite v1 history with v2 logic.</p>
    {code(`{
  "modelVersion": "pd-v5",
  "features": {
    "payment_ratio_90d": "v3",
    "max_dpd_180d": "v2"
  }
}`)}
    <p>The model registry validates exact feature contracts before deployment. If the model expects v3 and only v4 is available, do not silently substitute: fail validation or take a versioned governed fallback.</p>
  </section>

  <section id="freshness"><h2>Freshness is feature- and decision-specific</h2>
    <Formula label="Economic feature age"><span>FeatureAge = T<sub>d</sub> − EffectiveAsOf</span></Formula>
    <Formula label="Serving lag"><span>ServingLag = AvailableAsOf − EffectiveAsOf</span></Formula>
    <Formula label="Calculation lag"><span>CalculationLag = CalculatedAt − EffectiveAsOf</span></Formula>
    <p>A decision policy defines <code>FeatureAge ≤ FreshnessBudget(D,X)</code>. Current utilisation may require high freshness; annual income naturally moves slower. One global SLA is semantically weak.</p>
    <div className={styles.hybrid}><span><b>STREAMING</b>utilisation · recent payment state · transaction count</span><span><b>BATCH</b>long-window aggregates · monthly structural features</span></div>
    <p>Real time is not inherently superior. A mixed vector is sound when each component exposes its own freshness and the decision accepts it explicitly.</p>
  </section>

  <section id="computation"><h2>Incremental features must equal full recomputation</h2>
    <p>A streaming <code>PaymentCount_90d</code> can maintain a queue and rolling count rather than scan every customer. Its state remains a performance optimisation, not the source of methodology.</p>
    <Formula label="Feature computation invariant"><span>Feature<sup>incremental</sup> = Feature<sup>full recompute</sup></span></Formula>
    <p>Compute on write, read or a schedule according to cost, latency, volume and reproducibility. Compute-on-read without a pinned definition can make an old decision return a newly defined feature. Historical values used by decisions should remain immutable by definition version and state mode.</p>
  </section>

  <section id="late"><h2>Late events create known and restated feature history</h2>
    <div className={styles.knownRestated}><article><b>KNOWN FEATURE @ T</b><p>The exact value available to production. Immutable for decision replay.</p></article><article><b>RESTATED FEATURE @ T</b><p>The corrected value after late payments, reversals or identity changes.</p></article></div>
    <p>A late payment may alter today&apos;s feature and restated history while leaving the actual historical decision input unchanged. Distinguish <strong>production replay backfill</strong>, which reconstructs known values, from <strong>restated analytical backfill</strong>, which uses corrected knowledge.</p>
    <p>Every backfill records feature version, source-state mode and execution time. It must never rewrite an immutable decision snapshot.</p>
  </section>

  <section id="lineage"><h2>Feature lineage is a dependency graph, not a free-text note</h2>
    <ResourceFigure label="Feature lineage connects decisions to economic evidence." caption="Derived features remain traceable through base features to canonical events and states; cycles are rejected unless an explicit iterative method governs them."><div className={styles.dependency}>{["CANONICAL EVENTS / STATE","BASE FEATURES","DERIVED FEATURES","MODEL","DECISION"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div></ResourceFigure>
    {code(`getFeatureTrace(
  entityId,
  featureName,
  asOf
) // definition, inputs, state refs and timestamps`)}
    <p>Lineage includes source event/state, transformation version, identity-resolution version and calculation time. It need not inflate every online response, but it must be queryable for model validation and incidents. A derived feature such as current PD minus 30-day-ago PD must preserve both dependency versions.</p>
  </section>

  <section id="leakage"><h2>Point-in-time controls block four distinct leakage paths</h2>
    <ResourceTable caption="Feature leakage taxonomy" headers={["Class","Failure","Control"]} rows={[
      ["Future event leakage","Feature includes an event after the decision","Window ends at decision time"],
      ["Availability leakage","Earlier-effective event became known later","Require availableAsOf ≤ decision time"],
      ["Population leakage","Future identity or group relation enters history","Use identity/relationship version known then"],
      ["Target leakage","Outcome information enters pre-decision inputs","Enforce source and temporal contract"],
      ["Window leakage","10:00 decision receives full 23:59 day aggregate","Use exact intraday boundary, not end-of-day shortcut"],
    ]} />
    <KeyObservation title="Point-in-time proof"><p><strong>Every training row must prove that each feature could legitimately have existed when the credit decision was made.</strong></p></KeyObservation>
  </section>

  <section id="serving"><h2>The serving API returns values with versions and time</h2>
    {code(`interface FeatureService {
  getCurrent(
    entityId: string,
    featureSet: string[]
  ): Promise<FeatureVector>;

  getAsKnown(
    entityId: string,
    featureSet: string[],
    asOf: Date
  ): Promise<FeatureVector>;
}

type FeatureVector = {
  values: Record<string, unknown>;
  featureVersions: Record<string, string>;
  effectiveAsOf: Record<string, Date>;
  availableAsOf: Record<string, Date>;
};`)}
    <p>The decision manifest references the feature-set version, exact feature versions and immutable snapshot or history references. A training dataset manifest adds extraction time, entity population, observation period, point-in-time mode and source versions; a fingerprint can verify metadata and rows, but never replaces lineage.</p>
  </section>

  <section id="deployment"><h2>Shadow comparison turns feature changes into decision evidence</h2>
    <p>Before replacing an online computation path, run old and new versions over the same live traffic without changing decisions. Compare disagreement rate, magnitude, distribution and downstream decision impact.</p>
    <div className={styles.shadow}><span>OLD FEATURE PIPELINE</span><b>↘</b><strong>SAME MODEL + POLICY</strong><b>↗</b><span>NEW FEATURE PIPELINE</span></div>
    <Formula label="Decision impact"><span>ΔDecision = D(Feature<sub>new</sub>) − D(Feature<sub>old</sub>)</span></Formula>
    <p>Stable distributions are not proof of semantic consistency: payment count may still average three after its source silently changes from settled to initiated payments. That is <strong>semantic drift</strong>—economic meaning changed while name and schema remained stable.</p>
  </section>

  <section id="testing"><h2>A golden feature stream tests time, identity and computation together</h2>
    <ResourceTable caption="Golden feature portfolio and property tests" headers={["Test","Expected proof"]} rows={[
      ["Window boundaries","Events exactly at each boundary follow the declared convention"], ["Point-in-time join","No value with availability after T enters training or replay"],
      ["Incremental equality","Incremental value equals full recomputation for identical history"], ["Duplicate event","Idempotent ingestion leaves the feature unchanged"],
      ["Late payment","Restated history changes; known historical input does not"], ["Reversal","Payment features follow the versioned economic-event semantics"],
      ["Identity correction","Current mapping never leaks into old party features"], ["Version compatibility","A model cannot consume an undeclared feature version"],
      ["Missing feature","Unavailable, failed and not-applicable remain distinguishable"], ["Online rebuild","Rebuilt serving state equals canonical feature history"],
    ]} />
    <p>Use deterministic streams covering clean payments, missed dues, reversal, late payment, multiple facilities, stale source and identity correction. Rebuild both online state and offline datasets from governed definitions rather than treating ad hoc extracts as methodology truth.</p>
  </section>

  <section id="observability"><h2>Monitor semantics and lineage as well as distributions</h2>
    <div className={styles.metrics}>{["FeatureFreshness","OnlineOfflineMismatchRate","FeatureNullRate","FeatureComputationFailureRate","LateFeatureUpdateRate","FeatureVersionMismatchRate"].map(x=><span key={x}>{x}</span>)}</div>
    <ResourceTable caption="Feature incident taxonomy" headers={["Incident","Question"]} rows={[
      ["Availability","Is the feature missing or stale?"], ["Semantic","Did definition or source meaning change?"],
      ["Computation","Did the logic fail or diverge?"], ["Temporal","Was point-in-time correctness violated?"], ["Identity","Was the feature attached to the wrong economic entity?"],
    ]} />
    <p>No universal thresholds apply. End-to-end freshness catches a healthy cache serving stale state; upstream semantic contracts catch pipelines that succeed technically while changing economic meaning.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture makes time part of every feature value</h2>
    <ResourceFigure label="Entimema credit risk feature-store architecture." caption="A governed definition and immutable history support both low-latency serving and point-in-time training, then converge through the decision manifest and replay chain."><div className={styles.architecture}><span>CANONICAL EVENTS / STATE</span><b>↓</b><span>FEATURE REGISTRY + CONTRACTS</span><b>↓</b><span>FEATURE COMPUTATION LAYER</span><b>↓</b><span>FEATURE HISTORY STORE</span><b>↓</b><div><span>OFFLINE PIT STORE<br/><small>training / validation</small></span><span>ONLINE SERVING STORE<br/><small>decision engine</small></span></div><b>↓</b><strong>DECISION MANIFEST / REPLAY</strong></div></ResourceFigure>
    <EntimemaFramework title="Define → Compute → Serve → Reconstruct → Validate" steps={["Define feature semantics", "Define entity grain", "Define observation window", "Define time semantics", "Define version", "Compute", "Persist immutable history", "Serve online", "Retrieve point-in-time offline", "Compare and monitor"]} />
  </section>

  <section id="agent"><h2>A Feature Integrity &amp; Point-in-Time Agent can investigate discrepancies without changing production</h2>
    <p>A controlled agent can monitor definitions and versions, compare online and offline values, identify staleness and availability leakage, trace lineage, detect model/feature incompatibility and upstream semantic drift, compare incremental with full recomputation and find historical decisions affected by defects.</p>
    <KeyObservation title="Bounded role"><p><strong>Feature lineage + point-in-time validation + online/offline consistency + decision-impact support.</strong> It prepares evidence for model validation and engineering teams; it must not autonomously change production definitions or model decisions.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern feature definitions, validation datasets and model compatibility.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Serve versioned, freshness-aware feature vectors to decisions.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Preserve event, state, time and identity lineage beneath every feature.</Link></p></article></div>
    <p>Continue with <Link href="/resources/point-in-time-customer-state-reconstruction">Point-in-Time Customer State Reconstruction</Link>, <Link href="/resources/joint-borrowers-multiple-facilities-connected-exposures">Handling Joint Borrowers and Connected Exposures</Link>, <Link href="/resources/building-golden-customer-record-without-data-silo">Building a Golden Customer Record</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> and <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>. Streaming behavioural features, real-time utilisation and silent-schema-change detection remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>For every feature, prove that this exact value could legitimately have existed at the moment the decision was made.</strong></p></KeyObservation>
  </section>
</div>; }
