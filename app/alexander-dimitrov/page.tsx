import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollExperience from "@/components/ScrollExperience";
import CompanyCta from "@/components/company/CompanyCta";
import DecisionConstellation from "@/components/company/DecisionConstellation";
import company from "@/components/company/company.module.css";
import { GENERAL_CONSULTING_CTA } from "@/lib/cta-labels";
import { serializeJsonLd, SITE_URL } from "@/lib/structured-data";
import { getTopic } from "../resources/resource-data";
import { biography, foundations, founderName, founderProfileSchema, founderUrl, identityStatement, personSchema, portraitAlt, portraitPath, principles, productBridge, profileIntro, researchQuestions, selectedArticles, structuralProblems, thesis, whyEntimema } from "./founder-data";
import styles from "./founder.module.css";

const title = "Alexander Dimitrov | Founder of Entimema";
const description = "Alexander Dimitrov (Aleksandar Dimitrov; Александър Димитров) is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: founderUrl },
  openGraph: {
    type: "profile", title, description, url: founderUrl,
    firstName: "Alexander", lastName: "Dimitrov",
    images: [{ url: `${SITE_URL}${portraitPath}`, width: 400, height: 400, alt: portraitAlt }],
  },
  twitter: { card: "summary", title, description, images: [`${SITE_URL}${portraitPath}`] },
};

export default function FounderPage() {
  return (
    <>
      <Navbar />
      <main data-company="founder" className={`editorial-surface ${styles.page} ${company.page}`}>
      <ScrollExperience company="founder" />
        <div className={`editorial-container editorial-container--editorial ${styles.container}`}>
          <section className={styles.introduction} aria-labelledby="founder-name">
            <div className={styles.heading}>
              <p className="editorial-eyebrow">Founder, Entimema</p>
              <h1 id="founder-name" className={`editorial-display-md editorial-reveal-text ${styles.name}`}>{founderName}</h1>
              <p className={`editorial-standfirst-md ${styles.standfirst}`}>{profileIntro}</p>
            </div>
            <div className={styles.portrait} data-founder-portrait>
              {/* Preserve the original 400px JPEG bytes and square source-size cap. */}
              <Image src={portraitPath} alt={portraitAlt} fill unoptimized
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) 32vw, 400px"
                loading="eager" fetchPriority="high" />
              <a className={styles.linkedinBadge} data-founder-linkedin
                href={personSchema.sameAs[0]} target="_blank" rel="noopener noreferrer"
                aria-label="View Alexander Dimitrov on LinkedIn">
                {/* Font Awesome Free 6.7.2 by @fontawesome — https://fontawesome.com; icon: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/; Copyright 2024 Fonticons, Inc. */}
                <svg viewBox="0 0 448 512" width="24" height="28" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
              </a>
            </div>
            <div className={`editorial-body-md ${styles.biography}`}>{biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>
          <hr className="editorial-rule-strong editorial-reveal-rule" />

          <section className={`editorial-section ${styles.section}`} aria-labelledby="areas-heading">
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">01 / Practitioner foundations</p>
                <h2 id="areas-heading" className="editorial-headline-xl">Different disciplines.<br />One decision.</h2>
              </div>
              <p className={`editorial-col-7 editorial-body-md ${styles.sectionIntro}`}>Alexander’s perspective has been shaped at the intersection of finance, risk, quantitative modelling and enterprise decision systems. These disciplines approach financial decisions from different directions, but ultimately confront the same problem: how to preserve meaning, uncertainty and accountability as reality is transformed into data, analysis and institutional action.</p>
            </div>
            <ol className={`editorial-index ${styles.foundations}`} role="list">
              {foundations.map((foundation) => <li key={foundation.title}>
                <div className={styles.foundationContent}>
                  <h3 className="editorial-headline-md">{foundation.title}</h3>
                  <p className="editorial-body-md">{foundation.description}</p>
                </div>
              </li>)}
            </ol>
          </section>

          <section className={`editorial-section editorial-reveal-fade ${styles.section}`} aria-labelledby="problem-heading">
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">02 / The recurring problem</p>
                <h2 id="problem-heading" className="editorial-headline-xl">The missing layer is decision structure.</h2>
              </div>
              <div className={`editorial-col-7 editorial-body-md ${styles.copy}`}>
                <p>Finance and Risk organizations generate vast amounts of data, models, rules and analysis. Yet these elements do not automatically form a coherent decision architecture.</p>
                <p>Accounting definitions may diverge from analytical definitions. Models may abstract away operational context. Rules may encode assumptions that are no longer visible. Conclusions may become progressively detached from their original evidence as they pass between spreadsheets, systems, reports and decision-makers.</p>
                <p>The result is not merely fragmented information. It is fragmented reasoning.</p>
                <dl className={styles.observations}>{structuralProblems.map((problem) => <div key={problem.title}>
                  <dt className="editorial-technical-label">{problem.title}</dt>
                  <dd>{problem.description}</dd>
                </div>)}</dl>
              </div>
            </div>
          </section>

          <section className={`editorial-section ${styles.section}`} aria-labelledby="perspective-heading">
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">03 / A practical point of view</p>
                <h2 id="perspective-heading" className="editorial-headline-xl">A model has to work in practice.</h2>
              </div>
              <div className={`editorial-col-7 ${styles.copy}`}>
                <blockquote className={`editorial-quote ${styles.thesis}`} aria-label="Founder thesis"><p>{thesis}</p></blockquote>
                {principles.map((principle) => <p key={principle} className="editorial-body-md">{principle}</p>)}
              </div>
            </div>
          </section>

          <section className={`editorial-section ${styles.section} ${styles.entimema}`} aria-labelledby="entimema-heading" data-company-scene>
            <DecisionConstellation variant="founder" />
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">04 / Why Entimema</p>
                <h2 id="entimema-heading" className="editorial-headline-xl">From fragmented reasoning to decision architecture.</h2>
              </div>
              <div className={`editorial-col-7 editorial-body-md ${styles.copy}`}>
                {whyEntimema.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <Link className="editorial-link--arrow" href="/about">Why Entimema <span aria-hidden="true">→</span></Link>
                <aside className={styles.labsBridge} aria-label="The research agenda">
                  <p className="editorial-technical-label">Entimema Labs</p>
                  <p>A new decision architecture requires methods that can be examined, challenged and improved. Entimema Labs provides the research environment in which practitioner questions are developed into original frameworks, analytical methods and operational designs.</p>
                  <Link className="editorial-link--arrow" href="/labs">Explore Entimema Labs <span aria-hidden="true">→</span></Link>
                </aside>
              </div>
            </div>
          </section>

          <section className={`editorial-section ${styles.section}`} aria-labelledby="research-heading">
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">05 / Research as evidence</p>
                <h2 id="research-heading" className="editorial-headline-xl">The questions behind the work.</h2>
              </div>
              <div className={`editorial-col-7 editorial-body-md ${styles.copy}`}>
                <p>Entimema Research examines the methodological questions beneath financial and risk decisions: where a number comes from, what it represents, which assumptions shape it, how uncertainty enters the analysis and how a conclusion can remain traceable as it moves into operational use.</p>
                <p>The publications make that reasoning available for scrutiny. Together, they provide evidence of the intellectual and methodological foundations on which Entimema is being built.</p>
                <Link className="editorial-link--arrow" href="/resources">Explore all research <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className={styles.articles}>
              {selectedArticles.map((resource) => <article key={resource.slug}>
                <Link href={resource.canonicalPath} className={styles.researchEntry} aria-labelledby={`publication-${resource.slug}`}>
                  <div className={styles.researchCover}>
                    {"src" in resource.cover && <Image src={resource.cover.src} alt={resource.cover.alt} fill
                      sizes="(max-width: 767px) 88px, 160px" quality={90} loading="lazy"
                      style={{ objectPosition: resource.cover.focalPoint ?? "50% 50%" }} />}
                  </div>
                  <div className={styles.researchDetail}>
                    <p className={`editorial-metadata ${styles.articleMeta}`}><span>{getTopic(resource.topic)?.label}</span><span>{resource.readingMinutes} MIN READ</span></p>
                    <h3 id={`publication-${resource.slug}`} className={`editorial-headline-md ${styles.articleTitle}`}>{resource.headline} <span aria-hidden="true">→</span></h3>
                    <p className={`editorial-body-sm ${styles.researchQuestion}`}>{researchQuestions[resource.slug]}</p>
                  </div>
                </Link>
              </article>)}
            </div>
          </section>

          <section className={`editorial-section ${styles.section} ${styles.closing}`} aria-labelledby="conversation-heading">
            <div className={`editorial-grid editorial-grid--desktop ${styles.sectionHeader}`}>
              <div className="editorial-col-5 editorial-stack">
                <p className="editorial-eyebrow">06 / From reasoning to use</p>
                <h2 id="conversation-heading" className="editorial-headline-xl">The work continues in the workflow.</h2>
              </div>
              <div className={`editorial-col-7 editorial-body-md ${styles.sectionIntro} ${styles.copy}`}>
                <p>{productBridge}</p>
                <p>The future of Finance and Risk is not simply more automation. It is better decision architecture: systems through which financial reasoning becomes faster and more adaptable without becoming less rigorous, explainable or accountable.</p>
                <p>Entimema exists to help finance organizations and financial institutions move toward that model.</p>
              </div>
            </div>
            <div className={styles.actions}>
              <div><CompanyCta className={`editorial-link--research ${styles.primaryAction}`} href="/workspace/financial-intelligence">Explore Financial Intelligence <span aria-hidden="true">→</span></CompanyCta><p className="editorial-caption">Secure workspace · sign-in required</p></div>
              <div className={styles.secondaryActions}>
                <Link className="editorial-link--arrow" href="/resources">Read Entimema Research <span aria-hidden="true">→</span></Link>
                <Link className={`editorial-link--quiet ${styles.tertiaryAction}`} href="/contact">{GENERAL_CONSULTING_CTA} <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <p className={styles.nameVariants}><span>Name variants</span> {identityStatement}</p>
          </section>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(founderProfileSchema) }} />
    </>
  );
}
