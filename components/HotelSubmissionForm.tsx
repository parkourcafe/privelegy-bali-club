"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// Public hotel self-submission form. The primary "Add your hotel" action on the
// /hotels partner landing points here (a real intake questionnaire), NOT to
// WhatsApp — WhatsApp stays as the secondary contact channel only.
//
// Reuses the existing /api/venue-submission intake (migration 0035): a request
// lands in the needs_verification queue and NEVER publishes itself. No new DB
// entity — hotel-specific fields (type, rooms, facilities, booking link) are
// composed into the submission `note`, and `category` is the free-text "hotel".
// Same guardrails as the venue form: honeypot, consent required, at least one
// contact channel, honest "request, not a listing" success copy.

const TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "boutique", label: "Boutique property" },
];

// Facilities a hotel can be discovered for on their own (the F&B bridge story).
const FACILITIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "pool_day_pass", label: "Pool / day pass" },
  { value: "spa", label: "Spa" },
  { value: "beach_club", label: "Beach club" },
];

// Island-wide areas, kept lightweight — the operator maps the free text to a
// canonical district when promoting the submission (venue_submissions.district
// is free text, no FK).
const AREAS = [
  "Canggu",
  "Seminyak",
  "Uluwatu & the Bukit",
  "Jimbaran",
  "Nusa Dua",
  "Sanur",
  "Ubud",
  "Elsewhere in Bali",
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; duplicate: boolean }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  consent_required: "Please tick the consent box so we're allowed to keep your details.",
  name_required: "Add your hotel's name so we know what to look up.",
  contact_required: "Add at least one way to reach you — WhatsApp, email, Instagram or a website.",
  bad_email: "That email doesn't look complete — check it and try again.",
  bad_whatsapp: "That WhatsApp number doesn't look right — digits only, with country code.",
  submission_storage_unconfigured:
    "We couldn't save your request right now. Please try again in a minute, or message us on WhatsApp.",
  submission_write_failed: "Something went wrong saving your request. Try once more in a minute.",
};

export default function HotelSubmissionForm() {
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
    track("venue_submission_started", { pageSlug: "hotels" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const type = String(fd.get("type") ?? "");
    const rooms = String(fd.get("rooms") ?? "").trim();
    const facilities = fd.getAll("facilities").map(String);
    const booking = String(fd.get("booking") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();

    // Compose the hotel-specific fields into the submission note — no new DB
    // columns, everything the operator needs travels in one place.
    const noteParts: string[] = [];
    if (type) noteParts.push(`Type: ${TYPES.find((t) => t.value === type)?.label ?? type}`);
    if (rooms) noteParts.push(`Rooms: ${rooms}`);
    if (facilities.length) {
      const labels = facilities.map((f) => FACILITIES.find((x) => x.value === f)?.label ?? f);
      noteParts.push(`Facilities open to visitors: ${labels.join(", ")}`);
    }
    if (booking) noteParts.push(`Booking link: ${booking}`);
    if (description) noteParts.push(`About: ${description}`);

    const payload = {
      name: String(fd.get("name") ?? ""),
      category: "hotel",
      district: String(fd.get("district") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      email: String(fd.get("email") ?? ""),
      instagram: String(fd.get("instagram") ?? ""),
      websiteUrl: String(fd.get("websiteUrl") ?? ""),
      note: noteParts.join("\n"),
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
      track("venue_submission_submitted", { pageSlug: "hotels" });
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
            ? "Got it — we've updated your hotel's details. Thanks!"
            : "Thanks — your hotel is in our review queue."}
        </p>
        <p className="mt-1">
          We read every submission by hand and check the details before adding a
          hotel, so this is a request, not an instant listing. Nothing publishes
          until you approve it. If it&apos;s a fit we&apos;ll reach out — no fees,
          and travellers never pay.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} onFocusCapture={onFirstInteraction} noValidate>
      <label>
        <span className="field-label">Hotel name</span>
        <input type="text" name="name" required maxLength={160} autoComplete="organization" />
      </label>

      <label>
        <span className="field-label">Type</span>
        <select name="type" defaultValue="hotel">
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">Area</span>
        <select name="district" defaultValue="">
          <option value="">Choose an area…</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">Number of rooms (optional)</span>
        <input type="number" name="rooms" min={1} max={5000} inputMode="numeric" placeholder="e.g. 24" />
      </label>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend
          style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}
        >
          Facilities to be found for (optional)
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {FACILITIES.map((f) => (
            <label key={f.value} className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="facilities" value={f.value} />
              {f.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span className="field-label">Short description (optional)</span>
        <textarea name="description" maxLength={1000} rows={3} placeholder="Who it's best for, what you're known for, what's open to non-guests…" />
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
          <input type="text" name="instagram" maxLength={300} placeholder="@yourhotel" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Website (optional)</span>
          <input type="url" name="websiteUrl" maxLength={300} inputMode="url" placeholder="https://" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Direct booking link (optional)</span>
          <input type="url" name="booking" maxLength={300} inputMode="url" placeholder="https://" />
        </label>
      </div>

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
          about listing this hotel. No spam, no third parties —{" "}
          <a href="/privacy" className="underline">privacy</a>.
        </span>
      </label>

      {status.kind === "error" && (
        <p className="form-note-error" role="alert">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? "Sending…" : "Add your hotel"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        Completely free — no fees, no commission, and travellers never pay. We
        review by hand and nothing publishes until you approve it, so a request
        isn&apos;t an automatic listing.
      </p>
    </form>
  );
}
