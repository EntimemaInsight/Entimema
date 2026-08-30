import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ResourceCard from "../resources/ResourceCard";
import { GENERAL_CONSULTING_CTA } from "@/lib/cta-labels";
import { serializeJsonLd, SITE_URL } from "@/lib/structured-data";
import { areas, biography, founderName, founderUrl, personSchema, portraitAlt, portraitPath, selectedArticles, thesis } from "./founder-data";
import styles from "./founder.module.css";

const title = "Alexander Dimitrov | Founder of Entimema";
const description = "Alexander Dimitrov is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.";

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
      <main className={styles.page}>
        <Container className={styles.container}>
          <section className={styles.introduction} aria-labelledby="founder-name">
            <div className={styles.heading}>
              <p className={styles.role}>Founder, Entimema</p>
              <h1 id="founder-name">{founderName}</h1>
            </div>
            <div className={styles.portrait} data-founder-portrait>
              {/* Preserve the original 400px JPEG bytes: no second lossy pass,
                  optimizer enlargement, or artificial enhancement. */}
              <Image src={portraitPath} alt={portraitAlt} fill unoptimized
                sizes="(max-width: 440px) calc(100vw - 40px), (min-width: 1280px) 360px, 400px"
                loading="eager" fetchPriority="high" />
            </div>
            <div className={styles.biography}>{biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>
          <section className={styles.thesis} aria-label="Founder thesis"><p>{thesis}</p></section>
          <section className={styles.work} aria-labelledby="areas-heading">
            <h2 id="areas-heading">Areas of work</h2>
            <div className={styles.matrix}>{areas.map((area) => <div key={area.title}><h3>{area.title}</h3><p>{area.description}</p></div>)}</div>
          </section>
          <section className={styles.research} aria-labelledby="research-heading">
            <div className={styles.sectionHeading}><h2 id="research-heading">Alexander Dimitrov’s articles</h2><Link href="/resources">Explore all research <span aria-hidden="true">→</span></Link></div>
            <div className={styles.articles}>{selectedArticles.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}</div>
          </section>
          <section className={styles.cta} aria-labelledby="conversation-heading">
            <h2 id="conversation-heading">Bring the decision, process or financial system you are trying to improve.</h2>
            <Button href="/contact">{GENERAL_CONSULTING_CTA}</Button>
          </section>
        </Container>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(personSchema) }} />
    </>
  );
}
