import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/auth";

export type WorkspaceSection =
  | "financial-intelligence"
  | "runs"
  | "documentation"
  | "security"
  | "account"
  | "agents";

const navigation = [
  { id: "financial-intelligence", label: "Financial Intelligence", mark: "FI", href: "/workspace/financial-intelligence" },
  { id: "runs", label: "Runs", mark: "RN", href: "/workspace/runs" },
  { id: "documentation", label: "Documentation", mark: "DC", href: "/workspace/documentation" },
  { id: "security", label: "Data & Security", mark: "DS", href: "/workspace/data-security" },
  { id: "account", label: "Account", mark: "AC", href: "/workspace/account" },
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
  user?: { name: string; email: string };
}) {
  return (
    <main className="workspaceShell clientWorkspaceShell">
      <header className="commandBar clientCommandBar">
        <Link href="/workspace/financial-intelligence" className="brand" aria-label="Entimema workspace home">
          ENTIMEMA
        </Link>
        <span className="workspaceProduct">Financial Intelligence</span>
        <span className="crumb">/ {title}</span>
        <span className="beta">Private beta</span>
        {user && (
          <details className="clientUserMenu">
            <summary aria-label="Account menu">{user.name.slice(0, 1).toUpperCase()}</summary>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
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
          <small>Controlled financial workflow</small>
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
