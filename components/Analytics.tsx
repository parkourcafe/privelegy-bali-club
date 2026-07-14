import AnalyticsClient from "./AnalyticsClient";

// GA4 is disabled for the first build. It can load only on the canonical
// production deployment when the explicit public release flag is enabled;
// AnalyticsClient then adds the independent browser-consent gate.
const GA_ID = "G-F3TEVWTWX4";
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1";

export default function Analytics() {
  if (process.env.VERCEL_ENV !== "production" || !ANALYTICS_ENABLED) return null;
  return <AnalyticsClient measurementId={GA_ID} />;
}
