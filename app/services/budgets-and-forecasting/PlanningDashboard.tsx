import type { CSSProperties } from "react";
import styles from "./budgets-and-forecasting.module.css";

const metrics = [
  ["Revenue Forecast", "€1.38m", "+6.2% vs budget"],
  ["EBITDA Forecast", "€214k", "15.5% margin"],
  ["Closing Cash", "€326k", "+€48k vs baseline"],
  ["Forecast Accuracy", "94.2%", "+2.8 pts"],
];

const drivers = [
  ["Volume", "86%", "+8.4%"],
  ["Price", "68%", "+3.1%"],
  ["Mix", "52%", "+1.7%"],
];

export default function PlanningDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Demonstration financial planning dashboard">
      <div className={styles.dashboardTop}>
        <div><span className={styles.dashboardEyebrow}>PLANNING ENVIRONMENT</span><h2>Forecast Overview</h2></div>
        <span className={styles.demoBadge}>Illustrative data</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note], index) => <div className={`${styles.metric} ${index === 0 || index === 2 ? styles.metricPrimary : ""}`} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className={styles.charts}>
        <section className={`${styles.chartPanel} ${styles.planPanel}`} aria-labelledby="plan-chart-title">
          <div className={styles.chartHeading}>
            <div><span>Performance Plan</span><h3 id="plan-chart-title">Actual vs Budget &amp; Forecast</h3></div>
            <div className={styles.legend}><i />Actual <i className={styles.budgetKey} />Budget <i className={styles.forecastKey} />Forecast</div>
          </div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Actual result, budget and forecast over six months">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.budgetLine} d="M12 118C70 104 100 96 145 88S230 72 275 64S354 52 408 39" />
            <path className={styles.forecastLine} d="M12 123C62 112 105 105 145 96S224 78 275 72S348 57 408 49" />
            <path className={styles.actualLine} d="M12 126C61 116 103 101 145 104S220 80 275 77" />
          </svg>
          <div className={styles.axis}><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="cash-outlook-title">
          <div className={styles.chartHeading}><div><span>Liquidity Plan</span><h3 id="cash-outlook-title">Cash Flow Forecast</h3></div></div>
          <div className={styles.bars} aria-label="Cash balance forecast over six months">{[46, 59, 54, 70, 77, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          <div className={styles.axis}><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div>
        </section>
        <section className={styles.chartPanel} aria-labelledby="scenario-title">
          <div className={styles.chartHeading}><div><span>Scenario Analysis</span><h3 id="scenario-title">Scenario Comparison</h3></div></div>
          <div className={styles.scenarioBars} aria-label="Comparison of downside, base and upside scenarios">
            {[48, 61, 74, 55, 69, 82, 62, 76, 91].map((height, index) => <span key={index} style={{ "--height": `${height}%` } as CSSProperties} />)}
          </div>
          <div className={styles.axis}><span>Downside</span><span>Base</span><span>Upside</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="drivers-title">
          <div className={styles.chartHeading}><div><span>Driver-Based Model</span><h3 id="drivers-title">Revenue Drivers</h3></div></div>
          <div className={styles.driverList}>{drivers.map(([label, width, value]) => <div className={styles.driverRow} key={label}><span>{label}</span><span className={styles.driverTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div>
        </section>
      </div>
    </div>
  );
}
