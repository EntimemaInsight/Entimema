import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourcesDiscovery from "./ResourcesDiscovery";
import { resourceTopics } from "./resource-data";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Resources | Entimema",
  description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions.",
  alternates: { canonical: "/resources" },
  openGraph: { title: "Resources | Entimema", description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions.", url: "/resources" },
  twitter: { card: "summary", title: "Resources | Entimema", description: "Analytical notes, models and practitioner frameworks for financial, risk and management decisions." },
};

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const topic = (await searchParams).topic;
  const selectedTopic = typeof topic === "string" && resourceTopics.some((item) => item.slug === topic) ? topic : undefined;
  return (
    <main className={`site-page ${styles.resourcesPage}`}>
      <AnnouncementBar />
      <Navbar active="resources" />
      <ResourcesDiscovery initialTopic={selectedTopic} />

      <section className={styles.topics} aria-labelledby="topics-title"><div className={styles.wideContainer}>
        <header><span>TOPIC DISCOVERY</span><h2 id="topics-title">One analytical system.<br />Seven connected territories.</h2></header>
        <div className={styles.topicList}>{resourceTopics.map((topic, index) => <article id={`topic-${topic.slug}`} key={topic.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{topic.label}</h3><p>{topic.description}</p></div></article>)}</div>
      </div></section>
    </main>
  );
}
