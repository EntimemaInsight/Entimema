import type { CSSProperties } from "react";
import styles from "./budgets-and-forecasting.module.css";

const metrics = [
  ["Прогноза за приходите", "€1.38m", "+6.2% спрямо бюджета"],
  ["Прогноза за EBITDA", "€214k", "15.5% марж"],
  ["Крайна парична наличност", "€326k", "+€48k спрямо базата"],
  ["Точност на прогнозата", "94.2%", "+2.8 т."],
];

const drivers = [
  ["Volume", "86%", "+8.4%"],
  ["Price", "68%", "+3.1%"],
  ["Mix", "52%", "+1.7%"],
];

export default function PlanningDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Демонстрационно табло за финансово планиране">
      <div className={styles.dashboardTop}>
        <div><span className={styles.dashboardEyebrow}>Среда за планиране</span><h2>Преглед на прогнозата</h2></div>
        <span className={styles.demoBadge}>Базов сценарий</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="plan-chart-title">
          <div className={styles.chartHeading}>
            <div><span>План за представянето</span><h3 id="plan-chart-title">Реално спрямо бюджет и прогноза</h3></div>
            <div className={styles.legend}><i />Реално <i />Прогноза</div>
          </div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Фактически резултат, бюджет и прогноза за шест месеца">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 118C70 104 100 96 145 88S230 72 275 64S354 52 408 39" />
            <path className={styles.forecastLine} strokeDasharray="2 7" d="M12 123C62 112 105 105 145 96S224 78 275 72S348 57 408 49" />
            <path className={styles.actualLine} d="M12 126C61 116 103 101 145 104S220 80 275 77" />
          </svg>
          <div className={styles.axis}><span>яну</span><span>фев</span><span>мар</span><span>апр</span><span>май</span><span>юни</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="cash-outlook-title">
          <div className={styles.chartHeading}><div><span>План за ликвидността</span><h3 id="cash-outlook-title">Прогноза за паричните потоци</h3></div></div>
          <div className={styles.bars} aria-label="Прогноза за паричните наличности за шест месеца">{[46, 59, 54, 70, 77, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          <div className={styles.axis}><span>юли</span><span>авг</span><span>сеп</span><span>окт</span><span>ное</span><span>дек</span></div>
        </section>
        <section className={styles.chartPanel} aria-labelledby="scenario-title">
          <div className={styles.chartHeading}><div><span>Сценариен анализ</span><h3 id="scenario-title">Сравнение на сценарии</h3></div></div>
          <div className={styles.scenarioBars} aria-label="Сравнение между негативен, базов и позитивен сценарий">
            {[48, 61, 74, 55, 69, 82, 62, 76, 91].map((height, index) => <span key={index} style={{ "--height": `${height}%` } as CSSProperties} />)}
          </div>
          <div className={styles.axis}><span>Негативен</span><span>Базов</span><span>Позитивен</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="drivers-title">
          <div className={styles.chartHeading}><div><span>Драйверен модел</span><h3 id="drivers-title">Драйвери на приходите</h3></div></div>
          <div className={styles.driverList}>{drivers.map(([label, width, value]) => <div className={styles.driverRow} key={label}><span>{label}</span><span className={styles.driverTrack}><i style={{ "--width": width } as CSSProperties} /></span><strong>{value}</strong></div>)}</div>
        </section>
      </div>
    </div>
  );
}
