"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { getTopic, publishedResources } from "@/app/resources/resource-data";
import styles from "./ResourcesMegaMenu.module.css";

const subscribeToClientMount = () => () => undefined;
const featured = publishedResources.find((resource) => resource.featured) ?? publishedResources[0];
const latest = publishedResources.filter((resource) => resource.slug !== featured?.slug).slice(0, 4);
const publishedTopics = [...new Set(publishedResources.map((resource) => resource.topic))]
  .map((slug) => getTopic(slug))
  .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

export default function ResourcesMegaMenu({ active = false }: { active?: boolean }) {
  const mounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `resources-menu-${useId().replaceAll(":", "")}`;

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    openTimer.current = closeTimer.current = exitTimer.current = null;
  }, []);
  const position = useCallback(() => {
    const header = triggerRef.current?.closest("header");
    if (header) setMenuTop(header.getBoundingClientRect().bottom);
  }, []);
  const show = useCallback(() => { if (exitTimer.current) clearTimeout(exitTimer.current); position(); setClosing(false); setOpen(true); }, [position]);
  const hide = useCallback(() => {
    clearTimers(); setOpen(false); setClosing(true); setPinned(false);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    exitTimer.current = setTimeout(() => setClosing(false), duration);
  }, [clearTimers]);
  const enter = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) openTimer.current = setTimeout(show, 150);
  };
  const leave = () => {
    if (pinned || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(hide, 150);
  };

  useLayoutEffect(() => {
    if (!open) return;
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open, position]);
  useEffect(() => {
    if (!open) return;
    const pointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) hide();
    };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { hide(); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", pointer); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", pointer); document.removeEventListener("keydown", key); };
  }, [hide, open]);
  useEffect(() => clearTimers, [clearTimers]);

  const portal = mounted && (open || closing) && featured ? createPortal(<>
    <button aria-label="Close Resources menu" className={styles.backdrop} onClick={hide} style={{ top: menuTop }} tabIndex={-1} type="button" />
    <nav aria-label="Resources discovery" className={`${styles.menu} ${closing ? styles.closing : ""}`} id={menuId} onPointerEnter={enter} onPointerLeave={leave} ref={menuRef} style={{ top: menuTop }}>
      <div className={`site-container ${styles.inner}`}>
        <section className={styles.featured}>
          <span className={styles.label}>FEATURED ANALYSIS</span>
          <Link className={styles.featuredLink} href={featured.canonicalPath} onClick={hide}>
            <span className={styles.miniCover} aria-hidden="true">{featured.cover.stages.map((stage, index) => <i key={stage} style={{ height: `${28 + index * 6}%` }} />)}</span>
            <span className={styles.featuredCopy}><small>{getTopic(featured.topic)?.label} · {featured.readingMinutes} min read</small><strong>{featured.title}</strong><span>Read analysis <b aria-hidden="true">→</b></span></span>
          </Link>
          {latest.length ? <div className={styles.latest}><span className={styles.label}>LATEST ANALYSIS</span>{latest.map((resource) => <Link href={resource.canonicalPath} key={resource.slug} onClick={hide}><span><small>{getTopic(resource.topic)?.label}</small><strong>{resource.title}</strong></span><b aria-hidden="true">→</b></Link>)}</div> : null}
        </section>
        <section className={styles.discovery}>
          <span className={styles.label}>TOPIC DISCOVERY</span>
          <div className={styles.topicLinks}>{publishedTopics.map((topic) => <Link href={`/resources#topic-${topic.slug}`} key={topic.slug} onClick={hide}>{topic.label}<span aria-hidden="true">→</span></Link>)}</div>
          <Link className={styles.allResources} href="/resources" onClick={hide}><span><small>ALL RESOURCES</small><strong>Explore the analytical library</strong></span><b aria-hidden="true">→</b></Link>
        </section>
      </div>
    </nav>
  </>, document.body) : null;

  return <><div className={styles.root} onPointerEnter={enter} onPointerLeave={leave} ref={rootRef}><button aria-controls={menuId} aria-current={active ? "page" : undefined} aria-expanded={open} aria-haspopup="true" className={`${styles.trigger} ${active ? styles.active : ""}`} onClick={() => { clearTimers(); if (pinned) hide(); else { show(); setPinned(true); } }} ref={triggerRef} type="button">RESOURCES <span aria-hidden="true" /></button></div>{portal}</>;
}
