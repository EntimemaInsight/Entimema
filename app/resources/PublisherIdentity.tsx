"use client";

import { useEffect, useId, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import styles from "./resources.module.css";

export default function PublisherIdentity() {
  const [open, setOpen] = useState(false);
  const identityRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    cardRef.current?.focus();

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!identityRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.publicationIdentity} ref={identityRef}>
      <button
        ref={triggerRef}
        className={styles.publicationLink}
        type="button"
        aria-label="About Entimema, the publisher"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={cardId}
        onClick={() => setOpen((current) => !current)}
      >
        <BrandLogo compact />
      </button>
      {open ? (
        <div
          ref={cardRef}
          className={styles.publicationCard}
          id={cardId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <div className={styles.publicationCardHeader}>
            <strong id={titleId}>Entimema</strong>
            <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close Entimema publisher information">×</button>
          </div>
          <p>Entimema is a financial and decision systems company working across finance, risk, analytics and applied AI. We design financial architectures, risk models, management information systems and decision frameworks that help organisations turn complex data into controlled, explainable and actionable decisions.</p>
          <p>Our work combines practitioner-grade research with analytical engineering and automation. From financial planning, profitability and management reporting to credit risk, decision intelligence and AI agents, Entimema develops systems that connect models, data and operational decisions into a coherent management architecture.</p>
        </div>
      ) : null}
    </div>
  );
}
