import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/auth";
import type { WorkspaceUser } from "@/lib/workspace-auth";

export type WorkspaceSection =
  | "home"
  | "financial-intelligence"
  | "runs"
  | "documentation"
  | "security"
  | "account"
  | "admin"
  | "agents";

const customerNavigation = [
  { id: "home", label: "Workspace Home", mark: "WS", href: "/workspace" },
  { id: "financial-intelligence", label: "Financial Intelligence", mark: "FI", href: "/workspace/financial-intelligence" },
  { id: "runs", label: "Runs", mark: "RN", href: "/workspace/runs" },
  { id: "documentation", label: "Documentation", mark: "DC", href: "/workspace/documentation" },
  { id: "security", label: "Data & Security", mark: "DS", href: "/workspace/data-security" },
  { id: "account", label: "Account", mark: "AC", href: "/workspace/account" },
] as const;

const ownerNavigation = [
  { id: "admin", label: "Platform Admin", mark: "PA", href: "/workspace/admin" },
] as const;

async function signOutOfWorkspace() {
  "use server";
  await signOut({ redirectTo: "/auth/sign-in" });
}

export function WorkspaceFrame({
  children,
  title,
  active,
  user,
}: {
  children: ReactNode;
  title: string;
  active: WorkspaceSection;
  user?: WorkspaceUser;
}) {
  const navigation =
    user?.role === "platform-owner"
      ? [...customerNavigation, ...ownerNavigation]
      : customerNavigation;

  return (
    <main className="workspaceShell clientWorkspaceShell">
      <header className="commandBar clientCommandBar">
        <Link href="/workspace" className="brand" aria-label="Entimema workspace home">
          ENTIMEMA
        </Link>
        <span className="workspaceProduct">Entimema Workspace</span>
        <span className="crumb">/ {title}</span>
        <span className="beta">
          {user?.role === "platform-owner" ? "Platform owner" : user?.environment === "sandbox" ? "Demo customer" : "Controlled access"}
        </span>
        {user && (
          <details className="clientUserMenu">
            <summary aria-label="Account menu">{user.name.slice(0, 1).toUpperCase()}</summary>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
              <small>{user.organizationName} · {user.role.replaceAll("-", " ")}</small>
              <form action={signOutOfWorkspace}>
                <button>Sign out</button>
              </form>
            </div>
          </details>
        )}
      </header>

      <aside className="workspaceRail clientWorkspaceRail" aria-label="Client workspace navigation">
        <p>WORKSPACE</p>
        {navigation.map((item) => (
          <Link key={item.id} aria-current={active === item.id ? "page" : undefined} href={item.href}>
            <span aria-hidden="true">{item.mark}</span>
            {item.label}
          </Link>
        ))}
        <div className="workspaceRailFooter">
          <small>{user?.organizationName ?? "Controlled financial workflow"}</small>
          <form action={signOutOfWorkspace}>
            <button type="submit" className="workspaceSignOut">
              <span aria-hidden="true">↪</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <section className="workspaceContent clientWorkspaceContent">{children}</section>
    </main>
  );
}
