"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// 48-hours guide lead form (brief §18).
// - consent is NOT preselected;
// - validation + loading/error/success states;
// - honeypot field ("website") for spam;
// - duplicate submissions are handled server-side (update, not multiply);
// - honest success copy: no delivery provider is wired yet, so we never say
//   "sent" — the guide is on the page, and the traveller can push the link
//   to their own WhatsApp.

const INTERESTS = [
  { key: "surf", label: "Surf mornings" },
  { key: "food", label: "Food-led days" },
  { key: "sunset", label: "Sunset spots" },
  { key: "beach", label: "Beach clubs" },
  { key: "family", label: "With kids" },
  { key: "work", label: "Work-friendly cafés" },
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; duplicate: boolean }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  consent_required: "Please tick the consent box so we're allowed to keep your details.",
  name_required: "Add your first name so we know who the guide is for.",
  bad_email: "That email doesn't look complete — check it and try again.",
  bad_whatsapp: "That WhatsApp number doesn't look right — digits only, with country code.",
  lead_storage_unconfigured:
    "We couldn't save your details right now. The full guide is free on this page — no signup needed.",
  lead_write_failed: "Something went wrong saving your details. Try once more in a minute.",
};

export default function GuideLeadForm() {
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedRef = useRef(false);

  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = params.get(key);
      if (value) out[key] = value.slice(0, 120);
    }
    return out;
  }, []);

  function onFirstInteraction() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("guide_form_started", { pageSlug: "uluwatu-48-hours" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: String(fd.get("firstName") ?? ""),
      channel,
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      travelDate: String(fd.get("travelDate") ?? ""),
      interests: fd.getAll("interests").map(String),
      language: String(fd.get("language") ?? "en"),
      source: new URLSearchParams(window.location.search).get("s") ?? "web",
      utm,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""), // honeypot
    };

    if (!payload.consent) {
      setStatus({ kind: "error", message: ERROR_COPY.consent_required });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/guide-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; duplicate?: boolean };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: ERROR_COPY[data.error ?? ""] ?? ERROR_COPY.lead_write_failed,
        });
        return;
      }
      track("guide_form_submitted", { pageSlug: "uluwatu-48-hours" });
      setStatus({ kind: "success", duplicate: Boolean(data.duplicate) });
      form.reset();
    } catch {
      setStatus({ kind: "error", message: ERROR_COPY.lead_write_failed });
    }
  }

  const waShare = `https://wa.me/?text=${encodeURIComponent(
    "48 hours in Uluwatu — the Other Bali guide: https://www.otherbali.com/uluwatu/48-hours"
  )}`;

  if (status.kind === "success") {
    return (
      <div className="form-note-success" role="status">
        <p className="font-bold">
          {status.duplicate ? "You're already on the list — details updated." : "Saved. You're on the list."}
        </p>
        <p className="mt-1">
          The full guide is right here on this page — bookmark it, or send the
          link to your own WhatsApp so it’s with you on the road.
        </p>
        <a
          href={waShare}
          target="_blank"
          rel="noreferrer"
          className="button-secondary mt-3"
          onClick={() => track("whatsapp_guide_click", { pageSlug: "uluwatu-48-hours" })}
        >
          Send the guide to my WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} onFocusCapture={onFirstInteraction} noValidate>
      <label>
        <span className="field-label">First name</span>
        <input type="text" name="firstName" required maxLength={80} autoComplete="given-name" />
      </label>

      <div>
        <span className="field-label" style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          Where should the guide live?
        </span>
        <div className="checks" role="radiogroup" aria-label="Preferred channel">
          <label className="check-pill">
            <input
              type="radio"
              name="channel"
              value="email"
              checked={channel === "email"}
              onChange={() => setChannel("email")}
            />
            Email
          </label>
          <label className="check-pill">
            <input
              type="radio"
              name="channel"
              value="whatsapp"
              checked={channel === "whatsapp"}
              onChange={() => setChannel("whatsapp")}
            />
            WhatsApp
          </label>
        </div>
      </div>

      {channel === "email" ? (
        <label>
          <span className="field-label">Email</span>
          <input type="email" name="email" required maxLength={200} autoComplete="email" inputMode="email" />
        </label>
      ) : (
        <label>
          <span className="field-label">WhatsApp (with country code)</span>
          <input type="tel" name="whatsapp" required maxLength={20} autoComplete="tel" inputMode="tel" placeholder="628123456789" />
        </label>
      )}

      <label>
        <span className="field-label">Travel date (optional)</span>
        <input type="date" name="travelDate" />
      </label>

      <div>
        <span style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          What’s the trip about? (optional)
        </span>
        <div className="checks">
          {INTERESTS.map((interest) => (
            <label key={interest.key} className="check-pill">
              <input type="checkbox" name="interests" value={interest.key} />
              {interest.label}
            </label>
          ))}
        </div>
      </div>

      <label>
        <span className="field-label">Guide language</span>
        <select name="language" defaultValue="en">
          <option value="en">English</option>
                  <option value="ru">Russian</option>
        </select>
      </label>

      {/* Honeypot — hidden from real users, kept in the tab order for bots */}
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="consent-row">
        <input type="checkbox" name="consent" required />
        <span>
          I&apos;m happy for Other Bali to keep these details and contact me
          about this guide. No spam, no third parties —{" "}
          <a href="/privacy" className="underline">
            privacy
          </a>
          .
        </span>
      </label>

      {status.kind === "error" && (
        <p className="form-note-error" role="alert">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? "Saving…" : "Get the 48-hour guide"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        The full guide is also free on this page — the form just keeps it (and
        future district guides) with you.
      </p>
    </form>
  );
}
