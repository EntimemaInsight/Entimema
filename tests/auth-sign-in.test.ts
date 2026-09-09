import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const authConfig = readFileSync("auth.ts", "utf8");
const signInPage = readFileSync("app/auth/sign-in/page.tsx", "utf8");
const signInCss = readFileSync("app/auth/sign-in/sign-in.module.css", "utf8");
const analyticsConsent = readFileSync("components/AnalyticsConsent.tsx", "utf8");
const globalFooter = readFileSync("components/GlobalFooter.tsx", "utf8");
const envExample = readFileSync(".env.example", "utf8");

test("GitHub OAuth is real, scoped and configuration-gated", () => {
  assert.match(authConfig, /next-auth\/providers\/github/);
  assert.match(authConfig, /AUTH_GITHUB_ID && process\.env\.AUTH_GITHUB_SECRET/);
  assert.match(authConfig, /scope: "read:user user:email"/);
  assert.match(signInPage, /isGitHubAuthEnabled && <form/);
  assert.match(signInPage, /signIn\("github"/);
  assert.match(envExample, /AUTH_GITHUB_ID=/);
  assert.match(envExample, /AUTH_GITHUB_SECRET=/);
});

test("sign-in is a responsive Entimema authentication experience", () => {
  assert.match(signInPage, /Turn financial evidence into decisions/);
  assert.match(signInPage, /<BrandLogo \/>/);
  assert.match(signInPage, /Continue with Google/);
  assert.match(signInCss, /grid-template-columns: minmax\(0, \.92fr\) minmax\(560px, 1\.08fr\)/);
  assert.match(signInCss, /radial-gradient/);
  assert.match(signInCss, /color: var\(--auth-orange\)/);
  assert.match(signInCss, /#dcff43/);
  assert.match(signInCss, /@media \(max-width: 960px\)/);
  assert.match(signInCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test("auth route removes secondary chrome and analytics controls", () => {
  assert.doesNotMatch(signInPage, /ENTIMEMA FINANCIAL INTELLIGENCE|Private beta|Controlled workflows|className=\{styles\.footer\}/);
  assert.match(analyticsConsent, /pathname !== "\/auth\/sign-in"/);
  assert.match(globalFooter, /pathname === "\/auth\/sign-in"/);
});
