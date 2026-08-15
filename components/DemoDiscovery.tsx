"use client";

import Link from "next/link";
import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import styles from "./DemoDiscovery.module.css";

const exploreOptions = [
  "AI Agents",
  "Credit Risk",
  "Decision Automation",
  "CFO & Financial Management",
  "Budgets & Forecasting",
  "Cost & Profitability",
  "Management Reporting",
  "Financial Data & ERP",
  "Other",
] as const;

type DemoContextValue = { open: (trigger: HTMLElement, initialInterest?: string) => void };
const DemoContext = createContext<DemoContextValue | null>(null);
type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"firstName" | "lastName" | "email" | "company" | "country" | "explore", string>>;

export function DemoDiscoveryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialInterest, setInitialInterest] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function open(trigger: HTMLElement, interest = "") {
    triggerRef.current = trigger;
    setInitialInterest(exploreOptions.includes(interest as (typeof exploreOptions)[number]) ? interest : "");
    setErrors({});
    setStatus("idle");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setErrors({});
    setStatus("idle");
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const modal = modalRef.current;
    const overlay = modal?.parentElement;
    const background = [...document.body.children]
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay && !element.contains(overlay ?? null))
      .map((element) => ({ element, inert: element.inert, ariaHidden: element.getAttribute("aria-hidden") }));
    for (const { element } of background) {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    }
    modal?.querySelector<HTMLElement>("button, input, select, textarea, a[href]")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !modal) return;
      const focusable = [...modal.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      for (const { element, inert, ariaHidden } of background) {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};
    const required = ["firstName", "lastName", "email", "company", "country", "explore"] as const;
    for (const key of required) if (!String(data.get(key) ?? "").trim()) nextErrors[key] = "This field is required.";
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid company email.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <DemoContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className={styles.overlay} data-demo-overlay role="presentation">
          <div aria-labelledby="demo-discovery-title" aria-modal="true" className={styles.modal} ref={modalRef} role="dialog">
            <button aria-label="Close Discover Entimema" className={styles.close} onClick={close} type="button">×</button>
            {status === "success" ? (
              <div aria-live="polite" className={styles.success}>
                <p className={styles.eyebrow}>DISCOVERY REQUEST</p>
                <h2 id="demo-discovery-title">Thank you</h2>
                <p>We’ve received your request and will be in touch shortly.</p>
              </div>
            ) : (
              <>
                <header className={styles.header}>
                  <p className={styles.eyebrow}>PRODUCT &amp; SOLUTION DISCOVERY</p>
                  <h2 id="demo-discovery-title">Discover Entimema</h2>
                  <p>Tell us what you would like to explore and we’ll prepare the right conversation.</p>
                </header>
                <form className={styles.form} noValidate onSubmit={submit}>
                  <input name="intent" type="hidden" value="demo" />
                  <div className={styles.honeypot} aria-hidden="true"><label htmlFor="demo-website">Website</label><input autoComplete="off" id="demo-website" name="website" tabIndex={-1} /></div>
                  <DemoField error={errors.firstName} id="firstName" label="First name" required />
                  <DemoField error={errors.lastName} id="lastName" label="Last name" required />
                  <DemoField autoComplete="email" error={errors.email} id="email" label="Company email" required type="email" />
                  <DemoField autoComplete="organization" error={errors.company} id="company" label="Company name" required />
                  <DemoField autoComplete="country-name" error={errors.country} id="country" label="Country" required />
                  <DemoField autoComplete="organization-title" id="role" label="Job title" />
                  <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="explore">
                    <span>What would you like to explore? *</span>
                    <select aria-describedby={errors.explore ? "explore-error" : undefined} aria-invalid={Boolean(errors.explore)} defaultValue={initialInterest} id="explore" name="explore">
                      <option disabled value="">Select an area</option>
                      {exploreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {errors.explore && <small className={styles.fieldError} id="explore-error">{errors.explore}</small>}
                  </label>
                  <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="demo-message"><span>Tell us about your challenge</span><textarea id="demo-message" maxLength={4000} name="message" rows={4} /></label>
                  <p className={`${styles.privacy} ${styles.fullWidth}`}>By submitting this form, you agree that Entimema may process the information provided in order to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.</p>
                  {status === "error" && <p className={`${styles.submitError} ${styles.fullWidth}`} role="alert">We could not send your request. Try again or email us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>}
                  <button className={`${styles.submit} ${styles.fullWidth}`} disabled={status === "sending"} type="submit">{status === "sending" ? "Submitting…" : "Submit"}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </DemoContext.Provider>
  );
}

export function DemoTrigger({ children, className, initialInterest = "" }: { children?: ReactNode; className?: string; initialInterest?: string }) {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoTrigger must be used within DemoDiscoveryProvider.");
  return <button className={className} onClick={(event) => context.open(event.currentTarget, initialInterest)} type="button">{children ?? PRIMARY_COMMERCIAL_CTA}</button>;
}

function DemoField({ autoComplete, error, id, label, required = false, type = "text" }: { autoComplete?: string; error?: string; id: string; label: string; required?: boolean; type?: string }) {
  const errorId = `${id}-error`;
  return <label className={styles.field} htmlFor={id}><span>{label}{required ? " *" : ""}</span><input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} maxLength={id === "email" ? 254 : 160} name={id} type={type} />{error && <small className={styles.fieldError} id={errorId}>{error}</small>}</label>;
}
