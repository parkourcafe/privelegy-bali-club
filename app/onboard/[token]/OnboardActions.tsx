"use client";

import { useRef, useState } from "react";
import PartnerMaintenanceDrafts from "./PartnerMaintenanceDrafts";

// Confirmation + private photo submission for the partner onboarding page.
// The browser sends one explicitly consented image to a server-only route;
// nothing receives a public URL or reaches the live card before operator review.

const MAX_MB = 4;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

type Jtbd = {
  bestFor: string;
  notFor: string;
  jobs: string[];
  practicalTags: string[];
  // The venue's own words (UGC) — shown on the card attributed to the owner.
  ownerNote: string;
};

export default function OnboardActions({
  token,
  alreadyConfirmed,
  maintenanceDraftsEnabled,
  photoSubmissionEnabled,
  initialJtbd,
}: {
  token: string;
  alreadyConfirmed: boolean;
  maintenanceDraftsEnabled: boolean;
  photoSubmissionEnabled: boolean;
  initialJtbd: Jtbd;
}) {
  const [name, setName] = useState("");
  const [jtbd, setJtbd] = useState<Jtbd>(initialJtbd);
  const [jtbdState, setJtbdState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function saveJtbd() {
    setJtbdState("busy");
    try {
      const res = await fetch("/api/onboard/jtbd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ownerNote: jtbd.ownerNote }),
      });
      const data = await res.json();
      setJtbdState(data.ok ? "done" : "error");
    } catch {
      setJtbdState("error");
    }
  }

  const [agreed, setAgreed] = useState(false);
  const [confirmState, setConfirmState] = useState<"idle" | "busy" | "done" | "error">(
    alreadyConfirmed ? "done" : "idle"
  );
  const [photoState, setPhotoState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [photoMsg, setPhotoMsg] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoContact, setPhotoContact] = useState("");
  const [photoRights, setPhotoRights] = useState(false);
  const [photoWebsite, setPhotoWebsite] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);

  async function confirm() {
    setConfirmState("busy");
    try {
      const res = await fetch("/api/onboard/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, agreed }),
      });
      const data = await res.json();
      setConfirmState(data.ok ? "done" : "error");
    } catch {
      setConfirmState("error");
    }
  }

  async function uploadPhoto() {
    const file = photoFile;
    if (!file || name.trim().length < 2 || !photoRights) {
      setPhotoState("error");
      setPhotoMsg("Choose one photo, enter your name and confirm the photo rights first.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setPhotoState("error");
      setPhotoMsg(`Photo is too large — max ${MAX_MB} MB.`);
      return;
    }
    if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
      setPhotoState("error");
      setPhotoMsg("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }

    setPhotoState("busy");
    const body = new FormData();
    body.set("token", token);
    body.set("photo", file);
    body.set("submitterName", name.trim());
    body.set("submitterContact", photoContact.trim());
    body.set("rightsGranted", photoRights ? "granted" : "");
    body.set("website", photoWebsite);
    const res = await fetch("/api/onboard/photo", {
      method: "POST",
      body,
    }).catch(() => null);
    const result = res ? await res.json().catch(() => null) : null;
    if (res?.ok && result?.ok === true && result.status === "pending_review") {
      setPhotoState("done");
      setPhotoMsg("Thank you — your photo is private and pending review. It will appear only after approval.");
      setPhotoFile(null);
      setPhotoRights(false);
      if (photoInput.current) photoInput.current.value = "";
    } else if (res?.status === 202 && result?.ok === true && result.status === "processing") {
      setPhotoState("done");
      setPhotoMsg("Your submission attempt is being reconciled against its private review record. Please do not resend it; nothing can be published until that check finishes.");
      setPhotoFile(null);
      setPhotoRights(false);
      if (photoInput.current) photoInput.current.value = "";
    } else {
      setPhotoState("error");
      setPhotoMsg("The photo was not submitted. Check the file and rights confirmation, then try again.");
    }
  }

  return (
    <div className="mt-6 space-y-5 pb-16">
      {/* Photos */}
      {photoSubmissionEnabled ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="font-medium">Submit a photo for review</p>
        <p className="mt-1 text-sm text-stone-500">
          Submit one photo of your space or food at a time. It stays private until an Other Bali operator checks the image and its rights record.
        </p>
        <label className="mt-3 block text-sm font-medium text-stone-700">
          Your name and role
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder="Made, manager"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-stone-700">
          Email or WhatsApp (optional)
          <input
            value={photoContact}
            onChange={(e) => setPhotoContact(e.target.value)}
            maxLength={200}
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-stone-700">
          Photo file · JPG, PNG, WebP or AVIF · max {MAX_MB} MB
          <input
            ref={photoInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="mt-1 block w-full rounded-lg border border-stone-200 p-2 text-sm"
            disabled={photoState === "busy"}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPhotoFile(f ?? null);
              setPhotoState("idle");
              setPhotoMsg("");
            }}
          />
        </label>
        <label className="mt-3 flex items-start gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={photoRights}
            onChange={(e) => setPhotoRights(e.target.checked)}
            className="mt-1 size-4 shrink-0"
          />
          <span>
            I own or have the rights to this photo and grant Other Bali a non-exclusive licence to display it on otherbali.com. See the <a href="/terms" target="_blank" rel="noreferrer" className="font-semibold text-cyan-800 underline">terms</a>.
          </span>
        </label>
        <label className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
          Website
          <input value={photoWebsite} onChange={(e) => setPhotoWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
        <button
          type="button"
          onClick={uploadPhoto}
          disabled={photoState === "busy" || !photoFile || !photoRights || name.trim().length < 2}
          className="mt-4 min-h-11 w-full rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {photoState === "busy" ? "Submitting privately…" : "Submit for review"}
        </button>
        {photoMsg && (
          <p
            role={photoState === "error" ? "alert" : "status"}
            className={`mt-2 text-sm ${photoState === "error" ? "text-rose-600" : "text-emerald-700"}`}
          >
            {photoMsg}
          </p>
        )}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          Photo submissions are temporarily paused while the private review
          queue is being prepared. Your current listing stays unchanged.
        </div>
      )}

      {/* Venue-authored copy stays visibly attributed; editorial fit stays operator-owned. */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="font-medium">In your own words</p>
        <p className="mt-1 text-sm text-stone-500">
          Tell travellers about your place. We show this separately as venue-authored copy; it never replaces Other Bali editorial notes.
        </p>

        <label className="mt-4 block text-sm">
          <span className="text-stone-600">From the venue</span>
          <textarea
            value={jtbd.ownerNote}
            onChange={(e) => {
              setJtbd((s) => ({ ...s, ownerNote: e.target.value }));
              setJtbdState("idle");
            }}
            maxLength={2000}
            rows={5}
            placeholder="Tell travellers about your place — your story, what you cook, what to try, what makes it yours. Write as much as you like."
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-stone-400">
            Shown on your card as “From the owner” — your voice, your words.
          </span>
        </label>

        <button
          onClick={saveJtbd}
          disabled={jtbdState === "busy"}
          className="mt-4 w-full rounded-xl border border-cyan-700 py-2.5 text-sm font-semibold text-cyan-700 disabled:opacity-50"
        >
          {jtbdState === "busy" ? "Saving…" : jtbdState === "done" ? "Saved ✓" : "Save venue note"}
        </button>
        {jtbdState === "error" && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            Couldn&apos;t save. Try again or message us on WhatsApp.
          </p>
        )}
      </div>

      {maintenanceDraftsEnabled ? <PartnerMaintenanceDrafts token={token} /> : null}

      {/* Confirmation */}
      {confirmState === "done" ? (
        <div className="rounded-2xl bg-emerald-600 p-5 text-center text-white">
          <div className="text-4xl">✓</div>
          <p className="mt-1 font-semibold">You&apos;re confirmed</p>
          <p className="mt-1 text-sm opacity-90">
            Thank you — your confirmation was received. An Other Bali operator
            reviews publication separately; this does not make the listing or an offer live.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="font-medium">Confirm your listing</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name & role (e.g. Made, manager)"
            className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <label className="mt-3 flex items-start gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <span>I represent this venue and confirm the listing information for operator review.</span>
          </label>
          <button
            onClick={confirm}
            disabled={!agreed || confirmState === "busy"}
            className="mt-4 w-full rounded-xl bg-cyan-700 py-3 font-semibold text-white disabled:opacity-50"
          >
            {confirmState === "busy" ? "Confirming…" : "Confirm listing"}
          </button>
          {confirmState === "error" && (
            <p role="alert" className="mt-2 text-sm text-rose-600">
              Something went wrong. Try again or message us on WhatsApp.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
