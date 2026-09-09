"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyDestinations, isCompanyRoute } from "@/lib/company-navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { resourceStreams } from "@/app/resources/resource-data";
import styles from "./ResourcesMegaMenu.module.css";

const subscribeToClientMount = () => () => undefined;

export default function ResourcesMegaMenu({ active = false }: { active?: boolean }) {
  const pathname = usePathname();
  const selected = active || isCompanyRoute(pathname);
  const mounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `resources-menu-${useId().replaceAll(":", "")}`;
  const headingId = `${menuId}-heading`;

  const clearTimer = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = null;
  }, []);
  const position = useCallback(() => {
    const header = triggerRef.current?.closest("header");
    if (header) {
      setMenuTop(header.getBoundingClientRect().bottom);
    }
  }, []);
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
  }, [hide, open]);

  useEffect(() => clearTimer, [clearTimer]);

  const portal = mounted && (open || closing) ? createPortal(
    <>
      <button aria-label="Close Resources menu" className={styles.backdrop} onClick={hide} style={{ top: menuTop }} tabIndex={-1} type="button" />
      <nav inert={!open} aria-labelledby={headingId} className={`${styles.menu} ${closing ? styles.closing : ""}`} id={menuId} ref={menuRef} style={{ top: menuTop }}>
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.intro}>
            <h2 id={headingId}>Resources</h2>
            <p>Research, technical methods and information about Entimema.</p>
          </header>
          <div className={styles.groups}>
            <section className={styles.group}>
              <h3>Research</h3>
              {Object.entries(resourceStreams).map(([key, stream]) => (
                <Link className={styles.item} href={stream.href} key={key} onClick={hide}>
                  <strong>{stream.label}</strong>
                  <small>{stream.description}</small>
                </Link>
              ))}
            </section>
            <section className={styles.group}>
              <h3>Documentation</h3>
              <Link className={styles.item} href="/financial-intelligence-launch#platform" onClick={hide}>
                <strong>Product documentation</strong>
                <small>View Entimema&apos;s product documentation.</small>
              </Link>
              <Link className={styles.item} href="/services/financial-data" onClick={hide}>
                <strong>Integrations</strong>
                <small>Learn about integrations on Entimema.</small>
              </Link>
            </section>
            <section className={styles.group}>
              <h3>Company</h3>
              {companyDestinations.map((item) => (
                <Link className={styles.item} href={item.href} key={item.href} onClick={hide} aria-current={pathname.replace(/\/$/, "") === item.href ? "page" : undefined}>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </Link>
              ))}
            </section>
          </div>
        </div>
      </nav>
    </>,
    document.body,
  ) : null;

  return <><div className={styles.root} ref={rootRef}><button aria-current={selected ? "page" : undefined} aria-controls={menuId} aria-expanded={open} aria-haspopup="true" className={`${styles.trigger} site-nav__item ${selected ? styles.active : ""}`} onClick={() => { if (open) hide(); else show(); }} ref={triggerRef} type="button">Resources <span aria-hidden="true" /></button></div>{portal}</>;
}
