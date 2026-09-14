import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workspaceAuth = readFileSync("lib/workspace-auth.ts", "utf8");
const entitlements = readFileSync("lib/workspace-entitlements.ts", "utf8");
const runs = readFileSync("lib/workspace-runs.ts", "utf8");
const runRoute = readFileSync("app/api/financial-intelligence/run/route.ts", "utf8");
const runsPage = readFileSync("app/workspace/runs/page.tsx", "utf8");
const paymentStatus = readFileSync("app/pilot/financial-intelligence/payment-confirmed/PaymentStatus.tsx", "utf8");
const migration = readFileSync("supabase/migrations/20260914093000_workspace_profiles_and_run_history.sql", "utf8");

test("paid Workspace identity is sourced from the active entitlement", () => {
  assert.match(entitlements, /workspace_get_access_profile/);
  assert.match(workspaceAuth, /paidProfile\?\.organization_name/);
  assert.match(workspaceAuth, /paidProfile && !paidProfile\.livemode/);
});

test("Financial Intelligence runs are written and read through tenant-scoped RPCs", () => {
  assert.match(runRoute, /recordWorkspaceRun/);
  assert.match(runs, /workspace_record_run/);
  assert.match(runs, /workspace_list_runs/);
  assert.match(runsPage, /listWorkspaceRuns\(user\.email\)/);
  assert.doesNotMatch(runsPage, /browser session/);
  assert.match(migration, /where customer_email = lower\(btrim\(p_email\)\)/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on public\.workspace_run_records/);
});

test("post-payment screen waits for entitlement provisioning before opening Workspace", () => {
  assert.match(paymentStatus, /api\/checkout\/pilot\/status/);
  assert.match(paymentStatus, /WORKSPACE READY/);
  assert.match(paymentStatus, /same Google work email used at checkout/);
  assert.match(paymentStatus, /ready \? <Link/);
});
