import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-06 — Financial Architecture. All numerical examples are synthetic. */
export const horizontalVerticalAnalysisSections = [
  { id: "four-changes", label: "Four forms of change" },
  { id: "two-views", label: "Horizontal versus vertical" },
  { id: "base-period", label: "Choose the comparison" },
  { id: "denominator", label: "Structure and denominator" },
  { id: "unstable-bases", label: "Low bases and signs" },
  { id: "nominal-growth", label: "Price, currency and scope" },
  { id: "cross-statement", label: "Cross-statement tests" },
  { id: "hierarchy", label: "Interpretation hierarchy" },
  { id: "worked-example", label: "Worked comparison" },
  { id: "failure-modes", label: "Errors and controls" },
  { id: "decision", label: "Evidence to decision" },
  { id: "execution", label: "Controlled execution" },
] as const;

export default function HorizontalVerticalAnalysisArticle() {
  return <>
    <p className={styles.leadParagraph}>Revenue grew 18%, EBITDA 10%, inventory approximately 42% and trade receivables approximately 31%. The report concludes that the company is growing profitably. Every percentage is correct. Yet EBITDA margin declined, stock absorbed capital faster than sales expanded, and collection days deteriorated. Price inflation and currency translation explain part of the revenue increase; one improving expense ratio reflects the larger revenue denominator rather than demonstrated cost control.</p>
    <p>The conclusion confuses a larger business with a stronger one. Horizontal financial analysis measures movement across time; vertical analysis measures composition within a period. Neither explains the economic mechanism alone. Absolute scale, denominator behaviour and connected financial statements determine which movements deserve investigation and what evidence could resolve them.</p>
    <KeyObservation title="Executive thesis">Percentage change describes the movement. It does not establish the economic mechanism that produced it. Combine <strong>percentage observation → structural diagnosis → cross-statement explanation → management implication</strong> before calling growth an improvement.</KeyObservation>

    <section id="four-changes">
      <h2>Four forms of change, one business explanation</h2>
      <p>Entimema’s four-change framework prevents one metric from carrying four different claims. Currency amounts establish economic weight; relative rates establish speed; common-size shares reveal composition; relationships test whether the proposed explanation fits the wider financial system. Each view challenges the others.</p>
      <ResourceTable caption="Entimema four-change framework: complementary evidence for business explanation" headers={["Dimension", "Question and measure", "Main risk", "Companion test"]} rows={[
        ["Absolute", "What amount moved? Currency difference", "Large lines monopolise attention", "Decision materiality, including smaller threshold-sensitive items"],
        ["Relative", "How fast? Percentage change", "Low-base distortion", "Absolute amount and base validity"],
        ["Structural", "What gained weight? Percentage-point change", "Denominator effects", "Explain numerator and denominator separately"],
        ["Relational", "Did connected values move coherently? Cross-statement relationship", "False single-line explanations", "Operational evidence and competing hypotheses"],
      ]} />
      <p>Logistics can rise EUR 0.6m, grow 15%, and fall from 8.0% to 7.8% of revenue. These findings are compatible: more money was spent, but the expense grew more slowly than sales. Efficiency remains unproven until shipment volume, route mix, freight prices and service levels are tested. A cheaper distribution ratio can coexist with worsening cost per delivery.</p>
      <p>Keep percentage points distinct from percentages. A margin falling from 20% to 17% loses three percentage points, equivalent to a 15% relative reduction in the original margin. The first measures structural displacement; the second measures proportional contraction. Use the measure relevant to the question and name it explicitly.</p>
    </section>

    <section id="two-views">
      <h2>Define the view before interpreting the number</h2>
      <Formula label="Horizontal movement for line i, current period t and base period 0">ΔXᵢ = Xᵢ,ₜ − Xᵢ,₀<br />%ΔXᵢ = (ΔXᵢ / |Xᵢ,₀|) × 100</Formula>
      <p>Using the absolute base accommodates signed accounting values without allowing a negative denominator to reverse the displayed direction. It is a declared analytical convention, not a universal definition of growth. Expenses stored as negatives become more negative when expenditure increases. Preserve the stored sign, presentation convention and economic direction separately; suppress growth language when a loss crosses into profit.</p>
      <Formula label="Vertical or common-size analysis with a declared denominator">P&amp;L shareᵢ,ₜ = (Xᵢ,ₜ / Revenueₜ) × 100<br />Balance Sheet shareᵢ,ₜ = (Xᵢ,ₜ / Total assetsₜ) × 100</Formula>
      <p>A common-size income statement normally uses revenue. A common-size balance sheet normally uses total assets, with liabilities and equity expressed against the same total. Gross profit, operating costs, invested capital, total liabilities and equity, or segment revenue can also be valid denominators when their definition serves the decision. Do not silently switch bases between periods.</p>
      <ResourceTable caption="Horizontal versus vertical financial analysis" headers={["Test", "Horizontal", "Vertical"]} rows={[
        ["Question", "How much, how fast, which direction and interval?", "Which lines gained or lost structural weight?"],
        ["Calculation", "Current minus base; divide by absolute base for relative movement", "Line divided by relevant within-period denominator"],
        ["Strength", "Locates movement over time", "Reveals cost, asset and financing composition"],
        ["Limitation", "Does not prove cause, favourability or sustainability", "Does not prove operational cause or efficiency"],
        ["Required companion", "Comparable base, absolute scale and structural test", "Numerator/denominator bridge and connected statement evidence"],
      ]} />
      <p>Horizontal analysis does not distinguish price, volume, classification or currency. Vertical analysis does not establish why the business model changed. A revenue-denominated ratio is especially weak when revenue is negligible or its gross/net presentation changed. A treasury funding question may require invested capital or debt maturities instead. State exclusions, netting and consolidation eliminations before calculating.</p>
    </section>

    <section id="base-period">
      <h2>The base period is an analytical hypothesis</h2>
      <p>A baseline asserts what would constitute a useful comparison. The previous month is chronological; the same season or production cycle is operational; budget and latest forecast are planning baselines; a documented adjustment to an exceptional period creates a normalised baseline. None is universally correct. Freeze the chosen version so later forecast revisions cannot rewrite the performance judgement.</p>
      <ResourceTable caption="Select the base that answers the management question" headers={["Analytical question", "Appropriate comparison"]} rows={[
        ["Short-term operational movement", "Previous comparable month or period"],
        ["Seasonal performance", "Same month or quarter in the prior year"],
        ["Delivery against plan", "Approved budget or identified forecast vintage"],
        ["Structural multi-year change", "Fixed index base or consistent trend series"],
        ["Performance after disruption", "Normalised pre-event or explicitly adjusted base"],
      ]} />
      <p>Revenue of 59 against last year’s 50 implies 18% growth. Against a budget of 62 it is 4.8% below plan. Against a pre-disruption 60 it remains 1.7% lower. All three can be useful; selecting only the depressed year turns recovery into apparent exceptional performance. An unusually strong base can conversely conceal current progress or make subsequent deterioration appear inevitable.</p>
      <p>Require equal duration, aligned seasonality, consistent entity perimeter, accounting scope, currency and unit, and explained restatements. Monthly, quarterly and year-to-date flows cannot be directly compared. Derive a month from consecutive cumulative observations only when their definitions and revisions agree. Balance Sheet stocks need matching dates, not annualisation. A rolling average can reduce noise but delay recognition of a turning point.</p>
      <p>For multi-year trends, set a representative positive base to 100 and calculate each observation against that fixed base. Retain year-on-year changes beside the index: a rising index can conceal a recent reversal. Record any base reset and preserve the old series. Normalisation needs an approved adjustment bridge back to reported figures, not an analyst’s preferred version of history.</p>
    </section>

    <section id="denominator">
      <h2>Structure can improve while the underlying cost does not</h2>
      <ResourceTable caption="Absolute and structural direction: positive comparable lines and denominators" headers={["Amount", "Share", "Initial interpretation"]} rows={[
        ["Increases", "Increases", "The line expands faster than its denominator"],
        ["Increases", "Decreases", "The line grows more slowly than its denominator"],
        ["Decreases", "Increases", "The denominator contracts faster than the line"],
        ["Decreases", "Decreases", "The line shrinks in amount and relative weight"],
      ]} />
      <p>These are diagnostic patterns, not verdicts. Higher maintenance cost may protect output; a lower maintenance share may conceal deferred work. Lower revenue can increase an unchanged fixed-cost burden. A shrinking asset share can reflect disposal of productive capacity rather than improved capital efficiency. Signed or near-zero denominators require separate treatment rather than this simple direction matrix.</p>
      <Formula label="An exact ordered ratio bridge, for non-zero denominators">Rₜ − R₀ = (Nₜ − N₀) / D₀ + Nₜ × (1 / Dₜ − 1 / D₀)</Formula>
      <p>For R = N/D, this bridge first moves the numerator at the old denominator, then moves the denominator at the new numerator. Multiply by 100 for percentage points. Reversing the order reallocates the interaction, so disclose the convention. The identity isolates arithmetic contributions; it does not establish business causality.</p>
      <p>Payroll/revenue may fall because selling prices increased despite unchanged labour productivity. Inventory/assets may rise after cash is distributed, even with no stock build. Debt/assets may fall after an asset revaluation without repayment. SG&amp;A/revenue may improve during a temporary sales spike while fixed-cost productivity stays unchanged. Classification changes can move either side without changing the underlying activity.</p>
      <KeyObservation title="Denominator discipline">Never interpret a ratio movement until both sides of the ratio have been explained.</KeyObservation>
      <p>Report the original and current numerator and denominator, their absolute movements and comparable definitions. Then ask whether price, scope, currency or an unusual transaction enlarged or contracted the denominator. A ratio improvement that disappears on a stable operational denominator is not evidence of cost control.</p>
    </section>
    <section id="unstable-bases">
      <h2>A spectacular percentage can be economically small</h2>
      <p>Profit rising from EUR 20,000 to EUR 100,000 grows 400%, yet adds only EUR 80,000. An expense rising from EUR 5,000 to EUR 50,000 grows 900%, perhaps because a function was newly established. Rank neither above a material funding gap merely because its percentage is larger.</p>
      <p>At exactly zero, percentage change is undefined. Near zero, it is unstable. With a negative base, the absolute-denominator convention can describe signed movement, but conventional growth terminology is often misleading. A loss of EUR 0.2m becoming a profit of EUR 0.1m is a EUR 0.3m turnaround; presenting it as ordinary 150% profit growth obscures the change of state. Tax moving across zero deserves the same restraint.</p>
      <p>Display absolute amounts throughout; mark zero-base and sign-changing growth as <strong>n.m. — not meaningful</strong>. Flag small bases against a materiality policy appropriate to the decision, never a universal threshold. Retain mathematical rates where useful, label their limitations, isolate non-recurring items and show multiple periods. Missing values remain unknown rather than becoming zero. Qualitative materiality still matters: a small repeated control failure may require action.</p>
    </section>

    <section id="nominal-growth">
      <h2>Separate nominal expansion from operational movement</h2>
      <p>Reported growth can combine volume, selling price, product mix, currency translation, consolidation scope and residual effects. This is a decomposition agenda, not an exact additive identity until the bridge defines sequencing, interaction allocation and source populations. A bridge should reconcile to reported change and expose the residual rather than force unsupported amounts into volume.</p>
      <p>Local selling-price inflation, wage inflation and input-cost inflation can move at different speeds. Common-size statements remove size, not inflation: a margin can compress because purchase costs reset before selling prices. A general consumer-price index may be a poor deflator for an industrial product mix. Match the index to the activity and describe any real-growth estimate as conditional on that choice.</p>
      <p>For a single homogeneous product, real growth under a suitable price index is (1 + nominal growth) / (1 + price inflation) − 1. Thus 18% nominal growth with 10% relevant price inflation implies about 7.3% real growth, not 8%. For a changing product portfolio, separate quantities and prices by product first: the aggregate deflator otherwise confounds inflation with migration towards more expensive items.</p>
      <p>Foreign-operation translation changes presentation-currency amounts without necessarily changing local operations. Transaction exposure, such as importing inputs in another currency, can change realised margin and cash requirements. Keep those mechanisms separate. <a href="https://www.ifrs.org/issued-standards/list-of-standards/ias-21-the-effects-of-changes-in-foreign-exchange-rates/">IAS 21</a> provides the financial-reporting context; a management constant-currency bridge is a separately defined analytical view, not a replacement for reported statements.</p>
      <p>Translate comparable local-period flows at a declared common rate set to isolate translation, retaining rates, dates and units. Constant-currency growth still contains price, volume and mix effects. Acquisitions require a like-for-like perimeter bridge before organic growth can be inferred. Without operational quantities and transaction detail, stop at supported hypotheses rather than assign precise driver percentages.</p>
    </section>

    <section id="cross-statement">
      <h2>A credible explanation must survive the Balance Sheet</h2>
      <p>Revenue growth is incomplete evidence of commercial success until receivables and contract assets are examined. Faster receivable growth may indicate slower collections, longer terms, changed customer mix or late-period sales. Stock rising faster than cost of sales may reflect purchase-price inflation, deliberate resilience stock, obsolete items or weaker demand. Supplier balances show how much of that investment is funded by trade credit.</p>
      <ResourceTable caption="Cross-statement relationships generate tests, not automatic causal conclusions" headers={["P&L observation", "Connected evidence", "Question to resolve"]} rows={[
        ["Revenue and volume growth", "Receivables, contract assets, inventory and supplier balances", "Collection, conversion or timing?"],
        ["Gross-margin movement", "Inventory valuation, purchase prices, mix and write-downs", "Changed unit economics or recognition timing?"],
        ["Operating-profit growth", "Retained earnings, tax, distributions and operating cash", "Did earnings convert, and where was value retained?"],
        ["Depreciation and capex", "Fixed-asset roll-forward and financing", "New capacity, disposals, impairment or useful-life changes?"],
        ["Interest expense", "Average debt, rates, fees and maturity schedule", "Funding cost, utilisation or refinancing effect?"],
        ["Non-recurring income", "Corresponding cash, asset or liability movement", "What transaction supports recognition and recurrence?"],
      ]} />
      <p>Operating profit does not flow directly into retained earnings: interest, tax and other recognised items intervene, followed by distributions and applicable adjustments. Interest can rise while closing debt falls if average borrowing, rates or fees increased. Capex needs a fixed-asset bridge including depreciation, disposals and non-cash changes; it does not normally reduce EBITDA when capitalised.</p>
      <p>Likewise, EBITDA can rise while operating cash falls through working-capital absorption, taxes and relevant interest cash flows. Capex then affects cash after investment, not ordinary operating cash flow. <a href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows.html/">IAS 7</a> distinguishes operating, investing and financing cash flows. Reconcile these separately, including non-cash movements, before inferring cash generation from two closing Balance Sheets.</p>
      <p>Days measures need matching flows and average stocks. Receivable days ordinarily use average trade receivables and credit sales; inventory days use average inventory and comparable cost of sales. Closing-balance proxies are useful warnings when averages are unavailable, but seasonality, tax inclusion, factoring, cut-off and currency can distort them. Test ageing and subsequent settlement before calling a proxy increase proven collection failure.</p>
    </section>

    <section id="hierarchy">
      <h2>Do not jump from percentage to conclusion</h2>
      <EntimemaFramework title="Interpretation hierarchy" description="Four layers preserve the order of nine analytical tests." steps={["Comparability → absolute scale → relative movement", "Structure → denominator diagnosis", "Cross-statement test → driver hypothesis → evidence", "Decision, owner and monitoring response"]} />
      <p>First establish admissible comparisons and material amounts. Then diagnose structure and both sides of each ratio. Next form competing explanations and seek evidence that could disprove the preferred one. Only then state the management implication. An unresolved material driver does not prevent action: it changes the action from endorsement to investigation, containment or monitoring.</p>
      <p>Prioritisation combines financial scale, liquidity timing, persistence, reversibility and decision sensitivity. A modest maturity shift can outrank a large non-cash revaluation. Separate a finding’s materiality from confidence in its explanation: an uncertain but consequential funding risk deserves attention before an immaterial movement with a complete narrative.</p>
    </section>

    <section id="worked-example">
      <h2>Worked comparison: growth with a heavier funding burden</h2>
      <p>Fictional Calder Components combines distribution and light manufacturing. The two full annual periods have the same perimeter, accounting policies and EUR-million presentation. Expenses below are positive deductions. Cost of sales excludes depreciation in this simplified management P&amp;L; depreciation is below EBITDA. All figures and supporting schedules are synthetic.</p>
      <ResourceTable caption="Comparative P&L: amounts in EUR m; shares of revenue; pp = percentage points" headers={["Line", "Base → current", "Δ EUR m / %", "Share base → current", "Δ pp"]} rows={[
        ["Revenue", "50.0 → 59.0", "+9.0 / +18.0%", "100.00% → 100.00%", "0.00"],
        ["Cost of sales", "35.0 → 42.5", "+7.5 / +21.4%", "70.00% → 72.03%", "+2.03"],
        ["Gross profit", "15.0 → 16.5", "+1.5 / +10.0%", "30.00% → 27.97%", "−2.03"],
        ["Logistics", "4.0 → 4.6", "+0.6 / +15.0%", "8.00% → 7.80%", "−0.20"],
        ["Payroll and other operating costs", "6.0 → 6.9", "+0.9 / +15.0%", "12.00% → 11.69%", "−0.31"],
        ["Non-recurring income", "0.0 → 0.5", "+0.5 / n.m.", "0.00% → 0.85%", "+0.85"],
        ["Reported EBITDA", "5.0 → 5.5", "+0.5 / +10.0%", "10.00% → 9.32%", "−0.68"],
        ["Recurring EBITDA", "5.0 → 5.0", "0.0 / 0.0%", "10.00% → 8.47%", "−1.53"],
      ]} />
      <p>Both subtotals reconcile: 50.0 − 35.0 − 4.0 − 6.0 = 5.0; 59.0 − 42.5 − 4.6 − 6.9 + 0.5 = 5.5. Removing the current EUR 0.5m insurance settlement leaves recurring EBITDA unchanged. The synthetic settlement schedule confirms cash receipt and no comparable base-period item; cash receipt does not make the gain recurring.</p>
      <ResourceTable caption="Balance Sheet focus: EUR m; common-size shares use total assets" headers={["Line", "Base → current", "Δ EUR m / %", "Share base → current", "Δ pp"]} rows={[
        ["Inventory", "8.0 → 11.4", "+3.4 / +42.5%", "22.86% → 27.80%", "+4.95"],
        ["Trade receivables", "7.0 → 9.2", "+2.2 / +31.4%", "20.00% → 22.44%", "+2.44"],
        ["Total cash", "4.5 → 5.0", "+0.5 / +11.1%", "12.86% → 12.20%", "−0.66"],
        ["Of which restricted", "0.0 → 1.2", "+1.2 / n.m.", "0.00% → 2.93%", "+2.93"],
        ["Current debt", "3.0 → 5.1", "+2.1 / +70.0%", "8.57% → 12.44%", "+3.87"],
        ["Non-current debt", "7.0 → 5.4", "−1.6 / −22.9%", "20.00% → 13.17%", "−6.83"],
        ["Total assets", "35.0 → 41.0", "+6.0 / +17.1%", "100.00% → 100.00%", "0.00"],
      ]} />
      <p>Shares and differences are calculated from unrounded amounts, then rounded independently. Restricted cash is a subset, never an extra asset. Other assets are 15.5 and 15.4. Supplier payables are 6.0 and 6.8, other liabilities 5.0 and 5.2, and equity 14.0 and 18.5. Thus liabilities plus equity reconcile to 35.0 and 41.0. The equity increase comprises retained net profit of 2.0 and a cash equity contribution of 2.5; no dividend or other equity movement is assumed.</p>
      <p>A compact current-year cash bridge checks the wider example. Depreciation of 2.0, interest expense of 0.8 and tax expense of 0.7 convert EBITDA of 5.5 into net profit of 2.0. With interest and tax paid equal to expense, and EUR 0.2m of other operating-liability accruals, operating cash is 5.5 − 4.8 − 0.8 − 0.7 + 0.2 = −0.6. This illustration classifies the interest payment as operating and assumes no other operating adjustments.</p>
      <p>Capex of 1.9 and depreciation of 2.0 explain other assets declining by 0.1; there are no disposals or revaluations. Financing comprises new debt of 0.5 and equity of 2.5. Consequently −0.6 − 1.9 + 0.5 + 2.5 = +0.5, reconciling cash from 4.5 to 5.0. The restriction transfers availability within total cash rather than creating another cash outflow. The business generated more reported earnings but relied on external funding for its cash increase.</p>
      <h3>What the percentages concealed</h3>
      <p>The synthetic revenue bridge assigns the EUR 9.0m increase to volume 3.0, selling price 4.0, mix 0.5 and translation 1.5, with zero scope change and residual. The ordered bridge assigns interaction effects once. Constant-currency revenue is 57.5: growth is 15%, not the reported 18%, but still includes price and mix. A general inflation deduction would not recover volume reliably.</p>
      <p>One reproducible bridge first scales base product quantities to the current total volume while holding base mix and prices; then applies current mix at base prices; then current prices; finally translation. Under that convention Calder’s sequential contributions are volume 3.0, mix 0.5, price 4.0 and translation 1.5. The ordering changes attribution, not the EUR 9.0m total. Transaction-level quantities and rates are assumed available in the fictional supporting schedule; the two statements alone cannot recover these components.</p>
      <p>Cost of sales grew 21.4%, faster than revenue, compressing gross margin by 2.03 points. That establishes a weaker aggregate relationship, not that every input price outpaced every selling price. Purchase-price, product-mix and inventory-valuation schedules must distinguish the drivers. Logistics gained EUR 0.6m while losing 0.20 points of revenue share. Its ordered ratio bridge is +1.20 points from expenditure and −1.40 from the denominator: no cost saving has been established.</p>
      <p>Within payroll and other costs, administrative payroll is unchanged at EUR 2.0m, while its revenue share falls from 4.00% to 3.39%. The 0.61-point improvement is entirely denominator arithmetic; staff-output evidence is still needed for productivity. A new compliance function grows from EUR 0.005m to EUR 0.050m, or 900%, but adds only EUR 0.045m. It is included within the operating-cost subtotal, not added twice.</p>
      <p>Inventory and receivables together absorb EUR 5.6m of additional balances. Supplier payables fund EUR 0.8m, leaving EUR 4.8m of additional trade working capital. In this illustration those movements contain no acquisition, translation, write-off or other non-cash adjustments; in real reports those bridges are required before translating balance movements into cash use.</p>
      <p>Supporting monthly schedules give average receivables of 6.5 and 8.5, with all revenue assumed credit sales on a consistent tax basis. On 365 days, receivable days rise from 47.5 to 52.6. Average inventory of 7.5 and 9.7 gives inventory days of 78.2 and 83.3 against cost of sales. Both deteriorate; neither identifies the responsible customer or stock category.</p>
      <p>Total cash increases, but unrestricted cash falls from 4.5 to 3.8, down 15.6%. Against current debt it drops from 1.50 times to 0.75 times; this is a limited coverage indicator, not a complete liquidity forecast. A EUR 1.6m maturity transfer and EUR 0.5m new current borrowing explain current debt’s EUR 2.1m rise. Total debt rises only 5%, from 10.0 to 10.5. Reclassification reveals nearer payment obligations without proving additional borrowing or a refinancing failure.</p>
      <DecisionImplication>Reported EBITDA rises 10%, but recurring EBITDA is flat, margin is lower and trade working capital needs EUR 4.8m more funding. Separate price, volume and currency; investigate stock by category and customer ageing; exclude restricted cash from immediate availability; and review the maturity schedule before committing further growth expenditure.</DecisionImplication>
    </section>
    <section id="failure-modes">
      <h2>Replace plausible commentary with corrective tests</h2>
      <ResourceTable caption="Common analytical mistakes: attraction, failure and control" headers={["Mistake", "Why it looks reasonable", "Why it fails", "Corrective test"]} rows={[
        ["Percentages without amounts; rank the largest rate first", "Comparable-looking scale", "Small bases dominate", "Show currency movement and decision materiality"],
        ["Abnormal base; month versus quarter or YTD", "Adjacent columns look comparable", "Recovery or duration masquerades as growth", "Validate scope, duration and seasonality"],
        ["Conventional growth across zero", "Formula returns a number", "Economic state changes", "n.m.; name loss-to-profit or tax reversal"],
        ["Percent versus percentage points", "Both use a percent symbol", "Different magnitudes", "Label rate and share displacement separately"],
        ["Common-size gain proves efficiency; ignore denominator", "Lower burden looks favourable", "Sales inflation or spikes alter the base", "Bridge both sides; test operational units"],
        ["Always divide by revenue", "One template is simple", "Wrong economic relationship", "Justify denominator for the decision"],
        ["Common-size removes inflation; ignore translation", "Ratios appear scale-free", "Prices and rates move unevenly", "Price and constant-currency bridges"],
        ["P&L alone; correlation proves cause", "A coherent narrative emerges", "Funding and alternative drivers disappear", "Balance Sheet, cash and disconfirming evidence"],
        ["Ignore perimeter or reclassification", "Totals reconcile", "Presentation becomes apparent performance", "Like-for-like scope and classification bridge"],
        ["Average percentages equally", "Simple arithmetic mean", "Small segments receive excessive weight", "Sum comparable numerators and denominators first"],
        ["Analyse before harmonisation; untraceable commentary", "Fast, polished output", "Incompatible values cannot support findings", "Source lineage and readiness gate"],
      ]} />
    </section>

    <section id="decision">
      <h2>A finding must expose what is known and what remains open</h2>
      <p>Use <strong>Observation → Scale → Structure → Relationship → Explanation → Uncertainty → Decision</strong>. Record observed values, absolute and relative movement, structural displacement, base validity, denominator behaviour, connected statement evidence, likely drivers, support, unresolved uncertainty and required response. Retain source locations, transformation versions and calculation definitions behind the concise management statement.</p>
      <p>For Calder: inventory rose EUR 3.4m, or 42.5%, from 22.86% to 27.80% of assets on comparable annual dates. It exceeded revenue and cost-of-sales growth; higher average inventory days reinforce the concern. Expansion alone at unchanged inventory intensity is insufficient as an explanation. Category-level purchase-price, stock-ageing and supply-policy evidence must distinguish deliberate resilience from excess or obsolete stock.</p>
      <p>The amount is observed; growth and days are calculated relationships; excess intensity is a supported inference; obsolescence remains a hypothesis. Assign operations and finance to test it before approving further stock commitments, with review of ageing, service levels and available cash. Name a review date and escalation condition appropriate to the business rather than manufacture a universal threshold.</p>
    </section>

    <section id="execution">
      <h2>Controlled comparison is an execution discipline</h2>
      <p>Within Entimema Financial Intelligence’s <Link href="/resources/traceable-financial-analysis-workflow">traceable workflow architecture</Link>, comparative analysis follows intake, period and statement extraction, harmonisation of units, currencies, signs and reporting bases, mapping, and relationship validation. The analytical layer then calculates horizontal and vertical views, flags denominator and low-base distortions, connects statements, surfaces exceptions and carries evidence into findings. Observed changes then pass to <Link href="/resources/variance-analysis-price-volume-mix-cost-drivers">price, volume, mix and cost-driver decomposition</Link>; balance-sheet movements that affect liquidity pass to <Link href="/resources/working-capital-analysis">working-capital and cash-conversion analysis</Link>. This describes the control architecture to specify for a workflow, not a claim that every driver is automatically recoverable from uploaded statements.</p>
      <p>Model intelligence may interpret statements, propose semantic mappings, identify likely comparability issues, form hypotheses, prioritise material findings and ask targeted questions. Deterministic code owns differences, rates, common-size shares, percentage points, reconciliations, period transformations, governed currency conversions, totals and fixed flags. Humans approve normalised bases, material one-offs, policy-sensitive classifications and unsupported causal explanations, and own the final management conclusion.</p>
      <p><Link href="/resources/financial-data-normalisation">Normalisation</Link>, <Link href="/resources/trial-balance-to-financial-statements">trial-balance mapping</Link>, <Link href="/resources/financial-data-validation-control-layer">validation</Link> and <Link href="/resources/confidence-human-review-ai-finance">human review</Link> establish the prerequisites. Automated period harmonisation is useful only when its transformations are supported and inspectable. Missing evidence should hold the affected comparison rather than invite a fluent substitute.</p>
      <p>The opening company became larger, but its recurring earnings did not grow and its funding demands increased. That changes the decision from celebrating headline expansion to testing unit economics and cash capacity. Comparative analysis is not the production of percentage changes. It is the disciplined explanation of why scale, structure and financial relationships moved together—or failed to.</p>
      <DecisionImplication><strong>Convert multiple reporting periods into one controlled comparative view.</strong> Explore the <Link href="/services/financial-data">Financial Data service</Link>, connect findings to <Link href="/resources/operational-driver-forecasting">operational-driver planning</Link>, or <Link href="/contact">discuss an Entimema Financial Intelligence workflow</Link>.</DecisionImplication>
    </section>
  </>;
}
