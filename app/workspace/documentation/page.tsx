import Link from "next/link";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const sections = [
  {
    number: "01",
    title: "Prepare your income statement",
    body: "Use an XLSX, XLS, CSV or text-based PDF income statement up to 4.5 MB. Keep the entity name, reporting periods, currency and scale visible in the source.",
  },
  {
    number: "02",
    title: "Run Financial Intelligence",
    body: "Upload one statement and select Execute. The workflow reads the document, maps reported lines, binds extracted values to their source locations and applies deterministic financial calculations.",
  },
  {
    number: "03",
    title: "Confirm the detected context",
    body: "Before interpreting the analysis, verify the entity, reporting periods, currency and scale. If the detected context is incomplete or ambiguous, review it against the source rather than assuming it is correct.",
  },
  {
    number: "04",
    title: "Understand the result",
    body: "Review the structured financial lines, calculated KPIs, executive summary and material findings. Treat the result status as the workflow's instruction: use ready outputs, investigate review items and do not rely on blocked or unsupported results.",
  },
  {
    number: "05",
    title: "Trace the evidence",
    body: "Open View evidence beneath a KPI or finding to follow each material conclusion back to its source sheet, cell, page or line. Evidence links show where a value came from; they do not replace review of the original statement.",
  },
  {
    number: "06",
    title: "Resolve exceptions",
    body: "Review missing context, unsupported structures and ambiguous mappings before using the output. Financial Intelligence surfaces uncertainty instead of inventing values or silently completing unsupported information.",
  },
  {
    number: "07",
    title: "Export the report",
    body: "Download the review-ready PDF only after the detected context, reported values and material findings are consistent with the source document. The export supports analysis and review; it is not a statutory filing or audit opinion.",
  },
  {
    number: "08",
    title: "Start again when the source changes",
    body: "Run a new analysis when the document, reporting period or reported values change. Review each result against the version of the source used for that execution.",
  },
];

export default async function DocumentationPage() {
  const user = await getWorkspaceUser();

  return (
    <WorkspaceFrame title="Documentation" active="documentation" user={user}>
      <div className="workspacePage">
        <header className="workspacePageHero">
          <p className="eyebrow">PRODUCT DOCUMENTATION</p>
          <h1>Use Financial Intelligence with confidence</h1>
          <p>
            Prepare your income statement, run the workflow and verify every
            material conclusion against its source.
          </p>
          <div className="docMeta">
            <span>
              Current release <strong>V1</strong>
            </span>
            <span>
              Workflow <strong>Income statement analysis</strong>
            </span>
            <span>
              Access <strong>Private beta</strong>
            </span>
          </div>
        </header>

        <section
          className="documentationGrid"
          aria-label="Financial Intelligence guide"
        >
          {sections.map((section) => (
            <article key={section.number}>
              <span>{section.number}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="documentationNote">
          <div>
            <p className="eyebrow">BEFORE YOU UPLOAD</p>
            <h2>Source checklist</h2>
          </div>
          <ul>
            <li>One income statement per execution</li>
            <li>Comparable reporting periods clearly labelled</li>
            <li>Currency and scale visible in the document</li>
            <li>Text-based PDF rather than a scanned image</li>
          </ul>
          <p>
            Clear source context reduces avoidable review. Do not remove labels,
            totals or period headings that are needed to interpret the reported
            values.
          </p>
        </section>

        <section className="documentationNote">
          <div>
            <p className="eyebrow">CURRENT SCOPE</p>
            <h2>What V1 supports</h2>
          </div>
          <ul>
            <li>Income statements with comparable reporting periods</li>
            <li>Reported financial lines and source-linked values</li>
            <li>Profitability and year-over-year KPIs</li>
            <li>Traceable findings and PDF export</li>
          </ul>
          <p>
            Scanned PDFs, balance sheets, cash-flow statements and consolidated
            multi-file analysis are outside the current V1 scope. Unusual
            workbook or PDF layouts may require review.
          </p>
        </section>

        <section className="documentationNote">
          <div>
            <p className="eyebrow">IF A RUN NEEDS REVIEW</p>
            <h2>Check context before conclusions</h2>
          </div>
          <ul>
            <li>Compare the detected periods with the source</li>
            <li>Confirm currency and scale</li>
            <li>Inspect evidence for material values and findings</li>
            <li>Run a supported source when the format is blocked</li>
          </ul>
          <p>
            Financial Intelligence is decision support. The user remains
            responsible for professional judgment, approval and any statutory
            or audit requirements.
          </p>
        </section>

        <footer className="workspacePageAction">
          <span>Ready to process a statement?</span>
          <Link href="/workspace/financial-intelligence">
            Start a new analysis →
          </Link>
        </footer>
      </div>
    </WorkspaceFrame>
  );
}
