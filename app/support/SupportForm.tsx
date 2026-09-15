"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { clientInquiryTypes } from "@/app/contact/contact-config";
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
      <p className={styles.formEyebrow}>CONTACT SUPPORT</p>
      <h2>How can we help?</h2>
      <p className={styles.formIntro}>Tell us what you need and our team will get back to you.</p>
      <form className={styles.form} onSubmit={submit}>
        <label><span>First name</span><input autoComplete="given-name" name="firstName" required /></label>
        <label><span>Last name</span><input autoComplete="family-name" name="lastName" required /></label>
        <label className={styles.fullWidth}><span>Work email</span><input autoComplete="email" name="companyEmail" required type="email" /></label>
        <label><span>Company</span><input autoComplete="organization" name="companyName" required /></label>
        <label><span>Phone number</span><input autoComplete="tel" name="phoneNumber" required type="tel" /></label>
        <label className={styles.fullWidth}><span>Inquiry type</span><select defaultValue="Access or documentation" name="inquiryType" required>{clientInquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className={styles.fullWidth}><span>How can we help?</span><textarea name="message" required rows={5} /></label>
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
