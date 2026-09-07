import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createFinancialIntelligenceHandler } from "../../backend/api/financial-intelligence/http";
import { AgentError } from "../../backend/lib/errors";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../lib/document-classifier-upload";
import { executeV1 } from "../../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../../backend/lib/openai";
import { goldDocument, goldStatement } from "./gold";
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
            output_text: JSON.stringify(goldStatement()),
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
  assert.match(route, /maxDuration = 10/);
  assert.doesNotMatch(route, /persistence/);
});
