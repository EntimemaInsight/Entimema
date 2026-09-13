import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { PilotIntakeForm } from "./PilotIntakeForm";
import styles from "./pilot.module.css";

export const metadata: Metadata = {
  title: "Configure your Financial Intelligence pilot | Entimema",
  description: "Define the document type, volume and objective for a controlled Financial Intelligence pilot.",
  alternates: { canonical: "/pilot/financial-intelligence" },
};

export default function FinancialIntelligencePilotPage() {
  return (
    <main className={styles.page}>
      <Navbar active="product" />
      <div className={styles.shell}>
        <header className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>FINANCIAL INTELLIGENCE · CONTROLLED PILOT</p>
            <h1>Configure your pilot.</h1>
          </div>
          <div>
            <p>Tell us what you need to analyse. We will use these details to define the scope, controls and price of your pilot.</p>
            <span>About 60 seconds · No document upload at this stage</span>
          </div>
        </header>
        <PilotIntakeForm />
      </div>
    </main>
  );
}
