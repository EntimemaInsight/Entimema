import type { Cell, Source } from "./reader";
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const monthPattern = months
  .map((m) => m.slice(0, 3) + "(?:" + m.slice(3) + ")?")
  .join("|");
const datePattern = new RegExp(
  "\\b(" +
    monthPattern +
    ")\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s*,?\\s*((?:19|20)\\s?\\d{2})\\b|\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(" +
    monthPattern +
    ")\\s+((?:19|20)\\s?\\d{2})\\b",
  "gi",
);
type Period = { key: string; year: string };
function dates(text: string): Period[] {
  return [...text.matchAll(datePattern)]
    .map((m) => {
      const month = (m[1] ?? m[5]).toLowerCase().slice(0, 3);
      const day = Number(m[2] ?? m[4]),
        year = (m[3] ?? m[6]).replace(/\s/g, "");
      const number = months.findIndex((x) => x.startsWith(month)) + 1;
      const valid = new Date(Date.UTC(Number(year), number - 1, day));
      return valid.getUTCMonth() === number - 1 && valid.getUTCDate() === day
        ? { key: year + "-" + number + "-" + day, year }
        : null;
    })
    .filter((p): p is Period => p !== null);
}
function headerPeriods(text: string): Period[] {
  const found = dates(text);
  if (found.length) return found;
  // Standalone year columns, or an explicitly labelled period header.
  if (
    !/^(?:(?:line item|periods?|year ended)\s*:?\s*)?(?:(?:19|20)\d{2})(?:\s+(?:and\s+)?(?:19|20)\d{2})*$/i.test(
      text.trim(),
    )
  )
    return [];
  return [...text.matchAll(/\b(?:19|20)\d{2}\b/g)].map((m) => ({
    key: m[0],
    year: m[0],
  }));
}
function shortDate(text: string): string | null {
  const pattern = new RegExp(
    "^(?:" + monthPattern + ")\\s+\\d{1,2}(?:st|nd|rd|th)?\\s*,?\\s+\\d{2}$",
    "i",
  );
  if (!pattern.test(text.trim())) return null;
  const canonical = text
    .trim()
    .toLowerCase()
    .match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s+(\d{2})$/)!;
  return (
    canonical[1].slice(0, 3) + "-" + Number(canonical[2]) + "-" + canonical[3]
  );
}
function abbreviated(period: Period): string | null {
  const parts = period.key.split("-");
  return parts.length === 3
    ? months[Number(parts[1]) - 1].slice(0, 3) +
        "-" +
        Number(parts[2]) +
        "-" +
        parts[0].slice(-2)
    : null;
}
function equivalent(requested: string, period: Period): boolean {
  if (/^(?:19|20)\d{2}$/.test(requested.trim()))
    return requested.trim() === period.year;
  const parsed = dates(requested);
  return (
    (parsed.length === 1 && parsed[0].key === period.key) ||
    (shortDate(requested) !== null &&
      shortDate(requested) === abbreviated(period))
  );
}

/** Page-local source headers plus repeated value order; never an AI-derived column map. */
export function pdfPeriodMatches(
  source: Source,
  actual: Cell,
  requested: string,
): boolean {
  const rows = new Map<number, Cell[]>();
  for (const cell of source.cells.values())
    if (cell.sheet === actual.sheet) {
      const row = rows.get(cell.row) ?? [];
      row.push(cell);
      rows.set(cell.row, row);
    }
  for (const row of rows.values()) row.sort((a, b) => a.column - b.column);
  const ordered = [...rows].sort(([a], [b]) => a - b);
  const headers = ordered
    .filter(([n]) => n <= actual.row)
    .map(([n, row]) => ({
      row: n,
      periods: headerPeriods(row.map((c) => c.displayed).join(" ")),
    }))
    .filter((h) => h.periods.length);
  if (!headers.length) return false;
  const nearest = headers[headers.length - 1];
  if (
    new Set(nearest.periods.map((p) => p.key)).size !== nearest.periods.length
  )
    return false;
  // Conflicting explicit headers in the same table preamble must not be silently overridden.
  const earlier = headers
    .slice(0, -1)
    .filter(
      (h) =>
        !ordered.some(
          ([n, row]) =>
            n > h.row &&
            n < nearest.row &&
            row.some((c) => c.numeric !== null) &&
            row.some((c) => c.numeric === null) &&
            !headerPeriods(row.map((c) => c.displayed).join(" ")).length,
        ),
    );
  if (
    earlier.some(
      (h) =>
        h.periods.length !== nearest.periods.length ||
        h.periods.some(
          (p, i) =>
            p.year !== nearest.periods[i].year ||
            (p.key.includes("-") &&
              nearest.periods[i].key.includes("-") &&
              p.key !== nearest.periods[i].key),
        ),
    )
  )
    return false;
  const followingHeader =
    ordered.find(
      ([n, row]) =>
        n > nearest.row &&
        headerPeriods(row.map((c) => c.displayed).join(" ")).length,
    )?.[0] ?? Infinity;
  const data = ordered
    .filter(
      ([n, row]) =>
        n > nearest.row &&
        n < followingHeader &&
        row.some((c) => c.numeric === null) &&
        row.some((c) => c.numeric !== null),
    )
    .map(([n, row]) => ({
      row: n,
      values: row.filter((c) => c.numeric !== null),
    }));
  const firstDataRow =
    data.find((r) => r.values.length === nearest.periods.length)?.row ??
    actual.row;
  const shortened = ordered
    .filter(([n]) => n > nearest.row && n < firstDataRow)
    .map(([, row]) => shortDate(row.map((c) => c.displayed).join(" ")))
    .filter((x) => x !== null);
  if (
    shortened.some(
      (x) =>
        nearest.periods.length !== 1 || x !== abbreviated(nearest.periods[0]),
    )
  )
    return false;
  const current = data.find((r) => r.row === actual.row);
  if (!current || current.values.length !== nearest.periods.length)
    return false;
  // Repeated rows corroborate order; a single-row table has no conflicting row order.
  const peers = data.filter((r) => r.values.length === nearest.periods.length);
  if (peers.length < 2 && data.length !== 1) return false;
  const index = current.values.findIndex((c) => c.ref === actual.ref);
  return index >= 0 && equivalent(requested, nearest.periods[index]);
}
