// Run with node --import tsx. Capture the current production baseline first using
// COMPANY_CAPTURE_BASELINE=1 and COMPANY_BASE_URL, then omit the capture flag for validation.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { auditDecisionGraph, auditStaticGraph } from './audit-labs-graph.mjs';
import { companyDestinations } from '../lib/company-navigation.ts';
import { labsSchema, selectedPublications } from '../app/labs/labs-data.ts';
import { personSchema } from '../app/alexander-dimitrov/founder-data.ts';
import { SITE_URL, ORGANIZATION_ID, WEBSITE_ID, FOUNDER_ID } from '../lib/structured-data.ts';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMPANY_BASE_URL || 'http://127.0.0.1:3115';
const output = process.env.COMPANY_QA_DIR || 'build/company-seo-qa';
const baselinePath = process.env.COMPANY_BASELINE || 'build/company-seo-baseline.json';
const capture = Boolean(process.env.COMPANY_CAPTURE_BASELINE);
const routes = companyDestinations.map(d => d.href);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir(output, { recursive: true });
const reports = [], links = new Set();
const definitions = page => page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(n => { const value = JSON.parse(n.textContent); return value['@graph'] || [value]; }));
const content = page => page.locator('main').evaluate(n => { const copy = n.cloneNode(true); copy.querySelectorAll('script').forEach(s => s.remove()); return copy.textContent.replace(/\s+/g, ' ').trim(); });
const metadata = page => page.evaluate(() => ({ title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, meta: [...document.querySelectorAll('meta[name],meta[property]')].filter(n => /^(description|robots|googlebot|og:|twitter:)/.test(n.name || n.getAttribute('property'))).map(n => [n.name || n.getAttribute('property'), n.content]) }));
async function indexability(page, response, route) {
  assert.equal(response.status(), 200);
  assert.doesNotMatch(response.headers()['x-robots-tag'] || '', /noindex|\bnone\b/i);
  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.locator('h1').count(), 1);
  const info = await metadata(page), meta = Object.fromEntries(info.meta);
  assert.equal(info.canonical, SITE_URL + route);
  assert.ok(info.title && meta.description);
  for (const key of ['robots', 'googlebot']) assert.doesNotMatch(meta[key] || '', /noindex|\bnone\b/i);
  for (const prefix of ['og:', 'twitter:']) {
    assert.equal(meta[prefix + 'title'], info.title);
    assert.equal(meta[prefix + 'description'], meta.description);
  }
  assert.equal(meta['og:url'], SITE_URL + route);
  assert.ok(meta['twitter:card']);
  const schemas = await definitions(page);
  if (route === '/about') {
    const about = schemas.find(s => s['@type'] === 'AboutPage');
    assert.equal(about['@id'], SITE_URL + '/about#webpage');
    assert.deepEqual(about.mainEntity, { '@id': ORGANIZATION_ID });
    assert.deepEqual(about.isPartOf, { '@id': WEBSITE_ID });
  } else if (route === '/alexander-dimitrov') {
    assert.deepEqual(schemas.find(s => s['@type'] === 'Person'), personSchema);
  } else {
    const labs = schemas.find(s => s['@id'] === SITE_URL + '/labs#webpage');
    assert.deepEqual(labs, labsSchema);
    assert.equal(schemas.filter(s => s['@type'] === 'Organization').length, 0);
    const visible = await page.locator('#selected-work article h3 a').evaluateAll(nodes => nodes.map(n => ({ url: n.getAttribute('href'), title: n.textContent })));
    assert.deepEqual(visible, selectedPublications.map(({ resource }) => ({ url: resource.canonicalPath, title: resource.headline })));
    assert.deepEqual(labs.mentions.itemListElement.map(e => ({ url: new URL(e.item.url).pathname, title: e.item.headline })), visible);
    for (const { resource } of selectedPublications) {
      const article = page.locator('[data-publication="' + resource.slug + '"]');
      assert.ok((await article.innerText()).includes(resource.author.name));
      assert.ok((await article.innerText()).includes(resource.readingMinutes + ' min read'));
      if (resource.publishedAt) assert.equal(await article.locator('time').getAttribute('datetime'), resource.publishedAt);
    }
  }
  return info;
}
async function navigation(page, width, route) {
  const mobile = width <= 900;
  const trigger = page.getByRole('button', { name: 'Company', exact: true });
  async function open() {
    if (mobile) await page.getByRole('button', { name: 'Open main menu', exact: true }).click();
    await trigger.focus(); await page.keyboard.press('Enter');
    const menu = page.locator('[id="' + await trigger.getAttribute('aria-controls') + '"]');
    await menu.waitFor({ state: 'visible' });
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    return menu;
  }
  let menu = await open();
  assert.deepEqual(await menu.locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), routes);
  assert.equal(await menu.locator('[aria-current=page]').getAttribute('href'), route);
  const box = await menu.boundingBox();
  assert.ok(box.x >= 0 && box.x + box.width <= width + 1);
  await menu.locator('a').first().focus();
  assert.equal(await menu.locator('a').first().evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
  await page.keyboard.press('Tab');
  assert.equal(await menu.locator('a').nth(1).evaluate(n => n === document.activeElement), true);
  await page.screenshot({ path: `${output}/${route.slice(1)}-${width}-menu.png` });
  await page.keyboard.press('Escape');
  const closeTarget = mobile ? page.getByRole('button', { name: 'Open main menu', exact: true }) : trigger;
  assert.equal(await closeTarget.getAttribute('aria-expanded'), 'false');
  for (const destination of routes) {
    menu = await open();
    await menu.locator(`a[href="${destination}"]`).click();
    await page.waitForURL(base + destination);
    assert.equal(await closeTarget.getAttribute('aria-expanded'), 'false');
  }
}
try {
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 }, reducedMotion: 'reduce' });
  const staticPage = await staticContext.newPage();
  if (capture) {
    const baseline = {};
    for (const route of routes) {
      assert.equal((await staticPage.goto(base + route, { waitUntil: 'networkidle' })).status(), 200);
      baseline[route] = { content: await content(staticPage), metadata: await metadata(staticPage) };
    }
    await writeFile(baselinePath, JSON.stringify(baseline, null, 2));
    console.log('Captured unchanged production Company content and metadata.');
  } else {
    const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
    const search = {};
    for (const file of ['robots.txt', 'sitemap.xml']) {
      const response = await staticContext.request.get(base + '/' + file);
      assert.equal(response.status(), 200); search[file] = await response.text();
      await writeFile(output + '/' + file, search[file]);
    }
    assert.match(search['robots.txt'], /Allow: \/(?:\r?\n|$)/);
    assert.ok(search['robots.txt'].includes('Sitemap: ' + SITE_URL + '/sitemap.xml'));
    assert.doesNotMatch(search['robots.txt'], /Disallow:\s*\/(?:about|alexander-dimitrov|labs)?\s*$/m);
    const sitemapUrls = [...search['sitemap.xml'].matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    for (const route of routes) assert.equal(sitemapUrls.filter(u => u === SITE_URL + route).length, 1);
    assert.ok(sitemapUrls.every(u => !/^\/(workspace|api|auth)(\/|$)/.test(new URL(u).pathname)));
    for (const route of routes) {
      await indexability(staticPage, await staticPage.goto(base + route, { waitUntil: 'networkidle' }), route);
      assert.equal(await content(staticPage), baseline[route].content, 'No Company copy changes');
      assert.deepEqual(await metadata(staticPage), baseline[route].metadata, 'No metadata rewrite');
      if (route === '/labs') await auditStaticGraph(staticPage);
    }
    await staticPage.goto(base + '/', { waitUntil: 'networkidle' });
    const home = await definitions(staticPage);
    assert.deepEqual(home.find(s => s['@id'] === ORGANIZATION_ID).founder, { '@id': FOUNDER_ID });
    assert.deepEqual(home.find(s => s['@id'] === WEBSITE_ID).publisher, { '@id': ORGANIZATION_ID });
    for (const width of [375, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      for (const route of routes) {
        await indexability(page, await page.goto(base + route, { waitUntil: 'networkidle' }), route);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await content(page), baseline[route].content);
        const metrics = await page.evaluate(() => {
          const headings = [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(n => Number(n.tagName[1]));
          return { overflow: document.documentElement.scrollWidth > innerWidth, headingSkips: headings.some((n, i) => i > 0 && n > headings[i - 1] + 1) };
        });
        assert.equal(metrics.overflow, false); assert.equal(metrics.headingSkips, false);
        const mainLinks = await page.locator('main a[href]').evaluateAll(nodes => nodes.map(n => ({ href: n.getAttribute('href'), text: n.textContent.trim() })));
        for (const link of mainLinks) {
          assert.doesNotMatch(link.text.replace(/→/g, '').trim(), /^(learn more|click here|explore)$/i);
          if (link.href.startsWith('/')) links.add(link.href.split('#')[0]);
          if (link.href.startsWith('#')) assert.equal(await page.locator('[id="' + link.href.slice(1) + '"]').count(), 1);
        }
        for (const target of ['/resources', '/workspace/financial-intelligence', route === '/alexander-dimitrov' ? '/about' : '/alexander-dimitrov']) assert.ok(mainLinks.some(l => l.href === target), route + ' contextual link ' + target);
        await page.screenshot({ path: `${output}/${route.slice(1)}-${width}.png` });
        if (route === '/labs') await auditDecisionGraph(page, { width, output });
        await page.evaluate(() => scrollTo(0, 0));
        await navigation(page, width, route);
        assert.deepEqual(errors, []);
        reports.push({ route, width, status: 200, ...metrics, navigation: 'pass', indexability: 'pass', structuredData: 'pass', errors: [] });
      }
      await page.close();
    }
    for (const path of links) {
      const response = await staticContext.request.get(base + path, { maxRedirects: 0 });
      if (path.startsWith('/workspace/')) {
        assert.ok([302, 303, 307, 308].includes(response.status()));
        assert.match(response.headers().location, /auth\/sign-in/);
      } else assert.equal(response.status(), 200, path);
    }
    for (const { resource } of selectedPublications) {
      assert.equal((await staticPage.goto(base + resource.canonicalPath, { waitUntil: 'networkidle' })).status(), 200);
      assert.equal(await staticPage.locator('link[rel=canonical]').getAttribute('href'), SITE_URL + resource.canonicalPath);
      const article = (await definitions(staticPage)).find(s => s['@type'] === 'Article');
      assert.equal(article['@id'], SITE_URL + resource.canonicalPath + '#article');
      assert.equal(article.headline, resource.headline);
      assert.deepEqual(article.author, { '@id': FOUNDER_ID });
    }
    const report = { base, reports, serverRendered: true, preservedCopyAndMetadata: true, sitemap: routes, robots: 'pass', contextualLinksChecked: links.size, selectedArticleIdentities: 'pass' };
    await writeFile(output + '/report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
  }
  await staticContext.close();
} finally { await browser.close(); }
