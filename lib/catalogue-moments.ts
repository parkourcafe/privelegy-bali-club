// Moment chips for the /places catalogue — the mockup's "MOMENT" filter row.
//
// Each moment is an honest any-match token bundle over fields editors already
// wrote (jobs, vibe tags, why-it's-here, best-for): the same haystack the
// intent search uses. No invented data — a venue matches a moment only when
// its own editorial record says so (guardrail #10). Bundles use substring
// match, so canonical job slugs count too (e.g. "sunset_drinks_view" matches
// the "sunset" token).
export type CatalogueMoment = {
  slug: string; // URL value for ?moment=
  label: string; // chip + badge copy
  tokens: readonly string[]; // any-match against the venue haystack
};

export const CATALOGUE_MOMENTS: readonly CatalogueMoment[] = [
  { slug: "golden-hour", label: "Golden hour", tokens: ["sunset", "golden"] },
  { slug: "sunrise", label: "Sunrise", tokens: ["sunrise", "dawn"] },
  {
    slug: "slow-morning",
    label: "Slow morning",
    tokens: ["slow", "breakfast", "brunch", "morning"],
  },
  {
    slug: "late-dinner",
    label: "Late dinner",
    tokens: ["dinner", "date_night", "evening"],
  },
  {
    slug: "after-dark",
    label: "After dark",
    tokens: ["night", "cocktail", "bar", "live music"],
  },
  // Situational moments (not time-of-day). Same honest any-match rule: a venue
  // appears only where its own editorial record already carries the signal, so
  // an empty match just means the place isn't tagged for it (guardrail #10).
  // Tokens verified against the live tag/job vocabulary (families, laptop,
  // wifi, work, surf, yoga, divers, hikers, date_night, couples).
  {
    slug: "date-night",
    label: "Date night",
    tokens: ["date night", "date_night", "romantic", "couples"],
  },
  {
    slug: "with-family",
    label: "With family",
    tokens: ["famil", "kids", "children"],
  },
  {
    slug: "work-friendly",
    label: "Work-friendly",
    tokens: ["work", "laptop", "wifi"],
  },
  {
    slug: "active-day",
    label: "Active day",
    tokens: ["surf", "yoga", "hiker", "diver", "snorkel", "fitness", "gym"],
  },
] as const;

export const MOMENT_BY_SLUG = new Map(
  CATALOGUE_MOMENTS.map((moment) => [moment.slug, moment] as const),
);
