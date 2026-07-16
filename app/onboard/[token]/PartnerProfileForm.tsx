"use client";

import { useState } from "react";

type State = "idle" | "busy" | "done" | "error";

const ERROR_COPY: Record<string, string> = {
  about_required: "Please tell us about your place — at least a couple of sentences.",
  name_required: "Please add your name so we know who sent this.",
  gmaps_required: "A Google Maps link is required (paste the share link from your Maps listing).",
  invalid_instagram: "The Instagram link doesn't look right — it should start with https://instagram.com/…",
  invalid_website: "The website link doesn't look right — it should start with https://",
  social_required: "Add your Instagram or website (at least one) so guests can find you.",
  invalid_video: "The video link should be on YouTube, Instagram, TikTok, Vimeo or Facebook.",
  bad_token: "This invitation link isn't valid anymore — ask your Other Bali contact for a new one.",
};

// Full self-fill profile draft: the owner tells us everything about their
// place in one go. It lands in a private review queue — we edit and confirm
// before anything appears on the guide. Owner text stays attributed as the
// owner's words, never presented as our editorial voice.
export default function PartnerProfileForm({ token }: { token: string }) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setState("busy");
    setErrorMsg("");
    try {
      const response = await fetch("/api/onboard/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          company: String(fd.get("company") ?? ""),
          aboutText: String(fd.get("aboutText") ?? ""),
          signatureItems: String(fd.get("signatureItems") ?? ""),
          openingHours: String(fd.get("openingHours") ?? ""),
          priceRange: String(fd.get("priceRange") ?? ""),
          gmapsUrl: String(fd.get("gmapsUrl") ?? ""),
          instagramUrl: String(fd.get("instagramUrl") ?? ""),
          websiteUrl: String(fd.get("websiteUrl") ?? ""),
          videoUrl: String(fd.get("videoUrl") ?? ""),
          publishNotes: String(fd.get("publishNotes") ?? ""),
          submitterName: String(fd.get("submitterName") ?? ""),
          submitterRole: String(fd.get("submitterRole") ?? ""),
        }),
      });
      if (response.ok) {
        setState("done");
        return;
      }
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setErrorMsg(
        ERROR_COPY[payload.error ?? ""] ??
          "Couldn't send the profile. Check the links and try again, or message us on WhatsApp."
      );
      setState("error");
    } catch {
      setErrorMsg("Couldn't send the profile. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-800">
          Thank you — your profile is with our editors now.
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          We review every profile by hand and may lightly edit the wording before
          it goes live. Your own words stay marked as yours. Don&apos;t forget to
          add photos above — each one needs its rights confirmation.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
        Fill in your page yourself
      </p>
      <p className="mt-1 text-sm text-stone-600">
        You know your place best. Tell us everything in one go — we&apos;ll review,
        polish and confirm with you before publishing. Your description will be
        shown as the owner&apos;s words.
      </p>

      <form onSubmit={submit} className="mt-3 space-y-3">
        {/* Honeypot — humans never see it */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <label className="block text-sm text-stone-600">
          About your place — what it is, where it is, what makes it special *
          <textarea
            name="aboutText"
            required
            minLength={20}
            rows={5}
            placeholder="E.g. Family-run warung two minutes from Batu Bolong beach. We cook everything fresh each morning — our nasi campur and grilled fish are what regulars come back for…"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>

        <label className="block text-sm text-stone-600">
          Signature dishes or services — what should guests try first?
          <textarea
            name="signatureItems"
            rows={2}
            placeholder="E.g. Nasi campur, grilled mahi-mahi, coconut pancakes"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm text-stone-600">
            Opening hours
            <input
              name="openingHours"
              type="text"
              placeholder="E.g. Daily 8:00–22:00"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-stone-600">
            Price level
            <select
              name="priceRange"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
              defaultValue=""
            >
              <option value="">Prefer not to say</option>
              <option value="$">$ — budget</option>
              <option value="$$">$$ — mid-range</option>
              <option value="$$$">$$$ — upscale</option>
              <option value="$$$$">$$$$ — fine dining / premium</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-stone-600">
          Google Maps link *
          <input
            name="gmapsUrl"
            type="url"
            required
            placeholder="https://maps.app.goo.gl/…"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm text-stone-600">
            Instagram
            <input
              name="instagramUrl"
              type="url"
              placeholder="https://instagram.com/yourplace"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-stone-600">
            Website
            <input
              name="websiteUrl"
              type="url"
              placeholder="https://yourplace.com"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>
        <p className="text-xs text-stone-400">
          Google Maps is required; add Instagram or website — at least one.
        </p>

        <label className="block text-sm text-stone-600">
          Video link — a reel or video of the place we may share (optional)
          <input
            name="videoUrl"
            type="url"
            placeholder="https://youtube.com/… or https://instagram.com/reel/…"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>

        <label className="block text-sm text-stone-600">
          Anything else we should know — and what we&apos;re allowed to publish
          <textarea
            name="publishNotes"
            rows={3}
            placeholder="E.g. Please use the description above and the photos I uploaded. The menu changes seasonally — check with us monthly."
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm text-stone-600">
            Your name *
            <input
              name="submitterName"
              type="text"
              required
              minLength={2}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-stone-600">
            Your role (owner, manager…)
            <input
              name="submitterRole"
              type="text"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2"
            />
          </label>
        </div>

        {state === "error" ? (
          <p role="alert" className="text-sm text-rose-600">
            {errorMsg}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "busy"}
          className="min-h-11 w-full rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {state === "busy" ? "Sending…" : "Send my page for review"}
        </button>
        <p className="text-xs text-stone-400">
          Photos are added separately above — each photo needs its own rights
          confirmation. We review everything by hand before it appears on the
          guide.
        </p>
      </form>
    </div>
  );
}
