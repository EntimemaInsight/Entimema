import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/demo/financial-intelligence/page.tsx", "utf8");
const demo = readFileSync("app/demo/financial-intelligence/FinancialIntelligenceDemo.tsx", "utf8");
const menu = readFileSync("lib/mega-menu-content.ts", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");

test("publishes the Financial Intelligence demo from What's new", () => {
  assert.match(menu, /href: "\/demo\/financial-intelligence"/);
  assert.match(sitemap, /"\/demo\/financial-intelligence"/);
  assert.match(page, /FinancialIntelligenceDemo/);
});

test("demo uses fictional pre-validated data and does not expose customer ingestion", () => {
  assert.match(demo, /DEMONSTRATION DATA/);
  assert.match(demo, /Fictional company/);
  assert.match(demo, /Pre-validated/);
  assert.doesNotMatch(demo, /type="file"|fetch\(|\/api\/|signIn|Login/);
});

test("demo converts to a controlled pilot inquiry", () => {
  assert.match(demo, /href="\/pilot\/financial-intelligence"/);
  assert.match(demo, /Configure your pilot/);
});

test("completed demo provides a viewable and downloadable CFO sample report", () => {
  const reportPath = "public/demo/Entimema_Financial_Intelligence_Northstar_FY2025.pdf";
  const report = readFileSync(reportPath);
  assert.equal(report.subarray(0, 5).toString(), "%PDF-");
  assert.ok(statSync(reportPath).size > 20_000);
  assert.match(demo, /View full sample report/);
  assert.match(demo, /Download sample report · PDF/);
  assert.match(demo, /download="Entimema_Financial_Intelligence_Northstar_FY2025\.pdf"/);
});
