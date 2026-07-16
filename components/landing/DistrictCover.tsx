"use client";

import { useState } from "react";
import Image from "next/image";

// District card cover. A distinct, light-leaning colour wash per area is the
// base layer (always renders — no network needed), and the generated mood
// still layers on top when it is available at build time. If the still is
// missing or fails to load, the wash stays, so every card reads as its own
// place and the row never collapses into one dark block.
//
// Editorial rule: the still is atmosphere of the AREA, decorative only
// (alt="", aria-hidden) — never presented as a photo of a specific venue.
export default function DistrictCover({
  slug,
  gradient,
}: {
  slug: string;
  gradient: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="absolute inset-0" style={{ background: gradient }}>
      {/* soft warm sun-glow so the flat gradient reads as sky, not a swatch */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 72% 18%, rgba(255,244,214,0.38), transparent 55%)",
        }}
      />
      {!failed && (
        <Image
          src={`/scenes/district-${slug}.webp`}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 640px) 85vw, 320px"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
