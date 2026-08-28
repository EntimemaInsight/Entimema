// Backwards-compatible same-site alias. The canonical handler performs its own authorization.
import { POST } from "@/app/api/agents/document-classifier/run/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export { POST };
