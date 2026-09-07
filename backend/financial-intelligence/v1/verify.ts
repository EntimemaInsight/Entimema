import type { Statement } from "./contract";
import type { Source } from "./reader";
import { reject } from "./diagnostics";
const normalized = (text: string) => text.replace(/\s+/g, " ").trim();

/** Existing verification rules, with privacy-safe reasons attached to each rejection. */
export function verifyStatement(statement: Statement, source: Source): number {
  if (statement.statementType !== "income_statement")
    reject(
      "STATEMENT_UNSUPPORTED",
      "statementType",
      "income statement",
      "unsupported statement",
      "statement_selection",
    );
  if (!statement.lines.length || !statement.periods.length)
    reject(
      "STATEMENT_EMPTY",
      "$",
      "nonempty statement and periods",
      "empty collection",
      "statement_selection",
    );
  if (new Set(statement.periods).size !== statement.periods.length)
    reject("DUPLICATE_PERIOD", "periods", "unique periods", "duplicate period");
  const cells = [...source.cells.values()],
    refs = new Set<string>(),
    rows = new Set<string>();
  let verified = 0;
  for (const [i, line] of statement.lines.entries()) {
    const linePath = `lines[${i}]`,
      first = source.cells.get(line.values[0].sourceRef);
    if (!first)
      reject(
        "SOURCE_REF_NOT_FOUND",
        `${linePath}.values[0].sourceRef`,
        "existing source cell",
        "missing reference",
      );
    if (first.row !== line.sourceRow)
      reject(
        "SOURCE_ROW_MISMATCH",
        `${linePath}.sourceRow`,
        "referenced cell row",
        "different row",
      );
    const rowKey = `${first.sheet}:${first.row}`;
    if (rows.has(rowKey))
      reject(
        "DUPLICATE_LINE",
        linePath,
        "unique source row",
        "duplicate source row",
      );
    rows.add(rowKey);
    const row = cells.filter(
      (cell) => cell.sheet === first.sheet && cell.row === first.row,
    );
    const label = normalized(line.label),
      text = row
        .filter((cell) => cell.numeric === null)
        .map((cell) => cell.displayed)
        .join(" ");
    if (
      !row.some((cell) => normalized(cell.displayed) === label) &&
      normalized(text) !== label
    )
      reject(
        "SOURCE_LABEL_MISMATCH",
        `${linePath}.label`,
        "source row label",
        "different label",
      );
    const periods = new Set<string>();
    for (const [j, value] of line.values.entries()) {
      const valuePath = `${linePath}.values[${j}]`,
        actual = source.cells.get(value.sourceRef);
      if (!actual)
        reject(
          "SOURCE_REF_NOT_FOUND",
          `${valuePath}.sourceRef`,
          "existing source cell",
          "missing reference",
        );
      if (actual.sheet !== first.sheet)
        reject(
          "SOURCE_SHEET_MISMATCH",
          `${valuePath}.sourceRef`,
          "same source sheet",
          "different sheet",
        );
      if (actual.row !== line.sourceRow)
        reject(
          "SOURCE_ROW_MISMATCH",
          `${valuePath}.sourceRef`,
          "same source row",
          "different row",
        );
      if (actual.numeric === null)
        reject(
          "SOURCE_NOT_NUMERIC",
          `${valuePath}.sourceRef`,
          "numeric source cell",
          "non-numeric source",
          "source_value",
        );
      if (actual.numeric !== value.value)
        reject(
          "SOURCE_VALUE_MISMATCH",
          `${valuePath}.value`,
          "exact source number",
          "different number",
          "source_value",
        );
      if (!statement.periods.includes(value.period))
        reject(
          "PERIOD_NOT_DECLARED",
          `${valuePath}.period`,
          "declared period",
          "undeclared period",
        );
      if (periods.has(value.period))
        reject(
          "DUPLICATE_LINE_PERIOD",
          `${valuePath}.period`,
          "unique line period",
          "duplicate period",
        );
      if (refs.has(value.sourceRef))
        reject(
          "DUPLICATE_SOURCE_REF",
          `${valuePath}.sourceRef`,
          "unique source reference",
          "duplicate reference",
        );
      const header = cells.some(
        (cell) =>
          cell.sheet === first.sheet &&
          cell.row < first.row &&
          (source.format === "pdf" || cell.column === actual.column) &&
          normalized(cell.displayed).includes(normalized(value.period)),
      );
      if (!header)
        reject(
          "PERIOD_HEADER_MISMATCH",
          `${valuePath}.period`,
          "source period header above value",
          "header mismatch",
        );
      refs.add(value.sourceRef);
      periods.add(value.period);
      verified++;
    }
  }
  return verified;
}
