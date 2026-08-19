import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./risk-based-pricing.module.css";

export const riskBasedPricingSections = [
  { id: "decision", label: "Price is a decision" }, { id: "architecture", label: "Pricing architecture" },
  { id: "decomposition", label: "Economic decomposition" }, { id: "affordability", label: "Price changes capacity" },
  { id: "endogenous", label: "Endogenous risk" }, { id: "selection", label: "Adverse selection" },
  { id: "frontier", label: "Sustainable price" }, { id: "joint", label: "Price, limit and tenor" },
  { id: "portfolio", label: "Finance–Risk bridge" }, { id: "strategy", label: "Strategy implementation" },
  { id: "monitoring", label: "Evidence and monitoring" }, { id: "non-bank", label: "Non-bank perspective" },
  { id: "failures", label: "Failure modes" }, { id: "agent", label: "Pricing Agent" },
] as const;

const failures = [
  ["Price = EL + margin mechanically", "Funding, operations, capital, affordability, demand and selection remain outside the decision."], ["PD independent of price", "Payment burden and booked mix can change default risk."],
  ["Ignore affordability", "The risk premium can make the obligation unsustainable."], ["Ignore take-up", "An attractive conditional margin creates no booking economics if customers decline."],
  ["Ignore adverse selection", "Safer customers may leave faster as price rises."], ["Revenue linear in price", "Demand, utilisation and repayment change with the offer."],
  ["Ignore limit interaction", "Price and exposure jointly change revenue, EAD and burden."], ["Ignore tenor interaction", "Payment relief can extend lifetime exposure and loss."],
  ["Price every risk", "Required economic price can exceed affordability, market or policy ceilings."], ["Optimise nominal yield", "High APR can coexist with high loss and low expected value."],
  ["Ignore funding changes", "Margin attribution mistakes treasury movement for pricing performance."], ["Ignore operating and collections cost", "Fixed account cost and downstream treatment can dominate small loans."],
  ["Large band cliffs", "Small PD noise creates disproportionate customer and economic changes."], ["No pricing-version monitoring", "Outcomes cannot be tied to the strategy that produced them."],
  ["Compare booked populations naively", "Customer choice changes composition after repricing."], ["Replay treated as counterfactual truth", "Historical acceptance at an unoffered price is unobserved."],
  ["Overrides unmonitored", "Discounts or uplifts silently change assumed economics and take-up."], ["Ignore product and customer mix", "Average price changes can be misattributed to strategy."],
  ["No risk-adjusted margin attribution", "Management cannot reconcile price, funding, loss, volume, mix and cost."], ["Higher yield means better", "Yield can rise while booked PD and expected loss rise faster."],
  ["One function across products", "Different tenor, exposure, demand and cost structures require different mechanics."], ["Pricing outside the decision engine", "Price, limit, terms, policy and affordability can contradict each other."],
];

export default function RiskBasedPricingArticle(){return <div className={styles.articleBody}>
  <section id="decision"><p className={styles.lead}>Risk-based pricing is not a simple rule that higher risk should pay a higher rate. Price changes payment burden, affordability, demand, utilisation and selection—which means pricing can alter the risk it is intended to compensate for.</p>
    <div className={styles.decision}><article><b>BINARY DECISION</b><strong>Approve / Reject</strong><span>Is the borrower acceptable?</span></article><i>→</i><article><b>INTEGRATED OFFER</b><strong>Dᵢ = (Approve, Priceᵢ, Limitᵢ, Termsᵢ)</strong><span>Which offer creates sustainable value?</span></article></div>
    <p>Pure economic intuition says <strong>risk ↑ ⇒ price ↑</strong>. But price can also cause <strong>debt service ↑, affordability ↓, demand ↓ and adverse selection ↑</strong>. The transformation is from “what rate compensates for risk?” to “what price maximises sustainable risk-adjusted value after borrower response?”</p>
    <KeyObservation title="The strategic question"><p><strong>What price creates sustainable risk-adjusted value without changing the borrower population and payment burden so much that the economics collapse?</strong></p></KeyObservation>
  </section>

  <section id="architecture"><h2>Pricing is a credit decision system, not a commercial add-on</h2>
    <EntimemaFramework title="Entimema Risk-Based Pricing Architecture" description="Economic cost generates a candidate—not a final offer. Capacity, choice and selection resolve whether the price remains viable." steps={["PD / LGD / EAD","Expected loss","Funding / operating / capital cost","Candidate price","Affordability","Customer take-up","Adverse selection / booked risk","Expected value","Risk appetite / commercial constraint","Price / limit / terms","Realised performance","Repricing"]}/>
    <div className={styles.workflow}>{["Application data","PD / LGD / EAD","Funding / cost inputs","Candidate price grid","Payment simulation","Affordability","Demand / take-up","Expected value","Strategy decision","Offer","Outcome monitoring"].map(x=><span key={x}>{x}</span>)}</div>
  </section>

  <section id="decomposition"><h2>Expected loss is one economic component—not the whole price</h2>
    <Formula label="Conceptual price decomposition"><span className={styles.formula}>Price = Funding cost + Operating cost + Expected loss + Capital cost + Target margin</span></Formula>
    <Formula label="One-period expected loss"><span className={styles.formula}>EL = PD × LGD × EAD &nbsp; | &nbsp; EL rate = EL / Exposure</span></Formula>
    <p>This is economic intuition, not a universal lender formula. Every component can vary by borrower, product, tenor, exposure and market. Funding reflects currency, liquidity and tenor; operating cost includes acquisition, underwriting, servicing, payments, support and collections. A €500 and €20,000 loan can require similar processes, so fixed cost creates radically different cost rates.</p>
    <ResourceTable caption="Fictional €10,000 exposure with 45% LGD and otherwise equal cost inputs" headers={["Borrower","PD","Expected loss","EL rate","Pure economic implication"]} rows={[["A","2.0%","€90","0.90%","Lower risk cost"],["B","8.0%","€360","3.60%","€270 more expected loss; higher candidate price"]]}/>
    <p>Higher risk cost pushes Borrower B’s candidate rate upward. Yet high nominal yield does not imply high expected value: default, recovery, funding, collections, take-up and operating cost can consume it. Target margin must not hide weak unit economics.</p>
  </section>

  <section id="affordability"><h2>The price used to compensate for risk can weaken capacity</h2>
    <p>For the fictional higher-risk borrower, assume €3,200 monthly income, €650 existing debt service, €1,200 essential expenditure and a €10,000 loan over 36 months. The following payments are illustrative amortising calculations; neither rate is a recommendation.</p>
    <ResourceTable caption="Illustrative affordability under two prices" headers={["Measure","Lower price: 10%","Higher price: 18%"]} rows={[["Monthly payment","€323","€362"],["DSTI","30.4%","31.6%"],["Residual income","€1,027","€988"],["Stressed residual income","€375","€330"]]}/>
    <p>The higher price adds margin but removes €39 of monthly capacity and €45 of stressed capacity. The exact response is product-specific; the principle is not. Connect the full capacity architecture to <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>.</p>
    <Formula label="Endogenous default risk"><span className={styles.formula}>PD = f(Borrower risk, Price, Payment burden, Selection)</span></Formula>
  </section>

  <section id="endogenous"><h2>Static pricing freezes the very risk that price can change</h2>
    <div className={styles.compare}><article><h3>Static assumption</h3><strong>PD is fixed as price changes</strong><p>Useful for a first decomposition, but can overstate profitability when burden or selection responds.</p></article><article><h3>Endogenous pricing</h3><strong>PD(P), LGD(P), EAD(P)</strong><p>Customer burden, utilisation and booked composition can alter loss at the offered price.</p></article></div>
    <Formula label="Expected value by price"><span className={styles.formula}>EV(P) = Revenue(P) − Funding cost − Operating cost − PD(P) × LGD(P) × EAD(P) − Capital cost</span></Formula>
    <Formula label="Marginal pricing economics"><span className={styles.formula}>ΔEV(P) = EV(P + ΔP) − EV(P)</span></Formula>
    <ResourceFigure label="Expected risk-adjusted value by price." caption="Conceptual only: low price may under-recover cost; an intermediate region may create value; excessive price can reduce demand, capacity and selection quality. Real portfolios need not trace a smooth curve."><div className={styles.priceCurve}><b>EXPECTED RISK-ADJUSTED VALUE</b><span></span><i>SUSTAINABLE REGION</i><em>PRICE →</em></div></ResourceFigure>
    <p><strong>max Price ≠ max Expected Value.</strong> The relevant question is whether the next price increment still improves value after its response effects.</p>
  </section>

  <section id="selection"><h2>Price selects the portfolio as well as monetising it</h2>
    <Formula label="Risk-specific offer acceptance"><span className={styles.formula}>P(Accept offer | Risk, Price) → P(Risk | Accepted, Price)</span></Formula>
    <ResourceTable caption="Fictional adverse-selection example from 1,000 low-risk and 1,000 high-risk applicants" headers={["Segment","Lower-price take-up","Higher-price take-up","Lower booked","Higher booked"]} rows={[["Low risk","60%","25%","600","250"],["High risk","75%","65%","750","650"],["High-risk share of bookings","—","—","55.6%","72.2%"]]}/>
    <p>The applicant pool is unchanged, yet the higher price raises the high-risk share of booked customers by 16.6 percentage points because safer applicants leave faster. This relationship is not universal; elasticity can differ by channel, product, need and competition.</p>
    <Formula label="Conceptual demand elasticity"><span className={styles.formula}>Elasticity = %Δ Demand / %Δ Price &nbsp; | &nbsp; Expected EV(P) = P(Take-up | P) × EV(P | Take-up)</span></Formula>
    <p>Offer economics are conditional on making an offer; booked economics are conditional on customer acceptance. Declined expensive offers produce no repayment outcomes, so historical data reflects both lender strategy and customer choice. This differs from—but connects to—the selection problem in <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link>.</p>
    <ResourceFigure label="Price-risk feedback loop showing endogenous risk." caption="Price transmits risk cost into payment and customer choice; those responses change the realised risk returning to the strategy."><div className={styles.loop}>{["Risk","Price","Payment / affordability","Take-up","Booked mix","Realised risk"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
  </section>

  <section id="frontier"><h2>Some risk is economically unpriceable</h2>
    <Formula label="Sustainable pricing condition"><span className={styles.formula}>P risk ≤ min(P affordability, P market, P policy)</span></Formula>
    <p>P risk is the minimum price needed to cover approved risk economics. P affordability is the maximum sustainable price under capacity. P market is the highest likely acceptable competitive price. A viable region exists only where the minimum required price does not exceed every relevant ceiling.</p>
    <ResourceFigure label="Required-risk price versus sustainable-price frontier." caption="The overlap is the viable pricing region. When the risk-price floor moves beyond the affordability, market or policy ceiling, the correct output is no viable offer—not an extreme price."><div className={styles.sustainable}><div><b>REQUIRED RISK PRICE</b><span></span></div><div><b>MAXIMUM SUSTAINABLE / MARKET PRICE</b><span></span></div><i>VIABLE REGION</i><em>NO VIABLE OFFER →</em></div></ResourceFigure>
    <KeyObservation title="Unpriceable risk"><p>If the borrower requires a fictional minimum risk-adjusted price of <strong>13%</strong> but affordability becomes weak above <strong>11%</strong>, then required price &gt; sustainable price. The result is <strong>no viable offer</strong>, not a forced 13% rate.</p></KeyObservation>
  </section>

  <section id="joint"><h2>Price, limit and tenor must resolve as one offer</h2>
    <Formula label="Joint offer decision"><span className={styles.formula}>Dᵢ = (Priceᵢ, Limitᵢ, Tenorᵢ) subject to Risk, Affordability, Policy and Expected value</span></Formula>
    <p>A higher limit can raise revenue, EAD and payment burden; higher price changes affordability and take-up; longer tenor can lower monthly payment while extending exposure duration and lifetime loss. Optimising them independently can produce a self-contradictory offer. See <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>.</p>
    <ResourceTable caption="Fictional offer comparison for one borrower" headers={["Offer","Rate / amount / tenor","Payment","Expected loss","Expected revenue","Expected contribution"]} rows={[["A","9% / €8,000 / 24m","€365","€150","€760","€260"],["B","12% / €10,000 / 36m","€332","€230","€1,940","€410"],["C","18% / €12,000 / 48m","€353","€420","€4,950","€300"]]}/>
    <p>Offer C has the highest rate and revenue, yet weaker capacity, larger exposure, longer duration and loss reduce expected contribution below B. Values are deliberately fictional and simplify timing, prepayment, take-up and cost.</p>
  </section>

  <section id="portfolio"><h2>Finance can see higher yield while Risk sees a weaker book—and both can be right</h2>
    <ResourceTable caption="Fictional portfolio before and after repricing" headers={["Measure","Before","After"]} rows={[["Average offered rate","12.0%","15.0%"],["Take-up","68%","49%"],["Average booked PD","4.0%","5.8%"],["Expected loss rate","1.8%","2.6%"],["Expected contribution per offer","€86","€78"]]}/>
    <p>Nominal yield rises three points, but low-risk take-up falls, booked PD and EL rise, and expected contribution per offer declines. The integrated bridge is <strong>yield → take-up → risk mix → expected loss → realised margin</strong>.</p>
    <Formula label="Average-price attribution"><span className={styles.formula}>Δ Average price = Funding effect + Risk-mix effect + Strategy effect + Product-mix effect + Discount effect + Residual</span></Formula>
    <Formula label="Margin attribution"><span className={styles.formula}>Δ Margin = Price effect + Funding effect + Loss effect + Volume effect + Mix effect + Cost effect</span></Formula>
    <p><Link href="/services/credit-risk">Credit Risk</Link> connects risk-adjusted pricing, portfolio economics and credit strategy. The <Link href="/services/cfo-function">CFO Function</Link> connects funding, margin, profitability and forecast economics. <Link href="/services/decision-automation">Decision Automation</Link> connects candidate offers, orchestration and recurring monitoring.</p>
  </section>

  <section id="strategy"><h2>Pricing precision must remain stable, explainable and governable</h2>
    <div className={styles.compare}><article><h3>Risk bands</h3><p>Simple, transparent and operationally stable, but create cliffs and hide within-band differences.</p></article><article><h3>Continuous pricing</h3><p>More precise, but can be volatile, complex and harder to validate or explain.</p></article></div>
    <p>If PD 4.99% receives one rate and 5.01% a materially higher rate, model noise creates a commercial discontinuity. Boundary tests and controlled smoothness should challenge unjustified cliffs without pretending bands are always avoidable.</p>
    <p>Minimum price may cover funding, operations and EL, yet still fail affordability or market acceptance. Maximum price can reflect policy, product, customer treatment, regulation or market design. Internal reason families can record risk band, product, exposure, tenor and approved strategy; customer-facing explanations may require different governed language.</p>
    <p>Discounts trade unit margin for take-up or acquisition value. Manual discount and price-increase overrides need separate frequency, rationale and outcome monitoring. Repeated discounts can undermine expected economics; repeated uplifts can damage selection.</p>
  </section>

  <section id="monitoring"><h2>Pricing is validated through multiple populations and multiple clocks</h2>
    <Formula label="Pricing-strategy vintage"><span className={styles.formula}>Performanceᵥ,ₚ = take-up, default, loss, revenue and margin by vintage v and pricing version p</span></Formula>
    <p>Compare applicant, offered and booked risk distributions. A stable applicant distribution with rising booked risk after repricing can signal adverse selection. Population stability measures can support diagnosis across these layers, but <Link href="/resources/population-stability-index-credit-risk-model-monitoring">PSI</Link> alone cannot explain demand or economics.</p>
    <p>Leading evidence includes price, take-up, applicant-to-booked mix and affordability. Lagging evidence includes default, LGD, realised yield, collections cost and realised margin. Compare expected with realised value at portfolio and vintage level; one account is not expected to equal a probability-weighted forecast.</p>
    <p>Champion/challenger pricing should compare offers, acceptance, booked risk, affordability, expected value and mature outcomes. Replay can show whether a different price would have been offered; it cannot reveal whether the customer would have accepted it. Governed experiments can improve elasticity evidence, but lending experimentation requires strict risk, fairness and customer-treatment controls.</p>
  </section>

  <section id="non-bank"><h2>High-risk non-bank pricing makes the feedback loop especially consequential</h2>
    <p>In higher-risk consumer lending, expected loss can be substantial, operating cost per loan high, price sensitivity heterogeneous and adverse selection strong. This is exactly where <strong>risk ↑ ⇒ price ↑</strong> can become most dangerous: the premium can reduce capacity and retain the customers with the fewest alternatives.</p>
    <p>For short-tenor and small-ticket products, annualised nominal rates can be economically misleading. Actual cash-flow yield, fixed origination and servicing cost, expected loss, collections cost, affordability and customer value matter. Returning customers provide richer repayment and utilisation evidence, but better information does not justify rewarding deterioration with mechanically higher prices.</p>
    <p>Funding shocks, inflation and economic conditions can move PD, LGD, operating cost, capacity and demand at once. Pricing every loan to an extreme stress can destroy viability; current expected value should remain subject to scenario sensitivity and approved risk appetite.</p>
  </section>

  <section id="failures"><h2>Common failure modes</h2><ResourceTable caption="Risk-based pricing failures and why they fail" headers={["Failure","Why it fails"]} rows={failures}/></section>

  <section id="agent"><h2>A Risk-Based Pricing Optimisation Agent can simulate economics—not set ungoverned prices</h2>
    <p>A future Agent can ingest PD, LGD, EAD, funding and cost inputs; generate candidate prices; simulate payments; integrate affordability; estimate take-up scenarios and booked mix; calculate expected value; compare challengers; monitor realised margin by vintage; detect adverse selection; and attribute price and margin changes for human review.</p>
    <p>Its role is <strong>pricing simulation + economic optimisation + selection monitoring + decision support</strong>. It must not autonomously set discriminatory or ungoverned customer prices. Final production pricing remains subject to approved strategy, policy and applicable requirements.</p>
    <div className={styles.agent}>{["Affordability & Capacity Agent","Credit Limit Optimisation Agent","Risk-Based Pricing Agent","Credit Decision Strategy Agent"].map(x=><span key={x}>{x}</span>)}</div>
    <EntimemaFramework title="Practitioner Decision Logic" steps={["Estimate risk cost","Add economic costs","Generate candidate price","Test affordability","Estimate take-up","Test selection effect","Calculate expected value","Apply portfolio / policy constraints","Offer","Monitor"]}/>
    <KeyObservation title="The resolve"><p><strong>Risk → economic cost → candidate price → affordability → demand response → selection → expected value → strategy constraint → offer.</strong> Price is successful only when the economics survive the customer response it creates.</p></KeyObservation>
    <h3>Related research</h3><p>Continue with <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine Architecture</Link>, <Link href="/resources/affordability-decisioning-ability-to-pay">Affordability Decisioning</Link>, <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>, <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>, <Link href="/resources/ifrs-9-ead-credit-conversion-factors">IFRS 9 EAD &amp; Credit Conversion Factors</Link>, <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> and <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link>.</p>
  </section>
</div>}
