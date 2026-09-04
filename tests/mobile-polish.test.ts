import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("app/layout.tsx", "utf8");
const mobile = readFileSync("styles/mobile-polish.css", "utf8");
const consent = readFileSync("components/AnalyticsConsent.module.css", "utf8");
const footer = readFileSync("components/GlobalFooter.module.css", "utf8");
const resources = readFileSync("app/resources/resources.module.css", "utf8");
const mobileMenu = readFileSync("components/WhatWeDoMegaMenu.tsx", "utf8");
const mobileMenuStyles = readFileSync("components/WhatWeDoMegaMenu.module.css", "utf8");

test("mobile foundation loads after the historical global stylesheet", () => {
  assert.ok(layout.indexOf('import "./globals.css"') < layout.indexOf('import "../styles/mobile-polish.css"'));
});

test("mobile foundation protects narrow viewports and touch interactions", () => {
  assert.match(mobile, /@media \(max-width: 47\.5rem\)/);
  assert.match(mobile, /--mobile-gutter:/);
  assert.match(mobile, /overflow-x: clip/);
  assert.match(mobile, /executive-agent--right \{ display: none; \}/);
  assert.match(mobile, /-webkit-tap-highlight-color:/);
  assert.match(mobile, /@media \(max-width: 26\.875rem\)/);
});

test("mobile privacy and footer surfaces preserve usable controls", () => {
  assert.match(consent, /max-height: min\(92dvh, 720px\)/);
  assert.match(consent, /min-width: 136px/);
  assert.match(footer, /grid-template-columns: 1fr/);
  assert.match(footer, /min-height: 44px/);
});

test("home mobile layout follows one centered visual axis", () => {
  assert.match(mobile, /\.site-page:has\(> \.home-stage\)/);
  assert.match(mobile, /\.approach-section__tiles[\s\S]*margin-inline: auto/);
  assert.match(mobile, /ConversionTrustSection[\s\S]*text-align: center/);
});

test("Insights and Engineering retain distinct premium mobile reading systems", () => {
  assert.match(resources, /Mobile publication edition/);
  assert.match(resources, /\.fir15Editorial \.articleHeader h1/);
  assert.match(resources, /\.engineeringEditorial \.engineeringHeroCover/);
  assert.match(resources, /\.engineeringUtilities \{ background:/);
  assert.match(resources, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
});

test("mobile navigation follows the full-screen action-drawer contract", () => {
  assert.match(mobileMenu, /function MenuChevron/);
  assert.doesNotMatch(mobileMenu, /mobileSolutionsOpen \? "−" : "\+"/);
  assert.match(mobileMenu, /href="\/contact"/);
  assert.doesNotMatch(mobileMenu, /href="\/workspace\/financial-intelligence"/);
  assert.doesNotMatch(mobileMenu, />Data Analysis</);
  assert.equal((mobileMenu.match(/<MenuChevron direction="down"/g) ?? []).length, 3);
  assert.equal((mobileMenu.match(/<MenuChevron \/>/g) ?? []).length, 0);
  assert.match(mobileMenuStyles, /\.mobileActionDock/);
  assert.match(mobileMenuStyles, /position: fixed/);
});
