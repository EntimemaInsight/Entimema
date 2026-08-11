import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getPublishedRelatedResources, getTopic, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";

export type ArticleSection = { id: string; label: string };

export default function ResourceArticle({ resource, sections, children }: { resource: ResourceRecord; sections?: ArticleSection[]; children: ReactNode }) {
  const topic = getTopic(resource.topic);
  const related = getPublishedRelatedResources(resource);
  const published = resource.publishedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(resource.publishedAt)) : null;

  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar active="resources" />
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.readingContainer}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/resources">Resources</Link><span aria-hidden="true">/</span><span>{topic?.label}</span>
            </nav>
            <p className={styles.eyebrow}>{topic?.label}</p>
            <h1>{resource.title}</h1>
            <p className={styles.deck}>{resource.deck}</p>
            <div className={styles.byline}>
              <div><span>Written by</span>{resource.author.profilePath ? <Link href={resource.author.profilePath}>{resource.author.name}</Link> : <strong>{resource.author.name}</strong>}<small>{resource.author.affiliation}</small></div>
              <div><span>Published</span><strong>{published}</strong>{resource.updatedAt ? <small>Updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(resource.updatedAt))}</small> : null}</div>
              <div><span>Reading time</span><strong>{resource.readingMinutes} min</strong></div>
            </div>
          </div>
        </header>

        <div className={styles.articleLayout}>
          {sections && sections.length > 2 ? <nav className={styles.toc} aria-label="On this page"><span>ON THIS PAGE</span><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol></nav> : null}
          <div className={styles.prose}>{children}</div>
        </div>

        <aside className={styles.capability} aria-labelledby="related-capability-title">
          <div><span>RELATED CAPABILITY</span><h2 id="related-capability-title">{resource.relatedCapability.label}</h2><p>{resource.relatedCapability.description}</p></div>
          <Link href={resource.relatedCapability.href}>Explore the capability <span aria-hidden="true">→</span></Link>
        </aside>

        {related.length ? <section className={styles.related} aria-labelledby="related-resources-title"><div className={styles.wideContainer}><header><span>CONTINUE THE ANALYSIS</span><h2 id="related-resources-title">Related Resources</h2></header><div>{related.map((item) => <Link href={item.canonicalPath} key={item.slug}><span>{getTopic(item.topic)?.label}</span><strong>{item.title}</strong><small>{item.readingMinutes} min read</small></Link>)}</div></div></section> : null}
      </article>
    </main>
  );
}
