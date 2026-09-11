import "server-only";
import { auth, isWorkspaceAllowed } from "@/auth";
import { redirect } from "next/navigation";
import {
  hasWorkspaceProductAccess,
  type WorkspaceProductId,
} from "@/lib/workspace-products";

export async function getWorkspaceUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isWorkspaceAllowed(email)) redirect("/auth/sign-in");
  return { email, name: session.user?.name ?? email.split("@")[0] };
}

export async function requireWorkspaceProduct(productId: WorkspaceProductId) {
  const user = await getWorkspaceUser();
  if (!hasWorkspaceProductAccess(user.email, productId)) {
    redirect("/workspace?access=not-enabled");
  }
  return user;
}

export async function hasWorkspaceAccess() {
  const session = await auth();
  return Boolean(session?.user?.email && isWorkspaceAllowed(session.user.email));
}
