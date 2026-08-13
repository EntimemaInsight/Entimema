import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PlanningDashboard from "./PlanningDashboard";
import styles from "./budgets-and-forecasting.module.css";

export const metadata: Metadata = {
  title: "Financial Forecasting Consulting | Entimema",
  description: "Replace static plans with driver-based forecasting, rolling updates and scenarios that connect operations, financial outcomes and cash decisions.",
  alternates: { canonical: "/services/budgets-and-forecasting" },
};

const capabilities = [
  ["BUDGET ARCHITECTURE", "A clear planning structure, ownership, calendar and rules for the entire budget cycle."],
  ["DRIVER-BASED MODELS", "Forecast revenue, costs and margins through the business drivers that actually move them."],
  ["ROLLING FORECASTS", "Update expectations as actual performance changes — not once a year."],
  ["SCENARIO PLANNING", "Test how different assumptions change performance, liquidity and decision options."],
  ["CASH FLOW PLANNING", "Connect operational plans to future cash requirements and funding needs."],
  ["PLANNING AUTOMATION & AI", "Automate data collection, forecast updates and variance analysis where it adds real value."],
];
const process = [
  ["01", "DIAGNOSE", "We assess the current planning process, data sources, assumptions and ownership."],
  ["02", "MODEL", "We define the key business drivers and connect operational assumptions to financial outcomes."],
  ["03", "IMPLEMENT", "We build budgets, forecasts, scenarios and update rules into one working planning system."],
  ["04", "RUN", "We establish a recurring rhythm for variance analysis, forecast updates and management decisions."],
];
const outcomes = [
  ["ONE CONNECTED PLANNING PROCESS", "Financial and operational plans work within one consistent structure."],
  ["TRACEABLE ASSUMPTIONS", "See which drivers sit behind the forecast and how changes affect the outcome."],
  ["A CURRENT VIEW OF THE FUTURE", "Update expectations as the business changes."],
  ["LIQUIDITY VISIBILITY", "See future cash requirements and how sensitive they are to different scenarios."],
];
const useCases = [
  ["GROWTH OUTRUNS THE PLAN", "When growth moves faster than the planning process."],
  ["COMPLEXITY OUTGROWS STATIC BUDGETS", "When products, units and markets make the model too complex for static budgets."],
  ["ASSUMPTIONS CHANGE TOO SLOWLY", "When prices, volumes or market conditions change faster than assumptions are updated."],
  ["THE GROUP NEEDS ONE PLANNING LOGIC", "When group companies need one planning logic across multiple entities."],
];
const related = [
  ["CFO Advisory", "The financial structure, management information and decision processes behind a CFO function.", "/services/cfo-function"],
  ["Management Reporting", "Clear management information built around the decisions that need to be made.", "/services/management-reporting"],
  ["Financial Data", "One reliable foundation for reporting, analysis and financial control.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: string }) {
  return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>;
}

export default function BudgetsAndForecastingPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar active="services" />
      <section className={styles.hero} aria-labelledby="budgets-title"><div className={`site-container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">Planning &amp; Forecasting</span></nav>
          <span className={styles.category}>PLANNING &amp; FORECASTING</span>
          <h1 id="budgets-title">A budget is a snapshot.</h1>
          <p className={styles.lead}>Your business isn&apos;t.</p>
          <p className={styles.support}>Build a planning system that moves with the business — connecting operational drivers, financial outcomes and cash before reality makes the plan obsolete.</p>
          <Link className={styles.primaryButton} href="/contact?topic=budgets-and-forecasting">Discuss Your Planning System <span aria-hidden="true">→</span></Link>
        </div>
        <PlanningDashboard />
      </div></section>

      <section className={styles.section} aria-labelledby="capabilities-title"><div className="site-container">
        <SectionHeader label="WHAT IT INCLUDES" title="Planning works when the assumptions are visible." />
        <div className={styles.capabilityGrid}>{capabilities.map(([title, copy], index) => <article className={styles.capability} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="process-title"><div className="site-container">
        <SectionHeader label="HOW WE WORK" title={<>Start with the drivers.<br />Build the forecast around them.</>} />
        <ol className={styles.timeline}>{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>

      <section className={styles.section} aria-labelledby="outcomes-title"><div className="site-container">
        <SectionHeader label="WHAT YOU GET" title={<>A forecast you can explain.<br />A plan you can still use.</>} />
        <div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <aside className={styles.caseExample} aria-labelledby="case-example-title">
          <div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="case-example-title">When the plan is built on history, the future stays hidden.</h3></div>
          <dl>
            <div><dt>SCENARIO</dt><dd>A manufacturing company builds its annual budget mainly from historical values, with limited connection to production drivers and no regular forecast refresh.</dd></div>
            <div><dt>ENTIMEMA APPROACH</dt><dd>We build a driver-based model connecting volumes, capacity, materials, prices, costs and cash flows — supported by scenarios and rolling forecasts.</dd></div>
            <div><dt>RESULT</dt><dd>Management gains a current view of expected performance and a traceable link between operational assumptions, financial results and liquidity. See how the model works in our <Link href="/resources/operational-driver-forecasting">operational-driver forecasting framework</Link>.</dd></div>
          </dl>
        </aside>
      </div></section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="applications-title"><div className="site-container">
        <SectionHeader label="WHERE IT APPLIES" title="When does planning stop being useful?" intro="If the plan changes slower than the business, it stops being a management tool." />
        <div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className={styles.section} aria-labelledby="related-title"><div className="site-container">
        <SectionHeader label="NEXT STEP" title="Related services" />
        <div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div>
      </div></section>

      <section className={styles.ctaSection} aria-labelledby="cta-title"><div className="site-container"><div className={styles.ctaBlock}><span>PLANNING &amp; FORECASTING</span><h2 id="cta-title">Your forecast should change before the business forces it to.</h2><p>Build a planning system around the drivers, scenarios and cash decisions that matter now.</p><Link className={styles.ctaButton} href="/contact?topic=budgets-and-forecasting">Discuss Your Planning System <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
