import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { buildSync } from "esbuild";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Result } from "../../backend/financial-intelligence/v1/contract";
import { resultFixtures } from "./result-fixtures";
mkdirSync("build/result-tests", { recursive: true });
const output = resolve("build/result-tests/component.cjs");
buildSync({
  entryPoints: ["app/workspace/components/FinancialIntelligenceResult.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: output,
  jsx: "automatic",
  external: ["react", "react/jsx-runtime"],
  logLevel: "silent",
});
const { FinancialIntelligenceResult, sourceLocation, financialNumber } =
  createRequire(import.meta.url)(output);
const render = (result: Result) =>
  renderToStaticMarkup(createElement(FinancialIntelligenceResult, { result }));
test("result hierarchy renders existing summary/findings; technical telemetry never appears", () => {
  const result = resultFixtures().controlled,
    before = structuredClone(result),
    html = render(result);
  let last = -1;
  for (const title of [
    "Executive Summary",
    "Key Performance Indicators",
    "Key Findings",
    "Verified Income Statement",
    "Source Evidence",
  ]) {
    const position = html.indexOf(title);
    assert.ok(position > last, title);
    last = position;
  }
  assert.ok(html.includes(result.analysis.executiveSummary));
  assert.match(html, />Download PDF<\/button>/);
  assert.doesNotMatch(html, /gpt-4\.1|aiCalls|totalMs|p1:l4:t2/);
  assert.equal(
    (html.match(/Calculated from verified values/g) ?? []).length,
    6,
  );
  assert.equal((html.match(/<details/g) ?? []).length, 12);
  assert.doesNotMatch(html, /<details[^>]* open/);
  assert.deepEqual(result, before);
});
test("long successful results remain in the document scroll flow", () => {
  const workspace = readFileSync(
    "app/workspace/components/FinancialIntelligenceWorkspace.tsx",
    "utf8",
  );
  const workspaceCss = readFileSync("app/workspace/workspace.css", "utf8");
  const resultCss = readFileSync(
    "app/workspace/components/FinancialIntelligenceResult.module.css",
    "utf8",
  );

  assert.match(workspace, /financialIntelligenceWorkspace/);
  assert.match(
    workspaceCss,
    /body:has\(\.workspaceRoot>\.financialIntelligenceWorkspace\)\{overflow-x:hidden;overflow-y:auto\}/,
  );
  assert.match(
    workspaceCss,
    /\.workspaceRoot:has\(>\.financialIntelligenceWorkspace\)\{position:relative;inset:auto;min-height:100svh\}/,
  );
  assert.match(resultCss, /\.tableScroll\s*\{\s*overflow-x:\s*auto;/);

  const html = render(resultFixtures().rieter);
  assert.ok(html.includes("Download PDF"));
  assert.ok(html.indexOf("Executive Summary") < html.indexOf("Source Evidence"));
});
test("Rieter sign changes retain operands without conventional growth percentages", () => {
  const result = resultFixtures().rieter,
    html = render(result);
  assert.equal((html.match(/Positive to negative/g) ?? []).length, 2);
  assert.ok(html.includes("(43.9)"));
  assert.ok(html.includes("(63.4)"));
  assert.ok(html.includes("Basic earnings per share (CHF)"));
  assert.ok(html.includes("Diluted earnings per share (CHF)"));
  assert.ok(html.includes("18 source lines"));
  assert.ok(html.includes("36"));
  assert.doesNotMatch(html, /-256\.79|-709\.62/);
});
test("unavailable and zero-prior states are readable and never fake zero percentages", () => {
  const html = render(resultFixtures().missing);
  assert.ok(html.includes("Unavailable"));
  assert.ok(html.includes("Not meaningful"));
  assert.doesNotMatch(html, /NaN|Infinity/);
  assert.ok(html.includes("The prior-period value is zero."));
});
test("every statement label/value is preserved and evidence is human-readable for XLSX/PDF", () => {
  for (const result of Object.values(resultFixtures())) {
    const html = render(result);
    for (const line of result.lines)
      for (const value of line.values)
        assert.ok(html.includes(financialNumber(value.value)));
  }
  assert.equal(sourceLocation("'O''Brien'!AA12"), "Sheet O'Brien, cell AA12");
  assert.equal(sourceLocation("p1:l4:t2"), "Page 1, line 4, token 2");
  assert.equal(
    sourceLocation("unrecognized-internal-token"),
    "Source location unavailable",
  );
  const pdf = resultFixtures().controlled;
  pdf.lines.forEach((l) =>
    l.values.forEach((v, i) => (v.sourceRef = `p1:l${l.sourceRow}:t${i + 2}`)),
  );
  const html = render(pdf);
  assert.doesNotMatch(html, /p1:l\d+:t\d+/);
  assert.ok(html.includes("Page 1, line"));
});
