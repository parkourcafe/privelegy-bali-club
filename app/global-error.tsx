"use client";

import { useEffect } from "react";
import BrandMark from "@/components/BrandMark";

// Last line of defence: catches errors thrown in the root layout itself. It
// replaces the whole document, so it renders its own <html>/<body> and cannot
// rely on globals.css or Tailwind — every style here is inline and
// self-contained so it renders even when the app shell failed to load.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error?.message, error?.digest);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "80px 24px",
          textAlign: "center",
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(198,154,92,.14), transparent 55%), #16100c",
          color: "#f4ece0",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        }}
      >
        <BrandMark style={{ width: 48, height: 48 }} />
        <p
          style={{
            margin: "28px 0 0",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#c69a5c",
          }}
        >
          Other Bali
        </p>
        <h1
          style={{
            margin: "12px 0 0",
            maxWidth: "36ch",
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.1,
            fontFamily: 'Georgia,"Iowan Old Style",serif',
          }}
        >
          Something went sideways.
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            maxWidth: "40ch",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#cdbfa9",
          }}
        >
          A hiccup on our end, not yours. Reload to try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 32,
            minHeight: 44,
            borderRadius: 999,
            border: "none",
            background: "#f4ece0",
            color: "#16100c",
            padding: "12px 26px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
