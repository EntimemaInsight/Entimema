import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { PilotAcceptance } from "./PilotAcceptance";
import styles from "./offer.module.css";

export const metadata: Metadata = {
  title: "Financial Intelligence controlled pilot | Entimema",
  description: "Review the scope, price and terms of the Entimema Financial Intelligence controlled pilot.",
  alternates: { canonical: "/pilot/financial-intelligence/offer" },
};

const included = [
  "Financial line extraction and canonical mapping",
  "Period harmonization across up to 3 reporting periods",
  "Deterministic validation and reconciliation",
  "Verified KPIs and financial findings",
  "Confidence assessment and exception handling",
  "Human review of material exceptions",
  "Validated model and traceable export",
] as const;

const boundaries = [
  "ERP or third-party system integration",
  "Custom software development",
  "Accounting audit or assurance opinion",
  "Unlimited documents, users or processing",
  "Automated approval of financial decisions",
  "Ongoing subscription access after the pilot",
] as const;

export default function FinancialIntelligencePilotOfferPage() {
  return (
    <main className={styles.page}>
      <Navbar active="product" />
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p>FINANCIAL INTELLIGENCE · STANDARD PILOT OFFER</p>
            <h1>Validate the workflow on your own financial documents.</h1>
          </div>
          <div className={styles.price}>
            <span>FIXED PILOT FEE</span>
            <strong>€490</strong>
            <small>excluding VAT, where applicable</small>
          </div>
        </header>

        <section className={styles.summary} aria-labelledby="offer-summary">
          <div>
            <p>THE OFFER</p>
            <h2 id="offer-summary">One controlled pilot. A defined scope. A review-ready result.</h2>
          </div>
          <p>Use Financial Intelligence with a limited set of real company documents before deciding whether an ongoing subscription is justified.</p>
        </section>

        <section className={styles.parameters} aria-label="Pilot parameters">
          <article><span>DOCUMENTS</span><strong>Up to 5</strong><small>supported financial documents</small></article>
          <article><span>TOTAL LENGTH</span><strong>Up to 50 pages</strong><small>across all documents</small></article>
          <article><span>PERIODS</span><strong>Up to 3</strong><small>reporting periods</small></article>
          <article><span>USERS</span><strong>Up to 2</strong><small>named users</small></article>
          <article><span>WORKSPACE</span><strong>30 days</strong><small>restricted access</small></article>
          <article><span>DELIVERY</span><strong>5 business days</strong><small>after valid inputs are received</small></article>
        </section>

        <div className={styles.columns}>
          <section>
            <p>INCLUDED</p>
            <h2>What you receive</h2>
            <ul>{included.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
          </section>
          <section>
            <p>SCOPE BOUNDARIES</p>
            <h2>Not included</h2>
            <ul>{boundaries.map((item) => <li key={item}><span>—</span>{item}</li>)}</ul>
          </section>
        </div>

        <section className={styles.terms}>
          <div><span>PAYMENT</span><strong>100% in advance</strong></div>
          <div><span>START</span><strong>After payment and valid inputs</strong></div>
          <div><span>DOCUMENT SUPPORT</span><strong>Confirmed before processing</strong></div>
          <div><span>NEXT STEP</span><strong>Subscription offered only after demonstrated value</strong></div>
        </section>

        <aside className={styles.boundary}>
          <div><p>OUTSIDE THE STANDARD SCOPE?</p><h2>Larger volume or integration requirements need a custom scope.</h2></div>
          <a href="mailto:office@entimema.com?subject=Financial%20Intelligence%20custom%20pilot%20scope">Request custom scope</a>
        </aside>

        <PilotAcceptance />
      </div>
    </main>
  );
}
