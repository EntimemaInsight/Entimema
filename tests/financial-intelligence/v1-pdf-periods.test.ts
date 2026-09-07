import assert from "node:assert/strict";
import test from "node:test";
import { pdfPeriodMatches } from "../../backend/financial-intelligence/v1/pdf-periods";
import type {
  Cell,
  Source,
} from "../../backend/financial-intelligence/v1/reader";
function fixture(lines: string[][]): Source {
  const cells = new Map<string, Cell>();
  lines.forEach((tokens, r) =>
    tokens.forEach((text, c) => {
      const ref = "p1:l" + (r + 1) + ":t" + (c + 1);
      cells.set(ref, {
        ref,
        sheet: "Page 1",
        row: r + 1,
        column: c + 1,
        raw: text,
        displayed: text,
        numeric: /^\d+(?:\.\d+)?$/.test(text) ? Number(text) : null,
      });
    }),
  );
  return { cells, text: "", format: "pdf" };
}
test("PDF split full date supports a source-grounded complete period", () => {
  const s = fixture([
    ["Profit", "&", "Loss"],
    ["December", "31st,", "20", "22"],
    ["DEC", "31", ",", "22"],
    ["Services", "Revenue", "96897.30"],
    ["Total", "Income", "96897.30"],
  ]);
  const token = s.cells.get("p1:l4:t3")!;
  assert.equal(pdfPeriodMatches(s, token, "December 31, 2022"), true);
  assert.equal(pdfPeriodMatches(s, token, "2022"), true);
  assert.equal(pdfPeriodMatches(s, token, "2023"), false);
  assert.equal(pdfPeriodMatches(s, token, "November 30, 2022"), false);
  assert.equal(s.cells.get("p1:l2:t3")?.raw, "20");
});
test("PDF actual period columns reject swapped bindings and unsupported years", () => {
  const s = fixture([
    ["Year", "ended"],
    ["31", "December", "2025", "31", "December", "2024"],
    ["Revenue", "100", "80"],
    ["Profit", "20", "10"],
  ]);
  assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l3:t2")!, "2025"), true);
  assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l3:t3")!, "2024"), true);
  assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l3:t2")!, "2024"), false);
});
test("PDF conflicting headers and incomplete column rows fail closed", () => {
  for (const headers of [
    [
      ["2025", "2024"],
      ["2024", "2025"],
    ],
    [
      ["December", "31", "2025"],
      ["June", "30", "2025"],
    ],
  ]) {
    const s = fixture([
      ...headers,
      ["Revenue", "100", "80"],
      ["Profit", "20", "10"],
    ]);
    assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l3:t2")!, "2025"), false);
  }
  const s = fixture([
    ["2025", "2024"],
    ["Revenue", "100"],
    ["Profit", "20", "10"],
  ]);
  assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l2:t2")!, "2025"), false);
});
test("abbreviated PDF date needs full-year source evidence and rejects contradictions", () => {
  for (const short of ["DEC 31 , 22", "DEC 31 , 23"]) {
    const s = fixture([
      ["December", "31st,", "20", "22"],
      short.split(" "),
      ["Revenue", "100"],
      ["Profit", "20"],
    ]);
    assert.equal(
      pdfPeriodMatches(s, s.cells.get("p1:l3:t2")!, "DEC 31 , 22"),
      short.endsWith("22"),
    );
  }
  const s = fixture([
    ["DEC", "31", ",", "22"],
    ["Revenue", "100"],
    ["Profit", "20"],
  ]);
  assert.equal(pdfPeriodMatches(s, s.cells.get("p1:l2:t2")!, "2022"), false);
});
