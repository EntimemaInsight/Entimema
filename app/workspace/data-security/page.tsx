import Link from "next/link";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const controls = [
  { title: "Controlled access", body: "The workspace is available only to authorized identities. Access is checked before protected product routes are rendered." },
  { title: "Purpose-bound processing", body: "Uploaded financial documents are processed only to execute the requested Financial Intelligence workflow." },
  { title: "Deterministic validation", body: "Arithmetic, financial KPIs and fixed validation rules are executed in code rather than delegated to model interpretation." },
  { title: "Evidence lineage", body: "Material outputs retain references to their originating sheet, cell, page or line wherever the source format permits." },
  { title: "Explicit uncertainty", body: "Missing, unsupported or ambiguous information is surfaced for review. The workflow does not invent financial values." },
  { title: "Human control", body: "The client remains responsible for reviewing material context, exceptions and decisions before using or distributing an output." },
];

export default async function DataSecurityPage(){const user=await getWorkspaceUser();return <WorkspaceFrame title="Data & Security" active="security" user={user}><div className="workspacePage"><header className="workspacePageHero"><p className="eyebrow">DATA & SECURITY</p><h1>Controls around every execution</h1><p>Financial Intelligence combines restricted access, traceable processing and explicit review responsibilities.</p></header><section className="controlGrid">{controls.map((control,index)=><article key={control.title}><span>{String(index+1).padStart(2,"0")}</span><h2>{control.title}</h2><p>{control.body}</p></article>)}</section><section className="securityBoundary"><div><p className="eyebrow">RESPONSIBILITY BOUNDARY</p><h2>Decision support, not autonomous approval</h2></div><p>Entimema prepares structured and review-ready financial analysis. Outputs do not replace professional judgment, statutory reporting procedures, audit work or management approval.</p></section><footer className="workspacePageAction"><span>Review the complete public policy.</span><Link href="/privacy">Security & Privacy →</Link></footer></div></WorkspaceFrame>}
