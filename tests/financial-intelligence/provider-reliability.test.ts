import assert from "node:assert/strict";
import test from "node:test";
import OpenAI from "openai";
import { interpretWholeStatement } from "../../backend/financial-intelligence/interpretation/whole-statement";
import {
  createConfiguredResponse,
  type OpenAIRequestDiagnostics,
} from "../../backend/lib/openai";
import type {
  CanonicalValue,
  SourceRow,
} from "../../backend/financial-intelligence/schema";

const responseBody = {
  model: "gpt-test",
  input: "bounded",
  max_output_tokens: 20,
} as never;
const diagnostics = (): OpenAIRequestDiagnostics => ({
  attemptCount: 0,
  attemptDurationsMs: [],
  providerStatusClass: null,
  providerErrorCode: null,
  timeoutTriggered: false,
});

test("shared transport retries a transient 5xx once and reports the successful bounded attempt", async () => {
  const observed = diagnostics();
  let calls = 0;
  const result = await createConfiguredResponse(
    responseBody,
    {
      apiKey: "not-a-secret",
      timeoutMs: 100,
      attempts: 2,
      diagnostics: observed,
    },
    async () => {
      calls++;
      if (calls === 1)
        throw { status: 503, body: "raw-sensitive-provider-body" };
      return { status: "completed", output_text: "{}" } as never;
    },
  );
  assert.equal(result.status, "completed");
  assert.equal(calls, 2);
  assert.equal(observed.attemptCount, 2);
  assert.equal(observed.attemptDurationsMs.length, 2);
  assert.doesNotMatch(
    JSON.stringify(observed),
    /not-a-secret|raw-sensitive-provider-body|bounded/,
  );
});

test("shared transport exhausts its attempt budget safely on provider 5xx", async () => {
  const observed = diagnostics();
  let calls = 0;
  await assert.rejects(
    createConfiguredResponse(
      responseBody,
      { apiKey: "secret", timeoutMs: 100, attempts: 2, diagnostics: observed },
      async () => {
        calls++;
        throw { status: 502, body: "private" };
      },
    ),
    { code: "MODEL_SERVICE_UNAVAILABLE" },
  );
  assert.equal(calls, 2);
  assert.equal(observed.providerErrorCode, "provider_5xx");
  assert.equal(observed.providerStatusClass, "5xx");
});

const withResolver = async <T>(timeoutMs: string, run: () => Promise<T>) => {
  const names = [
    "FINANCIAL_SEMANTIC_RESOLVER_ENABLED",
    "OPENAI_API_KEY",
    "FINANCIAL_SEMANTIC_MODEL",
    "FINANCIAL_SEMANTIC_TIMEOUT_MS",
    "FINANCIAL_SEMANTIC_MAX_ATTEMPTS",
  ] as const;
  const before = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  Object.assign(process.env, {
    FINANCIAL_SEMANTIC_RESOLVER_ENABLED: "true",
    OPENAI_API_KEY: "test-secret",
    FINANCIAL_SEMANTIC_MODEL: "gpt-test",
    FINANCIAL_SEMANTIC_TIMEOUT_MS: timeoutMs,
    FINANCIAL_SEMANTIC_MAX_ATTEMPTS: "2",
  });
  try {
    return await run();
  } finally {
    for (const name of names)
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
  }
};
const rows: SourceRow[] = [
  {
    rowNumber: 1,
    label: "Unmapped result",
    normalizedLabel: "unmapped result",
    role: "financial_line",
  },
];
const values: CanonicalValue[] = [
  {
    id: "v",
    sourceRowId: "row-1",
    sourceLabel: "Unmapped result",
    normalizedLabel: "unmapped result",
    concept: "other_reported_line",
    lineType: "component",
    originalValue: 1,
    normalizedValue: 1,
    sourceSign: "positive",
    canonicalSign: "positive",
    normalizationRule: "none",
    periodId: "p",
    currency: null,
    unitScale: null,
    mappingMethod: "deterministic",
    mappingConfidence: 0.1,
    mappingExplanation: "",
    reviewState: "required",
    evidenceId: "e",
  },
];
const validResponse = () =>
  ({
    status: "completed",
    output_text: JSON.stringify({
      title: null,
      currency: null,
      scale: null,
      rows: [
        {
          rowNumber: 1,
          section: "p_and_l",
          role: "financial_line",
          concept: "net_income",
          confidence: 0.95,
          supportingEvidence: ["statement context"],
          contradictions: [],
        },
      ],
    }),
  }) as never;

test("provider abort is classified as timeout with MODEL_FAILURE-safe unresolved values", () =>
  withResolver("15", async () => {
    const result = await interpretWholeStatement(
      { rows, values, periods: [], currency: null, scale: null, title: null },
      async (_body, signal) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener(
            "abort",
            () => reject(new OpenAI.APIUserAbortError()),
            { once: true },
          ),
        ),
    );
    assert.equal(result.telemetry.outcome, "timeout");
    assert.equal(result.telemetry.timeoutTriggered, true);
    assert.equal(result.telemetry.providerErrorCode, "timeout");
    assert.equal(result.values[0].concept, "other_reported_line");
    assert.equal(result.values[0].reviewState, "required");
    assert.equal(result.resolverFailure, "timeout");
  }));

test("a >30-second-equivalent delayed response within a 45-second-equivalent budget succeeds", () =>
  withResolver("45", async () => {
    const result = await interpretWholeStatement(
      { rows, values, periods: [], currency: null, scale: null, title: null },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 35));
        return validResponse();
      },
    );
    assert.equal(result.telemetry.outcome, "success");
    assert.ok(result.telemetry.classificationsReturned > 0);
    assert.ok(result.telemetry.proposedMappings > 0);
    assert.equal(result.telemetry.attemptCount, 1);
    assert.deepEqual(
      Object.keys(result.telemetry).some((key) =>
        /apiKey|prompt|sourceLabel|raw/i.test(key),
      ),
      false,
    );
  }));

test("a retry receives only the remainder of the single total budget", async () => {
  const observed = diagnostics();
  let calls = 0;
  const started = performance.now();
  await assert.rejects(
    createConfiguredResponse(
      responseBody,
      { apiKey: "secret", timeoutMs: 30, attempts: 2, diagnostics: observed },
      async (_body, signal) => {
        calls++;
        if (calls === 1) {
          await new Promise((resolve) => setTimeout(resolve, 20));
          throw { status: 503 };
        }
        return new Promise((_resolve, reject) =>
          signal.addEventListener(
            "abort",
            () => reject(new OpenAI.APIUserAbortError()),
            { once: true },
          ),
        );
      },
    ),
    { code: "OPENAI_TIMEOUT" },
  );
  assert.equal(calls, 2);
  assert.equal(observed.timeoutTriggered, true);
  assert.ok(performance.now() - started < 100);
});

test("provider 5xx exhaustion records a bounded safe reason without false mappings", () =>
  withResolver("100", async () => {
    const result = await interpretWholeStatement(
      { rows, values, periods: [], currency: null, scale: null, title: null },
      async () => {
        throw { status: 503, body: "raw-sensitive-provider-body" };
      },
    );
    assert.equal(result.telemetry.outcome, "provider_error");
    assert.equal(result.telemetry.providerErrorCode, "provider_5xx");
    assert.equal(result.telemetry.providerStatusClass, "5xx");
    assert.equal(result.telemetry.attemptCount, 2);
    assert.equal(result.values[0].concept, "other_reported_line");
    assert.doesNotMatch(
      JSON.stringify(result.telemetry),
      /raw-sensitive-provider-body|test-secret/,
    );
  }));
