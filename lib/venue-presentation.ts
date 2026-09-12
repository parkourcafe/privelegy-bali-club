const CATEGORY_LABELS: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  beauty: "Beauty & salon",
  fitness: "Fitness",
  yoga: "Yoga",
  bar: "Bar",
  surf: "Surf",
  hotel: "Hotel",
  resort: "Resort",
  villa: "Villa",
  attraction: "Attraction",
  activity: "Activity",
};

const SCHEMA_TYPES: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  bar: "BarOrPub",
  beach_club: "LocalBusiness",
  warung: "Restaurant",
  spa: "HealthAndBeautyBusiness",
  beauty: "HealthAndBeautyBusiness",
  fitness: "ExerciseGym",
  yoga: "SportsActivityLocation",
  surf: "SportsActivityLocation",
  hotel: "Hotel",
  resort: "Resort",
  villa: "LodgingBusiness",
  attraction: "TouristAttraction",
  activity: "TouristAttraction",
};

type VenueSchemaInput = {
  name: string;
  description?: string;
  category?: string;
};

type SchemaTypeRule = readonly [pattern: RegExp, schemaType: string];

// Accommodation is inferred from the venue name only. Descriptions commonly
// mention the hotel or resort that hosts a restaurant, spa, or yoga studio;
// treating that parent property as the venue would create a new false claim.
const LODGING_SCHEMA_RULES: readonly SchemaTypeRule[] = [
  [/\bhotel\b/i, "Hotel"],
  [/\bresort\b/i, "Resort"],
  [/\b(villa|villas)\b/i, "LodgingBusiness"],
  [/\bhostel\b/i, "Hostel"],
  [/\b(guesthouse|homestay|bungalow|inn|suites)\b/i, "LodgingBusiness"],
];

const HOSTED_SUBVENUE_NAME =
  /\b(restaurant|warung|caf[eé]|coffee|bar|pub|lounge|night ?club|club|spa|massage|salon|yoga|gym|fitness)\b.*\b(at|in|inside|within|of)\b.*\b(hotel|resort|villa|villas)\b/i;

const ACTIVITY_SCHEMA_RULES: readonly SchemaTypeRule[] = [
  [/\bbeach club\b/i, "NightClub"],
  [/\b(bar|pub|lounge|rooftop bar)\b/i, "BarOrPub"],
  [/\bnight ?club\b/i, "NightClub"],
  [/\b(spa|massage)\b/i, "DaySpa"],
  [/\bsalon\b/i, "BeautySalon"],
  [/\b(waterfall|temple|viewpoint|attraction|monument)\b/i, "TouristAttraction"],
];

// Descriptions are used only when they open by defining the entity. A keyword
// later in prose often names a parent property or nearby amenity (for example,
// a yoga studio "in the Bay Club"), not the venue being described.
const DESCRIPTION_SCHEMA_RULES: readonly SchemaTypeRule[] = [
  [/^\s*(?:(?:a|an|the)\s+)?(?:(?:boutique|luxury|small|private|beachfront|balinese|family-run)\s+){0,3}hotel\b/i, "Hotel"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:(?:boutique|luxury|small|private|beachfront|balinese|family-run)\s+){0,3}resort\b/i, "Resort"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:(?:boutique|luxury|small|private|beachfront|balinese|family-run)\s+){0,3}(?:villa|villas)\b/i, "LodgingBusiness"],
  [/^\s*(?:(?:a|an|the)\s+)?hostel\b/i, "Hostel"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:guesthouse|homestay|bungalow|inn|suites)\b/i, "LodgingBusiness"],
  [/^\s*(?:(?:a|an|the)\s+)?beach club\b/i, "NightClub"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:bar|pub|lounge|rooftop bar)\b/i, "BarOrPub"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:night ?club|club)\b/i, "NightClub"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:(?:day|wellness)\s+)?(?:spa|massage)\b/i, "DaySpa"],
  [/^\s*(?:(?:a|an|the)\s+)?salon\b/i, "BeautySalon"],
  [/^\s*(?:(?:a|an|the)\s+)?(?:waterfall|temple|viewpoint|attraction|monument)\b/i, "TouristAttraction"],
];

const CATEGORY_SCHEMA_FALLBACK: readonly SchemaTypeRule[] = [
  [/restaurant|warung|dining|food|cuisine/i, "Restaurant"],
  [/caf[eé]|coffee/i, "CafeOrCoffeeShop"],
  [/\byoga\b/i, "SportsActivityLocation"],
  [/gym|fitness/i, "ExerciseGym"],
  [/spa|wellness|massage|beauty/i, "HealthAndBeautyBusiness"],
];

export function venueCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? "Place";
}

export function venueSchemaType(category: string): string {
  return SCHEMA_TYPES[category] ?? "LocalBusiness";
}

export function resolveVenueSchemaType(venue: VenueSchemaInput): string {
  if (!HOSTED_SUBVENUE_NAME.test(venue.name)) {
    for (const [pattern, schemaType] of LODGING_SCHEMA_RULES) {
      if (pattern.test(venue.name)) return schemaType;
    }
  }

  for (const [pattern, schemaType] of ACTIVITY_SCHEMA_RULES) {
    if (pattern.test(venue.name)) return schemaType;
  }

  for (const [pattern, schemaType] of DESCRIPTION_SCHEMA_RULES) {
    if (pattern.test(venue.description ?? "")) return schemaType;
  }

  // "Club" alone is ambiguous (surf club, sports club, Club Med). Allow the
  // nightlife interpretation only when the existing rubric independently
  // supports it; explicit beach-club/nightclub names were handled above.
  if (/\bclub\b/i.test(venue.name) && /bar|beach[_ -]?club|night/i.test(venue.category ?? "")) {
    return "NightClub";
  }

  if (venue.category) {
    for (const [pattern, schemaType] of CATEGORY_SCHEMA_FALLBACK) {
      if (pattern.test(venue.category)) return schemaType;
    }
    return venueSchemaType(venue.category);
  }

  return "LocalBusiness";
}

export function venueCoverAssetCategory(category: string): string {
  return category === "villa" ? "hotel" : category;
}

// A street address fit to publish as schema.org PostalAddress.streetAddress.
//
// venues.full_address is not reliably an address. Most rows hold an area note
// ("Canggu/Batu Bolong/Berawa", "Pecatu / uluwatu bukit", "Ubud") and a few
// hold an operator's working note ("Berawa boundary / verify pin", "Canggu
// shortcut / verify branch"). Publishing those as a postal address states
// something false about where the venue is, and unlike a visibly empty field
// nobody notices. Unknown means omit (guardrail #10).
//
// Accepted only with an explicit street marker — Jl./Jalan/Gang/Banjar/Br. or
// an English street word — and never when the text carries a working note.
const STREET_MARKER =
  /(^|[\s,.])(jl\.?|jalan|gg\.?|gang|banjar|br\.|street|st\.|road|rd\.|avenue|ave\.)([\s,.]|$)/i;
const WORKING_NOTE = /\b(verify|verified|tbc|todo|check|confirm|edge|boundary|approx)\b/i;

export function publishableStreetAddress(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length < 12) return undefined;
  if (WORKING_NOTE.test(text)) return undefined;
  if (!STREET_MARKER.test(text)) return undefined;
  return text;
}
