"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, setConsent, type ConsentValue } from "@/lib/consent";

// First-visit analytics consent (audit 2026-07, privacy P0). Shows only until
// the traveller decides. "Accept" opts in and captures the first landing_open;
// "Essential only" opts out and nothing behavioural is ever logged. The choice
// is changeable any time on /privacy/choices.
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-only one-shot: the consent cookie is unreadable during SSR, so we
    // decide visibility after mount. A single post-mount sync, not a cascading
    // render, so the set-state-in-effect guard is deliberately waived here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: ConsentValue) {
    setConsent(value);
    setVisible(false);
    if (value === "granted") {
      // Capture the session start now that we're allowed to.
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "landing_open" }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  return (
    <>
      {/* Mobile-only dim. On phones the tall hero puts the day-builder under
          the fixed bar, so taps land on the bar and look "dead" — a light dim
          signals "choose first", and tapping it dismisses (essential only). On
          desktop the bar sits below the fold and blocks nothing, so no scrim. */}
      <div
        aria-hidden="true"
        onClick={() => choose("denied")}
        className="fixed inset-0 z-40 bg-[#16100c]/35 md:hidden"
      />
      {/* Compact opt-in bar (founder request: keep it, but small enough not to
          cover half the screen). One tight line of copy + two actions. */}
      <div
        role="dialog"
        aria-label="Analytics choice"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--ob-line)] bg-[var(--ob-espresso-2)]/95 px-4 py-2.5 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-snug text-[var(--ob-sand-dim)]">
            Essential cookies keep saved offers. Optional Google Analytics
            loads only if you accept; it is never used for advertising.{" "}
            <Link href="/privacy" className="text-[var(--ob-brass)] underline underline-offset-2">
              Privacy
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-10 rounded-full border border-[var(--ob-line)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ob-sand)] transition-colors hover:bg-white/5"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-10 rounded-full bg-[var(--ob-sand)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
