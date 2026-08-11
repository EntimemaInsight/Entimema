import type { CSSProperties } from "react";
import styles from "./financial-data.module.css";

const metrics = [
  ["Connected Sources", "12 / 12", "All synchronised"],
  ["Data Quality", "99.4%", "+0.8 pts"],
  ["Automation Rate", "94%", "18 active processes"],
  ["Validation Status", "Passed", "Last run 08:42"],
];

export default function FinancialDataDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Demonstration dashboard for financial data reliability and integration">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>FINANCIAL DATA FOUNDATION</span><h2>Data Reliability Control</h2></div><span className={styles.demoBadge}>Illustrative data</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note], index) => <div className={`${styles.metric} ${index === 1 || index === 3 ? styles.metricPrimary : ""}`} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.charts}>
        <section className={`${styles.chartPanel} ${styles.flowPanel}`} aria-labelledby="data-flow-title"><div className={styles.chartHeading}><div><span>Data Lineage</span><h3 id="data-flow-title">Integrated Financial Flow</h3></div></div><div className={styles.dataFlow} aria-label="ERP source mapped through the financial model to finance output"><span><small>Source</small>ERP</span><i aria-hidden="true" /><span><small>Transform</small>Model</span><i aria-hidden="true" /><span><small>Output</small>Finance</span></div></section>
        <section className={styles.cashPanel} aria-labelledby="source-mapping-title"><div className={styles.chartHeading}><div><span>Source Alignment</span><h3 id="source-mapping-title">Mapped Structures</h3></div></div><div className={styles.mappingList}>{[["Chart of Accounts", "100%"], ["Cost Centres", "98%"], ["Entities", "100%"]].map(([label, width]) => <div className={styles.mappingRow} key={label}><span>{label}</span><span className={styles.mappingTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{width}</strong></div>)}</div></section>
        <section className={styles.chartPanel} aria-labelledby="validation-results-title"><div className={styles.chartHeading}><div><span>Validation Results</span><h3 id="validation-results-title">Control Checks</h3></div></div><div className={styles.validationList}>{[["Completeness", "Passed"], ["Consistency", "Passed"], ["Reconciliation", "Passed"]].map(([label, status]) => <div key={label}><span>{label}</span><strong><i />{status}</strong></div>)}</div></section>
        <section className={styles.cashPanel} aria-labelledby="integration-status-title"><div className={styles.chartHeading}><div><span>Integration Status</span><h3 id="integration-status-title">Connected Systems</h3></div></div><div className={styles.systemList}>{["ERP Core", "Planning", "Reporting", "Master Data"].map((system) => <div key={system}><i /><span>{system}</span><strong>Active</strong></div>)}</div></section>
      </div>
    </div>
  );
}
