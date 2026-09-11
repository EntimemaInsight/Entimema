import Link from "next/link";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

export default async function AccountPage(){const user=await getWorkspaceUser();return <WorkspaceFrame title="Account" active="account" user={user}><div className="workspacePage accountPage"><header className="workspacePageHero"><p className="eyebrow">ACCOUNT</p><h1>Workspace access</h1><p>Your authorized identity and current product environment.</p></header><dl className="accountDetails"><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Product</dt><dd>Financial Intelligence V1</dd></div><div><dt>Access</dt><dd><span>Active</span> Private beta</dd></div></dl><section className="accountLegal"><p className="eyebrow">LEGAL & SUPPORT</p><div><Link href="/privacy">Security & Privacy</Link><Link href="/contact">Contact Entimema</Link></div></section></div></WorkspaceFrame>}
