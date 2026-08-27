import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import ts from "typescript";

const slug = "management-reporting-for-cfo-decisions";
const source = readFileSync("app/resources/ManagementReportingArticle.tsx", "utf8");
const file = ts.createSourceFile("FIR11.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const body = file.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text.endsWith("Article")).body;
const parts = [], tables = new Map(), frameworks = [];
const ignored = new Set(["className", "href", "id", "key", "src", "style"]);
function content(n) {
  if (ts.isJsxText(n)) { parts.push(n.text); return; }
  if (ts.isJsxAttribute(n) && ignored.has(n.name.getText(file))) return;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isNumericLiteral(n)) { parts.push(n.text); return; }
  ts.forEachChild(n, content);
}
function collect(n) {
  if (ts.isJsxSelfClosingElement(n)) {
    const tag = n.tagName.getText(file);
    const attr = name => n.attributes.properties.find(a => a.name?.getText(file) === name)?.initializer;
    if (tag === "ResourceTable") tables.set(attr("caption").text, attr("rows").expression.elements.map(r => r.elements.map(c => c.text)));
    if (tag === "EntimemaFramework") frameworks.push(attr("steps").expression.elements.map(e => e.text));
  }
  ts.forEachChild(n, collect);
}
content(body); collect(body);
const words = parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
const minutes = Math.max(1, Math.round(words / 220));
assert(words < 4500 && minutes >= 18 && minutes <= 22, `Length: ${words}/${minutes}`);
const table = prefix => [...tables].find(([caption]) => caption.startsWith(prefix))?.[1];
const number = s => Number(s.replaceAll("−", "-").replaceAll("%", ""));
const close = (actual, expected, label, tolerance = 1e-8) => {
  assert(Number.isFinite(actual) && Number.isFinite(expected), label);
  assert(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};
const headlines = new Map(table("Validated headline").map(r => [r[0], r.slice(1).map(s => number(s.replace(" days", "")))]));
const inputs = table("Fictional product inputs").map(r => r.slice(1).map(number));
const qb = inputs.reduce((n,r) => n+r[0],0), qa = inputs.reduce((n,r) => n+r[2],0);
const rb = inputs.reduce((n,r) => n+r[0]*r[1],0), ra = inputs.reduce((n,r) => n+r[2]*r[3],0);
close(rb/1e6, headlines.get("Revenue")[0], "Budget revenue");
close(ra/1e6, headlines.get("Revenue")[1], "Actual revenue");
const volume = (qa-qb)*rb/qb;
const mix = inputs.reduce((n,r) => n+(r[2]-qa*r[0]/qb)*r[1],0);
const price = inputs.reduce((n,r) => n+r[2]*(r[3]-r[1]),0);
const narrativeDrivers = source.match(/gives volume \+([\d.]+)m, mix \+([\d.]+)m and Core price −([\d.]+)m/).slice(1).map(Number);
[volume,mix,-price].forEach((v,i) => close(v/1e6,narrativeDrivers[i],"Revenue driver"));
close(rb+volume+mix+price,ra,"Revenue bridge");
const gp = table("Reconciled gross-profit");
let running=number(gp[0][1]);
for(const r of gp.slice(1)) { running+=number(r[1]); close(running,number(r[2]),r[0]); }
const budgetGP=inputs.reduce((n,r)=>n+r[0]*r[1]*r[4]/100,0)/1e6;
const standardGP=inputs.reduce((n,r)=>n+r[2]*r[1]*r[4]/100,0)/1e6;
close(budgetGP,number(gp[0][2]),"Budget gross profit");
close(budgetGP*(qa/qb-1),number(gp[1][1]),"Gross-profit volume");
close(standardGP-budgetGP*qa/qb,number(gp[2][1]),"Gross-profit mix");
close(price/1e6,number(gp[3][1]),"Gross-profit price");
close(number(gp[5][2])/headlines.get("Revenue")[1]*100,headlines.get("Gross margin")[1],"Actual gross margin");
close(running,headlines.get("EBITDA")[1],"Actual EBITDA");
assert(standardGP/((ra-price)/1e6)*100 < headlines.get("Gross margin")[0],"Positive revenue mix must dilute margin");
const cash=table("EBITDA-to-cash bridge");
for(const col of [1,2]) {
  close(cash.slice(0,-1).reduce((n,r)=>n+number(r[col]),0),number(cash.at(-1)[col]),"Operating cash bridge");
  close(number(cash[0][col]),headlines.get("EBITDA")[col-1],"Cash bridge EBITDA");
  close(number(cash.at(-1)[col]),headlines.get("Operating cash")[col-1],"Operating cash headline");
}
const match = pattern => source.match(pattern).slice(1).map(Number);
const [opening]=match(/Opening net debt is ([\d.]+)m/);
const [capexA, cashA, debtA, capexB, cashB, debtB]=match(/Actual capex ([\d.]+)m less operating cash ([\d.]+)m increases it to ([\d.]+)m; budget capex ([\d.]+)m less cash ([\d.]+)m gives ([\d.]+)m/);
close(opening+capexA-cashA,debtA,"Actual net debt"); close(debtA,headlines.get("Net debt")[1],"Actual debt headline");
close(opening+capexB-cashB,debtB,"Budget net debt"); close(debtB,headlines.get("Net debt")[0],"Budget debt headline");
const h2=match(/H2 revenue ([\d.]+)m, EBITDA ([\d.]+)m and operating cash ([\d.]+)m/);
["Revenue","EBITDA","Operating cash"].forEach((key,i)=>close(headlines.get(key)[2]-headlines.get(key)[1],h2[i],"H2 "+key));
const [fyCapex,fyCash,fyNetDebt]=match(/Full-year capex ([\d.]+)m less operating cash ([\d.]+)m gives closing net debt ([\d.]+)m/);
close(opening+fyCapex-fyCash,fyNetDebt,"FY net debt"); close(fyNetDebt,headlines.get("Net debt")[2],"FY debt headline");
const [debt,freeCash,facility,liquidity]=match(/Forecast debt ([\d.]+)m and unrestricted cash ([\d.]+)m, against a committed available facility of ([\d.]+)m, leave available liquidity ([\d.]+)m/);
close(facility-debt+freeCash,liquidity,"Liquidity availability"); close(debt-freeCash,fyNetDebt,"Forecast cash/debt");
const [delay,stressed,deferral,restored]=match(/delaying ([\d.]+)m of collections beyond year-end reduces liquidity to ([\d.]+)m\. Deferring ([\d.]+)m of non-essential H2 capex would restore ([\d.]+)m/);
close(liquidity-delay,stressed,"Collection sensitivity"); close(stressed+deferral,restored,"Capex response");
assert.equal(table("Executive decision page").length,5);
assert.equal(table("Management-pack architecture").length,6);
assert.equal(table("Reporting readiness").length,6);
assert.equal(table("Failure →").length,20);
assert.deepEqual(frameworks.map(f=>f.length),[4,4]);
const sections=[...source.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(sections).size,sections.length);
for(const id of sections)assert(source.includes(`{ id: "${id}", label:`),`Contents: ${id}`);
const registry=readFileSync("app/resources/resource-data.ts","utf8");
const record=registry.split("// FIR-11;")[1].split('status: "published"')[0];
assert.equal((registry.match(new RegExp(`slug: "${slug}"`,"g"))||[]).length,1);
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-architecture", stream: "insights"'));
const cover=readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(cover.readUInt32BE(16),1536);assert.equal(cover.readUInt32BE(20),1024);
const digest=b=>createHash("sha256").update(b).digest("hex");
for(const asset of readdirSync("public/resources/covers").filter(p=>p.endsWith(".png") && p!==slug+".png"))
  assert.notEqual(digest(cover),digest(readFileSync(join("public/resources/covers",asset))),"Cover must be unique");
if(!process.argv.includes("--source-only")) {
  const root=".next/server/app",html=readFileSync(`${root}/resources/${slug}.html`,"utf8");
  const clean=html.replace(/<!--.*?-->/g,"");
  assert(clean.includes(`${minutes} min read`));
  assert(html.includes('<title>Management Reporting for CFO Decisions | Entimema</title>'));
  const url=`https://www.entimema.com/resources/${slug}`;
  assert(html.includes(`<link rel="canonical" href="${url}"`));
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
  assert(!/noindex/.test(html));
  for(const property of ['og:image','og:title','og:description','article:published_time'])assert(html.includes(`property="${property}"`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  const graph=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])["@graph"]??[]);
  const article=graph.find(x=>x["@type"]==="Article");
  assert.equal(article.articleSection,"Financial Architecture");
  assert.equal(article.author["@id"],"https://www.entimema.com/about#founder");
  assert.equal(article.publisher["@id"],"https://www.entimema.com/#organization");
  assert.equal(article.datePublished,"2026-08-27");assert.equal(article.dateModified,article.datePublished);
  assert(graph.some(x=>x["@type"]==="BreadcrumbList"));
  for(const [,href] of source.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    assert(html.includes(`href="${href}"`));
    assert(existsSync(`${root}${href}.html`)||existsSync(`app${href}/page.tsx`),`Route ${href}`);
  }
  for(const id of sections)assert(html.includes(`id="${id}"`));
  const listing=existsSync(`${root}/resources.html`) ? readFileSync(`${root}/resources.html`,"utf8") : null;
  if (listing) assert.equal((listing.match(new RegExp(`href="/resources/${slug}"`,"g"))||[]).length,1);
  assert(!readFileSync(`${root}/resources/engineering.html`,"utf8").includes(`href="/resources/${slug}"`));
  assert(readFileSync(`${root}/resources/month-end-reporting-workflow.html`,"utf8").includes(`href="/resources/${slug}"`));
  assert.equal((readFileSync(`${root}/sitemap.xml.body`,"utf8").match(new RegExp(`<loc>${url}</loc>`,"g"))||[]).length,1);
}
console.log(`FIR-11 passed: ${words} words / ${minutes} min; PVM, gross profit, EBITDA, cash, net debt, forecast, sensitivity, five findings, readiness, cover${process.argv.includes("--source-only")?"":"; generated route, links, reading parity, metadata and schema"}.`);
