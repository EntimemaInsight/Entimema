import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./point-in-time-customer-state.module.css";

export const pointInTimeCustomerStateSections = [
  { id: "failure", label: "The historical decision" }, { id: "stack", label: "Reconstruction stack" },
  { id: "temporal", label: "Known and restated state" }, { id: "features", label: "Feature availability" },
  { id: "manifest", label: "Decision manifest" }, { id: "storage", label: "Snapshot or references" },
  { id: "joins", label: "Point-in-time joins" }, { id: "replay", label: "Deterministic replay" },
  { id: "counterfactual", label: "Counterfactual replay" }, { id: "leakage", label: "Hindsight leakage" },
  { id: "lineage", label: "Decision trace" }, { id: "freshness", label: "Freshness and fallback" },
  { id: "runtime", label: "Runtime reproducibility" }, { id: "fixture", label: "Golden replay fixture" },
  { id: "testing", label: "Replay tests" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Point-in-time architecture" }, { id: "agent", label: "Replay & Lineage Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function PointInTimeCustomerStateArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>At <code>2026-08-18 14:37:22</code>, a decision engine approved a limit increase. Today, exposure is higher, another facility exists, DPD was corrected, identity resolution changed and behavioural PD runs on version 5. None of that proves what the engine knew at 14:37:22.</p>
    <div className={styles.nowVsThen}><span><b>THEN · 14:37:22</b>identity v7 · two facilities<br/>DPD known then · PD v4</span><i>≠</i><span><b>TODAY</b>merged identity · three facilities<br/>restated DPD · PD v5</span></div>
    <Formula label="Decision-time objective"><span>Reconstruct CustomerState<sup>known</sup>(T<sub>d</sub>)</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Historical credit decisions are reproducible only when the platform can rebuild the borrower exactly as the institution knew them at decision time</strong>—including identity, relationships, financial state, feature availability, freshness and every material execution version.</p></KeyObservation>
  </section>

  <section id="stack"><h2>Decision time is the anchor for every layer</h2>
    <p>Define <strong>T<sub>d</sub></strong> as the exact decision timestamp. Current state is not historical state even when the borrower did nothing: mappings, correction knowledge, reducers and feature logic can all change.</p>
    <Formula label="Historical boundary"><span>CustomerState<sub>today</sub> ≠ CustomerState(T<sub>d</sub>)</span></Formula>
    <ResourceFigure label="The decision-reconstruction stack." caption="Every layer is selected by decision-time availability and the exact version consumed—not by the latest row in today’s system."><div className={styles.stack}>{["IDENTITY STATE @ T","RELATIONSHIP STATE @ T","FACILITY / ACCOUNT STATE @ T","PAYMENT / DPD STATE @ T","EXPOSURE STATE @ T","POINT-IN-TIME FEATURES","MODEL / POLICY / CONFIGURATION","DECISION MANIFEST","REPLAY"].map((x,i)=><span key={x}>{x}{i<8?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <p>Identity uses the resolution information known by T<sub>d</sub>. Relationships include only co-borrower, guarantor and facility links valid and known then. Facility state contains drawn, limit, undrawn, arrears, DPD and status under the historical reducer version. Exposure composes only those known facilities and edges.</p>
  </section>

  <section id="temporal"><h2>Known state replays the decision; restated state explains corrected history</h2>
    <ResourceFigure label="Known and restated state remain parallel workflows." caption="The corrected branch supports incident and counterfactual analysis. It never replaces the production record."><div className={styles.parallel}><div><b>KNOWN CUSTOMER STATE @ T</b><i>→</i><strong>ACTUAL DECISION</strong></div><div><b>RESTATED CUSTOMER STATE @ T</b><i>→</i><strong>COUNTERFACTUAL DECISION</strong></div></div></ResourceFigure>
    <Formula label="Two valid historical states"><span>S<sup>known</sup>(T<sub>d</sub>) ≠ S<sup>restated</sup>(T<sub>d</sub>)</span></Formula>
    <p>A late payment, identity merge or co-borrower correction can change what is now believed economically true. Historical replay must still use the values, relationships and versions that were available to production. Corrected state belongs in a separately labelled comparison.</p>
  </section>

  <section id="features"><h2>A feature must have been available—not merely effective</h2>
    <p>A feature can summarise data through 13:00 but become available only at 14:00. A 13:30 decision cannot consume it. Effective time describes the world; availability time describes the institution’s knowledge.</p>
    <Formula label="Point-in-time eligibility"><span>AvailableAsOf(X) ≤ T<sub>d</sub></span></Formula>
    {code(`type PointInTimeFeature<T> = {
  value: T;
  effectiveAsOf: Date;
  availableAsOf: Date;
  calculatedAt: Date;
  featureVersion: string;
};`)}
    <p>A latest-value-only feature store cannot reproduce decisions. Historical online and offline retrieval must agree for the same available event set and feature definition:</p>
    <Formula label="Training-serving integrity"><span>Feature<sup>online</sup>(T) = Feature<sup>offline-known</sup>(T)</span></Formula>
  </section>

  <section id="manifest"><h2>The decision manifest binds state, versions and outcome</h2>
    {code(`type DecisionManifest = {
  decisionId: string;
  decisionTime: Date;
  partyId: string;
  identityResolutionVersion: string;
  relationshipStateVersion: string;
  facilityStateRefs: string[];
  featureSnapshotId: string;
  modelVersion: string;
  policyVersion: string;
  configurationVersion: string;
  decisionEngineBuild: string;
  outcome: string;
};`)}
    <ResourceFigure label="A manifest resolves one exact execution context." caption="Versions are material only when they can change output; meaningless version proliferation creates noise, not reproducibility."><div className={styles.manifest}><div><span>IDENTITY VERSION</span><span>STATE REFERENCES</span><span>FEATURE SNAPSHOT</span><span>MODEL VERSION</span><span>POLICY + BUILD</span></div><b>→</b><strong>STORED DECISION</strong></div></ResourceFigure>
    {code(`{
  "decisionEngineBuild": "2026.08.18.3",
  "identityVersion": "identity-v7",
  "customerProjectionVersion": "customer-state-v4",
  "featureSetVersion": "behavioural-features-v11",
  "modelVersion": "pd-v5.2",
  "policyVersion": "limit-strategy-v9"
}`)}
  </section>

  <section id="storage"><h2>Choose immutable payloads, versioned references or a deliberate hybrid</h2>
    <ResourceTable caption="Decision-input preservation patterns" headers={["Pattern","Strength","Cost / condition"]} rows={[
      ["Full input snapshot","Straightforward replay and strong audit evidence","Storage, sensitive-data duplication and schema evolution"],
      ["Reference manifest","Lower duplication and centralised state","Every referenced historical version must remain immutable and queryable"],
      ["Hybrid","Critical scalars plus references to larger state","Requires a clear boundary and referential integrity"],
    ]} />
    <p>Store <code>Hash(InputPayload)</code> to verify equality, never as a replacement for preserved inputs. Minimise PII through canonical references and controlled encrypted snapshots. Retention follows audit, validation and product obligations; do not delete lineage while decisions can still be challenged.</p>
  </section>

  <section id="joins"><h2>Historical joins use both valid time and system time</h2>
    {code(`SELECT ...
FROM decisions d
JOIN party_relationship_history r
  ON r.party_id = d.party_id
 AND r.valid_from <= d.decision_time
 AND (r.valid_to IS NULL OR r.valid_to > d.decision_time)
 AND r.system_from <= d.decision_time
 AND (r.system_to IS NULL OR r.system_to > d.decision_time);`)}
    <p>Valid time selects the relationship economically applicable at T<sub>d</sub>; system time prevents later corrections from leaking backward. Dialects differ, but a join to the current customer master is never an equivalent substitute.</p>
    <Formula label="Snapshot and tail replay"><span>State(T<sub>d</sub>) = Snapshot<sub>k</sub> + Events<sub>k+1:Td</sub></span></Formula>
    <p>For performance, reconstruct from a temporal snapshot plus later available events. The snapshot must declare effective horizon, knowledge horizon and reducer version. A snapshot labelled only “as of date” is ambiguous.</p>
  </section>

  <section id="replay"><h2>Replay executes the original decision function with the original context</h2>
    <Formula label="Deterministic decision"><span>D = F(CustomerState, Features, Model, Policy, Configuration)</span></Formula>
    {code(`async function replayDecision(
  manifest: DecisionManifest
): Promise<DecisionResult> {
  const state = await reconstructCustomerKnownState(manifest);
  const features = await featureStore.loadSnapshot(
    manifest.featureSnapshotId
  );
  const model = await modelRegistry.load(manifest.modelVersion);
  const policy = await policyRegistry.load(manifest.policyVersion);

  return runDecision({ state, features, model, policy });
}`)}
    <p>The sketch omits configuration and runtime wiring for readability. Production replay must preserve deterministic rule order and the strategy graph—not just which rules fired. External bureau or SaaS responses require an immutable response ID, received time and schema version; today’s endpoint cannot recreate yesterday’s response.</p>
  </section>

  <section id="counterfactual"><h2>Historical replay and counterfactual replay answer different questions</h2>
    <div className={styles.replayTypes}><article><b>HISTORICAL REPLAY</b><p>Original known state + features + model + policy. Goal: reproduce the actual outcome.</p></article><article><b>COUNTERFACTUAL REPLAY</b><p>Change corrected state, model, policy or freshness. Goal: ask what would have happened.</p></article></div>
    <p>Change one component at a time where possible. Hold state, features and policy constant to isolate a model change; hold model and policy constant to quantify a late-data incident.</p>
    <Formula label="Decision transition"><span>ΔD = D<sup>counterfactual</sup> − D<sup>actual</sup></span></Formula>
    <p>State, feature, model and policy effects can interact; do not pretend their attribution is always additively separable. Preserve the actual decision as immutable evidence.</p>
  </section>

  <section id="leakage"><h2>Corrected historical data can create hindsight leakage</h2>
    <ResourceTable caption="Subtle point-in-time leakage paths" headers={["Leakage","Mechanism","Control"]} rows={[
      ["Payment correction","Warehouse backdates a later-known payment to economic date","Filter by availability time"],
      ["Identity leakage","Later merge consolidates old exposure","Use identity mapping known at scoring"],
      ["Relationship leakage","Later co-borrower edge changes historical obligations","Use bitemporal relationship state"],
      ["Policy leakage","Today’s strategy reclassifies old decisions","Retain original policy and label counterfactuals"],
      ["Training-serving skew","Code, freshness, nulls or mappings differ online/offline","Compare identical state and feature versions"],
    ]} />
    <KeyObservation title="Model-validation test"><p><strong>Did the model perform on information actually available at scoring time?</strong> Today’s cleaned historical database answers a different—and usually easier—question.</p></KeyObservation>
  </section>

  <section id="lineage"><h2>Engineering explainability traces the input state, not only the model score</h2>
    <div className={styles.trace}>{["DECISION","MODEL + POLICY","FEATURE SNAPSHOT","CUSTOMER STATE","FACILITY STATE","EVENTS / SOURCES"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    {code(`type DecisionTrace = {
  decisionId: string;
  inputManifest: DecisionManifest;
  modelScore?: number;
  ruleHits: string[];
  finalOutcome: string;
};`)}
    <p>A feature-importance explanation is incomplete if the value itself cannot be traced to its source, time and definition. Record rule hits without exposing sensitive rule text, plus the deterministic strategy version and evaluation sequence.</p>
  </section>

  <section id="freshness"><h2>Freshness and fallback are part of the historical policy path</h2>
    {code(`{
  "exposureEffectiveAsOf": "2026-08-18T14:35:00Z",
  "dpdEffectiveAsOf": "2026-08-18T14:30:00Z",
  "behaviouralPdCalculatedAt": "2026-08-18T06:00:00Z"
}`)}
    <Formula label="Freshness budget"><span>Age(Input<sub>k</sub>) ≤ AllowedAge<sub>D,k</sub></span></Formula>
    <p>If an input is stale, retain the stale condition, the fallback or review branch used and that fallback’s configuration version. Hiding staleness makes a decision look reproducible while omitting why the engine followed a different path.</p>
  </section>

  <section id="runtime"><h2>Preserve only runtime details that can change output</h2>
    <p>Exact replay may require the engine build, model artefact, policy graph, feature-definition code, schemas and material dependency versions. For a non-deterministic component, preserve the seed, model snapshot and input/output record; deterministic core credit logic remains preferable where appropriate.</p>
    <p>Current-state caches can serve live traffic, but an expired cache cannot be the historical system. Use durable temporal stores, indexed snapshots and tail replay. Optimised replay and full event reconstruction must agree.</p>
    <Formula label="Replay implementation invariant"><span>Replay<sup>snapshot+tail</sup>(T) = Replay<sup>full events</sup>(T)</span></Formula>
  </section>

  <section id="fixture"><h2>A golden decision fixture makes reproducibility executable</h2>
    <ResourceTable caption="Entimema golden decision replay fixture" headers={["Layer","Fixture state"]} rows={[
      ["Party","P1 under identity resolution v7"], ["Facilities","F1 term loan; F2 revolving line"],
      ["Events","Known payments and limit changes through T"], ["Relationships","P1 primary borrower under relationship v4"],
      ["Features","Immutable behavioural feature snapshot v11"], ["Execution","PD model v5.2; limit policy v9; engine build 2026.08.18.3"],
      ["Expected","Exact customer inputs, score, rule path and approved limit outcome"],
    ]} />
    <p>The fixture is broader than a single event stream: it fixes identity, relationships, state, features and execution versions together. A controlled golden portfolio should also cover a joint borrower, late payment, identity correction, stale feature and fallback path.</p>
  </section>

  <section id="testing"><h2>Test inputs and outcome—matching decisions can hide compensating bugs</h2>
    <ResourceTable caption="Point-in-time replay test suite" headers={["Test","Expected proof"]} rows={[
      ["Replay equality","Replayed deterministic outcome equals stored outcome"], ["State equality","Every critical reconstructed input equals the stored snapshot or hash"],
      ["Identity version","Using current mapping creates a visible mismatch"], ["Late payment","Known replay stays fixed; restated counterfactual may change"],
      ["Relationship correction","Later co-borrower never enters original replay"], ["Feature availability","Corrected offline feature is rejected when unavailable at T"],
      ["Policy version","Original policy reproduces; new policy is labelled counterfactual"], ["Build version","Engine-code changes remain distinguishable from model changes"],
      ["Missing input","No silent substitution with today’s value"], ["Replay implementation","Snapshot+tail equals full event reconstruction"],
    ]} />
    <p>Classify legacy evidence as <strong>exact</strong>, <strong>reconstructed with assumptions</strong> or <strong>unreproducible</strong>. Never fake precision when lineage is incomplete. Run fixed replay cases in CI after feature, state-engine, identity and policy-engine changes; only reviewed differences pass.</p>
  </section>

  <section id="observability"><h2>Reproducibility is a production control, not a one-off audit</h2>
    <div className={styles.metrics}>{["ReplaySuccessRate","InputManifestCompleteness","HistoricalStateReconstructionFailureRate","StaleInputDecisionRate","KnownVsRestatedDecisionDifferenceRate","ReplayRegressionRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal thresholds apply. A replay diff should show decision ID, stored and replayed outcomes, changed inputs, changed versions and reason. If a previously reproducible sample fails after an infrastructure release, investigate before trusting new historical analysis.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture turns historical decisions into reproducible evidence</h2>
    <ResourceFigure label="Entimema point-in-time customer state architecture." caption="The exact decision timestamp selects known identity, relationships, financial state and features before immutable execution versions produce the manifest and replay evidence."><div className={styles.stack}>{["DECISION TIME","IDENTITY RESOLUTION @ T","RELATIONSHIPS @ T","FACILITY / ACCOUNT STATE @ T","DPD / EXPOSURE @ T","POINT-IN-TIME FEATURES","MODEL + POLICY + CONFIGURATION","DECISION MANIFEST","STORED DECISION","REPLAY / COUNTERFACTUAL ANALYSIS"].map((x,i)=><span key={x}>{x}{i<9?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Reconstruct → Reproduce → Compare → Validate → Monitor" steps={["Anchor decision time", "Resolve identity at T", "Resolve relationships at T", "Reconstruct facility state", "Derive exposure and DPD", "Load available features", "Load execution versions", "Execute", "Compare stored decision", "Explain differences"]} />
  </section>

  <section id="agent"><h2>A Decision Replay &amp; Lineage Agent can assemble evidence without rewriting history</h2>
    <p>A controlled agent can reconstruct historical customer state, resolve identity and relationship versions, retrieve known financial state and exact feature snapshots, identify model/policy/configuration versions, replay decisions, compare known and restated outcomes, detect hindsight leakage and surface missing lineage.</p>
    <KeyObservation title="Bounded role"><p><strong>Decision reproducibility + historical-state reconstruction + lineage validation + counterfactual analysis.</strong> It prepares evidence for model validation, audit and incident review; it must never overwrite historical production decisions.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Version decision state, strategies, fallbacks and rule paths.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Validate models on information available at scoring time.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Preserve bitemporal identity, relationships, events and feature lineage.</Link></p></article></div>
    <p>Continue with <Link href="/resources/joint-borrowers-multiple-facilities-connected-exposures">Handling Joint Borrowers and Connected Exposures</Link>, <Link href="/resources/building-golden-customer-record-without-data-silo">Building a Golden Customer Record</Link>, <Link href="/resources/why-customer-id-is-not-enough-entity-resolution-lending">Why Customer ID Is Not Enough</Link>, <Link href="/resources/customer-facility-account-exposure-credit-data-model">Customer, Facility, Account and Exposure</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link> and <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>. A time-respecting feature store, event-driven risk architecture and model/policy replay remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Prove what the decision engine knew, which versions it used and why it produced that outcome at that exact historical moment.</strong></p></KeyObservation>
  </section>
</div>; }
