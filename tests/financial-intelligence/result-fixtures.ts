import type {
  Result,
  Statement,
} from "../../backend/financial-intelligence/v1/contract";
import { calculate } from "../../backend/financial-intelligence/v1/calculate";
import { firstAnalysis } from "../../backend/financial-intelligence/v1/observations";
import { goldStatement } from "./gold";
import { rieterRows } from "./rieter";
function result(statement: Statement): Result {
  return {
    ...statement,
    ...firstAnalysis(statement, calculate(statement)),
    verification: {
      verifiedValues: statement.lines.flatMap((l) => l.values).length,
    },
    model: "gpt-4.1-2025-04-14",
    aiCalls: 1,
    timings: {
      mechanicalReadMs: 12,
      aiMs: 6000,
      validationMs: 1,
      verificationMs: 5,
      calculationMs: 1,
      totalMs: 6019,
    },
  };
}
export function resultFixtures() {
  const controlled = goldStatement();
  controlled.entity = "Controlled Company";
  controlled.lines.forEach((l) => {
    if (
      ["gross_profit", "operating_profit", "net_income"].includes(
        l.concept ?? "",
      )
    )
      l.aggregationRole = "subtotal";
  });
  const concepts: Record<number, string> = {
    5: "revenue",
    7: "gross_profit",
    13: "operating_profit",
    18: "net_income",
  };
  const rieter: Statement = {
    ...controlled,
    entity: "Rieter",
    currency: "CHF",
    scale: "millions",
    periods: ["2024", "2025"],
    lines: rieterRows.map(([sourceRow, label, a, b]) => ({
      sourceRow,
      label,
      concept: concepts[sourceRow] ?? null,
      aggregationRole: concepts[sourceRow] ? "total" : "detail",
      values: [
        {
          period: "2024",
          sourceRef: `'Consolidated income statement'!B${sourceRow}`,
          value: a,
        },
        {
          period: "2025",
          sourceRef: `'Consolidated income statement'!C${sourceRow}`,
          value: b,
        },
      ],
    })),
  };
  const missing = goldStatement();
  missing.entity = "Limited source inputs";
  missing.lines = missing.lines.filter(
    (l) => !["gross_profit", "operating_profit"].includes(l.concept ?? ""),
  );
  missing.lines[0].values[1].value = 0;
  return {
    controlled: result(controlled),
    rieter: result(rieter),
    missing: result(missing),
  };
}
