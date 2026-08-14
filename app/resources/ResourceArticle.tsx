import Link from "next/link";
import Image from "next/image";
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
  const related = getPublishedRelatedResources(resource);
  const published = resource.publishedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(resource.publishedAt)) : null;

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
              <BrandLogo compact />
              {published ? <time dateTime={resource.publishedAt}>{published}</time> : null}
            </div>
          </div>
        </header>

        <div className={styles.articleCover}><ResourceCover cover={resource.cover} featured /></div>

        <div className={styles.articleLayout}>
          {sections && sections.length > 2 ? <ArticleContents sections={sections} /> : null}
          <div className={styles.prose}>{children}</div>
        </div>

        <section className={styles.institutionalSignature} aria-labelledby="institutional-signature-title">
          <div className={styles.wideContainer}>
            <div className={styles.signatureMark}><Image src="/entimema-mark.svg" alt="" width={48} height={48} /></div>
            <div className={styles.signatureStatement}>
              <span>Entimema</span>
              <h2 id="institutional-signature-title">Finance, risk and AI — engineered into better decisions.</h2>
              <p>Entimema builds financial architecture, risk models and decision systems, applying AI where it makes analysis and execution faster, clearer and more controlled.</p>
            </div>
          </div>
        </section>

        {related.length ? <section className={styles.continueExploring} aria-labelledby="continue-exploring-title"><div className={styles.wideContainer}>
          <header><span>ENTIMEMA RESEARCH</span><h2 id="continue-exploring-title">Continue exploring</h2></header>
          <div className={styles.exploringGrid}>{related.map((item) => <Link className={styles.exploringItem} href={item.canonicalPath} key={item.slug} aria-label={`Read ${item.title}`}>
            <ResourceCover cover={item.cover} />
            <span className={styles.exploringMeta}><span>{getTopic(item.topic)?.label}</span><span>{item.readingMinutes} min read</span></span>
            <h3>{item.title}<span aria-hidden="true">→</span></h3>
            <p>{item.deck}</p>
          </Link>)}</div>
        </div></section> : null}
      </article>
    </main>
  );
}
