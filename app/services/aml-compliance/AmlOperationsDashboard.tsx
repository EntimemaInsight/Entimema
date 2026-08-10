import type { CSSProperties } from "react";
import styles from "../credit-risk/credit-risk.module.css";

const metrics = [
  ["Alerts Today", "148", "+12 vs average"],
  ["High-Risk Customers", "327", "2.8% of base"],
  ["False-Positive Rate", "18.6%", "−4.2 pts"],
  ["Open Investigations", "42", "9 high priority"],
];

export default function AmlOperationsDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Illustrative AML operations dashboard">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>AML PLATFORM</span><h2>AML Operations</h2></div><span className={styles.demoBadge}>Active Controls</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.riskGrid}>
        <section className={styles.chartPanel} aria-labelledby="alert-trend-title"><div className={styles.chartHeading}><div><span>MONITORING</span><h3 id="alert-trend-title">Alert Trend</h3></div><span className={styles.miniLegend}>30 DAYS</span></div><svg className={styles.lineChart} viewBox="0 0 420 135" role="img" aria-label="AML alert trend"><g className={styles.gridLines}><path d="M10 25H410M10 67H410M10 109H410" /></g><path className={styles.actualLine} d="M12 96C48 88 76 104 112 77S177 83 214 56S283 65 320 42S373 48 408 25"/><path className={styles.forecastLine} d="M12 111C55 105 89 99 125 94S190 82 230 78S302 66 342 62S383 55 408 50"/></svg></section>
        <section className={styles.matrixPanel} aria-labelledby="risk-distribution-title"><div className={styles.chartHeading}><div><span>CUSTOMER RISK</span><h3 id="risk-distribution-title">Risk Distribution</h3></div></div><div className={styles.matrix}>{[12, 18, 7, 24, 31, 15, 38, 62, 89].map((value, index) => <i key={index} style={{ "--alpha": `${Math.max(value, 8) / 100}` } as CSSProperties}>{value}%</i>)}</div></section>
        <section className={styles.funnelPanel} aria-labelledby="cases-status-title"><div className={styles.chartHeading}><div><span>INVESTIGATIONS</span><h3 id="cases-status-title">Cases by Status</h3></div></div><div className={styles.funnel}>{[["New", "100%"], ["Pending Review", "74%"], ["Escalated", "39%"], ["Filed", "18%"]].map(([label, width]) => <div key={label}><span>{label}</span><i style={{ "--width": width } as CSSProperties} /><b>{width}</b></div>)}</div></section>
        <section className={styles.strategyPanel} aria-labelledby="escalation-flow-title"><div className={styles.chartHeading}><div><span>CASE MANAGEMENT</span><h3 id="escalation-flow-title">Escalation Flow</h3></div></div><div className={styles.strategyScore}><strong>4.2h</strong><span>median review time</span></div><div className={styles.scoreBands}>{[["L1", "92%"], ["L2", "61%"], ["MLRO", "24%"], ["SAR", "11%"]].map(([label, width]) => <div key={label}><span>{label}</span><i><b style={{ "--width": width } as CSSProperties}/></i><small>{width}</small></div>)}</div></section>
      </div>
      <div className={styles.dashboardFooter} aria-label="AML case lifecycle"><span>Risk Signal Detected</span><span>Analyst Review</span><span>MLRO Escalation</span><span>Regulatory Filing</span></div>
    </div>
  );
}
