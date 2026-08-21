import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Transitional product-retirement redirect. Keep temporary until external
      // links and index coverage have migrated to the Agent Library.
      { source: "/concierge-lab", destination: "/agents", permanent: false },
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
