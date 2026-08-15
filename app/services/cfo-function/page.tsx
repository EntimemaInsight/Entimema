import Link from "next/link";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CfoDashboard from "./CfoDashboard";
import styles from "./cfo-function.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Fractional CFO Services & Advisory | Entimema",
  description: "Build senior finance capability, management information and decision processes without committing to a full CFO organisation from day one.",
  path: "/services/cfo-function",
});

const capabilities = [
  ["FINANCIAL PLANNING", "Budgets, forecasts and scenarios connected to the drivers of the business."],
  ["MANAGEMENT REPORTING", "Clear management information built around the decisions that need to be made."],
  ["CASH & LIQUIDITY", "Visibility over cash generation, working capital and future funding needs."],
  ["COST & MARGIN CONTROL", "Understand where value is created, where margin is lost and what drives profitability."],
  ["PERFORMANCE MANAGEMENT", "KPIs and financial measures connected to operational performance."],
  ["FINANCIAL CONTROL", "Processes, responsibilities and controls that make financial information reliable."],
];
const process = [
  ["01", "UNDERSTAND", "We identify the decisions management needs to make and the financial information those decisions require."],
  ["02", "STRUCTURE", "We connect data, processes, responsibilities and models into a financial management system."],
  ["03", "EMBED", "We put the system into the way the business actually operates — reporting cycles, planning, controls and management routines."],
  ["04", "CONTROL", "We establish the ownership and management rhythm that keep the financial system reliable as the business changes."],
];
const outcomes = [
  ["ONE MANAGEMENT VIEW", "A consistent financial picture across performance, cash, costs and forecasts."],
  ["EARLIER VISIBILITY", "See pressure on margins, liquidity and performance before it becomes harder to correct."],
  ["CLEARER ACCOUNTABILITY", "Know who owns the numbers, the process and the next action."],
  ["BETTER DECISIONS", "Give management the financial context to decide with greater confidence."],
];
const useCases = [
  ["ACCOUNTING IS NO LONGER ENOUGH", "The business has outgrown accounting-only information."],
  ["REPORTING CANNOT KEEP UP", "Management reporting takes too long or depends heavily on Excel."],
  ["THE NUMBERS DO NOT EXPLAIN THE DRIVERS", "Margins are visible, but their drivers are not. Budgets exist, but forecasts do not evolve with the business."],
  ["DECISIONS STILL DEPEND ON ONE PERSON", "Different teams work with different versions of the numbers. Cash surprises management. The CEO is still acting as the financial decision hub."],
];
const related = [
  ["Planning & Forecasting", "Budgets, forecasts and scenarios connected to the drivers of the business.", "/services/budgets-and-forecasting"],
  ["Management Reporting", "Clear management information built around the decisions that need to be made.", "/services/management-reporting"],
  ["Financial Data", "One reliable foundation for reporting, analysis and financial control.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function CfoFunctionPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/cfo-function", name: "Fractional CFO Services & Advisory", description: "Build senior finance capability, management information and decision processes without committing to a full CFO organisation from day one.", breadcrumbSection: "Finance", breadcrumbName: "CFO Advisory" })) }} />
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="cfo-title">
        <div className={`site-container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">CFO Advisory</span></nav>
            <span className={styles.category}>CFO ADVISORY</span>
            <h1 id="cfo-title">You don&apos;t always need a CFO.</h1>
            <p className={styles.lead}>You need the financial system behind one.</p>
            <p className={styles.support}>Build the financial structure, management information and decision processes your business needs — without building a full CFO organisation from day one.</p>
            <Link className={styles.primaryButton} href="/contact?topic=cfo-function">{PRIMARY_COMMERCIAL_CTA}</Link>
          </div>
          <CfoDashboard />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title={<>A CFO function is a system.<br />Not a job title.</>} intro="We build the financial disciplines your management team needs — around the structure, complexity and stage of your business." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Start with the decisions.<br />Build backwards.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title={<>Less financial noise.<br />More management clarity.</>} />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When the numbers disagree, management loses visibility.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>A manufacturing company sees revenue growing, while margins continue to weaken. Accounting, production and management reports tell different versions of the same business.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We connect production volumes, material consumption, cost allocation, margins and financial reporting into one management view.</dd></div>
            <div><dt>RESULT</dt><dd>Management can see what is changing, why it is changing and where action is required. The practical mechanics are developed further in our research on <Link href="/resources/working-capital-as-a-system">working capital as an operating system</Link>.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT FITS" title="When does a CFO function become necessary?" intro="You may not need a full CFO organisation yet. But you may already need the function." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>CFO ADVISORY</span><h2 id="cta-title">Your finance function doesn&apos;t have to grow all at once.</h2><p>Start with the decisions, processes and information your business needs now. Build from there.</p><Link className={styles.ctaButton} href="/contact?topic=cfo-function">{PRIMARY_COMMERCIAL_CTA}</Link></div></div></section>
    </main>
  );
}
