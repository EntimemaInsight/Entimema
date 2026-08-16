import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ResourceCard from "../ResourceCard";
import { publishedResources } from "../resource-data";
import resourceStyles from "../resources.module.css";
import styles from "./engineering.module.css";

const capabilities = [
  { title: "AI-Driven Engineering", description: "Purpose-built AI systems that connect financial intelligence to controlled, decision-ready execution." },
  { title: "Model & System Architecture", description: "Robust analytical architectures designed around clear assumptions, interfaces and operating constraints." },
  { title: "Data & Analytics Infrastructure", description: "Reliable data foundations that make financial models, metrics and decisions traceable and repeatable." },
  { title: "AI Agents & Automation", description: "Bounded agents and automated workflows built for complex finance and risk operations." },
  { title: "Trust, Risk & Validation", description: "Validation, controls and oversight embedded into the systems that support consequential decisions." },
] as const;

function CapabilityIcon({ index }: { index: number }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32">
    <path d="M5 9.5h22M5 22.5h22M9.5 5v22M22.5 5v22" />
    {index === 0 && <><circle cx="9.5" cy="9.5" r="2" /><circle cx="22.5" cy="22.5" r="2" /></>}
    {index === 1 && <><path d="m9.5 22.5 13-13" /><circle cx="22.5" cy="9.5" r="2" /></>}
    {index === 2 && <><path d="M9.5 22.5V16h6.5V9.5h6.5" /><circle cx="16" cy="16" r="2" /></>}
    {index === 3 && <><path d="m9.5 9.5 13 13M9.5 22.5l13-13" /><circle cx="16" cy="16" r="2" /></>}
    {index === 4 && <><rect x="10.5" y="10.5" width="11" height="11" rx="1" /><path d="m13.5 16 1.8 1.8 3.7-4" /></>}
  </svg>;
}

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
          <div className={styles.capabilityGrid} aria-label="Engineering capability pillars">
            {capabilities.map((capability, index) => <article className={styles.capability} key={capability.title}>
              <CapabilityIcon index={index} />
              <h2>{capability.title}</h2>
              <p>{capability.description}</p>
            </article>)}
          </div>
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
