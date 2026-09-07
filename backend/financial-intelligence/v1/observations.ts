import type { Kpi, Statement } from "./contract";

/** Adds first-result observations; existing margin/revenue calculations stay unchanged. */
export function firstAnalysis(statement: Statement, baseKpis: Kpi[]) {
  const kpis = [...baseKpis],
    findings: string[] = [];
  const at = (concept: string, period: string) => {
    const lines = statement.lines.filter((line) => line.concept === concept);
    return lines.length === 1
      ? lines[0].values.find((value) => value.period === period)?.value
      : undefined;
  };
  const fmt = (value: number) =>
    new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
  const movement = (label: string, value: number) =>
    value === 0
      ? `${label} was unchanged`
      : `${label} ${value > 0 ? "increased" : "decreased"} by ${fmt(Math.abs(value))}%`;
  for (const period of [...statement.periods]
    .filter((period) => /^\d{4}$/.test(period))
    .sort()
    .reverse()) {
    const prior = String(Number(period) - 1);
    if (!statement.periods.includes(prior)) continue;
    for (const [concept, label] of [
      ["operating_profit", "Operating profit"],
      ["net_income", "Net income"],
    ]) {
      const current = at(concept, period),
        previous = at(concept, prior);
      if (current === undefined || previous === undefined || previous <= 0)
        continue;
      const change =
        Math.round(((current - previous) / previous) * 10000) / 100;
      if (!Number.isFinite(change)) continue;
      kpis.push({ label: `${label} growth`, period, value: change, unit: "%" });
      findings.push(`${movement(label, change)} in ${period} versus ${prior}.`);
    }
    const revenue = kpis.find(
      (kpi) => kpi.label === "Revenue growth" && kpi.period === period,
    );
    if (revenue)
      findings.unshift(
        `${movement("Revenue", revenue.value)} in ${period} versus ${prior}.`,
      );
    for (const label of ["Gross margin", "Operating margin", "Net margin"]) {
      const current = kpis.find(
          (kpi) => kpi.label === label && kpi.period === period,
        )?.value,
        previous = kpis.find(
          (kpi) => kpi.label === label && kpi.period === prior,
        )?.value;
      if (current === undefined || previous === undefined) continue;
      const delta = Math.round((current - previous) * 100) / 100;
      findings.push(
        `${label} moved from ${fmt(previous)}% to ${fmt(current)}% in ${period} (${delta > 0 ? "+" : ""}${fmt(delta)} pp).`,
      );
    }
  }
  const summary = findings.length
    ? findings.slice(0, 2).join(" ")
    : "Source values are verified. Comparable annual inputs are unavailable for year-over-year observations.";
  return { kpis, summary, findings };
}
