import { createHash } from "node:crypto";
import type { CanonicalConcept, CanonicalValue, FinancialRun } from "./schema";

export const FINANCIAL_ANALYSIS_VERSION = "financial-analysis.v1" as const;
type MetricKey =
  | "revenue"
  | "gross_profit"
  | "operating_profit"
  | "net_income"
  | "gross_margin"
  | "operating_margin"
  | "net_margin";
export type AnalysisMetric = {
  key: MetricKey;
  periodId: string;
  periodLabel: string;
  value: number;
  unit: "currency" | "ratio";
  formula: string;
  evidenceIds: string[];
};
export type AnalysisVariance = {
  metric: Exclude<
    MetricKey,
    "gross_margin" | "operating_margin" | "net_margin"
  >;
  fromPeriodId: string;
  toPeriodId: string;
  absolute: number;
  percentage: number | null;
  material: boolean;
  evidenceIds: string[];
};
export type AnalysisFinding = {
  id: string;
  kind: "performance" | "driver" | "anomaly" | "limitation";
  classification: "fact" | "calculation" | "hypothesis";
  title: string;
  statement: string;
  periodIds: string[];
  metricKeys: MetricKey[];
  evidenceIds: string[];
  formula: string | null;
  confidence: number;
};
export type FinancialAnalysis = {
  analysisVersion: typeof FINANCIAL_ANALYSIS_VERSION;
  runId: string;
  revision: number;
  status: "analysis_ready";
  generatedAt: string;
  currency: string;
  unitScale: number;
  metrics: AnalysisMetric[];
  variances: AnalysisVariance[];
  findings: AnalysisFinding[];
  limitations: string[];
  integrityHash: string;
};

const amountConcepts = [
  "revenue",
  "gross_profit",
  "operating_profit",
  "net_income",
] as const;
const marginConcepts = [
  ["gross_margin", "gross_profit"],
  ["operating_margin", "operating_profit"],
  ["net_margin", "net_income"],
] as const;
const selected = (
  values: CanonicalValue[],
  concept: CanonicalConcept,
  periodId: string,
) =>
  values.find(
    (v) =>
      v.concept === concept &&
      v.periodId === periodId &&
      v.reviewState !== "rejected",
  );
const rounded = (value: number, places = 6) => Number(value.toFixed(places));

export function analyzeValidatedIncomeStatement(
  run: FinancialRun,
  now = new Date().toISOString(),
): FinancialAnalysis {
  if (
    run.status !== "validated" ||
    run.readiness.status !== "validated" ||
    !Object.values(run.readiness.gates).every(Boolean)
  )
    throw new Error("ANALYSIS_REQUIRES_VALIDATED_RUN");
  if (!run.currency || !run.unitScale)
    throw new Error("ANALYSIS_REQUIRES_VALIDATED_RUN");
  const metrics: AnalysisMetric[] = [];
  for (const period of run.periods) {
    const revenue = selected(run.values, "revenue", period.id);
    for (const concept of amountConcepts) {
      const value = selected(run.values, concept, period.id);
      if (value)
        metrics.push({
          key: concept,
          periodId: period.id,
          periodLabel: period.label,
          value: value.normalizedValue,
          unit: "currency",
          formula: `${concept} = validated reported value`,
          evidenceIds: [value.evidenceId],
        });
    }
    if (revenue && revenue.normalizedValue !== 0)
      for (const [key, numeratorConcept] of marginConcepts) {
        const numerator = selected(run.values, numeratorConcept, period.id);
        if (numerator)
          metrics.push({
            key,
            periodId: period.id,
            periodLabel: period.label,
            value: rounded(numerator.normalizedValue / revenue.normalizedValue),
            unit: "ratio",
            formula: `${key} = ${numeratorConcept} / revenue`,
            evidenceIds: [numerator.evidenceId, revenue.evidenceId],
          });
      }
  }
  const comparable = run.periods.filter(
    (p) =>
      p.designation === "actual" &&
      !["annual_total", "ytd", "budget", "forecast", "comparative"].includes(
        p.type,
      ),
  );
  const variances: AnalysisVariance[] = [];
  for (let i = 1; i < comparable.length; i++)
    for (const metric of amountConcepts) {
      const from = metrics.find(
          (x) => x.key === metric && x.periodId === comparable[i - 1].id,
        ),
        to = metrics.find(
          (x) => x.key === metric && x.periodId === comparable[i].id,
        );
      if (!from || !to) continue;
      const absolute = to.value - from.value,
        percentage = from.value === 0 ? null : absolute / Math.abs(from.value);
      variances.push({
        metric,
        fromPeriodId: from.periodId,
        toPeriodId: to.periodId,
        absolute: rounded(absolute),
        percentage: percentage === null ? null : rounded(percentage),
        material: Math.abs(percentage ?? 0) >= 0.1,
        evidenceIds: [...new Set([...from.evidenceIds, ...to.evidenceIds])],
      });
    }
  const findings: AnalysisFinding[] = [];
  for (const metric of [
    "gross_margin",
    "operating_margin",
    "net_margin",
  ] as const) {
    const series = metrics.filter(
      (x) => x.key === metric && comparable.some((p) => p.id === x.periodId),
    );
    if (series.length < 2) continue;
    const first = series[0],
      last = series.at(-1)!,
      change = last.value - first.value;
    findings.push({
      id: `margin-${metric}`,
      kind: "performance",
      classification: "calculation",
      title: `${metric.replaceAll("_", " ")} movement`,
      statement: `${metric.replaceAll("_", " ")} changed by ${rounded(change * 100, 2)} percentage points from ${first.periodLabel} to ${last.periodLabel}.`,
      periodIds: [first.periodId, last.periodId],
      metricKeys: [metric],
      evidenceIds: [...new Set([...first.evidenceIds, ...last.evidenceIds])],
      formula: `(${last.value} - ${first.value}) × 100`,
      confidence: 1,
    });
  }
  const material = variances
    .filter((v) => v.material)
    .sort((a, b) => Math.abs(b.percentage ?? 0) - Math.abs(a.percentage ?? 0));
  for (const [index, v] of material.slice(0, 5).entries()) {
    const from = run.periods.find((p) => p.id === v.fromPeriodId)!,
      to = run.periods.find((p) => p.id === v.toPeriodId)!;
    findings.push({
      id: `variance-${index}-${v.metric}`,
      kind: index === 0 ? "anomaly" : "driver",
      classification: "calculation",
      title: `Material ${v.metric.replaceAll("_", " ")} movement`,
      statement: `${v.metric.replaceAll("_", " ")} changed by ${v.percentage === null ? "an undefined percentage" : `${rounded(v.percentage * 100, 2)}%`} (${rounded(v.absolute, 2)} in reported units) from ${from.label} to ${to.label}.`,
      periodIds: [from.id, to.id],
      metricKeys: [v.metric],
      evidenceIds: v.evidenceIds,
      formula: `(${to.label} - ${from.label}) / |${from.label}|`,
      confidence: 1,
    });
  }
  const limitations = [
    "The analysis explains movements in the validated Income Statement; it does not establish causality without operational or budget evidence.",
  ];
  findings.push({
    id: "causality-limitation",
    kind: "limitation",
    classification: "hypothesis",
    title: "Causal attribution requires more evidence",
    statement: limitations[0],
    periodIds: [],
    metricKeys: [],
    evidenceIds: [],
    formula: null,
    confidence: 1,
  });
  const payload = {
    analysisVersion: FINANCIAL_ANALYSIS_VERSION,
    runId: run.runId,
    revision: run.revision ?? 1,
    status: "analysis_ready" as const,
    generatedAt: now,
    currency: run.currency,
    unitScale: run.unitScale,
    metrics,
    variances,
    findings,
    limitations,
  };
  return {
    ...payload,
    integrityHash: createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex"),
  };
}
