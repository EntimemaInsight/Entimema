import type { CSSProperties } from "react";
import styles from "./financial-data.module.css";

const metrics = [
  ["Свързани източници", "12 / 12", "Всички са синхронизирани"],
  ["Качество на данните", "99.4%", "+0.8 т."],
  ["Степен на автоматизация", "94%", "18 активни процеса"],
  ["Статус на валидацията", "Успешно", "Последно изпълнение 08:42"],
];

export default function FinancialDataDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационен контролен панел за надеждност и интеграция на финансови данни">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>Основа на финансовите данни</span><h2>Контрол на надеждността на данните</h2></div><span className={styles.demoBadge}>Синхронизирано</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="data-flow-title"><div className={styles.chartHeading}><div><span>Поток от данни</span><h3 id="data-flow-title">Интегриран финансов поток</h3></div></div><div className={styles.dataFlow}><span>ERP</span><i /><span>Модел</span><i /><span>Финанси</span></div></section>
        <section className={styles.cashPanel} aria-labelledby="source-mapping-title"><div className={styles.chartHeading}><div><span>Съответствие на източниците</span><h3 id="source-mapping-title">Картографирани структури</h3></div></div><div className={styles.mappingList}>{[["Сметкоплан", "100%"], ["Разходни центрове", "98%"], ["Юридически лица", "100%"]].map(([label, width]) => <div className={styles.mappingRow} key={label}><span>{label}</span><span className={styles.mappingTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{width}</strong></div>)}</div></section>
        <section className={styles.chartPanel} aria-labelledby="validation-results-title"><div className={styles.chartHeading}><div><span>Резултати от валидацията</span><h3 id="validation-results-title">Контролни проверки</h3></div></div><div className={styles.validationList}>{[["Пълнота", "Успешно"], ["Последователност", "Успешно"], ["Равнение", "Успешно"]].map(([label, status]) => <div key={label}><span>{label}</span><strong><i />{status}</strong></div>)}</div></section>
        <section className={styles.cashPanel} aria-labelledby="integration-status-title"><div className={styles.chartHeading}><div><span>Статус на интеграцията</span><h3 id="integration-status-title">Свързани системи</h3></div></div><div className={styles.systemList}>{["ERP ядро", "Планиране", "Отчетност", "Master Data"].map((system) => <div key={system}><i /><span>{system}</span><strong>Активно</strong></div>)}</div></section>
      </div>
    </div>
  );
}
