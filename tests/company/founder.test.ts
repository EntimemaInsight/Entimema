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
  assert.equal(schema.image, "https://www.entimema.com/alexander-dimitrov-founder-natural.jpg");
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

test("Approved Founder content and article selection are preserved", async () => {
  const { readFile } = await import("node:fs/promises");
  const approved = JSON.parse(await readFile(new URL("./founder-content.json", import.meta.url), "utf8"));
  assert.deepEqual({ biography, thesis, areas, articles: selectedArticles.map(article => article.canonicalPath) }, approved);
});

test("Natural portrait remains the unmodified 400px JPEG with a strict CSS cap", async () => {
  const { readFile } = await import("node:fs/promises");
  const sharp = (await import("sharp")).default;
  const bytes = await readFile(new URL("../../public/alexander-dimitrov-founder-natural.jpg", import.meta.url));
  const image = await sharp(bytes).metadata();
  const { createHash } = await import("node:crypto");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "a5d541a055b53185f8f2b2b43f29cd35da63b322cfcfb6f5d8b7847d4fc3eff9");
  assert.equal(bytes.length, 24453);
  assert.equal(image.format, "jpeg");
  assert.equal(image.width, 400);
  assert.equal(image.height, 400);
  assert.equal(image.isProgressive, true);
  const css = await readFile(new URL("../../app/alexander-dimitrov/founder.module.css", import.meta.url), "utf8");
  const portraitRules = [...css.matchAll(/\.portrait\s*\{([^}]+)\}/g)].map(match => match[1]);
  assert.equal(portraitRules.length, 1, "No breakpoint can override the source-size cap");
  assert.match(portraitRules[0], /max-width:\s*400px/);
  assert.match(portraitRules[0], /aspect-ratio:\s*1\s*\/\s*1/);
  assert.match(css, /object-fit:\s*contain/);
});
