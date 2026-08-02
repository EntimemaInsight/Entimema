import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CfoDashboard from "./CfoDashboard";
import styles from "./cfo-function.module.css";

export const metadata: Metadata = {
  title: "CFO функция | Entimema",
  description: "Изграждане на финансова функция, управленска отчетност, бюджети, парични потоци, финансови данни и автоматизация според нуждите на бизнеса.",
};

const capabilities = [
  ["Финансова архитектура", "Роли, отговорности, процеси и контролни точки, съобразени с начина, по който работи организацията."],
  ["Управленска отчетност", "Отчети и KPI рамка, които превръщат финансовата информация в основа за ежедневни решения."],
  ["Бюджети и прогнози", "Интегриран процес за планиране, сценарии и актуализиране на очакванията спрямо развитието на бизнеса."],
  ["Парични потоци", "Видимост върху ликвидността, бъдещите парични нужди и ключовите фактори, които влияят върху тях."],
  ["Финансови данни", "Структурирана основа, която свързва отчетността, анализа и автоматизацията във финансовите процеси."],
  ["Автоматизация и AI", "Автоматизирани работни потоци и AI агенти за анализ, отчетност и изпълнение на повтаряеми финансови задачи."],
];
const process = [
  ["01", "Анализ", "Оценяваме текущите процеси, данни, роли, отчети и управленски нужди."],
  ["02", "Архитектура", "Проектираме целевата финансова функция, нейните процеси, отговорности и информационни потоци."],
  ["03", "Внедряване", "Изграждаме моделите, отчетите, контролните механизми и работните потоци."],
  ["04", "Оптимизация", "Следим работата на системата и я адаптираме към промените в бизнеса."],
];
const outcomes = [
  ["Ясна финансова структура", "Определени роли, процеси и отговорности във финансовата функция."],
  ["Навременна управленска информация", "Фокусирани отчети и показатели, достъпни в ритъма, в който се управлява бизнесът."],
  ["Предвидимост", "Свързани бюджети, прогнози и парични потоци за по-добра подготовка при различни сценарии."],
  ["По-малко ръчна работа", "Автоматизирани процеси и по-добро използване на съществуващите системи и данни."],
];
const useCases = [
  ["Растящи компании", "За бизнеси, които са надраснали базовото счетоводно управление и изграждат финансова функция."],
  ["Оперативно интензивен бизнес", "За компании със сложна себестойност, материални потоци, инвестиции и необходимост от оперативна финансова видимост."],
  ["Компании в трансформация", "За организации при внедряване на ERP, преструктуриране или ускорен растеж."],
  ["Холдингови структури", "За групи компании с централизирано финансово управление, консолидирана отчетност и общи управленски процеси."],
];
const related = [
  ["Бюджети и прогнози", "Финансово планиране, основано на данни и бизнес сценарии.", "/services/budgets-forecasts"],
  ["Управленска отчетност", "Управленска информация за ежедневни решения.", "/services/management-reporting"],
  ["Финансови данни", "Единна основа за отчетност, анализ и автоматизация.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function CfoFunctionPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="cfo-title">
        <div className={`site-container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">CFO функция</span></nav>
            <span className={styles.category}>Финанси</span>
            <h1 id="cfo-title">CFO функция</h1>
            <p className={styles.lead}>Финансова функция, адаптирана към начина, по който работи бизнесът.</p>
            <p className={styles.support}>Изграждаме структурата, процесите и управленската информация, необходими за последователни финансови решения — без компанията да изгражда пълна CFO организация от първия ден.</p>
            <Link className={styles.primaryButton} href="/contact">Обсъдете вашия казус <span aria-hidden="true">→</span></Link>
          </div>
          <CfoDashboard />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="Какво включва" intro="Изграждаме финансовата функция около реалните управленски нужди, данните и процесите на бизнеса." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как работим" intro="Подхождаме към финансовата функция като към система — от диагностиката до работещия управленски процес." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Какво получавате" intro="Не просто анализ или препоръка, а работеща финансова система с ясно определени резултати." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде е приложима CFO функцията" intro="Моделът се адаптира към зрелостта, мащаба и оперативната сложност на компанията." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Следваща стъпка" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Разговор за вашия бизнес</span><h2 id="cta-title">Изградете финансова функция около реалните нужди на бизнеса.</h2><p>Нека обсъдим къде са основните ограничения в текущите процеси и каква финансова архитектура е необходима за следващия етап от развитието.</p><Link className={styles.ctaButton} href="/contact">Обсъдете вашия казус <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
