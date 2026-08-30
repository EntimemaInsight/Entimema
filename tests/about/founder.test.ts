import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FounderPortrait from "../../app/about/FounderPortrait";

// tsx's test runtime uses the classic JSX transform; Next uses the automatic one.
Object.assign(globalThis, { React });

const page = readFileSync("app/about/page.tsx", "utf8");
const approved = JSON.parse(readFileSync("tests/about/founder-copy.json", "utf8")) as string[];

test("Founder portrait is a single lazy WebP with exact alt and bounded responsive requests", () => {
  const html = renderToStaticMarkup(React.createElement(FounderPortrait));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert.match(html, /alt="Aleksandar Dimitrov, Founder of Entimema"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /aleksandar-dimitrov-founder-2026.webp/);
  assert.match(html, /sizes="\(max-width: 640px\).*499px"/);
  assert.doesNotMatch(html, /\.png|fetchPriority="high"/);
  const widths = [...html.matchAll(/(?:&amp;|&)w=(\d+)/g)].map(match => Number(match[1]));
  assert.ok(widths.length > 1);
  assert.ok(widths.every(width => width <= 1080));
});

test("every approved Founder content block is preserved", () => {
  for (const block of approved) assert.ok(page.includes(block), block);
  assert.match(page, /<article id="founder" className="founder-card" aria-labelledby="founder-title"/);
  assert.match(page, /<h2 id="founder-title">/);
  assert.match(page, /<blockquote/);
});

test("About stays public, canonical and present in navigation and sitemap", () => {
  assert.match(page, /canonical: "\/about"/);
  assert.doesNotMatch(page, /notFound\(|redirect\(/);
  assert.match(readFileSync("components/AboutHeader.tsx", "utf8"), /href="\/about"/);
  assert.match(readFileSync("app/sitemap.ts", "utf8"), /"\/about"/);
  assert.match(readFileSync("app/robots.ts", "utf8"), /allow: "\/"/);
  assert.doesNotMatch(readFileSync("next.config.ts", "utf8"), /source: "\/about"/);
});
