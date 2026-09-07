import { AgentError } from "../../lib/errors";
import type { Statement } from "./contract";
import type { Source } from "./reader";

const normalized = (text: string) => text.replace(/\s+/g, " ").trim();
const fail = () => {
  throw new AgentError(
    "OPENAI_RESPONSE_INVALID",
    422,
    "The financial statement could not be verified against the source. No unverified result was returned.",
  );
};

/** Fail closed: without proof of the semantic association, replacing a number is unsafe. */
export function verifyStatement(statement: Statement, source: Source): number {
  if (
    statement.statementType !== "income_statement" ||
    !statement.lines.length ||
    !statement.periods.length
  )
    return fail();
  if (new Set(statement.periods).size !== statement.periods.length)
    return fail();
  const cells = [...source.cells.values()];
  const refs = new Set<string>();
  const rows = new Set<string>();
  let verified = 0;
  for (const line of statement.lines) {
    const first = source.cells.get(line.values[0].sourceRef);
    if (!first || first.row !== line.sourceRow) return fail();
    const rowKey = `${first.sheet}:${first.row}`;
    if (rows.has(rowKey)) return fail();
    rows.add(rowKey);
    const row = cells.filter(
      (cell) => cell.sheet === first.sheet && cell.row === first.row,
    );
    const label = normalized(line.label);
    const text = row
      .filter((cell) => cell.numeric === null)
      .map((cell) => cell.displayed)
      .join(" ");
    if (
      !row.some((cell) => normalized(cell.displayed) === label) &&
      normalized(text) !== label
    )
      return fail();
    const periods = new Set<string>();
    for (const value of line.values) {
      const actual = source.cells.get(value.sourceRef);
      if (
        !actual ||
        actual.sheet !== first.sheet ||
        actual.row !== line.sourceRow ||
        actual.numeric === null ||
        actual.numeric !== value.value
      )
        return fail();
      if (
        !statement.periods.includes(value.period) ||
        periods.has(value.period) ||
        refs.has(value.sourceRef)
      )
        return fail();
      // Check the literal period header in the same spreadsheet column, above the value.
      // PDF text has no reliable column coordinates after tokenization: only source presence is checked.
      const header = cells.some(
        (cell) =>
          cell.sheet === first.sheet &&
          cell.row < first.row &&
          (source.format === "pdf" || cell.column === actual.column) &&
          normalized(cell.displayed).includes(normalized(value.period)),
      );
      if (!header) return fail();
      refs.add(value.sourceRef);
      periods.add(value.period);
      verified++;
    }
  }
  return verified;
}
