import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";
import { personSchema, portraitPath, portraitAlt } from "../../app/alexander-dimitrov/founder-data";

const page = readFileSync("app/alexander-dimitrov/page.tsx", "utf8");
const source = ts.createSourceFile("page.tsx", page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const nodes: ts.JsxElement[] = [];
function visit(node: ts.Node) {
  if (ts.isJsxElement(node)) nodes.push(node);
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

test("LinkedIn is a single named external link anchored directly inside the portrait", () => {
  const badges = nodes.filter(node => attribute(node, "data-founder-linkedin"));
  assert.equal(badges.length, 1);
  const badge = badges[0];
  assert.equal(badge.openingElement.tagName.getText(source), "a");
  assert.ok(ts.isJsxElement(badge.parent));
  assert.ok(attribute(badge.parent as ts.JsxElement, "data-founder-portrait"));
  assert.equal(value(badge, "aria-label"), "View Alexander Dimitrov on LinkedIn");
  assert.equal(value(badge, "href"), "{personSchema.sameAs[0]}");
  assert.deepEqual(personSchema.sameAs, ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"]);
  assert.equal(value(badge, "target"), "_blank");
  assert.equal(value(badge, "rel"), "noopener noreferrer");
  assert.equal(attribute(badge, "title"), undefined);
  assert.equal(attribute(badge, "tabIndex"), undefined, "Keep natural anchor tab order");
  const icons = badge.children.filter(ts.isJsxElement);
  assert.equal(icons.length, 1);
  assert.equal(icons[0].openingElement.tagName.getText(source), "svg");
  assert.equal(value(icons[0], "aria-hidden"), "true");
  assert.equal(value(icons[0], "focusable"), "false");
  assert.equal(value(icons[0], "fill"), "currentColor");
});

test("Removing only the badge restores all Founder markup, copy, portrait and metadata", () => {
  const restored = page.replace(/\r\n/g, "\n").replace(/\n {14}<a className=\{styles.linkedinBadge\} data-founder-linkedin[\s\S]*?<\/a>/, "");
  assert.equal(createHash("sha256").update(restored.replace(/\r\n/g, "\n")).digest("hex"), "2530ed29c8934543fe9d25452d72f08101fc6292fbee9a645b9779cbbffc140d");
  assert.equal(portraitPath, "/alexander-dimitrov-founder-natural.jpg");
  assert.equal(portraitAlt, "Alexander Dimitrov, Founder of Entimema");
});

test("Badge styles preserve an accessible target, visible focus and reduced motion", () => {
  const css = readFileSync("app/alexander-dimitrov/founder.module.css", "utf8");
  const badgeCss = css.slice(css.indexOf("/* Portrait overlay only;"));
  assert.match(badgeCss, /position: absolute/);
  assert.match(badgeCss, /min-width: 44px; min-height: 44px/);
  assert.match(badgeCss, /width: 52px; height: 52px/);
  assert.match(badgeCss, /width: 46px; height: 46px/);
  assert.match(badgeCss, /:focus-visible/);
  assert.match(badgeCss, /outline: 3px solid var\(--entimema-focus\)/);
  assert.match(badgeCss, /prefers-reduced-motion: reduce[\s\S]*transition: none; transform: none/);
  assert.doesNotMatch(badgeCss, /\.portrait|\.introduction|\.heading/);
});

test("About, Labs and the home page do not acquire a Founder LinkedIn badge", () => {
  for (const path of ["app/about/page.tsx", "app/labs/page.tsx", "app/page.tsx"]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /data-founder-linkedin|linkedinBadge|View Alexander Dimitrov on LinkedIn/);
  }
});
