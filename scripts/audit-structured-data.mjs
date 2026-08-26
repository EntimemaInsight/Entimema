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
for (const file of documents) {
  const html = readFileSync(file, "utf8");
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
  if (entity["@type"] === "Article") {
    if (entity.author?.["@id"] !== expected.Person[0]) fail(`Invalid Article author in ${entity.source}`);
    if (entity.publisher?.["@id"] !== expected.Organization[0]) fail(`Invalid Article publisher in ${entity.source}`);
  }
  if (entity["@type"] === "BreadcrumbList") {
    entity.itemListElement?.forEach((item, index) => {
      if (item.position !== index + 1) fail(`Invalid breadcrumb ordering in ${entity.source}`);
    });
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Structured-data audit passed: ${entities.length} entities across ${documents.length} generated pages.`);
