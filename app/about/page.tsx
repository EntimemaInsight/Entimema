import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ORGANIZATION_ID, WEBSITE_ID, serializeJsonLd } from "@/lib/structured-data";
import styles from "./institutional.module.css";
import legacy from "./about.module.css";

const title = "About Entimema | Controlled Financial Decision Systems";
const description = "Entimema builds controlled financial and credit-risk decision systems that connect evidence, model intelligence, deterministic logic and human judgement.";
const url = "https://www.entimema.com/about";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: url },
  openGraph: { type: "website", title, description, url, siteName: "Entimema" },
  twitter: { card: "summary", title, description },
};

const domains = [
  { title: "Financial Intelligence", text: "Systems that interpret, harmonise and validate financial information before transforming it into traceable analysis and management insight.", href: "/services/financial-data" },
  { title: "Credit Risk", text: "Methodologies and decision workflows for measuring, monitoring and governing credit risk across the decision lifecycle.", href: "/services/credit-risk" },
  { title: "Decision Systems", text: "Architectures that combine model intelligence, deterministic controls and human review in a single auditable workflow.", href: "/services/decision-automation" },
];
const responsibilities = [
  ["Model intelligence interprets", "Models support document understanding, semantic mapping, contextual reasoning and ambiguity detection."],
  ["Deterministic logic controls", "Rules and code retain responsibility for arithmetic, reconciliations, control totals and fixed decision requirements."],
  ["People govern judgement", "Material uncertainty, exceptions and consequential judgements remain visible and subject to human review."],
];
const principles = [
  ["Evidence before inference", "Every material conclusion should remain connected to identifiable evidence."],
  ["Uncertainty must remain visible", "Unknowns and assumptions should be surfaced, not converted into false precision."],
  ["Traceability is a design requirement", "A decision should preserve the path from source information through transformation, control and review."],
  ["Automation must remain accountable", "Efficiency cannot come at the cost of explainability, governance or professional responsibility."],
];

export default function AboutPage() {
  return <>
    <Navbar active="about" />
    <main className={`${legacy.page} ${styles.page}`}>
      <Container>
        <section className={styles.hero} aria-labelledby="about-heading">
          <p className={styles.label}>About Entimema</p>
          <h1 id="about-heading">Decision infrastructure for finance and risk.</h1>
          <p className={styles.intro}>Entimema builds controlled systems that help finance and risk teams move from fragmented data, models and judgement to decisions that can be understood, tested and improved.</p>
          <p className={styles.support}>We believe intelligence creates value only when it operates inside a clear evidence chain.</p>
          <div className={styles.actions}><Button href="/services">Explore our work</Button><Button href="/resources" variant="secondary">Read our research</Button></div>
          <div className={styles.evidenceChain} aria-hidden="true"><span>Evidence</span><i /><span>Interpretation</span><i /><span>Control</span><i /><span>Review</span><i /><span>Decision</span></div>
        </section>
        <section className={`${styles.section} ${styles.split}`} aria-labelledby="about-problem">
          <div><p className={styles.label}>Why Entimema exists</p><h2 id="about-problem">Financial decisions remain fragmented.</h2></div>
          <div className={styles.copy}><p>Finance and risk teams rarely suffer from a lack of data, models or software. The harder problem is that these elements often operate without a shared decision structure.</p><p>Evidence sits across documents and systems. Calculations are separated from their assumptions. Model outputs are difficult to reconcile with business judgement. Exceptions are handled outside the workflow, and the reasoning behind a decision becomes difficult to trace.</p><p>Entimema exists to close that gap.</p></div>
        </section>
        <section className={styles.section} aria-labelledby="about-build">
          <p className={styles.label}>What we build</p><h2 id="about-build">Controlled workflows for consequential decisions.</h2>
          <div className={styles.threeColumns}>{domains.map(item => <div className={styles.column} key={item.title}><h3><Link href={item.href}>{item.title}<span aria-hidden="true"> ↗</span></Link></h3><p>{item.text}</p></div>)}</div>
        </section>
        <section className={styles.section} aria-labelledby="about-approach">
          <p className={styles.label}>Our approach</p><h2 id="about-approach">Different forms of intelligence need different responsibilities.</h2>
          <div className={styles.threeColumns}>{responsibilities.map(([heading, copy], index) => <div className={styles.column} key={heading}><span className={styles.number} aria-hidden="true">0{index + 1}</span><h3>{heading}</h3><p>{copy}</p></div>)}</div>
          <p className={styles.approachClosing}>The objective is not to remove judgement. It is to give judgement better evidence, clearer boundaries and a traceable place inside the system.</p>
        </section>
        <section className={`${styles.section} ${styles.split}`} aria-labelledby="about-principles">
          <div><p className={styles.label}>What we believe</p><h2 id="about-principles">Control is part of intelligence.</h2></div>
          <div className={styles.principles}>{principles.map(([heading, copy]) => <div key={heading}><h3>{heading}</h3><p>{copy}</p></div>)}</div>
        </section>
        <section className={styles.section} aria-labelledby="about-inside">
          <p className={styles.label}>Inside Entimema</p><h2 id="about-inside">The company, its founder and its research environment.</h2>
          <div className={styles.pathways}>
            <div><h3>Founder</h3><p>Learn about Alexander Dimitrov and the practitioner experience behind Entimema.</p><Link href="/alexander-dimitrov">Meet the founder <span aria-hidden="true">→</span></Link></div>
            <div><h3>Entimema Labs</h3><p>Explore the research environment where financial and risk methodology becomes operational decision infrastructure.</p><Link href="/labs">Explore Entimema Labs <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>
      </Container>
      <section className={styles.closing} aria-labelledby="about-closing"><Container><h2 id="about-closing">Better decisions should be explainable by design.</h2><p>Entimema brings evidence, methodology, controls and human judgement into one decision structure—so financial intelligence can be used with confidence.</p><Link href="/resources">Explore our research <span aria-hidden="true">→</span></Link></Container></section>
      <footer className={legacy.minimalFooter}><div className={legacy.minimalFooterInner}><span>© 2026 Entimema</span><Link href="/privacy">Privacy</Link></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ "@context": "https://schema.org", "@type": "AboutPage", "@id": `${url}#webpage`, url, name: title, description, about: { "@id": ORGANIZATION_ID }, mainEntity: { "@id": ORGANIZATION_ID }, isPartOf: { "@id": WEBSITE_ID } }) }} />
    </main>
  </>;
}
