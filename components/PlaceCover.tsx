import Image from "next/image";
import type { Venue } from "@/lib/types";

// Typographic editorial cover — the honest no-photo state. It sets type over
// category mood art (atmospheric still-life/landscape, deliberately NOT venue
// photography — publication rule v2) on a category-tinted field and never
// pretends to depict the venue (brief §9). Venues with an approved photo
// render the photo instead.
//
// Variants avoid duplicated text around the cover:
// - "card": the venue name as a poster plate (the card body carries the
//   category · area eyebrow).
// - "hero": category line + a large serif monogram — the page H1 with the
//   full name sits directly beneath, so the cover doesn't repeat it.

const categoryWord: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  fitness: "Fitness",
  yoga: "Yoga",
  beauty: "Beauty",
  bar: "Bar",
  surf: "Surf",
};

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
  microArea,
  variant = "card",
}: {
  name: string;
  category: Venue["category"];
  microArea?: string;
  variant?: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <div className={`type-cover type-cover-${category}${altClass(name)}`} aria-hidden="true">
        <Image
          className="type-cover-art"
          src={`/covers/${category}.webp`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <p className="type-cover-category">
          {categoryWord[category] ?? "Place"}
          {microArea ? ` · ${microArea}` : ""}
        </p>
        <div>
          <div className="type-cover-rule" />
          <p className="type-cover-word" style={{ fontSize: "clamp(72px, 14vw, 140px)" }}>
            {name.trim().charAt(0).toUpperCase()}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`type-cover type-cover-${category}${altClass(name)}`} aria-hidden="true">
      <Image
        className="type-cover-art"
        src={`/covers/${category}.webp`}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <span />
      <div>
        <div className="type-cover-rule" />
        <p className="type-cover-word">{name}</p>
      </div>
    </div>
  );
}
