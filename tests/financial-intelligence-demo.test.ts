import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  assert.match(demo, /intent=client/);
  assert.match(demo, /Start a controlled pilot/);
});
