import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbar = readFileSync("components/Navbar.tsx", "utf8");
const productMenu = readFileSync("components/ProductMegaMenu.tsx", "utf8");
const mobileMenu = readFileSync("components/WhatWeDoMegaMenu.tsx", "utf8");
const productCss = readFileSync("components/ProductMegaMenu.module.css", "utf8");

test("exposes Product as a first-class desktop navigation destination", () => {
  assert.match(navbar, /<ProductMegaMenu active=\{active === "product"\} \/>/);
  assert.match(productMenu, /Product <span/);
  assert.match(productMenu, /aria-controls=\{menuId\}/);
  assert.match(productMenu, /aria-expanded=\{isOpen\}/);
  assert.match(productMenu, /aria-label="Product"/);
});

test("product panel exposes the platform, agent control and current product release", () => {
  assert.match(productMenu, /What&apos;s new/);
  assert.match(productMenu, /Financial Intelligence V1/);
  assert.match(productMenu, /Platform overview/);
  assert.match(productMenu, /AI Agent Control/);
  assert.doesNotMatch(productMenu, /Decision Workspace|Intelligent Intake|Exception Workspace/);
  assert.doesNotMatch(productMenu, /€490|pilot-checkout/);
});

test("mobile navigation includes a dedicated accessible Product section", () => {
  assert.match(mobileMenu, /aria-controls=\{`\$\{menuId\}-mobile-product`\}/);
  assert.match(mobileMenu, /aria-expanded=\{mobileProductOpen\}/);
  assert.match(mobileMenu, /id=\{`\$\{menuId\}-mobile-product`\}/);
  assert.match(mobileMenu, /Platform overview/);
  assert.doesNotMatch(mobileMenu, /href="\/workspace\/financial-intelligence"/);
});

test("product mega-menu has responsive and reduced-motion contracts", () => {
  assert.match(productCss, /@media \(max-width: 900px\)/);
  assert.match(productCss, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(productCss, /grid-template-columns: minmax\(0,1\.9fr\)/);
});
