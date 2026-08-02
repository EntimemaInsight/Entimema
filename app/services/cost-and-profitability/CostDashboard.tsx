import type { CSSProperties } from "react";
import styles from "./cost-and-profitability.module.css";

const metrics = [
  ["Gross Margin", "38.4%", "+2.1 pts"],
  ["Contribution Margin", "24.7%", "+1.3 pts"],
  ["Operating Margin", "13.2%", "+0.8 pts"],
  ["Cost per Unit", "€18.40", "−4.6%"],
];

export default function CostDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационно табло за себестойност и рентабилност">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>Business economics</span><h2>Profitability Overview</h2></div><span className={styles.demoBadge}>Current period</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="product-profitability"><div className={styles.chartHeading}><div><span>Products</span><h3 id="product-profitability">Profitability by Product</h3></div></div><div className={styles.productBars}>{[["Alpha", "86%", "31%"], ["Beta", "64%", "22%"], ["Gamma", "47%", "16%"]].map(([label, width, value]) => <div className={styles.productRow} key={label}><span>{label}</span><span className={styles.productTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div></section>
        <section className={styles.cashPanel} aria-labelledby="margin-waterfall"><div className={styles.chartHeading}><div><span>Margin bridge</span><h3 id="margin-waterfall">Margin Waterfall</h3></div></div><div className={styles.waterfall}>{[["Revenue", "92%"], ["COGS", "63%"], ["Gross", "72%"], ["Opex", "42%"], ["EBIT", "55%"]].map(([label, height]) => <span key={label} style={{ "--height": height } as CSSProperties}>{label}</span>)}</div></section>
        <section className={styles.chartPanel} aria-labelledby="cost-structure"><div className={styles.chartHeading}><div><span>Cost drivers</span><h3 id="cost-structure">Cost Structure</h3></div></div><div className={styles.costBars}>{[["Material", "78%", "46%"], ["Labour", "48%", "28%"], ["Overhead", "31%", "18%"]].map(([label, width, value]) => <div className={styles.costRow} key={label}><span>{label}</span><span className={styles.costTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div></section>
        <section className={styles.cashPanel} aria-labelledby="contribution-analysis"><div className={styles.chartHeading}><div><span>Value creation</span><h3 id="contribution-analysis">Contribution Analysis</h3></div></div><div className={styles.contribution}>{[["A", "86%"], ["B", "68%"], ["C", "44%"], ["D", "57%"]].map(([label, height]) => <span key={label} style={{ "--height": height } as CSSProperties}>{label}</span>)}</div></section>
      </div>
    </div>
  );
}
