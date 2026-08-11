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
import { getTopic, publishedResources } from "@/app/resources/resource-data";

const subscribeToClientMount = () => () => {};
const featuredResource = publishedResources.find((resource) => resource.featured) ?? publishedResources[0];
const latestResources = publishedResources.filter((resource) => resource.slug !== featuredResource?.slug).slice(0, 3);
const mobileResourceTopics = [...new Set(publishedResources.map((resource) => resource.topic))]
  .map((slug) => getTopic(slug))
  .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

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
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
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
    setMobileSolutionsOpen(false);
    setMobileResourcesOpen(false);
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

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      resizeObserver?.disconnect();
      classObserver.disconnect();
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
            <>
              <div className={styles.mobileMenuHeader}><span>MENU</span></div>
              <div className={styles.mobileSiteNav}>
                <button
                  aria-controls={`${menuId}-mobile-solutions`}
                  aria-expanded={mobileSolutionsOpen}
                  className={styles.mobileTopLevel}
                  onClick={() => setMobileSolutionsOpen((current) => !current)}
                  type="button"
                >
                  <span>SOLUTIONS</span>
                  <span aria-hidden="true">{mobileSolutionsOpen ? "−" : "+"}</span>
                </button>
                <div className={styles.mobileSolutions} hidden={!mobileSolutionsOpen} id={`${menuId}-mobile-solutions`}>
                  {serviceGroups.map((group) => (
                    <section className={styles.mobileGroup} key={group.category}>
                      <h2>{group.category}</h2>
                      <div>
                        {group.items.map((item) => (
                          <Link className={styles.mobileServiceLink} href={item.href} key={item.href} onClick={close}>
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <button aria-controls={`${menuId}-mobile-resources`} aria-expanded={mobileResourcesOpen} className={styles.mobileTopLevel} onClick={() => setMobileResourcesOpen((current) => !current)} type="button">
                  <span>RESOURCES</span><span aria-hidden="true">{mobileResourcesOpen ? "−" : "+"}</span>
                </button>
                <div className={styles.mobileResources} hidden={!mobileResourcesOpen} id={`${menuId}-mobile-resources`}>
                  {featuredResource ? <section className={styles.mobileResourceGroup}>
                    <h2>FEATURED ANALYSIS</h2>
                    <Link className={styles.mobileFeaturedResource} href={featuredResource.canonicalPath} onClick={close}>
                      <span aria-hidden="true">{featuredResource.cover.stages.map((stage, index) => <i key={stage} style={{ height: `${30 + index * 7}%` }} />)}</span>
                      <strong>{featuredResource.title}</strong><small>{getTopic(featuredResource.topic)?.label} · {featuredResource.readingMinutes} min read</small>
                    </Link>
                    {latestResources.map((resource) => <Link className={styles.mobileLatestResource} href={resource.canonicalPath} key={resource.slug} onClick={close}><span><small>{getTopic(resource.topic)?.label}</small><strong>{resource.title}</strong></span><b aria-hidden="true">→</b></Link>)}
                  </section> : null}
                  {mobileResourceTopics.length ? <section className={styles.mobileResourceGroup}><h2>TOPIC DISCOVERY</h2>{mobileResourceTopics.map((topic) => <Link className={styles.mobileServiceLink} href={`/resources#topic-${topic.slug}`} key={topic.slug} onClick={close}>{topic.label}</Link>)}</section> : null}
                  <Link className={styles.mobileAllResources} href="/resources" onClick={close}><span>ALL RESOURCES</span><span aria-hidden="true">→</span></Link>
                </div>
                <Link className={styles.mobileTopLevel} href="/about" onClick={close}>
                  <span>ABOUT</span><span aria-hidden="true">→</span>
                </Link>
                <Link className={`${styles.mobileTopLevel} ${styles.mobileContact}`} href="/contact" onClick={close}>
                  <span>CONTACT US</span><span aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className={styles.proposition}>We build financial and decision systems for control, clarity and action.</p>
              <div className={styles.panels}>
                {serviceGroups.map((group) => (
                  <section className={styles.panel} key={group.category}>
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
            </>
          )}
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
