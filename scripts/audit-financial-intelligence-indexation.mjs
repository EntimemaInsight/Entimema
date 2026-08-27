import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const site = "https://www.entimema.com";
const outputRoot = join(process.cwd(), ".next", "server", "app");
const slugs = [
  "ai-financial-analysis-models-rules-controls",
  "beyond-spreadsheet-automation",
  "financial-data-lineage",
  "financial-kpi-trees",
  "management-reporting-for-cfo-decisions",
];

function fail(message) {
  throw new Error(message);
}

function readGenerated(path) {
  if (!existsSync(path)) fail(`Missing generated output: ${path}`);
  return readFileSync(path, "utf8");
}

const sitemap = readGenerated(join(outputRoot, "sitemap.xml.body"));
const robots = readGenerated(join(outputRoot, "robots.txt.body"));
const resourcesDiscovery = readFileSync(join(process.cwd(), "app", "resources", "ResourcesDiscovery.tsx"), "utf8");
const resourceCard = readFileSync(join(process.cwd(), "app", "resources", "ResourceCard.tsx"), "utf8");
const titles = new Set();
const descriptions = new Set();

if (!robots.includes("User-Agent: *") || !robots.includes("Allow: /") || !robots.includes(`Sitemap: ${site}/sitemap.xml`)) {
  fail("robots.txt does not allow crawling or advertise the production sitemap");
}
if (!resourcesDiscovery.includes("<ResourceCard") || !resourceCard.includes("href={resource.canonicalPath}")) {
  fail("Resources listing does not expose registry canonical paths through crawlable links");
}

for (const slug of slugs) {
  const path = `/resources/${slug}`;
  const url = `${site}${path}`;
  const html = readGenerated(join(outputRoot, "resources", `${slug}.html`));
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="(.*?)"\/>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="(.*?)"\/>/)?.[1];
  const robotsMeta = html.match(/<meta name="robots" content="(.*?)"\/>/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="(.*?)"\/>/)?.[1];
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1])["@graph"] ?? []);
  const article = jsonLd.find((item) => item["@type"] === "Article");

  if (!title || titles.has(title)) fail(`Missing or duplicate title: ${path}`);
  if (!description || descriptions.has(description)) fail(`Missing or duplicate description: ${path}`);
  titles.add(title);
  descriptions.add(description);
  if (canonical !== url) fail(`Canonical is not self-referencing: ${path}`);
  if (ogUrl !== url) fail(`Open Graph URL is not canonical: ${path}`);
  if (robotsMeta !== "index, follow") fail(`Page is not explicitly index, follow: ${path}`);
  if (html.includes("entimema.net")) fail(`Legacy domain remains in generated page: ${path}`);
  if (!html.includes(`property="og:image"`) || !html.includes(`name="twitter:card" content="summary_large_image"`)) fail(`Social cover metadata is incomplete: ${path}`);
  if (!article || article.url !== url || article.mainEntityOfPage?.["@id"] !== `${url}#webpage`) fail(`Article canonical linkage is invalid: ${path}`);
  if (!article.headline || !article.description || !article.datePublished || !article.dateModified || !article.image || !article.articleSection) fail(`Article fields are incomplete: ${path}`);
  if (article.author?.["@id"] !== `${site}/about#founder` || article.publisher?.["@id"] !== `${site}/#organization`) fail(`Article attribution is invalid: ${path}`);
  if ((sitemap.match(new RegExp(`<loc>${url}</loc>`, "g")) ?? []).length !== 1) fail(`Sitemap URL must occur exactly once: ${path}`);
  if (!new RegExp(`<loc>${url}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`).test(sitemap)) fail(`Sitemap lastModified is missing or invalid: ${path}`);
}

console.log(`Financial Intelligence indexation audit passed: ${slugs.length} pages.`);
