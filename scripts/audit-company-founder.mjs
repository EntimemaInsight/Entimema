import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMPANY_FOUNDER_BASE_URL || 'http://localhost:3103';
const output = process.env.COMPANY_FOUNDER_QA_DIR || 'build/company-founder-qa';

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const reports = [];
try {
  for (const [width, height] of [[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    assert.equal((await page.goto(`${base}/alexander-dimitrov`, { waitUntil: 'domcontentloaded', timeout: 120000 })).status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText(), 'Alexander Dimitrov');
    const intro = page.locator('section[aria-labelledby="founder-name"]');
    assert.ok((await intro.innerText()).includes('Founder, Entimema'));
    assert.equal(await intro.locator('p').count(), 4);
    const portrait = page.locator('[data-founder-portrait]');
    const img = portrait.locator('img');
    assert.equal(await img.getAttribute('alt'), 'Alexander Dimitrov, Founder of Entimema');
    assert.equal(await img.getAttribute('src'), '/alexander-dimitrov-founder-natural.jpg');
    assert.equal(await img.getAttribute('fetchpriority'), 'high');
    const beforeImage = await portrait.boundingBox();
    await img.evaluate(node => node.decode());
    assert.deepEqual(await portrait.boundingBox(), beforeImage, "Portrait decode must not shift layout");
    assert.equal(await page.locator('main a[href*="linkedin"]').count(), 0);
    assert.equal(await page.locator('[aria-label="Founder thesis"]').innerText(), 'The best model is not the most complex one. It is the one that can operate inside a real organisation—across its data, systems, constraints and decision responsibilities.');
    assert.equal(await page.locator('section[aria-labelledby="areas-heading"] h3').count(), 4);
    const links = page.locator('section[aria-labelledby="research-heading"] article a');
    assert.equal(await links.count(), 6);
    if (width === 390) {
      for (const href of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
        assert.equal((await page.request.get(`${base}${href}`)).status(), 200, href);
      }
    }
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), 'https://www.entimema.com/alexander-dimitrov-founder-natural.jpg');
    assert.equal(await intro.locator('a, button, svg').count(), 0);
    assert.equal(await page.title(), 'Alexander Dimitrov | Founder of Entimema');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://www.entimema.com/alexander-dimitrov');
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), 'Alexander Dimitrov is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.');
    const person = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse).find(schema => schema['@type'] === 'Person');
    assert.equal(person.name, 'Alexander Dimitrov');
    assert.equal(person.worksFor['@id'], 'https://www.entimema.com/#organization');
    const metrics = await portrait.evaluate(node => {
      const box = node.getBoundingClientRect();
      const grid = node.parentElement;
      const style = getComputedStyle(grid);
      const heading = getComputedStyle(grid.querySelector('h1'));
      const copy = grid.querySelector(':scope > div:last-child');
      const body = getComputedStyle(copy);
      const copyBox = copy.getBoundingClientRect();
      return { h1Css: parseFloat(heading.fontSize), bodyCss: parseFloat(body.fontSize), bodyLineHeight: parseFloat(body.lineHeight), biography: {left: copyBox.left, top: copyBox.top, width: copyBox.width}, portraitRight: box.right, portraitBottom: box.bottom, portrait: { width: box.width, height: box.height, top: box.top }, headingBottom: grid.querySelector('h1').getBoundingClientRect().bottom, gridWidth: grid.getBoundingClientRect().width, columns: style.gridTemplateColumns, gap: style.columnGap, zoom: getComputedStyle(document.documentElement).zoom, objectPosition: getComputedStyle(node.querySelector('img')).objectPosition, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    });
    assert.ok(Math.abs(metrics.portrait.width - metrics.portrait.height) < 1);
    assert.ok(metrics.headingBottom < metrics.portrait.top);
    assert.equal(metrics.overflow, false);
    const previousH1 = Math.min(48, Math.max(36, width * 0.031));
    assert.ok(Math.abs(metrics.h1Css / previousH1 - 0.91) < 0.001);
    assert.equal(metrics.bodyCss, width <= 575 ? 17 : 18);
    assert.ok(Math.abs(metrics.bodyLineHeight / metrics.bodyCss - 1.58) < 0.001);
    if (width >= 1024) {
      assert.ok(metrics.portraitRight < metrics.biography.left);
      assert.ok(Math.abs(metrics.portrait.top - metrics.biography.top) < 1);
    } else {
      assert.ok(metrics.portraitBottom <= metrics.biography.top);
    }
    assert.ok(metrics.portrait.width <= 400 && metrics.portrait.height <= 400, JSON.stringify(metrics));
    assert.equal(await img.evaluate(node => getComputedStyle(node).objectFit), 'cover');
    assert.equal(await img.evaluate(node => node.naturalWidth), 400);
    assert.equal(await img.evaluate(node => node.naturalHeight), 400);
    assert.equal(await img.evaluate(node => getComputedStyle(node).filter), 'none');
    assert.ok(await img.evaluate(node => parseFloat(getComputedStyle(node).width) <= 400));
    assert.equal(metrics.objectPosition, '50% 50%');
    await links.first().focus();
    assert.equal(await links.first().evaluate(node => node === document.activeElement), true);
    await page.locator('main article img').evaluateAll(async images => {
      await Promise.race([Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); })), new Promise((_, reject) => setTimeout(() => reject(new Error('Research image decode timed out')), 30000))]);
    });
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    await page.screenshot({ path: `${output}/${width}-viewport.png` });
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true });
    reports.push({ width, height, ...metrics, portraitVerified: true });
    await page.close();
  }
  await writeFile(`${output}/metrics.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally { await browser.close(); }
