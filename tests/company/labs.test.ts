import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { domains, process, principles, outputs, labsSchema, labsTitle, labsDescription, labsUrl } from "../../app/labs/labs-data";
import { serializeJsonLd, ORGANIZATION_ID, WEBSITE_ID } from "../../lib/structured-data";

test("Labs is a webpage within Entimema, not a separate organization", () => {
  assert.equal(labsSchema["@type"], "WebPage");
  assert.deepEqual(labsSchema.about, { "@id": ORGANIZATION_ID });
  assert.deepEqual(labsSchema.isPartOf, { "@id": WEBSITE_ID });
  assert.equal(labsUrl, "https://www.entimema.com/labs");
  assert.equal(labsTitle, "Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems");
  assert.equal(labsDescription, "Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.");
  assert.deepEqual(JSON.parse(serializeJsonLd(labsSchema)), labsSchema);
  assert.ok(!serializeJsonLd({ name: "</script>" }).includes("<"));
});
test("research domains and evidence chain retain their distinct scope and order", () => {
  assert.deepEqual(domains.map(d => d.title), ["Financial Intelligence", "Credit Risk", "Decision Systems"]);
  assert.ok(domains.every(d => d.points.length === 4));
  assert.deepEqual(process.map(s => s.title), ["Observe", "Formalise", "Test", "Operationalise", "Improve"]);
  assert.equal(principles.length, 4);
  assert.equal(outputs.length, 5);
});
test("page uses working contextual destinations and no founder or runtime media", () => {
  const source = readFileSync("app/labs/page.tsx", "utf8");
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.equal((source.match(/<Navbar\s*\/>/g) || []).length, 1);
  assert.ok(source.includes('aria-hidden="true"'));
  assert.ok(source.includes("serializeJsonLd(labsSchema)"));
  for (const route of ["resources", "about"]) {
    assert.ok(source.includes(`href="/${route}"`));
    assert.ok(existsSync(`app/${route}/page.tsx`));
  }
  assert.doesNotMatch(source, /use client|<img\b|<Image\b|<iframe\b|alexander-dimitrov|GlobalFooter/);
});
