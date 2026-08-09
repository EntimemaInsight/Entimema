import type { CSSProperties } from "react";
import styles from "./credit-risk.module.css";

const metrics = [
  ["Процент на одобрение", "62.4%", "+3.1 т."],
  ["Очаквана загуба", "2.18%", "−0.27 т."],
  ["Портфейл в риск", "4.7%", "30+ DPD"],
  ["Средна PD", "3.42%", "−0.18 т."],
];

const scoreBands = [["A", "86%"], ["B", "72%"], ["C", "54%"], ["D", "31%"]];

export default function CreditRiskDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационна платформа за управление на кредитния риск">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>Платформа за кредитен риск</span><h2>Управление на портфейла</h2></div><span className={styles.demoBadge}>Активна стратегия</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.riskGrid}>
        <section className={styles.funnelPanel} aria-labelledby="funnel-title"><div className={styles.chartHeading}><div><span>Кредитиране</span><h3 id="funnel-title">Фуния на заявленията</h3></div></div><div className={styles.funnel}>{[["Заявления", "100%"], ["Допустими", "78%"], ["Одобрени", "62%"], ["Усвоени", "51%"]].map(([label, width]) => <div key={label}><span>{label}</span><i style={{ "--width": width } as CSSProperties} /><b>{width}</b></div>)}</div></section>
        <section className={styles.matrixPanel} aria-labelledby="migration-title"><div className={styles.chartHeading}><div><span>Преходи</span><h3 id="migration-title">Матрица на миграцията между DPD групите</h3></div></div><div className={styles.matrix}>{[92, 6, 2, 1, 81, 15, 0, 12, 72].map((value, index) => <i key={index} style={{ "--alpha": `${Math.max(value, 8) / 100}` } as CSSProperties}>{value}%</i>)}</div></section>
        <section className={styles.chartPanel} aria-labelledby="vintage-title"><div className={styles.chartHeading}><div><span>Портфейлен мониторинг</span><h3 id="vintage-title">Vintage криви</h3></div><span className={styles.miniLegend}>MOB 1–6</span></div><svg className={styles.lineChart} viewBox="0 0 420 135" role="img" aria-label="Сравнение на три vintage криви"><g className={styles.gridLines}><path d="M10 25H410M10 67H410M10 109H410" /></g><path className={styles.actualLine} d="M12 111C72 102 104 90 151 78S241 55 288 45S355 31 408 26"/><path className={styles.forecastLine} d="M12 116C70 111 108 101 151 91S239 72 288 63S357 53 408 47"/><path className={styles.thirdLine} d="M12 119C72 116 109 111 151 105S240 94 288 87S360 77 408 72"/></svg></section>
        <section className={styles.strategyPanel} aria-labelledby="strategy-title"><div className={styles.chartHeading}><div><span>Стратегия за вземане на решения</span><h3 id="strategy-title">Champion vs Challenger</h3></div></div><div className={styles.strategyScore}><strong>+8.4%</strong><span>одобрение, коригирано спрямо риска</span></div><div className={styles.scoreBands}>{scoreBands.map(([label, width]) => <div key={label}><span>{label}</span><i><b style={{ "--width": width } as CSSProperties}/></i><small>{width}</small></div>)}</div></section>
      </div>
      <div className={styles.dashboardFooter}><span>Разпределение на score</span><span>Разпределение на PD</span><span>Roll rates</span><span>Портфейлна сегментация</span></div>
    </div>
  );
}
