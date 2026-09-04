import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile-polish.css";
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
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
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
