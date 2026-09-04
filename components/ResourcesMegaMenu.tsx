"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyDestinations, isCompanyRoute } from "@/lib/company-navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { resourceStreams } from "@/app/resources/resource-data";
import styles from "./ResourcesMegaMenu.module.css";

const subscribeToClientMount = () => () => undefined;

export default function ResourcesMegaMenu({ active = false, variant = "resources" }: { active?: boolean; variant?: "resources" | "company" }) {
  const pathname = usePathname();
  const company = variant === "company";
  const label = company ? "Company" : "Resources";
  const selected = company ? isCompanyRoute(pathname) : active;
  const mounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `${variant}-menu-${useId().replaceAll(":", "")}`;
  const headingId = `${menuId}-heading`;

  const clearTimer = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = null;
  }, []);
  const position = useCallback(() => {
    const header = triggerRef.current?.closest("header");
    if (header) {
      // Fixed portal coordinates account for the existing desktop root zoom.
      const zoom = company ? Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1 : 1;
      setMenuTop(header.getBoundingClientRect().bottom / zoom);
      if (company && triggerRef.current) {
        setMenuLeft(Math.max(24, Math.min(triggerRef.current.getBoundingClientRect().left / zoom, window.innerWidth / zoom - 414)));
      }
    }
  }, [company]);
  const show = useCallback(() => {
    clearTimer();
    position();
    setClosing(false);
    setOpen(true);
  }, [clearTimer, position]);
  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
    setClosing(true);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    exitTimer.current = setTimeout(() => setClosing(false), duration);
  }, [clearTimer]);

  useLayoutEffect(() => {
    if (!open) return;
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    const focusFrame = window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) hide();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (company && event.key === "Tab") {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        const atStart = event.shiftKey && document.activeElement === links?.[0];
        const atEnd = !event.shiftKey && document.activeElement === links?.[links.length - 1];
        if (atStart || atEnd) {
          event.preventDefault();
          hide();
          if (atStart) triggerRef.current?.focus();
          else triggerRef.current?.closest("header")?.querySelector<HTMLAnchorElement>(".header-cta")?.focus();
        }
      }
      if (event.key === "Escape") {
        hide();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [company, hide, open]);

  useEffect(() => clearTimer, [clearTimer]);

  const portal = mounted && (open || closing) ? createPortal(
    <>
      <button aria-label={`Close ${label} menu`} className={styles.backdrop} onClick={hide} style={{ top: menuTop }} tabIndex={-1} type="button" />
      <nav inert={!open} aria-label={company ? "Company" : undefined} aria-labelledby={company ? undefined : headingId} className={`${styles.menu} ${company ? styles.companyMenu : ""} ${closing ? styles.closing : ""}`} id={menuId} ref={menuRef} style={{ top: menuTop, left: company ? menuLeft : undefined }}>
        <div className={company ? styles.companyInner : `site-container ${styles.inner}`}>
          {company ? companyDestinations.map(item => (
            <Link className={styles.companyLink} href={item.href} key={item.href} onClick={hide} aria-current={pathname.replace(/\/$/, "") === item.href ? "page" : undefined}>
              <span><strong>{item.title}</strong><small>{item.description}</small></span><b aria-hidden="true">→</b>
            </Link>
          )) : <>

          <header className={styles.intro}>
            <span>RESOURCES</span>
            <h2 id={headingId}>Research for decisions.<br />Methods for implementation.</h2>
          </header>
          <div className={styles.streams}>
            {Object.entries(resourceStreams).map(([key, stream], index) => (
              <section className={styles.stream} key={key}>
                <span className={styles.number}>0{index + 1}</span>
                <Link className={styles.streamLink} href={stream.href} onClick={hide}>
                  <h3><span>{stream.label}</span><b aria-hidden="true">→</b></h3>
                  <p>{stream.description}</p>
                </Link>
              </section>
            ))}
          </div>
          </>}
        </div>
      </nav>
    </>,
    document.body,
  ) : null;

  return <><div className={styles.root} ref={rootRef}><button aria-current={!company && active ? "page" : undefined} aria-controls={menuId} aria-expanded={open} aria-haspopup="true" className={`${styles.trigger} site-nav__item ${selected ? styles.active : ""}`} onClick={() => { if (open) hide(); else show(); }} ref={triggerRef} type="button">{label} <span aria-hidden="true" /></button></div>{portal}</>;
}
