"use client";

// Route-level error boundary for a venue detail page (audit T0, 2026-07-20).
// If the page still throws during render despite the defensive reads in
// page.tsx, show a calm, on-brand recovery card with a retry instead of the
// bare framework crash screen — and surface the error digest so a production
// failure can be traced in the server logs.
export default function VenueError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-dark venue-page-pad">
      <main className="site-shell">
        <section className="guide-section" style={{ marginTop: 48, textAlign: "center" }}>
          <h1>This place didn&apos;t load</h1>
          <p className="guide-standfirst" style={{ marginTop: 12 }}>
            Something went wrong on our side. Try again in a moment.
          </p>
          <div style={{ marginTop: 20 }}>
            <button type="button" onClick={reset} className="button-primary">
              Try again
            </button>
          </div>
          {error?.digest && (
            <p className="verification-note" style={{ marginTop: 24 }}>
              Reference: {error.digest}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
