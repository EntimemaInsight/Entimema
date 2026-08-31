import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import styles from "./launch.module.css";

const path = "/financial-intelligence-launch";
const url = `${SITE_URL}${path}`;
const title = "Entimema Financial Intelligence — Controlled Financial Analysis";
const description = "Launching 9 September 2026: Entimema Financial Intelligence transforms financial documents and data into validated, traceable and decision-ready analysis.";

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: url },
  openGraph: { type: "website", url, title, description, siteName: "Entimema", images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${url}/opengraph-image`] },
};

const workflow = [
  ["Intelligent Intake", "MODEL", "Source evidence registered"],
  ["Document and Data Understanding", "MODEL", "Structure and meaning interpreted"],
  ["Financial Extraction", "MODEL", "Values retain source references"],
  ["Period Harmonisation", "CONTROL", "Periods and units made comparable"],
  ["Canonical Financial Mapping", "MODEL + REVIEW", "Definitions mapped; ambiguity surfaced"],
  ["Deterministic Validation", "CONTROL", "Arithmetic and identities tested"],
  ["Confidence and Exception Handling", "CONTROL", "Uncertainty routed, not concealed"],
  ["Human Review", "HUMAN", "Material judgement remains accountable"],
  ["Validated Financial Model", "CONTROL", "Controlled state established"],
  ["Analysis and Findings", "MODEL + HUMAN", "Evidence-linked interpretation"],
  ["Traceable Export", "CONTROL", "Result and lineage delivered"],
] as const;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description,
      isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID },
      about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }],
      breadcrumb: { "@id": `${url}#breadcrumb` }, datePublished: "2026-08-31",
    },
    createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence", item: url }], `${url}#breadcrumb`),
  ],
};

function Marker({ children }: { children: React.ReactNode }) { return <p className={styles.marker}>{children}</p>; }

export default function FinancialIntelligenceLaunchPage() {
  return <>
    <Navbar />
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="launch-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>ENTIMEMA FINANCIAL INTELLIGENCE · LAUNCHING 9 SEPTEMBER 2026</p>
          <h1 id="launch-title">From financial evidence to a decision you can defend.</h1>
          <p className={styles.standfirst}>Entimema Financial Intelligence transforms fragmented financial documents and data into validated, traceable and decision-ready analysis—combining AI interpretation, deterministic control and human judgement in one governed workflow.</p>
          <div className={styles.actions}><a href="#workflow">Explore the workflow</a><Link href="/contact?topic=financial-data">Request a private walkthrough</Link></div>
        </div>
        <div className={styles.architecture} aria-label="Evidence moving through a controlled decision architecture">
          <div className={styles.evidence}><span>PDF</span><span>XLSX</span><span>REPORT</span><span>EXPORT</span></div>
          <div className={styles.spine}><i /><strong>INTERPRET</strong><i /><strong>CONTROL</strong><i /><strong>REVIEW</strong><i /></div>
          <div className={styles.decision}><small>VALIDATED STATE</small><b>DECISION</b><span>Evidence lineage retained</span></div>
        </div>
      </section>

      <section className={styles.editorial} aria-labelledby="old-condition"><Marker>01 · THE OLD CONDITION</Marker><div><h2 id="old-condition">The analysis begins long before the model.</h2><p className={styles.lead}>Financial work starts with evidence distributed across spreadsheets, statements, management reports, PDFs, exports and inconsistent periods.</p><ul>{["what each value means", "which period it belongs to", "whether definitions are comparable", "whether totals reconcile", "which assumptions remain unverified", "which exceptions require judgement"].map(x=><li key={x}>{x}</li>)}</ul><p>The bottleneck is not calculation alone. It is the controlled transformation of evidence into a financial state that can support a decision.</p></div></section>

      <section className={styles.threshold} aria-labelledby="threshold"><Marker>02 · THE THRESHOLD</Marker><h2 id="threshold">AI can interpret complexity. It should not own financial truth.</h2><div className={styles.responsibilities}>
        <article><span>01 / INTERPRET</span><h3>Model intelligence</h3><p>Document interpretation · semantic mapping · ambiguity detection · contextual reasoning · narrative findings.</p></article>
        <article><span>02 / CONTROL</span><h3>Deterministic control</h3><p>Arithmetic · reconciliations · accounting identities · control totals · fixed validation rules.</p></article>
        <article><span>03 / DECIDE</span><h3>Human judgement</h3><p>Material exceptions · uncertain mappings · policy choices · final accountability.</p></article>
      </div><blockquote>Models interpret. <i /> Rules control. <i /> Humans decide.</blockquote></section>

      <section id="workflow" className={styles.workflow} aria-labelledby="workflow-title"><Marker>03 · THE WORKFLOW</Marker><div className={styles.workflowHead}><h2 id="workflow-title">One governed path from intake to decision.</h2><p>Each value travels with a source reference. Reasoning, calculation and review remain distinct responsibilities along one execution sequence.</p></div><ol>{workflow.map(([name, owner, note], i)=><li key={name}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{name}</h3><p>{note}</p></div><b>{owner}</b></li>)}</ol><p className={styles.lineage}>SOURCE EVIDENCE <span>────────── retained through every transformation ──────────</span> TRACEABLE RESULT</p></section>

      <section className={styles.workspace} aria-labelledby="workspace"><Marker>04 · THE WORKSPACE</Marker><div className={styles.workspaceIntro}><h2 id="workspace">The work remains visible.</h2><p>This editorial representation uses states grounded in the implemented Financial Intelligence workspace. It is not a customer screenshot or a fabricated financial result.</p></div><div className={styles.workbench}>
        <header><span>EXECUTABLE WORKFLOW</span><b>Traceable Income Statement</b><em>IMPLEMENTED WORKSPACE STATE</em></header>
        <div className={styles.sourcePanel}><small>SOURCE EVIDENCE</small><strong>Uploaded statement</strong><dl><div><dt>Input</dt><dd>XLSX · CSV · text PDF</dd></div><div><dt>Handling</dt><dd>Inspected bytes in memory</dd></div><div><dt>Lineage</dt><dd>Value-level evidence reference</dd></div></dl></div>
        <div className={styles.statePanel}><small>CONTROLLED STATE</small><div><span>Canonical mapping</span><b>VISIBLE</b></div><div><span>Confidence</span><b>EXPLICIT</b></div><div><span>Validation controls</span><b>TESTED</b></div><div><span>Review tasks</span><b>ROUTED</b></div></div>
        <div className={styles.inspector}><small>INSPECTOR</small><p>Source label</p><strong>→ mapped concept</strong><p>Period · normalized value · evidence ID</p><span>Human decisions recalculate downstream controls.</span></div>
      </div></section>

      <section className={styles.result} aria-labelledby="result"><Marker>05 · THE RESULT</Marker><div><h2 id="result">Not another answer. A controlled financial result.</h2><div className={styles.resultFlow}><span>SOURCE</span><i /><span>VALIDATED MODEL</span><i /><span>DECISION STATE</span><i /><span>TRACEABLE EXPORT</span></div><ul>{["A validated financial model", "Reconciled and harmonised periods", "Visible exceptions and unresolved uncertainty", "Financial findings tied to evidence", "Decision-ready interpretation", "A traceable export or deliverable"].map(x=><li key={x}>{x}</li>)}</ul></div></section>

      <section className={styles.letter} aria-labelledby="founder-note"><Marker>06 · THE FOUNDER’S NOTE</Marker><article><h2 id="founder-note">Why we built Financial Intelligence.</h2><p>Financial analysis rarely fails because an organisation lacks information. It fails because evidence, interpretation, calculation and judgement become separated across documents, systems and people.</p><p>AI can help close that distance—but only if its role is designed with discipline. A model should interpret ambiguity. Deterministic logic should protect financial truth. Human experts should remain in control of material judgement.</p><p>We built Entimema Financial Intelligence around that division of responsibility: one governed workflow that preserves the path from source evidence to financial conclusion.</p><p>The ambition is not merely to make analysis faster. It is to make every important result easier to examine, explain and defend.</p><footer><Link href="/alexander-dimitrov">Alexander Dimitrov</Link><span>Founder, Entimema</span></footer></article></section>

      <section className={styles.invitation} aria-labelledby="invitation"><Marker>07 · THE INVITATION</Marker><div><h2 id="invitation">Bring the evidence. Leave with a decision-ready financial state.</h2><p>Entimema Financial Intelligence launches on 9 September 2026. We are preparing the first controlled workflows for teams that need financial analysis to be fast, traceable and accountable.</p><div className={styles.actions}><Link href="/contact?topic=financial-data">Request a private walkthrough</Link><Link href="/resources/traceable-financial-analysis-workflow">Explore Entimema Research</Link></div></div></section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
