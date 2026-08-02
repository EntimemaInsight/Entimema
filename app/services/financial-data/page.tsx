import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import FinancialDataDashboard from "./FinancialDataDashboard";
import styles from "./financial-data.module.css";

export const metadata: Metadata = {
  title: "Финансови данни | Entimema",
  description: "Система за надеждни финансови данни.",
};

const capabilities = [
  ["ERP интеграция", "Свързване на финансовите данни с ERP и останалите бизнес системи."],
  ["Data Model", "Изграждане на единен модел на финансовите данни."],
  ["Data Quality", "Проверка, стандартизация и контрол на качеството на информацията."],
  ["Master Data", "Управление на основните финансови и организационни структури."],
  ["Data Automation", "Автоматизирано събиране, трансформиране и синхронизиране на данните."],
  ["AI Ready Data", "Подготовка на надеждни финансови данни за AI анализи и автоматизация."],
];

const process = [
  ["01", "Диагностика", "Анализираме източниците на финансови данни и информационните потоци."],
  ["02", "Архитектура", "Проектираме единния модел на финансовите данни."],
  ["03", "Интеграция", "Свързваме ERP, файлове и външни системи."],
  ["04", "Управление", "Поддържаме качеството, проследимостта и развитието на данните."],
];

const outcomes = [
  ["Единен източник на информация", "Една последователна основа за всички финансови процеси."],
  ["Последователни финансови данни", "Еднакви дефиниции, структури и правила в цялата организация."],
  ["По-малко ръчни обработки", "Автоматизирани потоци заменят повтарящото се събиране и преобразуване."],
  ["Надеждна основа за управленски решения", "Проверима информация, на която ръководството може да разчита."],
];

const useCases = [
  ["ERP трансформация", "За компании, които внедряват, сменят или надграждат своята ERP среда."],
  ["Холдингови структури", "За групи с различни дружества, системи и финансови структури."],
  ["Компании с множество информационни системи", "За организации, които трябва да свържат разпокъсани източници на данни."],
  ["Организации, които изграждат AI автоматизация", "За бизнеси, които се нуждаят от надеждна информационна основа за AI."],
];

const related = [
  ["Управленска отчетност", "Информация за ръководството, организирана около решенията.", "/services/management-reporting"],
  ["Бюджети и прогнози", "Планиране, основано на бизнес драйвери и сценарии.", "/services/budgets-and-forecasting"],
  ["Себестойност и рентабилност", "Модели за разбиране на икономиката на бизнеса.", "/services/cost-and-profitability"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function FinancialDataPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="financial-data-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">Финансови данни</span></nav>
          <span className={styles.category}>Финанси</span>
          <h1 id="financial-data-title">Финансови данни</h1>
          <p className={styles.lead}>Система за надеждни финансови данни.</p>
          <p className={styles.support}>Изграждаме единна основа от финансови данни, която свързва ERP системите, управленската отчетност, бюджетите и анализа в последователна информационна среда.</p>
          <Link className={styles.primaryButton} href="/contact">Обсъдете финансовите си данни <span aria-hidden="true">→</span></Link>
        </div>
        <FinancialDataDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="Обхват" title="Какво включва" intro="Изграждаме свързана финансова информационна среда — от източниците и структурите до качеството, автоматизацията и използването на данните." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="Метод" title="Как работим" intro="Финансовата основа се изгражда поетапно — от картата на източниците до устойчиво управление на качеството и проследимостта." /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="Резултати" title="Какво получавате" intro="Последователна и проверима информационна основа за финансовите процеси в цялата компания." /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="scenario-title"><div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="scenario-title">Производствена компания</h3></div><dl><div><dt>Контекст</dt><dd>Финансовата информация се извлича от множество системи и Excel файлове, без единен модел и с ограничена проследимост.</dd></div><div><dt>Подход</dt><dd>Изградена е единна архитектура на финансовите данни, интегрираща ERP, управленска отчетност и аналитични модели.</dd></div><div><dt>Резултат</dt><dd>Надеждна основа за автоматизация, анализ и последователни управленски решения.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="Приложения" title="Къде е приложима системата" intro="Подходът е приложим там, където финансовата информация трябва да остане надеждна през различни системи, дружества и процеси." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="Следваща стъпка" title="Свързани услуги" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на финансовите данни</span><h2 id="cta-title">Една надеждна основа за финансовата информация в цялата компания.</h2><p>Фокусът е върху връзката между системите, последователността на данните и контрола, който ги прави използваеми за отчетност, планиране и автоматизация.</p><Link className={styles.ctaButton} href="/contact">Обсъдете финансовите си данни <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
