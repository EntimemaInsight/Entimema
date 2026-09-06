import {createConfiguredResponse,type OpenAIRequestDiagnostics,type OpenAITransport} from "../../lib/openai";
import {AgentError} from "../../lib/errors";
import {CANONICAL_CONCEPTS,type CanonicalConcept,type Period,type RowRole,type SourceRow} from "../schema";

export const SEMANTIC_RESOLVER_CONTRACT_VERSION="semantic-resolver.v2" as const;
export type SemanticRequest={statementType:"income_statement";sourceLabel:string;normalizedLabel:string;rowRole:RowRole;neighbourLabels:string[];hierarchy:string[];candidateConcepts:CanonicalConcept[];signPattern:"positive"|"negative"|"mixed";relationshipConstraints:string[];currency:string|null;scale:number|null};
export type SemanticResponse={concept:CanonicalConcept|null;confidence:number;provider:string|null;model:string|null;contractVersion:typeof SEMANTIC_RESOLVER_CONTRACT_VERSION;fallbackReason:string|null};
export type SemanticProvider=(request:Readonly<SemanticRequest>)=>Promise<unknown>;
export async function resolveBoundedSemantic(request:SemanticRequest,provider?:SemanticProvider):Promise<SemanticResponse>{const unresolved=(reason:string):SemanticResponse=>({concept:null,confidence:0,provider:null,model:null,contractVersion:SEMANTIC_RESOLVER_CONTRACT_VERSION,fallbackReason:reason});if(!provider)return unresolved("provider_unavailable");try{const raw=await provider(Object.freeze({...request,candidateConcepts:[...request.candidateConcepts]}));if(!raw||typeof raw!=="object")return unresolved("invalid_output");const x=raw as Record<string,unknown>;if(typeof x.concept!=="string"||!request.candidateConcepts.includes(x.concept as CanonicalConcept)||!(CANONICAL_CONCEPTS as readonly string[]).includes(x.concept)||typeof x.confidence!=="number"||x.confidence<0||x.confidence>1)return unresolved("invalid_output");return{concept:x.concept as CanonicalConcept,confidence:x.confidence,provider:typeof x.provider==="string"?x.provider:"configured",model:typeof x.model==="string"?x.model:null,contractVersion:SEMANTIC_RESOLVER_CONTRACT_VERSION,fallbackReason:null}}catch{return unresolved("provider_error")}}

export type StatementSection="header"|"metadata"|"p_and_l"|"oci"|"total_comprehensive_income"|"attribution"|"unresolved";
export type StatementResolution={title:string|null;currency:string|null;scale:number|null;rows:Array<{rowNumber:number;section:StatementSection;role:RowRole;concept:CanonicalConcept|null;confidence:number;supportingEvidence:string[];contradictions:string[]}>;provider:"openai";model:string;resolverVersion:string};
export type SemanticContextRow={rowNumber:number;label:string;role:RowRole;indentation:number;parentRowNumber:number|null;section:StatementSection;mappingState:"semantic_work"|"deterministic"|"structural"};
export type WholeStatementInput={title:string|null;rows:SourceRow[];contextRows?:SemanticContextRow[];fullStatementRowCount?:number;periods:Period[];currency:string|null;scale:number|null;candidates:Record<number,CanonicalConcept[]>;signPatterns:Record<number,"positive"|"negative"|"mixed">;relationships:string[]};

const positive=(value:string|undefined,fallback:number,max:number)=>{const n=Number(value);return Number.isInteger(n)&&n>0?Math.min(n,max):fallback};
export function getFinancialResolverConfig(){const apiKey=process.env.OPENAI_API_KEY?.trim(),model=process.env.FINANCIAL_SEMANTIC_MODEL?.trim();const requested=process.env.FINANCIAL_SEMANTIC_RESOLVER_ENABLED==="true";return{requested,enabled:requested&&Boolean(apiKey&&model),apiKey,model:model||null,resolverVersion:process.env.FINANCIAL_SEMANTIC_RESOLVER_VERSION?.trim()||"2026-09-04",timeoutMs:positive(process.env.FINANCIAL_SEMANTIC_TIMEOUT_MS,45_000,60_000),attempts:positive(process.env.FINANCIAL_SEMANTIC_MAX_ATTEMPTS,1,3),maxRows:positive(process.env.FINANCIAL_SEMANTIC_MAX_ROWS,120,200),maxContextChars:positive(process.env.FINANCIAL_SEMANTIC_MAX_CONTEXT_CHARS,32_000,60_000),acceptanceThreshold:.68}};
const schema={type:"object",additionalProperties:false,required:["title","currency","scale","rows"],properties:{title:{type:["string","null"]},currency:{type:["string","null"],pattern:"^[A-Z]{3}$"},scale:{type:["number","null"],enum:[null,1,1000,1000000]},rows:{type:"array",items:{type:"object",additionalProperties:false,required:["rowNumber","section","role","concept","confidence","supportingEvidence","contradictions"],properties:{rowNumber:{type:"integer"},section:{type:"string",enum:["header","metadata","p_and_l","oci","total_comprehensive_income","attribution","unresolved"]},role:{type:"string",enum:["title","subtitle","metadata","period_header","financial_line","subtotal","total","spacer","note","unknown"]},concept:{type:["string","null"],enum:[...CANONICAL_CONCEPTS,null]},confidence:{type:"number",minimum:0,maximum:1},supportingEvidence:{type:"array",maxItems:5,items:{type:"string",maxLength:160}},contradictions:{type:"array",maxItems:5,items:{type:"string",maxLength:160}}}}}}} as const;
export type ResolverParseDiagnostics={classificationsReturned:number;proposalsReturned:number;schemaRejected:number;allowlistRejected:number;semanticWorksetRows:number;contextRows:number;excludedBeforeInference:number;candidateSetCount:number;estimatedInputTokens:number;requestPayloadChars:number;maxOutputTokens:number;attemptCount:number;attemptDurationsMs:number[];providerStatusClass:string|null;providerErrorCode:string|null;timeoutTriggered:boolean};
const sections=new Set<StatementSection>(["header","metadata","p_and_l","oci","total_comprehensive_income","attribution","unresolved"]),roles=new Set<RowRole>(["title","subtitle","metadata","period_header","financial_line","subtotal","total","spacer","note","unknown"]);
const exactKeys=(value:Record<string,unknown>,expected:string[])=>{const keys=Object.keys(value);return keys.length===expected.length&&expected.every(key=>keys.includes(key))};
export async function resolveWholeStatement(
  input: WholeStatementInput,
  injected?: OpenAITransport,
): Promise<{
  resolution: StatementResolution | null;
  reason: string | null;
  invoked: boolean;
  durationMs: number;
  diagnostics: ResolverParseDiagnostics;
}> {
  const config = getFinancialResolverConfig(),
    started = performance.now(),
    transportDiagnostics: OpenAIRequestDiagnostics = {
      attemptCount: 0,
      attemptDurationsMs: [],
      providerStatusClass: null,
      providerErrorCode: null,
      timeoutTriggered: false,
    };
  const base = {
      classificationsReturned: 0,
      proposalsReturned: 0,
      schemaRejected: 0,
      allowlistRejected: 0,
      semanticWorksetRows: input.rows.length,
      contextRows: input.contextRows?.length ?? input.rows.length,
      excludedBeforeInference: Math.max(0, (input.fullStatementRowCount ?? input.rows.length) - input.rows.length),
      candidateSetCount: 0,
      estimatedInputTokens: 0,
      requestPayloadChars: 0,
      maxOutputTokens: 5000,
      ...transportDiagnostics,
    },
    done = (
      resolution: StatementResolution | null,
      reason: string | null,
      invoked: boolean,
      diagnostics: ResolverParseDiagnostics = base,
    ) => ({
      resolution,
      reason,
      invoked,
      durationMs: Math.round(performance.now() - started),
      diagnostics,
    });
  if (!config.requested) return done(null, "feature_disabled", false);
  if (!config.enabled || !config.apiKey || !config.model)
    return done(null, "provider_unavailable", false);
  const candidateSets: CanonicalConcept[][] = [],
    candidateSetIds = new Map<string, number>();
  const sourceRows = input.rows.slice(0, config.maxRows);
  if (!sourceRows.length)
    return done(
      {title:input.title,currency:input.currency,scale:input.scale,rows:[],provider:"openai",model:config.model,resolverVersion:config.resolverVersion},
      null,
      false,
      base,
    );
  const
    rows = sourceRows.map((row) => {
      const candidates = input.candidates[row.rowNumber] ?? [],
        key = candidates.join("\u0000");
      let candidateSetId = candidateSetIds.get(key);
      if (candidateSetId === undefined) {
        candidateSetId = candidateSets.length;
        candidateSetIds.set(key, candidateSetId);
        candidateSets.push(candidates);
      }
      return {
        rowNumber: row.rowNumber,
        label: row.label.slice(0, 240),
        role: row.role,
        indentation: row.indentation ?? 0,
        parentRowNumber: row.parentRowNumber ?? null,
        candidateSetId,
        signPattern: input.signPatterns[row.rowNumber] ?? "mixed",
      };
    });
  const payload = JSON.stringify({
    statementTitle: input.title,
    candidateSets,
    semanticRows: rows,
    statementContext: input.contextRows ?? input.rows.map(row=>({rowNumber:row.rowNumber,label:row.label,role:row.role})),
    periods: input.periods.map((p) => ({
      header: p.originalHeader,
      type: p.type,
      designation: p.designation,
    })),
    currencyEvidence: input.currency,
    scaleEvidence: input.scale,
    deterministicRelationships: input.relationships,
  });
  const measured = (): ResolverParseDiagnostics => ({
    ...base,
    ...transportDiagnostics,
    semanticWorksetRows: sourceRows.length,
    excludedBeforeInference: Math.max(0,(input.fullStatementRowCount??input.rows.length)-sourceRows.length),
    candidateSetCount: candidateSets.length,
    estimatedInputTokens: Math.ceil(payload.length / 4),
    requestPayloadChars: payload.length,
  });
  if (payload.length > config.maxContextChars)
    return done(null, "invalid_request", false, measured());
  try {
    const response = await createConfiguredResponse(
      {
        model: config.model,
        store: false,
        instructions:
          "Interpret only semanticRows using the ordered statementContext for whole-statement meaning. Each semantic row's candidateSetId indexes candidateSets; select concepts only from that set and return exactly one result per semantic row. Deterministic and structural context rows are context, not classification work. Respect the supplied section boundaries. Return null rather than guess. Currency and scale require explicit document evidence. Never alter values, periods, evidence, validation or readiness.",
        input: payload,
        max_output_tokens: 5000,
        text: {
          format: {
            type: "json_schema",
            name: "income_statement_interpretation",
            strict: true,
            schema,
          },
        },
      },
      {
        apiKey: config.apiKey,
        timeoutMs: config.timeoutMs,
        attempts: config.attempts,
        diagnostics: transportDiagnostics,
      },
      injected,
    );
    if (response.status !== "completed")
      return done(null, "incomplete", true, measured());
    const raw = JSON.parse(response.output_text) as Record<string, unknown>,
      rawRows = Array.isArray(raw.rows) ? raw.rows : [],
      permitted = new Map(
        sourceRows.map((r) => [
          r.rowNumber,
          new Set(input.candidates[r.rowNumber] ?? []),
        ]),
      );
    const topLevelValid =
      exactKeys(raw,["title","currency","scale","rows"]) &&
      (typeof raw.title === "string" || raw.title === null) &&
      (raw.currency === null || typeof raw.currency === "string" && /^[A-Z]{3}$/.test(raw.currency)) &&
      (raw.scale === null || [1,1000,1000000].includes(raw.scale as number)) &&
      Array.isArray(raw.rows);
    let schemaRejected = topLevelValid ? 0 : 1,
      allowlistRejected = 0,
      proposalsReturned = 0;
    const accepted: StatementResolution["rows"] = [];
    const returnedRowNumbers = new Set<number>();
    for (const item of rawRows) {
      if (!item || typeof item !== "object") {
        schemaRejected++;
        continue;
      }
      const r = item as Record<string, unknown>;
      if (typeof r.concept === "string") proposalsReturned++;
      const structurallyValid =
        exactKeys(r,["rowNumber","section","role","concept","confidence","supportingEvidence","contradictions"]) &&
        Number.isInteger(r.rowNumber) &&
        sections.has(r.section as StatementSection) &&
        roles.has(r.role as RowRole) &&
        (r.concept === null || typeof r.concept === "string") &&
        typeof r.confidence === "number" &&
        r.confidence >= 0 &&
        r.confidence <= 1 &&
        Array.isArray(r.supportingEvidence) &&
        Array.isArray(r.contradictions) &&
        r.supportingEvidence.length<=5 &&
        r.contradictions.length<=5 &&
        r.supportingEvidence.every((x) => typeof x === "string"&&x.length<=160) &&
        r.contradictions.every((x) => typeof x === "string"&&x.length<=160);
      if (!structurallyValid || !permitted.has(r.rowNumber as number) || returnedRowNumbers.has(r.rowNumber as number)) {
        schemaRejected++;
        continue;
      }
      returnedRowNumbers.add(r.rowNumber as number);
      if (
        r.concept !== null &&
        !permitted
          .get(r.rowNumber as number)!
          .has(r.concept as CanonicalConcept)
      ) {
        allowlistRejected++;
        continue;
      }
      accepted.push(r as StatementResolution["rows"][number]);
    }
    if (returnedRowNumbers.size !== sourceRows.length)
      schemaRejected += Math.abs(sourceRows.length - returnedRowNumbers.size);
    const diagnostics = {
      ...measured(),
      classificationsReturned: rawRows.length,
      proposalsReturned,
      schemaRejected,
      allowlistRejected,
    };
    if (schemaRejected || allowlistRejected)
      return done(null, "invalid_output", true, diagnostics);
    return done(
      {
        title: typeof raw.title === "string" ? raw.title : null,
        currency: typeof raw.currency === "string" ? raw.currency : null,
        scale: typeof raw.scale === "number" ? raw.scale : null,
        rows: accepted,
        provider: "openai",
        model: config.model,
        resolverVersion: config.resolverVersion,
      },
      null,
      true,
      diagnostics,
    );
  } catch (error) {
    const code = error instanceof AgentError ? error.code : null,
      reason =
        code === "OPENAI_TIMEOUT"
          ? "timeout"
          : code === "OPENAI_RATE_LIMIT"
            ? "rate_limit"
            : code === "MODEL_SERVICE_UNAVAILABLE"
              ? "provider_unavailable"
              : code === "CLASSIFICATION_FAILED"
                ? "invalid_request"
                : "provider_error";
    return done(null, reason, true, measured());
  }
}
