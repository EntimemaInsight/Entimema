import type { Metadata } from "next";
import Image from "next/image";
import AnalyticsPreferencesButton from "@/components/AnalyticsPreferencesButton";
import { DemoTrigger } from "@/components/DemoDiscovery";
import Navbar from "@/components/Navbar";
import styles from "../trust-page.module.css";

const title = "Privacy Notice | Entimema";
const description =
  "How Entimema processes personal data when you visit the website, submit an inquiry or communicate with us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.entimema.com/privacy" },
  openGraph: {
    title,
    description,
    url: "https://www.entimema.com/privacy",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article>
        <header className={styles.securityHero}>
          <div className={styles.heroVisual}>
            <Image
              src="/privacy-controls.png"
              alt="Six illustrated privacy controls: organisational responsibility, individual rights, consent, data separation, retention and privacy requests."
              width={1296}
              height={1032}
              priority
            />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.securityEyebrow}>Our commitment to privacy</p>
            <h1>How Entimema handles personal data.</h1>
            <p className={styles.securityIntro}>
              This notice explains how personal data is processed when you visit
              entimema.com, submit an inquiry or communicate with Entimema.
            </p>
          </div>
        </header>
        <div className={styles.securityContent}>
          <section>
            <h2>Scope</h2>
            <p>
              The controller of personal data is <strong>ENTIMEMA EDPK</strong>,
              a single-member variable capital company incorporated under
              Bulgarian law, registered under UIC <strong>208447293</strong>.
            </p>
            <p>
              <strong>Registered office:</strong> 117 General Danail Nikolaev
              Street, Floor 3, Apartment 8, Tsentralen District, 4002 Plovdiv,
              Bulgaria.
            </p>
            <p>
              This notice applies to personal data processed through Entimema’s
              public website, inquiry forms and direct business communications.
              It does not describe customer-document processing inside a product
              workflow.
            </p>
          </section>
          <section>
            <h2>Data processed</h2>
            <p>Depending on how you interact with Entimema, we may process:</p>
            <ul>
              <li>
                contact details, such as your name, business email address,
                organisation and role;
              </li>
              <li>the contents of an inquiry and subsequent correspondence;</li>
              <li>
                technical and security information, such as IP address, browser,
                device and request logs;
              </li>
              <li>
                cookie and usage data where you have enabled optional analytics.
              </li>
            </ul>
            <p>
              Please avoid including unnecessary personal or confidential
              information in an inquiry.
            </p>
          </section>
          <section>
            <h2>Purposes and legal bases</h2>
            <p>
              <strong>Responding to inquiries and requested services:</strong>{" "}
              Steps requested before a contract and legitimate interests in
              business communication.
            </p>
            <p>
              <strong>Operating, securing and diagnosing the website:</strong>{" "}
              Legitimate interests in providing a reliable and secure website.
            </p>
            <p>
              <strong>Maintaining business correspondence and records:</strong>{" "}
              Legitimate interests and applicable legal obligations.
            </p>
            <p>
              <strong>Measuring optional website analytics:</strong> Consent,
              which can be withdrawn through analytics preferences.
            </p>
          </section>
          <section>
            <h2>Service providers</h2>
            <p>
              Entimema uses service providers where needed to operate the
              website and handle communications.
            </p>
            <ul>
              <li>
                <strong>Vercel</strong> for website hosting and delivery;
              </li>
              <li>
                <strong>Resend</strong> for contact-form transmission;
              </li>
              <li>
                <strong>Google Workspace</strong> for business correspondence;
              </li>
              <li>
                <strong>Google Analytics</strong> for consent-based website
                analytics.
              </li>
            </ul>
            <p>
              Providers process data according to their role and applicable
              contractual terms. Optional Google Analytics is activated only
              after consent.
            </p>
            <AnalyticsPreferencesButton className={styles.preferencesButton} />
          </section>
          <section>
            <h2>Retention</h2>
            <p>
              Personal data is kept only for as long as reasonably needed for
              the purpose for which it was collected, including responding to
              and maintaining an appropriate record of communications, operating
              and securing the website, resolving disputes and meeting legal
              obligations. Retention periods vary with the data, purpose and
              relevant requirements.
            </p>
          </section>
          <section>
            <h2>Data-subject rights</h2>
            <p>
              Depending on applicable law, you may have rights to request access
              to, correction or deletion of your personal data, restriction of
              or objection to processing, and data portability. Where processing
              relies on consent, you may withdraw that consent without affecting
              earlier lawful processing. You may also have the right to complain
              to an applicable data-protection authority.
            </p>
            <p>
              We may need information to verify your identity and understand the
              request before responding.
            </p>
          </section>
          <section>
            <h2>Privacy contact and updates</h2>
            <p>
              To ask a privacy question or exercise a data-subject right,
              contact ENTIMEMA EDPK at{" "}
              <a href="mailto:office@entimema.com">office@entimema.com</a>.
            </p>
            <p>
              This notice may be updated when website processing, providers or
              applicable requirements change. The current version is published
              on this page.
            </p>
          </section>
        </div>
      </article>
      <section className={styles.securityCta} aria-labelledby="privacy-cta-title">
        <h2 id="privacy-cta-title">Ready to see Entimema in action?</h2>
        <DemoTrigger className={styles.securityCtaButton}>Get a demo</DemoTrigger>
      </section>
    </main>
  );
}
