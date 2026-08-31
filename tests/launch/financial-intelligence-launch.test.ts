import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/financial-intelligence-launch/page.tsx", "utf8");
const css = readFileSync("app/financial-intelligence-launch/launch.module.css", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");

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
