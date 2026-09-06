import { randomUUID } from "node:crypto";
import type { InspectedDocument } from "../lib/files";
import {
  hydrateUnderstanding,
  understandFinancials,
  type FinancialUnderstandingTelemetry,
} from "./financial-understanding";
import { withFinancialRunIntegrity } from "./run";
import {
  CANONICAL_INCOME_STATEMENT_VERSION,
  type FinancialRun,
  type ReviewReason,
  type ReviewTask,
} from "./schema";
import { buildFinancialSourceRepresentation } from "./structural-representation";
import { evaluateReadiness, summarizeValidation, validate } from "./validation";

export type AiNativeExecutionFailureCode =
  | "FI_SOURCE_READ_FAILURE"
  | "FI_UNDERSTANDING_PROVIDER_FAILURE"
  | "FI_UNDERSTANDING_TIMEOUT"
  | "FI_UNDERSTANDING_SCHEMA_FAILURE"
  | "FI_CONTRACT_BUILD_FAILURE"
  | "FI_VALIDATION_FAILURE";

export type AiNativeExecutionStage =
  | "source_read"
  | "financial_understanding"
  | "contract_build"
  | "validation";

export class AiNativeExecutionError extends Error {
  constructor(
    public readonly failureCode: AiNativeExecutionFailureCode,
    public readonly failureStage: AiNativeExecutionStage,
    public readonly telemetry: Record<string, unknown>,
    public readonly cause: unknown,
  ) {
    super(failureCode);
    this.name = "AiNativeExecutionError";
  }
}

const understandingFailureCode = (error: unknown): AiNativeExecutionFailureCode => {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : error instanceof Error
        ? error.message
        : "";
  if (code === "OPENAI_TIMEOUT") return "FI_UNDERSTANDING_TIMEOUT";
  if (
    code === "INVALID_FINANCIAL_UNDERSTANDING_OUTPUT" ||
    code === "OPENAI_RESPONSE_INVALID" ||
    error instanceof SyntaxError
  ) {
    return "FI_UNDERSTANDING_SCHEMA_FAILURE";
  }
  return "FI_UNDERSTANDING_PROVIDER_FAILURE";
};

function reviewTasksFor(run: Pick<FinancialRun, "values" | "controls" | "currency" | "unitScale">): ReviewTask[] {
  const tasks: ReviewTask[] = [];
  const byRow = new Map<string, FinancialRun["values"]>();

  for (const value of run.values.filter((item) => item.section === "p_and_l" && item.reviewState === "required")) {
    byRow.set(value.sourceRowId, [...(byRow.get(value.sourceRowId) ?? []), value]);
  }

  for (const [sourceRowId, values] of byRow) {
    const value = values[0];
    const reason: ReviewReason =
      value.concept === "other_reported_line" ? "NO_SEMANTIC_PROPOSAL" : "LOW_CONFIDENCE";
    tasks.push({
      id: `review-mapping-${sourceRowId}`,
      groupKey: `mapping:${sourceRowId}`,
      issueType: "low_confidence_mapping",
      valueId: value.id,
      sourceRowId,
      sourceLabel: value.sourceLabel,
      sourceValue: null,
      proposedConcept: value.concept === "other_reported_line" ? null : value.concept,
      confidence: value.semanticConfidence ?? value.mappingConfidence,
      evidenceId: value.evidenceId,
      controlIds: [],
      recommendedAction: "Resolve this material semantic ambiguity before validation can complete.",
      material: true,
      state: "open",
      reason,
      supportingEvidence: value.evidenceReferences,
      confidenceComponents: {
        semantic: value.semanticConfidence ?? 0,
        structural: value.structuralConfidence ?? 1,
        sign: value.signConsistency ?? 1,
      },
    });
  }

  if (run.values.length && !run.currency) {
    tasks.push({
      id: "review-currency",
      groupKey: "currency",
      issueType: "unknown_currency",
      valueId: null,
      sourceRowId: null,
      sourceLabel: "Reporting currency",
      sourceValue: null,
      proposedConcept: null,
      confidence: 0,
      evidenceId: null,
      controlIds: [],
      recommendedAction: "Confirm reporting currency only if the source does not state it unambiguously.",
      material: true,
      state: "open",
      reason: "CURRENCY_AMBIGUITY",
    });
  }

  if (run.values.length && !run.unitScale) {
    tasks.push({
      id: "review-scale",
      groupKey: "scale",
      issueType: "unknown_scale",
      valueId: null,
      sourceRowId: null,
      sourceLabel: "Unit scale",
      sourceValue: null,
      proposedConcept: null,
      confidence: 0,
      evidenceId: null,
      controlIds: [],
      recommendedAction: "Confirm units, thousands, or millions only if the source is genuinely ambiguous.",
      material: true,
      state: "open",
      reason: "SCALE_AMBIGUITY",
    });
  }

  for (const control of run.controls.filter((item) => item.reviewRequired)) {
    tasks.push({
      id: `review-${control.id}`,
      groupKey: `control:${control.id}`,
      issueType:
        control.id === "duplicate-mapping"
          ? "duplicate_mapping"
          : control.id === "evidence-completeness"
            ? "missing_evidence"
            : "failed_reconciliation",
      valueId: null,
      sourceRowId: null,
      sourceLabel: control.formula,
      sourceValue: control.reportedValue,
      proposedConcept: null,
      confidence: 0,
      evidenceId: control.affectedEvidence[0] ?? null,
      controlIds: [control.id],
      recommendedAction: "Inspect the source evidence and deterministic reconciliation.",
      material: true,
      state: "open",
      reason: "OTHER",
    });
  }

  return tasks;
}

function finalize(run: FinancialRun): FinancialRun {
  const validationSummary = summarizeValidation(run.controls, run.periods.length);
  let reviewTasks = reviewTasksFor(run);
  let readiness = evaluateReadiness({
    selected: Boolean(run.source.selectedSection),
    statementConfidence: 1,
    periods: run.periods,
    values: run.values,
    evidence: run.evidence,
    currency: run.currency,
    unitScale: run.unitScale,
    controls: run.controls,
    tasks: reviewTasks,
  });

  if (!readiness.gates.coverage) {
    reviewTasks = [
      ...reviewTasks,
      {
        id: "review-validation-coverage",
        groupKey: "validation-coverage",
        issueType: "unsupported_structure",
        valueId: null,
        sourceRowId: null,
        sourceLabel: "Validation coverage",
        sourceValue: null,
        proposedConcept: null,
        confidence: validationSummary.coverage,
        evidenceId: null,
        controlIds: [],
        recommendedAction: "Resolve only the missing material anchor needed by deterministic controls.",
        material: true,
        state: "open",
        reason: "OTHER",
      },
    ];
    readiness = evaluateReadiness({
      selected: Boolean(run.source.selectedSection),
      statementConfidence: 1,
      periods: run.periods,
      values: run.values,
      evidence: run.evidence,
      currency: run.currency,
      unitScale: run.unitScale,
      controls: run.controls,
      tasks: reviewTasks,
    });
  }

  const pAndLRows = new Set(run.values.filter((value) => value.section === "p_and_l").map((value) => value.sourceRowId));
  const mappedRows = new Set(
    run.values
      .filter((value) => value.section === "p_and_l" && value.concept !== "other_reported_line")
      .map((value) => value.sourceRowId),
  );
  const excludedRows = new Set(
    run.values.filter((value) => value.section && value.section !== "p_and_l").map((value) => value.sourceRowId),
  );
  const openTasks = reviewTasks.filter((task) => task.state === "open");
  const reviewTasksByReason = openTasks.reduce<Partial<Record<ReviewReason, number>>>((counts, task) => {
    const reason = task.reason ?? "OTHER";
    counts[reason] = (counts[reason] ?? 0) + 1;
    return counts;
  }, {});
  const canonicalMapping = pAndLRows.size ? mappedRows.size / pAndLRows.size : 0;
  const confidences = run.values.filter((value) => value.section === "p_and_l").map((value) => value.mappingConfidence);

  const completed: FinancialRun = {
    ...run,
    status: readiness.status,
    readiness,
    validationSummary,
    reviewTasks,
    metrics: {
      financialSourceRows: pAndLRows.size,
      canonicalMappedRows: mappedRows.size,
      automaticallyMappedRows: mappedRows.size,
      unresolvedPAndLRows: pAndLRows.size - mappedRows.size,
      excludedNonPAndLRows: excludedRows.size,
      extractedValues: run.values.length,
      periods: run.periods.length,
      reviewTasks: openTasks.length,
      reviewTasksByReason,
      acceptedSemanticMappings: mappedRows.size,
      deterministicMappings: 0,
      vetoCounts: {},
      mappingCoverage: canonicalMapping,
    },
    confidence: {
      statementDetection: 1,
      periodDetection: run.periods.length ? 1 : 0,
      currencyDetection: run.currency ? 1 : 0,
      scaleDetection: run.unitScale ? 1 : 0,
      sourceValueExtraction: run.values.length ? 1 : 0,
      canonicalMapping,
      evidenceCompleteness: run.values.every((value) => run.evidence.some((item) => item.id === value.evidenceId)) ? 1 : 0,
      deterministicReconciliation: validationSummary.coverage * validationSummary.passRate,
    },
    workflow: [
      { id: "upload", label: "Upload", state: "completed" },
      { id: "understanding", label: "Understanding financials", state: "completed" },
      {
        id: "validation",
        label: "Validating",
        state: validationSummary.failed ? "warning" : "completed",
      },
      {
        id: "review",
        label: "Review if needed",
        state: openTasks.length ? "review_required" : "completed",
      },
      {
        id: "result",
        label: "Analysis ready",
        state: readiness.status === "validated" ? "completed" : "idle",
      },
    ],
  };

  void confidences;
  return withFinancialRunIntegrity(completed);
}

export async function runAiNativeFinancialIntelligence(document: InspectedDocument): Promise<FinancialRun> {
  const totalStarted = performance.now();
  const telemetry: Record<string, unknown> = {
    executionPathVersion: "financial-understanding.v2",
    sourceReadMs: 0,
    financialUnderstandingInvoked: false,
    financialUnderstandingMs: 0,
    validationMs: 0,
    totalExecutionMs: 0,
    sourceContainers: 0,
    structuralRows: 0,
    financialLinesReturned: 0,
    periodsReturned: 0,
    model: process.env.FINANCIAL_UNDERSTANDING_MODEL?.trim() || process.env.FINANCIAL_SEMANTIC_MODEL?.trim() || null,
  };

  const sourceStarted = performance.now();
  let structure;
  try {
    structure = await buildFinancialSourceRepresentation(document);
    Object.assign(telemetry, {
      sourceReadMs: Math.round(performance.now() - sourceStarted),
      sourceContainers: structure.stats.workbookSheets,
      structuralRows: structure.stats.structuralRows,
    });
  } catch (error) {
    telemetry.totalExecutionMs = Math.round(performance.now() - totalStarted);
    throw new AiNativeExecutionError("FI_SOURCE_READ_FAILURE", "source_read", telemetry, error);
  }

  let understanding;
  try {
    understanding = await understandFinancials(structure);
    Object.assign(telemetry, {
      financialUnderstandingInvoked: understanding.modelCalls > 0,
      financialUnderstandingMs: understanding.durationMs,
      financialLinesReturned: understanding.result.financialLines.length,
      periodsReturned: understanding.result.periods.length,
      model: understanding.model,
      requestPayloadChars: understanding.requestPayloadChars,
      estimatedInputTokens: understanding.estimatedInputTokens,
      outputTokens: understanding.outputTokens,
    });
  } catch (error) {
    telemetry.totalExecutionMs = Math.round(performance.now() - totalStarted);
    throw new AiNativeExecutionError(understandingFailureCode(error), "financial_understanding", telemetry, error);
  }

  let extracted;
  try {
    extracted = hydrateUnderstanding(document, structure, understanding.result);
  } catch (error) {
    telemetry.totalExecutionMs = Math.round(performance.now() - totalStarted);
    throw new AiNativeExecutionError("FI_CONTRACT_BUILD_FAILURE", "contract_build", telemetry, error);
  }

  const evidence = extracted.evidence.map((item) => ({
    ...item,
    kind: document.extension === ".pdf" ? ("pdf" as const) : document.extension === ".csv" ? ("csv" as const) : ("spreadsheet" as const),
  }));

  const validationStarted = performance.now();
  let controls;
  try {
    controls = validate(extracted.values, evidence, extracted.scale);
    telemetry.validationMs = Math.round(performance.now() - validationStarted);
  } catch (error) {
    telemetry.validationMs = Math.round(performance.now() - validationStarted);
    telemetry.totalExecutionMs = Math.round(performance.now() - totalStarted);
    throw new AiNativeExecutionError("FI_VALIDATION_FAILURE", "validation", telemetry, error);
  }

  telemetry.totalExecutionMs = Math.round(performance.now() - totalStarted);
  const confidences = understanding.result.financialLines.map((line) => line.confidence);
  const understandingTelemetry: FinancialUnderstandingTelemetry = {
    executionPathVersion: "financial-understanding.v2",
    financialUnderstandingInvoked: understanding.modelCalls > 0,
    structuralScanMs: Number(telemetry.sourceReadMs),
    financialUnderstandingMs: understanding.durationMs,
    validationMs: Number(telemetry.validationMs),
    totalExecutionMs: Number(telemetry.totalExecutionMs),
    workbookSheets: structure.stats.workbookSheets,
    structuralRows: structure.stats.structuralRows,
    financialLinesReturned: understanding.result.financialLines.length,
    periodsReturned: understanding.result.periods.length,
    model: understanding.model,
    requestPayloadChars: understanding.requestPayloadChars,
    estimatedInputTokens: understanding.estimatedInputTokens,
    outputTokens: understanding.outputTokens,
    confidenceSummary: {
      minimum: confidences.length ? Math.min(...confidences) : 0,
      average: confidences.length ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length : 0,
    },
    ambiguityCount: understanding.result.ambiguities.length,
    modelCalls: understanding.modelCalls,
    maxOutputTokens: understanding.maxOutputTokens,
  };

  const mappedRows = new Set(
    extracted.values.filter((value) => value.section === "p_and_l" && value.concept !== "other_reported_line").map((value) => value.sourceRowId),
  );
  const pAndLRows = new Set(extracted.values.filter((value) => value.section === "p_and_l").map((value) => value.sourceRowId));
  const sourceColumns = extracted.periods.map((period) => period.sourceColumn);
  const run: FinancialRun = {
    runId: randomUUID(),
    schemaVersion: CANONICAL_INCOME_STATEMENT_VERSION,
    integrity: "",
    status: "processing",
    readiness: { status: "processing", blockers: [], reviewReasons: [], gates: {} },
    validationSummary: summarizeValidation(controls, extracted.periods.length),
    sessionScoped: true,
    classification: {
      source: "ai_financial_understanding",
      document_type: understanding.result.documentType,
      statement_type: understanding.result.statementType,
      entity_name: understanding.result.entityName,
    },
    detectedStatements: ["income_statement"],
    source: {
      filename: document.fileName,
      format: document.extension,
      selectedSection: extracted.selected ?? "Income Statement",
      inventory: structure.sheets.map((sheet) => sheet.name),
    },
    statementCandidates: [],
    periodBoundary: {
      headerRow: null,
      firstAcceptedColumn: sourceColumns.length ? Math.min(...sourceColumns) : null,
      lastAcceptedColumn: sourceColumns.length ? Math.max(...sourceColumns) : null,
      stopReason: "Periods selected exclusively by AI Financial Understanding",
      acceptedColumns: extracted.periods.map((period) => ({
        column: period.sourceColumn,
        address: "",
        header: period.originalHeader,
        type: period.type,
      })),
      rejectedColumns: [],
    },
    resolverTelemetry: {
      requested: true,
      invoked: understanding.modelCalls > 0,
      outcome: "success",
      resolverVersion: "financial-understanding.v2",
      model: understanding.model,
      durationMs: understanding.durationMs,
      rowsSubmitted: understanding.result.financialLines.length,
      semanticWorksetRows: understanding.result.financialLines.length,
      contextRows: structure.stats.structuralRows,
      excludedBeforeInference: understanding.result.excludedContent.length,
      candidateSetCount: 1,
      estimatedInputTokens: understanding.estimatedInputTokens,
      requestPayloadChars: understanding.requestPayloadChars,
      maxOutputTokens: understanding.maxOutputTokens,
      attemptCount: understanding.modelCalls,
      attemptDurationsMs: understanding.modelCalls ? [understanding.durationMs] : [],
      providerStatusClass: null,
      providerErrorCode: null,
      timeoutTriggered: false,
      classificationsReturned: understanding.result.financialLines.length,
      proposedMappings: understanding.result.financialLines.filter((line) => line.canonicalConceptCandidate).length,
      schemaRejectedProposals: 0,
      allowlistRejectedProposals: 0,
      sectionRejectedProposals: 0,
      structuralRejectedProposals: 0,
      confidenceRejectedProposals: understanding.result.financialLines.filter((line) => line.confidence < 0.68).length,
      signRejectedProposals: 0,
      equationRejectedProposals: 0,
      acceptedSemanticMappings: mappedRows.size,
      acceptedDeterministicMappings: 0,
      unresolvedPAndLRows: pAndLRows.size - mappedRows.size,
      acceptedMappings: mappedRows.size,
      rejectedMappings: 0,
      rejectionReasons: {},
      automaticMappingCoverage: pAndLRows.size ? mappedRows.size / pAndLRows.size : 0,
    },
    understandingTelemetry,
    metrics: {
      financialSourceRows: 0,
      canonicalMappedRows: 0,
      automaticallyMappedRows: 0,
      unresolvedPAndLRows: 0,
      excludedNonPAndLRows: 0,
      extractedValues: 0,
      periods: 0,
      reviewTasks: 0,
      reviewTasksByReason: {},
      acceptedSemanticMappings: 0,
      deterministicMappings: 0,
      vetoCounts: {},
      mappingCoverage: 0,
    },
    rows: extracted.rows,
    periods: extracted.periods,
    currency: extracted.currency,
    unitScale: extracted.scale,
    values: extracted.values,
    evidence,
    controls,
    reviewTasks: [],
    confidence: {
      statementDetection: 1,
      periodDetection: extracted.periods.length ? 1 : 0,
      currencyDetection: extracted.currency ? 1 : 0,
      scaleDetection: extracted.scale ? 1 : 0,
      sourceValueExtraction: extracted.values.length ? 1 : 0,
      canonicalMapping: 0,
      evidenceCompleteness: 0,
      deterministicReconciliation: 0,
    },
    workflow: [],
  };

  return finalize(run);
}
