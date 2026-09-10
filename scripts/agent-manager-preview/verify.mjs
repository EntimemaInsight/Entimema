import {chromium} from '../../build/capture-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const errors=[];const results=[];
try {
 for(const width of [1440,390,768]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const response=await page.goto('http://localhost:3110/product/ai-agent-manager');assert.equal(response.status(),200);
  for(const id of ['agents','analysis','controls','review']){
   await page.locator(`#${id}`).scrollIntoViewIfNeeded();
   await page.waitForTimeout(950);
   await page.locator(`#${id} img`).evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));assert.equal(geometry.width,geometry.scrollWidth);
   const broken=await page.locator(`#${id} img`).evaluateAll(es=>es.filter(e=>!e.complete||!e.naturalWidth).length);assert.equal(broken,0);
   if(width!==768) await page.locator(`#${id}`).screenshot({path:`build/qa-${width}-${id}.png`});
  }
  assert.equal(await page.locator('figure img').count(),3);
  assert.equal(await page.locator('[style*="sprite"]').count(),0);
  const sourceUrls=await page.locator('figure img').evaluateAll(es=>es.map(e=>e.currentSrc));
  assert.ok(sourceUrls.every(u=>!u.includes('sprite')));
  const box=await page.locator('#analysis figure').boundingBox();
  if(width===1440)assert.ok(box.width>=1100 && box.width<=1350);
  await page.locator('a[href="#controls"]').click();assert.equal(new URL(page.url()).hash,'#controls');
  results.push({width,imagesLoaded:3,overflow:false,screenshotWidth:box.width});
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await reduced.goto('http://localhost:3110/product/ai-agent-manager');
 const motion=await reduced.locator('#analysis figure').evaluate(e=>({opacity:getComputedStyle(e).opacity,transition:getComputedStyle(e).transitionDuration,transform:getComputedStyle(e).transform}));assert.equal(motion.opacity,'1');assert.equal(motion.transform,'none');assert.ok(parseFloat(motion.transition)<=0.00001);
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto('http://localhost:3110/product/ai-agent-manager');assert.equal(await nojs.locator('#analysis figure').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.deepEqual(errors,[]);
 await mkdir('build',{recursive:true});await writeFile('build/browser-qa.json',JSON.stringify({results,motion,errors,noJavaScript:'visible'},null,2));
 console.log(JSON.stringify({results,motion,errors,noJavaScript:'visible'},null,2));
}finally{await browser.close();}
