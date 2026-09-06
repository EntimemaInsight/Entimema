import type { FinancialRun, ReviewDecision, ReviewTask } from "./schema";
import { evaluateReadiness, summarizeValidation, validate } from "./validation";
import { hasValidIntegrity, withFinancialRunIntegrity } from "./integrity";

function mappingReviewReason(
  value: FinancialRun["values"][number],
  telemetry?: FinancialRun["resolverTelemetry"],
): ReviewTask["reason"] {
  const reason = value.acceptanceReason;
  if (reason === "equation_contradiction") return "EQUATION_VETO";
  if (
    reason === "not_provisionally_accepted" ||
    reason === "semantic_confidence_below_threshold" ||
    reason === "combined_confidence_below_threshold"
  )
    return "LOW_CONFIDENCE";
  if (reason === "section_incompatible") return "SECTION_VETO";
  if (reason === "structural_incompatible") return "STRUCTURAL_VETO";
  if (reason === "sign_contradiction") return "SIGN_VETO";
  if (reason === "provider_unavailable" || reason === "feature_disabled") return "MODEL_UNAVAILABLE";
  if (reason === "provider_error" || reason === "timeout") return "MODEL_FAILURE";
  if (reason === "invalid_output")
    return telemetry?.allowlistRejectedProposals
      ? "ALLOWLIST_REJECTION"
      : telemetry?.schemaRejectedProposals
        ? "SCHEMA_REJECTION"
        : "MODEL_FAILURE";
  if (reason === "unresolved") return "NO_SEMANTIC_PROPOSAL";
  return "OTHER";
}

export function buildReviewTasks(
  run: Pick<
    FinancialRun,
    "periods" | "values" | "controls" | "currency" | "unitScale" | "resolverTelemetry"
  >,
  selected: boolean,
  imageOnly = false,
): ReviewTask[] {
  const tasks: ReviewTask[] = [];
  const add = (task: ReviewTask) => tasks.push(task);

  if (imageOnly)
    add({
      id: "review-image",
      groupKey: "structure:image",
      issueType: "image_only_pdf",
      valueId: null,
      sourceRowId: null,
      sourceLabel: "Image-only PDF",
      sourceValue: null,
      proposedConcept: null,
      confidence: 0,
      evidenceId: null,
      controlIds: [],
      recommendedAction: "Provide a text-based PDF or spreadsheet. OCR is not enabled.",
      material: true,
      state: "open",
      reason: "OTHER",
    });

  if (!selected)
    add({
      id: "review-statement",
      groupKey: "statement",
      issueType: "ambiguous_statement",
      valueId: null,
      sourceRowId: null,
      sourceLabel: "Income Statement section",
      sourceValue: null,
      proposedConcept: null,
      confidence: 0,
      evidenceId: null,
      controlIds: [],
      recommendedAction: "Provide a clearly labelled English Income Statement.",
      material: true,
      state: "open",
      reason: "OTHER",
    });

  const unknownPeriods = run.periods.filter((period) => period.reviewRequired);
  if (unknownPeriods.length)
    add({
      id: "review-periods",
      groupKey: "periods",
      issueType: "ambiguous_period",
      valueId: null,
      sourceRowId: null,
      sourceLabel: unknownPeriods.map((period) => period.originalHeader).join(", "),
      sourceValue: null,
      proposedConcept: null,
      confidence: Math.min(...unknownPeriods.map((period) => period.confidence)),
      evidenceId: null,
      controlIds: [],
      recommendedAction: "Confirm or correct these source period headers.",
      material: true,
      state: "open",
      reason: "OTHER",
    });

  const byRow = new Map<string, FinancialRun["values"]>();
  for (const value of run.values.filter((item) => item.reviewState === "required"))
    byRow.set(value.sourceRowId, [...(byRow.get(value.sourceRowId) ?? []), value]);

  for (const [rowId, values] of byRow) {
    const value = values[0];
    add({
      id: `review-mapping-${rowId}`,
      groupKey: `mapping:${rowId}`,
      issueType: "low_confidence_mapping",
      valueId: value.id,
      sourceRowId: rowId,
      sourceLabel: value.sourceLabel,
      sourceValue: null,
      proposedConcept:
        value.originalProposal && value.originalProposal !== "other_reported_line"
          ? value.originalProposal
          : value.concept,
      confidence: value.semanticConfidence ?? value.mappingConfidence,
      evidenceId: value.evidenceId,
      controlIds: [],
      recommendedAction: `Choose one mapping for all ${values.length} period values on this source row.`,
      material: true,
      state: "open",
      reason: mappingReviewReason(value, run.resolverTelemetry),
      supportingEvidence: value.evidenceReferences,
      contradictions: value.contradictions,
      confidenceComponents: {
        semantic: value.semanticConfidence ?? 0,
        structural: value.structuralConfidence ?? 0,
        sign: value.signConsistency ?? 0,
        ...(value.equationConsistency === undefined ? {} : { equation: value.equationConsistency }),
      },
    });
  }

  if (run.values.length && !run.currency)
    add({
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
      recommendedAction: "Confirm the reporting currency.",
      material: true,
      state: "open",
      reason: "CURRENCY_AMBIGUITY",
    });

  if (run.values.length && !run.unitScale)
    add({
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
      recommendedAction: "Confirm units, thousands, or millions.",
      material: true,
      state: "open",
      reason: "SCALE_AMBIGUITY",
    });

  for (const control of run.controls.filter((item) => item.reviewRequired))
    add({
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
      recommendedAction: "Inspect source values and mappings; resolve the failed control.",
      material: true,
      state: "open",
      reason: "OTHER",
    });

  return tasks;
}

export function finalizeReviewedFinancialRun(
  run: FinancialRun,
  reviewTasks: ReviewTask[],
): FinancialRun {
  const validationSummary = summarizeValidation(run.controls, run.periods.length);
  let readiness = evaluateReadiness({
    selected: Boolean(run.source.selectedSection),
    statementConfidence: run.confidence.statementDetection,
    periods: run.periods,
    values: run.values,
    evidence: run.evidence,
    currency: run.currency,
    unitScale: run.unitScale,
    controls: run.controls,
    tasks: reviewTasks,
    unsupported: false,
  });

  if (!readiness.gates.coverage && !reviewTasks.some((task) => task.groupKey === "validation-coverage")) {
    reviewTasks.push({
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
      recommendedAction: "Map or provide the prerequisite anchor lines needed to validate reported profit subtotals.",
      material: true,
      state: "open",
      reason: "OTHER",
    });
    readiness = evaluateReadiness({
      selected: Boolean(run.source.selectedSection),
      statementConfidence: run.confidence.statementDetection,
      periods: run.periods,
      values: run.values,
      evidence: run.evidence,
      currency: run.currency,
      unitScale: run.unitScale,
      controls: run.controls,
      tasks: reviewTasks,
      unsupported: false,
    });
  }

  const pAndLRows = new Set(run.values.filter((value) => value.section === "p_and_l").map((value) => value.sourceRowId));
  const mappedRows = new Set(
    run.values
      .filter((value) => value.section === "p_and_l" && value.concept !== "other_reported_line")
      .map((value) => value.sourceRowId),
  );
  const automaticRows = new Set(
    run.values
      .filter(
        (value) =>
          value.section === "p_and_l" &&
          value.concept !== "other_reported_line" &&
          value.mappingMethod !== "human-validated",
      )
      .map((value) => value.sourceRowId),
  );
  const excludedRows = new Set(
    run.values.filter((value) => value.section && value.section !== "p_and_l").map((value) => value.sourceRowId),
  );
  const openTasks = reviewTasks.filter((task) => task.state === "open");
  const reviewTasksByReason = openTasks.reduce<Partial<Record<NonNullable<ReviewTask["reason"]>, number>>>(
    (counts, task) => {
      const reason = task.reason ?? "OTHER";
      counts[reason] = (counts[reason] ?? 0) + 1;
      return counts;
    },
    {},
  );
  const vetoCounts = Object.fromEntries(
    Object.entries(reviewTasksByReason).filter(([reason]) => reason.endsWith("_VETO")),
  );
  const mappingCoverage = pAndLRows.size ? mappedRows.size / pAndLRows.size : 0;

  const completed: FinancialRun = {
    ...run,
    status: readiness.status,
    readiness,
    validationSummary,
    reviewTasks,
    metrics: {
      financialSourceRows: pAndLRows.size,
      canonicalMappedRows: mappedRows.size,
      automaticallyMappedRows: automaticRows.size,
      unresolvedPAndLRows: pAndLRows.size - mappedRows.size,
      excludedNonPAndLRows: excludedRows.size,
      extractedValues: run.values.length,
      periods: run.periods.length,
      reviewTasks: openTasks.length,
      reviewTasksByReason,
      acceptedSemanticMappings: run.resolverTelemetry.acceptedSemanticMappings,
      deterministicMappings: run.resolverTelemetry.acceptedDeterministicMappings,
      vetoCounts,
      mappingCoverage,
    },
    confidence: {
      ...run.confidence,
      canonicalMapping: mappingCoverage,
      evidenceCompleteness: run.values.every((value) => run.evidence.some((item) => item.id === value.evidenceId)) ? 1 : 0,
      deterministicReconciliation: validationSummary.coverage * validationSummary.passRate,
    },
    workflow: [
      { id: "upload", label: "Upload", state: "completed" },
      { id: "understanding", label: "Understanding financials", state: run.values.length ? "completed" : "warning" },
      { id: "validation", label: "Validating", state: validationSummary.failed ? "warning" : "completed" },
      {
        id: "review",
        label: "Review if needed",
        state: readiness.status === "review_required" || openTasks.length ? "review_required" : "completed",
      },
      { id: "result", label: "Analysis ready", state: readiness.status === "validated" ? "completed" : "idle" },
    ],
  };

  return withFinancialRunIntegrity(completed);
}

export function replayFinancialReview(
  run: FinancialRun,
  decision: ReviewDecision,
  resolution: { actor: string; timestamp: string } = {
    actor: "System",
    timestamp: new Date().toISOString(),
  },
): FinancialRun {
  if (!hasValidIntegrity(run)) throw new Error("Invalid run integrity");
  const task = run.reviewTasks.find((item) => item.id === decision.taskId && item.state === "open");
  if (!task) throw new Error("Unknown or resolved review task");

  const mappingAction = decision.action === "accept" || decision.action === "reject" || decision.action === "remap";
  if (task.sourceRowId && !mappingAction) throw new Error("INVALID_REVIEW_ACTION");
  if (decision.action === "accept" && (!task.proposedConcept || task.proposedConcept === "other_reported_line"))
    throw new Error("ACCEPT_REQUIRES_PROPOSAL");
  if (decision.action === "remap" && (!decision.concept || decision.concept === "other_reported_line"))
    throw new Error("REMAP_REQUIRES_CONCEPT");
  if (!task.sourceRowId && mappingAction) throw new Error("INVALID_REVIEW_ACTION");

  let currency = run.currency;
  let unitScale = run.unitScale;
  let periods = run.periods;
  let values = run.values;

  if (decision.action === "confirm_currency" && decision.currency)
    currency = decision.currency.trim().toUpperCase();
  else if (decision.action === "confirm_scale" && decision.unitScale && decision.unitScale > 0)
    unitScale = decision.unitScale;
  else if (task.sourceRowId) {
    values = values.map((value) =>
      value.sourceRowId !== task.sourceRowId
        ? value
        : {
            ...value,
            concept: decision.action === "remap" ? decision.concept! : value.concept,
            originalProposal: value.originalProposal ?? value.concept,
            mappingMethod: "human-validated",
            mappingConfidence: 1,
            reviewState: decision.action === "reject" ? "rejected" : "accepted",
            humanDecision: decision.action,
          },
    );
  } else if (decision.action === "confirm_period" && decision.periodLabel) {
    periods = periods.map((period) =>
      period.reviewRequired
        ? { ...period, label: decision.periodLabel!, reviewRequired: false, confidence: 1 }
        : period,
    );
  } else throw new Error("INVALID_REVIEW_ACTION");

  const resolved: ReviewTask = {
    ...task,
    state: "resolved",
    resolution: {
      action: decision.action,
      ...(decision.concept ? { concept: decision.concept } : {}),
      ...resolution,
    },
  };
  const controls = validate(values, run.evidence, unitScale);
  const shell: FinancialRun = {
    ...run,
    currency,
    unitScale,
    periods,
    values,
    controls,
    reviewTasks: [],
  };
  const open = buildReviewTasks(shell, Boolean(run.source.selectedSection));
  const reviewTasks = [
    ...run.reviewTasks.filter((item) => item.state === "resolved"),
    resolved,
    ...open.filter((next) => next.groupKey !== task.groupKey),
  ];

  return finalizeReviewedFinancialRun(shell, reviewTasks);
}
