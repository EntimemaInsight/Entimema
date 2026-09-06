import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const source = (path: string) => readFileSync(resolve(repo, path), "utf8");

const http = source("backend/api/financial-intelligence/http.ts");
const coordinator = source("backend/financial-intelligence/ai-native-run.ts");
const understanding = source("backend/financial-intelligence/financial-understanding-v2.ts");

const legacySemanticModules = [
  "./extraction",
  "./model-mapping",
  "./interpretation/",
  "../financial-intelligence/extraction",
  "../financial-intelligence/model-mapping",
  "../financial-intelligence/interpretation/",
  "../../financial-intelligence/extraction",
  "../../financial-intelligence/model-mapping",
  "../../financial-intelligence/interpretation/",
];

test("V1 customer execution routes only through the AI-native coordinator", () => {
  assert.match(http, /runAiNativeFinancialIntelligence\(document\)/);
  assert.doesNotMatch(http, /runFinancialIntelligence\(document/);
  for (const legacy of legacySemanticModules) assert.equal(http.includes(legacy), false, legacy);
});

test("V1 Data Preparation accepts upload only", () => {
  assert.match(http, /key !== "file"/);
  assert.match(http, /form\.getAll\("file"\)\.length !== 1/);
  assert.equal(http.includes("selectedSheet"), false);
});

test("AI-native coordinator has no legacy semantic-preparation dependency", () => {
  for (const legacy of legacySemanticModules) assert.equal(coordinator.includes(legacy), false, legacy);
  const sourceRead = coordinator.indexOf("buildFinancialSourceRepresentation(document)");
  const ai = coordinator.indexOf("understandFinancials(structure)");
  const hydrate = coordinator.indexOf("hydrateUnderstanding(document, structure, understanding.result)");
  const validate = coordinator.indexOf("validate(extracted.values, evidence, extracted.scale)");
  assert.ok(sourceRead >= 0 && ai > sourceRead && hydrate > ai && validate > hydrate);
});

test("Financial Understanding cannot silently fall back to legacy label mapping", () => {
  assert.equal(understanding.includes("mapLabel"), false);
  assert.equal(understanding.includes("localFallback"), false);
  assert.match(understanding, /FINANCIAL_UNDERSTANDING_CONTRACT_VERSION = "financial-understanding\.v2"/);
  assert.match(understanding, /UNVERIFIED_SOURCE_LINEAGE/);
  assert.match(understanding, /UNVERIFIED_NUMERIC_LINEAGE/);
});
