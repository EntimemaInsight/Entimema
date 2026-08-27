import Link from "next/link";
import { DecisionImplication, EntimemaFramework, KeyObservation, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-11 — Financial Architecture. All example entities, amounts and policies are fictional. */
export const managementReportingSections = [
  { id: "purpose", label: "Separate reporting purposes" },
  { id: "decision", label: "Specify the decision" },
  { id: "architecture", label: "Build the information layer" },
  { id: "hierarchy", label: "Govern the KPI hierarchy" },
  { id: "comparison", label: "Choose comparative context" },
  { id: "drivers", label: "Explain financial mechanisms" },
  { id: "exceptions", label: "Concentrate executive attention" },
  { id: "commentary", label: "Connect findings to action" },
  { id: "evidence", label: "Preserve drill-down" },
  { id: "cadence", label: "Match cadence to decisions" },
  { id: "pack", label: "Design the management pack" },
  { id: "example", label: "Inspect a worked example" },
  { id: "findings", label: "Reduce to five findings" },
  { id: "readiness", label: "Release by intended use" },
  { id: "failures", label: "Recognise false completeness" },
  { id: "execution", label: "Execute the decision layer" },
] as const;

export default function ManagementReportingArticle() {
  return <>
    <p className={styles.leadParagraph}>The monthly management pack contains 68 pages, 94 KPIs, detailed P&amp;L and Balance Sheet tables, twelve trend charts, commentary from every department and more than twenty pages of appendices. It arrives on time. The numbers reconcile. At the meeting, the CFO still asks: why did EBITDA miss forecast; is the margin decline temporary or structural; how much cash is trapped in operations; which customer or product created the deterioration; what must we decide this month; and who owns the response?</p>
    <p>The pack contains the data. It has not organised information around the decisions. Numerical completeness and decision usefulness are different achievements. Adding another chart, department narrative or distribution cycle will not repair an undefined management question.</p>
    <KeyObservation title="Executive thesis">More indicators do not create better management visibility. Visibility improves when the report reduces a validated financial model to the information required for a specific decision: decision-specific measures, material exceptions, evidence-linked findings and owned management actions.</KeyObservation>

    <section id="purpose">
      <h2>Statutory and management reporting answer different questions</h2>
      <p>Statutory reporting organises accountable financial information around accounting standards, legal entities, prescribed classifications, external disclosure and applicable regulatory or audit requirements. Controlled accounting policies establish the basis for recognised historical position and performance. That discipline remains essential; an internal presentation cannot substitute for it.</p>
      <p>Management reporting organises information around internal decisions: business models, products, customers, channels, operational processes and responsibility centres. Plans, forecasts and forward implications sit beside historical results. The organising question becomes what management can protect, improve or change, within a defined horizon.</p>
      <p>A commercial repricing view may need contribution margin by customer. A capacity decision may need bottleneck contribution and avoidable cost. Functional accountability may need controllable costs rather than allocated corporate overhead. Normalised performance, alternative segments and scenarios require explicit bridges to accounting results, approved definitions and retained adjustments. Neither a different cadence nor a different materiality permits an unexplained reconciliation difference.</p>
      <KeyObservation title="Reporting boundary">Statutory reporting establishes accountable financial truth. Management reporting reorganises that truth around internal decisions. A new presentation may change the analytical structure; it must not weaken the evidence chain.</KeyObservation>
    </section>

    <section id="decision">
      <h2>Specify the decision before selecting the information</h2>
      <p>For each section, write a short decision contract: owner, question, horizon, financial outcome, operational drivers, materiality, uncertainty tolerance, required evidence, available actions and review cadence. “Explain performance” is too broad. “Approve targeted repricing for the next quarter without losing profitable constrained capacity” establishes a useful boundary.</p>
      <ResourceTable caption="Decision-specific information contracts" headers={["Decision", "Financial outcome", "Principal drivers", "Possible cadence"]} rows={[
        ["Reprice a product", "Contribution margin", "Realised price, material cost, mix, volume", "Monthly or event-driven"],
        ["Address liquidity pressure", "Operating cash and headroom", "DSO, DIO, DPO, capex, debt service", "Weekly or monthly"],
        ["Change production plan", "Unit economics and throughput", "Yield, downtime, mix, bottleneck use", "Weekly or monthly"],
        ["Revise forecast", "Full-year earnings and cash", "Run rate, committed orders, costs, working capital", "Monthly"],
        ["Intervene in collections", "Overdue cash exposure", "Ageing, disputes, promises, concentration", "Daily or weekly"],
      ]} />
      <p>The same validated model can serve several audiences, but not through one universal pack. The board needs capital and risk implications; the operating team needs intervention detail; the controller needs accounting and evidence exceptions. Shared definitions prevent contradictory truth without forcing identical information density.</p>
      <p>Remove a measure from the executive layer when its movement cannot change a decision, trigger investigation or test an important assumption. Retain it in diagnostic evidence if necessary. A report cannot be optimised until the decision it supports is explicit.</p>
    </section>

    <section id="architecture">
      <h2>Connect the objective to an accountable response</h2>
      <EntimemaFramework title="Management-information architecture" description="Five linked analytical layers fit within four responsive groups. Drill-down travels towards evidence; executive synthesis travels back towards the objective." steps={[
        "Objective → Financial outcome: define what must improve and the validated result that measures it.",
        "Operational driver: connect that result to the activities and conditions that explain movement.",
        "Material exception and interpretation: identify the departure, evidence, economic implication and uncertainty.",
        "Decision → Action → Follow-up: select the response, accountable owner, deadline and review condition.",
      ]} />
      <p>The five layers are objective, financial result, operational drivers, exception and interpretation, and decision and action. They are relationships, not five mandatory report pages. One finding may connect a margin objective to realised price, a specific discount exception and a commercial approval.</p>
      <p>Start from a model whose source population, mappings, adjustments, period definitions and reconciliations support the intended use. <Link href="/resources/financial-data-validation-control-layer">FIR-03 financial data validation</Link> establishes that boundary. Then ask, in order: what happened, why, why does it matter, what must be decided, and who must act? Stopping at the first question leaves a descriptive report.</p>
    </section>

    <section id="hierarchy">
      <h2>A KPI hierarchy makes compression reversible</h2>
      <EntimemaFramework title="KPI hierarchy: outcomes down to diagnostic evidence" description="Every executive KPI should lead downward to evidence and upward to a decision. Levels express dependencies, not a flat catalogue." steps={[
        "Enterprise Outcomes: revenue, EBITDA or operating profit, operating cash, liquidity headroom, return on invested capital, leverage and forecast outcome.",
        "Financial Mechanisms: price-volume-mix, gross margin, operating-cost structure, working-capital requirement, cash conversion, capex, financing cost, tax and exceptional items.",
        "Operational Drivers: units, realised price, consumption, yield, downtime, labour hours, stock age, overdue receivables, payment terms and concentration.",
        "Diagnostic Evidence: account, transaction, invoice, material, customer, supplier, production order, cost centre and source location.",
      ]} />
      <p>Govern each KPI through a definition, formula, numerator and denominator, unit, source, owner, frequency, target or comparison, materiality logic, drill-down path, permitted interpretation and limitations. Record effective versions. Changing the definition while retaining the label creates a false trend.</p>
      <p>For example, DSO requires a declared receivables population, credit-sales denominator, averaging method and day convention. The approved interpretation is collection intensity within that scope; it does not independently prove overdue debt or collectability. Its evidence path must reach ageing, invoices and subsequent receipts. The owner of the definition may be Finance while collections owns the response.</p>
      <p>A lower-level metric earns executive prominence temporarily when it threatens an enterprise outcome. Yield may enter the decision page during a material production problem and return to operational reporting after validated recovery. Retirement criteria prevent yesterday’s exception becoming tomorrow’s permanent KPI.</p>
    </section>

    <section id="comparison">
      <h2>Each comparative view has a different analytical job</h2>
      <ResourceTable caption="Select the comparison required by the decision" headers={["View", "Question answered", "Control"]} rows={[
        ["Actual", "What has been recognised or observed?", "State accounting and observation cut-off"],
        ["Budget", "What was originally authorised or planned?", "Retain the approved baseline"],
        ["Latest forecast", "What is now expected?", "Identify forecast date and assumptions"],
        ["Prior period", "What changed against historical performance?", "Bridge scope and seasonal differences"],
        ["Run rate", "What would continuing current performance imply?", "Disclose extrapolation limits"],
        ["Scenario", "What may happen under defined assumptions?", "Do not label a sensitivity as a prediction"],
      ]} />
      <p>Actual versus budget tests delivery against plan. Actual versus the forecast frozen before the period tests forecast error or new information. Actual versus prior year supplies historical context. Forecast versus budget tests whether the approved objective remains attainable; run rate versus forecast exposes the execution required to get there. A forecast updated after actuals arrive cannot fairly measure forecasting accuracy for that interval.</p>
      <p>Align period duration, entity scope, currency, units, classification, accounting treatment, mapping, sign, seasonality and version before comparison. Clearly separate year-to-date flows, full-year expectations and closing positions. Use percentage points for changes in margins or ratios. <Link href="/resources/horizontal-and-vertical-financial-analysis">FIR-06 comparative analysis</Link> explains denominator and structural effects.</p>
      <p>Do not place all six comparisons beside every line. Preserve them in the model and choose the relevant view. Excess columns encourage readers to select whichever baseline makes their preferred narrative look strongest.</p>
    </section>

    <section id="drivers">
      <h2>Financial relationships explain contribution before causality</h2>
      <ResourceTable caption="Connect outcomes to operating mechanisms" headers={["Outcome", "Relationships to investigate"]} rows={[
        ["Revenue", "Price, volume, mix and customer/channel composition"],
        ["Gross margin", "Realised price, purchase cost, yield, mix and inventory valuation"],
        ["Operating cost", "Activity, capacity, headcount, rates and discretionary spending"],
        ["Working capital", "Receivables, inventory and payables timing"],
        ["Operating cash", "EBITDA, non-cash adjustments, working capital, tax and interest"],
        ["Capex", "Capacity, maintenance, productivity and strategic projects"],
        ["Forecast", "Run rate, committed activity, assumptions and risks"],
      ]} />
      <p>Separate observed movement, deterministic contribution, supported explanation, unresolved hypothesis and decision consequence. A reconciled price-volume-mix bridge establishes how revenue changes under its decomposition convention. It does not establish why customers accepted discounts or whether the volume is sustainable. Operational evidence must support those explanations.</p>
      <p>Higher production can reduce absorbed unit cost while building unwanted stock. Positive revenue mix can lower contribution margin when growth favours higher-priced but less profitable products. Neither correlation nor an unexplained residual proves operational causality. <Link href="/resources/variance-analysis-price-volume-mix-cost-drivers">FIR-07 variance analysis</Link> supplies the controlled driver bridge; management reporting determines which resulting finding needs attention.</p>
    </section>

    <section id="exceptions">
      <h2>Materiality governs attention, not reconciliation</h2>
      <p>An exception is a departure requiring attention, decision, investigation, correction, escalation or monitoring. A difference from budget alone is insufficient. Rank absolute financial impact and percentage or margin effect alongside persistence, trend, volatility, controllability, decision sensitivity, liquidity or covenant relevance, concentration, strategic consequence and evidence quality.</p>
      <ResourceTable caption="Exception classes and executive treatment" headers={["Class", "Meaning", "Treatment"]} rows={[
        ["Material adverse exception", "Threatens an objective or decision", "Escalate with an owned response"],
        ["Material favourable exception", "May change forecast or resource allocation", "Validate sustainability before extrapolating"],
        ["Emerging signal", "Small but persistent or accelerating", "Monitor or investigate"],
        ["Timing difference", "Expected to reverse within a controlled period", "Track reversal date and evidence"],
        ["Classification effect", "Movement without equivalent economic change", "Explain or correct the mapping"],
        ["Evidence gap", "Conclusion lacks sufficient support", "Request targeted evidence"],
        ["Resolved exception", "Action and effect validated", "Close with provenance"],
      ]} />
      <p>Financial materiality concerns the amount; operational materiality concerns a critical process; strategic materiality concerns direction or a key relationship; risk materiality concerns exposure and constraint; information-quality materiality concerns whether management can support the conclusion. A small unexplained movement can be material if it invalidates a financing assumption.</p>
      <p>Approve thresholds for the decision and reassess them as headroom changes. There is no universal percentage. Group similar exceptions before ranking them, and prevent favourable and adverse amounts from hiding each other through netting. Uncertainty increases the need for investigation; it does not automatically make every weak signal an executive emergency.</p>
      <KeyObservation title="Materiality principle">Materiality determines what enters executive attention; it does not determine whether the underlying data must reconcile. Retain a complete exception log even when the executive page contains only a few findings.</KeyObservation>
    </section>

    <section id="commentary">
      <h2>A finding ends with ownership, not concern</h2>
      <ResourceTable caption="Executive finding anatomy" headers={["Sequence", "Required content"]} rows={[
        ["Observation → Driver", "Magnitude, named baseline and quantified contributing mechanism"],
        ["Evidence → Implication", "Validated support, economic interpretation, unresolved uncertainty and affected decision"],
        ["Action → Owner", "Response, approver, deadline, expected effect and follow-up condition"],
      ]} />
      <p>Mark fact, calculation, inference and hypothesis explicitly. “Revenue grew” is an observation; the price contribution is a calculation; temporary customer stocking is an explanation requiring order evidence. “Costs should be monitored” supplies none of the decision contract. Draft commentary from validated findings and bind it to the numerical version; changed dependencies require renewed review.</p>
      <p>Separate result owner, driver owner, response owner and decision approver. Commodity prices may be external; Procurement owns sourcing, Commercial repricing, Operations consumption, and the CFO the forecast consequence. Give cross-functional actions one accountable coordinator rather than a shared label that leaves nobody responsible.</p>
      <p>The action register retains finding, decision, owner, due date, expected financial effect, operating dependency, risk, status, completion evidence and follow-up result. Closing a task requires proof of the response; closing the exception also requires testing the outcome. An approved price list is not proof of improved realised margin.</p>
    </section>

    <section id="evidence">
      <h2>Keep the detail inspectable without keeping it on page one</h2>
      <p>The evidence path is executive conclusion → finding → KPI or bridge → validated canonical value → mapping and adjustment → extracted source value → source location. Each step retains the relevant segment, calculation logic, source and mapping provenance, adjustment history, validation status and unresolved limitations.</p>
      <p>A dashboard is a presentation surface, not the evidence source. Preserve the source snapshot and model version behind it. Drill-down may be a linked schedule or controlled evidence package; it does not require transaction tables in the executive pack. Access restrictions must follow the underlying information, so an executive summary does not accidentally disclose customer or employee detail.</p>
      <p>When challenged, the analyst must reproduce both the number and its interpretation boundary. Executive compression is trustworthy only when the underlying detail remains inspectable. Removing detail without a return path creates brevity at the expense of control.</p>
    </section>

    <section id="cadence">
      <h2>Report when information can still change action</h2>
      <p>Available liquidity and overdue receivables may need daily or weekly review; revenue and order intake weekly or monthly; the full management P&amp;L monthly; product profitability monthly or quarterly; strategic capital allocation quarterly; and the long-term plan annually with event-driven revision. These are candidate rhythms, not universal rules.</p>
      <p>Real-time or exception-triggered reporting is useful only when sources are stable enough, the decision can occur at that frequency, an owner can act, noise does not dominate and the evidence chain remains controlled. Distinguish provisional operational signals from closed financial outcomes. A daily shipment signal can trigger investigation without pretending to be recognised monthly revenue.</p>
      <p>Every report should identify its cut-off, next review and early escalation condition. <Link href="/resources/month-end-reporting-workflow">FIR-10 month-end workflow</Link> governs the recurring release. Between releases, refresh only the decision-sensitive dependencies and disclose their different dates; a new cash balance does not silently refresh an older profitability finding.</p>
    </section>

    <section id="pack">
      <h2>Design six connected pack layers, not six executive summaries</h2>
      <ResourceTable caption="Management-pack architecture: a concise executive layer with controlled depth" headers={["Layer", "Contents", "Management use"]} rows={[
        ["1. Executive Decision Page", "Principal outcomes; up to five material findings; decisions, owners and limitations", "Approve, intervene or request evidence"],
        ["2. Performance Bridge", "Revenue and margin drivers; EBITDA or operating-profit bridge; recurring versus exceptional effects", "Explain earnings against the selected baseline"],
        ["3. Cash and Financial Position", "EBITDA-to-operating-cash bridge; working capital; capex; debt; available versus restricted cash; forecast need", "Protect funding and liquidity"],
        ["4. Business Drivers", "Decision-relevant product, customer, channel, business-unit, cost-centre or process views", "Locate the operating response"],
        ["5. Forecast and Scenarios", "Latest outlook; run-rate implication; assumptions; risks, opportunities and sensitivities", "Test the forward decision"],
        ["6. Actions and Evidence", "Owners, deadlines, previous actions, exception log, material limitations and evidence references", "Verify follow-through and reproduce conclusions"],
      ]} />
      <p>Page one shows the smallest complete view of the decision, including adverse and favourable evidence. Supporting layers hold explanations, alternatives and challenge material. The executive page links to them rather than reproducing them. The six layers are an information architecture, not a mandatory page count or software interface.</p>
    </section>

    <section id="example">
      <h2>Growth that consumes margin and funding</h2>
      <p>Consider a wholly fictional mid-sized manufacturer and distributor. Amounts are EUR millions unless stated. Flow comparisons cover January–June 2026; positions are at 30 June. The latest forecast, frozen on 8 July, covers the full year with positions at 31 December. It is not a like-for-like H1 comparator. All historical source and model controls pass.</p>
      <ResourceTable caption="Validated headline results and separately labelled full-year outlook" headers={["Metric", "H1 budget / June plan", "H1 actual / June close", "FY forecast / December"]} rows={[
        ["Revenue", "30.0", "31.8", "63.0"],
        ["Gross margin", "30.0%", "27.6%", "28.1%"],
        ["EBITDA", "3.6", "3.1", "6.0"],
        ["Operating cash", "2.8", "0.7", "2.9"],
        ["Net debt", "8.0", "10.2", "10.5"],
        ["DSO", "50 days", "61 days", "59 days"],
        ["DIO", "75 days", "88 days", "84 days"],
      ]} />
      <p>DSO and DIO use average trade balances, credit revenue and cost of sales over 181 H1 days or 365 forecast days; all sales are on credit. They describe period intensity, not endpoint cash movements. For example, actual average receivables are 31.8 × 61 / 181 = 10.717m and average inventory is 23.0232 × 88 / 181 = 11.193m, rounded. Closing movements below come from separate reconciled schedules.</p>
      <ResourceTable caption="Fictional product inputs: prices in EUR, quantities in units" headers={["Product", "Budget units", "Budget price", "Actual units", "Actual price", "Budget gross margin"]} rows={[
        ["Core", "200000", "100", "200000", "96.5", "32%"],
        ["Specialist", "50000", "200", "62500", "200", "26%"],
      ]} />
      <p>The sequential volume–mix–price convention gives volume +1.5m, mix +1.0m and Core price −0.7m: budget revenue 30.0m becomes 31.8m. Volume explains 83.3% of the net upside. Specialist has a higher selling price but a lower margin rate. Its greater weight therefore increases revenue while diluting gross margin.</p>
      <ResourceTable caption="Reconciled gross-profit and EBITDA bridge" headers={["Step", "Effect", "Running result"]} rows={[
        ["Budget gross profit", "9.0000", "9.0000"],
        ["Volume at budget economics", "+0.4500", "9.4500"],
        ["Mix at budget economics", "+0.2000", "9.6500"],
        ["Realised price", "−0.7000", "8.9500"],
        ["Raw-material price", "−0.1200", "8.8300"],
        ["Material usage variance", "−0.0532", "8.7768"],
        ["Actual operating costs", "−5.6768", "3.1000"],
      ]} />
      <p>Gross profit is 8.7768m / 31.8m = 27.6%, down 2.4 percentage points. The positive mix contribution to absolute gross profit must not be called a favourable margin mix: at unchanged prices and costs, margin falls from 30.0% to 9.65m / 32.5m = 29.692%. Operating costs exceed budget 5.4m by 0.2768m, completing the 0.5m EBITDA shortfall.</p>
      <p>Invoice and discount records support the Core price movement; purchasing records support the material-price effect. The usage calculation reconciles, but production-order evidence does not yet distinguish physical inefficiency from an outdated consumption standard. The expense remains recognised; its cause and forecast persistence remain qualified. Meanwhile, a 0.15m maintenance underspend reflects delayed work scheduled for H2, not a sustainable efficiency gain.</p>
      <ResourceTable caption="EBITDA-to-cash bridge: positive movements are cash sources" headers={["Item", "Budget", "Actual"]} rows={[
        ["EBITDA", "3.6", "3.1"],
        ["Receivables increase", "−0.4", "−1.4"],
        ["Inventory increase", "−0.5", "−1.5"],
        ["Payables increase", "+0.6", "+1.0"],
        ["Cash tax and interest", "−0.5", "−0.5"],
        ["Operating cash", "2.8", "0.7"],
      ]} />
      <p>There are no other non-cash or operating adjustments in this simplified example. Trade working capital absorbs 1.9m against 0.3m planned; the additional 1.6m plus the 0.5m EBITDA miss explains the 2.1m cash shortfall. <Link href="/resources/working-capital-analysis">FIR-08 working capital</Link> guides release actions, while <Link href="/resources/profit-vs-cash-flow-reconstruction">FIR-09 cash reconstruction</Link> separates flows from balance changes.</p>
      <p>Opening net debt is 7.0m. Actual capex 3.9m less operating cash 0.7m increases it to 10.2m; budget capex 3.8m less cash 2.8m gives 8.0m. Opening debt/cash of 9.8m/2.8m becomes 12.0m/1.8m after 2.2m net borrowing. No dividends, currency effects or restricted cash are assumed; real reporting must test these explicitly.</p>
      <p>The FY forecast requires H2 revenue 31.2m, EBITDA 2.9m and operating cash 2.2m. Full-year capex 6.4m less operating cash 2.9m gives closing net debt 10.5m. Forecast debt 12.0m and unrestricted cash 1.5m, against a committed available facility of 14.0m, leave available liquidity 3.5m. The fictional board minimum is 3.0m: cushion is only 0.5m, versus 2.0m under the original 5.0m liquidity plan.</p>
      <p>A sensitivity delaying 0.8m of collections beyond year-end reduces liquidity to 2.7m. Deferring 0.6m of non-essential H2 capex would restore 3.3m if timing and operational feasibility are approved. The base case already assumes collection improvement and maintenance catch-up; neither can be counted again as incremental upside. A period-by-period cash schedule must also test the interim trough, not just December.</p>
    </section>

    <section id="findings">
      <h2>Five findings replace ninety-four executive indicators</h2>
      <ResourceTable caption="Executive decision page: five material findings, with evidence and ownership" headers={["Observation and driver", "Evidence and implication", "Action, owner and follow-up"]} rows={[
        ["1. Revenue +1.8m; EBITDA −0.5m versus budget. Volume leads growth, but Core price and lower-margin mix weaken conversion.", "Product bridge and invoices; margin down 2.4 points. Growth alone cannot justify the commercial outlook.", "Commercial Director: propose targeted repricing by 15 July for CFO approval; test realised contribution and retained volumes in August."],
        ["2. Material price costs 0.1200m; usage costs 0.0532m. Usage cause remains unresolved.", "Purchasing and reconciled consumption calculation; production-order review is incomplete. Do not assert proven inefficiency.", "Operations Director: validate standards and physical usage by 17 July; Procurement owns sourcing response. Controller signs the evidence before forecast revision."],
        ["3. Cash is 0.7m despite EBITDA 3.1m; receivables and inventory absorb 2.9m before payables support.", "Ageing, stock schedules and cash bridge; DSO 61 and DIO 88 days indicate heavier funding intensity.", "Working Capital Lead: agree concentrated overdue collection and non-essential stock-build limits by 14 July; review receipts and stock conversion weekly."],
        ["4. Maintenance underspend of 0.15m is temporary, not repeatable savings.", "Approved delayed work schedule; H2 catch-up is already included in the 6.0m EBITDA forecast.", "Operations Director: confirm timing by 17 July; FP&A retains catch-up once and tests monthly completion evidence."],
        ["5. Net debt reaches 10.2m; FY liquidity of 3.5m leaves only 0.5m above the minimum.", "Debt, capex and cash schedules; a 0.8m collection delay would breach the 3.0m minimum absent response.", "Treasurer: test weekly troughs by 16 July; CFO decides on the 0.6m capex deferral after feasibility review, with weekly headroom follow-up."],
      ]} />
      <p>Revenue exceeded budget by EUR 1.8 million, but the increase did not convert into planned profitability. Volume contributed most of the upside, while adverse Core pricing and a lower-margin sales mix weakened gross margin; material price and usage variances completed the 2.4-point decline. EBITDA finished EUR 0.5 million below budget. Commercial owns the targeted price response; Operations must validate the remaining usage explanation before its persistence enters the forecast.</p>
      <p>The product inputs, individual invoices and all operating KPIs remain available below the executive layer. Page one keeps only the measures needed to approve commercial action, investigate uncertainty, release cash and preserve liquidity. The action register tests completion evidence and realised financial effects at the specified reviews.</p>
    </section>

    <section id="readiness">
      <h2>A pack can support one decision and block another</h2>
      <ResourceTable caption="Reporting readiness is permission for an intended use" headers={["Status", "Meaning", "Permitted use"]} rows={[
        ["Data incomplete", "Required source population missing", "No dependent conclusion"],
        ["Model under validation", "Mappings or controls unresolved", "Preliminary analysis only"],
        ["Review required", "Material judgement or evidence gap", "Pause affected finding"],
        ["Ready with limitations", "Residual uncertainty bounded and disclosed", "Qualified decision"],
        ["Decision-ready", "Validated model and findings support intended use", "Full intended decision"],
        ["Reopened", "New evidence invalidates approval", "Reassess affected decisions"],
      ]} />
      <p>The example is decision-ready for targeted repricing within evidenced customer and product scope. Historical usage expense is valid, but its causal explanation is review-required. The liquidity base case is ready with limitations for protective contingency planning; final forecast approval awaits the weekly trough and collection-timing review. These states do not contradict one another.</p>
      <p>Record authorised uses, excluded conclusions, accepted uncertainty and the evidence that would reopen each finding. A visually complete pack does not receive a universal green status simply because its totals reconcile.</p>
    </section>

    <section id="failures">
      <h2>Professional appearance can conceal decision failure</h2>
      <ResourceTable caption="Failure → appearance → consequence → required control" headers={["Failure", "Why it looks professional", "Decision consequence", "Control"]} rows={[
        ["Repackage statutory statements", "Auditable structure", "Wrong management lens", "Decision-specific bridge"],
        ["Start with available KPIs", "Data-rich pack", "No decision contract", "Specify intended use"],
        ["Add indicators without hierarchy", "Broad coverage", "Attention fragments", "Outcome-to-evidence hierarchy"],
        ["Give every line prominence", "Neutral completeness", "Material exceptions disappear", "Rank executive relevance"],
        ["Budget comparison without forecast", "Plan discipline", "Forward gap hidden", "Show attainable outlook"],
        ["Variance without drivers", "Precise calculation", "No operating response", "Reconciled driver bridge"],
        ["Revenue equals profitability", "Positive growth story", "Margin ignored", "Test conversion"],
        ["Revenue mix equals margin mix", "Segment detail", "Wrong portfolio decision", "Separate price and contribution economics"],
        ["Unsupported commentary", "Fluent explanation", "False causal certainty", "Finding-linked evidence"],
        ["Facts equal hypotheses", "Confident narrative", "Uncertainty concealed", "Label epistemic status"],
        ["One materiality percentage", "Consistent rule", "Critical small risks missed", "Decision-specific criteria"],
        ["Actions without owners", "Recommendations included", "No response", "Accountable assignment"],
        ["Owners without deadlines or proof", "Named responsibility", "Permanent open actions", "Due date and completion evidence"],
        ["One cadence for everything", "Regular publication", "Late or noisy intervention", "Decision-frequency contract"],
        ["Transactions on page one", "Detailed transparency", "Executive overload", "Layered drill-down"],
        ["Remove detail entirely", "Concise design", "Unchallengeable conclusion", "Retained evidence path"],
        ["Dashboard becomes source", "Single visible view", "Lost provenance", "Versioned source model"],
        ["Report before validation", "Fast distribution", "Unsafe findings", "Purpose-specific release gate"],
        ["Keep stale commentary", "Consistent narrative", "Wrong explanation", "Dependency invalidation"],
        ["Count pages or speed", "Measurable output", "Decision quality untested", "Track timely actions and outcomes"],
      ]} />
    </section>

    <section id="execution">
      <h2>The information layer earns its place through the decision</h2>
      <p>For Entimema Financial Intelligence, the implementation sequence is a validated financial model → comparable actual, budget, forecast and prior-period views → deterministic KPI and driver calculations → materiality and exception logic → evidence-linked findings → executive commentary → decision and action layer → traceable deliverable. This is an architecture to scope and validate, not a claim that every integration or approval capability is already deployed.</p>
      <p>Model intelligence may interpret semantics, explain relationships, prioritise findings, compare hypotheses, request clarification, draft commentary and adapt the presentation to the decision. Deterministic code owns arithmetic, KPIs, ratios, bridges, variances, comparisons, control totals, fixed materiality rules, reconciliation and drill-down relationships. Human judgement owns KPI selection, materiality approval, material uncertainty, incomplete causal conclusions, action ownership and the final decision.</p>
      <p>The <Link href="/resources/traceable-financial-analysis-workflow">FIR-05 end-to-end workflow</Link> establishes the wider evidence path. Here, its final deliverable is neither a generic dashboard nor a conversational answer. It is a controlled relationship between a financial finding and an authorised management response.</p>
      <p>The next meeting need not begin with fewer available facts. It should begin with fewer unanswered decision questions. Management reporting succeeds when it changes the quality and speed of a decision, not when it maximises the quantity of information presented.</p>
      <DecisionImplication><strong>Convert validated financial data into a management decision layer.</strong> Explore Entimema’s <Link href="/services/management-reporting">Management Reporting service</Link> and <Link href="/services/financial-data">Financial Data foundation</Link>, or <Link href="/contact">discuss an Entimema Financial Intelligence workflow</Link>.</DecisionImplication>
    </section>
  </>;
}
