import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("app/layout.tsx", "utf8");
const mobileCss = readFileSync("styles/mobile-premium.css", "utf8");
const menuCss = readFileSync("components/WhatWeDoMegaMenu.module.css", "utf8");

test("loads the mobile quality layer after the existing mobile foundation", () => {
  const foundation = layout.indexOf('import "../styles/mobile-polish.css"');
  const premium = layout.indexOf('import "../styles/mobile-premium.css"');
  assert.ok(foundation >= 0 && premium > foundation);
});

test("protects narrow mobile chrome from clipping", () => {
  assert.match(mobileCss, /@media \(max-width: 26\.875rem\)/);
  assert.match(mobileCss, /@media \(max-width: 22\.5rem\)/);
  assert.match(mobileCss, /\.announcement__message[\s\S]*white-space: normal/);
  assert.match(mobileCss, /\.site-header__actions[\s\S]*min-width: 0/);
});

test("keeps mobile controls usable and prevents iOS input zoom", () => {
  assert.match(mobileCss, /font-size: max\(1rem, 16px\)/);
  assert.match(menuCss, /\.mobileRoot \{[\s\S]*width: 44px;[\s\S]*height: 44px;/);
  assert.match(menuCss, /\.mobileServiceLink \{[\s\S]*min-height: 48px;/);
});

test("gives technical surfaces deliberate mobile overflow", () => {
  assert.match(mobileCss, /\[class\*="tableScroll"\]/);
  assert.match(mobileCss, /overscroll-behavior-inline: contain/);
  assert.match(mobileCss, /font-variant-numeric: tabular-nums lining-nums/);
});

test("removes desktop hover travel on touch and respects reduced motion", () => {
  assert.match(mobileCss, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(mobileCss, /transform: none !important/);
  assert.match(mobileCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(mobileCss, /opacity: 1 !important/);
  assert.match(mobileCss, /\.motion-service-dashboard/);
  assert.match(mobileCss, /transition-duration: var\(--mobile-enter\)/);
});
