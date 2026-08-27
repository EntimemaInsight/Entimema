import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), ".next", "server", "app");
const site = "https://www.entimema.com";
const expected = {
  Organization: [`${site}/#organization`],
  WebSite: [`${site}/#website`],
  Person: [`${site}/about#founder`],
  Service: [
    "credit-risk",
    "cfo-function",
    "budgets-and-forecasting",
    "cost-and-profitability",
    "management-reporting",
    "financial-data",
    "decision-automation",
  ].map((slug) => `${site}/services/${slug}#service`),
  Article: [
    "building-a-manufacturing-cost-architecture",
    "working-capital-as-a-system",
    "operational-driver-forecasting",
    "credit-vintage-analysis",
    "from-erp-data-to-management-intelligence",
  ].map((slug) => `${site}/resources/${slug}#article`),
};

function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : path.endsWith(".html") ? [path] : [];
  });
}

const documents = files(root);
const entities = [];
const documentHtml = new Map();
for (const file of documents) {
  const html = readFileSync(file, "utf8");
  documentHtml.set(relative(root, file), html);
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const payload = JSON.parse(match[1]);
    const graph = payload["@graph"] ?? [payload];
    for (const entity of graph) entities.push({ ...entity, source: relative(root, file) });
  }
}

const errors = [];
const fail = (message) => errors.push(message);

function publicUrls(value) {
  if (typeof value === "string") return value.match(/https?:\/\/[^\s"<>]+/g) ?? [];
  if (Array.isArray(value)) return value.flatMap(publicUrls);
  if (value && typeof value === "object") return Object.values(value).flatMap(publicUrls);
  return [];
}

for (const [type, ids] of Object.entries(expected)) {
  for (const id of ids) {
    const matches = entities.filter((entity) => entity["@type"] === type && entity["@id"] === id);
    if (matches.length !== 1) fail(`${type} ${id} expected once, found ${matches.length}`);
  }
}

for (const entity of entities) {
  for (const value of publicUrls(entity)) {
    const hostname = new URL(value).hostname.toLowerCase();
    if (hostname === "localhost" || hostname.includes("staging") || hostname === "entimema.net" || hostname.endsWith(".entimema.net")) {
      fail(`Non-production URL ${value} in ${entity.source}`);
    }
  }
  if (entity["@type"] === "Service" && entity.provider?.["@id"] !== expected.Organization[0]) fail(`Invalid Service provider in ${entity.source}`);
  if (["Article", "BlogPosting"].includes(entity["@type"])) {
    if (entity.author?.["@id"] !== expected.Person[0]) fail(`Invalid Article author in ${entity.source}`);
    if (entity.publisher?.["@id"] !== expected.Organization[0]) fail(`Invalid Article publisher in ${entity.source}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entity.datePublished ?? "")) fail(`Invalid Article datePublished in ${entity.source}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entity.dateModified ?? "")) fail(`Invalid Article dateModified in ${entity.source}`);
    if (entity.dateModified < entity.datePublished) fail(`Article dateModified predates datePublished in ${entity.source}`);
  }
  if (entity["@type"] === "BreadcrumbList") {
    entity.itemListElement?.forEach((item, index) => {
      if (item.position !== index + 1) fail(`Invalid breadcrumb ordering in ${entity.source}`);
    });
  }
}

// Publication dates remain available to crawlers, but must not appear in the
// public Resources interface. Inspect the generated output so shared cards,
// filtered discovery markup, article heroes and related-research cards are all
// covered by the same assertions.
const resourceArticles = entities.filter((entity) => ["Article", "BlogPosting"].includes(entity["@type"]) && entity.source.startsWith("resources/"));
for (const article of resourceArticles) {
  const html = documentHtml.get(article.source) ?? "";
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
  const visibleMarkup = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const visibleText = visibleMarkup.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#x20;/gi, " ").replace(/\s+/g, " ");

  if (/<time\b/i.test(visibleMarkup)) fail(`Visible publication date element in ${article.source}`);
  if (/\b(?:Published|Updated|Last updated)\s*(?:on|:)?\s*\d{1,4}[\s/-]/i.test(visibleText)) fail(`Visible publication date label in ${article.source}`);
  if (!/\b\d+\s+min read\b/i.test(visibleText)) fail(`Missing reading time in ${article.source}`);
  if (/<(?:div|span)[^>]+class="[^"]*(?:articleMeta|engineeringCardMeta)[^"]*"[^>]*>\s*<\/(?:div|span)>/i.test(visibleMarkup)) {
    fail(`Empty resource metadata container in ${article.source}`);
  }
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) fail(`Resource route is not indexable in ${article.source}`);
  if (!new RegExp(`<meta[^>]+property="article:published_time"[^>]+content="${article.datePublished}"`, "i").test(html)) {
    fail(`Missing Open Graph publication date in ${article.source}`);
  }
  if (!new RegExp(`<meta[^>]+property="article:modified_time"[^>]+content="${article.dateModified}"`, "i").test(html)) {
    fail(`Missing Open Graph modification date in ${article.source}`);
  }
}

for (const [source, html] of documentHtml) {
  if (source !== "resources.html" && source !== "resources/engineering.html") continue;
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
  const visibleMarkup = body.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
  if (/<time\b/i.test(visibleMarkup)) fail(`Visible card publication date in ${source}`);
  if (!/\b\d+\s+min read\b/i.test(visibleMarkup.replace(/<[^>]+>/g, " "))) fail(`Missing card reading times in ${source}`);
}

function artifacts(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? artifacts(path) : [path];
  });
}
const sitemapFiles = artifacts(root.replace(/\/app$/, "")).filter((file) => /sitemap.*(?:\.xml|\.body)$/.test(file));
const sitemap = sitemapFiles.map((file) => readFileSync(file, "utf8")).find((content) => content.includes("<urlset"));
if (!sitemap) {
  fail("Generated sitemap XML was not found");
} else {
  for (const article of resourceArticles) {
    const urlEntry = sitemap.match(new RegExp(`<url>\\s*<loc>${article.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/loc>\\s*<lastmod>([^<]+)<\\/lastmod>`));
    if (!urlEntry) fail(`Missing sitemap lastmod for ${article.url}`);
    else if (urlEntry[1] !== article.dateModified) fail(`Sitemap lastmod does not match dateModified for ${article.url}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Structured-data audit passed: ${entities.length} entities across ${documents.length} generated pages.`);
