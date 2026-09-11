import Link from "next/link";
import { getWorkspaceProducts } from "@/lib/workspace-products";
import { getWorkspaceUser } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "./components/WorkspaceFrame";

const essentials = [
  {
    label: "Product documentation",
    description: "Prepare inputs, run the workflow and review its outputs.",
    href: "/workspace/documentation",
    mark: "DC",
  },
  {
    label: "Data & Security",
    description: "Review product-specific access, processing and control boundaries.",
    href: "/workspace/data-security",
    mark: "DS",
  },
  {
    label: "Run history",
    description: "Return to analyses recorded during this browser session.",
    href: "/workspace/runs",
    mark: "RN",
  },
] as const;

export default async function WorkspacePage() {
  const user = await getWorkspaceUser();
  const products = getWorkspaceProducts(user.email);

  return (
    <WorkspaceFrame title="Home" active="home" user={user}>
      <div className="workspaceHome">
        <header className="workspaceHomeHero">
          <p>ENTIMEMA WORKSPACE</p>
          <h1>Your financial decision workspace.</h1>
          <span>
            Access the products enabled for your organization, run controlled workflows
            and review the evidence behind every material output.
          </span>
        </header>

        <section className="workspaceHomeSection" aria-labelledby="products-heading">
          <div className="workspaceSectionHeading">
            <div>
              <p>PRODUCT ACCESS</p>
              <h2 id="products-heading">Available products</h2>
            </div>
            <span>{products.filter((product) => product.access === "available").length} enabled</span>
          </div>

          <div className="workspaceProductList">
            {products.map((product) => (
              <article className="workspaceProductCard" key={product.id}>
                <div className="workspaceProductIdentity">
                  <span aria-hidden="true">FI</span>
                  <div>
                    <small>{product.release} · {product.workflow}</small>
                    <h3>{product.name}</h3>
                  </div>
                </div>
                <p>{product.description}</p>
                <div className="workspaceProductStatus">
                  <span className={product.access}>{product.access === "available" ? "Available" : "Not enabled"}</span>
                  {product.access === "available" ? (
                    <Link href={product.href}>Open workflow →</Link>
                  ) : (
                    <Link href="/contact">Request access →</Link>
                  )}
                </div>
                <ol className="workspaceWorkflowPath" aria-label="Workflow stages">
                  <li>Upload</li>
                  <li>Validate</li>
                  <li>Review</li>
                  <li>Export</li>
                </ol>
              </article>
            ))}
          </div>
          <p className="workspaceAccessNote">
            Additional products and workflows will appear here only when they are enabled for your organization.
          </p>
        </section>

        <section className="workspaceHomeSection" aria-labelledby="essentials-heading">
          <div className="workspaceSectionHeading">
            <div>
              <p>OPERATING GUIDANCE</p>
              <h2 id="essentials-heading">Workspace essentials</h2>
            </div>
          </div>
          <div className="workspaceEssentials">
            {essentials.map((item) => (
              <Link href={item.href} key={item.href}>
                <span aria-hidden="true">{item.mark}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </div>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceFrame>
  );
}
