import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/pilot/financial-intelligence/page.tsx", "utf8");
const form = readFileSync("app/pilot/financial-intelligence/PilotIntakeForm.tsx", "utf8");
const demo = readFileSync("app/demo/financial-intelligence/FinancialIntelligenceDemo.tsx", "utf8");
const api = readFileSync("app/api/contact/route.ts", "utf8");

test("interactive demo progresses to the dedicated pilot intake", () => {
  assert.match(demo, /href="\/pilot\/financial-intelligence"/);
  assert.match(page, /Configure your pilot/);
});

test("pilot intake captures qualification fields without document upload", () => {
  for (const field of ["companyEmail", "companyName", "jobTitle", "country", "documentType", "monthlyVolume", "primaryObjective", "privacyConsent"]) {
    assert.match(form, new RegExp(`name="${field}"`));
  }
  assert.doesNotMatch(form, /type="file"/);
  assert.match(form, /About 60 seconds|PilotIntakeForm/);
});

test("pilot submissions are separately validated and routed", () => {
  assert.match(api, /intent === "pilot"/);
  assert.match(api, /privacyConsent !== "yes"/);
  assert.match(api, /Financial Intelligence pilot/);
});
