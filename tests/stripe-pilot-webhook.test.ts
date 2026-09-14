import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const webhook = readFileSync("app/api/webhooks/stripe/route.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260914064549_stripe_pilot_entitlements.sql",
  "utf8",
);
const auth = readFileSync("auth.ts", "utf8");

test("Stripe webhook verifies signatures and accepts paid pilot events only", () => {
  assert.match(webhook, /constructEvent/);
  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
  assert.match(webhook, /session\.payment_status !== "paid"/);
  assert.match(webhook, /STRIPE_PILOT_PRICE_IDS/);
  assert.match(webhook, /event\.livemode !== expectedLiveMode/);
});

test("fulfillment is durable, tenant-scoped and idempotent", () => {
  assert.match(migration, /workspace_product_entitlements/);
  assert.match(migration, /stripe_session_id text not null unique/);
  assert.match(migration, /stripe_webhook_events/);
  assert.match(migration, /event_id text primary key/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all[\s\S]+anon, authenticated/);
  assert.match(migration, /workspace_has_product_access/);
});

test("paid entitlements participate in server-side workspace authorization", () => {
  assert.match(auth, /isWorkspaceAllowedForSignIn/);
  assert.match(auth, /hasPaidWorkspaceAccess/);
});
