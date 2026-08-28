import test from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { AISheetResultSchema, normalizeFinancialLabel, parseFinancialWorkbook } from "../../../backend/agents/document-classifier/financial-intake";
import type { InspectedDocument } from "../../../backend/lib/files";

const workbook=(sheets:Record<string,unknown[][]>,extension:".xlsx"|".xlsm"=".xlsx")=>{const wb=XLSX.utils.book_new();for(const [name,rows] of Object.entries(sheets))XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),name);const buffer=XLSX.write(wb,{type:"buffer",bookType:extension===".xlsm"?"xlsm":"xlsx"});return {fileName:`synthetic${extension}`,extension,mimeType:"application/octet-stream",size:buffer.length,buffer} as InspectedDocument};
const classified=(name:string,headers:string[])=>parseFinancialWorkbook(workbook({[name]:[headers,["Fictional",100,90,10],["Synthetic",80,70,10]]})).sheets[0];
const cases:[string,string,string[]][]=[
 ["Bulgarian income statement","income_statement",["ОПР","Приходи","Разходи"]],
 ["English income statement","income_statement",["Income Statement","Revenue","Cost of Sales","Gross Profit"]],
 ["Bulgarian chart of accounts","chart_of_accounts",["Сметкоплан","Номер на сметка","Наименование на сметка"]],
 ["English chart of accounts","chart_of_accounts",["Chart of Accounts","Account Code","Account Name"]],
 ["Bulgarian trial balance","trial_balance",["Оборотна ведомост","Начален дебит","Начален кредит","Дебитен оборот","Кредитен оборот","Крайно дебитно салдо"]],
 ["Bulgarian SAP fixed assets","fixed_asset_register",["ДМА","Фирмен код","Натрупана амортизация","Планирана амортизация","Начална отчетна стойност"]],
 ["English fixed assets","fixed_asset_register",["Fixed Asset Register","Asset Number","Acquisition Value","Planned Depreciation"]],
 ["Budget","budget",["Budget","Budget Amount","Budget Period"]],
 ["Forecast","forecast",["Forecast","Forecast Amount","Forecast Period"]],
 ["Budget versus actual","budget_vs_actual",["Budget vs Actual","Budget","Actual","Variance"]],
 ["AR ageing","ar_ageing",["AR Ageing","Customer","Current","30 Days","60 Days","90 Days"]],
 ["AP ageing","ap_ageing",["AP Ageing","Vendor","Current","30 Days","60 Days","90 Days"]],
];
for(const [name,type,headers] of cases)test(name,()=>assert.equal(classified(name,headers).canonical_type,type));
test("mixed composition and empty sheet handling",()=>{const result=parseFinancialWorkbook(workbook({ОПР:[["Income Statement","Revenue","Cost of Sales"],["A",1,2]],Сметкоплан:[["Chart of Accounts","Account Code","Account Name"],["1000","Cash"]],Empty:[]}));assert.equal(result.composition.type,"mixed_financial_workbook");assert.equal(result.sheets.length,2);assert.equal(result.composition.ignored_empty_sheets,1)});
test("unknown and ambiguous sheets require review",()=>{const unknown=classified("Data",["Field A","Field B"]);assert.equal(unknown.canonical_type,"other_financial_dataset");assert.equal(unknown.review_required,true);const ambiguous=classified("Budget forecast",["Budget","Forecast","Amount"]);assert.equal(ambiguous.review_required,true)});
test("high-confidence deterministic sheet avoids AI and separates confidence",()=>{const result=classified("Trial Balance",["Trial Balance","Opening Debit","Opening Credit","Debit Turnover","Credit Turnover","Closing Debit","Closing Credit"]);assert.equal(result.review_required,false);assert.equal(result.ai_confidence,null);assert.equal(result.final_confidence,result.local_confidence);assert.equal(result.classification_source,"deterministic")});
test("AI result schema is bounded",()=>{assert.equal(AISheetResultSchema.parse({canonical_type:"budget",confidence:.8,evidence:["headers"]}).canonical_type,"budget");assert.throws(()=>AISheetResultSchema.parse({canonical_type:"invented",confidence:2,evidence:[]}))});
test("Cyrillic normalization is Unicode safe",()=>assert.equal(normalizeFinancialLabel("  КРАЙНО—ДЕБИТНО   САЛДО! "),"крайно дебитно салдо"));
test("macro-enabled container is inspected without loading VBA",()=>{const result=parseFinancialWorkbook(workbook({Assets:[["Fixed Asset Register","Asset Number","Acquisition Value","Planned Depreciation"],["FA-1",1,1]]},".xlsm"));assert.equal(result.workbook_fingerprint.has_macros,true);assert.match(result.workbook_fingerprint.warnings[0],/not loaded or executed/)});
test("sheet and cell limits are enforced with sanitized errors",()=>{const sheets=Object.fromEntries(Array.from({length:41},(_,i)=>[`S${i}`,[['A']]]));assert.throws(()=>parseFinancialWorkbook(workbook(sheets)),(error:unknown)=>error instanceof Error&&"code" in error&&error.code==="WORKBOOK_LIMIT_EXCEEDED"&&!JSON.stringify(error).includes("Fictional"))});
