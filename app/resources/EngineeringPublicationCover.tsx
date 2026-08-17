import styles from "./resources.module.css";

type EngineeringPublicationCoverProps = {
  title: string;
  size: "card" | "hero";
};

export default function EngineeringPublicationCover({ title, size }: EngineeringPublicationCoverProps) {
  // Article covers retain their established responsive treatment. Card covers,
  // however, deliberately have no content-dependent presentation: every title
  // is rendered by the single Engineering card typography rule.
  const heroTitleLength = size === "hero" ? Array.from(title.trim()).length : 0;
  const heroTitleDensity = heroTitleLength > 76
    ? styles.engineeringHeroTitleVeryLong
    : heroTitleLength > 52
      ? styles.engineeringHeroTitleLong
      : "";

  return (
    <div className={`${styles.engineeringCover} ${size === "hero" ? styles.engineeringHeroCover : styles.engineeringCardCover} ${heroTitleDensity}`}>
      {size === "hero"
        ? <h1 className={styles.engineeringCoverTitle}>{title}</h1>
        : <p className={styles.engineeringCoverCardTitle}>{title}</p>}
      <span className={styles.engineeringBrand}>
        <svg className={styles.engineeringBrandMark} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M18 18h28v6H25v8h17v6H25v8h21v6H18V38h-6v-6h6V18Z" />
        </svg>
        <span className={styles.engineeringWordmark}>Entimema</span>
      </span>
    </div>
  );
}
