import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollExperience from "@/components/ScrollExperience";
import CompanyCta from "@/components/company/CompanyCta";
import DecisionConstellation from "@/components/company/DecisionConstellation";
import company from "@/components/company/company.module.css";
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

const tensions = [
  ["Information without a common structure", "Spreadsheets, ERP systems, models, reports and documents describe the same business in different ways. Reconstructing that picture still depends on manual interpretation."],
  ["Reporting without the reasoning", "Reports record what happened. The assumptions behind a forecast, the meaning of an exception and the case for action often remain implicit."],
  ["Finance and risk in parallel", "Economic performance and risk are assessed through separate frameworks, even when they inform the same decision."],
  ["More analysis, less visibility", "AI expands what can be interpreted. Without explicit controls, it can also obscure how a conclusion was reached and whether it can be trusted."],
];
const disciplines = [
  ["Finance", "Economic structure and measurement."],
  ["Risk", "Uncertainty, controls and decision boundaries."],
  ["Decision Science", "The reasoning architecture connecting evidence to action."],
  ["Research", "Methodological depth and testable foundations."],
  ["AI Systems", "Scalable interpretation and execution within governed workflows."],
];
const method = [
  ["Evidence", "Begin with the source.", "Evidence precedes inference. Facts, claims and their origins remain distinguishable."],
  ["Interpretation", "Make meaning explicit.", "Models interpret context. Unknowns remain visible rather than becoming untested assumptions."],
  ["Validation", "Separate inference from control.", "Deterministic rules test arithmetic, reconciliations and financial constraints independently of model interpretation."],
  ["Decision", "Keep judgment accountable.", "Material ambiguity goes to human review. A decision retains the evidence, controls and reasoning that support it."],
  ["Execution", "Carry the evidence forward.", "Approved decisions move into action through traceable workflows. Outcomes inform the next review."],
];

export default function AboutPage() {
  return <>
    <Navbar active="about" />
    <main id="about-main" data-company="about" className={`${legacy.page} editorial-surface ${styles.page} ${company.page}`}>
      <ScrollExperience company="about" />
      <div className="editorial-container">
        <section className={`editorial-hero ${styles.hero}`} aria-labelledby="about-heading" data-company-scene>
          <DecisionConstellation variant="about" />
          <p className="editorial-eyebrow">Entimema / Decision Intelligence</p>
          <h1 id="about-heading" className={`editorial-display-lg editorial-reveal-text ${styles.heroTitle}`}>
            <span>Financial decisions are becoming more complex.</span>
            <span>The systems supporting them should become more intelligent.</span>
          </h1>
          <div className={`editorial-grid editorial-grid--desktop ${styles.heroContext}`}>
            <p className={`editorial-col-4 editorial-technical-label ${styles.positioning}`}>Finance × Risk<br />Decision Science × Research</p>
            <p className="editorial-col-8 editorial-standfirst-md">Entimema is a practitioner-led financial intelligence and decision systems company. We combine finance, risk, research and applied AI to improve how organizations understand, govern and execute financial decisions.</p>
          </div>
          <nav className={`editorial-metadata ${styles.chapterLinks}`} aria-label="About page sections">
            <Link className="editorial-link--quiet" href="#about-problem">01 / The problem</Link>
            <Link className="editorial-link--quiet" href="#about-thesis">02 / The thesis</Link>
            <Link className="editorial-link--quiet" href="#about-method">03 / The method</Link>
          </nav>
          <hr className="editorial-rule-strong editorial-reveal-rule" />
        </section>

        <section className={`editorial-section editorial-grid editorial-grid--desktop editorial-reveal-fade ${styles.section}`} aria-labelledby="about-problem">
          <div className="editorial-col-5 editorial-stack">
            <p className="editorial-eyebrow">01 / The tension</p>
            <h2 id="about-problem" className="editorial-headline-xl">Financial systems record activity. They do not always support decisions.</h2>
          </div>
          <div className="editorial-col-7">
            {tensions.map(([heading, copy]) => <div className={`editorial-item ${styles.problemItem}`} key={heading}>
              <h3 className="editorial-headline-md">{heading}</h3>
              <p className="editorial-body-md">{copy}</p>
            </div>)}
          </div>
        </section>
      </div>

      <section className={`editorial-major-section editorial-surface--institutional ${styles.thesis}`} aria-labelledby="about-thesis">
        <div className="editorial-container">
          <div className="editorial-grid editorial-grid--desktop">
            <div className="editorial-col-7 editorial-stack">
              <p className="editorial-eyebrow">02 / The transformation</p>
              <h2 id="about-thesis" className="editorial-display-md">From financial reporting to decision intelligence.</h2>
            </div>
            <p className={`editorial-col-5 editorial-standfirst-md ${styles.thesisIntro}`}>A useful decision system connects what a business knows, what it assumes, what it can verify and what it is prepared to do.</p>
          </div>
          <dl className={styles.disciplines}>
            {disciplines.map(([name, role], index) => <div key={name}>
              <dt><span className="editorial-metadata" aria-hidden="true">0{index + 1}</span><span className="editorial-headline-md">{name}</span></dt>
              <dd className="editorial-body-md">{role}</dd>
            </div>)}
          </dl>
          <div className={`editorial-grid editorial-grid--desktop ${styles.thesisClosing}`}>
            <p className="editorial-col-8 editorial-body-lg">These are parts of one reasoning architecture. Entimema brings them together so that financial interpretation, risk boundaries and execution remain connected to the same evidence.</p>
            <div className={`editorial-col-4 ${styles.alignEnd}`}><Link className="editorial-link--arrow" href="/services">Explore our work <span aria-hidden="true">→</span></Link></div>
          </div>
        </div>
      </section>

      <div className="editorial-container">
        <section className={`editorial-major-section editorial-reveal-fade ${styles.section}`} aria-labelledby="about-method">
          <div className="editorial-grid editorial-grid--desktop">
            <div className="editorial-col-7 editorial-stack">
              <p className="editorial-eyebrow">03 / The method</p>
              <h2 id="about-method" className="editorial-headline-xl">A decision is only as sound as the path behind it.</h2>
            </div>
            <p className={`editorial-col-5 editorial-body-lg ${styles.thesisIntro}`}>Each stage has a distinct responsibility. Interpretation does not replace validation, and automation does not remove human accountability.</p>
          </div>
          <ol className={`editorial-index editorial-reveal-metadata ${styles.method}`} role="list">
            {method.map(([stage, heading, copy]) => <li key={stage}>
              <div className={styles.methodContent}>
                <p className="editorial-technical-label">{stage}</p>
                <div><h3 className="editorial-headline-md">{heading}</h3><p className="editorial-body-md">{copy}</p></div>
              </div>
            </li>)}
          </ol>
        </section>

        <section className={`editorial-section ${styles.research}`} aria-labelledby="about-research">
          <div className="editorial-section-header editorial-stack">
            <p className="editorial-eyebrow">04 / Research × Product</p>
            <h2 id="about-research" className="editorial-display-md">Research is not separate from the product.</h2>
            <p className="editorial-standfirst-md">Methodology becomes useful when it can operate inside a real financial workflow. Execution reveals where that methodology needs to improve.</p>
          </div>
          <div className={`editorial-grid editorial-grid--desktop ${styles.researchLoop}`}>
            <div className="editorial-col-6 editorial-stack">
              <h3 className="editorial-headline-lg">Research defines the logic.</h3>
              <p className="editorial-body-md">Entimema Research develops methodology and intellectual property: frameworks, validation methods and decision logic that can be examined and tested.</p>
              <p className={`editorial-technical-label ${styles.sequence}`}>Methodology → Frameworks → Validation → Decision logic</p>
            </div>
            <div className="editorial-col-6 editorial-stack">
              <h3 className="editorial-headline-lg">Product puts it to work.</h3>
              <p className="editorial-body-md">Financial Intelligence operationalizes that methodology in end-to-end workflows, from source intake and interpretation to controls, review and execution.</p>
              <p className={`editorial-technical-label ${styles.sequence}`}>Intake → Interpretation → Controls → Review → Execution</p>
            </div>
          </div>
          <div className={styles.feedback}>
            <span aria-hidden="true">↳</span>
            <p className="editorial-body-md">Evidence from execution returns to research. Exceptions expose gaps; reviewed outcomes sharpen the methodology. The next workflow carries that learning forward.</p>
          </div>
        </section>

        <section className={`editorial-major-section editorial-grid editorial-grid--desktop ${styles.section}`} aria-labelledby="about-direction">
          <div className="editorial-col-5 editorial-stack">
            <p className="editorial-eyebrow">05 / The resolve</p>
            <h2 id="about-direction" className="editorial-headline-xl">Building the operating layer for financial decisions.</h2>
          </div>
          <div className={`editorial-col-7 editorial-stack ${styles.directionCopy}`}>
            <p className="editorial-standfirst-md">The unit of work is a governed financial workflow—not a chatbot, an isolated model or a collection of disconnected agents.</p>
            <p className="editorial-body-md">Our direction is toward financial and risk workflows that are structured, traceable and auditable. As they adapt and become more autonomous in bounded tasks, consequential decisions remain human-governed.</p>
            <p className="editorial-body-md">Entimema combines finance, risk, decision science, research and AI-enabled workflows to improve the quality, traceability and execution of financial decisions.</p>
          </div>
        </section>

        <section className={`editorial-section ${styles.bridges}`} aria-label="The research agenda and practitioner foundation">
          <div className="editorial-grid editorial-grid--desktop">
            <div className={`editorial-col-6 editorial-item editorial-stack ${styles.labsBridge}`}>
              <p className="editorial-eyebrow">The research agenda</p>
              <h2 className="editorial-headline-lg">The inquiry behind the systems.</h2>
              <p className="editorial-body-md">Entimema Labs develops the research agenda behind the systems. The company sets the institutional mission; Labs develops the methods; Financial Intelligence brings them into execution.</p>
              <Link className="editorial-link--arrow" href="/labs">Explore Entimema Labs <span aria-hidden="true">→</span></Link>
            </div>
            <div className={`editorial-col-6 editorial-item editorial-stack ${styles.practitionerBridge}`}>
              <p className="editorial-eyebrow">The practitioner foundation</p>
              <h2 className="editorial-headline-lg">Practitioner-led by design.</h2>
              <p className="editorial-body-md">Entimema is founded and led by Alexander Dimitrov, whose experience spans finance, accounting, controlling and credit risk. That grounding keeps the work connected to the decisions practitioners actually face.</p>
              <Link className="editorial-link--arrow" href="/alexander-dimitrov">About the Founder <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </div>

      <section className={`editorial-major-section editorial-surface--institutional ${styles.closing}`} aria-labelledby="about-closing">
        <div className="editorial-container editorial-stack">
          <p className="editorial-eyebrow">From the thesis to the work</p>
          <h2 id="about-closing" className="editorial-display-md">Follow the reasoning. Explore the workflow.</h2>
          <div className={styles.actions}>
            <div><CompanyCta className={`editorial-link--research ${styles.primaryAction}`} href="/workspace/financial-intelligence">Explore Financial Intelligence <span aria-hidden="true">→</span></CompanyCta><p className="editorial-caption">Secure workspace · sign-in required</p></div>
            <div className={styles.secondaryActions}>
              <Link className="editorial-link--arrow" href="/resources">Read Entimema Research <span aria-hidden="true">→</span></Link>
              <Link className={`editorial-link--quiet ${styles.tertiaryAction}`} href="/contact">Start a conversation <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>
      <footer className={legacy.minimalFooter}><div className={legacy.minimalFooterInner}><span>© 2026 Entimema</span><Link href="/privacy">Privacy</Link></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ "@context": "https://schema.org", "@type": "AboutPage", "@id": `${url}#webpage`, url, name: title, description, about: { "@id": ORGANIZATION_ID }, mainEntity: { "@id": ORGANIZATION_ID }, isPartOf: { "@id": WEBSITE_ID } }) }} />
    </main>
  </>;
}
