import Image from "next/image";
import Link from "next/link";

// Cinematic media card for index pages (/bali, /collections): category mood
// art + dark scrim + sand type. The art is the SAME licensed atmospheric set
// used by PlaceCover (publication rule v2: mood art, never presented as venue
// photography) — mapped per district/collection so every card carries an image
// today and can be swapped for a real consented photo later without markup
// changes.

type CoverArt =
  | "cafe"
  | "restaurant"
  | "warung"
  | "beach_club"
  | "bar"
  | "spa"
  | "surf"
  | "yoga"
  | "beauty"
  | "fitness";

const DISTRICT_ART: Record<string, CoverArt> = {
  canggu: "surf",
  uluwatu: "beach_club",
  "uluwatu-bukit": "beach_club",
  ubud: "yoga",
  seminyak: "restaurant",
  sanur: "cafe",
  "nusa-dua": "spa",
  jimbaran: "restaurant",
  "kuta-legian": "bar",
  denpasar: "warung",
  "nusa-penida": "surf",
  sidemen: "yoga",
  amed: "surf",
  munduk: "cafe",
  lovina: "cafe",
};

const COLLECTION_ART: Record<string, CoverArt> = {
  "balinese-and-local-food": "warung",
  "brunch-and-breakfast": "cafe",
  seafood: "restaurant",
  japanese: "restaurant",
  "desserts-gelato-and-pastry": "cafe",
  "vegetarian-and-plant-based": "cafe",
  "date-night": "bar",
  "group-dinners": "restaurant",
  "family-easy-dinners": "restaurant",
  "special-occasion": "bar",
  "work-friendly-cafes": "cafe",
  "sunset-drinks": "beach_club",
  "local-and-calm": "warung",
  "just-landed": "restaurant",
  "cheap-and-brilliant": "warung",
  "worth-the-splurge": "bar",
};

export function districtArt(slug: string): string {
  return `/covers/${DISTRICT_ART[slug] ?? "restaurant"}.webp`;
}

export function collectionArt(slug: string): string {
  return `/covers/${COLLECTION_ART[slug] ?? "restaurant"}.webp`;
}

export default function ArtCard({
  href,
  art,
  eyebrow,
  title,
  blurb,
  cta,
  tall = false,
}: {
  href: string;
  art: string;
  eyebrow?: string;
  title: string;
  blurb?: string;
  cta?: string;
  tall?: boolean;
}) {
  return (
    <Link href={href} className={`art-card ${tall ? "art-card-tall" : ""}`}>
      <Image
        src={art}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="art-card-img"
      />
      <div className="art-card-scrim" aria-hidden="true" />
      <div className="art-card-body">
        {eyebrow ? <p className="art-card-eyebrow">{eyebrow}</p> : null}
        <h3 className="art-card-title">{title}</h3>
        {blurb ? <p className="art-card-blurb">{blurb}</p> : null}
        {cta ? <span className="art-card-cta">{cta} →</span> : null}
      </div>
    </Link>
  );
}
