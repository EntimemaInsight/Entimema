import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const explainer = readFileSync("app/financial-intelligence-launch/ProductExplainer.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/launch.module.css", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const analytics = readFileSync("app/financial-intelligence-launch/FinancialIntelligenceAnalytics.tsx", "utf8");
const sharedAnalytics = readFileSync("lib/analytics.ts", "utf8");

test("the live pilot has two explicit and controlled checkout routes", () => {
  assert.match(page, /ISSUE 01 · B2B PILOT/);
  assert.match(page, /BULGARIA B2B/);
  assert.match(page, /INTERNATIONAL B2B/);
  assert.match(page, /€490 \+ €98 VAT/);
  assert.match(page, /Subject to verified business status/);
  assert.equal((page.match(/https:\/\/buy\.stripe\.com\//g) ?? []).length, 2);
  assert.match(page, /contact\?topic=financial-data/);
});

test("the shortened narrative keeps the complete commercial argument", () => {
  const sections = ["THE PROBLEM", "<ProductExplainer />", "THE OUTPUT", "THE PILOT", "THE PRINCIPLE"];
  let cursor = -1;
  for (const section of sections) { const next = page.indexOf(section); assert.ok(next > cursor, `${section} follows the prior section`); cursor = next; }
  assert.match(explainer, /THE METHOD/);
  assert.match(page, /Financial documents in/);
  assert.match(page, /Validated analysis out/);
  assert.match(page, /A plausible answer is not a controlled financial result/);
  for (const output of ["Validated financial model", "Reconciled periods", "Visible exceptions", "Decision-ready analysis"]) assert.match(page, new RegExp(output));
});

test("the method preserves model, rules and human responsibility boundaries", () => {
  for (const stage of ["Interpret", "Control", "Review", "Decide"]) assert.match(explainer, new RegExp(stage));
  assert.match(explainer, /MODEL/);
  assert.match(explainer, /RULES/);
  assert.match(explainer, /HUMAN/);
  assert.match(explainer, /The workflow does not guess/);
  assert.match(explainer, /aria-live="polite"/);
  assert.match(explainer, /prefers-reduced-motion: reduce/);
});

test("commercial actions remain measurable without sending financial data", () => {
  assert.match(page, /FinancialIntelligenceViewAnalytics/);
  assert.match(page, /kind="start_pilot"/);
  assert.match(page, /kind="domestic_checkout"/);
  assert.match(page, /kind="international_checkout"/);
  assert.match(analytics, /financial_intelligence_view/);
  assert.match(analytics, /financial_intelligence_cta_click/);
  assert.match(sharedAnalytics, /hasAnalyticsConsent\(\)/);
  assert.match(sharedAnalytics, /isProductionAnalyticsHost\(\)/);
});

test("metadata, identity and public discovery remain canonical", () => {
  assert.match(page, /alternates: \{ canonical: url \}/);
  assert.match(page, /FOUNDER_ID/);
  assert.match(page, /ORGANIZATION_ID/);
  assert.match(page, /href="\/alexander-dimitrov"/);
  assert.match(page, /"@type": "WebPage"/);
  assert.match(sitemap, /"\/financial-intelligence-launch"/);
  assert.match(page, /<Navbar \/>/);
});

test("editorial motion and responsive rules resolve safely", () => {
  assert.match(css, /@keyframes proof/);
  assert.match(css, /@media\(max-width:900px\)/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /min-height:50px/);
  assert.doesNotMatch(css, /transition:all|animation:[^}]*infinite[^}]*linear/);
  assert.doesNotMatch(page + explainer, /<video|autoplay/i);
});
