import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCover from "../ResourceCover";
import { getTopic, publishedResources } from "../resource-data";
import styles from "./publication.module.css";
import resourceStyles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Entimema Research | Entimema",
  description: "Entimema develops financial architecture, risk models and decision systems for complex business environments.",
  alternates: { canonical: "/resources/entimema" },
};

const formatDate = (publishedAt: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${publishedAt}T00:00:00Z`));

export default function EntimemaPublicationPage() {
  return (
    <main className={`site-page ${styles.page}`}>
      <AnnouncementBar />
      <Navbar active="resources" />

      <header className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.mark}>
            <Image src="/entimema-gmail-logo.png" alt="" width={1024} height={1024} priority />
          </div>
          <div className={styles.statement}>
            <h1>Entimema</h1>
            <p>Entimema is a financial and decision systems company working across finance, risk, analytics and applied AI. We design financial architectures, risk models, management information systems and decision frameworks that help organisations turn complex data into controlled, explainable and actionable decisions.</p>
            <p>Our work combines practitioner-grade research with analytical engineering and automation. From financial planning, profitability and management reporting to credit risk, decision intelligence and AI agents, Entimema develops systems that connect models, data and operational decisions into a coherent management architecture.</p>
          </div>
        </div>
      </header>

      <section className={styles.research} aria-labelledby="entimema-research-title">
        <div className={styles.container}>
          <h2 id="entimema-research-title">Entimema&apos;s articles</h2>
          <div className={resourceStyles.resourceGrid}>
            {publishedResources.map((resource) => (
              <article className={resourceStyles.resourceCard} key={resource.slug}>
                <Link className={resourceStyles.coverLink} href={resource.canonicalPath} aria-label={`Read ${resource.title}`}>
                  <ResourceCover cover={resource.cover} />
                </Link>
                <div className={resourceStyles.cardMeta}>
                  <span>{getTopic(resource.topic)?.label}</span>
                  <span>{resource.readingMinutes} MIN READ</span>
                </div>
                <h3><Link href={resource.canonicalPath}>{resource.title}</Link></h3>
                <p>{resource.deck}</p>
                <div className={resourceStyles.cardFooter}>
                  <time dateTime={resource.publishedAt}>{formatDate(resource.publishedAt)}</time>
                  <Link href={resource.canonicalPath}>Read analysis <b aria-hidden="true">→</b></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
