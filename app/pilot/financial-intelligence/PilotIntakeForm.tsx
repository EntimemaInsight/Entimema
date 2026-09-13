"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { countryOptions } from "@/lib/countries";
import styles from "./pilot.module.css";

const documentTypes = ["Income Statement", "Management accounts", "Financial model", "Other"] as const;
const monthlyVolumes = ["1–10", "11–50", "51–200", "200+"] as const;
const objectives = [
  "Faster financial analysis",
  "Data validation and reconciliation",
  "Standardized management reporting",
  "Traceable review and audit evidence",
  "Other",
] as const;

type Status = "idle" | "sending" | "success" | "error";

export function PilotIntakeForm() {
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
      setStatus(response.ok && response.headers.get("X-Entimema-Submission") === "accepted" ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className={styles.success} aria-live="polite">
        <p className={styles.eyebrow}>PILOT CONFIGURATION RECEIVED</p>
        <h2>Your pilot request is ready for review.</h2>
        <p>Review the standard pilot scope and price. If it fits your use case, accept the offer and continue to the payment step.</p>
        <div className={styles.next}>
          <span>01 · Scope review</span>
          <span>02 · Pilot terms and payment</span>
          <span>03 · Restricted Workspace access</span>
        </div>
        <Link href="/pilot/financial-intelligence/offer">Review the standard pilot offer →</Link>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="pilot-form-title">
      <div className={styles.panelHeader}>
        <div><p>01 · PILOT INTAKE</p><h2 id="pilot-form-title">Your company and use case</h2></div>
        <span>All fields are required</span>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <input name="intent" type="hidden" value="pilot" />
        <div className={styles.honeypot} aria-hidden="true"><label htmlFor="pilot-website">Website</label><input autoComplete="off" id="pilot-website" name="website" tabIndex={-1} /></div>

        <label><span>First name</span><input autoComplete="given-name" maxLength={80} name="firstName" required /></label>
        <label><span>Last name</span><input autoComplete="family-name" maxLength={80} name="lastName" required /></label>
        <label><span>Work email</span><input autoComplete="email" maxLength={254} name="companyEmail" required type="email" /></label>
        <label><span>Company</span><input autoComplete="organization" maxLength={160} name="companyName" required /></label>
        <label><span>Role</span><input autoComplete="organization-title" maxLength={160} name="jobTitle" required /></label>
        <label><span>Country</span><select autoComplete="country-name" defaultValue="" name="country" required><option disabled value="">Select country</option>{countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>

        <fieldset>
          <legend>What do you want to analyse?</legend>
          <div className={styles.choices}>{documentTypes.map((option) => <label key={option}><input name="documentType" required type="radio" value={option} /><span>{option}</span></label>)}</div>
        </fieldset>

        <fieldset>
          <legend>Approximate monthly volume</legend>
          <div className={styles.choices}>{monthlyVolumes.map((option) => <label key={option}><input name="monthlyVolume" required type="radio" value={option} /><span>{option} documents</span></label>)}</div>
        </fieldset>

        <fieldset className={styles.full}>
          <legend>Primary objective</legend>
          <div className={styles.objectives}>{objectives.map((option) => <label key={option}><input name="primaryObjective" required type="radio" value={option} /><span>{option}</span></label>)}</div>
        </fieldset>

        <label className={styles.consent}>
          <input name="privacyConsent" required type="checkbox" value="yes" />
          <span>I agree that Entimema may process this information to assess and respond to my pilot request. See the <Link href="/privacy">Privacy Notice</Link>.</span>
        </label>

        {status === "error" ? <p className={styles.error} role="alert">We could not submit your pilot configuration. Try again or email <a href="mailto:office@entimema.com">office@entimema.com</a>.</p> : null}
        <button className={styles.submit} disabled={status === "sending"} type="submit">{status === "sending" ? "Submitting…" : "Submit pilot configuration →"}</button>
      </form>
    </section>
  );
}
