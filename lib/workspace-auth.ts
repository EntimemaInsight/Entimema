import "server-only";
import { auth, isWorkspaceAllowed } from "@/auth";
import { redirect } from "next/navigation";

export async function getWorkspaceUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isWorkspaceAllowed(email)) redirect("/auth/sign-in");
  return { email, name: session.user?.name ?? email.split("@")[0] };
}

export async function hasWorkspaceAccess() {
  const session = await auth();
  return Boolean(session?.user?.email && isWorkspaceAllowed(session.user.email));
}
