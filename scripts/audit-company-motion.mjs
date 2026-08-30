/** Run against a production build. Capture build/motion-before/baseline.json first.
 * PLAYWRIGHT_MODULE may point to an existing Playwright installation; no app dependency. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMPANY_BASE_URL || 'http://localhost:3118';
const output = process.env.COMPANY_QA_DIR || 'build/motion-after';
const baselinePath = process.env.COMPANY_BASELINE || 'build/motion-before/baseline.json';
const capture = Boolean(process.env.COMPANY_CAPTURE_BASELINE);
const baseline = capture ? [] : JSON.parse(await readFile(baselinePath,'utf8'));
const routes = ['/about','/alexander-dimitrov','/labs'];
const views = [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844]];
const browser = await chromium.launch({channel:'msedge',headless:true});
await mkdir(output,{recursive:true});
const reports=[];
async function snapshot(page) {
 return page.evaluate(()=>({text:document.querySelector('main').textContent.replace(/\s+/g,' ').trim(),title:document.title,meta:[...document.querySelectorAll('meta[name],meta[property],link[rel=canonical],script[type="application/ld+json"]')].map(n=>n.outerHTML),links:[...document.querySelectorAll('main a')].map(n=>[n.getAttribute('href'),n.textContent]),footer:[...document.querySelectorAll('footer')].map(n=>n.textContent),portrait:(()=>{const n=document.querySelector('[data-founder-portrait]');if(!n)return null;const i=n.querySelector('img'),r=n.getBoundingClientRect(),s=getComputedStyle(i);return {src:i.getAttribute('src'),width:r.width,height:r.height,fit:s.objectFit,position:s.objectPosition};})()}));
}
async function preserve(page,old) {
 const actual = await snapshot(page);
 for(const key of ['text','title','meta','links','footer','portrait']) assert.deepEqual(actual[key],old[key],`${old.route} ${old.width}: ${key}`);
}
async function visible(page) {
 return page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,hidden:[...document.querySelectorAll('main h1,main h2,main h3,main p,main a')].filter(n=>!n.closest('footer, [aria-hidden="true"]') && (getComputedStyle(n).opacity==='0'||getComputedStyle(n).visibility==='hidden')).length,background:getComputedStyle(document.querySelector('main')).backgroundColor}));
}
try {
 if (capture) {
  for (const [width,height] of views) {
   const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
   for (const route of routes) {
    await page.goto(base+route,{waitUntil:'networkidle'});
    baseline.push({route,width,height,...await snapshot(page)});
    await page.screenshot({path:output+'/'+route.slice(1)+'-'+width+'-hero.png'});
    await page.screenshot({path:output+'/'+route.slice(1)+'-'+width+'-full.png',fullPage:true});
   }
   await page.close();
  }
  await writeFile(baselinePath,JSON.stringify(baseline,null,2));
 } else {
 for(const [width,height] of views) {
  for(const route of routes) {
   const page=await browser.newPage({viewport:{width,height}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&/hydration|did not match/i.test(m.text()))errors.push(m.text());});
   await page.addInitScript(()=>{
    window.__qa={cls:0,lcp:0,longTasks:[],events:[],observers:0,maxObservers:0};
    for(const [type,update] of [['layout-shift',e=>{if(!e.hadRecentInput)window.__qa.cls+=e.value;}],['largest-contentful-paint',e=>window.__qa.lcp=e.startTime],['longtask',e=>window.__qa.longTasks.push(e.duration)],['event',e=>window.__qa.events.push(e.duration)]])try{new PerformanceObserver(l=>l.getEntries().forEach(update)).observe({type,buffered:true,durationThreshold:16});}catch{}
    const IO=window.IntersectionObserver;
    window.IntersectionObserver=class extends IO {constructor(...args){super(...args);window.__qa.observers++;window.__qa.maxObservers=Math.max(window.__qa.maxObservers,window.__qa.observers);}disconnect(){super.disconnect();window.__qa.observers--;}};
   });
   const cdp=await page.context().newCDPSession(page);
   await cdp.send('Performance.enable');
   if(width===390)await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   const prefix=`${output}/${route.slice(1)}-${width}`;
   assert.equal((await page.goto(base+route,{waitUntil:'load'})).status(),200);
   await page.screenshot({path:prefix+'-initial.png'});
   await page.waitForTimeout(2600);
   await preserve(page,baseline.find(b=>b.route===route&&b.width===width));
   assert.deepEqual(await visible(page),{overflow:false,hidden:0,background:'rgb(250, 243, 233)'});
   assert.equal(await page.locator('[data-company-ornament][aria-hidden="true"][focusable="false"]').count(),1);
   assert.equal(await page.locator('[data-company-cta]').count(),1);
   assert.ok(await page.locator('main [data-company-entered]').count()>0,'Cascade activates');
   await page.screenshot({path:prefix+'-hero.png'});
   const before=(await cdp.send('Performance.getMetrics')).metrics;
   await page.evaluate(async()=>{window.__qa.frames=[];let last=performance.now();await new Promise(resolve=>{const end=performance.now()+2200;function tick(t){window.__qa.frames.push(t-last);last=t;scrollBy(0,32);if(t<end&&scrollY+innerHeight<document.documentElement.scrollHeight)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});});
   const after=(await cdp.send('Performance.getMetrics')).metrics;
   await page.screenshot({path:prefix+'-mid.png'});
   await page.waitForTimeout(1500);
   assert.equal((await visible(page)).overflow,false);
   const cta=page.locator('[data-company-cta]');
   await cta.scrollIntoViewIfNeeded();await page.waitForTimeout(1300);
   await cta.hover();await page.waitForTimeout(240);await page.screenshot({path:prefix+'-hover.png'});
   await page.keyboard.press('Tab');await cta.focus();
   assert.equal(await cta.evaluate(n=>getComputedStyle(n).outlineStyle),'solid');
   assert.ok((await cta.boundingBox()).height>=44);
   await page.screenshot({path:prefix+'-focus.png'});
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(1400);
   await page.screenshot({path:prefix+'-footer.png'});
   await page.emulateMedia({reducedMotion:'reduce'});
   // Media changes become observable on the next rendering frame.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.equal(await page.locator('main').evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:prefix+'-reduced.png'});
   await page.screenshot({path:prefix+'-full.png',fullPage:true});
   const metrics=await page.evaluate(()=>window.__qa);
   assert.ok(metrics.cls<.01,`CLS ${metrics.cls}`);assert.deepEqual(errors,[]);
   const value=(arr,name)=>arr.find(m=>m.name===name)?.value||0;
   reports.push({route,width,height,cpuThrottle:width===390?4:1,...await visible(page),cls:metrics.cls,lcp:metrics.lcp,maxEventDuration:Math.max(0,...metrics.events),maxLongTask:Math.max(0,...metrics.longTasks),scrollTaskSeconds:value(after,'TaskDuration')-value(before,'TaskDuration'),scrollFrames:metrics.frames.length,slowFrames:metrics.frames.filter(f=>f>50).length,observerPeak:metrics.maxObservers,preservation:'pass',focus:'pass',reducedMotion:'pass',errors});
   await writeFile(output+'/progress.json',JSON.stringify(reports,null,2));
   console.log(`PASS ${route} ${width}x${height}`);await page.close();
  }
 }
 for(const mode of ['no-js','observer-failure','reduced']) {
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  if(mode==='observer-failure')await context.addInitScript(()=>{const IO=window.IntersectionObserver;window.IntersectionObserver=class extends IO{constructor(callback,options){if(options?.rootMargin==='0px 0px 96px 0px')throw new Error('QA observer failure');super(callback,options);}};});
  const page=await context.newPage();
  for(const route of routes) {
   await page.goto(base+route,{waitUntil:'networkidle'});
   await preserve(page,baseline.find(b=>b.route===route&&b.width===390));
   assert.deepEqual(await visible(page),{overflow:false,hidden:0,background:'rgb(250, 243, 233)'});
   await page.screenshot({path:`${output}/${route.slice(1)}-${mode}.png`,fullPage:true});
  }
  await context.close();
 }
 // Shared CSS may remain loaded after client navigation; it must never tint home.
 const page=await browser.newPage();await page.goto(base+'/about');
 await page.locator('main a[href="/labs"]').click();await page.waitForURL(base+'/labs');await page.waitForTimeout(1200);
 await page.goBack();await page.waitForURL(base+'/about');await page.waitForTimeout(250);
 assert.equal(await page.locator('main [data-company-entered]').count(),0,'No replay on back navigation');
 await page.locator('.site-header a[href="/"]').first().click();await page.waitForURL(base+'/');
 assert.equal(await page.locator('main[data-company]').count(),0);
 assert.equal(await page.locator('main').evaluate(n=>getComputedStyle(n).getPropertyValue('--company-paper')),'');
 await page.close();
 await writeFile(output+'/report.json',JSON.stringify({base,reports,fallbacks:'no-js, observer failure, reduced motion pass',returnNavigation:'pass',scoping:'pass'},null,2));
}
} finally {await browser.close();}
