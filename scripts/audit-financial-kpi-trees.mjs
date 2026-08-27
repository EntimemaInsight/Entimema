import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";

const slug = "financial-kpi-trees";
const source = readFileSync("app/resources/FinancialKpiTreesArticle.tsx", "utf8");
const file = ts.createSourceFile("FIR12.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
assert.equal(file.parseDiagnostics.length, 0);
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
    const attr = name => n.attributes.properties.find(a => a.name?.getText(file) === name)?.initializer;
    if (n.tagName.getText(file) === "ResourceTable")
      tables.set(attr("caption").text, attr("rows").expression.elements.map(r => r.elements.map(c => c.text)));
    if (n.tagName.getText(file) === "EntimemaFramework")
      frameworks.push(attr("steps").expression.elements.map(e => e.text));
  }
  ts.forEachChild(n, collect);
}
content(body); collect(body);
const words = parts.join(" ").trim().split(/\s+/u).filter(Boolean).length, minutes = Math.round(words / 220);
assert(words < 4500 && minutes >= 18 && minutes <= 22, `Length: ${words}/${minutes}`);
const table = prefix => [...tables].find(([caption]) => caption.startsWith(prefix))[1];
const number = s => Number(s.replaceAll("−", "-").replaceAll("%", "").replaceAll(",", ""));
const map = prefix => new Map(table(prefix).map(r => [r[0], r.slice(1).map(number)]));
const close = (actual, expected, label, tolerance = 1e-8) => {
  assert(Number.isFinite(actual) && Number.isFinite(expected), label);
  assert(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};
const match = regex => {
  const result = source.match(regex);
  assert(result, `Missing auditable input: ${regex}`);
  return result.slice(1).map(number);
};
const h = map("Validated headline");
const [qb, pb, qa, pa] = match(/Core sells ([\d,]+) units at EUR ([\d.]+) previously and ([\d,]+) at EUR ([\d.]+) currently/);
const [sb, sa, usd] = match(/Specialist sells ([\d,]+) then ([\d,]+) units at unchanged USD ([\d.]+)/);
const [fxb, fxn, fxd] = match(/EUR per USD changes from ([\d.]+) to exactly (\d+)\/(\d+)/);
const fxa = fxn / fxd, totalB = qb + sb, totalA = qa + sa;
const revB = (qb * pb + sb * usd * fxb) / 1e6, revA = (qa * pa + sa * usd * fxa) / 1e6;
close(revB, h.get("Revenue")[0], "Prior revenue"); close(revA, h.get("Revenue")[1], "Current revenue");
const v = (totalA / totalB - 1) * revB;
const mix = ((qa - totalA * qb / totalB) * pb + (sa - totalA * sb / totalB) * usd * fxb) / 1e6;
const price = qa * (pa - pb) / 1e6, fx = sa * usd * (fxa - fxb) / 1e6;
const revenue = table("Revenue bridge"), gp = table("Gross-profit bridge");
[v, mix, price, fx].forEach((n, i) => close(n, number(revenue[i + 1][1]), "PVM/FX contribution"));
for (const rows of [revenue, gp]) {
  let running = number(rows[0][2]);
  for (const row of rows.slice(1)) { running += number(row[1]); close(running, number(row[2]), row[0]); }
  close(number(rows.at(-1)[1]), 0, "Visible zero residual");
}
const [cm, sm] = match(/Prior gross margins are ([\d.]+)% Core and ([\d.]+)% Specialist/);
const [cv, sv] = match(/Standard variable costs are EUR ([\d.]+) and EUR ([\d.]+) per unit/);
const [cf, sf] = match(/allocated fixed costs are EUR ([\d.]+) and EUR ([\d.]+)/);
const [fixed] = match(/Fixed manufacturing expense remains EUR ([\d.]+)m/);
close((pb-cv-cf)/pb*100,cm,"Core gross margin");
close((usd*fxb-sv-sf)/(usd*fxb)*100,sm,"Specialist gross margin");
const priorGP = (qb * pb * cm/100 + sb * usd * fxb * sm/100)/1e6;
const standardGP = (qa * pb * cm/100 + sa * usd * fxb * sm/100)/1e6;
close(priorGP,h.get("Gross profit")[0],"Prior gross profit");
close(priorGP*(totalA/totalB-1),number(gp[1][1]),"GP volume");
close(standardGP-priorGP*totalA/totalB,number(gp[2][1]),"GP mix");
close((qa*cf+sa*sf)/1e6-fixed,number(gp[5][1]),"Fixed absorption");
assert(standardGP/(revB+v+mix)<priorGP/revB,"Mix must dilute margin");
assert((usd*fxb-sv)/(usd*fxb)<(pb-cv)/pb,"Specialist contribution rate");
const [sq, sp, aq] = match(/standard allowed consumption is ([\d.]+)m kg at EUR ([\d.]+)\/kg; actual consumption is ([\d.]+)m kg/);
const [apBase, apDelta, apQty] = match(/Actual price is EUR ([\d.]+) \+ EUR ([\d.]+)m \/ ([\d.]+)m kg/);
close(aq,apQty,"Actual material quantity");
close(aq*(apBase+apDelta/apQty-sp),-number(gp[6][1]),"Material price");
close((aq-sq)*sp,-number(gp[7][1]),"Material usage");
close(number(gp.at(-1)[2]),h.get("Gross profit")[1],"GP bridge endpoint");
const [ob,oa] = match(/Operating expenses rise from EUR ([\d.]+)m to EUR ([\d.]+)m/);
[ob,oa].forEach((o,i)=>close(h.get("Gross profit")[i]-o,h.get("EBITDA")[i],"EBITDA"));
const days=map("Working-capital days"), closing=map("Cash-relevant closing"), cash=table("EBITDA-to-cash");
for(const i of [0,1]) {
  close(h.get("Gross profit")[i]/h.get("Revenue")[i]*100,h.get("Gross margin")[i],"Gross margin");
  close(h.get("Revenue")[i]*days.get("DSO")[i]/365,days.get("Average receivables")[i],"Average AR",0.0000006);
  close((h.get("Revenue")[i]-h.get("Gross profit")[i])*days.get("DIO")[i]/365,days.get("Average inventory")[i],"Average stock",0.0000006);
  close(days.get("Credit purchases")[i]*days.get("DPO")[i]/365,days.get("Average payables")[i],"Average AP",0.0000006);
  close(closing.get("OWC")[i+1]-closing.get("OWC")[i],-number(cash[1][i+1]),"Cash OWC movement");
  close(cash.slice(0,-1).reduce((n,r)=>n+number(r[i+1]),0),h.get("Operating cash")[i],"Cash bridge");
}
for(const i of [0,1,2]) close(closing.get("Receivables")[i]+closing.get("Inventory")[i]-closing.get("Payables")[i],closing.get("OWC")[i],"Closing OWC");
const [db,da] = match(/Depreciation is EUR ([\d.]+)m then EUR ([\d.]+)m/);
const [eb,ea,tax] = match(/EBIT is therefore EUR ([\d.]+)m then EUR ([\d.]+)m; at a ([\d.]+)% normalised tax rate/);
const [wb,wa] = match(/Monthly average OWC increases from EUR ([\d.]+)m to EUR ([\d.]+)m/);
const [fb,fa] = match(/average productive fixed assets increase from EUR ([\d.]+)m to EUR ([\d.]+)m/);
for (const i of [0,1]) {
  close(h.get("EBITDA")[i]-[db,da][i],[eb,ea][i],"EBIT");
  close([eb,ea][i]*(1-tax/100),h.get("NOPAT")[i],"NOPAT");
  close(days.get("Average receivables")[i]+days.get("Average inventory")[i]-days.get("Average payables")[i],[wb,wa][i],"Average OWC",0.000002);
  close([wb,wa][i]+[fb,fa][i],h.get("Average invested capital")[i],"Invested capital");
  const roic=h.get("NOPAT")[i]/h.get("Average invested capital")[i]*100;
  close(Math.round(roic*10)/10,h.get("ROIC")[i],"Displayed ROIC");
  close((h.get("NOPAT")[i]/h.get("Revenue")[i])*(h.get("Revenue")[i]/h.get("Average invested capital")[i])*100,roic,"ROIC decomposition");
}
const [capb,capa,fcfb,fcfa]=match(/Capex rises from EUR ([\d.]+)m to EUR ([\d.]+)m; defined free cash flow falls from EUR ([\d.]+)m to minus EUR ([\d.]+)m/);
close(h.get("Operating cash")[0]-capb,fcfb,"Prior FCF");close(h.get("Operating cash")[1]-capa,-fcfa,"Current FCF");
assert.equal(table("Relationship types").length,4);assert.equal(table("Controllability").length,7);assert.equal(table("Failure →").length,21);
assert(frameworks.every(f=>f.length<=5));
const sections=[...source.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(sections).size,sections.length);
for(const id of sections)assert(source.includes(`{ id: "${id}", label:`));
const registry=readFileSync("app/resources/resource-data.ts","utf8");
const record=registry.split("// FIR-12;")[1].split('status: "published"')[0];
assert.equal((registry.match(/slug: "financial-kpi-trees"/g)||[]).length,1);
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-architecture", stream: "insights"'));
const cover=readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(cover.readUInt32BE(16),1536);assert.equal(cover.readUInt32BE(20),1024);
const digest=b=>createHash("sha256").update(b).digest("hex");
for(const name of readdirSync("public/resources/covers").filter(n=>n.endsWith(".png")&&n!==slug+".png"))
  assert.notEqual(digest(cover),digest(readFileSync("public/resources/covers/"+name)),"Unique cover");
if(!process.argv.includes("--source-only")) {
  const root=".next/server/app", html=readFileSync(`${root}/resources/${slug}.html`,"utf8"), url=`https://www.entimema.com/resources/${slug}`;
  assert(html.replace(/<!--.*?-->/g,"").includes(`${minutes} min read`));
  assert(html.includes('<title>Financial KPI Trees: Connect Drivers to Profit, Cash and ROIC | Entimema</title>'));
  assert(html.includes(`<link rel="canonical" href="${url}"`));
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert(!/noindex/.test(html));
  for(const property of ["og:image","og:title","og:description","article:published_time"])assert(html.includes(`property="${property}"`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  const graph=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])["@graph"]??[]);
  const article=graph.find(x=>x["@type"]==="Article");
  assert.equal(article.articleSection,"Financial Architecture");assert.equal(article.datePublished,"2026-08-27");
  assert.equal(article.author["@id"],"https://www.entimema.com/about#founder");
  assert.equal(article.publisher["@id"],"https://www.entimema.com/#organization");
  assert(graph.some(x=>x["@type"]==="BreadcrumbList"));
  for(const [,href] of source.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g))
    assert(existsSync(`${root}${href}.html`)||existsSync(`app${href}/page.tsx`),`Route ${href}`);
  for(const id of sections)assert(html.includes(`id="${id}"`));
  assert(!readFileSync(`${root}/resources/engineering.html`,"utf8").includes(`href="/resources/${slug}"`));
  assert(readFileSync(`${root}/resources/management-reporting-for-cfo-decisions.html`,"utf8").includes(`href="/resources/${slug}"`));
  assert.equal((readFileSync(`${root}/sitemap.xml.body`,"utf8").match(new RegExp(`<loc>${url}</loc>`,"g"))||[]).length,1);
}
console.log(`FIR-12 passed: ${words} words / ${minutes} min; source-derived revenue, mix, FX, material, profit, cash, averages, FCF and ROIC; controls, cover and${process.argv.includes("--source-only")?" source":" generated route/metadata/schema/link"} validation.`);
