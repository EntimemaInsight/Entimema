import assert from "node:assert/strict";
import test from "node:test";
import { createReviewQueueHandler } from "../../backend/api/financial-intelligence/persisted-http";
import { SupabaseFinancialRunRepository } from "../../backend/financial-intelligence/persistence/supabase";
import { FinancialRunService } from "../../backend/financial-intelligence/persistence/service";

const databaseRow = {
  run_id: "018f83c3-9f65-7b31-8dad-3c3f4eae1026",
  status: "review_required",
  revision: 4,
  created_at: "2026-09-04T09:10:11.000Z",
  updated_at: "2026-09-05T12:13:14.000Z",
  contract: {
    source: { filename: "review-required.xlsx", selectedSection: "Income Statement" },
    metrics: { periods: 2, financialSourceRows: 17, reviewTasks: 99 },
    reviewTasks: [
      { id: "open-one", state: "open" },
      { id: "resolved", state: "resolved" },
      { id: "open-two", state: "open" },
    ],
  },
};

function mockSupabase(rows: unknown[]) {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const originalFetch = globalThis.fetch;
  process.env.FINANCIAL_DATABASE_REST_URL = "https://database.test";
  process.env.FINANCIAL_DATABASE_SERVICE_KEY = "test-service-key";
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return Response.json(rows);
  };
  return { requests, restore: () => { globalThis.fetch = originalFetch; } };
}

const expectedItem = {
  runId: databaseRow.run_id,
  filename: "review-required.xlsx",
  selectedStatement: "Income Statement",
  status: "review_required",
  periods: 2,
  financialRows: 17,
  openTasks: 2,
  createdAt: "2026-09-04T09:10:11.000Z",
  updatedAt: "2026-09-05T12:13:14.000Z",
  revision: 4,
};

test("Supabase repository serializes an owned runs list from persisted rows", async () => {
  const mock = mockSupabase([databaseRow]);
  try {
    const result = await new SupabaseFinancialRunRepository().list("owner@example.com");
    assert.deepEqual(result, [expectedItem]);
    assert.match(mock.requests[0].url, /financial_runs\?owner_id=eq\.owner%40example\.com/);
  } finally { mock.restore(); }
});

test("Supabase repository serializes specialist review queue rows and the API returns them", async () => {
  const mock = mockSupabase([databaseRow]);
  try {
    const repository = new SupabaseFinancialRunRepository();
    const handler = createReviewQueueHandler({
      authorize: async () => ({ actorId: "operator-1" }),
      service: new FinancialRunService(repository),
    });
    const response = await handler();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [expectedItem]);
    assert.equal(mock.requests[0].url, "https://database.test/rest/v1/rpc/fi_operator_review_runs");
    assert.equal(mock.requests[0].init?.body, JSON.stringify({ p_actor_id: "operator-1" }));
  } finally { mock.restore(); }
});

test("Supabase repository returns an empty list without recursive failure", async () => {
  const mock = mockSupabase([]);
  try {
    assert.deepEqual(await new SupabaseFinancialRunRepository().list("owner"), []);
    assert.deepEqual(await new SupabaseFinancialRunRepository().listForReview("operator"), []);
  } finally { mock.restore(); }
});
