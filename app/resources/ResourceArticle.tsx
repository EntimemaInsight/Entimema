import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getPublishedRelatedResources, getTopic, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";
import { ResourceViewAnalytics } from "@/components/ResourceAnalytics";
import ResourceCover from "./ResourceCover";
import ArticleContents from "./ArticleContents";
import BrandLogo from "@/components/BrandLogo";

export type ArticleSection = { id: string; label: string };

export default function ResourceArticle({ resource, sections, children }: { resource: ResourceRecord; sections?: ArticleSection[]; children: ReactNode }) {
  const topic = getTopic(resource.topic);
  const published = resource.publishedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(resource.publishedAt)) : null;
  const relatedResources = getPublishedRelatedResources(resource);

  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar active="resources" />
      <ResourceViewAnalytics resourceSlug={resource.slug} resourceTitle={resource.title} resourceTopic={topic?.label ?? resource.topic} />
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.readingContainer}>
            <div className={styles.articleMeta}><span>{topic?.label}</span><span>{resource.readingMinutes} min read</span></div>
            <h1>{resource.title}</h1>
            <p className={styles.deck}>{resource.deck}</p>
            <div className={styles.publicationIdentity}>
              <Link className={styles.publicationLink} href="/resources/entimema" aria-label="Entimema publication profile">
                <BrandLogo compact />
              </Link>
              {published ? <time dateTime={resource.publishedAt}>{published}</time> : null}
            </div>
          </div>
        </header>

        <div className={styles.articleCover}><ResourceCover cover={resource.cover} featured /></div>

        <div className={styles.articleLayout}>
          {sections && sections.length > 2 ? <ArticleContents sections={sections} /> : null}
          <div className={styles.prose}>{children}</div>
        </div>
      </article>

      {relatedResources.length ? (
        <div className={styles.articleContinuation}>
          <div className={styles.resourceGrid}>
            {relatedResources.map((relatedResource) => {
              const relatedTopic = getTopic(relatedResource.topic);
              const relatedPublished = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${relatedResource.publishedAt}T00:00:00Z`));

              return (
                <article className={styles.resourceCard} key={relatedResource.slug}>
                  <Link className={styles.coverLink} href={relatedResource.canonicalPath} aria-label={`Read ${relatedResource.title}`}>
                    <ResourceCover cover={relatedResource.cover} />
                  </Link>
                  <div className={styles.cardMeta}><span>{relatedTopic?.label}</span><span>{relatedResource.readingMinutes} MIN READ</span></div>
                  <h3><Link href={relatedResource.canonicalPath}>{relatedResource.title}</Link></h3>
                  <p>{relatedResource.deck}</p>
                  <div className={styles.cardFooter}>
                    <time dateTime={relatedResource.publishedAt}>{relatedPublished}</time>
                    <Link href={relatedResource.canonicalPath}>Read analysis <b aria-hidden="true">→</b></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </main>
  );
}
