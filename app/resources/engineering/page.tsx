import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCard from "../ResourceCard";
import { publishedEngineeringResources } from "../resource-data";
import resourceStyles from "../resources.module.css";
import styles from "./engineering.module.css";

export const metadata: Metadata = {
  title: "Engineering & Research | Entimema",
  description: "Technical research on credit risk modelling, model engineering, validation, decision engines and analytical automation.",
  alternates: { canonical: "/resources/engineering" },
};

export default function EngineeringResearchPage() {
  return (
    <main className={styles.main}>
      <AnnouncementBar />
      <Navbar active="resources" />
      <section className={styles.engineeringHero} aria-labelledby="engineering-title">
        <div className={styles.heroInner}>
          <div className={styles.titleFrame}>
            <h1 id="engineering-title"><span>Entimema</span> <em>Engineering</em></h1>
          </div>
          <p className={styles.subtitle}>AI systems that power financial decisions.</p>
        </div>
      </section>
      <section className={styles.articles} aria-labelledby="latest-articles-title">
        <div className={styles.articleInner}>
          <h2 id="latest-articles-title">Latest Articles</h2>
          {publishedEngineeringResources.length > 0 && <div className={resourceStyles.resourceGrid}>
            {publishedEngineeringResources.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}
          </div>}
        </div>
      </section>
    </main>
  );
}
