"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_PREFERENCES_EVENT, ANALYTICS_READY_EVENT, ATTRIBUTION_KEY, CURRENT_PATH_KEY, ensureAcquisitionContext, isProductionAnalyticsHost } from "@/lib/analytics";
import styles from "./AnalyticsConsent.module.css";

type Consent = "granted" | "denied" | null;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : null;
const subscribeToClientMount = () => () => undefined;
const readStoredConsent = (): Consent => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch { return null; }
};

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  const enabled = mounted && Boolean(validMeasurementId) && isProductionAnalyticsHost();
  const [consent, setConsent] = useState<Consent>(readStoredConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || consent !== "granted" || !validMeasurementId || initialized.current) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
    window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("js", new Date());
    window.gtag("config", validMeasurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    ensureAcquisitionContext();
    initialized.current = true;
    window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
  }, [consent, enabled]);

  useEffect(() => {
    if (!initialized.current || consent !== "granted" || !window.gtag) return;
    window.gtag("event", "page_view", { page_location: window.location.href, page_path: `${pathname}${window.location.search}`, page_title: document.title });
    const pathTimer = window.setTimeout(() => {
      try { window.sessionStorage.setItem(CURRENT_PATH_KEY, pathname); } catch { /* Storage may be unavailable. */ }
    }, 0);
    return () => window.clearTimeout(pathTimer);
  }, [pathname, consent]);

  const choose = useCallback((choice: Exclude<Consent, null>) => {
    try { window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice); } catch { /* Storage may be unavailable. */ }
    setConsent(choice);
    setPreferencesOpen(false);
    if (choice === "denied") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      try { window.sessionStorage.removeItem(ATTRIBUTION_KEY); } catch { /* Storage may be unavailable. */ }
    } else if (initialized.current) {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
      ensureAcquisitionContext();
      window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
    }
  }, []);

  if (!enabled) return null;
  const consentDialogOpen = consent === null || preferencesOpen;

  return <>
    {consent === "granted" && validMeasurementId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`} strategy="lazyOnload" /> : null}
    {consentDialogOpen ? <section aria-label="Analytics preferences" className={styles.banner} role="dialog">
      <div>
        <strong>Privacy-conscious analytics</strong>
        <p>With your permission, Entimema uses Google Analytics to understand how the website is used and improve the experience. Form contents and uploaded financial data are never shared with Google Analytics.</p>
        <Link className={styles.privacyLink} href="/privacy">Privacy Policy</Link>
      </div>
      <div className={styles.actions}>
        <button className={styles.secondary} onClick={() => choose("denied")} type="button">Decline</button>
        <button className={styles.primary} onClick={() => choose("granted")} type="button">Allow analytics</button>
      </div>
    </section> : <button className={styles.preferencesTrigger} onClick={() => setPreferencesOpen(true)} type="button">Privacy choices</button>}
  </>;
}
