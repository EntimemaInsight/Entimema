import assert from "node:assert/strict";
import test from "node:test";
import type {CanonicalConcept,CanonicalValue,SourceRow} from "../../backend/financial-intelligence/schema";
import {combineMappingConfidence,interpretWholeStatement,P_AND_L_CONCEPTS} from "../../backend/financial-intelligence/interpretation/whole-statement";

const withResolver=async<T>(run:()=>Promise<T>)=>{const previous={enabled:process.env.FINANCIAL_SEMANTIC_RESOLVER_ENABLED,key:process.env.OPENAI_API_KEY,model:process.env.FINANCIAL_SEMANTIC_MODEL};process.env.FINANCIAL_SEMANTIC_RESOLVER_ENABLED="true";process.env.OPENAI_API_KEY="test-key";process.env.FINANCIAL_SEMANTIC_MODEL="gpt-test";try{return await run()}finally{for(const [name,value] of [["FINANCIAL_SEMANTIC_RESOLVER_ENABLED",previous.enabled],["OPENAI_API_KEY",previous.key],["FINANCIAL_SEMANTIC_MODEL",previous.model]] as const)if(value===undefined)delete process.env[name];else process.env[name]=value}};
const value=(row:number,label:string,concept:CanonicalConcept,n:number):CanonicalValue=>({id:`v-${row}`,sourceRowId:`row-${row}`,sourceLabel:label,normalizedLabel:label.toLowerCase(),concept,lineType:concept.includes("profit")?"subtotal":"component",originalValue:n,normalizedValue:n,sourceSign:n<0?"negative":n>0?"positive":"zero",canonicalSign:n<0?"negative":n>0?"positive":"zero",normalizationRule:"retained",periodId:"p",currency:"CHF",unitScale:1,mappingMethod:"deterministic",mappingConfidence:concept==="other_reported_line"?.4:1,mappingExplanation:"fixture",reviewState:concept==="other_reported_line"?"required":"not_required",evidenceId:`e-${row}`});
const response=(rows:unknown[])=>async()=>({status:"completed",output_text:JSON.stringify({title:"Income statement",currency:"CHF",scale:1,rows})}) as never;

test("regression: compatible 0.90 semantic evidence reaches provisional and final projection without double discounting",()=>withResolver(async()=>{
 const rows:SourceRow[]=[{rowNumber:1,label:"Income statement",normalizedLabel:"income statement",role:"title"},{rowNumber:2,label:"Financial result",normalizedLabel:"financial result",role:"financial_line"}];let request:Record<string,unknown>|undefined;
 const result=await interpretWholeStatement({rows,periods:[],values:[value(2,"Financial result","other_reported_line",-5)],currency:"CHF",scale:1,title:"Income statement"},async body=>{request=JSON.parse((body as {input:string}).input);return(await response([{rowNumber:1,section:"header",role:"title",concept:null,confidence:1,supportingEvidence:[],contradictions:[]},{rowNumber:2,section:"p_and_l",role:"financial_line",concept:"net_finance_result",confidence:.9,supportingEvidence:["hierarchy and neighbours"],contradictions:[]}])())});
 assert.equal(result.values[0].concept,"net_finance_result");assert.equal(result.values[0].acceptanceReason,"accepted_without_equation_contradiction");assert.ok(result.values[0].mappingConfidence>=.68);assert.equal(result.telemetry.acceptedSemanticMappings,1);assert.equal(result.telemetry.equationRejectedProposals,0);
 const submitted=(request!.rows as Array<{rowNumber:number;candidateConcepts:string[]}>).find(row=>row.rowNumber===2)!;assert.deepEqual(new Set(submitted.candidateConcepts),new Set(P_AND_L_CONCEPTS));
}));

test("confidence aggregation uses compatible scales and omits unavailable evidence from its denominator",()=>{assert.equal(combineMappingConfidence({semantic:.9,structural:.9,sign:1,context:.8,equation:null}),(.9*.42+.9*.18+1*.08+.8*.1)/(.42+.18+.08+.1));assert.ok(combineMappingConfidence({semantic:.9,structural:.9,sign:1,context:.8,equation:null})>.68)});

test("two-phase verification uses provisional operands and deterministic contradiction retains veto authority",()=>withResolver(async()=>{
 const rows:SourceRow[]=[{rowNumber:1,label:"Revenue",normalizedLabel:"revenue",role:"financial_line"},{rowNumber:2,label:"Cost of sales",normalizedLabel:"cost of sales",role:"financial_line"},{rowNumber:3,label:"Gross result",normalizedLabel:"gross result",role:"subtotal"}];
 const provider=response(rows.map(row=>({rowNumber:row.rowNumber,section:"p_and_l",role:row.role,concept:row.rowNumber===3?"gross_profit":null,confidence:.95,supportingEvidence:[],contradictions:[]})));
 const result=await interpretWholeStatement({rows,periods:[],values:[value(1,"Revenue","revenue",100),value(2,"Cost of sales","cost_of_sales",40),value(3,"Gross result","other_reported_line",20)],currency:"CHF",scale:1,title:"Income statement"},provider);
 assert.equal(result.values[2].concept,"other_reported_line");assert.equal(result.values[2].acceptanceReason,"equation_contradiction");assert.equal(result.telemetry.equationRejectedProposals,1);assert.equal(result.telemetry.acceptedSemanticMappings,0);
}));

test("schema and ontology allowlist rejections are counted without exposing source labels or values",()=>withResolver(async()=>{
 const rows:SourceRow[]=[{rowNumber:1,label:"Revenue",normalizedLabel:"revenue",role:"financial_line"}];const result=await interpretWholeStatement({rows,periods:[],values:[value(1,"Revenue","other_reported_line",100)],currency:"CHF",scale:1,title:"Income statement"},response([{rowNumber:1,section:"p_and_l",role:"financial_line",concept:"invented",confidence:1,supportingEvidence:[],contradictions:[]}]));
 assert.equal(result.telemetry.allowlistRejectedProposals,1);assert.equal(result.telemetry.outcome,"invalid_schema");assert.deepEqual(Object.keys(result.telemetry).some(key=>/label|value|prompt|key/i.test(key)),false);
}));
