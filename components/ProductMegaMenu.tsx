"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./ProductMegaMenu.module.css";

const subscribeToClientMount = () => () => {};

const controlLayers = [
  ["Intelligent Intake", "Ingest and structure financial evidence."],
  ["Financial Context", "Turn source data into decision context."],
  ["Validation Engine", "Apply controls, rules and evidence checks."],
  ["Exception Workspace", "Route material exceptions to human judgment."],
] as const;

export default function ProductMegaMenu({ active = false }: { active?: boolean }) {
  const isMounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const menuTopRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `product-menu-${useId().replaceAll(":", "")}`;

  const updateMenuPosition = useCallback(() => {
    const header = triggerRef.current?.closest("header");
    if (!header) return;
    const nextTop = header.getBoundingClientRect().bottom;
    if (Math.abs(nextTop - menuTopRef.current) > 0.25) {
      menuTopRef.current = nextTop;
      setMenuTop(nextTop);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsClosing(true);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    exitTimerRef.current = setTimeout(() => setIsClosing(false), duration);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  useEffect(() => () => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
  }, []);

  const toggle = () => {
    if (isOpen) return close();
    updateMenuPosition();
    setIsClosing(false);
    setIsOpen(true);
  };

  const portal = isMounted && (isOpen || isClosing) ? createPortal(
    <>
      <button aria-label="Close product menu" className={styles.backdrop} onClick={close} style={{ top: menuTop }} tabIndex={-1} type="button" />
      <nav aria-label="Product" className={`${styles.menu} ${isClosing ? styles.menuClosing : ""}`} id={menuId} ref={menuRef} style={{ top: menuTop }}>
        <div className={`site-container ${styles.inner}`}>
          <Link className={styles.featured} href="/financial-intelligence-launch" onClick={close}>
            <span className={styles.eyebrow}>FOUNDING PILOT · LIVE</span>
            <h2>Financial Intelligence</h2>
            <p>From financial evidence to a controlled, reviewable decision state.</p>
            <span className={styles.featuredAction}>Explore the product <b aria-hidden="true">↗</b></span>
            <span className={styles.signal} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </Link>

          <section className={styles.column}>
            <span className={styles.columnLabel}>PLATFORM</span>
            <Link className={styles.primaryLink} href="/financial-intelligence-launch#platform" onClick={close}>
              <span><strong>Platform overview</strong><small>The complete controlled workflow.</small></span><b aria-hidden="true">→</b>
            </Link>
            <Link className={styles.primaryLink} href="/workspace/financial-intelligence" onClick={close}>
              <span><strong>Decision Workspace</strong><small>Secure client review and execution.</small></span><b aria-hidden="true">→</b>
            </Link>
          </section>

          <section className={styles.column}>
            <span className={styles.columnLabel}>CONTROL LAYERS</span>
            <div className={styles.layers}>
              {controlLayers.map(([title, description], index) => (
                <Link className={styles.layer} href={`/financial-intelligence-launch#platform`} key={title} onClick={close}>
                  <span className={styles.layerNumber}>0{index + 1}</span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <div className={styles.footer}>
          <div className={`site-container ${styles.footerInner}`}>
            <span>Verified business clients · Fixed-scope pilot · From €490</span>
            <Link href="/financial-intelligence-launch#pilot-checkout" onClick={close}>Commission a pilot <b aria-hidden="true">→</b></Link>
          </div>
        </div>
      </nav>
    </>,
    document.body,
  ) : null;

  return (
    <>
      <div className={styles.root} ref={rootRef}>
        <button aria-controls={menuId} aria-expanded={isOpen} aria-haspopup="true" className={`site-nav__item ${styles.trigger} ${active ? styles.active : ""}`} onClick={toggle} ref={triggerRef} type="button">
          Product <span className={styles.chevron} aria-hidden="true" />
        </button>
      </div>
      {portal}
    </>
  );
}
