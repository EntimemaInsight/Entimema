import { WorkspaceFrame } from "../components/WorkspaceFrame";
import { RunsTable } from "../components/RunsTable";
import { getWorkspaceUser } from "@/lib/workspace-auth";
export default async function RunsPage(){const user=await getWorkspaceUser();return <WorkspaceFrame title="Runs" active="runs" user={user}><div className="indexView"><p className="eyebrow">Execution history</p><h1>Your recent runs</h1><p className="pageLead">Review the analyses completed during this browser session.</p><RunsTable /></div></WorkspaceFrame>}
