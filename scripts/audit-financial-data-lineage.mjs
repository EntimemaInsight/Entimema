import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const slug='financial-data-lineage';
const source=readFileSync('app/resources/FinancialDataLineageArticle.tsx','utf8');
const file=ts.createSourceFile('FIR13.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(file.parseDiagnostics.length,0);
const body=file.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text.endsWith('Article')).body;
const parts=[],tables=new Map();
const ignored=new Set(['className','href','id','key','src','style']);
function content(n) {
  if(ts.isJsxText(n)){parts.push(n.text);return;}
  if(ts.isJsxAttribute(n)&&ignored.has(n.name.getText(file)))return;
  if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)||ts.isNumericLiteral(n)){parts.push(n.text);return;}
  ts.forEachChild(n,content);
}
function collect(n) {
  if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(file)==='ResourceTable') {
    const attr=name=>n.attributes.properties.find(a=>a.name?.getText(file)===name).initializer;
    tables.set(attr('caption').text,attr('rows').expression.elements.map(r=>r.elements.map(c=>c.text)));
  }
  ts.forEachChild(n,collect);
}
content(body);collect(body);
const words=parts.join(' ').trim().split(/\s+/u).filter(Boolean).length,minutes=Math.round(words/220);
assert(words<4500&&minutes>=18&&minutes<=22,`Length ${words}/${minutes}`);
const table=prefix=>[...tables].find(([c])=>c.startsWith(prefix))[1];
assert.equal(table('Minimum financial').length,10);
assert.deepEqual(table('Four evidence').map(r=>r[0]),['Evidence','Inference','Hypothesis','Decision']);
assert.equal(table('Purpose-specific').length,8);
assert.equal(table('Failure →').length,20);
assert.equal(table('Compact fictional').length,12);
const nums=re=>{const m=source.match(re);assert(m,`Missing example values: ${re}`);return m.slice(1).map(n=>Number(n.replaceAll(',','')));};
const [rawCash]=nums(/current-period column contains ([\d,]+)\./);
const [rawRestricted]=nums(/current-period column contains ([\d,]+) EUR thousands/);
const accounts=nums(/closing-EUR column contains ([\d,]+), ([\d,]+) and ([\d,]+)\./);
const [scale]=nums(/Transformation T1 multiplies by ([\d,]+)/);
const [currentDebt,nonCurrentDebt]=nums(/current debt of EUR ([\d.]+)m in row 6 and non-current debt of EUR ([\d.]+)m/);
const [shownCash,shownRestriction,shownAvailable]=nums(/EUR ([\d.]+)m − EUR ([\d.]+)m = EUR ([\d.]+)m/);
const [coverageCash,coverageDebt,shownCoverage]=nums(/EUR ([\d.]+)m \/ EUR ([\d.]+)m × 100 ≈ ([\d.]+)%/);
const [shownTotalDebt]=nums(/total debt is EUR ([\d.]+)m/);
const [shownPriorCoverage]=nums(/earlier proposal implied approximately ([\d.]+)%/);
const [shownGap]=nums(/The EUR ([\d.]+)m difference/);
const cash=rawCash*scale/1e6,restricted=rawRestricted*scale/1e6,available=cash-restricted;
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
close(accounts.reduce((a,b)=>a+b,0)/1e6,cash);
close(cash,shownCash);close(restricted,shownRestriction);close(available,shownAvailable);
close(coverageCash,available);close(coverageDebt,currentDebt);
close(Math.round(available/currentDebt*1000)/10,shownCoverage);
close(Math.round(cash/currentDebt*1000)/10,shownPriorCoverage);
close(currentDebt+nonCurrentDebt,shownTotalDebt);close(currentDebt-available,shownGap);
for(const evidence of ['TC1 v1','RC1 v2','E1 v1','E2 v1','T1 v1','T2 v1','Maturity!D6','R1','M2','C1 v2','C2 v2','F1 v2'])assert(source.includes(evidence),evidence);
const sections=[...source.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(sections).size,11);
for(const id of sections)assert(source.includes(`{ id: "${id}", label:`));
const registry=readFileSync('app/resources/resource-data.ts','utf8');
assert.equal((registry.match(/slug: "financial-data-lineage"/g)||[]).length,1);
const record=registry.split('// FIR-13;')[1].split('status: "published"')[0];
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-data-and-erp", stream: "insights"'));
const cover=readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(cover.readUInt32BE(16),1536);assert.equal(cover.readUInt32BE(20),1024);
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const name of readdirSync('public/resources/covers').filter(n=>n.endsWith('.png')&&n!==slug+'.png'))assert.notEqual(hash(cover),hash(readFileSync('public/resources/covers/'+name)));
if(!process.argv.includes('--source-only')) {
  const root='.next/server/app',html=readFileSync(`${root}/resources/${slug}.html`,'utf8'),url=`https://www.entimema.com/resources/${slug}`;
  assert(html.replace(/<!--.*?-->/g,'').includes(`${minutes} min read`));
  assert(html.includes('<title>Financial Data Lineage: Trace Every Number to Its Source | Entimema</title>'));
  assert(html.includes(`<link rel="canonical" href="${url}"`));
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert(!/noindex/.test(html));
  for(const property of ['og:image','og:title','og:description','article:published_time'])assert(html.includes(`property="${property}"`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  const graph=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']??[]);
  const article=graph.find(x=>x['@type']==='Article');
  assert.equal(article.articleSection,'Financial Data & ERP');assert.equal(article.datePublished,'2026-08-27');
  assert.equal(article.author['@id'],'https://www.entimema.com/about#founder');
  assert.equal(article.publisher['@id'],'https://www.entimema.com/#organization');
  assert.equal(article.image,`https://www.entimema.com/resources/covers/${slug}.png`);
  assert(graph.some(x=>x['@type']==='BreadcrumbList'));assert(graph.some(x=>x['@type']==='WebPage'));
  const links=new Set([...source.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)].map(m=>m[1]));
  const related=record.match(/relatedResourceSlugs: \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g);
  for(const [,r] of related)links.add('/resources/'+r);
  for(const href of links)assert(existsSync(`${root}${href}.html`)||existsSync(`app${href}/page.tsx`),`Route ${href}`);
  for(const id of sections)assert(html.includes(`id="${id}"`));
  assert(!readFileSync(`${root}/resources/engineering.html`,'utf8').includes(`href="/resources/${slug}"`));
  assert.equal((readFileSync(`${root}/sitemap.xml.body`,'utf8').match(new RegExp(`<loc>${url}</loc>`,'g'))||[]).length,1);
}
console.log(`FIR-13 passed: ${words} words / ${minutes} min; source-derived cash, restriction, debt, coverage and reconciliation; version references, evidence states, 20 failure controls, unique cover and ${process.argv.includes('--source-only')?'source':'generated route/metadata/schema/link'} checks.`);
