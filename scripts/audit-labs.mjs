import assert from 'node:assert/strict';
import { auditDecisionGraph, auditStaticGraph } from './audit-labs-graph.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { selectedPublications } from '../app/labs/labs-data.ts';

// Run with node --import tsx; use an existing Playwright installation, no app dependency.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.LABS_BASE_URL || 'http://localhost:3112';
const output = process.env.LABS_QA_DIR || 'build/labs-qa';
const widths = (process.env.LABS_WIDTHS || '375,430,768,1440').split(',').map(Number);
const approved = JSON.parse(await readFile(new URL('../tests/company/labs-copy.json', import.meta.url), 'utf8'));
const normalize = text => text.replace(/\s+/g, ' ').trim();
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.LABS_BROWSER_CHANNEL || 'msedge', headless: true });
const reports = [];
const expectedSections = ['remit', 'investigative-problem', 'research-agenda', 'investigation-method', 'applied-system', 'selected-work', 'open-questions', 'explore'];
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 900 : 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.__labsCLS = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__labsCLS += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const response = await page.goto(base + '/labs', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const copy = normalize(await page.locator('main').innerText());
    for (const text of approved) assert.ok(copy.includes(normalize(text)), 'Missing approved boundary/copy: ' + text);
    assert.deepEqual(await page.locator('main section').evaluateAll(nodes => nodes.map(node => node.id)), expectedSections);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.title(), 'Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.entimema.com/labs');
    const description = 'Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.';
    for (const selector of ['meta[name=description]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) assert.equal(await page.locator(selector).getAttribute('content'), description);
    const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse);
    assert.equal(schemas.find(s => s['@id'] === 'https://www.entimema.com/labs#webpage')['@type'], 'WebPage');
    assert.deepEqual(await page.locator('#investigation-method ol h3').allTextContents(), ['Observe', 'Formalise', 'Test', 'Operationalise', 'Improve']);
    assert.equal(await page.locator('#research-agenda article').count(), 3);
    assert.equal(await page.locator('#selected-work article').count(), 6);
    for (const { resource } of selectedPublications) {
      const article = page.locator('[data-publication="' + resource.slug + '"]');
      assert.equal(await article.locator('h3').innerText(), resource.headline);
      assert.equal(await article.locator('h3 a').getAttribute('href'), resource.canonicalPath);
      assert.ok((await article.innerText()).includes(resource.author.name));
      assert.ok((await article.innerText()).includes(resource.readingMinutes + ' min read'));
      if (resource.publishedAt) assert.equal(await article.locator('time').getAttribute('datetime'), resource.publishedAt);
    }
    assert.equal(await page.locator('main canvas, main iframe, main img').count(), 0);
    assert.equal(await page.locator('main svg:not(#decision-architecture svg, [data-company-ornament])').count(), 0);
    assert.equal(await page.locator('[data-company-ornament][aria-hidden="true"][focusable="false"]').count(), 1);
    const graph = await auditDecisionGraph(page, { width, output });
    const metrics = await page.locator('main').evaluate(main => {
      const lum = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
      const rgb = color => (color.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const contrast = [...main.querySelectorAll('p,h1,h2,h3,li,a,dt,dd,time,button,#decision-architecture span')].map(node => {
        let parent = node, bg = 'rgba(0, 0, 0, 0)';
        while (parent && bg === 'rgba(0, 0, 0, 0)') { bg = getComputedStyle(parent).backgroundColor; parent = parent.parentElement; }
        const a = lum(rgb(getComputedStyle(node).color)), b = lum(rgb(bg));
        return (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
      });
      const overflowElements = [...main.querySelectorAll('*')].filter(node => { const r = node.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).map(n => n.tagName + '.' + n.className);
      const headings = [...main.querySelectorAll('h1,h2,h3')].map(n => Number(n.tagName.slice(1)));
      return { overflow: document.documentElement.scrollWidth > innerWidth, overflowElements, cls: window.__labsCLS, minContrast: Math.min(...contrast), height: main.getBoundingClientRect().height, headingSkips: headings.some((h,i) => i && h > headings[i-1] + 1), animatedElements: [...main.querySelectorAll('*')].filter(n => getComputedStyle(n).animationName !== 'none').length };
    });
    assert.equal(metrics.overflow, false, JSON.stringify(metrics));
    assert.deepEqual(metrics.overflowElements, []);
    assert.ok(metrics.minContrast >= 4.5, JSON.stringify(metrics));
    assert.ok(metrics.cls < .05, JSON.stringify(metrics));
    assert.equal(metrics.headingSkips, false);
    assert.equal(metrics.animatedElements, 0);
    assert.deepEqual(errors, []);
    const links = page.locator('main a, main button');
    await page.keyboard.press('Tab');
    await links.first().focus();
    for (let i = 0; i < await links.count(); i++) {
      const link = links.nth(i);
      assert.equal(await link.evaluate(n => n === document.activeElement), true, 'Keyboard reading order');
      assert.equal(await link.evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
      if (i < await links.count() - 1) await page.keyboard.press('Tab');
    }
    await page.locator('main a[href="#research-agenda"]').click();
    const agenda = await page.locator('#research-agenda').boundingBox();
    const navBottom = await page.locator('header').first().evaluate(n => n.getBoundingClientRect().bottom);
    assert.ok(agenda.y >= navBottom - 2, 'Anchor must clear navigation');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: output + '/' + width + '-viewport.png' });
    await page.screenshot({ path: output + '/' + width + '-full.png', fullPage: true });
    for (const id of expectedSections) await page.locator('#' + id).screenshot({ path: output + '/' + width + '-' + id + '.png', style: '.site-header, .site-header * { visibility: hidden !important; }' });
    reports.push({ width, status: 200, ...metrics, graph, errors });
    await page.close();
  }
  const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  await noJs.goto(base + '/labs');
  await auditStaticGraph(noJs);
  const staticCopy = normalize(await noJs.locator('main').innerText());
  for (const text of approved) assert.ok(staticCopy.includes(normalize(text)), 'Server HTML missing: ' + text);
  const hrefs = [...new Set(await noJs.locator('main a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))))];
  for (const href of hrefs.filter(h => h.startsWith('/'))) {
    const response = await noJs.request.get(base + href);
    assert.equal(response.status(), 200, href);
    if (href === '/workspace/financial-intelligence') assert.ok(response.url().includes('/auth/sign-in'), 'Workspace requires an honest sign-in destination');
  }
  await noJs.close();
  // Compare actual current production institution pages, without changing them.
  if (process.env.LABS_COMPARISON_BASE) {
    const comparison = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    for (const path of ['/about', '/alexander-dimitrov']) {
      await comparison.goto(process.env.LABS_COMPARISON_BASE + path, { waitUntil: 'networkidle' });
      await comparison.screenshot({ path: output + '/comparison-' + path.slice(1) + '.png', fullPage: true });
      await comparison.screenshot({ path: output + '/comparison-' + path.slice(1) + '-hero.png' });
    }
    await comparison.close();
  }
  await writeFile(output + '/report.json', JSON.stringify({ base, reports, serverRendered: true, destinations: hrefs }, null, 2));
  console.log(JSON.stringify({ base, reports, serverRendered: true }, null, 2));
} finally { await browser.close(); }
