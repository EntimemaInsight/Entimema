import BrandLogo from "@/components/BrandLogo";
import styles from "./resources.module.css";

type EngineeringPublicationCoverProps = {
  title: string;
  size: "card" | "hero";
};

export default function EngineeringPublicationCover({ title, size }: EngineeringPublicationCoverProps) {
  const hasLongScorecardTitle = title === "Logistic Regression for Credit Risk Scorecards: From Risk Drivers to Probability of Default";

  return (
    <div className={`${styles.engineeringCover} ${size === "hero" ? styles.engineeringHeroCover : styles.engineeringCardCover} ${hasLongScorecardTitle ? styles.engineeringLongTitle : ""}`}>
      {size === "hero" ? <p className={styles.engineeringDiscipline}>Engineering &amp; Research</p> : null}
      {size === "hero"
        ? <h1 className={styles.engineeringCoverTitle}>{title}</h1>
        : <p className={styles.engineeringCoverCardTitle}>{title}</p>}
      <span className={styles.engineeringBrand}>
        <BrandLogo compact reversed />
      </span>
    </div>
  );
}
