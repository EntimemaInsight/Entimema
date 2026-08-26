import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), ".next", "server", "app");
const site = "https://www.entimema.com";
const slugs = [
  "financial-data-normalisation",
  "trial-balance-to-financial-statements",
  "financial-data-validation-control-layer",
  "confidence-human-review-ai-finance",
  "traceable-financial-analysis-workflow",
];
const titles = {
  "financial-data-normalisation": "Financial Data Normalisation and Mapping | Entimema",
  "trial-balance-to-financial-statements": "Trial Balance Mapping to Financial Statements | Entimema",
  "financial-data-validation-control-layer": "Financial Data Validation Controls | Entimema",
  "confidence-human-review-ai-finance": "AI Confidence and Human Review in Finance | Entimema",
  "traceable-financial-analysis-workflow": "Traceable Financial Analysis Workflow | Entimema",
};
const fail = (message) => { throw new Error(message); };
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');

const registry = readFileSync(join(process.cwd(), "app", "resources", "resource-data.ts"), "utf8");
const sitemap = readFileSync(join(root, "sitemap.xml.body"), "utf8");
for (const slug of slugs) {
  const path = `/resources/${slug}`;
  const url = `${site}${path}`;
  const htmlPath = join(root, "resources", `${slug}.html`);
  if (!existsSync(htmlPath)) fail(`Missing generated page: ${path}`);
  const html = readFileSync(htmlPath, "utf8");
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
  const description = decode(html.match(/<meta name="description" content="(.*?)"\/>/)?.[1] ?? "");
  const canonical = html.match(/<link rel="canonical" href="(.*?)"\/>/)?.[1];
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1])["@graph"] ?? []);
  const article = jsonLd.find((item) => item["@type"] === "Article");
  const breadcrumb = jsonLd.find((item) => item["@type"] === "BreadcrumbList");

  if (title !== titles[slug]) fail(`Unexpected title for ${path}: ${title}`);
  if (description.length < 120 || description.length > 165) fail(`Description length ${description.length} for ${path}`);
  if (canonical !== url) fail(`Invalid canonical for ${path}: ${canonical}`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) fail(`Expected one H1 for ${path}`);
  if (/noindex/i.test(html)) fail(`Unexpected noindex on ${path}`);
  if (!html.includes('href="/about#founder"')) fail(`Founder link missing on ${path}`);
  if (!article || article.author?.["@id"] !== `${site}/about#founder`) fail(`Invalid Article author on ${path}`);
  if (article.publisher?.["@id"] !== `${site}/#organization`) fail(`Invalid publisher on ${path}`);
  if (article.articleSection !== "Financial Data & ERP") fail(`Invalid articleSection on ${path}`);
  if (!breadcrumb) fail(`Breadcrumb schema missing on ${path}`);
  if (!slugs.filter((candidate) => candidate !== slug).every((candidate) => html.includes(`href="/resources/${candidate}"`))) fail(`Cluster link missing on ${path}`);
  if (!registry.includes(`slug: "${slug}"`) || !registry.includes(`canonicalPath: "${path}"`)) fail(`Resources registry entry missing for ${path}`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`Sitemap entry missing for ${path}`);
  if (html.includes("entimema.net")) fail(`Legacy domain found on ${path}`);
  if (!html.includes(`/resources/covers/${slug}.png`)) fail(`Cover URL missing on ${path}`);
}

console.log(`Financial Intelligence cluster audit passed: ${slugs.length} generated pages.`);
