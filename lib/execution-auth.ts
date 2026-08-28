import "server-only";
import { createHash } from "node:crypto";
import { auth, isWorkspaceAllowed } from "@/auth";
import { AgentError } from "@/backend/lib/errors";

export type AuthorizedActor = { actorId: string };
type SessionReader = () => Promise<{ user?: { email?: string | null } } | null>;

export function createExecutionAuthorizer(readSession: SessionReader = auth) {
  return async (): Promise<AuthorizedActor> => {
    const session = await readSession();
    const email = session?.user?.email?.trim().toLowerCase();
    if (!email) throw new AgentError("AUTHENTICATION_REQUIRED", 401);
    if (!isWorkspaceAllowed(email)) throw new AgentError("ACCESS_FORBIDDEN", 403);
    return { actorId: createHash("sha256").update(email).digest("hex").slice(0, 16) };
  };
}

export const authorizeExecution = createExecutionAuthorizer();
