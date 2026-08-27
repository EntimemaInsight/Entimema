import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const slug='ai-financial-analysis-models-rules-controls';
const title='AI in Financial Analysis: What Models Should Interpret and What Rules Must Control';
const source=readFileSync('app/resources/AIFinanceArchitectureArticle.tsx','utf8');
const file=ts.createSourceFile('FIR15.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(file.parseDiagnostics.length,0);
const body=file.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text.endsWith('Article')).body;
const parts=[],tables=new Map();
const ignored=new Set(['className','href','id','key','src','style']);
function visit(n){
  if(ts.isJsxText(n)){parts.push(n.text);return;}
  if(ts.isJsxAttribute(n)&&ignored.has(n.name.getText(file)))return;
  if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)||ts.isNumericLiteral(n)){parts.push(n.text);return;}
  ts.forEachChild(n,visit);
}
function collect(n){
  if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(file)==='ResourceTable'){
    const attr=name=>n.attributes.properties.find(a=>a.name?.getText(file)===name).initializer;
    tables.set(attr('caption').text,attr('rows').expression.elements.map(r=>r.elements.map(c=>c.text)));
  }
  ts.forEachChild(n,collect);
}
visit(body);collect(body);
const words=parts.join(' ').trim().split(/\s+/u).filter(Boolean).length,minutes=Math.round(words/220);
assert(words<4500&&minutes>=18&&minutes<=22,`${words} words / ${minutes} minutes`);
const table=prefix=>[...tables].find(([c])=>c.startsWith(prefix))[1];
assert.equal(table('Responsibility matrix').length,9);
assert.equal(table('Failure →').length,20);
assert.equal(table('Five governance').length,5);
assert.equal(table('Illustrative routing').length,7);
const close=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const balance=table('Balance Sheet control');
for(const col of [1,2]) {
  const n=i=>Number(balance[i][col]);
  close(n(0)+n(1),n(2));close(n(3)+n(4)+n(5)+n(6),n(7));close(n(2)-n(7),n(8));
}
close(Number(balance[1][1])-Number(balance[1][2]),0.6);
close(Number(balance[3][2])-Number(balance[3][1]),1.5);
close(Number(balance[4][1])-Number(balance[4][2]),1.5);
const formulas=[...source.matchAll(/<Formula label="([^"]+)">([\s\S]*?)<\/Formula>/g)];
const cash=formulas.find(m=>m[1].startsWith('Available cash'))[2].match(/([\d.]+) − ([\d.]+) = ([\d.]+)/).slice(1).map(Number);
close(cash[0]-cash[1],cash[2]);close(cash[0],Number(balance[0][2]));
const coverage=formulas.find(m=>m[1].startsWith('Immediate cash'))[2].match(/([\d.]+) ÷ ([\d.]+) × 100 ≈ ([\d.]+)%/).slice(1).map(Number);
close(coverage[0],cash[2]);close(coverage[1],Number(balance[3][2]));close(Math.round(coverage[0]/coverage[1]*1000)/10,coverage[2]);
const debt=source.match(/EUR ([\d.]+)m opening plus EUR ([\d.]+)m borrowing less EUR ([\d.]+)m repayment equals EUR ([\d.]+)m closing/).slice(1).map(Number);
close(debt[0]+debt[1]-debt[2],debt[3]);close(debt[3],Number(balance[3][2])+Number(balance[4][2]));
for(const phrase of ['Failed critical control ⇒ Affected output blocked','The duplicate causes the EUR 0.6m imbalance','decision-ready for that investigation','not assert that every described control','Current contradictory evidence']) assert(source.includes(phrase),phrase);
const sections=[...source.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(sections).size,11);
for(const id of sections)assert(source.includes(`{ id: "${id}", label:`));
const registry=readFileSync('app/resources/resource-data.ts','utf8');
assert.equal((registry.match(/slug: "ai-financial-analysis-models-rules-controls"/g)||[]).length,1);
const record=registry.split('// FIR-15;')[1].split('status: "published"')[0];
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-architecture", stream: "insights"'));
assert(record.includes(title));
assert(readFileSync('app/resources/[slug]/page.tsx','utf8').includes('calculateReadingMinutes("AIFinanceArchitectureArticle.tsx")'));
const cover=readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(cover.readUInt32BE(16),1536);assert.equal(cover.readUInt32BE(20),1024);
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const name of readdirSync('public/resources/covers').filter(n=>n.endsWith('.png')&&n!==`${slug}.png`))assert.notEqual(hash(cover),hash(readFileSync(`public/resources/covers/${name}`)));
const root='.next/server/app';
const html=readFileSync(`${root}/resources/${slug}.html`,'utf8');
assert(html.includes('AI in Financial Analysis'));
assert(html.replace(/<!--.*?-->/g,'').includes(`${minutes} min read`));
const url=`https://www.entimema.com/resources/${slug}`;
assert(html.includes(`<link rel="canonical" href="${url}"`));
assert(html.includes('property="og:image"'));assert(html.includes('name="twitter:card"'));
const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return v['@graph']||[v];});
for(const type of ['Article','WebPage','BreadcrumbList'])assert(schemas.some(x=>[x['@type']].flat().includes(type)),type);
const article=schemas.find(x=>[x['@type']].flat().includes('Article'));assert(article.headline.includes('Rules Must Control'));
assert(readFileSync(`${root}/sitemap.xml.body`,'utf8').includes(url));
for(const href of new Set([...source.matchAll(/href="(\/[^"#]+)(?:#[^"]*)?"/g)].map(m=>m[1])))assert(existsSync(`${root}${href}.html`)||existsSync(`app${href}/page.tsx`),href);
for(const [,related] of record.match(/relatedResourceSlugs: \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g))assert(existsSync(`${root}/resources/${related}.html`),related);
assert.equal(article.articleSection,'Financial Architecture');
assert.equal(article.datePublished,'2026-08-27');
assert.equal(article.image,`https://www.entimema.com/resources/covers/${slug}.png`);
assert.equal(article.author['@id'],'https://www.entimema.com/about#founder');
assert.equal(article.publisher['@id'],'https://www.entimema.com/#organization');
assert(!readFileSync(`${root}/resources/engineering.html`,'utf8').includes(`href="/resources/${slug}"`));
assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert(!/noindex/.test(html));
assert(html.includes('<title>AI in Financial Analysis: Models, Rules and Human Judgement | Entimema</title>'));
console.log(`FIR-15 passed: ${words} words; ${minutes} minutes; source-derived balance, debt roll-forward, cash and coverage; responsibility, routing, governance and failure matrices; unique registry and cover; route, links, metadata, structured data and sitemap.`);
