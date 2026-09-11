import type { Metadata } from "next";
import Link from "next/link";
import AnalyticsPreferencesButton from "@/components/AnalyticsPreferencesButton";
import Navbar from "@/components/Navbar";
import styles from "./privacy.module.css";

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
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>PRIVACY NOTICE</p>
          <h1>How Entimema handles personal data.</h1>
          <p className={styles.lead}>
            This notice explains how personal data is processed when you visit
            entimema.com, submit an inquiry or communicate with Entimema.
          </p>
          <p className={styles.assurance}>
            ENTIMEMA EDPK is the controller for the website and business
            communications described in this notice.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="mailto:office@entimema.com">
              Contact us about privacy
            </a>
            <Link className={styles.secondary} href="/security">
              Read Security &amp; Trust <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className={styles.heroIndex} aria-label="Privacy notice areas">
          <span>SCOPE</span>
          <span>PURPOSE</span>
          <span>PROVIDERS</span>
          <span>RIGHTS</span>
        </div>
      </header>

      <section
        className={styles.section}
        id="scope"
        aria-labelledby="scope-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 · SCOPE</p>
          <h2 id="scope-heading">
            The organisation responsible for your data.
          </h2>
          <p>
            This notice applies to Entimema’s public website, inquiry forms and
            direct business communications.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <article>
            <span>LEGAL ENTITY</span>
            <h3>ENTIMEMA EDPK</h3>
            <p>
              A single-member variable capital company incorporated under
              Bulgarian law.
            </p>
          </article>
          <article>
            <span>REGISTRATION</span>
            <h3>UIC 208447293</h3>
            <p>Registered in the Republic of Bulgaria.</p>
          </article>
          <article>
            <span>REGISTERED OFFICE</span>
            <h3>Plovdiv, Bulgaria</h3>
            <p>
              117 General Danail Nikolaev Street, Floor 3, Apartment 8,
              Tsentralen District, 4002.
            </p>
          </article>
          <article>
            <span>PRIVACY CONTACT</span>
            <h3>office@entimema.com</h3>
            <p>For privacy questions and data-subject requests.</p>
          </article>
        </div>
        <p className={styles.afterGrid}>
          Customer-document processing inside a product workflow is outside this
          website notice. See <Link href="/security">Security &amp; Trust</Link>{" "}
          for the current workflow assurance scope.
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.ice}`}
        id="data"
        aria-labelledby="data-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 · DATA &amp; PURPOSE</p>
          <h2 id="data-heading">We process what the interaction requires.</h2>
          <p>
            The data depends on how you use the website and whether you choose
            to contact Entimema.
          </p>
        </div>
        <div className={styles.scopeLayout}>
          <div>
            <h3>Data processed</h3>
            <ul className={styles.checkList}>
              <li>
                Contact details, including name, business email, organisation
                and role
              </li>
              <li>Inquiry content and subsequent correspondence</li>
              <li>
                Technical and security information, including IP address,
                browser, device and request logs
              </li>
              <li>Cookie and usage data when optional analytics are enabled</li>
            </ul>
            <p className={styles.note}>
              Please avoid including unnecessary personal or confidential
              information in an inquiry.
            </p>
          </div>
          <aside className={styles.boundary}>
            <p className={styles.eyebrow}>PURPOSE LIMITATION</p>
            <h3>Why the data is used</h3>
            <ul>
              <li>Respond to inquiries and requested services</li>
              <li>Operate, secure and diagnose the website</li>
              <li>Maintain necessary business records</li>
              <li>Measure consented website use</li>
            </ul>
          </aside>
        </div>
      </section>

      <section
        className={styles.section}
        id="legal-bases"
        aria-labelledby="bases-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>03 · LEGAL BASES</p>
          <h2 id="bases-heading">A defined basis for each purpose.</h2>
        </div>
        <div
          className={styles.table}
          role="table"
          aria-label="Purposes and legal bases"
        >
          <div role="row">
            <strong role="columnheader">Purpose</strong>
            <strong role="columnheader">Legal basis</strong>
          </div>
          <div role="row">
            <span role="cell">
              Respond to inquiries and communicate about requested services
            </span>
            <span role="cell">
              Steps requested before a contract and legitimate interests in
              business communication
            </span>
          </div>
          <div role="row">
            <span role="cell">Operate, secure and diagnose the website</span>
            <span role="cell">
              Legitimate interests in providing a reliable and secure website
            </span>
          </div>
          <div role="row">
            <span role="cell">
              Maintain business correspondence and records
            </span>
            <span role="cell">
              Legitimate interests and applicable legal obligations
            </span>
          </div>
          <div role="row">
            <span role="cell">
              Measure website use through optional analytics
            </span>
            <span role="cell">
              Consent, withdrawable through analytics preferences
            </span>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.ice}`}
        id="providers"
        aria-labelledby="providers-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>04 · SERVICE PROVIDERS</p>
          <h2 id="providers-heading">A limited operating stack.</h2>
          <p>
            Service providers are used where needed to operate the website and
            handle communications.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <article>
            <span>01</span>
            <h3>Vercel</h3>
            <p>Website hosting and delivery.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Resend</h3>
            <p>Contact-form transmission.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Google Workspace</h3>
            <p>Business correspondence.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Google Analytics</h3>
            <p>Optional, consent-based website analytics.</p>
          </article>
        </div>
        <p className={styles.afterGrid}>
          Providers process data according to their role and applicable
          contractual terms. Optional Google Analytics is activated only after
          consent.
        </p>
        <AnalyticsPreferencesButton className={styles.preferencesButton} />
      </section>

      <section
        className={styles.section}
        id="retention"
        aria-labelledby="retention-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>05 · RETENTION</p>
          <h2 id="retention-heading">
            Kept only as long as the purpose requires.
          </h2>
        </div>
        <div className={styles.readingBlock}>
          <p>
            Personal data is kept only for as long as reasonably needed for the
            purpose for which it was collected, including responding to and
            maintaining an appropriate record of communications, operating and
            securing the website, resolving disputes and meeting legal
            obligations.
          </p>
          <p>
            Retention periods vary with the data, purpose and relevant
            requirements.
          </p>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.governance}`}
        id="rights"
        aria-labelledby="rights-heading"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>06 · YOUR RIGHTS</p>
          <h2 id="rights-heading">Control remains with the data subject.</h2>
          <p>
            Depending on applicable law, you may exercise the following rights.
          </p>
        </div>
        <div className={styles.states}>
          <article>
            <span aria-hidden="true" />
            <h3>Access and correction</h3>
            <p>
              Request access to personal data and correction of inaccurate
              information.
            </p>
          </article>
          <article>
            <span aria-hidden="true" />
            <h3>Deletion and restriction</h3>
            <p>
              Request deletion or restriction where the applicable conditions
              are met.
            </p>
          </article>
          <article>
            <span aria-hidden="true" />
            <h3>Objection and portability</h3>
            <p>
              Object to certain processing and request portability where
              applicable.
            </p>
          </article>
        </div>
        <p className={styles.afterGrid}>
          Where processing relies on consent, you may withdraw it without
          affecting earlier lawful processing. You may also complain to an
          applicable data-protection authority. We may need information to
          verify your identity and understand the request.
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.contactSection}`}
        id="contact"
        aria-labelledby="contact-heading"
      >
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>PRIVACY CONTACT</p>
          <h2 id="contact-heading">
            A direct route for questions and requests.
          </h2>
          <p>
            Contact ENTIMEMA EDPK to ask a privacy question or exercise a
            data-subject right. This notice may be updated when website
            processing, providers or applicable requirements change.
          </p>
          <a className={styles.primary} href="mailto:office@entimema.com">
            office@entimema.com
          </a>
        </div>
        <div className={styles.related}>
          <span>RELATED ASSURANCE</span>
          <h3>Security &amp; Trust</h3>
          <p>
            Review data handling, scope boundaries and human accountability for
            the current Financial Intelligence workflow.
          </p>
          <Link href="/security">
            Read the security overview <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
