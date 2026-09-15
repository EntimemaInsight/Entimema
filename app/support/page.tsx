import Link from "next/link";
import SupportForm from "./SupportForm";
import styles from "./support.module.css";

export const metadata = {
  title: "Documentation & Help Center | Entimema",
  description: "Access Entimema documentation, product guidance and support.",
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <section className={styles.access} aria-labelledby="access-title">
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualGrid} />
          <div className={styles.documentCard}>
            <span className={styles.docLabel}>FINANCIAL INTELLIGENCE</span>
            <span className={styles.docTitle}>Validated financial output</span>
            <span className={styles.docLine} /><span className={styles.docLineShort} />
            <div className={styles.docStatus}><span /> Evidence linked</div>
          </div>
          <div className={styles.controlCard}>
            <span>CONTROL STATUS</span>
            <strong>Validated</strong>
            <small>Reconciled · Traceable</small>
          </div>
        </div>
        <div className={styles.accessCopy}>
          <h2 id="access-title">Access documentation and help center</h2>
          <p>Already a customer? Log in to access Entimema documentation and support. If not, contact us to request access.</p>
          <Link className={styles.login} href="/auth/sign-in?callbackUrl=%2Fworkspace%2Ffinancial-intelligence">Log in</Link>
        </div>
      </section>

      <section className={styles.support} aria-labelledby="request-access-title">
        <SupportForm />
        <div className={styles.resources}>
          <h2 id="request-access-title">Request access to documentation</h2>
          <article><span className={styles.number}>01</span><div><h3>Get started</h3><p>Set up your workspace and learn how to run your first controlled financial workflow.</p><Link href="/product/financial-intelligence">Get started <span>→</span></Link></div></article>
          <article><span className={styles.number}>02</span><div><h3>Product documentation</h3><p>Understand how Entimema processes, validates and transforms financial information.</p><Link href="/product/platform">Explore documentation <span>→</span></Link></div></article>
          <article><span className={styles.number}>03</span><div><h3>Need help?</h3><p>Send your question and the Entimema team will help with product or workflow support.</p><a href="#support-form">Contact support <span>→</span></a></div></article>
        </div>
      </section>

      <section className={styles.cta}>
        <div><p className={styles.ctaEyebrow}>ENTIMEMA FINANCIAL INTELLIGENCE</p><h2>Ready to see Entimema in action?</h2></div>
        <Link href="/demo">Get a demo</Link>
      </section>
    </main>
  );
}
