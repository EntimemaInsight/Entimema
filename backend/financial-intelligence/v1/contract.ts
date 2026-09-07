import { z } from "zod";

export const statementSchema = z
  .object({
    statementType: z.enum(["income_statement", "unsupported"]),
    entity: z.string().nullable(),
    currency: z.string().nullable(),
    scale: z.string().nullable(),
    periods: z.array(z.string().min(1)).max(24),
    lines: z
      .array(
        z
          .object({
            sourceRow: z.number().int().positive(),
            label: z.string().min(1),
            concept: z.string().nullable(),
            values: z
              .array(
                z
                  .object({
                    period: z.string().min(1),
                    sourceRef: z.string().min(1),
                    value: z.number().finite(),
                  })
                  .strict(),
              )
              .min(1)
              .max(24),
          })
          .strict(),
      )
      .max(300),
    summary: z.string().max(1600),
    findings: z.array(z.string().max(600)).max(5),
  })
  .strict();

export type Statement = z.infer<typeof statementSchema>;
export type Kpi = { label: string; period: string; value: number; unit: "%" };
export type Timings = {
  mechanicalReadMs: number;
  aiMs: number;
  verificationMs: number;
  calculationMs: number;
  totalMs: number;
};
export type Result = Statement & {
  kpis: Kpi[];
  verification: { verifiedValues: number };
  model: string;
  aiCalls: number;
  timings: Timings;
};
