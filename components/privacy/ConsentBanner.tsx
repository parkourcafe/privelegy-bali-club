"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  browserConsentState,
  type StoredConsentState,
} from "@/lib/privacy/consent";
import {
  announceConsent,
  stopAnalyticsImmediately,
} from "@/lib/privacy/browser";
import { withGuestConsentLock, withGuestIdentity } from "@/lib/guest-client";

export async function saveConsent(state: StoredConsentState): Promise<boolean> {
  // Local withdrawal is immediate even if cross-tab coordination or storage
  // is unavailable. The same shutdown is repeated inside the lock when it can
  // be acquired, preserving both fail-safe behavior and response ordering.
  if (state === "essential_only") stopAnalyticsImmediately();
  try {
    const choose = async (signal: AbortSignal) => {
      // Shutdown, server evidence/cookie response and any re-enable event are
      // ordered inside one cross-tab critical section.
      if (state === "essential_only") stopAnalyticsImmediately();
      const response = await fetch("/api/privacy/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
        signal,
      });
      if (!response.ok) return false;
      if (state === "analytics_allowed") announceConsent(state);
      return true;
    };
    return state === "analytics_allowed"
      ? await withGuestIdentity(choose)
      : await withGuestConsentLock(choose);
  } catch {
    return false;
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setVisible(browserConsentState(document.cookie) === "unknown"),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;

  async function choose(state: StoredConsentState) {
    setSaving(true);
    if (await saveConsent(state)) setVisible(false);
    setSaving(false);
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#20160f] p-5 text-sm text-white shadow-2xl" aria-label="Privacy choices">
      <p className="font-semibold">Your privacy, your choice</p>
      <p className="mt-2 text-white/75">
        Essential features work without analytics. Allowing analytics helps us understand which guides are useful.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button disabled={saving} onClick={() => choose("essential_only")} className="min-h-11 rounded-full border border-white/30 px-4 disabled:opacity-50">
          Essential only
        </button>
        <button disabled={saving} onClick={() => choose("analytics_allowed")} className="min-h-11 rounded-full bg-white px-4 font-semibold text-[#20160f] disabled:opacity-50">
          Allow analytics
        </button>
        <Link href="/privacy/choices" className="inline-flex min-h-11 items-center px-2 underline">Details</Link>
      </div>
    </aside>
  );
}
