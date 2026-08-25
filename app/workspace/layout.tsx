import type { ReactNode } from "react";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import "./workspace.css";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  await getWorkspaceUser();
  return <div className="workspaceRoot">{children}</div>;
}
