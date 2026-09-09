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
import { productDestinations, productFeature, resourceDocumentation, serviceGroups } from "@/lib/mega-menu-content";

const subscribeToClientMount = () => () => {};

type WhatWeDoMegaMenuProps = {
  active?: boolean;
  mobile?: boolean;
};

function MenuChevron({ direction = "right" }: { direction?: "down" | "right" }) {
  return <span className={`${styles.mobileChevron} ${direction === "down" ? styles.mobileChevronDown : ""}`} aria-hidden="true" />;
}

export default function WhatWeDoMegaMenu({ active, mobile = false }: WhatWeDoMegaMenuProps) {
  const pathname = usePathname();
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
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
    setMobileProductOpen(false);
    setMobileResourcesOpen(false);
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

    // On mobile the menu position is captured as it opens. Keeping it stable
    // prevents sticky-header geometry from drifting while the menu scrolls.
    if (mobile) return;

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
  }, [isOpen, mobile, updateMenuPosition]);

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
                  aria-controls={`${menuId}-mobile-product`}
                  aria-expanded={mobileProductOpen}
                  className={styles.mobileTopLevel}
                  onClick={() => setMobileProductOpen((current) => !current)}
                  type="button"
                >
                  <span>Product</span>
                  <MenuChevron direction="down" />
                </button>
                <div className={`${styles.mobileResources} ${styles.mobileProduct}`} hidden={!mobileProductOpen} id={`${menuId}-mobile-product`}>
                  <Link className={styles.mobileProductFeature} href={productFeature.href} onClick={close}>
                    <small>{productFeature.label}</small>
                    <strong>{productFeature.title}</strong>
                    <span>{productFeature.description}</span>
                  </Link>
                  {productDestinations.map((item) => (
                    <Link className={styles.mobileResourceDestination} href={item.href} key={item.title} onClick={close}>
                      <span><strong>{item.title}</strong><small>{item.description}</small></span>
                    </Link>
                  ))}
                </div>
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
                            <span><strong>{item.title}</strong><small>{item.description}</small></span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                  <Link className={styles.mobileProductFeature} href={productFeature.href} onClick={close}>
                    <small>{productFeature.label}</small>
                    <strong>{productFeature.title}</strong>
                    <span>{productFeature.description}</span>
                  </Link>
                </div>
                <Link className={styles.mobileTopLevel} href="/agents" onClick={close}>
                  <span>Agent Library</span>
                </Link>
                <button aria-controls={`${menuId}-mobile-resources`} aria-expanded={mobileResourcesOpen} className={`${styles.mobileTopLevel} ${isCompanyRoute(pathname) ? styles.active : ""}`} onClick={() => setMobileResourcesOpen((current) => !current)} type="button">
                  <span>Resources</span><MenuChevron direction="down" />
                </button>
                <div className={styles.mobileResources} hidden={!mobileResourcesOpen} id={`${menuId}-mobile-resources`}>
                  <h2 className={styles.mobileSectionLabel}>Research</h2>
                  {Object.entries(resourceStreams).map(([key, stream]) => (
                    <Link className={styles.mobileResourceDestination} href={stream.href} key={key} onClick={close}>
                      <span><strong>{stream.label}</strong><small>{stream.description}</small></span>
                    </Link>
                  ))}
                  <h2 className={styles.mobileSectionLabel}>Company</h2>
                  {companyDestinations.map(item => <Link className={styles.mobileResourceDestination} href={item.href} key={item.href} onClick={close} aria-current={pathname.replace(/\/$/, "") === item.href ? "page" : undefined}>
                    <span><strong>{item.title}</strong><small>{item.description}</small></span>
                  </Link>)}
                  <h2 className={styles.mobileSectionLabel}>Documentation</h2>
                  {resourceDocumentation.map((item) => (
                    <Link className={styles.mobileResourceDestination} href={item.href} key={item.href} onClick={close}>
                      <span><strong>{item.title}</strong><small>{item.description}</small></span>
                    </Link>
                  ))}
                </div>
                <Link className={`${styles.mobileTopLevel} ${styles.mobileContact}`} href="/contact" onClick={close}>
                  <span>Contact us</span>
                </Link>
              </div>
              <footer className={styles.mobileActionDock}>
                <Link className={styles.mobileDockLogin} href="/auth/sign-in?callbackUrl=%2Fworkspace%2Ffinancial-intelligence" onClick={close}>Login</Link>
                <Link className={styles.mobileDockContact} href="/contact" onClick={close}>Contact us</Link>
              </footer>
            </>
          ) : (
            <>
              <div className={styles.primary}>
                <header className={styles.intro}>
                  <h2>Solutions</h2>
                  <p>Financial and risk systems structured around the decisions they need to improve.</p>
                </header>
                <div className={styles.panels}>
                  {serviceGroups.map((group) => (
                    <section className={styles.panel} key={group.category}>
                      <h2 className={styles.category}>{group.category}</h2>
                      <ul className={styles.items} aria-label={`${group.category} capabilities`}>
                        {group.items.map((item) => (
                          <li key={item.href}><Link className={styles.item} href={item.href} onClick={close}><strong>{item.title}</strong><small>{item.description}</small></Link></li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
              <aside className={styles.featured}>
                <h2 className={styles.category}>{productFeature.label}</h2>
                <Link className={styles.item} href={productFeature.href} onClick={close}>
                  <strong>{productFeature.title}</strong>
                  <small>{productFeature.description}</small>
                </Link>
              </aside>
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
