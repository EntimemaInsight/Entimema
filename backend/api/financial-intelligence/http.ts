import { createHash,randomUUID } from "node:crypto";
import { AgentError,errorResponse } from "../../lib/errors";
import { logAgentEvent } from "../../lib/logging";
import type { ExecutionRateLimiter } from "../../lib/rate-limit";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../../lib/document-classifier-upload";
import { inspectUploadedFile } from "../../lib/files";
import { FinancialExecutionError,runFinancialIntelligence } from "../../financial-intelligence/run";
import type { FinancialRunService } from "../../financial-intelligence/persistence/service";

export function customerFinancialRun<T extends {resolverTelemetry?:unknown;reviewTasks?:unknown}>(run:T){const {resolverTelemetry,reviewTasks,...customer}=run;void resolverTelemetry;void reviewTasks;return {...customer,reviewTasks:[]}}
const failedWorkflow=(stage:string)=>{
 const stages=[{id:"upload",label:"Upload"},{id:"understanding",label:"Understanding financials"},{id:"validation",label:"Validating"},{id:"review",label:"Review if needed"},{id:"result",label:"Analysis ready"}],failedIndex=stage==="request"||stage==="upload_parse"?0:stage==="structural_scan"||stage==="financial_understanding"||stage==="contract_build"?1:stage==="validation"?2:stage==="persistence"?4:0;
 return stages.map((item,index)=>({...item,state:index<failedIndex?"completed":index===failedIndex?"blocked":"idle"}));
};
const boundedFailure=(runId:string,failureCode:string,failureStage:string,status=500)=>Response.json({run_id:runId,status:"failed",error_code:"INTERNAL_ERROR",failure_code:failureCode,failure_stage:failureStage,message:"The execution could not be completed safely.",workflow:failedWorkflow(failureStage)},{status,headers:{"Cache-Control":"no-store"}});
export function createFinancialIntelligenceHandler(deps:{authorize:()=>Promise<AuthorizedActor>;rateLimiter:ExecutionRateLimiter;service?:FinancialRunService}){
 return async(request:Request)=>{
  const runId=randomUUID(),totalStarted=performance.now();let actor:AuthorizedActor|undefined;
  try{
   actor=await deps.authorize();await deps.rateLimiter.consume(actor.actorId);
   const length=Number(request.headers.get("content-length"));if(Number.isFinite(length)&&length>DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES)throw new AgentError("FILE_TOO_LARGE",413);
   if(!(request.headers.get("content-type")??"").toLowerCase().startsWith("multipart/form-data"))throw new AgentError("FILE_MISSING",400);
   let form:FormData;try{form=await request.formData()}catch(error){throw new AgentError("FILE_MISSING",400,"Malformed multipart form data.",error)}
   if([...form.keys()].some(k=>!["file","selectedSheet"].includes(k))||form.getAll("file").length!==1||form.getAll("selectedSheet").length>1)throw new AgentError("FILE_MISSING",400,"Expected exactly one file and an optional selected sheet.");
   const selectedSheet=form.get("selectedSheet");if(selectedSheet!==null&&(typeof selectedSheet!=="string"||selectedSheet.length>200))throw new AgentError("FILE_CORRUPT",400,"Invalid selected sheet.");
   let document;try{document=await inspectUploadedFile(form.get("file"))}catch(error){if(error instanceof AgentError)throw error;logAgentEvent("error",{run_id:runId,actor_id:actor.actorId,agent:"financial_intelligence",event:"execution_failed",error_code:"FI_UPLOAD_PARSE_FAILURE",telemetry:{executionPathVersion:"financial-understanding.v1",failureStage:"upload_parse",failureCode:"FI_UPLOAD_PARSE_FAILURE",totalExecutionMs:Math.round(performance.now()-totalStarted)}});return boundedFailure(runId,"FI_UPLOAD_PARSE_FAILURE","upload_parse")}
   let result;
   try{result=await runFinancialIntelligence(document,selectedSheet||null)}catch(error){if(!(error instanceof FinancialExecutionError))throw error;const telemetry={...error.telemetry,failureStage:error.failureStage,failureCode:error.failureCode,totalExecutionMs:Math.round(performance.now()-totalStarted)};logAgentEvent("error",{run_id:runId,actor_id:actor.actorId,agent:"financial_intelligence",event:"execution_failed",error_code:error.failureCode,telemetry});return boundedFailure(runId,error.failureCode,error.failureStage,error.failureCode==="FI_UNDERSTANDING_TIMEOUT"?504:500)}
   const persistenceStarted=performance.now();
   try{if(deps.service)result=await deps.service.create(actor.actorId,result,{size:document.size,fingerprint:createHash("sha256").update(document.buffer).digest("hex")})}catch(error){const telemetry={...result.understandingTelemetry,persistenceMs:Math.round(performance.now()-persistenceStarted),totalExecutionMs:Math.round(performance.now()-totalStarted),failureStage:"persistence",failureCode:"FI_PERSISTENCE_FAILURE"};logAgentEvent("error",{run_id:runId,actor_id:actor.actorId,agent:"financial_intelligence",event:"execution_failed",error_code:"FI_PERSISTENCE_FAILURE",telemetry});if(error instanceof AgentError)return errorResponse(error,runId);return boundedFailure(runId,"FI_PERSISTENCE_FAILURE","persistence")}
   const telemetry={...result.understandingTelemetry,persistenceMs:Math.round(performance.now()-persistenceStarted),totalExecutionMs:Math.round(performance.now()-totalStarted)};logAgentEvent("info",{run_id:result.runId,actor_id:actor.actorId,agent:"financial_intelligence",event:"execution_completed",telemetry});
   return Response.json(customerFinancialRun(result),{headers:{"Cache-Control":"no-store"}});
  }catch(error){return errorResponse(error instanceof AgentError?error:new AgentError("INTERNAL_ERROR",500,undefined,error),runId)}
 };
}
