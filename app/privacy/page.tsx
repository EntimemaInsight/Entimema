import type { Metadata } from "next";
import Link from "next/link";
import AnalyticsPreferencesButton from "@/components/AnalyticsPreferencesButton";
import Navbar from "@/components/Navbar";
import styles from "./privacy.module.css";

const title = "Security, Privacy & Responsible AI | Entimema";
const description = "The unified security, privacy and Responsible AI framework governing every Entimema Agent, client workflow and data-processing lifecycle.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.entimema.com/privacy" },
  openGraph: { title, description, url: "https://www.entimema.com/privacy", type: "website" },
  twitter: { card: "summary", title, description },
};

const principles = [
  ["Client isolation", "Each client and processing job remains associated with its own authorised context."],
  ["Purpose limitation", "Data is processed only for the defined Agent workflow and required output."],
  ["Least privilege", "Systems and authorised users receive only the access required for the task."],
  ["Traceable execution", "Material processing events, exceptions and interventions remain reviewable."],
  ["Human accountability", "AI output supports professional judgment and does not remove human responsibility."],
];

const lifecycle = [
  ["Authorised access", "The client enters through an authenticated and authorised account or approved workflow."],
  ["Secure intake", "Documents and data are submitted through protected channels and associated with the correct client and job context."],
  ["Isolated processing", "The agent processes information only within the authorised client, workspace and task context."],
  ["Purpose-limited analysis", "The agent receives only the information required to perform its defined capability."],
  ["Validation and exception handling", "Uncertainty, missing evidence, contradictions and low-confidence results remain visible and are routed for review."],
  ["Controlled delivery", "Results are delivered only to the authorised client context through controlled access and export mechanisms."],
  ["Retention or deletion", "Source documents and generated results follow disclosed retention and deletion rules."],
];

const toc = [
  ["Framework", "framework"], ["Lifecycle", "lifecycle"], ["Data controls", "data-controls"],
  ["Responsible AI", "responsible-ai"], ["Platform governance", "platform-governance"],
  ["Privacy notice", "privacy-notice"], ["Enterprise & reporting", "enterprise"],
];

function RuleList({ children }: { children: React.ReactNode }) {
  return <ul className={styles.ruleList}>{children}</ul>;
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <header className={styles.sectionHeader}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>{intro && <p className={styles.sectionIntro}>{intro}</p>}</header>;
}

function ArrowModel({ items, label }: { items: string[]; label: string }) {
  return <div className={styles.arrowModel} aria-label={label}>{items.map((item, index) => <div className={styles.arrowItem} key={item}><span>{item}</span>{index < items.length - 1 && <b aria-hidden="true">→</b>}</div>)}</div>;
}

export default function PrivacyPage() {
  return <main className={styles.page}>
    <Navbar />

    <header className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <p className={styles.eyebrow}>SECURITY, PRIVACY &amp; RESPONSIBLE AI</p>
          <h1>Financial intelligence requires disciplined data handling.</h1>
          <p className={styles.heroLead}>Every Entimema Agent operates within one unified framework for controlled access, isolated processing, traceable execution, data protection and meaningful human oversight.</p>
          <p className={styles.heroSecondary}>The same standard applies across every client, workflow and agent capability—without exceptions or agent-specific security shortcuts.</p>
          <div className={styles.actions}><Link className={styles.primary} href="/contact">Discuss your security requirements</Link><Link className={styles.secondary} href="/agents">Explore Entimema Agents <span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className={styles.heroArchitecture} aria-hidden="true"><span>ACCESS</span><i /><span>PROCESS</span><i /><span>VALIDATE</span><i /><span>DELIVER</span></div>
      </div>
      <p className={styles.platformStatement}>One platform. One security standard. Every agent.</p>
    </header>

    <section className={styles.principles} aria-label="Platform security principles">
      {principles.map(([heading, copy], index) => <article key={heading}><span>{String(index + 1).padStart(2, "0")}</span><h2>{heading}</h2><p>{copy}</p></article>)}
    </section>

    <div className={styles.indexLayout}>
      <nav className={styles.toc} aria-label="Security and privacy section index"><p>ON THIS PAGE</p><ol>{toc.map(([label, id]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol></nav>
      <article className={styles.memorandum}>
        <section className={styles.section} id="framework">
          <SectionHeading eyebrow="01 / UNIFIED FRAMEWORK" title="One permanent standard for every agent." intro="This standard governs every current and future Entimema Agent, every client and the complete lifecycle: Access → Upload → Isolated Processing → Analysis → Validation → Delivery → Retention or Deletion." />
          <div className={styles.callout}><strong>Platform invariant</strong><p>Every Entimema Agent operates within the same unified security, privacy and Responsible AI framework. A new agent inherits the framework by default and cannot bypass, weaken or redefine it.</p></div>
        </section>

        <section className={`${styles.section} ${styles.wide}`} id="lifecycle">
          <SectionHeading eyebrow="02 / CONTROLLED EXECUTION" title="One controlled lifecycle across every Entimema Agent" />
          <ol className={styles.lifecycle}>{lifecycle.map(([heading, copy], index) => <li key={heading}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{heading}</h3><p>{copy}</p></div></li>)}</ol>
        </section>

        <section className={styles.section} id="data-controls">
          <SectionHeading eyebrow="03 / CONTEXT BOUNDARIES" title="Client data remains within its authorised context." intro="Agents share a common platform. They do not share client data contexts." />
          <ArrowModel label="Client data context architecture" items={["Client", "Workspace", "Job", "Agent execution", "Controlled result"]} />
          <RuleList><li>Every uploaded file remains associated with a specific client and processing job.</li><li>Access requires authentication and authorisation at the client and job level.</li><li>One client must not access another client&apos;s documents, results or job metadata.</li><li>Files and results must not use predictable public URLs; temporary access links must be time-limited.</li><li>Processing context must not be reused across unrelated clients.</li><li>Administrative access requires a legitimate operational purpose.</li><li>Client context remains preserved through upload, processing, review, export and deletion.</li></RuleList>
        </section>

        <section className={`${styles.section} ${styles.tint}`}>
          <SectionHeading eyebrow="DATA PROTECTION" title="Protection throughout the data lifecycle" />
          <div className={styles.controlGrid}>
            <article><h3>Encryption in transit</h3><p>Information transmitted between the client, Entimema services and authorised processors must use encrypted transport.</p></article>
            <article><h3>Encryption at rest</h3><p>Stored customer documents, processing data and generated results must use the encryption capabilities of approved infrastructure.</p></article>
            <article><h3>Data minimisation</h3><p>The platform collects and processes only information required for the selected workflow.</p></article>
            <article><h3>Secure secret management</h3><p>Credentials, tokens and platform secrets must remain outside public source code, client-side code and downloadable files.</p></article>
            <article><h3>Sensitive logging restrictions</h3><p>Logs must avoid unnecessary document contents, personal data, credentials and confidential financial information.</p></article>
            <article><h3>Controlled deletion</h3><p>Documents and results must be capable of deletion under applicable retention rules or a valid client request.</p></article>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading eyebrow="RETENTION & DELETION" title="Data should not remain longer than the workflow requires." />
          <div className={styles.metricRow}><div><b>24h</b><span>Target for source-file deletion after completed processing</span></div><div><b>30d</b><span>Maximum default availability target for generated results</span></div></div>
          <RuleList><li>Source documents are retained only long enough to complete processing and make the result available.</li><li>The default operational target is automatic source-file deletion within 24 hours after completed processing.</li><li>Generated results may remain available for up to 30 days.</li><li>Clients may request or initiate earlier deletion where the interface permits.</li><li>Different periods may apply when expressly agreed for an enterprise engagement or required by law; longer retention must never be introduced silently.</li><li>Availability of storage is not a basis for indefinite retention.</li></RuleList>
          <p className={styles.implementationNote}><strong>Implementation scope.</strong> These periods govern services that persist workflow data. The currently published agent endpoint processes uploaded files in request memory and returns its result without a repository-level persistence store. A central retention scheduler and deletion ledger are required before any future persisted workflow can claim automated enforcement of these periods.</p>
        </section>

        <section className={`${styles.section} ${styles.dark}`}>
          <SectionHeading eyebrow="AI MODEL POLICY" title="Customer data is not a shared training asset." intro="Customer documents and financial data are processed only for the requested workflow." />
          <RuleList><li>Entimema must not use customer documents to train a shared Entimema model without separate, explicit and informed permission.</li><li>Client data must not become available to another client through prompts, context, outputs or retrieval systems.</li><li>Agents receive only the minimum information required for their task.</li><li>Provider access and retention behaviour must be assessed before approval.</li><li>A new AI processor must not be introduced silently.</li><li>Enterprise-specific restrictions may be agreed contractually.</li></RuleList>
        </section>

        <div className={styles.pairedSections}>
          <section className={styles.compactSection}><SectionHeading eyebrow="ACCESS CONTROL" title="Access follows operational necessity." /><RuleList><li>Authenticated access and client- and job-level authorisation.</li><li>Least-privilege service permissions and separation of public website and protected processing functions.</li><li>Controlled administration, restricted production-document access and protected credentials.</li><li>Access is revoked when no longer required.</li><li>No default manual inspection; manual access is limited to necessary support, investigation or authorised review.</li></RuleList></section>
          <section className={styles.compactSection}><SectionHeading eyebrow="TRACEABILITY" title="Material actions remain reviewable." /><p>Relevant events include job creation, file submission, processing start, completion or failure, workflow or model version, exception status, human review or correction, result generation and access, deletion, and administrative intervention.</p><p>Audit records must reconstruct material events without unnecessarily duplicating confidential document contents.</p></section>
        </div>

        <section className={`${styles.section} ${styles.responsible}`} id="responsible-ai">
          <SectionHeading eyebrow="04 / RESPONSIBLE AI" title="AI output must remain epistemically accountable." intro="Evidence, inference, hypothesis and decision remain distinguishable. Agent output is decision support unless an explicitly governed automation rule applies; accountability remains with the authorised decision-maker." />
          <ArrowModel label="Responsible decision model" items={["Evidence", "Interpretation", "Validation", "Decision"]} />
          <div className={styles.invariants}><strong>Unknown ≠ Assumption ≠ 0</strong><span>Claim ≠ Fact</span><span>Behavioural signal ≠ Mental state</span></div>
          <RuleList><li>A model classification is not automatically a verified fact, and confidence is not certainty.</li><li>Missing evidence stays visible; unknown information must not silently become an assumption or zero.</li><li>Contradictions must not be hidden to preserve continuity; material uncertainty requires review.</li><li>Behavioural signals do not prove mental state. Entimema does not perform psychoprofiling.</li><li>Financial and risk conclusions must rely on verifiable data and explicit methodology.</li></RuleList>
        </section>

        <section className={styles.section}>
          <SectionHeading eyebrow="AUTOMATION BOUNDARIES" title="Automation stops where evidence becomes insufficient." intro="High-confidence routine processing may continue only under explicit rules. Agents must not fabricate missing values, and material financial or risk decisions require an accountable decision process." />
          <div className={styles.states}><article><b>Ready</b><p>The workflow satisfies its validation criteria.</p></article><article><b>Review required</b><p>Uncertainty or exception requires authorised intervention.</p></article><article><b>Blocked</b><p>Required evidence or control is missing.</p></article></div>
          <p className={styles.afterStates}>Low-confidence output is marked. Incomplete documents remain incomplete, missing mandatory fields remain exposed, contradictions create an exception, and human review remains available for uncertainty, exception or material consequence.</p>
        </section>

        <section className={styles.section} id="platform-governance">
          <SectionHeading eyebrow="05 / PLATFORM GOVERNANCE" title="Security is enforced through the shared platform layer." />
          <RuleList><li>Production and development environments remain logically separated; secrets remain outside source code.</li><li>Dependency and vulnerability checks form part of development, and code changes pass automated validation.</li><li>Deployment uses controlled source and build processes.</li><li>Security-sensitive failures must not expose confidential data; logs and alerts support investigation.</li><li>Backup and recovery behaviour must be appropriate to stored information.</li><li>New agents must use common security components rather than independent alternatives.</li></RuleList>
        </section>

        <section className={`${styles.section} ${styles.gate}`}>
          <SectionHeading eyebrow="NEW AGENT SECURITY GATE" title="No agent bypasses the platform standard." intro="Before release, every new agent must satisfy the same acceptance gate." />
          <ol>{["Defined purpose and data requirements", "Approved input formats", "Client and job-level isolation", "Authentication and authorisation", "Data-minimisation review", "Retention and deletion mapping", "AI-provider and subprocessor review", "Output validation rules", "Exception and human-review logic", "Audit-event mapping", "Security and privacy testing", "Confirmation of shared-platform use"].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
        </section>

        <section className={styles.section} id="privacy-notice">
          <SectionHeading eyebrow="06 / LEGAL INFORMATION" title="Website privacy notice" intro="This notice explains how personal data submitted through the Entimema website is processed. It follows the product-security and Responsible AI standard above but addresses website visitors specifically." />
          <div className={styles.legalGrid}>
            <article><h3>Data controller</h3><p>The data controller is the organisation that operates Entimema and the entimema.com website.</p><p className={styles.legalNote}>The controller&apos;s full legal name, registration number and address remain subject to final legal confirmation.</p></article>
            <article><h3>Personal data</h3><p>Contact forms may provide your name, business email, company, role, inquiry topic and message, including context about a project, partnership or active client engagement.</p></article>
            <article><h3>Purpose and legal basis</h3><p>Information is used to review and respond to an inquiry, assess a project or partnership, or communicate about an engagement. The applicable legal basis depends on the inquiry and relationship and remains subject to final legal review.</p></article>
            <article><h3>Recipients</h3><p>Confirmed website providers are Vercel for hosting and delivery, Resend for contact-form transmission, and Google Workspace for business correspondence.</p></article>
            <article><h3>Optional analytics</h3><p>Google Analytics operates only after consent, to understand broad acquisition, landing-page and Resource engagement patterns and successful inquiries. Form contents are not included. Advertising storage, Google signals and ad-personalisation are disabled.</p><AnalyticsPreferencesButton className={styles.preferencesButton} /></article>
            <article><h3>Website retention</h3><p>A specific retention period for inquiry correspondence has not yet been established in a published legal policy. It requires a business and legal decision. Analytics account-level retention must be confirmed before activation.</p></article>
            <article><h3>Your rights</h3><p>Depending on the circumstances, you may request access, rectification, erasure, restriction or portability, object to processing, or complain to the competent supervisory authority.</p></article>
            <article><h3>Contact and updates</h3><p>For personal-data questions, email <a href="mailto:office@entimema.com">office@entimema.com</a>. This notice may change when processing or website infrastructure changes.</p></article>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading eyebrow="SERVICE PROVIDERS" title="Service providers are subject to the same purpose limitation." intro="Approved infrastructure, communication, analytics and AI-processing providers may be used only where required to deliver the service." />
          <RuleList><li>Providers receive only information required for their role and their access is purpose-limited.</li><li>New material processors are reviewed before use, and provider changes must not weaken this standard.</li><li>Enterprise agreements may establish additional subprocessor requirements.</li><li>This page may be updated when material processing relationships change.</li></RuleList>
        </section>

        <section className={styles.section} id="enterprise">
          <SectionHeading eyebrow="07 / ENTERPRISE & REPORTING" title="Additional controls for enterprise engagements" intro="Larger or regulated engagements may supplement—but never replace or weaken—the unified standard." />
          <div className={styles.tags}>{["Data Processing Agreements", "Subprocessor documentation", "Agreed retention schedules", "Regional processing requirements", "Enterprise access requirements", "Security questionnaires", "Audit evidence", "Incident-notification terms", "Workflow approval controls", "Service-level commitments", "Human-review responsibilities"].map(item => <span key={item}>{item}</span>)}</div>
        </section>

        <section className={`${styles.section} ${styles.report}`}>
          <SectionHeading eyebrow="RESPONSIBLE DISCLOSURE" title="Report a security or privacy concern" />
          <p>If you believe you have identified a security, privacy or data-handling issue affecting Entimema, contact us with sufficient information for the matter to be assessed responsibly. Please do not include unnecessary personal data or publicly disclose the issue before Entimema has had a reasonable opportunity to investigate.</p>
          <a href="mailto:office@entimema.com">office@entimema.com <span aria-hidden="true">↗</span></a>
        </section>
      </article>
    </div>

    <section className={styles.finalCta}><div><p className={styles.eyebrow}>WORKFLOW GOVERNANCE</p><h2>Security begins with the architecture of the workflow.</h2><p>Tell us what information the workflow receives, what output it creates and what controls your organisation requires. Every Entimema Agent begins from the same security, privacy and governance standard.</p><div className={styles.actions}><Link className={styles.primary} href="/contact">Discuss your requirements</Link><Link className={styles.secondaryLight} href="/agents">Explore Entimema Agents <span aria-hidden="true">↗</span></Link></div></div></section>
  </main>;
}
