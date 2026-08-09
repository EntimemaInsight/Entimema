import styles from "./decision-automation.module.css";

const metrics = [
  ["Обем решения", "48,920", "+12.4%"],
  ["Процент на одобрение", "64.8%", "+2.7 т."],
  ["Дял за ръчен преглед", "11.6%", "−3.2 т."],
  ["Средно време за решение", "1.8с", "−0.6с"],
];

const flow = ["Заявление", "Обогатяване на данните", "Рисков модел", "Бизнес правила", "Решение"];

export default function DecisionEngineDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационна платформа за автоматизирано изпълнение на решения">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>Платформа за решения</span><h2>Управление на решенията</h2></div><span className={styles.demoBadge}>Активна стратегия</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <section className={styles.flowPanel} aria-labelledby="decision-flow-title">
        <div className={styles.chartHeading}><div><span>Слой за изпълнение</span><h3 id="decision-flow-title">Процес на вземане на решения</h3></div><span className={styles.executionBadge}>Изпълнява се</span></div>
        <div className={styles.flow}>{flow.map((step, index) => <div className={index === flow.length - 1 ? styles.flowDecision : ""} key={step}><i>{index < 4 ? `0${index + 1}` : "✓"}</i><span>{step}</span></div>)}</div>
        <div className={styles.outcomeRail}><span className={styles.approve}>Одобрение <b>64.8%</b></span><span className={styles.review}>Преглед <b>11.6%</b></span><span className={styles.reject}>Отказ <b>20.9%</b></span><span className={styles.escalate}>Ескалация <b>2.7%</b></span></div>
      </section>
      <div className={styles.moduleGrid}>
        <section><span>Представяне на стратегията</span><strong>+8.4%</strong><small>резултат, коригиран спрямо риска</small></section>
        <section><span>Champion vs Challenger</span><div className={styles.strategyBars}><i><b /></i><i><b /></i></div><small>Champion води с 4.2 т.</small></section>
        <section><span>Изпълнение на правилата</span><strong>27 / 27</strong><small>оценени правила</small></section>
        <section><span>Изключения</span><strong>1.3%</strong><small>в рамките на прага</small></section>
      </div>
      <div className={styles.dashboardFooter}><span>Разпределение на решенията</span><span>Хронология на решенията</span><span>Представяне на стратегията</span><span>Изпълнение на правилата</span></div>
    </div>
  );
}
