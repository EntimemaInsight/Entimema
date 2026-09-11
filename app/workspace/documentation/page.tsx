import Link from "next/link";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const nav = [
  ["start", "Get started"],
  ["prepare", "Prepare the source"],
  ["run", "Run the analysis"],
  ["review", "Review the result"],
  ["status", "Result statuses"],
  ["scope", "Current scope"],
  ["export", "Export and use"],
] as const;

export default async function DocumentationPage() {
  const user = await getWorkspaceUser();
  return (
    <WorkspaceFrame title="Documentation" active="documentation" user={user}>
      <div className="docsPage">
        <aside className="docsToc" aria-label="On this page">
          <p>PRODUCT GUIDE</p>
          <nav>{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          <Link href="/workspace/data-security">Data &amp; Security →</Link>
        </aside>
        <article className="docsArticle">
          <header className="docsHero" id="start">
            <p className="docsKicker">FINANCIAL INTELLIGENCE · V1</p>
            <h1>Product documentation</h1>
            <p>Prepare an income statement, run the analysis and verify every material conclusion against its source.</p>
            <dl className="docsFacts">
              <div><dt>Workflow</dt><dd>Income statement analysis</dd></div>
              <div><dt>Access</dt><dd>Private beta</dd></div>
              <div><dt>Output</dt><dd>Review-ready analysis and PDF</dd></div>
            </dl>
          </header>
          <section className="docsSection" id="prepare">
            <p className="docsStep">01</p><div>
              <h2>Prepare the source document</h2>
              <p>Use one XLSX, XLS, CSV or text-based PDF income statement up to 4.5 MB. Preserve the labels that establish financial meaning.</p>
              <h3>Before upload</h3>
              <ul><li>Include the entity name and comparable reporting periods.</li><li>Keep currency and scale visible.</li><li>Keep row labels, totals and period headings intact.</li><li>Use a text-based PDF, not a scanned image.</li></ul>
            </div>
          </section>
          <section className="docsSection" id="run">
            <p className="docsStep">02</p><div>
              <h2>Run Financial Intelligence</h2>
              <ol><li>Open <Link href="/workspace/financial-intelligence">Financial Intelligence</Link>.</li><li>Upload one supported income statement.</li><li>Select <strong>Execute</strong>.</li><li>Wait for the workflow to map reported lines, bind values to source locations and calculate supported KPIs.</li></ol>
              <p className="docsCallout"><strong>Important:</strong> Run a new analysis whenever the document, period or reported values change.</p>
            </div>
          </section>
          <section className="docsSection" id="review">
            <p className="docsStep">03</p><div>
              <h2>Review the result</h2>
              <p>Start with detected context, then review values, calculations and conclusions in that order.</p>
              <ol><li>Confirm the entity, reporting periods, currency and scale.</li><li>Review structured financial lines and calculated KPIs.</li><li>Open <strong>View evidence</strong> for material values and findings.</li><li>Compare the cited sheet, cell, page or line with the original source.</li><li>Resolve every exception before using or distributing the result.</li></ol>
              <p className="docsCallout"><strong>Evidence links show provenance.</strong> They support review but do not replace the original statement or professional judgment.</p>
            </div>
          </section>
          <section className="docsSection" id="status">
            <p className="docsStep">04</p><div>
              <h2>Act on the result status</h2>
              <dl className="docsDefinitions"><div><dt>Ready</dt><dd>The supported checks completed. Verify material conclusions before use.</dd></div><div><dt>Review required</dt><dd>Context, structure or mapping needs human confirmation before reliance.</dd></div><div><dt>Blocked or unsupported</dt><dd>Do not rely on the result. Correct the source or use a supported document.</dd></div></dl>
            </div>
          </section>
          <section className="docsSection" id="scope">
            <p className="docsStep">05</p><div>
              <h2>Current V1 scope</h2>
              <div className="docsColumns"><div><h3>Supported</h3><ul><li>Income statements with comparable periods</li><li>Reported lines with source-linked values</li><li>Profitability and year-over-year KPIs</li><li>Traceable findings and PDF export</li></ul></div><div><h3>Outside current scope</h3><ul><li>Scanned or image-only PDFs</li><li>Balance sheets and cash-flow statements</li><li>Consolidated multi-file analysis</li><li>A guarantee for every workbook or PDF layout</li></ul></div></div>
              <p>Unusual workbook or PDF layouts may require review.</p>
            </div>
          </section>
          <section className="docsSection" id="export">
            <p className="docsStep">06</p><div>
              <h2>Export and use the report</h2>
              <p>Download the PDF only after the detected context, reported values and material findings are consistent with the source document.</p>
              <p className="docsCallout"><strong>Responsibility boundary:</strong> Financial Intelligence provides decision support. Its output is not a statutory filing, audit opinion or autonomous approval.</p>
            </div>
          </section>
          <footer className="docsNext"><span>Next step</span><Link href="/workspace/financial-intelligence">Start a new analysis →</Link></footer>
        </article>
      </div>
    </WorkspaceFrame>
  );
}
