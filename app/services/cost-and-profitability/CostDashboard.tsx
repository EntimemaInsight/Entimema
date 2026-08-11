import type { CSSProperties } from "react";
import styles from "./cost-and-profitability.module.css";

const metrics = [
  ["Gross Margin", "38.4%", "+2.1 pts"],
  ["Contribution Margin", "24.7%", "+1.3 pts"],
  ["Operating Margin", "13.2%", "+0.8 pts"],
  ["Unit Cost", "€18.40", "−4.6%"],
];

export default function CostDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Demonstration cost and profitability dashboard">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>BUSINESS ECONOMICS</span><h2>Profitability Overview</h2></div><span className={styles.demoBadge}>Illustrative data</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note], index) => <div className={`${styles.metric} ${index === 0 || index === 3 ? styles.metricPrimary : ""}`} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="product-profitability"><div className={styles.chartHeading}><div><span>Products</span><h3 id="product-profitability">Product Profitability</h3></div></div><div className={styles.productBars}>{[["Alpha", "86%", "31%"], ["Beta", "64%", "22%"], ["Gamma", "47%", "16%"]].map(([label, width, value]) => <div className={styles.productRow} key={label}><span>{label}</span><span className={styles.productTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div></section>
        <section className={`${styles.cashPanel} ${styles.economicBridge}`} aria-labelledby="margin-waterfall"><div className={styles.chartHeading}><div><span>Margin Movement</span><h3 id="margin-waterfall">Margin Variance Analysis</h3></div></div><div className={styles.waterfall} aria-label="Revenue to EBIT economic bridge">{[["Revenue", "92%"], ["COGS", "63%"], ["Gross Profit", "72%"], ["Opex", "42%"], ["EBIT", "55%"]].map(([label, height]) => <span key={label} style={{ "--height": height } as CSSProperties}>{label}</span>)}</div></section>
        <section className={styles.chartPanel} aria-labelledby="cost-structure"><div className={styles.chartHeading}><div><span>Cost Drivers</span><h3 id="cost-structure">Cost Structure</h3></div></div><div className={styles.costBars}>{[["Materials", "78%", "46%"], ["Labour", "48%", "28%"], ["Overheads", "31%", "18%"]].map(([label, width, value]) => <div className={styles.costRow} key={label}><span>{label}</span><span className={styles.costTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div></section>
        <section className={styles.cashPanel} aria-labelledby="contribution-analysis"><div className={styles.chartHeading}><div><span>Value Creation</span><h3 id="contribution-analysis">Contribution Analysis</h3></div></div><div className={styles.contribution}>{[["A", "86%"], ["B", "68%"], ["C", "44%"], ["D", "57%"]].map(([label, height]) => <span key={label} style={{ "--height": height } as CSSProperties}>{label}</span>)}</div></section>
      </div>
    </div>
  );
}
