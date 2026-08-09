import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import RiskAgentOperations from "./RiskAgentOperations";
import styles from "../decision-automation/decision-automation.module.css";

export const metadata: Metadata = {
  title: "Рискови AI агенти | Entimema",
  description: "AI агенти за анализ, мониторинг и изпълнение на рискови процеси.",
};

const capabilities = [
  ["Агенти за рисков мониторинг", "Непрекъснато наблюдение на рискови показатели, портфейли, събития и отклонения."],
  ["Агенти за кредитен риск", "AI агенти за анализ на кредитни заявки, портфейлно представяне и промени в рисковия профил."],
  ["AML агенти за разследване", "AI агенти за предварителен анализ на сигнали, клиентска активност и AML случаи."],
  ["Агенти за подкрепа при вземане на решения", "Подготовка на структурирани анализи и препоръки за решения, изискващи човешка преценка."],
  ["Управление на изключения", "Идентифициране, анализ и ескалация на случаи извън стандартната логика за вземане на решения."],
  ["Агенти за рискови работни процеси", "Автоматизирано изпълнение на контролирани рискови процеси между данни, модели, системи и човешки екипи."],
];

const process = [
  ["01", "Диагностика", "Определяме процесите, в които AI агентите могат да създадат измерима стойност при приемливо ниво на контрол."],
  ["02", "Архитектура", "Дефинираме ролята, достъпа, правилата, ограниченията и точките за човешка намеса."],
  ["03", "Внедряване", "Интегрираме агентите с данните, рисковите модели, платформите Decision Engine и работните процеси."],
  ["04", "Управление", "Наблюдаваме действията, качеството и ефективността на агентите и развиваме техните възможности."],
];

const outcomes = [
  ["По-бърз анализ", "Рисковите събития и случаи се анализират преди намесата на специалист."],
  ["По-малко ръчна работа", "Повтаряемите проверки, анализи и административни действия се автоматизират."],
  ["Последователно изпълнение", "Агентите работят според дефинирани правила, права и контролни механизми."],
  ["Повече капацитет за експертна работа", "Рисковите екипи концентрират времето си върху сложните случаи и управленските решения."],
];

const useCases = [
  ["Кредитен риск", "За мониторинг на портфейли, анализ на заявления, отклонения и промени в рисковия профил."],
  ["AML и съответствие", "За предварителен анализ на сигнали, клиентски проверки, AML случаи и ескалации."],
  ["Управление на риска", "За автоматизация на наблюдение, анализ, контролни проверки и обработка на рискови събития."],
];

const related = [
  ["Кредитен риск", "Модели, политики и управление на портфейлния риск.", "/services/credit-risk"],
  ["AML и съответствие", "AML контроли, мониторинг и архитектура за регулаторно съответствие.", "/services/aml-compliance"],
  ["Автоматизация на решения", "Данни, модели и политики, превърнати в проследими автоматизирани решения.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function RiskAiAgentsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="risk-ai-agents-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Риск</span><span>/</span><Link href="/services/risk-ai-agents" aria-current="page">Рискови AI агенти</Link></nav>
          <span className={styles.category}>Риск</span>
          <h1 id="risk-ai-agents-title">Рискови AI агенти</h1>
          <p className={styles.lead}>AI агенти за анализ, мониторинг и изпълнение на рискови процеси.</p>
          <p className={styles.support}>Изграждаме AI агенти, които работят с рискови модели, правила и данни, анализират събития, подготвят решения и автоматизират контролирани работни процеси.</p>
          <Link className={styles.primaryButton} href="/contact?topic=risk-ai-agents">Обсъдете своите рискови AI агенти <span aria-hidden="true">→</span></Link>
        </div>
        <RiskAgentOperations />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="AI агенти за контролирани рискови процеси" intro="Контролирано изпълнение чрез AI, бизнес правила, права, проследимост и човешки контрол в единна оперативна архитектура." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как изграждаме рискови AI агенти" intro="От диагностика и архитектура до контролирано внедряване и управление на агентите." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Повече капацитет за експертна работа" intro="Рисковите процеси се анализират и изпълняват по-бързо, последователно и под контрол." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Дружество за потребителско кредитиране</h3></div>
          <dl>
            <div><dt>Контекст</dt><dd>Рисковият екип обработва голям обем повтаряеми проверки, портфейлни анализи и отклонения, които изискват ръчна подготовка и преглед.</dd></div>
            <div><dt>Подход</dt><dd>Изградени са AI агенти, интегрирани с рисковите данни, моделите и decision engine, които наблюдават събитията, извършват предварителен анализ и ескалират случаите според дефинирани правила.</dd></div>
            <div><dt>Резултат</dt><dd>По-бърза обработка на рисковите събития, по-малко ръчни операции и повече капацитет за експертен анализ и сложни решения.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде се вписват рисковите AI агенти" intro="Агентите подпомагат наблюдението, анализа и контролираното изпълнение в ключови рискови процеси." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Продуктова навигация" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Рискови AI агенти</span><h2 id="cta-title">Автоматизирайте контролираните рискови процеси.</h2><p>Свържете контролираното изпълнение чрез AI с рисковите модели, бизнес правилата, правата, проследимостта и човешкия контрол.</p><Link className={styles.ctaButton} href="/contact?topic=risk-ai-agents">Обсъдете своите рискови AI агенти <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
