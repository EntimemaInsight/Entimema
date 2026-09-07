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
          currency: "KEUR",
          scale: null,
        }),
      } as Awaited<ReturnType<OpenAITransport>>;
    },
  });
  assertGold(result);
  assert.equal(calls, 1);
  assert.equal(result.verification.verifiedValues, 18);
});

test("bounded magnitude tokens and textual equivalents preserve source bindings", () => {
  for (const [token, currency, scale] of [
    ["MSEK", "SEK", "millions"],
    ["MEUR", "EUR", "millions"],
    ["MUSD", "USD", "millions"],
    ["MGBP", "GBP", "millions"],
    ["KSEK", "SEK", "thousands"],
    ["KEUR", "EUR", "thousands"],
    ["KUSD", "USD", "thousands"],
    ["KGBP", "GBP", "thousands"],
    ...["million", "millions", "m", "mn"].map((marker) => [
      "SEK " + marker,
      "SEK",
      "millions",
    ]),
    ...["thousand", "thousands", "k"].map((marker) => [
      "SEK " + marker,
      "SEK",
      "thousands",
    ]),
  ]) {
    for (const suppliedScale of [null, scale]) {
      const input = {
        ...goldModelStatement(),
        currency: token,
        scale: suppliedScale,
      };
      const result = normalizeMetadata(input);
      assert.equal(result.currency, currency);
      assert.equal(result.scale, scale);
      assert.equal(result.lines, input.lines);
    }
  }
  for (const token of ["MMSEK", "BSEK", "MZZZ", "M-SEK", "MSEK extra"]) {
    assert.throws(
      () => normalizeMetadata({ ...goldModelStatement(), currency: token }),
      ValidationFailure,
    );
  }
  assert.throws(
    () =>
      normalizeMetadata({
        ...goldModelStatement(),
        currency: "MSEK",
        scale: "thousands",
      }),
    (error: unknown) =>
      error instanceof ValidationFailure &&
      error.diagnostics.validationFailureCode === "METADATA_SCALE_CONFLICT",
  );
});

test("separate conflicting source currency rejects combined metadata", () => {
  const source = (
    text: string,
  ): import("../../backend/financial-intelligence/v1/reader").Source => ({
    text,
    format: "spreadsheet",
    cells: new Map([
      [
        "A1",
        {
          ref: "A1",
          sheet: "Statement",
          row: 1,
          column: 1,
          raw: text,
          displayed: text,
          numeric: null,
        },
      ],
    ]),
  });
  for (const evidence of ["GBP", "Amounts in GBP millions", "MGBP", "£"]) {
    assert.throws(
      () =>
        normalizeMetadata(
          { ...goldModelStatement(), currency: "MEUR", scale: null },
          source(evidence),
        ),
      (error: unknown) =>
        error instanceof ValidationFailure &&
        error.diagnostics.failedPath === "currency",
    );
  }
  assert.equal(
    normalizeMetadata(
      { ...goldModelStatement(), currency: "MSEK", scale: null },
      source("Net sales (MSEK)"),
    ).currency,
    "SEK",
  );
});
