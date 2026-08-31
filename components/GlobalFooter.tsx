import Link from "next/link";
import BrandLogo from "./BrandLogo";
import FooterHomeLink from "./FooterHomeLink";
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
      ["Security & Privacy", "/privacy"],
    ],
  },
] as const;

export default function GlobalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.inner}`}>
        <div className={styles.brandZone}>
          <FooterHomeLink className={styles.brandLink}>
            <BrandLogo compact />
          </FooterHomeLink>
          <div className={styles.institutionalReferences}>
            <a
              className={styles.linkedinLink}
              href="https://www.linkedin.com/company/144795091/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Entimema on LinkedIn"
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.04H3.54V8.98H7.1v11.47Z" />
              </svg>
            </a>
            <span className={styles.copyright}>© 2026 Entimema</span>
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Footer navigation">
          {columns.map((column) => (
            <section className={styles.column} key={column.title}>
              <div className={styles.columnLabel}>{column.title}</div>
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
