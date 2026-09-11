import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const footer = readFileSync("components/GlobalFooter.tsx", "utf8");
const contactPage = readFileSync("app/contact/page.tsx", "utf8");
const contactExperience = readFileSync("app/contact/ContactExperience.tsx", "utf8");

test("footer separates resources from the compact company column", () => {
  for (const destination of [
    ["Insights", "/resources"],
    ["Engineering & Resources", "/resources/engineering"],
    ["Entimema Docs & Help Center", "/contact?intent=client"],
    ["Security & Trust", "/security"],
    ["Privacy Notice", "/privacy"],
  ]) {
    assert.match(footer, new RegExp(`label: "${destination[0].replace(/[&?]/g, "\\$&")}",[\\s\\S]*?href: "${destination[1].replace(/[/?]/g, "\\$&")}"`));
  }

  assert.match(footer, /label: "Integrations", status: "Coming soon"/);
  assert.doesNotMatch(footer, /All Resources|FinAI by Entimema/);
  assert.match(footer, /title: "COMPANY",[\s\S]*?label: "About Entimema"[\s\S]*?label: "Contact"/);
});

test("help center opens the Support contact path", () => {
  assert.match(contactPage, /intent === "client"/);
  assert.match(contactPage, /initialIntent=/);
  assert.match(contactExperience, /openContact\(intent, triggerRefs\.current\[intent\], validTopic\)/);
});
