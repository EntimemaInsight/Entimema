import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entimema | Финансови системи, риск и AI",
  description: "Финансова архитектура, кредитен риск, трансформация, данни, AI и CFO функция.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
