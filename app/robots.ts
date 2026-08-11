import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.entimema.net/sitemap.xml",
    host: "https://www.entimema.net",
  };
}
