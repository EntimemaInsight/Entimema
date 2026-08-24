import { z } from "zod";
import { DOCUMENT_FAMILIES, DOCUMENT_TYPES } from "./taxonomy";
const nullableText = z.string().trim().min(1).nullable();
export const ReportingPeriodSchema = z.object({ from: z.iso.date().nullable(), to: z.iso.date().nullable() }).strict().nullable();
export const ModelClassificationSchema = z.object({
  document_family: z.enum(DOCUMENT_FAMILIES), document_type: z.enum(DOCUMENT_TYPES), document_subtype: nullableText,
  source_system: nullableText, entity_name: nullableText, reporting_period: ReportingPeriodSchema,
  currency: z.string().regex(/^[A-Z]{3}$/).nullable(), language: nullableText, confidence: z.number().min(0).max(1),
  data_quality: z.enum(["good", "fair", "poor"]), issues: z.array(z.string().trim().min(1)).max(20), recommended_agent: z.string().trim().min(1),
}).strict();
export const ClassificationSchema = ModelClassificationSchema.omit({ recommended_agent: true });
export type Classification = z.infer<typeof ClassificationSchema>;
const nullableString = { anyOf: [{ type: "string", minLength: 1 }, { type: "null" }] } as const;
const nullableDate = { anyOf: [{ type: "string", format: "date" }, { type: "null" }] } as const;
export const MODEL_CLASSIFICATION_JSON_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["document_family", "document_type", "document_subtype", "source_system", "entity_name", "reporting_period", "currency", "language", "confidence", "data_quality", "issues", "recommended_agent"],
  properties: {
    document_family: { type: "string", enum: DOCUMENT_FAMILIES }, document_type: { type: "string", enum: DOCUMENT_TYPES },
    document_subtype: nullableString, source_system: nullableString, entity_name: nullableString,
    reporting_period: { anyOf: [{ type: "object", additionalProperties: false, required: ["from", "to"], properties: { from: nullableDate, to: nullableDate } }, { type: "null" }] },
    currency: { anyOf: [{ type: "string", pattern: "^[A-Z]{3}$" }, { type: "null" }] }, language: nullableString,
    confidence: { type: "number", minimum: 0, maximum: 1 }, data_quality: { type: "string", enum: ["good", "fair", "poor"] },
    issues: { type: "array", maxItems: 20, items: { type: "string", minLength: 1 } }, recommended_agent: { type: "string", minLength: 1 },
  },
} as const;
