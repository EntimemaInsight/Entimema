import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync("app/resources/resources.module.css", "utf8");

test("Engineering mobile edition preserves premium reading and technical-object contracts", () => {
  assert.match(css, /Engineering mobile edition — FT Technology reading discipline/);
  assert.match(css, /\.engineeringEditorial \.prose[\s\S]*font-size: 1\.0625rem;[\s\S]*line-height: 1\.68/);
  assert.match(css, /\.engineeringEditorial \.tableScroll[\s\S]*width: calc\(100% \+ \(2 \* var\(--article-mobile-gutter\)\)\)/);
  assert.match(css, /\.engineeringEditorial \.table[\s\S]*min-width: 36rem/);
  assert.match(css, /\.engineeringEditorial \.formula > \.equationExpression[\s\S]*white-space: nowrap/);
  assert.match(css, /\.engineeringEditorial \.prose :where\(pre,\[class\*="__code"\]\)[\s\S]*white-space: pre/);
  assert.match(css, /overscroll-behavior-inline: contain/);
  assert.match(css, /-webkit-overflow-scrolling: touch/);
});
