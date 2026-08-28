import { AgentError, errorResponse } from "@/backend/lib/errors";
import { authorizeExecution } from "@/lib/execution-auth";
import { randomUUID } from "node:crypto";
export const runtime="nodejs";
async function inactive(){const runId=randomUUID();try{await authorizeExecution();throw new AgentError("UPLOAD_FAILED",410,"Private direct upload is not currently available.");}catch(error){return errorResponse(error,runId);}}
export const POST=inactive;
export const DELETE=inactive;
