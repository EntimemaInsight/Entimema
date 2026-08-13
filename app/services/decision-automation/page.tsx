import type { ReactNode } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import DecisionEngineDashboard from "./DecisionEngineDashboard";
import styles from "./decision-automation.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Decision Intelligence Consulting | Entimema",
  description: "Build decision engines that connect data, analytical models, business rules and policy into traceable operational decision flows.",
  path: "/services/decision-automation",
});

const capabilities = [
  ["DECISION ARCHITECTURE", "Design the full logic from input data and analytical models to the final operational decision."],
  ["BUSINESS RULES", "Define rules, thresholds, cut-offs, policies and exception logic in one controlled framework."],
  ["MODEL INTEGRATION", "Connect scoring, analytical models and external data sources directly into the decision flow."],
  ["DECISION FLOWS", "Automate approve, decline, refer, escalate and routing logic through explicit operational paths."],
  ["CHAMPION / CHALLENGER", "Test alternative models, rules and strategies in parallel before changing the live decision policy."],
  ["SIMULATION & OPTIMISATION", "Simulate decision strategies and policy changes before deployment and refine them using observed outcomes."],
];

const process = [
  ["01", "DIAGNOSE", "We map the existing decisions, rules, models, data sources and exception paths."],
  ["02", "ARCHITECT", "We design one executable decision architecture with clear ownership, logic and control points."],
  ["03", "IMPLEMENT", "We connect data, models and business rules into operational decision flows."],
  ["04", "OPTIMISE", "We test, monitor and improve strategies using feedback from real outcomes, simulations and challenger approaches."],
];

const outcomes = [
  ["CONSISTENT EXECUTION", "Apply the same decision logic and policy across comparable cases."],
  ["REAL-TIME DECISIONS", "Execute routine decisions automatically where rules, models, policy and controls provide sufficient confidence, while exceptions remain reviewable."],
  ["TRACEABLE LOGIC", "See which data, model, rule or exception influenced each decision."],
  ["FASTER STRATEGY TESTING", "Simulate and compare alternative policies before changing production logic."],
];

const useCases = [
  ["CREDIT DECISIONS", "Where scoring, policy, limits and approval logic need to work as one controlled process."],
  ["AML & COMPLIANCE", "Where risk scores, rules, escalation and review logic need to be executed consistently."],
  ["OPERATIONAL RISK", "Where decisions depend on a combination of data, models, policy and business rules."],
];

const related = [
  ["Credit Risk", "Models, policy and portfolio controls connected across the full credit lifecycle.", "/services/credit-risk"],
  ["AML & Compliance", "KYC, monitoring, investigations and evidence connected in one control architecture.", "/services/aml-compliance"],
  ["Risk AI Agents", "Governed agents supporting risk analysis, monitoring and controlled execution.", "/services/risk-ai-agents"],
];

function SectionHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function DecisionAutomationPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/decision-automation", name: "Decision Intelligence Consulting", description: "Build decision engines that connect data, analytical models, business rules and policy into traceable operational decision flows.", breadcrumbSection: "Decision Science", breadcrumbName: "Decision Intelligence" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="decision-automation-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Decision Science</span><span>/</span><Link href="/services/decision-automation" aria-current="page">Decision Intelligence</Link></nav>
          <span className={styles.category}>DECISION INTELLIGENCE</span>
          <h1 id="decision-automation-title">A model can recommend.<br />A decision engine can execute.</h1>
          <p className={styles.lead}>Turn data, models, rules and policy into one traceable execution layer that makes consistent business decisions in real time.</p>
          <p className={styles.support}><strong>The decision is only as good as the logic behind it.</strong> Connect data, models, business rules, exceptions and policy into one controlled flow — from input to final decision.</p>
          <Link className={styles.primaryButton} href="/contact?topic=decision-automation">Discuss Your Decision Architecture <span aria-hidden="true">→</span></Link>
        </div>
        <DecisionEngineDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title={<>One decision architecture.<br />From signal to action.</>} />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Map the logic.<br />Build the engine.<br />Control the outcome.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title={<>Faster decisions.<br />Without losing control of the logic.</>} />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When decision logic lives across multiple systems, consistency disappears.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>A consumer lender uses scoring models, policy rules, manual checks and external data across separate systems, making decisions harder to trace and change.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We connect models, policy, business rules and data into one executable decision flow with clear review and escalation paths.</dd></div>
            <div><dt>RESULT</dt><dd>Management can trace how each decision was made, test alternative strategies and change policy without rebuilding the full process.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT APPLIES" title="Where does decision architecture create the most value?" intro="If the logic exists but cannot be executed consistently, you don't yet have a decision system." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>DECISION INTELLIGENCE</span><h2 id="cta-title">Business logic becomes valuable when it can execute.</h2><p>Build a decision engine that turns models, rules and policy into controlled operational decisions.</p><Link className={styles.ctaButton} href="/contact?topic=decision-automation">Discuss Your Decision Architecture <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
