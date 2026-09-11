import { requirePlatformOwner } from "@/lib/workspace-auth";
import { WorkspaceFrame } from "../components/WorkspaceFrame";

const domains = [
  {
    name: "Finance",
    products: [
      {
        name: "Financial Intelligence",
        status: "Controlled beta",
        workflows: ["Income Statement Analysis · V1 · Available"],
      },
      {
        name: "Receivables Intelligence",
        status: "Planned",
        workflows: ["No customer workflow enabled"],
      },
    ],
  },
  {
    name: "Risk",
    products: [
      {
        name: "Credit Risk Intelligence",
        status: "Planned",
        workflows: ["No customer workflow enabled"],
      },
    ],
  },
] as const;

export default async function PlatformAdminPage() {
  const user = await requirePlatformOwner();
  const demoCustomerConfigured = Boolean(
    process.env.WORKSPACE_DEMO_CUSTOMER_EMAILS?.trim(),
  );
  const explicitOwnerConfigured = Boolean(
    process.env.WORKSPACE_PLATFORM_OWNER_EMAILS?.trim(),
  );

  return (
    <WorkspaceFrame title="Platform Admin" active="admin" user={user}>
      <div className="platformAdmin">
        <header className="platformAdminHero">
          <div>
            <p>PLATFORM CONTROL</p>
            <h1>Entimema administration</h1>
            <span>Product visibility, customer environments and access boundaries.</span>
          </div>
          <span className="platformReadOnly">Owner view</span>
        </header>

        <section className="platformAdminSection" aria-labelledby="access-heading">
          <div className="platformAdminHeading">
            <div>
              <p>ACCESS REGISTRY</p>
              <h2 id="access-heading">Environments</h2>
            </div>
          </div>
          <div className="environmentRegistry">
            <article>
              <span className="environmentMark">EN</span>
              <div>
                <small>PLATFORM</small>
                <h3>Entimema</h3>
                <p>Full product, organization and platform visibility.</p>
              </div>
              <strong>{explicitOwnerConfigured ? "Configured" : "Bootstrap owner"}</strong>
            </article>
            <article>
              <span className="environmentMark">DC</span>
              <div>
                <small>SANDBOX CUSTOMER</small>
                <h3>Entimema Demo Company</h3>
                <p>Customer-isolated view for end-to-end product validation.</p>
              </div>
              <strong>{demoCustomerConfigured ? "Configured" : "Awaiting test email"}</strong>
            </article>
          </div>
        </section>

        <section className="platformAdminSection" aria-labelledby="catalog-heading">
          <div className="platformAdminHeading">
            <div>
              <p>PRODUCT CATALOG</p>
              <h2 id="catalog-heading">Domains, products and workflows</h2>
            </div>
            <span>Owner visibility</span>
          </div>
          <div className="adminDomainGrid">
            {domains.map((domain) => (
              <section key={domain.name}>
                <header>
                  <span>{domain.name.slice(0, 2).toUpperCase()}</span>
                  <h3>{domain.name}</h3>
                </header>
                {domain.products.map((product) => (
                  <article key={product.name}>
                    <div>
                      <h4>{product.name}</h4>
                      <span className={product.status === "Controlled beta" ? "live" : "planned"}>
                        {product.status}
                      </span>
                    </div>
                    <ul>
                      {product.workflows.map((workflow) => <li key={workflow}>{workflow}</li>)}
                    </ul>
                  </article>
                ))}
              </section>
            ))}
          </div>
          <p className="platformAdminNote">
            Planned products are visible here for platform governance. Customers see only products and workflows explicitly enabled for their organization.
          </p>
        </section>

        <section className="platformAdminSection" aria-labelledby="roles-heading">
          <div className="platformAdminHeading">
            <div>
              <p>AUTHORIZATION MODEL</p>
              <h2 id="roles-heading">Current role boundary</h2>
            </div>
          </div>
          <dl className="roleRegistry">
            <div><dt>Platform Owner</dt><dd>All domains, catalog status and platform administration.</dd></div>
            <div><dt>Organization Admin</dt><dd>Enabled customer products, workflows and organization workspace.</dd></div>
            <div><dt>Analyst</dt><dd>Permitted workflow execution and customer-owned results.</dd></div>
          </dl>
        </section>
      </div>
    </WorkspaceFrame>
  );
}
