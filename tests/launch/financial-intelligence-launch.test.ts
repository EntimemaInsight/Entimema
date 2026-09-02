import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const explainer = readFileSync("app/financial-intelligence-launch/ProductExplainer.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/launch.module.css", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const analytics = readFileSync("app/financial-intelligence-launch/FinancialIntelligenceAnalytics.tsx", "utf8");
const sharedAnalytics = readFileSync("lib/analytics.ts", "utf8");
const forms = readFileSync("components/DemoDiscovery.tsx", "utf8");

test("launch page is explicitly pre-launch and has no live-market claim", () => {
  assert.match(page, /LAUNCHING 9 SEPTEMBER 2026/);
  assert.match(page, /launches on 9 September 2026/);
  assert.doesNotMatch(page, /Now live|Available now/i);
});

test("narrative and all governed workflow stages remain in order", () => {
  const sections = ["THE OLD CONDITION", "THE THRESHOLD", "THE DIVISION OF RESPONSIBILITY", "THE GOVERNED WORKFLOW", "THE VISIBLE WORKSPACE", "THE CONTROLLED RESULT", "THE FOUNDER’S NOTE", "THE INVITATION"];
  let cursor = -1;
  for (const section of sections) { const next = page.indexOf(section); assert.ok(next > cursor, `${section} follows the prior section`); cursor = next; }
  for (const stage of ["Intelligent Intake", "Document and Data Understanding", "Financial Extraction", "Period Harmonisation", "Canonical Financial Mapping", "Deterministic Validation", "Confidence and Exception Handling", "Human Review", "Validated Financial Model", "Analysis and Findings", "Traceable Export"]) assert.match(page, new RegExp(stage));
});

test("article furniture, figure relationships and publication context are explicit", () => {
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /ENTIMEMA · FINANCIAL INTELLIGENCE/);
  assert.match(page, /SPECIAL TECHNOLOGY REPORT/);
  assert.match(page, /By <Link href="\/alexander-dimitrov">Alexander Dimitrov<\/Link>/);
  assert.match(page, /<time dateTime="2026-08-31">31 August 2026<\/time>/);
  assert.equal((page.match(/<figure>/g) ?? []).length, 3);
  assert.equal((page.match(/<figcaption>/g) ?? []).length, 3);
  assert.match(page, /Figure 1 · The workflow separates interpretation/);
  assert.match(page, /Figure 2 · One governed execution sequence/);
  assert.match(page, /Figure 3 · The Decision Workspace keeps source evidence/);
});

test("conversion, Founder identity references, metadata and schema are canonical", () => {
  assert.match(page, /href="\/contact\?topic=financial-data"/);
  assert.match(page, /href="\/resources\/traceable-financial-analysis-workflow"/);
  assert.match(page, /href="\/alexander-dimitrov"/);
  assert.match(page, /FOUNDER_ID/); assert.match(page, /ORGANIZATION_ID/);
  assert.match(page, /alternates: \{ canonical: url \}/);
  assert.match(page, /"@type": "WebPage"/);
  assert.doesNotMatch(page, /"@type": "Person"|"@type": "Organization"|"@type": "Product"/);
});

test("Financial Intelligence exposes a consent-gated commercial measurement funnel", () => {
  assert.match(page, /FinancialIntelligenceViewAnalytics/);
  assert.equal((page.match(/kind="private_walkthrough"/g) ?? []).length, 2);
  assert.match(explainer, /kind="private_walkthrough" position="explainer"/);
  assert.match(analytics, /financial_intelligence_view/);
  assert.match(analytics, /financial_intelligence_cta_click/);
  assert.match(analytics, /cta_position: position/);
  assert.match(sharedAnalytics, /hasAnalyticsConsent\(\)/);
  assert.match(sharedAnalytics, /isProductionAnalyticsHost\(\)/);
});

test("inquiry measurement records intent without sending form contents", () => {
  assert.match(forms, /trackAnalyticsEvent\("form_start"/);
  assert.match(forms, /trackAnalyticsEvent\("contact_submit_success"/);
  assert.match(forms, /form_type: modalKind/);
  assert.match(forms, /previous_internal_path: previousInternalPath\(\)/);
  assert.doesNotMatch(forms, /(first_name|last_name|email|phone|message): String\(data\.get/);
});

test("public launch route is indexed without changing global navigation or adding an announcement", () => {
  assert.match(sitemap, /"\/financial-intelligence-launch"/);
  assert.doesNotMatch(page, /AnnouncementBar/);
  assert.match(page, /<Navbar \/>/);
});

test("responsive and reduced-motion rules preserve narrow layouts", () => {
  assert.match(css, /@media\(max-width:400px\)/);
  assert.match(css, /overflow:clip/);
  assert.match(css, /min-height:48px/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test("first viewport states the complete pre-launch product promise", () => {
  assert.match(page, /Financial documents in\./);
  assert.match(page, /Validated analysis out\./);
  assert.match(page, /AI interprets the evidence\. Deterministic controls verify the numbers\. Humans resolve material exceptions\./);
  for (const stage of ["PDF", "XLSX", "CSV", "AI INTERPRETATION", "DETERMINISTIC CONTROL", "HUMAN REVIEW", "VALIDATED ANALYSIS"]) assert.match(page, new RegExp(stage));
  assert.match(page, /Evidence linked/); assert.match(page, /Controls passed/); assert.match(page, /Exceptions resolved/); assert.match(page, /Ready for decision/);
  assert.doesNotMatch(page, /Run your first analysis/);
});

test("visual explainer keeps five plain-language stages and evidence lineage", () => {
  for (const heading of ["Start with the documents the business already uses.", "Interpret what every value represents.", "Test what must be exact.", "Ask a human where judgement matters.", "Move forward with analysis you can examine and defend."]) assert.match(explainer, new RegExp(heading.replace(/[.]/g, "\\.")));
  assert.match(explainer, /The workflow does not silently guess/);
  assert.match(explainer, /Evidence lineage/);
  assert.match(explainer, /Rules verify; humans resolve/);
  assert.match(explainer, /mobileVisual/);
  assert.match(explainer, /IntersectionObserver/);
});

test("motion is finite, has a reduced-motion final state and uses no video", () => {
  assert.doesNotMatch(page + explainer, /<video|autoplay/i);
  assert.doesNotMatch(css, /infinite/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.heroResult\{opacity:1/);
  assert.match(css, /overflow:clip/);
});
