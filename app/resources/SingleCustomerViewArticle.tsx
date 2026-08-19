import Link from "next/link";
import { EntimemaFramework, Formula, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./single-customer-view.module.css";

export const singleCustomerViewSections = [
  { id: "fiction", label: "The Customer 360 fiction" }, { id: "objects", label: "Core object hierarchy" },
  { id: "resolution", label: "Entity resolution" }, { id: "relationships", label: "Relationships and exposure" },
  { id: "time", label: "Point-in-time state" }, { id: "behaviour", label: "Cross-product behaviour" },
  { id: "authority", label: "Source authority" }, { id: "architecture", label: "Customer-state architecture" },
  { id: "case", label: "End-to-end case" }, { id: "implementation", label: "Decision and agent bridge" },
] as const;

export default function SingleCustomerViewArticle() {
  return <div className={styles.articleBody}>
    <p className={styles.lead}>An institution claims to have a Single Customer View. Yet the same borrower remains a CRM customer, loan-system customer, card customer, payment account, collections case, accounting counterparty, bureau identity and decision-engine applicant. The screen looks unified; the decisions remain fragmented.</p>
    <p>A single customer view is not a dashboard, CRM record or master row. It is the governed ability to resolve one economic borrower across identities, accounts, facilities, exposures, payment histories and risk states <strong>at the exact time a decision is made</strong>.</p>

    <section id="fiction"><h2>The problem is relational before it is visual</h2>
      <Formula label="The Customer 360 fallacy"><span className={styles.formula}>Customer360UI ≠ SingleEconomicCustomerView</span></Formula>
      <p>A polished screen can show name, contact details, products and balances while missing a card held under another technical ID, double-counting a replicated balance or applying today’s relationships to yesterday’s decision. “Customer” itself is ambiguous: person, company, applicant, debtor, account holder, payer, guarantor, beneficiary or household.</p>
      <div className={styles.tension}><article><b>PRESENTATION</b><h3>Put every field on one screen</h3><p>Optimises visibility while assuming identity and relationships are already resolved.</p></article><span>→</span><article><b>DECISION INFRASTRUCTURE</b><h3>Reconstruct the economic borrower</h3><p>Resolves identity, role, exposure, behaviour, authority and time for a defined decision.</p></article></div>
      <blockquote>Do not build a single customer screen. Build a single customer state that every relevant decision can reconstruct.</blockquote>
    </section>

    <section id="objects"><h2>Customer, account, facility and exposure are different objects</h2>
      <ResourceFigure label="Core object hierarchy" caption="Each layer carries distinct semantics; collapsing them produces incomplete or duplicated risk."><div className={styles.flow}>{["Identity", "Party", "Relationship", "Facility", "Account", "Exposure", "Behaviour", "Risk state"].map(x => <span key={x}>{x}</span>)}</div></ResourceFigure>
      <ResourceTable caption="The distinctions a lending customer data model must preserve" headers={["Object", "Meaning", "Critical distinction"]} rows={[
        ["Identity", "Evidence used to recognise an entity", "One party may have many source identities"],
        ["Party", "Legal or economic entity in a relationship", "A party can be borrower, co-borrower, guarantor or owner"],
        ["Customer", "A party in a specific institutional relationship", "Party and customer are not universal synonyms"],
        ["Account", "Servicing or settlement object", "One customer can have many; one account can involve several parties"],
        ["Facility", "Credit contract or commitment", "One facility can map to multiple accounts"],
        ["Exposure", "Economically relevant amount at risk", "Drawn balance, undrawn commitment, accruals and contingencies differ"],
      ]}/>
      <div className={styles.signature}><span>Customer ≠ Account</span><span>Account ≠ Facility</span><span>Facility ≠ Exposure</span></div>
      <Formula label="Customer exposure"><span className={styles.formula}>CustomerExposureᵢ(T) = Σⱼ Exposureᵢⱼ(T) | role, product, decision purpose</span></Formula>
      <p>The arithmetic is simple. The architecture is not. Joint borrowers break one-account-one-customer assumptions; guarantors create role-sensitive attribution; household and corporate-group relationships can matter without becoming the same object as the customer.</p>
    </section>

    <section id="resolution"><h2>Entity resolution is a risk control, not data cleaning</h2>
      <p>Consider one fictional borrower represented as CRM <code>C10291</code>, loan <code>841207</code>, card <code>P-77218</code>, collections <code>COL-3407</code> and accounting <code>BP009882</code>. If those records are not linked, total exposure and cross-product behaviour disappear from decisions.</p>
      <Formula label="Conceptual entity resolution"><span className={styles.formula}>P(SameEntity | approved evidence)</span></Formula>
      <div className={styles.dual}><article><h3>False split</h3><p>One party is represented as several customers because of spelling, transliteration, changed surname, missing identifier, migration or duplication. Exposure is understated and behaviour fragments.</p></article><article><h3>False merge</h3><p>Different parties are incorrectly combined. Exposure, affordability, collections treatment and risk evidence can be assigned to the wrong borrower.</p></article></div>
      <p>Strong verified identifiers may permit deterministic matching. Inconsistent or unavailable identifiers may require probabilistic evidence. The architecture should expose <strong>confirmed</strong>, <strong>probable</strong> and <strong>unresolved</strong> linkage rather than manufacture certainty. Material low-confidence relationships can route to controlled review without becoming an adverse decision by themselves.</p>
      <p>Merges and splits need lineage: source records, match evidence, mapping version and correction events. A technical customer ID can change during migration; economic identity cannot depend on one surrogate key.</p>
    </section>

    <section id="relationships"><h2>Risk lives across relationships, not one customer row</h2>
      <Formula label="Relationship representation"><span className={styles.formula}>G = (V, E), where V = parties / facilities / accounts and E = governed relationships</span></Formula>
      <p>Relationships such as owns, borrows, guarantees, pays, controls or belongs-to-household should be explicit where decision-relevant. A master customer table remains useful, but <strong>MasterTable ≠ RelationshipModel</strong>. Canonical does not mean one denormalised mega-record; it can remain relational, graph-based or event-driven.</p>
      <ResourceTable caption="Original cross-product exposure example" headers={["Product", "Drawn", "Additional state", "One-product decision sees"]} rows={[
        ["Term loan", "€8,000", "Current", "€8,000"], ["Card", "€3,000", "€5,000 limit", "Missing"], ["Overdraft", "€1,500", "Revolving", "Missing"], ["Consolidated", "€12,500", "Plus relevant undrawn commitment", "Understated by €4,500 drawn"],
      ]}/>
      <p>For revolving products, exposure is not merely drawn balance; see <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD & Credit Conversion Factors</Link>. Poor integration can also overstate exposure: a €2,000 card balance replicated in processor and servicing becomes €4,000 under naïve summation. Product → Facility → Account lineage prevents technical copies becoming separate economic exposures.</p>
      <div className={styles.levels}>{["Facility risk", "Customer risk", "Household / relationship / group risk where relevant"].map(x => <span key={x}>{x}</span>)}</div>
    </section>

    <section id="time"><h2>A real customer view is point-in-time</h2>
      <Formula label="Canonical customer state"><span className={styles.formula}>CustomerState(T) = f(Parties, Relationships, Facilities, Accounts, Events, Exposures)ₜ</span></Formula>
      <p>Accounts close, addresses change, co-borrower relationships end and facilities refinance. Historical validation cannot apply today’s master mapping to the past. It must reconstruct identity mapping, active relationships, facilities, exposure and behavioural state as they legitimately existed at decision time.</p>
      <div className={styles.timeCards}><article><b>STATE CURRENT</b><p>The best governed representation now.</p></article><article><b>STATE HISTORICAL (T)</b><p>Relationships and attributes valid at T.</p></article><article><b>RESOLUTION VERSION</b><p>The mapping logic and evidence available at T.</p></article></div>
      <p>Valid-from and valid-to periods, source lineage and entity-resolution version matter where decisions must be reproduced. Slowly changing employment, address, income and risk classification should not be silently overwritten. If duplicate records are later merged, historical groupings may shift; validation must distinguish corrected infrastructure from information originally available.</p>
    </section>

    <section id="behaviour"><h2>One current product can conceal a stressed customer</h2>
      <p>A borrower may pay a term loan well while maxing out a card and using an overdraft continuously. Facility risk and customer risk are related but not interchangeable. Customer-level aggregation can reveal total utilisation, cross-product delinquency, debt service, new exposure and payment stress without erasing product-specific signal.</p>
      <ResourceTable caption="Decision implications of fragmented customer state" headers={["Decision", "Fragmentation failure", "Customer-state contribution"]} rows={[
        ["Affordability", "Other internal obligations and revolving commitments are missed", "Role-aware obligations and exposure"],
        ["Credit limit", "Each product approves independently", "Aggregate exposure, utilisation and available commitment"],
        ["Behavioural scoring / EWS", "Stress emerging first in another product is invisible", "Cross-product behaviour and freshness"],
        ["Collections", "Several cases trigger conflicting contact and promises", "Party–facility context and coordinated state"],
        ["Cure", "One facility cure is mistaken for customer cure", "Explicit facility versus customer definitions"],
        ["IFRS 9", "Staging, EAD and recovery relationships fragment", "Governed party/facility context while preserving unit-of-account rules"],
      ]}/>
      <p>These connections extend <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link> and <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>.</p>
    </section>

    <section id="authority"><h2>One customer view does not require one source for everything</h2>
      <blockquote>Define SourceOfTruth(field), not OneSystemForEverything.</blockquote>
      <ResourceTable caption="Illustrative field-level authority" headers={["Attribute", "Authoritative domain"]} rows={[
        ["Legal identity", "Verified identity / governed customer master"], ["Contract balance", "Servicing"], ["Settled payment", "Payment layer"], ["Ledger balance", "Accounting"], ["Behavioural PD", "Risk"],
      ]}/>
      <p>Finance may organise around ledger account, business partner and contract while Risk uses analytical party and exposure hierarchies. Both can be legitimate. When sources conflict, ask: are they describing the same object, effective time and definition—and which domain owns this field? Choosing the newest record is not a semantic control.</p>
      <div className={styles.matrix} role="table" aria-label="Identity and state matrix"><span></span><b>Fresh state</b><b>Stale state</b><strong>Correct identity</strong><em>Reliable</em><em>Temporally weak</em><strong>Wrong identity</strong><em>Misaggregated</em><em>Fundamentally unreliable</em></div>
      <p>Identity correctness and state freshness are independent. Data quality asks whether a field is complete and valid; identity quality asks whether it belongs to the correct economic entity. A perfect balance attached to the wrong party is dangerous.</p>
    </section>

    <section id="architecture"><h2>The customer view is infrastructure beneath decisions</h2>
      <EntimemaFramework title="Entimema Customer-State Architecture" steps={["Source identities", "Entity resolution", "Canonical party", "Relationship graph", "Facility / account resolution", "Exposure aggregation", "Behaviour aggregation", "Point-in-time customer state", "Risk / affordability / limit / collections decisions"]}/>
      <p>A governed canonical state can contain the party, active relationships and facilities, drawn and undrawn exposure, delinquency and behavioural risk required for the use case. It preserves field-level authority and uncertainty rather than copying everything into a new silo.</p>
      <div className={styles.threeQuestions}><article><b>01</b><h3>Who is this economic entity?</h3></article><article><b>02</b><h3>Which relationships and exposures belong to it?</h3></article><article><b>03</b><h3>What was true at decision time?</h3></article></div>
      <p>APIs connecting CRM, core, payments and collections do not resolve duplicate parties or relationship semantics. Banks may inherit several masters through migrations or acquisitions; non-banks may fragment identity across origination SaaS, PSP, bureau, collections and accounting. Newer technology changes the topology, not the identity problem.</p>
      <p>Identity and relationship latency must be monitored alongside exposure freshness. A newly opened facility that has not propagated can make a decision technically current but economically incomplete.</p>
    </section>

    <section id="case"><h2>The same applicant changes when the institution recognises the borrower</h2>
      <p>A fictional lender knows one borrower as origination ID A, servicing ID B, card ID C and collections ID D. The customer requests a new loan.</p>
      <ResourceTable caption="Original end-to-end decision case" headers={["Evidence", "Fragmented architecture", "Resolved customer state"]} rows={[
        ["Term-loan balance", "€4,000 visible", "€4,000 visible"], ["Card balance", "€2,500 missed", "€2,500 linked"], ["Card undrawn", "€3,500 missed", "€3,500 available commitment linked"], ["Recent card delinquency", "Missed", "Cross-product deterioration visible"], ["Affordability", "Passes on incomplete obligations", "Recalculated on complete approved state"], ["Limit", "Too high for observed relationship", "Lower or controlled-review outcome under policy"],
      ]}/>
      <ResourceFigure label="Before and after architecture" caption="The improvement is not a larger profile; it is an identity-resolved, relationship-aware state supplied to the decision."><div className={styles.beforeAfter}><article><b>BEFORE</b><p>Applicant → Origination ID → One product → Decision</p></article><article><b>AFTER</b><p>Applicant identity → Resolution → Party → Relationships → Exposure / behaviour → Decision</p></article></div></ResourceFigure>
      <p>If the lender later merges duplicate histories, internal debt may jump from €5,000 to €12,000. Feature distributions and model outputs move even when borrower behaviour did not. This is infrastructure-induced drift, connecting directly to <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link> and <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>.</p>
    </section>

    <section id="implementation"><h2>One foundation should produce decision-specific customer views</h2>
      <ResourceTable caption="Decision-centric slices" headers={["Decision", "Required slice"]} rows={[["Affordability", "Obligations + governed income"], ["Limit", "Exposure + utilisation + commitments"], ["Collections", "Delinquency + contact state + facility relationships"], ["ECL", "Facility-level risk + accounting context"]]}/>
      <p>More data is not the objective. The objective is <strong>Correct relationships + Correct state + Correct time</strong>, using only necessary, governed data for legitimate decisions.</p>
      <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Strengthen exposure aggregation, affordability, behavioural risk, EAD and monitoring.</Link></p></article><article><h3>Finance / CFO</h3><p><Link href="/services/cfo-function">Reconcile counterparties, customer/account mappings and balance lineage.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Build identity-aware workflows and cross-product decision orchestration.</Link></p></article></div>
      <h2>A Customer Identity & Exposure Resolution Agent can support decision readiness</h2>
      <p>A future bounded Agent could ingest approved identifiers, flag likely duplicates and false merges, construct explainable party mappings, link facilities and accounts, aggregate current exposure, detect missing or duplicated representations, reconstruct point-in-time customer state and expose confidence to downstream risk workflows.</p>
      <p>Its role is <strong>identity resolution + relationship mapping + exposure integrity + decision-readiness support</strong>. It must not autonomously alter legal identity records or make adverse decisions from uncertain matches.</p>
      <div className={styles.flow}>{["Customer Identity & Exposure Agent", "Financial State Agent", "Affordability Agent", "Credit Limit Optimisation Agent", "Behavioural Risk Agent", "Collections Agent"].map(x => <span key={x}>{x}</span>)}</div>
      <p>This prepares future Engineering research on entity resolution, party/facility/account/exposure models, golden records without new silos, joint borrowers, cross-system identity and point-in-time reconstruction. These are deliberate briefs, not fabricated live routes.</p>
    </section>
  </div>;
}
