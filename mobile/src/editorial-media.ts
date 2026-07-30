import type { MobileVenue } from "../../lib/mobile-api/contracts";

const ORIGIN = "https://www.otherbali.com";

// These are the approved atmospheric guide scenes already published on the
// website. They are area/moment illustrations, never proof of a named venue.
const AREA_SCENES: Record<string, readonly string[]> = {
  canggu: ["canggu-area-batu-bolong", "canggu-area-berawa", "canggu-area-pererenan", "canggu-area-echo-beach"],
  ubud: ["district-ubud", "ubud-culture-gateway-illustrative", "ubud-greenery-terraces-illustrative", "ubud-river-valley-illustrative"],
  seminyak: ["district-seminyak", "seminyak-dining-street-illustrative", "seminyak-sunset-beach-illustrative", "seminyak-walkable-neighbourhood-illustrative"],
  sanur: ["district-sanur", "sanur-sunrise-promenade-illustrative", "sanur-calm-family-coast-illustrative", "sanur-harbor-handoff-illustrative"],
  jimbaran: ["district-jimbaran", "guide-jimbaran-bay-sunset"],
  "uluwatu-bukit": ["district-uluwatu-bukit", "uluwatu-cliff-coast-illustrative", "uluwatu-bukit-approach-illustrative", "uluwatu-surf-coast-illustrative"],
  "nusa-dua": ["district-nusa-dua", "nusa-dua-resort-promenade-illustrative", "nusa-dua-calm-family-beach-illustrative", "nusa-dua-watersports-coast-illustrative"],
  "nusa-penida": ["nusa-penida-west-loop-illustrative", "nusa-penida-east-loop-illustrative", "nusa-penida-water-adventure-illustrative"],
  "kuta-legian": ["district-kuta-legian"],
  sidemen: ["district-sidemen"],
  amed: ["district-amed"],
  munduk: ["district-munduk"],
  lovina: ["district-lovina"],
  "nusa-islands": ["district-nusa-islands"],
  "gili-islands": ["district-gili-islands"],
  lombok: ["district-lombok"],
};

function stableIndex(value: string, length: number): number {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return length ? hash % length : 0;
}

export function editorialImageUrl(venue: Pick<MobileVenue, "id" | "district">): string {
  const scenes = AREA_SCENES[venue.district] ?? ["hero-sunset"];
  return `${ORIGIN}/scenes/${scenes[stableIndex(venue.id, scenes.length)]}.webp`;
}

export const editorialHeroPosterUrl = `${ORIGIN}/scenes/together-hero-dinner.webp`;
export const editorialHeroVideoUrl = `${ORIGIN}/scenes/together-hero-loop.mp4`;
