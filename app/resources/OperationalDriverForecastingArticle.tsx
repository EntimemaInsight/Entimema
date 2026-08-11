import Link from "next/link";
import { DecisionImplication, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import { baseForecastResults as base, driverForecastResults as forecast, ebitdaBridge as bridge, operationalForecastModel as model } from "./operational-forecast-model";
import styles from "./resources.module.css";

const money = (value: number) => `€${(value / 1_000_000).toFixed(3)}m`;
const effect = (value: number) => `${value >= 0 ? "+" : "−"}€${Math.abs(value / 1_000).toFixed(0)}k`;

export const operationalForecastSections = [
  { id: "cause-first", label: "Forecast the cause" }, { id: "framework-03", label: "Entimema Framework 03" },
  { id: "engines", label: "Revenue, cost and capacity" }, { id: "integrated-model", label: "Connected financial outputs" },
  { id: "illustrative-model", label: "Illustrative forecast" }, { id: "bridge", label: "EBITDA driver bridge" },
  { id: "scenarios", label: "Scenarios and assumptions" }, { id: "principles", label: "Principles and limitations" },
] as const;

export default function OperationalDriverForecastingArticle() {
  return <>
    <p className={styles.leadParagraph}>A financial forecast becomes more decision-useful when management can trace an outcome back to the assumptions and operating drivers that created it. Revenue, cost, working capital and cash do not move because a spreadsheet cell grew by a percentage. They move because volumes, rates, capacity, mix, efficiency and timing changed.</p>
    <p>An integrated management forecast should therefore begin with the business system rather than the financial statement. It translates operating assumptions into business volumes and rates, carries those relationships through the P&amp;L, balance sheet and cash flow, and tests how decisions change under plausible scenarios.</p>
    <KeyObservation>Forecast the cause before forecasting the financial result.</KeyObservation>

    <section id="cause-first">
      <h2>A coherent percentage forecast can still be economically weak</h2>
      <p>A model that applies revenue +7%, materials +6% and payroll +4% may be appropriate for a rapid high-level exercise. The problem arises when those percentages become the complete explanation. Revenue growth of 7% could represent volume +4% and price +3%; customers +10% and revenue per customer −3%; or unchanged capacity with higher utilisation. Those paths create different margins, working-capital requirements, operating risks and decisions.</p>
      <p>Top-down and driver-based methods are not universal opposites. A top-down view can establish a target, provide an independent reasonableness check or support a portfolio-level estimate where detailed information is unavailable. A driver architecture becomes valuable when management needs to understand mechanisms, constraints and sensitivities. The same financial growth rate can be created by very different operating realities.</p>
      <ResourceTable caption="Two complementary forecasting perspectives" headers={["Financial-statement-first view", "Operational-driver view"]} rows={[
        ["Revenue +10%", "Which volume, price, customer and mix assumptions create revenue?"], ["Costs +8%", "Which quantities, rates, efficiency and capacity relationships create cost?"],
        ["Cash follows EBITDA", "How do working capital, CAPEX, financing and timing alter cash?"], ["One forecast result", "Which plausible assumptions produce the range of outcomes?"],
      ]} />
      <p>The operating view does not remove judgement. It makes judgement explicit. Every driver is an assumption about a relationship, and every relationship needs an owner, data source, update rhythm and boundary. The objective is not maximal detail; it is enough causal structure to explain the decisions management must make.</p>
      <p>A useful architecture also separates the forecast mechanism from the target. If management wants 10% revenue growth, the model should not assume 10% merely because it is desired. It should show the customer, volume, price, mix and capacity conditions required to reach it. The gap between target and current forecast then becomes a decision problem rather than an unexplained spreadsheet override.</p>
    </section>

    <section id="framework-03">
      <h2>Entimema Framework 03: Operational-Driver Forecasting</h2>
      <p>Framework 03 begins with the business system. Operating drivers create volumes and rates. Financial relationships translate those operating conditions into revenue, cost, assets, liabilities and cash. The financial statements are connected outputs of one economic model, followed by a scenario engine and management decision.</p>
      <ResourceFigure label="Entimema Framework 03. The business system feeds volume, price, capacity, mix, efficiency, cost rates and working capital. These create revenue, cost and cash drivers, which feed an integrated financial model, the profit and loss statement, balance sheet and cash flow, scenarios and management decisions." caption="Framework 03 is an integrated management-forecasting architecture. Driver selection and model depth must reflect the business economics, available evidence and decisions in scope.">
        <div className={styles.framework03}>
          <div className={styles.forecastSource}><small>BUSINESS SYSTEM</small><strong>Operating assumptions and constraints</strong></div>
          <div className={styles.driverCloud}>{["Volume", "Price", "Capacity", "Mix", "Efficiency", "Cost rates", "Working capital"].map(x=><span key={x}>{x}</span>)}</div>
          <div className={styles.driverEngines}>{["Revenue drivers", "Cost drivers", "Cash drivers"].map(x=><strong key={x}>{x}</strong>)}</div>
          <div className={styles.financialModelFlow}><span>FINANCIAL MODEL</span><b>↓</b><div><strong>P&amp;L</strong><strong>BALANCE SHEET</strong><strong>CASH FLOW</strong></div><b>↓</b><span>SCENARIO ENGINE</span><b>↓</b><span>MANAGEMENT DECISION</span></div>
        </div>
      </ResourceFigure>
      <p>The architecture supports the signature trace: assumption → driver → business effect → financial effect → decision. A material-price assumption changes the cost rate; the rate changes unit and total material economics; contribution and cash requirements change; procurement, pricing or product-mix choices become visible. The financial result remains essential, but it is no longer detached from its cause.</p>
      <p>Model governance follows the same chain. Finance should be able to identify where an assumption originated, when it was updated, which relationship uses it and which outputs depend on it. This is particularly important when one driver feeds several statements. A volume assumption can affect revenue, production cost, inventory, receivables, payables, capacity utilisation and cash simultaneously.</p>
    </section>

    <section id="engines">
      <h2>Revenue, cost and capacity require their own driver logic</h2>
      <h3>Revenue follows the economics of the business</h3>
      <p>Revenue can often begin with volume × price, but that is an architecture rather than a universal formula. A subscription business may use customers × contracts per customer × average contract value. A transaction business may use customers × transactions × average value. Manufacturing may connect available capacity × utilisation × yield × sell-through × selling price.</p>
      <p>The correct structure depends on how the organisation creates revenue and which decisions matter. Separating volume, price and mix enables management to distinguish commercial demand from pricing action. It also prevents a favourable price assumption from silently compensating for a deliverability problem in volume.</p>
      <p>Mix deserves explicit treatment when products, customers or channels carry different prices, resource requirements or payment patterns. Aggregate volume growth can dilute contribution if it shifts towards lower-margin products, or consume disproportionate capacity at a constrained stage. A forecast that holds average economics constant may miss the decision even when its total volume is plausible.</p>
      <h3>Cost follows quantities, rates and structural commitments</h3>
      <p>Driver-linked resources such as materials, energy consumption, logistics or commissions can often be expressed as driver quantity × driver rate. Electricity, for example, may be modelled as MWh per tonne × tonnes produced × euros per MWh. This separates volume, efficiency and price effects rather than forecasting the entire cost line as prior year plus inflation.</p>
      <p>Other costs are semi-variable or structural. Labour, maintenance, utilities and operating support may move in steps or within capacity bands. Management, core systems, rent and long-term capacity may remain relatively fixed over a relevant range. Classification depends on the business and time horizon. Article 01&apos;s <Link href="/resources/building-a-manufacturing-cost-architecture">manufacturing cost architecture</Link> provides the related view of cost creation through production stages.</p>
      <p>Rate and quantity should remain separate where evidence supports the distinction. Material inflation is not the same as material consumption; wage rates are not the same as staffing levels; freight price is not the same as shipment count. This decomposition makes forecast variance explainable after actual results arrive and preserves a consistent line from planning to performance analysis.</p>
      <h3>Demand is not deliverable volume when capacity is constrained</h3>
      <p>If demand supports 1,200 units but available production capacity supports 1,000, the forecast cannot responsibly recognise 1,200 delivered units without another assumption. Management must decide whether to invest in capacity, outsource, add shifts, change product mix or accept lost demand. Yield, bottlenecks, production hours and critical resources may constrain deliverability before theoretical nameplate capacity is reached.</p>
      <p>Capacity is often step-fixed. A modest increase in volume may fit inside the existing system; the next increment may require a shift, line or facility. A smooth percentage forecast can hide that discontinuity. Forecast architecture should expose the point at which an operating assumption becomes a management decision.</p>
      <p>Constraint analysis should also consider mix and sequence. A plant may have sufficient total hours but insufficient time on a critical machine, specialist team or testing stage. The relevant capacity measure is the resource that limits deliverable output. If the constraint moves under a different product mix, the forecast relationship must move with it.</p>
      <DecisionImplication>A demand forecast describes market possibility. A deliverable-volume forecast must also respect capacity, yield and the decisions required to change them.</DecisionImplication>
    </section>

    <section id="integrated-model">
      <h2>The financial statements are connected outputs</h2>
      <p>Once drivers are defined, the model can produce a P&amp;L, balance sheet and cash flow. In integrated management forecasting, these should not be three independent exercises. Sales and margin affect earnings; customer terms affect receivables; production and procurement affect inventory and payables; CAPEX affects assets, depreciation and financing; the cash-flow statement reconciles the timing consequences.</p>
      <p>Revenue growth therefore does not automatically equal cash growth. Higher sales may require more receivables; higher production may require more inventory; procurement may create supplier funding on a different timetable. Article 02&apos;s <Link href="/resources/working-capital-as-a-system">working-capital system</Link> explains those operating mechanisms. Framework 03 projects them forward into a cash requirement.</p>
      <p>The integration should remain proportionate. A short-term liquidity forecast may require detailed timing but limited accounting structure. A strategic forecast may use broader relationships. The principle applies when management expects the model to explain the combined financial consequences of operating assumptions.</p>
      <p>Working-capital assumptions should not be appended as a single percentage of revenue if their operating causes are material. Customer terms, invoice timing, inventory policy, procurement lead time and supplier terms may respond differently under growth or disruption. Projecting those mechanisms makes the funding requirement visible before management commits to the operating plan.</p>
    </section>

    <section id="illustrative-model">
      <h2>An illustrative driver-based forecast</h2>
      <p>The hypothetical base model produces 100,000 units at €100 per unit. Material is €40 per unit, variable conversion €15 per unit and fixed operating cost €3.0m. Revenue is €10.0m, variable cost €5.5m, contribution €4.5m and EBITDA €1.5m.</p>
      <p>The forecast increases volume to 108,000 units and price to €102. Material rises to €42 per unit, conversion to €15.50 and fixed operating cost to €3.12m. These assumptions generate revenue of {money(forecast.revenue)}, material cost of {money(forecast.material)}, conversion cost of {money(forecast.conversion)}, contribution of {money(forecast.contribution)} and EBITDA of {money(forecast.ebitda)}.</p>
      <ResourceTable caption="Illustrative base and driver-based forecast" headers={["Measure", "Base", "Forecast"]} rows={[
        ["Volume", "100,000", "108,000"], ["Selling price", "€100.00", "€102.00"], ["Revenue", money(base.revenue), money(forecast.revenue)],
        ["Material cost", money(base.material), money(forecast.material)], ["Conversion cost", money(base.conversion), money(forecast.conversion)],
        ["Contribution", money(base.contribution), money(forecast.contribution)], ["Fixed operating cost", money(model.base.fixedCost), money(model.forecast.fixedCost)], ["EBITDA", money(base.ebitda), money(forecast.ebitda)],
      ]} />
      <p>All figures are illustrative and do not represent Entimema or a client. The model omits mix, taxes, depreciation, working-capital timing and capacity steps to isolate the driver relationships. It is an analytical example, not a complete business forecast.</p>
      <p>The forecast EBITDA margin declines despite higher EBITDA in absolute terms because material and conversion rates rise and fixed cost also increases. That is a useful management observation: growth creates additional contribution, while cost-rate pressure absorbs much of the benefit. The model enables management to test which assumption must change rather than treating the net movement as one unexplained forecast variance.</p>
    </section>

    <section id="bridge">
      <h2>The EBITDA bridge explains the change</h2>
      <p>Forecast EBITDA increases from €1.500m to €1.686m. The bridge reconciles that movement exactly: volume contributes €360k at the base contribution rate; price contributes €216k on forecast volume; higher material rate removes €216k; higher conversion rate removes €54k; and fixed-cost growth removes €120k.</p>
      <ResourceFigure label="Illustrative EBITDA bridge from 1.5 million euros base EBITDA through positive 360 thousand volume, positive 216 thousand price, negative 216 thousand material rate, negative 54 thousand conversion rate and negative 120 thousand fixed cost to 1.686 million forecast EBITDA." caption="Illustrative model. The bridge uses forecast volume for rate effects and reconciles exactly to forecast EBITDA.">
        <div className={styles.ebitdaBridge}><article><small>BASE EBITDA</small><strong>{money(bridge.base)}</strong></article>{Object.entries(bridge).slice(1).map(([name,value])=><article className={value >= 0 ? styles.positiveEffect : styles.negativeEffect} key={name}><small>{name}</small><strong>{effect(value)}</strong></article>)}<article><small>FORECAST EBITDA</small><strong>{money(forecast.ebitda)}</strong></article></div>
      </ResourceFigure>
      <p>A top-line summary might describe revenue growth and cost inflation. The bridge shows which economic mechanisms improved or diluted the result. That distinction supports pricing, procurement, production and cost-capacity decisions rather than simply reporting a different EBITDA number.</p>
      <p>Bridge conventions must be stated because effect order can change attribution when drivers interact. This example values volume at base contribution per unit and applies price and rate effects to forecast volume. Another valid convention might separate interaction effects. The important discipline is that the method is transparent and the bridge reconciles exactly.</p>
    </section>

    <section id="scenarios">
      <h2>Scenarios test how the system reacts</h2>
      <p>A single forecast value can create an unjustified sense of precision. Framework 03 uses scenarios to change explicit assumptions and follow their financial and decision effects. The purpose is not to predict one future correctly. It is to understand how the financial system reacts when assumptions change.</p>
      <ResourceFigure label="Four illustrative scenarios: base with volume plus 8 percent and price plus 2 percent; demand downside with volume minus 5 percent; cost shock with material rate plus 12 percent; and capacity constraint with demand plus 15 percent but capacity plus 5 percent." caption="Scenario definitions are illustrative. They identify changed drivers and management questions without implying unsupported outcome precision.">
        <div className={styles.scenarioGrid}>{[["BASE","Volume +8% · Price +2%","Execute operating plan"],["DOWNSIDE","Volume −5%","Capacity and cost response"],["COST SHOCK","Material rate +12%","Procurement, price and mix"],["CAPACITY","Demand +15% · capacity +5%","CAPEX, outsourcing or lost demand"]].map(([name,change,response])=><article key={name}><small>{name}</small><strong>{change}</strong><span>{response}</span></article>)}</div>
      </ResourceFigure>
      <h3>Assumptions need families and responsibility</h3>
      <p>External drivers may include energy, FX, interest rates, commodities and market demand. Commercial drivers include volume, price, customer acquisition and mix. Operational drivers include capacity, yield, efficiency, headcount and production hours. Financial drivers include payment terms, financing rates and tax assumptions. The management question is which assumptions the organisation controls and which it observes.</p>
      <p>Controllable assumptions should connect to an owner and action. External assumptions need sources, ranges and monitoring triggers. Relationships can also change: historical conversion between volume and labour may fail after automation or a bottleneck shift. Scenario design should test both changed inputs and changed relationships where material.</p>
      <p>Review should focus on the assumptions that move the decision, not on debating every cell equally. Sensitivity can identify which price, volume, rate, timing or capacity variables have the greatest financial effect. Those assumptions deserve stronger evidence, narrower ownership and clearer escalation triggers. Low-impact detail should not distract from them.</p>
      <h3>Forecast, budget and rolling updates</h3>
      <p>A budget may serve as a target, commitment, resource allocation or performance benchmark, depending on company practice. A forecast represents the current best estimate of expected outcome. They need not be identical. Preserving the distinction prevents a target from suppressing evidence about the likely result.</p>
      <p>A driver architecture also supports rolling updates: actual January–March results plus updated April–December drivers produce a revised full-year forecast. Updating assumptions and relationships is more informative than extending historical statement percentages, provided actuals and forecast definitions remain reconciled.</p>
      <p>Rolling updates require version discipline. Management should distinguish movement caused by actual performance, a changed external assumption, a revised operating plan and a changed modelling relationship. Without that bridge, frequent forecasting can create more numbers without creating more understanding.</p>
    </section>

    <section id="principles">
      <h2>Three principles—and the limits around them</h2>
      <div className={styles.principles}>
        <article><span>PRINCIPLE 01</span><h3>Forecast the driver before the financial result.</h3><p>Make the operating cause of a financial assumption explicit.</p></article>
        <article><span>PRINCIPLE 02</span><h3>Financial statements are connected outputs.</h3><p>For integrated management modelling, P&amp;L, balance sheet and cash flow should share one economic architecture.</p></article>
        <article><span>PRINCIPLE 03</span><h3>A useful forecast explains change.</h3><p>Management should be able to identify which economic drivers moved the result.</p></article>
      </div>
      <h3>Limitations are part of forecast design</h3>
      <p>Driver models depend on data quality, and relationships may not remain stable. Not all costs have clean causal drivers. Capacity may be step-fixed, mix can complicate unit economics and seasonality can make annual averages misleading. External shocks can invalidate assumptions. Forecasts are models, not facts, and management judgement remains necessary.</p>
      <p>More detail is not automatically better. Excessive model depth can create false precision, obscure the few assumptions that matter and make updates harder to govern. The appropriate architecture balances causal explanation, decision relevance, data evidence and maintainability.</p>
      <h3>From forecast to decision system</h3>
      <p>The final output is not a static report. It should inform a bounded set of decisions—pricing, production, procurement, hiring, inventory, financing, liquidity, commercial targets or product mix. A forecast becomes useful when management can trace the financial outcome back to its cause, test plausible alternatives and identify the decision required.</p>
      <p>The first three Entimema Resources now form a connected architecture: manufacturing cost explains how cost is created; working capital explains how operations become cash; operational-driver forecasting projects those drivers into future financial outcomes. The objective is not to predict one future. It is to understand the financial consequences of several plausible ones.</p>
    </section>
  </>;
}
