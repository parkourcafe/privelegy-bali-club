const SCHEMA_TYPE_BY_CATEGORY: Readonly<Record<string, string>> = {
  cafe: "CafeOrCoffeeShop",
  warung: "Restaurant",
  restaurant: "Restaurant",
  beach_club: "Restaurant",
  bar: "BarOrPub",
  spa: "HealthAndBeautyBusiness",
  beauty: "HealthAndBeautyBusiness",
  fitness: "SportsActivityLocation",
  yoga: "SportsActivityLocation",
  surf: "SportsActivityLocation",
};

export function schemaTypeForVenueCategory(category: unknown): string {
  return typeof category === "string"
    ? SCHEMA_TYPE_BY_CATEGORY[category] ?? "LocalBusiness"
    : "LocalBusiness";
}
