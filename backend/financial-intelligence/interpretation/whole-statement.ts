import type {OpenAITransport} from "../../lib/openai";
import {CANONICAL_CONCEPTS,type CanonicalConcept,type CanonicalValue,type Period,type ResolverOutcome,type ResolverTelemetry,type SourceRow} from "../schema";
import {MAPPING_POLICY,rankMappingCandidates} from "./ontology";
import {INCOME_STATEMENT_RELATIONSHIPS} from "./relationships";
import {getFinancialResolverConfig,resolveWholeStatement,type StatementSection} from "./semantic-resolver";

const ociStart=/other comprehensive income|remeasurement|not reclassified|may be reclassified|cash flow hedge|currency translation|foreign currency translation/i;
const totalComprehensive=/^total comprehensive income/i;
const attribution=/attributable to|owners of the parent|non[- ]controlling interests/i;
const financialRoles=new Set(["financial_line","subtotal","total"]);

/** Conservative deterministic boundary vetoes always outrank provider output. */
export function deterministicSections(rows:SourceRow[]){
 let section:StatementSection="header";const result=new Map<number,StatementSection>();
 for(const row of rows){
  if(attribution.test(row.label))section="attribution";
  else if(totalComprehensive.test(row.label))section="total_comprehensive_income";
  else if(ociStart.test(row.label))section="oci";
  else if(financialRoles.has(row.role)&&section==="header")section="p_and_l";
  const classified=section==="header"&&!financialRoles.has(row.role)?(row.role==="metadata"||row.role==="note"?"metadata":section):section;
  result.set(row.rowNumber,classified);
 }
 return result;
}

const outcome=(reason:string|null,resolution:boolean):ResolverOutcome=>resolution?"success":reason==="feature_disabled"||reason==="provider_unavailable"?"disabled":reason==="timeout"?"timeout":reason==="invalid_output"?"invalid_schema":reason==="provider_error"?"provider_error":"unresolved";

export async function interpretWholeStatement(input:{rows:SourceRow[];periods:Period[];values:CanonicalValue[];currency:string|null;scale:number|null;title:string|null},transport?:OpenAITransport){
 const sections=deterministicSections(input.rows),candidates:Record<number,CanonicalConcept[]>={},signPatterns:Record<number,"positive"|"negative"|"mixed">={};
 for(const row of input.rows){
  const ranked=rankMappingCandidates({label:row.label,role:row.role});
  candidates[row.rowNumber]=ranked.candidates.length?ranked.candidates.map(x=>x.concept):(sections.get(row.rowNumber)==="p_and_l"?[...CANONICAL_CONCEPTS.filter(x=>x!=="other_reported_line")]:[]);
  const signs=new Set(input.values.filter(v=>v.sourceRowId===`row-${row.rowNumber}`).map(v=>v.sourceSign));
  signPatterns[row.rowNumber]=signs.size===1?(signs.values().next().value as "positive"|"negative")||"mixed":"mixed";
 }
 const providerResult=await resolveWholeStatement({title:input.title,rows:input.rows,periods:input.periods,currency:input.currency,scale:input.scale,candidates,signPatterns,relationships:INCOME_STATEMENT_RELATIONSHIPS.map(x=>x.id)},transport);
 const {resolution,reason,invoked,durationMs}=providerResult,resolved=new Map(resolution?.rows.map(x=>[x.rowNumber,x])??[]),rejections:Record<string,number>={};
 let proposed=0,accepted=0;
 const reject=(category:string)=>{rejections[category]=(rejections[category]??0)+1};
 const values:CanonicalValue[]=input.values.map(value=>{
  const rowNo=Number(value.sourceRowId.replace("row-","")),hardSection=sections.get(rowNo)??"unresolved",semantic=resolved.get(rowNo);
  const protectedBoundary=["oci","total_comprehensive_income","attribution","metadata"].includes(hardSection);
  const rawSection=protectedBoundary?hardSection:semantic?.section??hardSection;
  const section=["p_and_l","oci","total_comprehensive_income","attribution","metadata"].includes(rawSection)?rawSection as CanonicalValue["section"]:"unresolved";
  if(section!=="p_and_l")return{...value,section,concept:"other_reported_line" as const,reviewState:"not_required" as const,excludedFromControls:true,mappingExplanation:`Preserved source evidence; excluded from canonical P&L (${section}).`,resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",acceptanceReason:"section_excluded"};
  if(value.concept!=="other_reported_line")return{...value,section,semanticConfidence:value.mappingConfidence,structuralConfidence:.9,equationConsistency:0,signConsistency:1,evidenceReferences:[value.evidenceId],contractVersion:"semantic-resolver.v2",acceptanceReason:"deterministic_mapping"};
  if(semantic?.concept)proposed++;
  const structural=.9,sign=1,equation=0,combined=semantic?semantic.confidence*MAPPING_POLICY.weights.semantic+structural*MAPPING_POLICY.weights.structural+sign*MAPPING_POLICY.weights.sign+.5*MAPPING_POLICY.weights.context:0;
  const rejection=!semantic?.concept?(reason??"unresolved"):semantic.section!=="p_and_l"?"section_veto":semantic.contradictions.length?"contradiction":combined<MAPPING_POLICY.high?"confidence_below_threshold":null;
  if(!rejection&&semantic?.concept){accepted++;return{...value,section,concept:semantic.concept,mappingMethod:"model-assisted" as const,mappingConfidence:combined,semanticConfidence:semantic.confidence,structuralConfidence:structural,equationConsistency:equation,signConsistency:sign,contradictions:semantic.contradictions,mappingExplanation:semantic.supportingEvidence.join("; ")||"Whole-statement semantic resolution verified.",evidenceReferences:[value.evidenceId],resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",reviewState:"not_required" as const,acceptanceReason:"passed_deterministic_verification"};}
  reject(rejection!);return{...value,section,semanticConfidence:semantic?.confidence??0,structuralConfidence:structural,equationConsistency:equation,signConsistency:sign,contradictions:semantic?.contradictions??[],reviewState:"required" as const,mappingExplanation:`Specialist verification required (${rejection}).`,resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",acceptanceReason:rejection!};
 });
 const config=getFinancialResolverConfig(),pAndLRows=new Set(values.filter(v=>v.section==="p_and_l").map(v=>v.sourceRowId)),mappedRows=new Set(values.filter(v=>v.section==="p_and_l"&&v.concept!=="other_reported_line").map(v=>v.sourceRowId));
 const telemetry:ResolverTelemetry={requested:config.requested,invoked,outcome:outcome(reason,Boolean(resolution)),resolverVersion:config.resolverVersion,model:config.model,durationMs,rowsSubmitted:Math.min(input.rows.length,config.maxRows),proposedMappings:proposed,acceptedMappings:accepted,rejectedMappings:Object.values(rejections).reduce((a,b)=>a+b,0),rejectionReasons:rejections,automaticMappingCoverage:pAndLRows.size?mappedRows.size/pAndLRows.size:0};
 return{values,currency:resolution?.currency??input.currency,scale:resolution?.scale??input.scale,resolverFailure:resolution?null:reason,telemetry};
}
