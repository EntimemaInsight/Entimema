import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCover from "./ResourceCover";
import { getTopic, publishedResources, resourceTopics } from "./resource-data";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Resources | Entimema",
  description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions.",
  alternates: { canonical: "/resources" },
  openGraph: { title: "Resources | Entimema", description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions.", url: "/resources" },
  twitter: { card: "summary", title: "Resources | Entimema", description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions." },
};

const formatDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${publishedAt}T00:00:00Z`));

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const topic = (await searchParams).topic;
  const selectedTopic = typeof topic === "string" && resourceTopics.some((item) => item.slug === topic) ? topic : undefined;
  const featured = publishedResources.find((resource) => resource.featured);
  const selected = publishedResources.filter((resource) => selectedTopic ? resource.topic === selectedTopic : resource.slug !== featured?.slug);

  return (
    <main className={`site-page ${styles.resourcesPage}`}>
      <AnnouncementBar />
      <Navbar active="resources" />
      <header className={styles.indexHero}><div className={styles.wideContainer}>
        <p className={styles.eyebrow}>RESOURCES</p>
        <h1>Analysis for decisions<br /><em>that carry consequence.</em></h1>
        <p>Research notes, analytical essays and practitioner frameworks across finance, risk, data and decision systems.</p>
      </div></header>

      {featured ? <section className={styles.featured} aria-labelledby="featured-title"><div className={styles.wideContainer}>
        <header><span>FEATURED ANALYSIS</span></header>
        <article className={styles.featuredEntry}>
          <Link className={styles.coverLink} href={featured.canonicalPath} aria-label={`Read ${featured.title}`}><ResourceCover cover={featured.cover} featured /></Link>
          <div className={styles.featuredCopy}>
            <div className={styles.featuredMeta}><span>{getTopic(featured.topic)?.label}</span><span>{featured.readingMinutes} MIN READ</span></div>
            <h2 id="featured-title"><Link href={featured.canonicalPath}>{featured.title}</Link></h2>
            <p>{featured.deck}</p>
            <div className={styles.featuredFooter}><time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time><Link href={featured.canonicalPath}>Read analysis <b aria-hidden="true">→</b></Link></div>
          </div>
        </article>
      </div></section> : null}

      <section className={styles.selected} id="selected-resources" aria-labelledby="selected-title"><div className={styles.wideContainer}>
        <header><span>SELECTED RESOURCES</span><h2 id="selected-title">Analytical work, organised by problem.</h2></header>
        {selected.length ? <div className={styles.resourceGrid}>{selected.map((resource) => <article key={resource.slug}>
          <Link className={styles.coverLink} href={resource.canonicalPath} aria-label={`Read ${resource.title}`}><ResourceCover cover={resource.cover} /></Link>
          <div className={styles.cardMeta}><span>{getTopic(resource.topic)?.label}</span><span>{resource.readingMinutes} MIN READ</span></div>
          <h3><Link href={resource.canonicalPath}>{resource.title}</Link></h3><p>{resource.deck}</p>
          <div className={styles.cardFooter}><time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time><Link href={resource.canonicalPath}>Read analysis <b aria-hidden="true">→</b></Link></div>
        </article>)}</div> : <div className={styles.emptyState}><p>The first Entimema analyses are being developed under practitioner review.</p><span>Publication begins with depth, not volume.</span></div>}
      </div></section>

      <section className={styles.topics} aria-labelledby="topics-title"><div className={styles.wideContainer}>
        <header><span>TOPIC DISCOVERY</span><h2 id="topics-title">One analytical system.<br />Seven connected territories.</h2></header>
        <div className={styles.topicList}>{resourceTopics.map((topic, index) => <article id={`topic-${topic.slug}`} key={topic.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{topic.label}</h3><p>{topic.description}</p></div></article>)}</div>
      </div></section>
    </main>
  );
}
