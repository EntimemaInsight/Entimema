"use client";

import Link from "next/link";
import { useState } from "react";
import ResourceCover from "./ResourceCover";
import { getTopic, publishedResources, resourceTopics, type ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";

const formatDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${publishedAt}T00:00:00Z`));

function ResourceCard({ resource }: { resource: ResourceRecord & { publishedAt: string } }) {
  return <article className={styles.resourceCard}>
    <Link className={styles.coverLink} href={resource.canonicalPath} aria-label={`Read ${resource.title}`}><ResourceCover cover={resource.cover} /></Link>
    <div className={styles.cardMeta}><span>{getTopic(resource.topic)?.label}</span><span>{resource.readingMinutes} MIN READ</span></div>
    <h3><Link href={resource.canonicalPath}>{resource.title}</Link></h3><p>{resource.deck}</p>
    <div className={styles.cardFooter}><time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time><Link href={resource.canonicalPath}>Read analysis <b aria-hidden="true">→</b></Link></div>
  </article>;
}

export default function ResourcesDiscovery({ initialTopic }: { initialTopic?: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(initialTopic ?? "");
  const availableTopics = resourceTopics.filter((item) => publishedResources.some((resource) => resource.topic === item.slug));
  const search = query.trim().toLocaleLowerCase();
  const matches = publishedResources.filter((resource) => {
    const category = getTopic(resource.topic)?.label ?? "";
    return (!topic || resource.topic === topic) && (!search || [resource.title, resource.deck, category].some((value) => value.toLocaleLowerCase().includes(search)));
  });

  return <>
    <div className={styles.aboveFold}>
      <header className={styles.indexHero}><div className={styles.wideContainer}>
        <h1>Decisions rarely fail<br /><em>for lack of data.</em></h1>
        <p className={styles.tensionLine}>They fail when the signal is buried in it.</p>
        <Link className={styles.newsletterCta} href="/newsletter"><span>Subscribe to our newsletter</span><b aria-hidden="true">→</b></Link>
      </div></header>

      <section className={styles.discovery} aria-label="Find research"><div className={styles.wideContainer}>
        <label className={styles.searchField} htmlFor="resource-search"><span className={styles.visuallyHidden}>Search research</span><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg><input id="resource-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search" type="search" value={query} /></label>
        <label className={styles.categoryField} htmlFor="resource-category"><span className={styles.visuallyHidden}>Filter by category</span><select id="resource-category" onChange={(event) => setTopic(event.target.value)} value={topic}><option value="">All categories</option>{availableTopics.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}</select></label>
      </div></section>
    </div>

    <section className={styles.library} id="article-library" aria-label="Research articles"><div className={styles.wideContainer}>
      {matches.length ? <div className={styles.resourceGrid}>{matches.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}</div> : <div className={styles.emptyState}><p>No research matches your search.</p></div>}
    </div></section>
  </>;
}
