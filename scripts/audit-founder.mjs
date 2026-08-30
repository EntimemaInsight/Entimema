import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Install Playwright locally or point PLAYWRIGHT_MODULE at an existing installation.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FOUNDER_BASE_URL || 'http://localhost:3102';
const output = process.env.FOUNDER_QA_DIR || 'build/founder-qa';
const approved = JSON.parse(await readFile('tests/about/founder-copy.json', 'utf8')).join(' ');
const normalize = value => value.replace(/\s+/g, ' ').trim();
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.FOUNDER_BROWSER_CHANNEL || 'msedge', headless: true });
const reports = [];
try {
  for (const [width, height] of [[320,812],[375,812],[768,1024],[1024,768],[1440,900],[1920,1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.route('**/_next/image?**', async route => {
      await new Promise(resolve => setTimeout(resolve, 250));
      await route.continue();
    });
    const response = await page.goto(`${base}/about`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    const founder = page.locator('#founder');
    await founder.scrollIntoViewIfNeeded();
    const before = await founder.boundingBox();
    const img = founder.locator('img');
    await img.evaluate(image => image.decode());
    const after = await founder.boundingBox();
    assert.equal(before.height, after.height, 'Image loading must not shift the section');
    assert.equal(await img.count(), 1);
    assert.equal(await img.getAttribute('alt'), 'Aleksandar Dimitrov, Founder of Entimema');
    assert.equal(await img.getAttribute('loading'), 'lazy');
    assert.equal(normalize(await founder.innerText()), normalize(approved));
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.entimema.com/about');
    assert.ok(await page.locator('nav a[href="/about"]').count());
    const metrics = await founder.evaluate(element => {
      const image = element.querySelector('img');
      const portrait = image.getBoundingClientRect();
      const content = element.querySelector('.founder-card__content').getBoundingClientRect();
      const linear = value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; };
      const luminance = color => color.map(linear).reduce((sum, value, i) => sum + value * [.2126,.7152,.0722][i], 0);
      const background = luminance([20,39,65]); // lightest point in the navy gradient
      const contrasts = [...element.querySelectorAll('h2,h3,p,blockquote,strong')].map(node => {
        const color = getComputedStyle(node).color.match(/\d+/g).slice(0,3).map(Number);
        return (luminance(color) + .05) / (background + .05);
      });
      return { viewport: innerWidth, portraitWidth: portrait.width, portraitHeight: portrait.height, stacked: content.top >= portrait.bottom - 1, overflow: document.documentElement.scrollWidth > innerWidth, src: image.currentSrc, minContrast: Math.min(...contrasts), matrixColumns: getComputedStyle(element.querySelector('.founder-pillars')).gridTemplateColumns, filter: getComputedStyle(image).filter };
    });
    assert.equal(metrics.overflow, false);
    assert.equal(metrics.stacked, width <= 864);
    assert.ok(metrics.minContrast >= 4.5);
    assert.equal(metrics.filter, 'none');
    assert.ok(Number(new URL(metrics.src).searchParams.get('w')) <= 1080);
    const imageResponse = await page.request.get(metrics.src, { headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8" } });
    assert.equal(imageResponse.status(), 200);
    assert.match(imageResponse.headers()['content-type'], /image\/(webp|avif)/);
    await page.screenshot({ path: `${output}/page-${width}.png`, fullPage: true });
    // Suppress only fixed headers in isolated section captures; the full-page evidence is untouched.
    await founder.screenshot({ path: `${output}/founder-${width}.png`, style: 'header, nextjs-portal { visibility: hidden !important; }' });
    reports.push({ ...metrics, imageBytes: (await imageResponse.body()).length });
    await page.close();
  }
  const request = await browser.newContext();
  const sitemap = await request.request.get(`${base}/sitemap.xml`);
  assert.equal(sitemap.status(), 200);
  assert.match(await sitemap.text(), /https:\/\/www.entimema.com\/about/);
  const robots = await request.request.get(`${base}/robots.txt`);
  assert.equal(robots.status(), 200);
  assert.doesNotMatch(await robots.text(), /Disallow:\s*\/about/);
  await writeFile(`${output}/results.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally { await browser.close(); }

