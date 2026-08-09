import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import AiOperationsDashboard from "./AiOperationsDashboard";
import styles from "./financial-ai-agents.module.css";

export const metadata: Metadata = {
  title: "Финансови AI агенти | Entimema",
  description: "AI агенти за автоматизация и изпълнение на повтаряеми финансови процеси.",
};

const capabilities = [
  ["Агенти за отчетност", "Автоматично генериране и публикуване на управленска отчетност."],
  ["Агенти за планиране", "Подготовка и актуализация на бюджети, прогнози и сценарии."],
  ["Агенти за контролинг", "Автоматичен анализ на отклоненията и финансовите резултати."],
  ["ERP агенти", "AI агенти, които работят с ERP данните и автоматизират повтаряемите операции."],
  ["Подкрепа при вземане на решения", "AI помощници за финансов анализ и управленски решения."],
  ["Автоматизация на работни процеси", "AI агенти, които изпълняват финансови работни процеси от край до край."],
];
const process = [
  ["01", "Диагностика", "Определяме кои процеси имат най-голям потенциал за AI автоматизация."],
  ["02", "Проектиране", "Дефинираме ролята, задачите и ограниченията на AI агентите."],
  ["03", "Внедряване", "Интегрираме AI агентите с ERP, финансовите данни и управленските процеси."],
  ["04", "Развитие", "Разширяваме възможностите на агентите според развитието на бизнеса."],
];
const outcomes = [
  ["По-малко ръчни задачи", "Повтаряемите финансови дейности се автоматизират."],
  ["По-бърз анализ", "AI агентите подготвят информацията преди човешкия преглед."],
  ["Последователно изпълнение", "Процесите следват еднаква логика независимо от натоварването."],
  ["Повече време за решения", "Финансовият екип се фокусира върху анализа, а не върху ръчната обработка."],
];
const useCases = [
  ["Финансови отдели", "За автоматизация на ежедневните финансови операции."],
  ["Производство", "За анализ на себестойност, отклонения и оперативни показатели."],
  ["Холдингови структури", "За автоматизиране на консолидирани процеси и отчетност."],
  ["Компании в дигитална трансформация", "За организации, които изграждат AI-базирани финансови процеси."],
];
const related = [
  ["Управленска отчетност", "Управленска информация за ежедневни решения.", "/services/management-reporting"],
  ["Бюджети и прогнози", "Планиране, основано на бизнес драйвери и сценарии.", "/services/budgets-and-forecasting"],
  ["Финансови данни", "Единна основа за отчетност, анализ и автоматизация.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function FinancialAiAgentsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="financial-ai-agents-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">Финансови AI агенти</span></nav>
          <span className={styles.category}>Финанси</span><h1 id="financial-ai-agents-title">Финансови AI агенти</h1>
          <p className={styles.lead}>AI агенти за автоматизация на финансовите процеси.</p>
          <p className={styles.support}>Изграждаме AI агенти, които изпълняват повтаряеми финансови задачи, анализират данни, подготвят управленска информация и подпомагат ежедневните решения на финансовия екип.</p>
          <Link className={styles.primaryButton} href="/contact?topic=financial-ai-agents">Обсъдете финансовите си процеси <span aria-hidden="true">→</span></Link>
        </div><AiOperationsDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="Възможности" title="Какво изпълняват агентите" intro="Дигитални финансови служители, проектирани около реалните процеси, данни и контролни точки на организацията." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="Метод" title="Как работим" intro="Изграждаме агентите поетапно — от избора на подходящ процес до надеждно автономно изпълнение." /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="Резултати" title="Какво получавате" intro="Финансови операции, които се изпълняват надеждно, последователно и с ясна човешка отговорност." /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="case-example-title"><div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Производствена компания</h3></div><dl><div><dt>Контекст</dt><dd>Финансовият екип извършва множество повтаряеми анализи, проверки и подготовка на отчети, които отнемат значително време.</dd></div><div><dt>Подход</dt><dd>Изградени са AI агенти, интегрирани с ERP, финансовите данни и управленската отчетност, които автоматизират регулярните задачи и подготвят анализите.</dd></div><div><dt>Резултат</dt><dd>По-бърза подготовка на финансовата информация, по-малко ръчни операции и повече време за управленски анализ.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="Приложения" title="Къде са приложими AI агентите" intro="Прилагаме агентите там, където финансовата работа е повторяема, основана на правила и зависима от надеждни данни." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="Следваща стъпка" title="Свързани услуги" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>AI автоматизация на финансовите операции</span><h2 id="cta-title">Изградете дигитални финансови служители около реалните процеси на бизнеса.</h2><p>Започваме с конкретните повтаряеми задачи, системите и контролните точки, които определят надеждното изпълнение.</p><Link className={styles.ctaButton} href="/contact?topic=financial-ai-agents">Обсъдете възможностите <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
