import { getWorkspaceUser } from "@/lib/workspace-auth";
import { DocumentClassifierWorkspace } from "../../components/DocumentClassifierWorkspace";
export default async function DocumentClassifierPage(){const user=await getWorkspaceUser();return <DocumentClassifierWorkspace user={user}/>}
