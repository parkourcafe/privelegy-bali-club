/**
 * Runtime taxonomy shared by the public mobile API and bundled native shell.
 * Keep this deliberately small: importing the broader editorial schemas would
 * couple a store release to unrelated migration and moderation work.
 */
export const MOBILE_VENUE_TYPES = [
  "bar",
  "beach_club",
  "beauty",
  "cafe",
  "fitness",
  "restaurant",
  "spa",
  "surf",
  "warung",
  "yoga",
] as const;

export const MOBILE_DISTRICTS = [
  "amed",
  "canggu",
  "gili-islands",
  "jimbaran",
  "kuta-legian",
  "lombok",
  "lovina",
  "munduk",
  "nusa-dua",
  "nusa-islands",
  "sanur",
  "seminyak",
  "sidemen",
  "ubud",
  "uluwatu-bukit",
] as const;

export const MOBILE_CONSENT_VERSION = "2026-07-14";
