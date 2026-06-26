"use client";

import { useState } from "react";
import { getOrCreateGuestRef } from "@/lib/guest";
import type { RedemptionResult } from "@/lib/types";

type Phase = "idle" | "consent" | "submitting" | "done" | "error";

const ERRORS: Record<string, string> = {
  consent_required: "We need your okay to record the redemption. No personal data is stored.",
  redemption_storage_unconfigured:
    "Redemption isn't switched on yet for this deployment. (Backend not configured.)",
  venue_not_found: "This venue link looks wrong.",
  guest_ref_failed: "Couldn't start your session. Try again.",
  redemption_write_failed: "Couldn't record the redemption. Try again.",
};

export default function RedeemFlow({
  venueSlug,
  venueName,
  perkTitle,
}: {
  venueSlug: string;
  venueName: string;
  perkTitle: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<RedemptionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function submit(consentGranted: boolean) {
    setPhase("submitting");
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestRef: getOrCreateGuestRef(),
          venueSlug,
          consentGranted,
        }),
      });
      const data: RedemptionResult = await res.json();
      if (data.ok) {
        setResult(data);
        setPhase("done");
      } else {
        setErrorMsg(ERRORS[data.error ?? ""] ?? "Something went wrong.");
        setPhase("error");
      }
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setPhase("error");
    }
  }

  if (phase === "done" && result) {
    return (
      <div className="mt-5 rounded-2xl bg-emerald-600 p-6 text-center text-white">
        <div className="text-5xl">✓</div>
        <p className="mt-2 text-lg font-semibold">Redeemed</p>
        <p className="text-sm opacity-90">
          {perkTitle} · {venueName}
        </p>
        <div className="mt-4 rounded-xl bg-white/15 py-3">
          <p className="text-xs uppercase tracking-widest opacity-80">Show staff</p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em]">
            {result.confirmCode}
          </p>
          <p className="mt-1 text-xs opacity-80">
            {result.ts ? new Date(result.ts).toLocaleTimeString() : ""}
          </p>
        </div>
        <p className="mt-3 text-xs opacity-80">Bali Privilege · +1 for {venueName}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mt-5">
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMsg}</div>
        <button
          onClick={() => setPhase("idle")}
          className="mt-3 w-full rounded-xl border border-stone-200 py-3 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (phase === "consent") {
    return (
      <div className="mt-5 rounded-xl border border-stone-200 p-4">
        <p className="text-sm text-stone-700">
          We record that this perk was redeemed here, so the venue can see real
          visits. We store an anonymous device token only — no name, email, or
          location.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => submit(true)}
            className="flex-1 rounded-xl bg-cyan-700 py-3 font-semibold text-white hover:bg-cyan-800"
          >
            Agree & redeem
          </button>
          <button
            onClick={() => setPhase("idle")}
            className="rounded-xl border border-stone-200 px-4 py-3 text-stone-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setPhase("consent")}
      disabled={phase === "submitting"}
      className="mt-5 w-full rounded-xl bg-cyan-700 py-4 text-lg font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
    >
      {phase === "submitting" ? "Redeeming…" : "Redeem now — I'm at the venue"}
    </button>
  );
}
