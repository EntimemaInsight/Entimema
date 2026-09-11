import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "../trust-page.module.css";

const title = "Security & Trust | Entimema";
const description =
  "How Entimema approaches controlled access, data handling, traceability and human review for financial intelligence workflows.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.entimema.com/security" },
  openGraph: {
    title,
    description,
    url: "https://www.entimema.com/security",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};

export default function SecurityPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Our commitment to security</p>
          <h1>Financial intelligence requires disciplined data handling.</h1>
          <p className={styles.intro}>
            Entimema combines controlled access, purpose-limited processing,
            source traceability and human review around financial workflows.
            Each production capability is assessed against its actual data,
            infrastructure and deployment scope.
          </p>
        </header>
        <div className={styles.content}>
          <section>
            <h2>Control baseline</h2>
            <p>
              <strong>Purpose-limited processing:</strong> Data is processed for
              the requested workflow and assessed against the capability’s
              defined purpose.
            </p>
            <p>
              <strong>Controlled access:</strong> Access expectations are
              defined around authenticated workspaces, authorised contexts and
              operational need.
            </p>
            <p>
              <strong>Source-grounded outputs:</strong> Source-value lineage
              keeps supported outputs connected to the financial evidence used
              to produce them.
            </p>
            <p>
              <strong>Human accountability:</strong> Exceptions and material
              judgement remain visible so an authorised person can review the
              result.
            </p>
          </section>
          <section>
            <h2>Current verified Financial Intelligence V1 scope</h2>
            <p>
              The present assurance boundary is specific to the controlled
              pilot. It reflects the tested workflow rather than a platform-wide
              promise.
            </p>
            <ul>
              <li>Tested English XLSX and text-based PDF Income Statements</li>
              <li>Authenticated Financial Intelligence workspace</li>
              <li>Secure file-byte validation and request-scoped processing</li>
              <li>Source-value lineage</li>
              <li>Supported deterministic financial checks and KPIs</li>
              <li>Explicit exceptions and human review</li>
            </ul>
          </section>
          <section>
            <h2>Explicit scope boundary</h2>
            <p>
              The current scope does not claim support for scanned or OCR PDFs,
              whole annual-report discovery, non-English statements, arbitrary
              financial-statement types, or every workbook and PDF layout.
            </p>
          </section>
          <section>
            <h2>Data and AI</h2>
            <p>
              <strong>Workflow-purpose limitation:</strong> Customer documents
              and financial data are processed for the requested workflow.
            </p>
            <p>
              <strong>Provider review:</strong> Provider roles, access and
              data-handling behaviour are considered for the production
              capability in which they are used.
            </p>
            <p>
              <strong>Customer-context separation:</strong> Customer documents
              are not used to train shared Entimema models.
            </p>
            <p>
              <strong>Minimal diagnostics:</strong> Operational diagnostics
              should be privacy-safe and limited to what is needed to support,
              secure and understand the workflow.
            </p>
          </section>
          <section>
            <h2>Output governance</h2>
            <p>
              <strong>Ready:</strong> Supported processing and checks completed
              without a surfaced review condition.
            </p>
            <p>
              <strong>Review required:</strong> An exception, ambiguity or
              unsupported condition needs human attention before use.
            </p>
            <p>
              <strong>Blocked:</strong> The workflow cannot produce a dependable
              result within its defined boundary.
            </p>
          </section>
          <section>
            <h2>Security review</h2>
            <p>
              A security discussion can map the proposed workflow to the data
              received, processing purpose, provider roles, access expectations,
              retention approach, deletion process and human-review
              responsibilities.
            </p>
          </section>
        </div>
      </article>
      <aside className={styles.reference}>
        <div>
          <p>
            Security, privacy and accountable review are part of the workflow
            boundary.
          </p>
          <Link href="/privacy">
            Read the Privacy Notice <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>
    </main>
  );
}
