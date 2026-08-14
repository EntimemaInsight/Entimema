import Link from "next/link";
import { resourceStreams } from "../resource-data";
import styles from "./engineering.module.css";

export default function EngineeringResearchPage() {
  const stream = resourceStreams.engineering;

  return (
    <main className={styles.main}>
      <section className={`site-container ${styles.hero}`} aria-labelledby="engineering-research-title">
        <p>RESOURCES / ENGINEERING &amp; RESEARCH</p>
        <h1 id="engineering-research-title">Engineering &amp; Research</h1>
        <div className={styles.statement}>
          <p>{stream.description}</p>
          <p>This publication stream is being prepared for rigorous quantitative, methodological and implementation work. Research will appear here only when it is ready for publication.</p>
        </div>
        <div className={styles.themes} aria-label="Research areas">
          {stream.themes.map((theme) => <span key={theme}>{theme}</span>)}
        </div>
        <Link href="/resources"><span aria-hidden="true">←</span> Explore Insights</Link>
      </section>
    </main>
  );
}
