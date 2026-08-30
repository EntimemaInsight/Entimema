import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.LABS_BASE_URL || 'http://localhost:3108';
const output = process.env.LABS_QA_DIR || 'build/labs-qa';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({channel:process.env.LABS_BROWSER_CHANNEL || 'msedge',headless:true});
const reports = [];
const approvedCopy = JSON.parse(await readFile(new URL('../tests/company/labs-copy.json', import.meta.url), 'utf8'));
try {
 for (const [width,height] of [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:2,reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(() => { window.__labsCLS=0; new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__labsCLS+=e.value;}).observe({type:'layout-shift',buffered:true}); });
  const res=await page.goto(base+'/labs',{waitUntil:'networkidle'}); assert.equal(res.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  const mainCopy=await page.locator('main').textContent();
  for(const text of approvedCopy)assert.ok(mainCopy.includes(text), 'Missing approved copy: '+text);
  const description='Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.';
  for(const selector of ['meta[name=description]','meta[property="og:description"]','meta[name="twitter:description"]'])assert.equal(await page.locator(selector).getAttribute('content'),description);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('h1').innerText(),'Where financial expertise becomes decision infrastructure.');
  assert.equal(await page.title(),'Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems');
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://www.entimema.com/labs');
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://www.entimema.com/labs');
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary');
  const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();
  const labs=schemas.map(JSON.parse).find(s=>s['@id']==='https://www.entimema.com/labs#webpage');
  assert.equal(labs['@type'],'WebPage'); assert.equal(labs.about['@id'],'https://www.entimema.com/#organization');
  const steps=page.locator('main ol > li'); assert.equal(await steps.count(),5);
  const boxes=await steps.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y};}));
  assert.equal(Math.abs(boxes[0].y-boxes[1].y)<2,width>=1024);
  assert.equal(await page.locator('main section').count(),7);
  assert.equal(await page.locator('main img,main iframe').count(),0);
  const metrics=await page.locator('main').evaluate(main=>{
    const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const rgb=c=>(c.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    const contrast=[...main.querySelectorAll('p,h1,h2,h3,li,a,strong,span')].filter(n=>!n.closest('[aria-hidden="true"]')).map(n=>{
      let p=n,bg='rgba(0, 0, 0, 0)'; while(p&&bg==='rgba(0, 0, 0, 0)'){bg=getComputedStyle(p).backgroundColor;p=p.parentElement;}
      const a=lum(rgb(getComputedStyle(n).color)),b=lum(rgb(bg));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    return {overflow:document.documentElement.scrollWidth>innerWidth,cls:window.__labsCLS,minContrast:Math.min(...contrast),mainHeight:main.getBoundingClientRect().height};
  });
  assert.equal(metrics.overflow,false); assert.ok(metrics.cls<.01,JSON.stringify(metrics)); assert.ok(metrics.minContrast>=4.5,JSON.stringify(metrics));assert.deepEqual(errors,[]);
  const links=page.locator('main a');assert.equal(await links.count(),2);
  await links.first().focus();assert.equal(await links.first().evaluate(n=>getComputedStyle(n).outlineStyle),'solid');
  await page.keyboard.press('Tab');assert.equal(await links.nth(1).evaluate(n=>n===document.activeElement),true);
  await page.locator('h1').scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`${output}/${width}x${height}.png`,fullPage:true});
  reports.push({width,height,status:200,...metrics,errors}); await page.close();
 }
 const page=await browser.newPage({viewport:{width:1366,height:900},reducedMotion:'reduce'});
 for(const path of ['/resources','/about','/','/alexander-dimitrov'])assert.equal((await page.request.get(base+path)).status(),200,path);
 if(process.env.LABS_BASELINE){
  const baseline=JSON.parse(await readFile(process.env.LABS_BASELINE,'utf8'));
  for(const old of baseline.filter(x=>['/','/about','/alexander-dimitrov'].includes(x.path))){
   await page.goto(base+old.path,{waitUntil:'networkidle'});
   assert.equal(await page.title(),old.title);assert.deepEqual(await page.locator('h1').allTextContents(),old.h1);
   assert.equal(await page.locator('header').first().innerText(),old.header);assert.deepEqual(await page.locator('footer').allTextContents(),old.footer);
   if(old.path!=='/')assert.equal(await page.locator('main').innerText(),old.main);
  }
 }
 await writeFile(output+'/report.json',JSON.stringify(reports,null,2)); console.log(JSON.stringify(reports,null,2));
}finally{await browser.close();}
