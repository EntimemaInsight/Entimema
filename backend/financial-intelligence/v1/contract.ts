import { z } from "zod";

const referenceSchema = z
  .object({ period: z.string().min(1), sourceRef: z.string().min(1) })
  .strict();
const lineSchema = z
  .object({
    sourceRow: z.number().int().positive(),
    label: z.string().min(1),
    concept: z.string().nullable(),
    values: z.array(referenceSchema).min(1).max(24),
  })
  .strict();
export const modelStatementSchema = z
  .object({
    statementType: z.enum(["income_statement", "unsupported"]),
    entity: z.string().nullable(),
    currency: z.string().nullable(),
    scale: z.string().nullable(),
    periods: z.array(z.string().min(1)).max(24),
    lines: z.array(lineSchema).max(300),
  })
  .strict();
// Values exist only after deterministic source binding; they are not model output.
export const statementSchema = modelStatementSchema.extend({
  lines: z
    .array(
      lineSchema.extend({
        values: z
          .array(referenceSchema.extend({ value: z.number().finite() }))
          .min(1)
          .max(24),
      }),
    )
    .max(300),
});
export type ModelStatement = z.infer<typeof modelStatementSchema>;
export type Statement = z.infer<typeof statementSchema>;
export type Kpi = { label: string; period: string; value: number; unit: "%" };
export type Timings = {
  mechanicalReadMs: number;
  aiMs: number;
  validationMs: number;
  verificationMs: number;
  calculationMs: number;
  totalMs: number;
};
export type Result = Statement & {
  summary: string;
  findings: string[];
  kpis: Kpi[];
  verification: { verifiedValues: number };
  model: string;
  aiCalls: number;
  timings: Timings;
};
