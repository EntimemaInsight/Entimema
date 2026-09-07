import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { readMechanically } from "../../backend/financial-intelligence/v1/reader";
import { inspectFileBuffer } from "../../backend/lib/files";
import { instructions } from "../../backend/financial-intelligence/v1/core";

const document = (sheet: XLSX.WorkSheet) => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Arbitrary hierarchy");
  return inspectFileBuffer(
    "hierarchy.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    XLSX.write(book, { type: "buffer", bookType: "xlsx" }),
  );
};
test("mechanical hierarchy retains formulas, references, row gaps, formats and grouping without financial classification", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["Accounts"],
    [],
    ["Line", "2024", "2025", "Variance %"],
    ["  Product A", 30, 40],
    ["  Product B", 70, 80],
    ["Net Sales", 100, 120],
  ]);
  sheet.B6.f = "SUM(B4:B5)";
  sheet.C6.f = "SUM(C4:C5)";
  sheet.D4 = { t: "n", v: 0.2, z: "0.00%" };
  sheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
  sheet["!rows"] = [];
  sheet["!rows"][3] = { level: 1 };
  sheet["!rows"][4] = { level: 1 };
  const source = await readMechanically(document(sheet));
  assert.match(source.text, /mergedRanges \["A1:C1"\]/);
  assert.match(source.text, /BLANK_ROWS 2:2/);
  assert.match(source.text, /ROW 6/);
  assert.match(source.text, /"formula":"SUM\(B4:B5\)"/);
  assert.match(source.text, /"numberFormat":"0.00%"/);
  assert.match(source.text, /"rowOutlineLevel":1/);
  assert.match(source.text, /"  Product A"/);
  assert.equal(source.cells.get("'Arbitrary hierarchy'!B6")?.numeric, 100);
  assert.equal(source.cells.get("'Arbitrary hierarchy'!D4")?.numeric, 0.2);
  assert.doesNotMatch(source.text, /canonical|aggregationRole|"concept"/);
});
test("hierarchy metadata is subject to the same compact-input limit", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["Line", "2025"],
    ["Amount", 1],
  ]);
  sheet.B2.f = "1+".repeat(70000) + "1";
  await assert.rejects(
    readMechanically(document(sheet)),
    (e: unknown) =>
      e instanceof Error && "code" in e && e.code === "WORKBOOK_LIMIT_EXCEEDED",
  );
});
test("one-call contract separates analytical columns and source-defined aggregate concepts", () => {
  assert.match(instructions, /First identify actual reporting-period columns/);
  assert.match(instructions, /Variance, budget, percent, change, notes/);
  assert.match(instructions, /detail -> subtotal -> total/);
  assert.match(instructions, /never a component when the aggregate exists/);
  assert.match(instructions, /never calculate a replacement aggregate/);
});
