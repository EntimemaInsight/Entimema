import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-12 — Financial Architecture. All example amounts, policies and entities are fictional. */
export const financialKpiTreesSections = [
  { id: "roles", label: "Classify metric roles" },
  { id: "architecture", label: "Construct the governed tree" },
  { id: "revenue", label: "Reconcile revenue" },
  { id: "margin", label: "Explain margin quality" },
  { id: "working-capital", label: "Connect operations to cash" },
  { id: "return", label: "Decompose return" },
  { id: "relationships", label: "Separate evidence from causality" },
  { id: "ownership", label: "Assign actionable ownership" },
  { id: "controls", label: "Validate every branch" },
  { id: "example", label: "Follow the integrated example" },
  { id: "decisions", label: "Translate findings into decisions" },
  { id: "failures", label: "Recognise false precision" },
  { id: "execution", label: "Execute the methodology" },
] as const;

export default function FinancialKpiTreesArticle() {
  return <>
    <p className={styles.leadParagraph}>The monthly dashboard reports revenue up 12%, production volume up 15%, gross margin down 2.3 percentage points, inventory days up 14 days, EBITDA up approximately 4%, operating cash down 38%, and ROIC down from 13.8% to 11.6%. Each KPI is correct. Growth looks favourable; margin quality weakens; earnings improve; cash and return deteriorate. The meeting cannot decide whether to accelerate the growth programme or contain it.</p>
    <p>The contradiction is interpretative, not mathematical. A flat KPI inventory hides the mechanisms connecting sales, production, costs, capital and cash. The example below resolves these signals using comparable annual periods presented in a monthly pack; production growth is deliberately distinguished from units sold.</p>
    <KeyObservation title="Executive thesis">A KPI tree is not a list of important metrics. It is a controlled model of how financial outcomes are constructed and where management can intervene. Outcome → Mechanism → Driver → Evidence → Decision. Every financial branch reconciles; every operational explanation retains its evidence boundary.</KeyObservation>

    <section id="roles">
      <h2>Metric role follows the question</h2>
      <ResourceTable caption="Three roles, three analytical jobs" headers={["Role", "Purpose", "Examples"]} rows={[
        ["Outcome", "The financial result to protect or improve", "Revenue, contribution, EBITDA, operating profit, operating cash, free cash flow, ROIC, liquidity headroom"],
        ["Driver", "A mathematical or operational mechanism influencing that result", "Volume, realised price, mix, material price, yield, labour productivity, DSO, DIO, DPO, utilisation"],
        ["Diagnostic", "Evidence investigating why a driver changed", "Discounts, churn, scrap, downtime, overdue ageing, disputes, slow stock, purchase-price variance, overtime, supplier concentration"],
      ]} />
      <p>DSO is a driver in a working-capital analysis; overdue ageing diagnoses its movement. Operating cash is an outcome in a liquidity tree and an input to debt-capacity analysis. Metric role is defined by the analytical question, not permanently attached to the metric name.</p>
      <p>Begin with a decision contract: outcome, entity, horizon, comparison, currency, financial perimeter and available intervention. A product-pricing decision and a capital-allocation decision can share definitions without sharing tree depth. A valid financial driver model starts from validated statements, not whichever metrics happen to be available.</p>
      <p>Reject a decorative hierarchy, enlarged KPI catalogue or dashboard navigation menu. None establishes a mathematical relationship. A tree is also neither proof of causality nor a universal template nor a substitute for the financial model that its outcome nodes must reproduce.</p>
    </section>

    <section id="architecture">
      <h2>Four levels preserve the path from outcome to evidence</h2>
      <ResourceFigure label="Four-level financial KPI tree, read top to bottom" caption="Each row is a level; each named branch retains its parent. I denotes identity, R business rule, A association and H hypothesis. Downward position alone never implies causality.">
        <div className={styles.framework01}>
          <div className={styles.frameworkSource}><span>FINANCIAL OUTCOME</span><strong>Profit / Cash / Return</strong><small>Selected outcome and comparison; Controller validates the result.</small></div>
          <ol>
            <li><b>↓ I</b><span>Financial mechanisms: Profit ← revenue less costs; Cash ← earnings less cash absorption; Return ← NOPAT divided by average invested capital.</span></li>
            <li><b>↓ I/R</b><span>Operational drivers: Revenue ← units × net price; Costs ← consumed quantities × rates; Working capital ← collection, stock and payment schedules. R: approved product-to-segment mapping.</span></li>
            <li><b>↓ A/H</b><span>Diagnostic evidence: A — downtime associated with output; H — overtime fatigue proposed as a yield explanation. Invoice, production and intervention evidence determine what can be concluded.</span></li>
          </ol>
        </div>
      </ResourceFigure>
      <p>Every node retains name, definition, formula, unit, period, source, owner, comparison, materiality, validation status, relationship type, drill-down path and limitations. Store numerator, denominator, sign, entity and effective version with the definition. Keep this contract inspectable in the underlying model without printing every field inside the executive diagram.</p>
      <p>Every edge has its own type, direction, scope and evidence. The same operational driver may affect several outcomes: production influences cost absorption and inventory simultaneously. Use one governed driver identity with separate documented effects. The underlying structure is therefore a graph; the tree is a decision-specific view that must not duplicate contributions.</p>
    </section>

    <section id="revenue">
      <h2>Revenue needs a population before it needs a formula</h2>
      <Formula label="Recognised net sales, summed over comparable product populations">Revenue = Σ (Units sold × Net price per unit)</Formula>
      <p>For a suitable transactional business, customers × orders per customer × units per order × net price per unit also reconciles when each factor uses the same nested population. An arithmetic average across products does not necessarily equal the required weighted price. Zero orders, returns and cross-period credits need explicit handling.</p>
      <p>A capacity model can use capacity × utilisation × yield × saleable share × price only if its output actually represents recognised sales. Saleable output that remains in inventory requires a stock bridge. Recurring businesses may use average active customers × recurring revenue per customer + usage revenue, with recognition timing and cohort exposure aligned.</p>
      <p>Keep bookings, orders, shipments, invoiced units and recognised revenue distinct. Define net price after discounts, rebates, returns and credits. Align customers, products, channel, currency and period; retain acquisitions, discontinuations and scope changes separately. Product mix is a redistribution of total quantity, not an independent quantity that can be counted again.</p>
      <p><Link href="/resources/variance-analysis-price-volume-mix-cost-drivers">FIR-07 price-volume-mix methodology</Link> provides the attribution convention. Fix its sequence and interaction treatment before interpreting movements. Calculate constant-currency volume, mix and price, then reconcile currency to reported revenue. An inflation index supplies context; it cannot replace the observed product-price bridge.</p>
    </section>

    <section id="margin">
      <h2>Growth changes both numerator and denominator</h2>
      <Formula label="Reconcile absolute gross profit before interpreting its ratio">Gross profit = Revenue − Cost of sales<br />Gross margin = Gross profit / Revenue</Formula>
      <p>The revenue branch distinguishes price, volume, product/customer/channel mix, discounts, rebates, returns and currency. Cost branches distinguish material price and usage, yield, labour rate and efficiency, energy, logistics, production volume, utilisation, fixed-cost absorption, inventory valuation and scrap. These are candidate mechanisms, not permission to add every available variance.</p>
      <p>Higher revenue can coexist with weaker gross margin when incremental sales carry lower contribution or costs rise faster. Favourable revenue mix means more sales value under the chosen bridge; it says nothing independently about contribution. A high-price product can consume more scarce capacity and leave less contribution per bottleneck hour.</p>
      <p>Flex standard consumption to actual good output and mix before judging usage. Separate purchase-price changes from the cost of material actually consumed. Labour rate × hours, energy consumption × tariff and logistics activity × rate require their own matching scopes. Reconcile inventory capitalisation and release before adding production variances to sold-product costs.</p>
      <p>Higher volume can lower absorbed fixed cost per unit without improving the process. If production exceeds sales, the same action may increase inventory and weaken cash. Check total fixed spending, good output, quality and stock movement before calling lower unit cost efficiency. Financial children must reconcile to validated gross profit and, after operating expenses, EBITDA or operating profit.</p>
    </section>

    <section id="working-capital">
      <h2>Operating activity consumes capital before it produces cash</h2>
      <Formula label="Operating working capital; exclude financing and tax items consistently">OWC = Trade receivables + Inventory + Other operating current assets<br />− Trade payables − Other operating current liabilities</Formula>
      <ResourceTable caption="Working-capital branches: controlled approximations, not cash roll-forwards" headers={["Branch", "Average-balance approximation", "Driver evidence"]} rows={[
        ["Receivables", "Credit revenue × DSO / Days", "Terms, billing delays, overdue ageing, disputes, collections, concentration, credit notes, factoring"],
        ["Inventory", "Cost of sales × DIO / Days", "Demand, forecast error, safety stock, lead time, order quantity, yield, cycle time, slow/blocked stock, obsolescence"],
        ["Payables", "Credit purchases × DPO / Days", "Contract terms, actual payments, supplier concentration, discounts, disputes, prepayments, supply risk"],
      ]} />
      <p>These relationships approximate balances when daily mechanics are unavailable. They reproduce a chosen average exactly when days are derived from that average; using them to forecast assumes a stable turnover relationship. Seasonality, rapid growth, tax inclusion and purchase timing can invalidate that assumption. Cost of sales is not automatically an acceptable substitute for credit purchases.</p>
      <Formula label="Cash movement uses opening and closing balances adjusted for non-cash and scope effects">Cash effect of operating working-capital investment = −Δ OWC</Formula>
      <p>Use comparable cash-relevant closing movements, not differences between average balances. Remove FX, acquisitions, write-offs and reclassifications before calling a balance movement cash. <Link href="/resources/working-capital-analysis">FIR-08 working capital analysis</Link> develops these population and timing controls.</p>
      <Formula label="Defined management cash bridge; interest is operating in this example">Operating cash before capex = EBITDA − Working-capital investment<br />− Cash taxes − Cash interest ± Other operating cash items<br />Free cash flow = Operating cash − Capex ± Other defined investing flows</Formula>
      <p>EBITDA may contain non-cash or exceptional items requiring adjustment. Define treatment of maintenance and growth capex, restructuring cash, taxes and financing costs explicitly. Free cash flow has varying conventions; it is neither operating cash nor net change in cash. Borrowing, dividends and other financing movements belong in a further cash roll-forward, as shown in <Link href="/resources/profit-vs-cash-flow-reconstruction">FIR-09 cash reconstruction</Link>.</p>
    </section>

    <section id="return">
      <h2>ROIC makes the capital cost of growth visible</h2>
      <Formula label="Use matched profit periods and average operating capital">NOPAT = Operating profit × (1 − Normalised tax rate)<br />ROIC = NOPAT / Average invested capital<br />= NOPAT margin × Invested capital turnover</Formula>
      <p>Here invested capital means operating working capital plus net productive fixed assets. Cash, debt, tax balances and non-operating assets are excluded. The fictional company has no goodwill or leases. In a real model disclose whether goodwill is included and align lease assets, lease liabilities, expenses and operating profit. There is no universal perimeter that removes the need for judgement.</p>
      <p>The margin branch connects realised price, volume and mix to material, labour, overhead, depreciation and normalised tax. The turnover branch connects revenue to receivables, inventory, payables, productive assets, utilisation and asset intensity. Average capital is required to match the resources employed through the profit period; a closing balance can misrepresent a late investment.</p>
      <ResourceFigure label="Integrated revenue, margin, working capital, cash and return dependencies" caption="I: identities within the declared perimeter. R: scoped forecasting rules. The shared revenue node is reused, not summed twice.">
        <div className={styles.framework01}><ol>
          <li><b>I</b><span>Revenue − Cost of sales → Gross profit − Operating expenses → EBITDA − Depreciation → Operating profit → NOPAT.</span></li>
          <li><b>R → I</b><span>Revenue and cost activity → Collection / stock / payment schedules → Δ OWC. EBITDA − Δ OWC − Cash tax − Interest → Operating cash.</span></li>
          <li><b>I</b><span>Average OWC + Average productive assets → Average invested capital. NOPAT ÷ Average invested capital → ROIC.</span></li>
          <li><b>I</b><span>Revenue appears in both NOPAT margin and capital turnover; it cancels in their product. Capex reduces free cash flow and changes productive capital over time.</span></li>
        </ol></div>
      </ResourceFigure>
      <p>Profit growth can coincide with declining return when capital grows faster. Lower ROIC alone does not prove economic value destruction: compare prospective incremental returns with the approved cost of capital, risk and investment horizon. McKinsey’s <a href="https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/measuring-long-term-performance">long-term performance framework</a> similarly distinguishes growth from returns relative to capital cost. The numerical example here is original and fictional.</p>
    </section>

    <section id="relationships">
      <h2>A visible connection is not a causal conclusion</h2>
      <ResourceTable caption="Relationship types: evidence determines the permitted claim" headers={["Type / edge", "Example", "Control and limitation"]} rows={[
        ["I — Deterministic identity", "Revenue = quantity × weighted net price", "Recalculate with matched populations; explains construction, not behaviour"],
        ["R — Defined business rule", "Approved customer segment maps to reporting category", "Version, scope and approve the mapping; policy is not natural causality"],
        ["A — Empirical association", "Downtime covaries with lower output", "Estimate timing, stability and uncertainty; confounding remains possible"],
        ["H — Causal hypothesis", "Overtime fatigue reduced yield", "Test mechanism and alternatives; unresolved status blocks causal attribution"],
      ]} />
      <p>A causal interpretation needs temporal order, a plausible mechanism, comparable observations and competing explanations. Inspect demand, product complexity, maintenance, staffing and external shocks. Consistency across periods, controlled comparisons, intervention evidence and operational confirmation strengthen the case. A reconciled bridge does not by itself establish what would happen under intervention.</p>
      <p>Lagging metrics describe results already produced: revenue, gross margin, EBITDA, operating cash, DSO and ROIC. Candidate leading metrics include order intake, pipeline quality, prices on new orders, purchase commitments, yield, overdue migration, inventory ageing, capacity bookings, churn and supplier lead time. Their role depends on the outcome and observation horizon.</p>
      <p>Test the timing relationship, stability, relevance, data quality, false signals, regime change and decision lead time. Back-test using information genuinely available at the decision date. A leading indicator is useful only if it changes early enough, reliably enough and actionably enough to improve a decision. Earlier measurement establishes neither causality nor permanent predictive power.</p>
    </section>

    <section id="ownership">
      <h2>Own the response even when the driver is external</h2>
      <ResourceTable caption="Controllability within the decision horizon" headers={["Class", "Meaning", "Management response"]} rows={[
        ["Directly controllable", "Owner can change the driver now", "Correct billing or operating settings"],
        ["Influenceable", "Owner influences but cannot determine", "Negotiate terms; mitigate exposure"],
        ["Externally driven", "Market or regulatory movement", "Reprice, hedge where appropriate, redesign"],
        ["Policy-driven", "An approved internal rule creates the result", "Review stock or credit policy"],
        ["Capacity-constrained", "Action depends on operational capacity", "Reallocate or assess investment"],
        ["Timing-driven", "Expected to reverse across periods", "Monitor reversal and revise forecast"],
        ["Evidence-constrained", "Relationship remains uncertain", "Investigate before attributing cause"],
      ]} />
      <p>These classes can overlap and change with the horizon. Commodity price is external; Procurement influences sourcing, Commercial selling price and Operations material usage. Supply Chain owns inventory policy, Credit Control collection execution, Treasury funding response and the CFO the consolidated financial decision. Uncontrollable does not mean irrelevant.</p>
      <p>Each material node names data owner, metric-definition owner, operational driver owner, financial outcome owner, action owner and decision approver. They may differ. The Controller can certify DSO while Credit Control executes collections and Commercial approves revised terms. Ownership belongs to an actionable mechanism, not automatically to the function reporting the KPI.</p>
      <p>An action contract needs a deadline, authority, resource constraint, expected financial effect, downside and completion evidence. Measure realised contribution or cash after execution; an approved price list or completed collection call is not proof that the financial outcome improved.</p>
    </section>

    <section id="controls">
      <h2>Reconciliation is the release gate</h2>
      <p>Definition control fixes formula, numerator, denominator, unit, sign, period, entity, source and version. Financial reconciliation ties outcomes to the P&amp;L, Balance Sheet, cash flow and validated schedules. Branch reconciliation proves that additive children sum to their parent; multiplicative and ratio branches must recompute it instead.</p>
      <p>Population control aligns products, customers, units, currencies, scenario and cut-off. No-double-counting control prevents adding a parent contribution and its decomposition together. Distinguish price/volume interactions from separate drivers and maintain one reference for shared inputs. Changed definitions invalidate dependent calculations and commentary until revalidated.</p>
      <Formula label="Residual control for an additive movement bridge">Residual = Parent movement − Σ Explained driver effects</Formula>
      <p>A material residual prevents “fully explained” status. Retain unallocated, scope and timing differences visibly with an owner; do not rename them efficiency. A zero arithmetic residual still permits an unresolved behavioural explanation. <Link href="/resources/financial-data-validation-control-layer">FIR-03 validation</Link> governs the financial foundation; <Link href="/resources/horizontal-and-vertical-financial-analysis">FIR-06 comparison</Link> governs the baseline.</p>
    </section>

    <section id="example">
      <h2>One manufacturer, four reconciled branches</h2>
      <p>Consider a fictional manufacturer/distributor. Prior and current are consecutive 365-day annual periods in a monthly management pack, not monthly flows. Amounts are EUR millions unless stated. Scope and accounting policies are unchanged; all sales and purchases are on credit. Days use monthly average balances; cash uses opening-to-closing movements. No acquisition, write-off or balance-sheet FX adjustment affects the cash bridge.</p>
      <ResourceTable caption="Validated headline outcomes" headers={["Outcome", "Prior", "Current"]} rows={[
        ["Revenue", "50.0", "56.0"], ["Gross profit", "15.500", "16.072"], ["Gross margin", "31.0%", "28.7%"],
        ["EBITDA", "6.00", "6.25"], ["Operating cash", "4.20", "2.60"], ["Average invested capital", "30.0", "36.5"],
        ["NOPAT", "4.14", "4.23"], ["ROIC", "13.8%", "11.6%"],
      ]} />
      <p>Core sells 300,000 units at EUR 100 previously and 320,000 at EUR 96.875 currently. Specialist sells 100,000 then 120,000 units at unchanged USD 250. EUR per USD changes from 0.8 to exactly 5/6. Total sold quantity grows 10%; production grows 15%, with excess production retained in stock. Currency is isolated on recognised sales, not added again as inflation.</p>
      <ResourceTable caption="Revenue bridge — EUR m; constant currency before FX" headers={["Step", "Effect", "Running revenue"]} rows={[
        ["Prior revenue", "0", "50.0"], ["Total volume at prior mix and price", "5.0", "55.0"],
        ["Mix at prior prices", "1.0", "56.0"], ["Core realised price", "−1.0", "55.0"],
        ["Specialist currency", "1.0", "56.0"], ["Residual", "0", "56.0"],
      ]} />
      <p>At prior mix, current quantities would be 330,000 Core and 110,000 Specialist. Moving 10,000 units from EUR 100 to EUR 200 contributes EUR 1.0m mix. Core price loses 320,000 × EUR 3.125 = EUR 1.0m. Specialist currency adds USD 30m × (5/6 − 0.8) = EUR 1.0m. The four effects explain the EUR 6.0m increase exactly.</p>
      <p>Prior gross margins are 35% Core and 25% Specialist. Standard variable costs are EUR 60 and EUR 140 per unit; allocated fixed costs are EUR 5 and EUR 10. Fixed manufacturing expense remains EUR 2.5m, allocated to sold units for this management bridge; inventory absorption is separately reconciled with no net incremental P&amp;L effect here.</p>
      <ResourceTable caption="Gross-profit bridge — EUR m; costs are negative" headers={["Step", "Effect", "Running gross profit"]} rows={[
        ["Prior gross profit", "0", "15.500"], ["Volume at prior full-cost margins", "1.550", "17.050"],
        ["Mix at prior full-cost margins", "0.150", "17.200"], ["Core price", "−1.000", "16.200"],
        ["Specialist currency", "1.000", "17.200"], ["Fixed-cost absorption adjustment", "0.300", "17.500"],
        ["Consumed-material price", "−0.900", "16.600"], ["Material usage", "−0.528", "16.072"],
        ["Residual", "0", "16.072"],
      ]} />
      <p>The standard current variable cost is EUR 36.0m. Standard fixed absorption at sold quantities is EUR 2.80m; replacing that allowance with unchanged EUR 2.5m spending adds EUR 0.30m. This is a denominator benefit, not an efficiency gain. Material price and usage then add EUR 1.428m to cost of sales, producing EUR 39.928m.</p>
      <p>For the affected homogeneous material, standard allowed consumption is 4.0m kg at EUR 4/kg; actual consumption is 4.132m kg. Actual price is EUR 4 + EUR 0.9m / 4.132m kg. Thus price on actual usage is EUR 0.900m and excess usage at standard price is EUR 0.528m. There is no overlapping purchase variance. Scrap, quality and settings remain competing usage explanations.</p>
      <p>Specialist contribution rate is 30% versus Core 40% before fixed costs. The positive revenue mix therefore dilutes contribution rate. Even full-cost standard gross margin falls from 31% to 17.20/56 = 30.714% before other effects. Operating expenses rise from EUR 9.500m to EUR 9.822m: gross profit growth of EUR 0.572m becomes EBITDA growth of EUR 0.250m, or 4.167%.</p>
      <ResourceTable caption="Working-capital days and average balances — 365-day basis" headers={["Metric", "Prior", "Current"]} rows={[
        ["DSO", "40", "48"], ["DIO", "60", "74"], ["DPO", "45", "45"],
        ["Credit purchases", "30.0", "34.0"], ["Average receivables", "5.479452", "7.364384"],
        ["Average inventory", "5.671233", "8.094992"], ["Average payables", "3.698630", "4.191781"],
      ]} />
      <p>The averages reproduce credit revenue × DSO/365, cost of sales × DIO/365 and credit purchases × DPO/365; displayed balances are rounded. Higher DSO and DIO diagnose capital intensity, not the cash movement themselves. Current average balances can exceed closing balances because seasonal peaks occurred earlier.</p>
      <ResourceTable caption="Cash-relevant closing balances — EUR m" headers={["Position", "Before prior", "Prior close", "Current close"]} rows={[
        ["Receivables", "6.0", "6.2", "6.75"], ["Inventory", "6.6", "7.0", "8.65"],
        ["Payables", "4.0", "4.0", "4.35"], ["OWC", "8.6", "9.2", "11.05"],
      ]} />
      <ResourceTable caption="EBITDA-to-cash bridge — EUR m" headers={["Item", "Prior", "Current"]} rows={[
        ["EBITDA", "6.00", "6.25"], ["OWC investment", "−0.60", "−1.85"],
        ["Cash taxes", "−1.00", "−1.55"], ["Cash interest", "−0.20", "−0.25"],
        ["Other operating cash items", "0", "0"], ["Operating cash", "4.20", "2.60"],
      ]} />
      <p>Additional OWC absorption of EUR 1.25m and additional tax/interest payments of EUR 0.60m outweigh EUR 0.25m EBITDA growth. Cash falls EUR 1.60m, or 38.095%. Other operating balances are zero. Tax payments differ from normalised tax expense because of settlement timing. Capex rises from EUR 2m to EUR 4m; defined free cash flow falls from EUR 2.2m to minus EUR 1.4m, with no other investing flows.</p>
      <p>Depreciation is EUR 0.48m then EUR 0.61m. EBIT is therefore EUR 5.52m then EUR 5.64m; at a 25% normalised tax rate NOPAT is EUR 4.14m then EUR 4.23m. Monthly average OWC increases from EUR 7.452055m to EUR 11.267595m; average productive fixed assets increase from EUR 22.547945m to EUR 25.232405m. Together they reconcile to EUR 30.0m and EUR 36.5m invested capital. These averages are not closing cash movements.</p>
      <Formula label="Exact ROIC reconciliation; round only the displayed percentage">Prior: 4.14 / 30.0 = 13.8%<br />Current: 4.23 / 36.5 ≈ 11.5890410959% ≈ 11.6%<br />Prior: 8.28% × 1.6666667 ≈ 13.8%<br />Current: 7.5535714% × 1.5342466 ≈ 11.589%</Formula>
      <p>NOPAT grows 2.174%; average capital grows 21.667%. Working capital and productive assets reduce turnover despite higher revenue. The company earns more accounting profit but less return per euro employed. Maturing capacity may improve later returns; the current result neither proves that recovery nor justifies further capital automatically.</p>
      <EntimemaFramework title="Worked-example decision path" description="Interpretative sequence, not a chain claiming revenue growth causes every subsequent movement." steps={[
        "Revenue +12% → Margin −2.3 points: price, mix and material economics require attention.",
        "OWC absorbs 1.85m → Operating cash 2.60m: collection and stock timing constrain funding.",
        "Average capital 36.5m → ROIC 11.6%: capital expands faster than NOPAT.",
        "Targeted decisions: price recovery, usage evidence, contribution mix, cash action and staged capex.",
      ]} />
    </section>

    <section id="decisions">
      <h2>Different decisions require different cuts of the same model</h2>
      <ResourceTable caption="One governed model, distinct decision uses" headers={["Use", "Question", "Relevant depth"]} rows={[
        ["Performance diagnosis", "Which driver explains the baseline movement?", "Reconciled product and cost bridges"],
        ["Forecasting", "Which early signals change expected outcomes?", "Dated commitments and tested leading indicators"],
        ["Scenario analysis", "What if a driver changes?", "Explicit elasticities, capacities and cash timing"],
        ["Management reporting", "Which material nodes require approval?", "Outcome, finding and evidence link"],
        ["Operational intervention", "Which process can change the result?", "Actionable driver and accountable owner"],
        ["Capital allocation", "Does growth improve return and liquidity?", "Incremental cash, capital and risk"],
        ["Exception routing", "Which material node remains unexplained?", "Residual, uncertainty and reviewer"],
      ]} />
      <p>Every material finding carries outcome movement, financial mechanism, operational driver, evidence, relationship type, controllability, owner, uncertainty, decision consequence and action. The example supports targeted price recovery by Commercial, a contribution-based mix review, Operations-led material-usage investigation, and Credit Control/Supply Chain action on receivables and inventory. The CFO must reassess capex timing and FP&amp;A must revise the integrated forecast.</p>
      <p>For the usage finding: EBITDA is EUR 0.528m below its no-usage-deterioration counterfactual; excess consumed material explains that amount deterministically. Production records support excess usage, but fatigue remains a hypothesis. Operations owns an evidence-constrained investigation; the Controller approves the reconciliation. Test quality and settings before changing staffing or embedding recovery in forecast.</p>
      <p><Link href="/resources/management-reporting-for-cfo-decisions">FIR-11 management reporting</Link> places these findings in the executive layer. Do not assess the growth programme on revenue alone: revenue growth is real, margin quality weakens, EBITDA improves modestly, working capital absorbs cash and invested capital expands faster than NOPAT. The decision is which mechanisms to change, by whom and with what evidence.</p>
    </section>

    <section id="failures">
      <h2>False precision has recognisable forms</h2>
      <ResourceTable caption="Failure → Why it looks analytical → Decision consequence → Required control" headers={["Failure", "Appearance", "Consequence", "Control"]} rows={[
        ["Flat KPI inventory", "Comprehensive coverage", "No mechanism", "Decision-specific hierarchy"],
        ["Undefined edges", "Connected boxes", "Unsupported explanation", "Typed relationships"],
        ["Every edge causal", "Persuasive arrows", "Wrong intervention", "Evidence boundary"],
        ["Metric as parent and child", "Deep drill-down", "Circular logic", "Explicit scope boundary"],
        ["Outcomes mixed with diagnostics", "Rich detail", "Misplaced priority", "Separate metric roles"],
        ["Non-reconciling branches", "Granular figures", "False contribution", "Recompute parents"],
        ["Hidden residual", "Complete bridge", "Uncertainty concealed", "Visible exception"],
        ["Double-counted drivers", "Multiple explanations", "Inflated effect", "Unique attribution"],
        ["Mixed scopes or currencies", "Comparable labels", "False trend", "Population contract"],
        ["Revenue mix equals profit mix", "Growth signal", "Poor product choice", "Contribution analysis"],
        ["Volume always favourable", "Efficiency narrative", "Capacity/cash strain", "Stock and capacity checks"],
        ["Unit cost equals efficiency", "Lower ratio", "Overproduction", "Absorption bridge"],
        ["Lagging as leading", "Early-warning label", "Late intervention", "Timing back-test"],
        ["Correlation called a driver", "Statistical fit", "Unsupported cause", "Competing hypotheses"],
        ["Finance owns everything", "Clear reporting owner", "No operating response", "Mechanism ownership"],
        ["Owner without authority", "Named accountability", "Unactionable task", "Action contract"],
        ["Universal tree", "Standardisation", "Wrong decision depth", "Scoped views"],
        ["Closing capital for annual return", "Available balance", "Distorted ROIC", "Matched average"],
        ["Undefined invested capital", "Familiar ratio", "Invalid comparison", "Disclosed perimeter"],
        ["Depth without decision value", "Sophistication", "Attention diluted", "Prune unused branches"],
        ["Tree before validation", "Fast visual result", "Unsafe foundation", "Validated financial model"],
      ]} />
    </section>

    <section id="execution">
      <h2>The tree earns its place through the response</h2>
      <p>For Entimema Financial Intelligence, the architecture is validated financial model → canonical financial concepts → deterministic financial relationships → operational driver graph → materiality and exception logic → targeted findings → decision and action. This describes a workflow to scope and validate, not a claim that every driver integration or causal capability is deployed.</p>
      <p>Model intelligence may identify semantic drivers, propose relationship hypotheses, detect ambiguity, compare explanations, request clarification, prioritise material findings and support executive interpretation. Deterministic code owns accounting identities, KPI and bridge arithmetic, ratio decomposition, working-capital and ROIC calculations, fixed rules, residuals and reconciliation. Human judgement owns outcome selection, tree scope, materiality, controllability, ownership, incomplete causal conclusions and the final decision.</p>
      <p>The <Link href="/resources/traceable-financial-analysis-workflow">FIR-05 end-to-end workflow</Link> preserves evidence from source to finding. A financial KPI tree does not eliminate complexity. It organises complexity around the relationships management must understand and influence. Its final output is an accountable decision with a measurable consequence.</p>
      <DecisionImplication><strong>Trace a financial outcome back to the operational drivers that created it.</strong> Connect the <Link href="/services/financial-data">Financial Data foundation</Link> to <Link href="/services/management-reporting">Management Reporting</Link>, or <Link href="/contact">discuss an Entimema Financial Intelligence demonstration</Link> around one reconciled outcome.</DecisionImplication>
    </section>
  </>;
}
