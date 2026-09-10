import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbar = readFileSync("components/Navbar.tsx", "utf8");
const productMenu = readFileSync("components/ProductMegaMenu.tsx", "utf8");
const mobileMenu = readFileSync("components/WhatWeDoMegaMenu.tsx", "utf8");
const productCss = readFileSync("components/ProductMegaMenu.module.css", "utf8");
const resourcesMenu = readFileSync("components/ResourcesMegaMenu.tsx", "utf8");
const resourcesCss = readFileSync("components/ResourcesMegaMenu.module.css", "utf8");
const solutionsCss = readFileSync("components/WhatWeDoMegaMenu.module.css", "utf8");
const editorialTokens = readFileSync("styles/editorial-tokens.css", "utf8");
const menuContent = readFileSync("lib/mega-menu-content.ts", "utf8");

test("exposes Product as a first-class desktop navigation destination", () => {
  assert.match(navbar, /<ProductMegaMenu active=\{active === "product"\} \/>/);
  assert.match(productMenu, /Product <span/);
  assert.match(productMenu, /aria-controls=\{menuId\}/);
  assert.match(productMenu, /aria-expanded=\{isOpen\}/);
  assert.match(productMenu, /aria-label="Product"/);
});

test("product panel exposes the platform, agent control and current product release", () => {
  assert.match(productMenu, /productDestinations/);
  assert.match(productMenu, /productFeature/);
  assert.match(menuContent, /Financial Intelligence V1/);
  assert.match(menuContent, /Entimema Finance Platform/);
  assert.match(menuContent, /AI Agent Manager/);
  assert.match(productMenu, /<h3>See how it works<\/h3>/);
  assert.match(menuContent, /See how financial data becomes a controlled, decision-ready output/);
  assert.match(menuContent, /Build and govern financial AI agents/);
  assert.match(menuContent, /See how financial evidence becomes a controlled, reviewable decision/);
  assert.doesNotMatch(productMenu, /Decision Workspace|Intelligent Intake|Exception Workspace/);
  assert.doesNotMatch(productMenu, /€490|pilot-checkout/);
});

test("mobile navigation includes a dedicated accessible Product section", () => {
  assert.match(mobileMenu, /aria-controls=\{`\$\{menuId\}-mobile-product`\}/);
  assert.match(mobileMenu, /aria-expanded=\{mobileProductOpen\}/);
  assert.match(mobileMenu, /id=\{`\$\{menuId\}-mobile-product`\}/);
  assert.match(mobileMenu, /productDestinations/);
  assert.doesNotMatch(mobileMenu, /href="\/workspace\/financial-intelligence"/);
});

test("product mega-menu has responsive and reduced-motion contracts", () => {
  assert.match(productCss, /@media \(max-width: 900px\)/);
  assert.match(productCss, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(productCss, /grid-template-columns: minmax\(0,1\.9fr\)/);
  assert.match(productCss, /height: 430px/);
});

test("resource columns follow Research, Company, Documentation order", () => {
  assert.ok(resourcesMenu.indexOf("<h3>Research</h3>") < resourcesMenu.indexOf("<h3>Company</h3>"));
  assert.ok(resourcesMenu.indexOf("<h3>Company</h3>") < resourcesMenu.indexOf("<h3>Documentation</h3>"));
});

test("menu destinations use the Entimema navy hierarchy", () => {
  assert.match(resourcesCss, /\.item strong \{[^}]*color: var\(--brand-navy-950\)/);
  assert.match(productCss, /\.item strong,\.featured strong \{[^}]*color: var\(--brand-navy-950\)/);
  assert.match(solutionsCss, /\.item \{[\s\S]*?color: var\(--brand-navy-950\)/);
});

test("solutions use destination-level copy without category descriptions", () => {
  assert.doesNotMatch(mobileMenu, /categoryDescription|Financial control, planning and performance|Risk assessment and controlled decision systems/);
  assert.match(menuContent, /Turn reporting into decision-ready insight/);
  assert.match(menuContent, /Resolve investigations faster with AI assistance/);
  assert.match(menuContent, /See how financial evidence becomes a controlled, reviewable decision/);
  assert.match(mobileMenu, /<aside className=\{styles\.featured\}>[\s\S]*?productFeature\.title/);
});

test("desktop mega menus use full-bleed geometry and aligned panel heights", () => {
  for (const stylesheet of [productCss, resourcesCss, solutionsCss]) {
    assert.match(stylesheet, /inset-inline: 0/);
    assert.match(stylesheet, /height: 430px/);
    assert.match(stylesheet, /border-top: 1px solid rgba\(4,\s*19,\s*63,\s*\.2\)/);
  }
  assert.match(productCss, /\.featured::before[\s\S]*?inset: 0 -100vw 0 0/);
  assert.match(solutionsCss, /\.featured::before[\s\S]*?inset: 0 -100vw 0 0/);
  assert.match(productCss, /\.featured h3 \{[^}]*color: var\(--brand-navy-950\);[^}]*font-size: var\(--entimema-menu-heading\)/);
  assert.match(solutionsCss, /\.featured \.category \{[^}]*color: var\(--brand-navy-950\);[^}]*font-size: var\(--entimema-menu-heading\)/);
});

test("desktop and mobile menus consume the same navigation content", () => {
  assert.match(productMenu, /import \{ productDestinations, productFeature \} from "@\/lib\/mega-menu-content"/);
  assert.match(resourcesMenu, /import \{ resourceDocumentation \} from "@\/lib\/mega-menu-content"/);
  assert.match(mobileMenu, /import \{ productDestinations, productFeature, resourceDocumentation, serviceGroups \} from "@\/lib\/mega-menu-content"/);
  assert.doesNotMatch(mobileMenu, /The controlled financial workflow|From financial evidence to a controlled decision state/);
});

test("documentation references and login enter the authenticated workspace", () => {
  assert.match(menuContent, /title: "Product documentation",[\s\S]*?href: "\/workspace\/financial-intelligence"/);
  assert.match(menuContent, /title: "Integrations",[\s\S]*?href: "\/workspace\/agents"/);
  assert.match(navbar, /className="header-login"[\s\S]*?>\s*Login/);
  assert.match(mobileMenu, /mobileDockLogin[\s\S]*?>Login</);
});

test("all mega menus share one typographic scale", () => {
  for (const token of ["menu-heading", "menu-intro", "menu-category", "menu-item", "menu-detail"]) {
    assert.match(editorialTokens, new RegExp(`--entimema-${token}:`));
  }

  for (const stylesheet of [productCss, resourcesCss, solutionsCss]) {
    assert.match(stylesheet, /font-family: var\(--entimema-font-interface\)/);
    assert.match(stylesheet, /font-size: var\(--entimema-menu-heading\)/);
    assert.match(stylesheet, /font-size: var\(--entimema-menu-category\)/);
    assert.match(stylesheet, /font-size: var\(--entimema-menu-item\)/);
    assert.match(stylesheet, /font-size: var\(--entimema-menu-detail\)/);
  }
});
