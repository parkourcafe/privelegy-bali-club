import AnalyticsClient from "./AnalyticsClient";

// Google Analytics 4 (gtag.js), delegated to <AnalyticsClient/> for the actual
// script injection + SPA page_view tracking.
//
// DISABLED by default (audit 2026-07, privacy P0). No third-party analytics
// ships until a real consent flow exists — loading GA before consent was the
// core App Store 5.1.1 / privacy-label risk. GA now loads ONLY when BOTH:
//   1. the build is production, AND
//   2. NEXT_PUBLIC_ENABLE_ANALYTICS === "1" is set in the environment.
// The first App Store build ships with the flag unset, so no Google script is
// injected and no data reaches Google. To turn it back on later: wire consent
// first, THEN set the env var — do not just flip this line.
const GA_ID = "G-F3TEVWTWX4";
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1";

export default function Analytics() {
  // Privacy gate (audit 2026-07) wins over the plain deploy-env check: GA loads
  // only in a production build AND when explicitly enabled. Flag unset ⇒ nothing
  // loads, window.gtag stays undefined, and lib/analytics' GA leg no-ops.
  if (process.env.NODE_ENV !== "production" || !ANALYTICS_ENABLED) return null;
  return <AnalyticsClient measurementId={GA_ID} />;
}
