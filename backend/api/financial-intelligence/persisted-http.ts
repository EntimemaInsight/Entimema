import { randomUUID } from "node:crypto";
import { AgentError,errorResponse } from "../../lib/errors";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { CANONICAL_CONCEPTS,type ReviewDecision } from "../../financial-intelligence/schema";
import { PersistenceConflictError } from "../../financial-intelligence/persistence/contracts";
import type { FinancialRunService } from "../../financial-intelligence/persistence/service";
type Deps={authorize:()=>Promise<AuthorizedActor>;service:FinancialRunService};
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
const fail=(error:unknown,id:string)=>error instanceof PersistenceConflictError?json({error_code:"STALE_REVISION",message:"Stale version — reload required."},409):error instanceof Error&&error.message==="RUN_NOT_FOUND"?json({error_code:"RUN_NOT_FOUND"},404):errorResponse(error instanceof AgentError?error:new AgentError("INTERNAL_ERROR",500,undefined,error),id);
export const createRunsHandlers=(deps:Deps)=>({GET:async()=>{const id=randomUUID();try{const actor=await deps.authorize();return json(await deps.service.list(actor.actorId))}catch(e){return fail(e,id)}}});
export const createRunHandlers=(deps:Deps)=>({GET:async(_request:Request,context:{params:Promise<{runId:string}>})=>{const id=randomUUID();try{const actor=await deps.authorize(),{runId}=await context.params;const run=await deps.service.get(actor.actorId,runId);return run?json(run):json({error_code:"RUN_NOT_FOUND"},404)}catch(e){return fail(e,id)}}});
export const createAnalysisHandler=(deps:Deps)=>async(_request:Request,context:{params:Promise<{runId:string}>})=>{const id=randomUUID();try{const actor=await deps.authorize(),{runId}=await context.params;return json(await deps.service.analyze(actor.actorId,runId))}catch(e){if(e instanceof Error&&e.message==="ANALYSIS_REQUIRES_VALIDATED_RUN")return json({error_code:"ANALYSIS_BLOCKED",message:"Financial analysis requires a validated Income Statement."},409);return fail(e,id)}};
const reportBlockedMessage=(code:string)=>({
 REPORT_ARCHIVED:"Archived runs cannot generate reports.",
 REPORT_REQUIRES_VALIDATION:"The report requires a validated Income Statement.",
 REPORT_OPEN_MATERIAL_REVIEW:"Resolve all material review tasks before generating the report.",
 REPORT_FAILED_MATERIAL_CONTROL:"Resolve failed material controls before generating the report.",
 RUN_INTEGRITY_INVALID:"The persisted run failed its integrity check.",
 ANALYSIS_REQUIRES_VALIDATED_RUN:"The report requires a validated Income Statement.",
}[code]);
export const createReportHandler=(deps:Deps)=>async(_request:Request,context:{params:Promise<{runId:string}>})=>{const id=randomUUID();try{const actor=await deps.authorize(),{runId}=await context.params,{bytes,filename}=await deps.service.report(actor.actorId,runId);return new Response(new Uint8Array(bytes),{headers:{"Cache-Control":"private, no-store, max-age=0","Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${filename}"`,"X-Content-Type-Options":"nosniff"}})}catch(e){const message=e instanceof Error?reportBlockedMessage(e.message):undefined;if(message)return json({error_code:"REPORT_BLOCKED",message},409);return fail(e,id)}};
async function body(request:Request){if(!(request.headers.get("content-type")??"").includes("application/json"))throw new AgentError("FILE_CORRUPT",400);return request.json()}
export const createReviewHandler=(deps:Deps)=>async(request:Request,context:{params:Promise<{runId:string}>})=>{const id=randomUUID();try{const actor=await deps.authorize(),{runId}=await context.params,payload=await body(request) as {expectedRevision?:number;decision?:ReviewDecision};if(!Number.isInteger(payload.expectedRevision)||!payload.decision?.taskId)throw new AgentError("FILE_CORRUPT",400);if(payload.decision.concept&&!(CANONICAL_CONCEPTS as readonly string[]).includes(payload.decision.concept))throw new AgentError("FILE_CORRUPT",400);return json(await deps.service.review(actor.actorId,runId,payload.expectedRevision!,payload.decision))}catch(e){return fail(e,id)}};
const mutation=(deps:Deps,kind:"archive"|"revise")=>async(request:Request,context:{params:Promise<{runId:string}>})=>{const id=randomUUID();try{const actor=await deps.authorize(),{runId}=await context.params,payload=await body(request) as {expectedRevision?:number};if(!Number.isInteger(payload.expectedRevision))throw new AgentError("FILE_CORRUPT",400);return json(await deps.service[kind](actor.actorId,runId,payload.expectedRevision!))}catch(e){return fail(e,id)}};
export const createArchiveHandler=(deps:Deps)=>mutation(deps,"archive");export const createRevisionHandler=(deps:Deps)=>mutation(deps,"revise");
