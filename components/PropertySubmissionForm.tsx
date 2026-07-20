"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

// Unified villa/hotel property submission form (mockup "Add your property").
// A partner fills in what they can + their own links, and sends a review
// request. We build the draft page and publish only once they approve.
//
// Villa vs Hotel is a toggle: villas skip step 2 (facilities open to visitors),
// everything else is shared. Reuses the existing /api/venue-submission intake
// (migration 0035): the row lands in the needs_verification queue and NEVER
// self-publishes. No new DB entity — the rich property fields (rooms,
// facilities, external links, preferred action, description) are composed into
// the submission `note`; `category` is the free-text "villa"/"hotel".
//
// Phase 1: no real media upload — photos are collected after the draft is
// built (as the "what happens next" flow states). A "link to your photos"
// field lets owners share a folder now; drag-drop upload to Supabase Storage
// is a separate phase.

type Kind = "villa" | "hotel";

const FACILITIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "pool_day_pass", label: "Pool day pass" },
  { value: "spa", label: "Spa" },
  { value: "beach_club", label: "Beach club" },
  { value: "events", label: "Events / private hire" },
  { value: "coworking", label: "Co-working" },
];

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

const PREFERRED_BUTTONS = [
  { value: "book_direct", label: "Book direct" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website" },
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; duplicate: boolean; reference: string | null }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  consent_required: "Please tick both boxes so we're allowed to keep your details and publish once you approve.",
  name_required: "Add your property's name so we know what to look up.",
  contact_required: "Add at least one way to reach you — WhatsApp, email, Instagram or a website.",
  bad_email: "That email doesn't look complete — check it and try again.",
  bad_whatsapp: "That WhatsApp number doesn't look right — digits only, with country code.",
  submission_storage_unconfigured:
    "We couldn't save your request right now. Please try again in a minute, or message us on WhatsApp.",
  submission_write_failed: "Something went wrong saving your request. Try once more in a minute.",
};

const SECTION_LABEL =
  "block text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]";

export default function PropertySubmissionForm({
  initialKind = "hotel",
}: {
  initialKind?: Kind;
}) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedRef = useRef(false);

  // Only the few fields the live preview reflects are controlled.
  const [preview, setPreview] = useState({
    name: "",
    area: "",
    description: "",
    preferred: "book_direct",
  });

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
    track("venue_submission_started", { pageSlug: "list-your-property" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const facilities = fd.getAll("facilities").map(String);

    // Everything property-specific travels in the note — no new DB columns.
    const noteParts: string[] = [];
    noteParts.push(`Kind: ${kind === "hotel" ? "Hotel / resort" : "Villa"}`);
    if (get("rooms")) noteParts.push(`Rooms / bedrooms: ${get("rooms")}`);
    if (get("gmaps")) noteParts.push(`Google Maps: ${get("gmaps")}`);
    if (kind === "hotel" && facilities.length) {
      const labels = facilities.map((f) => FACILITIES.find((x) => x.value === f)?.label ?? f);
      noteParts.push(`Open to visitors: ${labels.join(", ")}`);
    }
    if (kind === "hotel" && get("dayPassPrice")) noteParts.push(`Day-pass price: ${get("dayPassPrice")}`);
    if (get("booking")) noteParts.push(`Direct booking link: ${get("booking")}`);
    for (const [field, label] of [
      ["tripadvisor", "TripAdvisor"],
      ["airbnb", "Airbnb"],
      ["bookingcom", "Booking.com"],
      ["googleReviews", "Google reviews"],
    ] as const) {
      if (get(field)) noteParts.push(`${label}: ${get(field)}`);
    }
    const preferredLabel = PREFERRED_BUTTONS.find((b) => b.value === get("preferred"))?.label;
    if (preferredLabel) noteParts.push(`Preferred main button: ${preferredLabel}`);
    if (get("photosLink")) noteParts.push(`Photos/video link: ${get("photosLink")}`);
    if (get("description")) noteParts.push(`About: ${get("description")}`);
    if (get("amenities")) noteParts.push(`Main amenities: ${get("amenities")}`);
    if (get("bestGuest")) noteParts.push(`Best guest type: ${get("bestGuest")}`);
    if (get("contactName")) noteParts.push(`Contact: ${get("contactName")}`);
    if (get("role")) noteParts.push(`Role: ${get("role")}`);

    const consent = fd.get("consent_rights") === "on" && fd.get("consent_publish") === "on";

    const payload = {
      name: get("name"),
      category: kind,
      district: get("district"),
      whatsapp: get("whatsapp"),
      email: get("email"),
      instagram: get("instagram"),
      websiteUrl: get("websiteUrl"),
      note: noteParts.join("\n"),
      source: new URLSearchParams(window.location.search).get("s") ?? "web",
      utm,
      consent,
      website: get("website"), // honeypot
    };

    if (!consent) {
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
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        duplicate?: boolean;
        reference?: string | null;
      };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: ERROR_COPY[data.error ?? ""] ?? ERROR_COPY.submission_write_failed,
        });
        return;
      }
      track("venue_submission_submitted", { pageSlug: "list-your-property" });
      setStatus({ kind: "success", duplicate: Boolean(data.duplicate), reference: data.reference ?? null });
    } catch {
      setStatus({ kind: "error", message: ERROR_COPY.submission_write_failed });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="form-note-success" role="status">
        <p className="text-lg font-bold">Thank you — it&apos;s with us.</p>
        <p className="mt-1">
          We&apos;ll prepare your page and send it back for review before anything
          is published.
        </p>
        <p className="mt-3 text-sm font-semibold text-[var(--lagoon-strong)]">
          Status: In review — we curate by hand
        </p>
        {status.reference && (
          <p className="mt-1 text-sm text-[var(--muted)]">
            Reference:{" "}
            <span className="font-mono font-bold text-[var(--ink)]">{status.reference}</span>{" "}
            — quote it if you reply to us.
          </p>
        )}
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>We reply on WhatsApp or email, usually within a couple of days.</li>
          <li>Want to add more photos? Just reply to our message.</li>
          <li>Nothing goes live until you approve the draft — no fees, and travellers never pay.</li>
        </ul>
        <Link href="/" className="mt-4 inline-block font-bold text-[var(--lagoon-strong)]">
          Back to Other Bali →
        </Link>
      </div>
    );
  }

  const noun = kind === "hotel" ? "hotel" : "villa";
  const previewType = kind === "hotel" ? "Boutique hotel" : "Villa";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="lead-form" onSubmit={onSubmit} onFocusCapture={onFirstInteraction} noValidate>
        {/* Villa / Hotel toggle */}
        <div>
          <span className={SECTION_LABEL} style={{ marginBottom: 6 }}>
            What are you adding?
          </span>
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--paper-soft)] p-1" role="group" aria-label="Property type">
            {(["villa", "hotel"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={`min-h-10 rounded-full px-4 text-sm font-bold ${
                  kind === k
                    ? "bg-[var(--lagoon-strong)] text-white"
                    : "text-[var(--muted)]"
                }`}
              >
                {k === "villa" ? "A villa" : "A hotel / resort"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Villas skip step 2 (facilities open to visitors). Everything else is the same.
          </p>
        </div>

        {/* 1 · The basics */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={SECTION_LABEL}>1 · The basics</legend>
          <label style={{ marginTop: 8, display: "block" }}>
            <span className="field-label">{kind === "hotel" ? "Hotel" : "Villa"} name</span>
            <input
              type="text"
              name="name"
              required
              maxLength={160}
              autoComplete="organization"
              onChange={(e) => setPreview((p) => ({ ...p, name: e.target.value }))}
            />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Area / district</span>
            <select
              name="district"
              defaultValue=""
              onChange={(e) => setPreview((p) => ({ ...p, area: e.target.value }))}
            >
              <option value="">Choose an area…</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">
              {kind === "hotel" ? "Rooms" : "Bedrooms"} (optional)
            </span>
            <input type="number" name="rooms" min={1} max={5000} inputMode="numeric" placeholder={kind === "hotel" ? "e.g. 24" : "e.g. 3"} />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Google Maps link (optional)</span>
            <input type="url" name="gmaps" maxLength={500} inputMode="url" placeholder="https://maps.app.goo.gl/…" />
          </label>
        </fieldset>

        {/* 2 · Open to visitors — hotel only */}
        {kind === "hotel" && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className={SECTION_LABEL}>2 · Open to visitors — facilities non-guests can use</legend>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {FACILITIES.map((f) => (
                <label key={f.value} className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" name="facilities" value={f.value} />
                  {f.label}
                </label>
              ))}
            </div>
            <label style={{ marginTop: 10, display: "block" }}>
              <span className="field-label">Day-pass price (optional)</span>
              <input type="text" name="dayPassPrice" maxLength={80} placeholder="e.g. Rp 150k, redeemable on F&B" />
            </label>
          </fieldset>
        )}

        {/* 3 · Where guests reach you */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={SECTION_LABEL}>
            {kind === "hotel" ? "3" : "2"} · Where guests reach you (at least one)
          </legend>
          <label style={{ marginTop: 8, display: "block" }}>
            <span className="field-label">Website</span>
            <input type="url" name="websiteUrl" maxLength={300} inputMode="url" placeholder="https://" />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Direct booking link (optional)</span>
            <input type="url" name="booking" maxLength={300} inputMode="url" placeholder="https://" />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">WhatsApp (with country code)</span>
            <input type="tel" name="whatsapp" maxLength={20} autoComplete="tel" inputMode="tel" placeholder="628123456789" />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Instagram (link or @handle)</span>
            <input type="text" name="instagram" maxLength={300} placeholder={`@your${noun}`} />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label style={{ display: "block" }}>
              <span className="field-label">TripAdvisor (optional)</span>
              <input type="url" name="tripadvisor" maxLength={300} inputMode="url" placeholder="https://" />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">Airbnb (optional)</span>
              <input type="url" name="airbnb" maxLength={300} inputMode="url" placeholder="https://" />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">Booking.com (optional)</span>
              <input type="url" name="bookingcom" maxLength={300} inputMode="url" placeholder="https://" />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">Google reviews (optional)</span>
              <input type="url" name="googleReviews" maxLength={300} inputMode="url" placeholder="https://" />
            </label>
          </div>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Preferred main button</span>
            <select
              name="preferred"
              defaultValue="book_direct"
              onChange={(e) => setPreview((p) => ({ ...p, preferred: e.target.value }))}
            >
              {PREFERRED_BUTTONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </label>
        </fieldset>

        {/* 4 · Photos & video — Phase 1: link only, no upload yet */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={SECTION_LABEL}>
            {kind === "hotel" ? "4" : "3"} · Your photos &amp; video
          </legend>
          <label style={{ marginTop: 8, display: "block" }}>
            <span className="field-label">Link to your photos / video (optional)</span>
            <input type="url" name="photosLink" maxLength={500} inputMode="url" placeholder="Google Drive / Dropbox link" />
          </label>
          <p className="mt-2 text-xs text-[var(--muted)]">
            You can share a folder now, or just send your own photos when we reply —
            we build the draft first. We only publish photos you send and confirm
            are yours to share; we never add our own.
          </p>
        </fieldset>

        {/* 5 · Describe it */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={SECTION_LABEL}>{kind === "hotel" ? "5" : "4"} · Describe it</legend>
          <label style={{ marginTop: 8, display: "block" }}>
            <span className="field-label">Short description</span>
            <textarea
              name="description"
              maxLength={1000}
              rows={3}
              placeholder="What it's like, what it's known for, what's open to non-guests…"
              onChange={(e) => setPreview((p) => ({ ...p, description: e.target.value }))}
            />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Main amenities (optional)</span>
            <input type="text" name="amenities" maxLength={300} placeholder="pool, spa, restaurant, parking…" />
          </label>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Best guest type (optional)</span>
            <input type="text" name="bestGuest" maxLength={160} placeholder="couples, families, digital nomads…" />
          </label>
        </fieldset>

        {/* 6 · You */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className={SECTION_LABEL}>{kind === "hotel" ? "6" : "5"} · You</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label style={{ display: "block" }}>
              <span className="field-label">Contact name</span>
              <input type="text" name="contactName" maxLength={160} autoComplete="name" />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">Role (optional)</span>
              <input type="text" name="role" maxLength={120} placeholder="owner, manager…" />
            </label>
          </div>
          <label style={{ marginTop: 10, display: "block" }}>
            <span className="field-label">Email</span>
            <input type="email" name="email" maxLength={200} autoComplete="email" inputMode="email" />
          </label>
        </fieldset>

        {/* Honeypot */}
        <div className="hp-field" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="consent-row">
          <input type="checkbox" name="consent_rights" required />
          <span>
            I own or am authorised to represent this property, and the photos are
            mine to share.
          </span>
        </label>
        <label className="consent-row">
          <input type="checkbox" name="consent_publish" required />
          <span>
            I agree Other Bali may publish this information once I approve the
            draft page. <a href="/privacy" className="underline">Privacy</a>.
          </span>
        </label>

        {status.kind === "error" && (
          <p className="form-note-error" role="alert">
            {status.message}
          </p>
        )}

        <button type="submit" disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Sending…" : "Send for review"}
        </button>
        <p className="text-xs text-[var(--muted)]">
          No payment, no card. We review by hand and reply on WhatsApp or email —
          usually within a couple of days. A request isn&apos;t an automatic
          listing, and nothing publishes until you approve it.
        </p>
      </form>

      {/* Live preview */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <p className={SECTION_LABEL} style={{ marginBottom: 8 }}>
          Live preview
        </p>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5 shadow-[var(--shadow-soft)]">
          <span className="inline-block rounded-full bg-[var(--tint-best-bg)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--tint-best-head)]">
            Partner
          </span>
          <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
            {previewType}
            {preview.area ? ` · ${preview.area}` : ""}
          </p>
          <p className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
            {preview.name || `Your ${noun} name`}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {preview.description ||
              "Your description appears here, in Other Bali's editorial style."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--lagoon-strong)] px-3 py-1 text-xs font-bold text-white">
              {PREFERRED_BUTTONS.find((b) => b.value === preview.preferred)?.label ?? "Book direct"}
            </span>
            <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-bold text-[var(--ink)]">
              WhatsApp
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          This is roughly how your page will look.
        </p>
      </aside>
    </div>
  );
}
