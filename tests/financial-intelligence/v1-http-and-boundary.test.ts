import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createFinancialIntelligenceHandler } from "../../backend/api/financial-intelligence/http";
import { AgentError } from "../../backend/lib/errors";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../lib/document-classifier-upload";
import {
  executeV1,
  CoreError,
} from "../../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../../backend/lib/openai";
import { goldDocument, goldModelStatement } from "./gold";
async function form() {
  const data = new FormData();
  const doc = await goldDocument();
  data.set(
    "file",
    new File([new Uint8Array(doc.buffer)], doc.fileName, {
      type: doc.mimeType,
    }),
  );
  return data;
}
const request = (body: FormData) =>
  new Request("http://localhost/api/financial-intelligence/run", {
    method: "POST",
    body,
  });
test("HTTP accepts file only and invokes the shared core once", async () => {
  let calls = 0;
  const handler = createFinancialIntelligenceHandler({
    authorize: async () => ({ actorId: "customer" }),
    rateLimiter: { consume: async () => {} },
    execute: async (doc) => {
      calls++;
      return executeV1(doc, {
        apiKey: "test",
        transport: async () =>
          ({
            status: "completed",
            output_text: JSON.stringify(goldModelStatement()),
          }) as Awaited<ReturnType<OpenAITransport>>,
      });
    },
  });
  const response = await handler(request(await form()));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).verification.verifiedValues, 18);
  assert.equal(calls, 1);
  for (const field of ["selectedSheet", "currency", "period", "mapping"]) {
    const data = await form();
    data.set(field, "human input");
    assert.equal((await handler(request(data))).status, 400);
  }
  const data = await form();
  data.append("file", new File(["duplicate"], "two.csv"));
  assert.equal((await handler(request(data))).status, 400);
  assert.equal(calls, 1);
});
test("authentication and actual stream size are checked before execution", async () => {
  const denied = createFinancialIntelligenceHandler({
    authorize: async () => {
      throw new AgentError("AUTHENTICATION_REQUIRED", 401);
    },
    rateLimiter: {
      consume: async () => {
        throw new Error("must not run");
      },
    },
  });
  assert.equal((await denied(request(await form()))).status, 401);
  const handler = createFinancialIntelligenceHandler({
    authorize: async () => ({ actorId: "a" }),
    rateLimiter: { consume: async () => {} },
    execute: async () => {
      throw new Error("must not execute");
    },
  });
  const oversized = new Request("http://localhost", {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data; boundary=test" },
    body: new Uint8Array(DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES + 1),
  });
  assert.equal((await handler(oversized)).status, 413);
});
test("repository-wide import guard prevents resurrection of retired FI architecture", () => {
  const retired = readFileSync(
    "docs/financial-intelligence/SPRINT_01_DELETION_MANIFEST.md",
    "utf8",
  )
    .split("\n")
    .flatMap((line) => {
      const m = line.match(/^- `([^`]+\.tsx?)`$/);
      return m ? [m[1].replace(/\.tsx?$/, "")] : [];
    });
  const files: string[] = [];
  function scan(dir: string) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (
        ["node_modules", ".git", ".next", "build", ".worktrees"].includes(
          item.name,
        )
      )
        continue;
      const file = path.join(dir, item.name);
      if (item.isDirectory()) scan(file);
      else if (/\.[cm]?[jt]sx?$/.test(file)) files.push(file);
    }
  }
  scan(".");
  for (const file of files) {
    const code = readFileSync(file, "utf8");
    for (const match of code.matchAll(
      /(?:from\s*|import\s*\(|require\s*\()\s*["']([^"']+)["']/g,
    )) {
      const target = match[1].startsWith("@/")
        ? match[1].slice(2)
        : path
            .normalize(path.join(path.dirname(file), match[1]))
            .replace(/\\/g, "/");
      assert.ok(
        !retired.includes(target.replace(/\.tsx?$/, "")),
        `${file} imports retired ${target}`,
      );
    }
  }
  const coreFiles = files.filter((file) =>
    file.replace(/\\/g, "/").startsWith("backend/financial-intelligence/v1/"),
  );
  for (const file of coreFiles)
    assert.doesNotMatch(
      readFileSync(file, "utf8"),
      /selectedSheet|airtable|ontology|financial-intake|canonical|semantic.mapping|report\.ts|finance.domain/i,
    );
  const ui = readFileSync(
    "app/workspace/components/FinancialIntelligenceWorkspace.tsx",
    "utf8",
  );
  assert.equal((ui.match(/body\.set\(/g) || []).length, 1);
  assert.doesNotMatch(ui, /selectedSheet|\/analysis|\/report|\/review/);
  const route = readFileSync(
    "app/api/financial-intelligence/run/route.ts",
    "utf8",
  );
  assert.match(route, /maxDuration = 180/);
  assert.doesNotMatch(route, /persistence/);
});

test("public FI Execute is wired directly to V1 without classifier execution", () => {
  const page = readFileSync(
    "app/workspace/financial-intelligence/page.tsx",
    "utf8",
  );
  const ui = readFileSync(
    "app/workspace/components/FinancialIntelligenceWorkspace.tsx",
    "utf8",
  );
  const route = readFileSync(
    "app/api/financial-intelligence/run/route.ts",
    "utf8",
  );
  const http = readFileSync(
    "backend/api/financial-intelligence/http.ts",
    "utf8",
  );
  assert.match(page, /return <FinancialIntelligenceWorkspace/);
  assert.match(ui, /onClick=\{\(\) => void execute\(\)\}/);
  assert.deepEqual(
    [...ui.matchAll(/fetch\("([^"]+)"/g)].map((m) => m[1]),
    ["/api/financial-intelligence/run"],
  );
  assert.match(
    route,
    /export const POST = createFinancialIntelligenceHandler\(/,
  );
  assert.match(
    http,
    /import \{\s*CoreError,\s*executeV1,\s*HTTP_DEADLINE_MS,?\s*\} from "\.\.\/\.\.\/financial-intelligence\/v1\/core"/,
  );
  assert.match(http, /await \(deps.execute \?\? executeV1\)\(document,/);
  for (const code of [page, ui, route, http]) {
    // Shared upload-limit constants are infrastructure, not classifier execution.
    assert.doesNotMatch(
      code,
      /(?:from|import\s*\(|require\s*\()\s*["'][^"']*(?:agents\/document-classifier|api\/document-classifier|financial-intake|persisted-http|ai-native-run)/,
    );
    assert.doesNotMatch(
      code,
      /\/api\/(?:workspace\/)?(?:agents\/)?document-classifier|classifyDocument|createDocumentClassifierHandler/,
    );
  }
});

test("V1 HTTP errors preserve timeout/status codes without classifier wording", async () => {
  for (const [code, status] of [
    ["OPENAI_TIMEOUT", 504],
    ["OPENAI_RATE_LIMIT", 429],
    ["MODEL_SERVICE_UNAVAILABLE", 503],
    ["OPENAI_RESPONSE_INVALID", 422],
    ["EXECUTION_RATE_LIMIT", 429],
  ] as const) {
    const handler = createFinancialIntelligenceHandler({
      authorize: async () => ({ actorId: "customer" }),
      rateLimiter: {
        consume: async () => {
          if (code === "EXECUTION_RATE_LIMIT")
            throw new AgentError(code, status);
        },
      },
      execute: async () => {
        throw new CoreError(
          new AgentError(code, status),
          {
            mechanicalReadMs: 1,
            aiMs: 7000,
            validationMs: 0,
            verificationMs: 0,
            calculationMs: 0,
            totalMs: 7001,
          },
          1,
        );
      },
    });
    const response = await handler(request(await form()));
    assert.equal(response.status, status);
    const body = await response.json();
    assert.equal(body.error_code, code);
    assert.match(body.message, /financial/i);
    assert.doesNotMatch(body.message, /classif/i);
    if (code === "OPENAI_TIMEOUT")
      assert.equal(body.message, "Financial intelligence execution timed out.");
  }
  // The separate classifier keeps its existing public contract.
  assert.equal(
    new AgentError("OPENAI_TIMEOUT", 504).message,
    "Document classification timed out.",
  );
});
