import styles from "./resources.module.css";

type EngineeringPublicationCoverProps = {
  title: string;
  size: "card" | "hero";
};

/** Exact Entimema mark geometry, recoloured for the Engineering publication imprint. */
function EngineeringMark() {
  return (
    <svg className={styles.engineeringMark} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="58" height="58" rx="14" fill="currentColor" />
      <path d="M18 18h28v6H25v8h17v6H25v8h21v6H18V38h-6v-6h6V18Z" fill="#071b52" />
    </svg>
  );
}

export default function EngineeringPublicationCover({ title, size }: EngineeringPublicationCoverProps) {
  return (
    <div className={`${styles.engineeringCover} ${size === "hero" ? styles.engineeringHeroCover : styles.engineeringCardCover}`}>
      {size === "hero" ? <p className={styles.engineeringDiscipline}>Engineering &amp; Research</p> : null}
      {size === "hero"
        ? <h1 className={styles.engineeringCoverTitle}>{title}</h1>
        : <p className={styles.engineeringCoverCardTitle}>{title}</p>}
      <EngineeringMark />
    </div>
  );
}
