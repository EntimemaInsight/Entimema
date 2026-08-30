import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { serializeJsonLd } from "@/lib/structured-data";
import { resourceStreams, resourceTopics } from "../resources/resource-data";
import { applicationSteps, domains, evidenceStates, process, selectedPublications, openQuestions, researchWork, labsTitle, labsDescription, labsUrl, labsSchema } from "./labs-data";
import styles from "./labs.module.css";
import DecisionGraph from "./DecisionGraph";

export const metadata: Metadata = {
  title: { absolute: labsTitle }, description: labsDescription,
  alternates: { canonical: labsUrl },
  openGraph: { type: "website", title: labsTitle, description: labsDescription, url: labsUrl, siteName: "Entimema" },
  twitter: { card: "summary", title: labsTitle, description: labsDescription },
};

const Arrow = () => <span aria-hidden="true">→</span>;
const publicationDate = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date));

export default function LabsPage() {
  return <>
    <Navbar />
    <main className={`editorial-surface ${styles.page}`}>
      <div className={`editorial-container editorial-container--editorial ${styles.container}`}>
        <section className={styles.hero} aria-labelledby="labs-heading" id="remit">
          <div className={styles.heroCopy}>
            <p className="editorial-eyebrow">Entimema Labs <span className={styles.divider}>/</span> 01 — Research remit</p>
            <h1 className="editorial-display-lg" id="labs-heading">The questions behind financial decisions.</h1>
            <p className={`editorial-standfirst-md ${styles.intro}`}>Entimema Labs investigates what happens when financial methodology, risk reasoning and AI-assisted systems must operate inside real decisions.</p>
            <p className="editorial-body-md">We formulate questions, develop methods and examine how selected elements can work in financial systems. The agenda remains open to scrutiny, exceptions and revision.</p>
            <Link className={`editorial-link--arrow ${styles.agendaLink}`} href="#research-agenda">Explore the research agenda <Arrow /></Link>
          </div>
          <aside className={styles.readingKey} aria-label="How to read this agenda">
            <p className="editorial-technical-label">How to read this agenda</p>
            <dl>{evidenceStates.map((state) => <div key={state.title}><dt>{state.title}</dt><dd>{state.description}</dd></div>)}</dl>
            <p className="editorial-caption">These are different kinds of claim, not equivalent measures of maturity. Publication does not prove implementation; implementation does not prove empirical validation.</p>
          </aside>
        </section>

        <section className={`${styles.section} ${styles.problem}`} aria-labelledby="question-heading" id="investigative-problem">
          <header><p className="editorial-eyebrow">02 / The investigative problem</p><h2 className="editorial-headline-lg" id="question-heading">What connects an analytical result to an accountable decision?</h2></header>
          <div className={styles.prose}>
            <p className="editorial-body-md">Data, models, reports and automation each provide part of an answer. The research question concerns their interaction: which evidence supports a claim, which rule can test it, and who should decide when uncertainty remains?</p>
            <p className="editorial-body-md">A reconciliation can establish arithmetic consistency without establishing meaning. A model can interpret meaning without establishing whether action is justified. Labs investigates those boundaries and the hand-offs between them.</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="agenda-heading" id="research-agenda">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">03 / Research agenda</p><h2 className="editorial-headline-lg" id="agenda-heading">Three domains. Questions that cross their boundaries.</h2><p className="editorial-body-md">Financial controls, AI governance, traceability and human judgement run through the agenda. They are shared concerns, not separate programmes.</p></header>
          <div className={styles.domains}>{domains.map((domain, index) => <article className={styles.domain} key={domain.id} id={domain.id} aria-labelledby={`${domain.id}-heading`}>
            <span className={styles.index} aria-hidden="true">0{index + 1}</span>
            <div><h3 className="editorial-technical-label" id={`${domain.id}-heading`}>{domain.title}</h3><p className={styles.question}>{domain.question}</p><p className={`editorial-caption ${styles.boundary}`}><strong>Scope boundary.</strong> {domain.boundary}</p></div>
            <div className={styles.investigations}><p className="editorial-technical-label">What we investigate</p><ul>{domain.investigations.map((item) => <li key={item}>{item}</li>)}</ul><p className={`editorial-technical-label ${styles.workLabel}`}>Selected existing work</p><ul className={styles.workLinks}>{domain.work.map((slug) => { const work = researchWork(slug); return <li key={slug}><Link className="editorial-link" href={work.canonicalPath}>{work.headline}</Link></li>; })}</ul></div>
          </article>)}</div>
        </section>

        <section className={styles.section} aria-labelledby="method-heading" id="investigation-method">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">04 / How we investigate</p><h2 className="editorial-headline-lg" id="method-heading">A method for making the reasoning inspectable.</h2><p className="editorial-body-md">Research is valuable when it can withstand scrutiny—and still work inside a real decision.</p></header>
          <ol className={styles.process}>{process.map((step, index) => <li key={step.title}><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
          <div className={styles.methodNote}>
            <p className="editorial-technical-label">Methodological position</p><p className="editorial-body-md">Models interpret; rules control. Evidence, assumptions and unknowns must remain distinguishable, with consequential ambiguity available for human review.</p>
            <p className="editorial-caption">Exceptions and corrections can expose a gap. They do not automatically constitute empirical research learning, nor does every correction train or improve an AI model.</p>
          </div>
          <DecisionGraph />
        </section>

        <section className={`${styles.section} ${styles.application}`} aria-labelledby="application-heading" id="applied-system">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">05 / Methodology in an applied system</p><p className={`editorial-technical-label ${styles.exampleLabel}`}>Implemented example</p><h2 className="editorial-headline-lg" id="application-heading">Traceable Income Statement</h2><p className="editorial-body-md">Financial Intelligence / Income Statement v1</p><p className="editorial-body-md">One bounded example of how selected methodology becomes an operational workflow, from a financial value to its evidence, checks and review.</p></header>
          <ol className={styles.applicationChain}>{applicationSteps.map((step, index) => <li key={step.title}><div className={styles.applicationStage}><span className="editorial-metadata" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3></div><div><p>{step.description}</p><Link className="editorial-link" href={researchWork(step.slug).canonicalPath}>{step.linkLabel} <Arrow /></Link></div></li>)}</ol>
          <div className={styles.applicationBoundary}><p className="editorial-body-md"><strong>Implementation boundary.</strong> The current workflow is for eligible English Income Statements in XLSX, XLSM, CSV or text-based PDF files. It does not implement the entire Labs agenda, and its existence is not evidence of empirical validation across other financial or credit decisions.</p><div><Link className="editorial-link--arrow" href="/workspace/financial-intelligence">See Financial Intelligence in practice <Arrow /></Link><p className="editorial-caption">Secure workspace · sign-in required</p></div></div>
        </section>

        <section className={styles.section} aria-labelledby="publications-heading" id="selected-work">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">06 / Selected methodological work</p><h2 className="editorial-headline-lg" id="publications-heading">The work behind the questions.</h2><p className="editorial-body-md">Published research makes the methods available for inspection. These selections connect to the agenda; they are not a catalogue of implemented capabilities.</p></header>
          <div className={styles.publications}>{selectedPublications.map(({ resource, reason }) => <article className={styles.publication} key={resource.slug} data-publication={resource.slug}>
            <div className={styles.publicationMeta}><p className="editorial-technical-label">{resourceStreams[resource.stream].label}</p><p className="editorial-metadata">{resourceTopics.find((topic) => topic.slug === resource.topic)?.label}</p>{resource.publishedAt && <time className="editorial-metadata" dateTime={resource.publishedAt}>{publicationDate(resource.publishedAt)}</time>}<p className="editorial-metadata">{resource.readingMinutes} min read</p><p className="editorial-metadata">{resource.author.name}</p></div>
            <div><h3 className="editorial-headline-md"><Link className="editorial-link" href={resource.canonicalPath}>{resource.headline}</Link></h3><p className="editorial-body-md">{reason}</p></div>
          </article>)}</div>
          <Link className={`editorial-link--arrow ${styles.allResearch}`} href="/resources">Explore all research <Arrow /></Link>
        </section>

        <section className={styles.section} aria-labelledby="open-heading" id="open-questions">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">07 / Open questions</p><h2 className="editorial-headline-lg" id="open-heading">What remains unresolved.</h2><p className="editorial-body-md">These questions guide further investigation. They are research directions, not promised features or claims of completed validation.</p></header>
          <ul className={styles.openQuestions}>{openQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
        </section>

        <section className={`${styles.section} ${styles.explore}`} aria-labelledby="explore-heading" id="explore">
          <header><p className="editorial-eyebrow">08 / Explore</p><h2 className="editorial-headline-lg" id="explore-heading">Inspect the method. Explore its application.</h2><p className="editorial-body-md">Entimema Labs is practitioner-led by Alexander Dimitrov.</p></header>
          <div className={styles.exploreLinks}><Link className={`editorial-link--research ${styles.primaryLink}`} href="/resources">Explore Entimema Research <Arrow /></Link><div><Link className="editorial-link--arrow" href="/workspace/financial-intelligence">See Financial Intelligence in practice <Arrow /></Link><p className="editorial-caption">Secure workspace · sign-in required</p></div><Link className="editorial-link--arrow" href="/alexander-dimitrov">About the Founder <Arrow /></Link><Link className="editorial-link--quiet" href="/contact">Start a conversation <Arrow /></Link></div>
        </section>
      </div>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(labsSchema) }} />
  </>;
}
