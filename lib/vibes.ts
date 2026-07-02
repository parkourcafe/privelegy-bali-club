// Verified vibe taxonomy v1 (master §10). A tag is only ever set after an
// on-site visit (noise / wifi / sockets checked) — a tag "by eye" would degrade
// us to Google Maps level. This is the core of personalization without AI.
export const VIBES = [
  "quiet",
  "lively",
  "party",
  "romantic",
  "view",
  "family",
  "work-friendly",
] as const;

export type Vibe = (typeof VIBES)[number];
