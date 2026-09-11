import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export type WorkspaceRole = "platform-owner" | "organization-admin" | "analyst";

export const isGitHubAuthEnabled = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);

const emailSet = (value?: string) =>
  new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );

const workspaceEmails = () => emailSet(process.env.WORKSPACE_ALLOWED_EMAILS);
const ownerEmails = () => emailSet(process.env.WORKSPACE_PLATFORM_OWNER_EMAILS);
const demoCustomerEmails = () => emailSet(process.env.WORKSPACE_DEMO_CUSTOMER_EMAILS);

export function isDemoCustomer(email?: string | null) {
  return Boolean(email && demoCustomerEmails().has(email.trim().toLowerCase()));
}

export function isWorkspaceAllowed(email?: string | null) {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return (
    workspaceEmails().has(normalizedEmail) ||
    ownerEmails().has(normalizedEmail) ||
    demoCustomerEmails().has(normalizedEmail)
  );
}

export function isPlatformOwner(email?: string | null) {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  if (isDemoCustomer(normalizedEmail)) return false;

  const configuredOwners = ownerEmails();
  if (configuredOwners.size > 0) return configuredOwners.has(normalizedEmail);

  // Bootstrap only: before an explicit owner allowlist exists, existing approved
  // workspace members retain owner access. Configure the owner list before onboarding clients.
  return workspaceEmails().has(normalizedEmail);
}

export function getWorkspaceRole(email: string): WorkspaceRole {
  if (isPlatformOwner(email)) return "platform-owner";
  if (isDemoCustomer(email)) return "organization-admin";
  return "analyst";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    ...(isGitHubAuthEnabled
      ? [GitHub({ authorization: { params: { scope: "read:user user:email" } } })]
      : []),
  ],
  pages: { signIn: "/auth/sign-in" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  callbacks: {
    signIn: ({ user }) => isWorkspaceAllowed(user.email),
    authorized: ({ auth: session, request }) => {
      if (!request.nextUrl.pathname.startsWith("/workspace")) return true;
      return Boolean(session?.user?.email && isWorkspaceAllowed(session.user.email));
    },
  },
});
