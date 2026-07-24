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
