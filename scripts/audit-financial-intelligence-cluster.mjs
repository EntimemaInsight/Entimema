import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), ".next", "server", "app");
const site = "https://www.entimema.com";
const slugs = [
  "variance-analysis-price-volume-mix-cost-drivers",
  "horizontal-and-vertical-financial-analysis",
  "financial-data-normalisation",
  "trial-balance-to-financial-statements",
  "financial-data-validation-control-layer",
  "confidence-human-review-ai-finance",
  "traceable-financial-analysis-workflow",
];
const titles = {
  "variance-analysis-price-volume-mix-cost-drivers": "Variance Analysis: Price, Volume, Mix and Cost Drivers | Entimema",
  "horizontal-and-vertical-financial-analysis": "Horizontal and Vertical Financial Analysis Explained | Entimema",
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
  if (article.articleSection !== (slug === "variance-analysis-price-volume-mix-cost-drivers" ? "Planning & Forecasting" : slug === "horizontal-and-vertical-financial-analysis" ? "Financial Architecture" : "Financial Data & ERP")) fail(`Invalid articleSection on ${path}`);
  if (!breadcrumb) fail(`Breadcrumb schema missing on ${path}`);
  if (!slugs.filter((candidate) => candidate !== slug).every((candidate) => html.includes(`href="/resources/${candidate}"`))) fail(`Cluster link missing on ${path}`);
  if (!registry.includes(`slug: "${slug}"`) || !registry.includes(`canonicalPath: "${path}"`)) fail(`Resources registry entry missing for ${path}`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`Sitemap entry missing for ${path}`);
  if (html.includes("entimema.net")) fail(`Legacy domain found on ${path}`);
  if (!html.includes(`/resources/covers/${slug}.png`)) fail(`Cover URL missing on ${path}`);
}

console.log(`Financial Intelligence cluster audit passed: ${slugs.length} generated pages.`);

// FIR-06: validate the published numerical table, rather than a duplicate fixture.
const { default: ts } = await import("typescript");
const firSource = readFileSync(join(process.cwd(), "app/resources/HorizontalVerticalAnalysisArticle.tsx"), "utf8");
const firFile = ts.createSourceFile("FIR06.tsx", firSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const firFunction = firFile.statements.find((n) => ts.isFunctionDeclaration(n) && n.name?.text.endsWith("Article"));
const parts = [];
const ignored = new Set(["className", "href", "id", "key", "src", "style"]);
function visitFir(n) {
  if (ts.isJsxText(n)) { parts.push(n.text); return; }
  if (ts.isJsxAttribute(n) && ignored.has(n.name.getText(firFile))) return;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isNumericLiteral(n)) { parts.push(n.text); return; }
  ts.forEachChild(n, visitFir);
}
visitFir(firFunction.body);
const firWords = parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
const firMinutes = Math.max(1, Math.round(firWords / 220));
if (firWords >= 4500 || firMinutes < 18 || firMinutes > 22) fail(`FIR-06 length: ${firWords} words / ${firMinutes} minutes`);
const firRecord = registry.split('// FIR-06;')[1]?.split('status: "published"')[0];
if (!firRecord?.includes(`readingMinutes: ${firMinutes}`)) fail("FIR-06 card reading time does not match body");
const firHtml = readFileSync(join(root, "resources/horizontal-and-vertical-financial-analysis.html"), "utf8");
if (!firHtml.replace(/<!--.*?-->/g, "").includes(`${firMinutes} min read`)) fail("FIR-06 article reading time does not match body");
const number = (s) => Number(s.replaceAll("−", "-").replaceAll("%", ""));
const close = (actual, expected, tolerance, label) => { if (Math.abs(actual - expected) > tolerance) fail(`${label}: ${actual} != ${expected}`); };
const tableRows = [...firSource.matchAll(/\["([^"]+)", "([\d.]+) → ([\d.]+)", "([^"]+)", "([\d.]+)% → ([\d.]+)%", "([^"]+)"\]/g)];
if (tableRows.length !== 15) fail(`FIR-06 expected 15 comparative rows, got ${tableRows.length}`);
const values = new Map();
for (const [index, row] of tableRows.entries()) {
  const [, label, baseText, currentText, changes, shareBase, shareCurrent, points] = row;
  const base = number(baseText), current = number(currentText);
  const [absolute, relative] = changes.split(" / ");
  const d0 = index < 8 ? 50 : 35, dt = index < 8 ? 59 : 41;
  close(number(absolute), current - base, 0.051, `${label} absolute`);
  if (base === 0) { if (relative !== "n.m.") fail(`${label} needs n.m.`); }
  else close(number(relative), (current - base) / Math.abs(base) * 100, 0.051, `${label} relative`);
  close(number(shareBase), base / d0 * 100, 0.0051, `${label} base share`);
  close(number(shareCurrent), current / dt * 100, 0.0051, `${label} current share`);
  close(number(points), (current / dt - base / d0) * 100, 0.0051, `${label} points`);
  values.set(label, [base, current]);
}
for (const i of [0, 1]) {
  const v = (name) => values.get(name)[i];
  close(v("Revenue") - v("Cost of sales"), v("Gross profit"), 1e-9, "Gross profit reconciliation");
  close(v("Gross profit") - v("Logistics") - v("Payroll and other operating costs") + v("Non-recurring income"), v("Reported EBITDA"), 1e-9, "EBITDA reconciliation");
  close(v("Reported EBITDA") - v("Non-recurring income"), v("Recurring EBITDA"), 1e-9, "Recurring EBITDA reconciliation");
}
const firAsset = readFileSync(join(process.cwd(), "public/resources/covers/horizontal-and-vertical-financial-analysis.png"));
if (firAsset.readUInt32BE(16) !== 1536 || firAsset.readUInt32BE(20) !== 1024) fail("FIR-06 cover must be 1536 x 1024");
for (const [, href] of firSource.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
  if (href.startsWith("/resources/")) {
    if (!existsSync(join(root, `${href.slice(1)}.html`))) fail(`Missing FIR-06 related route: ${href}`);
  } else if (!existsSync(join(process.cwd(), "app", href.slice(1), "page.tsx"))) fail(`Missing FIR-06 service/contact route: ${href}`);
}
console.log(`FIR-06 content, all 15 numerical rows, reconciliations, reading time, links and cover passed: ${firWords} words / ${firMinutes} min.`);

const pairFrom = (pattern, label) => {
  const match = firSource.match(pattern);
  if (!match) fail(`Missing ${label} reconciliation inputs`);
  return match.slice(1).map(Number);
};
const otherAssets = pairFrom(/Other assets are ([\d.]+) and ([\d.]+)\./, "other assets");
const payables = pairFrom(/Supplier payables are ([\d.]+) and ([\d.]+),/, "payables");
const otherLiabilities = pairFrom(/other liabilities ([\d.]+) and ([\d.]+),/, "other liabilities");
const equity = pairFrom(/equity ([\d.]+) and ([\d.]+)\./, "equity");
for (const i of [0, 1]) {
  const v = (name) => values.get(name)[i];
  close(v("Inventory") + v("Trade receivables") + v("Total cash") + otherAssets[i], v("Total assets"), 1e-9, "Asset reconciliation");
  close(v("Current debt") + v("Non-current debt") + payables[i] + otherLiabilities[i] + equity[i], v("Total assets"), 1e-9, "Liabilities plus equity reconciliation");
}
const movement = (name) => values.get(name)[1] - values.get(name)[0];
const tradeWorkingCapital = movement("Inventory") + movement("Trade receivables") - (payables[1] - payables[0]);
close(tradeWorkingCapital, 4.8, 1e-9, "Trade working capital");
const operatingCash = values.get("Reported EBITDA")[1] - tradeWorkingCapital - 0.8 - 0.7 + (otherLiabilities[1] - otherLiabilities[0]);
close(operatingCash, -0.6, 1e-9, "Operating cash");
close(operatingCash - 1.9 + movement("Current debt") + movement("Non-current debt") + 2.5, movement("Total cash"), 1e-9, "Cash flow reconciliation");
console.log("FIR-06 Balance Sheet, working-capital and cash-flow bridges passed.");

// FIR-07: parse published table inputs and validate the displayed bridges.
const vSlug = "variance-analysis-price-volume-mix-cost-drivers";
const vSource = readFileSync("app/resources/VarianceAnalysisArticle.tsx", "utf8");
const vFile = ts.createSourceFile("FIR07.tsx", vSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const vBody = vFile.statements.find(n => ts.isFunctionDeclaration(n)).body;
const vParts = [];
function visitVariance(n) {
  if (ts.isJsxText(n)) { vParts.push(n.text); return; }
  if (ts.isJsxAttribute(n) && ignored.has(n.name.getText(vFile))) return;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isNumericLiteral(n)) { vParts.push(n.text); return; }
  ts.forEachChild(n, visitVariance);
}
visitVariance(vBody);
const vWords = vParts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
const vMinutes = Math.max(1, Math.round(vWords / 220));
if (vWords >= 4500 || vMinutes < 18 || vMinutes > 22) fail("FIR-07 length: " + vWords + " / " + vMinutes);
const vRecord = registry.split("// FIR-07;")[1]?.split('status: "published"')[0];
if (!vRecord?.includes("readingMinutes: " + vMinutes)) fail("FIR-07 card reading time mismatch");
const vHtml = readFileSync(join(root, "resources", vSlug + ".html"), "utf8");
if (!vHtml.replace(/<!--.*?-->/g, "").includes(vMinutes + " min read")) fail("FIR-07 article reading time mismatch");
const vTables = [];
function collectTables(n) {
  if (ts.isJsxSelfClosingElement(n) && n.tagName.getText(vFile) === "ResourceTable") {
    const rows = n.attributes.properties.find(a => a.name?.getText(vFile) === "rows")?.initializer?.expression;
    if (rows && ts.isArrayLiteralExpression(rows)) vTables.push(rows.elements.map(row => row.elements.map(cell => cell.text)));
  }
  ts.forEachChild(n, collectTables);
}
collectTables(vBody);
const num = s => Number(s.replaceAll(",", "").replaceAll("+", ""));
const inputs = vTables.find(t => t[0]?.[0] === "Product A").slice(0, 2).map(r => r.slice(1).map(num));
const qb = inputs.reduce((n,r)=>n+r[0],0), qa = inputs.reduce((n,r)=>n+r[3],0);
const rb = inputs.reduce((n,r)=>n+r[2],0), ra = inputs.reduce((n,r)=>n+r[5],0);
for (const r of inputs) { close(r[0]*r[1],r[2],0,"FIR07 budget row"); close(r[3]*r[4],r[5],0,"FIR07 actual row"); }
const effects = [(qa-qb)*rb/qb, inputs.reduce((n,r)=>n+(r[3]-qa*r[0]/qb)*r[1],0), inputs.reduce((n,r)=>n+r[3]*(r[4]-r[1]),0)];
const revenueBridge = vTables.find(t => t[0]?.[0] === "Budget revenue");
let running = rb;
for (let i=0;i<3;i++) { close(effects[i],num(revenueBridge[i+1][1]),1e-8,"FIR07 revenue effect"); running+=effects[i]; close(running,num(revenueBridge[i+1][2]),1e-8,"FIR07 revenue running total"); }
close(running,ra,1e-8,"FIR07 revenue identity");
const material = vTables.find(t => t[0]?.[0] === "Standard quantity allowed").map(r => Number(r[1].replace(/[^0-9.]/g,"")));
const [sq,sp,aq,ap] = material;
const costBridge = vTables.find(t => t[0]?.[0] === "Standard cost allowed");
close(sq*sp,num(costBridge[0][2]),1e-8,"FIR07 standard cost");
close(aq*(ap-sp),num(costBridge[1][1]),1e-8,"FIR07 material price");
close((aq-sq)*sp,num(costBridge[2][1]),1e-8,"FIR07 material usage");
close(aq*ap,num(costBridge[2][2]),1e-8,"FIR07 actual cost");
close(sq*sp+num(costBridge[1][1]),num(costBridge[1][2]),1e-8,"FIR07 cost intermediate");
close(num(costBridge[1][1])+num(costBridge[2][1]),aq*ap-sq*sp,1e-8,"FIR07 cost identity");
for (const table of [revenueBridge,costBridge]) if (num(table.at(-1)[1])!==0) fail("FIR07 residual nonzero");
const vAsset = readFileSync("public/resources/covers/"+vSlug+".png");
if (vAsset.readUInt32BE(16)!==1536 || vAsset.readUInt32BE(20)!==1024) fail("FIR07 cover dimensions");
for (const [,href] of vSource.matchAll(/href="([^"#]+)"/g)) {
 if (!href.startsWith("/")) continue;
 if (href.startsWith("/resources/")) { if (!existsSync(join(root,href.slice(1)+".html"))) fail("FIR07 missing route "+href); }
 else if (!existsSync(join(process.cwd(),"app",href.slice(1),"page.tsx"))) fail("FIR07 missing service "+href);
}
console.log("FIR-07 passed: "+vWords+" words / "+vMinutes+" min; PVM, cost, residuals, metadata, cover and links.");
