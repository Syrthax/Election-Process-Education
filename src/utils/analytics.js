// Google Analytics 4 wrapper.
// Initialised from index.html via the gtag snippet; this module is the
// thin React-side API used by the router and components to send events.

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function isAnalyticsEnabled() {
  return Boolean(MEASUREMENT_ID) && typeof window !== 'undefined' && typeof window.gtag === 'function';
}

export function trackPageView(path, title) {
  if (!isAnalyticsEnabled()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(name, params = {}) {
  if (!isAnalyticsEnabled()) return;
  window.gtag('event', name, params);
}
