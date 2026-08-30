import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { domains, process, evidenceStates, applicationSteps, selectedPublications, researchWork, labsSchema, labsTitle, labsDescription, labsUrl } from "../../app/labs/labs-data";
import { publishedResources } from "../../app/resources/resource-data";
import { serializeJsonLd, ORGANIZATION_ID, WEBSITE_ID } from "../../lib/structured-data";

test("Labs preserves its existing WebPage identity and metadata", () => {
  assert.equal(labsSchema["@type"], "WebPage");
  assert.deepEqual(labsSchema.about, { "@id": ORGANIZATION_ID });
  assert.deepEqual(labsSchema.isPartOf, { "@id": WEBSITE_ID });
  assert.equal(labsUrl, "https://www.entimema.com/labs");
  assert.equal(labsTitle, "Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems");
  assert.equal(labsDescription, "Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.");
  assert.deepEqual(JSON.parse(serializeJsonLd(labsSchema)), labsSchema);
  assert.ok(!serializeJsonLd({ name: "</script>" }).includes("<"));
});
test("three domains retain boundaries and the five-stage investigation method", () => {
  assert.deepEqual(domains.map(d => d.title), ["Financial Intelligence", "Credit Risk", "Decision Systems"]);
  assert.deepEqual(process.map(s => s.title), ["Observe", "Formalise", "Test", "Operationalise", "Improve"]);
  assert.match(domains[0].boundary, /not all implemented/);
  assert.match(domains[1].boundary, /do not imply.*production lending platform/);
  assert.match(domains[2].boundary, /does not.*empirical validation/);
  assert.deepEqual(evidenceStates.map(s => s.title), ["Open question", "Methodological position", "Published research", "Implemented capability"]);
});
test("agenda, application and publication links resolve to original published records", () => {
  const slugs = [...domains.flatMap(d => [...d.work]), ...applicationSteps.map(s => s.slug)];
  for (const slug of slugs) {
    const record = researchWork(slug);
    assert.equal(record, publishedResources.find(r => r.slug === slug));
    assert.equal(record.status, "published");
    assert.equal(record.canonicalPath, `/resources/${slug}`);
  }
  assert.equal(selectedPublications.length, 6);
  assert.equal(new Set(selectedPublications.map(p => p.resource.slug)).size, 6);
  for (const { resource, reason } of selectedPublications) {
    assert.equal(resource, publishedResources.find(r => r.slug === resource.slug));
    assert.ok(resource.headline && resource.author.name && reason);
    if (resource.publishedAt) assert.ok(Number.isFinite(Date.parse(resource.publishedAt)));
  }
  assert.throws(() => researchWork("not-a-published-labs-resource"), /unpublished or missing/);
});
test("applied example and page preserve evidence boundaries without new runtime media", () => {
  const source = readFileSync("app/labs/page.tsx", "utf8");
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.equal((source.match(/<Navbar\s*\/>/g) || []).length, 1);
  assert.equal((source.match(/<section\b/g) || []).length, 8);
  assert.deepEqual(applicationSteps.map(s => s.title), ["Research question", "Methodology", "Implementation", "Control", "Human review"]);
  for (const route of ["/resources", "/alexander-dimitrov", "/workspace/financial-intelligence"]) assert.ok(source.includes(`href="${route}"`));
  for (const claim of ["Income Statement v1", "eligible English Income Statements", "sign-in required", "does not implement the entire Labs agenda", "nor does every correction train or improve an AI model", "not promised features"]) assert.ok(source.includes(claim));
  assert.doesNotMatch(source, /use client|<canvas\b|<iframe\b|<img\b|<Image\b|GlobalFooter/);
});
