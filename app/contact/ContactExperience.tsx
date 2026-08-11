"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { clientInquiryTypes, isTopicKey, partnershipTypes, topicOptions } from "./contact-config";
import styles from "./contact.module.css";

type Intent = "project" | "partnership" | "client";
type IconProps = { className?: string };

function ProjectIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><path d="M7.5 4.5h11l6 6v17h-17z" /><path d="M18.5 4.5v6h6M11.5 16h9M11.5 21h9" /></svg>;
}

function PartnershipIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><circle cx="7" cy="16" r="3.5" /><circle cx="25" cy="8" r="3.5" /><circle cx="25" cy="24" r="3.5" /><path d="m10.2 14.5 11.6-5M10.2 17.5l11.6 5" /></svg>;
}

function ClientIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><circle cx="13" cy="10" r="5" /><path d="M4.5 27c.6-5.4 3.4-8 8.5-8 3.4 0 5.8 1.2 7.2 3.7M21 16.5l2.5 2.5 5-5" /></svg>;
}

const paths = [
  { intent: "project" as const, title: "New Project", Icon: ProjectIcon },
  { intent: "partnership" as const, title: "Partnerships", Icon: PartnershipIcon },
  { intent: "client" as const, title: "Existing Clients", Icon: ClientIcon },
];

const formContent = {
  project: {
    heading: "Tell us about your project",
    copy: "Briefly describe the context and the problem you want to solve. We will contact you to discuss the appropriate next step.",
    submit: "Send inquiry",
  },
  partnership: {
    heading: "Propose a partnership",
    copy: "Tell us briefly about your organisation and how you see an opportunity to work together.",
    submit: "Send proposal",
  },
  client: {
    heading: "Existing project inquiry",
    copy: "For questions, changes and support related to active Entimema projects and solutions.",
    submit: "Send inquiry",
  },
};

export default function ContactExperience({ initialTopic }: { initialTopic?: string }) {
  const validTopic = initialTopic && isTopicKey(initialTopic) ? initialTopic : undefined;
  const [intent, setIntent] = useState<Intent | null>(validTopic ? "project" : null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const triggerRefs = useRef<Record<Intent, HTMLButtonElement | null>>({ project: null, partnership: null, client: null });

  useEffect(() => {
    if (intent) panelHeading.current?.focus();
  }, [intent]);

  function openForm(nextIntent: Intent) {
    setStatus("idle");
    setIntent(nextIntent);
  }

  function closeForm() {
    const previousIntent = intent;
    setIntent(null);
    setStatus("idle");
    if (previousIntent) requestAnimationFrame(() => triggerRefs.current[previousIntent]?.focus());
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div className={styles.paths} aria-label="Inquiry type">
        {paths.map(({ intent: pathIntent, title, Icon }) => (
          <button
            aria-expanded={intent === pathIntent}
            className={styles.path}
            key={pathIntent}
            onClick={() => openForm(pathIntent)}
            ref={(element) => { triggerRefs.current[pathIntent] = element; }}
            type="button"
          >
            <span className={styles.iconFrame} aria-hidden="true"><Icon className={styles.icon} /></span>
            <span className={styles.title}>{title}</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </button>
        ))}
      </div>

      {intent && (
        <section className={styles.formPanel} aria-labelledby="inquiry-heading">
          <button aria-label="Close form" className={styles.closeButton} onClick={closeForm} type="button">×</button>
          {status === "success" ? (
            <div className={styles.result} aria-live="polite">
              <h2 id="inquiry-heading" ref={panelHeading} tabIndex={-1}>Thank you.</h2>
              <p>We received your inquiry. We will review it and contact you about the next step.</p>
            </div>
          ) : (
            <>
              <header className={styles.formHeader}>
                <h2 id="inquiry-heading" ref={panelHeading} tabIndex={-1}>{formContent[intent].heading}</h2>
                <p>{formContent[intent].copy}</p>
              </header>
              <form className={styles.form} onSubmit={submitForm}>
                <input name="intent" type="hidden" value={intent} />
                <input name="topic" type="hidden" value={validTopic ?? ""} />
                <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Website</label><input autoComplete="off" id="website" name="website" tabIndex={-1} /></div>
                <Field id="name" label="Name" required />
                <Field id="email" label="Work email" required type="email" />
                <Field id="company" label="Company" required={intent !== "project"} />
                {intent !== "client" && <Field id="role" label="Role" />}
                {intent === "project" && (
                  <label className={styles.field} htmlFor="topicName"><span>Topic or service</span><select defaultValue={validTopic ?? ""} id="topicName" name="topicName"><option value="">Select a topic</option>{Object.entries(topicOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                )}
                {intent === "partnership" && <SelectField id="partnershipType" label="Partnership type" options={partnershipTypes} />}
                {intent === "client" && <><Field id="project" label="Project or service" /><SelectField id="inquiryType" label="Inquiry type" options={clientInquiryTypes} /></>}
                <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="message"><span>{intent === "project" ? "What problem do you want to solve?" : intent === "partnership" ? "Briefly describe your proposal" : "Description"} *</span><textarea id="message" maxLength={4000} name="message" required rows={6} /></label>
                <p className={styles.privacy}>We use the information provided only to respond to your inquiry.</p>
                {status === "error" && <p className={styles.error} role="alert">We could not send your inquiry. Try again or email us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>}
                <button className={styles.submitButton} disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : formContent[intent].submit}</button>
              </form>
            </>
          )}
        </section>
      )}

      <p className={styles.emailFallback}>Prefer email? Write to us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>
    </>
  );
}

function Field({ id, label, required = false, type = "text" }: { id: string; label: string; required?: boolean; type?: string }) {
  return <label className={styles.field} htmlFor={id}><span>{label}{required ? " *" : ""}</span><input id={id} maxLength={id === "email" ? 254 : 160} name={id} required={required} type={type} /></label>;
}

function SelectField({ id, label, options }: { id: string; label: string; options: readonly string[] }) {
  return <label className={styles.field} htmlFor={id}><span>{label} *</span><select defaultValue="" id={id} name={id} required><option disabled value="">Select</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
