import Link from "next/link";
import ResourceCover from "./ResourceCover";
import ResourceSemanticText from "./ResourceSemanticText";
import { getTopic, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";
import EngineeringPublicationCover from "./EngineeringPublicationCover";

const formatDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${publishedAt}T00:00:00Z`));

export default function ResourceCard({ resource }: { resource: ResourceRecord & { publishedAt: string } }) {
  const isEngineering = resource.stream === "engineering";

  return (
    <article className={`${styles.resourceCard} ${isEngineering ? styles.engineeringResourceCard : ""}`}>
      <Link className={styles.resourceCardLink} href={resource.canonicalPath}>
        {isEngineering ? <EngineeringPublicationCover title={resource.technicalTitle} size="card" /> : <ResourceCover cover={resource.cover} />}
        {isEngineering ? (
          <div className={styles.engineeringCardMeta}>
            <time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{resource.readingMinutes} min read</span>
          </div>
        ) : <div className={styles.cardMeta}><span>{getTopic(resource.topic)?.label}</span><span>{resource.readingMinutes} MIN READ</span></div>}
        <h3>{isEngineering ? resource.headline : <ResourceSemanticText text={resource.headline} emphasis={resource.headlineEmphasis} className={styles.headlineEmphasis} />}</h3>
        <p>{resource.slogan}</p>
        {isEngineering ? <span className={styles.readArticle}>Read article <b aria-hidden="true">→</b></span> : <div className={styles.cardFooter}><time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time></div>}
      </Link>
    </article>
  );
}
