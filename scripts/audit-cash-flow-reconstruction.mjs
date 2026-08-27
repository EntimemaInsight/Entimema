import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const slug = "profit-vs-cash-flow-reconstruction";
const source = readFileSync("app/resources/CashFlowReconstructionArticle.tsx", "utf8");
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
assert(words < 4500 && minutes >= 18 && minutes <= 22, `${words} words / ${minutes} minutes`);
const table = prefix => [...tables].find(([caption]) => caption.startsWith(prefix))[1];
const num = v => Number(v.replaceAll("−", "-"));
const close = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-9, `${label}: ${actual} != ${expected}`);
const pnl = new Map(table("Current P&L").map(([key, value]) => [key, num(value)]));
close(pnl.get("Revenue") + pnl.get("Operating costs before items below"), pnl.get("Adjusted EBITDA"), "EBITDA");
close(pnl.get("Adjusted EBITDA") + pnl.get("Depreciation") + pnl.get("Intangible impairment") + pnl.get("Disposal gain"), pnl.get("Operating profit"), "Operating profit");
close(pnl.get("Operating profit") + pnl.get("Interest expense"), pnl.get("Profit before tax"), "PBT");
close(pnl.get("Profit before tax") + pnl.get("Current tax expense"), pnl.get("Profit after tax"), "PAT");
const bsRows = table("Opening and closing Balance Sheets");
const bs = new Map(bsRows.map(([key, ...values]) => [key, values.map(num)]));
for (const c of [0, 1]) {
  close(bsRows.slice(0, 6).reduce((a, r) => a + num(r[c + 1]), 0), bs.get("Total assets")[c], "Asset total");
  close(bsRows.slice(7, 12).reduce((a, r) => a + num(r[c + 1]), 0), bs.get("Total liabilities")[c], "Liability total");
  close(bs.get("Total liabilities")[c] + bs.get("Equity")[c], bs.get("Total assets")[c], "Balance Sheet equation");
  close(bs.get("Liabilities and equity")[c], bs.get("Total assets")[c], "Displayed total");
}
let running = 0;
const bridgeRows = table("Complete profit-to-cash bridge");
const bridge = new Map(bridgeRows.map(([key, value]) => [key, num(value)]));
for (const [label, value, total] of bridgeRows) { running += num(value); close(running, num(total), label); }
close(running, 0, "Net change");
close(bridge.get("Profit after tax"), pnl.get("Profit after tax"), "Bridge PAT");
close(bridge.get("Reverse current tax expense"), -pnl.get("Current tax expense"), "Tax reversal");
close(bridge.get("Add depreciation"), -pnl.get("Depreciation"), "Depreciation reversal");
close(bridge.get("Add intangible impairment"), -pnl.get("Intangible impairment"), "Impairment reversal");
close(bridge.get("Remove disposal gain"), -pnl.get("Disposal gain"), "Gain reversal");
for (const [balance, label, sign] of [["Trade receivables", "Receivables increase", -1], ["Inventory", "Inventory increase", -1], ["Prepayments", "Prepayments increase", -1], ["Trade payables", "Payables increase", 1], ["Operating accruals", "Operating accruals increase", 1]]) {
  close(sign * (bs.get(balance)[1] - bs.get(balance)[0]), bridge.get(label), label);
}
close(-pnl.get("Current tax expense") + bs.get("Current tax payable")[0] - bs.get("Current tax payable")[1], -bridge.get("Pay current tax"), "Tax settlement");
close(bs.get("Interest payable")[0], bs.get("Interest payable")[1], "No extra interest adjustment");
close(bs.get("Net PPE")[0] - bridge.get("Cash capex") - (bridge.get("Disposal proceeds") - pnl.get("Disposal gain")) + pnl.get("Depreciation"), bs.get("Net PPE")[1], "PPE roll-forward");
close(bs.get("Indefinite-lived intangible")[0] + pnl.get("Intangible impairment"), bs.get("Indefinite-lived intangible")[1], "Impairment location");
close(bs.get("Debt")[0] + bridge.get("Cash borrowing") + bridge.get("Principal repayment"), bs.get("Debt")[1], "Debt roll-forward");
close(bs.get("Equity")[0] + pnl.get("Profit after tax") + bridge.get("Dividends paid") + bridge.get("FX translation of cash"), bs.get("Equity")[1], "Equity and OCI");
const flows = new Map(table("Cash-flow categories").map(([key, value]) => [key, num(value)]));
const sum = rows => rows.reduce((a, row) => a + num(row[1]), 0);
close(sum(bridgeRows.slice(0, 11)), flows.get("Operating cash"), "Operating subtotal");
close(sum(bridgeRows.slice(11, 13)), flows.get("Investing cash"), "Investing subtotal");
close(sum(bridgeRows.slice(13, 16)), flows.get("Financing cash"), "Financing subtotal");
close(sum(bridgeRows.slice(0, 16)), flows.get("Movement before currency translation"), "Before FX");
close(flows.get("FX effect on cash"), bridge.get("FX translation of cash"), "FX");
close(flows.get("Opening cash"), bs.get("Cash and cash equivalents")[0], "Opening cash");
close(flows.get("Opening cash") + running, flows.get("Reconstructed closing cash"), "Cash reconciliation");
close(flows.get("Reported closing cash"), bs.get("Cash and cash equivalents")[1], "Closing cash");
close(flows.get("Reported closing cash") - flows.get("Reconstructed closing cash"), flows.get("Unexplained residual"), "Residual");
close(flows.get("Net cash movement"), running, "Displayed movement");
const registry = readFileSync("app/resources/resource-data.ts", "utf8");
assert.equal((registry.match(new RegExp(`slug: "${slug}"`, "g")) || []).length, 1);
assert(registry.split("// FIR-09;")[1].split('status: "published"')[0].includes(`readingMinutes: ${minutes}`));
const root = ".next/server/app";
const html = readFileSync(join(root, "resources", `${slug}.html`), "utf8");
assert(html.replace(/<!--.*?-->/g, "").includes(`${minutes} min read`));
for (const [, href] of source.matchAll(/href="([^"#]+)"/g)) {
  if (href.startsWith("/resources/")) assert(existsSync(join(root, `${href.slice(1)}.html`)), href);
  else if (href.startsWith("/")) assert(existsSync(join("app", href.slice(1), "page.tsx")), href);
}
for (const [, id] of source.matchAll(/id: "([^"]+)"/g)) assert(html.includes(`id="${id}"`), id);
const png = readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(png.readUInt32BE(16), 1536); assert.equal(png.readUInt32BE(20), 1024);
assert(source.includes("provisional") && source.includes("periods do not align"));
console.log(`FIR-09: ${words} words / ${minutes} min. P&L, both Balance Sheets, cash signs, bridge running totals, tax, PPE, debt, equity, cash, residual, links, sections, reading parity and cover passed.`);
