import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import Navbar from "@/components/Navbar";
import AgentLibrary from "./AgentLibrary";
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
              <h1 id="agents-title">
                <span>Specialized AI agents</span>
                <span className={styles.emphasis}>for finance and risk.</span>
              </h1>
              <p>Explore focused capabilities designed to extract, validate, analyse and monitor financial and risk information within controlled, reviewable workflows.</p>
              <DemoTrigger className={styles.demoCta}>Get a demo</DemoTrigger>
            </div>
            <div className={styles.values} aria-label="Why Entimema agents">
              <div className={styles.valueGrid}>
                <article className={styles.valuePanel}>
                  <h2>Start with proven methods.</h2>
                  <p>Use finance and risk logic as the foundation for controlled workflows—not generic prompts or disconnected automation.</p>
                </article>
                <article className={styles.valuePanel}>
                  <h2>Fit the operating model.</h2>
                  <p>Design inputs, mappings, thresholds and review steps around your data, policies and materiality—not a generic process.</p>
                </article>
                <article className={styles.valuePanel}>
                  <h2>Keep every output traceable.</h2>
                  <p>Connect outputs to source evidence, validation checks, exceptions and human review in one controlled workflow.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <AgentLibrary />
      </div>
    </main>
  );
}
