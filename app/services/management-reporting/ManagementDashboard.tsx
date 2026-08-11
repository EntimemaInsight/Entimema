import type { CSSProperties } from "react";
import styles from "./management-reporting.module.css";

const metrics = [
  ["Revenue", "€1.42m", "+7.8% year on year"],
  ["EBITDA", "€226k", "15.9% margin"],
  ["Operating Margin", "12.6%", "+1.4 pts"],
  ["Working Capital", "€318k", "22.4% of revenue"],
];

const units = [
  ["Industrial", "84%", "18%"],
  ["Services", "68%", "14%"],
  ["Retail", "52%", "11%"],
];

export default function ManagementDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Demonstration management reporting dashboard">
      <div className={styles.dashboardTop}>
        <div><span className={styles.dashboardEyebrow}>MANAGEMENT INFORMATION</span><h2>Management View</h2></div>
        <span className={styles.demoBadge}>Illustrative data</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note], index) => <div className={`${styles.metric} ${index === 0 || index === 3 ? styles.metricPrimary : ""}`} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className={styles.charts}>
        <section className={`${styles.chartPanel} ${styles.attentionPanel}`} aria-labelledby="revenue-trend-title">
          <div className={styles.chartHeading}><div><span>Growth</span><h3 id="revenue-trend-title">Revenue Trend</h3></div><div className={styles.legend}><i />Actual <i />Budget</div></div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Revenue trend against budget over six months">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 119C66 109 102 99 145 91S228 76 275 67S352 55 408 43" />
            <path className={styles.actualLine} d="M12 126C60 117 101 108 145 102S226 82 275 86S349 51 408 35" />
          </svg>
          <div className={styles.axis}><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="ebitda-trend-title">
          <div className={styles.chartHeading}><div><span>Profit</span><h3 id="ebitda-trend-title">EBITDA Trend</h3></div></div>
          <div className={styles.bars} aria-label="Rising EBITDA trend over six months">{[42, 54, 49, 66, 74, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          <div className={styles.axis}><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </section>
        <section className={styles.chartPanel} aria-labelledby="profitability-title">
          <div className={styles.chartHeading}><div><span>Business Units</span><h3 id="profitability-title">Profitability by Business Unit</h3></div></div>
          <div className={styles.unitBars}>{units.map(([label, width, value]) => <div className={styles.unitRow} key={label}><span>{label}</span><span className={styles.unitTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="working-capital-title">
          <div className={styles.chartHeading}><div><span>Cash Discipline</span><h3 id="working-capital-title">Working Capital Movement</h3></div></div>
          <div className={styles.movement} aria-label="Working capital movement by component">{[["AR", "76%"], ["Stock", "61%"], ["AP", "48%"], ["Net", "69%"]].map(([label, height]) => <span key={label} style={{ "--height": height } as CSSProperties}>{label}</span>)}</div>
        </section>
      </div>
    </div>
  );
}
