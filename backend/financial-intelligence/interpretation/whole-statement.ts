import type {OpenAITransport} from "../../lib/openai";
import {CANONICAL_CONCEPTS,type CanonicalConcept,type CanonicalValue,type Period,type ResolverOutcome,type ResolverTelemetry,type RowRole,type SourceRow} from "../schema";
import {MAPPING_POLICY,rankMappingCandidates} from "./ontology";
import {equationEvidence,INCOME_STATEMENT_RELATIONSHIPS} from "./relationships";
import {getFinancialResolverConfig,resolveWholeStatement,type StatementSection} from "./semantic-resolver";

const ociStart=/other comprehensive income|remeasurement|not reclassified|may be reclassified|cash flow hedge|currency translation|foreign currency translation/i;
const totalComprehensive=/^total comprehensive income/i;
const attribution=/attributable to|owners of the parent|non[- ]controlling interests/i;
const financialRoles=new Set<RowRole>(["financial_line","subtotal","total"]);
const excludedConcepts=new Set<CanonicalConcept>(["attributable_to_owners","non_controlling_interests","other_reported_line"]);
export const P_AND_L_CONCEPTS=CANONICAL_CONCEPTS.filter(concept=>!excludedConcepts.has(concept));

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

const resolverOutcome=(reason:string|null,resolution:boolean):ResolverOutcome=>resolution?"success":reason==="feature_disabled"||reason==="provider_unavailable"?"disabled":reason==="timeout"?"timeout":reason==="invalid_output"?"invalid_schema":reason==="provider_error"?"provider_error":"unresolved";

/**
 * Evidence scores are all normalized to [0, 1]. Missing optional evidence is omitted
 * from the denominator; it is not silently converted to contradictory (zero) evidence.
 */
export function combineMappingConfidence(parts:{semantic:number;structural:number;sign?:number;context?:number;history?:number;equation?:number|null}){
 const weights=MAPPING_POLICY.weights,available:Array<[number,number]>=[[parts.semantic,weights.semantic],[parts.structural,weights.structural]];
 if(parts.sign!==undefined)available.push([parts.sign,weights.sign]);
 if(parts.context!==undefined)available.push([parts.context,weights.context]);
 if(parts.history!==undefined)available.push([parts.history,weights.history]);
 if(parts.equation!==undefined&&parts.equation!==null)available.push([parts.equation,weights.equation]);
 const denominator=available.reduce((sum,[,weight])=>sum+weight,0);
 return denominator?available.reduce((sum,[score,weight])=>sum+Math.max(0,Math.min(1,score))*weight,0)/denominator:0;
}

type Provisional={rowNumber:number;concept:CanonicalConcept;semanticConfidence:number;structuralConfidence:number;signConsistency:number;contextConfidence:number;supportingEvidence:string[];contradictions:string[];combinedConfidence:number};

export async function interpretWholeStatement(input:{rows:SourceRow[];periods:Period[];values:CanonicalValue[];currency:string|null;scale:number|null;title:string|null},transport?:OpenAITransport){
 const sections=deterministicSections(input.rows),candidates:Record<number,CanonicalConcept[]>={},signPatterns:Record<number,"positive"|"negative"|"mixed">={};
 for(const row of input.rows){
  const ranked=rankMappingCandidates({label:row.label,role:row.role});
  // Every P&L row receives the complete bounded ontology. Ranking changes order only;
  // it never prevents the provider from selecting a contextual non-lexical concept.
  const preferred=ranked.candidates.map(x=>x.concept),all=sections.get(row.rowNumber)==="p_and_l"?P_AND_L_CONCEPTS:[];
  candidates[row.rowNumber]=[...new Set([...preferred,...all])];
  const signs=new Set(input.values.filter(v=>v.sourceRowId===`row-${row.rowNumber}`).map(v=>v.sourceSign).filter(x=>x!=="zero"));
  signPatterns[row.rowNumber]=signs.size===1?(signs.values().next().value as "positive"|"negative"):"mixed";
 }
 const providerResult=await resolveWholeStatement({title:input.title,rows:input.rows,periods:input.periods,currency:input.currency,scale:input.scale,candidates,signPatterns,relationships:INCOME_STATEMENT_RELATIONSHIPS.map(x=>x.id)},transport);
 const {resolution,reason,invoked,durationMs,diagnostics}=providerResult,resolved=new Map(resolution?.rows.map(x=>[x.rowNumber,x])??[]);
 const rejectionReasons:Record<string,number>={};const reject=(category:string)=>{rejectionReasons[category]=(rejectionReasons[category]??0)+1};

 // Phase A: produce one provisional mapping per source row. No equation is required yet.
 const provisional=new Map<number,Provisional>();
 const rowRejections=new Map<number,string>();
 for(const row of input.rows){
  if(sections.get(row.rowNumber)!=="p_and_l")continue;
  const existing=input.values.find(v=>v.sourceRowId===`row-${row.rowNumber}`&&v.concept!=="other_reported_line");
  if(existing)continue;
  const semantic=resolved.get(row.rowNumber);if(!semantic?.concept)continue;
  if(semantic.section!=="p_and_l"){reject("section_incompatible");rowRejections.set(row.rowNumber,"section_incompatible");continue}
  const roleCompatible=financialRoles.has(semantic.role)&&financialRoles.has(row.role);
  if(!roleCompatible){reject("structural_incompatible");rowRejections.set(row.rowNumber,"structural_incompatible");continue}
  const structural=semantic.role===row.role ? .9 : .8,context=.8,sign=1;
  const combined=combineMappingConfidence({semantic:semantic.confidence,structural,context,sign,equation:null});
  if(semantic.confidence<MAPPING_POLICY.medium){reject("semantic_confidence_below_threshold");rowRejections.set(row.rowNumber,"semantic_confidence_below_threshold");continue}
  if(combined<MAPPING_POLICY.high){reject("combined_confidence_below_threshold");rowRejections.set(row.rowNumber,"combined_confidence_below_threshold");continue}
  provisional.set(row.rowNumber,{rowNumber:row.rowNumber,concept:semantic.concept,semanticConfidence:semantic.confidence,structuralConfidence:structural,signConsistency:sign,contextConfidence:context,supportingEvidence:semantic.supportingEvidence,contradictions:semantic.contradictions,combinedConfidence:combined});
 }

 // Phase B: equations are constructed from all provisional mappings. An unavailable
 // equation is indeterminate; a material failed equation is a deterministic veto.
 const provisionalValues=input.values.map(value=>{const rowNo=Number(value.sourceRowId.replace("row-","")),proposal=provisional.get(rowNo);return proposal?{...value,concept:proposal.concept}:value});
 const equationByPeriod=new Map(input.periods.map(period=>[period.id,equationEvidence(provisionalValues,period.id,input.scale??1)]));
 for(const value of input.values)if(!equationByPeriod.has(value.periodId))equationByPeriod.set(value.periodId,equationEvidence(provisionalValues,value.periodId,input.scale??1));
 const contradictedRows=new Set<number>();
 for(const [rowNo,proposal] of provisional){const scores=[...equationByPeriod.values()].map(x=>x[proposal.concept]).filter((x):x is number=>x!==undefined);if(scores.some(x=>x===0)){contradictedRows.add(rowNo);reject("equation_contradiction")}}

 let acceptedSemantic=0;
 const acceptedRows=new Set<number>();
 const values:CanonicalValue[]=input.values.map(value=>{
  const rowNo=Number(value.sourceRowId.replace("row-","")),hardSection=sections.get(rowNo)??"unresolved",semantic=resolved.get(rowNo),proposal=provisional.get(rowNo);
  const protectedBoundary=["oci","total_comprehensive_income","attribution","metadata"].includes(hardSection),rawSection=protectedBoundary?hardSection:semantic?.section??hardSection;
  const section=["p_and_l","oci","total_comprehensive_income","attribution","metadata"].includes(rawSection)?rawSection as CanonicalValue["section"]:"unresolved";
  if(section!=="p_and_l")return{...value,section,concept:"other_reported_line" as const,reviewState:"not_required" as const,excludedFromControls:true,mappingExplanation:`Preserved source evidence; excluded from canonical P&L (${section}).`,resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",acceptanceReason:"section_excluded"};
  if(value.concept!=="other_reported_line")return{...value,section,semanticConfidence:value.mappingConfidence,structuralConfidence:.9,signConsistency:1,evidenceReferences:[value.evidenceId],contractVersion:"semantic-resolver.v2",acceptanceReason:"deterministic_mapping"};
  if(proposal&&!contradictedRows.has(rowNo)){const equationScores=[...equationByPeriod.values()].map(x=>x[proposal.concept]).filter((x):x is number=>x!==undefined),equation=equationScores.length?Math.min(...equationScores):undefined,confidence=combineMappingConfidence({semantic:proposal.semanticConfidence,structural:proposal.structuralConfidence,context:proposal.contextConfidence,sign:proposal.signConsistency,equation});if(!acceptedRows.has(rowNo)){acceptedRows.add(rowNo);acceptedSemantic++}return{...value,section,concept:proposal.concept,mappingMethod:"model-assisted" as const,mappingConfidence:confidence,semanticConfidence:proposal.semanticConfidence,structuralConfidence:proposal.structuralConfidence,equationConsistency:equation,signConsistency:proposal.signConsistency,contradictions:proposal.contradictions,mappingExplanation:proposal.supportingEvidence.join("; ")||"Whole-statement semantic resolution verified.",evidenceReferences:[value.evidenceId],resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",reviewState:"not_required" as const,acceptanceReason:equation===1?"verified_by_equation":"accepted_without_equation_contradiction"};}
  const rejection=contradictedRows.has(rowNo)?"equation_contradiction":rowRejections.get(rowNo)??(semantic?.concept?"not_provisionally_accepted":reason??"unresolved");return{...value,section,semanticConfidence:semantic?.confidence??0,reviewState:"required" as const,mappingExplanation:`Specialist verification required (${rejection}).`,resolverVersion:resolution?.resolverVersion,contractVersion:"semantic-resolver.v2",acceptanceReason:rejection};
 });
 const config=getFinancialResolverConfig(),pAndLRows=new Set(values.filter(v=>v.section==="p_and_l").map(v=>v.sourceRowId)),mappedRows=new Set(values.filter(v=>v.section==="p_and_l"&&v.concept!=="other_reported_line").map(v=>v.sourceRowId)),deterministicRows=new Set(values.filter(v=>v.section==="p_and_l"&&v.concept!=="other_reported_line"&&v.mappingMethod==="deterministic").map(v=>v.sourceRowId));
 const count=(key:string)=>rejectionReasons[key]??0,rejected=diagnostics.schemaRejected+diagnostics.allowlistRejected+Object.values(rejectionReasons).reduce((a,b)=>a+b,0);
 const telemetry:ResolverTelemetry={requested:config.requested,invoked,outcome:resolverOutcome(reason,Boolean(resolution)),resolverVersion:config.resolverVersion,model:config.model,durationMs,rowsSubmitted:Math.min(input.rows.length,config.maxRows),classificationsReturned:diagnostics.classificationsReturned,proposedMappings:diagnostics.proposalsReturned,schemaRejectedProposals:diagnostics.schemaRejected,allowlistRejectedProposals:diagnostics.allowlistRejected,sectionRejectedProposals:count("section_incompatible"),structuralRejectedProposals:count("structural_incompatible"),confidenceRejectedProposals:count("semantic_confidence_below_threshold")+count("combined_confidence_below_threshold"),signRejectedProposals:count("sign_contradiction"),equationRejectedProposals:count("equation_contradiction"),acceptedSemanticMappings:acceptedSemantic,acceptedDeterministicMappings:deterministicRows.size,unresolvedPAndLRows:pAndLRows.size-mappedRows.size,acceptedMappings:acceptedSemantic,rejectedMappings:rejected,rejectionReasons,automaticMappingCoverage:pAndLRows.size?mappedRows.size/pAndLRows.size:0};
 return{values,currency:resolution?.currency??input.currency,scale:resolution?.scale??input.scale,resolverFailure:resolution?null:reason,telemetry};
}
