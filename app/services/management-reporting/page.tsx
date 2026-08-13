import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ManagementDashboard from "./ManagementDashboard";
import styles from "./management-reporting.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Management Reporting Consulting | Entimema",
  description: "Turn fragmented financial and operational reporting into timely management information, clear KPIs and decision-ready performance analysis.",
  path: "/services/management-reporting",
});

const capabilities = [
  ["MANAGEMENT KPIs", "Metrics defined around how the business is actually managed."],
  ["EXECUTIVE DASHBOARDS", "Management views organised around decisions, not accounting statements."],
  ["FINANCIAL ANALYSIS", "Variance, trend and driver analysis that explains what is behind the result."],
  ["OPERATIONAL REPORTING", "Connect financial outcomes with production, sales and operational performance."],
  ["REPORTING FRAMEWORK", "Standard reports, clear ownership, publication rhythm and one information structure."],
  ["AUTOMATION & AI", "Automate data collection, validation and distribution where it improves reliability and speed."],
];
const process = [
  ["01", "DIAGNOSE", "We assess how management uses information today and where visibility breaks down."],
  ["02", "DESIGN", "We define KPIs, reporting logic and the information flows behind them."],
  ["03", "IMPLEMENT", "We build dashboards, reports and automated update processes."],
  ["04", "EVOLVE", "We refine the reporting system as the business and its decision needs change."],
];
const outcomes = [
  ["ONE MANAGEMENT VIEW", "Key financial and operational measures within one consistent structure."],
  ["TIMELIER DECISIONS", "The right information reaches management when it can still change the outcome."],
  ["STRONGER ANALYSIS", "Financial results are interpreted together with the operational drivers behind them."],
  ["LESS MANUAL WORK", "Reduce repetitive reporting work through automation and standardisation."],
];
const useCases = [
  ["REPORTING LIVES IN MULTIPLE FILES", "When management depends on multiple Excel files and KPI definitions vary across teams."],
  ["FINANCE AND OPERATIONS DISAGREE", "When finance and operations report different versions of performance."],
  ["REPORTING ARRIVES TOO LATE", "When reporting arrives after the decision window has passed."],
  ["MORE DATA HAS NOT CREATED MORE CLARITY", "When ERP implementation has increased data, but not clarity, or group companies need one reporting logic across entities."],
];
const related = [
  ["CFO Advisory", "The financial structure, management information and decision processes behind a CFO function.", "/services/cfo-function"],
  ["Planning & Forecasting", "Budgets, forecasts and scenarios connected to the drivers of the business.", "/services/budgets-and-forecasting"],
  ["Financial Data", "One reliable foundation for reporting, analysis and financial control.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function ManagementReportingPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/management-reporting", name: "Management Reporting Consulting", description: "Turn fragmented financial and operational reporting into timely management information, clear KPIs and decision-ready performance analysis.", breadcrumbSection: "Finance", breadcrumbName: "Management Reporting" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="management-reporting-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">Management Reporting</span></nav>
          <span className={styles.category}>MANAGEMENT REPORTING</span>
          <h1 id="management-reporting-title">More reports don&apos;t mean more clarity.</h1>
          <p className={styles.lead}>See the business the way management needs to see it.</p>
          <p className={styles.support}>Build management reporting around the decisions your business needs to make — connecting financial performance, operational drivers and management action in one consistent view.</p>
          <Link className={styles.primaryButton} href="/contact?topic=management-reporting">Discuss Your Management Reporting <span aria-hidden="true">→</span></Link>
        </div>
        <ManagementDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container"><SectionHeader label="WHAT IT INCLUDES" title="Reporting works when the structure matches the decisions." /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container"><SectionHeader label="HOW WE WORK" title={<>Start with the decisions.<br />Build the information around them.</>} /><ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container"><SectionHeader label="WHAT YOU GET" title={<>Less reporting friction.<br />More management visibility.</>} /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><aside className={styles.caseExample} aria-labelledby="case-example-title"><div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When finance and operations tell different stories, management loses the picture.</h3></div><dl><div><dt>SCENARIO</dt><dd>A manufacturing company prepares financial and operational reporting separately, with no shared KPI framework and limited ability to explain variances.</dd></div><div><dt>ENTIMEMA APPROACH</dt><dd>We connect ERP data, management KPIs and executive dashboards into one reporting structure.</dd></div><div><dt>RESULT</dt><dd>Management gets a timely, consistent and reliable view of performance for day-to-day decisions. Our research on <Link href="/resources/from-erp-data-to-management-intelligence">ERP data for management intelligence</Link> explains the information layers beneath that reporting view.</dd></div></dl></aside></div></section>
      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container"><SectionHeader label="WHERE IT APPLIES" title="When does reporting stop supporting management?" intro="If management has to reconcile the reports before it can use them, the reporting system is already too slow." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className={styles.section} aria-labelledby="related-title"><div className="site-container"><SectionHeader label="NEXT STEP" title="Related services" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>MANAGEMENT REPORTING</span><h2 id="cta-title">Your reporting should answer the question before management has to ask twice.</h2><p>Build a management information system around the decisions, KPIs and reporting rhythm your business actually needs.</p><Link className={styles.ctaButton} href="/contact?topic=management-reporting">Discuss Your Management Reporting <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
