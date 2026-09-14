import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getStripe } from "@/lib/stripe";
import { PaymentStatus } from "./PaymentStatus";
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
      paid = session.mode === "payment" && session.payment_status === "paid" &&
        session.livemode === (process.env.STRIPE_EXPECTED_LIVEMODE === "true") &&
        session.metadata?.product === "financial_intelligence_controlled_pilot";
    } catch {
      paid = false;
    }
  }

  return (
    <main className={styles.page}>
      <Navbar active="product" />
      <div className={styles.confirmationShell}>
        <section className={styles.paymentConfirmation} aria-live="polite">
          <PaymentStatus sessionId={sessionId ?? ""} initiallyPaid={paid} />
          <small>Never send confidential financial documents by email. Upload them only through the authenticated Workspace.</small>
        </section>
      </div>
    </main>
  );
}
