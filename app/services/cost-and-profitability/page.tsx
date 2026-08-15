import Link from "next/link";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CostDashboard from "./CostDashboard";
import styles from "./cost-and-profitability.module.css";
import { createServiceMetadata } from "@/lib/seo";
import { createServicePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createServiceMetadata({
  title: "Cost & Profitability Analysis | Entimema",
  description: "Understand where value is created or lost through transparent cost models, manufacturing cost analysis, margin drivers and product profitability.",
  path: "/services/cost-and-profitability",
});

const capabilities = [
  ["COST MODELS", "Build transparent cost models that show how resources, processes and allocations become unit cost."],
  ["PROFITABILITY ANALYSIS", "See profitability across products, customers, processes and business units."],
  ["COST DRIVERS", "Identify the operational and financial factors that actually move cost and margin."],
  ["MARGIN ANALYSIS", "Trace gross, contribution and operating margins — and understand what changes them."],
  ["SCENARIO MODELLING", "Test how price, volume, input costs and product mix change profitability."],
  ["AUTOMATION & AI", "Automate cost calculations, variance detection and profitability analysis where it improves speed and control."],
];
const process = [
  ["01", "DIAGNOSE", "We trace how costs are created, allocated and reflected in current profitability reporting."],
  ["02", "MODEL", "We define cost drivers, allocation logic and profitability dimensions around the economics of the business."],
  ["03", "IMPLEMENT", "We connect the model to financial and operational data and build the required calculations and analysis."],
  ["04", "CONTROL", "We establish recurring variance, margin and profitability analysis as part of the management process."],
];
const outcomes = [
  ["TRANSPARENT COST", "See how materials, labour, overheads and processes build the true economics of a product or service."],
  ["PROFITABILITY BY DIMENSION", "Analyse contribution across products, customers, processes and business units."],
  ["BETTER COMMERCIAL DECISIONS", "Give pricing, product mix and cost decisions a consistent economic basis."],
  ["CONTINUOUS CONTROL", "See how cost drivers and variances change financial performance over time."],
];
const useCases = [
  ["COMPLEX PRODUCTION", "When multiple stages, materials and allocation layers make true product cost difficult to trace."],
  ["BROAD PRODUCT PORTFOLIOS", "When aggregate profitability hides large differences between products or customers."],
  ["GROWING BUSINESSES", "When increasing complexity makes simple costing and margin analysis unreliable."],
  ["MULTI-ENTITY GROUPS", "When profitability needs to be understood across companies, business lines and shared resources."],
];
const related = [
  ["CFO Advisory", "The financial structure, management information and decision processes behind a CFO function.", "/services/cfo-function"],
  ["Planning & Forecasting", "Budgets, forecasts and scenarios connected to the drivers of the business.", "/services/budgets-and-forecasting"],
  ["Management Reporting", "Clear management information built around the decisions that need to be made.", "/services/management-reporting"],
  ["Financial Data", "One reliable foundation for reporting, analysis and financial control.", "/services/financial-data"],
];

function SectionHeader({ label, title, intro }: { label: string; title: React.ReactNode; intro?: string }) { return <header className={styles.sectionHeader}><span>{label}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>; }

export default function CostAndProfitabilityPage() {
  return <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createServicePageSchema({ path: "/services/cost-and-profitability", name: "Cost & Profitability Analysis", description: "Understand where value is created or lost through transparent cost models, manufacturing cost analysis, margin drivers and product profitability.", breadcrumbSection: "Finance", breadcrumbName: "Cost & Margin Management" })) }} />
    <AnnouncementBar /><Navbar active="services" />
    <section className={styles.hero} aria-labelledby="cost-title"><div className={`site-container ${styles.heroInner}`}><div className={styles.heroCopy}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Finance</span><span>/</span><span aria-current="page">Cost &amp; Margin Management</span></nav>
      <span className={styles.category}>COST &amp; MARGIN MANAGEMENT</span><h1 id="cost-title">Revenue tells you what you sold.<br />Margin tells you what was worth selling.</h1><p className={styles.lead}>Profitability is an outcome. Understand what drives it.</p><p className={styles.support}>Build a clear view of cost and profitability — across products, customers, processes and business units — and understand what actually creates or destroys value.</p><Link className={styles.primaryButton} href="/contact?topic=cost-profitability">{PRIMARY_COMMERCIAL_CTA}</Link>
    </div><CostDashboard /></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="WHAT IT INCLUDES" title={<>Know the cost.<br />Understand the economics behind it.</>} /><div className={styles.capabilityGrid}>{capabilities.map(([title, copy], i) => <article className={styles.capability} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.tinted}`}><div className="site-container"><SectionHeader label="HOW WE WORK" title="Follow the cost until you find the margin." /><ol className={styles.timeline}>{process.map(([n, title, copy]) => <li key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="WHAT YOU GET" title={<>Know what makes money.<br />Know what doesn&apos;t.</>} /><div className={styles.outcomeGrid}>{outcomes.map(([title, copy]) => <article key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      <aside className={styles.caseExample} aria-labelledby="scenario-title"><div className={styles.caseExampleIntro}><span>ILLUSTRATIVE SCENARIO</span><h3 id="scenario-title">A profitable company can still sell unprofitable products.</h3></div><dl><div><dt>SCENARIO</dt><dd>A manufacturing company is profitable overall, but management cannot reliably see which products create margin and which absorb it.</dd></div><div><dt>ENTIMEMA APPROACH</dt><dd>We connect ERP data, material consumption, production costs, allocation logic and commercial data into a cost and profitability model by product and other key business dimensions.</dd></div><div><dt>RESULT</dt><dd>Management can see where value is created, where margin is being absorbed and which drivers require action. Our <Link href="/resources/building-a-manufacturing-cost-architecture">manufacturing cost architecture</Link> shows how production stages and economic drivers connect to management decisions.</dd></div></dl></aside>
    </div></section>
    <section className={`${styles.section} ${styles.tinted}`}><div className="site-container"><SectionHeader label="WHERE IT APPLIES" title="When does profitability become difficult to see?" intro="If you know the total profit but not where it came from, you don&apos;t yet have profitability visibility." /><div className={styles.useCaseGrid}>{useCases.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.section}><div className="site-container"><SectionHeader label="NEXT STEP" title="Related services" /><div className={styles.relatedGrid}>{related.map(([title, copy, href]) => <Link href={href} key={title}><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">↗</b></Link>)}</div></div></section>
    <section className={styles.ctaSection}><div className="site-container"><div className={styles.ctaBlock}><span>COST &amp; MARGIN MANAGEMENT</span><h2>You know the profit.<br />Now find out what created it.</h2><p>Build a cost and margin model that shows where value is created, where profitability is lost and what management can do about it.</p><Link className={styles.ctaButton} href="/contact?topic=cost-profitability">{PRIMARY_COMMERCIAL_CTA}</Link></div></div></section>
  </main>;
}
