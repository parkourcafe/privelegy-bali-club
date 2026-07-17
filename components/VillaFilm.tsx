"use client";

import { useState } from "react";

// The villa partnership film with a language toggle (English · Bahasa
// Indonesia). Each cut is a separate prebuild-fetched asset; whichever ones are
// present at build time are offered here. If none are present (e.g. the CDN was
// unreachable at build), the block keeps a calm poster fallback — the page never
// shows a broken player. Click-to-play with preload="metadata", so bytes stream
// only when a partner presses play.
type Lang = { key: string; label: string; src: string };

export default function VillaFilm({
  enReady,
  idReady,
}: {
  enReady: boolean;
  idReady: boolean;
}) {
  const langs: Lang[] = [
    enReady ? { key: "en", label: "English", src: "/scenes/villas-film.mp4" } : null,
    idReady
      ? { key: "id", label: "Bahasa Indonesia", src: "/scenes/villas-film-id.mp4" }
      : null,
  ].filter((l): l is Lang => l !== null);

  const [active, setActive] = useState(0);

  if (langs.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-[rgba(250,246,239,0.25)] bg-black/25 px-5 py-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(250,246,239,0.55)] text-lg text-[#FAF6EF]"
        >
          ▶
        </span>
        <p className="text-sm text-[rgba(250,246,239,0.86)]">
          A short film on how we partner with villas is on its way — it&apos;ll
          live right here.
        </p>
      </div>
    );
  }

  const current = langs[Math.min(active, langs.length - 1)];

  return (
    <figure className="overflow-hidden rounded-2xl border border-[rgba(250,246,239,0.25)] bg-black/30">
      {langs.length > 1 && (
        <div
          role="group"
          aria-label="Film language"
          className="flex gap-1 border-b border-[rgba(250,246,239,0.2)] bg-black/30 p-2"
        >
          {langs.map((l, i) => {
            const on = i === active;
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  on
                    ? "bg-[#FAF6EF] text-[#2B1A13]"
                    : "text-[rgba(250,246,239,0.8)] hover:bg-white/10"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      )}
      {/* key forces the element to reload its source when the language changes. */}
      <video
        key={current.src}
        controls
        playsInline
        preload="metadata"
        src={current.src}
        poster="/scenes/moment-morning.webp"
        className="block w-full"
        aria-label={`Other Bali for villas — how the partnership works (${current.label})`}
      />
      <figcaption className="px-4 py-2 text-xs text-[rgba(250,246,239,0.72)]">
        How Other Bali works with villas — in about a minute. Sound on 🔊
      </figcaption>
    </figure>
  );
}
