import type { ReactNode } from "react";
import Link from "next/link";
import { DemoTrigger } from "@/components/DemoDiscovery";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CreditRiskDashboard from "./CreditRiskDashboard";
import styles from "./credit-risk.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Credit Risk & Decisioning | Entimema",
  description: "Connect scorecards, credit policy, decision strategies and portfolio monitoring across the full credit lifecycle.",
  path: "/services/credit-risk",
});

const capabilities = [
  ["APPLICATION SCORECARDS & RISK SEGMENTATION", "Assess new applicants through models and segments aligned with risk appetite and credit policy."],
  ["CREDIT POLICY & DECISION STRATEGIES", "Translate risk appetite into cut-offs, rules, limits and approval paths."],
  ["BEHAVIOURAL SCORING & EARLY WARNING", "Reassess customers as behaviour, exposure and repayment patterns change."],
  ["VINTAGE, ROLL-RATE & MIGRATION ANALYSIS", "Track origination quality, delinquency movement and portfolio performance over time."],
  ["MODEL MONITORING & CALIBRATION", "Measure discrimination, stability and strategy outcomes and recalibrate where evidence supports change."],
  ["CONTROLLED DECISION WORKFLOW DESIGN", "Connect models, policy, exceptions, approvals and monitoring in a controlled decision process."],
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
  ["Credit Risk & Decisioning", "Scorecards, policy, decision strategies and portfolio monitoring across the credit lifecycle.", "/services/credit-risk"],
  ["AML & Fraud Investigation", "Customer risk, monitoring, triage and investigations connected in reviewable workflows.", "/services/aml-compliance"],
  ["Decision Intelligence", "Data, models and policy translated into traceable automated decisions.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function CreditRiskPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/credit-risk", name: "Credit Risk & Decisioning", description: "Connect scorecards, credit policy, decision strategies and portfolio monitoring across the full credit lifecycle.", breadcrumbName: "Credit Risk & Decisioning" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="credit-risk-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Risk &amp; Decisioning</span><span>/</span><Link href="/services/credit-risk" aria-current="page">Credit Risk &amp; Decisioning</Link></nav>
          <span className={styles.category}>CREDIT RISK &amp; DECISIONING</span>
          <h1 id="credit-risk-title">Make credit decisions consistently—and see how they shape portfolio risk.</h1>
          <p className={styles.lead}>Connect scorecards, credit policy, decision strategies and portfolio monitoring across the full credit lifecycle.</p>
          <p className={styles.support}>From application assessment to behavioural monitoring, every decision should be explainable, measurable and linked to observed portfolio outcomes.</p>
          <DemoTrigger className={styles.primaryButton} initialInterest="Credit Risk">Discuss your credit-risk challenge</DemoTrigger>
        </div>
        <CreditRiskDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title={<>One controlled decision framework.<br />Across the full credit lifecycle.</>} />
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
        <SectionHeader label="WHERE IT APPLIES" title="Where does controlled credit decisioning create the most value?" intro="If you can explain the score but not the decision, the workflow is incomplete." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>CREDIT RISK &amp; DECISIONING</span><h2 id="cta-title">Connect every credit decision to policy, evidence and portfolio outcomes.</h2><p>Strengthen risk methodology and build controlled workflows across the credit lifecycle.</p><DemoTrigger className={styles.ctaButton} initialInterest="Credit Risk">Discuss your credit-risk challenge</DemoTrigger></div></div></section>
    </main>
  );
}
