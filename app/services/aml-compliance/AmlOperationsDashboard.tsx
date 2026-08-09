import type { CSSProperties } from "react";
import styles from "../credit-risk/credit-risk.module.css";

const metrics = [
  ["Сигнали днес", "148", "+12 спрямо средното"],
  ["Клиенти с висок риск", "327", "2.8% от базата"],
  ["Дял фалшиви сигнали", "18.6%", "−4.2 т."],
  ["Отворени разследвания", "42", "9 с висок приоритет"],
];

export default function AmlOperationsDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Табло за AML операции">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>AML платформа</span><h2>AML операции</h2></div><span className={styles.demoBadge}>Активни контроли</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.riskGrid}>
        <section className={styles.chartPanel} aria-labelledby="alert-trend-title"><div className={styles.chartHeading}><div><span>Мониторинг</span><h3 id="alert-trend-title">Динамика на сигналите</h3></div><span className={styles.miniLegend}>30 дни</span></div><svg className={styles.lineChart} viewBox="0 0 420 135" role="img" aria-label="Тенденция на AML сигналите"><g className={styles.gridLines}><path d="M10 25H410M10 67H410M10 109H410" /></g><path className={styles.actualLine} d="M12 96C48 88 76 104 112 77S177 83 214 56S283 65 320 42S373 48 408 25"/><path className={styles.forecastLine} d="M12 111C55 105 89 99 125 94S190 82 230 78S302 66 342 62S383 55 408 50"/></svg></section>
        <section className={styles.matrixPanel} aria-labelledby="risk-distribution-title"><div className={styles.chartHeading}><div><span>Клиентски риск</span><h3 id="risk-distribution-title">Разпределение на риска</h3></div></div><div className={styles.matrix}>{[12, 18, 7, 24, 31, 15, 38, 62, 89].map((value, index) => <i key={index} style={{ "--alpha": `${Math.max(value, 8) / 100}` } as CSSProperties}>{value}%</i>)}</div></section>
        <section className={styles.funnelPanel} aria-labelledby="cases-status-title"><div className={styles.chartHeading}><div><span>Разследвания</span><h3 id="cases-status-title">Случаи по статус</h3></div></div><div className={styles.funnel}>{[["Нови", "100%"], ["За преглед", "74%"], ["Ескалирани", "39%"], ["Подадени", "18%"]].map(([label, width]) => <div key={label}><span>{label}</span><i style={{ "--width": width } as CSSProperties} /><b>{width}</b></div>)}</div></section>
        <section className={styles.strategyPanel} aria-labelledby="escalation-flow-title"><div className={styles.chartHeading}><div><span>Case Management</span><h3 id="escalation-flow-title">Процес на ескалация</h3></div></div><div className={styles.strategyScore}><strong>4.2ч</strong><span>медианно време за преглед</span></div><div className={styles.scoreBands}>{[["L1", "92%"], ["L2", "61%"], ["MLRO", "24%"], ["SAR", "11%"]].map(([label, width]) => <div key={label}><span>{label}</span><i><b style={{ "--width": width } as CSSProperties}/></i><small>{width}</small></div>)}</div></section>
      </div>
      <div className={styles.dashboardFooter} aria-label="Хронология на подозрителната активност"><span>Открит сигнал</span><span>Преглед от анализатор</span><span>Ескалация към MLRO</span><span>Регулаторно подаване</span></div>
    </div>
  );
}
