import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sitemap from "../../app/sitemap";
import { FINAI_URL, SITE_URL } from "../../lib/structured-data";

const page = readFileSync("app/finai/page.tsx", "utf8");
const footer = readFileSync("components/GlobalFooter.tsx", "utf8");
const llms = readFileSync("public/llms.txt", "utf8");

test("FinAI has one indexable canonical page and a site-wide discovery path", () => {
  assert.equal(sitemap().filter(entry => entry.url === FINAI_URL).length, 1);
  assert.match(page, /alternates: \{ canonical: FINAI_URL \}/);
  assert.match(footer, /\["FinAI by Entimema", "\/finai"\]/);
  assert.match(llms, new RegExp(`${SITE_URL.replaceAll(".", "\\.")}\\/finai`));
});

test("FinAI's visible definition names the category, company and founder", () => {
  assert.match(page, /FinAI by Entimema names a specific design position/);
  assert.match(page, /AI agents in Finance and Risk/);
  assert.match(page, /Alexander Dimitrov/);
  assert.match(page, /href="\/alexander-dimitrov"/);
  assert.match(page, /href="\/services\/financial-ai-agents"/);
  assert.match(page, /href="\/services\/risk-ai-agents"/);
});
