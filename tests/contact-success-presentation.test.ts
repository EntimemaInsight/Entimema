import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const modal = readFileSync("components/DemoDiscovery.tsx", "utf8");
const contactRoute = readFileSync("app/api/contact/route.ts", "utf8");

test("project and partnership success states omit the red enquiry eyebrow", () => {
  assert.match(modal, /kind === "client"[\s\S]*?\? "ENQUIRY RECEIVED"[\s\S]*?: null/);
  assert.match(modal, /\{eyebrow && <p className=\{styles\.eyebrow\}>\{eyebrow\}<\/p>\}/);
});

test("support request email uses an accurate type label", () => {
  assert.match(contactRoute, /row\("Type", "Support request"\)/);
  assert.doesNotMatch(contactRoute, /row\("Type", "Existing client"\)/);
});
