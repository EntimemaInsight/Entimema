import type { Metadata } from "next";
import "./globals.css";
import ScrollExperience from "@/components/ScrollExperience";

export const metadata: Metadata = {
  title: "Entimema | Финансови системи, риск и AI",
  description: "Финансова архитектура, кредитен риск, трансформация, данни, AI и CFO функция.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body><ScrollExperience />{children}</body>
    </html>
  );
}
