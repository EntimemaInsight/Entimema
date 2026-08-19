import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./semantic-data-contracts.module.css";

export const semanticDataContractsSections = [
  { id: "failure", label: "The silent semantic break" }, { id: "contracts", label: "Two contract layers" },
  { id: "drift", label: "Drift taxonomy" }, { id: "registry", label: "Contract registry" },
  { id: "lineage", label: "Dependency lineage" }, { id: "adapter", label: "Versioned adapters" },
  { id: "shadow", label: "Shadow and canary" }, { id: "runtime", label: "Runtime detection" },
  { id: "history", label: "Historical semantics" }, { id: "testing", label: "Golden semantic tests" },
  { id: "incident", label: "Incident impact" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Semantic contract architecture" }, { id: "agent", label: "Semantic Drift Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function SemanticDataContractsArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>Yesterday, <code>payment_status = 1</code> meant SETTLED and 2 meant REVERSED. Today, the producer reuses 1 for AUTHORISED, 2 for SETTLED and adds 3 for REVERSED. The field remains INTEGER. Parsing succeeds. <code>SettledPaymentCount_30d</code> now counts authorisations.</p>
    <div className={styles.failure}><article><b>YESTERDAY</b><span>1 = SETTLED</span><span>2 = REVERSED</span></article><i>same INTEGER field</i><article><b>TODAY</b><span>1 = AUTHORISED</span><span>2 = SETTLED</span><span>3 = REVERSED</span></article><strong>PIPELINE: GREEN<br/>RISK MEANING: WRONG</strong></div>
    <Formula label="Foundational boundary"><span>SchemaValid ≠ SemanticValid</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>The most dangerous upstream change often preserves the schema while silently changing meaning.</strong> Risk infrastructure needs semantic contracts, not only syntactic validation.</p></KeyObservation>
  </section>

  <section id="contracts"><h2>A complete contract governs structure and economic interpretation</h2>
    <ResourceTable caption="Two contract layers" headers={["Layer","Defines","Examples"]} rows={[
      ["Syntactic","Fields, types, required/optional, enum shape, nullability and structure","amount DECIMAL; payment_status required"],
      ["Semantic","Economic meaning, units, time basis, scope, ownership and version","minor units; settled time; principal-only balance"],
    ]} />
    {code(`type SemanticContract = {
  field: string;
  meaning: string;
  unit?: string;
  timeBasis?: string;
  owner: string;
  version: string;
};`)}
    <p>Ask what <code>status=1</code> means, whether amount is gross or net, whether time is UTC or local, whether balance includes pending and whether payment date means initiated or settled. Schema validation cannot answer these questions.</p>
  </section>

  <section id="drift"><h2>Silent drift has six forms that demand different evidence</h2>
    <ResourceFigure label="Entimema contract-drift taxonomy." caption="The first five can arise from infrastructure or source change; behavioural drift reflects genuine customer behaviour. Distribution movement alone cannot distinguish them."><div className={styles.taxonomy}>{[["STRUCTURAL","shape · type · required fields"],["SEMANTIC","meaning · units · sign · time basis"],["POPULATION","which records are emitted"],["IDENTITY","keys · mapping coverage"],["FRESHNESS","when evidence arrives"],["BEHAVIOURAL","borrowers actually changed"]].map(([a,b])=><span key={a}><b>{a}</b>{b}</span>)}</div></ResourceFigure>
    <ResourceTable caption="High-impact semantic drift examples" headers={["Drift","Same technical shape","Economic failure"]} rows={[
      ["Unit","amount = 500","€500 becomes 500 cents / €5"], ["Scale","utilisation numeric","0.72 becomes 72"],
      ["Null meaning","NULL","Unavailable becomes not applicable"], ["Timestamp","timestamp","Settlement time becomes processing time"],
      ["Timezone","parseable timestamp","UTC becomes local without offset"], ["Sign","numeric amount","Signed reversal becomes positive amount + type"],
      ["Scope","balance numeric","Principal-only becomes principal + interest + fees"], ["Aggregation","amount numeric","Transaction row becomes daily aggregate"],
    ]} />
    <p>Unknown enums must not silently become OTHER when distinctions affect models. Date rounding can leak same-day information; join-key formatting such as <code>001234 → 1234</code> can collapse identity coverage without breaking a type.</p>
  </section>

  <section id="registry"><h2>The registry gives every critical source technical and domain ownership</h2>
    {code(`type DataContract = {
  source: string;
  object: string;
  version: string;
  schema: SchemaDefinition;
  semantics: SemanticDefinition[];
  owner: string;
};`)}
    <p>The producer declares schema version, semantic version and change type where possible. Consumers declare exactly which fields and interpretations they depend on. Technical owners understand format; domain owners establish economic meaning.</p>
    <ResourceTable caption="Contract change classification" headers={["Class","Example","Governance"]} rows={[
      ["Additive compatible","Unused optional field","Proportional validation; usually non-blocking"], ["Syntactic breaking","INTEGER → STRING","Explicit adapter/consumer change"],
      ["Semantic breaking","payment_date redefined","Versioned semantic review and impact assessment"], ["Behavioural breaking","Upstream filter changes emitted population","Shadow distributions, features and decisions"],
    ]} />
    <p>Use meaningful <code>schemaVersion</code> and <code>semanticVersion</code>; do not over-version irrelevant metadata. Compatibility is a producer/consumer matrix, not a label attached only to the producer.</p>
  </section>

  <section id="lineage"><h2>Field-to-decision lineage turns a source change into a measurable blast radius</h2>
    <ResourceFigure label="Impact lineage from source semantics to customer decision." caption="Consumer contracts state the path explicitly so incident scope and release risk can be traced before or after a change."><div className={styles.lineage}>{["SOURCE FIELD · payment_status","CANONICAL FIELD · settled_payment_flag","FEATURE · payment_count_30d","MODEL · behavioural PD","DECISION · EWS / collections"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <p>Each feature value records its source-contract version, canonical mapping version and feature-definition version. Training dataset manifests retain contract versions; otherwise historical reproduction silently uses today&apos;s semantics.</p>
  </section>

  <section id="adapter"><h2>Versioned adapters absorb source churn without hiding real semantic change</h2>
    <Formula label="Adapter proof obligation"><span>Source<sub>v</sub> → Canonical<sub>v</sub> preserves defined economic meaning</span></Formula>
    <p>A source rename should require only an adapter change while canonical output stays stable. If economic meaning truly changes, version the canonical contract rather than conceal it inside mapping logic.</p>
    {code(`type SourceChangeManifest = {
  source: string;
  changeVersion: string;
  expectedChanges: string[];
  effectiveAt: Date;
};`)}
    <p>During a transition window, process explicit message versions; do not infer them from payload guesses. An unsupported version is quarantined or fails controlled for decision-critical data. Keep the prior adapter available for rollback without deleting received raw events.</p>
  </section>

  <section id="shadow"><h2>Shadow and canary validation must reach the decision layer</h2>
    <div className={styles.shadow}><span>OLD ADAPTER / CONTRACT</span><b>↘</b><strong>SAME SOURCE RECORDS</strong><b>↗</b><span>NEW ADAPTER / CONTRACT</span></div>
    <ResourceTable caption="Decision-safe comparison stack" headers={["Layer","Compare"]} rows={[
      ["Canonical","Event type, amount, identity, effective/available timestamps"], ["Feature","Entity-level values and distributions"],
      ["Model","Score/band deltas under the same model"], ["Decision","Outcome and action transitions by materiality"],
    ]} />
    <Formula label="Feature impact"><span>ΔX = X<sub>new source</sub> − X<sub>old source</sub></span></Formula>
    <Formula label="Decision impact rate"><span>ChangedDecisions / ComparedDecisions</span></Formula>
    <p>Small feature changes can cross policy boundaries, so feature stability does not guarantee decision stability. Before release: contract tests pass, canonical and feature diffs are understood, decision impact is reviewed and rollback is executable. Canary a controlled sample before full cutover.</p>
  </section>

  <section id="runtime"><h2>Runtime sentinels catch unannounced source changes</h2>
    <ResourceTable caption="Runtime semantic detection" headers={["Signal","Possible break"]} rows={[
      ["Unknown enum appears","Unannounced code/version change"], ["Amounts become 100× smaller","Unit change"],
      ["Received−event time shifts exactly one hour","Timezone/DST interpretation"], ["Null rate 1% → 45%","Producer or population failure"],
      ["Category cardinality changes","Enum/filter drift"], ["MappingCoverage falls","Join-key/identity drift"],
      ["Row volume collapses/spikes","Extraction/filter change or genuine seasonality"], ["Freshness deteriorates","Cadence/latency contract broken"],
    ]} />
    <Formula label="Mapping coverage"><span>MappingCoverage = MappedRecords / TotalRecords</span></Formula>
    <p>Use domain-valid ranges and economic invariants such as reversal amount ≤ original amount or Available = Limit − Drawn − Pending under defined semantics. Distribution shifts are signals, not automatic proof: compare change context and borrower behaviour.</p>
    <KeyObservation title="Technical green, semantic red"><p><strong>The pipeline can be syntactically healthy while the risk system is semantically broken.</strong></p></KeyObservation>
  </section>

  <section id="history"><h2>Historical data must retain the semantics effective at the time</h2>
    <p>A contract change needs <code>effective_from</code>. To rebuild an old feature or decision, load the historical source/canonical interpretation; applying today&apos;s adapter to old raw data can rewrite meaning.</p>
    <ResourceTable caption="Historical change semantics" headers={["Change","Historical treatment"]} rows={[
      ["Source correction","Old data were wrong; preserve original and versioned restatement"], ["Source redefinition","Meaning changes prospectively from effective date"],
      ["Backfill under new semantics","Label state mode/version; never overwrite decision input history"], ["Rollback after bad adapter","Replay durable raw data through corrected adapter into new projection"],
    ]} />
  </section>

  <section id="testing"><h2>Golden semantic cases and mutation tests attack meaning, not only shape</h2>
    <ResourceTable caption="Golden contract dataset" headers={["Case","Input","Expected proof"]} rows={[
      ["A","€500 payment in declared minor units","Canonical amount and currency fixed"], ["B","Causally linked reversal","Sign and original reference preserved"],
      ["C","UTC timestamp","Effective ordering unchanged"], ["D","Unknown enum","Governed quarantine/failure, never silent coercion"],
      ["E","Missing identifier","Mapping failure visible; affected record not misjoined"],
    ]} />
    <ResourceTable caption="Contract mutation testing" headers={["Mutation","Detection"]} rows={[
      ["Multiply amount by 100","Unit invariant/sentinel fails"], ["Shift timezone","Timestamp-lag and ordering tests fail"],
      ["Swap status mapping","Golden semantic output and feature diff fail"], ["Flip sign convention","Financial-state invariant fails"],
      ["Increase nulls","Null contract and runtime rate fail"], ["Add unsupported version","Controlled quarantine/failure"],
    ]} />
    <p>Run old and new adapters through the full feature and decision pipeline. Only changes declared in the change manifest should differ.</p>
  </section>

  <section id="incident"><h2>Semantic incidents require end-to-end scope and decision revalidation</h2>
    <p>Determine the interval from semantic change to detection, then use dependency lineage to identify affected raw records, canonical events, features, scores, decisions and actions.</p>
    <div className={styles.impact}>{["SOURCE RECORDS","CANONICAL EVENTS","FEATURE VALUES","MODEL SCORES","DECISIONS","ACTIONS"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <p>Reconstruct corrected features/state and compare actual with corrected decisions. Preserve historical outcomes and route remediation through governance rather than overwriting them automatically.</p>
  </section>

  <section id="observability"><h2>Monitor contracts in economic units and decision outcomes</h2>
    <div className={styles.metrics}>{["ContractViolationRate","UnknownEnumRate","NullRateShift","MappingCoverage","SemanticSentinelDrift","FeatureDiffRate","DecisionImpactRate","UnsupportedVersionRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Also monitor payment totals, exposure, utilisation, reversal ratios and DPD transitions. These business measures reveal failures that parser success, schema registries and infrastructure uptime cannot.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture gates source change by decision impact</h2>
    <ResourceFigure label="Entimema semantic data-contract architecture." caption="Versioned adapters stabilise canonical meaning while a parallel control path tests compatibility, compares features and decisions, gates release and monitors unannounced drift."><div className={styles.architecture}><div>{["SOURCE SYSTEM","SCHEMA + SEMANTIC CONTRACT","VERSIONED ADAPTER","CANONICAL DATA / EVENTS","FEATURE PIPELINE","MODEL","DECISION"].map((x,i)=><span key={x}>{x}{i<6?<b>↓</b>:null}</span>)}</div><i>CONTROL PATH</i><div>{["CONTRACT TESTS","SHADOW COMPARISON","FEATURE DIFF","DECISION DIFF","RELEASE GATE / RUNTIME MONITORING"].map((x,i)=><span key={x}>{x}{i<4?<b>↓</b>:null}</span>)}</div></div></ResourceFigure>
    <EntimemaFramework title="Detect → Compare → Assess → Gate → Monitor" steps={["Define source contract", "Define semantic meaning", "Version changes", "Test compatibility", "Run shadow adapter", "Compare canonical outputs", "Compare features", "Measure decision impact", "Gate release", "Monitor runtime drift", "Roll back and replay if needed"]} />
  </section>

  <section id="agent"><h2>A Data Contract &amp; Semantic Drift Agent can trace silent change without approving it</h2>
    <p>A controlled agent can monitor versions, unknown fields and enums, null/cardinality/unit anomalies, compare contract versions, trace source fields to affected models, run feature comparisons, quantify decision impact and identify historical decisions affected by semantic defects.</p>
    <KeyObservation title="Bounded role"><p><strong>Data-contract observability + semantic-drift detection + feature/model impact tracing + change-control support.</strong> It prepares evidence for data, risk and validation teams; it must not autonomously approve production source changes.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Version source semantics, adapters and canonical lineage.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Assess feature, model and portfolio impact.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Gate production changes through decision comparison.</Link></p></article></div>
    <p>Continue with <Link href="/resources/backpressure-failure-recovery-financial-event-pipelines">Backpressure and Failure Recovery</Link>, <Link href="/resources/batch-etl-event-driven-credit-risk-architecture">From Batch ETL to Event-Driven Credit Risk Architecture</Link>, <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store</Link>, <Link href="/resources/point-in-time-correct-features-credit-models">Point-in-Time Correct Features</Link>, <Link href="/resources/streaming-behavioural-features-early-warning">Streaming Behavioural Features</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link> and <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>. Infrastructure feature drift and decision-system observability remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Detect whether an upstream change altered economic meaning, quantify its decision impact and contain it before customers are affected.</strong></p></KeyObservation>
  </section>
</div>; }
