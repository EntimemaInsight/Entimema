import styles from "./cfo-function.module.css";

const metrics = [
  ["Revenue", "€1.24m", "+ €84k vs forecast"],
  ["EBITDA", "€186k", "15.0% margin"],
  ["Operating Cash Flow", "€142k", "Positive outlook"],
  ["Gross Margin", "42.8%", "Stable through the quarter"],
];

export default function CfoDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Demonstration financial dashboard">
      <div className={styles.dashboardTop}>
        <div>
          <span className={styles.dashboardEyebrow}>MANAGEMENT REPORTING</span>
          <h2>Financial Overview</h2>
        </div>
        <span className={styles.demoBadge}>Demo data</span>
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
            <div><span>Performance</span><h3 id="forecast-chart-title">Actual vs Forecast</h3></div>
            <div className={styles.legend}><i />Actual <i />Forecast</div>
          </div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Actual values finish slightly above forecast">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 118C70 107 94 92 145 87S230 69 275 63S354 43 408 35" />
            <path className={styles.actualLine} d="M12 124C61 116 103 99 145 101S220 78 275 75S349 46 408 27" />
          </svg>
          <div className={styles.axis}><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="cash-chart-title">
          <div className={styles.chartHeading}><div><span>Liquidity</span><h3 id="cash-chart-title">Cash Flow Forecast</h3></div></div>
          <div className={styles.bars} aria-label="Positive cash flow forecast over the next six months">
            {[48, 62, 55, 72, 68, 86].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className={styles.axis}><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div>
        </section>
      </div>
    </div>
  );
}
