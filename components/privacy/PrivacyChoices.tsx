"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_EFFECTIVE_DATE,
  ANALYTICS_CONSENT_VERSION,
  browserConsentState,
  type ConsentState,
  type StoredConsentState,
} from "@/lib/privacy/consent";
import { stopAnalyticsImmediately } from "@/lib/privacy/browser";
import { saveConsent } from "./ConsentBanner";
import { withGuestConsentLock } from "@/lib/guest-client";

async function responseErrorCode(response: Response): Promise<string | null> {
  const body: unknown = await response.clone().json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body)
    && typeof (body as { error?: unknown }).error === "string"
    ? (body as { error: string }).error
    : null;
}

export default function PrivacyChoices() {
  const [state, setState] = useState<ConsentState>("unknown");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState<"consent" | "export" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setState(browserConsentState(document.cookie)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function choose(next: StoredConsentState) {
    setDeleted(false);
    setBusy("consent");
    setStatus("Saving…");
    if (await saveConsent(next)) {
      setState(next);
      setStatus("Choice saved.");
    } else {
      if (next === "essential_only") setState("essential_only");
      setStatus(next === "essential_only"
        ? "Analytics is off now. We could not save the withdrawal record; please retry."
        : "Could not save your choice. Please try again.");
    }
    setBusy(null);
  }

  async function exportData() {
    setBusy("export");
    setStatus("Preparing your export…");
    try {
      const response = await fetch("/api/privacy/export", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        if (await responseErrorCode(response) === "legacy_identity_migration_required") {
          setStatus("This browser has a legacy Other Bali reference. It was kept intact; contact support@otherbali.com for the secure export or erasure process before resetting it.");
          return;
        }
        throw new Error("export_unavailable");
      }
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "other-bali-data.json";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
      setStatus("Your data export is ready.");
    } catch {
      setStatus("Could not prepare your export. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteData() {
    // Deletion intent always disables browser analytics locally, even when the
    // coordination backend cannot be acquired and the server call must fail.
    stopAnalyticsImmediately();
    setState("essential_only");
    setBusy("delete");
    setStatus("Deleting your Other Bali data…");
    try {
      await withGuestConsentLock(async (signal) => {
        stopAnalyticsImmediately();
        const response = await fetch("/api/privacy/delete", {
          method: "POST",
          credentials: "same-origin",
          signal,
        });
        if (!response.ok) {
          const error = await responseErrorCode(response);
          throw new Error(error === "legacy_identity_migration_required"
            ? error
            : "delete_unavailable");
        }
        // The server clears identity and consent cookies. Re-assert the
        // identity-free essential-only choice before releasing the cross-tab
        // lock so a delayed earlier grant cannot run afterward.
        stopAnalyticsImmediately();
      });
      setConfirmDelete(false);
      setDeleted(true);
      setStatus("Deletion confirmed. Analytics remains off on this browser.");
    } catch (error) {
      setStatus(error instanceof Error && error.message === "legacy_identity_migration_required"
        ? "Analytics is off. This browser has a legacy Other Bali reference; it was kept intact. Contact support@otherbali.com for the secure erasure process before resetting it."
        : "Analytics is off. Deletion could not be completed; your browser reference was kept so you can retry.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-2xl border border-white/15 p-5" aria-labelledby="essential-choice">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="essential-choice" className="font-display text-2xl font-semibold">Essential functionality</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">Always on</span>
        </div>
        <p className="mt-3 text-[var(--ob-sand-dim)]">Planning, places, routes, directions and booking handoffs work without analytics.</p>
      </section>

      <section className="rounded-2xl border border-white/15 p-5" aria-labelledby="analytics-choice">
        <h2 id="analytics-choice" className="font-display text-2xl font-semibold">Analytics</h2>
        <p className="mt-3">Current choice: <strong>{state === "unknown" ? "Not chosen" : state === "analytics_allowed" ? "Allowed" : "Essential only"}</strong></p>
        <p className="mt-2 text-[var(--ob-sand-dim)]">Optional first-party usage events are linked to this browser&apos;s random reference until you delete them. Withdrawing stops new events immediately.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={state === "analytics_allowed"}
            disabled={busy !== null}
            className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/30 px-4 disabled:opacity-50"
            onClick={() => choose(state === "analytics_allowed" ? "essential_only" : "analytics_allowed")}
          >
            <span aria-hidden="true" className={`h-5 w-9 rounded-full p-0.5 ${state === "analytics_allowed" ? "bg-emerald-400" : "bg-white/20"}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${state === "analytics_allowed" ? "translate-x-4" : ""}`} />
            </span>
            {state === "analytics_allowed" ? "Analytics on — withdraw" : "Analytics off — allow"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/15 p-5" aria-labelledby="processors">
        <h2 id="processors" className="font-display text-2xl font-semibold">Services involved</h2>
        <p className="mt-3 text-[var(--ob-sand-dim)]">Vercel hosts the website and API; Supabase stores Other Bali records. Google Analytics is disabled for the first build.</p>
        <p className="mt-3 text-sm text-[var(--ob-sand-dim)]">Consent version {ANALYTICS_CONSENT_VERSION}, effective {ANALYTICS_CONSENT_EFFECTIVE_DATE}.</p>
        <Link href="/privacy" className="mt-3 inline-flex min-h-11 items-center text-[var(--ob-brass)] underline">Read the full privacy policy</Link>
      </section>

      <section className="rounded-2xl border border-white/15 p-5" aria-labelledby="your-data">
        <h2 id="your-data" className="font-display text-2xl font-semibold">Your Other Bali data</h2>
        <p className="mt-3 text-[var(--ob-sand-dim)]">Export the data linked to this browser, or permanently delete and anonymise it. Deletion retains only a one-way reference hash as a safety barrier against delayed recreation.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button disabled={busy !== null} className="min-h-11 rounded-full border border-white/30 px-4 disabled:opacity-50" onClick={exportData}>{busy === "export" ? "Preparing…" : "Export my data"}</button>
          {!confirmDelete ? (
            <button disabled={busy !== null} className="min-h-11 rounded-full border border-red-300/60 px-4 text-red-100 disabled:opacity-50" onClick={() => { setConfirmDelete(true); setDeleted(false); setStatus("Confirm permanent deletion below."); }}>Delete my Other Bali data</button>
          ) : null}
        </div>
        {confirmDelete ? (
          <div className="mt-4 rounded-xl border border-red-300/40 bg-red-950/30 p-4" role="group" aria-labelledby="delete-confirmation">
            <p id="delete-confirmation" className="font-semibold">Permanently delete data linked to this browser?</p>
            <p className="mt-2 text-sm text-[var(--ob-sand-dim)]">This cannot be undone. Analytics will be withdrawn before the request is sent.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button disabled={busy !== null} className="min-h-11 rounded-full bg-red-100 px-4 font-semibold text-red-950 disabled:opacity-50" onClick={deleteData}>{busy === "delete" ? "Deleting…" : "Yes, permanently delete"}</button>
              <button disabled={busy !== null} className="min-h-11 rounded-full border border-white/30 px-4 disabled:opacity-50" onClick={() => { setConfirmDelete(false); setStatus("Deletion cancelled."); }}>Cancel</button>
            </div>
          </div>
        ) : null}
        {deleted ? <p className="mt-4 font-semibold text-emerald-200" role="status">Deletion confirmed</p> : null}
      </section>

      <p aria-live="polite" className="min-h-6">{status}</p>
    </div>
  );
}
