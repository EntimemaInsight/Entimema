import assert from "node:assert/strict";
import test from "node:test";
import {
  getV1ModelConfig,
  MODEL,
} from "../../backend/financial-intelligence/v1/model";

test("model configuration uses accepted nano default and explicitly disables reasoning for GPT-5.6 candidates", () => {
  const original = process.env.FI_V1_MODEL;
  try {
    delete process.env.FI_V1_MODEL;
    assert.equal(getV1ModelConfig().model, MODEL);
    assert.equal(MODEL, "gpt-4.1-nano-2025-04-14");
    for (const model of ["gpt-5.6-luna", "gpt-5.6-terra"]) {
      process.env.FI_V1_MODEL = model;
      assert.deepEqual(getV1ModelConfig(), {
        model,
        temperature: 0,
        reasoning: { effort: "none" },
      });
    }
    process.env.FI_V1_MODEL = "gpt-4.1-nano";
    assert.deepEqual(getV1ModelConfig(), {
      model: "gpt-4.1-nano",
      temperature: 0,
    });
    process.env.FI_V1_MODEL = "invalid model";
    assert.throws(getV1ModelConfig);
  } finally {
    if (original === undefined) delete process.env.FI_V1_MODEL;
    else process.env.FI_V1_MODEL = original;
  }
});
