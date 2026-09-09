import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import SnapshotShowcase from "./SnapshotShowcase";
import styles from "./agent-manager.module.css";
import theme from "./theme.module.css";

export const metadata: Metadata = {
  title: "AI Agent Manager for Controlled Financial Workflows | Entimema",
  description: "Configure specialist financial AI agents around evidence, deterministic controls and human review from one governed workspace.",
  alternates: { canonical: "https://www.entimema.com/product/ai-agent-manager" },
};

const pillars = [
  ["01", "Domain-driven, finance-led.", "Specialist agents work inside defined financial tasks, evidence requirements and decision responsibilities."],
  ["02", "Configurable to your controls.", "Set context, tools, deterministic checks and escalation logic around each controlled workflow."],
  ["03", "Traceable and reviewable.", "Keep source evidence, control results and material human judgement visible throughout execution."],
] as const;

export default function AgentManagerPage() {
  return <main className={`${styles.page} ${theme.theme}`}>
    <AnnouncementBar/>
    <Navbar active="product"/>

    <section className={styles.hero}>
      <div className="site-container">
        <span className={styles.badge}>AI Agent Manager</span>
        <h1>Put specialist AI agents to work.<br/><em>Keep financial control.</em></h1>
        <p>Configure governed agents for financial workflows — combining AI interpretation, deterministic controls, evidence and accountable human review.</p>
        <div className={styles.actions}>
          <DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/>
          <a href="#agents">Explore the product <span>→</span></a>
        </div>
        <div className={styles.scope}>FINANCE-LED · EVIDENCE-GROUNDED · HUMAN-CONTROLLED</div>
      </div>
    </section>

    <section className={styles.pillars}>
      <div className="site-container">
        <div className={styles.pillarGrid}>
          {pillars.map(([n,t,c]) => <article key={n}><span>{n}</span><h2>{t}</h2><p>{c}</p></article>)}
        </div>
      </div>
    </section>

    <SnapshotShowcase/>

    <section className={styles.finalCta}>
      <div className="site-container">
        <span className={styles.badge}>AI Agent Manager</span>
        <h2>Start with one controlled<br/><em>financial workflow.</em></h2>
        <p>See how Entimema combines specialist AI, deterministic controls and human review around financial evidence.</p>
        <DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/>
      </div>
    </section>
  </main>;
}
