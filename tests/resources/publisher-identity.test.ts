import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const articleTemplate = readFileSync("app/resources/ResourceArticle.tsx", "utf8");
const publisherIdentity = readFileSync("app/resources/PublisherIdentity.tsx", "utf8");

test("the shared Resource article template renders the Entimema publisher identity", () => {
  assert.match(articleTemplate, /<PublisherIdentity\s*\/>/);
  assert.doesNotMatch(articleTemplate, /\/about#founder/);
  assert.doesNotMatch(publisherIdentity, /href=/);
});

test("the Entimema publisher reference is labelled and operable as an accessible dialog", () => {
  assert.match(publisherIdentity, /<BrandLogo compact \/>/);
  assert.match(publisherIdentity, /aria-label="About Entimema, the publisher"/);
  assert.match(publisherIdentity, /aria-haspopup="dialog"/);
  assert.match(publisherIdentity, /aria-expanded=\{open\}/);
  assert.match(publisherIdentity, /role="dialog"/);
  assert.match(publisherIdentity, /Entimema is a financial and decision systems company/);
  assert.match(publisherIdentity, /onClick=\{\(\) => setOpen/);
  assert.match(publisherIdentity, /event\.key !== "Escape"/);
  assert.match(publisherIdentity, /pointerdown/);
});
