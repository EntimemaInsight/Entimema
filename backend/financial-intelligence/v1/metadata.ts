import type { ModelStatement } from "./contract";
import { reject } from "./diagnostics";

const currencies = new Set(Intl.supportedValuesOf("currency"));
const scales: Record<string, string> = {
  unit: "units",
  units: "units",
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

/** Split explicit metadata only. Never convert, rescale or modify financial lines. */
export function normalizeMetadata(statement: ModelStatement): ModelStatement {
  let currency: string | null = null;
  let embeddedScale: string | null = null;
  if (statement.currency !== null) {
    const match = statement.currency
      .trim()
      .match(/^([a-z]{3})(?:\s+(units?|thousands?|millions?|billions?))?$/i);
    if (!match || !currencies.has(match[1].toUpperCase()))
      return invalid("currency");
    currency = match[1].toUpperCase();
    embeddedScale = match[2] ? scales[match[2].toLowerCase()] : null;
  }
  let scale: string | null = null;
  if (statement.scale !== null) {
    const raw = statement.scale.trim().toLowerCase();
    if (Object.hasOwn(scales, raw)) scale = scales[raw];
    else {
      const match = raw.match(
        /^([a-z]{3})\s+(units?|thousands?|millions?|billions?)$/,
      );
      if (!match || currency === null || match[1].toUpperCase() !== currency)
        return invalid("scale");
      scale = scales[match[2]];
    }
  }
  if (embeddedScale && scale && embeddedScale !== scale)
    invalid("scale", "METADATA_SCALE_CONFLICT");
  return { ...statement, currency, scale: embeddedScale ?? scale };
}
