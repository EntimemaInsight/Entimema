import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };

export default function ResourceCover({ cover }: ResourceCoverProps) {
  if (cover.variant === "credit-vintage") return (
    <div className={`${styles.resourceCover} ${styles.cover_creditVintage}`} role="img" aria-label={cover.accessibleLabel}>
      <div className={styles.coverHeader} aria-hidden="true"><span>ENTIMEMA FRAMEWORK 04</span><span>CREDIT VINTAGE ARCHITECTURE</span></div>
      <div className={styles.vintageCover} aria-hidden="true"><span>PERFORMANCE</span><svg viewBox="0 0 360 180" preserveAspectRatio="none"><path d="M20 140 L125 105 L230 78 L335 64"/><path d="M20 136 L125 101 L230 70 L335 54"/><path d="M20 128 L125 82 L230 42 L335 18"/><path d="M20 116 L125 68 L230 24"/></svg><div><small>JAN</small><small>FEB</small><small>MAR</small><small>APR</small></div></div>
      <div className={styles.coverFooter} aria-hidden="true"><span>COHORT / MOB</span><i /><span>RISK SIGNAL</span></div>
    </div>
  );
  if (cover.variant === "operational-forecast") return (
    <div className={`${styles.resourceCover} ${styles.cover_operationalForecast}`} role="img" aria-label={cover.accessibleLabel}>
      <div className={styles.coverHeader} aria-hidden="true"><span>ENTIMEMA FRAMEWORK 03</span><span>OPERATIONAL-DRIVER FORECASTING</span></div>
      <div className={styles.forecastCover} aria-hidden="true">{cover.stages.map((stage, index) => <span key={stage}><i>{String(index + 1).padStart(2, "0")}</i><strong>{stage}</strong></span>)}</div>
      <div className={styles.coverFooter} aria-hidden="true"><span>ASSUMPTION</span><i /><span>DECISION</span></div>
    </div>
  );
  if (cover.variant === "working-capital") return (
    <div className={`${styles.resourceCover} ${styles.cover_workingCapital}`} role="img" aria-label={cover.accessibleLabel}>
      <div className={styles.coverHeader} aria-hidden="true"><span>ENTIMEMA FRAMEWORK 02</span><span>WORKING CAPITAL SYSTEM</span></div>
      <div className={styles.workingCapitalCover} aria-hidden="true">
        <div>{cover.stages.slice(0, 3).map((stage, index) => <span key={stage}><i>{String(index + 1).padStart(2, "0")}</i><strong>{stage}</strong></span>)}</div>
        <b>→</b><strong>CASH</strong><b>→</b><strong>FINANCING</strong><b>→</b><strong>DECISION</strong>
      </div>
      <div className={styles.coverFooter} aria-hidden="true"><span>OPERATIONS</span><i /><span>CAPITAL ALLOCATION</span></div>
    </div>
  );
  return (
    <div
      className={styles.resourceCover}
      role="img"
      aria-label={cover.accessibleLabel}
    >
      <div className={styles.coverHeader} aria-hidden="true">
        <span>ENTIMEMA FRAMEWORK 01</span>
        <span>COST ARCHITECTURE</span>
      </div>
      <div className={styles.coverFlow} aria-hidden="true">
        {cover.stages.map((stage, index) => (
          <div className={styles.coverStage} key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
          </div>
        ))}
      </div>
      <div className={styles.coverFooter} aria-hidden="true">
        <span>TRANSACTION</span><i /><span>DECISION</span>
      </div>
    </div>
  );
}
