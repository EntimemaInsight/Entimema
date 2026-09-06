import type {CanonicalConcept,CanonicalValue,SourceRow} from "../backend/financial-intelligence/schema";
import {interpretWholeStatement,prepareSemanticWorkset} from "../backend/financial-intelligence/interpretation/whole-statement";

// Synthetic shape only: no issuer labels, values, filenames, or source content.
const structural:SourceRow[]=[
 {rowNumber:1,label:"Consolidated income statement",normalizedLabel:"consolidated income statement",role:"title"},
 {rowNumber:2,label:"Reporting currency and scale",normalizedLabel:"reporting currency and scale",role:"metadata"},
 {rowNumber:3,label:"Current and comparative periods",normalizedLabel:"current and comparative periods",role:"period_header"},
 ...Array.from({length:11},(_,index)=>({rowNumber:index+34,label:index%2?"":"Statement context",normalizedLabel:index%2?"":"statement context",role:(index%2?"spacer":"note") as SourceRow["role"]})),
];
const pAndL=Array.from({length:14},(_,index)=>({rowNumber:index+4,label:index<5?`Deterministic line ${index+1}`:`Unresolved line ${index-4}`,normalizedLabel:index<5?`deterministic line ${index+1}`:`unresolved line ${index-4}`,role:(index%4===3?"subtotal":"financial_line") as SourceRow["role"]}));
const excluded:SourceRow[]=[{rowNumber:18,label:"Other comprehensive income",normalizedLabel:"other comprehensive income",role:"subtitle"},...Array.from({length:15},(_,index)=>({rowNumber:index+19,label:`Excluded line ${index+1}`,normalizedLabel:`excluded line ${index+1}`,role:"financial_line" as const}))];
const rows=[...structural,...pAndL,...excluded].sort((a,b)=>a.rowNumber-b.rowNumber);
const value=(source:SourceRow,concept:CanonicalConcept):CanonicalValue=>({id:`v-${source.rowNumber}`,sourceRowId:`row-${source.rowNumber}`,sourceLabel:source.label,normalizedLabel:source.normalizedLabel,concept,lineType:source.role==="subtotal"?"subtotal":"component",originalValue:1,normalizedValue:1,sourceSign:"positive",canonicalSign:"positive",normalizationRule:"retained",periodId:"p",currency:null,unitScale:null,mappingMethod:"deterministic",mappingConfidence:concept==="other_reported_line"?.4:1,mappingExplanation:"synthetic diagnostic",reviewState:concept==="other_reported_line"?"required":"not_required",evidenceId:`e-${source.rowNumber}`});
const values=[...pAndL.map((source,index)=>value(source,index<5?"revenue":"other_reported_line")),...excluded.slice(1).map(source=>value(source,"other_reported_line"))];
const live=process.argv.includes("--live");
if(live&&!process.env.OPENAI_API_KEY)throw new Error("OPENAI_API_KEY is required for --live");
if(live&&!process.env.FINANCIAL_SEMANTIC_MODEL)throw new Error("FINANCIAL_SEMANTIC_MODEL is required for --live");
process.env.FINANCIAL_SEMANTIC_RESOLVER_ENABLED="true";
if(!live){process.env.OPENAI_API_KEY="synthetic-diagnostic";process.env.FINANCIAL_SEMANTIC_MODEL="mock-structured-output"}
const prepared=prepareSemanticWorkset({rows,values});
let capturedPayload="";
const transport=live?undefined:async(body:unknown)=>{
 capturedPayload=(body as {input:string}).input;
 return{status:"completed",output_text:JSON.stringify({title:"Consolidated income statement",currency:null,scale:null,rows:prepared.workRows.map(source=>({rowNumber:source.rowNumber,section:"p_and_l",role:source.role,concept:"other_operating_expense",confidence:.9,supportingEvidence:["synthetic ordered context"],contradictions:[]}))})} as never;
};
async function main(){
 const started=performance.now();
 const result=await interpretWholeStatement({rows,values,periods:[],currency:null,scale:null,title:"Consolidated income statement"},transport);
 const durationMs=Math.round(performance.now()-started);
 console.log(JSON.stringify({mode:live?"live":"deterministic_mock",model:result.telemetry.model,fullStatementRows:rows.length,semanticRows:result.telemetry.semanticWorksetRows,contextRows:result.telemetry.contextRows,excludedBeforeInference:result.telemetry.excludedBeforeInference,candidateSetCount:result.telemetry.candidateSetCount,payloadChars:result.telemetry.requestPayloadChars||capturedPayload.length,estimatedInputTokens:result.telemetry.estimatedInputTokens,maxOutputTokens:result.telemetry.maxOutputTokens,durationMs,outcome:result.telemetry.outcome,classificationsReturned:result.telemetry.classificationsReturned,proposedMappings:result.telemetry.proposedMappings,acceptedSemanticMappings:result.telemetry.acceptedSemanticMappings},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
