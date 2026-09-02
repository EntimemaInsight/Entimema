import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createFinaiSchema, FINAI_URL, serializeJsonLd } from "@/lib/structured-data";
import styles from "./finai.module.css";

const title = "FinAI: AI Agents for Finance and Risk | Entimema";
const description = "FinAI by Entimema is a governed architecture for AI agents in Finance and Risk, developed by Entimema and founder Alexander Dimitrov.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ["FinAI", "Entimema FinAI", "Alexander Dimitrov FinAI", "AI agents for finance", "AI agents for risk"],
  alternates: { canonical: FINAI_URL },
  openGraph: { type: "website", title, description, url: FINAI_URL, siteName: "Entimema" },
  twitter: { card: "summary_large_image", title, description },
};

const principles = [
  ["Interpret", "AI agents organise context, surface patterns and make ambiguity explicit."],
  ["Control", "Deterministic logic owns calculations, reconciliations, policy constraints and fixed decision rules."],
  ["Evidence", "Every material conclusion remains connected to its source, transformation and validation state."],
  ["Decide", "Human judgement remains accountable where evidence is incomplete, conflicting or consequential."],
] as const;

const domains = [
  ["Finance", "Planning, reporting, profitability, working capital and financial analysis."],
  ["Risk", "Credit decisions, portfolio monitoring, model governance and controlled exceptions."],
  ["Operations", "Traceable workflows that move from document and data intake to reviewable action."],
] as const;

export default function FinaiPage() {
  return <>
    <Navbar />
    <main className={`editorial-surface ${styles.page}`}>
      <article className={`editorial-container editorial-container--editorial ${styles.container}`}>
        <header className={styles.hero} aria-labelledby="finai-heading">
          <div className={styles.heroIndex} aria-hidden="true"><span>F</span><span>AI</span></div>
          <div className={styles.heroCopy}>
            <p className="editorial-eyebrow">FinAI by Entimema / Category definition</p>
            <h1 id="finai-heading" className={`editorial-display-lg ${styles.title}`}><span>FinAI.</span><span>Finance is learning to think.</span></h1>
            <p className={`editorial-standfirst-md ${styles.standfirst}`}>FinAI is a governed architecture for AI agents in Finance and Risk—connecting model reasoning, deterministic controls, traceable evidence and accountable human judgement.</p>
            <p className={styles.byline}>Developed by <Link href="/">Entimema</Link> · Articulated by <Link href="/alexander-dimitrov">Alexander Dimitrov, Founder</Link></p>
          </div>
        </header>

        <section className={styles.definition} aria-labelledby="definition-heading">
          <p className="editorial-eyebrow">01 / The definition</p>
          <div>
            <h2 id="definition-heading" className="editorial-headline-xl">Not AI added to finance.<br />A financial system designed for AI.</h2>
            <div className={`editorial-body-md ${styles.prose}`}>
              <p>FinAI by Entimema names a specific design position. AI agents can interpret unstructured evidence and compressed specialist knowledge, but they should not be asked to silently invent the premises on which a financial decision depends.</p>
              <p>The architecture separates interpretation from control. Models reason across context. Deterministic systems protect arithmetic and policy. Evidence remains traceable. People retain authority over material judgement.</p>
            </div>
          </div>
        </section>

        <section className={styles.architecture} aria-labelledby="architecture-heading">
          <header>
            <p className="editorial-eyebrow">02 / The architecture</p>
            <h2 id="architecture-heading" className="editorial-headline-xl">Four responsibilities.<br />One governed decision.</h2>
          </header>
          <ol className={styles.principles}>
            {principles.map(([name, explanation], index) => <li key={name}>
              <span aria-hidden="true">0{index + 1}</span><h3>{name}</h3><p>{explanation}</p>
            </li>)}
          </ol>
          <p className={styles.thesis}>AI interprets ambiguity. Rules protect financial truth. Evidence carries the reasoning. Humans own the decision.</p>
        </section>

        <section className={styles.application} aria-labelledby="application-heading">
          <header>
            <p className="editorial-eyebrow">03 / The field of application</p>
            <h2 id="application-heading" className="editorial-headline-xl">Finance and Risk share the same problem: turning evidence into accountable action.</h2>
          </header>
          <div className={styles.domains}>
            {domains.map(([name, explanation]) => <article key={name}><h3>{name}</h3><p>{explanation}</p></article>)}
          </div>
        </section>

        <section className={styles.ownership} aria-labelledby="ownership-heading">
          <p className="editorial-eyebrow">04 / The origin</p>
          <div>
            <h2 id="ownership-heading" className="editorial-headline-xl">FinAI by Entimema.</h2>
            <div className={`editorial-body-md ${styles.prose}`}>
              <p>Entimema is building FinAI agents around controlled financial workflows—not around a generic chatbot interface. The product boundary is the complete decision path: evidence, interpretation, calculation, validation, exception handling and accountable review.</p>
              <p><Link href="/alexander-dimitrov">Alexander Dimitrov</Link> founded Entimema around this thesis. His work connects financial management, credit risk, quantitative models, enterprise systems and the practical logic through which institutions actually make decisions.</p>
            </div>
            <nav className={styles.links} aria-label="Explore FinAI by Entimema">
              <Link href="/services/financial-ai-agents">Finance AI agents <span aria-hidden="true">→</span></Link>
              <Link href="/services/risk-ai-agents">Risk AI agents <span aria-hidden="true">→</span></Link>
              <Link href="/resources">Entimema Research <span aria-hidden="true">→</span></Link>
            </nav>
          </div>
        </section>
      </article>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createFinaiSchema()) }} />
  </>;
}
