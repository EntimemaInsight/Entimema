import assert from "node:assert/strict";
import test from "node:test";
import {
  pdfNotation,
  pdfNumber,
  pdfTokens,
  normalizePdfNumbers,
} from "../../backend/financial-intelligence/v1/pdf-numbers";
import {
  sourceNumber,
  type Cell,
} from "../../backend/financial-intelligence/v1/reader";
test("PDF notation uses explicit decimal evidence and preserves grouped numbers/signs/EPS", () => {
  const notation = pdfNotation(["12,500", "(7,800)", "0.89", "0.88"]);
  assert.equal(notation, ".");
  for (const [text, value] of [
    ["12,500", 12500],
    ["(7,800)", -7800],
    ["1,765", 1765],
    ["(620)", -620],
    ["0.89", 0.89],
    ["-950", -950],
    ["12 500", 12500],
  ] as const)
    assert.equal(pdfNumber(text, notation), value);
  assert.equal(pdfNumber("1.234", pdfNotation(["0,89"])), 1234);
  assert.equal(pdfNumber("1,234", pdfNotation(["0,89"])), 1.234);
});
test("PDF rejects unresolved separators, conflicting notation and malformed groups", () => {
  for (const token of ["1,234", "1.234", "12,500"])
    assert.equal(pdfNumber(token, pdfNotation([token])), null);
  assert.equal(pdfNotation(["0.89", "0,89"]), null);
  for (const token of ["12,500", "1.234", "0.89"])
    assert.equal(pdfNumber(token, pdfNotation(["0.89", "0,89"])), null);
  for (const token of [
    "1,23,456",
    "1,,234",
    "12 50",
    "(-620)",
    "1.2.3",
    "12,500x",
    "1 234 56",
  ])
    assert.equal(pdfNumber(token, "."), null);
  assert.equal(
    sourceNumber("12,500"),
    null,
    "shared/XLSX parser remains unchanged",
  );
});
test("PDF original lexeme and native address survive normalization", () => {
  const tokens = pdfTokens("12 500");
  assert.deepEqual(tokens, ["12 500"]);
  const cell = (ref: string, raw: string): Cell => ({
    ref,
    sheet: "Page 1",
    row: 4,
    column: 2,
    raw,
    displayed: raw,
    numeric: null,
  });
  const amount = cell("p1:l4:t2", "12,500"),
    space = cell("p1:l5:t2", "12 500");
  const cells = new Map([
    [amount.ref, amount],
    [space.ref, space],
    ["p1:l8:t5", cell("p1:l8:t5", "0.89")],
  ]);
  normalizePdfNumbers(cells);
  assert.equal(amount.numeric, 12500);
  assert.equal(amount.raw, "12,500");
  assert.equal(amount.displayed, "12,500");
  assert.equal(amount.ref, "p1:l4:t2");
  assert.equal(space.numeric, 12500);
  assert.equal(space.raw, "12 500");
  assert.deepEqual(pdfTokens("Revenue 12500 11000"), [
    "Revenue",
    "12500",
    "11000",
  ]);
});
