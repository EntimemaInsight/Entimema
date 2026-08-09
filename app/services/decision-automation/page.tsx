import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import DecisionEngineDashboard from "./DecisionEngineDashboard";
import styles from "./decision-automation.module.css";

export const metadata: Metadata = {
  title: "Автоматизация на решения | Entimema",
  description: "Архитектура за последователни и автоматизирани бизнес решения.",
};

const capabilities = [
  ["Decision Architecture", "Проектиране на цялостната логика от входните данни и моделите до крайното бизнес решение."],
  ["Бизнес правила", "Дефиниране на правила, критерии, cut-offs, политики и изключения."],
  ["Интеграция на модели", "Интегриране на скоринг модели, аналитични модели и външни източници на данни в процеса по вземане на решения."],
  ["Процеси на вземане на решения", "Автоматизирани процеси за одобрение, отказ, допълнителен преглед, ескалация и насочване."],
  ["Champion / Challenger", "Паралелно тестване и сравнение на различни модели, правила и стратегии за вземане на решения."],
  ["Симулация и оптимизация", "Симулация на промени в правилата и стратегиите преди внедряването им в реална среда."],
];

const process = [
  ["01", "Диагностика", "Анализираме текущите процеси, правила, модели и точки на вземане на решения."],
  ["02", "Архитектура", "Проектираме единна Decision Architecture и логиката на автоматизираните решения."],
  ["03", "Внедряване", "Интегрираме данните, моделите и бизнес правилата в автоматизирани процеси на вземане на решения."],
  ["04", "Оптимизация", "Тестваме, наблюдаваме и подобряваме стратегиите според реалните резултати."],
];

const outcomes = [
  ["Последователни решения", "Еднакви правила и политики се прилагат последователно във всеки процес."],
  ["По-бързи процеси", "Рутинните решения се изпълняват автоматично и в реално време."],
  ["Контрол върху логиката", "Правилата, моделите и изключенията са структурирани и проследими."],
  ["По-бърза оптимизация", "Новите стратегии могат да бъдат симулирани и тествани преди внедряване."],
];

const useCases = [
  ["Кредитиране", "За автоматизация на кредитни политики, скоринг модели, лимити и решения за одобрение."],
  ["AML и съответствие", "За автоматизация на правила, рискови оценки, ескалации и процеси за допълнителен преглед."],
  ["Оперативен риск", "За процеси, в които решенията зависят от комбинация от данни, модели, политики и бизнес правила."],
];

const related = [
  ["Кредитен риск", "Модели, политики и управление на портфейлния риск.", "/services/credit-risk"],
  ["AML и съответствие", "AML контроли, мониторинг и архитектура за регулаторно съответствие.", "/services/aml-compliance"],
  ["Рискови AI агенти", "Интелигентен слой за изпълнение и анализ над рисковите системи.", "/services/risk-ai-agents"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function DecisionAutomationPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="decision-automation-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Риск</span><span>/</span><Link href="/services/decision-automation" aria-current="page">Автоматизация на решения</Link></nav>
          <span className={styles.category}>Риск</span>
          <h1 id="decision-automation-title">Автоматизация на решения</h1>
          <p className={styles.lead}>Архитектура за последователни и автоматизирани бизнес решения.</p>
          <p className={styles.support}>Изграждаме платформи Decision Engine, които обединяват данни, модели, бизнес правила и политики в единна логика за автоматизирано вземане на решения.</p>
          <Link className={styles.primaryButton} href="/contact">Обсъдете своята decision architecture <span aria-hidden="true">→</span></Link>
        </div>
        <DecisionEngineDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="Логиката зад всяко решение" intro="Свързваме данните, моделите, правилата и политиките в единен изпълним слой между аналитичните системи и оперативните процеси." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как изграждаме Decision Engine" intro="Работим поетапно — от картографиране на настоящата логика до внедряване, наблюдение и оптимизация на автоматизираните решения." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Решения в реално време и под пълен контрол" intro="Единният слой за изпълнение на решения прави бизнес логиката по-бърза, последователна, измерима и проследима." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Дружество за потребителско кредитиране</h3></div>
          <dl>
            <div><dt>Контекст</dt><dd>Кредитните решения се основават на множество правила, проверки и източници на информация, разпределени между различни системи и процеси.</dd></div>
            <div><dt>Подход</dt><dd>Изградена е единна decision architecture, която обединява данните, скоринг моделите, кредитните политики и бизнес правилата в автоматизиран decision flow.</dd></div>
            <div><dt>Резултат</dt><dd>По-бързи и последователни кредитни решения, ясна проследимост на приложената логика и възможност за бързо тестване и оптимизация на стратегиите.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде се вписва системата" intro="Архитектурата на платформата Decision Engine се прилага там, където данни, модели и политики трябва да се превърнат в контролирано оперативно решение." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Продуктова навигация" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на decision architecture</span><h2 id="cta-title">Превърнете бизнес логиката си в работеща система за решения.</h2><p>Свързваме данните, моделите, правилата и политиките в проследим execution layer, който взема последователни решения в реално време.</p><Link className={styles.ctaButton} href="/contact">Обсъдете автоматизацията на решения <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
