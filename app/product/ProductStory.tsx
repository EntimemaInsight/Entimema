import Link from "next/link";
import type { ReactNode } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import styles from "./product-story.module.css";

type Story = {
  kind: "platform" | "agents";
  eyebrow: string;
  title: ReactNode;
  lead: string;
  heroLabel: string;
  sectionEyebrow: string;
  sectionTitle: ReactNode;
  sectionLead: string;
  capabilities: ReadonlyArray<readonly [string, string, string]>;
};

function Arrow() {
  return <span className={styles.arrow} aria-hidden="true">→</span>;
}

function PlatformDiagram() {
  const stages = [
    ["01", "Evidence", "Documents, systems and source data"],
    ["02", "Interpret", "Specialist AI structures the context"],
    ["03", "Control", "Rules and validations test the output"],
    ["04", "Decide", "People resolve material exceptions"],
    ["05", "Record", "Every decision retains its evidence"],
  ];
  return (
    <div className={styles.system} aria-label="Entimema controlled decision workflow">
      <div className={styles.systemTop}><span>CONTROLLED DECISION WORKFLOW</span><i>LIVE ARCHITECTURE</i></div>
      <div className={styles.flow}>
        {stages.map(([number, title, copy], index) => (
          <div className={styles.flowStage} key={title}>
            <span className={styles.flowNumber}>{number}</span>
            <strong>{title}</strong><small>{copy}</small>
            {index < stages.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
      <div className={styles.controlRail}>
        <span><i /> Evidence lineage</span><span><i /> Deterministic checks</span><span><i /> Human authority</span>
      </div>
    </div>
  );
}

function AgentDiagram() {
  return (
    <div className={styles.agentSystem} aria-label="Entimema AI Agent Manager control architecture">
      <div className={styles.systemTop}><span>AI AGENT CONTROL PLANE</span><i>GOVERNED</i></div>
      <div className={styles.agentCanvas}>
        <div className={`${styles.agentNode} ${styles.agentOne}`}><span>01</span><strong>Extract</strong><small>Financial evidence</small></div>
        <div className={`${styles.agentNode} ${styles.agentTwo}`}><span>02</span><strong>Analyse</strong><small>Decision context</small></div>
        <div className={`${styles.agentNode} ${styles.agentThree}`}><span>03</span><strong>Review</strong><small>Material exceptions</small></div>
        <div className={styles.agentCore}><span>ENTIMEMA</span><strong>Agent Manager</strong><small>Policies · permissions · evidence</small></div>
        <svg className={styles.connectors} viewBox="0 0 760 330" aria-hidden="true" preserveAspectRatio="none">
          <path d="M185 82 C280 82 280 165 380 165" /><path d="M575 82 C480 82 480 165 380 165" /><path d="M380 268 L380 210" />
        </svg>
      </div>
      <div className={styles.controlRail}><span><i /> Approved tools</span><span><i /> Observable actions</span><span><i /> Reviewable outcomes</span></div>
    </div>
  );
}

function Lifecycle({ kind }: { kind: Story["kind"] }) {
  const steps = kind === "platform"
    ? ["Connect", "Structure", "Validate", "Review", "Decide"]
    : ["Configure", "Test", "Approve", "Run", "Improve"];
  return <ol className={styles.lifecycle}>{steps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < steps.length - 1 && <Arrow />}</li>)}</ol>;
}

export default function ProductStory({ story }: { story: Story }) {
  const isPlatform = story.kind === "platform";
  return (
    <main className={styles.page}>
      <AnnouncementBar /><Navbar active="product" />
      <section className={styles.hero} aria-labelledby="product-title">
        <div className={`site-container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{story.eyebrow}</span>
            <h1 id="product-title">{story.title}</h1>
            <p>{story.lead}</p>
            <div className={styles.actions}><DemoTrigger className={styles.primaryCta} initialInterest={story.heroLabel} /><Link className={styles.secondaryCta} href="/financial-intelligence-launch">Explore Financial Intelligence V1 <Arrow /></Link></div>
          </div>
          <div className={styles.heroVisual}>{isPlatform ? <PlatformDiagram /> : <AgentDiagram />}</div>
        </div>
      </section>

      <section className={styles.statement} aria-label="Entimema principle"><div className="site-container"><span>ENTIMEMA PRINCIPLE</span><p>{isPlatform ? <>AI interprets. Code verifies. <em>People retain authority.</em></> : <>Agents do the work. Controls set the limits. <em>Evidence keeps every action accountable.</em></>}</p></div></section>

      <section className={styles.capabilitySection} aria-labelledby="capability-title"><div className="site-container">
        <header className={styles.sectionHeader}><span>{story.sectionEyebrow}</span><h2 id="capability-title">{story.sectionTitle}</h2><p>{story.sectionLead}</p></header>
        <div className={styles.capabilityGrid}>{story.capabilities.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true" /></article>)}</div>
      </div></section>

      <section className={styles.architecture} aria-labelledby="architecture-title"><div className="site-container">
        <header className={styles.sectionHeader}><span>{isPlatform ? "FROM EVIDENCE TO ACTION" : "FROM CONFIGURATION TO CONTROL"}</span><h2 id="architecture-title">{isPlatform ? <>One flow. <em>Every decision traceable.</em></> : <>A repeatable lifecycle for <em>responsible financial AI.</em></>}</h2></header>
        <Lifecycle kind={story.kind} />
        <div className={styles.architectureNote}><span>CONTROL LAYER</span><p>{isPlatform ? "Policies, validations, approvals and evidence lineage remain active across the entire workflow." : "Permissions, tools, policies, evaluations and human review stay attached to every agent run."}</p></div>
      </div></section>

      <section className={styles.proof} aria-labelledby="proof-title"><div className={`site-container ${styles.proofInner}`}>
        <div><span className={styles.eyebrow}>BUILT FOR FINANCIAL DECISIONS</span><h2 id="proof-title">{isPlatform ? <>Move faster without making the decision <em>harder to defend.</em></> : <>Scale specialist work without scaling <em>uncontrolled judgment.</em></>}</h2></div>
        <div className={styles.proofPoints}>
          <article><span>01</span><strong>Controlled by design</strong><p>Automation operates inside explicit policies, checks and approval boundaries.</p></article>
          <article><span>02</span><strong>Grounded in evidence</strong><p>Outputs stay connected to the source context that produced them.</p></article>
          <article><span>03</span><strong>Ready for review</strong><p>Exceptions surface with the reasoning and evidence people need to decide.</p></article>
        </div>
      </div></section>

      <section className={styles.cta} aria-labelledby="product-cta-title"><div className="site-container"><span>{story.heroLabel.toUpperCase()}</span><h2 id="product-cta-title">Turn financial evidence into decisions<br /><em>your organisation can defend.</em></h2><p>Start with one controlled workflow. Prove the decision architecture. Expand with confidence.</p><DemoTrigger className={styles.ctaButton} initialInterest={story.heroLabel} /></div></section>
    </main>
  );
}
