"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import PropertyMediaUploader from "@/components/PropertyMediaUploader";

// Public venue self-submission form (migration 0035 / /api/venue-submission).
// - consent is NOT preselected;
// - all four contact channels are required (website + Instagram + WhatsApp +
//   email) — founder decision 2026-07-20, enforced here and server-side;
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
  { value: "hotel", label: "Hotel / resort" },
  { value: "villa", label: "Villa" },
  { value: "other", label: "Something else" },
];

// Island-wide area list, grouped by region for scanning. Slugs align with the
// canonical districts registry (lib/districts.ts) where an entry exists; the
// extra long-tail slugs (denpasar, kintamani, bedugul, klungkung, karangasem,
// tabanan, west-bali, kuta, legian) are intake hints an operator maps to a real
// district when promoting the submission — venue_submissions.district is free
// text, no FK, so a wider list never breaks the write.
const DISTRICT_GROUPS: { region: string; areas: { value: string; label: string }[] }[] = [
  {
    region: "South-west & south coast",
    areas: [
      { value: "canggu", label: "Canggu" },
      { value: "seminyak", label: "Seminyak" },
      { value: "kuta", label: "Kuta" },
      { value: "legian", label: "Legian" },
      { value: "jimbaran", label: "Jimbaran" },
    ],
  },
  {
    region: "Bukit & south-east",
    areas: [
      { value: "uluwatu-bukit", label: "Uluwatu & the Bukit" },
      { value: "nusa-dua", label: "Nusa Dua" },
    ],
  },
  {
    region: "City & south-east coast",
    areas: [
      { value: "denpasar", label: "Denpasar (city)" },
      { value: "sanur", label: "Sanur" },
    ],
  },
  {
    region: "Central highlands & lakes",
    areas: [
      { value: "ubud", label: "Ubud" },
      { value: "kintamani", label: "Kintamani & Lake Batur" },
      { value: "bedugul", label: "Bedugul & the lakes" },
      { value: "munduk", label: "Munduk & the highlands" },
    ],
  },
  {
    region: "East Bali",
    areas: [
      { value: "klungkung", label: "Klungkung" },
      { value: "sidemen", label: "Sidemen" },
      { value: "karangasem", label: "Karangasem & Candidasa" },
      { value: "amed", label: "Amed & the east coast" },
    ],
  },
  {
    region: "North & west",
    areas: [
      { value: "lovina", label: "Lovina & the north" },
      { value: "tabanan", label: "Tabanan (Tanah Lot, Jatiluwih)" },
      { value: "west-bali", label: "West Bali (Medewi, Pemuteran)" },
    ],
  },
  {
    region: "Islands & beyond",
    areas: [
      { value: "nusa-islands", label: "Nusa Penida / Lembongan" },
      { value: "gili-islands", label: "Gili Islands" },
      { value: "lombok", label: "Lombok" },
    ],
  },
  {
    region: "Anywhere else",
    areas: [{ value: "other", label: "Elsewhere in Bali" }],
  },
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "success";
      duplicate: boolean;
      submissionId: string | null;
      mediaToken: string | null;
    }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  consent_required: "Please tick the consent box so we're allowed to keep your details.",
  name_required: "Add the name of your place so we know what to look up.",
  contact_required: "Please add all four: website, Instagram, WhatsApp and email.",
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
    const missing = [
      !payload.websiteUrl.trim() && "website",
      !payload.instagram.trim() && "Instagram",
      !payload.whatsapp.trim() && "WhatsApp",
      !payload.email.trim() && "email",
    ].filter(Boolean) as string[];
    if (missing.length) {
      setStatus({
        kind: "error",
        message:
          missing.length === 4
            ? ERROR_COPY.contact_required
            : `Please also add your ${missing.join(", ")} — all four are required.`,
      });
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
        submissionId?: string | null;
        mediaToken?: string | null;
      };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: ERROR_COPY[data.error ?? ""] ?? ERROR_COPY.submission_write_failed,
        });
        return;
      }
      track("venue_submission_submitted", { pageSlug: "for-venues" });
      setStatus({
        kind: "success",
        duplicate: Boolean(data.duplicate),
        submissionId: data.submissionId ?? null,
        mediaToken: data.mediaToken ?? null,
      });
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
          we&apos;ll reach out. Your first 2 months are a free test — no fees,
          and travellers never pay.
        </p>
        {status.submissionId && status.mediaToken && (
          <div className="mt-5 rounded-2xl border-2 border-[var(--lagoon-strong)] bg-[var(--tint-best-bg)] p-4">
            <p className="text-base font-extrabold text-[var(--ink)]">
              📸 Add your photos &amp; video — this is what makes your page
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Add up to <strong>20 photos and a short video</strong>, straight from
              your phone — drag them in or tap to browse. No Dropbox or Drive link
              needed. Places with real photos get far more interest.
            </p>
            <PropertyMediaUploader submissionId={status.submissionId} mediaToken={status.mediaToken} />
          </div>
        )}
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
          <option value="">Choose an area…</option>
          {DISTRICT_GROUPS.map((group) => (
            <optgroup key={group.region} label={group.region}>
              {group.areas.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div>
        <span style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
          How can we reach you? (all four required)
        </span>
        <label>
          <span className="field-label">WhatsApp (with country code)</span>
          <input type="tel" name="whatsapp" required maxLength={20} autoComplete="tel" inputMode="tel" placeholder="628123456789" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Email</span>
          <input type="email" name="email" required maxLength={200} autoComplete="email" inputMode="email" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Instagram (link or @handle)</span>
          <input type="text" name="instagram" required maxLength={300} placeholder="@yourplace" />
        </label>
        <label style={{ marginTop: 10, display: "block" }}>
          <span className="field-label">Website</span>
          <input type="url" name="websiteUrl" required maxLength={300} inputMode="url" placeholder="https://" />
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
        First 2 months are a free test — no fees, and travellers never pay. We
        curate by hand, so a request isn&apos;t a guaranteed listing —
        we&apos;ll check the place first.
      </p>
    </form>
  );
}
