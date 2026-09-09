import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const editorial = readFileSync("app/financial-intelligence-launch/EditorialExperience.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/launch.module.css", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const analytics = readFileSync("app/financial-intelligence-launch/FinancialIntelligenceAnalytics.tsx", "utf8");
const sharedAnalytics = readFileSync("lib/analytics.ts", "utf8");

test("direct pricing and checkout stay private while the pilot is refined", () => {
  assert.doesNotMatch(page + editorial, /€490|€588|buy\.stripe\.com|secure checkout/i);
  assert.match(editorial, /Commission a pilot/);
  assert.match(editorial, /contact\?topic=financial-data/);
});

test("the article follows a premium editorial argument", () => {
  const sections = ["The premise", "From document to evidence", "The controlled workflow", "Proof, not plausibility", "The output", "The manifesto", "Founding pilot"];
  let cursor = -1;
  for (const section of sections) {
    const next = editorial.indexOf(section);
    assert.ok(next > cursor, `${section} follows the prior section`);
    cursor = next;
  }
  assert.match(editorial, /Financial data deserves more than an AI answer/);
  assert.match(editorial, /A defensible financial state/);
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

test("the light editorial system is responsive and has no scroll effects", () => {
  assert.match(css, /--paper:#fff7ef/);
  assert.match(css, /Georgia,"Times New Roman",serif/);
  assert.match(css, /@media\(max-width:900px\)/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(editorial, /useEffect|IntersectionObserver|requestAnimationFrame|data-scene|<video|autoplay/i);
  assert.doesNotMatch(css, /position:sticky|@keyframes|animation:|clip-path|filter:blur|scroll-snap/i);
});
