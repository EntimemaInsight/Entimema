import { getWorkspaceUser } from "@/lib/workspace-auth";
import { FinancialIntelligenceWorkspace } from "../components/FinancialIntelligenceWorkspace";
import { WorkspaceFrame } from "../components/WorkspaceFrame";
export default async function FinancialIntelligencePage() {
  const user = await getWorkspaceUser();
  return <WorkspaceFrame title="New analysis" active="financial-intelligence" user={user}><FinancialIntelligenceWorkspace /></WorkspaceFrame>;
}
