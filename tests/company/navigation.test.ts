import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { companyDestinations, isCompanyRoute } from '../../lib/company-navigation';

test('Company has exactly three published destinations and excludes Contact', () => {
  assert.deepEqual(companyDestinations.map(item => item.href), ['/about', '/alexander-dimitrov', '/labs']);
  for (const { href } of companyDestinations) {
    assert.ok(existsSync(`app${href}/page.tsx`));
    assert.ok(isCompanyRoute(href));
    assert.ok(isCompanyRoute(`${href}/`));
  }
  for (const path of ['/contact', '/', '/resources', '/labs-other', '/about/story']) assert.equal(isCompanyRoute(path), false);
});

test('About is an institutional AboutPage referencing the existing organization', () => {
  const page = readFileSync('app/about/page.tsx', 'utf8');
  assert.match(page, /"@type": "AboutPage"/);
  assert.match(page, /mainEntity: \{ "@id": ORGANIZATION_ID \}/);
  assert.doesNotMatch(page, /"@type": "Person"|createFounderSchema|FounderPortrait|<img|<Image|href="\/contact"/);
  assert.match(page, /About Entimema \| Controlled Financial Decision Systems/);
  for (const route of ['services', 'resources', 'alexander-dimitrov', 'labs']) assert.ok(page.includes(`href="/${route}"`));
});
