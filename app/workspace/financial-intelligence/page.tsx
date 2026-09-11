import Link from "next/link";
import { requireWorkspaceProduct } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const controls = [
  ["Specialized reasoning", "Semantic interpretation, extraction and financial mapping within the workflow scope."],
  ["Deterministic controls", "Arithmetic, reconciliation and supported financial rules run outside the language model."],
  ["Review boundary", "Exceptions and ambiguous outputs remain visible for human review."],
  ["Evidence lineage", "Material values and findings remain connected to the source document."],
] as const;

const path = ["Source document", "Intelligent intake", "Financial extraction", "Deterministic validation", "Human review", "Traceable output"];

export default async function FinancialIntelligencePage() {
  const user = await requireWorkspaceProduct("financial-intelligence");
  return (
    <WorkspaceFrame title="Financial Intelligence" active="financial-intelligence" user={user}>
      <div className="fiProductOverview">
        <header className="fiOverviewHeader">
          <div>
            <p>FINANCIAL INTELLIGENCE</p>
            <h1>Financial workflows you can trace, review and defend.</h1>
          </div>
          <span>
            Turn financial documents and data into validated, decision-ready outputs
            through specialized reasoning, deterministic controls and visible human review.
          </span>
        </header>

        <section className="fiOverviewSection" aria-labelledby="active-workflows">
          <div className="workspaceSectionHeading">
            <div><p>ACTIVE WORKFLOWS</p><h2 id="active-workflows">Available now</h2></div>
            <span>1 enabled</span>
          </div>
          <article className="fiWorkflowCard">
            <div className="fiWorkflowTitle">
              <span aria-hidden="true">IS</span>
              <div><small>V1 · CONTROLLED BETA</small><h3>Income Statement Analysis</h3></div>
            </div>
            <p>
              Transform a supported income statement into harmonized financial lines,
              deterministic checks, verified KPIs and traceable findings.
            </p>
            <Link href="/workspace/financial-intelligence/income-statement">Open workflow →</Link>
          </article>
          <p className="workspaceAccessNote">Additional Financial Intelligence workflows appear here when enabled.</p>
        </section>

        <section className="fiOverviewSection" aria-labelledby="control-path">
          <div className="workspaceSectionHeading">
            <div><p>EXECUTION MODEL</p><h2 id="control-path">A visible control path</h2></div>
          </div>
          <ol className="fiControlPath">
            {path.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
          </ol>
        </section>

        <section className="fiOverviewSection" aria-labelledby="control-model">
          <div className="workspaceSectionHeading">
            <div><p>CONTROL MODEL</p><h2 id="control-model">What governs every run</h2></div>
          </div>
          <div className="fiControlGrid">
            {controls.map(([title, description]) => (
              <article key={title}><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceFrame>
  );
}
