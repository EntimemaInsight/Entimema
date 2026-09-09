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
const description = "A controlled B2B pilot that turns financial documents into a validated, traceable and decision-ready financial result.";
const bulgariaCheckoutUrl = "https://buy.stripe.com/eVq5kF4Yhe9ga8mb41dEs00";
const internationalCheckoutUrl = "https://buy.stripe.com/6oU3cx8at9T0eoCegddEs01";

export const metadata: Metadata = {
  title: { absolute: `${title} | Entimema Financial Intelligence` }, description,
  alternates: { canonical: url },
  openGraph: { type: "article", url, title, description, siteName: "Entimema", publishedTime: "2026-09-09", authors: [`${SITE_URL}/alexander-dimitrov`], images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${url}/opengraph-image`] },
};

const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID }, about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }], breadcrumb: { "@id": `${url}#breadcrumb` }, datePublished: "2026-09-09" }, createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence", item: url }], `${url}#breadcrumb`)] };

const deliverables = [
  ["01", "Validated financial model", "Values structured into a controlled financial state."],
  ["02", "Reconciled periods", "Definitions, units and reporting periods made comparable."],
  ["03", "Visible exceptions", "Ambiguity surfaced for review instead of silently resolved."],
  ["04", "Decision-ready analysis", "Findings connected to source evidence and controls."],
] as const;

export default function FinancialIntelligenceLaunchPage() {
  return <><Navbar /><main className={styles.page}><FinancialIntelligenceViewAnalytics /><article>
    <header className={styles.hero}>
      <div className={styles.edition}><span>ENTIMEMA / FINANCIAL INTELLIGENCE</span><span>ISSUE 01 · B2B PILOT</span><span>9 SEPTEMBER 2026</span></div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}><p className={styles.kicker}>A CONTROLLED FINANCIAL WORKFLOW</p><h1>Financial documents in.<br/><em>Validated analysis out.</em></h1><p className={styles.standfirst}>AI interprets the evidence. Deterministic controls verify the numbers. Human judgement resolves what matters.</p><nav className={styles.heroActions} aria-label="Pilot actions"><FinancialIntelligenceCta href="#pilot-checkout" kind="start_pilot" position="hero">Start the pilot</FinancialIntelligenceCta><FinancialIntelligenceCta href="#method" kind="workflow" position="hero">Examine the method</FinancialIntelligenceCta></nav></div>
        <div className={styles.heroProof} aria-label="Financial Intelligence control statement"><span className={styles.proofIndex}>01—04</span><div className={styles.proofLine}><i/><i/><i/><i/></div><dl><div><dt>Source</dt><dd>PDF · XLSX · CSV</dd></div><div><dt>Control</dt><dd>Reconciled</dd></div><div><dt>Review</dt><dd>Exceptions visible</dd></div><div><dt>Result</dt><dd>Decision-ready</dd></div></dl><strong>Every material conclusion retains its path back to evidence.</strong></div>
      </div>
      <div className={styles.heroFooter}><span>One paid execution</span><span>For verified business customers</span><span>From €490</span></div>
    </header>

    <section className={styles.thesis} aria-labelledby="thesis-title"><p className={styles.marker}>THE PROBLEM</p><div><h2 id="thesis-title">The calculation is rarely the hardest part.</h2><p>Financial work breaks between the source document and the final conclusion: inconsistent periods, unclear definitions, hidden assumptions and numbers that no longer carry their evidence.</p></div><blockquote>“A plausible answer is not a controlled financial result.”</blockquote></section>

    <ProductExplainer />

    <section className={styles.output} aria-labelledby="output-title"><div className={styles.sectionHead}><p className={styles.marker}>THE OUTPUT</p><h2 id="output-title">What leaves the workflow.</h2><p>Not a chat response. A reviewed financial state designed to be examined, explained and used.</p></div><div className={styles.deliverables}>{deliverables.map(([number, name, detail]) => <article key={number}><span>{number}</span><h3>{name}</h3><p>{detail}</p></article>)}</div><aside><b>SCOPE</b><span>One agreed financial document set</span><i/><b>METHOD</b><span>AI interpretation + deterministic control + human review</span><i/><b>DELIVERY</b><span>Securely coordinated after payment</span></aside></section>

    <section id="pilot-checkout" className={styles.pilot} aria-labelledby="pilot-title">
      <div className={styles.pilotIntro}><p className={styles.marker}>THE PILOT</p><h2 id="pilot-title">Commission the first execution.</h2><p>Choose the route that matches where the purchasing business is legally established. Stripe securely collects the company and billing details; Entimema follows with scope confirmation and document-upload instructions.</p><Link href="/contact?topic=financial-data">Need scope or tax confirmation? Speak with Entimema →</Link></div>
      <div className={styles.pricing}><article><header><span>BULGARIA B2B</span><strong>€588</strong><small>€490 + €98 VAT</small></header><h3>Business established in Bulgaria</h3><p>20% Bulgarian VAT included.</p><FinancialIntelligenceCta href={bulgariaCheckoutUrl} kind="domestic_checkout" position="pricing">Continue to Stripe <b aria-hidden="true">↗</b></FinancialIntelligenceCta></article><article><header><span>INTERNATIONAL B2B</span><strong>€490</strong><small>Subject to verified business status</small></header><h3>Business established outside Bulgaria</h3><p>Company registration or applicable business tax ID required.</p><FinancialIntelligenceCta href={internationalCheckoutUrl} kind="international_checkout" position="pricing">Continue to Stripe <b aria-hidden="true">↗</b></FinancialIntelligenceCta></article></div>
      <p className={styles.taxNote}>If the submitted business or tax status cannot be validated, additional tax may become due or the order may be cancelled and refunded. If uncertain, contact Entimema before payment.</p>
    </section>

    <footer className={styles.closing}><p className={styles.marker}>THE PRINCIPLE</p><p>Models interpret.<br/>Rules control.<br/><em>Humans decide.</em></p><div><Link href="/alexander-dimitrov">Alexander Dimitrov</Link><span>Founder, Entimema</span></div></footer>
  </article></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /></>;
}
