import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getPublishedRelatedResources, getTopic, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";
import { ResourceViewAnalytics } from "@/components/ResourceAnalytics";
import ResourceCover from "./ResourceCover";
import ArticleContents from "./ArticleContents";
import PublisherIdentity from "./PublisherIdentity";
import ResourceCard from "./ResourceCard";
import ResourceSemanticText from "./ResourceSemanticText";
import EngineeringPublicationCover from "./EngineeringPublicationCover";
import FinancialIntelligenceSeries, { financialIntelligenceSlugs } from "./FinancialIntelligenceSeries";
import ResearchAuthorityPath from "./ResearchAuthorityPath";
import ArticleUtilities from "./ArticleUtilities";
import EditorialSubscription from "./EditorialSubscription";

export type ArticleSection = { id: string; label: string };

export default function ResourceArticle({ resource, sections, children, readingMinutes }: { resource: ResourceRecord; sections?: ArticleSection[]; children: ReactNode; readingMinutes?: number }) {
  const topic = getTopic(resource.topic);
  const relatedResources = getPublishedRelatedResources(resource);
  const isEngineering = resource.stream === "engineering";
  const isInsights = resource.stream === "insights";
  const articleBodyId = `article-body-${resource.slug}`;

  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar active="resources" />
      <ResourceViewAnalytics resourceSlug={resource.slug} resourceTitle={resource.headline} resourceTopic={topic?.label ?? resource.topic} />
      <article className={`${styles.article} ${isInsights ? styles.fir15Editorial : ""} ${isEngineering ? styles.engineeringEditorial : ""}`}>
        <header className={`${styles.articleHeader} ${isEngineering ? styles.engineeringArticleHeader : ""}`}>
          <div className={styles.readingContainer}>
            <div className={styles.articleMeta}><span>{isEngineering ? "Engineering & Research" : topic?.label}</span><span>{readingMinutes ?? resource.readingMinutes} min read</span></div>
            {!isEngineering ? <h1><ResourceSemanticText text={resource.headline} emphasis={resource.headlineEmphasis} className={styles.headlineEmphasis} /></h1> : null}
            {isInsights || isEngineering ? (
              <div className={`${styles.editorialIdentityRow} ${isEngineering ? styles.engineeringIdentityRow : ""}`}>
                <PublisherIdentity />
                <a className={styles.founderIdentityAction} href="https://www.linkedin.com/in/alexander-dimitrov-entimema/" rel="author noopener noreferrer" target="_blank"><span><small>WRITTEN BY</small>Alexander Dimitrov <i>Founder</i></span><b aria-hidden="true">↗</b></a>
                <a className={styles.linkedinIdentityAction} href="https://www.linkedin.com/company/144795091/" rel="noopener noreferrer" target="_blank"><span>Follow Entimema on LinkedIn</span><b aria-hidden="true">↗</b></a>
              </div>
            ) : <PublisherIdentity />}
          </div>
        </header>

        <div className={`${styles.articleCover} ${isEngineering ? styles.engineeringArticleCover : ""}`}>
          {isEngineering ? <EngineeringPublicationCover title={resource.technicalTitle} size="hero" /> : <ResourceCover cover={resource.cover} featured />}
        </div>

        <div className={styles.articleLayout}>
          {isInsights || isEngineering ? (
            <div className={styles.articleLeftRail}>
              <ArticleUtilities slug={resource.slug} title={resource.headline} targetId={articleBodyId} variant={isEngineering ? "engineering" : "insights"} />
              {sections && sections.length > 2 ? <ArticleContents sections={sections} /> : null}
            </div>
          ) : sections && sections.length > 2 ? <ArticleContents sections={sections} /> : null}
          <div className={styles.prose} id={articleBodyId}>{children}</div>
        </div>
        {isInsights ? <EditorialSubscription /> : null}
        {financialIntelligenceSlugs.has(resource.slug) ? <FinancialIntelligenceSeries currentSlug={resource.slug} /> : null}
        {!isEngineering ? <ResearchAuthorityPath resource={resource} /> : null}
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
