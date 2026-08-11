import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };

export default function ResourceCover({ cover }: ResourceCoverProps) {
  return (
    <div
      className={`${styles.resourceCover} ${styles[`cover_${cover.variant}`]}`}
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
