import Link from "next/link";
import Navbar from "@/components/Navbar";
import SupportForm from "./SupportForm";
import styles from "./support.module.css";

export const metadata = {
  title: "Documentation & Help Center | Entimema",
  description: "Access Entimema documentation, product guidance and support.",
};

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.access} aria-labelledby="access-title">
          <div className={styles.visual} aria-hidden="true">
            <div className={styles.visualGrid} />
            <div className={styles.documentCard}>
              <span className={styles.docLabel}>FINANCIAL INTELLIGENCE</span>
              <span className={styles.docTitle}>
                Validated financial output
              </span>
              <span className={styles.docLine} />
              <span className={styles.docLineShort} />
              <div className={styles.docStatus}>
                <span /> Evidence linked
              </div>
            </div>
            <div className={styles.controlCard}>
              <span>CONTROL STATUS</span>
              <strong>Validated</strong>
              <small>Reconciled · Traceable</small>
            </div>
          </div>
          <div className={styles.accessCopy}>
            <h2 id="access-title">Access documentation and help center</h2>
            <p>
              Already a customer? Log in to access Entimema documentation and
              support. If not, contact us to request access.
            </p>
            <Link
              className={styles.login}
              href="/auth/sign-in?callbackUrl=%2Fworkspace%2Ffinancial-intelligence"
            >
              Log in
            </Link>
          </div>
        </section>

        <section
          className={styles.support}
          aria-labelledby="request-access-title"
        >
          <div className={styles.resources}>
            <h2 id="request-access-title">Request access to documentation</h2>
            <div className={styles.resourceList}>
              <p>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Get started.</strong> Set up your workspace and learn
                  how to run your first controlled financial workflow.
                </span>
              </p>
              <p>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Product documentation.</strong> Understand how
                  Entimema processes, validates and transforms financial
                  information.
                </span>
              </p>
              <p>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Need help?</strong> Submit requests to the Entimema
                  team and access product and workflow support.
                </span>
              </p>
            </div>
          </div>
          <SupportForm />
        </section>

        <section className={styles.cta}>
          <h2>Ready to see Entimema in action?</h2>
          <Link href="/demo/financial-intelligence">
            Try the interactive demo
          </Link>
        </section>
      </main>
    </>
  );
}
