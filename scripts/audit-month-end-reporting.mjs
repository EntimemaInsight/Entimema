import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const slug = "month-end-reporting-workflow";
const source = readFileSync("app/resources/MonthEndReportingWorkflowArticle.tsx", "utf8");
const ast = ts.createSourceFile("article.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const article = ast.statements.find(ts.isFunctionDeclaration);
const parts = [], tables = new Map();
function visit(node) {
  if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === "ResourceTable") {
    const attrs = node.attributes.properties;
    const caption = attrs.find(a => a.name?.getText(ast) === "caption").initializer.text;
    const rows = attrs.find(a => a.name?.getText(ast) === "rows").initializer.expression;
    assert(ts.isArrayLiteralExpression(rows));
    tables.set(caption, rows.elements.map(row => row.elements.map(cell => cell.text)));
  }
  if (ts.isJsxText(node)) { parts.push(node.text); return; }
  if (ts.isJsxAttribute(node) && ["className", "href", "id", "key", "src", "style"].includes(node.name.getText(ast))) return;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) { parts.push(node.text); return; }
  ts.forEachChild(node, visit);
}
visit(article.body);
const words = parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
const minutes = Math.round(words / 220);
assert(words < 4500 && minutes >= 18 && minutes <= 22, `${words} words / ${minutes} min`);
const table = prefix => [...tables].find(([caption]) => caption.startsWith(prefix))[1];
const close = (a, b) => assert(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const capture = pattern => { const m = source.match(pattern); assert(m, String(pattern)); return Number(m[1].replaceAll(",", "")); };
const revenue = capture(/revenue is EUR ([\d.]+)m/);
const grossBefore = capture(/gross profit EUR ([\d.]+)m/);
const grossAfter = capture(/reduces gross profit to EUR ([\d.]+)m/);
const writeDown = capture(/evidenced EUR ([\d,]+) inventory write-down/) / 1e6;
const accrual = capture(/Manual accrual EUR ([\d,]+) unsupported/) / 1e6;
close(grossBefore - writeDown, grossAfter);
close(grossBefore / revenue * 100, capture(/margin moves from ([\d.]+)%/));
close(grossAfter / revenue * 100, capture(/% to ([\d.]+)%/));
close(writeDown / revenue * 100, capture(/a ([\d.]+)-point decline/));
close(capture(/unadjusted operating profit was EUR ([\d.]+)m/) - writeDown - accrual, capture(/final operating profit is EUR ([\d.]+)m/));
const receipt = source.match(/Receipt is (\d+)\/(\d+); authoritative valid coverage is only (\d+)\/(\d+)/);
assert(receipt); close(Number(receipt[1]), 12); close(Number(receipt[2]), 12);
close(Number(receipt[1]) - 2, Number(receipt[3])); close(Number(receipt[2]), Number(receipt[4]));
assert.equal(table("Eight synthetic exceptions").length, 8);
assert.equal(table("Stage contract").length, 21);
assert.equal(table("Failure →").length, 20);
assert.equal(table("Decision-readiness").length, 9);
const timing = table("Fictional timing comparison");
assert.deepEqual(timing.slice(0,4).map(r => r.slice(1)), [["Day 4","Day 2"],["Day 6","Day 3"],["Day 7","Day 4"],["Day 8","Day 5"]]);
assert(source.includes("no immediate P&amp;L effect") && source.includes("each recognised once"));
assert(source.includes("implementation architecture to specify and validate"));
const registry = readFileSync("app/resources/resource-data.ts", "utf8");
const record = registry.split("// FIR-10;")[1].split("// FIR-09;")[0];
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-data-and-erp", stream: "insights"'));
assert.equal((registry.match(new RegExp(`slug: "${slug}"`, "g")) || []).length, 1);
const root = ".next/server/app";
const html = readFileSync(`${root}/resources/${slug}.html`, "utf8");
assert(html.replace(/<!--.*?-->/g, "").includes(`${minutes} min read`));
for (const [, href] of source.matchAll(/href="(\/[^"#]+)"/g)) {
  assert(href.startsWith("/resources/") ? existsSync(`${root}${href}.html`) : existsSync(`app${href}/page.tsx`), href);
}
for (const [, id] of source.matchAll(/id: "([^"]+)"/g)) assert(html.includes(`id="${id}"`), id);
const png = readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(png.readUInt32BE(16), 1536); assert.equal(png.readUInt32BE(20), 1024);
assert(!png.equals(readFileSync("public/resources/covers/profit-vs-cash-flow-reconstruction.png")));
console.log(`FIR-10: ${words} words / ${minutes} min. Source coverage, eight exceptions, margin and profit arithmetic, timeline, stage contracts, readiness, links, reading parity and unique cover passed.`);
