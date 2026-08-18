import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./affordability-decisioning.module.css";

export const affordabilityDecisioningSections = [
  { id: "two-dimensions", label: "Risk and affordability" }, { id: "capacity", label: "Capacity architecture" },
  { id: "income", label: "Income and expenditure" }, { id: "ratios", label: "DTI, DSTI and residual" },
  { id: "stress", label: "Stressed affordability" }, { id: "product", label: "Product and pricing" },
  { id: "applicant", label: "End-to-end applicant" }, { id: "decisioning", label: "Decision engine integration" },
  { id: "monitoring", label: "Evidence and monitoring" }, { id: "non-bank", label: "Non-bank perspective" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Affordability Agent" },
] as const;

const failures = [
  ["Affordability treated as PD", "A default target still produces a credit-risk model; it does not measure capacity under the proposed payment."],
  ["Low PD treated as sufficient", "Strong historical behaviour cannot create current cash-flow capacity."], ["DTI used for payment burden", "Balance leverage does not encode rate, tenor or periodic instalment."],
  ["DSTI without residual income", "Equal ratios can leave radically different money for essential life and shocks."], ["Declared income accepted", "Unreliable or stale evidence inflates apparent capacity."],
  ["Variable income treated as salary", "One month or a simple average can hide seasonality, trend and downside months."], ["Essential costs understated", "Implausibly low declarations convert necessities into fictional disposable income."],
  ["Obligations double-counted or missed", "Both errors corrupt capacity; revolving facilities need an explicit burden assumption."], ["No product-relevant stress", "Current margin can disappear under rate, income or expense movement."],
  ["Higher risk simply repriced", "A higher rate can make the payment unaffordable and worsen the risk it was meant to compensate."], ["Tenor extended mechanically", "Lower payment may increase lifetime interest, duration and credit risk."],
  ["One threshold for every product", "Cash-flow timing and utilisation differ across instalment, revolving and short-tenor lending."], ["Fixed rules through economic change", "Inflation, rates and income conditions alter what a historical boundary means."],
  ["Overrides lack governance", "Unstructured discretion produces inconsistency and destroys evidence."], ["Rejected cases labelled bad", "Their repayment performance is unobserved; simple backtesting cannot recover it."],
  ["Affordability confused with profit", "Capacity answers whether payment is sustainable; economics answers whether the offer creates value."],
];

export default function AffordabilityDecisioningArticle(){return <div className={styles.articleBody}>
  <section id="two-dimensions"><p className={styles.lead}>Credit risk asks whether a borrower is likely to fail. Affordability asks whether this obligation is sustainable after income, existing commitments and essential expenditure. The questions overlap; they are not interchangeable.</p>
    <div className={styles.dual}><article><b>CREDIT RISK</b><strong>PDᵢ = P(Defaultᵢ)</strong><span>How likely is failure?</span></article><i>≠</i><article><b>AFFORDABILITY</b><strong>Capacity − proposed payment</strong><span>Can this obligation be carried?</span></article></div>
    <p>A borrower can have excellent repayment history, a strong bureau score and low estimated PD yet lack capacity for a large new loan. Another can have moderately higher PD and a strong current margin. Therefore <strong>low PD ⇏ affordable</strong>, and <strong>affordable ⇏ low PD</strong>.</p>
    <ResourceFigure label="Credit risk by affordability decision matrix." caption="Risk and capacity are complementary decision dimensions, not competing estimates of the same quantity."><div className={styles.matrix}><span></span><b>AFFORDABLE</b><b>NOT AFFORDABLE</b><b>LOW CREDIT RISK</b><article><strong>Strong candidate</strong><small>Subject to policy and economics</small></article><article><strong>Capacity problem</strong><small>Do not let low PD override it</small></article><b>HIGH CREDIT RISK</b><article><strong>Risk problem</strong><small>Capacity does not neutralise loss risk</small></article><article><strong>Risk + capacity problem</strong><small>Both dimensions constrain</small></article></div></ResourceFigure>
    <p>Historical payment behaviour and bureau data partly reflect <strong>willingness to pay</strong>. Income, obligations, expenditure and buffers partly reflect <strong>capacity to pay</strong>. Neither is perfectly observable. A mature architecture estimates them independently before risk, policy, pricing, limit and strategy resolve the action.</p>
  </section>

  <section id="capacity"><h2>Affordability reconstructs capacity before it tests the loan</h2>
    <EntimemaFramework title="Entimema Affordability Architecture" description="Capacity first; proposed obligation second; risk and economics after the affordability evidence is explicit." steps={["Verified income","Income stability","Existing obligations","Essential expenditure","Disposable income","Proposed debt service","Current residual income","Stress scenario","Stressed residual income","Affordability assessment","Risk / economics / strategy","Decision"]}/>
    <Formula label="Disposable income"><span className={styles.formula}>Disposable income = verified recurring income − existing debt service − essential expenditure</span></Formula>
    <Formula label="Affordability margin"><span className={styles.formula}>Affordability margin = disposable income − proposed debt service</span></Formula>
    <p>A positive margin is a starting condition, not proof of resilience. A margin of €1 is technically positive and economically fragile. The decision needs a buffer whose adequacy depends on product, population, evidence and approved policy—not a universal threshold.</p>
  </section>

  <section id="income"><h2>The income number is a definition, an evidence claim and a forecast</h2>
    <p>Gross, net, applicant, household, declared, verified, recurring and variable income are not interchangeable. The chosen definition needs a consistent period, currency, ownership and evidence basis. Payroll, bank transactions, tax information where lawfully available and employer confirmation can support verification; privacy, consent and proportionality remain design constraints.</p>
    <div className={styles.compare}><article><h3>Borrower A</h3><strong>€2,500 every month</strong><p>Stable timing and level make the average relatively representative.</p></article><article><h3>Borrower B</h3><strong>€2,500 average</strong><p>Monthly income ranges from €1,400 to €4,000. The same average can support far less dependable debt service.</p></article></div>
    <Formula label="Conceptual income volatility"><span className={styles.formula}>Income volatility = f(variance, seasonality, trend)</span></Formula>
    <p>Salary, bonus, commission, overtime, freelance and rental income can have different reliability and recurrence. Conservative treatment or a haircut should follow evidence, volatility and forward sustainability—not a fixed percentage imported from another portfolio.</p>
    <h3>Essential expenditure is not whatever remains after debt</h3><p>Housing, food, utilities, transport, dependants and other essentials consume income before a new payment. Actual observed expenses are personalised but noisy; standardised assumptions scale but can miss circumstance. A hybrid can use observed costs subject to reasonableness floors.</p>
    <Formula label="Minimum living-cost floor"><span className={styles.formula}>Essential expenditure = max(observed essential cost, minimum reasonable cost)</span></Formula>
    <p>Household composition, dependants and housing status can inform segmentation, but excessive complexity and inappropriate personal-data use do not improve control. Obligations need the same discipline: instalment loans, cards, overdrafts, leases and recurring commitments must be consolidated without double counting. Revolving exposure requires an explicit plausible payment burden; unused limits may matter differently by product and utilisation design.</p>
  </section>

  <section id="ratios"><h2>DTI measures leverage; DSTI measures payment burden</h2>
    <Formula label="Debt-to-income ratio"><span className={styles.formula}>DTI = debt balance / income</span></Formula><Formula label="Debt-service-to-income ratio"><span className={styles.formula}>DSTI = periodic debt service / periodic income</span></Formula>
    <ResourceTable caption="Same debt and income; different payment burden" headers={["Borrower","Debt","Annual income","Rate / remaining tenor","Monthly debt service","DTI","DSTI"]} rows={[["A","€24,000","€48,000","5% / 5 years","€453","50%","11.3%"],["B","€24,000","€48,000","13% / 2 years","€1,141","50%","28.5%"]]}/>
    <p>Both borrowers have identical DTI. Borrower B carries more than twice the monthly burden because rate and tenor differ. <strong>DTI ≠ DSTI</strong>: one is a stock relationship; the other is a cash-flow relationship.</p>
    <Formula label="Residual income"><span className={styles.formula}>Residual income = income − existing debt service − essential expenditure − proposed debt service</span></Formula>
    <ResourceTable caption="An identical 40% DSTI can conceal different residual capacity" headers={["Borrower","Income","Total debt service (40%)","Essential expenditure","Residual income"]} rows={[["A","€1,500","€600","€750","€150"],["B","€6,000","€2,400","€2,200","€1,400"]]}/>
    <p>A ratio measures burden proportion; residual income measures remaining capacity. Both matter. A relative buffer can be expressed as residual income divided by income, but the absolute margin still reveals how much shock can actually be absorbed.</p>
  </section>

  <section id="stress"><h2>Current affordability is a point estimate; stressed affordability tests resilience</h2>
    <Formula label="Stressed residual income"><span className={styles.formula}>Residual incomeˢ = incomeˢ − debt serviceˢ − expensesˢ</span></Formula>
    <p>For repricing products, rates can raise payments. Variable-income or cyclical borrowers can experience income falls. Inflation can raise essentials while income and contractual payment remain unchanged. Product-relevant stress can combine all three without pretending one shock is universal.</p>
    <ResourceTable caption="Illustrative multi-factor stress" headers={["Component","Current","Stress","Change"]} rows={[["Verified income","€3,200","€2,880","−10%"],["Existing debt","€650","€650","unchanged"],["Essential expenditure","€1,200","€1,296","+8%"],["Proposed payment","€700","€805","+15%"],["Residual income","€650","€129","−€521"]]}/>
    <ResourceFigure label="Current and stressed affordability matrix." caption="A current pass is not one state: stress separates robust capacity from a fragile point estimate."><div className={styles.stressMatrix}><span></span><b>STRESS PASS</b><b>STRESS FAIL</b><b>CURRENT PASS</b><article><strong>Robust affordability</strong></article><article><strong>Fragile affordability</strong></article><b>CURRENT FAIL</b><article><strong>Structural issue</strong></article><article><strong>Severe issue</strong></article></div></ResourceFigure>
  </section>

  <section id="product"><h2>Affordability belongs to borrower × product—not borrower alone</h2>
    <Formula label="Product-specific affordability"><span className={styles.formula}>Affordability = f(borrower, product, amount, tenor, rate)</span></Formula>
    <p>The same person may afford €5,000 and not €20,000. The engine can solve for a maximum affordable amount, <strong>Amount*</strong>, subject to capacity, risk and policy constraints. Longer tenor can lower monthly payment while increasing total interest, exposure duration and lifetime risk; payment minimisation is not decision optimisation.</p>
    <KeyObservation title="Risk-based pricing paradox"><p><strong>Risk ↑ ⇒ price ↑, but price ↑ ⇒ affordability ↓.</strong> Charging more to compensate for higher risk can reduce the borrower’s ability to pay. Pricing cannot be optimised independently of affordability.</p></KeyObservation>
    <ResourceFigure label="Affordability frontier across product structures." caption="The feasible offer region ends where stressed residual income reaches the approved buffer. More amount, higher price or shorter tenor can move an offer beyond the frontier."><div className={styles.frontier}><i>MAXIMUM SUSTAINABLE DEBT SERVICE</i><span></span><b>FEASIBLE OFFER REGION</b><em>AMOUNT / PRICE / PAYMENT LOAD →</em></div></ResourceFigure>
    <p>A lower limit can reduce expected loss and burden. An alternative amount or tenor may pass where the request fails, but only if the revised offer remains acceptable for total cost, lifetime risk, economics and policy. “Approve at adjusted amount” is a governed action, not a disguised approval target.</p>
  </section>

  <section id="applicant"><h2>One applicant passes today and becomes fragile under stress</h2>
    <p>Consider a fictional applicant with verified net income of €3,200, existing monthly debt of €650, essential expenditure of €1,200, a proposed payment of €700 and PD of 2.9%.</p>
    <ResourceTable caption="Current affordability calculation" headers={["Measure","Calculation","Result"]} rows={[["DSTI","(€650 + €700) / €3,200","42.2%"],["Disposable income","€3,200 − €650 − €1,200","€1,350"],["Residual income","€1,350 − €700","€650"],["Buffer ratio","€650 / €3,200","20.3%"]]}/>
    <p>Current affordability is positive. Under the illustrative combined stress above, residual income falls to €129. The low PD does not erase that fragility. A reasonable fictional decision is not automatic rejection or approval: the requested structure fails the lender’s approved stress-margin design and moves to product simulation.</p>
    <ResourceTable caption="Requested versus alternative offer" headers={["Offer","Monthly payment","Current residual","Stressed payment","Stressed residual","Capacity result"]} rows={[["Requested amount / tenor","€700","€650","€805","€129","Fails illustrative stress buffer"],["Lower amount / longer tenor","€520","€830","€598","€336","Passes illustrative stress buffer"]]}/>
    <p>The alternative passes capacity in this example. It still requires a fresh check of PD, expected loss, total interest, exposure duration, price, policy and customer outcome. The decision is <strong>approve at adjusted terms only if the complete economics remain acceptable</strong>.</p>
  </section>

  <section id="decisioning"><h2>Affordability becomes useful when the engine can act on it</h2>
    <p>A practical orchestration can be <strong>eligibility → policy → fraud → affordability → risk → economics → strategy</strong>, although data cost and system design can change the order. Cheap early checks may precede expensive verification; sophisticated affordability may run later with product simulation.</p>
    <EntimemaFramework title="Practitioner Decision Logic" steps={["Verify income","Reconstruct obligations","Estimate essential costs","Calculate capacity","Stress capacity","Compare proposed payment","Combine with risk","Optimise amount / terms","Decide","Monitor"]}/>
    <div className={styles.chain}>{["Application data","Income verification","Obligation data","Expense architecture","Current affordability","Stress affordability","Risk model","Product simulation","Decision strategy","Reason code","Monitoring"].map(x=><span key={x}>{x}</span>)}</div>
    <Formula label="Conceptual decision optimisation"><span className={styles.formula}>max amount, tenor, price Expected value &nbsp; subject to affordability, risk and policy constraints</span></Formula>
    <p>Affordability determines whether payment is plausible. Expected economics determines whether the lender should offer. A highly affordable borrower can still be economically unattractive. Stable internal reason families include insufficient recurring income, excessive existing debt service, insufficient residual income, stressed failure and insufficient verification; customer communication should translate these through approved policy, not expose raw technical language.</p>
  </section>

  <section id="monitoring"><h2>Capacity evidence must survive production outcomes</h2>
    <p>Affordability is point-in-time. Job loss, new debt, inflation, household change and stale income data can move it quickly. Existing-customer transactions can inform recurring income, essential spending, end-of-month balance, overdraft dependence and volatility where lawful and governed. More external or open-banking data is useful only when reliability, latency, consent, cost and incremental decision value justify it.</p>
    <p>Track application failures by income verification, current affordability and stressed affordability. Monitor overrides, manual-review resolution, strategy version and vintages. Compare affordability bands using early delinquency, repeated arrears, hardship or restructure, utilisation stress and default—but do not define success only as absence of default.</p>
    <Formula label="Vintage affordability monitoring"><span className={styles.formula}>Outcome rateᵥ, affordability band &nbsp; | &nbsp; override rateₜ &nbsp; | &nbsp; threshold-neighbour outcomes</span></Formula>
    <p>Examine observations around a threshold, c − Δ and c + Δ, where approvals create observable evidence. Applicants rejected for affordability have no loan outcome, so their true performance is partly unobserved. Policy changes and marginal new approvals help, but selection bias remains. Connect this limitation to <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>.</p>
    <p>Post-origination income decline, rising utilisation and shrinking balances can support <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>. Revolving limits connect capacity to utilisation and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD and credit conversion factors</Link>: current drawings may be affordable while full utilisation is not.</p>
  </section>

  <section id="non-bank"><h2>Non-bank lenders need transparency at decision speed</h2>
    <p>Non-bank consumer lenders often combine high application volume, small loans, fast decisions, higher-risk populations, thinner income evidence and quickly maturing outcomes. A transparent capacity framework supplies an independent control where a score alone could approve an unsustainable burden.</p>
    <p>For short-tenor lending, payment size and timing relative to monthly cash flow may dominate annual DTI. Recent applications can signal obligations not yet visible in balance data. The methodology must match product cash-flow structure without turning uncertainty into automatic adverse action.</p>
  </section>

  <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Affordability design failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

  <section id="agent"><h2>An Affordability & Capacity Agent can prepare evidence—not decide the borrower</h2>
    <p>A future agent can ingest verified income, identify recurring flows, estimate volatility, consolidate obligations, estimate essentials, calculate DTI, DSTI and residual income, run approved stresses, test alternative amounts and tenors, identify fragile capacity, compare capacity with PD, prepare decision evidence and monitor outcomes by strategy version.</p>
    <p>Its role is <strong>capacity analytics + product simulation + decision support</strong>. It must not autonomously make individual adverse lending decisions. Human-approved policy and accountable decision governance retain authority.</p>
    <div className={styles.chain}>{["Affordability & Capacity Agent","Credit Decision Strategy Agent","Credit Policy Rule Governance Agent","Portfolio Migration & Early Warning Agent"].map(x=><span key={x}>{x}</span>)}</div>
    <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for affordability methodology, underwriting analytics, policy and risk strategy.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for capacity engines, product simulation, orchestration and controlled automation.</p></article></div>
    <KeyObservation title="The resolve"><p><strong>Income → obligations → essential expenditure → disposable income → proposed debt service → stress → affordability margin → decision.</strong> The production question is: can this borrower sustainably carry this specific obligation—and how should that evidence change the offer?</p></KeyObservation>
    <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/credit-policy-rules-lending-rulebook-governance">Credit Policy Rules</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>, <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link> and <Link href="/resources/ifrs-9-ead-credit-conversion-factors">EAD & Credit Conversion Factors</Link>.</p>
  </section>
</div>}
