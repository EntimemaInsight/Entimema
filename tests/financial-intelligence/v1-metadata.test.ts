import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMetadata } from "../../backend/financial-intelligence/v1/metadata";
import { ValidationFailure } from "../../backend/financial-intelligence/v1/diagnostics";
import { executeV1 } from "../../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../../backend/lib/openai";
import { goldModelStatement, goldDocument, assertGold } from "./gold";

test("explicit currency/scale normalization preserves values and unknown scale", () => {
  for (const [currency, scale, expectedCurrency, expectedScale] of [
    ["CHF million", null, "CHF", "millions"],
    ["EUR thousands", "thousand", "EUR", "thousands"],
    ["USD million", "USD millions", "USD", "millions"],
    ["GBP", null, "GBP", null],
    ["GBP", "units", "GBP", "units"],
    [" chf MILLIONS ", "million", "CHF", "millions"],
    ["JPY", "billions", "JPY", "billions"],
    [null, null, null, null],
    [null, "millions", null, "millions"],
  ] as const) {
    const input = { ...goldModelStatement(), currency, scale };
    const before = JSON.stringify(input);
    const output = normalizeMetadata(input);
    assert.equal(output.currency, expectedCurrency);
    assert.equal(output.scale, expectedScale);
    assert.equal(output.lines, input.lines);
    assert.equal(JSON.stringify(input), before);
  }
});

test("ambiguous, unsupported and contradictory metadata fail closed", () => {
  for (const [currency, scale] of [
    ["CHF million", "thousands"],
    ["CHF", "USD millions"],
    ["CHF/EUR", null],
    ["$", null],
    ["ZZZ million", null],
    ["CHF million thousands", null],
    ["CHF", "mn"],
    [null, "CHF millions"],
    ["CHF", "__proto__"],
  ] as const) {
    assert.throws(
      () => normalizeMetadata({ ...goldModelStatement(), currency, scale }),
      (e: unknown) => {
        assert.ok(e instanceof ValidationFailure);
        assert.equal(e.diagnostics.category, "schema_contract");
        assert.ok(["currency", "scale"].includes(e.diagnostics.failedPath));
        return true;
      },
    );
  }
});

test("production core normalizes combined metadata before full verification and KPIs with one request", async () => {
  let calls = 0;
  const result = await executeV1(await goldDocument(), {
    apiKey: "test",
    transport: async () => {
      calls++;
      return {
        status: "completed",
        output_text: JSON.stringify({
          ...goldModelStatement(),
          currency: "EUR thousands",
          scale: null,
        }),
      } as Awaited<ReturnType<OpenAITransport>>;
    },
  });
  assertGold(result);
  assert.equal(calls, 1);
  assert.equal(result.verification.verifiedValues, 18);
});
