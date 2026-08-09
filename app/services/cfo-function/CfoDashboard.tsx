import styles from "./cfo-function.module.css";

const metrics = [
  ["Приходи", "€1.24m", "+ €84k спрямо прогнозата"],
  ["EBITDA", "€186k", "15.0% margin"],
  ["Оперативен паричен поток", "€142k", "Положителна перспектива"],
  ["Брутен марж", "42.8%", "Стабилен през тримесечието"],
];

export default function CfoDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационно финансово табло">
      <div className={styles.dashboardTop}>
        <div>
          <span className={styles.dashboardEyebrow}>Управленска отчетност</span>
          <h2>Финансов преглед</h2>
        </div>
        <span className={styles.demoBadge}>Демо данни</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note]) => (
          <div className={styles.metric} key={label}>
            <span>{label}</span><strong>{value}</strong><small>{note}</small>
          </div>
        ))}
      </div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="forecast-chart-title">
          <div className={styles.chartHeading}>
            <div><span>Представяне</span><h3 id="forecast-chart-title">Реално спрямо прогноза</h3></div>
            <div className={styles.legend}><i />Реално <i />Прогноза</div>
          </div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Реалните стойности завършват малко над прогнозата">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 118C70 107 94 92 145 87S230 69 275 63S354 43 408 35" />
            <path className={styles.actualLine} d="M12 124C61 116 103 99 145 101S220 78 275 75S349 46 408 27" />
          </svg>
          <div className={styles.axis}><span>яну</span><span>фев</span><span>мар</span><span>апр</span><span>май</span><span>юни</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="cash-chart-title">
          <div className={styles.chartHeading}><div><span>Ликвидност</span><h3 id="cash-chart-title">Прогноза за паричните потоци</h3></div></div>
          <div className={styles.bars} aria-label="Положителна прогноза за паричния поток през следващите шест месеца">
            {[48, 62, 55, 72, 68, 86].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className={styles.axis}><span>юли</span><span>авг</span><span>сеп</span><span>окт</span><span>ное</span><span>дек</span></div>
        </section>
      </div>
    </div>
  );
}
