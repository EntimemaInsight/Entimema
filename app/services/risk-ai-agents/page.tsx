import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import RiskAgentOperations from "./RiskAgentOperations";
import styles from "../decision-automation/decision-automation.module.css";

export const metadata: Metadata = {
  title: "Risk AI Agents | Entimema",
  description: "Build governed AI agents for credit, AML and risk operations with defined roles, explicit controls, escalation and human oversight.",
};

const capabilities = [
  ["RISK MONITORING AGENTS", "Continuously monitor portfolios, risk indicators, events and deviations against defined thresholds."],
  ["CREDIT RISK AGENTS", "Analyse applications, portfolio behaviour and changes in customer risk profiles."],
  ["AML INVESTIGATION AGENTS", "Prepare preliminary analysis of alerts, customer activity and AML cases for human review."],
  ["DECISION SUPPORT AGENTS", "Prepare structured analysis, context and recommendations for decisions requiring expert judgement."],
  ["EXCEPTION MANAGEMENT", "Identify, analyse and escalate cases that fall outside standard decision logic."],
  ["RISK WORKFLOW AGENTS", "Coordinate controlled risk processes across data, models, systems and human teams."],
];

const process = [
  ["01", "IDENTIFY", "We select recurring risk processes where agentic execution can create operational value within acceptable control boundaries."],
  ["02", "ARCHITECT", "We define the agent's role, authorised data, authorised tools, rules, permissions, limits, escalation logic and human intervention points."],
  ["03", "INTEGRATE", "We connect agents to risk data, models, decision engines and operational workflows."],
  ["04", "GOVERN", "We monitor actions, quality, exceptions and escalation outcomes and expand capability only where reliability is demonstrated."],
];

const outcomes = [
  ["FASTER PREPARATION", "Risk events and cases are analysed before specialist review begins."],
  ["LESS MANUAL WORK", "Move repetitive checks, analysis and administrative steps into controlled agent workflows."],
  ["CONSISTENT EXECUTION", "Agents follow defined rules, permissions and control mechanisms every time."],
  ["MORE EXPERT CAPACITY", "Risk teams spend more time on complex cases, judgement and policy decisions."],
];

const useCases = [
  ["CREDIT RISK", "Where portfolio monitoring, application analysis and risk-profile changes generate recurring analytical work."],
  ["AML & COMPLIANCE", "Where alerts, customer reviews, investigations and escalation workflows require structured preparation."],
  ["RISK OPERATIONS", "Where recurring monitoring, control checks and event handling can follow defined rules and escalation paths."],
];

const related = [
  ["Credit Risk", "Models, policy and portfolio controls connected across the full credit lifecycle.", "/services/credit-risk"],
  ["AML & Compliance", "KYC, monitoring, investigations and evidence connected in one control architecture.", "/services/aml-compliance"],
  ["Decision Intelligence", "Data, models and policy translated into traceable operational decisions.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function RiskAiAgentsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="risk-ai-agents-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Decision Science</span><span>/</span><Link href="/services/risk-ai-agents" aria-current="page">Risk AI Agents</Link></nav>
          <span className={styles.category}>RISK AI AGENTS</span>
          <h1 id="risk-ai-agents-title">Risk models identify.<br />Risk agents respond.</h1>
          <p className={styles.lead}>Build governed AI agents that monitor risk, analyse events, prepare actions and execute controlled workflows across credit, AML and risk operations.</p>
          <p className={styles.support}><strong>Autonomy without control is just another risk.</strong> Give agents defined roles, authorised data, explicit rules, escalation paths and human review — so risk workflows can move faster without losing accountability.</p>
          <Link className={styles.primaryButton} href="/contact?topic=risk-ai-agents">Discuss Your Risk AI Agents <span aria-hidden="true">→</span></Link>
        </div>
        <RiskAgentOperations />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT THEY DO" title="Give recurring risk work a controlled digital operator." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Define the role.<br />Limit the autonomy.<br />Govern the action.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title={<>More automated execution.<br />More human attention where it matters.</>} />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When the same risk checks repeat every day, the process is asking for an agent.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>A consumer lender handles high volumes of recurring portfolio checks, application reviews and exceptions that require repeated manual preparation.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We deploy governed AI agents connected to risk data, models and decision engines to monitor events, prepare analysis and escalate cases according to defined rules.</dd></div>
            <div><dt>RESULT</dt><dd>Routine risk work moves through a more consistent process, while specialists focus on exceptions, interpretation and complex decisions.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT APPLIES" title="Where do risk AI agents create the most value?" intro="If a risk process is repetitive, rules-based and reviewable, it may be ready for an agent." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>RISK AI AGENTS</span><h2 id="cta-title">Don&apos;t automate risk blindly.<br />Give automation boundaries.</h2><p>Start with one recurring process, explicit controls and human review. Build autonomy from there.</p><Link className={styles.ctaButton} href="/contact?topic=risk-ai-agents">Discuss Your Risk AI Agents <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
