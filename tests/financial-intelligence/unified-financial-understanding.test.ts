import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import type { InspectedDocument } from "../../backend/lib/files";
import {
  FINANCIAL_UNDERSTANDING_TIMEOUT_MS,
  getFinancialUnderstandingRequestConfig,
  hydrateUnderstanding,
  parseFinancialUnderstandingResult,
  understandFinancials,
  type FinancialUnderstandingModelResult,
} from "../../backend/financial-intelligence/financial-understanding";
import {
  buildWorkbookStructuralRepresentation,
  compactWorkbookStructure,
} from "../../backend/financial-intelligence/structural-representation";

const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

function workbook(rows: unknown[][], name = "Data"): InspectedDocument {
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  XLSX.utils.book_append_sheet(book, sheet, name);
  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" });
  return {
    fileName: "sanitized.xlsx",
    extension: ".xlsx",
    mimeType: "application/octet-stream",
    size: buffer.length,
    buffer,
  };
}

const modelResult = (): FinancialUnderstandingModelResult => ({
  documentType: "financial_statement",
  statementType: "income_statement",
  entityName: "Example Ltd",
  currency: "USD",
  scale: 1000,
  periods: [
    {
      id: "p25",
      label: "2025",
      sourceSheet: "Data",
      sourceCellRef: "C2",
      designation: "actual",
      type: "year",
    },
  ],
  financialLines: [
    {
      sourceId: "Data:3",
      sourceSheet: "Data",
      sourceRow: 3,
      sourceLabelCellRef: "B3",
      sourceLabel: "Revenue",
      sourceValueRefs: [{ periodId: "p25", cellRef: "C3" }],
      sourceSection: "p_and_l",
      sourceLineType: "component",
      canonicalConceptCandidate: "revenue",
      confidence: 0.98,
      evidence: ["Reported revenue line"],
    },
  ],
  excludedContent: [],
  ambiguities: [],
});

test("Financial Understanding uses one attempt and enforces the seven-second product budget", () => {
  const previous = process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS;
  try {
    delete process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS;
    assert.equal(FINANCIAL_UNDERSTANDING_TIMEOUT_MS, 7_000);
    assert.deepEqual(getFinancialUnderstandingRequestConfig("test-key"), {
      apiKey: "test-key",
      timeoutMs: 7_000,
      attempts: 1,
    });

    process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS = "90000";
    assert.equal(getFinancialUnderstandingRequestConfig("test-key").timeoutMs, 7_000);
    process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS = "not-a-duration";
    assert.equal(getFinancialUnderstandingRequestConfig("test-key").timeoutMs, 7_000);
  } finally {
    restoreEnv("FINANCIAL_UNDERSTANDING_TIMEOUT_MS", previous);
  }
});

test("a delayed valid response inside the configured budget completes", async () => {
  const previous = {
    enabled: process.env.FINANCIAL_UNDERSTANDING_ENABLED,
    key: process.env.OPENAI_API_KEY,
    model: process.env.FINANCIAL_UNDERSTANDING_MODEL,
    timeout: process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS,
  };
  process.env.FINANCIAL_UNDERSTANDING_ENABLED = "true";
  process.env.OPENAI_API_KEY = "test-key";
  process.env.FINANCIAL_UNDERSTANDING_MODEL = "gpt-test";
  process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS = "100";
  try {
    const structure = buildWorkbookStructuralRepresentation(
      workbook([["Example Ltd"], [null, "Period", "2025"], [null, "Revenue", 120]]),
    );
    const result = await understandFinancials(structure, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return { status: "completed", output_text: JSON.stringify(modelResult()) } as never;
    });
    assert.equal(result.modelCalls, 1);
  } finally {
    restoreEnv("FINANCIAL_UNDERSTANDING_ENABLED", previous.enabled);
    restoreEnv("OPENAI_API_KEY", previous.key);
    restoreEnv("FINANCIAL_UNDERSTANDING_MODEL", previous.model);
    restoreEnv("FINANCIAL_UNDERSTANDING_TIMEOUT_MS", previous.timeout);
  }
});

test("execution beyond the configured budget aborts once with OPENAI_TIMEOUT", async () => {
  const previous = {
    enabled: process.env.FINANCIAL_UNDERSTANDING_ENABLED,
    key: process.env.OPENAI_API_KEY,
    model: process.env.FINANCIAL_UNDERSTANDING_MODEL,
    timeout: process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS,
  };
  process.env.FINANCIAL_UNDERSTANDING_ENABLED = "true";
  process.env.OPENAI_API_KEY = "test-key";
  process.env.FINANCIAL_UNDERSTANDING_MODEL = "gpt-test";
  process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS = "10";
  let calls = 0;
  try {
    const structure = buildWorkbookStructuralRepresentation(
      workbook([["Example Ltd"], [null, "Period", "2025"], [null, "Revenue", 120]]),
    );
    await assert.rejects(
      understandFinancials(structure, async (_body, signal) => {
        calls += 1;
        await new Promise<void>((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
        });
        throw new Error("unreachable");
      }),
      (error: unknown) => Boolean(error && typeof error === "object" && "code" in error && error.code === "OPENAI_TIMEOUT"),
    );
    assert.equal(calls, 1);
  } finally {
    restoreEnv("FINANCIAL_UNDERSTANDING_ENABLED", previous.enabled);
    restoreEnv("OPENAI_API_KEY", previous.key);
    restoreEnv("FINANCIAL_UNDERSTANDING_MODEL", previous.model);
    restoreEnv("FINANCIAL_UNDERSTANDING_TIMEOUT_MS", previous.timeout);
  }
});

test("compact structural representation retains coordinates and values without redundant workbook metadata", () => {
  const source = workbook([["Example Ltd"], [null, "Period", "2025"], [null, "Revenue", { f: "100+20", v: 120 }]]);
  const structure = buildWorkbookStructuralRepresentation(source);
  const payload = compactWorkbookStructure(structure);
  assert.equal(structure.sheets[0].cells.find((cell) => cell.ref === "C3")?.formula, "100+20");
  assert.deepEqual(structure.sheets[0].merges, ["A1:B1"]);
  assert.ok(payload.length < source.buffer.length * 2);
  assert.equal(payload.includes("100+20"), false);
  assert.equal(payload.includes("usedRange"), false);
  assert.equal(payload.includes("merges"), false);
  assert.equal(payload.includes("cellStyles"), false);
  assert.equal(payload.includes(source.buffer.toString("base64").slice(0, 20)), false);
});

test("strict contract accepts allowlisted cell references and rejects duplicate rows or invented concepts", () => {
  assert.deepEqual(parseFinancialUnderstandingResult(modelResult()), modelResult());
  const duplicate = {
    ...modelResult(),
    financialLines: [modelResult().financialLines[0], modelResult().financialLines[0]],
  };
  assert.throws(() => parseFinancialUnderstandingResult(duplicate), /INVALID_FINANCIAL_UNDERSTANDING_OUTPUT/);
  assert.throws(
    () =>
      parseFinancialUnderstandingResult({
        ...modelResult(),
        financialLines: [{ ...modelResult().financialLines[0], canonicalConceptCandidate: "invented" }],
      }),
    /INVALID_FINANCIAL_UNDERSTANDING_OUTPUT/,
  );
});

test("production understanding invokes one model request with a strict source-reference schema", async () => {
  const previous = {
    enabled: process.env.FINANCIAL_UNDERSTANDING_ENABLED,
    key: process.env.OPENAI_API_KEY,
    model: process.env.FINANCIAL_UNDERSTANDING_MODEL,
  };
  process.env.FINANCIAL_UNDERSTANDING_ENABLED = "true";
  process.env.OPENAI_API_KEY = "test-key";
  process.env.FINANCIAL_UNDERSTANDING_MODEL = "gpt-test";
  let calls = 0;
  try {
    const structure = buildWorkbookStructuralRepresentation(
      workbook([["Example Ltd"], [null, "Period", "2025"], [null, "Revenue", 120]]),
    );
    const result = await understandFinancials(structure, async (body) => {
      calls += 1;
      const format = (body.text?.format ?? {}) as Record<string, unknown>;
      const serialized = JSON.stringify(format);
      assert.equal(serialized.includes('"additionalProperties":{"type":"string"}'), false);
      assert.match(serialized, /sourceValueRefs/);
      return {
        status: "completed",
        output_text: JSON.stringify(modelResult()),
        usage: { output_tokens: 123 },
      } as never;
    });
    assert.equal(calls, 1);
    assert.equal(result.modelCalls, 1);
    assert.equal(result.outputTokens, 123);
    assert.ok(result.requestPayloadChars > 0);
  } finally {
    const vars = [
      ["FINANCIAL_UNDERSTANDING_ENABLED", previous.enabled],
      ["OPENAI_API_KEY", previous.key],
      ["FINANCIAL_UNDERSTANDING_MODEL", previous.model],
    ] as const;
    for (const [key, value] of vars) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("hydration derives every number from deterministic source cells and rejects invented value references", () => {
  const source = workbook([["Example Ltd"], [null, "Period", "2025"], [null, "Revenue", 120]]);
  const structure = buildWorkbookStructuralRepresentation(source);
  const hydrated = hydrateUnderstanding(source, structure, modelResult());
  assert.equal(hydrated.values[0].originalValue, 120);
  assert.equal(hydrated.evidence[0].cellAddress, "C3");
  assert.equal(hydrated.evidence[0].extractionMethod, "deterministic-source-reference");
  const invented = modelResult();
  invented.financialLines[0].sourceValueRefs[0].cellRef = "Z99";
  assert.throws(() => hydrateUnderstanding(source, structure, invented), /UNVERIFIED_NUMERIC_LINEAGE/);
});
