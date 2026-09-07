import type { Statement } from "./contract";
import type { Source } from "./reader";

/** A report caption is not the table's column-period declaration. */
export function normalizePeriodDeclaration(
  statement: Statement,
  source: Source,
): Statement {
  const periods = [
    ...new Set(
      statement.lines.flatMap((line) =>
        line.values.map((value) => value.period),
      ),
    ),
  ];
  if (periods.every((period) => statement.periods.includes(period)))
    return statement;
  // Only repair a single literal overall report caption, never contradictory year declarations.
  if (
    source.format !== "spreadsheet" ||
    statement.periods.length !== 1 ||
    !/^(?:year|period) ended\s+.+$/i.test(statement.periods[0])
  )
    return statement;
  const cells = [...source.cells.values()];
  const headers: typeof cells = [];
  for (const line of statement.lines)
    for (const value of line.values) {
      const actual = source.cells.get(value.sourceRef);
      if (!actual) return statement;
      const matches = cells.filter(
        (cell) =>
          cell.sheet === actual.sheet &&
          cell.row < actual.row &&
          cell.column === actual.column &&
          cell.displayed.trim() === value.period.trim(),
      );
      if (matches.length !== 1) return statement;
      headers.push(matches[0]);
    }
  if (
    !headers.length ||
    new Set(headers.map((cell) => `${cell.sheet}:${cell.row}`)).size !== 1
  )
    return statement;
  const first = headers[0];
  if (
    !cells.some(
      (cell) =>
        cell.sheet === first.sheet &&
        cell.row < first.row &&
        cell.displayed.trim() === statement.periods[0].trim(),
    )
  )
    return statement;
  // A header cannot be assigned two periods, or two columns assigned the same period.
  if (new Set(headers.map((cell) => cell.ref)).size !== periods.length)
    return statement;
  return { ...statement, periods };
}
