import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const explainer = readFileSync("app/financial-intelligence-launch/ProductExplainer.tsx", "utf8");
const checkout = readFileSync("app/financial-intelligence-launch/PilotCheckout.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/launch.module.css", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const analytics = readFileSync("app/financial-intelligence-launch/FinancialIntelligenceAnalytics.tsx", "utf8");
const sharedAnalytics = readFileSync("lib/analytics.ts", "utf8");

test("the live pilot keeps both controlled B2B checkout routes", () => {
  assert.match(checkout, /Business established in Bulgaria/);
  assert.match(checkout, /Business established outside Bulgaria/);
  assert.match(checkout, /€490 \+ €98 Bulgarian VAT/);
  assert.match(checkout, /verified business status/i);
  assert.equal((checkout.match(/https:\/\/buy\.stripe\.com\//g) ?? []).length, 2);
  assert.match(checkout, /contact\?topic=financial-data/);
});

test("the product page communicates a financial evidence-to-decision system", () => {
  const sections = ["Financial Intelligence", "ENTIMEMA SYSTEM", "<ProductExplainer />", "CONTROLLED RESULT", "<PilotCheckout />"];
  let cursor = -1;
  for (const section of sections) { const next = page.indexOf(section); assert.ok(next > cursor, `${section} follows the prior section`); cursor = next; }
  for (const layer of ["Intelligent Intake", "Financial Context", "Validation Engine", "Exception Workspace", "Decision Output"]) assert.match(page, new RegExp(layer));
  assert.match(page, /Financial data you can/);
  assert.match(page, /actually make decisions with/);
});

test("the hero workspace makes product operation visible", () => {
  for (const surface of ["SOURCES", "Execution path", "VALUE INSPECTOR", "Understand sources", "Map financial values", "Validate &amp; reconcile", "Resolve exception", "Decision-ready model"]) assert.match(page, new RegExp(surface));
  assert.match(page, /€18,420,000/);
  assert.match(page, /Gross profit identity reconciles/);
  assert.match(page, /CONTROL PASSED/);
});

test("the controlled execution preserves model, rules and human responsibility", () => {
  for (const stage of ["Evidence", "Meaning", "Control", "Review", "Decision"]) assert.match(explainer, new RegExp(stage));
  assert.match(explainer, /Revenue − COGS = Gross profit/);
  assert.match(explainer, /Difference €0/);
  assert.match(explainer, /Evidence attached/);
  assert.match(explainer, /aria-live="polite"/);
  assert.match(explainer, /prefers-reduced-motion: reduce/);
});

test("conversion and metadata remain measurable and canonical", () => {
  assert.match(page, /FinancialIntelligenceViewAnalytics/);
  assert.match(page, /kind="start_pilot"/);
  assert.match(checkout, /domestic_checkout/);
  assert.match(checkout, /international_checkout/);
  assert.match(analytics, /decision_workspace/);
  assert.match(analytics, /financial_intelligence_view/);
  assert.match(analytics, /financial_intelligence_cta_click/);
  assert.match(sharedAnalytics, /hasAnalyticsConsent\(\)/);
  assert.match(page, /alternates: \{ canonical: url \}/);
  assert.match(page, /FOUNDER_ID/);
  assert.match(page, /ORGANIZATION_ID/);
  assert.match(page, /"@type": "WebPage"/);
  assert.match(sitemap, /"\/financial-intelligence-launch"/);
});

test("the new product system is responsive and motion-safe", () => {
  assert.match(css, /@media\(max-width:1100px\)/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /@media\(max-width:460px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /min-height:50px/);
  assert.doesNotMatch(page + explainer, /<video|autoplay/i);
});
