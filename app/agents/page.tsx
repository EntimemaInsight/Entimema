import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import Navbar from "@/components/Navbar";
import styles from "./agents.module.css";

export const metadata: Metadata = {
  title: "AI Agents for Finance & Risk | Entimema Agent Library",
  description: "Explore Entimema's approach to specialised AI agents built from financial, risk and analytical methodology for real decision workflows.",
  keywords: [
    "AI agents for finance and risk",
    "financial AI agents",
    "credit risk AI agents",
    "AI agents for financial analysis",
    "decision intelligence",
    "AI decision support",
    "financial workflow automation",
  ],
  alternates: { canonical: "/agents" },
};

const principles = [
  ["01", "Methodology first.", "Built from structured financial, risk and analytical frameworks — not generic prompting."],
  ["02", "Designed for decisions.", "Agents are shaped around specific analytical questions, workflows and decision contexts."],
  ["03", "Human judgement stays in the loop.", "AI accelerates analysis and structures evidence. Responsibility for consequential decisions remains with people."],
] as const;

export default function AgentsPage() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#agents-content">Skip to main content</a>
      <AnnouncementBar />
      <Navbar active="agents" />

      <div id="agents-content">
        <section className={styles.hero} aria-labelledby="agents-title">
          <div className={`site-container ${styles.heroInner}`}>
            <div className={styles.proposition}>
              <h1 id="agents-title"><span>AI agents built around</span> <em>the logic behind the decision.</em></h1>
              <p>Entimema transforms financial, risk and analytical methodology into specialised AI agents designed to investigate, reason and support decisions within real business workflows.</p>
              <DemoTrigger className={`primary-cta ${styles.primaryCta}`} />
            </div>
            <div className={styles.principleGrid} aria-label="Principles behind Entimema agents">
              {principles.map(([number, title, copy]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
