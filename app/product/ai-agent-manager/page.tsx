import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import InteractiveAgentCards from "./InteractiveAgentCards";
import styles from "./agent-manager.module.css";

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

function WorkflowMockup() {
  return <div className={styles.appFrame}>
    <div className={styles.appBar}><strong>Entimema</strong><span>Financial Intelligence Agent</span><i>CONTROLLED PILOT</i></div>
    <div className={styles.appBody}>
      <aside><b>Agents</b><span>Workflows</span><span>Evidence</span><span>Controls</span><span>Review</span></aside>
      <div className={styles.flowCanvas}>
        <small>WORKFLOW / INCOME STATEMENT</small>
        <div className={styles.node}><em>01</em><b>Document intake</b><span>English XLSX · text PDF</span></div><i className={styles.connector}/>
        <div className={styles.node}><em>02</em><b>Financial understanding</b><span>Structure · period · meaning</span></div><i className={styles.connector}/>
        <div className={`${styles.node} ${styles.controlNode}`}><em>03</em><b>Deterministic controls</b><span>Recalculate · reconcile · verify</span></div><i className={styles.connector}/>
        <div className={styles.node}><em>04</em><b>Human review</b><span>Material exceptions only</span></div>
      </div>
      <section className={styles.inspector}><header><span>OUTPUT</span><b>Evidence</b></header><small>Revenue</small><strong>€18,420,000</strong><p>FY 2025 · EUR</p><div className={styles.verified}>✓ VERIFIED</div><dl><div><dt>Control</dt><dd>Passed</dd></div><div><dt>Difference</dt><dd>€0</dd></div><div><dt>Source</dt><dd>SRC–01</dd></div></dl></section>
    </div>
  </div>;
}

function RulesMockup() {
  return <div className={styles.rulesFrame}><header><span>AGENT CONFIGURATION</span><b>Revenue validation</b><i>ACTIVE</i></header><div className={styles.rulesBody}><div className={styles.ruleFlow}><small>CONTROL LOGIC</small><div><em>IF</em><strong>Revenue mapping confidence below review threshold</strong></div><i/><div className={styles.warn}><em>THEN</em><strong>Route material ambiguity to human review</strong></div><i/><div className={styles.pass}><em>ELSE</em><strong>Continue to deterministic financial controls</strong></div></div><aside><small>POLICY</small><dl><div><dt>Owner</dt><dd>Finance</dd></div><div><dt>Evidence</dt><dd>Required</dd></div><div><dt>Arithmetic</dt><dd>Deterministic</dd></div><div><dt>Exception</dt><dd>Human</dd></div></dl></aside></div></div>;
}

function MonitoringMockup() {
  return <div className={styles.monitorFrame}><header><span>AGENT MONITORING</span><b>Execution FI–0024</b><i>REVIEWABLE</i></header><div className={styles.monitorGrid}><article><small>INTAKE</small><strong>Income Statement</strong><p>Source registered</p></article><article><small>CONTROL</small><strong>Reconciled</strong><p>Difference €0</p></article><article><small>REVIEW</small><strong>1 exception</strong><p>Judgement recorded</p></article></div><div className={styles.timeline}><span className={styles.done}>Evidence</span><i/><span className={styles.done}>Interpret</span><i/><span className={styles.done}>Control</span><i/><span>Review</span><i/><span>Deliver</span></div></div>;
}

export default function AgentManagerPage() {
  return <main className={styles.page}>
    <AnnouncementBar/><Navbar active="product"/>

    <section className={styles.hero}><div className="site-container">
      <span className={styles.badge}>AI Agent Manager</span>
      <h1>Put specialist AI agents to work.<br/><em>Keep financial control.</em></h1>
      <p>Configure governed agents for financial workflows — combining AI interpretation, deterministic controls, evidence and accountable human review.</p>
      <div className={styles.actions}><DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/><a href="#agents">Explore the architecture <span>→</span></a></div>
      <div className={styles.scope}>FINANCE-LED · EVIDENCE-GROUNDED · HUMAN-CONTROLLED</div>
    </div></section>

    <section className={styles.pillars}><div className="site-container"><div className={styles.pillarGrid}>{pillars.map(([n,t,c])=><article key={n}><span>{n}</span><h2>{t}</h2><p>{c}</p></article>)}</div></div></section>

    <section className={styles.agentLibrary} id="agents"><div className="site-container">
      <header className={styles.centerHeader}><span className={styles.badge}>Controlled agent architecture</span><h2>Specialist agents for work<br/><em>that finance needs to defend.</em></h2><p>Start with a bounded workflow. Keep every transformation, control and exception inspectable.</p></header>
      <InteractiveAgentCards/>
    </div></section>

    <section className={styles.productSection}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent workflow</span><h2>See the controlled workflow.<br/><em>From document to verified result.</em></h2><p>The interface makes execution visible instead of hiding the leap from upload to answer.</p></header><WorkflowMockup/></div></section>

    <section className={styles.productSectionAlt}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent controls</span><h2>Agents operate inside<br/><em>explicit financial boundaries.</em></h2><p>AI handles semantic interpretation. Code owns fixed arithmetic. Material ambiguity stays under human authority.</p></header><RulesMockup/></div></section>

    <section className={styles.productSection}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent monitoring</span><h2>Every run stays visible.<br/><em>Every material decision reviewable.</em></h2><p>Follow evidence, controls, exceptions and delivery state from one execution surface.</p></header><MonitoringMockup/></div></section>

    <section className={styles.finalCta}><div className="site-container"><span className={styles.badge}>AI Agent Manager</span><h2>Start with one controlled<br/><em>financial workflow.</em></h2><p>See how Entimema combines specialist AI, deterministic controls and human review around financial evidence.</p><DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/></div></section>
  </main>;
}
