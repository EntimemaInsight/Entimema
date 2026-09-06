import assert from "node:assert/strict";
import test from "node:test";
import type {CanonicalConcept,CanonicalValue,SourceRow} from "../../backend/financial-intelligence/schema";
import {interpretWholeStatement,prepareSemanticWorkset} from "../../backend/financial-intelligence/interpretation/whole-statement";

const row=(rowNumber:number,label:string,role:SourceRow["role"]):SourceRow=>({rowNumber,label,normalizedLabel:label.toLowerCase(),role});
const value=(rowNumber:number,label:string,concept:CanonicalConcept):CanonicalValue=>({id:`v-${rowNumber}`,sourceRowId:`row-${rowNumber}`,sourceLabel:label,normalizedLabel:label.toLowerCase(),concept,lineType:"component",originalValue:1,normalizedValue:1,sourceSign:"positive",canonicalSign:"positive",normalizationRule:"retained",periodId:"p",currency:"CHF",unitScale:1,mappingMethod:"deterministic",mappingConfidence:concept==="other_reported_line"?.4:1,mappingExplanation:"fixture",reviewState:concept==="other_reported_line"?"required":"not_required",evidenceId:`e-${rowNumber}`});
const fixtureRows:SourceRow[]=[
 row(1,"Income statement","title"),row(2,"CHF millions","metadata"),row(3,"2026","period_header"),
 row(4,"Revenue","financial_line"),row(5,"Operating result","subtotal"),row(6,"Unclassified operating charge","financial_line"),
 row(7,"Other comprehensive income","subtitle"),row(8,"Currency translation","financial_line"),row(9,"","spacer"),
];
const fixtureValues=[value(4,"Revenue","revenue"),value(5,"Operating result","operating_profit"),value(6,"Unclassified operating charge","other_reported_line"),value(8,"Currency translation","other_reported_line")];

test("semantic workset excludes deterministic and non-P&L rows but keeps compact ordered context",()=>{
 const prepared=prepareSemanticWorkset({rows:fixtureRows,values:fixtureValues});
 assert.deepEqual(prepared.workRows.map(item=>item.rowNumber),[6]);
 assert.ok(prepared.contextRows.some(item=>item.rowNumber===1&&item.mappingState==="structural"));
 assert.ok(prepared.contextRows.some(item=>item.rowNumber===4&&item.mappingState==="deterministic"));
 assert.ok(prepared.contextRows.some(item=>item.rowNumber===6&&item.mappingState==="semantic_work"));
 assert.ok(prepared.contextRows.some(item=>item.rowNumber===7&&item.section==="oci"));
 assert.equal(prepared.contextRows.some(item=>item.rowNumber===8),false);
 assert.equal(prepared.contextRows.some(item=>item.rowNumber===9),false);
});

test("resolver submits only semantic work while telemetry contains counts, never source content",async()=>{
 const names=["FINANCIAL_SEMANTIC_RESOLVER_ENABLED","OPENAI_API_KEY","FINANCIAL_SEMANTIC_MODEL"] as const,before=Object.fromEntries(names.map(name=>[name,process.env[name]]));
 Object.assign(process.env,{FINANCIAL_SEMANTIC_RESOLVER_ENABLED:"true",OPENAI_API_KEY:"test-secret",FINANCIAL_SEMANTIC_MODEL:"gpt-test"});
 let payload:Record<string,unknown>={};
 try{
  const result=await interpretWholeStatement({rows:fixtureRows,values:fixtureValues,periods:[],currency:"CHF",scale:1_000_000,title:"Income statement"},async body=>{
   payload=JSON.parse((body as {input:string}).input);
   return {status:"completed",output_text:JSON.stringify({title:"Income statement",currency:"CHF",scale:1_000_000,rows:[{rowNumber:6,section:"p_and_l",role:"financial_line",concept:"other_operating_expense",confidence:.92,supportingEvidence:["ordered statement context"],contradictions:[]}]})} as never;
  });
  assert.deepEqual((payload.semanticRows as Array<{rowNumber:number}>).map(item=>item.rowNumber),[6]);
  assert.equal(result.telemetry.semanticWorksetRows,1);assert.equal(result.telemetry.rowsSubmitted,1);assert.equal(result.telemetry.excludedBeforeInference,8);assert.equal(result.telemetry.candidateSetCount,1);assert.ok(result.telemetry.contextRows>0);assert.ok(result.telemetry.estimatedInputTokens>0);
  assert.doesNotMatch(JSON.stringify(result.telemetry),/Unclassified|Currency translation|test-secret/);
 }finally{for(const name of names)if(before[name]===undefined)delete process.env[name];else process.env[name]=before[name]}
});

test("fully deterministic P&L does not invoke semantic transport",async()=>{
 const names=["FINANCIAL_SEMANTIC_RESOLVER_ENABLED","OPENAI_API_KEY","FINANCIAL_SEMANTIC_MODEL"] as const,before=Object.fromEntries(names.map(name=>[name,process.env[name]]));
 Object.assign(process.env,{FINANCIAL_SEMANTIC_RESOLVER_ENABLED:"true",OPENAI_API_KEY:"test-secret",FINANCIAL_SEMANTIC_MODEL:"gpt-test"});let calls=0;
 try{
  const result=await interpretWholeStatement({rows:fixtureRows.slice(0,5),values:fixtureValues.slice(0,2),periods:[],currency:"CHF",scale:1,title:"Income statement"},async()=>{calls++;throw new Error("must not run")});
  assert.equal(calls,0);assert.equal(result.telemetry.semanticWorksetRows,0);assert.equal(result.telemetry.invoked,false);assert.equal(result.telemetry.outcome,"success");
 }finally{for(const name of names)if(before[name]===undefined)delete process.env[name];else process.env[name]=before[name]}
});

test("duplicate or incomplete model row sets fail strict parsing safely",async()=>{
 const names=["FINANCIAL_SEMANTIC_RESOLVER_ENABLED","OPENAI_API_KEY","FINANCIAL_SEMANTIC_MODEL"] as const,before=Object.fromEntries(names.map(name=>[name,process.env[name]]));
 Object.assign(process.env,{FINANCIAL_SEMANTIC_RESOLVER_ENABLED:"true",OPENAI_API_KEY:"test-secret",FINANCIAL_SEMANTIC_MODEL:"gpt-test"});
 try{
  const result=await interpretWholeStatement({rows:fixtureRows,values:fixtureValues,periods:[],currency:"CHF",scale:1,title:"Income statement"},async()=>({status:"completed",output_text:JSON.stringify({title:"Income statement",currency:"CHF",scale:1,rows:[]})}) as never);
  assert.equal(result.telemetry.outcome,"invalid_schema");assert.equal(result.values.find(item=>item.sourceRowId==="row-6")?.concept,"other_reported_line");assert.equal(result.values.find(item=>item.sourceRowId==="row-6")?.reviewState,"required");
 }finally{for(const name of names)if(before[name]===undefined)delete process.env[name];else process.env[name]=before[name]}
});
