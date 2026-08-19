import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./connected-exposure.module.css";

export const connectedExposureSections = [
  { id: "failure", label: "The €100k becomes €200k" }, { id: "model", label: "Party–facility model" },
  { id: "temporal", label: "Temporal relationships" }, { id: "attribution", label: "Exposure attribution" },
  { id: "aggregation", label: "Double-counting control" }, { id: "decisions", label: "Decision-specific views" },
  { id: "guarantees", label: "Guarantees and collateral" }, { id: "graph", label: "Connected exposure graph" },
  { id: "resolution", label: "Party and facility resolution" }, { id: "lineage", label: "Version and lineage" },
  { id: "modelling", label: "Model and EAD boundaries" }, { id: "fixture", label: "Golden relationship fixture" },
  { id: "testing", label: "Invariant tests" }, { id: "reconciliation", label: "Reconciliation" },
  { id: "observability", label: "Observability" }, { id: "architecture", label: "Relationship architecture" },
  { id: "agent", label: "Connected Exposure Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function ConnectedExposureArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>Facility F1 has €100,000 drawn and two borrowers: P1 is primary; P2 is co-borrower. A naïve customer table writes €100,000 against each party. The institution&apos;s one economic exposure becomes €200,000 when those customer rows are summed.</p>
    <ResourceFigure label="One economic facility can have several full party associations." caption="Both borrowers genuinely need to see the obligation. The portfolio must still count the canonical facility exactly once."><div className={styles.doubleCount}><strong>F1<br/><b>€100k</b></strong><i>→</i><span>P1 ASSOCIATION<br/><b>€100k</b></span><i>+</i><span>P2 ASSOCIATION<br/><b>€100k</b></span><em>PORTFOLIO ECONOMIC EXPOSURE<br/><b>€100k — NOT €200k</b></em></div></ResourceFigure>
    <Formula label="Foundational distinction"><span>AttributionCount ≠ EconomicExposureCount</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Credit exposure is rarely a one-customer-one-loan relationship.</strong> Model the many-to-many links between parties, facilities, guarantees and accounts while separating economic exposure from its decision-specific attribution.</p></KeyObservation>
  </section>

  <section id="model"><h2>The facility is the economic anchor; relationships carry the roles</h2>
    <p>Facility ID anchors economic uniqueness. Never clone a facility because it has several borrowers. A party can link to F1, F2 and F3; F1 can link to P1 and P2. The true cardinality is <strong>Party ↔ Facility</strong>.</p>
    {code(`type CreditRelationshipRole =
  | "PRIMARY_BORROWER"
  | "CO_BORROWER"
  | "GUARANTOR"
  | "COLLATERAL_PROVIDER"
  | "AUTHORISED_SIGNATORY";

type PartyFacilityRelationship = {
  partyId: string;
  facilityId: string;
  role: CreditRelationshipRole;
  validFrom: Date;
  validTo?: Date;
};`)}
    <p>A single <code>facility.customer_id</code> cannot express this model. Duplicated facilities, comma-separated IDs and secondary-borrower columns only move the ambiguity into application code.</p>
    {code(`CREATE TABLE facility_party_relationship (
  facility_id TEXT NOT NULL,
  party_id TEXT NOT NULL,
  role TEXT NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  PRIMARY KEY (facility_id, party_id, role, valid_from)
);`)}
    <p>Role is not ownership. A guarantor, collateral provider and borrower can all link to one facility without carrying the same economic or legal meaning.</p>
  </section>

  <section id="temporal"><h2>Relationship state is effective-dated and bitemporal where corrections matter</h2>
    <p>Guarantors can be released, borrowers substituted and facilities legally assigned. Never overwrite the current edge. For a decision at T, <code>Relationships(T)</code> must contain only edges valid then.</p>
    <div className={styles.temporal}><span>KNOWN AT T<br/><b>P1 → F1</b></span><i>late co-borrower correction</i><span>RESTATED AT T<br/><b>P1 + P2 → F1</b></span></div>
    <Formula label="Temporal relationship state"><span>Relationship<sup>known</sup>(T) ≠ Relationship<sup>restated</sup>(T)</span></Formula>
    <p>If P2&apos;s link was discovered later, the original affordability or limit decision retains the graph known then. Corrected analysis can quantify the counterfactual impact without rewriting actual history. That change is identity or infrastructure correction—not new borrower behaviour.</p>
  </section>

  <section id="attribution"><h2>Facility state exists once; attribution is a versioned decision function</h2>
    {code(`type FacilityExposureState = {
  facilityId: string;
  drawnMinor: bigint;
  limitMinor?: bigint;
  undrawnMinor?: bigint;
  arrearsMinor: bigint;
  dpd: number;
  asOf: Date;
};`)}
    <Formula label="Linked exposure set"><span>AttributedExposure(Pᵢ,T) = &#123;Fⱼ : Relationship(Pᵢ,Fⱼ,T)&#125;</span></Formula>
    <ResourceTable caption="Attribution strategies are chosen by decision purpose" headers={["Strategy","Meaning","Possible use"]} rows={[
      ["Full association","Each relevant borrower sees the full facility","Some affordability or risk relationship views"],
      ["Proportional attribution","Allocate using an explicit governed share","A methodology with evidenced burden shares"],
      ["Non-additive association","Show relationship but exclude from additive total","Guarantee, collateral or contextual views"],
    ]} />
    <Formula label="Attribution engine"><span>AttributedAmount = A(FacilityExposure, Role, Relationship, DecisionPolicy)</span></Formula>
    <p>Store <code>attributionPolicyVersion</code> with material decisions. A separate attribution view can carry party ID, facility ID, role, policy and attributed amount without ever overwriting facility exposure.</p>
  </section>

  <section id="aggregation"><h2>Portfolio exposure sums canonical facilities—not party rows</h2>
    {code(`-- Wrong: F1 appears once for every relationship
SELECT SUM(f.drawn_minor)
FROM facility_state f
JOIN facility_party_relationship r
  ON r.facility_id = f.facility_id;

-- Economic total: one row per canonical facility
SELECT SUM(drawn_minor)
FROM facility_state;`)}
    <Formula label="Portfolio invariant"><span>TotalPortfolioExposure = Σ<sub>unique facilities</sub> Exposure(F)</span></Formula>
    <p><code>SUM(DISTINCT amount)</code> is not a safe repair: two legitimate facilities can carry the same amount. Economic uniqueness belongs in canonical facility identity and the grain of <code>facility_state</code>, not in an ad hoc SQL trick.</p>
    <div className={styles.metricNames}><span><b>economic_facility_exposure</b>counts money once</span><span><b>party_associated_exposure</b>measures relationship relevance</span></div>
    <p>Never call both <code>total_exposure</code>. Under full association, summed party exposure can exceed portfolio exposure and still be a valid association measure—provided its semantics are explicit.</p>
  </section>

  <section id="decisions"><h2>One relationship foundation produces bounded decision projections</h2>
    <ResourceFigure label="Decision-specific attribution prevents one universal graph from contaminating every decision." caption="Each view declares relevant edge types, exposure semantics and policy version."><div className={styles.projections}><strong>RELATIONSHIP + FACILITY FOUNDATION</strong><b>↓</b><div><span>AFFORDABILITY<br/><small>borrower + joint obligations</small></span><span>LIMIT MANAGEMENT<br/><small>approved associated exposure</small></span><span>PORTFOLIO<br/><small>unique economic facilities</small></span><span>COLLECTIONS<br/><small>case + borrower + guarantee roles</small></span></div></div></ResourceFigure>
    <p>Joint payment behaviour belongs to F1; do not duplicate payment events into two economic histories. Both borrowers may receive <code>has_joint_facility_delinquency = true</code>, and a party projection may derive:</p>
    <Formula label="Party delinquency"><span>MaxDPD(Pᵢ,T) = max<sub>F ∈ LinkedFacilities(Pᵢ,T)</sub> DPD<sub>F</sub>(T)</span></Formula>
    <p>Multiple term loans, revolving lines, overdrafts and cards remain individual facilities beneath the customer view. Aggregate compatible product classes deliberately: term-loan and revolving utilisation do not have interchangeable denominators.</p>
  </section>

  <section id="guarantees"><h2>A guarantee is an edge with coverage—not a cloned borrower balance</h2>
    {code(`type GuaranteeRelationship = {
  partyId: string;
  facilityId: string;
  guaranteedAmountMinor?: bigint;
  guaranteedPercent?: number;
};`)}
    <p>Derive <code>GuaranteeExposure(T)</code> from current facility state and effective guarantee terms. Adding guarantor P3 can change a guarantee-risk or collections view while leaving drawn facility exposure unchanged. A collateral provider is another distinct role; a collections case remains a separate domain object.</p>
    <KeyObservation title="Operational consequence"><p>A delinquent joint facility may involve several contacts and roles, but it still has one arrears amount, one payment history and one facility-level DPD state.</p></KeyObservation>
  </section>

  <section id="graph"><h2>Connected exposure is graph-shaped even when stored in SQL</h2>
    <ResourceFigure label="Illustrative relationship graph." caption="Identity equality and economic relationship are different edge types. P3 guarantees F3; that does not make P3 the borrower or merge P3 with P1."><div className={styles.graph}><span>P2</span><i>CO-BORROWS</i><strong>F1</strong><i>BORROWS</i><span>P1</span><i>BORROWS</i><strong>F2</strong><span className={styles.break}></span><span>P3</span><i>GUARANTEES</i><strong>F3</strong><i>BORROWS</i><span>P1</span></div></ResourceFigure>
    <Formula label="Graph model"><span>G = (V, E), V = parties + facilities + accounts</span></Formula>
    <p>An identity edge says two records represent the same party. A household, control, group or guarantee edge connects different parties or objects. Never use relationship evidence to merge identities. Direct contractual edges and inferred relationships must retain different provenance and confidence.</p>
    <p>Bound traversal by decision: affordability may traverse joint obligations; exposure may use directly linked facilities; group risk may use approved economic relationships. Avoid unbounded production traversal and uncontrolled connected-component expansion.</p>
    {code(`CREATE TABLE party_relationship (
  relationship_id TEXT PRIMARY KEY,
  from_party_id TEXT NOT NULL,
  to_party_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  source_system TEXT NOT NULL,
  confidence TEXT
);`)}
    <p>Relational edge tables are often sufficient. Use graph thinking before graph tooling, and keep party–party edges separate from party–facility roles when a generic edge table would erase important constraints.</p>
  </section>

  <section id="resolution"><h2>Resolve parties and facilities independently before aggregating</h2>
    <div className={styles.resolution}><span><b>PARTY RESOLUTION</b>source customers → canonical parties</span><span><b>FACILITY RESOLUTION</b>source contracts → canonical facilities</span></div>
    <p>Core F100, card-platform 8821 and warehouse contract 4511 may all represent canonical facility CF-001. If facility resolution fails, perfect party identity still double counts exposure. Conversely, correct facility mapping cannot repair a false party merge.</p>
    <Formula label="Economic exposure invariant"><span>PortfolioExposure = Σ Exposure(CanonicalFacility)</span></Formula>
    <p>Every attributed exposure remains traceable to one canonical facility; no anonymous aggregate can enter the decision view.</p>
  </section>

  <section id="lineage"><h2>Every edge and attribution needs evidence, time and version</h2>
    <ResourceTable caption="Relationship lineage contract" headers={["Field","Question answered"]} rows={[
      ["sourceSystem / sourceObject","Where did the relationship originate?"], ["relationshipType / role","What does the edge mean?"],
      ["validFrom / validTo","When was it economically valid?"], ["availableFrom","When could the institution use it?"],
      ["confidence / authority","Is it direct, inferred, confirmed or unresolved?"], ["relationshipVersion","Which edge semantics produced the view?"],
      ["attributionPolicyVersion","Why did this decision assign this amount?"],
    ]} />
    <p>Late corrections can change affordability, limits or risk. Preserve the actual decision manifest, calculate counterfactual impact under the corrected graph and classify the change as infrastructure where appropriate.</p>
  </section>

  <section id="modelling"><h2>Feature, validation and EAD grains must declare relationship semantics</h2>
    <p>A feature specifies whether it uses unique economic exposure, party-attributed exposure or associated-facility count. Facility-level EAD remains the economic modelling object; party and group EAD views aggregate it without duplicating EAD per relationship.</p>
    <p>Train/validation splitting can leak the same joint-facility outcome when P1 is in training and P2 in validation. Depending on the target, split by facility, party or governed connected component. There is no universal choice, but the choice must match the prediction grain.</p>
    <p>Default scope can be facility, customer or broader relationship state according to methodology. Store an explicit <code>default_scope</code>; do not propagate one generic Boolean. Likewise, facility DPD is underlying state and customer or group delinquency is a projection.</p>
  </section>

  <section id="fixture"><h2>A golden fixture makes the association/economic split undeniable</h2>
    <ResourceTable caption="Deterministic relationship fixture" headers={["Facility","Economic state","Relationships"]} rows={[
      ["F1","€100k drawn","P1 primary; P2 co-borrower"], ["F2","€20k drawn","P1 primary"], ["F3","€50k drawn","P1 primary; P3 guarantor"],
    ]} />
    <div className={styles.totals}><span><b>PORTFOLIO</b>€170k economic</span><span><b>P1</b>€170k full borrower association</span><span><b>P2</b>€100k borrower association</span><span><b>P3</b>€50k guarantee association</span></div>
    <Formula label="Economic result"><span>100 + 20 + 50 = €170k—not €270k</span></Formula>
  </section>

  <section id="testing"><h2>Invariant tests protect the model from semantic double counting</h2>
    <ResourceTable caption="Golden relationship and exposure tests" headers={["Test","Expected proof"]} rows={[
      ["Joint borrower","Adding P2 to F1 does not change portfolio exposure"], ["Guarantor","Adding P3 changes the guarantee view, not drawn exposure"],
      ["Relationship expiry","P3 guarantee appears before T, disappears after T and remains historically reproducible"],
      ["Duplicate facility","Two source IDs resolve to one canonical facility and one economic amount"],
      ["Identity split","Relationships reassign without cloning the facility"], ["Point in time","Known graph replays the decision; restated graph supports corrected analysis"],
      ["Projection rebuild","Party, group and portfolio views rebuild from the same canonical facilities"],
      ["Graph bounds","Weak relationship changes cannot create uncontrolled connected groups"],
    ]} />
  </section>

  <section id="reconciliation"><h2>Reconcile economic totals and relationship attribution separately</h2>
    <p>Reconcile facility economic total to its authoritative source. Reconcile party attribution to the effective relationship graph. Do not force customer-association totals to equal portfolio totals when full association is intentional.</p>
    <Formula label="Two simultaneously valid measures"><span>Σ PartyAssociatedExposure = €270k; PortfolioEconomicExposure = €170k</span></Formula>
    <KeyObservation title="Relationship multiplicity is not exposure multiplicity"><p><strong>A facility can appear in several decision relationships and still contribute exactly once to the institution&apos;s economic total.</strong></p></KeyObservation>
  </section>

  <section id="observability"><h2>Watch the graph for inflation, orphans and explosive connectivity</h2>
    <div className={styles.metrics}>{["JointFacilityRate","OrphanRelationshipRate","DuplicateFacilityRate","EconomicVsAttributedExposureRatio","RelationshipCorrectionRate","ExposureReconciliationDifference"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal thresholds apply. If associated exposure rises while portfolio exposure is unchanged, inspect relationship mapping or attribution policy before calling it credit growth. If one rule change links thousands of parties into a component, stop and investigate a graph or matching failure.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture preserves relationships without cloning money</h2>
    <ResourceFigure label="Entimema relationship-aware credit architecture." caption="Canonical facilities carry economic state once. Versioned roles and bounded graph projections attribute that state to the decisions that need it."><div className={styles.architecture}>{["CANONICAL PARTIES","PARTY–PARTY RELATIONSHIPS ↘ PARTY–FACILITY ROLES","CANONICAL FACILITIES","FACILITY STATE / EAD / DPD","ATTRIBUTION ENGINE","PARTY / HOUSEHOLD / GROUP PROJECTIONS","PORTFOLIO ECONOMIC EXPOSURE","RISK / AFFORDABILITY / LIMITS / COLLECTIONS"].map((x,i)=><span key={x}>{x}{i<7?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Model → Attribute → Aggregate → Reconcile → Decide" steps={["Resolve parties", "Resolve facilities", "Define roles", "Build temporal relationships", "Reconstruct facility exposure", "Define attribution policy", "Produce decision views", "Preserve economic uniqueness", "Test double counting", "Reconcile"]} />
  </section>

  <section id="agent"><h2>A Connected Exposure Integrity Agent can detect relationship failures without declaring connectedness</h2>
    <p>A controlled agent can monitor party–facility relationships, identify shared or orphaned facilities, detect economic double counting, reconstruct party-associated and unique portfolio exposure, compare attribution versions, surface late corrections, identify affected decisions and flag suspicious connected-component growth.</p>
    <KeyObservation title="Bounded role"><p><strong>Relationship integrity + exposure attribution + double-counting detection + decision-impact support.</strong> It must prepare reconciliation evidence for risk and data teams—not autonomously establish legal or economic connectedness when evidence is uncertain.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern exposure, delinquency, EAD and relationship-aware model inputs.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Resolve canonical facilities and preserve temporal edge lineage.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Apply versioned attribution policies to affordability, limits and collections.</Link></p></article></div>
    <p>Continue with <Link href="/resources/building-golden-customer-record-without-data-silo">Building a Golden Customer Record</Link>, <Link href="/resources/why-customer-id-is-not-enough-entity-resolution-lending">Why Customer ID Is Not Enough</Link>, <Link href="/resources/customer-facility-account-exposure-credit-data-model">Customer, Facility, Account and Exposure</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link> and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD &amp; Credit Conversion Factors</Link>. Point-in-time customer reconstruction, real-time utilisation and a time-respecting feature store remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Measure economic exposure once while preserving every party relationship needed by the decision—and make both semantics independently reproducible.</strong></p></KeyObservation>
  </section>
</div>; }
