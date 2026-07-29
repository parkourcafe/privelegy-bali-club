// Stage 3 — typed internal model.
//
// Every entry is observed in the repository at baseline 2ebf74e. `source` gives
// the exact file the key was read from, so nothing here is asserted without
// repository evidence (master goal rule 3).
//
// The seven FIXED DECISIONS in Stage 3 of 02_CLAUDE_CODE_MASTER_GOAL.md are
// encoded directly and marked `fixed: true`. They are not re-derived.

export const INTERNAL_MODEL = [
  // --- fixed decisions ------------------------------------------------------
  { key: 'work-session', type: 'USER_JOB', source: 'lib/moments.ts', fixed: true,
    aliases: ['work session', 'remote work', 'coworking', 'laptop', 'zoom', 'video call', 'wifi'] },
  { key: 'work-friendly', type: 'VENUE_CAPABILITY', source: 'lib/catalogue-moments.ts', fixed: true,
    aliases: ['work-friendly', 'laptop-friendly', 'power outlet', 'fast wi-fi'] },

  { key: 'family-outing', type: 'USER_JOB', source: 'lib/trip-missions.ts (family)', fixed: true,
    aliases: ['family', 'with kids', 'children', 'baby', 'kid-friendly'] },
  { key: 'family-easy', type: 'VENUE_CAPABILITY', source: 'lib/collections.ts (family-easy-dinners)', fixed: true,
    aliases: ['family-easy', 'play area', 'playground', 'high chair'] },

  { key: 'local-food', type: 'USER_JOB', source: 'lib/intents.ts (local_food_calm)', fixed: true,
    aliases: ['local food', 'warung', 'authentic local', 'locals actually eat'] },
  { key: 'local-and-calm', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', fixed: true,
    aliases: ['local-and-calm'] },

  { key: 'date-night', type: 'USER_JOB', source: 'lib/intents.ts (date_night_special)', fixed: true,
    aliases: ['date night', 'romantic dinner', 'dinner for two', 'couples dinner'] },
  { key: 'romantic', type: 'MOOD', source: 'lib/trip-missions.ts + catalogue tokens', fixed: true,
    aliases: ['romantic', 'couples'] },

  { key: 'special-occasion', type: 'OCCASION', source: 'lib/intents.ts (special_occasion)', fixed: true,
    aliases: ['special occasion', 'birthday', 'anniversary', 'celebration', 'proposal', 'engagement'] },

  { key: 'sunset', type: 'TIME_EVENT', source: 'lib/intents.ts (sunset_drinks_view)', fixed: true,
    aliases: ['sunset'] },
  { key: 'golden-hour', type: 'TIME_MODIFIER', source: 'lib/catalogue-moments.ts', fixed: true,
    aliases: ['golden hour', 'golden-hour'] },

  { key: 'save', type: 'PRODUCT_ACTION', source: 'product action set', fixed: true, aliases: ['save'] },
  { key: 'share', type: 'PRODUCT_ACTION', source: 'product action set', fixed: true, aliases: ['share'] },
  { key: 'add-to-trip', type: 'PRODUCT_ACTION', source: 'lib/trip.ts', fixed: true, aliases: ['add to trip', 'add-to-trip'] },
  { key: 'redeem', type: 'PRODUCT_ACTION', source: 'offer redemption', fixed: true, aliases: ['redeem'] },

  // --- observed runtime vocabulary -----------------------------------------
  { key: 'brunch', type: 'USER_JOB', source: 'lib/intents.ts (brunch_after_surf)',
    aliases: ['brunch', 'breakfast', 'slow morning'] },
  { key: 'group-dinner', type: 'USER_JOB', source: 'lib/intents.ts (group_dinner_share)',
    aliases: ['group', 'big table', 'share', 'bachelorette'] },
  { key: 'sunrise', type: 'TIME_EVENT', source: 'lib/catalogue-moments.ts', aliases: ['sunrise', 'dawn'] },
  { key: 'late-dinner', type: 'TIME_MODIFIER', source: 'lib/catalogue-moments.ts', aliases: ['late dinner', 'evening'] },
  { key: 'after-dark', type: 'TIME_MODIFIER', source: 'lib/catalogue-moments.ts', aliases: ['after dark', 'night', 'midnight', 'clubbing'] },
  { key: 'midday-reset', type: 'DAY_SCENARIO', source: 'lib/moments.ts', aliases: ['midday', 'lunch'] },
  { key: 'active-day', type: 'DAY_SCENARIO', source: 'lib/catalogue-moments.ts', aliases: ['active', 'surf', 'trek', 'hike', 'dive', 'snorkel'] },
  { key: 'rainy-day', type: 'DAY_SCENARIO', source: 'lib/trip-missions.ts', aliases: ['rainy', 'rain', 'indoor'] },
  { key: 'today', type: 'DAY_SCENARIO', source: 'lib/trip-missions.ts + /my-day', aliases: ['today', 'right now', 'last-minute', 'tonight'] },

  { key: 'first-time', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['first-time', 'first trip', '7-day', 'itinerary'] },
  { key: 'workation', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['workation', 'nomad'] },
  { key: 'retreat', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['retreat', 'yoga', 'meditation'] },
  { key: 'slow-living', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['slow living', 'long-term', 'month'] },
  { key: 'night-out', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['night out', 'party', 'bar'] },
  { key: 'weekend', type: 'TRIP_MISSION', source: 'lib/trip-missions.ts', aliases: ['weekend'] },

  { key: 'area-base-fit', type: 'USER_JOB', source: 'docs/seo/os/intent-registry.json', aliases: ['area to stay', 'which area', 'canggu vs', 'base'] },
  { key: 'where-to-stay', type: 'USER_JOB', source: 'docs/seo/os/intent-registry.json (sanur-where-to-stay)', aliases: ['where to stay', 'accommodation', 'villa rental', 'airbnb', 'hotel'] },
  { key: 'place-discovery', type: 'USER_JOB', source: 'lib/collections.ts + /places', aliases: ['find a place', 'explore', 'catalogue'] },
  { key: 'search-brief', type: 'USER_JOB', source: '/places?q=', aliases: ['search'] },

  { key: 'beach-club', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['beach club', 'pool', 'day pass'] },
  { key: 'wellness-spa', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['massage', 'spa', 'wellness'] },
  { key: 'vegetarian-and-plant-based', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['vegan', 'vegetarian', 'plant-based'] },
  { key: 'cheap-and-brilliant', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['cheap', 'budget', 'affordable'] },
  { key: 'worth-the-splurge', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['luxury', 'fine-dining', 'tasting menu', 'splurge'] },
  { key: 'just-landed', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['just landed', 'arrival', 'first night', 'jet-lag', 'airport'] },
  { key: 'seafood', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['seafood'] },
  { key: 'desserts', type: 'DERIVED_COLLECTION', source: 'lib/collections.ts', aliases: ['dessert', 'gelato', 'pastry', 'smoothie bowl', 'açaí', 'acai'] },

  { key: 'district-intent-spoke', type: 'EDITORIAL_PROJECTION', source: 'app/bali/[district]/[intent]/page.tsx',
    aliases: ['district', 'canggu', 'ubud', 'uluwatu', 'sanur', 'seminyak'] },
  { key: 'seo-alias', type: 'SEO_ALIAS', source: 'docs/seo/os/page-registry.json', aliases: [] },
];

/**
 * Conflicts carried over from the Hermes duplicate/conflict register.
 * Each is resolved by the corresponding fixed decision above rather than by a
 * fresh judgement, which is why none of them require an owner question.
 */
export const HERMES_CONFLICT_RESOLUTIONS = {
  CONFLICT_001: { concept: 'date-night', resolution: 'date-night is USER_JOB; romantic is MOOD. Fixed decision 4.' },
  CONFLICT_002: { concept: 'special-occasion', resolution: 'special-occasion is an independent OCCASION, not a child of date-night. Fixed decision 5.' },
  CONFLICT_003: { concept: 'sunset', resolution: 'sunset is TIME_EVENT; golden-hour is TIME_MODIFIER and not a canonical parent. Fixed decision 6.' },
};
