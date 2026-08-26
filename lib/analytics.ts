export const ANALYTICS_CONSENT_KEY = "entimema_analytics_consent";
export const ANALYTICS_READY_EVENT = "entimema:analytics-ready";
export const ANALYTICS_PREFERENCES_EVENT = "entimema:analytics-preferences";
export const ATTRIBUTION_KEY = "entimema_acquisition";
export const CURRENT_PATH_KEY = "entimema_current_path";

export type AnalyticsEventName = "resource_view" | "related_capability_click" | "contact_view" | "contact_submit_success";
type EventParameters = Record<string, string | number | boolean | undefined>;
type AcquisitionContext = {
  source_category: "organic_search" | "organic_social" | "direct" | "referral" | "campaign";
  landing_page: string;
  referrer_host?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const safeCampaignValue = (value: string | null) => value?.trim().toLowerCase().slice(0, 100) || undefined;

export function isProductionAnalyticsHost() {
  return typeof window !== "undefined" && window.location.hostname === "www.entimema.com";
}

export function hasAnalyticsConsent() {
  try { return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted"; } catch { return false; }
}

export function createAcquisitionContext(): AcquisitionContext {
  const query = new URLSearchParams(window.location.search);
  const utmSource = safeCampaignValue(query.get("utm_source"));
  const utmMedium = safeCampaignValue(query.get("utm_medium"));
  const utmCampaign = safeCampaignValue(query.get("utm_campaign"));
  const utmContent = safeCampaignValue(query.get("utm_content"));
  let referrerHost: string | undefined;
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : undefined; } catch { referrerHost = undefined; }

  let sourceCategory: AcquisitionContext["source_category"] = "direct";
  if (utmSource === "linkedin" && utmMedium === "organic_social") sourceCategory = "organic_social";
  else if (utmSource || utmMedium || utmCampaign) sourceCategory = "campaign";
  else if (referrerHost && /(^|\.)(google|bing|duckduckgo|yahoo)\./.test(referrerHost)) sourceCategory = "organic_search";
  else if (referrerHost && !/(^|\.)entimema\.com$/.test(referrerHost)) sourceCategory = "referral";

  return { source_category: sourceCategory, landing_page: window.location.pathname, referrer_host: referrerHost, utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign, utm_content: utmContent };
}

export function ensureAcquisitionContext() {
  try {
    const existing = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (existing) return JSON.parse(existing) as AcquisitionContext;
    const context = createAcquisitionContext();
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(context));
    return context;
  } catch { return createAcquisitionContext(); }
}

export function trackAnalyticsEvent(eventName: AnalyticsEventName, parameters: EventParameters = {}) {
  if (!isProductionAnalyticsHost() || !hasAnalyticsConsent() || !window.gtag) return false;
  window.gtag("event", eventName, { ...ensureAcquisitionContext(), ...parameters });
  return true;
}

export function previousInternalPath() {
  try { return window.sessionStorage.getItem(CURRENT_PATH_KEY) || ""; } catch { return ""; }
}
