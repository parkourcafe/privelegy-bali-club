import AnalyticsClient from "./AnalyticsClient";

// Google Analytics 4 (gtag.js). Rendered server-side into the initial HTML so
// Google's "verify installation" / tag detector can see it (a client-only,
// post-hydration injection is invisible to that check). Loaded in production
// production deployment only. Vercel previews are production builds too, but
// must not write QA traffic into the live GA property.
const GA_ID = "G-F3TEVWTWX4";

export default function Analytics() {
  if (process.env.VERCEL_ENV !== "production") return null;
  return <AnalyticsClient measurementId={GA_ID} />;
}
