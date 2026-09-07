import { AgentError } from "../../lib/errors";
import { modelStatementSchema } from "./contract";

export type ValidationDiagnostics = {
  validationFailureCode: string;
  failedPath: string;
  missingRequiredFields: string[];
  expectedType: string;
  receivedType: string;
  category:
    | "schema_contract"
    | "source_association"
    | "source_value"
    | "statement_selection";
  jsonParsingSucceeded: boolean;
  schemaValidationSucceeded: boolean;
};
export class ValidationFailure extends AgentError {
  constructor(public readonly diagnostics: ValidationDiagnostics) {
    super(
      "OPENAI_RESPONSE_INVALID",
      422,
      "The financial response could not be verified.",
    );
  }
}
export function reject(
  code: string,
  path: string,
  expected: string,
  received: string,
  category: ValidationDiagnostics["category"] = "source_association",
): never {
  throw new ValidationFailure({
    validationFailureCode: code,
    failedPath: path,
    missingRequiredFields: [],
    expectedType: expected,
    receivedType: received,
    category,
    jsonParsingSucceeded: true,
    schemaValidationSucceeded: true,
  });
}
const fields = new Set([
  "statementType",
  "entity",
  "currency",
  "scale",
  "periods",
  "lines",
  "sourceRow",
  "label",
  "concept",
  "aggregationRole",
  "values",
  "period",
  "sourceRef",
]);
const safePath = (path: PropertyKey[]) =>
  path.length
    ? path
        .map((part, i) =>
          typeof part === "number"
            ? `[${part}]`
            : `${i ? "." : ""}${fields.has(String(part)) ? String(part) : "[unknown-field]"}`,
        )
        .join("")
    : "$";
const kind = (value: unknown) =>
  value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
export function parseModelStatement(text: string) {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ValidationFailure({
      validationFailureCode: "JSON_PARSE_FAILED",
      failedPath: "$",
      missingRequiredFields: [],
      expectedType: "JSON object",
      receivedType: "invalid JSON",
      category: "schema_contract",
      jsonParsingSucceeded: false,
      schemaValidationSucceeded: false,
    });
  }
  const parsed = modelStatementSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  const at = (path: PropertyKey[]) =>
    path.reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<PropertyKey, unknown>)[key]
          : undefined,
      raw,
    );
  const first = parsed.error.issues[0];
  const missing = parsed.error.issues
    .filter(
      (issue) => issue.code === "invalid_type" && at(issue.path) === undefined,
    )
    .map((issue) => safePath(issue.path));
  throw new ValidationFailure({
    validationFailureCode:
      first.code === "invalid_value"
        ? "INVALID_ENUM_CATEGORY"
        : first.code === "unrecognized_keys"
          ? "UNEXPECTED_FIELDS"
          : missing.length
            ? "MISSING_REQUIRED_FIELDS"
            : "SCHEMA_TYPE_OR_CONSTRAINT",
    failedPath: safePath(first.path),
    missingRequiredFields: missing,
    expectedType:
      "expected" in first
        ? String(first.expected)
        : first.code === "invalid_value"
          ? "allowed enum member"
          : first.code === "unrecognized_keys"
            ? "only declared fields"
            : "schema constraint",
    receivedType: kind(at(first.path)),
    category: "schema_contract",
    jsonParsingSucceeded: true,
    schemaValidationSucceeded: false,
  });
}
