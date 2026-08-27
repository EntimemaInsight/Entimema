import Link from "next/link";
import { DemoTrigger } from "@/components/DemoDiscovery";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import FinancialDataDashboard from "./FinancialDataDashboard";
import styles from "./financial-data.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Financial Data Analytics & Architecture | Entimema",
  description: "Turn fragmented ERP and finance data into reconciled, traceable analytics for reporting, planning, modelling and management decisions.",
  path: "/services/financial-data",
});

const capabilities = [
  ["ERP INTEGRATION", "Connect financial data across ERP and the business systems that feed it."],
  ["FINANCIAL DATA MODEL", "Create one consistent structure for accounts, entities, cost centres and management dimensions."],
  ["DATA QUALITY", "Validate, standardise and control the information before it reaches reporting or analysis."],
  ["MASTER DATA GOVERNANCE", "Keep financial and organisational structures consistent across systems and processes."],
  ["DATA AUTOMATION", "Automate collection, transformation and synchronisation to reduce manual handling."],
  ["AI-READY DATA", "Prepare trusted financial data for AI analysis, agents and automated decision workflows."],
];

const process = [
  ["01", "MAP", "We trace financial data from source systems through reporting, planning and analysis."],
  ["02", "STRUCTURE", "We define one financial data model, common definitions and clear ownership."],
  ["03", "CONNECT", "We integrate ERP, files and external systems into consistent information flows."],
  ["04", "GOVERN", "We establish validation, traceability and controls that keep the data reliable over time."],
];

const outcomes = [
  ["ONE SOURCE OF TRUTH", "A consistent financial foundation for reporting, planning and analysis."],
  ["CONSISTENT DEFINITIONS", "Accounts, entities, dimensions and business rules mean the same thing across the organisation."],
  ["LESS MANUAL HANDLING", "Reduce repetitive extraction, reconciliation and transformation work."],
  ["TRUSTED DECISION INPUTS", "Give management information it can use without first questioning the source."],
];

const useCases = [
  ["ERP TRANSFORMATION", "When a new or upgraded ERP changes structures, mappings and information flows."],
  ["MULTI-ENTITY GROUPS", "When companies use different systems, charts of accounts and management dimensions."],
  ["FRAGMENTED SYSTEM LANDSCAPES", "When finance depends on multiple disconnected sources and manual reconciliation."],
  ["AI & AUTOMATION READINESS", "When AI agents and automation require trusted, structured and traceable financial data."],
];

const related = [
  ["Management Reporting", "Clear management information built around the decisions that need to be made.", "/services/management-reporting"],
  ["Planning & Forecasting", "Budgets, forecasts and scenarios connected to the drivers of the business.", "/services/budgets-and-forecasting"],
  ["Cost & Margin Management", "Transparent cost models and margin analysis across the economics of the business.", "/services/cost-and-profitability"],
  ["Finance AI Agents", "AI agents for recurring financial analysis, reporting and operational workflows.", "/services/financial-ai-agents"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: React.ReactNode }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function FinancialDataPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/financial-data", name: "Financial Data Analytics & Architecture", description: "Turn fragmented ERP and finance data into reconciled, traceable analytics for reporting, planning, modelling and management decisions.", breadcrumbName: "Financial Data" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="financial-data-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">Financial Data</span></nav>
          <span className={styles.category}>FINANCIAL DATA</span>
          <h1 id="financial-data-title">Financial data analytics starts with trusted data.</h1>
          <p className={styles.lead}>If the numbers don&apos;t reconcile, the decision shouldn&apos;t start yet.</p>
          <p className={styles.support}>Build one reliable financial data foundation across ERP, reporting, planning and analytics — so every decision starts from the same version of the truth.</p>
          <DemoTrigger className={styles.primaryButton} initialInterest="Financial Data & ERP" />
        </div>
        <FinancialDataDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="WHAT IT INCLUDES" title="Reliable decisions begin with reliable data." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="HOW WE WORK" title={<>Trace the data.<br />Define the structure.<br />Control the truth.</>} /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="WHAT YOU GET" title={<>One financial truth.<br />Across every decision.</>} /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="scenario-title"><div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="scenario-title">When every report starts with reconciliation, the data architecture is the problem.</h3></div><dl><div><dt>SCENARIO</dt><dd>A manufacturing company pulls financial information from ERP, spreadsheets and operational systems with inconsistent structures and limited traceability.</dd></div><div><dt>ENTIMEMA APPROACH</dt><dd>We connect the sources, define one financial data model and establish validation rules across reporting, planning and analytics.</dd></div><div><dt>RESULT</dt><dd>Management works from a consistent, traceable information foundation ready for reporting, automation and AI. The supporting <Link href="/resources/from-erp-data-to-management-intelligence">ERP-to-management intelligence framework</Link> explains the reconciliation and semantic layers behind that transition.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="WHERE IT APPLIES" title="When does financial data become a management problem?" intro={<>If every report needs a different reconciliation, you don&apos;t have a reporting problem.<br />You have a data problem.</>} /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="NEXT STEP" title="Related services" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>FINANCIAL DATA</span><h2 id="cta-title">Your financial system is only as reliable as the data underneath it.</h2><p>Build one trusted data foundation for reporting, planning, analysis and AI.</p><DemoTrigger className={styles.ctaButton} initialInterest="Financial Data & ERP" /></div></div></section>
    </main>
  );
}
