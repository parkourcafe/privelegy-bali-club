"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { publicErrorReference } from "@/lib/public-error-reference";

type BoundaryError = Error & {
  digest?: string;
  requestId?: unknown;
};

const bodyStyle: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  background: "#16100c",
  color: "#f4ece0",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

const mainStyle: CSSProperties = {
  width: "min(100% - 40px, 760px)",
  minHeight: "100vh",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "48px 0",
  boxSizing: "border-box",
};

const actionStyle: CSSProperties = {
  minHeight: 44,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  padding: "10px 18px",
  font: "inherit",
  fontWeight: 750,
  textDecoration: "none",
  cursor: "pointer",
};

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: BoundaryError;
  unstable_retry: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const reference = publicErrorReference({
    digest: error.digest,
    requestId: error.requestId,
  });

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <html lang="en">
      <body style={bodyStyle}>
        <title>Something went wrong · Other Bali</title>
        <main style={mainStyle} aria-labelledby="global-error-title" role="alert">
          <p style={{ color: "#c69a5c", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Other Bali
          </p>
          <h1
            ref={heading}
            id="global-error-title"
            tabIndex={-1}
            style={{ margin: "16px 0 0", maxWidth: 640, fontFamily: "Georgia, serif", fontSize: "clamp(2.5rem, 8vw, 4rem)", lineHeight: 1.05, outline: "none" }}
          >
            We hit an unexpected detour.
          </h1>
          <p style={{ margin: "22px 0 0", maxWidth: 560, color: "#cdbfa9", fontSize: 18, lineHeight: 1.6 }}>
            Try once more. If the page still does not open, return to the
            guide and continue from there.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{ ...actionStyle, border: "1px solid #f4ece0", background: "#f4ece0", color: "#16100c" }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{ ...actionStyle, border: "1px solid rgba(244,236,224,0.25)", color: "#f4ece0" }}
            >
              Go home
            </Link>
          </div>
          {(reference.requestId || reference.digest) && (
            <p style={{ marginTop: 30, color: "#8c8175", fontSize: 12, overflowWrap: "anywhere" }}>
              Support reference: {reference.requestId ?? reference.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
