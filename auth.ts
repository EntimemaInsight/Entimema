import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowlistedEmails = () => new Set(
  (process.env.WORKSPACE_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export function isWorkspaceAllowed(email?: string | null) {
  return Boolean(email && allowlistedEmails().has(email.toLowerCase()));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
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
