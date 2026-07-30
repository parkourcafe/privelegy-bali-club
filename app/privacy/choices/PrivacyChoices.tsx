"use client";

import { useEffect, useState } from "react";
import {
  clearConsent,
  readConsent,
  setConsent,
  type ConsentValue,
} from "@/lib/consent";

// Client control panel for /privacy/choices (audit 2026-07). Reads and changes
// the analytics choice, and unlinks/forgets this device. No login, no
// localStorage — the choice is the bp_consent cookie, identity is the httpOnly
// bp_guest cookie cleared server-side by /api/privacy/forget.
export default function PrivacyChoices() {
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const [busy, setBusy] = useState(false);
  const [forgotten, setForgotten] = useState(false);
  const [forgetError, setForgetError] = useState<string | null>(null);

  useEffect(() => {
    // Client-only read of the consent cookie after mount (SSR can't see it).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsentState(readConsent());
  }, []);

  function choose(value: ConsentValue) {
    setConsent(value);
    setConsentState(value);
    setForgotten(false);
    setForgetError(null);
  }

  async function forget() {
    setBusy(true);
    setForgotten(false);
    setForgetError(null);
    try {
      const response = await fetch("/api/privacy/forget", { method: "POST" });
      if (!response.ok) {
        throw new Error("Deletion could not be confirmed");
      }
      const result = await response.json() as { ok?: unknown };
      if (result.ok !== true) {
        throw new Error("Deletion could not be confirmed");
      }
      clearConsent();
      setConsentState(null);
      setForgotten(true);
    } catch {
      setForgetError(
        "We could not confirm deletion. Nothing is marked as deleted yet; please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const stateLabel =
    consent === "granted" ? "On" : consent === "denied" ? "Off" : "Not set";

  return (
    <div className="mt-10 space-y-8 text-[var(--muted)]">
      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Analytics
        </h2>
        <p className="mt-3">
          Optional, privacy-limited analytics is currently:{" "}
          <span className="font-semibold text-[var(--ink)]">{stateLabel}</span>.
          Google Analytics loads only when this setting is On. Advertising and
          cross-app tracking remain disabled.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={consent === "granted"}
            onClick={() => choose("granted")}
            className="min-h-11 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-white/5 data-[on=true]:border-[var(--lagoon)]"
            data-on={consent === "granted"}
          >
            Turn on
          </button>
          <button
            type="button"
            aria-pressed={consent === "denied"}
            onClick={() => choose("denied")}
            className="min-h-11 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-white/5 data-[on=true]:border-[var(--lagoon)]"
            data-on={consent === "denied"}
          >
            Turn off
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Forget this device
        </h2>
        <p className="mt-3">
          Removes website interaction events, saved places and shared lists,
          plus synced Saved, Today, Trip, note, visited, decision and feed state
          tied to this browser&apos;s pseudonymous guest reference. It then
          clears the reference so a fresh one is used going forward.
          A bare revoked pseudonymous reference and erasure timestamp remain
          indefinitely only to block delayed requests from recreating data.
          Existing redemption proof and its corresponding granted consent
          evidence are detached from the installation reference, stripped of
          device fields such as the consent user agent, and kept for partner
          proof, accounting and applicable legal needs; other guest-linked
          consent rows are deleted. Contact us below for a separately reviewed
          request concerning retained records.
        </p>
        <button
          type="button"
          onClick={forget}
          disabled={busy}
          className="mt-4 min-h-11 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Working…" : "Forget this device"}
        </button>
        {forgotten && (
          <p className="mt-3 text-sm text-[var(--lagoon)]" role="status">
            Done — server deletion was confirmed and this browser has been unlinked.
          </p>
        )}
        {forgetError && (
          <p className="mt-3 text-sm text-red-300" role="alert">
            {forgetError}
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Retained records and support
        </h2>
        <p className="mt-3">
          The mobile app has its own Delete cloud data action because its
          pseudonymous guest reference is separate from this browser. Before
          uninstalling, copy the Anonymous Guest Reference shown in My Bali if
          you may need support to locate undeleted sync state. For retained
          redemption proof, the old reference is intentionally detached and
          cannot locate the proof; send the venue, approximate redemption date
          and confirmation code if available to{" "}
          <a
            className="inline-flex min-h-11 items-center text-[var(--lagoon)]"
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
