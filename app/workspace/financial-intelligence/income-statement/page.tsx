import { requireWorkspaceProduct } from "@/lib/workspace-auth";
import { FinancialIntelligenceWorkspace } from "../../components/FinancialIntelligenceWorkspace";
import { WorkspaceFrame } from "../../components/WorkspaceFrame";

export default async function IncomeStatementAnalysisPage() {
  const user = await requireWorkspaceProduct("financial-intelligence");
  return (
    <WorkspaceFrame title="Income Statement Analysis" active="financial-intelligence" user={user}>
      <FinancialIntelligenceWorkspace />
    </WorkspaceFrame>
  );
}
