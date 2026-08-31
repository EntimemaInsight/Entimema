import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const footerPath = "components/GlobalFooter.tsx";
const footer = readFileSync(footerPath, "utf8");
const source = ts.createSourceFile(footerPath, footer, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const elements: ts.JsxElement[] = [];

function visit(node: ts.Node) {
  if (ts.isJsxElement(node)) elements.push(node);
  ts.forEachChild(node, visit);
}

visit(source);

function attribute(node: ts.JsxElement, name: string) {
  return node.openingElement.attributes.properties.find(
    (item): item is ts.JsxAttribute => ts.isJsxAttribute(item) && item.name.getText(source) === name,
  );
}

function value(node: ts.JsxElement, name: string) {
  const initializer = attribute(node, name)?.initializer;
  return initializer && ts.isStringLiteral(initializer) ? initializer.text : initializer?.getText(source);
}

test("the global footer exposes exactly one crawlable Entimema LinkedIn anchor", () => {
  const linkedinLinks = elements.filter(
    (node) => node.openingElement.tagName.getText(source) === "a" && value(node, "href")?.includes("linkedin.com"),
  );

  assert.equal(linkedinLinks.length, 1);
  const link = linkedinLinks[0];
  assert.equal(value(link, "href"), "https://www.linkedin.com/company/144795091/");
  assert.equal(value(link, "target"), "_blank");
  assert.equal(value(link, "rel"), "noopener noreferrer");
  assert.equal(value(link, "aria-label"), "Entimema on LinkedIn");
  assert.equal(attribute(link, "title"), undefined);
  assert.equal(attribute(link, "tabIndex"), undefined, "Keep the anchor in the natural keyboard order");
});

test("the LinkedIn glyph is decorative and the footer adds no other social links", () => {
  const linkedinLink = elements.find((node) => value(node, "aria-label") === "Entimema on LinkedIn");
  assert.ok(linkedinLink);
  const icons = linkedinLink.children.filter(ts.isJsxElement);
  assert.equal(icons.length, 1);
  assert.equal(icons[0].openingElement.tagName.getText(source), "svg");
  assert.equal(value(icons[0], "aria-hidden"), "true");
  assert.equal(value(icons[0], "focusable"), "false");
  assert.doesNotMatch(footer, /twitter|instagram|facebook|youtube|follow us/i);
});

test("the existing logo home link and copyright remain intact", () => {
  assert.equal((footer.match(/<FooterHomeLink className=\{styles\.brandLink\}>/g) ?? []).length, 1);
  assert.match(footer, /<BrandLogo compact \/>/);
  assert.match(footer, /© 2026 Entimema/);
});

test("the institutional reference has premium target, focus and motion styles", () => {
  const css = readFileSync("components/GlobalFooter.module.css", "utf8");
  assert.match(css, /\.linkedinLink \{[\s\S]*?width: 56px;[\s\S]*?height: 56px;/);
  assert.match(css, /\.linkedinLink \{[\s\S]*?border-radius: 13px;[\s\S]*?background: var\(--brand-navy-950\);[\s\S]*?color: #fff;/);
  assert.match(css, /\.linkedinLink svg \{[\s\S]*?width: 28px;[\s\S]*?height: 28px;/);
  assert.match(css, /\.institutionalReferences \{[\s\S]*?gap: 24px;/);
  assert.match(css, /\.linkedinLink:focus-visible/);
  assert.match(css, /outline: 2px solid var\(--entimema-focus\)/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.linkedinLink:hover \{[\s\S]*?transform: none;/);
});
