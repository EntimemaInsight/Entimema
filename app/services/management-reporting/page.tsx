import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ManagementDashboard from "./ManagementDashboard";
import styles from "./management-reporting.module.css";

export const metadata: Metadata = {
  title: "Управленска отчетност | Entimema",
  description: "Система за управленска информация, изградена около начина, по който се управлява бизнесът.",
};

const capabilities = [
  ["Управленски KPI", "Ясно определени показатели, съобразени с начина, по който се управлява бизнесът."],
  ["Управленско табло", "Информация за ръководството, организирана около решенията, а не около счетоводните отчети."],
  ["Финансов анализ", "Анализ на отклоненията, тенденциите и факторите зад финансовите резултати."],
  ["Оперативна отчетност", "Свързване на финансовите резултати с производството, продажбите и операциите."],
  ["Рамка за управленска отчетност", "Стандартизирани отчети, ритъм на публикуване и единна структура на информацията."],
  ["Автоматизация и AI", "Автоматизирано събиране, проверка и разпространение на управленската информация."],
];
const process = [
  ["01", "Диагностика", "Анализираме как се използва информацията при управленските решения."],
  ["02", "Архитектура", "Проектираме KPI рамката, отчетите и информационните потоци."],
  ["03", "Внедряване", "Изграждаме управленски табла, отчети и автоматизирани процеси за актуализация."],
  ["04", "Управление", "Развиваме системата според новите бизнес нужди и управленски решения."],
];
const outcomes = [
  ["Единна управленска информация", "Всички ключови показатели са организирани в последователна управленска структура."],
  ["Навременни решения", "Информацията достига до ръководството в правилния момент."],
  ["Обективен анализ", "Финансовите резултати се разглеждат заедно с оперативните фактори."],
  ["По-малко ръчна работа", "Автоматизирано генериране и разпространение на управленската отчетност."],
];
const useCases = [
  ["Растящи компании", "За бизнеси, при които информацията вече не може да се управлява чрез множество Excel файлове."],
  ["Производство", "За организации с комплексни производствени процеси и необходимост от оперативна финансова видимост."],
  ["Холдингови структури", "За групи компании, които консолидират управленска информация от множество дружества."],
  ["Компании в трансформация", "За организации, които внедряват ERP, променят организационната структура или изграждат нов управленски модел."],
];
const related = [
  ["CFO функция", "Финансова архитектура, роли и управленски процеси.", "/services/cfo-function"],
  ["Бюджети и прогнози", "Планиране, основано на бизнес драйвери и сценарии.", "/services/budgets-and-forecasting"],
  ["Финансови данни", "Единна основа за отчетност, анализ и автоматизация.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function ManagementReportingPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="management-reporting-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">Управленска отчетност</span></nav>
          <span className={styles.category}>Финанси</span>
          <h1 id="management-reporting-title">Управленска отчетност</h1>
          <p className={styles.lead}>Система за управленска информация, изградена около начина, по който се управлява бизнесът.</p>
          <p className={styles.support}>Изграждаме управленска отчетност, която свързва финансовите и оперативните показатели в последователна система за анализ, контрол и вземане на решения.</p>
          <Link className={styles.primaryButton} href="/contact?topic=management-reporting">Обсъдете управленската си отчетност <span aria-hidden="true">→</span></Link>
        </div>
        <ManagementDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="Обхват" title="Какво включва" intro="Управленската отчетност свързва показателите, анализа и информационните потоци в единна система за решения." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="Метод" title="Как работим" intro="Системата се изгражда поетапно — от начина, по който се вземат решения, до работещ ритъм на управленска информация." /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="Резултати" title="Какво получавате" intro="Резултатът е надеждна управленска система, която дава видимост, контрол и ясна основа за решения." /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="case-example-title"><div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Производствена компания</h3></div><dl><div><dt>Контекст</dt><dd>Финансовата и оперативната информация се изготвят отделно, без единна KPI рамка и с ограничена възможност за анализ на отклоненията.</dd></div><div><dt>Подход</dt><dd>Изградена е система за управленска отчетност, която свързва ERP данните, KPI показателите и executive dashboard-ите в единна структура.</dd></div><div><dt>Резултат</dt><dd>Навременна, последователна и надеждна управленска информация за ежедневните решения.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="Приложения" title="Къде е приложима системата" intro="Моделът се адаптира към мащаба, оперативната сложност и информационните нужди на бизнеса." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="Следваща стъпка" title="Свързани услуги" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на управленската информация</span><h2 id="cta-title">Система за решения около начина, по който управлявате бизнеса.</h2><p>Фокусът е върху показателите, информационните потоци и ритъма, които дават на ръководството навременна и надеждна картина.</p><Link className={styles.ctaButton} href="/contact?topic=management-reporting">Обсъдете управленската си отчетност <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
