import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { FinancialIntelligenceDemo } from "./FinancialIntelligenceDemo";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Financial Intelligence Interactive Demo | Entimema",
  description: "Explore how Entimema transforms a financial statement into a validated, traceable and review-ready analysis.",
  alternates: { canonical: "/demo/financial-intelligence" },
};

export default function FinancialIntelligenceDemoPage() {
  return (
    <main className={styles.page}>
      <Navbar active="product" />
      <FinancialIntelligenceDemo />
    </main>
  );
}
