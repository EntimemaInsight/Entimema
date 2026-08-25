"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { resourceStreams } from "@/app/resources/resource-data";
import styles from "./ResourcesMegaMenu.module.css";

const subscribeToClientMount = () => () => undefined;

export default function ResourcesMegaMenu({ active = false }: { active?: boolean }) {
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
    if (header) setMenuTop(header.getBoundingClientRect().bottom);
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
      <nav aria-labelledby={headingId} className={`${styles.menu} ${closing ? styles.closing : ""}`} id={menuId} ref={menuRef} style={{ top: menuTop }}>
        <div className={`site-container ${styles.inner}`}>
          <header className={styles.intro}>
            <span>RESOURCES</span>
            <h2 id={headingId}>Research for decisions.<br />Methods for implementation.</h2>
            <Link className={styles.allResearch} href="/resources" onClick={hide}>View all research <b aria-hidden="true">→</b></Link>
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
        </div>
      </nav>
    </>,
    document.body,
  ) : null;

  return <><div className={styles.root} ref={rootRef}><button aria-controls={menuId} aria-current={active ? "page" : undefined} aria-expanded={open} aria-haspopup="true" className={`${styles.trigger} site-nav__item ${active ? styles.active : ""}`} onClick={() => { if (open) hide(); else show(); }} ref={triggerRef} type="button">Resources <span aria-hidden="true" /></button></div>{portal}</>;
}
