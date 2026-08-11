import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy | Entimema",
  description: "Information about the processing of personal data through the Entimema website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>LEGAL INFORMATION</p>
          <h1>Privacy</h1>
          <p className={styles.intro}>This page describes how personal data submitted through the Entimema website is processed.</p>
        </header>
        <div className={styles.content}>
          <section aria-labelledby="controller-title"><h2 id="controller-title">Data controller</h2><p>The data controller is the organisation that operates Entimema and the entimema.net website.</p><p className={styles.pending}>The controller&apos;s full legal name, registration number and address remain to be confirmed before this information receives final legal approval.</p></section>
          <section aria-labelledby="data-title"><h2 id="data-title">Personal data we process</h2><p>Through the contact forms, we may receive:</p><ul><li>your name and business email address;</li><li>your company and role;</li><li>the topic, service or project concerned;</li><li>the content and context of your inquiry;</li><li>information about a proposed partnership or an inquiry relating to an active client engagement.</li></ul></section>
          <section aria-labelledby="purpose-title"><h2 id="purpose-title">Purposes of processing</h2><p>We use the information provided to receive and review your inquiry, respond to it, assess a potential project or partnership and, where applicable, communicate about an active client engagement.</p></section>
          <section aria-labelledby="basis-title"><h2 id="basis-title">Legal basis</h2><p>The applicable legal basis depends on the nature of the inquiry and the relationship with the person submitting it. It remains subject to confirmation during the final legal review of this notice.</p></section>
          <section aria-labelledby="providers-title"><h2 id="providers-title">Recipients and service providers</h2><p>To operate the website and process inquiries, we use:</p><ul><li><strong>Vercel</strong> — website hosting and delivery;</li><li><strong>Resend</strong> — technical transmission of contact-form messages;</li><li><strong>Google Workspace</strong> — receipt and processing of business correspondence.</li></ul><p>This notice does not make claims about contractual safeguards or international data transfers that have not been confirmed for this project.</p></section>
          <section aria-labelledby="retention-title"><h2 id="retention-title">Retention period</h2><p>No specific retention period has been established in a published policy. Defining that period requires a business and legal decision.</p></section>
          <section aria-labelledby="rights-title"><h2 id="rights-title">Rights of data subjects</h2><p>Depending on the applicable circumstances, you may request access to, rectification or erasure of your personal data, restriction of processing, object to processing, or exercise your right to data portability. You may also lodge a complaint with the competent supervisory authority.</p></section>
          <section aria-labelledby="contact-title"><h2 id="contact-title">Contact</h2><p>For questions about personal data, email <a href="mailto:office@entimema.net">office@entimema.net</a>.</p></section>
          <section aria-labelledby="updates-title"><h2 id="updates-title">Updates</h2><p>This information may be updated when the way data is processed or the website infrastructure changes.</p></section>
        </div>
      </article>
    </main>
  );
}
