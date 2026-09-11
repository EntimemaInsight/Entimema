import "server-only";
import { isWorkspaceAllowed } from "@/auth";

export type WorkspaceProductId = "financial-intelligence";

export type WorkspaceProduct = {
  id: WorkspaceProductId;
  name: string;
  workflow: string;
  description: string;
  href: string;
  release: string;
  access: "available" | "not-enabled";
};

const productCatalog = [
  {
    id: "financial-intelligence",
    name: "Financial Intelligence",
    workflow: "Income statement analysis",
    description:
      "Turn a supported income statement into a source-grounded, review-ready financial analysis.",
    href: "/workspace/financial-intelligence",
    release: "V1",
  },
] as const;

function configuredEmails(value: string) {
  return new Set(
    value
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function hasWorkspaceProductAccess(email: string, productId: WorkspaceProductId) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isWorkspaceAllowed(normalizedEmail)) return false;

  if (productId === "financial-intelligence") {
    const productAllowlist = process.env.WORKSPACE_FINANCIAL_INTELLIGENCE_EMAILS?.trim();
    if (!productAllowlist) return true;
    return configuredEmails(productAllowlist).has(normalizedEmail);
  }

  return false;
}

export function getWorkspaceProducts(email: string): WorkspaceProduct[] {
  return productCatalog.map((product) => ({
    ...product,
    access: hasWorkspaceProductAccess(email, product.id) ? "available" : "not-enabled",
  }));
}
