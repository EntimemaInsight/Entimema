import type { Kpi, Statement } from "./contract";

export function calculate(statement: Statement): Kpi[] {
  const kpis: Kpi[] = [];
  const unique = (concept: string) => {
    const lines = statement.lines.filter((line) => line.concept === concept);
    return lines.length === 1 ? lines[0] : undefined;
  };
  const revenue = unique("revenue");
  const at = (line: typeof revenue, period: string) =>
    line?.values.find((value) => value.period === period)?.value;
  const add = (
    label: string,
    period: string,
    numerator: number | undefined,
    denominator: number | undefined,
  ) => {
    if (
      numerator === undefined ||
      denominator === undefined ||
      denominator <= 0
    )
      return;
    const value = (numerator / denominator) * 100;
    if (Number.isFinite(value))
      kpis.push({
        label,
        period,
        value: Math.round(value * 100) / 100,
        unit: "%",
      });
  };
  for (const period of statement.periods) {
    for (const [concept, label] of [
      ["gross_profit", "Gross margin"],
      ["operating_profit", "Operating margin"],
      ["net_income", "Net margin"],
    ]) {
      add(label, period, at(unique(concept), period), at(revenue, period));
    }
    // Only consecutive, explicit annual periods are comparable without guessing dates or durations.
    if (/^\d{4}$/.test(period)) {
      const previous = String(Number(period) - 1);
      if (statement.periods.includes(previous)) {
        const current = at(revenue, period),
          prior = at(revenue, previous);
        add(
          "Revenue growth",
          period,
          current !== undefined && prior !== undefined
            ? current - prior
            : undefined,
          prior,
        );
      }
    }
  }
  return kpis;
}
