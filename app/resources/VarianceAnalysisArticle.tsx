import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-07 — Planning & Forecasting. All examples are synthetic. */
export const varianceAnalysisSections = [
  { id: "architecture", label: "From variance to explanation" },
  { id: "baseline", label: "Comparison integrity" },
  { id: "magnitude", label: "Amounts, percentages and signs" },
  { id: "revenue", label: "Price, volume and mix" },
  { id: "net-price", label: "Realised net price" },
  { id: "cost", label: "Cost and efficiency" },
  { id: "capacity", label: "Capacity and contribution" },
  { id: "interaction", label: "Interaction and residuals" },
  { id: "controls", label: "Reconciliation controls" },
  { id: "materiality", label: "Materiality and control" },
  { id: "findings", label: "Evidence and action" },
  { id: "mistakes", label: "Errors and safeguards" },
  { id: "execution", label: "Controlled execution" },
] as const;

export default function VarianceAnalysisArticle() {
  return <>
    <p className={styles.leadParagraph}>Revenue is EUR 361,000 above budget, yet the core product has lost EUR 44,000 through realised price deterioration. Material cost is EUR 51,500 above the standard requirement for actual output. EBITDA is close to plan. The report concludes that commercial strength compensated for manufacturing overspend. The totals are correct; the explanation is premature.</p>
    <p>Most revenue growth came from volume. A shift towards the higher-priced product and its better realised price offset weakness elsewhere. Material purchase rates and consumption both increased. These are different management problems, hidden inside two totals. Moreover, incremental revenue is not incremental profit: variable costs, inventory recognition and other operating movements stand between revenue and EBITDA. The opening figures cannot establish that one function compensated for another.</p>
    <KeyObservation title="Executive thesis">A budget-versus-actual table identifies where performance differs. It does not establish why it differs. A variance bridge is an accounting identity first and a business explanation second: reconcile the drivers, test their operational evidence, then assign management action.</KeyObservation>

    <section id="architecture">
      <h2>Separate measurement from explanation</h2>
      <EntimemaFramework title="Variance explanation architecture" description="Reported variance becomes a driver bridge, an evidence-tested explanation and a management action." steps={["Reported variance → price / volume / mix / cost / efficiency", "Reconciliation to the validated financial model", "Operational evidence and controllability", "Management decision, owner and forecast consequence"]} />
      <p>Measurement locates the difference. Decomposition attributes arithmetic effects under a convention. Reconciliation proves completeness against the financial model. Operational explanation tests mechanisms; accountability identifies who could influence them; decision consequence specifies what must change. A bridge can pass the first three stages and still contain an unproven business hypothesis.</p>
      <p>Define the baseline and scope, validate periods and units, measure absolute and relative movement, then separate activity from rates. Decompose revenue and costs, disclose interaction, reconcile, rank material drivers, classify controllability and seek operational evidence. Only then translate each finding into a decision. This order prevents a persuasive narrative from becoming a substitute for a controlled calculation.</p>
    </section>

    <section id="baseline">
      <h2>The comparison population is part of the model</h2>
      <p>A baseline represents an economic claim about expected performance. Original budget tests delivery against the approved commitment; latest forecast tests delivery against a more recent expectation that may already incorporate adverse conditions. Prior period and prior year answer temporal questions. Contractual price, operational target and standard cost test specific obligations or resource requirements. A normalised reference case needs an approved adjustment bridge to the original.</p>
      <ResourceTable caption="Four baselines that must remain distinct" headers={["Baseline", "What remains fixed", "Question answered"]} rows={[
        ["Static budget", "Planned activity, mix and rates", "How far is the business from its original plan?"],
        ["Flexible budget", "Defined standard rates and efficiency; actual activity", "What should actual activity have cost?"],
        ["Latest forecast", "Named expectation vintage", "What changed since the last informed view?"],
        ["Standard", "Approved input quantity, yield or rate", "Did the process meet its resource requirement?"],
      ]} />
      <p>Comparing actual variable cost with a static budget combines additional activity and resource performance. If output rises, expected material consumption normally rises too. Flex the standard requirement to actual good output before calling excess consumption inefficiency. Preserve the static-to-flexed movement as the activity effect; do not erase it from the overall budget bridge.</p>
      <p>Suppose a separate static plan allowed 80,000 kg at EUR 4 for EUR 320,000. Actual good output requires 100,000 kg at that standard, so the flexed allowance is EUR 400,000. Against actual cost of EUR 451,500, the static variance is EUR 131,500: EUR 80,000 activity plus EUR 51,500 price and usage. Calling the entire EUR 131,500 factory inefficiency would assign the cost of additional output to process failure.</p>
      <p>Before calculation, align entity, period length, product and customer scope, quantity units, currency, gross or net revenue, discounts and rebates, product classifications, cost perimeter, standard version, allocation logic, sign convention and consolidation scope. Retain effective dates and approved transformations. A tonne cannot be added to a service hour simply because both columns are called quantity.</p>
      <p>New products have no observed budget price; discontinued products have no actual sales. Define an entry/exit or scope bridge, or use an explicitly approved comparable reference. Do not invent missing prices or drop unmatched records. Returns and negative quantities may require a separate population. Aggregating heterogeneous units into a portfolio volume produces arithmetic without a defensible economic meaning.</p>
      <KeyObservation title="Comparison integrity">The bridge inherits every inconsistency in the baseline. Decomposition cannot repair an invalid comparison population.</KeyObservation>
    </section>

    <section id="magnitude">
      <h2>Magnitude, direction and consequence are separate</h2>
      <Formula label="Declared signed-movement convention">Absolute variance = Actual − Baseline<br />Percentage variance = (Actual − Baseline) / |Baseline| × 100</Formula>
      <p>For comparable positive revenue, EUR 361,000 divided by EUR 1,800,000 is 20.06%. For positive cost values, an increase has the same mathematical sign but usually the opposite immediate earnings consequence. Higher maintenance expenditure may protect continuity; lower expenditure may reflect delayed maintenance or underproduction. Lower working-capital funding cost can follow weaker growth rather than better treasury execution.</p>
      <p>At zero baseline, percentage variance is undefined. Near zero, a spectacular rate can describe an immaterial amount. With negative bases, the absolute denominator preserves signed direction, but a loss becoming profit is a turnaround, not ordinary growth. Show the currency change and label misleading rates “n.m. — not meaningful”. Missing values are unknown, never automatic zeroes.</p>
      <p>A EUR 1m increase on EUR 100m is only 1%, yet may change a financing decision. A EUR 900 increase on EUR 100 is 900%, yet may not. Present amounts, percentages and economic classification together; retain qualitative control exceptions even below quantitative thresholds. Do not let a favourable badge suppress investigation of an adverse component.</p>
    </section>

    <section id="revenue">
      <h2>Move volume, then mix, then price</h2>
      <Formula label="Single-product sequential bridge; B is budget and A is actual">Rᴮ = Qᴮ × Pᴮ; Rᴬ = Qᴬ × Pᴬ<br />ΔR = (Qᴬ − Qᴮ)Pᴮ + Qᴬ(Pᴬ − Pᴮ)</Formula>
      <p>The first term values activity change at budget price. The second values price change at actual quantity, assigning the price-volume interaction to price. This is an exact convention, not proof that the commercial team caused the whole price term. Multiple products require another distinction: total activity can change independently of the composition of that activity.</p>
      <Formula label="Portfolio method: comparable units, stable population, volume → mix → price">P̄ᴮ = Σ(QᴮᵢPᴮᵢ) / Qᴮtotal<br />Volume = (Qᴬtotal − Qᴮtotal) × P̄ᴮ<br />Qᵐⁱˣᵢ = Qᴬtotal × Qᴮᵢ / Qᴮtotal<br />Mix = Σ[(Qᴬᵢ − Qᵐⁱˣᵢ)Pᴮᵢ]<br />Price = Σ[Qᴬᵢ(Pᴬᵢ − Pᴮᵢ)]<br />ΔRevenue = Volume + Mix + Price</Formula>
      <p>Volume measures total activity at budget portfolio economics. Mix measures redistribution towards products with different budget prices. Price measures realised rate change within the actual sales population. The method requires positive meaningful total budget quantity and comparable units; otherwise decompose within valid groups and aggregate monetary effects.</p>
      <ResourceTable caption="Synthetic revenue population: quantities in comparable units; prices and revenue in EUR" headers={["Product", "Budget quantity", "Budget price", "Budget revenue", "Actual quantity", "Actual price", "Actual revenue"]} rows={[
        ["Product A", "10,000", "100", "1,000,000", "11,000", "96", "1,056,000"],
        ["Product B", "5,000", "160", "800,000", "6,500", "170", "1,105,000"],
        ["Total", "15,000", "—", "1,800,000", "17,500", "—", "2,161,000"],
      ]} />
      <p>Budget weighted-average price is EUR 120. Actual volume exceeds budget by 2,500 units, yielding EUR 300,000. Holding budget mix at 17,500 units gives Product A 11,666⅔ units and Product B 5,833⅓ units. Actual mix therefore contributes −EUR 66,666⅔ for A and +EUR 106,666⅔ for B: exactly EUR 40,000 net. Calculate with unrounded shares; round only for display.</p>
      <p>Price contributes 11,000 × (96 − 100) = −EUR 44,000 for A and 6,500 × (170 − 160) = +EUR 65,000 for B. Net price is +EUR 21,000. Product A revenue rises EUR 56,000 despite its adverse price movement; Product B adds EUR 305,000. Those segment movements reconcile to EUR 361,000 without implying equally strong performance.</p>
      <ResourceTable caption="Reconciled revenue PVM bridge — EUR; positive effects increase revenue" headers={["Bridge step", "Effect", "Running revenue"]} rows={[
        ["Budget revenue", "—", "1,800,000"],
        ["Volume", "+300,000", "2,100,000"],
        ["Mix", "+40,000", "2,140,000"],
        ["Price", "+21,000", "2,161,000"],
        ["Residual", "0", "2,161,000"],
      ]} />
      <DecisionImplication>EUR 300,000 + EUR 40,000 + EUR 21,000 = EUR 361,000. Volume explains 83.10% of the increase. Investigate Product A pricing and test whether Product B’s greater portfolio weight remains attractive after variable cost, capacity consumption, customer concentration and persistence are considered.</DecisionImplication>
    </section>

    <section id="net-price">
      <h2>Price means realised economics, not the price list</h2>
      <Formula label="Gross-to-net commercial boundary">Net revenue = List revenue − Discounts − Rebates − Returns − Bonuses − Credits ± Other commercial adjustments</Formula>
      <p>Divide consistently defined net revenue by matching net quantities. An unchanged list price can conceal larger discounts, retrospective rebates or logistics concessions. Conversely, a nominal price increase can disappear after specification changes, currency or input inflation. Separate customer and channel terms where the data allows; do not call all unexplained commercial movement “price”.</p>
      <p>Credit notes and rebate accruals may refer to earlier sales. Allocate them to the appropriate analytical population with a bridge back to booked revenue, or retain a timing effect. Freight included in one price and excluded from another breaks comparability. Product A’s EUR 4 decline is an observed net rate movement; discounting remains a hypothesis until transaction and contract evidence supports it.</p>
      <p>For currency, first construct a declared constant-currency comparison, then bridge translation to reported totals. Transaction FX affecting purchase economics is different from translating a foreign entity. State where FX interaction sits. Relevant commodity or selling-price indices can contextualise nominal movements, but a general inflation deduction cannot recover product-level volume and mix.</p>
    </section>

    <section id="cost">
      <h2>Flex the requirement before judging efficiency</h2>
      <Formula label="Consumed-material bridge; SQ is standard quantity allowed for actual good output">Standard cost allowed = SQ × SP<br />Actual cost = AQ × AP<br />Price effect = AQ × (AP − SP)<br />Usage effect = (AQ − SQ) × SP<br />Actual cost − Standard cost allowed = Price effect + Usage effect</Formula>
      <p>For each actual product, multiply good output by its approved standard input requirement, then sum the quantities. The allowance must reflect actual output mix and the defined normal loss. Using budget output would contaminate efficiency with activity. Separate work-in-progress changes, rework and unrecorded output before interpreting consumption.</p>
      <ResourceTable caption="Synthetic material input: the allowance already corresponds to actual good output" headers={["Input", "Value"]} rows={[
        ["Standard quantity allowed", "100,000 kg"], ["Standard price", "EUR 4.00/kg"],
        ["Actual quantity consumed", "105,000 kg"], ["Actual consumed-material rate", "EUR 4.30/kg"],
      ]} />
      <ResourceTable caption="Reconciled material-cost bridge — EUR; positive effects increase cost" headers={["Bridge step", "Effect", "Running cost"]} rows={[
        ["Standard cost allowed", "—", "400,000"], ["Price: 105,000 × 0.30", "+31,500", "431,500"],
        ["Usage: 5,000 × 4.00", "+20,000", "451,500"], ["Residual", "0", "451,500"],
      ]} />
      <p>EUR 451,500 − EUR 400,000 = EUR 51,500 adverse, or 12.875% above the flexed allowance. The price term is EUR 31,500; usage is EUR 20,000. The table orders the two additive effects for presentation; the formula allocates their EUR 1,500 interaction to price by using actual consumption. It is not a new decomposition convention.</p>
      <p>Purchase price and consumed-material rate coincide only under the example’s simplifying assumption: one homogeneous input, no opening inventory valuation difference and no purchase-to-consumption timing difference. In practice, a purchase-price variance on receipts needs an inventory valuation and quantity bridge before being combined with usage on consumption. Otherwise apparently reconciled procurement and factory reports cover different populations.</p>
      <p>Supplier increases, commodity movement, order size, emergency sourcing, FX and specification changes are price hypotheses. Yield loss, scrap, material quality, machine settings, start-up losses, an incorrect standard or missing output are usage hypotheses. Inspect purchase orders, receipts, inventory valuation, quality records and production balances. Arithmetic separates the effects; it does not select the cause.</p>
      <p>The reverse pattern also matters. In a separate sensitivity, consumption of 90,000 kg at EUR 4.30 costs EUR 387,000 against the same EUR 400,000 allowance. The EUR 13,000 favourable total contains EUR 27,000 adverse price and EUR 40,000 favourable usage. Verify unchanged good output and quality before celebrating efficiency: missing consumption postings or an overstated standard could create the same numerical result.</p>
      <p>For multiple substitutable inputs, usage can be split into input mix and yield, provided the standard recipe and output basis are valid. Do not add those subdrivers to usage again. <a href="https://www.accaglobal.com/sg/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/mat-yield.html">ACCA’s material mix and yield guidance</a> supports this distinction: changing the recipe can affect both cost and output quality.</p>
      <p>Labour follows actual hours × (actual rate − standard rate), plus (actual hours − allowed hours) × standard rate. Distinguish overtime premiums, skill mix and idle time where supported, without counting hours twice. Variable overhead needs its own causal activity base: spending/rate and efficiency effects should reconcile to the flexed allowance, with static-to-flexed driver volume retained separately.</p>
    </section>

    <section id="capacity">
      <h2>Lower unit cost does not establish process improvement</h2>
      <Formula label="Fixed-cost denominator effect">Fixed cost per unit = Total fixed cost / Production volume</Formula>
      <p>With unchanged spending of EUR 120,000, production rising from 10,000 to 12,000 units reduces fixed cost per unit from EUR 12 to EUR 10. No spending saving occurred. At a standard absorption rate of EUR 10 based on 12,000 units, production of 10,000 absorbs EUR 100,000, leaving EUR 20,000 underabsorbed against the planned EUR 120,000.</p>
      <p>Separate actual versus planned fixed spending, planned versus actual production, practical capacity, absorbed cost and unabsorbed capacity cost. Calendar changes and shutdowns may explain available hours; bottleneck throughput, downtime, yield and product mix explain different operating constraints. A capacity-volume variance is not automatically avoidable expenditure, and producing unwanted stock to improve absorption can worsen cash and obsolescence.</p>
      <Formula label="Contribution bridge for a consistent recognised-sales perimeter">ΔContribution margin = ΔRevenue − ΔVariable cost</Formula>
      <p>Revenue mix is not profit mix. A higher-priced product may consume more scarce machine time, material, logistics, working capital, service or warranty support. Value the sales mix at budget contribution rates for a contribution bridge, then isolate selling-price and variable-cost changes once. Compare contribution per bottleneck hour where capacity binds.</p>
      <p>Fixed spending, absorption, inventory movements, currency and one-offs need explicit treatment before extending contribution to EBITDA. Do not subtract a production-cost variance from a sales bridge without reconciling inventory and recognition. The opening revenue and material examples are deliberately partial: missing labour, overhead and other operating movements prevent an exact EBITDA explanation.</p>
    </section>

    <section id="interaction">
      <h2>Interaction is a policy choice; residual is a control result</h2>
      <Formula label="Alternative single-product convention with interaction separated">Volume = (Qᴬ − Qᴮ)Pᴮ<br />Price = Qᴮ(Pᴬ − Pᴮ)<br />Interaction = (Qᴬ − Qᴮ)(Pᴬ − Pᴮ)<br />ΔRevenue = Volume + Price + Interaction</Formula>
      <p>For Product A, budget-quantity price is −EUR 40,000 and interaction is −EUR 4,000; together they equal the sequential −EUR 44,000 price effect. For B, EUR 50,000 plus EUR 15,000 equals EUR 65,000. Total separate price of EUR 10,000 plus EUR 11,000 interaction equals EUR 21,000. Retain the portfolio volume and mix definitions when making this comparison.</p>
      <p>Sequential allocation is reproducible and exact, but order-dependent. Separate interaction is transparent but may have no natural owner. Proportional allocation needs a defined weighting rule and remains conventional, not causal. Symmetric midpoint or Shapley-style methods reduce order dependence by averaging allocations, at the cost of more explanation and implementation complexity.</p>
      <p>This article uses volume → mix → price for revenue and actual-quantity price plus standard-rate usage for cost. Keep those policies stable across periods. Show a material interaction separately as a reconciled alternative view or a clearly labelled breakdown of its parent driver, never as an additional contribution. Version and approve any method change; restate comparatives or disclose the attribution discontinuity.</p>
      <Formula label="Every bridge retains its residual">Ending value = Starting value + ΣDriver effects + Residual<br />Residual = Total variance − ΣDriver effects</Formula>
      <p>A mathematical residual means that the specified drivers do not exhaust the financial difference. Missing business explanation means a calculated driver lacks sufficient causal evidence. Zero residual does not solve the second problem. Classify rounding, missing records, scope differences and unsupported components separately; do not force them into “mix” or an unexplained “Other”.</p>
      <p>For a complete bridge, residual is zero before display rounding. Any remaining amount must be calculated, classified, investigated and retained, with explicit approval of immaterial treatment or unresolved status. A material unresolved balance blocks decision-ready status. Residual treatment belongs in model design, not in formatting after the bridge fails.</p>
    </section>

    <section id="controls">
      <h2>Reconciliation is a release gate</h2>
      <p>A controlled bridge records start and end values, each effect, method and sign convention, economic status, materiality, controllability, evidence reference, owner, residual and reconciliation status. Freeze source and standard versions. Preserve calculation precision and apply documented rounding tolerances only to presentation differences; a tolerance is not permission to conceal missing transactions.</p>
      <ResourceTable caption="Nine deterministic controls before a bridge becomes decision-ready" headers={["Control", "Required test"]} rows={[
        ["Population", "Entities, periods, products, customers, units, currencies and cost perimeter agree"],
        ["Source totals", "Detailed start and end values tie to the validated financial model"],
        ["Driver identity", "Total variance equals driver effects plus disclosed residual"],
        ["Quantity", "Product and input quantities agree to operational source totals"],
        ["Price", "Revenue or cost divided by quantity matches the declared realised-rate basis"],
        ["Mix", "Shares sum to 100% within each valid population"],
        ["Sign", "Signed movement and economic favourable/adverse status are validated separately"],
        ["No duplication", "Each effect belongs once; subdrivers replace or explain their parent"],
        ["Version", "Budget, forecast, standard and calculation policy are identified and retained"],
      ]} />
      <p>A critical failure holds the affected bridge. Finance should not approve a total because its chart looks plausible while source totals or quantities disagree. Where evidence supports only a narrower population, publish that boundary and its reconciliation to the full population rather than imply complete driver coverage.</p>
    </section>

    <section id="materiality">
      <h2>Rank the decision, then assign the response</h2>
      <p>Materiality combines absolute and percentage impact, margin sensitivity, persistence, trend, volatility, recurrence, concentration, strategic significance and covenant or liquidity relevance. Set thresholds for the actual decision and horizon. A small repeated process failure may outrank a large temporary timing variance; an offsetting total must not net away a concentrated commercial risk.</p>
      <ResourceTable caption="Materiality and controllability matrix — contextual priorities, not universal thresholds" headers={["Financial impact", "Persistence", "Control class", "Decision sensitivity", "Management response"]} rows={[
        ["Margin leakage", "Recurring", "Directly controllable", "Pricing authority", "Correct commercial terms; commercial owner"],
        ["Input inflation", "Potentially persistent", "Influenceable / external", "Sourcing and liquidity", "Negotiate, reprice or mitigate; procurement and treasury"],
        ["Capacity allocation", "Policy-dependent", "Policy-driven", "Product viability", "Escalate and approve policy; finance leadership"],
        ["Accrual displacement", "Expected reversal", "Timing-driven", "Forecast period", "Verify reversal and monitor; controller"],
        ["Reported cost shift", "Until corrected", "Classification-driven", "Comparability", "Correct mapping or explain; reporting owner"],
        ["Unexplained usage", "Unknown", "Unresolved", "Standard and process control", "Investigate before assigning blame; operations and finance"],
      ]} />
      <p>Direct control depends on the reporting horizon. A manager may influence supplier terms but not commodity markets; an internal sourcing policy may constrain that influence. Externally driven does not mean irrelevant: somebody still owns hedging, repricing, sourcing, capital or forecast responses. Distinguish responsibility for the outcome from responsibility for the response.</p>
      <KeyObservation title="Attention is selective; reconciliation is complete">Materiality determines attention, not mathematical existence. Every driver must reconcile even when only some drivers deserve management action.</KeyObservation>
    </section>

    <section id="findings">
      <h2>Turn the driver into an evidence-linked decision</h2>
      <EntimemaFramework title="Management decision hierarchy" description="Ten tests, grouped into four responsive layers." steps={["Comparison integrity → total variance → driver decomposition", "Reconciliation → materiality → controllability", "Operational evidence → persistence", "Forecast consequence → management action"]} />
      <p>Each material finding contains the reported variance, decomposed driver, financial magnitude, operational evidence, favourable or adverse consequence, controllability, persistence, forecast implication, required action and owner. Use <strong>Variance → Driver → Evidence → Consequence → Controllability → Decision</strong>. Identify unresolved alternatives and a review date alongside the concise executive statement.</p>
      <p>For the revenue example: the EUR 361,000 increase contains EUR 300,000 volume and only EUR 21,000 net price. Product A’s EUR 44,000 price loss is confirmed by the synthetic quantity and net-price schedule, but discounting is not yet proven. The commercial director should reconcile invoices, credits and contract terms, distinguish temporary concessions from recurring erosion, and update A’s forecast realised price only when evidence supports persistence.</p>
      <p>Product B’s higher price and greater portfolio weight offset A’s deterioration. Commercial finance should test contribution, customer concentration and constrained production time before recommending more B volume. The forecast implication is conditional: preserve the mix assumption only if profitable demand and deliverable capacity support it. A favourable revenue result alone cannot authorise portfolio expansion.</p>
      <p>For materials, procurement owns investigation of the EUR 31,500 rate effect; operations and the controller jointly test the EUR 20,000 usage effect against output, scrap and standard records. Both increase cost, but controllability and recurrence remain unresolved. Update purchase-rate and yield assumptions separately after validation; do not impose a general factory savings target equal to EUR 51,500.</p>
      <p>Evidence should also challenge the preferred explanation. If discounts are unchanged, test customer terms, returns and accrual timing. If scrap is stable, test output capture and standard versions before blaming operators. Close the finding only when the decision, owner, effective date and monitoring measure are recorded; a well-written explanation is not itself corrective action.</p>
    </section>

    <p>Monitor the driver where the response operates: realised net price by comparable contract cohort, kilograms per good unit by production stage, or contribution per constrained hour by product. Keep volume and quality beside efficiency measures. Reconcile subsequent results with the original finding so a favourable aggregate does not conceal an unsuccessful corrective action or a new offsetting loss.</p>
    <section id="mistakes">
      <h2>Replace plausible shortcuts with explicit safeguards</h2>
      <ResourceTable caption="Failure → apparent logic → failure mechanism → required control" headers={["Failure", "Why it looks reasonable", "Why it fails", "Required control"]} rows={[
        ["Amounts only; percentages only; low-base ranking", "One clear ranking", "Scale or denominator risk disappears", "Show both measures and decision sensitivity"],
        ["Total variance explains performance", "The report balances", "Offsetting drivers disappear", "Reconciled decomposition and evidence"],
        ["Static variable-cost comparison", "Approved budget", "Activity becomes inefficiency", "Flex to actual good output"],
        ["Different populations; gross versus net", "Matching column names", "Scope and terms masquerade as performance", "Population and price-definition controls"],
        ["Mix called volume; unknowns called mix", "A convenient label", "Composition and missing data are confused", "Explicit mix baseline and residual"],
        ["Hidden interaction; changing order; wrong quantity base", "Each formula looks familiar", "Attribution changes silently", "Versioned method and actual-quantity tests"],
        ["No reconciliation; forced Other", "The chart looks complete", "A balancing plug hides omissions", "Source totals and residual gate"],
        ["Sign means favourable; unit-cost fall means efficiency", "Positive or cheaper looks better", "Economic meaning and absorption disappear", "Separate spending, output and consequence"],
        ["External means irrelevant; blame before evidence", "Ownership seems obvious", "Response and outcome control differ", "Controllability classification and operational tests"],
        ["Nominal price proves strength; revenue mix proves profit", "Top-line growth", "FX, inflation and resource intensity intervene", "Net-price and contribution bridges"],
        ["Executive narrative before model validation", "A fluent explanation", "Unsupported causes become apparent facts", "Validated model, lineage and causal uncertainty"],
      ]} />
    </section>

    <section id="execution">
      <h2>From a validated model to controlled driver analysis</h2>
      <p>For Entimema Financial Intelligence, the required execution sequence is <strong>validated financial model → comparable budget, forecast, standard and actual populations → deterministic driver calculations → price, volume, mix, cost and efficiency bridges → reconciliation → materiality and controllability → evidence-linked interpretation → executive findings</strong>. This specifies a controlled analytical workflow, not a claim that uploaded statements automatically reveal every operational driver.</p>
      <p>Model intelligence may identify semantic drivers, propose mappings, detect ambiguity, develop explanation hypotheses, prioritise findings and request targeted clarification. Deterministic code owns variance arithmetic, flexible budgets, PVM and rate/usage effects, reconciliation, residuals, control totals and flags under defined materiality rules. Humans approve baselines, interaction policy, controllability, material one-offs, unresolved causal conclusions and final decisions.</p>
      <p><Link href="/resources/financial-data-validation-control-layer">Financial data validation</Link> establishes admissible evidence; the <Link href="/resources/traceable-financial-analysis-workflow">end-to-end workflow</Link> preserves its lineage. <Link href="/resources/horizontal-and-vertical-financial-analysis">Horizontal and vertical financial analysis</Link> is the preceding detection layer, while the <Link href="/resources/month-end-reporting-workflow">controlled month-end reporting workflow</Link> makes the reconciled bridge recurring. <Link href="/resources/operational-driver-forecasting">Operational-driver forecasting</Link> carries tested assumptions forward, while <Link href="/resources/building-a-manufacturing-cost-architecture">manufacturing cost architecture</Link> defines the cost perimeter.</p>
      <p>The opening report no longer supports a general claim of commercial strength offsetting factory weakness. It supports distinct investigations into core-product pricing, portfolio contribution, input rates and consumption, with the remaining EBITDA bridge still required. Management needs a reconciled explanation of which drivers changed, how much each contributed and which decision follows—not a longer variance table.</p>
      <DecisionImplication><strong>Move from variance reporting to driver-level explanation.</strong> Explore <Link href="/services/budgets-and-forecasting">Planning &amp; Forecasting</Link> and the <Link href="/services/financial-data">Financial Data service</Link>, or <Link href="/contact">discuss an Entimema Financial Intelligence workflow</Link>. The model establishes what changed. Deterministic bridges quantify how. Evidence and judgement establish why it matters.</DecisionImplication>
    </section>
  </>;
}
