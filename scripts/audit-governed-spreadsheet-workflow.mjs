import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const slug='beyond-spreadsheet-automation';
const source=readFileSync('app/resources/GovernedSpreadsheetWorkflowArticle.tsx','utf8');
const file=ts.createSourceFile('FIR14.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
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
assert.equal(table('Seven distinct').length,7);
assert.equal(table('Four valid').length,4);
assert.equal(table('Failure →').length,19);
const amount=s=>Number(s.replace(/[^\d−-]/g,'').replace('−','-'));
const corrections=table('Product Family A:');
assert.equal(corrections.slice(0,3).reduce((v,r)=>v+amount(r[1]),0),amount(corrections[3][1]));
const buckets=table('Company preservation');
for(const r of buckets)assert.equal(amount(r[2])-amount(r[1]),amount(r[3]));
for(const col of [1,2,3])assert.equal(buckets.slice(0,3).reduce((v,r)=>v+amount(r[col]),0),amount(buckets[3][col]));
assert.equal(amount(buckets[0][1])-amount(buckets[0][2]),amount(corrections[3][1]));
const sections=[...source.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(sections).size,11);
for(const id of sections)assert(source.includes(`{ id: "${id}", label:`));
const registry=readFileSync('app/resources/resource-data.ts','utf8');
assert.equal((registry.match(/slug: "beyond-spreadsheet-automation"/g)||[]).length,1);
const record=registry.split('// FIR-14;')[1].split('status: "published"')[0];
assert(record.includes(`readingMinutes: ${minutes}`));
assert(record.includes('topic: "financial-data-and-erp", stream: "insights"'));
const cover=readFileSync(`public/resources/covers/${slug}.png`);
assert.equal(cover.readUInt32BE(16),1536);assert.equal(cover.readUInt32BE(20),1024);
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const name of readdirSync('public/resources/covers').filter(n=>n.endsWith('.png')&&n!==`${slug}.png`))assert.notEqual(hash(cover),hash(readFileSync(`public/resources/covers/${name}`)));
const root='.next/server/app';
const html=readFileSync(`${root}/resources/${slug}.html`,'utf8');
assert(html.includes('Beyond Spreadsheet Automation'));
assert(html.replace(/<!--.*?-->/g,'').includes(`${minutes} min read`));
const url=`https://www.entimema.com/resources/${slug}`;
assert(html.includes(`<link rel="canonical" href="${url}"`));
assert(html.includes('property="og:image"'));assert(html.includes('name="twitter:card"'));
const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return v['@graph']||[v];});
for(const type of ['Article','WebPage','BreadcrumbList'])assert(schemas.some(x=>[x['@type']].flat().includes(type)),type);
const article=schemas.find(x=>[x['@type']].flat().includes('Article'));assert(article.headline.includes('Governed Workflows'));
assert(readFileSync(`${root}/sitemap.xml.body`,'utf8').includes(url));
for(const href of new Set([...source.matchAll(/href="(\/[^"#]+)(?:#[^"]*)?"/g)].map(m=>m[1])))assert(existsSync(`${root}${href}.html`)||existsSync(`app${href}/page.tsx`),href);
for(const [,related] of record.match(/relatedResourceSlugs: \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g))assert(existsSync(`${root}/resources/${related}.html`),related);
assert.equal(article.articleSection,'Financial Data & ERP');
assert.equal(article.datePublished,'2026-08-27');
assert.equal(article.image,`https://www.entimema.com/resources/covers/${slug}.png`);
assert.equal(article.author['@id'],'https://www.entimema.com/about#founder');
assert.equal(article.publisher['@id'],'https://www.entimema.com/#organization');
assert(!readFileSync(`${root}/resources/engineering.html`,'utf8').includes(`href="/resources/${slug}"`));
assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert(!/noindex/.test(html));
assert(html.includes('<title>Beyond Excel Automation: Governed Finance Workflows | Entimema</title>'));
console.log(`FIR-14 passed: ${words} words; ${minutes} minutes; arithmetic, seven risks, four recommendations, 19 failure modes, sections, unique registry and 1536x1024 cover, generated route, links, metadata, structured data and sitemap.`);
