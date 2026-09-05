import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { AgentError } from "../../backend/lib/errors";
import { createReviewHandler } from "../../backend/api/financial-intelligence/persisted-http";
import type { FinancialRunRepository, PersistEvent, RunListItem } from "../../backend/financial-intelligence/persistence/contracts";
import { FinancialRunService } from "../../backend/financial-intelligence/persistence/service";
import { runFinancialIntelligence } from "../../backend/financial-intelligence/run";
import type { FinancialRun } from "../../backend/financial-intelligence/schema";

class ReviewRepository implements FinancialRunRepository {
  rows = new Map<string,{owner:string;run:FinancialRun;events:PersistEvent[];snapshots:Record<string,unknown>[]}>();
  async create(owner:string,run:FinancialRun,event:PersistEvent){this.rows.set(run.runId,{owner,run:structuredClone(run),events:[event],snapshots:[]});return structuredClone(run)}
  async list(owner:string):Promise<RunListItem[]>{return [...this.rows.values()].filter(row=>row.owner===owner).map(({run})=>({runId:run.runId,filename:run.source.filename,selectedStatement:run.source.selectedSection,status:run.status,periods:run.metrics.periods,financialRows:run.metrics.financialSourceRows,openTasks:run.metrics.reviewTasks,createdAt:run.createdAt!,updatedAt:run.updatedAt!,revision:run.revision!}))}
  async get(owner:string,id:string){const row=this.rows.get(id);return row?.owner===owner?structuredClone(row.run):null}
  async listForReview(operator:string){assert.equal(operator,"operator");return this.list("customer")}
  async getForReview(_operator:string,id:string){const row=this.rows.get(id);return row?structuredClone(row.run):null}
  async updateForReview(_operator:string,run:FinancialRun,expected:number,event:PersistEvent,snapshot?:Record<string,unknown>){const row=this.rows.get(run.runId);if(!row||row.run.revision!==expected)throw new Error("stale");row.run=structuredClone(run);row.events.push(event);if(snapshot)row.snapshots.push(structuredClone(snapshot));return structuredClone(run)}
  async update(owner:string,run:FinancialRun,expected:number,event:PersistEvent,snapshot?:Record<string,unknown>){const row=this.rows.get(run.runId);if(!row||row.owner!==owner||row.run.revision!==expected)throw new Error("stale");row.run=structuredClone(run);row.events.push(event);if(snapshot)row.snapshots.push(structuredClone(snapshot));return structuredClone(run)}
}

async function partialFixture(){
 const rows:unknown[][]=[
  ["Consolidated Income Statement"],["CHF millions"],["","2024","2025"],
  ["Sales",100,120],["Cost of sales",40,48],["Gross profit",60,72],
  ["Personnel expense",20,22],["Unusual restructuring charge",10,11],["Total operating expenses",30,33],
  ["Operating profit",30,39],["Finance income",2,3],["Finance cost",5,6],
  ["Profit before tax",27,36],["Income tax expense",5.4,7.2],["Net income",21.6,28.8],
  ["Earnings attributable to owners",21.6,28.8],["Other comprehensive income",1,2],["Total comprehensive income",22.6,30.8],
 ];
 const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet(rows),"Consolidated Income Statement");const buffer=XLSX.write(book,{type:"buffer",bookType:"xlsx"});
 return runFinancialIntelligence({fileName:"representative-chf.xlsx",extension:".xlsx",mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",size:buffer.length,buffer});
}

test("partial mapping -> specialist replay -> validated revision -> analysis/report -> reopen",async()=>{
 const initial=await partialFixture();
 assert.equal(initial.currency,"CHF");assert.equal(initial.unitScale,1_000_000);assert.equal(initial.periods.length,2);assert.equal(initial.metrics.financialSourceRows,12);
 assert.equal(initial.status,"review_required");
 const mapping=initial.reviewTasks.find(task=>task.sourceLabel==="Unusual restructuring charge");assert.ok(mapping);assert.ok(mapping.reason);assert.equal(mapping.state,"open");
 const repo=new ReviewRepository(),service=new FinancialRunService(repo),persisted=await service.create("customer",initial,{size:100,fingerprint:"safe-fixture"});
 assert.equal(await service.get("operator",persisted.runId),null);assert.equal((await service.reviewQueue("operator")).length,1);
 const reviewed=await service.review("operator",persisted.runId,1,{taskId:mapping.id,action:"remap",concept:"other_operating_expense"});
 assert.equal(reviewed.revision,2);assert.equal(reviewed.status,"validated");assert.equal(reviewed.readiness.status,"validated");assert.ok(reviewed.controls.every(control=>control.status!=="failed"));
 const decision=reviewed.reviewTasks.find(task=>task.id===mapping.id);assert.equal(decision?.state,"resolved");assert.equal(decision?.resolution?.actor,"operator");assert.equal(decision?.resolution?.action,"remap");
 assert.ok(reviewed.values.filter(value=>value.sourceLabel==="Unusual restructuring charge").every(value=>value.mappingMethod==="human-validated"&&value.originalProposal==="other_reported_line"));
 assert.equal(repo.rows.get(reviewed.runId)?.events.at(-1)?.type,"row_remapped");assert.equal(repo.rows.get(reviewed.runId)?.snapshots.length,1);
 const identity={revision:2,selectedStatement:reviewed.source.selectedSection!,snapshotHash:reviewed.integrity,schemaVersion:reviewed.schemaVersion};
 const analysis=await service.analyze("customer",reviewed.runId,identity);assert.equal(analysis.validatedSnapshotHash,reviewed.integrity);
 const report=await service.report("customer",reviewed.runId,identity,"2026-09-05T12:00:00.000Z");assert.ok(report.bytes.subarray(0,5).equals(Buffer.from("%PDF-")));
 const reopened=await service.get("customer",reviewed.runId);assert.equal(reopened?.integrity,reviewed.integrity);assert.equal(reopened?.reviewTasks.find(task=>task.id===mapping.id)?.resolution?.actor,"operator");
 await assert.rejects(()=>service.analyze("customer",reviewed.runId,{...identity,revision:1}),/STALE_ANALYSIS_IDENTITY/);
 await assert.rejects(()=>service.report("customer",reviewed.runId,{...identity,snapshotHash:initial.integrity}),/STALE_ANALYSIS_IDENTITY/);
});

test("rejecting an unresolved material mapping cannot bypass failed controls",async()=>{
 const run=await partialFixture(),mapping=run.reviewTasks.find(task=>task.sourceLabel==="Unusual restructuring charge")!;const repo=new ReviewRepository(),service=new FinancialRunService(repo),persisted=await service.create("operator",run,{size:1,fingerprint:"x"});
 const reviewed=await service.review("operator",persisted.runId,1,{taskId:mapping.id,action:"reject"});
 assert.equal(reviewed.status,"review_required");assert.equal(reviewed.readiness.gates.controls,false);assert.ok(reviewed.controls.some(control=>control.material&&control.status==="failed"));assert.equal(repo.rows.get(run.runId)?.snapshots.length,0);
});

test("review endpoint rejects unauthorized users and malformed or unsafe decisions",async()=>{
 const run=await partialFixture(),mapping=run.reviewTasks.find(task=>task.sourceLabel==="Unusual restructuring charge")!;const repo=new ReviewRepository(),service=new FinancialRunService(repo);await service.create("operator",run,{size:1,fingerprint:"x"});const context={params:Promise.resolve({runId:run.runId})};
 const denied=createReviewHandler({authorize:async()=>{throw new AgentError("ACCESS_FORBIDDEN",404)},service});assert.equal((await denied(new Request("http://test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({expectedRevision:1,decision:{taskId:mapping.id,action:"remap",concept:"other_operating_expense"}})}),context)).status,404);
 const allowed=createReviewHandler({authorize:async()=>({actorId:"operator"}),service});
 for(const decision of [{taskId:mapping.id,action:"accept"},{taskId:mapping.id,action:"remap",concept:"invented"}]){const response=await allowed(new Request("http://test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({expectedRevision:1,decision})}),context);assert.notEqual(response.status,200)}
 const before=await service.get("operator",run.runId);assert.equal(before?.status,"review_required");assert.equal(before?.revision,1);
 await assert.rejects(()=>service.analyze("operator",run.runId,{revision:1,selectedStatement:run.source.selectedSection!,snapshotHash:run.integrity,schemaVersion:run.schemaVersion}),/ANALYSIS_REQUIRES_VALIDATED_RUN/);
 await assert.rejects(()=>service.report("operator",run.runId,{revision:1,selectedStatement:run.source.selectedSection!,snapshotHash:run.integrity,schemaVersion:run.schemaVersion}),/ANALYSIS_REQUIRES_VALIDATED_RUN/);
});
