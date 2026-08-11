import Link from "next/link";
import { DecisionImplication, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import { manufacturingCostModel as model, manufacturingCostResults as results } from "./manufacturing-cost-model";
import styles from "./resources.module.css";

const euro = (value: number) => new Intl.NumberFormat("en", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(value);

export const manufacturingCostSections = [
  { id: "architecture-not-number", label: "Cost is an architecture" },
  { id: "framework-01", label: "Entimema Framework 01" },
  { id: "cost-flow", label: "The seven economic layers" },
  { id: "capacity", label: "Capacity and absorption" },
  { id: "variance", label: "Variance and scenarios" },
  { id: "erp-boundary", label: "The ERP boundary" },
  { id: "principles", label: "Principles and limitations" },
  { id: "decision", label: "From cost to decision" },
] as const;

const frameworkLayers = [
  ["01", "Purchased inputs"],
  ["02", "Intermediate products"],
  ["03", "Utilities & conversion"],
  ["04", "Production stages"],
  ["05", "Capacity & absorption"],
  ["06", "Finished product economics"],
  ["07", "Decision layer"],
] as const;

export default function ManufacturingCostArticle() {
  return (
    <>
      <p className={styles.leadParagraph}>A product cost may reconcile to the ledger and still be difficult to use. The final unit value says what was accumulated. It does not necessarily show where the economics were created, which production condition changed, or what management can do next.</p>
      <p>A manufacturing cost architecture connects those views. It traces purchased inputs through intermediate products and production stages; relates utilities and conversion resources to defensible consumption drivers; separates process economics from capacity effects; and carries the result into margin and decision models. Its purpose is not to replace accounting. It is to make accounting values explainable in the language of production and management decisions.</p>
      <KeyObservation>A cost becomes decision-useful when it can be connected to a driver, a process, a variance and a decision.</KeyObservation>

      <section id="architecture-not-number">
        <h2>Product cost is an outcome of an architecture</h2>
        <p>Manufacturing cost is often presented as a final number: cost per tonne, unit or batch. That number is important for inventory valuation, cost of sales, performance reporting and control. But it is also the end of a chain of physical and economic relationships.</p>
        <p>Materials move through processes. Intermediate products inherit economics from earlier stages. Energy and labour are consumed under particular operating conditions. Fixed production resources are spread across an available level of output. Allocation rules translate costs that cannot be observed directly at product level. By the time a finished-product cost appears, these choices and relationships have been compressed into one result.</p>
        <p>Management questions usually require the chain to be opened again. A pricing decision may need a different cost view from an inventory valuation. A product-mix decision may depend on a constrained production stage. A capacity decision must distinguish the technological cost of the process from the effect of spreading structural cost across fewer units. A procurement decision needs visibility into purchase-price and specification effects rather than the total material line alone.</p>

        <ResourceTable
          caption="Complementary accounting and decision perspectives"
          headers={["Accounting perspective", "Management-decision perspective"]}
          rows={[
            ["What cost was recorded?", "What economic mechanism created the cost?"],
            ["Which account?", "Which driver or modelling assumption?"],
            ["Which cost centre?", "Which production stage or resource?"],
            ["What was absorbed?", "What reflects process, capacity or structure?"],
            ["What is the inventory value?", "What changes when volume or mix changes?"],
            ["What is full cost?", "Which cost view is relevant to this decision?"],
          ]}
        />
        <p>These are complementary perspectives, not competing systems. Accounting records and values economic events under the organisation&apos;s applicable policies. Management cost architecture explains how those values were created and how they behave under a particular decision. Both need reconciliation, governance and consistent definitions.</p>
      </section>

      <section id="framework-01">
        <h2>Entimema Framework 01: Manufacturing Cost Architecture</h2>
        <p>The framework has two dimensions. The vertical <strong>cost flow</strong> follows economics through seven layers. The horizontal <strong>decision flow</strong> tests every layer through data, driver, economics, variance and decision. This prevents the model from becoming only a list of cost components.</p>

        <ResourceFigure
          label="Entimema Framework 01. ERP and operational data feed seven manufacturing cost layers. Across every layer, the decision flow moves from data through driver, economics and variance to decision."
          caption="Framework 01 is a management architecture, not a universal costing prescription. Its layers and drivers must be adapted to the production technology, available data and decision context."
        >
          <div className={styles.framework01}>
            <div className={styles.frameworkSource}><span>SYSTEM OF RECORD</span><strong>ERP / Operational Data</strong><small>Transactions · quantities · values · orders</small></div>
            <div className={styles.decisionFlow} aria-hidden="true">{["Data", "Driver", "Economics", "Variance", "Decision"].map((step) => <span key={step}>{step}</span>)}</div>
            <ol>{frameworkLayers.map(([number, label]) => <li key={number}><b>{number}</b><span>{label}</span></li>)}</ol>
          </div>
        </ResourceFigure>

        <p>The architecture begins with what occurred, but it cannot stop there. Data identifies quantities and values. A driver proposes an economic relationship. The model tests how that relationship creates product or process economics. Variance separates changes in price, consumption, volume, capacity or method. The decision layer determines whether management can act—and on which mechanism.</p>
      </section>

      <section id="cost-flow">
        <h2>The seven economic layers</h2>

        <h3>01 — Purchased inputs</h3>
        <p>External inputs may include raw materials, reagents, purchased components, packaging and other directly attributable production inputs. The architecture keeps physical quantity and economic valuation connected without treating them as identical views. Purchase price is one part of input economics; directly attributable acquisition costs and relevant valuation effects may also matter, depending on the organisation&apos;s accounting policy and analytical purpose.</p>
        <p>The first management question is not simply “What did materials cost?” It is whether the difference came from price, specification, yield, supplier terms, freight, exchange effects, usage or mix. Only a defensible subset will apply in a given environment.</p>

        <h3>02 — Intermediate products</h3>
        <p>Many production chains are multi-level: raw inputs become Intermediate A, which becomes Intermediate B, which becomes a finished product. Each intermediate carries forward transferred input cost and adds stage-specific materials, utilities, conversion resources and appropriate production overhead. Flattening this chain into a raw-material-to-finished-product bridge can conceal the stage where cost was created.</p>

        <ResourceTable
          caption="Illustrative two-stage manufacturing model — all values per tonne"
          headers={["Cost layer", "Stage 1: Intermediate A", "Stage 2: Finished product"]}
          rows={[
            ["Transferred / primary material", euro(model.stage1.primaryMaterial), euro(results.stage1Total)],
            ["Reagents / additional materials", euro(model.stage1.reagents), euro(model.stage2.additionalMaterials)],
            ["Utilities", euro(model.stage1.utilities), euro(model.stage2.utilities)],
            ["Conversion", euro(model.stage1.conversion), euro(model.stage2.directConversion)],
            ["Production overhead", "—", euro(model.stage2.productionOverhead)],
            [<strong key="total">Stage output cost</strong>, <strong key="s1">{euro(results.stage1Total)}</strong>, <strong key="s2">{euro(results.reportedManufacturingCost)}</strong>],
          ]}
        />
        <p>The model is illustrative and does not represent an Entimema client. It assumes one tonne of Intermediate A transfers into one tonne of finished output and omits yield, scrap, opening work in progress and other complications. Those simplifications make the arithmetic transparent; they are not a general production assumption.</p>

        <h3>03 — Utilities and conversion</h3>
        <p>Electricity, gas, oxygen, steam, water, compressed air, machine time and direct labour can be economic production drivers where a defensible consumption relationship exists. Dividing total electricity cost by total plant output may be convenient, but it can obscure materially different energy intensity between stages or products.</p>
        <p>A stronger analytical route is <strong>resource → consumption driver → production stage → product</strong>. Metered consumption may provide direct evidence. Machine hours, standard consumption or engineering relationships may provide proxies. Where no reliable causal driver exists, allocation may remain necessary; the model should identify that choice rather than manufacture causality.</p>

        <h3>04 — Production stages</h3>
        <p>Stage economics changes the question from “What does Product A cost?” to “Where in the production process is Product A&apos;s cost created?” Materials, conversion, yield loss, rework, setup or process conditions may add economics at different points. A stage view allows variance to be placed where it arises, subject to the granularity and reliability of operational data.</p>

        <h3>05 — Capacity and absorption</h3>
        <p>Capacity requires three views to remain visible: process economics, the utilisation effect and structural fixed cost. When output falls, fixed production resources are spread across fewer tonnes. The resulting unit value can rise even when the underlying technological consumption per tonne has not changed.</p>

        <h3>06 — Finished-product economics</h3>
        <p>Full manufacturing cost is important, but it is not the correct answer to every management question. Contribution margin, manufacturing margin, product margin and customer/product profitability can each be useful if the organisation defines them consistently and connects them to the decision being made. These terms are not universal: included cost layers, time horizon and controllability must be explicit.</p>

        <h3>07 — Decision layer</h3>
        <p>Pricing needs to distinguish market choice from cost recovery. Product mix needs the economics of constrained capacity, not only average unit cost. Procurement needs purchase and consumption effects. Make/buy needs a relevant forward-looking boundary. Process efficiency needs stage and driver variance. Scenario analysis needs the same economic relationships under changed assumptions. The architecture improves the decision only when it preserves those distinctions.</p>
      </section>

      <section id="capacity">
        <h2>Capacity changes the interpretation of unit cost</h2>
        <p>Consider an illustrative fixed production-overhead pool of {euro(model.fixedProductionOverhead)} per month. At a normal production level of {model.normalProductionTonnes.toLocaleString("en")} tonnes, the overhead relationship is {euro(results.normalCapacityOverhead)}/t. At actual output of {model.actualProductionTonnes.toLocaleString("en")} tonnes, dividing the same pool by actual output produces {euro(results.actualAbsorbedOverhead)}/t—a difference of {euro(results.underutilisationEffect)}/t.</p>
        <p>This difference does not, by itself, demonstrate that the technological process became {euro(results.underutilisationEffect)}/t more expensive. It identifies the effect of lower utilisation under this illustrative calculation. Accounting treatment must follow the applicable policy and reporting framework; for example, IAS 2 bases fixed production-overhead allocation on normal capacity and addresses unallocated overhead from low production. The management decomposition shown here is an analytical view, not an alternative accounting rule.</p>

        <ResourceFigure
          label="Illustrative comparison of reported and normalised manufacturing economics. Reported manufacturing cost is 815 euros per tonne and normalised manufacturing economics are 781 euros 75 cents. Reported margin is 95 euros per tonne and normalised economic margin is 128 euros 25 cents."
          caption={`Illustrative model. The ${euro(results.underutilisationEffect)}/t capacity effect is separated for management interpretation; the normalised view does not replace the reported or statutory accounting view.`}
        >
          <div className={styles.capacityComparison}>
            <span>ILLUSTRATIVE MODEL</span>
            <div><article><small>REPORTED MANUFACTURING COST</small><strong>{euro(results.reportedManufacturingCost)}<em>/t</em></strong></article><article><small>NORMALISED MANUFACTURING ECONOMICS</small><strong>{euro(results.normalisedManufacturingEconomics)}<em>/t</em></strong></article></div>
            <div><article><small>REPORTED MARGIN</small><strong>{euro(results.reportedMargin)}<em>/t</em></strong></article><article><small>NORMALISED ECONOMIC MARGIN</small><strong>{euro(results.normalisedEconomicMargin)}<em>/t</em></strong></article></div>
          </div>
        </ResourceFigure>

        <p>With a selling price of {euro(model.sellingPrice)}/t, reported manufacturing cost of {euro(results.reportedManufacturingCost)}/t leaves {euro(results.reportedMargin)}/t, or approximately {results.reportedMarginPercent}% of selling price. Removing only the illustrative underutilisation effect produces normalised manufacturing economics of {euro(results.normalisedManufacturingEconomics)}/t and a normalised economic margin of {euro(results.normalisedEconomicMargin)}/t.</p>
        <DecisionImplication>Neither view is inherently “the truth” while the other is wrong. The reported view describes cost under the applicable recording and allocation logic. The normalised view isolates one capacity assumption for a management question. Their usefulness depends on naming the question.</DecisionImplication>
      </section>

      <section id="variance">
        <h2>A variance becomes useful when its driver remains visible</h2>
        <p>Suppose utilities are {euro(results.totalUtilitiesVariance)}/t above the comparison basis. The total observation does not identify a response. An illustrative decomposition might attribute {euro(model.utilitiesVariance.price)}/t to price, {euro(model.utilitiesVariance.consumptionEfficiency)}/t to consumption efficiency and {euro(model.utilitiesVariance.volumeCapacity)}/t to volume or capacity.</p>
        <div className={styles.varianceBridge} role="img" aria-label="Illustrative utilities variance of 20 euros per tonne, decomposed into 7 euros price effect, 5 euros consumption-efficiency effect and 8 euros volume-capacity effect.">
          {[['Price', model.utilitiesVariance.price, 'Procurement / contracting'], ['Consumption', model.utilitiesVariance.consumptionEfficiency, 'Process efficiency'], ['Capacity', model.utilitiesVariance.volumeCapacity, 'Planning / utilisation']].map(([label, value, response]) => <article key={String(label)}><span>{label}</span><strong>+{euro(Number(value))}/t</strong><small>{response}</small></article>)}
          <div><span>Total utilities variance</span><strong>+{euro(results.totalUtilitiesVariance)}/t</strong></div>
        </div>
        <p>Each component points to a different management response. Price leads towards supplier, tariff or contracting analysis. Consumption leads towards process conditions and efficiency. Capacity leads towards volume, scheduling and utilisation. A variance without a driver is primarily an accounting observation; when a defensible driver can be established, it can become a management signal.</p>

        <h3>Use the same architecture for scenarios</h3>
        <p>The same relationships can test raw-material price +10%, energy +15%, production volume −20% or selling price −5%. The purpose is not to apply all changes to one generic percentage bridge. It is to identify which mechanism enters which layer: material price changes purchased-input economics; energy affects the mapped consumption relationship; lower volume changes capacity utilisation; selling price changes margin rather than production cost.</p>
        <p>A scenario is useful when management can follow the changed assumption through the architecture and identify the decision exposed. Without that path, a scenario may calculate a different answer without explaining why it changed.</p>
      </section>

      <section id="erp-boundary">
        <h2>ERP records the transaction; it is not automatically the decision model</h2>
        <p>An ERP environment may provide material movements, purchase values, production quantities, production-order costs, activity allocations, inventory valuation and general-ledger postings, depending on product, configuration and process design. SAP&apos;s own documentation, for example, describes production-order cost analysis and Material Ledger/Actual Costing functions for material movements, valuations and multi-level actual cost flows. That capability does not mean every SAP environment contains the same data, costing configuration or analytical definitions.</p>

        <ResourceFigure
          label="ERP-to-decision flow. ERP and operational data pass through financial and operational reconciliation, cost-driver architecture, product and process economics, a decision model and finally management action."
          caption="The system of record is foundational. The management layer adds reconciled definitions, economic relationships, variance logic and decision context."
        >
          <ol className={styles.erpFlow}>
            {["ERP / Operational Data", "Financial & Operational Reconciliation", "Cost-driver Architecture", "Product / Process Economics", "Decision Model", "Management Action"].map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}
          </ol>
        </ResourceFigure>

        <p>The transformation begins with reconciliation: quantities, values, master data and process events must align. Cost-driver architecture then connects resources to stages and products using observable or explicitly modelled relationships. Product and process economics organise the views required for margin, variance and scenarios. A decision model introduces thresholds, alternatives, constraints and responsibilities. Only then does the information become management action.</p>
        <p>This boundary is part of Entimema&apos;s work on <Link href="/services/financial-data">financial data architecture</Link> and <Link href="/services/decision-automation">decision systems</Link>. It is not an argument for duplicating ERP data or treating the ERP as incomplete. It is a distinction between recording economic events and structuring a particular decision.</p>
      </section>

      <section id="principles">
        <h2>Three principles—and the limits around them</h2>
        <div className={styles.principles}>
          <article><span>PRINCIPLE 01</span><h3>Cost follows the production flow.</h3><p>Intermediate stages and transferred economics remain visible rather than being flattened prematurely.</p></article>
          <article><span>PRINCIPLE 02</span><h3>Connect cost to a defensible economic driver.</h3><p>Use causality where evidence supports it. Where it does not, disclose the allocation or modelling choice.</p></article>
          <article><span>PRINCIPLE 03</span><h3>The relevant cost depends on the decision.</h3><p>Define the time horizon, included economics, constraints and controllability before selecting a cost view.</p></article>
        </div>

        <h3>Limitations are part of the architecture</h3>
        <p>No manufacturing-cost architecture is universal. Production technologies, joint and by-products, yield, rework, batch behaviour, transfer arrangements and commercial models differ materially. Driver quality depends on available operational data. Allocations may remain necessary. Normal capacity must be defined responsibly. Causality should not be invented merely to avoid an allocation.</p>
        <p>Management costing does not replace statutory accounting, and a decision model does not redefine inventory valuation. Models require reconciliation, ownership and periodic recalibration as prices, process conditions, recipes, routings, capacity and decisions change. A useful architecture makes these boundaries visible rather than presenting model output as neutral fact.</p>
      </section>

      <section id="decision">
        <h2>The objective is not a more sophisticated cost number</h2>
        <p>The objective is to make the economics of production visible enough to support a decision. That requires more than additional cost detail. It requires a coherent path from ERP and operational data to accounting values, from values to economic drivers, from drivers to stage and product economics, and from variance to a management response.</p>
        <p>When that path is explicit, management can distinguish a purchase-price issue from a consumption issue, a process change from a capacity effect, and an accounting value from the cost view relevant to a pricing, mix, procurement or investment decision. The final number remains important. The architecture explains what is inside it—and what the organisation can responsibly infer from it.</p>
        <p>Manufacturing cost architecture is part of our <Link href="/services/cost-and-profitability">Cost & Margin Management work</Link>, connecting cost structures, margins and business drivers to the decisions they support.</p>

        <aside className={styles.references} aria-labelledby="references-title">
          <h3 id="references-title">Technical references</h3>
          <ol>
            <li><a href="https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2021/issued/part-a/ias-2-inventories.pdf">IFRS Foundation, IAS 2 Inventories</a> — normal-capacity and production-overhead context.</li>
            <li><a href="https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/34de0103497c4b80a7c7fbf6952ff971/2c03b753128eb44ce10000000a174cb4.html">SAP Help, Displaying Costs in Production Orders</a> — examples of production-order cost views.</li>
            <li><a href="https://help.sap.com/docs/SAP_ERP/56f7319a9048445eb86221af73cab72b/bcd6cc5340487214e10000000a174cb4.html">SAP Help, Actual Costing / Material Ledger</a> — material valuation, actual costing and multi-level cost-flow context.</li>
          </ol>
        </aside>
      </section>
    </>
  );
}
