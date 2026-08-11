import Link from "next/link";
import styles from "./ConversionTrustSection.module.css";

const capabilities = [
  {
    title: "Financial Intelligence",
    items: ["Financial modelling", "Forecasting & scenario analysis", "Working capital", "Cost & profitability models", "Management reporting"],
  },
  {
    title: "Risk Intelligence",
    items: ["Credit risk modelling", "Portfolio analytics", "Stress testing", "Risk segmentation", "Decision models"],
  },
  {
    title: "Management Intelligence",
    items: ["KPI architecture", "Performance management", "Management reporting", "Decision dashboards", "Planning & forecasting"],
  },
  {
    title: "ERP & Data Intelligence",
    items: ["Financial data architecture", "ERP-driven reporting", "SAP analytics", "Data reconciliation", "Management information flows"],
  },
] as const;

const problems = [
  ["Cost Architecture", "Manufacturing cost architecture connecting materials, utilities, production volumes and margin visibility."],
  ["Credit Risk", "Portfolio segmentation, vintage analysis, transition behaviour and risk modelling."],
  ["Working Capital", "Receivables architecture connecting ageing, payment behaviour and cash-flow forecasting."],
  ["Management Intelligence", "Reporting architecture connecting operational drivers, financial outcomes and executive decisions."],
] as const;

const stages = [
  ["01", "DIAGNOSE", "Understand the decision, the business problem and the available data."],
  ["02", "MODEL", "Build the financial, risk or analytical architecture around the problem."],
  ["03", "IMPLEMENT", "Connect the model with the reporting, data or decision process."],
  ["04", "EVOLVE", "Refine the system as the business, data and decisions change."],
] as const;

export default function ConversionTrustSection() {
  return (
    <div className={styles.system}>
      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.header}>
            <p>CAPABILITIES</p>
            <h2 id="capabilities-title">The disciplines behind the architecture.</h2>
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
            <h2 id="problems-title">Evidence through the problems we structure.</h2>
          </header>
          <div className={styles.problemGrid}>
            {problems.map(([title, description]) => (
              <article className={styles.problem} key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>Problem <i aria-hidden="true">→</i> Model <i aria-hidden="true">→</i> Decision</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.engagement}`} aria-labelledby="engagement-title">
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.header}>
            <p>HOW WE WORK</p>
            <h2 id="engagement-title">Analytical systems built around business decisions.</h2>
          </header>
          <ol className={styles.stages}>
            {stages.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
          <Link className={styles.link} href="/contact">Explore an engagement <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
