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

export function venueCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? "Place";
}

export function venueSchemaType(category: string): string {
  return SCHEMA_TYPES[category] ?? "LocalBusiness";
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

// A coordinate pair fit to publish as schema.org GeoCoordinates.
//
// A wrong coordinate is the least visible error this catalogue can ship: the
// card still looks correct and the traveller simply arrives somewhere else, so
// nobody reports it. Half a pair is worse than none — it reads as a precise
// claim while carrying no location at all.
//
// Rejects the artefacts rather than the merely surprising: a missing or
// non-numeric half, NaN/Infinity, anything outside the earth's own range, and
// exact 0,0, which is where an empty value lands once something parses it as a
// number. Being in the wrong district is a collection-time question and is
// checked on the way in, not here.
export function publishableGeoCoordinates(
  latitude: unknown,
  longitude: unknown,
): { latitude: number; longitude: number } | undefined {
  if (typeof latitude !== "number" || typeof longitude !== "number") return undefined;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;
  if (latitude < -90 || latitude > 90) return undefined;
  if (longitude < -180 || longitude > 180) return undefined;
  if (latitude === 0 && longitude === 0) return undefined;
  return { latitude, longitude };
}
