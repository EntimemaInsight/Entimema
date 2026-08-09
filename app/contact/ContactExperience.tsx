"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { isTopicKey, topicOptions } from "./contact-config";
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
  { intent: "project" as const, title: "Нов проект", Icon: ProjectIcon },
  { intent: "partnership" as const, title: "Партньорства", Icon: PartnershipIcon },
  { intent: "client" as const, title: "Текущи клиенти", Icon: ClientIcon },
];

const partnershipTypes = [
  "Технологичен партньор",
  "Доставчик на данни или софтуер",
  "Консултантски партньор",
  "Академично / изследователско партньорство",
  "Канал / referral партньор",
  "Друго",
];

const clientInquiryTypes = [
  "Технически въпрос",
  "Данни / модел",
  "Промяна по текущ проект",
  "Достъп / документация",
  "Друго",
];

const formContent = {
  project: {
    heading: "Разкажете ни за проекта",
    copy: "Опишете накратко контекста и проблема, който искате да решите. Ще се свържем с вас, за да обсъдим подходящата следваща стъпка.",
    submit: "Изпратете запитването",
  },
  partnership: {
    heading: "Предложете партньорство",
    copy: "Разкажете накратко за организацията си и начина, по който виждате възможност за съвместна работа.",
    submit: "Изпратете предложението",
  },
  client: {
    heading: "Запитване по текущ проект",
    copy: "За въпроси, промени и съдействие по активни проекти и решения на Entimema.",
    submit: "Изпратете запитването",
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
      <div className={styles.paths} aria-label="Вид запитване">
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
          <button aria-label="Затворете формата" className={styles.closeButton} onClick={closeForm} type="button">×</button>
          {status === "success" ? (
            <div className={styles.result} aria-live="polite">
              <h2 id="inquiry-heading" ref={panelHeading} tabIndex={-1}>Благодарим.</h2>
              <p>Получихме запитването ви. Ще го разгледаме и ще се свържем с вас относно следващата стъпка.</p>
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
                <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Уебсайт</label><input autoComplete="off" id="website" name="website" tabIndex={-1} /></div>
                <Field id="name" label="Име" required />
                <Field id="email" label="Служебен e-mail" required type="email" />
                <Field id="company" label="Компания" required={intent !== "project"} />
                {intent !== "client" && <Field id="role" label="Длъжност" />}
                {intent === "project" && (
                  <label className={styles.field} htmlFor="topicName"><span>Тема / услуга</span><select defaultValue={validTopic ?? ""} id="topicName" name="topicName"><option value="">Изберете тема</option>{Object.entries(topicOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                )}
                {intent === "partnership" && <SelectField id="partnershipType" label="Тип партньорство" options={partnershipTypes} />}
                {intent === "client" && <><Field id="project" label="Проект / услуга" /><SelectField id="inquiryType" label="Тип запитване" options={clientInquiryTypes} /></>}
                <label className={`${styles.field} ${styles.fullWidth}`} htmlFor="message"><span>{intent === "project" ? "Какъв проблем искате да решите?" : intent === "partnership" ? "Разкажете накратко за предложението" : "Описание"} *</span><textarea id="message" maxLength={4000} name="message" required rows={6} /></label>
                <p className={styles.privacy}>Използваме предоставената информация единствено, за да отговорим на запитването ви.</p>
                {status === "error" && <p className={styles.error} role="alert">Не успяхме да изпратим запитването. Опитайте отново или ни пишете на <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>}
                <button className={styles.submitButton} disabled={status === "sending"} type="submit">{status === "sending" ? "Изпращане…" : formContent[intent].submit}</button>
              </form>
            </>
          )}
        </section>
      )}

      <p className={styles.emailFallback}>Предпочитате e-mail? Пишете ни на <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>
      <section className={styles.nextStep} aria-labelledby="next-step-title"><h2 id="next-step-title">Какво следва</h2><p>Първият разговор е за контекста, проблема и обхвата. След него определяме подходящата следваща стъпка.</p></section>
    </>
  );
}

function Field({ id, label, required = false, type = "text" }: { id: string; label: string; required?: boolean; type?: string }) {
  return <label className={styles.field} htmlFor={id}><span>{label}{required ? " *" : ""}</span><input id={id} maxLength={id === "email" ? 254 : 160} name={id} required={required} type={type} /></label>;
}

function SelectField({ id, label, options }: { id: string; label: string; options: string[] }) {
  return <label className={styles.field} htmlFor={id}><span>{label} *</span><select defaultValue="" id={id} name={id} required><option disabled value="">Изберете</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
