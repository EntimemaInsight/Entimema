import assert from "node:assert/strict";
import test from "node:test";
import { SITE_URL, createServicePageSchema } from "../../lib/structured-data";

test("service schemas contain a complete canonical breadcrumb hierarchy", () => {
  const path = "/services/credit-risk";
  const schema = createServicePageSchema({
    path,
    name: "Credit Risk Consulting",
    description: "Test description",
    breadcrumbName: "Credit Risk",
  });
  const breadcrumbs = schema["@graph"].filter((entity) => entity["@type"] === "BreadcrumbList");
  const breadcrumb = breadcrumbs.find((entity) => "itemListElement" in entity);

  assert.equal(breadcrumbs.length, 1);
  assert.ok(breadcrumb);
  assert.deepEqual(breadcrumb.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Entimema", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "Credit Risk", item: `${SITE_URL}${path}` },
  ]);
  assert.deepEqual(schema["@graph"].map((entity) => entity["@type"]), ["Service", "WebPage", "BreadcrumbList"]);
});
