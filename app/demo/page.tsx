import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AgentDemoForm } from "@/components/DemoDiscovery";
import { agents } from "@/app/agents/agent-library-data";
import { agentMarks } from "@/app/agents/AgentMarks";
import libraryStyles from "@/app/agents/agent-library.module.css";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Request an Agent Demo | Entimema",
  description: "Request a focused demonstration of an Entimema Agent in the context of your workflow.",
  robots: { index: false, follow: true },
};

const valuePoints = [
  ["Workflow-specific demonstration.", "See the Agent applied to the type of process, evidence and controls relevant to your organisation."],
  ["Your methodology stays in control.", "Explore how rules, thresholds and required evidence can reflect your existing decision framework."],
  ["Transparent by design.", "See what the Agent received, what it identified, what remains unresolved and how each output was produced."],
  ["From demonstration to deployment.", "If there is a fit, we define the data, integration and governance requirements needed to operationalise the Agent."],
] as const;

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ agent?: string | string[] }> }) {
  const requestedId = (await searchParams).agent;
  const agentId = typeof requestedId === "string" ? requestedId : "";
  const agent = agents.find((candidate) => candidate.id === agentId);

  if (!agent) return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.safeState} aria-labelledby="demo-safe-title">
        <p className={styles.eyebrow}>DEMO REQUEST</p>
        <h1 id="demo-safe-title">Choose the Agent you want to see in action.</h1>
        <p>The Agent reference could not be resolved. Return to the Agent Library to select an Agent and request a focused demonstration.</p>
        <Link href="/agents">← Back to Agent Library</Link>
      </section>
    </main>
  );

  const Mark = agentMarks[agent.mark];
  const displayName = agent.name.replace(/ Agent$/, "");
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#demo-content">Skip to main content</a>
      <Navbar active="agents" />
      <div className={styles.atmosphere} id="demo-content">
        <div className={styles.shell}>
          <Link className={styles.back} href="/agents">← Back to Agent Library</Link>
          <div className={styles.columns}>
            <section className={styles.context} aria-labelledby="demo-title">
              <div className={styles.identity}>
                <span className={`${libraryStyles.markField} ${styles.markField}`} aria-hidden="true"><Mark className={`${libraryStyles.mark} ${styles.mark}`} /></span>
                <p className={styles.eyebrow}>ENTIMEMA AGENT</p>
              </div>
              <h1 id="demo-title">See {displayName}<br />in your workflow.</h1>
              <p className={styles.intro}>Tell us how this workflow operates today, where the friction or uncertainty sits, and what you want the Agent to handle.</p>
              <div className={styles.next}>
                <h2>What happens next?</h2>
                <p>We review your workflow, data requirements and decision context, then prepare a focused demonstration around the way your team actually works.</p>
                <div className={styles.values}>
                  {valuePoints.map(([title, copy]) => <section key={title}><h3>{title}</h3><p>{copy}</p></section>)}
                </div>
              </div>
            </section>
            <aside className={styles.formSurface} aria-label={`Request a demonstration of ${agent.name}`}>
              <AgentDemoForm agentId={agent.id} agentName={agent.name} />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
