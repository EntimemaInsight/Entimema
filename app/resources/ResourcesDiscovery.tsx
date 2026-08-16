"use client";

import { useState } from "react";
import { NewsletterTrigger } from "@/components/DemoDiscovery";
import ResourceCard from "./ResourceCard";
import { getTopic, publishedResources, resourceTopics } from "./resource-data";
import styles from "./resources.module.css";
import { NEWSLETTER_CTA } from "@/lib/cta-labels";

export default function ResourcesDiscovery({ initialTopic }: { initialTopic?: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(initialTopic ?? "");
  const availableTopics = resourceTopics.filter((item) => publishedResources.some((resource) => resource.topic === item.slug));
  const search = query.trim().toLocaleLowerCase();
  const matches = publishedResources
    .map((resource, publicationSequence) => ({ publicationSequence, resource }))
    .filter(({ resource }) => {
      const category = getTopic(resource.topic)?.label ?? "";
      return (!topic || resource.topic === topic) && (!search || [resource.technicalTitle, resource.headline, resource.slogan, category].some((value) => value.toLocaleLowerCase().includes(search)));
    })
    .sort((left, right) => right.resource.publishedAt.localeCompare(left.resource.publishedAt) || right.publicationSequence - left.publicationSequence)
    .map(({ resource }) => resource);

  return <>
    <div className={styles.aboveFold}>
      <header className={styles.indexHero}><div className={styles.wideContainer}>
        <h1>Decisions rarely fail<br /><em>for lack of data.</em></h1>
        <p className={styles.tensionLine}>They fail when the signal is buried in it.</p>
        <NewsletterTrigger className={styles.newsletterCta}><span>{NEWSLETTER_CTA}</span></NewsletterTrigger>
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
