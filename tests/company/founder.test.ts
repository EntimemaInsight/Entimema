import assert from "node:assert/strict";
import test from "node:test";
import { areas, biography, personSchema, portraitAlt, selectedArticles, thesis } from "../../app/alexander-dimitrov/founder-data";
import { FOUNDER_ID, ORGANIZATION_ID, serializeJsonLd } from "../../lib/structured-data";

test("Founder identity connects to the existing organization and person", () => {
  const schema = JSON.parse(serializeJsonLd(personSchema));
  assert.equal(schema["@type"], "Person");
  assert.equal(schema["@id"], FOUNDER_ID);
  assert.equal(schema.name, "Alexander Dimitrov");
  assert.equal(schema.url, "https://www.entimema.com/alexander-dimitrov");
  assert.equal(schema.worksFor["@id"], ORGANIZATION_ID);
  assert.deepEqual(schema.sameAs, ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"]);
  assert.equal(schema.image, "https://www.entimema.com/alexander-dimitrov-founder.webp");
  assert.equal(portraitAlt, "Alexander Dimitrov, Founder of Entimema");
});

test("Six selected articles exist, are published and explicitly identify the Founder", () => {
  assert.equal(selectedArticles.length, 6);
  assert.equal(new Set(selectedArticles.map(article => article.canonicalPath)).size, 6);
  for (const article of selectedArticles) {
    assert.equal(article.status, "published");
    assert.ok(article.publishedAt);
    assert.equal(article.author.affiliation, "Entimema");
    assert.equal(article.author.profilePath, "/about");
    assert.equal(article.canonicalPath, `/resources/${article.slug}`);
  }
});

test("Editorial content includes three biography paragraphs, thesis and four areas", () => {
  assert.equal(biography.length, 3);
  assert.ok(biography[0].startsWith("Alexander Dimitrov is the Founder of Entimema,"));
  assert.ok(biography[2].endsWith("each have a clearly defined role."));
  assert.ok(thesis.includes("data, systems, constraints and decision responsibilities."));
  assert.deepEqual(areas.map(area => area.title), ["Financial Management", "Credit Risk & Decision Science", "Systems & Data", "AI & Controlled Workflows"]);
});
