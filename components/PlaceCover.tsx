import Image from "next/image";
import type { Venue } from "@/lib/types";
import { venueCoverAssetCategory } from "@/lib/venue-presentation";

// Decorative no-photo cover. It uses category mood art only; visitor-facing
// venue names, categories, areas and verdicts live in the card/page copy, not
// as text overlays on the image.

// One licensed still per category means neighbouring no-photo cards repeat the
// same art. A cheap deterministic hash of the venue name picks one of four
// crop/grade variants (CSS .type-cover-alt-*) so repeats stop reading as
// copy-paste while the asset set stays honest mood art.
function altClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const v = Math.abs(h) % 4;
  return v === 0 ? "" : ` type-cover-alt-${v}`;
}

export default function PlaceCover({
  name,
  category,
  variant = "card",
}: {
  name: string;
  category: Venue["category"];
  variant?: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <div className={`type-cover type-cover-${category}${altClass(name)}`} aria-hidden="true">
        <Image
          className="type-cover-art"
          src={`/covers/${venueCoverAssetCategory(category)}.webp`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className={`type-cover type-cover-${category}${altClass(name)}`} aria-hidden="true">
      <Image
        className="type-cover-art"
        src={`/covers/${venueCoverAssetCategory(category)}.webp`}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
      />
    </div>
  );
}
