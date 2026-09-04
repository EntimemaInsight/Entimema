"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyDestinations, isCompanyRoute } from "@/lib/company-navigation";
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
import { resourceStreams } from "@/app/resources/resource-data";

const subscribeToClientMount = () => () => {};
const serviceGroups = [
  {
    category: "Financial Architecture",
    description: "Build the financial system behind control, planning and performance.",
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
    category: "Decision Science",
    description: "Measure uncertainty and build controlled decision systems.",
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

function MenuChevron({ direction = "right" }: { direction?: "down" | "right" }) {
  return <span className={`${styles.mobileChevron} ${direction === "down" ? styles.mobileChevronDown : ""}`} aria-hidden="true" />;
}

export default function WhatWeDoMegaMenu({ active, mobile = false }: WhatWeDoMegaMenuProps) {
  const pathname = usePathname();
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const isMounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const menuTopRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `what-we-do-${useId().replaceAll(":", "")}`;

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

  const close = useCallback(() => {
    setIsOpen(false);
    setIsClosing(true);
    setMobileSolutionsOpen(false);
    setMobileResourcesOpen(false);
    setMobileCompanyOpen(false);
    clearExitTimer();
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    exitTimerRef.current = setTimeout(() => setIsClosing(false), exitDuration);
  }, [clearExitTimer]);

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
      clearExitTimer();
    },
    [clearExitTimer],
  );

  const handleTriggerClick = () => {
    if (isOpen) {
      close();
      return;
    }
    updateMenuPosition();
    open();
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
        ref={menuRef}
        style={{ top: menuTop }}
      >
        <div className={`site-container ${styles.inner}`}>
          {mobile ? (
            <>
              <div className={styles.mobileSiteNav}>
                <button
                  aria-controls={`${menuId}-mobile-solutions`}
                  aria-expanded={mobileSolutionsOpen}
                  className={styles.mobileTopLevel}
                  onClick={() => setMobileSolutionsOpen((current) => !current)}
                  type="button"
                >
                  <span>Solutions</span>
                  <MenuChevron direction="down" />
                </button>
                <div className={styles.mobileSolutions} hidden={!mobileSolutionsOpen} id={`${menuId}-mobile-solutions`}>
                  {serviceGroups.map((group) => (
                    <section className={styles.mobileGroup} key={group.category}>
                      <h2>{group.category}</h2>
                      <div>
                        {group.items.map((item) => (
                          <Link className={styles.mobileServiceLink} href={item.href} key={item.href} onClick={close}>
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <Link className={styles.mobileTopLevel} href="/agents" onClick={close}>
                  <span>Agent Library</span>
                </Link>
                <button aria-controls={`${menuId}-mobile-resources`} aria-expanded={mobileResourcesOpen} className={styles.mobileTopLevel} onClick={() => setMobileResourcesOpen((current) => !current)} type="button">
                  <span>Resources</span><MenuChevron direction="down" />
                </button>
                <div className={styles.mobileResources} hidden={!mobileResourcesOpen} id={`${menuId}-mobile-resources`}>
                  {Object.entries(resourceStreams).map(([key, stream]) => (
                    <Link className={styles.mobileResourceDestination} href={stream.href} key={key} onClick={close}>
                      <span><strong>{stream.label}</strong><small>{stream.description}</small></span>
                    </Link>
                  ))}
                </div>
                <button aria-controls={`${menuId}-mobile-company`} aria-expanded={mobileCompanyOpen} className={`${styles.mobileTopLevel} ${isCompanyRoute(pathname) ? styles.active : ""}`} onClick={() => setMobileCompanyOpen(current => !current)} type="button">
                  <span>Company</span><MenuChevron direction="down" />
                </button>
                <div className={styles.mobileResources} hidden={!mobileCompanyOpen} id={`${menuId}-mobile-company`}>
                  {companyDestinations.map(item => <Link className={styles.mobileResourceDestination} href={item.href} key={item.href} onClick={close} aria-current={pathname.replace(/\/$/, "") === item.href ? "page" : undefined}>
                    <span><strong>{item.title}</strong><small>{item.description}</small></span>
                  </Link>)}
                </div>
                <Link className={`${styles.mobileTopLevel} ${styles.mobileContact}`} href="/contact" onClick={close}>
                  <span>Contact us</span>
                </Link>
              </div>
              <footer className={styles.mobileActionDock}>
                <Link className={styles.mobileDockContact} href="/contact" onClick={close}>Contact us</Link>
              </footer>
            </>
          ) : (
            <>
              <header className={styles.intro}>
                <span>SOLUTIONS</span>
                <h2>Systems for better<br />financial decisions.</h2>
              </header>
              <div className={styles.panels}>
                {serviceGroups.map((group, index) => (
                  <section className={styles.panel} key={group.category}>
                    <span className={styles.number}>0{index + 1}</span>
                    <h2 className={styles.category}>{group.category}</h2>
                    <p className={styles.categoryDescription}>{group.description}</p>
                    <ul className={styles.items} aria-label={`${group.category} capabilities`}>
                      {group.items.map((item) => (
                        <li key={item.href}><Link className={styles.item} href={item.href} onClick={close}><span>{item.title}</span><b aria-hidden="true">→</b></Link></li>
                      ))}
                    </ul>
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
        ref={rootRef}
      >
        <button
          aria-label={mobile ? (isOpen ? "Close main menu" : "Open main menu") : undefined}
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`${styles.trigger} ${mobile ? "" : "site-nav__item"} ${active ? styles.active : ""}`}
          onClick={handleTriggerClick}
          ref={triggerRef}
          type="button"
        >
          {mobile ? (
            <span className={styles.menuIcon} aria-hidden="true"><i /><i /><i /></span>
          ) : (
            <>Solutions <span className={styles.chevron} aria-hidden="true" /></>
          )}
        </button>
      </div>
      {portalContent}
    </>
  );
}
