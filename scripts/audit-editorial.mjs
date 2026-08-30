import { createRequire } from 'node:module';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Use an explicitly supplied Playwright installation; no production dependency.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.env.QA_BASE_URL || 'http://localhost:3103';
const output = resolve(process.env.QA_OUTPUT || 'test-input/editorial-qa');
await mkdir(output, { recursive: true });
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const routes = ['/', '/about', '/alexander-dimitrov', '/labs', '/resources', '/resources/financial-data-lineage', '/services/financial-data', '/privacy'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const results = [];
const errors = [];
page.on('pageerror', error => errors.push(error.message));
async function inspect(name, url) {
  const response = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => { await document.fonts.ready; scrollTo(0, 0); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    const geometry = await page.evaluate(() => {
      const root = document.documentElement;
      const heading = document.querySelector('h1');
      const h = heading?.getBoundingClientRect();
      return {
        scrollWidth: root.scrollWidth, clientWidth: root.clientWidth,
        overflow: root.scrollWidth > root.clientWidth + 2,
        h1: heading?.textContent?.trim(),
        headingFits: !h || (h.left >= -1 && h.right <= innerWidth + 1),
        font: heading && getComputedStyle(heading).fontFamily,
        footerLinks: document.querySelectorAll('footer a').length,
        grids: Array.from(document.querySelectorAll('.specimen-grid')).map(grid => ({
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          children: Array.from(grid.children).map(child => ({ width: child.getBoundingClientRect().width, column: getComputedStyle(child).gridColumn }))
        }))
      };
    });
    results.push({ name, width, status: response?.status() ?? 200, ...geometry });
    if (name === 'specimen' || width === 390 || width === 1440) {
      await page.screenshot({ path: resolve(output, `${name}-${width}.png`), fullPage: name === 'specimen' });
      if (name !== 'specimen') {
        await page.locator('footer').last().scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({ path: resolve(output, `${name}-${width}-footer.png`) });
        await page.evaluate(() => scrollTo(0, 0));
      }
    }
  }
  console.log(`Checked ${name} at ${widths.length} widths`);
}
try {
  await inspect('specimen', pathToFileURL(resolve('docs/editorial-specimen.html')).href);
  const reducedMotion = await page.locator('.editorial-reveal-rule').evaluate(el => getComputedStyle(el).animationName);
  if (reducedMotion !== 'none') throw new Error('Reduced motion rule must not animate');
  for (const route of routes) await inspect(route === '/' ? 'home' : route.split('/').at(-1), base + route);
  await writeFile(resolve(output, 'responsive.json'), JSON.stringify({ base, results, errors }, null, 2));
  const failures = results.filter(row => row.status >= 400 || row.overflow || !row.headingFits);
  const baseline = process.env.QA_BASELINE ? JSON.parse(await readFile(process.env.QA_BASELINE, 'utf8')) : null;
  const regressions = failures.filter(row => {
    const old = baseline?.results.find(item => item.name === row.name && item.width === row.width);
    return !old || row.status > old.status || (row.overflow && !old.overflow) || (!row.headingFits && old.headingFits);
  });
  await writeFile(resolve(output, 'summary.json'), JSON.stringify({ checks: results.length, failures, regressions, errors }, null, 2));
  console.log(JSON.stringify({ checks: results.length, failures, regressions, errors }, null, 2));
  if (regressions.length || errors.length) process.exitCode = 1;
} finally { await browser.close(); }
