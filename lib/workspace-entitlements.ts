import "server-only";
import { callFinancialDatabaseRpc } from "@/lib/financial-database";

export type WorkspaceProductId = "financial-intelligence";

export async function hasPaidWorkspaceProductAccess(
  email: string,
  productId: WorkspaceProductId,
) {
  try {
    const result = await callFinancialDatabaseRpc<boolean>(
      "workspace_has_product_access",
      {
        p_email: email.trim().toLowerCase(),
        p_product_id: productId,
        p_allow_test: process.env.WORKSPACE_ALLOW_TEST_ENTITLEMENTS === "true",
      },
    );
    return result === true;
  } catch {
    return false;
  }
}

export function hasPaidWorkspaceAccess(email: string) {
  return hasPaidWorkspaceProductAccess(email, "financial-intelligence");
}
