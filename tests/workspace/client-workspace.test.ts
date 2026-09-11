import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const auth = readFileSync("auth.ts", "utf8");
const frame = readFileSync("app/workspace/components/WorkspaceFrame.tsx", "utf8");
const workspaceIndex = readFileSync("app/workspace/page.tsx", "utf8");
const financialIntelligence = readFileSync("app/workspace/financial-intelligence/page.tsx", "utf8");
const incomeStatement = readFileSync("app/workspace/financial-intelligence/income-statement/page.tsx", "utf8");
const incomeStatementWorkspace = readFileSync("app/workspace/components/FinancialIntelligenceWorkspace.tsx", "utf8");
const admin = readFileSync("app/workspace/admin/page.tsx", "utf8");
const agentsIndex = readFileSync("app/workspace/agents/page.tsx", "utf8");
const documentation = readFileSync("app/workspace/documentation/page.tsx", "utf8");
const security = readFileSync("app/workspace/data-security/page.tsx", "utf8");
const account = readFileSync("app/workspace/account/page.tsx", "utf8");
const products = readFileSync("lib/workspace-products.ts", "utf8");
const executionAuth = readFileSync("lib/execution-auth.ts", "utf8");
const workspaceAuth = readFileSync("lib/workspace-auth.ts", "utf8");

test("authenticated customers enter a product-aware operational workspace", () => {
  assert.match(workspaceIndex, /getWorkspaceUser\(\)/);
  assert.match(workspaceIndex, /getWorkspaceProducts\(user\.email\)/);
  assert.match(workspaceIndex, /Controlled finance and risk workflows/);
  assert.match(workspaceIndex, /ENTIMEMA FINANCE PLATFORM/);
  assert.match(workspaceIndex, />Finance</);
  assert.match(workspaceIndex, /Platform administration is not available/);
  assert.match(agentsIndex, /redirect\("\/workspace\/financial-intelligence"\)/);
  assert.match(frame, /href: "\/workspace"/);
});

test("financial intelligence separates product overview from executable workflow", () => {
  assert.match(financialIntelligence, /FINANCE \/ FINANCIAL INTELLIGENCE/);
  assert.match(financialIntelligence, /Financial workflows you can trace, review and defend/);
  assert.match(financialIntelligence, /\/workspace\/financial-intelligence\/income-statement/);
  assert.match(incomeStatement, /requireWorkspaceProduct\("financial-intelligence"\)/);
  assert.match(incomeStatement, /<FinancialIntelligenceWorkspace/);
  assert.match(incomeStatementWorkspace, /Intelligent intake/);
  assert.match(incomeStatementWorkspace, /Deterministic validation/);
  assert.match(incomeStatementWorkspace, /Human review/);
  assert.match(incomeStatementWorkspace, /Traceable output/);
});

test("client navigation exposes customer sections and gates platform administration", () => {
  for (const label of ["Workspace Home", "Financial Intelligence", "Runs", "Documentation", "Data & Security", "Account"]) {
    assert.match(frame, new RegExp(`label: "${label.replace("&", "&")}"`));
  }
  assert.match(frame, /user\?\.role === "platform-owner"/);
  assert.match(frame, /label: "Platform Admin"/);
  assert.doesNotMatch(frame, />Agents</);
  assert.doesNotMatch(frame, />Tests/);
});

test("platform owner and demo customer are separate server-side identities", () => {
  assert.match(auth, /WORKSPACE_PLATFORM_OWNER_EMAILS/);
  assert.match(auth, /WORKSPACE_DEMO_CUSTOMER_EMAILS/);
  assert.match(auth, /if \(isDemoCustomer\(normalizedEmail\)\) return false/);
  assert.match(workspaceAuth, /requirePlatformOwner/);
  assert.match(admin, /await requirePlatformOwner\(\)/);
  assert.match(admin, /Entimema Demo Company/);
});

test("product access is checked at both page and execution boundaries", () => {
  assert.match(products, /WORKSPACE_FINANCIAL_INTELLIGENCE_EMAILS/);
  assert.match(products, /hasWorkspaceProductAccess/);
  assert.match(executionAuth, /hasWorkspaceProductAccess\(email, "financial-intelligence"\)/);
});

test("documentation, security and account remain protected by workspace auth", () => {
  for (const page of [documentation, security, account]) {
    assert.match(page, /getWorkspaceUser\(\)/);
    assert.match(page, /<WorkspaceFrame/);
  }
  assert.match(documentation, /Current V1 scope/);
  assert.match(security, /Decision support, not autonomous approval/);
  assert.match(account, /Security & Privacy/);
});
