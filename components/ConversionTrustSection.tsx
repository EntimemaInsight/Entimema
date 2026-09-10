import styles from "./ConversionTrustSection.module.css";
import { DemoTrigger } from "./DemoDiscovery";

const capabilities = [
  {
    title: "Finance Workflows",
    items: ["Financial reporting & analysis", "Planning, forecasting & scenarios", "Cost & profitability analysis", "Cash & working capital", "Financial controls"],
  },
  {
    title: "Risk Workflows",
    items: ["Credit risk & decisioning", "Scorecards & risk segmentation", "Portfolio monitoring", "Early-warning analysis", "AML & fraud investigation"],
  },
  {
    title: "Decision Support",
    items: ["KPI definitions", "Variance and driver analysis", "Executive dashboards", "Scenario evaluation", "Exception review"],
  },
  {
    title: "Data & Control Foundation",
    items: ["Source evidence & lineage", "Financial mapping and context", "Deterministic validation", "Exception handling", "Human review"],
  },
] as const;

const problems = [
  ["Cost & Profitability", "Understand how materials, labour, overheads, price and mix shape unit cost and margin."],
  ["Credit Risk & Decisioning", "Connect scorecards, credit policy, decision strategies and portfolio monitoring across the credit lifecycle."],
  ["Working Capital", "Connect receivables, payment behaviour and cash-flow visibility in one controlled process."],
  ["Financial Reporting & Analysis", "Turn actuals, budgets, forecasts and operating drivers into reliable management analysis."],
] as const;

const stages = [
  ["01", "DEFINE", "Identify the decision, required output, supporting evidence and materiality."],
  ["02", "STRUCTURE", "Organise the data, mappings and financial or risk logic behind the workflow."],
  ["03", "VALIDATE", "Apply deterministic checks, confidence thresholds, exceptions and review."],
  ["04", "OPERATIONALISE", "Embed the workflow into a repeatable process and improve it through observed results."],
] as const;

export default function ConversionTrustSection() {
  return (
    <div className={styles.system}>
      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.header}>
            <p>CAPABILITIES</p>
            <h2 id="capabilities-title">Finance and risk capabilities built around real operating decisions.</h2>
          </header>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability) => (
              <article className={styles.capability} key={capability.title}>
                <h3>{capability.title}</h3>
                <ul>{capability.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.evidence}`} aria-labelledby="problems-title">
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.header}>
            <p>SELECTED PROBLEMS</p>
            <h2 id="problems-title">Where Entimema creates value.</h2>
          </header>
          <div className={styles.problemGrid}>
            {problems.map(([title, description]) => (
              <article className={styles.problem} key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>Evidence <i aria-hidden="true">→</i> Validation <i aria-hidden="true">→</i> Decision</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.engagement}`} aria-labelledby="engagement-title">
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.header}>
            <p>HOW WE WORK</p>
            <h2 id="engagement-title">Start with the decision. Build the workflow around it.</h2>
          </header>
          <ol className={styles.stages}>
            {stages.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
          <DemoTrigger className={styles.link} />
        </div>
      </section>
    </div>
  );
}
