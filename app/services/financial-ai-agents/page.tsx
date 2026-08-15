import type { Metadata } from "next";
import Link from "next/link";
import { DemoTrigger } from "@/components/DemoDiscovery";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import AiOperationsDashboard from "./AiOperationsDashboard";
import styles from "./financial-ai-agents.module.css";

export const metadata: Metadata = {
  title: "Finance AI Agents | Entimema",
  description: "Build governed finance AI agents for reporting, planning, controlling and ERP workflows with trusted data, defined rules and human oversight.",
  alternates: { canonical: "/services/financial-ai-agents" },
};

const capabilities = [
  ["REPORTING AGENTS", "Generate, update and distribute management reporting from trusted financial data."],
  ["PLANNING AGENTS", "Prepare forecast updates, scenario inputs and budget refreshes around defined business rules."],
  ["CONTROLLING AGENTS", "Run recurring variance, margin and performance analysis and surface exceptions for review."],
  ["ERP AGENTS", "Work with ERP data to execute structured finance tasks and routine checks."],
  ["DECISION SUPPORT AGENTS", "Prepare financial analysis, context and decision inputs for human judgement."],
  ["WORKFLOW AUTOMATION", "Coordinate end-to-end finance processes across systems, data and approval steps."],
];
const process = [
  ["01", "IDENTIFY", "We select recurring finance processes where agentic automation can create clear operational value."],
  ["02", "DESIGN", "We define the agent's role, tasks, tools, rules, limits and human approval points."],
  ["03", "INTEGRATE", "We connect the agent to ERP, financial data and the workflows it needs to perform."],
  ["04", "GOVERN", "We monitor performance, refine the logic and expand autonomy only where reliability is proven."],
];
const outcomes = [
  ["LESS MANUAL WORK", "Move repetitive finance tasks from people to controlled digital workflows."],
  ["FASTER PREPARATION", "Have analysis, reporting and checks prepared before human review begins."],
  ["CONSISTENT EXECUTION", "Apply the same rules and control logic every time the process runs."],
  ["MORE TIME FOR DECISIONS", "Shift finance capacity from repetitive processing toward analysis and management judgement."],
];
const useCases = [
  ["FINANCE TEAMS", "Where recurring reporting, analysis and control tasks consume significant capacity."],
  ["MANUFACTURING", "Where cost, margin and operational analysis repeatedly draws from ERP and production data."],
  ["MULTI-ENTITY GROUPS", "Where recurring reporting and finance workflows span multiple companies and systems."],
  ["AI-READY FINANCE FUNCTIONS", "Where financial data, processes and controls are structured enough to support governed agentic workflows."],
];
const related = [
  ["Management Reporting", "Clear management information built around the decisions that need to be made.", "/services/management-reporting"],
  ["Planning & Forecasting", "Budgets, forecasts and scenarios connected to the drivers of the business.", "/services/budgets-and-forecasting"],
  ["Financial Data", "One trusted foundation for reporting, planning, analysis and governed automation.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function FinancialAiAgentsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="financial-ai-agents-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">Finance AI Agents</span></nav>
          <span className={styles.category}>FINANCE AI AGENTS</span><h1 id="financial-ai-agents-title">Models explain.<br />Agents act.</h1>
          <p className={styles.lead}>Automation handles tasks. Agents handle workflows.</p>
          <p className={styles.support}>Build finance AI agents that work across reporting, planning, controlling and ERP processes — analysing data, executing recurring tasks and preparing management information for human review.</p>
          <DemoTrigger className={styles.primaryButton} initialInterest="AI Agents" />
        </div><AiOperationsDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="WHAT THEY DO" title="Give repetitive financial work a digital operator." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="HOW WE WORK" title={<>Start with the process.<br />Give the agent a role.<br />Keep control human.</>} /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="WHAT YOU GET" title={<>Less execution.<br />More judgement.</>} /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="case-example-title"><div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When finance repeats the same analysis every month, the process is asking to be automated.</h3></div><dl><div><dt>SCENARIO</dt><dd>A manufacturing finance team repeatedly prepares margin analysis, ERP checks and management reports through manual steps across multiple systems.</dd></div><div><dt>ENTIMEMA APPROACH</dt><dd>We deploy finance AI agents connected to ERP, trusted financial data and reporting workflows, with defined rules and human review points.</dd></div><div><dt>RESULT</dt><dd>Recurring finance work is prepared more consistently, while the team spends more time reviewing exceptions, interpreting results and supporting decisions.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="WHERE IT APPLIES" title="Where do finance AI agents create the most value?" intro="If the same financial process is repeated the same way every month, it may no longer need to be manual." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="NEXT STEP" title="Related services" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>FINANCE AI AGENTS</span><h2 id="cta-title">Don&apos;t add AI to finance.<br />Give AI a defined financial role.</h2><p>Start with one recurring process, clear controls and trusted data. Build autonomy from there.</p><DemoTrigger className={styles.ctaButton} initialInterest="AI Agents" /></div></div></section>
    </main>
  );
}
