import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-policy-rules.module.css";

export const creditPolicyRulesSections = [
  { id: "architecture", label: "Rule architecture" }, { id: "anatomy", label: "Anatomy and families" },
  { id: "contribution", label: "Contribution and overlap" }, { id: "inventory", label: "Twelve-rule diagnostic" },
  { id: "evidence", label: "Outcome evidence" }, { id: "complexity", label: "Complexity and simplification" },
  { id: "implementation", label: "Implementation and monitoring" }, { id: "failure-modes", label: "Failure modes" },
  { id: "non-bank", label: "Non-bank perspective" }, { id: "agent", label: "Rule Governance Agent" },
  { id: "resolve", label: "The production test" },
] as const;

const inventory = [
  ["R01","Product eligibility","4.8%","4.1%","Low","Required","Low","Keep"],
  ["R02","Identity evidence incomplete","1.7%","0.8%","R03: 49%","Review outcomes","Medium","Redesign"],
  ["R03","Application integrity concern","2.3%","1.5%","R02: 36%","Loss / fraud signal","Medium","Keep"],
  ["R04","Mandatory credit constraint","3.9%","3.4%","Low","Policy necessity","Low","Keep"],
  ["R05","Affordability hard fail","7.6%","5.8%","R06: 61%","Override evidence","High","Keep"],
  ["R06","Disposable-income warning","6.1%","0.5%","R05: 76%","Neighbour approvals","Medium","Merge"],
  ["R07","Risk-band hard reject","9.8%","7.2%","Model: high","Boundary approvals","Low","Keep / challenge"],
  ["R08","High utilisation reject","5.4%","0.3%","R07: 82%","Weak unique evidence","Low","Merge"],
  ["R09","Thin-file manual review","3.2%","2.1%","R02: 18%","Override outcomes","Medium","Keep"],
  ["R10","Legacy campaign restriction","0.0%","0.0%","None","Obsolete population","Medium","Retire — dead"],
  ["R11","Nested delinquency constraint","2.9%","0.0%","R04: 100%","Already controlled","Medium","Retire — shadowed"],
  ["R12","Product evidence route","1.1%","0.9%","Low","Operational benefit","High","Redesign"],
];

const failures = [
  ["Rules accumulate but never retire","Obsolete controls still consume validation and change capacity."], ["No purpose or owner","Nobody can distinguish a mandatory constraint from a tactical experiment."],
  ["No precedence","Code order, not approved policy, resolves conflicts."], ["Every signal is a hard reject","Review, limit and evidence paths disappear."],
  ["Duplicate, shadowed or dead rules","Trigger volume creates an illusion of control."], ["Accidental model duplication","Discrete policy distorts ranking without a risk-appetite rationale."],
  ["Hits counted as unique rejects","One case triggering five rules is misreported as five decisions."], ["No interaction or boundary tests","Sensible rules combine badly or fail at exact thresholds."],
  ["Policy-to-code mismatch","Gross/net, period, currency, rounding and > versus ≥ change the policy."], ["Silent missing-value treatment","Unknown evidence becomes an arbitrary pass, fail or number."],
  ["Temporary rules lack expiry","A crisis response becomes permanent legacy."], ["No versioning or outcome challenge","Past decisions cannot be reconstructed or attributed."],
  ["Rejected outcomes assumed","Selective observation becomes false certainty."], ["Exceptions breed exceptions","Rule → exception → exception-to-exception → override becomes brittle."],
  ["Portfolio concern becomes borrower rule","A dynamic concentration problem becomes a static applicant reject."], ["Complexity has no decision value","Cost rises without material risk control."],
];

export default function CreditPolicyRulesArticle(){return <div className={styles.articleBody}>
  <section id="architecture"><p className={styles.lead}>A credit policy rule earns its place in production only if it expresses a necessary constraint, creates measurable decision value, or protects against a material risk that the rest of the decision architecture does not already control.</p>
    <p>A loss event creates a rule. A product creates another. A model limitation creates a third. A temporary concern quietly becomes permanent. Years later, hundreds of conditions fire and overlap while nobody can say which still change a decision. This is the <strong>rule graveyard</strong>: rules are added continuously and rarely removed.</p>
    <p>The transformation is from <strong>rule inventory</strong> to <strong>rule architecture</strong>. More rules do not automatically mean more control. Every rule consumes scarce production complexity and must justify its continued existence.</p>
    <EntimemaFramework title="Credit Policy Rule Architecture" description="From need to continuing production evidence." steps={["Risk / policy need","Rule purpose","Inputs & definitions","Condition","Action","Precedence","Reason code","Production deployment","Hit rate / unique contribution","Outcome evidence","Overlap / complexity","Keep / merge / redesign / retire"]}/>
    <KeyObservation title="Rulebook lifecycle"><p><strong>Design → deploy → monitor → challenge → simplify → retire.</strong> A production rule is a continuing claim on control capacity, not a monument to the event that created it.</p></KeyObservation>
  </section>

  <section id="anatomy"><h2>A rule is condition, consequence, precedence and ownership</h2>
    <Formula label="Conceptual rule"><span className={styles.formula}>Ruleₖ: X → Action</span></Formula><Formula label="Executable condition"><span className={styles.formula}>Conditionₖ(Xᵢ) = True ⇒ Actionₖ</span></Formula>
    <p>The action may reject, refer, reduce a limit, require evidence, restrict a product or route to manual review. The Boolean expression is only the condition. Production also needs consequence, declared precedence, accountable ownership and evidence.</p>
    <ResourceTable caption="Canonical Entimema rule specification" headers={["Field","Control question"]} rows={[["Rule ID","Can code, policy and monitoring identify the exact control?"],["Purpose","What specific risk or requirement does it control?"],["Inputs","Are source, unit, period, currency and grain explicit?"],["Condition","Are logic, missing state and boundary unambiguous?"],["Action","What controlled consequence follows?"],["Precedence","What wins when several rules fire?"],["Reason code","Which stable business reason is emitted?"],["Owner / dates","Who decides; when effective, reviewed or expired?"],["Monitoring","Hits, contribution, interactions, overrides and outcomes?"]]}/>
    <div className={styles.grid}>{[["Eligibility","Applicant or product entry."],["Credit policy","Mandatory credit constraints."],["Affordability","Debt-servicing capacity."],["Fraud / integrity","Identity and application integrity."],["Product","Product-specific constraints."],["Strategy","Risk appetite and thresholds."],["Operational","Process and data quality."]].map(([a,b])=><article key={a}><strong>{a}</strong><span>{b}</span></article>)}</div>
    <p>These families should not be mixed casually. A <strong>model</strong> ranks or estimates uncertainty; a <strong>policy rule</strong> imposes a discrete organisational constraint. <strong>Model prediction ≠ policy decision.</strong> A low-risk applicant can fail policy; a policy-eligible applicant can remain high risk.</p>
    <div className={styles.compare}><article><h3>Hard rule</h3><p>Violation produces a mandatory action.</p></article><article><h3>Soft rule</h3><p>Evidence changes tier, review, limit or verification without automatically forcing rejection.</p></article></div>
    <h3>Precedence is policy—not whatever code runs last</h3><p>One illustrative hierarchy is <strong>fraud reject → mandatory policy reject → affordability fail → risk strategy → pricing and limit</strong>. Another hierarchy may be valid; accidental execution order is not.</p>
    <ResourceTable caption="Illustrative conflict matrix" headers={["Risk","Affordability","Policy / fraud","Resolved action"]} rows={[["Approve","Refer","Pass","Refer"],["Approve","Pass","Hard reject","Reject"],["Reject","Pass","Pass","Reject / governed review"],["Approve","Pass","Fraud verify","Stop / verify"]]}/>
    <p>A rule can legitimately invert model rank: applicant A has PD 2%, B has PD 5%, yet A fails mandatory policy while B passes. The inversion must be intentional, traceable and distinguishable from accidental model duplication.</p>
  </section>

  <section id="contribution"><h2>Measure decision effect, not trigger noise</h2>
    <Formula label="Rule hit rate"><span className={styles.formula}>HitRateₖ = Applications triggering Ruleₖ / Total applications</span></Formula><Formula label="Unique reject contribution"><span className={styles.formula}>UniqueRejectₖ = P(Rₖ = 1 ∧ Rⱼ≠ₖ = 0)</span></Formula><Formula label="Pairwise overlap"><span className={styles.formula}>Overlap(A,B) = P(Rₐ = 1, Rᵦ = 1)</span></Formula>
    <p>High hit rate can mean powerful or over-broad; low can mean targeted or obsolete; zero can mean dormant, broken or unreachable. The sharper question is: <strong>how much decision effect exists only because this rule is present?</strong></p>
    <ResourceFigure label="Rule interaction map showing unique populations, overlap and shadowing." caption="Overlap can be legitimate when controls address distinct risks. A shadowed rule cannot influence the action because an earlier rule always wins."><div className={styles.overlap}><span>RULE A<small>unique</small></span><span>RULE B<small>overlap</small></span><span>RULE C<small>shadowed</small></span></div></ResourceFigure>
    <p>A <strong>dead rule</strong> never fires, cannot be reached, references an obsolete population or uses unavailable data. A <strong>shadowed rule</strong> may fire in diagnostics but never alter action. Separate rule hits from unique decisions caused: one application can trigger five rules and still represent one rejection. First-fail logging is cheaper; all-fail logging yields richer interaction evidence. Attribution must be explicit.</p>
  </section>

  <section id="inventory"><h2>A twelve-rule lender reveals four kinds of control</h2><p>This fictional digital consumer lender uses invented percentages and no real thresholds.</p>
    <ResourceTable caption="Fictional 12-rule diagnostic; overlap is conditional among each rule's hits" headers={["ID","Purpose","Hit","Unique reject","Largest overlap","Evidence","Complexity","Decision"]} rows={inventory}/>
    <p>R01, R04, R05 and R07 materially affect decisions. R06 and R08 mostly reproduce nearby controls. R10 is dead; R11 is fully shadowed. R02 and R12 have valid purposes but weak implementations.</p>
    <ResourceFigure label="Rule graveyard diagnostic using age, hits, unique contribution, evidence and complexity." caption="Age prompts review; it does not decide retirement. Mandatory controls can remain without predictive uplift, while old complex rules with no unique effect demand challenge."><div className={styles.diagnostic}><div><b>PROTECT</b><strong>Necessary control</strong><small>Policy necessity / owner</small></div><div><b>PROVE</b><strong>High hit, weak evidence</strong><small>Challenge mechanism</small></div><div><b>SIMPLIFY</b><strong>Overlap, low uniqueness</strong><small>Merge or redesign</small></div><div><b>REMOVE</b><strong>Dead or shadowed</strong><small>Governed retirement</small></div></div></ResourceFigure>
  </section>

  <section id="evidence"><h2>Outcome evidence is necessary—and selectively observed</h2>
    <p>Ideally, applicants caught by a risk rule should show materially different loss or value. Rejected applicants often have no repayment outcome. Historical policy changes, manual overrides, challenger experiments, lawful external bureau outcomes and neighbouring approved populations provide partial evidence, not the missing counterfactual.</p>
    <p>Overrides can be limited natural experiments, but selection is non-random. When a rule is relaxed, newly approved applicants can inform its prior value if change exposure and vintages are tracked. Preserve the uncertainty developed in <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>.</p>
    <KeyObservation title="Different burden of evidence"><p>Legal, mandatory-policy and explicit risk-appetite constraints do not need predictive uplift like discretionary risk rules. They still need purpose, correct implementation, ownership, scope and review.</p></KeyObservation>
  </section>

  <section id="complexity"><h2>Production complexity is a scarce resource</h2>
    <Formula label="Conceptual complexity test"><span className={styles.formula}>RuleValueₖ &gt; ComplexityCostₖ</span></Formula><Formula label="Rule value framework"><span className={styles.formula}>RuleValue = f(Risk control, Decision contribution, Policy necessity, Operational value)</span></Formula>
    <p>This is a challenge framework, not a scoring formula. Development, data, latency, monitoring, governance, explanation, interactions and production risk all consume capacity. A complex rule can be justified when it controls material risk.</p>
    <ResourceFigure label="Conceptual complexity versus decision-value frontier." caption="Early controls add substantial value; duplicates and exception chains produce diminishing returns. The objective is efficient complexity, not the fewest rules."><div className={styles.frontier}><i>DECISION VALUE / RISK CONTROL</i><span></span><b>efficient frontier</b><em>RULEBOOK COMPLEXITY →</em></div></ResourceFigure>
    <h3>Twelve rules become eight</h3><ResourceTable caption="Fictional challenger rulebook" headers={["Change","Rules","Result"]} rows={[["Keep","R01, R03, R04, R05, R07, R09","Six identifiable controls remain."],["Merge","R06 into R05; R08 into R07 / strategy","Duplicate hard rejects become calibrated treatments."],["Retire","R10 and R11","Dead and fully shadowed logic leave production."],["Redesign","R02 + R12","One evidence-routing rule replaces two costly branches."]]}/>
    <p>Replay champion and challenger against the same applications and compare decisions, reasons, latency, data cost and operational load. Historical replay cannot supply outcomes for all prior rejects, so preserved risk control remains a monitored hypothesis.</p>
    <EntimemaFramework title="Keep / Merge / Redesign / Retire" steps={["Purpose","Hit rate","Unique contribution","Outcome evidence","Overlap","Complexity","Decision"]}/>
  </section>

  <section id="implementation"><h2>Written and executable policy must reconcile exactly</h2>
    <p>“Debt burden must not exceed X” is not executable until gross/net income, period, currency, household/applicant grain, rounding and missing-data behaviour are defined. Translation risk lives in definitions as much as code.</p>
    <Formula label="Boundary test"><span className={styles.formula}>For X &gt; c test: c − ε &nbsp; | &nbsp; c &nbsp; | &nbsp; c + ε</span></Formula>
    <p>Golden applications should exercise true, false, exact boundary, missing input, interaction, precedence and reason code. Independently reconcile policy, code and test output. Use cheap eligibility before expensive calls when outcome-equivalent; do not request extensive evidence after a known hard stop. Outages and missing inputs need explicit retry, alternative source, refer or controlled-decline paths—never arbitrary substitution.</p>
    <p>Cascades matter: product eligibility selects product; product selects affordability; affordability redirects strategy. Upstream changes need end-to-end replay. Stable business reason families can consolidate several technical conditions without returning meaningless “Rule 147 failed”.</p>
    <h3>Monitor contribution through time</h3><Formula label="Time-varying diagnostics"><span className={styles.formula}>HitRateₖ,ₜ &nbsp; | &nbsp; UniqueRejectₖ,ₜ &nbsp; | &nbsp; OverrideRateₖ,ₜ</span></Formula>
    <p>Rule impact drifts as channel, product, vintage or grade mix changes. Monitor hit distributions like composition, but do not invent a pseudo-PSI: ask whether decision contribution is changing.</p>
    <div className={styles.chain}>{["Applications","− Eligibility","− Policy","− Fraud","− Affordability","− Risk strategy","= Approved"].map(x=><span key={x}>{x}</span>)}</div>
    <p>Decompose the funnel by unique final cause. Retain <strong>RulebookVersionₜ</strong> beside model, cut-off, pricing and affordability versions. Log old/new logic, rationale, expected impact, testing, owner and effective date. Temporary controls add review, expiry and sunset conditions. Portfolio concentration may require dynamic capacity logic rather than a static borrower reject.</p>
  </section>

  <section id="failure-modes"><h2>Common failures turn complexity into false control</h2><ResourceTable caption="Rulebook failure modes" headers={["Failure","Why it fails"]} rows={failures}/></section>

  <section id="non-bank"><h2>Non-bank lenders can simplify faster—and accumulate faster</h2><p>Small teams, digital origination and rapid deployment make tactical additions easy. Short feedback loops also enable faster challenge. In high-risk consumer lending, excessive hard rules can collapse approval, distort model ranking, concentrate the residual book and hide which controls work.</p><p>Short-tenor outcomes mature relatively quickly, supporting champion/challenger, hit monitoring and vintage comparison. Fast maturity improves evidence; it does not eliminate selection bias or justify uncontrolled experiments.</p></section>

  <section id="agent"><h2>A Credit Policy Rule Governance Agent can make challenge continuous</h2><p>A future agent can ingest inventory, map dependencies, calculate hits and unique contribution, detect dead and shadowed rules, identify overlap, monitor versions and overrides, simulate removal or merging, compare rulebooks and assemble governance evidence.</p><p>Its role is <strong>rule analytics + simplification + monitoring + governance support</strong>. It must not change production policy, approve or reject borrowers, or remove mandatory controls. Human governance retains authority.</p>
    <div className={styles.chain}>{["Credit Policy Rule Governance Agent","Credit Decision Strategy Agent","Portfolio Migration & Early Warning Agent","Model Validation Agent"].map(x=><span key={x}>{x}</span>)}</div>
    <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for policy design, rulebook review, appetite implementation and strategy optimisation.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for rules-engine architecture, migration, simplification, monitoring and automation.</p></article></div>
  </section>

  <section id="resolve"><h2>The production test is whether the rule still deserves to decide</h2><p>The workflow is <strong>inventory → metadata and ownership → hit extraction → overlap matrix → unique decision contribution → outcome evidence → complexity assessment → challenger rulebook → replay → governance approval → deployment.</strong></p>
    <KeyObservation title="The resolve"><p><strong>Define purpose → implement explicitly → observe hits → measure unique contribution → test outcomes → challenge overlap → simplify → version → monitor.</strong> The objective is a rulebook where every unit of complexity protects a necessary boundary or creates identifiable decision value.</p></KeyObservation>
    <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>, <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>, <Link href="/resources/credit-risk-model-validation">Credit Risk Model Validation</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link> and <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>.</p>
  </section>
</div>}
