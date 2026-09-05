import { getWorkspaceUser } from "@/lib/workspace-auth";
import { authorizeFinancialOperator } from "@/lib/financial-operator-auth";
import { FinancialIntelligenceWorkspace } from "../components/FinancialIntelligenceWorkspace";
export default async function FinancialIntelligencePage(){
 const user=await getWorkspaceUser();
 const operator=await authorizeFinancialOperator().then(()=>true).catch(()=>false);
 return <FinancialIntelligenceWorkspace user={user} operator={operator}/>;
}
