import type { CanonicalConcept,CanonicalValue,Control,Evidence } from "./schema";

const expense = new Set<CanonicalConcept>(["cost_of_sales","selling_and_distribution_expense","general_and_administrative_expense","research_and_development_expense","other_operating_expense","depreciation_and_amortization","finance_cost","income_tax_expense"]);
export function normalizeValue(value:number, concept:CanonicalConcept){return expense.has(concept)?Math.abs(value):value}
export function validate(values:CanonicalValue[], evidence:Evidence[]):Control[]{
  const controls:Control[]=[]; const evidenceIds=new Set(evidence.map(e=>e.id));
  const periods=[...new Set(values.map(v=>v.periodId))];
  const formula=(id:string,label:string,target:CanonicalConcept,terms:Array<[CanonicalConcept,number]>,period:string)=>{
    const candidates=(c:CanonicalConcept)=>values.filter(v=>v.periodId===period&&v.concept===c&&!v.excludedFromControls&&v.reviewState!=="rejected");
    const targetRows=candidates(target); const parts=terms.map(([c,sign])=>[c,sign,candidates(c)] as const); const complete=targetRows.length===1&&parts.every(([, ,rows])=>rows.length===1);
    const inputs=complete?parts.map(([concept,sign,rows])=>({concept,value:rows[0].normalizedValue*sign,evidenceId:rows[0].evidenceId})):[];
    const expected=complete?inputs.reduce((a,b)=>a+b.value,0):null, reported=complete?targetRows[0].normalizedValue:null;
    const tolerance=1; const difference=expected===null||reported===null?null:reported-expected; const status=!complete?"not_applicable":Math.abs(difference!)<=tolerance?"passed":"failed";
    controls.push({id:`${id}:${period}`,formula:label,inputs,expectedValue:expected,reportedValue:reported,difference,tolerance,status,affectedEvidence:complete?[...inputs.map(i=>i.evidenceId),targetRows[0].evidenceId]:[],reviewRequired:status==="failed"});
  };
  for(const p of periods){formula("gross-profit","revenue − cost of sales = gross profit","gross_profit",[["revenue",1],["cost_of_sales",-1]],p); formula("pre-tax","operating profit + finance income − finance cost = profit before tax","profit_before_tax",[["operating_profit",1],["finance_income",1],["finance_cost",-1]],p); formula("net-income","profit before tax − income tax expense + discontinued operations = net income","net_income",[["profit_before_tax",1],["income_tax_expense",-1],["discontinued_operations",1]],p)}
  const duplicates=new Map<string,CanonicalValue[]>(); for(const v of values)duplicates.set(v.evidenceId,[...(duplicates.get(v.evidenceId)??[]),v]);
  const duplicate=[...duplicates.values()].filter(v=>v.length>1); controls.push({id:"duplicate-mapping",formula:"one evidence value maps once",inputs:[],expectedValue:null,reportedValue:null,difference:null,tolerance:0,status:duplicate.length?"failed":"passed",affectedEvidence:duplicate.flatMap(v=>v.map(x=>x.evidenceId)),reviewRequired:Boolean(duplicate.length)});
  const missing=values.filter(v=>!evidenceIds.has(v.evidenceId)); controls.push({id:"evidence-completeness",formula:"every value references observed evidence",inputs:[],expectedValue:values.length,reportedValue:values.length-missing.length,difference:-missing.length,tolerance:0,status:missing.length?"failed":"passed",affectedEvidence:missing.map(v=>v.evidenceId),reviewRequired:Boolean(missing.length)});
  return controls;
}
