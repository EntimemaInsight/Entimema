import { CANONICAL_CONCEPTS,type CanonicalConcept } from "./schema";

export type MappingProposal={label:string;concept:CanonicalConcept;confidence:number;explanation:string;ambiguous:boolean};
export type MappingAssistant=(labels:string[])=>Promise<unknown>;

/** Bounded semantic fallback: labels in, allowlisted proposals out. Values, periods and evidence never enter this boundary. */
export async function proposeAmbiguousMappings(labels:string[],assistant?:MappingAssistant):Promise<{proposals:MappingProposal[];failed:boolean}>{
  const unique=[...new Set(labels.map(x=>x.trim()).filter(Boolean))].slice(0,50);
  if(!assistant||!unique.length)return{proposals:[],failed:Boolean(unique.length)};
  try{const raw=await assistant(unique);if(!Array.isArray(raw))return{proposals:[],failed:true};const proposals:MappingProposal[]=[];for(const item of raw){if(typeof item!=="object"||item===null)continue;const x=item as Record<string,unknown>;if(!unique.includes(String(x.label))||!(CANONICAL_CONCEPTS as readonly unknown[]).includes(x.concept)||typeof x.explanation!=="string"||x.explanation.length>500||typeof x.confidence!=="number"||x.confidence<0||x.confidence>1||typeof x.ambiguous!=="boolean")continue;proposals.push({label:String(x.label),concept:x.concept as CanonicalConcept,confidence:x.confidence,explanation:x.explanation,ambiguous:x.ambiguous})}return{proposals,failed:proposals.length!==unique.length}}catch{return{proposals:[],failed:true}}
}
