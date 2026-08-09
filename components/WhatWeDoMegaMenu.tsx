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
    category: "Финанси",
    items: [
      {
        title: "CFO функция",
        description: "Финансова архитектура, планиране и управленски контрол за компании без изградена CFO функция.",
        href: "/services/cfo-function",
      },
      {
        title: "Бюджети и прогнози",
        description: "Финансово планиране, основано на данни и бизнес сценарии.",
        href: "/services/budgets-and-forecasting",
      },
      {
        title: "Управленска отчетност",
        description: "Управленска информация за ежедневни решения.",
        href: "/services/management-reporting",
      },
      {
        title: "Себестойност и рентабилност",
        description: "Разходи, маржове и фактори за рентабилност.",
        href: "/services/cost-and-profitability",
      },
      {
        title: "Финансови данни",
        description: "Единна основа за отчетност, анализ и автоматизация.",
        href: "/services/financial-data",
      },
      {
        title: "Финансови AI агенти",
        description: "Автоматизиран анализ и изпълнение във финансовите процеси.",
        href: "/services/financial-ai-agents",
      },
    ],
  },
  {
    category: "Риск",
    items: [
      {
        title: "Кредитен риск",
        description: "Скоринг, политики и модели за кредитни решения.",
        href: "/services/credit-risk",
      },
      {
        title: "AML и съответствие",
        description: "AML архитектура, клиентски проверки и транзакционен мониторинг за последователен регулаторен контрол.",
        href: "/services/aml-compliance",
      },
      {
        title: "Автоматизация на решения",
        description: "Модели, правила и Decision Engine за последователно и контролируемо изпълнение на решения.",
        href: "/services/decision-automation",
      },
      {
        title: "Рискови AI агенти",
        description: "AI агенти за наблюдение, анализ и контролирано изпълнение на рискови процеси.",
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
  const [isPinned, setIsPinned] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(0);
  const [menuTop, setMenuTop] = useState(0);
  const menuTopRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const isDesktopPointer = useCallback(
    () => !mobile && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    [mobile],
  );

  const close = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setIsOpen(false);
    setIsPinned(false);
    setMobileCategory(0);
  }, [clearCloseTimer, clearOpenTimer]);

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

  useEffect(
    () => () => {
      clearOpenTimer();
      clearCloseTimer();
    },
    [clearCloseTimer, clearOpenTimer],
  );

  const handlePointerEnter = () => {
    if (!isDesktopPointer()) return;
    clearCloseTimer();
    if (!isOpen) {
      clearOpenTimer();
      openTimerRef.current = setTimeout(() => setIsOpen(true), 150);
    }
  };

  const handlePointerLeave = () => {
    if (!isDesktopPointer() || isPinned) return;
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleTriggerClick = () => {
    clearOpenTimer();
    clearCloseTimer();
    if (isPinned) {
      close();
      return;
    }
    updateMenuPosition();
    setIsOpen(true);
    setIsPinned(true);
  };

  const handleMobileCategoryKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? serviceGroups.length - 1 : event.key === "ArrowRight" ? (index + 1) % serviceGroups.length : (index - 1 + serviceGroups.length) % serviceGroups.length;
    setMobileCategory(nextIndex);
    document.getElementById(`${menuId}-tab-${nextIndex}`)?.focus();
  };

  const portalContent = isMounted && isOpen ? createPortal(
    <>
      <button
        aria-label="Затвори менюто"
        className={styles.backdrop}
        onClick={close}
        style={{ top: menuTop }}
        tabIndex={-1}
        type="button"
      />
      <nav
        aria-label="Услуги"
        className={styles.menu}
        id={menuId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={menuRef}
        style={{ top: menuTop }}
      >
        <div className={`site-container ${styles.inner}`}>
          <p className={styles.proposition}>Изграждаме финансови и рискови системи за управление, решения и автоматизация.</p>
          {mobile ? (
            <div className={styles.mobileSelector} role="tablist" aria-label="Област на услугите">
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
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`${styles.trigger} ${active ? styles.active : ""}`}
          onClick={handleTriggerClick}
          ref={triggerRef}
          type="button"
        >
          Какво правим
          <span className={styles.chevron} aria-hidden="true" />
        </button>
      </div>
      {portalContent}
    </>
  );
}
