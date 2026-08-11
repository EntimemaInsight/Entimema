import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/insights", destination: "/#analyses", permanent: true },
      { source: "/services/financial-architecture", destination: "/services/cfo-function", permanent: true },
      { source: "/services/risk-management", destination: "/services/credit-risk", permanent: true },
      { source: "/services/data-ai-automation", destination: "/services/financial-data", permanent: true },
      { source: "/services/finance-transformation", destination: "/services/cfo-function", permanent: true },
      { source: "/services/cfo", destination: "/services/cfo-function", permanent: true },
    ];
  },
};

export default nextConfig;
