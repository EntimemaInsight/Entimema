import type { CanonicalConcept, RowRole } from "../schema";
import type { MappingCandidate, MappingDecision } from "./contracts";

export const MAPPING_POLICY = { version:"mapping-confidence.v1", high:.68, medium:.55, contradictionPenalty:.45, weights:{semantic:.42,structural:.18,equation:.18,sign:.08,context:.1,history:.04} } as const;
type Entry={concept:CanonicalConcept;patterns:RegExp[];roles?:RowRole[];expense?:boolean};
const entries:Entry[]=[
 {concept:"revenue",patterns:[/^(total )?(net )?(revenue|sales|turnover)$/]},
 {concept:"cost_of_sales",patterns:[/^(cost of (sales|goods sold|services)|cogs|cost of products sold)$/],expense:true},
 {concept:"gross_profit",patterns:[/^gross (profit|margin)$/]}, {concept:"gross_loss",patterns:[/^gross loss$/]},
 {concept:"other_operating_income",patterns:[/^other operating income$/]},
 {concept:"personnel_expense",patterns:[/^(personnel|staff|employee|labou?r) (costs?|expenses?)$/, /^wages( and salaries)?$/],expense:true},
 {concept:"selling_and_distribution_expense",patterns:[/^(selling|distribution|selling and distribution)( costs?| expenses?)$/],expense:true},
 {concept:"general_and_administrative_expense",patterns:[/^(general and administrative|administrative)( costs?| expenses?)$/, /^g and a$/],expense:true},
 {concept:"research_and_development_expense",patterns:[/^(research and development|r and d)( costs?| expenses?)$/],expense:true},
 {concept:"depreciation_and_amortization",patterns:[/^(depreciation( and amorti[sz]ation)?|amorti[sz]ation)( costs?| expenses?)?$/],expense:true},
 {concept:"impairment_expense",patterns:[/^impairment( losses?| charges?| expenses?)?$/],expense:true},
 {concept:"total_operating_expense",patterns:[/^total operating (costs?|expenses?)$/],roles:["subtotal","total"]},
 {concept:"operating_profit",patterns:[/^operating (profit|income|result)$/],roles:["subtotal","total"]}, {concept:"operating_loss",patterns:[/^operating loss$/]},
 {concept:"ebitda",patterns:[/^ebitda$/]}, {concept:"ebit",patterns:[/^ebit$/]},
 {concept:"finance_income",patterns:[/^financ(e|ial) income$/]}, {concept:"finance_cost",patterns:[/^financ(e|ing) (costs?|expenses?)$/],expense:true},
 {concept:"interest_income",patterns:[/^interest income$/]}, {concept:"interest_expense",patterns:[/^interest (costs?|expenses?)$/],expense:true}, {concept:"net_finance_result",patterns:[/^net financ(e|ial) (result|income|costs?)$/]},
 {concept:"profit_before_tax",patterns:[/^(profit|income|earnings) before (income )?tax(es)?$/]}, {concept:"loss_before_tax",patterns:[/^loss before (income )?tax(es)?$/]},
 {concept:"current_tax",patterns:[/^current (income )?tax(es)?$/],expense:true}, {concept:"deferred_tax",patterns:[/^deferred (income )?tax(es)?$/],expense:true}, {concept:"income_tax_expense",patterns:[/^(total )?(income )?tax (expense|benefit|charge)$/],expense:true},
 {concept:"continuing_operations",patterns:[/^(profit|loss|income) from continuing operations$/]}, {concept:"discontinued_operations",patterns:[/^(profit|loss|income) from discontinued operations$/]},
 {concept:"net_income",patterns:[/^(net )?(profit|income|earnings)( for the (year|period))?$/]}, {concept:"net_loss",patterns:[/^(net )?loss( for the (year|period))?$/]},
 {concept:"attributable_to_owners",patterns:[/^(profit|loss) attributable to (owners|shareholders|equity holders)( of the parent)?$/]}, {concept:"non_controlling_interests",patterns:[/^(profit|loss) attributable to non controlling interests$/]},
];
export const normalizeAccountingLabel=(s:string)=>s.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").trim();
export function rankMappingCandidates(input:{label:string;role:RowRole;isSubtotal?:boolean;equationSupport?:Partial<Record<CanonicalConcept,number>>;sign?:"positive"|"negative"|"mixed";contextConcepts?:CanonicalConcept[];history?:CanonicalConcept[]}) : MappingDecision {
 const normalized=normalizeAccountingLabel(input.label), candidates:MappingCandidate[]=[];
 for(const entry of entries){const lexical=entry.patterns.some(p=>p.test(normalized))?1:0;if(!lexical&&!input.equationSupport?.[entry.concept]&&!input.history?.includes(entry.concept))continue;const structural=entry.roles?(entry.roles.includes(input.role)?1:0):(["financial_line","subtotal","total"].includes(input.role)?.8:.3);const equation=input.equationSupport?.[entry.concept]??0;const sign=entry.expense&&input.sign==="positive"?.75:1;const contextual=input.contextConcepts?.length?.6:.5;const historical=input.history?.includes(entry.concept)?1:0;const contradiction=Boolean(entry.roles&&!entry.roles.includes(input.role));const w=MAPPING_POLICY.weights;const combined=lexical*w.semantic+structural*w.structural+equation*w.equation+sign*w.sign+contextual*w.context+historical*w.history-(contradiction?MAPPING_POLICY.contradictionPenalty:0);candidates.push({concept:entry.concept,semanticScore:lexical,structuralScore:structural,equationConsistencyScore:equation,signConsistencyScore:sign,contextualScore:contextual,historicalContextScore:historical,combinedConfidence:Math.max(0,Math.min(1,combined)),explanation:`Ontology ${lexical?"matched":"proposed"}; structure ${structural.toFixed(2)}; equation ${equation.toFixed(2)}.`,evidenceReferences:[`label:${normalized}`,`role:${input.role}`],contradictions:contradiction?[`Concept expects ${entry.roles!.join(" or ")} role.`]:[]})}
 candidates.sort((a,b)=>b.combinedConfidence-a.combinedConfidence);const top=candidates[0];const band=!top?"low":top.contradictions.length?"contradictory":top.combinedConfidence>=MAPPING_POLICY.high?"high":top.combinedConfidence>=MAPPING_POLICY.medium?"medium":"low";return{band,selected:band==="high"?top.concept:null,candidates};
}
