"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./launch.module.css";
import { FinancialIntelligenceCta } from "./FinancialIntelligenceAnalytics";

const routes = {
  bg: { price: "€588", note: "€490 + €98 Bulgarian VAT", label: "Business established in Bulgaria", href: "https://buy.stripe.com/eVq5kF4Yhe9ga8mb41dEs00", kind: "domestic_checkout" as const },
  international: { price: "€490", note: "Subject to verified business status", label: "Business established outside Bulgaria", href: "https://buy.stripe.com/6oU3cx8at9T0eoCegddEs01", kind: "international_checkout" as const },
};

export default function PilotCheckout() {
  const [route, setRoute] = useState<keyof typeof routes>("international");
  const selected = routes[route];
  return <section id="pilot-checkout" className={styles.pilot} aria-labelledby="pilot-title"><div className={styles.pilotShell}><div className={styles.pilotCopy}><p className={styles.productTag}>Paid founding pilot</p><h2 id="pilot-title">Commission one controlled financial execution.</h2><p>One verified business. One agreed reporting scope. One traceable decision output.</p><ul><li>Controlled source intake</li><li>Financial interpretation and mapping</li><li>Deterministic validation</li><li>Exception and human review</li><li>Validated model and findings</li></ul></div><div className={styles.checkoutCard}><small>SELECT PURCHASING BUSINESS</small><div className={styles.routeSelector}><button type="button" aria-pressed={route === "bg"} onClick={() => setRoute("bg")}>Bulgaria</button><button type="button" aria-pressed={route === "international"} onClick={() => setRoute("international")}>Outside Bulgaria</button></div><div className={styles.price}><span>PILOT EXECUTION</span><strong>{selected.price}</strong><small>{selected.note}</small></div><p>{selected.label}</p><FinancialIntelligenceCta href={selected.href} kind={selected.kind} position="pricing">Continue to secure checkout <span>↗</span></FinancialIntelligenceCta><div className={styles.secureNote}><span>Stripe secure checkout</span><span>Business verification required</span></div><Link href="/contact?topic=financial-data">Confirm the scope before payment <span>→</span></Link></div></div></section>;
}
