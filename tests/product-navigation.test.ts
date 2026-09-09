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

test("product panel distinguishes the live product, workspace and control layers", () => {
  assert.match(productMenu, /FOUNDING PILOT · LIVE/);
  assert.match(productMenu, /Financial Intelligence/);
  assert.match(productMenu, /Decision Workspace/);
  for (const layer of ["Intelligent Intake", "Financial Context", "Validation Engine", "Exception Workspace"]) {
    assert.match(productMenu, new RegExp(layer));
  }
  assert.match(productMenu, /contact\?topic=financial-data/);
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
  assert.match(productCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(productCss, /grid-template-columns: minmax\(300px/);
});
