import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollExperience from "@/components/ScrollExperience";
import CompanyCta from "@/components/company/CompanyCta";
import DecisionConstellation from "@/components/company/DecisionConstellation";
import company from "@/components/company/company.module.css";
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
    <main data-company="labs" className={`editorial-surface ${styles.page} ${company.page}`}>
      <ScrollExperience company="labs" />
      <div className={`editorial-container editorial-container--editorial ${styles.container}`}>
        <section className={styles.hero} aria-labelledby="labs-heading" id="remit" data-company-scene>
          <DecisionConstellation variant="labs" />
          <div className={styles.heroCopy}>
            <p className="editorial-eyebrow">Entimema Labs <span className={styles.divider}>/</span> 01 — Research remit</p>
            <h1 className="editorial-display-lg" id="labs-heading">Research for financial and risk systems that must be trusted.</h1>
            <p className={`editorial-standfirst-md ${styles.intro}`}>Entimema Labs develops the methods, validation logic and decision architectures behind controlled financial and risk workflows.</p>
            <p className="editorial-body-md">We turn recurring practitioner problems into methods that can be inspected, tested and—within a defined scope—operationalised.</p>
            <Link className={`editorial-link--arrow ${styles.agendaLink}`} href="#research-agenda">Explore the research agenda <Arrow /></Link>
          </div>
          <aside className={styles.readingKey} aria-label="How to read this agenda">
            <p className="editorial-technical-label">How to read this agenda</p>
            <dl>{evidenceStates.map((state) => <div key={state.title}><dt>{state.title}</dt><dd>{state.description}</dd></div>)}</dl>
            <p className="editorial-caption">A published method, an implemented capability and an empirically validated result are different kinds of evidence.</p>
          </aside>
        </section>

        <section className={`${styles.section} ${styles.problem}`} aria-labelledby="question-heading" id="investigative-problem">
          <header><p className="editorial-eyebrow">02 / The practitioner problem</p><h2 className="editorial-headline-lg" id="question-heading">What makes a financial result usable, reviewable and accountable?</h2></header>
          <div className={styles.prose}>
            <p className="editorial-body-md">Data, models, reports and automation each provide part of an answer. A controlled workflow must also show which evidence supports a result, which rule verifies it and who decides when uncertainty remains.</p>
            <p className="editorial-body-md">Labs investigates those boundaries: interpretation is not validation, and a model output is not yet a decision.</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="agenda-heading" id="research-agenda">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">03 / Research agenda</p><h2 className="editorial-headline-lg" id="agenda-heading">Three domains. One standard of evidence.</h2><p className="editorial-body-md">Financial controls, AI governance, traceability and human judgement connect every part of the agenda.</p></header>
          <div className={styles.domains}>{domains.map((domain, index) => <article className={styles.domain} key={domain.id} id={domain.id} aria-labelledby={`${domain.id}-heading`}>
            <span className={styles.index} aria-hidden="true">0{index + 1}</span>
            <div><h3 className="editorial-technical-label" id={`${domain.id}-heading`}>{domain.title}</h3><p className={styles.question}>{domain.question}</p><p className={`editorial-caption ${styles.boundary}`}><strong>Scope boundary.</strong> {domain.boundary}</p></div>
            <div className={styles.investigations}><p className="editorial-technical-label">What we investigate</p><ul>{domain.investigations.map((item) => <li key={item}>{item}</li>)}</ul><p className={`editorial-technical-label ${styles.workLabel}`}>Selected existing work</p><ul className={styles.workLinks}>{domain.work.map((slug) => { const work = researchWork(slug); return <li key={slug}><Link className="editorial-link" href={work.canonicalPath}>{work.headline}</Link></li>; })}</ul></div>
          </article>)}</div>
        </section>

        <section className={styles.section} aria-labelledby="method-heading" id="investigation-method">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">04 / How we investigate</p><h2 className="editorial-headline-lg" id="method-heading">From practitioner problem to operational method.</h2><p className="editorial-body-md">Observe → Structure → Test → Operationalise → Improve</p></header>
          <ol className={styles.process}>{process.map((step, index) => <li key={step.title}><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
          <div className={styles.methodNote}>
            <p className="editorial-technical-label">Methodological position</p><p className="editorial-body-md">Models interpret; rules control. Evidence, assumptions and unknowns must remain distinguishable, with consequential ambiguity available for human review.</p>
            <p className="editorial-caption">One boundary applies throughout: implementation does not, by itself, establish empirical validation beyond its tested scope.</p>
          </div>
          <DecisionGraph />
        </section>

        <section className={`${styles.section} ${styles.application}`} aria-labelledby="application-heading" id="applied-system">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">05 / Applied proof</p><p className={`editorial-technical-label ${styles.exampleLabel}`}>Implemented example</p><h2 className="editorial-headline-lg" id="application-heading">Traceable Income Statement analysis</h2><p className="editorial-body-md">Financial Intelligence V1</p><p className="editorial-body-md">Research question → Method → Product control → Reviewable output</p></header>
          <ol className={styles.applicationChain}>{applicationSteps.map((step, index) => <li key={step.title}><div className={styles.applicationStage}><span className="editorial-metadata" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3></div><div><p>{step.description}</p><Link className="editorial-link" href={researchWork(step.slug).canonicalPath}>{step.linkLabel} <Arrow /></Link></div></li>)}</ol>
          <div className={styles.applicationBoundary}><p className="editorial-body-md"><strong>Implementation boundary.</strong> The current workflow is for eligible English Income Statements in XLSX, XLSM, CSV or text-based PDF files. It does not implement the entire Labs agenda, and its existence is not evidence of empirical validation across other financial or credit decisions.</p><div><Link className="editorial-link--arrow" href="/workspace/financial-intelligence">See Financial Intelligence in practice <Arrow /></Link><p className="editorial-caption">Secure workspace · sign-in required</p></div></div>
        </section>

        <section className={styles.section} aria-labelledby="publications-heading" id="selected-work">
          <header className={styles.sectionHeader}><p className="editorial-eyebrow">06 / Selected methodological work</p><h2 className="editorial-headline-lg" id="publications-heading">Methods available for inspection.</h2><p className="editorial-body-md">Selected research behind financial intelligence, credit risk and controlled decision workflows.</p></header>
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
          <div className={styles.exploreLinks}><CompanyCta className={`editorial-link--research ${styles.primaryLink}`} href="/resources">Explore Entimema Research <Arrow /></CompanyCta><div><Link className="editorial-link--arrow" href="/workspace/financial-intelligence">See Financial Intelligence in practice <Arrow /></Link><p className="editorial-caption">Secure workspace · sign-in required</p></div><Link className="editorial-link--arrow" href="/alexander-dimitrov">About the Founder <Arrow /></Link><Link className="editorial-link--quiet" href="/contact">Start a conversation <Arrow /></Link></div>
        </section>
      </div>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(labsSchema) }} />
  </>;
}
