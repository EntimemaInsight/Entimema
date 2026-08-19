import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-limit-assignment.module.css";

export const creditLimitAssignmentSections = [
  { id: "approval", label: "Approval is not limit" }, { id: "architecture", label: "Limit architecture" },
  { id: "exposure", label: "Limit, EAD and loss" }, { id: "economics", label: "Marginal economics" },
  { id: "capacity", label: "Risk and capacity" }, { id: "utilisation", label: "Utilisation response" },
  { id: "portfolio", label: "Portfolio constraints" }, { id: "lifecycle", label: "Lifecycle management" },
  { id: "evidence", label: "Monitoring and evidence" }, { id: "implementation", label: "Implementation choices" },
  { id: "interactions", label: "Price, tenor and demand" }, { id: "non-bank", label: "Non-bank perspective" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Limit Optimisation Agent" },
] as const;

const failures = [
  ["Approve first; assign limit arbitrarily", "The largest risk choice after approval has no explicit analytical basis."], ["Higher score automatically means higher limit", "Ranking does not establish capacity, utilisation, absolute loss or portfolio fit."],
  ["Ignore affordability", "Low PD cannot make a fully drawn payment sustainable."], ["Ignore utilisation behaviour", "Equal offered limits can create radically different drawn exposure."],
  ["Treat limit as EAD", "Limit is capacity; EAD depends on drawn balance and future conversion."], ["Ignore undrawn exposure", "Today’s unchanged balance can conceal greater future exposure after an increase."],
  ["One CCF for incompatible customers", "Conversion behaviour can differ by product, tenure, risk and utilisation."], ["No full-utilisation stress", "Expected usage can pass while plausible high usage makes the borrower fragile."],
  ["Optimise revenue, not marginal value", "Extra usage can destroy value after loss, funding, operations and capital."], ["Assume revenue scales with limit", "Unused availability earns no proportional revenue."],
  ["Ignore price interaction", "Rate changes margin, demand and affordability together."], ["Ignore tenor interaction", "Lower payment may extend exposure and lifetime loss."],
  ["Ignore concentration", "An account-level optimum can breach segment or single-name capacity."], ["Reuse limits across products", "Term amounts and revolving commitments have different mechanics."],
  ["Do not monitor increases", "The strategy never learns whether extra capacity produced usage, value or loss."], ["Read increase outcomes causally", "Selected customers were usually stronger before treatment."],
  ["No strategy versioning", "Outcomes cannot be attributed to the rule, model or limit policy that created them."], ["Excessive overrides", "Unstructured discretion breaks consistency and weakens evidence."],
  ["Ignore unused limits", "Committed capacity and customer option value disappear from the analysis."], ["Monitor default rate only", "A stable rate can coexist with much larger absolute loss."],
  ["Offer a meaningless tiny limit", "The mathematical result may have no viable customer or product proposition."], ["Ignore take-up", "An offer creates economics only when accepted and used."],
  ["Allow limit inflation without attribution", "Exposure per borrower can rise before portfolio quality metrics visibly weaken."],
];

export default function CreditLimitAssignmentArticle(){return <div className={styles.articleBody}>
  <section id="approval"><p className={styles.lead}>Credit approval answers whether a borrower may receive credit. Limit assignment determines how much risk the lender chooses to create after approval.</p>
    <div className={styles.decision}><article><b>BINARY DECISION</b><strong>Dᵢ ∈ {`{Approve, Reject}`}</strong><span>Is the borrower acceptable?</span></article><i>→</i><article><b>EXPOSURE DESIGN</b><strong>Dᵢ = (Approve, Limitᵢ, Priceᵢ, Termsᵢ)</strong><span>At what exposure does acceptance remain attractive?</span></article></div>
    <p>Two applicants can both deserve approval without deserving the same exposure. The same low-risk, affordable and profitable borrower can be attractive at €3,000 and unattractive at €15,000 because amount changes expected loss, utilisation, affordability, funding, capital and concentration. Classification becomes optimisation.</p>
    <KeyObservation title="The strategic question"><p><strong>How much exposure should this borrower receive before the next euro of limit creates more risk than value?</strong></p></KeyObservation>
  </section>

  <section id="architecture"><h2>Limit assignment makes exposure an explicit decision variable</h2>
    <EntimemaFramework title="Entimema Credit Limit Architecture" description="The offer is resolved only after borrower, product, account and portfolio evidence meet." steps={["Borrower risk","Affordability","Current exposure","Product mechanics","Utilisation behaviour","EAD / CCF","Expected loss","Revenue / expected value","Risk appetite / portfolio constraint","Optimal limit range","Offer","Utilisation / performance","Limit reassessment"]}/>
    <p>The output should usually be an <strong>efficient range</strong> before operational rules select a permitted amount. A product floor, maximum, band, policy cap or concentration constraint is a commercial or governance boundary—not a statistical discovery.</p>
  </section>

  <section id="exposure"><h2>A limit is both a commercial offer and a risk boundary</h2>
    <Formula label="Undrawn capacity"><span className={styles.formula}>Undrawn = Limit − Drawn</span></Formula>
    <Formula label="Revolving exposure at default"><span className={styles.formula}>EAD(L) = Drawn + CCF × (Limit − Drawn)</span></Formula>
    <p>Limit is not EAD, but it defines the maximum capacity from which EAD can emerge. Increasing a line changes future potential exposure even when today’s balance does not move. CCF is illustrative and should be estimated for compatible products and behaviours.</p>
    <ResourceTable caption="One fictional borrower, three candidate limits (drawn €2,000; illustrative CCF 50%; PD 2.5%; LGD 45%)" headers={["Option","Limit","Undrawn","Expected EAD","Expected loss"]} rows={[["A","€4,000","€2,000","€3,000","€33.75"],["B","€8,000","€6,000","€5,000","€56.25"],["C","€12,000","€10,000","€7,000","€78.75"]]}/>
    <p>The borrower’s PD and current drawn balance are unchanged, yet expected EAD rises from €3,000 to €7,000 and illustrative EL from €33.75 to €78.75. Absolute EL matters beside <strong>EL rate = EL / EAD</strong>: identical loss rates applied to different exposure create different loss materiality. Larger exposures may also change LGD where collateral coverage, recovery capacity or collections economics vary; constant LGD requires evidence.</p>
  </section>

  <section id="economics"><h2>The next increment—not the account average—is the economic decision</h2>
    <Formula label="Expected value by limit"><span className={styles.formula}>EV(L) = Revenue(L) − FundingCost(L) − OperatingCost(L) − ExpectedLoss(L) − CapitalCost(L)</span></Formula>
    <Formula label="Marginal limit economics"><span className={styles.formula}>ΔEV(L) = EV(L + ΔL) − EV(L)</span></Formula>
    <p>There is no universal lender formula, but the decision principle is stable: does the next increment create sufficient risk-adjusted value? Revenue is <strong>f(utilisation, limit)</strong>, not simply f(limit); doubling availability does not double usage or revenue.</p>
    <ResourceFigure label="Marginal limit frontier showing diminishing and then negative incremental value." caption="Illustrative only: value can rise, flatten and fall as incremental revenue weakens relative to incremental EAD, loss and resource use. Real portfolios need not produce a smooth curve."><div className={styles.frontier}><span className={styles.value}></span><span className={styles.zero}></span><b>EXPECTED RISK-ADJUSTED VALUE</b><i>ECONOMIC LIMIT</i><em>LIMIT →</em></div></ResourceFigure>
    <div className={styles.marginal}>{["Limit increment","Incremental revenue","Incremental EAD","Incremental expected loss","Incremental value"].map(x=><span key={x}>{x}</span>)}</div>
    <p>An illustrative return-on-exposure lens, <strong>ROEAD = Expected contribution / Expected EAD</strong>, can expose capital or funding efficiency, but it is not a universal standard and should not replace absolute value or customer outcomes.</p>
  </section>

  <section id="capacity"><h2>Risk and capacity constrain different failure paths</h2>
    <Formula label="Limit constrained by risk, capacity and policy"><span className={styles.formula}>L* = min(L affordability, L risk, L policy)</span></Formula>
    <p><strong>Risk</strong> asks how likely and material loss is. <strong>Capacity</strong> asks how much debt the borrower can sustainably carry. Maximum affordable amount can be derived from sustainable payment P* under the approved rate and tenor; maximum risk amount is the greatest exposure consistent with EL, expected value and risk appetite. Neither ceiling can neutralise the other.</p>
    <ResourceFigure label="Risk quality by financial capacity limit matrix." caption="Directional outcomes only: amounts depend on product, economics, policy and portfolio context."><div className={styles.matrix}><span></span><b>HIGH CAPACITY</b><b>LOW CAPACITY</b><b>STRONGER RISK</b><article><strong>Higher feasible range</strong><small>Still subject to concentration</small></article><article><strong>Capacity-capped limit</strong><small>Or no viable offer</small></article><b>WEAKER RISK</b><article><strong>Risk-capped limit</strong><small>Capacity cannot offset loss</small></article><article><strong>Low limit or decline</strong><small>Both constraints bind</small></article></div></ResourceFigure>
    <p>Two borrowers can share PD = 2.5% while income, existing exposure and affordability justify different limits. Conversely, equal affordability margins can conceal different PD, LGD and conversion behaviour. “Higher score → higher limit” is therefore incomplete.</p>
    <Formula label="Full-utilisation stress"><span className={styles.formula}>Debt service full utilisation → stressed affordability margin</span></Formula>
    <p>For revolving credit, expected utilisation and stressed utilisation should both be understood. Full draw can be an informative stress where plausible, but it is not universally appropriate for every product or customer.</p>
  </section>

  <section id="utilisation"><h2>Identical limit actions can create very different exposure</h2>
    <Formula label="Conceptual utilisation elasticity"><span className={styles.formula}>Utilisation elasticity = %Δ Drawn / %Δ Limit</span></Formula>
    <ResourceTable caption="Fictional response to the same €2,000 limit increase" headers={["Customer","Increase","Change in drawn","Response","Exposure interpretation"]} rows={[["A","€2,000","€200","Low incremental use","Most capacity remains undrawn"],["B","€2,000","€1,600","High incremental use","Most new capacity becomes exposure"]]}/>
    <p>The metric is a reasoning device, not a universal model. Response may be zero, proportional, temporary or sustained and can differ by product, tenure, risk grade and customer need. Track offered limit, accepted amount, average drawn, peak drawn and EAD separately. <strong>Limit efficiency = Average drawn / Limit</strong> can describe use, but low utilisation is not automatically bad: availability itself can create customer and strategic value.</p>
  </section>

  <section id="portfolio"><h2>An account-level optimum may be unacceptable to the portfolio</h2>
    <Formula label="Segment capacity"><span className={styles.formula}>Available capacityₛ = Portfolio limitₛ − Current exposureₛ</span></Formula>
    <p>A low-risk account can still create material concentration. Segment, product and single-name boundaries translate portfolio risk appetite into exposure constraints rather than approval thresholds alone. Dynamic capacity can make an otherwise attractive increment less valuable when the portfolio is already concentrated.</p>
    <p>Limits may be capped by product, customer type, risk band or portfolio condition. Internal reason families—affordability ceiling, risk ceiling, policy cap, existing exposure and portfolio constraint—preserve why a request was reduced. Monitor override-up separately from override-down because they carry different risk implications.</p>
  </section>

  <section id="lifecycle"><h2>Limit strategy continues after origination</h2>
    <ResourceFigure label="Lifecycle credit limit management." caption="Initial assignment becomes a recurring governed decision as actual behaviour and refreshed evidence arrive."><div className={styles.lifecycle}>{["Origination","Usage","Behavioural review","Increase / maintain / decrease","Performance","Reassessment"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
    <p>Limit increases can use repayment history, utilisation, delinquency, refreshed income and bureau evidence. Deterioration can support maintain, reduce or freeze actions where policy, regulation and fair customer treatment permit. Rising utilisation after assignment can also feed <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>. These remain governed system or human decisions—not autonomous Agent actions.</p>
  </section>

  <section id="evidence"><h2>Limit-increase evidence has a counterfactual problem</h2>
    <Formula label="Limit-increase action vintage"><span className={styles.formula}>Performance limit increase v,t = outcome by action vintage v and months since change t</span></Formula>
    <p>Track Δ utilisation, Δ revenue, Δ EAD, Δ expected loss, funding and capital alongside delinquency, default, LGD and profitability. Increased accounts are rarely random: stronger customers may have been selected for treatment. Observed lower default after an increase does not show that the increase reduced risk.</p>
    <p>Champion/challenger strategies should compare exposure, revenue, loss, affordability, utilisation and concentration. Historical replay cannot reveal what a lower-limit customer would have done under a higher limit. Governed, small controlled tests can generate stronger evidence, but only inside risk appetite, affordability, customer-treatment and governance constraints.</p>
    <p>Monitor mean limit by risk grade, affordability band, product and channel to distinguish policy change from population-driven <strong>limit drift</strong>. Competitive limit inflation can raise absolute loss while default rates initially appear stable; compression can reduce revenue and customer value as well as loss.</p>
  </section>

  <section id="implementation"><h2>Operational precision must remain governable</h2>
    <div className={styles.compare}><article><h3>Continuous limits</h3><p>More precise and closer to the underlying optimum, but harder to explain, validate and operate.</p></article><article><h3>Discrete limit bands</h3><p>Simpler to implement and govern, but they discretise a continuous decision and create boundary effects.</p></article></div>
    <p>Product L min and L max are constraints. A mathematically optimal amount below the <strong>commercial minimum</strong> may be a poor proposition; if L* &lt; L commercial minimum, no offer can be preferable to a trivially small line. Strategy versions, reason codes and manual caps must travel with every recommendation.</p>
    <EntimemaFramework title="Practitioner Decision Logic" steps={["Estimate risk","Measure capacity","Forecast utilisation","Estimate EAD","Evaluate marginal economics","Apply portfolio constraints","Set limit","Monitor use","Reassess"]}/>
    <div className={styles.workflow}>{["Application / customer data","PD / score","Affordability","Existing exposure","Utilisation model","Candidate limits","EAD simulation","Expected loss / value","Strategy constraints","Limit recommendation","Monitoring"].map(x=><span key={x}>{x}</span>)}</div>
  </section>

  <section id="interactions"><h2>Amount, price, tenor and demand form one offer system</h2>
    <Formula label="Joint amount-price optimisation"><span className={styles.formula}>EV(L, P) subject to Affordability(L, P) and Risk(L, P)</span></Formula>
    <p>A higher limit may raise revenue and loss; a higher rate may raise nominal margin while reducing affordability, demand and usage. For term loans, amount and tenor jointly set payment. Consider €10,000 over 24 months versus €12,000 over 36 months: the longer structure may have a comparable payment, but it carries larger principal and a longer loss horizon. Payment alone cannot select the offer.</p>
    <ResourceTable caption="Illustrative amount–tenor trade-off before rate-specific calculation" headers={["Option","Amount / tenor","Payment effect","Affordability","Risk implication"]} rows={[["A","€10,000 / 24 months","Higher per euro borrowed","Tests near-term capacity","Shorter exposure horizon"],["B","€12,000 / 36 months","Tenor can moderate payment","May improve monthly fit","More principal and longer exposure"]]}/>
    <Formula label="Expected value including take-up"><span className={styles.formula}>Expected EV = P(Take-up | offer) × EV(Limit)</span></Formula>
    <p>Distinguish offered limit, accepted amount and actual utilisation. In some models the engine recommends a maximum while the customer chooses less. Take-up can depend on amount, price, need and competition, so commercial forecasts should not assume full acceptance or draw.</p>
  </section>

  <section id="non-bank"><h2>Non-bank lenders can learn quickly—but exposure moves quickly too</h2>
    <p>Revolving consumer credit, repeat lending, credit lines and dynamic top-ups give non-bank financial institutions short feedback cycles. Returning-customer repayment, usage, delinquency and refreshed capacity can support dynamic amounts. A top-up decision must evaluate <strong>total exposure after top-up</strong>, not only the increment.</p>
    <p>In higher-risk portfolios, modest amount changes can materially increase absolute EL because PD or LGD is already elevated. Rapid feedback strengthens monitoring; it does not justify weak affordability or autonomous limit expansion.</p>
  </section>

  <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Credit limit strategy failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

  <section id="agent"><h2>A Credit Limit Optimisation Agent can simulate exposure—not control it autonomously</h2>
    <p>A future Agent can ingest risk and affordability outputs, reconstruct current exposure, analyse utilisation, simulate candidate limits, estimate EAD, EL and contribution, apply approved portfolio constraints, identify an efficient range, compare champion/challenger strategies, monitor increase vintages and surface drift or utilisation anomalies for human review.</p>
    <p>Its role is <strong>limit simulation + exposure optimisation + monitoring + decision support</strong>. It must not autonomously increase or decrease customer limits without governed decision logic.</p>
    <div className={styles.agentChain}>{["Affordability & Capacity Agent","Credit Limit Optimisation Agent","Credit Decision Strategy Agent","Portfolio Migration & Early Warning Agent"].map(x=><span key={x}>{x}</span>)}</div>
    <div className={styles.compare}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Credit Risk</Link> for exposure strategy, portfolio optimisation, risk appetite and limit policy.</p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Decision Automation</Link> for candidate-limit simulation, dynamic assignment, lifecycle decisioning and monitoring.</p></article></div>
    <KeyObservation title="The resolve"><p><strong>Borrower risk → affordability → utilisation behaviour → expected loss → expected value → risk appetite → limit → monitoring and reassessment.</strong> Approval identifies an acceptable borrower; exposure design keeps the offer acceptable.</p></KeyObservation>
    <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD &amp; Credit Conversion Factors</Link>, <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>, <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/credit-policy-rules-lending-rulebook-governance">Credit Policy Rules</Link>.</p>
  </section>
</div>}
