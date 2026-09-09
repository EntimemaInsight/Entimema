import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import styles from "./launch.module.css";
import ProductExplainer from "./ProductExplainer";
import { FinancialIntelligenceCta, FinancialIntelligenceViewAnalytics } from "./FinancialIntelligenceAnalytics";

const path = "/financial-intelligence-launch";
const url = `${SITE_URL}${path}`;
const title = "Financial data you can actually make decisions with";
const description = "A controlled B2B workflow that turns financial documents into validated, traceable and decision-ready financial outputs.";

export const metadata: Metadata = {
  title: { absolute: `${title} | Entimema Financial Intelligence` }, description,
  alternates: { canonical: url },
  openGraph: { type: "article", url, title, description, siteName: "Entimema", publishedTime: "2026-09-09", authors: [`${SITE_URL}/alexander-dimitrov`], images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${url}/opengraph-image`] },
};

const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID }, about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }], breadcrumb: { "@id": `${url}#breadcrumb` }, datePublished: "2026-09-09" }, createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence", item: url }], `${url}#breadcrumb`)] };

const layers = [
  ["01", "Intelligent Intake", "Registers and understands the evidence.", "INTAKE"],
  ["02", "Financial Context", "Aligns meaning, period, currency and unit.", "CONTEXT"],
  ["03", "Validation Engine", "Recalculates, reconciles and applies fixed controls.", "CONTROL"],
  ["04", "Exception Workspace", "Routes ambiguity and contradictions for review.", "REVIEW"],
  ["05", "Decision Output", "Delivers the model, findings and evidence lineage.", "OUTPUT"],
] as const;

const outcomes = [
  ["Financial state", "Comparable periods and controlled financial definitions."],
  ["Control state", "Reconciliations passed and material exceptions visible."],
  ["Decision state", "Reviewed findings with the supporting evidence attached."],
] as const;

function DecisionWorkspace() {
  return <div className={styles.workspace} aria-label="Financial Intelligence Decision Workspace demonstration">
    <header><div className={styles.workspaceBrand}><b>E</b><span>Financial Intelligence</span><i>/</i><strong>FY 2025 review</strong></div><div><span className={styles.saved}>Saved</span><button type="button" tabIndex={-1}>Run workflow <b>▶</b></button></div></header>
    <aside className={styles.sourcePanel}><small>SOURCES</small><div className={styles.sourceActive}><b>XLSX</b><span>Income statement<small>FY2025 · 184 values</small></span></div><div><b>PDF</b><span>Annual report<small>62 pages</small></span></div><div><b>CSV</b><span>Trial balance<small>2,841 rows</small></span></div><footer><i /> 3 sources registered</footer></aside>
    <section className={styles.canvas} aria-label="Workflow canvas"><div className={styles.canvasTop}><span>Execution path</span><small>Run FI–0024</small></div><div className={styles.flow}>
      <div className={styles.flowNode} data-kind="source"><span>01</span><div><small>INTAKE</small><b>Understand sources</b></div><em>184</em></div><i className={styles.connector} />
      <div className={styles.flowNode} data-kind="model"><span>02</span><div><small>MODEL</small><b>Map financial values</b></div><em>98%</em></div><i className={styles.connector} />
      <div className={styles.flowNode} data-kind="rules"><span>03</span><div><small>RULES</small><b>Validate &amp; reconcile</b></div><em>12/12</em></div><div className={styles.branch}><i /><span>1 exception</span></div>
      <div className={styles.flowNode} data-kind="human"><span>04</span><div><small>HUMAN</small><b>Resolve exception</b></div><em>Open</em></div><i className={styles.connector} />
      <div className={styles.flowNode} data-kind="output"><span>05</span><div><small>OUTPUT</small><b>Decision-ready model</b></div><em>Ready</em></div>
    </div></section>
    <aside className={styles.inspector}><div className={styles.inspectorHead}><span>VALUE INSPECTOR</span><b>×</b></div><small>SELECTED CONCEPT</small><h3>Revenue</h3><dl><div><dt>Value</dt><dd>€18,420,000</dd></div><div><dt>Period</dt><dd>FY 2025</dd></div><div><dt>Confidence</dt><dd><span className={styles.pass}>98.4%</span></dd></div><div><dt>Evidence</dt><dd>SRC–01 · Row 14</dd></div></dl><div className={styles.controlResult}><span><i /> CONTROL PASSED</span><p>Gross profit identity reconciles.</p></div></aside>
  </div>;
}

export default function FinancialIntelligenceLaunchPage() {
  return <><Navbar active="product" /><main className={styles.page}><FinancialIntelligenceViewAnalytics />
    <header className={styles.hero}>
      <div className={styles.heroCopy}><p className={styles.productTag}>Financial Intelligence</p><h1>Financial data you can <span>actually make decisions with.</span></h1><p>Interpret inconsistent financial evidence, validate what must be exact and route material uncertainty for human review—all in one controlled workflow.</p><nav aria-label="Pilot actions"><FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="hero">Discuss the pilot <span>↗</span></FinancialIntelligenceCta><FinancialIntelligenceCta href="#platform" kind="workflow" position="hero">See how it works <span>↓</span></FinancialIntelligenceCta></nav><div className={styles.heroFacts}><span><i /> Verified business clients</span><span>One controlled scope</span><span>Human-reviewed output</span></div></div>
      <DecisionWorkspace />
    </header>

    <section id="platform" className={styles.platform} aria-labelledby="platform-title"><div className={styles.sectionLabel}>ENTIMEMA SYSTEM</div><div className={styles.platformHead}><h2 id="platform-title">One financial workflow.<br/><span>Five controlled layers.</span></h2><p>Purpose-built to preserve financial meaning, validation and human authority from source evidence to final decision.</p></div><div className={styles.stack}>{layers.map(([number, name, copy, state]) => <article key={number}><span>{number}</span><div><small>{state}</small><h3>{name}</h3><p>{copy}</p></div><b aria-hidden="true">→</b></article>)}</div></section>

    <ProductExplainer />

    <section className={styles.outcomes} aria-labelledby="outcomes-title"><div className={styles.sectionLabel}>CONTROLLED RESULT</div><div className={styles.outcomeHead}><h2 id="outcomes-title">Not another AI answer.<br/><span>A defensible financial state.</span></h2><p>The output is designed to be examined, explained and used—not merely accepted.</p></div><div className={styles.outcomeGrid}>{outcomes.map(([name, copy], index) => <article key={name}><span>0{index + 1}</span><div className={styles.outcomeIcon} aria-hidden="true"><i /><i /><i /></div><h3>{name}</h3><p>{copy}</p></article>)}</div></section>

    <section id="pilot" className={styles.pilot} aria-labelledby="pilot-title"><div className={styles.pilotShell}><div className={styles.pilotCopy}><p className={styles.productTag}>Founding pilot</p><h2 id="pilot-title">One controlled financial execution.</h2><p>We are refining the pilot experience before reopening direct checkout. If the workflow fits a live financial problem, we will define the scope with you first.</p><ul><li>Controlled source intake</li><li>Financial interpretation and mapping</li><li>Deterministic validation</li><li>Exception and human review</li><li>Validated model and findings</li></ul></div><div className={styles.pilotContact}><span>FOUNDING PILOT</span><h3>Start with the financial problem.</h3><p>Share the documents, decision context and expected output. We will confirm whether the pilot is the right fit.</p><FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="final">Discuss the pilot <span>→</span></FinancialIntelligenceCta></div></div></section>

    <footer className={styles.closing}><div><b>ENTIMEMA</b><span>Financial Evidence-to-Decision Systems</span></div><nav><Link href="/resources">Research</Link><Link href="/alexander-dimitrov">Founder</Link><Link href="/contact?topic=financial-data">Contact</Link></nav></footer>
  </main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /></>;
}
