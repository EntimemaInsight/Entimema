import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";
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
                <span>Applied financial intelligence,</span>
                <span className={styles.emphasis}>built for real decisions.</span>
              </h1>
              <p>Transform labor-intensive workflows that once took days into automated decisions delivered in moments—reducing cost, friction, and human error.</p>
              <Link className={styles.demoCta} href="/contact">Get a demo</Link>
            </div>
          </div>
        </section>
        <section className={styles.values} aria-label="Why Entimema agents">
          <div className={`site-container ${styles.valuesInner}`}>
            <div className={styles.valueGrid}>
              <article className={styles.valuePanel}>
                <h2>Deploy faster.</h2>
                <p>Turn established financial and risk methodologies into operational workflows without rebuilding the analytical logic from scratch.</p>
              </article>
              <article className={styles.valuePanel}>
                <h2>Adapt to your decisions.</h2>
                <p>Configure inputs, thresholds, policies and decision logic around the way your institution actually operates.</p>
              </article>
              <article className={styles.valuePanel}>
                <h2>Keep every decision accountable.</h2>
                <p>Preserve evidence, logic and outputs in a transparent workflow designed for review, governance and human oversight.</p>
              </article>
            </div>
          </div>
        </section>
        <AgentLibrary />
        <section className={styles.bridge} aria-labelledby="agents-bridge-title">
          <div className={`site-container ${styles.bridgeInner}`}>
            <p>FROM METHOD TO OPERATION</p>
            <h2 id="agents-bridge-title">Built around the decision—not the demo.</h2>
            <p>Entimema connects specialist agents to governed financial and risk workflows, trusted evidence and human judgement.</p>
            <Link href="/services/decision-automation">Explore decision intelligence <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
