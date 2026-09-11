import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./security.module.css";

const title = "Security & Trust | Entimema";
const description = "How Entimema approaches controlled access, data handling, traceability and human review for financial intelligence workflows.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.entimema.com/security" },
  openGraph: { title, description, url: "https://www.entimema.com/security", type: "website" },
  twitter: { card: "summary", title, description },
};

const controls = [
  ["01", "Purpose-limited processing", "Data is processed for the requested workflow and assessed against the capability’s defined purpose."],
  ["02", "Controlled access", "Access expectations are defined around authenticated workspaces, authorised contexts and operational need."],
  ["03", "Source-grounded outputs", "Source-value lineage keeps supported outputs connected to the financial evidence used to produce them."],
  ["04", "Human accountability", "Exceptions and material judgement remain visible so an authorised person can review the result."],
];

const pilotScope = [
  "Tested English XLSX and text-based PDF Income Statements",
  "Authenticated Financial Intelligence workspace",
  "Secure file-byte validation and request-scoped processing",
  "Source-value lineage",
  "Supported deterministic financial checks and KPIs",
  "Explicit exceptions",
  "Human review",
];

const boundaries = [
  "No scanned or OCR PDF claim",
  "No whole annual-report discovery guarantee",
  "No non-English guarantee",
  "No arbitrary financial-statement-type guarantee",
  "No guarantee for every workbook or PDF layout",
];

const reviewTopics = [
  "Workflow data received",
  "Processing purpose",
  "Provider roles",
  "Access expectations",
  "Retention approach",
  "Deletion process",
  "Human-review responsibilities",
];

export default function SecurityPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>SECURITY &amp; TRUST</p>
          <h1>Financial intelligence requires disciplined data handling.</h1>
          <p className={styles.lead}>Entimema combines controlled access, purpose-limited processing, source traceability and human review around financial workflows. Each production capability is assessed against its actual data, infrastructure and deployment scope.</p>
          <p className={styles.assurance}>Customer documents are processed for the requested workflow and are not used to train shared Entimema models.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/contact">Discuss your security requirements</Link>
            <Link className={styles.secondary} href="/privacy">Read the Privacy Notice <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className={styles.heroIndex} aria-label="Security assurance areas">
          <span>ACCESS</span><span>PURPOSE</span><span>TRACEABILITY</span><span>REVIEW</span>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="baseline-heading">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>CONTROL BASELINE</p><h2 id="baseline-heading">Controls follow the workflow.</h2><p>Assurance begins with the capability in use, the data it receives and the people responsible for its output.</p></div>
        <div className={styles.controlGrid}>{controls.map(([number, heading, copy]) => <article key={heading}><span>{number}</span><h3>{heading}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={`${styles.section} ${styles.pilot}`} aria-labelledby="pilot-heading">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>CURRENT VERIFIED SCOPE</p><h2 id="pilot-heading">Financial Intelligence V1 controlled pilot.</h2><p>The present assurance boundary is specific. It reflects the tested workflow rather than a platform-wide promise.</p></div>
        <div className={styles.scopeLayout}>
          <div><h3>Within the verified scope</h3><ul className={styles.checkList}>{pilotScope.map(item => <li key={item}>{item}</li>)}</ul></div>
          <aside className={styles.boundary}><p className={styles.eyebrow}>EXPLICIT SCOPE BOUNDARY</p><h3>What this scope does not claim</h3><ul>{boundaries.map(item => <li key={item}>{item}</li>)}</ul></aside>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="data-heading">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>DATA &amp; AI</p><h2 id="data-heading">Customer context is not a shared training asset.</h2></div>
        <div className={styles.principles}>
          <article><h3>Workflow-purpose limitation</h3><p>Customer documents and financial data are processed for the requested workflow.</p></article>
          <article><h3>Provider review</h3><p>Provider roles, access and data-handling behaviour are considered for the production capability in which they are used.</p></article>
          <article><h3>Customer-context separation</h3><p>Processing is designed around the authorised customer and request context, without using that context to train shared Entimema models.</p></article>
          <article><h3>Minimal diagnostics</h3><p>Operational diagnostics should be privacy-safe and limited to what is needed to support, secure and understand the workflow.</p></article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.governance}`} aria-labelledby="governance-heading">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>OUTPUT GOVERNANCE</p><h2 id="governance-heading">A visible status before reliance.</h2><p>Workflow outcomes communicate whether supported checks passed, an exception needs judgement or processing cannot continue safely.</p></div>
        <div className={styles.states}>
          <article><span className={styles.ready} aria-hidden="true" /><h3>Ready</h3><p>Supported processing and checks completed without a surfaced review condition.</p></article>
          <article><span className={styles.review} aria-hidden="true" /><h3>Review required</h3><p>An exception, ambiguity or unsupported condition needs human attention before use.</p></article>
          <article><span className={styles.blocked} aria-hidden="true" /><h3>Blocked</h3><p>The workflow cannot produce a dependable result within its defined boundary.</p></article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.reviewSection}`} aria-labelledby="review-heading">
        <div className={styles.reviewIntro}><p className={styles.eyebrow}>SECURITY REVIEW</p><h2 id="review-heading">Review the real deployment, not a generic checklist.</h2><p>A security discussion can map the proposed workflow to its data, infrastructure and operating responsibilities.</p><Link className={styles.primary} href="/contact">Discuss your security requirements</Link></div>
        <ol className={styles.reviewList}>{reviewTopics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, "0")}</span>{topic}</li>)}</ol>
      </section>
    </main>
  );
}
