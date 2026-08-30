// Use the existing motion audit for full-page before/after captures.
// Run this audit with COMPANY_CAPTURE_BASELINE=1 and COMPANY_QA_DIR on the untouched
// build first; pass its metrics.json as COMPANY_BASELINE for candidate/production checks.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {auditDecisionGraph} from './audit-labs-graph.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.COMPANY_BASE_URL||'http://localhost:3121';
const output=process.env.COMPANY_QA_DIR||'build/final-art/after/detail';
const capture=Boolean(process.env.COMPANY_CAPTURE_BASELINE);
const baseline=capture?[]:JSON.parse(await readFile(process.env.COMPANY_BASELINE||'build/final-art/before/detail/metrics.json','utf8'));
await mkdir(output,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true});const reports=[];
try {
 for(const [width,height] of [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844]]) {
  for(const route of ['about','alexander-dimitrov','labs']) {
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[]; const offlinePrefetchErrors=[]; let testingOffline=false;
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'){if(testingOffline&&m.text().includes('net::ERR_INTERNET_DISCONNECTED'))offlinePrefetchErrors.push(m.text());else errors.push(m.text());}});
   assert.equal((await page.goto(base+'/'+route,{waitUntil:'networkidle'})).status(),200);
   await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>{
    const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
    const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const rgb=c=>(c.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    const nodes=[...document.querySelectorAll('main p,main h1,main h2,main h3,main a,main button')].filter(n=>!n.closest('[aria-hidden="true"]')&&getComputedStyle(n).visibility!=='hidden'&&n.getBoundingClientRect().width>0);
    const contrast=nodes.map(n=>{let p=n,bg='rgba(0, 0, 0, 0)';while(p&&bg==='rgba(0, 0, 0, 0)'){bg=getComputedStyle(p).backgroundColor;p=p.parentElement;}const a=lum(rgb(getComputedStyle(n).color)),b=lum(rgb(bg));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});
    const gateways=[...document.querySelectorAll('section[aria-label="The research agenda and practitioner foundation"] .editorial-item')].map(n=>({rect:rect(n),padding:getComputedStyle(n).padding,border:getComputedStyle(n).borderTop,background:getComputedStyle(n).backgroundColor,eyebrow:rect(n.querySelector('p')),heading:rect(n.querySelector('h2')),link:rect(n.querySelector('a'))}));
    return {height:document.querySelector('main').getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth,clips:nodes.filter(n=>rect(n).x< -1||rect(n).x+rect(n).width>innerWidth+1).map(n=>n.textContent),minContrast:Math.min(...contrast),gateways,smallTargets:[...document.querySelectorAll('main a,main button')].filter(n=>!n.closest('footer')&&n.getBoundingClientRect().height>0&&n.getBoundingClientRect().height<44).map(n=>({text:n.textContent.trim().slice(0,70),height:rect(n).height})),badge:(()=>{const n=document.querySelector('[data-founder-linkedin]');return n?{...rect(n),label:n.getAttribute('aria-label'),href:n.getAttribute('href')}:null;})()};
   });
   if(capture){reports.push({route,width,...metrics});await writeFile(output+'/metrics.json',JSON.stringify(reports,null,2));await page.close();continue;}
   assert.deepEqual(metrics.smallTargets,[],`Undersized Company actions: ${route} ${width}`);
   assert.equal(metrics.overflow,false);assert.deepEqual(metrics.clips,[]);assert.ok(metrics.minContrast>=4.5,`Contrast: ${route} ${metrics.minContrast}`);
   const old=baseline.find(n=>n.route===route&&n.width===width);metrics.heightDelta=metrics.height-old.height;
   if(route==='labs')assert.ok(metrics.height<=old.height*1.03,'Labs must not materially lengthen');
   if(route==='about') {
    const [a,b]=metrics.gateways;assert.equal(a.padding,b.padding);assert.equal(a.border,b.border);assert.equal(a.background,b.background);
    if(width>=1024){assert.ok(Math.abs(a.link.y-b.link.y)<1,'Gateway CTA baseline');assert.ok(Math.abs(a.eyebrow.y-b.eyebrow.y)<1);assert.ok(Math.abs(a.heading.y-b.heading.y)<1);assert.ok(Math.abs(a.rect.height-b.rect.height)<1);}
   }
   if(metrics.badge){assert.ok(metrics.badge.width>=44&&metrics.badge.height>=44);assert.equal(metrics.badge.label,'View Alexander Dimitrov on LinkedIn');assert.equal(metrics.badge.href,'https://www.linkedin.com/in/alexander-dimitrov-entimema/');}
   const selectors=route==='about'?['section[aria-label="The research agenda and practitioner foundation"]']:route==='labs'?['#research-agenda','#investigation-method','#applied-system','#selected-work']:['section[aria-labelledby="founder-name"]'];
   for(const [i,selector] of selectors.entries()){const n=page.locator(selector);if(await n.count())await n.screenshot({path:`${output}/${route}-${width}-${i}.jpg`,type:'jpeg',quality:80,style:'.site-header, .site-header * { visibility: hidden !important; }'});}
   for(const link of await page.locator('main a').all()){await link.focus();assert.equal(await link.evaluate(n=>n===document.activeElement&&getComputedStyle(n).outlineStyle!=='none'),true);}
   if(route==='labs'){testingOffline=true;await auditDecisionGraph(page,{width,output});testingOffline=false;}
   assert.deepEqual(errors,[]);reports.push({route,width,viewportHeight:height,...metrics,errors,offlinePrefetchErrors});await writeFile(output+'/metrics.json',JSON.stringify(reports,null,2));console.log(`PASS ${route} ${width} contrast=${metrics.minContrast.toFixed(2)} heightDelta=${metrics.heightDelta.toFixed(1)}`);await page.close();
  }
 }
}finally{await browser.close();}
