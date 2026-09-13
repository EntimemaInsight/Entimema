import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const offer = readFileSync("app/pilot/financial-intelligence/offer/page.tsx", "utf8");
const acceptance = readFileSync("app/pilot/financial-intelligence/offer/PilotAcceptance.tsx", "utf8");
const intake = readFileSync("app/pilot/financial-intelligence/PilotIntakeForm.tsx", "utf8");
const api = readFileSync("app/api/contact/route.ts", "utf8");

test("pilot intake progresses to the standardized offer", () => {
  assert.match(intake, /\/pilot\/financial-intelligence\/offer/);
  assert.match(offer, /€490/);
  assert.match(offer, /Up to 5/);
  assert.match(offer, /30 days/);
  assert.match(offer, /5 business days/);
  assert.match(offer, /100% in advance/);
});

test("offer states deliverables and boundaries", () => {
  assert.match(offer, /Deterministic validation and reconciliation/);
  assert.match(offer, /Human review of material exceptions/);
  assert.match(offer, /ERP or third-party system integration/);
  assert.match(offer, /Accounting audit or assurance opinion/);
});

test("standard offer acceptance is validated separately", () => {
  assert.match(acceptance, /pilot_acceptance/);
  assert.match(api, /intent === "pilot_acceptance"/);
  assert.match(api, /Standard pilot offer accepted/);
});

test("accepted pilot triggers both internal and customer confirmations", () => {
  assert.match(api, /resend\.batch\.send/);
  assert.match(api, /Financial Intelligence pilot — acceptance confirmed/);
  assert.match(api, /Do not send confidential financial documents/);
  assert.match(api, /Restricted Workspace access is activated after payment/);
  assert.match(acceptance, /automatic confirmation and the next-step instructions/);
  assert.match(acceptance, /Payment details follow separately/);
});
