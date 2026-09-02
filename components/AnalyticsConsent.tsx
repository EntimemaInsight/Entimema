"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_PREFERENCES_EVENT, ANALYTICS_READY_EVENT, ATTRIBUTION_KEY, CURRENT_PATH_KEY, ensureAcquisitionContext, isProductionAnalyticsHost } from "@/lib/analytics";
import BrandLogo from "./BrandLogo";
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
  const [analyticsSelected, setAnalyticsSelected] = useState(() => readStoredConsent() === "granted");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const openPreferences = () => {
      setAnalyticsSelected(readStoredConsent() === "granted");
      setPreferencesOpen(true);
    };
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
    {consentDialogOpen ? <div className={styles.backdrop}>
      <section aria-labelledby="privacy-preferences-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><span className={styles.eyebrow}>Privacy at Entimema</span><h2 id="privacy-preferences-title">This Website Processes Personal Data</h2></div>
          {consent !== null ? <button aria-label="Close privacy choices" className={styles.closeButton} onClick={() => setPreferencesOpen(false)} type="button"><span aria-hidden="true">×</span></button> : null}
        </header>
        <div className={styles.modalBody}>
          <div className={styles.intro}>
            <h3>Your Privacy Choices</h3>
            <p>Choose whether Entimema may use privacy-conscious analytics to understand website use and improve the experience. Form contents and uploaded financial data are never shared with Google Analytics. Learn more in our <Link className={styles.privacyLink} href="/privacy">Privacy Policy</Link>.</p>
          </div>
          <div className={styles.preferenceList}>
            <div className={styles.preferenceRow}>
              <div><strong>Essential services</strong><span>Required for security and core website functions.</span></div>
              <div className={styles.preferenceControl}><span className={styles.alwaysActive}>Always active</span><span aria-hidden="true" className={`${styles.switch} ${styles.switchLocked}`}><span /></span></div>
            </div>
            <div className={styles.preferenceRow}>
              <div><strong>Data analytics</strong><span>Helps us understand website use without sending form contents.</span></div>
              <div className={styles.preferenceControl}><span>{analyticsSelected ? "Allowed" : "Opted out"}</span><button aria-checked={analyticsSelected} aria-label="Allow analytics" className={styles.switch} onClick={() => setAnalyticsSelected((selected) => !selected)} role="switch" type="button"><span /></button></div>
            </div>
          </div>
          <footer className={styles.modalFooter}>
            <div className={styles.brand}><BrandLogo compact /></div>
            <button className={styles.primary} onClick={() => choose(analyticsSelected ? "granted" : "denied")} type="button">Save preferences</button>
          </footer>
        </div>
      </section>
    </div> : <button aria-label="Open privacy choices" className={styles.preferencesTrigger} onClick={() => { setAnalyticsSelected(consent === "granted"); setPreferencesOpen(true); }} title="Privacy choices" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3.25a8.75 8.75 0 0 0-8.75 8.75M12 6a6 6 0 0 0-6 6c0 1.5-.2 3.34-1.15 5.23M12 8.75A3.25 3.25 0 0 0 8.75 12c0 3.1-.65 5.78-2.1 8.15M12 11.25a.75.75 0 0 0-.75.75c0 3.75-.72 6.72-2.1 8.75M14.75 12c0 4.45-.74 7.43-1.72 9M17.5 12c0 3.85-.48 6.8-1.22 9M20.25 12A8.25 8.25 0 0 0 12 3.75" /></svg></button>}
  </>;
}
