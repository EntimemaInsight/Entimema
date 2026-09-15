import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const editorial = readFileSync("app/financial-intelligence-launch/EditorialExperience.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/feature.module.css", "utf8");
const luxuryCss = readFileSync("app/financial-intelligence-launch/luxury.module.css", "utf8");
const reveal = readFileSync("app/financial-intelligence-launch/EditorialReveal.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const analytics = readFileSync("app/financial-intelligence-launch/FinancialIntelligenceAnalytics.tsx", "utf8");
const sharedAnalytics = readFileSync("lib/analytics.ts", "utf8");

test("the public route offers a controlled pilot without exposing checkout internals", () => {
  assert.doesNotMatch(page + editorial, /€490|€588|buy\.stripe\.com|secure checkout/i);
  assert.match(editorial, /Configure a paid pilot/);
  assert.match(editorial, /\/pilot\/financial-intelligence/);
});

test("the article follows a premium editorial argument", () => {
  const sections = ["The premise", "From document to evidence", "The controlled workflow", "Proof, not plausibility", "The output", "The operating standard"];
  let cursor = -1;
  for (const section of sections) {
    const next = editorial.indexOf(section);
    assert.ok(next > cursor, `${section} follows the prior section`);
    cursor = next;
  }
  assert.match(editorial, /A financial result is only useful when you can defend it/);
  assert.match(editorial, /A decision-ready financial state/);
  assert.ok(editorial.lastIndexOf("Test the workflow on your Income Statement") > cursor);
});

test("evidence, arithmetic and accountability remain visible", () => {
  for (const stage of ["Understand", "Structure", "Control", "Review", "Deliver"])
    assert.match(editorial, new RegExp(stage));
  for (const evidence of ["SRC–01 · Row 14", "€18,420,000", "€0 difference", "Human decision required", "Full evidence lineage attached"])
    assert.match(editorial, new RegExp(evidence));
});

test("conversion and metadata remain measurable and canonical", () => {
  assert.match(editorial, /FinancialIntelligenceViewAnalytics/);
  assert.match(editorial, /kind="start_pilot"/);
  assert.match(analytics, /decision_workspace/);
  assert.match(analytics, /financial_intelligence_view/);
  assert.match(analytics, /financial_intelligence_cta_click/);
  assert.match(sharedAnalytics, /hasAnalyticsConsent\(\)/);
  assert.match(page, /alternates: \{ canonical: url \}/);
  assert.match(page, /FOUNDER_ID/);
  assert.match(page, /ORGANIZATION_ID/);
  assert.match(page, /"@type": "Article"/);
  assert.match(sitemap, /"\/financial-intelligence-launch"/);
});

test("the static editorial core remains responsive and motion-safe", () => {
  assert.match(css, /--paper:#fff7ed/);
  assert.match(css, /Georgia/);
  assert.match(css, /@media\(max-width:900px\)/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(editorial, /useEffect|IntersectionObserver|requestAnimationFrame|data-scene|<video|autoplay/i);
  assert.doesNotMatch(css, /position:sticky|@keyframes|animation:|clip-path|filter:blur|scroll-snap/i);
});

test("the luxury edition presents the proposition early and reveals evidence progressively", () => {
  assert.match(editorial, /The entire proposition, in one view/);
  assert.match(editorial, /From source document to defensible financial decision/);
  assert.match(reveal, /IntersectionObserver/);
  assert.match(reveal, /prefers-reduced-motion: reduce/);
  assert.match(luxuryCss, /luxuryWaterfall/);
  assert.match(luxuryCss, /min-height: calc\(100svh - 72px\)/);
});
