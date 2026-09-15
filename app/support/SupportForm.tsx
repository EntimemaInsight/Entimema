"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { clientInquiryTypes } from "@/app/contact/contact-config";
import { countryOptions } from "@/lib/countries";
import styles from "./support.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function SupportForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, intent: "client" }),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.formPanel} id="support-form">
      <form className={styles.form} onSubmit={submit}>
        <label><span>First name*</span><input autoComplete="given-name" name="firstName" required /></label>
        <label><span>Last name*</span><input autoComplete="family-name" name="lastName" required /></label>
        <label className={styles.fullWidth}><span>Company email*</span><input autoComplete="email" name="companyEmail" required type="email" /></label>
        <label><span>Company name*</span><input autoComplete="organization" name="companyName" required /></label>
        <label><span>Job title*</span><input autoComplete="organization-title" name="jobTitle" required /></label>
        <label><span>Country</span><select autoComplete="country-name" defaultValue="" name="country"><option disabled value="">Select country</option>{countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
        <label><span>Phone number</span><input autoComplete="tel" name="phoneNumber" type="tel" /></label>
        <label className={styles.fullWidth}><span>Inquiry type</span><select defaultValue="Access or documentation" name="inquiryType" required>{clientInquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className={styles.fullWidth}><span>How can we help?</span><textarea name="message" required rows={5} /></label>
        <div className={`${styles.fullWidth} ${styles.privacyNotice}`}>
          <p>Entimema is committed to protecting and respecting your privacy. We use the personal information submitted through this form to respond to your request, administer any relevant account or service relationship, and provide the documentation, products or services you request.</p>
          <p>From time to time, we may also send information about Entimema products, services and research that may be relevant to you. You can withdraw from these communications at any time.</p>
          <label className={styles.consent}>
            <input name="marketingConsent" type="checkbox" value="yes" />
            <span>I agree to receive other communications from Entimema.</span>
          </label>
          <p>For more information about our privacy practices and your rights, please review our <a href="/privacy">Privacy Notice</a>.</p>
          <label className={styles.consent}>
            <input name="privacyConsent" required type="checkbox" value="yes" />
            <span>I have read the Privacy Notice and understand that Entimema will store and process the personal information submitted above to respond to my request.*</span>
          </label>
        </div>
        <label className={styles.honeypot} aria-hidden="true"><span>Website</span><input autoComplete="off" name="website" tabIndex={-1} /></label>
        <button disabled={status === "submitting"} type="submit">{status === "submitting" ? "Sending…" : "Send request"}</button>
        <div className={styles.formStatus} aria-live="polite">
          {status === "success" && <p className={styles.success}>Thank you. Your request has been sent.</p>}
          {status === "error" && <p className={styles.error}>We could not send your request. Please try again or email <a href="mailto:office@entimema.com">office@entimema.com</a>.</p>}
        </div>
      </form>
    </div>
  );
}
