import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMPANY_FOUNDER_BASE_URL || 'http://localhost:3119';
const output = process.env.COMPANY_FOUNDER_QA_DIR || 'build/founder-profile-qa';
const widths = (process.env.FOUNDER_QA_WIDTHS || '375,430,768,1440').split(',').map(Number);
const approved = JSON.parse(await readFile(new URL('../tests/company/founder-content.json', import.meta.url), 'utf8'));
const portraitPath = '/alexander-dimitrov-founder-natural.jpg';
const portraitHash = 'a5d541a055b53185f8f2b2b43f29cd35da63b322cfcfb6f5d8b7847d4fc3eff9';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const reports = [];
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    assert.equal((await page.goto(`${base}/alexander-dimitrov`, { waitUntil: 'load', timeout: 60000 })).status(), 200);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('main h1').innerText(), 'Alexander Dimitrov');
    assert.deepEqual(await page.locator('main section').evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-labelledby'))), ['founder-name', 'areas-heading', 'problem-heading', 'perspective-heading', 'entimema-heading', 'research-heading', 'conversation-heading']);
    const intro = page.locator('section[aria-labelledby="founder-name"]');
    assert.equal(await intro.locator('p').count(), 4);
    assert.equal(await intro.locator('.editorial-eyebrow').textContent(), 'Founder, Entimema');
    assert.equal(await intro.locator('.editorial-standfirst-md').textContent(), approved.profileIntro);
    assert.deepEqual(await intro.locator('.editorial-body-md p').allTextContents(), approved.biography);
    assert.equal(await intro.locator('a, button, svg').count(), 0);
    const portrait = page.locator('[data-founder-portrait]');
    const img = portrait.locator('img');
    const beforeImage = await portrait.boundingBox();
    await img.evaluate(n => n.decode());
    assert.deepEqual(await portrait.boundingBox(), beforeImage, 'Portrait decode must not shift layout');
    assert.equal(await img.getAttribute('src'), portraitPath);
    assert.equal(await img.getAttribute('alt'), 'Alexander Dimitrov, Founder of Entimema');
    assert.equal(await img.getAttribute('fetchpriority'), 'high');
    assert.equal(await img.getAttribute('loading'), 'eager');
    assert.equal(await img.getAttribute('srcset'), null, 'No transformed portrait variants');
    assert.equal(await page.locator('[aria-label="Founder thesis"]').innerText(), approved.thesis);
    assert.deepEqual(await page.locator('section[aria-labelledby="areas-heading"] h3').allTextContents(), approved.foundations.map(f => f.title));
    const articles = page.locator('section[aria-labelledby="research-heading"] article');
    assert.equal(await articles.count(), 6);
    for (let index = 0; index < approved.publications.length; index++) {
      const article = articles.nth(index);
      const expected = approved.publications[index];
      assert.equal(await article.locator('a').getAttribute('href'), expected.path);
      assert.equal((await article.locator('h3').textContent()).replace(/\s*→$/, ''), expected.title);
      assert.deepEqual(await article.locator('.editorial-metadata span').allTextContents(), [expected.topic, `${expected.minutes} MIN READ`]);
      const cover = article.locator('img');
      const src = new URL(await cover.getAttribute('src'), base);
      assert.equal(src.searchParams.get('url') || src.pathname, expected.cover.src);
      assert.equal(await cover.getAttribute('alt'), expected.cover.alt);
      assert.equal(await cover.evaluate(n => getComputedStyle(n).objectFit), 'contain');
    }
    assert.equal(await page.locator('main a[href*="linkedin"]').count(), 0);
    assert.equal(await page.title(), 'Alexander Dimitrov | Founder of Entimema');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://www.entimema.com/alexander-dimitrov');
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), 'Alexander Dimitrov is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.');
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      assert.equal(await page.locator(selector).getAttribute('content'), `https://www.entimema.com${portraitPath}`);
    }
    assert.equal(await page.locator('meta[property="og:type"]').getAttribute('content'), 'profile');
    assert.equal(await page.locator('meta[property="og:image:width"]').getAttribute('content'), '400');
    assert.equal(await page.locator('meta[property="og:image:height"]').getAttribute('content'), '400');
    const person = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse).find(schema => schema['@type'] === 'Person');
    assert.deepEqual(person, { '@context': 'https://schema.org', '@type': 'Person', '@id': 'https://www.entimema.com/about#founder', name: 'Alexander Dimitrov', url: 'https://www.entimema.com/alexander-dimitrov', image: `https://www.entimema.com${portraitPath}`, jobTitle: 'Founder', worksFor: { '@id': 'https://www.entimema.com/#organization' }, sameAs: ['https://www.linkedin.com/in/alexander-dimitrov-entimema/'], knowsAbout: approved.areas.map(a => a.title) });
    assert.equal(await page.locator('main a[href="/about"]').count(), 1);
    assert.equal(await page.locator('main a[href="/labs"]').count(), 1);
    const actions = page.locator('section[aria-labelledby="conversation-heading"] a');
    assert.deepEqual(await actions.evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), ['/workspace/financial-intelligence', '/resources', '/contact']);
    for (const link of [articles.first().locator('a'), actions.nth(0), actions.nth(1), actions.nth(2)]) {
      await link.focus();
      assert.ok(await link.evaluate(n => n === document.activeElement && getComputedStyle(n).outlineStyle !== 'none'));
    }
    const metrics = await page.evaluate(() => {
      const frame = document.querySelector('[data-founder-portrait]');
      const image = frame.querySelector('img');
      const rect = n => { const r = n.getBoundingClientRect(); return {left:r.left,top:r.top,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
      const intro = frame.parentElement;
      const copy = intro.querySelector('.editorial-body-md');
      const fonts = [...document.querySelectorAll('main h1, main h2, main blockquote')].map(n => ({text:n.textContent, size:parseFloat(getComputedStyle(n).fontSize)}));
      return { portrait: rect(frame), portraitCss: parseFloat(getComputedStyle(frame).width), naturalWidth:image.naturalWidth, naturalHeight:image.naturalHeight, objectPosition:getComputedStyle(image).objectPosition, objectFit:getComputedStyle(image).objectFit, filter:getComputedStyle(image).filter, imageTransform:getComputedStyle(image).transform, heading:rect(intro.querySelector('h1')), standfirst:rect(intro.querySelector('.editorial-standfirst-md')), biography:rect(copy), researchHeight:document.querySelector('section[aria-labelledby="research-heading"]').getBoundingClientRect().height, mainHeight:document.querySelector('main').getBoundingClientRect().height, fonts, overflow:document.documentElement.scrollWidth>innerWidth, clipping:[...document.querySelectorAll('main h1, main h2, main h3, main p, main a')].filter(n=>{const r=n.getBoundingClientRect();return r.right>innerWidth+1||r.left< -1||n.scrollWidth>n.clientWidth+2}).map(n=>n.textContent), reducedAnimations:[...document.querySelectorAll('main *')].filter(n=>getComputedStyle(n).animationName!=='none').map(n=>n.tagName) };
    });
    assert.ok(Math.abs(metrics.portrait.width - metrics.portrait.height) < 1);
    assert.ok(metrics.portraitCss <= 400 && metrics.portrait.width <= 400);
    assert.equal(metrics.naturalWidth, 400); assert.equal(metrics.naturalHeight, 400);
    assert.equal(metrics.objectFit, 'cover'); assert.equal(metrics.objectPosition, '50% 50%');
    assert.equal(metrics.filter, 'none'); assert.equal(metrics.imageTransform, 'none');
    assert.equal(metrics.overflow, false); assert.deepEqual(metrics.clipping, []);
    assert.deepEqual(metrics.reducedAnimations, []);
    assert.ok(metrics.fonts.slice(1).every(font => font.size < metrics.fonts[0].size), 'Name remains the dominant type size');
    if (width < 768) {
      assert.ok(metrics.heading.bottom <= metrics.standfirst.top);
      assert.ok(metrics.standfirst.bottom <= metrics.portrait.top);
      assert.ok(metrics.portrait.bottom <= metrics.biography.top);
      assert.ok(metrics.researchHeight < 2300, 'Research must be materially shorter than the previous 3000px catalogue');
    } else {
      assert.ok(metrics.standfirst.right < metrics.portrait.left, 'Tablet and desktop pair text with the portrait');
    }
    if (width === widths[0]) {
      const asset = await page.request.get(`${base}${portraitPath}`);
      assert.equal(asset.status(), 200);
      const bytes = await asset.body(); assert.equal(bytes.length, 24453);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), portraitHash);
      for (const path of [...approved.articles, '/about', '/labs', '/resources', '/contact']) {
        assert.equal((await page.request.get(`${base}${path}`)).status(), 200, path);
      }
    }
    await page.locator('main article img').evaluateAll(async images => {
      await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
    });
    await page.locator('main h1').evaluate(n => { document.activeElement?.blur(); n.scrollIntoView({block:'start'}); scrollTo(0,0); });
    await page.screenshot({ path:`${output}/${width}-opening.png` });
    await page.screenshot({ path:`${output}/${width}-full.png`, fullPage:true });
    for (const id of ['areas-heading', 'research-heading', 'conversation-heading']) {
      await page.locator(`section[aria-labelledby="${id}"]`).evaluate(n => scrollTo(0, n.getBoundingClientRect().top + scrollY - 80));
      await page.screenshot({ path:`${output}/${width}-${id}.png` });
    }
    await page.emulateMedia({ reducedMotion:'no-preference' });
    await page.reload({waitUntil:'load'});
    await page.locator('h1').evaluate(async n => { await Promise.all(n.getAnimations().map(a=>a.finished)); });
    assert.equal(await page.locator('h1').evaluate(n=>getComputedStyle(n).opacity), '1');
    assert.deepEqual(errors, []);
    reports.push({width, ...metrics, errors, portraitVerified:true, identityVerified:true, publicationsVerified:true});
    await page.close();
  }
  const noJs = await browser.newPage({javaScriptEnabled:false, viewport:{width:375,height:1000}});
  assert.equal((await noJs.goto(`${base}/alexander-dimitrov`)).status(), 200);
  assert.equal(await noJs.locator('main article').count(), 6);
  assert.equal(await noJs.locator('main h1').isVisible(), true);
  await writeFile(`${output}/metrics.json`, JSON.stringify(reports,null,2));
  console.log(JSON.stringify(reports.map(({width,portrait,researchHeight,mainHeight,overflow,clipping,errors,portraitVerified,identityVerified,publicationsVerified})=>({width,portraitSize:portrait.width,researchHeight,mainHeight,overflow,clipping,errors,portraitVerified,identityVerified,publicationsVerified})),null,2));
} finally { await browser.close(); }
