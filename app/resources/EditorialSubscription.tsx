"use client";

import { NewsletterTrigger } from "@/components/DemoDiscovery";
import styles from "./resources.module.css";

export default function EditorialSubscription() {
  return (
    <aside className={styles.editorialSubscription} aria-labelledby="editorial-subscription-title">
      <div>
        <span>ENTIMEMA RESEARCH</span>
        <h2 id="editorial-subscription-title">Decision Signals</h2>
        <p>Financial intelligence, credit risk and decision architecture—published for practitioners.</p>
      </div>
      <div className={styles.subscriptionAction}>
        <NewsletterTrigger>Subscribe <b aria-hidden="true">→</b></NewsletterTrigger>
        <small>New research and product releases only.</small>
      </div>
    </aside>
  );
}
