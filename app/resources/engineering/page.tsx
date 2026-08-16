import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCard from "../ResourceCard";
import { publishedResources } from "../resource-data";
import resourceStyles from "../resources.module.css";
import styles from "./engineering.module.css";

export default function EngineeringResearchPage() {
  const engineeringArticles = publishedResources.filter((resource) => resource.stream === "engineering");

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
          {engineeringArticles.length > 0 && <div className={resourceStyles.resourceGrid}>
            {engineeringArticles.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}
          </div>}
        </div>
      </section>
    </main>
  );
}
