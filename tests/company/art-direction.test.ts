import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import preserved from "./art-direction-preservation.json";

test("Company art direction preserves complete content, entities, images, graph, motion and site shell", () => {
  for (const [path, expected] of Object.entries(preserved)) {
    const content = path.endsWith(".jpg") ? readFileSync(path) : readFileSync(path, "utf8").replace(/\r\n/g, "\n");
    assert.equal(createHash("sha256").update(content).digest("hex"), expected, path);
  }
});

test("Company styles retain scoped tokens, finite entrances, focus and reduced-motion hooks", () => {
  const css = readFileSync("components/company/company.module.css", "utf8");
  assert.match(css, /^\/\*[^]*?\*\/\s*\.page\s*\{/);
  assert.doesNotMatch(css, /:root|:global\((?:html|body|footer|header)\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\[data-company-entered\]/);
  assert.doesNotMatch(css, /infinite|opacity:\s*0(?:;|\s*\})/);
});
