import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./golden-customer-state.module.css";

export const goldenCustomerStateSections = [
  { id: "failure", label: "The golden-table failure" }, { id: "authority", label: "Field-level authority" },
  { id: "foundation", label: "Canonical foundation" }, { id: "projections", label: "Decision projections" },
  { id: "freshness", label: "Freshness vector" }, { id: "temporal", label: "Known and restated state" },
  { id: "service", label: "State service and read model" }, { id: "conflicts", label: "Conflict resolution" },
  { id: "derived", label: "Derived metrics and lineage" }, { id: "versions", label: "State version manifest" },
  { id: "dependencies", label: "Dependencies and cache" }, { id: "reconciliation", label: "Rebuild and reconciliation" },
  { id: "testing", label: "Golden-state tests" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Golden customer architecture" }, { id: "agent", label: "Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function GoldenCustomerStateArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>CRM, core lending, cards, payments, collections and accounting all hold part of a customer&apos;s state. A transformation programme copies name, phone, balances, limits, risk and delinquency into <code>GOLDEN_CUSTOMER</code>. For a few months, the table looks elegant.</p>
    <div className={styles.failureFlow}>{["CRM\nphone changes", "SERVICING\nbalance moves", "PSP\npayment settles", "RISK\nscore refreshes", "COLLECTIONS\ncase changes"].map(x=><span key={x}>{x}</span>)}<b>→</b><strong>ONE MORE SNAPSHOT<br/>ONE MORE REFRESH SCHEDULE</strong></div>
    <p>The institution has not removed fragmentation. It has created another copy of it—one that can remain available while returning plausible, stale state.</p>
    <Formula label="The golden-record fallacy"><span>GoldenRecord ≠ OnePhysicalRow</span></Formula>
    <Formula label="Coherence boundary"><span>SingleTruth ≠ SingleDatabase</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>A golden customer record should not become another database claiming to be the single truth.</strong> It should be a governed semantic and lineage layer that knows which source owns each fact, how state was composed, how fresh each component is and which version was available at decision time.</p></KeyObservation>
  </section>

  <section id="authority"><h2>Authority belongs to fields and domains—not to whichever system displays the value</h2>
    <p>Define <strong>Authority(field)</strong>, not <strong>Authority(all customer data) = System X</strong>. A CRM does not own loan balance because it displays a copy; a risk platform does not own legal name because its feature store carries one.</p>
    <ResourceTable caption="Illustrative field-level authority matrix—not a prescription of systems" headers={["Domain","Example fact","Authoritative domain"]} rows={[
      ["Identity","Verified legal identity","Identity / customer master"], ["Contact","Current phone or email","CRM / customer service"],
      ["Facility","Contractual limit","Lending / servicing"], ["Payment","Settled payment","Payment layer"],
      ["Accounting","Posted receivable","Ledger"], ["Risk","Behavioural PD","Risk platform"], ["Collections","Case status","Collections platform"],
    ]} />
    <ResourceFigure label="Authority flows from an owning domain to replicas and consumers." caption="A replica can serve an operational query without becoming authoritative. Provenance survives temporary source unavailability."><div className={styles.authorityDiagram}><span>FACT</span><b>→</b><strong>OWNING DOMAIN</strong><b>→</b><div><span>CACHE</span><span>READ MODEL</span><span>CONSUMER</span></div></div></ResourceFigure>
    {code(`type GovernedValue<T> = {
  value: T;
  sourceSystem: string;
  effectiveAsOf: Date;
  availableAsOf: Date;
  observedAt?: Date;
  qualityStatus: string;
};`)}
    <p>This envelope need not leak into every application DTO. It must exist where governance, replay and evidence require it.</p>
  </section>

  <section id="foundation"><h2>Anchor domains to a canonical party; keep economic objects explicit</h2>
    <Formula label="Customer state composition"><span>CustomerState(T) = Compose(Identity, Relationships, Facilities, Accounts, Payments, Risk, Collections)</span></Formula>
    <p>The canonical <code>partyId</code> is a stable anchor. Relationships, roles, facilities, accounts, guarantees, events and state remain separate objects linked to it. They are not scalar columns waiting to be flattened into a 500-field customer row.</p>
    <div className={styles.foundation}>{["PARTY", "RELATIONSHIP", "FACILITY", "ACCOUNT", "EVENT", "STATE"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <p>This normalised foundation follows economic semantics and update ownership. Source records and canonical mappings are durable evidence; caches and projections are disposable products of that evidence.</p>
  </section>

  <section id="projections"><h2>One governed foundation should produce several decision-specific views</h2>
    <ResourceFigure label="One canonical foundation, several replaceable decision views." caption="A view contains only the identity, financial and risk state needed by its consumer; it does not acquire authority over its inputs."><div className={styles.projectionDiagram}><strong>CANONICAL GOVERNED FOUNDATION</strong><b>↓</b><div><span>UNDERWRITING<br/><small>identity · affordability · exposure</small></span><span>BEHAVIOURAL RISK<br/><small>balances · utilisation · DPD</small></span><span>COLLECTIONS<br/><small>delinquency · payments · contact</small></span><span>FINANCE<br/><small>counterparty · posted balances</small></span></div></div></ResourceFigure>
    <KeyObservation title="One foundation, many views"><p><strong>The objective is not one customer record for every decision.</strong> It is one governed customer foundation from which each decision can derive the right view.</p></KeyObservation>
    {code(`type CurrentCustomerCreditView = {
  partyId: string;
  totalDrawnMinor: bigint;
  totalCommittedMinor: bigint;
  maxDpd: number;
  behaviouralPd?: number;
  lastPaymentAt?: Date;
  generatedAt: Date;
};`)}
    <p>Every field above is derived or referenced. A materialised SQL view, cached API response or warehouse table may make it fast; materialisation does not turn it into source truth. If corrupted, discard and rebuild it.</p>
  </section>

  <section id="freshness"><h2>A generated timestamp hides the freshness that matters</h2>
    <p>A projection generated at 16:00 can contain exposure as of 15:59, behavioural PD as of 06:00, bureau data from yesterday and verified income from last month. That may be valid for one decision and unacceptable for another—but only if the difference is explicit.</p>
    <div className={styles.freshness}>{[["EXPOSURE","15:59"],["PAYMENTS","15:58"],["RISK","06:00"],["BUREAU","YESTERDAY"],["INCOME","LAST MONTH"]].map(([a,b])=><span key={a}><b>{a}</b>{b}</span>)}</div>
    <Formula label="Component freshness"><span>Freshness(CustomerView) = (F<sub>exposure</sub>, F<sub>payments</sub>, F<sub>bureau</sub>, F<sub>risk</sub>)</span></Formula>
    <Formula label="Decision-specific bound"><span>DecisionFreshness<sub>D</sub> = min(Freshness<sub>critical components</sub>)</span></Formula>
    <p>Define <code>RequiredFreshness(field, decision)</code>. Collections may require current payment and DPD state; a periodic ECL process may accept a controlled snapshot. Mixed cadence is architecture to govern, not a defect to disguise behind one timestamp.</p>
  </section>

  <section id="temporal"><h2>The golden layer must distinguish what was known from what is now restated</h2>
    <div className={styles.temporal}><span>DECISION AT T<br/><b>facts available by T</b></span><i>later correction or identity merge</i><span>ANALYSIS FOR T<br/><b>corrected economic history</b></span></div>
    <Formula label="Two legitimate histories"><span>CustomerState<sup>known</sup>(T) ≠ CustomerState<sup>restated</sup>(T)</span></Formula>
    <p>Known state uses only relationships known at T, facts available at T and risk scores generated by T. Restated state reconstructs corrected economic history for reconciliation, incidents and retrospective analysis. A current golden view must never leak a future identity merge or backdated correction into historical decision replay.</p>
    <p>SCD Type 2 can preserve value validity, but not necessarily when a late correction or identity resolution became known. Use bitemporal effective and availability semantics where decision reproducibility justifies them.</p>
  </section>

  <section id="service"><h2>Compose through a state service; materialise where latency demands it</h2>
    {code(`interface CustomerStateService {
  getCurrent(partyId: string): Promise<CustomerState>;
  getKnownState(partyId: string, asOf: Date): Promise<CustomerState>;
  getRestatedState(partyId: string, asOf: Date): Promise<CustomerState>;
}`)}
    <p>The service can compose identity, facility, payment, risk and collections domains live. Yet synchronous fan-out couples latency and availability. For high-volume decisions, keep write domains authoritative and serve cross-domain queries from an event-fed customer read model.</p>
    <div className={styles.eventFlow}><span>DOMAIN EVENTS</span><b>→</b><span>PROJECTION BUILDER</span><b>→</b><span>DECISION READ MODEL</span></div>
    {code(`async function onFacilityStateChanged(event: FacilityStateChanged) {
  await customerProjection.refreshFacility(
    event.partyId,
    event.facilityId
  );
}`)}
    <p>Illustrative events such as <code>FACILITY_OPENED</code>, <code>PAYMENT_SETTLED</code>, <code>DPD_CHANGED</code> and <code>BEHAVIOURAL_PD_UPDATED</code> drive targeted updates. Incremental speed must coexist with a deterministic full rebuild.</p>
  </section>

  <section id="conflicts"><h2>Newest is not truth: resolve conflicts through explicit authority</h2>
    <p>If CRM says phone A and collections says phone B, <code>MAX(updated_at)</code> is not governance. A recently copied wrong value can have a newer timestamp than its authoritative source.</p>
    <Formula label="Conflict principle"><span>Newest ≠ Truth</span></Formula>
    <ResourceFigure label="Conflict resolution retains candidates, rules and uncertainty." caption="Temporal validity and quality qualify authority. Where evidence remains unsafe, the governed answer is unresolved—not invented certainty."><div className={styles.conflictFlow}>{["CANDIDATE VALUES","AUTHORITY RULES","TEMPORAL VALIDITY","QUALITY STATUS","GOVERNED VALUE"].map((x,i)=><span key={x}>{x}{i<4?<b>→</b>:null}</span>)}</div></ResourceFigure>
    {code(`type FieldAuthorityRule = {
  field: string;
  preferredDomains: string[];
};`)}
    <p>Centralise legitimate precedence rather than scattering it through application code. A conflict may resolve to <code>qualityStatus = UNRESOLVED</code>. Material workflows can refer, use an approved fallback or delay action according to governance; there is no universal credit policy.</p>
  </section>

  <section id="derived"><h2>Derived values earn authority through definition, version and inputs</h2>
    {code(`type DerivedMetric<T> = {
  value: T;
  calculationVersion: string;
  effectiveAsOf: Date;
  calculatedAt: Date;
  inputRefs: string[];
};`)}
    <Formula label="Customer exposure"><span>TotalExposure(T) = Aggregate(CanonicalFacilityStates(T))</span></Formula>
    <Formula label="Delinquency projection"><span>MaxDPD(T) = max<sub>j</sub> DPD<sub>j</sub>(T)</span></Formula>
    <p>Facility-level state remains the evidence. Behavioural PD remains a risk-domain output. The customer projection references or aggregates them; it does not independently remodel them. For <code>totalDrawn = €11,000</code>, lineage should identify F1 = €8,000 and F2 = €3,000, the facility-state versions and the path Party → Relationship → Facility.</p>
    {code(`getFieldLineage(
  partyId,
  fieldName,
  asOf
)`)}
  </section>

  <section id="versions"><h2>A customer-state version is an input manifest—not one global counter</h2>
    {code(`{
  "identityVersion": "i42",
  "relationshipVersion": "r88",
  "facilityProjectionVersion": "f310",
  "riskVersion": "pd_4.2"
}`)}
    <p>Independent domains move independently. Store the exact manifest with a material decision so the institution can reproduce D(T). Include <code>schemaVersion</code> and a compatibility strategy in the consumer contract; silently renaming or removing decision fields destroys that reproducibility.</p>
    {code(`interface CustomerCreditViewContract {
  partyId: string;
  asOf: Date;
  stateMode: "KNOWN" | "RESTATED";
  values: Record<string, unknown>;
  freshness: Record<string, Date>;
  lineageVersion: string;
}`)}
  </section>

  <section id="dependencies"><h2>Invalidate projections through declared dependencies, then update dependent fields atomically</h2>
    <div className={styles.dependencies}><span><b>TOTAL_EXPOSURE</b>depends on FACILITY_STATE</span><span><b>MAX_DPD</b>depends on DELINQUENCY_STATE</span><span><b>CONTACTABILITY</b>depends on CONTACT_STATE</span></div>
    <p>A phone change need not recompute exposure. A facility change must update facility drawn, total drawn and utilisation together so no consumer observes contradictory state. Explicit dependency events enable targeted work without partial inconsistency.</p>
    <Formula label="Projection lag"><span>ProjectionLag = T<sub>projection</sub> − T<sub>event</sub></span></Formula>
    <p>Monitor lag for critical fields. A stopped consumer that still serves yesterday&apos;s projection is more dangerous than a hard failure because the response remains plausible. Expose <code>lastSuccessfulUpdate</code> and <code>sourceEffectiveAsOf</code> to policy where needed; fail-open or fail-closed remains decision-specific.</p>
  </section>

  <section id="reconciliation"><h2>Rebuildability proves that the golden view is derived</h2>
    <Formula label="Golden customer invariant"><span>GoldenView = DeterministicProjection(CanonicalDomains)</span></Formula>
    <Formula label="Projection equivalence"><span>Projection<sup>incremental</sup> = Projection<sup>full</sup></span></Formula>
    <p>Periodically aggregate authoritative facility state and compare it with projected exposure. Differences must be zero or explained by an intentional schema or logic version change. If a customer view cannot be rebuilt deterministically, it has quietly become another source system.</p>
    <KeyObservation title="Reconciliation is a control"><p><strong>The golden customer layer should make reconciliation a control over the architecture, not the mechanism by which the architecture functions.</strong></p></KeyObservation>
    <p>Do not allow random edits to a projection. Correct the owning domain or use an explicit, sparse override event containing field, reason, scope, expiry and relevant approval. Temporary overrides need <code>validUntil</code> so they cannot become hidden permanent truth.</p>
  </section>

  <section id="testing"><h2>A deterministic fixture should prove authority, time, identity and rebuild</h2>
    <ResourceTable caption="Golden customer state test suite" headers={["Test","Expected proof"]} rows={[
      ["Golden fixture","Identity from identity domain; contact from CRM; exposure from facilities; DPD from delinquency; PD from risk"],
      ["Source conflict","CRM wins the governed phone rule and lineage retains the disagreement"],
      ["Exposure rebuild","Deleted projection rebuilds to the identical total from facility states"],
      ["Freshness delay","Late facility update marks exposure stale rather than globally current"],
      ["Identity merge","Two source identities consolidate under one party without double-counting facilities"],
      ["Historical known state","No future merge or corrected facility value leaks into the decision at T1"],
      ["Restated state","The same T1 can be reconstructed with corrected economic history"],
      ["Projection consistency","TotalDrawn = Σ FacilityDrawn and MaxDPD = max FacilityDPD"],
      ["Contract compatibility","Required fields, types, semantics and freshness metadata remain valid"],
    ]} />
  </section>

  <section id="observability"><h2>Monitor provenance and freshness—not merely pipeline uptime</h2>
    <div className={styles.metrics}>{["ProjectionLag","SourceConflictRate","UnresolvedFieldRate","ProjectionRebuildDifference","StaleCriticalFieldRate","LineageMissingRate"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal thresholds apply. Break conflicts down by field, source pair, product and migration cohort. A sudden projection shift may come from source, authority-rule, identity-resolution or facility-state change; attach infrastructure versions so monitoring can distinguish these from borrower behaviour or model drift.</p>
    <Formula label="Rebuild integrity"><span>Difference = Projection<sub>before</sub> − Projection<sub>rebuilt</sub></span></Formula>
  </section>

  <section id="architecture"><h2>The Entimema architecture governs facts before composing decisions</h2>
    <ResourceFigure label="Entimema golden customer state architecture." caption="Authoritative domains retain write ownership. Canonical identity, field authority, temporal state and lineage create rebuildable decision projections without a new master silo."><div className={styles.architecture}>{["AUTHORITATIVE DOMAINS · IDENTITY / CRM / FACILITIES / PAYMENTS / RISK / COLLECTIONS","CANONICAL PARTY + RELATIONSHIPS","FIELD-LEVEL AUTHORITY + LINEAGE","CUSTOMER-STATE COMPOSITION LAYER","DECISION-SPECIFIC PROJECTIONS","CACHE / MATERIALISED READ MODELS","UNDERWRITING / RISK / COLLECTIONS / FINANCE"].map((x,i)=><span key={x}>{x}{i<6?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Define → Compose → Govern → Serve → Reconcile" steps={["Define canonical party", "Define domain ownership", "Preserve source values", "Compose relationships and state", "Derive governed metrics", "Define decision freshness", "Build decision projection", "Preserve temporal lineage", "Reconcile authoritative domains", "Rebuild and test"]} />
    <p>A bank can connect an existing customer-master programme to facilities, payments, risk and decision projections without replacing it. A non-bank can prevent its warehouse, BI or CRM “master customer” from becoming another reconciliation point. Streaming every domain is unnecessary; explicit mixed cadence is preferable to false freshness.</p>
  </section>

  <section id="agent"><h2>A Golden Customer State Integrity Agent can investigate integrity without editing truth</h2>
    <p>A controlled agent can monitor projections, identify conflicting values, verify field authority, detect stale critical components and missing lineage, compare read models with authoritative domains, trigger evidence-led rebuild validation, find duplicate exposure aggregation and compare known with restated customer state.</p>
    <KeyObservation title="Bounded role"><p><strong>Customer-state integrity + provenance + freshness + projection-reconciliation support.</strong> It must prepare evidence for engineering and risk teams—not autonomously overwrite authoritative source data.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Govern semantic ownership, lineage, projection contracts and reconciliation.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Trace exposure, DPD and behavioural risk to point-in-time customer state.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Serve freshness-aware, reproducible customer inputs to material decisions.</Link></p></article></div>
    <p>Continue with <Link href="/resources/why-customer-id-is-not-enough-entity-resolution-lending">Why Customer ID Is Not Enough</Link>, <Link href="/resources/customer-facility-account-exposure-credit-data-model">Customer, Facility, Account and Exposure</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link> and the Insight <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link>. Canonical financial event modelling, joint-borrower handling, point-in-time customer-state reconstruction and cross-platform identity resolution remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>For every decision input, prove whether it is authoritative, derived or copied; where it came from; how fresh it was; and why that decision used that exact version.</strong></p></KeyObservation>
  </section>
</div>; }
