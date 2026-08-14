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
            <Image src="/entimema-mark.svg" alt="" width={224} height={224} priority />
          </div>
          <div className={styles.statement}>
            <span>ENTIMEMA</span>
            <h1>Finance, risk and AI — engineered into better decisions.</h1>
            <p>Entimema develops financial architecture, risk models and decision systems for complex business environments — combining practitioner research, analytical engineering and applied AI.</p>
          </div>
        </div>
      </header>

      <section className={styles.research} aria-labelledby="entimema-research-title">
        <div className={styles.container}>
          <h2 id="entimema-research-title">Entimema Research</h2>
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
