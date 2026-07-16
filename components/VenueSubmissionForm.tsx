"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// Public venue self-submission form (migration 0035 / /api/venue-submission).
// - consent is NOT preselected;
// - at least one contact channel is required (WhatsApp / email / Instagram / site);
// - honeypot field ("website") for spam;
// - duplicate submissions are handled server-side (update, not multiply);
// - honest success copy: a submission is a REQUEST — we review by hand and
//   never promise a listing or claim anything was published.

const CATEGORIES = [
  { value: "", label: "Choose a type…" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "warung", label: "Warung / local eatery" },
  { value: "bar", label: "Bar" },
  { value: "beach_club", label: "Beach club" },
  { value: "spa", label: "Spa" },
  { value: "beauty", label: "Beauty / salon" },
  { value: "yoga", label: "Yoga" },
  { value: "fitness", label: "Fitness" },
  { value: "surf", label: "Surf" },
  { value: "other", label: "Something else" },
];

const DISTRICTS = [
  { value: "", label: "Choose an area…" },
  { value: "canggu", label: "Canggu" },
  { value: "seminyak", label: "Seminyak" },
  { value: "ubud", label: "Ubud" },
  { value: "sanur", label: "Sanur" },
  { value: "uluwatu-bukit", label: "Uluwatu / Bukit" },
  { value: "jimbaran", label: "Jimbaran" },
  { value: "nusa-dua", label: "Nusa Dua" },
  { value: "other", label: "Elsewhere in Bali" },
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; duplicate: boolean }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  consent_required: "Please tick the consent box so we're allowed to keep your details.",
  name_required: "Add the name of your place so we know what to look up.",
  contact_required: "Add at least one way to reach you — WhatsApp, email, Instagram or a website.",
  bad_email: "That email doesn't look complete — check it and try again.",
  bad_whatsapp: "That WhatsApp number doesn't look right — digits only, with country code.",
  submission_storage_unconfigured:
    "We couldn't save your request right now. Please try again in a minute, or message us on WhatsApp.",
  submission_write_failed: "Something went wrong saving your request. Try once more in a minute.",
};

export default function VenueSubmissionForm() {
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
    track("venue_submission_started", { pageSlug: "for-venues" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") ?? ""),
      category: String(fd.get("category") ?? ""),
      district: String(fd.get("district") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      websiteUrl: String(fd.get("websiteUrl") ?? ""),
      note: String(fd.get("note") ?? ""),
      source: new URLSearchParams(window.location.search).get("s") ?? "web",
      utm,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""), // honeypot
    };

    if (!payload.consent) {
      setStatus({ kind: "error", message: ERROR_COPY.consent_required });
      return;
    }
    if (!payload.whatsapp && !payload.email && !payload.instagram && !payload.websiteUrl) {
      setStatus({ kind: "error", message: ERROR_COPY.contact_required });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/venue-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; duplicate?: boolean };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: ERROR_COPY[data.error ?? ""] ?? ERROR_COPY.submission_write_failed,
        });
        return;
      }
      track("venue_submission_submitted", { pageSlug: "for-venues" });
      setStatus({ kind: "success", duplicate: Boolean(data.duplicate) });
      form.reset();
    } catch {
      setStatus({ kind: "error", message: ERROR_COPY.submission_write_failed });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="form-note-success" role="status">
        <p className="font-bold">
          {status.duplicate
            ? "Got it — we've updated your details. Thanks!"
            : "Thanks — your place is in our review queue."}
        </p>
        <p className="mt-1">
          We read every submission by hand and check the details before adding a
          place, so this is a request, not an instant listing. If it&apos;s a fit
          we&apos;ll reach out. Your first 3 months are a free test — no fees,
          and travellers never pay.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} onFocusCapture={onFirstInteraction} noValidate>
      <label>
        <span className="field-label">Place name</span>
        <input type="text" name="name" required maxLength={160} autoComplete="organization" />
      </label>

      <label>
        <span className="field-label">Type of place</span>
        <select name="category" defaultValue="">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">Area</span>
        <select name="district" defaultValue="">
          {DISTRICTS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </label>

      <div>
        <span style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          How can we reach you? (at least one)
        </span>
        <label>
          <span className="field-label">WhatsApp (with country code)</span>
          <input type="tel" name="whatsapp" maxLength={20} autoComplete="tel" inputMode="tel" placeholder="628123456789" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Email</span>
          <input type="email" name="email" maxLength={200} autoComplete="email" inputMode="email" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Instagram (link or @handle)</span>
          <input type="text" name="instagram" maxLength={300} placeholder="@yourplace" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Website (optional)</span>
          <input type="url" name="websiteUrl" maxLength={300} inputMode="url" placeholder="https://" />
        </label>
      </div>

      <label>
        <span className="field-label">Anything we should know? (optional)</span>
        <textarea name="note" maxLength={1000} rows={3} placeholder="Who's it best for, what you're known for, opening hours…" />
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
          about listing this place. No spam, no third parties —{" "}
          <a href="/privacy" className="underline">privacy</a>.
        </span>
      </label>

      {status.kind === "error" && (
        <p className="form-note-error" role="alert">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? "Sending…" : "Request a listing"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        First 3 months are a free test — no fees, and travellers never pay. We
        curate by hand, so a request isn&apos;t a guaranteed listing —
        we&apos;ll check the place first.
      </p>
    </form>
  );
}
