import type { Cell } from "./reader";

type Notation = "." | "," | null;
const unsigned = (text: string) =>
  text
    .trim()
    .replace(/\u2212/g, "-")
    .replace(/^\((.*)\)$/, "$1")
    .replace(/^[+-]/, "");

/** Only unambiguous decimal syntax establishes notation; currency/language do not. */
export function pdfNotation(tokens: string[]): Notation {
  const markers = new Set<string>();
  for (const token of tokens) {
    const value = unsigned(token);
    if (/^\d+\.\d{1,2}$/.test(value) || /^\d{1,3}(?:,\d{3})+\.\d+$/.test(value))
      markers.add(".");
    if (/^\d+,\d{1,2}$/.test(value) || /^\d{1,3}(?:\.\d{3})+,\d+$/.test(value))
      markers.add(",");
  }
  return markers.size === 1 ? ([...markers][0] as Notation) : null;
}

/** Keep an entire numeric text item together; never join neighboring PDF items. */
export function pdfTokens(text: string): string[] {
  const trimmed = text.trim();
  return /^[\d+\-\u2212(][\d.,() +\-\u2212\u00a0\u202f]*$/.test(trimmed)
    ? [trimmed]
    : trimmed.split(/\s+/);
}

export function pdfNumber(token: string, notation: Notation): number | null {
  let value = token.trim().replace(/\u2212/g, "-");
  const negative = /^\(.*\)$/.test(value);
  if (negative) value = value.slice(1, -1);
  if (negative && /^[+-]/.test(value)) return null;
  let normalized: string;
  if (/^[+-]?\d+$/.test(value)) normalized = value;
  else if (/^[+-]?\d{1,3}(?:[ \u00a0\u202f]\d{3})+$/.test(value))
    normalized = value.replace(/[ \u00a0\u202f]/g, "");
  else if (
    notation === "." &&
    /^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)
  )
    normalized = value.replace(/,/g, "");
  else if (
    notation === "," &&
    /^[+-]?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value)
  )
    normalized = value.replace(/\./g, "").replace(",", ".");
  else return null;
  const number = Number(normalized) * (negative ? -1 : 1);
  return Number.isFinite(number) ? number : null;
}

/** PDF-only interpretation. Original raw/displayed lexemes and references remain intact. */
export function normalizePdfNumbers(cells: Map<string, Cell>): void {
  for (const page of new Set([...cells.values()].map((cell) => cell.sheet))) {
    const tokens = [...cells.values()].filter((cell) => cell.sheet === page);
    const notation = pdfNotation(tokens.map((cell) => cell.displayed));
    for (const cell of tokens)
      cell.numeric = pdfNumber(cell.displayed, notation);
  }
}
