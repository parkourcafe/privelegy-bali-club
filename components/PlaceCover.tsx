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
      <div className={`type-cover type-cover-${category}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="type-cover-art" src={`/covers/${category}.webp`} alt="" loading="lazy" />
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
    <div className={`type-cover type-cover-${category}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="type-cover-art" src={`/covers/${category}.webp`} alt="" loading="lazy" />
      <span />
      <div>
        <div className="type-cover-rule" />
        <p className="type-cover-word">{name}</p>
      </div>
    </div>
  );
}
