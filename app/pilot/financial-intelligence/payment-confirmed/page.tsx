import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getStripe } from "@/lib/stripe";
import styles from "./payment-confirmed.module.css";

export const metadata: Metadata = {
  title: "Pilot payment confirmation | Entimema",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function PilotPaymentConfirmedPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.mode === "payment" && session.payment_status === "paid";
    } catch {
      paid = false;
    }
  }

  return (
    <main className={styles.page}>
      <Navbar active="product" />
      <div className={styles.confirmationShell}>
        <section className={styles.paymentConfirmation} aria-live="polite">
          <p>{paid ? "PAYMENT CONFIRMED" : "PAYMENT NOT CONFIRMED"}</p>
          <h1>{paid ? "Your controlled pilot is now active." : "Your Workspace access has not been activated."}</h1>
          <span>{paid
            ? "We are creating your restricted Financial Intelligence Workspace access. The sign-in instructions are sent to the work email used at checkout."
            : "No successful payment was found for this checkout. Return to the offer when you are ready to continue."}</span>
          {paid
            ? <Link href="/auth/sign-in?callbackUrl=%2Fworkspace">Open Entimema Workspace →</Link>
            : <Link href="/pilot/financial-intelligence/offer#accept-offer">Return to the pilot offer →</Link>}
          <small>Never send confidential financial documents by email. Upload them only through the authenticated Workspace.</small>
        </section>
      </div>
    </main>
  );
}
