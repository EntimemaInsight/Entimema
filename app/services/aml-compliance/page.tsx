import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { DemoTrigger } from "@/components/DemoDiscovery";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";
import AmlOperationsDashboard from "./AmlOperationsDashboard";
import styles from "../credit-risk/credit-risk.module.css";

export const metadata: Metadata = {
  title: "AML & Fraud Investigation | Entimema",
  description: "Design consistent, reviewable AML and fraud workflows across customer risk, screening, transaction monitoring, alert triage and investigation.",
  alternates: { canonical: "/services/aml-compliance" },
};

const capabilities = [
  ["KYC & CUSTOMER RISK", "Define identification, risk assessment and periodic review processes around customer risk."],
  ["SANCTIONS & PEP SCREENING WORKFLOWS", "Structure screening rules, evidence and escalation paths for sanctions and PEP exposure."],
  ["TRANSACTION MONITORING SCENARIOS", "Design scenarios, thresholds and controls that identify behaviour requiring investigation."],
  ["ALERT TRIAGE & PRIORITISATION", "Route alerts by risk, materiality and the review required."],
  ["CONTROL EFFECTIVENESS & INVESTIGATION ANALYTICS", "Measure alert quality, false-positive rates, investigation flow and control effectiveness."],
  ["INVESTIGATION WORKFLOW DESIGN", "Define how alerts, evidence, analyst review, escalation and final disposition move through one controlled process."],
];

const process = [
  ["01", "DIAGNOSE", "We assess existing AML policies, scenarios, data, controls and investigation workflows."],
  ["02", "DESIGN", "We define scenarios, thresholds, escalation logic and the control architecture around the business model."],
  ["03", "IMPLEMENT", "We connect AML rules and workflows to systems, data and operational responsibilities."],
  ["04", "OPTIMISE", "We calibrate scenarios, review outcomes and improve control effectiveness where evidence supports change."],
];

const outcomes = [
  ["TRACEABLE COMPLIANCE", "Policies, controls and evidence operate within one auditable architecture."],
  ["BETTER ALERT QUALITY", "Scenarios and thresholds are calibrated around actual risk and operational outcomes."],
  ["CLEARER CASE FLOW", "Alerts move through defined review, escalation and decision paths."],
  ["CONTROL VISIBILITY", "Management can see how risk events, investigations and control effectiveness connect."],
];

const useCases = [
  ["BANKS", "Where customer risk, transaction monitoring and regulatory expectations require a consistent control model."],
  ["CONSUMER LENDERS", "Where KYC, sanctions screening and transaction monitoring must scale with high-volume onboarding and servicing."],
  ["LEASING COMPANIES", "Where AML controls need to operate consistently across customer onboarding, transactions and regulatory obligations."],
];

const related = [
  ["Credit Risk & Decisioning", "Scorecards, policy, decision strategies and portfolio monitoring across the credit lifecycle.", "/services/credit-risk"],
  ["AML & Fraud Investigation", "Customer risk, monitoring, triage and investigations connected in reviewable workflows.", "/services/aml-compliance"],
  ["Decision Intelligence", "Data, models and policy translated into traceable automated decisions.", "/services/decision-automation"],
];

function SectionHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function AmlCompliancePage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/aml-compliance", name: "AML & Fraud Investigation", description: "Design consistent, reviewable AML and fraud workflows across customer risk, screening, transaction monitoring, alert triage and investigation.", breadcrumbName: "AML & Fraud Investigation" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="aml-compliance-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Risk &amp; Decisioning</span><span>/</span><Link href="/services/aml-compliance" aria-current="page">AML &amp; Fraud Investigation</Link></nav>
          <span className={styles.category}>AML &amp; FRAUD INVESTIGATION</span>
          <h1 id="aml-compliance-title">Turn alerts into consistent, reviewable investigations.</h1>
          <p className={styles.lead}>Design AML and fraud workflows that connect customer risk, screening, transaction monitoring, alert triage, case management and escalation—without losing the evidence behind each decision.</p>
          <p className={styles.support}><strong>An alert is not a finding.</strong> Give investigators the context, controls and review path required to reach a defensible disposition.</p>
          <DemoTrigger className={styles.primaryButton} initialInterest="Other">Discuss your investigation workflow</DemoTrigger>
        </div>
        <AmlOperationsDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title={<>One investigation workflow.<br />From alert to disposition.</>} />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Define the risk.<br />Design the control.<br />Prove the process.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title={<>Fewer blind spots.<br />More defensible control.</>} />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When AML controls operate separately, risk falls between them.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>An online gaming operator relies on multiple independent rules, manual reviews and fragmented visibility across customer and transaction risk.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We connect KYC, sanctions screening, transaction monitoring, case management and AML analytics into one operating architecture.</dd></div>
            <div><dt>RESULT</dt><dd>Risk events move through a clearer, traceable process from detection to investigation, escalation and regulatory action.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT APPLIES" title="Where do controlled investigations create the most value?" intro="If you can detect the alert but cannot trace the decision, the control is incomplete." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>AML &amp; FRAUD INVESTIGATION</span><h2 id="cta-title">Build a clearer path from alert to defensible disposition.</h2><p>Connect risk signals, evidence, analyst review and escalation in one controlled investigation workflow.</p><DemoTrigger className={styles.ctaButton} initialInterest="Other">Discuss your investigation workflow</DemoTrigger></div></div></section>
    </main>
  );
}
