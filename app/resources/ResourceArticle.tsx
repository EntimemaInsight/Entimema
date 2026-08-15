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
import ResourceCard from "./ResourceCard";
import ResourceSemanticText from "./ResourceSemanticText";

export type ArticleSection = { id: string; label: string };

export default function ResourceArticle({ resource, sections, children }: { resource: ResourceRecord; sections?: ArticleSection[]; children: ReactNode }) {
  const topic = getTopic(resource.topic);
  const published = resource.publishedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(resource.publishedAt)) : null;
  const relatedResources = getPublishedRelatedResources(resource);

  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar active="resources" />
      <ResourceViewAnalytics resourceSlug={resource.slug} resourceTitle={resource.headline} resourceTopic={topic?.label ?? resource.topic} />
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.readingContainer}>
            <div className={styles.articleMeta}><span>{topic?.label}</span><span>{resource.readingMinutes} min read</span></div>
            <h1><ResourceSemanticText text={resource.headline} emphasis={resource.headlineEmphasis} className={styles.headlineEmphasis} /></h1>
            <p className={styles.deck}><ResourceSemanticText text={resource.slogan} emphasis={resource.sloganEmphasis} className={styles.sloganEmphasis} /></p>
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
            {relatedResources.map((relatedResource) => <ResourceCard key={relatedResource.slug} resource={relatedResource} />)}
          </div>
        </div>
      ) : null}
    </main>
  );
}
