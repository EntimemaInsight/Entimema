import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbar = readFileSync("components/Navbar.tsx", "utf8");
const mobileMenu = readFileSync("components/WhatWeDoMegaMenu.tsx", "utf8");
const resourcesMenu = readFileSync("components/ResourcesMegaMenu.tsx", "utf8");
const agentsPage = readFileSync("app/agents/page.tsx", "utf8");
const agentLibrary = readFileSync("app/agents/AgentLibrary.tsx", "utf8");
const demo = readFileSync("app/demo/financial-intelligence/FinancialIntelligenceDemo.tsx", "utf8");
const subscription = readFileSync("app/resources/EditorialSubscription.tsx", "utf8");
const actionCss = readFileSync("styles/action-system.css", "utf8");
const tokens = readFileSync("styles/tokens.css", "utf8");

test("public navigation separates contact, self-guided demo and authentication actions", () => {
  assert.match(navbar, />\s*Log in\s*</);
  assert.match(navbar, /className="primary-cta primary-cta--compact header-cta"[\s\S]*?href="\/contact"[\s\S]*?>\s*Contact us\s*</);
  assert.match(mobileMenu, /mobileDockLogin[\s\S]*?>Log in</);
  assert.match(mobileMenu, /mobileDockContact[\s\S]*?href="\/demo\/financial-intelligence"[\s\S]*?>Try the interactive demo</);
  assert.doesNotMatch(navbar, />\s*Login\s*</);
});

test("protected Workspace entry is explicit and commercial actions retain distinct meanings", () => {
  assert.match(resourcesMenu, /href="\/auth\/sign-in\?callbackUrl=%2Fworkspace"/);
  assert.match(resourcesMenu, />Log in to Workspace</);
  assert.match(agentsPage, /GENERAL_CONSULTING_CTA/);
  assert.match(agentLibrary, /Discuss this agent workflow/);
  assert.match(demo, /Start demo analysis/);
  assert.doesNotMatch(demo, /Start the demo analysis →/);
  assert.match(subscription, /NEWSLETTER_CTA/);
});

test("action states use a solid focus token and a restrained pressed state", () => {
  assert.match(tokens, /--action-focus: #ff5a24/);
  assert.match(actionCss, /outline: 2px solid var\(--action-focus\)/);
  assert.match(actionCss, /:active \{[\s\S]*?transform: translateY\(0\)/);
});
