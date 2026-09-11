import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import company from "@/components/company/company.module.css";
import { serializeJsonLd, SITE_URL } from "@/lib/structured-data";
import { getTopic } from "../resources/resource-data";
import { biography, founderName, founderProfileSchema, founderUrl, identityStatement, personSchema, portraitAlt, portraitPath, profileIntro, researchQuestions, selectedArticles } from "./founder-data";
import styles from "./founder.module.css";

const title = "Alexander Dimitrov | Founder of Entimema";
const description = "Alexander Dimitrov is the Founder of Entimema, a financial intelligence company building controlled AI workflows for finance and risk decisions.";

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
        <div className={`editorial-container editorial-container--editorial ${styles.container}`}>
          <section className={styles.introduction} aria-labelledby="founder-name">
            <div className={styles.heading}>
              <p className="editorial-eyebrow">Founder of Entimema</p>
              <h1 id="founder-name" className={`editorial-display-md editorial-reveal-text ${styles.name}`}>{founderName}</h1>
              <p className={`editorial-standfirst-md ${styles.standfirst}`}>{profileIntro}</p>
              <a className={styles.linkedinLink} data-founder-linkedin href={personSchema.sameAs[0]} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.portrait} data-founder-portrait>
              {/* Preserve the original 400px JPEG bytes and square source-size cap. */}
              <Image src={portraitPath} alt={portraitAlt} fill unoptimized
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) 32vw, 400px"
                loading="eager" fetchPriority="high" />
            </div>
            <div className={`editorial-body-md ${styles.biography}`}>{biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>
          <section className={`editorial-section ${styles.section}`} aria-labelledby="research-heading">
            <div className={styles.articlesHeader}><h2 id="research-heading" className="editorial-headline-xl">Alexander Dimitrov&apos;s articles</h2><Link className="editorial-link--arrow" href="/resources">Explore all research <span aria-hidden="true">→</span></Link></div>
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

          <p className={styles.nameVariants}><span>Name variants</span> {identityStatement}</p>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(founderProfileSchema) }} />
    </>
  );
}
