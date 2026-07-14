"use client";

import { useEffect, useState } from "react";
import type { RedemptionResult } from "@/lib/types";

function postEvent(type: string, venueSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, venueSlug }),
    keepalive: true,
  }).catch(() => {});
}

type Phase = "idle" | "consent" | "submitting" | "done" | "error";

const ERRORS: Record<string, string> = {
  consent_required: "We need your okay to record the redemption. No personal data is stored.",
  redemption_storage_unconfigured:
    "Redemption isn't switched on yet for this deployment. (Backend not configured.)",
  venue_not_found: "This venue link looks wrong.",
  no_active_perk: "This venue does not have a confirmed offer right now.",
  guest_ref_failed: "Couldn't start your session. Try again.",
  redemption_write_failed: "Couldn't record the redemption. Try again.",
};

export default function RedeemFlow({
  venueSlug,
  venueName,
  perkTitle,
  qrToken,
}: {
  venueSlug: string;
  venueName: string;
  perkTitle: string;
  qrToken: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<RedemptionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fbSent, setFbSent] = useState(false);
  const [dish, setDish] = useState("");

  function sendFeedback(verdict: "worth_it" | "meh") {
    setFbSent(true);
    fetch("/api/dish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueSlug, dish, verdict }),
      keepalive: true,
    }).catch(() => {});
  }

  // Funnel: opening this page is a venue_card_open (§18).
  useEffect(() => {
    postEvent("venue_card_open", venueSlug);
  }, [venueSlug]);

  function startRedeem() {
    postEvent("perk_open", venueSlug);
    setPhase("consent");
  }

  async function submit(consentGranted: boolean) {
    setPhase("submitting");
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueSlug, consentGranted, qrToken }),
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
      <>
        <div className="success-card reveal">
          <div className="success-mark">✓</div>
          <p className="mt-3 text-xl font-bold">Redeemed</p>
          <p className="text-sm opacity-90">
            {perkTitle} · {venueName}
          </p>
          <div className="code-box">
            <p className="text-xs font-bold opacity-80">Show staff</p>
            <p className="font-mono text-3xl font-bold">
              {result.confirmCode}
            </p>
            <p className="mt-1 text-xs opacity-80">
              {result.ts ? new Date(result.ts).toLocaleTimeString() : ""}
            </p>
          </div>
          <p className="mt-3 text-xs opacity-80">Other Bali · +1 for {venueName}</p>
        </div>

        {!fbSent ? (
          <div className="mt-4 rounded-lg border border-[var(--line)] bg-[rgba(255,250,241,0.7)] p-4">
            <p className="text-sm font-bold text-[var(--ink)]">Help other travellers</p>
            <p className="text-xs text-[var(--muted)]">What did you order? Was it worth it?</p>
            <input
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder="e.g. big breakfast"
              className="mt-3 w-full rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-2 text-sm outline-none focus:border-[var(--lagoon)]"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => sendFeedback("worth_it")}
                className="button-primary flex-1"
              >
                Worth it
              </button>
              <button
                onClick={() => sendFeedback("meh")}
                className="button-secondary flex-1"
              >
                Meh
              </button>
            </div>
            <button
              onClick={() => setFbSent(true)}
              className="mt-2 w-full py-1 text-xs text-[var(--muted)]"
            >
              Skip
            </button>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            Thanks! ·{" "}
            <a href="/me" className="quiet-link">
              See my offers
            </a>
          </p>
        )}
      </>
    );
  }

  if (phase === "error") {
    return (
      <div className="mt-5">
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{errorMsg}</div>
        <button
          onClick={() => setPhase("idle")}
          className="button-secondary mt-3 w-full"
        >
          Try again
        </button>
      </div>
    );
  }

  if (phase === "consent") {
    return (
      <div className="mt-5 rounded-lg border border-[var(--line)] bg-[rgba(255,250,241,0.7)] p-4">
        <p className="text-sm leading-6 text-[var(--muted)]">
          We record that this offer was redeemed here, so the venue can see real
          visits. We store an anonymous device token only — no name, email, or
          location.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => submit(true)}
            className="button-primary flex-1"
          >
            Agree & redeem
          </button>
          <button
            onClick={() => setPhase("idle")}
            className="button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startRedeem}
      disabled={phase === "submitting"}
      className="button-primary button-large mt-5 w-full disabled:opacity-60"
    >
      {phase === "submitting" ? "Redeeming…" : "Redeem now — I'm at the venue"}
    </button>
  );
}
