import Image from "next/image";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = {
  cover: ResourceCoverModel;
  featured?: boolean;
};

export default function ResourceCover({ cover, featured = false }: ResourceCoverProps) {
  if (cover.type === "generated-matrix") {
    return <div className={`${styles.resourceCover} ${styles.generatedMatrixCover} ${featured ? styles.featuredArtwork : ""}`} role="img" aria-label={cover.alt}>
      <span className={styles.generatedCoverLabel}>{cover.label ?? "PORTFOLIO MIGRATION / t → t+1"}</span>
      <div className={styles.generatedCoverGrid} aria-hidden="true">{cover.stages.map((stage, index) => <span key={stage} data-index={index}><b>{stage}</b><i>{index === cover.stages.length - 1 ? "ABSORB" : index === 0 ? "STABLE" : "FLOW"}</i></span>)}</div>
      <strong className={styles.generatedCoverTitle}>{cover.title ?? "STATE × TRANSITION"}</strong>
    </div>;
  }
  const isPhotography = cover.type === "photography";

  return (
    <div
      className={`${styles.resourceCover} ${styles.imageCover} ${featured ? styles.featuredArtwork : ""} ${isPhotography ? styles.photoCover : styles.editorialCover}`}
      data-motion={cover.motion ?? "none"}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={featured ? "(max-width: 800px) calc(100vw - 48px), (max-width: 1400px) calc(100vw - 96px), 1280px" : "(max-width: 800px) 100vw, 50vw"}
        quality={90}
        loading={featured ? "eager" : "lazy"}
        style={{ objectPosition: cover.focalPoint ?? "50% 50%" }}
      />
      {isPhotography ? <span className={styles.imageWash} aria-hidden="true" /> : null}
    </div>
  );
}
