import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../../app/sitemap";
import robots from "../../app/robots";
import { companyDestinations } from "../../lib/company-navigation";
import { createHomeSchema, FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, serializeJsonLd } from "../../lib/structured-data";
import { personSchema } from "../../app/alexander-dimitrov/founder-data";
import { labsSchema, selectedPublications } from "../../app/labs/labs-data";
import { publishedResources } from "../../app/resources/resource-data";

test("sitemap covers public Company destinations exactly once without private routes", () => {
  const entries = sitemap();
  const urls = entries.map(entry => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const { href } of companyDestinations) assert.equal(urls.filter(url => url === SITE_URL + href).length, 1);
  assert.ok(urls.every(url => !/^\/(workspace|auth|api)(\/|$)/.test(new URL(url).pathname)));
  for (const resource of publishedResources) {
    const entry = entries.find(entry => entry.url === SITE_URL + resource.canonicalPath);
    assert.ok(entry);
    assert.equal(entry.lastModified, resource.updatedAt ?? resource.publishedAt);
  }
});

test("robots permits the public Company pages and advertises the canonical sitemap", () => {
  assert.deepEqual(robots().rules, { userAgent: "*", allow: "/" });
  assert.equal(robots().sitemap, SITE_URL + "/sitemap.xml");
});

test("Company identities retain the established organization, website and founder relationship", () => {
  const graph = createHomeSchema()["@graph"];
  const organization = graph.find(entity => entity["@type"] === "Organization");
  const website = graph.find(entity => entity["@type"] === "WebSite");
  assert.equal(organization?.["@id"], ORGANIZATION_ID);
  assert.deepEqual(organization?.founder, { "@id": FOUNDER_ID });
  assert.equal(website?.["@id"], WEBSITE_ID);
  assert.deepEqual(website?.publisher, { "@id": ORGANIZATION_ID });
  assert.equal(personSchema["@id"], FOUNDER_ID);
  assert.equal(personSchema.url, SITE_URL + "/alexander-dimitrov");
  assert.deepEqual(personSchema.worksFor, { "@id": ORGANIZATION_ID });
  assert.equal(labsSchema["@type"], "WebPage");
  assert.deepEqual(labsSchema.publisher, { "@id": ORGANIZATION_ID });
});

test("Labs publication list matches the visible selection and existing Article IDs exactly", () => {
  const list = labsSchema.mentions;
  assert.equal(list["@type"], "ItemList");
  assert.equal(list["@id"], SITE_URL + "/labs#selected-work");
  assert.equal(list.numberOfItems, 6);
  assert.deepEqual(list.itemListElement, selectedPublications.map(({ resource }, index) => ({
    "@type": "ListItem", position: index + 1,
    item: { "@type": "Article", "@id": SITE_URL + resource.canonicalPath + "#article", url: SITE_URL + resource.canonicalPath, headline: resource.headline },
  })));
  for (const { resource } of selectedPublications) assert.equal(resource, publishedResources.find(r => r.slug === resource.slug));
  assert.doesNotMatch(serializeJsonLd(labsSchema), /ScholarlyArticle|ResearchOrganization|"@type":"Organization"/);
  assert.deepEqual(JSON.parse(serializeJsonLd(labsSchema)), labsSchema);
});
