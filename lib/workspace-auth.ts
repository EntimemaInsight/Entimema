import "server-only";
import {
  auth,
  getWorkspaceRole,
  isPlatformOwner,
  isWorkspaceAllowedForSignIn,
} from "@/auth";
import { redirect } from "next/navigation";
import {
  hasWorkspaceProductAccess,
  type WorkspaceProductId,
} from "@/lib/workspace-products";
import { getPaidWorkspaceAccessProfile } from "@/lib/workspace-entitlements";

export type WorkspaceUser = {
  email: string;
  name: string;
  role: ReturnType<typeof getWorkspaceRole>;
  organizationName: string;
  environment: "platform" | "sandbox" | "customer";
};

export async function getWorkspaceUser(): Promise<WorkspaceUser> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !(await isWorkspaceAllowedForSignIn(email))) redirect("/auth/sign-in");

  const role = getWorkspaceRole(email);
  const paidProfile = role === "platform-owner" ? null : await getPaidWorkspaceAccessProfile(email);
  return {
    email,
    name: session.user?.name ?? email.split("@")[0],
    role,
    organizationName: role === "platform-owner"
      ? "Entimema"
      : paidProfile?.organization_name ?? (role === "organization-admin" ? "Entimema Demo Company" : "Customer workspace"),
    environment:
      role === "platform-owner"
        ? "platform"
        : paidProfile && !paidProfile.livemode
          ? "sandbox"
          : role === "organization-admin"
            ? "sandbox"
            : "customer",
  };
}

export async function requirePlatformOwner() {
  const user = await getWorkspaceUser();
  if (!isPlatformOwner(user.email)) redirect("/workspace?access=platform-owner-required");
  return user;
}

export async function requireWorkspaceProduct(productId: WorkspaceProductId) {
  const user = await getWorkspaceUser();
  if (!(await hasWorkspaceProductAccess(user.email, productId))) {
    redirect("/workspace?access=not-enabled");
  }
  return user;
}

export async function hasWorkspaceAccess() {
  const session = await auth();
  return Boolean(
    session?.user?.email &&
      (await isWorkspaceAllowedForSignIn(session.user.email)),
  );
}
