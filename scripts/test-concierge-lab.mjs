import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const page = read("app/concierge-lab/page.tsx");
const shell = read("components/concierge-lab/ConciergeLabShell.tsx");
const fixtures = read("components/concierge-lab/fixtures.ts");
const navigation = read("components/Navbar.tsx");
const sitemap = read("app/sitemap.ts");

assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
assert.doesNotMatch(navigation, /concierge-lab/);
assert.doesNotMatch(sitemap, /concierge-lab/);
assert.match(shell, /Bring the problem\./);
assert.match(shell, /LAB \/ deterministic scenario/);
assert.match(fixtures, /working-capital/);
assert.match(fixtures, /mixed-risk/);
assert.match(fixtures, /reconciliation/);
assert.match(fixtures, /cross-domain/);
assert.match(fixtures, /veto/);
assert.match(fixtures, /DIFFERENT HORIZON · NO TRUE CONFLICT/);
assert.match(fixtures, /human_decision_required:\s*true/);

console.log("Concierge Lab contract audit passed.");
