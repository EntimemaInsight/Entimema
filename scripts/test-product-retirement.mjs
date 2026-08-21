import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const page = read("app/concierge-lab/page.tsx");
const config = read("next.config.ts");
const navigation = read("components/Navbar.tsx");
const footer = read("components/GlobalFooter.tsx");
const homepageHero = read("components/Hero.tsx");
const sitemap = read("app/sitemap.ts");
const runtime = read("entimema-ai/api/app.py");

assert.match(page, /redirect\("\/agents"\)/, "legacy page cannot render the retired workspace");
assert.match(config, /source: "\/concierge-lab", destination: "\/agents", permanent: false/);
assert.doesNotMatch(navigation, /concierge-lab|Concierge/);
assert.doesNotMatch(footer, /concierge-lab|Concierge/);
assert.doesNotMatch(sitemap, /concierge-lab/);
assert.match(navigation, /Agent Library/);
assert.match(footer, /Agent Library/);
assert.match(homepageHero, /href="\/agents"/);
assert.match(homepageHero, /Explore agents/);
assert.doesNotMatch(homepageHero, /Bring the problem/i);
assert.match(runtime, /SQLiteSessionStore/, "durable Case runtime remains available");
assert.match(runtime, /EvidenceService/, "Evidence Layer remains wired to the runtime");

console.log("Concierge product retirement contract audit passed.");
