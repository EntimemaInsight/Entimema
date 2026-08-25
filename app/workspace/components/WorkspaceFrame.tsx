import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/auth";

export function WorkspaceFrame({children,title,active}:{children:ReactNode;title:string;active:"agents"|"runs"}){return <main className="workspaceShell"><header className="commandBar"><Link href="/workspace/agents" className="brand">ENTIMEMA</Link><span className="crumb">/ {title}</span><span className="beta">Private beta</span><form action={async()=>{"use server";await signOut({redirectTo:"/auth/sign-in"})}}><button className="signOut">Sign out</button></form></header><nav className="workspaceRail" aria-label="Workspace"><Link aria-current={active==="agents"?"page":undefined} href="/workspace/agents">Agents</Link><Link aria-current={active==="runs"?"page":undefined} href="/workspace/runs">Runs</Link><span aria-disabled="true">Tests <small>Soon</small></span><span aria-disabled="true">Settings</span></nav><section className="workspaceContent">{children}</section></main>}
