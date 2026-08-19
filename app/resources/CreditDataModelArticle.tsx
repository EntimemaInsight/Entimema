import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-data-model.module.css";

export const creditDataModelSections = [
  { id: "failure", label: "The structural failure" }, { id: "objects", label: "Economic objects" },
  { id: "relationships", label: "Roles and relationships" }, { id: "schema", label: "Relational schema" },
  { id: "exposure", label: "Exposure state" }, { id: "projections", label: "Decision views" },
  { id: "identity", label: "Canonical identity" }, { id: "duplication", label: "Duplication risks" },
  { id: "events", label: "Events and episodes" }, { id: "temporal", label: "Point-in-time relationships" },
  { id: "workflow", label: "Decision workflow" }, { id: "golden", label: "Golden customer graph" },
  { id: "testing", label: "Integrity testing" }, { id: "observability", label: "Reconciliation and observability" },
  { id: "architecture", label: "Credit data architecture" }, { id: "agent", label: "Identity & Exposure Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function CreditDataModelArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>One borrower has a term loan, revolving facility, payment account and collections case across four systems. The systems expose <code>C1091</code>, <code>P8831</code>, <code>A19092</code> and <code>F4017</code>. A naïve model treats all four identifiers as “the customer.”</p>
    <div className={styles.ids}>{[["CUSTOMER ID","C1091"],["PARTY ID","P8831"],["ACCOUNT ID","A19092"],["FACILITY ID","F4017"]].map(([a,b])=><span key={a}><b>{a}</b>{b}</span>)}</div>
    <p>They are not equivalent. Confusing them produces missing or duplicated exposure, wrong affordability, siloed limits and broken collections routing.</p>
    <Formula label="Core object distinction"><span>Customer ≠ Party ≠ Facility ≠ Account ≠ Exposure</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Credit systems need explicit economic objects and relationships.</strong> Technical records that look related do not become one borrower, one contract or one exposure merely because they share a convenient column.</p></KeyObservation>
  </section>

  <section id="objects"><h2>Identity, party, role, facility and account answer different questions</h2>
    <ResourceTable caption="Minimum lending object model" headers={["Object","Definition","Examples / boundary"]} rows={[
      ["Identity","Evidence used to recognise a party across sources","Verified legal, registration or trusted master identity"],
      ["Party","Legal or economic entity in a financial relationship","Individual or company"],
      ["Customer","A role/context held by a party","The same party may also guarantee, co-borrow or pay"],
      ["Facility","Economic credit contract or commitment","Term loan, revolving line, card or overdraft"],
      ["Account","Servicing, transactional or ledger object","One facility may use several technical accounts"],
      ["Product","Reusable product definition","Revolving Credit is a type; F4017 is an instance"],
      ["Exposure","Amount at risk for a purpose and time","Drawn, undrawn, accrued or contingent components"],
    ]} />
    <p>A facility carries economic terms. An account records movements or balances according to a servicing or ledger role. The mapping is not universally one-to-one, especially in legacy or multi-system designs.</p>
    <ResourceFigure label="Economic object hierarchy from party through exposure." caption="Events attach to the correct economic level; facility state and exposure are derived without turning accounts or technical identifiers into customers."><div className={styles.architecture}>{["PARTY","PARTY–FACILITY RELATIONSHIP","FACILITY","ACCOUNT(S)","EVENTS","FINANCIAL STATE","EXPOSURE"].map((x,i)=><span key={x}>{x}{i<6?<b>↓</b>:null}</span>)}</div></ResourceFigure>
  </section>

  <section id="relationships"><h2>Role belongs on a relationship, not inside identity</h2>
    {code(`type PartyRole =
  | "PRIMARY_BORROWER"
  | "CO_BORROWER"
  | "GUARANTOR"
  | "ACCOUNT_HOLDER"
  | "PAYER";

type FacilityPartyRelationship = {
  facilityId: string;
  partyId: string;
  role: PartyRole;
  validFrom: Date;
  validTo?: Date;
  confidence: "CONFIRMED" | "PROBABLE" | "UNRESOLVED";
};`)}
    <p>A single <code>facility.customer_id</code> cannot represent one primary borrower, one co-borrower and one guarantor. The relationship object captures role, validity and—where necessary—confidence and lineage.</p>
    <ResourceFigure label="Joint-borrower graph with one economic facility." caption="F1 is attributable to both parties but remains one facility exposure in portfolio aggregation."><div className={styles.joint}><div><span>PARTY P1<br/><b>PRIMARY</b></span><span>PARTY P2<br/><b>CO-BORROWER</b></span></div><i>↓ linked to ↓</i><strong>FACILITY F1 · €8,000 DRAWN</strong><i>↓ serviced by ↓</i><span>ACCOUNT A1</span></div></ResourceFigure>
    <div className={styles.dual}><article><b>ATTRIBUTION</b><p>F1 matters to both P1 and P2 and appears in each party&apos;s relationship context.</p></article><article><b>AGGREGATION</b><p>Portfolio economic exposure counts F1 once, not €8,000 for each borrower.</p></article></div>
    <p>A guarantor relationship may carry guarantee coverage and legal obligation, but should not be mechanically converted into borrower exposure. Graph thinking is useful even when implemented in ordinary relational tables; a graph database is not required.</p>
  </section>

  <section id="schema"><h2>A relational model can preserve the graph explicitly</h2>
    {code(`CREATE TABLE party (
  party_id   TEXT PRIMARY KEY,
  party_type TEXT NOT NULL
);

CREATE TABLE facility (
  facility_id  TEXT PRIMARY KEY,
  product_type TEXT NOT NULL
);

CREATE TABLE facility_party (
  facility_id TEXT NOT NULL REFERENCES facility(facility_id),
  party_id    TEXT NOT NULL REFERENCES party(party_id),
  role        TEXT NOT NULL,
  valid_from  TIMESTAMPTZ NOT NULL,
  valid_to    TIMESTAMPTZ,
  PRIMARY KEY (facility_id, party_id, role, valid_from)
);

CREATE TABLE account (
  account_id   TEXT PRIMARY KEY,
  facility_id  TEXT NOT NULL REFERENCES facility(facility_id),
  account_role TEXT NOT NULL,
  valid_from   TIMESTAMPTZ NOT NULL,
  valid_to     TIMESTAMPTZ
);`)}
    <p>Illustrative account roles include SERVICING, SETTLEMENT, LEDGER and CARD. One technical account is not automatically a separate lending exposure. Referential failures—such as an account without a facility—should quarantine rather than silently disappear.</p>
    {code(`type FacilityState = {
  facilityId: string;
  limitMinor?: bigint;
  drawnMinor: bigint;
  blockedMinor?: bigint;
  pendingMinor?: bigint;
  undrawnMinor?: bigint;
  arrearsMinor: bigint;
  dpd: number;
  asOf: Date;
};`)}
  </section>

  <section id="exposure"><h2>Exposure is a point-in-time facility state, not a customer column</h2>
    <Formula label="Simplified undrawn amount"><span>Undrawn(T) = Limit(T) − Drawn(T), adjusted for blocked, pending and expired commitment</span></Formula>
    <Formula label="Illustrative availability"><span>Available = Limit − Drawn − Blocked − Pending</span></Formula>
    <p>Limit is primarily a facility property. Customer-level limit or exposure is a projection across relevant relationships. Term-loan outstanding and revolving utilisation follow different semantics; do not force incompatible products into one utilisation ratio.</p>
    <Formula label="Facility EAD view"><span>EAD = Drawn + CCF × Undrawn</span></Formula>
    <p>The model must preserve drawn and undrawn separately so EAD inputs trace to canonical facility state. A single opaque EAD value cannot support lineage, recalibration or alternative scenarios.</p>
    <KeyObservation title="Exposure principle"><p><strong>There should be one underlying facility relationship model, but multiple decision-specific exposure views.</strong></p></KeyObservation>
  </section>

  <section id="projections"><h2>Different decisions project the same economic model differently</h2>
    <ResourceTable caption="Decision-specific exposure views" headers={["Decision","Projection","Why"]} rows={[
      ["Affordability","Relevant scheduled debt service across facilities","Repayment obligation, not duplicated accounts"],
      ["Limit management","Current drawn plus available internal exposure","Understand exposure created by another line"],
      ["EAD","Facility drawn and undrawn with governed conversion","Risk exposure at the facility boundary"],
      ["Collections","Delinquent facility balance plus party context","Act on case/facility without losing cross-product context"],
      ["Behavioural risk","Facility state aggregated under compatible definitions","Preserve product semantics and lineage"],
    ]} />
    {code(`type PartyCreditState = {
  partyId: string;
  totalDrawnMinor: bigint;
  totalCommittedMinor: bigint;
  maxDpd: number;
  activeFacilityCount: number;
  asOf: Date;
};`)}
    <Formula label="Projection principle"><span>PartyState(T) = Projection(FacilityStates(T), Relationships(T), DecisionPurpose)</span></Formula>
    <p>Party state is rebuildable projection, not authoritative primitive state. Max DPD, total drawn and total committed can be useful, but their aggregation rules must match the decision and deduplicate canonical facilities.</p>
  </section>

  <section id="identity"><h2>Canonical IDs preserve economic continuity across systems</h2>
    {code(`CREATE TABLE source_identifier (
  canonical_object_type TEXT NOT NULL,
  canonical_id          TEXT NOT NULL,
  source_system         TEXT NOT NULL,
  source_id             TEXT NOT NULL,
  valid_from            TIMESTAMPTZ NOT NULL,
  valid_to              TIMESTAMPTZ,
  UNIQUE (source_system, source_id, valid_from)
);`)}
    <p>An old-core customer <code>44192</code> and new-core customer <code>A9917</code> can both map to canonical party <code>P00127</code>. Technical keys may change; historical economic identity must not.</p>
    {code(`type IdentityLink = {
  canonicalPartyId: string;
  sourceSystem: string;
  sourceId: string;
  confidence: "CONFIRMED" | "PROBABLE" | "UNRESOLVED";
};`)}
    <p>Do not turn uncertain matches into confirmed truth. Material decisions may require controlled review or a governed fallback. Relationship confidence can also matter—for example, uncertain migrated guarantor mappings.</p>
  </section>

  <section id="duplication"><h2>False splits, false merges and duplicate facilities change risk</h2>
    <ResourceTable caption="Identity and exposure integrity failures" headers={["Failure","Economic distortion","Decision impact"]} rows={[
      ["False split","One party becomes two canonical parties","Exposure understated; affordability weakened; duplicate cases"],
      ["False merge","Two parties become one","Exposure overstated; wrong treatment and decisions"],
      ["Duplicate facility","One contract represented by two canonical facilities","Portfolio and party exposure double counted"],
      ["Orphan account","Account lacks canonical facility","Balance omitted or misaggregated"],
      ["Orphan facility","Facility lacks party relationship","Customer context and routing fail"],
    ]} />
    <p>A canonical facility is the economic credit contract represented once, no matter how many core, processor or warehouse copies exist. Preserve all source facility identifiers as lineage. Two canonical facilities mapping to one source facility is an explicit integrity signal.</p>
  </section>

  <section id="events"><h2>Attach events and episodes to the object they change</h2>
    <div className={styles.objectEvents}><article><b>PARTY EVENTS</b><p>Identity and verified attribute changes.</p></article><article><b>FACILITY EVENTS</b><p>Limit, restructure, status and closure.</p></article><article><b>ACCOUNT EVENTS</b><p>Payments, fees, servicing balance movements.</p></article></div>
    <p>Attaching every event only to “customer” erases the aggregate where financial state changes. Facility exposure can combine facility and account events through governed reducers.</p>
    <p><strong>CollectionsCase ≠ Facility.</strong> A facility may have several cases over time; a case may cover several facilities in some architectures. Likewise, a delinquency or default episode is an explicit historical object rather than the facility itself.</p>
    {code(`type DelinquencyEpisode = {
  episodeId: string;
  facilityId: string;
  startDate: Date;
  endDate?: Date;
};`)}
  </section>

  <section id="temporal"><h2>Relationships and facility terms are point-in-time state</h2>
    {code(`SELECT f.facility_id, fp.role
FROM facility_party fp
JOIN facility f
  ON f.facility_id = fp.facility_id
WHERE fp.party_id = :party_id
  AND fp.valid_from <= :as_of
  AND (fp.valid_to IS NULL OR fp.valid_to > :as_of);`)}
    <p>The next join must select facility state available/effective at the same time. Joining a 2024 decision to <code>current_customer_facility_map</code> introduces future relationship knowledge.</p>
    <p>Co-borrowers can be added, guarantees released, accounts closed and limits changed. Late identity corrections may require both valid and system time so <strong>PartyState<sup>known</sup>(T)</strong> preserves the actual decision while <strong>PartyState<sup>restated</sup>(T)</strong> reflects corrected economic mapping.</p>
    <p>If a duplicate party is merged later, historical corrected exposure can rise without portfolio growth. This is infrastructure-induced risk drift; model validation must distinguish production-known from corrected exposure.</p>
  </section>

  <section id="workflow"><h2>Build the decision graph at the decision time</h2>
    <ol className={styles.steps}><li>Resolve canonical party identity and confidence.</li><li>Select party–facility relationships valid and known at T.</li><li>Select active canonical facilities without duplicate source representations.</li><li>Reconstruct point-in-time facility and account state.</li><li>Derive the exposure view for affordability, limit, EAD or collections.</li><li>Retain object, relationship, state and policy versions in the decision manifest.</li></ol>
    <ResourceTable caption="Conceptual source authority by object" headers={["Object","Typical authoritative domain"]} rows={[
      ["Party identity","Customer master / verified identity"], ["Facility terms","Lending / servicing"],
      ["Account balance","Servicing / core"], ["Payment event","Payment layer"],
      ["Accounting balance","Ledger"], ["Behavioural PD","Risk"],
    ]} />
    <p>The objective is not one golden physical database. It is one semantic model, stable canonical IDs, governed relationships and reproducible state across distributed authoritative systems.</p>
  </section>

  <section id="golden"><h2>A golden customer graph proves attribution without double counting</h2>
    <p>Fixture: P1 is primary on term facility F1 and revolving F2; P2 is co-borrower on F1. A1 services F1; card account A2 services F2. F1 draws €8,000. F2 has a €5,000 limit and €3,000 drawn.</p>
    <ResourceFigure label="Golden customer graph with two parties and two facilities." caption="P1 sees both facilities; P2 is attributed F1. Economic portfolio exposure still contains only F1 and F2 once."><div className={styles.golden}><div><span>P1 · PRIMARY F1/F2</span><span>P2 · CO-BORROWER F1</span></div><b>↓ relationships ↓</b><div><strong>F1 · TERM · €8,000</strong><strong>F2 · REVOLVING · €3,000 / €5,000</strong></div><b>↓ accounts ↓</b><div><i>A1 · SERVICING</i><i>A2 · CARD</i></div></div></ResourceFigure>
    <ResourceTable caption="Golden exposure assertions" headers={["View","Drawn","Committed / economic count"]} rows={[
      ["P1 attribution","€11,000","€13,000 under simplified term + revolving assumption"],
      ["P2 attribution","€8,000","F1 linked as co-borrower"],
      ["Portfolio economic exposure","€11,000 drawn","F1 + F2 counted once; never €19,000"],
    ]} />
    <p>Attribution can deliberately sum beyond portfolio exposure because one facility relates to several parties. The two measures must never be confused.</p>
  </section>

  <section id="testing"><h2>Test graph integrity, cardinality and time</h2>
    <ResourceTable caption="Credit data-model test architecture" headers={["Test","Proof"]} rows={[
      ["Joint exposure","F1 appears for P1 and P2 but portfolio counts once"], ["Migration","Source customer ID changes; canonical party continuity remains"],
      ["False merge","Conflicting strong identity evidence is flagged"], ["Temporal relationship","Before valid_to sees co-borrower; after does not"],
      ["Cardinality","Many accounts/facilities/parties are supported without accidental one-to-one"], ["Referential integrity","Orphans quarantine with evidence"],
      ["Projection snapshot","Party state equals full facility/relationship recomputation"], ["Source mapping","Duplicate canonical facility mapping is detected"],
    ]} />
    <p>Data contracts should specify stable party identity, facility economic uniqueness, relationship role/validity and account-to-facility role. These are semantic controls, not optional documentation.</p>
  </section>

  <section id="observability"><h2>Observe mapping failure before interpreting portfolio movement</h2>
    <div className={styles.metrics}>{["OrphanAccountRate","OrphanFacilityRate","DuplicateFacilityMappingRate","UnresolvedIdentityRate","ExposureReconciliationDifference"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Reconcile summed canonical facility exposure to relevant source/control totals, then reconcile party attribution against source relationship views. Differences should resolve to timing, mapping, scope or explicit attribution—not remain unexplained.</p>
    <p>A sudden fall in facilities per party can be a mapping break rather than deleveraging. An exposure jump after an identity merge can be corrected infrastructure rather than new lending. Track source, product, migration cohort and relationship version before interpreting business trend.</p>
  </section>

  <section id="architecture"><h2>The Entimema credit data architecture separates identity from exposure</h2>
    <ResourceFigure label="Entimema party, facility, account and exposure architecture." caption="Canonical IDs and effective-dated relationships connect distributed authorities into reproducible facility and party credit state."><div className={styles.architecture}>{["SOURCE IDENTITIES","CANONICAL PARTY","PARTY–FACILITY RELATIONSHIPS","CANONICAL FACILITY","ACCOUNTS / SERVICING OBJECTS","FINANCIAL EVENTS","FACILITY STATE","EXPOSURE PROJECTION","PARTY CREDIT STATE","RISK / AFFORDABILITY / LIMIT / COLLECTIONS"].map((x,i)=><span key={x}>{x}{i<9?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Entimema credit data-model framework" steps={["Define economic objects", "Define stable IDs", "Define roles", "Model relationships", "Separate facility from account", "Reconstruct facility state", "Aggregate exposure carefully", "Preserve time", "Test double counting", "Reconcile"]} />
  </section>

  <section id="agent"><h2>An Identity &amp; Exposure Integrity Agent can validate the graph</h2>
    <p>A future controlled agent can monitor party/facility/account mappings, find orphans and duplicate facilities, detect likely double counting, compare source and canonical identities, reconstruct party exposure, compare known/restated customer state and trace relationship changes into historical decisions.</p>
    <KeyObservation title="Bounded role"><p><strong>Identity integrity + relationship validation + exposure reconstruction + reconciliation support.</strong> It must not autonomously merge legal identities or alter authoritative exposure records.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Facility-level EAD, behavioural state and portfolio exposure integrity.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Canonical identifiers, effective relationships and source reconciliation.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Identity-aware affordability, limits and collections decisions.</Link></p></article></div>
    <p>Continue with <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/idempotency-payment-credit-event-processing">Idempotency in Event Processing</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link>, <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD</Link>. Entity resolution, golden records, connected exposures and point-in-time customer reconstruction remain future research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Represent one economic borrower, one economic facility and one economic exposure explicitly—then project the decision view without confusing attribution, aggregation or technical duplication.</strong></p></KeyObservation>
  </section>
</div>; }
