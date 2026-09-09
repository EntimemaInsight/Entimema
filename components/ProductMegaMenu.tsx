"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { productDestinations, productFeature } from "@/lib/mega-menu-content";
import styles from "./ProductMegaMenu.module.css";

const subscribeToClientMount = () => () => {};

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
          <div className={styles.primary}>
            <header className={styles.intro}>
              <h2>Product</h2>
              <p>Controlled financial workflows built for traceable, defensible decisions.</p>
            </header>
            <section className={styles.platform}>
              <h3>Product</h3>
              <div className={styles.links}>
                {productDestinations.map((item) => (
                  <Link className={styles.item} href={item.href} key={item.title} onClick={close}>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <aside className={styles.featured}>
            <h3>{productFeature.label}</h3>
            <Link href={productFeature.href} onClick={close}>
              <strong>{productFeature.title}</strong>
              <small>{productFeature.description}</small>
            </Link>
          </aside>
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
