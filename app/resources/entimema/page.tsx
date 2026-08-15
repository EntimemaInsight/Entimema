import type { Metadata } from "next";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCard from "../ResourceCard";
import { publishedResources } from "../resource-data";
import styles from "./publication.module.css";
import resourceStyles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Entimema Research | Entimema",
  description: "Entimema develops financial architecture, risk models and decision systems for complex business environments.",
  alternates: { canonical: "/resources/entimema" },
};

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
            {publishedResources.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
