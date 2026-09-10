import { chromium } from '../../build/capture-tools/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = resolve('public/product/ai-agent-manager');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({headless: true});
try {
  const page = await browser.newPage({viewport:{width:1440,height:820},deviceScaleFactor:1});
  for (const view of ['analysis','controls','review']) {
    await page.goto(`${pathToFileURL(resolve('scripts/agent-manager-preview/workspace.html'))}#${view}`);
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.evaluate(() => ({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,contentBottom:document.querySelector('#content').getBoundingClientRect().bottom}));
    if (bounds.width > 1440 || bounds.height > 820) throw new Error(`${view} overflows: ${JSON.stringify(bounds)}`);
    const png = await page.screenshot();
    await sharp(png).webp({quality:96,effort:6}).toFile(resolve(out,`${view}.webp`));
    console.log(view, bounds);
  }
  await page.goto(`${pathToFileURL(resolve('scripts/agent-manager-preview/workspace.html'))}#controls`);
  await page.selectOption('#control-filter','Review');
  if(await page.locator('[data-status]:visible').count()!==2) throw new Error('Control filter failed');
  await page.goto(`${pathToFileURL(resolve('scripts/agent-manager-preview/workspace.html'))}#review`);
  await page.click('#approve');
  if(await page.locator('#decision-state').innerText()!=='Interpretation approved · AM') throw new Error('Review resolution failed');
  await writeFile(resolve(out,'capture-manifest.json'),JSON.stringify({source:'scripts/agent-manager-preview/workspace.html',viewport:{width:1440,height:820},type:'Browser capture of original interface preview',data:'Fictional Northline Industries fixture',screens:['analysis.webp','controls.webp','review.webp']},null,2)+'\n');
} finally { await browser.close(); }
