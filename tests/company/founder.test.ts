import assert from "node:assert/strict";
import test from "node:test";
import { areas, biography, foundations, founderPageId, founderProfileSchema, personSchema, portraitAlt, portraitId, principles, productBridge, profileIntro, researchQuestions, selectedArticles, structuralProblems, thesis, whyEntimema } from "../../app/alexander-dimitrov/founder-data";
import { getTopic } from "../../app/resources/resource-data";
import { FOUNDER_ID, ORGANIZATION_ID, serializeJsonLd } from "../../lib/structured-data";

test("Founder identity connects to the existing organization and person", () => {
  const schema = JSON.parse(serializeJsonLd(personSchema));
  assert.equal(schema["@type"], "Person");
  assert.equal(schema["@id"], FOUNDER_ID);
  assert.equal(schema.name, "Alexander Dimitrov");
  assert.equal(schema.url, "https://www.entimema.com/alexander-dimitrov");
  assert.equal(schema.worksFor["@id"], ORGANIZATION_ID);
  assert.deepEqual(schema.sameAs, ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"]);
  assert.deepEqual(schema.image, { "@id": portraitId });
  assert.equal(portraitAlt, "Alexander Dimitrov, Founder of Entimema");
});

test("Founder profile publishes one connected Person, ProfilePage and portrait graph", () => {
  const schema = JSON.parse(serializeJsonLd(founderProfileSchema));
  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@graph"].length, 3);
  const profile = schema["@graph"].find((entity: { "@type": string }) => entity["@type"] === "ProfilePage");
  const image = schema["@graph"].find((entity: { "@type": string }) => entity["@type"] === "ImageObject");
  assert.deepEqual(profile.mainEntity, { "@id": FOUNDER_ID });
  assert.equal(profile["@id"], founderPageId);
  assert.deepEqual(profile.primaryImageOfPage, { "@id": portraitId });
  assert.deepEqual(image, {
    "@type": "ImageObject", "@id": portraitId,
    contentUrl: "https://www.entimema.com/alexander-dimitrov-founder-natural.jpg",
    url: "https://www.entimema.com/alexander-dimitrov-founder-natural.jpg",
    width: 400, height: 400, caption: portraitAlt, representativeOfPage: true,
    about: { "@id": FOUNDER_ID },
  });
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

test("Founder thesis connects decision intelligence to research without changing identity", () => {
  assert.equal(biography.length, 2);
  assert.ok(profileIntro.includes("decision-intelligence company being built"));
  assert.ok(biography[1].includes("evidence, analysis, judgment and action remain connected"));
  assert.equal(thesis, "The value of a model is not determined by complexity alone. It is determined by whether the model can operate responsibly inside a real institution—across its data, definitions, systems, constraints and decision accountabilities.");
  assert.deepEqual(foundations.map(area => area.title), ["Financial meaning", "Data and representation", "Risk and uncertainty", "Systems and decision execution"]);
  assert.deepEqual(structuralProblems.map(problem => problem.title), ["Data", "Models", "Rules", "Automation"]);
  assert.deepEqual(Object.keys(researchQuestions), selectedArticles.map(article => article.slug));
  for (const article of selectedArticles) {
    assert.ok(researchQuestions[article.slug].endsWith("?"));
    assert.ok("src" in article.cover, "Each retained publication must have its existing cover");
  }
  assert.deepEqual(areas.map(area => area.title), ["Financial Management", "Credit Risk & Decision Science", "Systems & Data", "AI & Controlled Workflows"]);
});

test("Approved Founder content and article selection are preserved", async () => {
  const { readFile } = await import("node:fs/promises");
  const approved = JSON.parse(await readFile(new URL("./founder-content.json", import.meta.url), "utf8"));
  assert.deepEqual({ profileIntro, biography, thesis, areas, foundations, structuralProblems, principles, whyEntimema, productBridge, researchQuestions, articles: selectedArticles.map(article => article.canonicalPath), publications: selectedArticles.map(article => ({ title: article.headline, path: article.canonicalPath, topic: getTopic(article.topic)?.label, minutes: article.readingMinutes, cover: article.cover })) }, approved);
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
  assert.match(css, /object-fit:\s*cover/);
});
