import AnalyticsClient from "./AnalyticsClient";

// GA4 is disabled for the first build. It can load only on the canonical
// production deployment when the explicit public release flag is enabled;
// AnalyticsClient then adds the independent browser-consent gate.
const GA_ID = "G-F3TEVWTWX4";
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1";

export default function Analytics() {
  // Vercel's deploy environment is the release boundary: preview builds also
  // use NODE_ENV=production, so NODE_ENV alone would leak QA traffic into the
  // production analytics property whenever the feature flag is enabled.
  if (process.env.VERCEL_ENV !== "production" || !ANALYTICS_ENABLED) return null;
  return <AnalyticsClient measurementId={GA_ID} />;
}
