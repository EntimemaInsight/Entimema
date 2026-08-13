import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };
type ArtworkCover = Extract<ResourceCoverModel, { type: "custom-artwork" }>;

const numberedStyle = (index: number) => ({
  "--i": index,
  "--mod3": index % 3,
  "--mod4": index % 4,
  "--mod5": index % 5,
  "--mod6": index % 6,
} as CSSProperties);
const fragmentStyle = (index: number) => ({
  "--i": index,
  "--column": index % 7,
  "--row": Math.floor(index / 7),
} as CSSProperties);

function ManufacturingSculpture() {
  return <div className={styles.manufacturingArtwork}>
    <span className={styles.coverKicker}>A study in value</span>
    <div className={styles.sculpture} aria-hidden="true">
      <i /><i /><i /><i />
      <b /><b />
    </div>
    <strong className={styles.manufacturingWord}>MATERIAL<br /><em>MATTERS</em></strong>
    <span className={styles.coverFolio}>ENT / 01</span>
  </div>;
}

function LiquidityType() {
  return <div className={styles.liquidityArtwork}>
    <span className={styles.coverKicker}>Working capital</span>
    <div className={styles.liquidityOrb} aria-hidden="true"><i /><i /><i /></div>
    <strong className={styles.cashWord}>CASH</strong>
    <span className={styles.liquidityAside}>motion<br />held<br />in balance</span>
    <span className={styles.coverFolio}>ENT / 02</span>
  </div>;
}

function ForecastFutures() {
  return <div className={styles.forecastArtwork}>
    <span className={styles.coverKicker}>Observed / Possible</span>
    <strong className={styles.futureWord}>FUTURES</strong>
    <div className={styles.scenarioFan} aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => <i key={index} style={numberedStyle(index)} />)}
      <b />
    </div>
    <span className={styles.forecastNote}>The decision exists<br />before the outcome.</span>
    <span className={styles.coverFolio}>ENT / 03</span>
  </div>;
}

function VintageCohorts() {
  return <div className={styles.vintageArtwork}>
    <span className={styles.coverKicker}>Credit / time</span>
    <strong className={styles.vintageWord}>VINTAGE</strong>
    <div className={styles.cohortField} aria-hidden="true">
      {Array.from({ length: 42 }, (_, index) => <i key={index} style={numberedStyle(index)} />)}
    </div>
    <span className={styles.vintageIndex}>08<br /><small>cohorts</small></span>
    <span className={styles.coverFolio}>ENT / 04</span>
  </div>;
}

function IntelligenceFragments() {
  return <div className={styles.intelligenceArtwork}>
    <span className={styles.coverKicker}>Transactions become meaning</span>
    <div className={styles.fragmentField} aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => <i key={index} style={fragmentStyle(index)} />)}
    </div>
    <strong className={styles.signalWord}>SIGNAL</strong>
    <span className={styles.intelligenceNote}>From noise,<br />a decision surface.</span>
    <span className={styles.coverFolio}>ENT / 05</span>
  </div>;
}

const artwork: Record<ArtworkCover["variant"], ReactNode> = {
  "manufacturing-cost": <ManufacturingSculpture />,
  "working-capital": <LiquidityType />,
  "operational-forecast": <ForecastFutures />,
  "credit-vintage": <VintageCohorts />,
  "erp-intelligence": <IntelligenceFragments />,
};

const variantClasses: Record<ArtworkCover["variant"], string> = {
  "manufacturing-cost": styles.coverManufacturingCost,
  "working-capital": styles.coverWorkingCapital,
  "operational-forecast": styles.coverOperationalForecast,
  "credit-vintage": styles.coverCreditVintage,
  "erp-intelligence": styles.coverErpIntelligence,
};

export default function ResourceCover({ cover }: ResourceCoverProps) {
  if (cover.type === "image" || cover.type === "photography") return (
    <div className={`${styles.resourceCover} ${styles.imageCover} ${cover.type === "photography" ? styles.photoCover : ""}`} data-motion={cover.motion ?? "none"}>
      <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: cover.focalPoint ?? "50% 50%" }} />
      <span className={styles.imageWash} aria-hidden="true" />
    </div>
  );

  return <div
    className={`${styles.resourceCover} ${variantClasses[cover.variant]}`}
    data-motion={cover.motion ?? "none"}
    role="img"
    aria-label={cover.accessibleLabel}
  >{artwork[cover.variant]}</div>;
}
