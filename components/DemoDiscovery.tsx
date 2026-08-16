"use client";

import Link from "next/link";
import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { countryOptions } from "@/lib/countries";
import { clientInquiryTypes, partnershipTypes } from "@/app/contact/contact-config";
import styles from "./DemoDiscovery.module.css";

type ContactKind = "project" | "partnership" | "client";
type ModalKind = "demo" | ContactKind;
type ModalContextValue = { openDemo: (trigger: HTMLElement) => void; openContact: (kind: ContactKind, trigger: HTMLElement, initialTopic?: string) => void };
type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "company" | "country" | "role" | "phone" | "partnershipType" | "inquiryType" | "message", string>>;
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

  const modalMeta = {
    demo: { titleId: "demo-discovery-title", closeLabel: "Close Discover Entimema" },
    project: { titleId: "sales-contact-title", closeLabel: "Close Start a new project" },
    partnership: { titleId: "partnership-contact-title", closeLabel: "Close Partner with Entimema" },
    client: { titleId: "client-contact-title", closeLabel: "Close Existing Client Support" },
  }[modalKind ?? "demo"];
  return (
    <ModalContext.Provider value={{ openDemo: (trigger) => open("demo", trigger), openContact: (kind, trigger, topic) => open(kind, trigger, topic) }}>
      {children}
      {modalKind && (
        <div className={styles.overlay} data-demo-overlay data-entimema-form-overlay role="presentation">
          <div aria-labelledby={modalMeta.titleId} aria-modal="true" className={styles.modal} ref={modalRef} role="dialog">
            <button aria-label={modalMeta.closeLabel} className={styles.close} onClick={close} type="button">×</button>
            {modalKind === "demo" && <DemoForm titleId={modalMeta.titleId} />}
            {modalKind === "project" && <SalesForm initialTopic={initialTopic} titleId={modalMeta.titleId} />}
            {modalKind === "partnership" && <PartnershipForm titleId={modalMeta.titleId} />}
            {modalKind === "client" && <ClientForm titleId={modalMeta.titleId} />}
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

export function useContactModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useContactModal must be used within DemoDiscoveryProvider.");
  return context.openContact;
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
  return <><FormHeader title="Discover Entimema" titleId={titleId} /><form className={styles.form} noValidate onSubmit={submit}><input name="intent" type="hidden" value="demo" /><Honeypot id="demo-website" /><PersonAndCompanyFields errors={errors} jobTitleRequired={false} namePrefix="" salesPayload={false} /><ConsentAndPrivacy /><SubmitArea status={status} /></form></>;
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
  if (status === "success") return <Success kind="project" titleId={titleId} />;
  return (
    <>
      <FormHeader title="Start a new project" titleId={titleId} />
      <form className={styles.form} noValidate onSubmit={submit}>
        <input name="intent" type="hidden" value="project" /><input name="topic" type="hidden" value={initialTopic} /><Honeypot id="sales-website" />
        <PersonAndCompanyFields errors={errors} jobTitleRequired namePrefix="sales-" salesPayload />
        <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="sales-message"><span>Tell us about your project and what you want to achieve *</span><textarea aria-describedby={errors.message ? "sales-message-error" : undefined} aria-invalid={Boolean(errors.message)} id="sales-message" maxLength={4000} name="message" rows={4} />{errors.message && <small className={styles.fieldError} id="sales-message-error">{errors.message}</small>}</label>
        <ConsentAndPrivacy /><SubmitArea status={status} />
      </form>
    </>
  );
}

function PartnershipForm({ titleId }: { titleId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data, [["firstName", "firstName"], ["lastName", "lastName"], ["email", "companyEmail"], ["company", "companyName"], ["country", "country"], ["role", "jobTitle"], ["phone", "phoneNumber"], ["partnershipType", "partnershipType"], ["message", "message"]]);
    if (showErrors(form, nextErrors, setErrors)) return;
    setStatus("sending");
    setStatus(await send(data, "partnership"));
  }
  if (status === "success") return <Success kind="partnership" titleId={titleId} />;
  return <><FormHeader title="Partner with Entimema" titleId={titleId} /><form className={styles.form} noValidate onSubmit={submit}><input name="intent" type="hidden" value="partnership" /><Honeypot id="partnership-website" /><PersonAndCompanyFields errors={errors} jobTitleRequired namePrefix="partnership-" salesPayload /><SelectField error={errors.partnershipType} id="partnership-type" label="Partnership type" name="partnershipType" options={partnershipTypes} /><MessageField error={errors.message} id="partnership-message" label="Briefly describe your proposal" /><ConsentAndPrivacy /><SubmitArea status={status} /></form></>;
}

function ClientForm({ titleId }: { titleId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data, [["firstName", "firstName"], ["lastName", "lastName"], ["email", "companyEmail"], ["company", "companyName"], ["phone", "phoneNumber"], ["inquiryType", "inquiryType"], ["message", "message"]]);
    if (showErrors(form, nextErrors, setErrors)) return;
    setStatus("sending");
    setStatus(await send(data, "client"));
  }
  if (status === "success") return <Success kind="client" titleId={titleId} />;
  return <><FormHeader title="Existing Client Support" titleId={titleId} /><form className={styles.form} noValidate onSubmit={submit}><input name="intent" type="hidden" value="client" /><Honeypot id="client-website" /><Field error={errors.firstName} id="client-firstName" label="First name" name="firstName" required /><Field error={errors.lastName} id="client-lastName" label="Last name" name="lastName" required /><Field autoComplete="email" error={errors.email} id="client-email" label="Company email" name="companyEmail" required type="email" /><Field autoComplete="organization" error={errors.company} id="client-company" label="Company name" name="companyName" required /><Field autoComplete="tel" error={errors.phone} id="client-phone" label="Phone number" name="phoneNumber" required type="tel" /><SelectField error={errors.inquiryType} id="client-inquiry-type" label="Inquiry type" name="inquiryType" options={clientInquiryTypes} /><MessageField error={errors.message} id="client-message" label="Description" /><ConsentAndPrivacy marketing={false} /><SubmitArea status={status} /></form></>;
}

function PersonAndCompanyFields({ errors, jobTitleRequired, namePrefix, salesPayload }: { errors: FieldErrors; jobTitleRequired: boolean; namePrefix: string; salesPayload: boolean }) {
  return <><Field error={errors.firstName} id={`${namePrefix}firstName`} label="First name" name="firstName" required /><Field error={errors.lastName} id={`${namePrefix}lastName`} label="Last name" name="lastName" required /><Field autoComplete="email" error={errors.email} id={`${namePrefix}email`} label="Company email" name={salesPayload ? "companyEmail" : "email"} required type="email" /><Field autoComplete="organization" error={errors.company} id={`${namePrefix}company`} label="Company name" name={salesPayload ? "companyName" : "company"} required /><SelectField autoComplete="country-name" error={errors.country} id={`${namePrefix}country`} label="Country" name="country" options={countryOptions} /><Field autoComplete="organization-title" error={errors.role} id={`${namePrefix}role`} label="Job title" name={salesPayload ? "jobTitle" : "role"} required={jobTitleRequired} /><Field autoComplete="tel" error={errors.phone} id={`${namePrefix}phone`} label="Phone number" name={salesPayload ? "phoneNumber" : "phone"} required type="tel" /><Field id={`${namePrefix}referralSource`} label="How did you hear about Entimema?" name="referralSource" /></>;
}

function FormHeader({ title, titleId }: { title: string; titleId: string }) { return <header className={styles.header}><h2 id={titleId}>{title}</h2></header>; }
function Privacy() { return <p className={styles.privacy}>By submitting this form, you agree that Entimema may process the information provided in order to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.</p>; }
function ConsentAndPrivacy({ marketing = true }: { marketing?: boolean }) { return <div className={`${styles.consentArea} ${styles.fullWidth}`}>{marketing && <label className={styles.consent}><input name="marketingConsent" type="checkbox" value="yes" /><span>I agree to receive other communications from Entimema.</span></label>}<Privacy /></div>; }
function SubmitArea({ status }: { status: Status }) { return <>{status === "error" && <p className={`${styles.submitError} ${styles.fullWidth}`} role="alert">We could not send your request. Try again or email us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>}<button className={`${styles.submit} ${styles.fullWidth}`} disabled={status === "sending"} type="submit">{status === "sending" ? "Submitting…" : "Submit"}</button></>; }
function Success({ kind, titleId }: { kind: ModalKind; titleId: string }) { return <div aria-live="polite" className={styles.success}><p className={styles.eyebrow}>{kind === "demo" ? "DISCOVERY REQUEST" : "ENQUIRY RECEIVED"}</p><h2 id={titleId}>{kind === "demo" ? "Thank you" : "Thank you."}</h2><p>{kind === "demo" ? "We’ve received your request and will be in touch shortly." : "We received your inquiry. We will review it and contact you about the next step."}</p></div>; }
function Honeypot({ id }: { id: string }) { return <div className={styles.honeypot} aria-hidden="true"><label htmlFor={id}>Website</label><input autoComplete="off" id={id} name="website" tabIndex={-1} /></div>; }

function Field({ autoComplete, error, id, label, name, required = false, type = "text" }: { autoComplete?: string; error?: string; id: string; label: string; name: string; required?: boolean; type?: string }) {
  const errorId = `${id}-error`;
  return <label className={styles.field} htmlFor={id}><span>{label}{required ? " *" : ""}</span><input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} id={id} maxLength={name === "email" ? 254 : 160} name={name} type={type} />{error && <small className={styles.fieldError} id={errorId}>{error}</small>}</label>;
}

function SelectField({ autoComplete, error, id, label, name, options }: { autoComplete?: string; error?: string; id: string; label: string; name: string; options: readonly string[] }) {
  const errorId = `${id}-error`;
  return <label className={styles.field} htmlFor={id}><span>{label} *</span><select aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} autoComplete={autoComplete} defaultValue="" id={id} name={name} required><option disabled value="">Please select</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{error && <small className={styles.fieldError} id={errorId}>{error}</small>}</label>;
}

function MessageField({ error, id, label }: { error?: string; id: string; label: string }) {
  const errorId = `${id}-error`;
  return <label className={`${styles.field} ${styles.fullWidth}`} htmlFor={id}><span>{label} *</span><textarea aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} id={id} maxLength={4000} name="message" rows={4} />{error && <small className={styles.fieldError} id={errorId}>{error}</small>}</label>;
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

async function send(data: FormData, inquiryType?: ContactKind): Promise<Status> {
  try {
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data.entries())) });
    if (response.ok && inquiryType && response.headers.get("X-Entimema-Submission") === "accepted") trackAnalyticsEvent("contact_submit_success", { inquiry_type: inquiryType });
    return response.ok ? "success" : "error";
  } catch { return "error"; }
}
