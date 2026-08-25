import { randomUUID } from "node:crypto";
import { auth, isWorkspaceAllowed } from "@/auth";
import { runDocumentClassifier } from "@/backend/api/agents/document-classifier/run";
import { AgentError, errorResponse } from "@/backend/lib/errors";

export const runtime="nodejs"; export const dynamic="force-dynamic";
export async function POST(request:Request){const session=await auth();if(!session?.user?.email||!isWorkspaceAllowed(session.user.email))return Response.json({error:"Authentication required."},{status:401});const runId=randomUUID();try{if(!(request.headers.get("content-type")??"").toLowerCase().startsWith("multipart/form-data"))throw new AgentError("FILE_MISSING",400,"Choose a supported document before running the agent.");const result=await runDocumentClassifier(await request.formData());return Response.json({run_id:runId,...result.response})}catch(error){const safe=error instanceof AgentError?error:new AgentError("INTERNAL_ERROR",500,"The document could not be classified. Try again.",error);return errorResponse(safe,runId)}}
