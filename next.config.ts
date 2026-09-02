import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "entimema.net" }],
        destination: "https://www.entimema.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.entimema.net" }],
        destination: "https://www.entimema.com/:path*",
        permanent: true,
      },
      { source: "/insights", destination: "/resources", permanent: true },
      { source: "/services/financial-architecture", destination: "/services/cfo-function", permanent: true },
      { source: "/services/risk-management", destination: "/services/credit-risk", permanent: true },
      { source: "/services/data-ai-automation", destination: "/services/financial-data", permanent: true },
      { source: "/services/finance-transformation", destination: "/services/cfo-function", permanent: true },
      { source: "/services/cfo", destination: "/services/cfo-function", permanent: true },
    ];
  },
};

export default nextConfig;
