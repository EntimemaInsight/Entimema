import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const frame = readFileSync("app/workspace/components/WorkspaceFrame.tsx", "utf8");
const workspaceIndex = readFileSync("app/workspace/page.tsx", "utf8");
const agentsIndex = readFileSync("app/workspace/agents/page.tsx", "utf8");
const documentation = readFileSync("app/workspace/documentation/page.tsx", "utf8");
const security = readFileSync("app/workspace/data-security/page.tsx", "utf8");
const account = readFileSync("app/workspace/account/page.tsx", "utf8");

test("authenticated customers enter Financial Intelligence", () => {
  assert.match(workspaceIndex, /redirect\("\/workspace\/financial-intelligence"\)/);
  assert.match(agentsIndex, /redirect\("\/workspace\/financial-intelligence"\)/);
  assert.match(frame, /href: "\/workspace\/financial-intelligence"/);
});

test("client navigation exposes product-facing workspace sections", () => {
  for (const label of ["Financial Intelligence", "Runs", "Documentation", "Data & Security", "Account"]) {
    assert.match(frame, new RegExp(`label: "${label.replace("&", "&")}"`));
  }
  assert.doesNotMatch(frame, />Agents</);
  assert.doesNotMatch(frame, />Tests/);
});

test("documentation, security and account remain protected by workspace auth", () => {
  for (const page of [documentation, security, account]) {
    assert.match(page, /getWorkspaceUser\(\)/);
    assert.match(page, /<WorkspaceFrame/);
  }
  assert.match(documentation, /What V1 supports/);
  assert.match(security, /Decision support, not autonomous approval/);
  assert.match(account, /Security & Privacy/);
});
