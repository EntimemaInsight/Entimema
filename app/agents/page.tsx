import type { Metadata } from "next";
import Link from "next/link";
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

const methodologyFlow = ["Methodology", "Analytical structure", "Agent reasoning", "Decision support"] as const;

export default function AgentsPage() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#agents-content">Skip to main content</a>
      <AnnouncementBar />
      <Navbar active="agents" />

      <div id="agents-content">
        <section className={styles.hero} aria-labelledby="agents-title">
          <div className={`site-container ${styles.heroInner}`}>
            <h1 id="agents-title"><span>AI agents built around</span> <em>the logic behind the decision.</em></h1>
            <p>Entimema transforms financial, risk and analytical methodology into specialised AI agents designed to investigate, reason and support decisions within real business workflows.</p>
            <DemoTrigger className={`primary-cta ${styles.primaryCta}`} />
          </div>
        </section>

        <section className={styles.principles} aria-label="Principles behind Entimema agents">
          <div className={`site-container ${styles.principleGrid}`}>
            {principles.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.methodology} aria-labelledby="methodology-title">
          <div className={`site-container ${styles.sectionInner}`}>
            <header className={styles.sectionHeader}>
              <h2 id="methodology-title">From methodology to <em>operational intelligence.</em></h2>
              <p>Entimema agents are designed from the analytical structures behind finance and risk: definitions, relationships, controls, models, evidence and decision rules. The objective is not to replace expertise, but to make specialised reasoning available inside repeatable workflows.</p>
            </header>
            <ol className={styles.flow} aria-label="Methodology to decision support">
              {methodologyFlow.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}
            </ol>
          </div>
        </section>

        <section className={styles.research} aria-labelledby="research-title">
          <div className={`site-container ${styles.researchInner}`}>
            <div>
              <h2 id="research-title">Research is where the agents begin.</h2>
              <p>The same methodological work behind Entimema&apos;s research in finance, credit risk and decision-making forms the foundation for specialised agent capabilities. Research develops the reasoning. Agents make that reasoning operational.</p>
            </div>
            <Link className={styles.researchLink} href="/resources">Explore our research</Link>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-cta-title">
          <div className={`site-container ${styles.finalCtaInner}`}>
            <h2 id="final-cta-title">Bring specialised reasoning into the workflow.</h2>
            <p>Discover how Entimema can turn structured financial and risk methodology into AI-assisted analytical workflows for your organisation.</p>
            <DemoTrigger className={`primary-cta ${styles.primaryCta}`} />
          </div>
        </section>
      </div>
    </main>
  );
}
