import Link from "next/link";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const nav = [["overview", "Overview"],["handling", "Document handling"],["access", "Access and separation"],["validation", "Validation and evidence"],["ai", "AI data use"],["responsibility", "Human responsibility"]] as const;

export default async function DataSecurityPage() {
  const user = await getWorkspaceUser();
  return (
    <WorkspaceFrame title="Data & Security" active="security" user={user}>
      <div className="docsPage">
        <aside className="docsToc" aria-label="On this page">
          <p>DATA &amp; SECURITY</p>
          <nav>{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          <Link href="/workspace/documentation">Product documentation →</Link>
        </aside>
        <article className="docsArticle">
          <header className="docsHero" id="overview">
            <p className="docsKicker">FINANCIAL INTELLIGENCE · V1</p>
            <h1>Data and security</h1>
            <p>How access, financial documents, calculations and review responsibilities are controlled within the current workflow.</p>
            <p className="docsCallout"><strong>Customer documents are processed for the requested workflow and are not used to train shared Entimema models.</strong></p>
          </header>
          <section className="docsSection" id="handling"><p className="docsStep">01</p><div><h2>Document handling</h2><p>Uploaded financial documents are processed only to execute the requested Financial Intelligence workflow. File bytes are validated before processing, and diagnostics are kept limited to what is needed to operate and review the workflow.</p><p>The exact retention and deletion approach should be confirmed for the applicable pilot or deployment. No automatic deletion period is promised on this page.</p></div></section>
          <section className="docsSection" id="access"><p className="docsStep">02</p><div><h2>Access and customer context</h2><p>Protected workspace routes require an authorized identity. Processing is scoped to the active request and customer context. Access expectations and provider roles are reviewed for the applicable deployment.</p></div></section>
          <section className="docsSection" id="validation"><p className="docsStep">03</p><div><h2>Validation, calculations and evidence</h2><dl className="docsDefinitions"><div><dt>File validation</dt><dd>The workflow checks the uploaded file before analysis begins.</dd></div><div><dt>Deterministic controls</dt><dd>Supported arithmetic, financial KPIs and fixed validation rules run in code.</dd></div><div><dt>Evidence lineage</dt><dd>Material outputs retain references to a source sheet, cell, page or line where the format permits.</dd></div><div><dt>Explicit uncertainty</dt><dd>Missing, unsupported or ambiguous information is surfaced for review rather than silently completed.</dd></div></dl></div></section>
          <section className="docsSection" id="ai"><p className="docsStep">04</p><div><h2>AI data use</h2><p>AI-assisted processing is limited to the purpose of the requested workflow. Customer documents are not used to train shared Entimema models. Any external provider role, data path and applicable processing terms should be confirmed during the security review for the deployment.</p></div></section>
          <section className="docsSection" id="responsibility"><p className="docsStep">05</p><div><h2>Human review remains required</h2><p>Financial Intelligence prepares structured, source-linked analysis. The client remains responsible for confirming material context, resolving exceptions and approving any use or distribution of an output.</p><p className="docsCallout"><strong>Decision support, not autonomous approval.</strong> Outputs do not replace professional judgment, statutory reporting procedures, audit work or management approval.</p></div></section>
          <footer className="docsNext"><span>More detail</span><Link href="/security">Read Security &amp; Trust →</Link></footer>
        </article>
      </div>
    </WorkspaceFrame>
  );
}
