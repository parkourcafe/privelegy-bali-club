"use client";

import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";

// Confirmation + photo upload for the partner onboarding page. Photos go
// straight from the venue's phone to storage (folder = their token, enforced by
// storage RLS), then get registered as the card photo via /api/onboard/photo.

const MAX_MB = 8;

export default function OnboardActions({
  token,
  alreadyConfirmed,
}: {
  token: string;
  alreadyConfirmed: boolean;
}) {
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [confirmState, setConfirmState] = useState<"idle" | "busy" | "done" | "error">(
    alreadyConfirmed ? "done" : "idle"
  );
  const [photoState, setPhotoState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [photoMsg, setPhotoMsg] = useState("");

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

  async function uploadPhoto(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      setPhotoState("error");
      setPhotoMsg(`Photo is too large — max ${MAX_MB} MB.`);
      return;
    }
    const sb = browserClient();
    if (!sb) {
      setPhotoState("error");
      setPhotoMsg("Upload isn't available right now.");
      return;
    }
    setPhotoState("busy");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
    const path = `${token}/${Date.now()}-${safeName}`;
    const { error } = await sb.storage.from("venue-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setPhotoState("error");
      setPhotoMsg("Upload failed. Try a smaller photo or send it via WhatsApp.");
      return;
    }
    const { data: pub } = sb.storage.from("venue-photos").getPublicUrl(path);
    const res = await fetch("/api/onboard/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, url: pub.publicUrl }),
    }).catch(() => null);
    if (res && res.ok) {
      setPhotoState("done");
      setPhotoMsg("Photo saved — it's now on your card. You can upload another to replace it.");
    } else {
      setPhotoState("error");
      setPhotoMsg("Photo uploaded but couldn't be attached. Tell us on WhatsApp.");
    }
  }

  return (
    <div className="mt-6 space-y-5 pb-16">
      {/* Photos */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="font-medium">Your photos</p>
        <p className="mt-1 text-sm text-stone-500">
          Upload 1–3 photos of your space and food — straight from your phone.
          The last one becomes the card photo.
        </p>
        <label className="mt-3 block">
          <span className="inline-block cursor-pointer rounded-xl border border-cyan-700 px-4 py-2.5 text-sm font-semibold text-cyan-700">
            {photoState === "busy" ? "Uploading…" : "Choose photo"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={photoState === "busy"}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPhoto(f);
              e.target.value = "";
            }}
          />
        </label>
        {photoMsg && (
          <p
            role={photoState === "error" ? "alert" : "status"}
            className={`mt-2 text-sm ${photoState === "error" ? "text-rose-600" : "text-emerald-700"}`}
          >
            {photoMsg}
          </p>
        )}
      </div>

      {/* Confirmation */}
      {confirmState === "done" ? (
        <div className="rounded-2xl bg-emerald-600 p-5 text-center text-white">
          <div className="text-4xl">✓</div>
          <p className="mt-1 font-semibold">You&apos;re confirmed</p>
          <p className="mt-1 text-sm opacity-90">
            Thank you! Your listing is live. We&apos;ll be in touch on WhatsApp
            with your counter QR poster.
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
            <span>I represent this venue and agree to the listing policy above.</span>
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
