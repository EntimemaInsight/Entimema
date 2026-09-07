import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  executeV1,
  CoreError,
  AI_TIMEOUT_MS,
  HTTP_DEADLINE_MS,
  COMPLETION_RESERVE_MS,
  type ExecutionTelemetry,
} from "../../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../../backend/lib/openai";
import { goldDocument, goldModelStatement, assertGold } from "./gold";
const response = () =>
  ({
    status: "completed",
    output_text: JSON.stringify(goldModelStatement()),
  }) as Awaited<ReturnType<OpenAITransport>>;

test("provider can complete after the former ten-second gate with one call and unchanged verified output", async () => {
  let calls = 0;
  let telemetry: ExecutionTelemetry | undefined;
  const result = await executeV1(await goldDocument(), {
    apiKey: "test",
    onTelemetry: (t) => (telemetry = t),
    transport: async (_body, signal) => {
      calls++;
      await new Promise((resolve) => setTimeout(resolve, 10_150));
      assert.equal(signal.aborted, false);
      return response();
    },
  });
  assertGold(result);
  assert.equal(calls, 1);
  assert.ok(result.timings.aiMs >= 10000);
  assert.ok(result.timings.totalMs < HTTP_DEADLINE_MS);
  assert.equal(telemetry?.timeoutBoundary, null);
  assert.equal(telemetry?.providerStatusClass, "2xx");
});

test("provider budget aborts once and fails safely without background request or retry", async (t) => {
  const realTimeout = globalThis.setTimeout;
  const scheduled: number[] = [];
  t.mock.method(
    globalThis,
    "setTimeout",
    (fn: (...args: unknown[]) => void, ms: number, ...args: unknown[]) => {
      scheduled.push(ms);
      return realTimeout(fn, Math.min(ms, 30), ...args);
    },
  );
  let calls = 0,
    aborted = 0,
    active = false;
  await assert.rejects(
    executeV1(await goldDocument(), {
      apiKey: "test",
      transport: async (_body, signal) => {
        calls++;
        active = true;
        return new Promise((_resolve, reject) =>
          signal.addEventListener(
            "abort",
            () => {
              aborted++;
              active = false;
              reject(new DOMException("Aborted", "AbortError"));
            },
            { once: true },
          ),
        );
      },
    }),
    (error: unknown) => {
      assert.ok(error instanceof CoreError);
      assert.equal(error.error.code, "OPENAI_TIMEOUT");
      assert.equal(error.aiCalls, 1);
      assert.equal(error.telemetry?.timeoutBoundary, "provider");
      assert.equal(error.telemetry?.providerHttpStatus, null);
      assert.ok(scheduled.some((ms) => ms > 119000 && ms <= 120000));

      return true;
    },
  );
  assert.equal(calls, 1);
  assert.equal(aborted, 1);
  assert.equal(active, false);
});

test("HTTP deadline caps provider time and expired requests never start AI", async () => {
  assert.equal(AI_TIMEOUT_MS, 120000);
  assert.equal(HTTP_DEADLINE_MS, 175000);
  assert.ok(COMPLETION_RESERVE_MS > 0);
  const route = readFileSync(
    "app/api/financial-intelligence/run/route.ts",
    "utf8",
  );
  assert.match(route, /maxDuration = 180/);
  const http = readFileSync(
    "backend/api/financial-intelligence/http.ts",
    "utf8",
  );
  assert.match(http, /deadlineMs = httpStarted \+ HTTP_DEADLINE_MS/);
  assert.match(http, /\(document, \{\s*deadlineMs,/);
  let calls = 0;
  const doc = await goldDocument();
  await assert.rejects(
    executeV1(doc, {
      apiKey: "test",
      deadlineMs: performance.now() - 1,
      transport: async () => {
        calls++;
        return response();
      },
    }),
    (e: unknown) => {
      assert.ok(e instanceof CoreError);
      assert.equal(e.error.code, "PROCESSING_TIMEOUT");
      assert.equal(e.telemetry?.timeoutBoundary, "http_deadline");
      return true;
    },
  );
  assert.equal(calls, 0);
  await assert.rejects(
    executeV1(doc, {
      apiKey: "test",
      deadlineMs: performance.now() + COMPLETION_RESERVE_MS + 200,
      transport: async (_body, signal) => {
        calls++;
        return new Promise((_resolve, reject) =>
          signal.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          ),
        );
      },
    }),
    (e: unknown) => {
      assert.ok(e instanceof CoreError);
      assert.equal(e.error.code, "OPENAI_TIMEOUT");
      assert.equal(e.telemetry?.timeoutBoundary, "http_deadline");
      assert.ok(e.timings.totalMs < 500);
      return true;
    },
  );
  assert.equal(calls, 1);
});
