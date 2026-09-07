import type { AnalysisKpi, Statement } from "./contract";

const measures = [
  ["gross_margin", "Gross margin", "margin", "gross_profit"],
  ["operating_margin", "Operating margin", "margin", "operating_profit"],
  ["net_margin", "Net margin", "margin", "net_income"],
  ["revenue_growth", "Revenue growth", "growth", "revenue"],
  [
    "operating_profit_growth",
    "Operating profit growth",
    "growth",
    "operating_profit",
  ],
  ["net_income_growth", "Net income growth", "growth", "net_income"],
] as const;

/** Called only after source verification. Never infer an absent aggregate or period. */
export function calculate(statement: Statement): AnalysisKpi[] {
  const at = (concept: string, period: string | null) => {
    const lines = statement.lines.filter((line) => line.concept === concept);
    const values =
      lines.length === 1
        ? lines[0].values.filter((value) => value.period === period)
        : [];
    return values.length === 1 ? { concept, ...values[0] } : undefined;
  };
  return statement.periods.flatMap((currentPeriod) =>
    measures.map(([name, label, type, concept]): AnalysisKpi => {
      // Retain the established conservative annual-comparability convention.
      const prior = /^\d{4}$/.test(currentPeriod)
        ? String(Number(currentPeriod) - 1)
        : null;
      const priorPeriod =
        type === "growth" && prior && statement.periods.includes(prior)
          ? prior
          : null;
      const numerator = at(concept, currentPeriod);
      const denominator = at(
        type === "margin" ? "revenue" : concept,
        type === "margin" ? currentPeriod : priorPeriod,
      );
      const currentValue = numerator?.value;
      const denominatorValue = denominator?.value;
      const base = {
        id: `${name}:${currentPeriod}`,
        label,
        type,
        currentPeriod,
        priorPeriod,
        currentValue,
        ...(type === "growth"
          ? { priorValue: denominatorValue }
          : { denominatorValue }),
        sourceConcepts: type === "margin" ? [concept, "revenue"] : [concept],
        evidence: [numerator, denominator].filter(
          (value) => value !== undefined,
        ),
      };
      if (currentValue === undefined || denominatorValue === undefined)
        return {
          ...base,
          status: "unavailable",
          reason:
            type === "growth" && !priorPeriod
              ? "A consecutive explicit annual comparison period is unavailable."
              : "A unique required source concept or period value is unavailable.",
        };
      if (denominatorValue === 0)
        return type === "growth"
          ? {
              ...base,
              status: "not_meaningful",
              reason: "The prior-period value is zero.",
            }
          : { ...base, status: "unavailable", reason: "Revenue is zero." };
      if (
        type === "growth" &&
        ((currentValue < 0 && denominatorValue > 0) ||
          (currentValue > 0 && denominatorValue < 0))
      )
        return {
          ...base,
          status: "sign_change",
          direction:
            currentValue < 0 ? "positive_to_negative" : "negative_to_positive",
        };
      const value =
        (currentValue / denominatorValue - (type === "growth" ? 1 : 0)) * 100;
      const rounded = Math.round(value * 100) / 100;
      if (!Number.isFinite(rounded))
        return {
          ...base,
          status: "unavailable",
          reason: "The calculation exceeds finite numeric precision.",
        };
      return { ...base, status: "valid", value: rounded, unit: "%" };
    }),
  );
}
