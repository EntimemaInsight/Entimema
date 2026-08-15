"use client";

import Link from "next/link";
import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./DemoDiscovery.module.css";

type ModalKind = "demo" | "sales";
type ModalContextValue = { openDemo: (trigger: HTMLElement) => void; openSales: (trigger: HTMLElement, initialTopic?: string) => void };
type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "company" | "country" | "role" | "phone" | "message", string>>;
const ModalContext = createContext<ModalContextValue | null>(null);

export function DemoDiscoveryProvider({ children }: { children: ReactNode }) {
  const [modalKind, setModalKind] = useState<ModalKind | null>(null);
  const [initialTopic, setInitialTopic] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function open(kind: ModalKind, trigger: HTMLElement, topic = "") {
    triggerRef.current = trigger;
    setInitialTopic(topic);
    setModalKind(kind);
  }

  function close() {
    setModalKind(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  useEffect(() => {
    if (!modalKind) return;
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
  }, [modalKind]);

  const titleId = modalKind === "sales" ? "sales-contact-title" : "demo-discovery-title";
  const closeLabel = modalKind === "sales" ? "Close Start with a problem" : "Close Discover Entimema";
  return (
    <ModalContext.Provider value={{ openDemo: (trigger) => open("demo", trigger), openSales: (trigger, topic) => open("sales", trigger, topic) }}>
      {children}
      {modalKind && (
        <div className={styles.overlay} data-demo-overlay data-entimema-form-overlay role="presentation">
          <div aria-labelledby={titleId} aria-modal="true" className={styles.modal} ref={modalRef} role="dialog">
            <button aria-label={closeLabel} className={styles.close} onClick={close} type="button">×</button>
            {modalKind === "demo" ? <DemoForm titleId={titleId} /> : <SalesForm initialTopic={initialTopic} titleId={titleId} />}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function DemoTrigger({ children, className }: { children?: ReactNode; className?: string; initialInterest?: string }) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("DemoTrigger must be used within DemoDiscoveryProvider.");
  return <button className={className} onClick={(event) => context.openDemo(event.currentTarget)} type="button">{children ?? PRIMARY_COMMERCIAL_CTA}</button>;
}

export function useSalesModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useSalesModal must be used within DemoDiscoveryProvider.");
  return context.openSales;
}

function DemoForm({ titleId }: { titleId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data, [["firstName", "firstName"], ["lastName", "lastName"], ["email", "email"], ["company", "company"], ["country", "country"], ["phone", "phone"]]);
    if (showErrors(form, nextErrors, setErrors)) return;
    setStatus("sending");
    setStatus(await send(data));
  }
  if (status === "success") return <Success kind="demo" titleId={titleId} />;
  return <><FormHeader eyebrow="PRODUCT & SOLUTION DISCOVERY" title="Discover Entimema" titleId={titleId} /><form className={styles.form} noValidate onSubmit={submit}><input name="intent" type="hidden" value="demo" /><Honeypot id="demo-website" /><PersonAndCompanyFields errors={errors} jobTitleRequired={false} namePrefix="" salesPayload={false} /><ConsentAndPrivacy /><SubmitArea status={status} /></form></>;
}

function SalesForm({ initialTopic, titleId }: { initialTopic: string; titleId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data, [["firstName", "firstName"], ["lastName", "lastName"], ["email", "companyEmail"], ["company", "companyName"], ["country", "country"], ["role", "jobTitle"], ["phone", "phoneNumber"], ["message", "message"]]);
    if (showErrors(form, nextErrors, setErrors)) return;
    setStatus("sending");
    setStatus(await send(data, "project"));
  }
  if (status === "success") return <Success kind="sales" titleId={titleId} />;
  return (
    <>
      <FormHeader eyebrow="SALES ENQUIRY" title="Start with a problem" titleId={titleId} />
      <form className={styles.form} noValidate onSubmit={submit}>
        <input name="intent" type="hidden" value="project" /><input name="topic" type="hidden" value={initialTopic} /><Honeypot id="sales-website" />
        <PersonAndCompanyFields errors={errors} jobTitleRequired namePrefix="sales-" salesPayload />
        <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="sales-message"><span>What problem do you want to solve? *</span><textarea aria-describedby={errors.message ? "sales-message-error" : undefined} aria-invalid={Boolean(errors.message)} id="sales-message" maxLength={4000} name="message" rows={4} />{errors.message && <small className={styles.fieldError} id="sales-message-error">{errors.message}</small>}</label>
        <ConsentAndPrivacy /><SubmitArea status={status} />
      </form>
    </>
  );
}

function PersonAndCompanyFields({ errors, jobTitleRequired, namePrefix, salesPayload }: { errors: FieldErrors; jobTitleRequired: boolean; namePrefix: string; salesPayload: boolean }) {
  return <><Field error={errors.firstName} id={`${namePrefix}firstName`} label="First name" name="firstName" required /><Field error={errors.lastName} id={`${namePrefix}lastName`} label="Last name" name="lastName" required /><Field autoComplete="email" error={errors.email} id={`${namePrefix}email`} label="Company email" name={salesPayload ? "companyEmail" : "email"} required type="email" /><Field autoComplete="organization" error={errors.company} id={`${namePrefix}company`} label="Company name" name={salesPayload ? "companyName" : "company"} required /><Field autoComplete="country-name" error={errors.country} id={`${namePrefix}country`} label="Country" name="country" required /><Field autoComplete="organization-title" error={errors.role} id={`${namePrefix}role`} label="Job title" name={salesPayload ? "jobTitle" : "role"} required={jobTitleRequired} /><Field autoComplete="tel" error={errors.phone} id={`${namePrefix}phone`} label="Phone number" name={salesPayload ? "phoneNumber" : "phone"} required type="tel" /><Field id={`${namePrefix}referralSource`} label="How did you hear about Entimema?" name="referralSource" /></>;
}

function FormHeader({ eyebrow, title, titleId }: { eyebrow: string; title: string; titleId: string }) { return <header className={styles.header}><p className={styles.eyebrow}>{eyebrow}</p><h2 id={titleId}>{title}</h2></header>; }
function ConsentAndPrivacy() { return <><label className={`${styles.consent} ${styles.fullWidth}`}><input name="marketingConsent" type="checkbox" value="yes" /><span>I agree to receive other communications from Entimema.</span></label><p className={`${styles.privacy} ${styles.fullWidth}`}>By submitting this form, you agree that Entimema may process the information provided in order to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.</p></>; }
function SubmitArea({ status }: { status: Status }) { return <>{status === "error" && <p className={`${styles.submitError} ${styles.fullWidth}`} role="alert">We could not send your request. Try again or email us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>}<button className={`${styles.submit} ${styles.fullWidth}`} disabled={status === "sending"} type="submit">{status === "sending" ? "Submitting…" : "Submit"}</button></>; }
function Success({ kind, titleId }: { kind: ModalKind; titleId: string }) { return <div aria-live="polite" className={styles.success}><p className={styles.eyebrow}>{kind === "demo" ? "DISCOVERY REQUEST" : "ENQUIRY RECEIVED"}</p><h2 id={titleId}>{kind === "demo" ? "Thank you" : "Thank you."}</h2><p>{kind === "demo" ? "We’ve received your request and will be in touch shortly." : "We received your inquiry. We will review it and contact you about the next step."}</p></div>; }
function Honeypot({ id }: { id: string }) { return <div className={styles.honeypot} aria-hidden="true"><label htmlFor={id}>Website</label><input autoComplete="off" id={id} name="website" tabIndex={-1} /></div>; }

function Field({ autoComplete, error, id, label, name, required = false, type = "text" }: { autoComplete?: string; error?: string; id: string; label: string; name: string; required?: boolean; type?: string }) {
  const errorId = `${id}-error`;
  return <label className={styles.field} htmlFor={id}><span>{label}{required ? " *" : ""}</span><input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} maxLength={name === "email" ? 254 : 160} name={name} type={type} />{error && <small className={styles.fieldError} id={errorId}>{error}</small>}</label>;
}

function validate(data: FormData, required: readonly (readonly [keyof FieldErrors, string])[]) {
  const errors: FieldErrors = {};
  for (const [key, name] of required) if (!String(data.get(name) ?? "").trim()) errors[key] = "This field is required.";
  const emailName = required.find(([key]) => key === "email")?.[1] ?? "email";
  const email = String(data.get(emailName) ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid company email.";
  return errors;
}

function showErrors(form: HTMLFormElement, errors: FieldErrors, setErrors: (errors: FieldErrors) => void) {
  if (!Object.keys(errors).length) { setErrors({}); return false; }
  setErrors(errors);
  requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
  return true;
}

async function send(data: FormData, inquiryType?: "project"): Promise<Status> {
  try {
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data.entries())) });
    if (response.ok && inquiryType && response.headers.get("X-Entimema-Submission") === "accepted") trackAnalyticsEvent("contact_submit_success", { inquiry_type: inquiryType });
    return response.ok ? "success" : "error";
  } catch { return "error"; }
}
