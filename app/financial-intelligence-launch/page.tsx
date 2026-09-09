import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import styles from "./launch.module.css";
import ProductExplainer from "./ProductExplainer";
import { FinancialIntelligenceCta, FinancialIntelligenceViewAnalytics } from "./FinancialIntelligenceAnalytics";

const path = "/financial-intelligence-launch";
const url = `${SITE_URL}${path}`;
const title = "Controlled financial intelligence, from evidence to decision";
const description = "A controlled B2B pilot that turns financial documents into validated, traceable and decision-ready financial outputs.";
const bulgariaCheckoutUrl = "https://buy.stripe.com/eVq5kF4Yhe9ga8mb41dEs00";
const internationalCheckoutUrl = "https://buy.stripe.com/6oU3cx8at9T0eoCegddEs01";

export const metadata: Metadata = {
  title: { absolute: `${title} | Entimema Financial Intelligence` }, description,
  alternates: { canonical: url },
  openGraph: { type: "article", url, title, description, siteName: "Entimema", publishedTime: "2026-09-09", authors: [`${SITE_URL}/alexander-dimitrov`], images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${url}/opengraph-image`] },
};

const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID }, about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }], breadcrumb: { "@id": `${url}#breadcrumb` }, datePublished: "2026-09-09" }, createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence", item: url }], `${url}#breadcrumb`)] };

const outputs = [
  ["Validated model", "A controlled financial state, not a generated answer."],
  ["Visible exceptions", "Ambiguity is surfaced and routed for review."],
  ["Evidence lineage", "Material values retain their path to source."],
] as const;

export default function FinancialIntelligenceLaunchPage() {
  return <><Navbar /><main className={styles.page}><FinancialIntelligenceViewAnalytics />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span /> Financial Intelligence · Founding pilot</p>
        <h1>Turn financial evidence into a <em>controlled decision.</em></h1>
        <p className={styles.lead}>Entimema interprets financial documents, validates the numbers and surfaces every material exception before the result reaches a decision.</p>
        <nav className={styles.heroActions} aria-label="Pilot actions">
          <FinancialIntelligenceCta href="#pilot-checkout" kind="start_pilot" position="hero">Commission a pilot <span aria-hidden="true">↗</span></FinancialIntelligenceCta>
          <FinancialIntelligenceCta href="#workflow" kind="workflow" position="hero">See the workflow <span aria-hidden="true">↓</span></FinancialIntelligenceCta>
        </nav>
        <div className={styles.heroMeta}><span>One company</span><span>One reporting scope</span><span>From €490</span></div>
      </div>
      <div className={styles.systemView} aria-label="Evidence to decision workflow">
        <div className={styles.systemTop}><span>FI / CONTROLLED EXECUTION</span><span className={styles.live}><i /> SYSTEM READY</span></div>
        <div className={styles.sourceNode}><small>INPUT</small><strong>Financial evidence</strong><span>PDF · XLSX · CSV</span></div>
        <div className={styles.flowRail} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.nodes}>
          <div><small>01</small><b>Interpret</b><span>Model</span></div>
          <div><small>02</small><b>Validate</b><span>Rules</span></div>
          <div><small>03</small><b>Review</b><span>Human</span></div>
        </div>
        <div className={styles.resultNode}><span><small>OUTPUT</small><strong>Decision-ready model</strong></span><b>CONTROLLED</b></div>
        <div className={styles.systemFoot}><span>Evidence linked</span><span>Exceptions visible</span><span>Judgement retained</span></div>
      </div>
    </header>

    <section className={styles.promise} aria-label="Product definition"><p>Not another AI answer.</p><h2>A governed financial workflow where models interpret, rules control and humans decide.</h2></section>
    <ProductExplainer />

    <section className={styles.outcome} aria-labelledby="outcome-title">
      <div className={styles.sectionIntro}><p className={styles.eyebrow}><span /> The controlled output</p><h2 id="outcome-title">Built to be examined.<br/>Ready to be used.</h2></div>
      <div className={styles.outputGrid}>{outputs.map(([outputTitle, copy], index) => <article key={outputTitle}><span>0{index + 1}</span><h3>{outputTitle}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section id="pilot-checkout" className={styles.pilot} aria-labelledby="pilot-title">
      <div className={styles.pilotHead}><div><p className={styles.eyebrow}><span /> Paid founding pilot</p><h2 id="pilot-title">Commission one controlled execution.</h2></div><p>After payment, Entimema confirms the scope and sends secure document-upload instructions. Processing starts only after the evidence set has been reviewed.</p></div>
      <div className={styles.pricing}>
        <article><div><span>BULGARIA B2B</span><strong>€588</strong><small>€490 + €98 VAT</small></div><h3>For a business established in Bulgaria.</h3><FinancialIntelligenceCta href={bulgariaCheckoutUrl} kind="domestic_checkout" position="pricing">Continue securely <b aria-hidden="true">↗</b></FinancialIntelligenceCta></article>
        <article><div><span>INTERNATIONAL B2B</span><strong>€490</strong><small>Verified business status required</small></div><h3>For a business established outside Bulgaria.</h3><FinancialIntelligenceCta href={internationalCheckoutUrl} kind="international_checkout" position="pricing">Continue securely <b aria-hidden="true">↗</b></FinancialIntelligenceCta></article>
      </div>
      <div className={styles.pilotFoot}><p>Company registration and applicable tax details are collected in Stripe Checkout.</p><Link href="/contact?topic=financial-data">Discuss scope before payment <span aria-hidden="true">→</span></Link></div>
    </section>

    <footer className={styles.closing}><div><span>ENTIMEMA</span><p>Financial intelligence with control.</p></div><Link href="/alexander-dimitrov">Alexander Dimitrov · Founder <span aria-hidden="true">→</span></Link></footer>
  </main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /></>;
}
