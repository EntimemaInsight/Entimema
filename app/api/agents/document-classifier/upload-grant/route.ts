import { createUploadGrantHandler, createUploadDeleteHandler } from "@/backend/api/agents/document-classifier/direct-http";
import { authorizeExecution } from "@/lib/execution-auth";
export const runtime="nodejs";
export const POST=createUploadGrantHandler({authorize:authorizeExecution});
export const DELETE=createUploadDeleteHandler({authorize:authorizeExecution});
