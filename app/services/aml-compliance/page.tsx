import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import AmlOperationsDashboard from "./AmlOperationsDashboard";
import styles from "../credit-risk/credit-risk.module.css";

export const metadata: Metadata = {
  title: "AML и съответствие | Entimema",
  description: "Политики, сценарии и модели за управление на AML процесите.",
};

const capabilities = [
  ["KYC и Customer Due Diligence (CDD)", "Политики и процеси за идентификация, оценка и периодичен преглед на клиентите."],
  ["Санкционен и PEP скрининг", "Автоматизирани проверки срещу санкционни списъци, PEP и други рискови източници."],
  ["Transaction Monitoring", "Сценарии и правила за наблюдение на транзакции и откриване на подозрителна активност."],
  ["Case Management", "Структуриран процес за анализ, ескалация и управление на AML случаи."],
  ["AML анализи", "Анализи, показатели и модели за наблюдение на ефективността на AML процесите."],
  ["AML AI агенти", "AI агенти за анализ, мониторинг и автоматизация на AML дейности."],
];

const process = [
  ["01", "Диагностика", "Оценяваме текущите AML процеси, политики и контролни механизми."],
  ["02", "Архитектура", "Проектираме сценарии, правила, модели и AML архитектура."],
  ["03", "Внедряване", "Интегрираме AML процесите с данните, системите и работните потоци."],
  ["04", "Оптимизация", "Калибрираме сценариите, подобряваме ефективността и намаляваме фалшивите сигнали."],
];

const outcomes = [
  ["По-високо ниво на регулаторно съответствие", "Политиките, контролите и доказателствата работят в единна проследима архитектура."],
  ["По-малко фалшиви сигнали", "Сценариите и праговете се калибрират спрямо реалния риск и оперативните резултати."],
  ["По-бързо управление на AML случаи", "Сигналите преминават през ясен процес за анализ, ескалация и решение."],
  ["Повече прозрачност върху AML процесите", "Показателите свързват рисковите събития, разследванията и ефективността на контролите."],
];

const useCases = [
  ["Банки", "За банки, които изграждат и развиват модерни AML процеси и контролни механизми."],
  ["Дружества за потребителско кредитиране", "За организации, които въвеждат KYC, санкционен контрол и мониторинг на транзакции."],
  ["Лизингови компании", "За финансови институции, които изграждат AML процеси в съответствие с регулаторните изисквания."],
];

const related = [
  ["Кредитен риск", "Модели, политики и автоматизирани решения за управление на кредитния риск.", "/services/credit-risk"],
  ["AML и съответствие", "Политики, сценарии и модели за управление на AML процесите.", "/services/aml-compliance"],
  ["Автоматизация на решения", "Данни, модели и политики, превърнати в проследими автоматизирани решения.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function AmlCompliancePage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="aml-compliance-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Навигационна пътека"><Link href="/">Начало</Link><span>/</span><span>Риск</span><span>/</span><Link href="/services/aml-compliance" aria-current="page">AML и съответствие</Link></nav>
          <span className={styles.category}>Риск</span>
          <h1 id="aml-compliance-title">AML и съответствие</h1>
          <p className={styles.lead}>Политики, сценарии и модели за управление на AML процесите.</p>
          <p className={styles.support}>Изграждаме цялостни AML архитектури, които интегрират KYC, санкционен контрол, транзакционен мониторинг, управление на случаи и регулаторно съответствие.</p>
          <Link className={styles.primaryButton} href="/contact?topic=aml-compliance">Обсъдете своята AML архитектура <span aria-hidden="true">→</span></Link>
        </div>
        <AmlOperationsDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="Обхват" title="Цялата AML операционна система" intro="Свързваме политиките, сценариите, данните, разследванията и регулаторния контрол в една работеща архитектура." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="Метод" title="Как изграждаме AML функцията" intro="Работим поетапно – от диагностика на настоящата среда до внедряване и постоянно подобрение." />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="Резултати" title="Контрол върху цялата AML среда" intro="Една оперативна архитектура превръща регулаторните изисквания в проследими процеси, измерими контроли и по-бързи решения." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>Примерен сценарий</span><h3 id="case-example-title">Оператор на онлайн хазарт</h3></div>
          <dl>
            <div><dt>Контекст</dt><dd>AML процесите се основават на множество независими правила, ръчни проверки и ограничена видимост върху рисковите събития.</dd></div>
            <div><dt>Подход</dt><dd>Изградена е единна AML архитектура, която интегрира KYC, санкционен скрининг, Transaction Monitoring, Case Management и аналитични модели.</dd></div>
            <div><dt>Резултат</dt><dd>По-бързо идентифициране на рискови събития, по-нисък дял на фалшивите сигнали и по-ефективно управление на AML процесите.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="Приложения" title="Къде се вписва системата" intro="AML архитектурата се адаптира към бизнес модела, клиентския риск, транзакционната среда и регулаторните изисквания." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="Продуктова навигация" title="Свързани услуги" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>Оценка на AML операционния модел</span><h2 id="cta-title">Изградете и модернизирайте цялата си AML функция.</h2><p>Фокусът е върху връзката между политиките, сценариите, данните, контролите, разследванията и регулаторното съответствие.</p><Link className={styles.ctaButton} href="/contact?topic=aml-compliance">Обсъдете своята AML архитектура <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
