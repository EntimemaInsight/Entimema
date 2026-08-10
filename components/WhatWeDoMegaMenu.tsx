"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import styles from "./WhatWeDoMegaMenu.module.css";

const subscribeToClientMount = () => () => {};

const serviceGroups = [
  {
    category: "FINANCIAL ARCHITECTURE",
    description: "Build the financial system behind better business decisions.",
    items: [
      {
        title: "CFO Advisory",
        description: "Financial architecture, planning and management control for companies building or strengthening the CFO function.",
        href: "/services/cfo-function",
      },
      {
        title: "Planning & Forecasting",
        description: "Data-driven financial planning built around business drivers and scenarios.",
        href: "/services/budgets-and-forecasting",
      },
      {
        title: "Management Reporting",
        description: "Management information structured for timely, evidence-based decisions.",
        href: "/services/management-reporting",
      },
      {
        title: "Cost & Margin Management",
        description: "Cost structures, margins and profitability drivers made visible and controllable.",
        href: "/services/cost-and-profitability",
      },
      {
        title: "Financial Data",
        description: "A unified data foundation for reporting, analysis and automation.",
        href: "/services/financial-data",
      },
      {
        title: "Finance AI Agents",
        description: "Automated analysis and execution across recurring finance processes.",
        href: "/services/financial-ai-agents",
      },
    ],
  },
  {
    category: "DECISION SCIENCE",
    description: "Measure uncertainty. Understand risk. Make decisions you can defend.",
    items: [
      {
        title: "Credit Risk",
        description: "Scoring, policies and models for consistent credit decisions.",
        href: "/services/credit-risk",
      },
      {
        title: "AML & Compliance",
        description: "AML architecture, customer due diligence and transaction monitoring for consistent regulatory control.",
        href: "/services/aml-compliance",
      },
      {
        title: "Decision Intelligence",
        description: "Models, rules and Decision Engine capabilities for consistent, controlled decision execution.",
        href: "/services/decision-automation",
      },
      {
        title: "Risk AI Agents",
        description: "AI agents for monitoring, analysis and controlled execution across risk processes.",
        href: "/services/risk-ai-agents",
      },
    ],
  },
] as const;

type WhatWeDoMegaMenuProps = {
  active?: boolean;
  mobile?: boolean;
};

export default function WhatWeDoMegaMenu({ active, mobile = false }: WhatWeDoMegaMenuProps) {
  const isMounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(0);
  const [menuTop, setMenuTop] = useState(0);
  const menuTopRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `what-we-do-${useId().replaceAll(":", "")}`;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearExitTimer();
    setIsClosing(false);
    setIsOpen(true);
  }, [clearExitTimer]);

  const isDesktopPointer = useCallback(
    () => !mobile && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    [mobile],
  );

  const close = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setIsOpen(false);
    setIsClosing(true);
    setIsPinned(false);
    setMobileCategory(0);
    clearExitTimer();
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    exitTimerRef.current = setTimeout(() => setIsClosing(false), exitDuration);
  }, [clearCloseTimer, clearExitTimer, clearOpenTimer]);

  const updateMenuPosition = useCallback(() => {
    const header = triggerRef.current?.closest("header");
    if (!header) return;

    const nextTop = header.getBoundingClientRect().bottom;
    if (Math.abs(nextTop - menuTopRef.current) > 0.25) {
      menuTopRef.current = nextTop;
      setMenuTop(nextTop);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    const header = triggerRef.current?.closest("header");
    const resizeObserver = header ? new ResizeObserver(updateMenuPosition) : null;
    if (header) resizeObserver?.observe(header);

    const classObserver = new MutationObserver(updateMenuPosition);
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let animationFrame = 0;
    const trackHeaderPosition = () => {
      updateMenuPosition();
      animationFrame = window.requestAnimationFrame(trackHeaderPosition);
    };
    animationFrame = window.requestAnimationFrame(trackHeaderPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      resizeObserver?.disconnect();
      classObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
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

  useEffect(() => {
    if (!mobile || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mobile]);

  useEffect(
    () => () => {
      clearOpenTimer();
      clearCloseTimer();
      clearExitTimer();
    },
    [clearCloseTimer, clearExitTimer, clearOpenTimer],
  );

  const handlePointerEnter = () => {
    if (!isDesktopPointer()) return;
    clearCloseTimer();
    if (!isOpen) {
      clearOpenTimer();
      openTimerRef.current = setTimeout(open, 150);
    }
  };

  const handlePointerLeave = () => {
    if (!isDesktopPointer() || isPinned) return;
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = setTimeout(close, 150);
  };

  const handleTriggerClick = () => {
    clearOpenTimer();
    clearCloseTimer();
    if (isPinned) {
      close();
      return;
    }
    updateMenuPosition();
    open();
    setIsPinned(true);
  };

  const handleMobileCategoryKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? serviceGroups.length - 1 : event.key === "ArrowRight" ? (index + 1) % serviceGroups.length : (index - 1 + serviceGroups.length) % serviceGroups.length;
    setMobileCategory(nextIndex);
    document.getElementById(`${menuId}-tab-${nextIndex}`)?.focus();
  };

  const portalContent = isMounted && (isOpen || isClosing) ? createPortal(
    <>
      <button
        aria-label="Close menu"
        className={styles.backdrop}
        onClick={close}
        style={{ top: menuTop }}
        tabIndex={-1}
        type="button"
      />
      <nav
        aria-label={mobile ? "Main navigation" : "Solutions"}
        className={`${styles.menu} ${isClosing ? styles.menuClosing : ""}`}
        id={menuId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={menuRef}
        style={{ top: menuTop }}
      >
        <div className={`site-container ${styles.inner}`}>
          {mobile ? (
            <div className={styles.mobileMenuHeader}>
              <span>MENU</span>
            </div>
          ) : null}
          <p className={styles.proposition}>We build financial and decision systems for control, clarity and action.</p>
          {mobile ? (
            <div className={styles.mobileSelector} role="tablist" aria-label="Solution area">
              {serviceGroups.map((group, index) => (
                <button
                  aria-controls={`${menuId}-panel-${index}`}
                  aria-selected={mobileCategory === index}
                  className={mobileCategory === index ? styles.mobileSelectorActive : undefined}
                  id={`${menuId}-tab-${index}`}
                  key={group.category}
                  onClick={() => setMobileCategory(index)}
                  onKeyDown={(event) => handleMobileCategoryKeyDown(event, index)}
                  role="tab"
                  tabIndex={mobileCategory === index ? 0 : -1}
                  type="button"
                >
                  {group.category}
                </button>
              ))}
            </div>
          ) : null}
          <div className={styles.panels}>
            {serviceGroups.map((group, groupIndex) => (
              <section
                aria-labelledby={mobile ? `${menuId}-tab-${groupIndex}` : undefined}
                className={styles.panel}
                hidden={mobile && mobileCategory !== groupIndex}
                id={`${menuId}-panel-${groupIndex}`}
                key={group.category}
                role={mobile ? "tabpanel" : undefined}
              >
                <h2 className={styles.category}>{group.category}</h2>
                <p className={styles.categoryDescription}>{group.description}</p>
                <div className={styles.items}>
                  {group.items.map((item) => (
                    <Link className={styles.item} href={item.href} key={item.href} onClick={close}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDescription}>{item.description}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {mobile ? (
            <div className={styles.mobilePrimaryNav} aria-label="Primary pages">
              <Link href="/#analyses" onClick={close}>RESOURCES</Link>
              <Link href="/about" onClick={close}>ABOUT</Link>
              <Link className={styles.mobileContact} href="/contact" onClick={close}>
                CONTACT US <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </div>
      </nav>
    </>,
    document.body,
  ) : null;

  return (
    <>
      <div
        className={`${styles.root} ${mobile ? styles.mobileRoot : styles.desktopRoot}`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={rootRef}
      >
        <button
          aria-label={mobile ? (isOpen ? "Close main menu" : "Open main menu") : undefined}
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`${styles.trigger} ${active ? styles.active : ""}`}
          onClick={handleTriggerClick}
          ref={triggerRef}
          type="button"
        >
          {mobile ? (
            <span className={styles.menuIcon} aria-hidden="true"><i /><i /><i /></span>
          ) : (
            <>SOLUTIONS <span className={styles.chevron} aria-hidden="true" /></>
          )}
        </button>
      </div>
      {portalContent}
    </>
  );
}
