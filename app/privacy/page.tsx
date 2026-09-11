import type { Metadata } from "next";
import Link from "next/link";
import AnalyticsPreferencesButton from "@/components/AnalyticsPreferencesButton";
import Navbar from "@/components/Navbar";
import styles from "./privacy.module.css";

const title = "Privacy Notice | Entimema";
const description = "How Entimema processes personal data when you visit the website, submit an inquiry or communicate with us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.entimema.com/privacy" },
  openGraph: { title, description, url: "https://www.entimema.com/privacy", type: "website" },
  twitter: { card: "summary", title, description },
};

const sections = [
  ["scope", "Scope"], ["data", "Data processed"], ["purposes", "Purposes and legal bases"],
  ["providers", "Service providers"], ["retention", "Retention"], ["rights", "Data-subject rights"],
  ["contact", "Privacy contact and updates"],
] as const;

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <header className={styles.hero}>
        <div><p className={styles.eyebrow}>PRIVACY NOTICE</p><h1>How Entimema handles personal data.</h1><p className={styles.intro}>This notice explains how personal data is processed when you visit entimema.com, submit an inquiry or communicate with Entimema.</p></div>
        <aside><span>Privacy contact</span><a href="mailto:office@entimema.com">office@entimema.com</a><Link href="/security">Security &amp; Trust <span aria-hidden="true">→</span></Link></aside>
      </header>

      <div className={styles.noticeLayout}>
        <nav className={styles.toc} aria-label="Privacy Notice sections"><p>ON THIS PAGE</p><ol>{sections.map(([id,label],index)=><li key={id}><a href={`#${id}`}><span>{String(index+1).padStart(2,"0")}</span>{label}</a></li>)}</ol></nav>
        <article className={styles.notice}>
          <section id="scope"><p className={styles.number}>01</p><h2>Scope</h2><p>This notice applies to personal data processed through Entimema’s public website, inquiry forms and direct business communications. It does not describe customer-document processing inside a product workflow; see <Link href="/security">Security &amp; Trust</Link> for the current workflow assurance scope.</p></section>
          <section id="data"><p className={styles.number}>02</p><h2>Data processed</h2><p>Depending on how you interact with Entimema, we may process:</p><ul><li>contact details, such as your name, business email address, organisation and role;</li><li>the contents of an inquiry and subsequent correspondence;</li><li>technical and security information, such as IP address, browser, device and request logs;</li><li>cookie and usage data where you have enabled optional analytics.</li></ul><p>Please avoid including unnecessary personal or confidential information in an inquiry.</p></section>
          <section id="purposes"><p className={styles.number}>03</p><h2>Purposes and legal bases</h2><div className={styles.table}><div><strong>Purpose</strong><strong>Legal basis</strong></div><div><span>Respond to inquiries and communicate about requested services</span><span>Steps requested before a contract and legitimate interests in business communication</span></div><div><span>Operate, secure and diagnose the website</span><span>Legitimate interests in providing a reliable and secure website</span></div><div><span>Maintain business correspondence and records</span><span>Legitimate interests and applicable legal obligations</span></div><div><span>Measure website use through optional analytics</span><span>Consent, which you can withdraw through analytics preferences</span></div></div></section>
          <section id="providers"><p className={styles.number}>04</p><h2>Service providers</h2><p>Entimema uses service providers where needed to operate the website and handle communications. Current website providers confirmed for these activities are:</p><ul><li><strong>Vercel</strong> for website hosting and delivery;</li><li><strong>Resend</strong> for contact-form transmission;</li><li><strong>Google Workspace</strong> for business correspondence;</li><li><strong>Google Analytics</strong> for consent-based website analytics.</li></ul><p>Providers process data according to their role and applicable contractual terms. Optional Google Analytics is activated only after consent.</p><AnalyticsPreferencesButton className={styles.preferencesButton} /></section>
          <section id="retention"><p className={styles.number}>05</p><h2>Retention</h2><p>Personal data is kept only for as long as reasonably needed for the purpose for which it was collected, including responding to and maintaining an appropriate record of communications, operating and securing the website, resolving disputes and meeting legal obligations. Retention periods vary with the data, purpose and relevant requirements.</p></section>
          <section id="rights"><p className={styles.number}>06</p><h2>Data-subject rights</h2><p>Depending on applicable law, you may have rights to request access to, correction or deletion of your personal data, restriction of or objection to processing, and data portability. Where processing relies on consent, you may withdraw that consent without affecting earlier lawful processing. You may also have the right to complain to an applicable data-protection authority.</p><p>We may need information to verify your identity and understand the request before responding.</p></section>
          <section id="contact"><p className={styles.number}>07</p><h2>Privacy contact and updates</h2><p>Entimema is the contact for the website processing described in this notice. To ask a privacy question or exercise a data-subject right, email <a href="mailto:office@entimema.com">office@entimema.com</a>.</p><p>This notice may be updated when website processing, providers or applicable requirements change. The current version is published on this page.</p><div className={styles.securityLink}><span>Product assurance</span><p>For data handling, scope boundaries and human review in the current Financial Intelligence workflow, read our security overview.</p><Link href="/security">Read Security &amp; Trust <span aria-hidden="true">→</span></Link></div></section>
        </article>
      </div>
    </main>
  );
}
