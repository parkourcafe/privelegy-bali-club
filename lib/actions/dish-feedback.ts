const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERDICTS = new Set(["worth_it", "meh"]);

export interface DishFeedbackInput {
  venueSlug: string;
  dish: string;
  verdict: "worth_it" | "meh";
}

export function parseDishFeedback(input: unknown): DishFeedbackInput | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some((key) => !["venueSlug", "dish", "verdict"].includes(key))) {
    return null;
  }
  if (typeof value.venueSlug !== "string" || value.venueSlug.length > 136) return null;
  const venueSlug = value.venueSlug.trim().toLowerCase();
  if (venueSlug.length > 120 || !VENUE_SLUG.test(venueSlug)) return null;
  if (typeof value.verdict !== "string" || !VERDICTS.has(value.verdict)) return null;
  if (value.dish !== undefined && typeof value.dish !== "string") return null;
  const dish = (value.dish ?? "").trim().replace(/\s+/g, " ");
  if (dish.length > 120) return null;
  return {
    venueSlug,
    dish,
    verdict: value.verdict as DishFeedbackInput["verdict"],
  };
}
