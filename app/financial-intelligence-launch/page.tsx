import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import styles from "./launch.module.css";
import ProductExplainer from "./ProductExplainer";
import { FinancialIntelligenceCta, FinancialIntelligenceViewAnalytics } from "./FinancialIntelligenceAnalytics";

const path = "/financial-intelligence-launch";
const url = `${SITE_URL}${path}`;
const title = "Financial documents in. Validated analysis out.";
const description = "Entimema Financial Intelligence transforms financial documents and data into validated, traceable and decision-ready analysis. The B2B pilot is available now.";
const bulgariaCheckoutUrl = "https://buy.stripe.com/eVq5kF4Yhe9ga8mb41dEs00";
const internationalCheckoutUrl = "https://buy.stripe.com/6oU3cx8at9T0eoCegddEs01";

export const metadata: Metadata = {
  title: { absolute: `${title} | Entimema Financial Intelligence` }, description,
  alternates: { canonical: url },
  openGraph: { type: "article", url, title, description, siteName: "Entimema", publishedTime: "2026-08-31", authors: [`${SITE_URL}/alexander-dimitrov`], images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
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
  "@graph": [{
    "@type": "Article", "@id": `${url}#article`, headline: title, description,
    mainEntityOfPage: { "@id": `${url}#webpage` }, author: { "@id": FOUNDER_ID }, publisher: { "@id": ORGANIZATION_ID },
    datePublished: "2026-08-31", dateModified: "2026-08-31",
  }, {
    "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description,
    isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID }, about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }],
    breadcrumb: { "@id": `${url}#breadcrumb` }, datePublished: "2026-08-31",
  }, createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence", item: url }], `${url}#breadcrumb`)],
};

function Marker({ children }: { children: React.ReactNode }) { return <p className={styles.marker}>{children}</p>; }

export default function FinancialIntelligenceLaunchPage() {
  return <>
    <Navbar />
    <main className={styles.page}>
      <FinancialIntelligenceViewAnalytics />
      <article>
        <header className={styles.masthead}>
          <div className={styles.publication}><span>ENTIMEMA FINANCIAL INTELLIGENCE</span><span>B2B PILOT · AVAILABLE NOW</span></div>
          <div className={styles.heroGrid}><div className={styles.heroCopy}><h1><span>Financial documents in.</span><span>Validated analysis out.</span></h1><p className={styles.standfirst}>AI interprets the evidence. Deterministic controls verify the numbers. Humans resolve material exceptions.</p><nav className={styles.heroActions} aria-label="Launch actions"><FinancialIntelligenceCta href="#pilot-checkout" kind="start_pilot" position="hero">Start the pilot</FinancialIntelligenceCta><FinancialIntelligenceCta href="#how-it-works" kind="workflow" position="hero">See how it works</FinancialIntelligenceCta></nav></div>
          <div className={styles.heroPipeline} role="img" aria-label="Financial documents are interpreted by AI, validated by deterministic controls, reviewed by a human when necessary, and delivered as validated analysis."><div className={styles.heroDocs}><span>PDF<small>Revenue · SRC–01</small></span><span>XLSX<small>FY 2025 · SRC–02</small></span><span>CSV<small>EUR · SRC–03</small></span></div><ol><li><b>AI INTERPRETATION</b><span>Meaning · period · definition · context</span></li><li><b>DETERMINISTIC CONTROL</b><span>Arithmetic · reconciliation · identities</span></li><li><b>HUMAN REVIEW</b><span>Material uncertainty is escalated—not concealed.</span></li></ol><div className={styles.heroResult}><b>VALIDATED ANALYSIS</b><span>Evidence linked</span><span>Controls passed</span><span>Exceptions resolved</span><strong>Ready for decision</strong></div><p className={styles.pipelineCaption}>PDF · XLSX · CSV → INTERPRET → VALIDATE → REVIEW → DECISION-READY ANALYSIS</p></div></div>
        </header>

        <ProductExplainer />

        <section id="pilot-checkout" className={styles.pilot} aria-labelledby="pilot-title">
          <div className={styles.pilotLead}>
            <p className={styles.marker}>START THE FINANCIAL INTELLIGENCE PILOT</p>
            <h2 id="pilot-title">One controlled execution. A result you can inspect and use.</h2>
            <p>Choose the route that matches the legal establishment of the purchasing business. Checkout is completed securely in Stripe; Entimema then sends the controlled document-upload instructions and confirms the execution scope by email.</p>
          </div>
          <div className={styles.pilotOptions}>
            <article>
              <div className={styles.pilotOptionHeader}><span>BULGARIA B2B</span><strong>€588</strong><small>€490 + €98 VAT</small></div>
              <h3>Business established in Bulgaria</h3>
              <p>For Bulgarian business customers. The displayed price includes 20% Bulgarian VAT.</p>
              <ul><li>One Financial Intelligence pilot execution</li><li>Controlled intake and validation</li><li>Human review of material exceptions</li><li>Traceable financial output</li></ul>
              <FinancialIntelligenceCta href={bulgariaCheckoutUrl} kind="domestic_checkout" position="pricing">Continue to secure payment</FinancialIntelligenceCta>
            </article>
            <article>
              <div className={styles.pilotOptionHeader}><span>INTERNATIONAL B2B</span><strong>€490</strong><small>Tax treatment subject to business status</small></div>
              <h3>Business established outside Bulgaria</h3>
              <p>For verified foreign business customers. A valid company registration or applicable business tax identifier is required.</p>
              <ul><li>One Financial Intelligence pilot execution</li><li>Controlled intake and validation</li><li>Human review of material exceptions</li><li>Traceable financial output</li></ul>
              <FinancialIntelligenceCta href={internationalCheckoutUrl} kind="international_checkout" position="pricing">Continue to secure payment</FinancialIntelligenceCta>
            </article>
          </div>
          <p className={styles.pilotNote}><strong>Not sure which route applies?</strong> Do not complete payment yet. <Link href="/contact?topic=financial-data">Contact Entimema</Link> so we can confirm the correct treatment. If the submitted business or tax information cannot be validated, additional tax may become due or the order may be cancelled and refunded.</p>
        </section>

        <div className={styles.articleBridge}><small>ENTIMEMA · FINANCIAL INTELLIGENCE · SPECIAL TECHNOLOGY REPORT</small><span>THE ARCHITECTURE BEHIND THE RESULT</span><p>The explainer shows what the product does. The report below examines why its architecture matters.</p><div className={styles.byline}><p>By <Link href="/alexander-dimitrov">Alexander Dimitrov</Link><span>Founder, Entimema</span></p><time dateTime="2026-08-31">31 August 2026</time></div></div>

        <section className={`${styles.chapter} ${styles.opening}`} aria-labelledby="old-condition">
          <Marker>I. THE OLD CONDITION</Marker>
          <h2 id="old-condition">The analysis begins long before the model.</h2>
          <p className={styles.dropcap}>Financial analysis rarely begins with analysis. It begins with evidence scattered across statements, spreadsheets, management reports, PDF files and system exports—each carrying its own period, definition and unresolved assumption.</p>
          <p>Before a financial conclusion can be trusted, those fragments must be interpreted, aligned, reconciled and tested. The real constraint is not the absence of another model. It is the absence of a controlled path from source evidence to accountable judgement.</p>
          <aside className={styles.marginNote}><strong>The analytical burden</strong><span>Meaning · period · comparability · reconciliation · assumptions · exceptions</span></aside>
          <p>The bottleneck is not calculation alone. It is the controlled transformation of evidence into a financial state that can support a decision.</p>
        </section>

        <section className={`${styles.chapter} ${styles.threshold}`} aria-labelledby="threshold">
          <Marker>II. THE THRESHOLD</Marker>
          <h2 id="threshold">AI can interpret complexity. It should not own financial truth.</h2>
          <div className={styles.prose}><p>Machine reasoning can identify structure, interpret context and surface ambiguity at a speed that changes the economics of financial work. Yet fluency is not control. Financial truth still depends on reproducible arithmetic, explicit definitions and accountable review.</p></div>
        </section>

        <aside className={styles.pullquote} aria-label="Financial Intelligence design principle">
          <p>Models interpret. Rules control. Humans decide.</p>
          <cite>Entimema Financial Intelligence design principle</cite>
        </aside>

        <section className={`${styles.chapter} ${styles.division}`} aria-labelledby="division">
          <Marker>III. THE DIVISION OF RESPONSIBILITY</Marker>
          <h2 id="division">Three kinds of intelligence, deliberately separated.</h2>
          <figure>
            <div className={styles.responsibilities}>
              <div><span>01 / INTERPRET</span><h3>Model intelligence</h3><p>Document interpretation, semantic mapping, ambiguity detection, contextual reasoning and narrative findings.</p></div>
              <div><span>02 / CONTROL</span><h3>Deterministic control</h3><p>Arithmetic, reconciliations, accounting identities, control totals and fixed validation rules.</p></div>
              <div><span>03 / DECIDE</span><h3>Human judgement</h3><p>Material exceptions, uncertain mappings, policy choices and final accountability.</p></div>
            </div>
            <figcaption>Figure 1 · The workflow separates interpretation, financial control and material judgement rather than assigning them to a single model.</figcaption>
          </figure>
        </section>

        <section id="workflow" className={`${styles.chapter} ${styles.workflow}`} aria-labelledby="workflow-title">
          <Marker>IV. THE GOVERNED WORKFLOW</Marker>
          <div className={styles.sectionLead}><h2 id="workflow-title">One governed path from intake to decision.</h2><p>Each value travels with a source reference. Reasoning, calculation and review remain distinct responsibilities along one execution sequence.</p></div>
          <figure>
            <ol>{workflow.map(([name, owner, note], i) => <li key={name}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>{note}</p></div><b>{owner}</b></li>)}</ol>
            <div className={styles.lineage}><span>SOURCE EVIDENCE</span><i /><span>LINEAGE RETAINED</span><i /><span>TRACEABLE RESULT</span></div>
            <figcaption>Figure 2 · One governed execution sequence preserves the path from source evidence to the final financial conclusion.</figcaption>
            <p className={styles.sourceNote}>Source: Entimema Financial Intelligence architecture, pre-launch implementation.</p>
          </figure>
        </section>

        <section className={`${styles.chapter} ${styles.workspace}`} aria-labelledby="workspace">
          <Marker>V. THE VISIBLE WORKSPACE</Marker>
          <div className={styles.sectionLead}><h2 id="workspace">The work remains visible.</h2><p>The Decision Workspace keeps interpretation and control in view, so an analyst can inspect the system state rather than accept an unexplained output.</p></div>
          <figure>
            <div className={styles.workbench}>
              <header><span>EXECUTABLE WORKFLOW</span><b>Traceable Income Statement</b><em>IMPLEMENTED WORKSPACE STATE</em></header>
              <div className={styles.sourcePanel}><small>SOURCE EVIDENCE</small><strong>Uploaded statement</strong><dl><div><dt>Input</dt><dd>XLSX · CSV · text PDF</dd></div><div><dt>Handling</dt><dd>Inspected bytes in memory</dd></div><div><dt>Lineage</dt><dd>Value-level evidence reference</dd></div></dl></div>
              <div className={styles.statePanel}><small>CONTROLLED STATE</small><div><span>Canonical mapping</span><b>VISIBLE</b></div><div><span>Confidence</span><b>EXPLICIT</b></div><div><span>Validation controls</span><b>TESTED</b></div><div><span>Review tasks</span><b>ROUTED</b></div></div>
              <div className={styles.inspector}><small>INSPECTOR</small><p>Source label</p><strong>→ mapped concept</strong><p>Period · normalized value · evidence ID</p><span>Human decisions recalculate downstream controls.</span></div>
            </div>
            <figcaption>Figure 3 · The Decision Workspace keeps source evidence, interpreted values, validation status, exceptions and human review visible within the same execution state.</figcaption>
            <p className={styles.sourceNote}>The composition reflects implemented Financial Intelligence workspace capabilities. It is not a customer screenshot or simulated performance claim.</p>
          </figure>
        </section>

        <section className={`${styles.chapter} ${styles.result}`} aria-labelledby="result">
          <Marker>VI. THE CONTROLLED RESULT</Marker>
          <h2 id="result">Not another answer. A controlled financial result.</h2>
          <div className={styles.resultFlow}><span>SOURCE</span><i /><span>VALIDATED MODEL</span><i /><span>DECISION STATE</span><i /><span>TRACEABLE EXPORT</span></div>
          <dl className={styles.ledger}>{[["01", "A validated financial model"], ["02", "Reconciled and harmonised periods"], ["03", "Visible exceptions and unresolved uncertainty"], ["04", "Financial findings tied to evidence"], ["05", "Decision-ready interpretation"], ["06", "A traceable export or deliverable"]].map(([n, item]) => <div key={n}><dt>{n}</dt><dd>{item}</dd></div>)}</dl>
        </section>

        <section className={`${styles.chapter} ${styles.letter}`} aria-labelledby="founder-note">
          <Marker>VII. THE FOUNDER’S NOTE</Marker>
          <div className={styles.letterBody}><h2 id="founder-note">Why we built Financial Intelligence.</h2><p>Financial analysis rarely fails because an organisation lacks information. It fails because evidence, interpretation, calculation and judgement become separated across documents, systems and people.</p><p>AI can help close that distance—but only if its role is designed with discipline. A model should interpret ambiguity. Deterministic logic should protect financial truth. Human experts should remain in control of material judgement.</p><p>We built Entimema Financial Intelligence around that division of responsibility: one governed workflow that preserves the path from source evidence to financial conclusion.</p><p>The ambition is not merely to make analysis faster. It is to make every important result easier to examine, explain and defend.</p><footer><Link href="/alexander-dimitrov">Alexander Dimitrov</Link><span>Founder, Entimema</span></footer></div>
        </section>

        <section className={`${styles.chapter} ${styles.invitation}`} aria-labelledby="invitation">
          <Marker>VIII. THE INVITATION</Marker>
          <div><h2 id="invitation">Bring the evidence. Leave with a decision-ready financial state.</h2><p>The Financial Intelligence pilot is available to verified business customers that need financial analysis to be fast, traceable and accountable.</p><nav className={styles.actions} aria-label="Financial Intelligence next steps"><FinancialIntelligenceCta href="#pilot-checkout" kind="start_pilot" position="final">Start the pilot</FinancialIntelligenceCta><FinancialIntelligenceCta href="/resources/traceable-financial-analysis-workflow" kind="research" position="final">Explore Entimema Research</FinancialIntelligenceCta></nav></div>
        </section>
      </article>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
