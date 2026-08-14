import Image from "next/image";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = {
  cover: ResourceCoverModel;
  featured?: boolean;
};

export default function ResourceCover({ cover, featured = false }: ResourceCoverProps) {
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
