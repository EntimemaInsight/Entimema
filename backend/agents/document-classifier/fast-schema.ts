import { z } from "zod";
import { DOCUMENT_FAMILIES, DOCUMENT_TYPES } from "./taxonomy";
export const FastAIClassificationSchema = z.object({ document_type: z.enum(DOCUMENT_TYPES), confidence: z.number().min(0).max(1), document_family: z.enum(DOCUMENT_FAMILIES).nullable() }).strict();
export type FastAIClassification = z.infer<typeof FastAIClassificationSchema>;
export const FAST_AI_JSON_SCHEMA = { type: "object", additionalProperties: false, required: ["document_type", "confidence", "document_family"], properties: { document_type: { type: "string", enum: DOCUMENT_TYPES }, confidence: { type: "number", minimum: 0, maximum: 1 }, document_family: { anyOf: [{ type: "string", enum: DOCUMENT_FAMILIES }, { type: "null" }] } } } as const;
