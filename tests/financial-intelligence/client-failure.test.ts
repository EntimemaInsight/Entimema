import assert from "node:assert/strict";
import test from "node:test";
import {
  financialIntelligenceFailureText,
  readFinancialIntelligenceFailure,
  safeExecutionErrorText,
} from "../../app/workspace/components/financial-intelligence-failure";

const workflow = [
  { id: "upload", label: "Upload", state: "completed" as const },
  {
    id: "understanding",
    label: "Understanding financials",
    state: "blocked" as const,
  },
];

test("client preserves bounded failure diagnostics and workflow", () => {
  const failure = readFinancialIntelligenceFailure({
    error_code: "INTERNAL_ERROR",
    failure_code: "FI_UNDERSTANDING_TIMEOUT",
    failure_stage: "financial_understanding",
    run_id: "run-123",
    workflow,
  });
  assert.deepEqual(failure, {
    failureCode: "FI_UNDERSTANDING_TIMEOUT",
    failureStage: "financial_understanding",
    failureStageLabel: "Financial understanding",
    runId: "run-123",
    workflow,
    customerMessage: financialIntelligenceFailureText.FI_UNDERSTANDING_TIMEOUT,
  });
});

test("every production failure code has bounded customer-safe text", () => {
  const expected = [
    "FI_SOURCE_READ_FAILURE",
    "FI_UNDERSTANDING_PROVIDER_FAILURE",
    "FI_UNDERSTANDING_TIMEOUT",
    "FI_UNDERSTANDING_SCHEMA_FAILURE",
    "FI_CONTRACT_BUILD_FAILURE",
    "FI_VALIDATION_FAILURE",
    "FI_PERSISTENCE_FAILURE",
  ];
  for (const failureCode of expected) {
    assert.ok(failureCode in financialIntelligenceFailureText);
  }
  for (const [failureCode, message] of Object.entries(
    financialIntelligenceFailureText,
  )) {
    assert.equal(
      safeExecutionErrorText({
        failure_code: failureCode,
        failure_stage:
          failureCode === "FI_PERSISTENCE_FAILURE"
            ? "persistence"
            : "validation",
        run_id: "safe-run-id",
      }),
      message,
    );
    assert.ok(message.length <= 100);
  }
});

test("provider and backend details can never become rendered failure text", () => {
  const sensitive = "provider payload: sk-secret customer revenue 123";
  const payload = {
    error_code: "INTERNAL_ERROR",
    failure_code: "FI_UNDERSTANDING_PROVIDER_FAILURE",
    failure_stage: "financial_understanding",
    run_id: "run-456",
    message: sensitive,
    stack: sensitive,
    provider_payload: sensitive,
    workflow: [{ id: "understanding", label: sensitive, state: "blocked" }],
  };
  const failure = readFinancialIntelligenceFailure(payload);
  assert.ok(failure);
  assert.equal(failure.customerMessage.includes(sensitive), false);
  assert.equal(JSON.stringify(failure).includes(sensitive), false);
  assert.equal(safeExecutionErrorText(payload).includes(sensitive), false);
});

test("successful execution payloads remain outside failure handling", () => {
  assert.equal(
    readFinancialIntelligenceFailure({
      runId: "persisted-run",
      status: "validated",
      workflow,
    }),
    null,
  );
});
