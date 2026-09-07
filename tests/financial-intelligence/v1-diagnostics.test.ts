import assert from "node:assert/strict";
import test from "node:test";
import {
  parseModelStatement,
  ValidationFailure,
} from "../../backend/financial-intelligence/v1/diagnostics";
import { bindSourceValues } from "../../backend/financial-intelligence/v1/bind";
import { verifyStatement } from "../../backend/financial-intelligence/v1/verify";
import { readMechanically } from "../../backend/financial-intelligence/v1/reader";
import { goldDocument, goldModelStatement } from "./gold";

function diagnostic(run: () => unknown, code: string, path: string) {
  assert.throws(run, (error: unknown) => {
    assert.ok(error instanceof ValidationFailure);
    assert.equal(error.diagnostics.validationFailureCode, code);
    assert.equal(error.diagnostics.failedPath, path);
    assert.ok(!JSON.stringify(error.diagnostics).includes("PRIVATE_CUSTOMER"));
    return true;
  });
}
test("privacy-safe diagnostics distinguish malformed JSON, missing fields, enums, types and extra numeric values", () => {
  diagnostic(
    () => parseModelStatement("PRIVATE_CUSTOMER"),
    "JSON_PARSE_FAILED",
    "$",
  );
  const missing = { ...goldModelStatement(), currency: undefined };
  diagnostic(
    () => parseModelStatement(JSON.stringify(missing)),
    "MISSING_REQUIRED_FIELDS",
    "currency",
  );
  diagnostic(
    () =>
      parseModelStatement(
        JSON.stringify({
          ...goldModelStatement(),
          statementType: "PRIVATE_CUSTOMER",
        }),
      ),
    "INVALID_ENUM_CATEGORY",
    "statementType",
  );
  diagnostic(
    () =>
      parseModelStatement(
        JSON.stringify({ ...goldModelStatement(), periods: 42 }),
      ),
    "SCHEMA_TYPE_OR_CONSTRAINT",
    "periods",
  );
  const numeric = goldModelStatement();
  Object.assign(numeric.lines[0].values[0], { value: 999999 });
  diagnostic(
    () => parseModelStatement(JSON.stringify(numeric)),
    "UNEXPECTED_FIELDS",
    "lines[0].values[0]",
  );
  diagnostic(
    () =>
      parseModelStatement(
        JSON.stringify({ ...goldModelStatement(), PRIVATE_CUSTOMER: "secret" }),
      ),
    "UNEXPECTED_FIELDS",
    "$",
  );
});
test("source binding owns all 18 numbers and diagnostics preserve source errors without financial data", async () => {
  const source = await readMechanically(await goldDocument());
  const model = goldModelStatement();
  const statement = bindSourceValues(model, source);
  assert.equal(verifyStatement(statement, source), 18);
  assert.equal(statement.lines[0].values[0].value, 1200);
  assert.ok(!("value" in model.lines[0].values[0]));
  const cases: [
    string,
    string,
    (s: ReturnType<typeof goldModelStatement>) => void,
  ][] = [
    [
      "SOURCE_REF_FORMAT",
      "lines[0].values[0].sourceRef",
      (s) => {
        s.lines[0].values[0].sourceRef = "B5";
      },
    ],
    [
      "SOURCE_REF_NOT_FOUND",
      "lines[0].values[0].sourceRef",
      (s) => {
        s.lines[0].values[0].sourceRef = "'PRIVATE_CUSTOMER'!B5";
      },
    ],
    [
      "SOURCE_NOT_NUMERIC",
      "lines[0].values[0].sourceRef",
      (s) => {
        s.lines[0].values[0].sourceRef = "'P&L'!A1";
      },
    ],
    [
      "DUPLICATE_LINE",
      "lines[9]",
      (s) => {
        s.lines.push(s.lines[0]);
      },
    ],
    [
      "PERIOD_HEADER_MISMATCH",
      "lines[0].values[0].period",
      (s) => {
        s.lines[0].values[0].period = "2024";
        s.lines[0].values[1].period = "2025";
      },
    ],
    [
      "SOURCE_LABEL_MISMATCH",
      "lines[0].label",
      (s) => {
        s.lines[0].label = "PRIVATE_CUSTOMER";
      },
    ],
  ];
  for (const [code, path, mutate] of cases) {
    const copy = goldModelStatement();
    mutate(copy);
    diagnostic(
      () => verifyStatement(bindSourceValues(copy, source), source),
      code,
      path,
    );
  }
});
