"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function PaymentStatus({ sessionId, initiallyPaid }: { sessionId: string; initiallyPaid: boolean }) {
  const [paid, setPaid] = useState(initiallyPaid);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!paid) return;
    let attempts = 0;
    let cancelled = false;
    let timer: number | undefined;
    const check = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/checkout/pilot/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        if (!response.ok) return;
        const state = await response.json() as { paid?: boolean; ready?: boolean };
        if (cancelled) return;
        setPaid(state.paid === true);
        setReady(state.ready === true);
        if (!state.ready && attempts < 15) timer = window.setTimeout(() => void check(), 2_000);
      } catch {
        // The confirmation remains recoverable through a refresh or the emailed access link.
        if (!cancelled && attempts < 15) timer = window.setTimeout(() => void check(), 2_000);
      }
    };
    void check();
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [paid, sessionId]);

  if (!paid) return <>
    <p>PAYMENT NOT CONFIRMED</p>
    <h1>Your Workspace access has not been activated.</h1>
    <span>No successful payment was found for this checkout. Return to the offer when you are ready to continue.</span>
    <Link href="/pilot/financial-intelligence/offer#accept-offer">Return to the pilot offer →</Link>
  </>;

  return <>
    <p>{ready ? "WORKSPACE READY" : "PAYMENT CONFIRMED"}</p>
    <h1>{ready ? "Your controlled pilot is active." : "We are activating your restricted Workspace."}</h1>
    <span>{ready
      ? "Sign in with the same Google work email used at checkout. Your Financial Intelligence pilot is enabled for 30 days."
      : "Payment is complete. Access is being provisioned automatically; this page will update as soon as it is ready."}</span>
    {ready ? <Link href="/auth/sign-in?callbackUrl=%2Fworkspace">Open Entimema Workspace →</Link> : <small>Usually ready within a few seconds. You may also use the access link sent by email.</small>}
  </>;
}
