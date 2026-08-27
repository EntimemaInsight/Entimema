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
import EngineeringPublicationCover from "./EngineeringPublicationCover";
import FinancialIntelligenceSeries, { financialIntelligenceSlugs } from "./FinancialIntelligenceSeries";

export type ArticleSection = { id: string; label: string };

export default function ResourceArticle({ resource, sections, children, readingMinutes }: { resource: ResourceRecord; sections?: ArticleSection[]; children: ReactNode; readingMinutes?: number }) {
  const topic = getTopic(resource.topic);
  const relatedResources = getPublishedRelatedResources(resource);
  const isEngineering = resource.stream === "engineering";

  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar active="resources" />
      <ResourceViewAnalytics resourceSlug={resource.slug} resourceTitle={resource.headline} resourceTopic={topic?.label ?? resource.topic} />
      <article className={styles.article}>
        <header className={`${styles.articleHeader} ${isEngineering ? styles.engineeringArticleHeader : ""}`}>
          <div className={styles.readingContainer}>
            <div className={styles.articleMeta}><span>{isEngineering ? "Engineering & Research" : topic?.label}</span><span>{readingMinutes ?? resource.readingMinutes} min read</span></div>
            {!isEngineering ? <h1><ResourceSemanticText text={resource.headline} emphasis={resource.headlineEmphasis} className={styles.headlineEmphasis} /></h1> : null}
            <div className={styles.publicationIdentity}>
              <Link className={styles.publicationLink} href="/about#founder" aria-label={`${resource.author.name}, founder of Entimema`}>
                <BrandLogo compact />
              </Link>
            </div>
          </div>
        </header>

        <div className={`${styles.articleCover} ${isEngineering ? styles.engineeringArticleCover : ""}`}>
          {isEngineering ? <EngineeringPublicationCover title={resource.technicalTitle} size="hero" /> : <ResourceCover cover={resource.cover} featured />}
        </div>

        <div className={styles.articleLayout}>
          {sections && sections.length > 2 ? <ArticleContents sections={sections} /> : null}
          <div className={styles.prose}>{children}</div>
        </div>
        {financialIntelligenceSlugs.has(resource.slug) ? <FinancialIntelligenceSeries currentSlug={resource.slug} /> : null}
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
