import type { Statement } from "./contract";
import type { Source, Cell } from "./reader";
import { reject } from "./diagnostics";

const words = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[_()–—-]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const heading = (value: string) =>
  words(value).replace(
    /^(?:(?:consolidated|condensed|combined|group|separate)\s+)+/,
    "",
  );
const pnlHeading = (value: string) =>
  /^(?:income statements?|statements? of (?:income|profit (?:or|and) loss)|profit (?:or|and) loss(?: statements?)?|p and l(?: statements?)?)$/.test(
    value,
  );
const comprehensiveHeading = (value: string) =>
  /^(?:statements? of )?comprehensive income$/.test(value);
const combinedHeading = (value: string) =>
  /^statements? of profit (?:or|and) loss and other comprehensive income$/.test(
    value,
  );
const ociHeading = (value: string) =>
  /^(?:(?:statements? of )?other comprehensive income(?: net of (?:income )?tax(?:es)?)?|oci|comprehensive income reconciliation)$/.test(
    value,
  );
const reclassificationHeading = (value: string) =>
  /^items that (?:may|will)(?: not)? be reclassified(?: subsequently)? (?:to|into) (?:the )?(?:income statement|profit or loss)(?: net of taxes)?$/.test(
    value,
  );
const profitClosing = (value: string) =>
  /^(?:net (?:loss profit|profit loss|profit|loss)|(?:profit|loss)(?: or loss| or profit)? (?:for|of) the (?:year|period))$/.test(
    value,
  );
const operatingAliases = new Set([
  "ebit",
  "operating profit",
  "operating income",
  "profit from operations",
  "earnings before interest and taxes",
  "operating result before interest and taxes",
]);
const isOperatingProfit = (value: string | null) => {
  if (value === null) return false;
  const key = words(value);
  return (
    operatingAliases.has(key) || operatingAliases.has(key.replace(/ ebit$/, ""))
  );
};
export type SemanticNormalization = {
  inputLineCount: number;
  outputLineCount: number;
  excludedRows: {
    sourceRow: number;
    label: string;
    sourceRefs: string[];
    section: "other_comprehensive_income";
  }[];
  conceptMappings: {
    sourceRow: number;
    label: string;
    from: string | null;
    to: "operating_profit";
  }[];
};

/** Source rows are already verified. Section boundaries never truncate mechanical input. */
export function normalizeIncomeStatement(
  statement: Statement,
  source: Source,
): { statement: Statement; normalization: SemanticNormalization } {
  const sheets = new Map<string, Map<number, Cell[]>>();
  for (const cell of source.cells.values()) {
    if (!sheets.has(cell.sheet)) sheets.set(cell.sheet, new Map());
    const rows = sheets.get(cell.sheet)!;
    if (!rows.has(cell.row)) rows.set(cell.row, []);
    rows.get(cell.row)!.push(cell);
  }
  const rowText = (cells: Cell[]) =>
    cells
      .filter((c) => c.numeric === null)
      .sort((a, b) => a.column - b.column)
      .map((c) => c.displayed)
      .join(" ");
  const structuralHeading = (cells: Cell[]) =>
    cells.every(
      (c) =>
        c.numeric === null || statement.periods.includes(c.displayed.trim()),
    );
  const hasPrimaryHeading = [...sheets.values()].some((rows) =>
    [...rows.values()].some(
      (cells) =>
        structuralHeading(cells) && pnlHeading(heading(rowText(cells))),
    ),
  );
  const ociRows = new Set<string>();
  for (const [sheet, rows] of sheets) {
    let inOci = false,
      combined = false,
      seenFinancialRows = false,
      closedProfit = false;
    for (const [row, cells] of [...rows.entries()].sort(
      (a, b) => a[0] - b[0],
    )) {
      const text = heading(rowText(cells));
      const structural = structuralHeading(cells);
      if (structural && pnlHeading(text)) {
        inOci = false;
        combined = false;
        closedProfit = false;
      } else if (structural && combinedHeading(text)) {
        inOci = false;
        combined = true;
        closedProfit = false;
      } else if (structural && comprehensiveHeading(text)) {
        inOci = hasPrimaryHeading || seenFinancialRows;
        combined = !inOci;
      } else if (
        (ociHeading(text) || (combined && reclassificationHeading(text))) &&
        (structural || (combined && closedProfit))
      )
        inOci = true;
      if (inOci) ociRows.add(`${sheet}:${row}`);
      if (!structural) {
        seenFinancialRows = true;
        if (profitClosing(text)) closedProfit = true;
      }
    }
  }
  const normalization: SemanticNormalization = {
    inputLineCount: statement.lines.length,
    outputLineCount: 0,
    excludedRows: [],
    conceptMappings: [],
  };
  const lines: Statement["lines"] = [];
  for (const line of statement.lines) {
    const first = source.cells.get(line.values[0].sourceRef);
    if (!first)
      reject(
        "SOURCE_REF_NOT_FOUND",
        "lines",
        "verified source row",
        "missing reference",
      );
    if (ociRows.has(`${first.sheet}:${first.row}`)) {
      normalization.excludedRows.push({
        sourceRow: line.sourceRow,
        label: line.label,
        sourceRefs: line.values.map((v) => v.sourceRef),
        section: "other_comprehensive_income",
      });
      continue;
    }
    if (
      line.concept !== "operating_profit" &&
      (isOperatingProfit(line.label) || isOperatingProfit(line.concept))
    ) {
      normalization.conceptMappings.push({
        sourceRow: line.sourceRow,
        label: line.label,
        from: line.concept,
        to: "operating_profit",
      });
      lines.push({ ...line, concept: "operating_profit" });
    } else lines.push(line);
  }
  if (!lines.length)
    reject(
      "INCOME_STATEMENT_SECTION_EMPTY",
      "lines",
      "primary income statement rows",
      "only other comprehensive income",
      "statement_selection",
    );
  normalization.outputLineCount = lines.length;
  return { statement: { ...statement, lines }, normalization };
}
