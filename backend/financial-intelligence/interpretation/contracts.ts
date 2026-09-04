import type { CanonicalConcept, PeriodType, RowRole } from "../schema";

export const SUPPORTED_DOCUMENT_POLICY_VERSION = "income-statement-support.v1" as const;
export const SUPPORTED_DOCUMENT_POLICY = {
  languages: ["en"], formats: [".xlsx", ".xlsm", ".csv", ".pdf"],
  pdf: "text-based-only", periods: ["month", "quarter", "year", "comparative"],
} as const;

export type ObservedCell = { row:number; column:number; raw:unknown; text:string; formula?:string; numberFormat?:string; styleId?:number; indentation:number; mergedRange?:string; evidenceHash:string };
export type ObservedRegion = { id:string; name:string; kind:"sheet"|"page"; index:number; cells:ObservedCell[]; headings:string[]; bounds:{startRow:number;endRow:number;startColumn:number;endColumn:number} };
export type ObservedDocument = { contractVersion:"observed-document.v1"; filename:string; format:"xlsx"|"xlsm"|"csv"|"pdf"; regions:ObservedRegion[]; contentHash:string; extraction:{adapter:string; textReliable:boolean; warnings:string[]} };
export type StructuralRow = { id:string; sourceRow:number; labelColumn:number; label:string; role:RowRole; indentation:number; parentId:null|string; numericColumns:number[] };
export type PeriodHypothesis = { sourceColumn:number; rawHeader:string; type:PeriodType; confidence:number; accepted:boolean; evidence:string[]; rejectionReason?:string };
export type MappingCandidate = { concept:CanonicalConcept; semanticScore:number; structuralScore:number; equationConsistencyScore:number; signConsistencyScore:number; contextualScore:number; historicalContextScore:number; combinedConfidence:number; explanation:string; evidenceReferences:string[]; contradictions:string[] };
export type MappingDecision = { band:"high"|"medium"|"low"|"contradictory"; selected:CanonicalConcept|null; candidates:MappingCandidate[] };
