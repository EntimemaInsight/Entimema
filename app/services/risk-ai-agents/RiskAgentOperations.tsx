import styles from "../decision-automation/decision-automation.module.css";

const metrics = [
  ["Активни агенти", "12", "10 работят"],
  ["Обработени случаи", "2,486", "+18.2%"],
  ["Дял на ескалациите", "7.4%", "в рамките на политиката"],
  ["Успешно изпълнение", "98.6%", "+1.1 т."],
];

const agents = [
  ["Агент за портфейлен мониторинг", "Наблюдение"],
  ["Агент за кредитен преглед", "Анализиране"],
  ["AML агент за разследване", "Подготвено действие"],
  ["Агент за изключения", "Ескалирано"],
  ["Човешки преглед", "Завършено"],
];

export default function RiskAgentOperations() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационна платформа за управление на рискови AI агенти">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>Контролирано изпълнение на риска</span><h2>Операции на рисковите агенти</h2></div><span className={styles.demoBadge}>Агентите са активни</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <section className={styles.flowPanel} aria-labelledby="agent-activity-title">
        <div className={styles.chartHeading}><div><span>Бизнес правила · права · одитна следа</span><h3 id="agent-activity-title">Активност на агентите</h3></div><span className={styles.executionBadge}>Човешки контрол</span></div>
        <div className={styles.flow}>{agents.map(([agent, status], index) => <div className={index === agents.length - 1 ? styles.flowDecision : ""} key={agent}><i>{index === agents.length - 1 ? "✓" : `0${index + 1}`}</i><span>{agent}<small>{status}</small></span></div>)}</div>
        <div className={styles.outcomeRail}><span className={styles.approve}>Наблюдение <b>8</b></span><span className={styles.review}>Анализиране <b>3</b></span><span className={styles.escalate}>Ескалирано <b>1</b></span><span className={styles.reject}>Завършено <b>142</b></span></div>
      </section>
      <div className={styles.moduleGrid}>
        <section><span>Опашка за човешки преглед</span><strong>18</strong><small>случаи, очакващи преглед</small></section>
        <section><span>Представяне на агентите</span><strong>98.6%</strong><small>успешни изпълнения</small></section>
        <section><span>Ескалации</span><strong>7.4%</strong><small>насочване според политиката</small></section>
        <section><span>Дневник на изпълнението</span><strong>2,486</strong><small>проследими действия</small></section>
      </div>
      <div className={styles.dashboardFooter}><span>Хронология на активността</span><span>Опашка за човешки преглед</span><span>Представяне на агентите</span><span>Дневник на изпълнението</span></div>
    </div>
  );
}
