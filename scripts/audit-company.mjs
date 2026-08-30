import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMPANY_BASE_URL || 'http://localhost:3113';
const output = process.env.COMPANY_QA_DIR || 'build/company-qa';
const routes = ['/about','/alexander-dimitrov','/labs'];
const names = ['About Entimema','Founder','Entimema Labs'];
const views = [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844]];
await mkdir(output,{recursive:true});
const browser = await chromium.launch({channel:'msedge',headless:true});
const reports=[];
const baselinePath='build/company-baseline.json';
try {
 if(process.env.COMPANY_CAPTURE_BASELINE){
  const data=[];
  for(const [width,height] of views){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
   for(const route of routes){
    await page.goto(base+route,{waitUntil:'networkidle'});
    data.push({width,height,route,main:route==='/about'?null:await page.locator('main').innerText(),footer:await page.locator('footer').allTextContents(),title:await page.title(),description:await page.locator('meta[name=description]').getAttribute('content'),header:await page.locator('.site-header').count()?await page.locator('.site-header').boundingBox():null});
   }await page.close();
  }
  await writeFile(baselinePath,JSON.stringify(data,null,2));console.log('Captured production baseline');
 }else{
 const baseline=JSON.parse(await readFile(baselinePath,'utf8'));
 const links=new Set();
 for(const [width,height] of views){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__companyCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__companyCLS+=e.value;}).observe({type:'layout-shift',buffered:true});});
  for(const route of routes){
   assert.equal((await page.goto(base+route,{waitUntil:'networkidle'})).status(),200);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://www.entimema.com'+route);
   assert.equal(await page.locator('.site-header .header-cta').innerText(),'Contact us');
   if(width>900) assert.ok(await page.locator('.site-header .header-cta').isVisible());
   assert.equal(await page.locator('.site-header a').filter({hasText:/^About$/}).count(),0);
   const old=baseline.find(b=>b.width===width&&b.route===route);
   assert.deepEqual(await page.locator('footer').allTextContents(),old.footer,'footer preservation');
   if(route!=='/about'){
    assert.equal(await page.locator('main').innerText(),old.main,'Founder/Labs copy preservation');
    assert.equal(await page.title(),old.title);assert.equal(await page.locator('meta[name=description]').getAttribute('content'),old.description);
    assert.equal((await page.locator('.site-header').boundingBox()).height,old.header.height);
   }else{
    const desc='Entimema builds controlled financial and credit-risk decision systems that connect evidence, model intelligence, deterministic logic and human judgement.';
    assert.equal(await page.title(),'About Entimema | Controlled Financial Decision Systems');
    for(const sel of ['meta[name=description]','meta[property="og:description"]','meta[name="twitter:description"]'])assert.equal(await page.locator(sel).getAttribute('content'),desc);
    assert.equal(await page.locator('main img').count(),0);
    assert.equal(await page.locator('main section').count(),7);
   }
   const metrics=await page.evaluate(()=>{
    const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const rgb=c=>(c.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    const ratios=[...document.querySelectorAll('main p,main h1,main h2,main h3,main a')].filter(n=>!n.closest('[aria-hidden="true"]')).map(n=>{
      let p=n,bg='rgba(0, 0, 0, 0)';while(p&&bg==='rgba(0, 0, 0, 0)'){bg=getComputedStyle(p).backgroundColor;p=p.parentElement;}
      const a=lum(rgb(getComputedStyle(n).color)),b=lum(rgb(bg));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    return {overflow:document.documentElement.scrollWidth>innerWidth,cls:window.__companyCLS,minContrast:Math.min(...ratios)};
   });
   if(route==='/about')assert.ok(metrics.minContrast>=4.5,JSON.stringify(metrics));
   assert.doesNotMatch((await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('content')).join(',')))||'',/noindex/);
   assert.equal(metrics.overflow,false,JSON.stringify({width,route,metrics}));assert.ok(metrics.cls<.01,JSON.stringify({width,route,metrics}));
   for(const href of await page.locator('a[href^="/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))) links.add(href.split('#')[0]);
   await page.screenshot({path:`${output}/${route.slice(1)}-${width}.png`,fullPage:true});
   const mobile=width<=900;
   const trigger=page.getByRole('button',{name:'Company',exact:true});
   async function openCompany(){
    if(mobile) await page.getByRole('button',{name:'Open main menu',exact:true}).click();
    await trigger.focus();await page.keyboard.press('Enter');
    assert.equal(await trigger.getAttribute('aria-expanded'),'true');
    if(mobile) assert.ok(await page.getByRole('link',{name:'Contact us',exact:true}).isVisible());
    const controls=await trigger.getAttribute('aria-controls');
    assert.ok(await page.locator(`[id="${controls}"]`).isVisible());
    return page.locator(`[id="${controls}"]`);
   }
   let menu=await openCompany();
   assert.deepEqual(await menu.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),routes);
   const headerBox=await page.locator('.site-header').boundingBox();
   const menuBox=await menu.boundingBox();
   assert.ok(menuBox.y>=headerBox.y+headerBox.height-1,'Menu must stay below header');
   assert.ok(menuBox.x>=0&&menuBox.x+menuBox.width<=width+1,'Menu must stay inside viewport');
   for(const box of await menu.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height)))assert.ok(box>=44,'Touch target >=44px');
   assert.equal(await menu.locator('[aria-current="page"]').getAttribute('href'),route);
   if(mobile)assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
   else assert.equal(await menu.locator('a').first().evaluate(n=>n===document.activeElement),true);
   await menu.locator('a').first().focus();assert.equal(await menu.locator('a').first().evaluate(n=>getComputedStyle(n).outlineStyle),'solid');
   await page.keyboard.press('Tab');assert.equal(await menu.locator('a').nth(1).evaluate(n=>n===document.activeElement),true);
   await page.screenshot({path:`${output}/menu-${route.slice(1)}-${width}.png`});
   if(!mobile){
    await menu.locator('a').last().focus();await page.keyboard.press('Tab');
    assert.equal(await trigger.getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('.site-header .header-cta').evaluate(n=>n===document.activeElement),true);
    menu=await openCompany();await menu.locator('a').first().focus();await page.keyboard.press('Shift+Tab');
    assert.equal(await trigger.evaluate(n=>n===document.activeElement),true);assert.equal(await trigger.getAttribute('aria-expanded'),'false');
    menu=await openCompany();
   }
   await page.keyboard.press('Escape');
   if(mobile){assert.equal(await page.getByRole('button',{name:'Open main menu',exact:true}).getAttribute('aria-expanded'),'false');assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');}
   else {assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.equal(await trigger.evaluate(n=>n===document.activeElement),true);}
   menu=await openCompany();
   await page.mouse.click(5, 5);
   if(!mobile) assert.equal(await trigger.getAttribute('aria-expanded'),'false','outside pointer closes');
   else await page.keyboard.press('Escape');
   for(let i=0;i<routes.length;i++){
    menu=await openCompany();await menu.getByRole('link',{name:new RegExp(names[i])}).click();
    await page.waitForURL(base+routes[i]);
    if(mobile){assert.equal(await page.getByRole('button',{name:'Open main menu',exact:true}).getAttribute('aria-expanded'),'false');assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');}
    else assert.equal(await trigger.getAttribute('aria-expanded'),'false');
   }
   reports.push({width,height,route,...metrics,navigation:'pass',metadata:'pass',preservation:'pass'});
  }
  if(width>900){
   for(const name of ['Resources','Solutions']){await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.getByRole('button',{name,exact:true}).getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');}
  }else{
   await page.getByRole('button',{name:'Open main menu',exact:true}).click();
   for(const name of ['Resources','Solutions']){const t=page.getByRole('button',{name,exact:true});await t.click();assert.equal(await t.getAttribute('aria-expanded'),'true');await t.click();}await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}x${height}`);
 }
 const context=await browser.newContext();
 for(const href of links){const res=await context.request.get(base+href);assert.ok(res.status()<400,`${href}: ${res.status()}`);}
 await writeFile(output+'/report.json',JSON.stringify({base,reports,links:[...links]},null,2));console.log(`PASS ${reports.length} route/viewport checks; ${links.size} internal links`);
 }
}finally{await browser.close();}
