import type { Source } from "./reader";
import type { ModelStatement } from "./contract";
import { reject } from "./diagnostics";

const currencies = new Set(Intl.supportedValuesOf("currency"));
const scales: Record<string, string> = {
  unit: "units",
  units: "units",
  k: "thousands",
  m: "millions",
  mn: "millions",
  thousand: "thousands",
  thousands: "thousands",
  million: "millions",
  millions: "millions",
  billion: "billions",
  billions: "billions",
};
const invalid = (
  path: "currency" | "scale",
  code = "METADATA_AMBIGUOUS",
): never =>
  reject(
    code,
    path,
    "one explicit currency and a consistent scale",
    "unsupported or conflicting metadata",
    "schema_contract",
  );

/** Exact tokens only: recognized K/M marker plus a supported three-letter code. */
function currencyToken(
  raw: string,
): { currency: string; scale: string | null } | null {
  const prefix = raw.trim().match(/^([MK])([A-Z]{3})$/i);
  if (prefix && currencies.has(prefix[2].toUpperCase()))
    return {
      currency: prefix[2].toUpperCase(),
      scale: scales[prefix[1].toLowerCase()],
    };
  const text = raw
    .trim()
    .match(
      /^([A-Z]{3})(?:\s+(units?|thousands?|millions?|billions?|mn|m|k))?$/i,
    );
  if (!text || !currencies.has(text[1].toUpperCase())) return null;
  return {
    currency: text[1].toUpperCase(),
    scale: text[2] ? scales[text[2].toLowerCase()] : null,
  };
}

function conflictingSourceCurrency(
  statement: ModelStatement,
  source: Source,
  currency: string,
): boolean {
  const refs = statement.lines.flatMap((line) =>
    line.values.map((value) => value.sourceRef),
  );
  const sheets = new Set([...source.cells.values()].map((cell) => cell.sheet));
  const statementSheets = new Set(
    [...sheets].filter((sheet) =>
      refs.some(
        (ref) =>
          ref.startsWith("'" + sheet.replace(/'/g, "''") + "'!") ||
          ref.startsWith(sheet + "!"),
      ),
    ),
  );
  // If references cannot establish the scope, conservatively inspect all source evidence.
  const texts = [...source.cells.values()]
    .filter(
      (cell) =>
        cell.numeric === null &&
        (!statementSheets.size || statementSheets.has(cell.sheet)),
    )
    .map((cell) => cell.displayed);
  for (const text of texts) {
    const tokens: string[] = text.match(/\b(?:[MK])?[A-Z]{3}\b/g) ?? [];
    // Standalone or explicitly labelled metadata may use lowercase codes.
    const explicit = text
      .trim()
      .match(
        /^(?:currency\s*:\s*)?((?:[MK])?[A-Z]{3}(?:\s+(?:units?|thousands?|millions?|billions?|mn|m|k))?)$/i,
      );
    if (explicit) tokens.push(explicit[1]);
    if (
      tokens.some((token) => {
        const parsed = currencyToken(token);
        return parsed !== null && parsed.currency !== currency;
      })
    )
      return true;
    if (
      (text.includes("€") && currency !== "EUR") ||
      (text.includes("£") && currency !== "GBP") ||
      (text.includes("$") && currency !== "USD") ||
      (text.includes("¥") && !["JPY", "CNY"].includes(currency))
    )
      return true;
  }
  return false;
}

/** Split explicit metadata only. Never convert, rescale or modify financial lines. */
export function normalizeMetadata(
  statement: ModelStatement,
  source?: Source,
): ModelStatement {
  let currency: string | null = null;
  let embeddedScale: string | null = null;
  if (statement.currency !== null) {
    let rawCurrency = statement.currency.trim();
    if (rawCurrency === "£" && source) {
      const text = [...source.cells.values()]
        .filter((cell) => cell.numeric === null)
        .map((cell) => cell.displayed)
        .join(" ");
      const sterlingContext =
        /\b(?:GBP|pounds? sterling|British pounds?|United Kingdom|UK)\b/i.test(
          text,
        );
      const codes = text.match(/\b[A-Z]{3}\b/g) ?? [];
      const conflictingCurrency =
        codes.some((code) => currencies.has(code) && code !== "GBP") ||
        /[$€¥]|\b(?:Egyptian|Lebanese|Syrian|Sudanese) pounds?\b/i.test(text);
      if (sterlingContext && !conflictingCurrency) rawCurrency = "GBP";
    }
    const parsed = currencyToken(rawCurrency);
    if (!parsed) return invalid("currency");
    currency = parsed.currency;
    embeddedScale = parsed.scale;
  }
  let scale: string | null = null;
  if (statement.scale !== null) {
    const raw = statement.scale.trim().toLowerCase();
    if (Object.hasOwn(scales, raw)) scale = scales[raw];
    else {
      const parsed = currencyToken(raw);
      if (
        !parsed ||
        !parsed.scale ||
        currency === null ||
        parsed.currency !== currency
      )
        return invalid("scale");
      scale = parsed.scale;
    }
  }
  if (embeddedScale && scale && embeddedScale !== scale)
    invalid("scale", "METADATA_SCALE_CONFLICT");
  if (
    currency &&
    source &&
    conflictingSourceCurrency(statement, source, currency)
  )
    invalid("currency");
  return { ...statement, currency, scale: embeddedScale ?? scale };
}
