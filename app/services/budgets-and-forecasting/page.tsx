import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PlanningDashboard from "./PlanningDashboard";
import styles from "./budgets-and-forecasting.module.css";

export const metadata: Metadata = {
  title: "Бюджети и прогнози | Entimema",
  description: "Система за планиране, която свързва финансовите цели, оперативните допускания и паричните потоци.",
};

const capabilities = [
  ["Бюджетна архитектура", "Структура, отговорности, календар и правила за целия бюджетен процес."],
  ["Модели, основани на драйвери", "Планиране чрез конкретните фактори, които определят приходите, разходите и маржовете."],
  ["Rolling Forecast", "Регулярно актуализиране на очакванията спрямо реалното развитие на бизнеса."],
  ["Сценарно планиране", "Моделиране на различни бизнес сценарии и тяхното отражение върху резултатите."],
  ["Парични потоци", "Свързване на оперативния план с ликвидността и бъдещите финансови потребности."],
  ["Автоматизация и AI", "Автоматизирано събиране на входни данни, актуализация на прогнозите и анализ на отклоненията."],
];
const process = [
  ["01", "Диагностика", "Оценяваме настоящия бюджетен процес, източниците на данни, допусканията и отговорностите."],
  ["02", "Моделиране", "Определяме ключовите драйвери, структурата на модела и връзките между оперативните и финансовите показатели."],
  ["03", "Внедряване", "Изграждаме бюджетите, прогнозите, сценариите и правилата за актуализация."],
  ["04", "Управление", "Въвеждаме ритъм за анализ на отклоненията и регулярна актуализация на прогнозите."],
];
const outcomes = [
  ["Свързан бюджетен процес", "Финансовите и оперативните планове работят в една последователна структура."],
  ["Проследими допускания", "Ясно е кои фактори стоят зад прогнозата и как промените им влияят върху резултатите."],
  ["Актуална прогноза", "Очакванията се обновяват спрямо реалното развитие на бизнеса."],
  ["Видимост върху ликвидността", "Планът показва бъдещите парични нужди и чувствителността им към различни сценарии."],
];
const useCases = [
  ["Бързо растящ бизнес", "За компании, при които темпът на развитие изпреварва съществуващия процес на планиране."],
  ["Оперативно сложни компании", "За бизнеси с множество продукти, звена, пазари и взаимосвързани финансови драйвери."],
  ["Компании с висока несигурност", "За организации, при които цените, обемите или пазарните условия изискват сценарно планиране."],
  ["Холдингови структури", "За групи компании, които консолидират планове, допускания и парични потоци."],
];
const related = [
  ["CFO функция", "Финансова архитектура, роли и управленски процеси.", "/services/cfo-function"],
  ["Управленска отчетност", "Управленска информация за ежедневни решения.", "/services/management-reporting"],
  ["Финансови данни", "Единна основа за отчетност, анализ и автоматизация.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function BudgetsAndForecastingPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="budgets-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Финанси</span><span>/</span><span aria-current="page">Бюджети и прогнози</span></nav>
          <span className={styles.category}>Финанси</span>
          <h1 id="budgets-title">Бюджети и прогнози</h1>
          <p className={styles.lead}>Система за планиране, свързана с реалните двигатели на бизнеса.</p>
          <p className={styles.support}>Изграждаме бюджетни и прогнозни модели, които свързват финансовите цели, оперативните допускания и паричните потоци в последователен управленски процес.</p>
          <Link className={styles.primaryButton} href="/contact?topic=budgets-and-forecasting">Обсъдете системата си за планиране <span aria-hidden="true">→</span></Link>
        </div>
        <PlanningDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="Какво включва" intro="Финансовото планиране свързва бизнес драйверите, допусканията и отговорностите в един работещ процес." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как работим" intro="Системата се изгражда поетапно — от оценка на настоящия процес до редовно управление на прогнозата." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Какво получавате" intro="Резултатът е работеща система за планиране с проследими допускания, актуални очаквания и видимост върху ликвидността." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Производствена компания</h3></div>
          <dl>
            <div><dt>Контекст</dt><dd>Годишен бюджет, изготвян основно чрез исторически стойности, ограничена връзка с производствените драйвери и липса на регулярна актуализация.</dd></div>
            <div><dt>Подход</dt><dd>Модел, основан на драйвери, свързващ обеми, капацитет, материали, цени, разходи и парични потоци, допълнен със сценарии и Rolling Forecast.</dd></div>
            <div><dt>Резултат</dt><dd>Актуална прогноза и проследима връзка между оперативните допускания, финансовия резултат и ликвидността.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде е приложима системата" intro="Моделът се адаптира към темпа на растеж, оперативната сложност и несигурността в бизнеса." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Следваща стъпка" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на процеса за планиране</span><h2 id="cta-title">Система за планиране около реалните двигатели на бизнеса.</h2><p>Фокусът е върху връзката между допусканията, оперативните планове, финансовите резултати и бъдещата ликвидност.</p><Link className={styles.ctaButton} href="/contact?topic=budgets-and-forecasting">Обсъдете системата си за планиране <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
