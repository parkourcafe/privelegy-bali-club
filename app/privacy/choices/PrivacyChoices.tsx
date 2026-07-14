"use client";

import { useEffect, useState } from "react";
import { readConsent, setConsent, type ConsentValue } from "@/lib/consent";

// Client control panel for /privacy/choices (audit 2026-07). Reads and changes
// the analytics choice, and unlinks/forgets this device. No login, no
// localStorage — the choice is the bp_consent cookie, identity is the httpOnly
// bp_guest cookie cleared server-side by /api/privacy/forget.
export default function PrivacyChoices() {
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const [busy, setBusy] = useState(false);
  const [forgotten, setForgotten] = useState(false);

  useEffect(() => {
    // Client-only read of the consent cookie after mount (SSR can't see it).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsentState(readConsent());
  }, []);

  function choose(value: ConsentValue) {
    setConsent(value);
    setConsentState(value);
    setForgotten(false);
  }

  async function forget() {
    setBusy(true);
    try {
      await fetch("/api/privacy/forget", { method: "POST" });
    } catch {
      /* best-effort; cookies still cleared on a reachable server */
    }
    setConsentState(null);
    setForgotten(true);
    setBusy(false);
  }

  const stateLabel =
    consent === "granted" ? "On" : consent === "denied" ? "Off" : "Not set";

  return (
    <div className="mt-10 space-y-8 text-[var(--ob-sand-dim)]">
      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
          Analytics
        </h2>
        <p className="mt-3">
          First-party interaction analytics is currently:{" "}
          <span className="font-semibold text-[var(--ob-sand)]">{stateLabel}</span>.
          We never use Google Analytics or third-party trackers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={consent === "granted"}
            onClick={() => choose("granted")}
            className="min-h-11 rounded-full border border-[var(--ob-line)] px-4 py-2 text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:bg-white/5 data-[on=true]:border-[var(--ob-brass)]"
            data-on={consent === "granted"}
          >
            Turn on
          </button>
          <button
            type="button"
            aria-pressed={consent === "denied"}
            onClick={() => choose("denied")}
            className="min-h-11 rounded-full border border-[var(--ob-line)] px-4 py-2 text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:bg-white/5 data-[on=true]:border-[var(--ob-brass)]"
            data-on={consent === "denied"}
          >
            Turn off
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
          Forget this device
        </h2>
        <p className="mt-3">
          Removes the interaction events, saved places, and shared lists tied to
          this device&apos;s anonymous reference, and clears the reference so a
          fresh one is used going forward. Redemption records kept as venue
          proof are retained; to have those removed too, email us below.
        </p>
        <button
          type="button"
          onClick={forget}
          disabled={busy}
          className="mt-4 min-h-11 rounded-full bg-[var(--ob-sand)] px-4 py-2 text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Working…" : "Forget this device"}
        </button>
        {forgotten && (
          <p className="mt-3 text-sm text-[var(--ob-brass)]" role="status">
            Done — this device has been unlinked.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
          Full deletion
        </h2>
        <p className="mt-3">
          To request deletion of everything tied to your device reference,
          including retained records, email{" "}
          <a
            className="inline-flex min-h-11 items-center text-[var(--ob-brass)]"
            href="mailto:support@otherbali.com"
          >
            support@otherbali.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
