import { randomUUID } from "node:crypto";
import { AgentError,errorResponse } from "../../lib/errors";
import type { ExecutionRateLimiter } from "../../lib/rate-limit";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../../lib/document-classifier-upload";
import { inspectUploadedFile } from "../../lib/files";
import { runFinancialIntelligence } from "../../financial-intelligence/run";

export function createFinancialIntelligenceHandler(deps:{authorize:()=>Promise<AuthorizedActor>;rateLimiter:ExecutionRateLimiter}){return async(request:Request)=>{let runId=randomUUID();try{const actor=await deps.authorize();await deps.rateLimiter.consume(actor.actorId);const length=Number(request.headers.get("content-length"));if(Number.isFinite(length)&&length>DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES)throw new AgentError("FILE_TOO_LARGE",413);if(!(request.headers.get("content-type")??"").toLowerCase().startsWith("multipart/form-data"))throw new AgentError("FILE_MISSING",400);let form:FormData;try{form=await request.formData()}catch(error){throw new AgentError("FILE_MISSING",400,"Malformed multipart form data.",error)}if([...form.keys()].some(k=>k!=="file")||form.getAll("file").length!==1)throw new AgentError("FILE_MISSING",400,"Expected exactly one file.");const document=await inspectUploadedFile(form.get("file"));const result=await runFinancialIntelligence(document);return Response.json(result,{headers:{"Cache-Control":"no-store"}})}catch(error){return errorResponse(error instanceof AgentError?error:new AgentError("INTERNAL_ERROR",500,undefined,error),runId)}}}
