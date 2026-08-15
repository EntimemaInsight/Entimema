import Link from "next/link";
import ResourceCover from "./ResourceCover";
import ResourceSemanticText from "./ResourceSemanticText";
import { getTopic, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";

const formatDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${publishedAt}T00:00:00Z`));

export default function ResourceCard({ resource }: { resource: ResourceRecord & { publishedAt: string } }) {
  return (
    <article className={styles.resourceCard}>
      <Link className={styles.resourceCardLink} href={resource.canonicalPath}>
        <ResourceCover cover={resource.cover} />
        <div className={styles.cardMeta}><span>{getTopic(resource.topic)?.label}</span><span>{resource.readingMinutes} MIN READ</span></div>
        <h3><ResourceSemanticText text={resource.headline} emphasis={resource.headlineEmphasis} className={styles.headlineEmphasis} /></h3>
        <p>{resource.slogan}</p>
        <div className={styles.cardFooter}><time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time></div>
      </Link>
    </article>
  );
}
