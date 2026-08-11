import Link from "next/link";
import BrandLogo from "./BrandLogo";
import styles from "./GlobalFooter.module.css";

const columns = [
  {
    title: "FINANCIAL ARCHITECTURE",
    links: [
      ["CFO Advisory", "/services/cfo-function"],
      ["Planning & Forecasting", "/services/budgets-and-forecasting"],
      ["Management Reporting", "/services/management-reporting"],
      ["Cost & Margin Management", "/services/cost-and-profitability"],
      ["Financial Data", "/services/financial-data"],
      ["Finance AI Agents", "/services/financial-ai-agents"],
    ],
  },
  {
    title: "DECISION SCIENCE",
    links: [
      ["Credit Risk", "/services/credit-risk"],
      ["AML & Compliance", "/services/aml-compliance"],
      ["Decision Intelligence", "/services/decision-automation"],
      ["Risk AI Agents", "/services/risk-ai-agents"],
    ],
  },
  {
    title: "RESOURCES",
    links: [["All Resources", "/resources"]],
  },
  {
    title: "COMPANY",
    links: [
      ["About Entimema", "/about"],
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
    ],
  },
] as const;

export default function GlobalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.inner}`}>
        <div className={styles.brandZone}>
          <Link className={styles.brandLink} href="/" aria-label="Entimema — home">
            <BrandLogo compact />
          </Link>
          <span className={styles.copyright}>© 2026 Entimema</span>
        </div>

        <nav className={styles.navigation} aria-label="Footer navigation">
          {columns.map((column) => (
            <section className={styles.column} key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </footer>
  );
}
