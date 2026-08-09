import Link from "next/link";
import BrandLogo from "./BrandLogo";
import styles from "./GlobalFooter.module.css";

const columns = [
  {
    title: "Финансова архитектура",
    links: [
      ["CFO функция", "/services/cfo-function"],
      ["Бюджети и прогнози", "/services/budgets-and-forecasting"],
      ["Управленска отчетност", "/services/management-reporting"],
      ["Себестойност и рентабилност", "/services/cost-and-profitability"],
      ["Финансови данни", "/services/financial-data"],
      ["Финансови AI агенти", "/services/financial-ai-agents"],
    ],
  },
  {
    title: "Наука за решенията",
    links: [
      ["Кредитен риск", "/services/credit-risk"],
      ["AML и съответствие", "/services/aml-compliance"],
      ["Автоматизация на решения", "/services/decision-automation"],
      ["Рискови AI агенти", "/services/risk-ai-agents"],
    ],
  },
  {
    title: "Ресурси",
    links: [["Всички услуги", "/services"]],
  },
  {
    title: "Компания",
    links: [
      ["За Entimema", "/about"],
      ["Контакти", "/contact"],
      ["Поверителност", "/privacy"],
    ],
  },
] as const;

export default function GlobalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.inner}`}>
        <div className={styles.brandZone}>
          <Link className={styles.brandLink} href="/" aria-label="Entimema – начало">
            <BrandLogo compact />
          </Link>
          <span className={styles.copyright}>© 2026 Entimema</span>
        </div>

        <nav className={styles.navigation} aria-label="Навигация в долната част на сайта">
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
