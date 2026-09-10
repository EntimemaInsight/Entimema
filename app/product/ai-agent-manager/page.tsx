import type { Metadata } from "next";
import { Fragment } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import SnapshotShowcase from "./SnapshotShowcase";
import styles from "./agent-manager.module.css";
import theme from "./theme.module.css";

export const metadata: Metadata = {
  title: "AI Agent Manager for Controlled Financial Workflows | Entimema",
  description: "Explore the Entimema AI Agent Manager interface preview: financial analysis, source evidence, deterministic controls and human review.",
  alternates: { canonical: "https://www.entimema.com/product/ai-agent-manager" },
};

const pillars = [
  ["01", "Domain-driven, finance-led.", "Specialist agents work inside defined financial tasks, evidence requirements and decision responsibilities."],
  ["02", "Configurable to your controls.", "Set context, tools, deterministic checks and escalation logic around each controlled workflow."],
  ["03", "Traceable and reviewable.", "Keep source evidence, control results and material human judgement visible throughout execution."],
] as const;

const pillarIcons = [
  <Fragment key="0"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 5 3 3 5-5"/></Fragment>,
  <Fragment key="1"><path d="m9.5 3-.5 2-2 1-2-.5-2 3 1.5 1.5v3L3 14.5l2 3 2-.5 2 1 .5 3h5l.5-3 2-1 2 .5 2-3-1.5-1.5v-3L21 8.5l-2-3-2 .5-2-1-.5-2z"/><circle cx="12" cy="12" r="3"/></Fragment>,
  <Fragment key="2"><path d="M4 16V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11M2 18h7l1 2h4l1-2h7v3H2zM8 13v-3m4 3V7m4 6v-4"/></Fragment>,
];

export default function AgentManagerPage() {
  return <main className={`${styles.page} ${theme.theme}`}>
    <AnnouncementBar/>
    <Navbar active="product"/>

    <section className={styles.hero}>
      <div className="site-container">
        <span className={styles.badge}>AI Agent Manager</span>
        <h1>Put specialist AI agents to work.<br/><em>Keep financial control.</em></h1>
        <p>Explore a governed workspace for financial workflows — combining AI interpretation, deterministic controls, evidence and accountable human review.</p>
        <div className={styles.actions}>
          <DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/>
        </div>
      </div>
    </section>

    <section className={styles.pillars}>
      <div className="site-container">
        <div className={styles.pillarGrid}>
          {pillars.map(([n,t,c], index) => <article key={n}><svg className={styles.pillarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{pillarIcons[index]}</svg><h2>{t}</h2><p>{c}</p></article>)}
        </div>
      </div>
    </section>

    <SnapshotShowcase/>

    <section className={styles.finalCta}>
      <div className="site-container">
        <h2>Start with one controlled<br/>financial workflow.</h2>
        <div className={styles.finalActions}><DemoTrigger className="primary-cta primary-cta--light" initialInterest="AI Agent Manager"/></div>
      </div>
    </section>
  </main>;
}
