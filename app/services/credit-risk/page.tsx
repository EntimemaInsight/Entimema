import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CreditRiskDashboard from "./CreditRiskDashboard";
import styles from "./credit-risk.module.css";

export const metadata: Metadata = {
  title: "Кредитен риск | Entimema",
  description: "Модели, политики и автоматизирани решения за управление на кредитния риск.",
};

const capabilities = [
  ["Application Scoring", "Модели за оценка на нови кредитни кандидати и автоматизирани кредитни решения."],
  ["Behavioural Scoring", "Модели за периодична преоценка на риска въз основа на поведението на клиента."],
  ["Portfolio Monitoring", "Наблюдение на портфейла чрез delinquency анализ, buckets, vintage анализ, roll rates и ключови показатели."],
  ["Decision Strategies", "Политики, cut-offs, champion/challenger стратегии и автоматизирани decision flows."],
  ["Portfolio Simulation", "Stress testing, transition matrices, stochastic matrices, сценарии и анализ на очакваните портфейлни резултати."],
  ["AI Risk Automation", "AI агенти за анализ, мониторинг и автоматизация на кредитните процеси."],
];

const process = [
  ["01", "Диагностика", "Оценяваме текущите модели, политики и процеси за кредитен риск."],
  ["02", "Архитектура", "Проектираме скоринг модели, decision стратегии и кредитна архитектура."],
  ["03", "Внедряване", "Интегрираме моделите, decision engine и портфейлния мониторинг."],
  ["04", "Оптимизация", "Наблюдаваме представянето на моделите и адаптираме стратегиите спрямо резултатите."],
];

const outcomes = [
  ["По-добро качество на кредитните решения", "Решенията следват единна оценка на риска, политика и контрол."],
  ["По-ниски кредитни загуби", "Рискът се разпознава и управлява по-рано през целия жизнен цикъл."],
  ["Последователни автоматизирани решения", "Decision flows прилагат политиките бързо, проследимо и в мащаб."],
  ["Пълна видимост върху кредитния портфейл", "Показателите свързват качеството при входа с поведението и портфейлния резултат."],
];

const useCases = [
  ["Банки", "Единна кредитна архитектура за продукти, сегменти и канали."],
  ["Финтех компании", "Автоматизирани решения и бързо развитие на рисковите стратегии."],
  ["Лизингови компании", "Оценка на клиента, експозицията и портфейлното представяне."],
  ["BNPL и дигитално кредитиране", "Контрол на риска при голям обем решения в реално време."],
];

const related = [
  ["Кредитен риск", "Модели, политики и автоматизирани решения за управление на кредитния риск.", "/services/credit-risk"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function CreditRiskPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="credit-risk-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Риск</span><span>/</span><Link href="/services/credit-risk" aria-current="page">Кредитен риск</Link></nav>
          <span className={styles.category}>Риск</span>
          <h1 id="credit-risk-title">Кредитен риск</h1>
          <p className={styles.lead}>Модели, политики и автоматизирани решения за управление на кредитния риск.</p>
          <p className={styles.support}>Изграждаме цялостни системи за кредитен риск – от application и behavioural scoring до decision strategies, портфейлен мониторинг и AI автоматизация.</p>
          <Link className={styles.primaryButton} href="/contact">Обсъдете кредитната си архитектура <span aria-hidden="true">→</span></Link>
        </div>
        <CreditRiskDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="Цялата система за кредитни решения" intro="Свързваме моделите, политиките, decision engine и портфейлното управление в една работеща архитектура." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как изграждаме кредитната платформа" intro="Работим поетапно – от оценка на настоящата среда до внедряване и постоянно подобрение." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Контрол върху всяко кредитно решение" intro="Една платформа превръща рисковата стратегия в последователни решения и измеримо портфейлно представяне." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Дигитален кредитор</h3></div>
          <dl>
            <div><dt>Контекст</dt><dd>Различни скоринг модели, ръчни кредитни политики и ограничена видимост върху представянето на портфейла.</dd></div>
            <div><dt>Подход</dt><dd>Изградена е единна архитектура за application scoring, behavioural scoring, decision strategies и портфейлен мониторинг, интегрирана с decision engine.</dd></div>
            <div><dt>Резултат</dt><dd>По-бързи кредитни решения, по-добро управление на риска и последователно развитие на кредитния портфейл.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде е приложима системата" intro="Архитектурата се адаптира към продуктовия модел, регулацията и скоростта на кредитните решения." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Продуктова навигация" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на кредитната архитектура</span><h2 id="cta-title">Изградете цялата си платформа за кредитни решения.</h2><p>Фокусът е върху връзката между моделите, политиките, автоматизираните решения и портфейлното представяне.</p><Link className={styles.ctaButton} href="/contact">Обсъдете кредитната си архитектура <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
