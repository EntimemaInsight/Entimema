import type { Metadata } from "next";
import Link from "next/link";
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

      <section className={styles.demoCta} aria-labelledby="demo-cta-title"><div className={styles.demoCtaInner}>
        <h2 id="demo-cta-title">See Entimema AI Agents in action.</h2>
        <p>Explore how AI agents can support financial analysis, risk assessment and decision workflows.</p>
        <Link href="/contact?topic=financial-ai-agents">Request a demo <span aria-hidden="true">→</span></Link>
      </div></section>
    </main>
  );
}
