"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import styles from "./offer.module.css";

type Status = "idle" | "sending" | "checkout" | "error";

export function PilotAcceptance() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok || response.headers.get("X-Entimema-Submission") !== "accepted") {
        setStatus("error");
        return;
      }

      setStatus("checkout");
      const checkoutResponse = await fetch("/api/checkout/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyEmail: data.get("companyEmail"),
          companyName: data.get("companyName"),
        }),
      });
      const checkout: unknown = await checkoutResponse.json();
      if (
        !checkoutResponse.ok || !checkout || typeof checkout !== "object" ||
        !("url" in checkout) || typeof checkout.url !== "string"
      ) {
        setStatus("error");
        return;
      }
      window.location.assign(checkout.url);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.accept} aria-labelledby="accept-offer">
      <div>
        <p>ACCEPT THE STANDARD OFFER</p>
        <h2 id="accept-offer">Continue to payment.</h2>
        <span>Use the same company and work email as your pilot intake.</span>
      </div>
      <form onSubmit={submit}>
        <input name="intent" type="hidden" value="pilot_acceptance" />
        <div className={styles.honeypot} aria-hidden="true"><label htmlFor="offer-website">Website</label><input autoComplete="off" id="offer-website" name="website" tabIndex={-1} /></div>
        <label><span>Work email</span><input autoComplete="email" maxLength={254} name="companyEmail" required type="email" /></label>
        <label><span>Company</span><input autoComplete="organization" maxLength={160} name="companyName" required /></label>
        <label className={styles.consent}><input name="privacyConsent" required type="checkbox" value="yes" /><span>I accept the pilot scope and agree to the processing of this request under the <Link href="/privacy">Privacy Notice</Link>.</span></label>
        {status === "error" ? <p className={styles.error} role="alert">We recorded no payment. Please try again or email <a href="mailto:office@entimema.com">office@entimema.com</a>.</p> : null}
        <button disabled={status === "sending" || status === "checkout"} type="submit">
          {status === "sending" ? "Recording acceptance…" : status === "checkout" ? "Opening secure checkout…" : "Accept the offer and pay securely"}
        </button>
      </form>
    </section>
  );
}
