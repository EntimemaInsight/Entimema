import Link from "next/link";
import styles from "./support.module.css";

export const metadata = {
  title: "Documentation & Help Center | Entimema",
  description: "Access Entimema documentation, product guidance and support.",
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>ENTIMEMA SUPPORT</p>
        <h1>Documentation &amp; Help Center</h1>
        <p className={styles.lead}>Everything you need to get started with Entimema, understand your workflows, and get help when you need it.</p>
      </section>

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

      <section className={styles.resources} aria-label="Help center resources">
        <article><span className={styles.number}>01</span><h2>Get started</h2><p>Set up your workspace and learn how to run your first controlled financial workflow.</p><Link href="/product/financial-intelligence">Get started <span>→</span></Link></article>
        <article><span className={styles.number}>02</span><h2>Product documentation</h2><p>Understand how Entimema processes, validates and transforms financial information.</p><Link href="/product/platform">Explore documentation <span>→</span></Link></article>
        <article><span className={styles.number}>03</span><h2>Need help?</h2><p>Find answers or contact the Entimema team when you need product or workflow support.</p><Link href="/contact?intent=client">Get help <span>→</span></Link></article>
      </section>

      <section className={styles.cta}>
        <div><p className={styles.ctaEyebrow}>ENTIMEMA FINANCIAL INTELLIGENCE</p><h2>Ready to see Entimema in action?</h2></div>
        <Link href="/demo">Get a demo</Link>
      </section>
    </main>
  );
}
