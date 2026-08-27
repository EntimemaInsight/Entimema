import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-08 — Financial Architecture. All example data and assumptions are synthetic. */
export const workingCapitalAnalysisSections = [
  { id: "perimeter", label: "Define the operating boundary" },
  { id: "cycle", label: "Measure operating timing" },
  { id: "balances", label: "Averages and seasonality" },
  { id: "quality", label: "Test balance quality" },
  { id: "receivables", label: "Receivables and collectibility" },
  { id: "inventory", label: "Inventory and convertibility" },
  { id: "suppliers", label: "Supplier financing" },
  { id: "example", label: "Worked diagnosis" },
  { id: "growth", label: "Growth versus deterioration" },
  { id: "cash", label: "EBITDA to operating cash" },
  { id: "scenarios", label: "Cash-release scenarios" },
  { id: "actions", label: "Owned management actions" },
  { id: "mistakes", label: "Analytical safeguards" },
  { id: "execution", label: "From diagnosis to action" },
] as const;

export default function WorkingCapitalAnalysisArticle() {
  return <>
    <p className={styles.leadParagraph}>Revenue grows 20%. EBITDA reaches EUR 8.5m at a stable reported margin. There is no accounting loss. Yet operating cash before capital expenditure is just EUR 0.5m. Receivables rise faster than sales, overdue invoices become older, inventory expands ahead of demand and supplier financing fails to cover the longer operating cycle. Part of the headline cash balance is restricted.</p>
    <p>The fictional company developed below is profitable and increasingly dependent on external liquidity. Its accounting result measures performance recognised during the year; its cash position reflects the timetable of collection, purchasing and settlement. The constraint sits between those two views. General cost cutting would miss overdue disputes, unnecessary stock and the timing of supplier commitments.</p>
    <KeyObservation title="Executive thesis">Positive profit does not guarantee available liquidity when cash is absorbed by receivables, inventory and supplier-payment timing. Working-capital analysis must locate that cash, distinguish necessary investment from deterioration, and identify what can be released safely, by whom and when.</KeyObservation>

    <section id="perimeter">
      <h2>Define the operating boundary before measuring the requirement</h2>
      <Formula label="Accounting liquidity versus the operating perimeter">NWC = Current assets − Current liabilities<br />OWC = Trade receivables + Inventory<br />+ Other operating current assets − Trade payables<br />− Other operating current liabilities</Formula>
      <p>Accounting net working capital supports broad liquidity assessment, but combines operating timing with cash, financial investments, current debt, taxes, dividends and provisions. Operating working capital isolates balances associated with delivery and settlement. Neither perimeter is universally correct independently of purpose. A solvency review and an inventory-release programme answer different questions.</p>
      <p>Keep cash and financing balances outside the operating cycle; assess restricted cash separately for availability. Analyse income tax separately from operating drivers, while reconciling VAT and other indirect-tax settlement timing explicitly. Exclude exceptional or non-operating balances unless the decision requires them. Eliminate intercompany items at consolidated level; retain them where an individual entity must fund its own settlement.</p>
      <p>Contract assets can represent performed but unbilled work, not an invoice already due. Contract liabilities can provide customer funding. Include them when material to the business model, but do not fold them silently into trade DSO. Treat operating provisions according to their nature and cash settlement: a non-cash charge and its later payment must not enter the bridge twice.</p>
      <p>For each account, retain financial-statement classification, operational role, counterparty type, timing behaviour, liquidity consequence and inclusion rationale. Reconcile the selected perimeter back to statements with exclusions visible. Unknown classifications remain exceptions. Do not calculate the working-capital requirement before defining which balances belong to the operating cycle.</p>
    </section>

    <section id="cycle">
      <h2>Read the Balance Sheet as an operating timetable</h2>
      <EntimemaFramework title="Operating cash cycle" description="Accounting balance → operating cycle → cash consumption → management action. Supplier financing offsets only part of the elapsed operating time." steps={["Supplier commitment → inventory: cash committed to procurement and production", "Sale → receivable: performance recognised before collection", "Cash collection: a collectible claim becomes available funds", "Supplier financing: contractual settlement offsets part of the cycle, subject to continuity risk"]} />
      <Formula label="Consistent period, entity, currency and tax basis; Days is the actual interval length">DSO = Average trade receivables / Credit revenue × Days<br />DIO = Average inventory / Cost of sales × Days<br />DPO = Average trade payables / Credit purchases × Days<br />CCC = DSO + DIO − DPO</Formula>
      <p>Days sales outstanding estimates the collection interval; days inventory outstanding estimates holding time; days payable outstanding estimates supplier-funded time. The cash conversion cycle summarises the net interval requiring finance. This conventional relationship is also described in <a href="https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles/wcm.html">ACCA’s working-capital guidance</a>. It is a timing approximation, not a verdict on liquidity.</p>
      <p>Match receivables and revenue by entity, currency, period, tax basis and credit population. Gross receivables paired with net-of-VAT sales inflate DSO; net receivables after impairment can conceal collection deterioration. Disclose gross and net views and reconcile allowances. Total revenue is only a labelled approximation when credit revenue is unavailable, particularly where cash sales are material.</p>
      <p>DIO uses cost rather than selling value. Raw materials, production flows and category-specific stock may need purchases or consumption denominators instead; state that adaptation and its limits. DPO should use relevant credit purchases. Cost of sales is a disclosed proxy only: inventory movements, labour, overhead absorption, depreciation, mix and receipt-versus-consumption timing can make it materially different.</p>
      <p>CCC can hide concentrated arrears, impaired stock or seasonal distortions and says nothing directly about funding price or availability. Two equal cycles can contain different operational risks. A negative cycle may be resilient customer funding or dependence on fragile advance-payment and supplier terms. Inspect components before celebrating the aggregate.</p>
    </section>

    <section id="balances">
      <h2>Use balances that represent the interval</h2>
      <Formula label="A disclosed minimum approximation when only endpoints are available">Average balance = (Opening balance + Closing balance) / 2</Formula>
      <p>Closing balances describe a date; revenue and purchases describe an interval. A collection drive, delayed supplier payment, inventory clearance, invoice deferral or concentrated quarter-end shipment can improve the photograph without improving the cycle. Acquisitions and disposals also break endpoint comparability unless scope and flows are aligned.</p>
      <p>Use monthly, weekly or daily time averages when available. Transaction-weighted exposure may support a specifically defined duration measure, but is not automatically interchangeable with average outstanding balances. Preserve the sampling convention, missing dates and coverage. More granular figures are not more reliable if their cut-offs or populations disagree.</p>
      <p>Compare seasonal peaks with corresponding prior-year periods and use rolling twelve-month flows alongside monthly or weekly balances. Pre-season buying, agricultural and commodity cycles, promotions, year-end procurement, shutdowns and billing calendars all alter the funding profile. Match fiscal intervals rather than mixing monthly balances, year-to-date sales and annual purchases.</p>
      <p>Separate the permanent requirement, recurrent seasonal peak and exceptional consumption. A seasonal build is justified only by a demand and depletion plan. Show peak and trough funding, not just the annual average, and test what happens if sales arrive late. The shorter and more volatile the cycle, the less representative a single closing balance becomes.</p>
    </section>

    <section id="quality">
      <h2>Balance size and balance quality are different findings</h2>
      <ResourceTable caption="Entimema working-capital quality framework" headers={["Dimension", "Receivables", "Inventory", "Payables"]} rows={[
        ["Amount", "Gross exposure", "Capital invested", "Supplier financing"],
        ["Timing", "Due and overdue age", "Holding and movement age", "Contractual and actual payment"],
        ["Quality", "Collectibility and disputes", "Usability and saleability", "Sustainable funding"],
        ["Concentration", "Customer dependency", "Product and category dependency", "Critical supplier dependency"],
        ["Operational cause", "Terms, billing, collection", "Forecast, procurement, production", "Negotiation, approval, settlement"],
        ["Cash actionability", "Collect and resolve disputes", "Consume, return, redeploy or sell", "Renegotiate or schedule safely"],
        ["Risk", "Default and unresolved claims", "Obsolescence and service failure", "Supply interruption and repricing"],
      ]} />
      <p>A large balance is not necessarily an opportunity. It may protect essential service, arise from agreed customer terms or finance a dependable supplier relationship. Conversely, a modest concentrated balance can threaten near-term liquidity. Rank cash that can realistically change within the decision horizon, not the largest accounting line.</p>
    </section>

    <section id="receivables">
      <h2>DSO must lead to invoices and collection evidence</h2>
      <p>Age invoices against contractual due dates at a common cut-off. Separate not-yet-due, 1–30, 31–60, 61–90 and over-90-day balances, adapting boundaries to terms and purpose. Retain original due dates when renegotiation would otherwise erase deterioration. Reconcile invoices, unapplied receipts, credits and allowances to the ledger before analysing migration.</p>
      <Formula label="Use one reconciled receivables population and an explicit severe-age boundary">Overdue ratio = Overdue receivables / Total trade receivables<br />Severely overdue ratio = Receivables over defined age / Total trade receivables</Formula>
      <p>Disputed, blocked, promised-for-payment, credit-note-pending, factored, insured and related-party amounts are status overlays, not additional ageing buckets. Reconcile their overlaps. A promise is not a receipt; insurance does not establish payment timing; factoring may change funding, recourse and accounting presentation without repairing collection. Track customer concentration within each ageing bucket.</p>
      <p>Equal DSO can describe recent, diversified invoices or a few old disputed claims. Test delivery acceptance, billing accuracy, contract terms, dispute ownership and subsequent cash receipts before estimating release. Distinguish unwillingness or inability to pay from a correctable invoice defect. Collection action should follow that mechanism, not an undifferentiated demand for faster payment.</p>
    </section>

    <section id="inventory">
      <h2>Inventory days do not establish convertibility</h2>
      <p>Separate raw materials, work in progress, finished and resale goods, packaging, consumables and spares. Overlay strategic safety stock, slow-moving, blocked, obsolete and quality-hold status. Confirm ownership and cut-off for consignment inventory and goods in transit. Do not count the same stock twice because it has both a category and a quality flag.</p>
      <Formula label="Required operating stock depends on explicit service, production and supply assumptions">Slow-moving share = Slow-moving inventory / Total inventory<br />Excess inventory = max(Actual inventory − Required operating inventory, 0)</Formula>
      <p>Identical DIO can support healthy production, seasonal preparation or supply protection, or reveal poor forecasting, minimum-order excess and production imbalance. Define required stock from demand, lead times, service levels, batch sizes and disruption tolerance. The required level is a management assumption to test, not an objectively known subtraction.</p>
      <p>Consumption releases cash only when it avoids replenishment; redeployment must avoid another purchase; disposal requires an actual buyer and net proceeds after costs. A write-down lowers carrying value without generating cash. Quality-hold stock needs technical clearance before any sale assumption. Protect essential spares and safety stock until operations approves the service consequence.</p>
    </section>

    <section id="suppliers">
      <h2>Supplier financing is an operating relationship</h2>
      <p>Compare contractual terms with invoice-weighted actual payment timing, overdue balances, disputes and approval delays. Review discounts, prepayments, related parties, financing arrangements and critical supplier concentration. Reverse factoring requires separate scrutiny of liability classification, settlement and withdrawal risk; its presence is not evidence of better operating discipline.</p>
      <p><a href="https://www.ifrs.org/news-and-events/news/2023/05/iasb-increases-transparency-of-companies-supplier-finance/">IASB supplier-finance disclosures</a> address effects on liabilities, cash flows and liquidity risk. An operational review should likewise retain which balances depend on a financing provider and what happens if access disappears. Do not merge that dependence into ordinary negotiated supplier credit.</p>
      <p>Higher DPO may preserve cash while sacrificing discounts, increasing prices, damaging trust or risking interruption. Negotiate selectively, compare the full commercial cost and document supplier consent. Paying late without agreement is not a sustainable funding strategy. Supplier financing is an operating relationship, not free capital.</p>
    </section>
    <section id="example">
      <h2>A profitable company with a lengthening cash cycle</h2>
      <p>All figures below are fictional EUR millions for two comparable 365-day years. Revenue is entirely credit revenue; balances and flows use a consistent tax-exclusive basis, with no VAT in this simplified example. Entity scope and currency are unchanged. Prior EBITDA is exactly current EBITDA divided by 1.2, preserving an 11.81% margin at EUR 8.5m currently.</p>
      <ResourceTable caption="Synthetic operating inputs; averages are time averages from supporting schedules, not endpoint means" headers={["EUR m", "Prior", "Current"]} rows={[
        ["Credit revenue", "60.0", "72.0"],
        ["Cost of sales", "42.0", "50.4"],
        ["Credit purchases", "42.0", "52.4"],
        ["Cash inventory purchases", "0.0", "2.0"],
        ["EBITDA", "7.083333…", "8.5"],
        ["Average trade receivables", "8.2", "11.4"],
        ["Average inventory", "9.6", "13.8"],
        ["Average trade payables", "7.5", "9.0"],
      ]} />
      <p>This simplified trading company has no production capitalisation, write-offs or non-cash stock movements. Current purchases total 54.4: credit purchases 52.4 plus cash purchases 2.0. Opening inventory 10.0 + purchases 54.4 − cost of sales 50.4 = closing inventory 14.0. Using credit purchases alone in that stock reconciliation would incorrectly imply a 2.0 increase.</p>
      <ResourceTable caption="Days from the published averages; retain full precision before rounding" headers={["Measure", "Prior calculation", "Current calculation", "Movement"]} rows={[
        ["DSO", "8.2 / 60.0 × 365 = 49.88", "11.4 / 72.0 × 365 = 57.79", "+7.91 days"],
        ["DIO", "9.6 / 42.0 × 365 = 83.43", "13.8 / 50.4 × 365 = 99.94", "+16.51 days"],
        ["DPO", "7.5 / 42.0 × 365 = 65.18", "9.0 / 52.4 × 365 = 62.69", "−2.49 days"],
        ["CCC", "DSO + DIO − DPO = 68.13", "DSO + DIO − DPO = 95.04", "+26.91 days"],
      ]} />
      <p>Collection and stock holding both lengthen while supplier-funded time contracts. This establishes a funding concern, not its cause. Closing receivables of 13.0 would produce 65.90 DSO, rather than 57.79; closing inventory of 14.0 produces 101.39 DIO. Those endpoint measures answer a different question from annual time averages.</p>
      <ResourceTable caption="Closing quality profiles; overlays are included, never added again" headers={["Population", "Prior close", "Current close", "Current evidence"]} rows={[
        ["Receivables: not yet due", "6.5", "7.0", "Contractual future receipts"],
        ["1–30 days overdue", "1.5", "2.5", "Recent arrears"],
        ["31–60 days overdue", "0.8", "1.3", "Persistent delays"],
        ["Over 60 days overdue", "0.7", "2.2", "0.8 at 61–90; 1.4 over 90"],
        ["Total receivables", "9.5", "13.0", "1.5 disputed overlay; 1.2 within over-60"],
        ["Inventory: operating stock", "7.5", "9.0", "Growth-supported requirement"],
        ["Seasonal / safety stock", "1.5", "2.5", "Approved seasonal plan"],
        ["Slow-moving stock", "0.7", "1.6", "Avoid replenishment; test saleability"],
        ["Quality-hold / obsolete stock", "0.3", "0.9", "Technical review before release"],
        ["Total inventory", "10.0", "14.0", "Categories mutually exclusive"],
      ]} />
      <p>Overdue receivables are 6.0 / 13.0 = 46.15%, versus 31.58% previously. Over-60-day exposure is 16.92%, using that threshold for this case only. Two customers account for 4.0, or 30.77%, of receivables and 1.8 of the over-60 balance. The overlap with disputes needs invoice-level review; it is not an additional claim.</p>
      <p>Slow-moving inventory is 11.43% of total stock. Operating and seasonal categories explain 2.5 of the 4.0 increase; slow-moving and held stock explain 1.5. The seasonal plan supports intent, not guaranteed depletion. Supplier terms average 60 days on a purchase-weighted basis, actual settled invoices average 64 days, and 0.6 of closing payables is overdue. These measures differ from balance-based DPO. One critical supplier represents 35% of credit purchases.</p>
    </section>

    <section id="growth">
      <h2>Separate expansion funding from excess intensity</h2>
      <Formula label="Planning approximation; use a normalised and consistently defined perimeter">OWC intensity = Operating working capital / Revenue<br />Incremental requirement ≈ Revenue increase × Normalised OWC intensity</Formula>
      <p>Prior average trade working capital is 8.2 + 9.6 − 7.5 = 10.3, or 17.17% of revenue. At unchanged aggregate intensity, the 12.0 revenue increase requires 2.06 additional average funding. Current average trade working capital is 16.2, up 5.9; the remaining 3.84 exceeds that simple scale allowance.</p>
      <p>A component check holds prior days constant against current flows: receivables become 9.84, inventory 11.52 and payables 9.357143. Expected average trade working capital is 12.002857; actual 16.2 exceeds it by 4.197143. The difference from the aggregate approximation reflects purchases growing faster than revenue. Neither residual proves inefficiency without operational evidence.</p>
      <p>Closing trade working capital instead rises from 11.3 to 17.5, or 6.2. Do not substitute the 5.9 average-balance increase into the cash bridge. An illustrative closing decomposition is growth 2.26 + incremental seasonality 0.70 + remaining operating change 3.24 = 6.20. The growth allowance scales all opening trade balances by 20%, including 0.30 of seasonal stock; only the remaining 0.70 of its 1.00 increase is assigned to seasonality. Price/currency, scope and exceptional non-cash items are zero by assumption.</p>
      <p>The remaining operating change requires investigation of collection, stock decisions and supplier timing; it is not automatically releasable. In practice, define each bridge component, order interactions once and reconcile the residual. Distinguish structural terms, deliberate protection and new channels from deteriorating execution. Growth becomes dangerous when its funding need is unmeasured, unfunded or increasing faster than activity.</p>
    </section>

    <section id="cash">
      <h2>Reconcile earnings to cash, then test availability</h2>
      <p>Current opening balances equal prior closing balances: receivables 9.5, inventory 10.0 and payables 8.2. Current closes are 13.0, 14.0 and 9.5. Other net operating assets rise from 0.6 to 1.0. No acquisition, translation, impairment or other non-cash movements affect these changes. EBITDA requires no additional non-cash adjustment in this example.</p>
      <ResourceTable caption="EBITDA-to-operating-cash bridge; EUR m, current year" headers={["Bridge item", "Cash effect", "Running total"]} rows={[
        ["EBITDA", "8.5", "8.5"],
        ["Increase in trade receivables: 13.0 − 9.5", "−3.5", "5.0"],
        ["Increase in inventory: 14.0 − 10.0", "−4.0", "1.0"],
        ["Increase in trade payables: 9.5 − 8.2", "+1.3", "2.3"],
        ["Other net operating assets: 1.0 − 0.6", "−0.4", "1.9"],
        ["Cash taxes", "−0.8", "1.1"],
        ["Cash interest", "−0.6", "0.5"],
        ["Operating cash before capex", "0.5", "0.5"],
      ]} />
      <p>EBITDA is not cash. Here, operating cash before working-capital movements and after cash tax and interest is 7.1; net working-capital absorption of 6.6 leaves 0.5. This analytical convention includes interest in operating cash. Statutory classification and required starting subtotals depend on the applicable reporting requirements; <a href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows.html/">IAS 7</a> distinguishes operating, investing and financing flows.</p>
      <p>With capex of 1.2, the defined cash-after-capex measure is −0.7, not positive free cash generated for discretionary use. Opening cash 4.5 − 0.7 + net new financing 1.2 = closing cash 5.0. Of that balance, 1.5 is restricted, leaving 3.5 available before near-term obligations. Restriction changes availability; it is not another expense or a second cash outflow.</p>
      <p>An eight-week forecast requires 4.4 net cash after scheduled receipts, with a 0.5 minimum reserve. Treasury therefore needs 1.4 beyond the unrestricted 3.5. An assumed undrawn committed facility of 2.0 can cover that gap only if draw conditions and covenants permit. Annual scenario savings must not be treated as cash arriving before those obligations.</p>
    </section>
    <section id="scenarios">
      <h2>Model release with timing and operating limits</h2>
      <Formula label="Directional steady-state estimates; matched denominators and no double counting">DSO release ≈ Credit revenue / Days × DSO reduction<br />DIO release ≈ Cost of sales / Days × DIO reduction<br />DPO release ≈ Credit purchases / Days × DPO increase</Formula>
      <ResourceTable caption="Scenario matrix; EUR m at current annual flows unless stated" headers={["Scenario / action", "Cash effect", "Timing", "Owner", "Risk / decision"]} rows={[
        ["A: further 10% growth; current days and quality", "−1.620000 average funding", "Next-year ramp", "Treasury / management", "Fund growth; no assumed release"],
        ["B: collect overdue and resolve disputes; DSO −5", "+0.986301", "4–12 weeks", "Commercial / credit control", "Validate collectible invoices"],
        ["B: avoid replenishment and reduce excess; DIO −8", "+1.104658", "8–20 weeks", "Operations / supply chain", "Protect safety stock and service"],
        ["B: selective negotiated terms; equivalent DPO +2", "+0.287123", "6–16 weeks", "Procurement", "Exclude critical supplier; obtain consent"],
        ["B: controlled total", "+2.378082", "Phased; not day-one cash", "Finance / treasury", "Approve only reconciled execution plan"],
        ["C: DSO −12, DIO −20, DPO +10", "+6.564384", "Unvalidated acceleration", "Management", "Reject pending operational evidence"],
      ]} />
      <p>Scenario A scales revenue, cost of sales and credit purchases by 10% while holding current days fixed: average receivables become 12.54, inventory 15.18 and payables 9.90. Trade working capital rises from 16.20 to 17.82. Other operating balances and seasonal peaks need separate forecasts. Positive earnings do not remove this additional funding requirement.</p>
      <p>Scenario B gives DSO 52.79, DIO 91.94, DPO 64.69 and CCC 80.04 days. Its inventory opportunity is conditional on avoiding purchases or realising proceeds, not writing stock down. Selected suppliers must collectively support the portfolio-equivalent two-day extension. The critical supplier receives no assumed extension.</p>
      <p>Scenario C produces CCC 53.04 days and a larger spreadsheet release, but may cut required stock, disrupt customers, lose sales, interrupt production, sacrifice discounts and damage supplier trust or reputation. Temporary balance compression is not sustainable improvement. Do not approve it simply because its cash total is larger.</p>
      <p>These estimates use unrounded arithmetic and fixed flows, not guaranteed receipts. Invoice timing, VAT, disputes, inventory categories, purchasing changes and execution affect realised cash. Reducing inventory may also reduce purchases and payables; changed customer terms may alter revenue. Rebuild the integrated forecast before adding opportunities. Under the same simplified current-intensity convention, 10% growth with Scenario B days implies 15.204110 average trade funding: only 0.995890 below today, not a simultaneous 2.378082 release plus unfunded expansion.</p>
    </section>

    <section id="actions">
      <h2>Make every opportunity an owned decision</h2>
      <p>Use <strong>Balance → Timing → Quality → Cause → Cash impact → Actionability → Owner → Decision</strong>. Each finding retains period, average and close, classification, days movement, quality, growth and seasonality, concentration, cash consequence, timing, dependency, risk and required approval. Label observed evidence, deterministic calculation, supported inference, unresolved hypothesis and management judgement separately.</p>
      <ResourceTable caption="Execution controls attached to Scenario B; cash opportunities are not additive to that scenario" headers={["Issue and evidence", "Mechanism / owner", "Required control", "Completion evidence"]} rows={[
        ["Ageing concentration and 1.5 disputed overlay", "Resolve invoices; commercial and credit control; 0.986301 in 4–12 weeks", "Customer acceptance, credits and promise dates; avoid commercial disruption", "Bank receipts matched to named invoices; no replacement arrears"],
        ["1.6 slow-moving stock and avoidable replenishment", "Consume / sell / stop orders; operations; 1.104658 in 8–20 weeks", "Demand, quality release and service floor; no unsafe safety-stock cut", "Cancelled purchases or net receipts; stock and service reconciliation"],
        ["Supplier terms; 35% critical dependency", "Selective negotiation; procurement; 0.287123 in 6–16 weeks", "Consent, discount economics and continuity; protect critical source", "Executed terms and payments consistent with agreement"],
        ["Restricted cash and eight-week gap", "Reconcile forecast and arrange funding; treasury", "Bank restrictions, draw conditions, covenants; no assumed early release", "Available funds and approved weekly forecast; controller sign-off"],
      ]} />
      <p>For the concentrated arrears finding, the 13.0 closing receivable balance and 2.2 over-60-day bucket are observed example evidence. The 16.92% ratio is deterministic. Increased dependence on a small set of receipts is a supported inference. Customer distress remains an unresolved hypothesis until payment capacity and dispute evidence are examined. Releasing five DSO days is management judgement about a feasible target, not a causal conclusion from the ratio. Credit control owns invoice validation; the commercial director owns disputed delivery acceptance and credit-note decisions.</p>
      <p>The first decision is therefore to approve a targeted review and conditional collection plan, not to book the entire overdue balance as forecast cash. Preserve the original expected receipt dates, record revised dates with reasons, and compare subsequent receipts against both. Treasury should escalate slippage that would breach the approved reserve; it should not silently replace missed receipts with another optimistic customer promise.</p>
      <p>Procurement separately tests order cadence and minimum-order quantities, while operations checks production or replenishment plans against actual demand. Finance reconciles their proposed changes to the same inventory population. Otherwise two owners can claim the same avoided purchase, or procurement can negotiate longer terms on orders that operations intends to cancel.</p>
      <p>Prioritise invoice evidence and short-term funding first; inventory and supplier actions mature later. Management approves growth, service and resilience trade-offs and escalates missed milestones. Review weekly cash realisation against the baseline, with sales, service and supplier performance alongside it. Close actions on verified outcomes, not improved ratios caused by write-offs, denominator growth or shifted cut-offs.</p>
    </section>

    <section id="mistakes">
      <h2>Replace plausible shortcuts with explicit controls</h2>
      <ResourceTable caption="Mistake → apparent logic → failure → required control" headers={["Mistake", "Why it looks reasonable", "Why it fails", "Control"]} rows={[
        ["NWC treated as OWC; cash and debt included", "Familiar accounting total", "Financing obscures operations", "Reconciled account perimeter"],
        ["Seasonal close used as average", "Available audited date", "Snapshot misrepresents interval", "Time averages and matched seasons"],
        ["Total sales; silent cost-of-sales proxy", "Available denominators", "Credit and purchasing populations differ", "Disclosed, matched flows"],
        ["VAT ignored; monthly and annual inputs mixed", "Similar labels", "Tax and period distort days", "Tax, scope and period controls"],
        ["DSO without ageing; all overdue collectible", "One collection measure", "Old disputes disappear", "Buckets, status overlays and receipts"],
        ["DIO without quality; all stock convertible", "One inventory measure", "Impairment becomes false release", "Saleability and avoided-purchase evidence"],
        ["Higher DPO always good; concentration ignored", "Immediate cash benefit", "Discount and continuity costs", "Supplier-level consent and economics"],
        ["All growth is waste or all growth is necessary", "One convenient explanation", "Scale and deterioration merge", "Reconciled growth / timing bridge"],
        ["EBITDA means liquidity; restricted cash ignored", "Positive reported figures", "Absorption and unavailable funds", "Cash bridge and bank restrictions"],
        ["Untimed, independent opportunities added", "Simple scenario arithmetic", "Interactions and late receipts", "Integrated weekly forecast"],
        ["Opportunity without owner; minimise balances", "Ambitious savings target", "No execution or operating safeguard", "Owner, mechanism, timing and risk boundary"],
      ]} />
    </section>

    <section id="execution">
      <h2>Connect financial diagnosis to recurring operating action</h2>
      <p>Within Entimema Financial Intelligence’s <Link href="/resources/traceable-financial-analysis-workflow">end-to-end workflow</Link>, specify source-statement and schedule registration, period and currency harmonisation, operating-account mapping, P&amp;L and Balance Sheet validation, comparable calculations, cash bridges and evidence-linked findings. Retain processing state, exceptions and lineage. This is the required control architecture, not a claim that statements alone reveal invoice disputes or stock usability.</p>
      <p>Financial Intelligence diagnoses the operating cash constraint. Receivables Intelligence is the direction for operationalising recurring receivables action: invoice ageing, overdue migration, customer concentration, disputes, promises, collection actions, exceptions and prioritised follow-up. This describes a workflow extension, not a currently live product claim. It cannot replace inventory, supplier and treasury analysis.</p>
      <p>Model intelligence may propose semantic classifications, detect ambiguity, prioritise exceptions, interpret operations and request clarification. Deterministic code owns balances, ageing, DSO, DIO, DPO, CCC, reconciliations, bridges, scenario arithmetic and fixed controls. Humans approve the perimeter, collectibility, inventory actionability, supplier trade-offs and final liquidity decision.</p>
      <p><Link href="/resources/horizontal-and-vertical-financial-analysis">Comparative analysis</Link> identifies structural movement; <Link href="/resources/profit-vs-cash-flow-reconstruction">profit-to-cash reconstruction</Link> establishes its cash effect; and the <Link href="/resources/month-end-reporting-workflow">controlled month-end reporting workflow</Link> makes monitoring and control recurring. <Link href="/resources/working-capital-as-a-system">Working capital as a system</Link> connects operating drivers, while <Link href="/resources/operational-driver-forecasting">driver forecasting</Link> tests future funding. Here the opening contradiction resolves into 6.6 of working-capital absorption, concentrated collection risk, partly justified stock and a time-sensitive funding gap. A controlled 2.378082 opportunity deserves execution testing; an aggressive 6.564384 does not deserve automatic approval.</p>
      <DecisionImplication><strong>Identify where operating cash is trapped and what can be acted upon.</strong> Explore the <Link href="/services/financial-data">Financial Data service</Link> and <Link href="/services/budgets-and-forecasting">Planning &amp; Forecasting</Link>, or <Link href="/contact">discuss a Financial Intelligence workflow</Link>. Working-capital improvement is the controlled redesign of operating timing that converts profit into cash.</DecisionImplication>
    </section>
  </>;
}
