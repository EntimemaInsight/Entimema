import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./entity-resolution.module.css";

export const entityResolutionSections = [
  { id: "failure", label: "The identity failure" }, { id: "model", label: "Source and canonical identity" },
  { id: "risk", label: "False split and merge" }, { id: "normalise", label: "Normalisation and candidates" },
  { id: "matching", label: "Matching architecture" }, { id: "confidence", label: "Confidence and review" },
  { id: "lineage", label: "Merge and split lineage" }, { id: "temporal", label: "Temporal identity" },
  { id: "domains", label: "Resolution boundaries" }, { id: "service", label: "Identity service" },
  { id: "versioning", label: "Resolution migration" }, { id: "golden", label: "Golden identity dataset" },
  { id: "testing", label: "Validation tests" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Resolution architecture" }, { id: "agent", label: "Resolution Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function EntityResolutionArticle() { return <div className={styles.articleBody}>
  <section id="failure">
    <p className={styles.lead}>One borrower appears as CRM C10291, servicing 884021, collections COL-7712, card processor P-99281 and accounting BP-04021. The institution has five records; the economic reality is one party.</p>
    <div className={styles.ids}>{[["CRM","C10291"],["SERVICING","884021"],["COLLECTIONS","COL-7712"],["CARD","P-99281"],["ACCOUNTING","BP-04021"]].map(([s,id])=><span key={s}><b>{s}</b>{id}</span>)}</div>
    <p>A model keyed only to servicing sees the term loan but misses the card and collections history. A faulty merge can do the opposite and combine unrelated borrowers.</p>
    <Formula label="Identity boundary"><span>SystemCustomerID ≠ CanonicalPartyIdentity</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>A customer ID identifies a record inside one system.</strong> Entity resolution determines whether records across systems represent the same economic party.</p></KeyObservation>
  </section>

  <section id="model"><h2>Preserve source evidence; map it to a stable canonical party</h2>
    {code(`type SourcePartyRecord = {
  sourceSystem: string;
  sourceId: string;
  legalIdentifier?: string;
  name?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  createdAt: Date;
};

type CanonicalParty = {
  partyId: string;
  partyType: "INDIVIDUAL" | "ORGANISATION";
};`)}
    <p>The canonical party is a stable internal representation independent of any one source ID. It is not a legal identifier and should not be presented as external truth.</p>
    {code(`type MatchConfidence =
  | "CONFIRMED"
  | "PROBABLE"
  | "UNRESOLVED";

type PartySourceLink = {
  partyId: string;
  sourceSystem: string;
  sourceId: string;
  confidence: MatchConfidence;
  validFrom: Date;
  validTo?: Date;
  resolutionVersion: string;
};`)}
    <p>This source-link is the lineage object. Preserve every historical source identity rather than only the current “best” ID.</p>
  </section>

  <section id="risk"><h2>False splits and false merges are symmetric technical errors with asymmetric costs</h2>
    <ResourceFigure label="False split and false merge distort borrower exposure in opposite directions." caption="One party fragmented across records hides exposure; unrelated parties collapsed into one transfer risk and delinquency incorrectly."><div className={styles.splitMerge}><article><b>FALSE SPLIT</b><span>1 REAL PARTY</span><i>→</i><div>P1 · P2 · P3</div><p>Exposure understated</p></article><article><b>FALSE MERGE</b><span>3 REAL PARTIES</span><i>→</i><div>P1</div><p>Exposure overstated</p></article></div></ResourceFigure>
    <ResourceTable caption="Credit consequences of resolution error" headers={["Error","Definition","Consequences"]} rows={[
      ["False split","One party → multiple canonical parties","Fragmented behaviour, understated debt, overstated affordability, duplicate collections"],
      ["False merge","Multiple parties → one canonical party","Transferred delinquency, overstated exposure, unfair rejection or treatment"],
    ]} />
    <p>Match precision measures how many linked pairs truly match; recall measures how many true links were found. The business loss is not necessarily symmetric: false split can hide debt while false merge can deny credit to the wrong person. Material ambiguity needs governed review.</p>
  </section>

  <section id="normalise"><h2>Normalisation improves comparison without destroying raw evidence</h2>
    {code(`type NormalisedField = {
  raw: string;
  normalised: string;
};`)}
    <p>Trim whitespace, normalise case and punctuation, and canonicalise benign formats such as phone or registration-number presentation—but retain raw values. Names remain noisy through ordering, transliteration, titles, diacritics and spelling; contact data may be shared or recycled. Neither is strong proof alone.</p>
    <p>Comparing every record pair is O(n²). Candidate generation or blocking narrows the search using coarse governed attributes. Aggressive blocking is cheaper but creates false splits; loose blocking improves recall but increases compute and review volume.</p>
    <ResourceTable caption="Illustrative candidate evidence" headers={["Evidence","Useful signal","Safety caveat"]} rows={[
      ["Verified identifier","Strong deterministic candidate","Migration, corruption, reuse or formatting can still fail"],
      ["Name tokens","Candidate generation / weak similarity","Not sufficient identity proof"],
      ["Phone / email","Supporting contact evidence","Shared family contact, generic email or recycled number"],
      ["Date consistency","Supporting contradiction or agreement","Missing and source quality matter"],
      ["Confirmed migration map","Strong source continuity","Preserve mapping lineage and version"],
    ]} />
  </section>

  <section id="matching"><h2>Strong evidence links; weak evidence scores; contradictions can veto</h2>
    <div className={styles.three}><article><b>DETERMINISTIC</b><p>Same verified identifier or existing confirmed source mapping creates a high-confidence candidate.</p></article><article><b>PROBABILISTIC</b><p>Multiple governed weak signals estimate whether records represent the same entity.</p></article><article><b>CONTRADICTION</b><p>Conflicting strong identifiers prevent automatic merge even when names look similar.</p></article></div>
    <Formula label="Illustrative weighted evidence"><span>Score<sub>match</sub> = Σ wₖsₖ</span></Formula>
    <p>A similarity score is not automatically P(SameEntity). If interpreted probabilistically, it must be calibrated and validated. Source authority also matters: verified identity data and a marketing CRM should not carry equal evidential weight by default.</p>
    {code(`type SourceAuthority = {
  sourceSystem: string;
  domain: "IDENTITY" | "CONTACT" | "RELATIONSHIP";
  trustLevel: string;
};`)}
    <p>Use minimum necessary data. A strong deterministic identifier does not justify accumulating every address and behavioural attribute. Controlled access, encryption and audit are part of the architecture.</p>
  </section>

  <section id="confidence"><h2>Resolution has three zones, not a Boolean match flag</h2>
    <div className={styles.zones}><span>AUTO-LINK<br/><b>Very high confidence</b></span><span>REVIEW<br/><b>Ambiguous / material</b></span><span>NO-LINK<br/><b>Insufficient or contradictory</b></span></div>
    <p>No universal numerical thresholds apply. If a record cannot confidently match an existing party, create a new canonical party or keep it unresolved rather than forcing a weak merge.</p>
    {code(`type IdentityResolutionDecision = {
  resolutionId: string;
  sourceRecordA: string;
  sourceRecordB: string;
  outcome: "MATCH" | "NO_MATCH" | "UNRESOLVED";
  decisionTime: Date;
  resolutionVersion: string;
  reasonCodes: string[];
};`)}
    <p>A reviewer&apos;s output becomes structured evidence, not an untraceable override. Every auto-link should answer why: same verified identifier, confirmed migration mapping or governed manual resolution. Negative evidence may outweigh several weak similarities.</p>
  </section>

  <section id="lineage"><h2>Merges and splits are financially material correction events</h2>
    <p>Later evidence can show Party A and Party B are one entity. Do not delete either ID; emit a versioned <code>PARTY_MERGED</code> event with sources, target, effective time, known time and reason.</p>
    <div className={styles.dual}><article><b>MERGE</b><p>Several canonical parties become one current economic identity while all source and prior party lineage remains.</p></article><article><b>SPLIT</b><p>A false merge is corrected into separate parties; current exposure and affected histories are rebuilt.</p></article></div>
    <p>Split is harder: exposure, affordability, delinquency, features and decisions may all change. Treat it through the same correction/restatement architecture as late financial data rather than silent master-data cleanup.</p>
    <p>Do not blindly merge an entire connected component. A ≈ B and B ≈ C does not necessarily make A ≈ C sufficiently certain. Validate strong-identifier consistency, contradictions and cluster lineage.</p>
  </section>

  <section id="temporal"><h2>Identity has valid time and system time</h2>
    <ResourceFigure label="Known identity and restated identity diverge after later resolution." caption="The actual decision retains the fragmented mapping known at T; corrected analysis can consolidate the economic party without creating hindsight in validation."><div className={styles.temporal}><span>KNOWN AT T<br/><b>P-A + P-B unresolved</b></span><i>later merge evidence</i><span>RESTATED AT T<br/><b>Canonical P-0042</b></span></div></ResourceFigure>
    <Formula label="Temporal identity divergence"><span>PartyState<sup>known</sup>(T) ≠ PartyState<sup>restated</sup>(T)</span></Formula>
    <p>Valid time expresses when the relationship was economically true; system time expresses when the platform resolved it. A decision before merge must replay using the mapping known then. Corrected exposure may be larger because previously fragmented facilities consolidate—an infrastructure correction, not borrower behaviour.</p>
    <p>Improved resolution can shift total exposure, max DPD and facility count while the credit model is unchanged. Decision monitoring should classify this as infrastructure/configuration change rather than unexplained model drift.</p>
  </section>

  <section id="domains"><h2>Entity resolution is not KYC, fraud or household linking</h2>
    <ResourceTable caption="Resolution domain boundaries" headers={["Domain","Purpose","Boundary"]} rows={[
      ["KYC / verification","Establish or verify identity through formal controls","Entity linkage does not replace verification"],
      ["Entity resolution","Link records likely representing one party","Preserve uncertainty and evidence"],
      ["Fraud detection","Assess suspicious identity behaviour","Data coherence is not fraud adjudication"],
      ["Household / business relationship","Connect distinct parties","Shared address, phone or surname must not merge identities"],
      ["Facility resolution","Deduplicate economic contracts","Party resolution does not deduplicate facilities"],
    ]} />
    <p>Organisation resolution must preserve legal entities, trading names, branches and name changes without assuming they are interchangeable. Role resolution is separate again: one party can be borrower, guarantor and payer while remaining one identity.</p>
  </section>

  <section id="service"><h2>Downstream decisions consume confidence and version, not only party ID</h2>
    {code(`interface IdentityResolutionService {
  resolveSourceParty(
    sourceSystem: string,
    sourceId: string,
    asOf?: Date
  ): Promise<ResolutionResult>;
  getCanonicalParty(partyId: string): Promise<CanonicalParty>;
}

type ResolutionResult = {
  partyId?: string;
  confidence: MatchConfidence;
  resolutionVersion: string;
  reasonCodes: string[];
};`)}
    {code(`{
  "decisionId": "dec_501",
  "partyId": "P-0042",
  "resolutionVersion": "identity-v7",
  "resolutionConfidence": "CONFIRMED"
}`)}
    <p>The decision manifest makes exposure and behaviour reproducible. Once source records resolve to a party, exposure aggregation still follows role and facility deduplication rules from <Link href="/resources/customer-facility-account-exposure-credit-data-model">the credit data model</Link>.</p>
  </section>

  <section id="versioning"><h2>Resolution logic is production decision infrastructure</h2>
    <p>Every change to normalisation, blocking, match rules, source weighting or calibration receives a new <code>resolutionVersion</code>. Historical decisions retain the version they used.</p>
    <EntimemaFramework title="Resolution migration impact analysis" steps={["Compare old/new party assignments", "Count merges and splits", "Classify unresolved changes", "Quantify exposure delta", "Inspect feature changes", "Replay material decisions", "Approve and monitor deployment"]} />
    <Formula label="Identity mapping delta"><span>IdentityDelta = Mapping<sub>new</sub> − Mapping<sub>old</sub></span></Formula>
    <Formula label="Exposure impact"><span>ΔExposure = Exposure<sub>new</sub> − Exposure<sub>old</sub></span></Formula>
    <p>Batch re-resolution is a controlled migration, not a silent table refresh. Counterfactual decisions quantify impact while actual historical decisions remain immutable.</p>
  </section>

  <section id="golden"><h2>A golden identity dataset tests both similarity and contradiction</h2>
    <ResourceTable caption="Deterministic golden entity-resolution cases" headers={["Case","Evidence","Expected result"]} rows={[
      ["A","Same strong verified identifier","MATCH / confirmed candidate"],
      ["B","Same name; conflicting strong identifiers","NO AUTO-MATCH"],
      ["C","Old/new core IDs with confirmed migration mapping","MATCH / same canonical party"],
      ["D","Shared phone; different verified identifiers","SEPARATE PARTIES"],
      ["E","Missing identifier and insufficient weak evidence","UNRESOLVED"],
      ["F","Transliteration variation plus consistent governed evidence","Review or match according to validated policy"],
    ]} />
    <p>Include exact duplicates, name variation, shared contact, migration IDs and deliberate contradictions. Expected canonical links and confidence zones are fixed test evidence—not thresholds inferred from the test run.</p>
  </section>

  <section id="testing"><h2>Pairwise accuracy is necessary; cluster integrity catches systemic corruption</h2>
    <ResourceTable caption="Resolution test architecture" headers={["Test","Proof"]} rows={[
      ["Pairwise precision / recall","Labelled pairs quantify false merge and split trade-off"],
      ["Cluster contradictions","No auto-cluster contains conflicting strong identifiers"],
      ["Cluster size","Implausible sudden growth is detected"],
      ["Referential integrity","One active source-party link per relevant valid-time interval"],
      ["Overlapping links","P1/P2 overlap requires explicit supersession"],
      ["Temporal merge","Known state stays split before knowledge time; current/restated can merge"],
      ["Split correction","Lineage survives; exposure and impacted decisions are traceable"],
      ["Decision replay","Pre-correction decision uses old resolution version"],
    ]} />
  </section>

  <section id="observability"><h2>Monitor resolution behaviour like model and infrastructure change</h2>
    <div className={styles.metrics}>{["UnresolvedRate","AutoMergeRate","ManualReviewRate","FalseMergeConfirmedRate","FalseSplitCorrectionRate","IdentityChangeImpact"].map(x=><span key={x}>{x}</span>)}</div>
    <p>No universal threshold applies. A merge spike after deployment can indicate regression. Monitor cluster-size distributions, unexpected large clusters, unresolved concentration by source/migration cohort/completeness, and time from record creation to canonical resolution.</p>
    <p>Delayed identity resolution delays complete exposure. Repeated unresolved concentration identifies source-quality debt; resolution metrics should link to decision and exposure materiality rather than only record counts.</p>
  </section>

  <section id="architecture"><h2>The Entimema resolution architecture makes each link explainable</h2>
    <ResourceFigure label="Entimema entity-resolution architecture." caption="Deterministic and probabilistic evidence remain separate, contradiction checks precede resolution, and every canonical link preserves confidence and lineage."><div className={styles.architecture}>{["SOURCE PARTY RECORDS","NORMALISATION","CANDIDATE GENERATION","DETERMINISTIC EVIDENCE","PROBABILISTIC EVIDENCE","CONFLICT CHECKS","RESOLUTION DECISION","CANONICAL PARTY","SOURCE-LINK LINEAGE","EXPOSURE / BEHAVIOUR CONSUMERS"].map((x,i)=><span key={x}>{x}{i<9?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Entimema entity-resolution framework" steps={["Preserve source record", "Normalise", "Generate candidates", "Apply strong evidence", "Apply weak evidence carefully", "Detect contradictions", "Assign confidence", "Create or link canonical party", "Preserve lineage", "Monitor decision impact"]} />
  </section>

  <section id="agent"><h2>An Entity Resolution Integrity Agent can surface evidence and impact</h2>
    <p>A future controlled agent can monitor unresolved identities, likely duplicates, suspicious clusters and conflicting strong identifiers; compare resolution versions; quantify exposure changes; reconstruct known/restated party state; and identify decisions affected by merge or split corrections.</p>
    <KeyObservation title="Bounded role"><p><strong>Entity-resolution observability + exposure-impact analysis + identity-data quality support.</strong> It must not autonomously merge or split legal identities when evidence is uncertain.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Complete exposure, behavioural history and point-in-time validation.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Canonical identity, source lineage, mapping quality and reconciliation.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Confidence-aware affordability, limit and collections decisions.</Link></p></article></div>
    <p>Continue with <Link href="/resources/customer-facility-account-exposure-credit-data-model">Customer, Facility, Account and Exposure</Link>, <Link href="/resources/event-time-processing-time-posting-time-credit-systems">Event Time vs Processing Time vs Posting Time</Link>, <Link href="/resources/reconstructing-account-state-financial-events">Reconstructing Account State</Link>, <Link href="/resources/building-reliable-dpd-engine">Building a Reliable DPD Engine</Link>, <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link>, <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> and <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>. Golden records, connected exposures and cross-platform resolution are future research directions, not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Every canonical link must state what evidence supports it, what uncertainty remains, which resolution version made it and what lending decisions change if that identity later proves wrong.</strong></p></KeyObservation>
  </section>
</div>; }
