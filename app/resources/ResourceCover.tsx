import Image from "next/image";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };

export default function ResourceCover({ cover }: ResourceCoverProps) {
  const isPhotography = cover.type === "photography";

  return (
    <div
      className={`${styles.resourceCover} ${styles.imageCover} ${isPhotography ? styles.photoCover : styles.editorialCover}`}
      data-motion={cover.motion ?? "none"}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes="(max-width: 800px) 100vw, 50vw"
        style={{ objectPosition: cover.focalPoint ?? "50% 50%" }}
      />
      {isPhotography ? <span className={styles.imageWash} aria-hidden="true" /> : null}
    </div>
  );
}
