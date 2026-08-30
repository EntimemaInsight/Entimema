
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { founderName, profileIntro, biography, thesis, principles, whyEntimema, personSchema } from "../../app/alexander-dimitrov/founder-data";

const page = readFileSync("app/alexander-dimitrov/page.tsx", "utf8");
const frozen = JSON.parse(readFileSync("tests/company/founder-preservation.json", "utf8"));
const approved = JSON.parse(readFileSync("tests/company/founder-content.json", "utf8"));
const hash = (value: string) => createHash("sha256").update(value.replace(/\r\n/g, "\n")).digest("hex");

test("Founder retains the introduction, six numbered sections and public English identity", () => {
  assert.deepEqual([...page.matchAll(/<section[^>]+aria-labelledby="([^"]+)"/g)].map(m => m[1]), frozen.sectionIds);
  assert.deepEqual([...page.matchAll(/(0[1-6]) \/ ([^<]+)</g)].map(m => m[0].slice(0,-1)), [
    "01 / Practitioner foundations", "02 / The recurring problem", "03 / A practical point of view",
    "04 / Why Entimema", "05 / Research as evidence", "06 / From reasoning to use",
  ]);
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
  assert.match(page, /<h1[^>]+>\{founderName\}<\/h1>/);
  assert.equal(founderName, "Alexander Dimitrov");
  assert.doesNotMatch([page, profileIntro, ...biography, thesis, ...principles, ...whyEntimema].join(" "), /Aleksandar|SAP|years of experience/);
});

test("Founder defines the category, workflow boundary, controlled reasoning and concluding belief", () => {
  assert.ok(whyEntimema.includes("Entimema is being built around an emerging category: Decision Intelligence for Finance and Risk."));
  assert.match(whyEntimema[1], /The workflow—not an isolated model or AI agent—is the relevant product boundary\./);
  assert.match(principles[0], /Deterministic controls must continue to own arithmetic, reconciliations, accounting identities and fixed decision constraints\./);
  assert.match(principles[1], /^Human judgment remains necessary/);
  assert.match(page, /The future of Finance and Risk is not simply more automation\. It is better decision architecture: systems through which financial reasoning becomes faster and more adaptable without becoming less rigorous, explainable or accountable\./);
  assert.match(page, /Entimema exists to help finance organizations and financial institutions move toward that model\./);
});

test("Founder metadata, JSON-LD vocabulary, portrait markup, publications and CTA components stay frozen", () => {
  assert.equal(hash(page.slice(page.indexOf("const title ="), page.indexOf("export default function"))), frozen.metadataHash);
  assert.equal(hash(page.match(/<Image src=\{portraitPath\}[\s\S]*?\/>/)![0]), frozen.portraitHash);
  assert.equal(hash(page.slice(page.indexOf("            <div className={styles.articles}>"), page.indexOf('          <section className={`editorial-section ${styles.section} ${styles.closing}'))), frozen.researchHash);
  assert.equal(hash(page.slice(page.indexOf("            <div className={styles.actions}>"))), frozen.actionsHash);
  assert.deepEqual([...page.matchAll(/<(?:Link|CompanyCta)\b[^>]*>[\s\S]*?<\/(?:Link|CompanyCta)>/g)].map(m => m[0]), frozen.links);
  for (const key of ["publications", "articles", "researchQuestions", "areas"]) assert.deepEqual(approved[key], frozen[key]);
  assert.deepEqual(personSchema, {
    "@context": "https://schema.org", "@type": "Person", "@id": "https://www.entimema.com/about#founder",
    name: "Alexander Dimitrov", url: "https://www.entimema.com/alexander-dimitrov",
    image: "https://www.entimema.com/alexander-dimitrov-founder-natural.jpg", jobTitle: "Founder",
    worksFor: { "@id": "https://www.entimema.com/#organization" },
    sameAs: ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"],
    knowsAbout: frozen.areas.map((area: { title: string }) => area.title),
  });
});

test("Founder retains the Company motion, editorial reveal, scene, ornament and CTA hooks", () => {
  for (const hook of ['data-company="founder"', '<ScrollExperience company="founder" />',
    "editorial-reveal-text", "editorial-reveal-rule", "editorial-reveal-fade", "data-company-scene",
    '<DecisionConstellation variant="founder" />', "<CompanyCta", "data-founder-portrait"]) assert.ok(page.includes(hook), hook);
});

