import type { Metadata } from "next";
import "./globals.css";
import ScrollExperience from "@/components/ScrollExperience";
import GlobalFooter from "@/components/GlobalFooter";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { DemoDiscoveryProvider } from "@/components/DemoDiscovery";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.entimema.com"),
  title: "Entimema | Financial Architecture, Decision Science & AI",
  description: "Financial architecture, decision science and AI agents for better financial, risk and management decisions.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Entimema",
    title: "Entimema | Financial Architecture, Decision Science & AI",
    description: "Financial architecture, decision science and AI agents for better financial, risk and management decisions.",
  },
  twitter: {
    card: "summary",
    title: "Entimema | Financial Architecture, Decision Science & AI",
    description: "Financial architecture, decision science and AI agents for better financial, risk and management decisions.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><DemoDiscoveryProvider><ScrollExperience />{children}<GlobalFooter /><AnalyticsConsent /></DemoDiscoveryProvider></body>
    </html>
  );
}
