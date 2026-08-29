import type { VenueCategory } from "./types";

export type WellnessKind = "yoga" | "spa" | "ayurveda" | "sound" | "retreat";
export type WellnessArea = "central" | "south-east" | "west" | "north" | "river" | "other";
export type WellnessPrice = "$" | "$$" | "$$$" | "$$$$" | "unlisted";

export const WELLNESS_KIND_OPTIONS: { value: WellnessKind; label: string }[] = [
  { value: "yoga", label: "Yoga & movement" },
  { value: "spa", label: "Spa & massage" },
  { value: "ayurveda", label: "Ayurveda" },
  { value: "sound", label: "Sound & healing" },
  { value: "retreat", label: "Retreats" },
];

export const WELLNESS_AREA_OPTIONS: { value: WellnessArea; label: string }[] = [
  { value: "central", label: "Central Ubud" },
  { value: "south-east", label: "Pengosekan & Peliatan" },
  { value: "west", label: "Penestanan & Sayan" },
  { value: "river", label: "Kedewatan & Sanggingan" },
  { value: "north", label: "North Ubud" },
  { value: "other", label: "Other Ubud" },
];

function searchableText(values: unknown[]): string {
  return values
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLocaleLowerCase("en");
}

export function wellnessKinds(input: {
  category: VenueCategory;
  name: string;
  editorialLine?: string;
  bestFor?: string;
}): WellnessKind[] {
  const text = searchableText([
    input.name,
    input.editorialLine,
    input.bestFor,
  ]);
  const kinds = new Set<WellnessKind>();

  if (
    input.category === "yoga" ||
    input.category === "fitness" ||
    /\b(yoga|shala|vinyasa|hatha|yin|movement|meditation)\b/.test(text)
  ) kinds.add("yoga");
  if (
    input.category === "spa" ||
    input.category === "beauty" ||
    /\b(spa|massage|facial|body treatment|flower bath|reflexology|sauna)\b/.test(text)
  ) kinds.add("spa");
  if (/\b(ayurved|panchakarma|abhyanga|shirodhara|dosha)\w*/.test(text)) kinds.add("ayurveda");
  if (/\b(sound|healing|reiki|chakra|cacao|ceremon)\w*/.test(text)) kinds.add("sound");
  if (/\b(retreat|multi-day|multi-night|teacher training|detox program)\w*/.test(text)) kinds.add("retreat");

  return [...kinds];
}

export function wellnessArea(area?: string): WellnessArea {
  const value = area?.toLocaleLowerCase("en") ?? "";
  if (/central|bisma|monkey forest|padang tegal|goutama|near centre/.test(value) || value === "ubud") {
    return "central";
  }
  if (/pengosekan|nyuh kuning|peliatan|mas\b/.test(value)) return "south-east";
  if (/penestanan|sayan|campuhan/.test(value)) return "west";
  if (/kedewatan|sanggingan|ayung/.test(value)) return "river";
  if (/bentuyung|payogan|bangkiang sidem|north/.test(value)) return "north";
  return "other";
}

export function wellnessPrice(value?: string): WellnessPrice {
  const match = value?.trim().match(/^\${1,4}(?!\$)/);
  return (match?.[0] as WellnessPrice | undefined) ?? "unlisted";
}

export function distanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  const radiusKm = 6371;
  const radians = Math.PI / 180;
  const fromLat = from.latitude * radians;
  const toLat = to.latitude * radians;
  const deltaLat = (to.latitude - from.latitude) * radians;
  const deltaLng = (to.longitude - from.longitude) * radians;
  const a = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m away`;
  return `${new Intl.NumberFormat("en", { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km)} km away`;
}
