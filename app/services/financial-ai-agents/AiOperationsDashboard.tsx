import styles from "./financial-ai-agents.module.css";

const metrics = [
  ["Автоматизирани задачи", "1,284", "+18% този месец"],
  ["Успешно изпълнение", "99.4%", "Стабилно"],
  ["Спестени часове", "326ч", "Това тримесечие"],
  ["Натоварване на агентите", "87%", "12 активни агента"],
];

export default function AiOperationsDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Табло за AI операции">
      <div className={styles.dashboardTop}>
        <div><span className={styles.dashboardEyebrow}>Финансови операции</span><h2>AI операции</h2></div>
        <span className={styles.demoBadge}>Изпълнение в реално време</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="automation-trend-title">
          <div className={styles.chartHeading}><div><span>Динамика на автоматизацията</span><h3 id="automation-trend-title">Завършени изпълнения</h3></div><div className={styles.legend}><i />Завършено <i />Планирано</div></div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Устойчив ръст на автоматизираните финансови задачи">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 118C70 108 100 96 145 89S222 76 275 62S352 46 408 38" />
            <path className={styles.actualLine} d="M12 124C60 119 98 101 145 104S222 80 275 76S350 45 408 25" />
          </svg>
          <div className={styles.axis}><span>яну</span><span>фев</span><span>мар</span><span>апр</span><span>май</span><span>юни</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="workflow-status-title">
          <div className={styles.chartHeading}><div><span>Статус на работните процеси</span><h3 id="workflow-status-title">Състояние на изпълнението</h3></div></div>
          <div className={styles.statusTrack}><div><strong>38</strong><span>Завършено</span></div><div><strong>7</strong><span>Изпълнява се</span></div><div><strong>3</strong><span>В опашката</span></div></div>
        </section>
      </div>
      <div className={styles.operationsGrid}>
        <section className={styles.chartPanel} aria-labelledby="agent-activity-title">
          <div className={styles.chartHeading}><div><span>Активност на агентите</span><h3 id="agent-activity-title">Последни финансови операции</h3></div></div>
          <div className={styles.activityList}>
            <div className={styles.activityRow}><i /><span>Анализ на отклонението в маржа</span><strong>Завършено</strong></div>
            <div className={styles.activityRow}><i /><span>Обновяване на управленския отчет</span><strong>Изпълнява се</strong></div>
          </div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="execution-queue-title">
          <div className={styles.chartHeading}><div><span>Опашка за изпълнение</span><h3 id="execution-queue-title">Следващи операции</h3></div></div>
          <div className={styles.queueList}><div className={styles.queueRow}><span>Проверка на паричните средства</span><strong>09:30</strong></div><div className={styles.queueRow}><span>ERP приключване</span><strong>10:00</strong></div></div>
        </section>
      </div>
    </div>
  );
}
