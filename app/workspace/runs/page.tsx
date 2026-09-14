import { WorkspaceFrame } from "../components/WorkspaceFrame";
import { RunsTable } from "../components/RunsTable";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { listWorkspaceRuns } from "@/lib/workspace-runs";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const user = await getWorkspaceUser();
  const runs = await listWorkspaceRuns(user.email);
  return <WorkspaceFrame title="Runs" active="runs" user={user}>
    <div className="indexView">
      <p className="eyebrow">Execution history</p>
      <h1>Your recent runs</h1>
      <p className="pageLead">Review the analyses completed in your restricted Workspace.</p>
      <RunsTable runs={runs} />
    </div>
  </WorkspaceFrame>;
}
