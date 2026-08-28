import { getWorkspaceUser } from "@/lib/workspace-auth";
import { FinancialIntelligenceWorkspace } from "../components/FinancialIntelligenceWorkspace";
export default async function FinancialIntelligencePage(){const user=await getWorkspaceUser();return <FinancialIntelligenceWorkspace user={user}/>}
