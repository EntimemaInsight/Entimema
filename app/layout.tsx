import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.entimema.net"),
  title: { default: "Entimema | Financial, Risk & AI Operating Systems", template: "%s | Entimema" },
  description: "Entimema изгражда финансови, рискови и AI системи за по-бързи, ясни и предвидими управленски решения.",
  icons: { icon: "/entimema-mark.svg" },
  openGraph: {
    title: "Entimema | Financial, Risk & AI Operating Systems",
    description: "Финансови решения, проектирани за действие.",
    url: "https://www.entimema.net",
    siteName: "Entimema",
    locale: "bg_BG",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bg"><body>{children}</body></html>;
}
