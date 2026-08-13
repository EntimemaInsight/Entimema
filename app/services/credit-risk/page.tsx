import type { ReactNode } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CreditRiskDashboard from "./CreditRiskDashboard";
import styles from "./credit-risk.module.css";
import { createServiceMetadata } from "@/lib/seo";

export const metadata = createServiceMetadata({
  title: "Credit Risk Consulting & Modelling | Entimema",
  description: "Strengthen credit decisions with specialist consulting across risk models, policy, portfolio analytics and controlled implementation.",
  path: "/services/credit-risk",
});

const capabilities = [
  ["APPLICATION SCORING", "Assess new applicants through models built around risk differentiation and credit policy."],
  ["BEHAVIOURAL SCORING", "Reassess customers as behaviour, exposure and repayment patterns change."],
  ["PORTFOLIO MONITORING", "Track DPD migration, vintage performance, roll rates and portfolio quality over time."],
  ["DECISION STRATEGIES", "Translate models and policy into cut-offs, rules, champion/challenger strategies and automated decisions."],
  ["PORTFOLIO SIMULATION", "Test transition matrices, stress scenarios and expected portfolio outcomes before changing policy."],
  ["AI RISK AUTOMATION", "Use governed AI agents to analyse, monitor and support recurring credit-risk workflows."],
];

const process = [
  ["01", "DIAGNOSE", "We assess existing models, policies, data and credit decision processes."],
  ["02", "MODEL", "We build or refine scoring models, risk segmentation and decision logic around the portfolio."],
  ["03", "IMPLEMENT", "We connect models, policy and decision rules to operational workflows and portfolio monitoring."],
  ["04", "OPTIMISE", "We monitor model performance, portfolio behaviour and strategy outcomes and adjust where evidence supports change."],
];

const outcomes = [
  ["CONSISTENT CREDIT DECISIONS", "Apply the same risk logic, policy and control framework across comparable cases."],
  ["EARLIER RISK VISIBILITY", "Detect deterioration through application quality, behavioural signals and portfolio movement."],
  ["TRACEABLE AUTOMATION", "Automate decisions through explicit rules, models and approval logic."],
  ["PORTFOLIO CONTROL", "Connect origination quality, customer behaviour and portfolio outcomes in one monitoring framework."],
];

const useCases = [
  ["BANKS", "Where multiple products, policies and regulatory expectations require consistent credit-risk decisions."],
  ["LEASING COMPANIES", "Where risk must be assessed and monitored across the full financing lifecycle."],
  ["CONSUMER LENDERS", "Where high decision volumes require robust scoring, policy automation and portfolio monitoring."],
];

const related = [
  ["Credit Risk", "Models, policy and portfolio controls connected across the full credit lifecycle.", "/services/credit-risk"],
  ["AML & Compliance", "Policies, scenarios and models for controlled, traceable AML processes.", "/services/aml-compliance"],
  ["Decision Intelligence", "Data, models and policy translated into traceable automated decisions.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function CreditRiskPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="credit-risk-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Decision Science</span><span>/</span><Link href="/services/credit-risk" aria-current="page">Credit Risk</Link></nav>
          <span className={styles.category}>CREDIT RISK</span>
          <h1 id="credit-risk-title">Credit risk consulting that sees risk before it becomes expensive.</h1>
          <p className={styles.lead}>Build credit risk models, decision strategies and portfolio controls that identify risk earlier, apply policy consistently and make every credit decision traceable.</p>
          <p className={styles.support}><strong>A score is not a decision. It is one input into one.</strong> Connect scoring, policy, cut-offs, portfolio behaviour and decision logic into one credit architecture — so risk is measured consistently from application to portfolio performance.</p>
          <Link className={styles.primaryButton} href="/contact?topic=credit-risk">Discuss Your Credit Risk Architecture <span aria-hidden="true">→</span></Link>
        </div>
        <CreditRiskDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title={<>One risk architecture.<br />Across the full credit lifecycle.</>} />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Measure the risk.<br />Define the policy.<br />Control the decision.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title="Every credit decision should be measurable, explainable and controlled." />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When models, policy and portfolio monitoring are disconnected, risk becomes inconsistent.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>A consumer lender uses different scoring models, manual credit policies and fragmented portfolio monitoring, making it difficult to understand how origination decisions affect later portfolio performance.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We connect application scoring, behavioural scoring, decision strategies and portfolio monitoring into one credit-risk architecture.</dd></div>
            <div><dt>RESULT</dt><dd>Management can trace how risk enters the portfolio, how it develops and how policy changes affect credit decisions over time. Our <Link href="/resources/credit-vintage-analysis">credit vintage analysis framework</Link> explains how comparable origination cohorts reveal changes hidden by portfolio averages.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT APPLIES" title="Where does credit risk architecture create the most value?" intro="If you can explain the score but not the decision, the architecture is incomplete." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>CREDIT RISK</span><h2 id="cta-title">A credit model should do more than rank risk.<br />It should shape the decision.</h2><p>Build one credit architecture around models, policy, automation and portfolio performance.</p><Link className={styles.ctaButton} href="/contact?topic=credit-risk">Discuss Your Credit Risk Architecture <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
