import type { CanonicalConcept, CanonicalValue } from "../schema";
export type Relationship={id:string;target:CanonicalConcept;terms:Array<{concept:CanonicalConcept;coefficient:1|-1;optional?:boolean}>};
export const INCOME_STATEMENT_RELATIONSHIPS:Relationship[]=[
 {id:"gross-result",target:"gross_profit",terms:[{concept:"revenue",coefficient:1},{concept:"cost_of_sales",coefficient:-1}]},
 {id:"operating-result",target:"operating_profit",terms:[{concept:"gross_profit",coefficient:1},{concept:"other_operating_income",coefficient:1,optional:true},{concept:"total_operating_expense",coefficient:-1}]},
 {id:"pre-tax-result",target:"profit_before_tax",terms:[{concept:"operating_profit",coefficient:1},{concept:"finance_income",coefficient:1,optional:true},{concept:"finance_cost",coefficient:-1,optional:true}]},
 {id:"bottom-line",target:"net_income",terms:[{concept:"profit_before_tax",coefficient:1},{concept:"income_tax_expense",coefficient:-1},{concept:"discontinued_operations",coefficient:1,optional:true}]},
];
export function equationEvidence(values:CanonicalValue[],periodId:string,toleranceScale=1){const period=values.filter(v=>v.periodId===periodId&&v.reviewState!=="rejected");const scores:Partial<Record<CanonicalConcept,number>>={};for(const relation of INCOME_STATEMENT_RELATIONSHIPS){const target=period.find(v=>v.concept===relation.target);const terms=relation.terms.map(t=>({term:t,value:period.find(v=>v.concept===t.concept)}));if(!target||terms.some(x=>!x.term.optional&&!x.value))continue;const expected=terms.reduce((n,x)=>n+(x.value?.normalizedValue??0)*x.term.coefficient,0);const tolerance=Math.max(toleranceScale*.000001,Math.abs(target.normalizedValue)*.001,1);scores[relation.target]=Math.abs(target.normalizedValue-expected)<=tolerance?1:0;}return scores}
