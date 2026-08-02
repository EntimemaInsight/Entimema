import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CostDashboard from "./CostDashboard";
import styles from "./cost-and-profitability.module.css";

export const metadata: Metadata = { title: "Себестойност и рентабилност | Entimema", description: "Система за разбиране на икономиката на бизнеса." };

const capabilities = [
  ["Модели за себестойност", "Изграждане на прозрачни модели за калкулиране на себестойността."],
  ["Рентабилност", "Анализ на печалбата по продукти, клиенти, процеси и бизнес звена."],
  ["Cost Drivers", "Идентифициране на факторите, които определят разходите и маржовете."],
  ["Маржин анализ", "Проследяване на брутни, оперативни и нетни маржове."],
  ["Симулации", "Оценка на влиянието на цените, производствените разходи и продуктовия микс."],
  ["Автоматизация и AI", "Автоматизиран анализ на себестойността, отклоненията и рентабилността."],
];
const process = [
  ["01", "Диагностика", "Анализираме начина, по който се формира себестойността и как се оценява рентабилността."],
  ["02", "Архитектура", "Проектираме моделите за себестойност, cost drivers и правилата за разпределение."],
  ["03", "Внедряване", "Изграждаме моделите, анализите и автоматизираните изчисления."],
  ["04", "Управление", "Развиваме моделите според промените в бизнеса и новите управленски въпроси."],
];
const outcomes = [
  ["Прозрачна себестойност", "Ясно разбиране как се формира себестойността."],
  ["Рентабилност по измерения", "Печалбата може да се анализира по продукти, клиенти, процеси и бизнес звена."],
  ["По-добри решения", "Ценообразуването и продуктовият микс се основават на реални икономически данни."],
  ["Постоянен контрол", "Автоматизиран анализ на отклоненията и факторите зад финансовия резултат."],
];
const useCases = [
  ["Производство", "За организации със сложни производствени процеси и многостепенна себестойност."],
  ["Компании с богато продуктово портфолио", "За бизнеси с множество продукти и различни маржове."],
  ["Растящи компании", "За организации, които изграждат по-прецизен модел за управление на печалбата."],
  ["Холдингови структури", "За групи компании, които анализират рентабилността на множество дружества и бизнес линии."],
];
const related = [
  ["CFO функция", "Финансова архитектура, роли и управленски процеси.", "/services/cfo-function"],
  ["Бюджети и прогнози", "Планиране, основано на бизнес драйвери и сценарии.", "/services/budgets-and-forecasting"],
  ["Управленска отчетност", "Информация за ръководството, организирана около решенията.", "/services/management-reporting"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) { return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>; }

export default function CostAndProfitabilityPage() {
  return <main className={styles.page}>
    <AnnouncementBar /><Navbar active="services" />
    <section className={styles.hero} aria-labelledby="cost-title"><div className={`site-container ${styles.heroInner}`}><div className={styles.heroCopy}>
      <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">Себестойност и рентабилност</span></nav>
      <span className={styles.category}>Финанси</span><h1 id="cost-title">Себестойност и рентабилност</h1><p className={styles.lead}>Система за разбиране на икономиката на бизнеса.</p><p className={styles.support}>Изграждаме модели за себестойност и анализ на рентабилността, които свързват разходите, процесите и финансовите резултати в единна управленска система.</p><Link className={styles.primaryButton} href="/contact">Обсъдете икономиката на бизнеса си <span aria-hidden="true">→</span></Link>
    </div><CostDashboard /></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="Обхват" title="Какво включва" intro="Системата свързва себестойността, маржовете и факторите зад тях в единна икономическа картина." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], i) => <article className={styles.capability} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.tinted}`}><div className="site-container"><SectionHeader label="Метод" title="Как работим" intro="Моделът се изгражда поетапно — от диагностиката на разходите до постоянен контрол върху рентабилността." /><ol className={styles.timeline}>{process.map(([n, title, copy]) => <li key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="Резултати" title="Какво получавате" intro="Ясна икономическа основа за ценообразуване, продуктов микс и управление на разходите." /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      <aside className={styles.caseExample} aria-labelledby="scenario-title"><div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="scenario-title">Производствена компания</h3></div><dl><div><dt>Контекст</dt><dd>Ограничена видимост върху факторите, които формират себестойността, и липса на последователен анализ на рентабилността по продукти.</dd></div><div><dt>Подход</dt><dd>Изграден е модел за себестойност, свързан с ERP данните, cost drivers и анализ на рентабилността по ключови бизнес измерения.</dd></div><div><dt>Резултат</dt><dd>Последователна основа за ценообразуване, оптимизация на разходите и управленски решения.</dd></div></dl></aside>
    </div></section>
    <section className={`${styles.section} ${styles.tinted}`}><div className="site-container"><SectionHeader label="Приложения" title="Къде е приложима системата" intro="Моделът се адаптира към продуктовата сложност, структурата на разходите и управленските нужди на бизнеса." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="Следваща стъпка" title="Свързани услуги" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
    <section className={styles.ctaSection}><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на икономиката на бизнеса</span><h2>Ясна картина къде се създава стойност и къде се губи рентабилност.</h2><p>Фокусът е върху връзката между разходите, процесите, продуктите и реалния финансов резултат.</p><Link className={styles.ctaButton} href="/contact">Обсъдете икономиката на бизнеса си <span aria-hidden="true">→</span></Link></div></div></section>
  </main>;
}
