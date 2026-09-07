import { AgentError } from "../../lib/errors";

// Keep the existing default until a candidate passes the live benchmark.
export const MODEL = "gpt-4.1-nano-2025-04-14";
export function getV1ModelConfig() {
  const model = process.env.FI_V1_MODEL?.trim() || MODEL;
  if (!/^gpt-[A-Za-z0-9._-]+$/.test(model))
    throw new AgentError(
      "MODEL_SERVICE_UNAVAILABLE",
      503,
      "Invalid V1 model configuration.",
    );
  return {
    model,
    temperature: 0,
    ...(["gpt-5.6-luna", "gpt-5.6-terra"].includes(model)
      ? { reasoning: { effort: "none" as const } }
      : {}),
  };
}
