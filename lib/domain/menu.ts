import type { MenuItemRecord, MenuRecord, MenuSectionRecord } from "../contracts/menu-action";
import { validatePublicEvidenceUrl } from "../integrations/external-ordering";

export type DataRow = Record<string, unknown>;

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const nullableText = (value: unknown): string | null => text(value) || null;
const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const number = (value: unknown, fallback = 0): number =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

export function isFresh(expiresAt: string | null, now = new Date()): boolean {
  if (!expiresAt) return false;
  const expiry = Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry > now.getTime();
}

export function mapMenuItem(row: DataRow): MenuItemRecord {
  return {
    id: text(row.id),
    name: text(row.name),
    description: nullableText(row.description),
    priceMinor: row.price_minor == null ? null : number(row.price_minor),
    currency: nullableText(row.currency),
    priceText: nullableText(row.price_text),
    dietaryTags: stringArray(row.dietary_tags),
    verifiedAllergenTags: stringArray(row.verified_allergen_tags),
    partnerRecommended: Boolean(row.partner_recommended),
    editorialPick: Boolean(row.editorial_pick),
    editorialNote: nullableText(row.editorial_note),
    availabilityNote: nullableText(row.availability_note),
    position: number(row.position),
  };
}

export function mapMenuSection(row: DataRow, itemRows: DataRow[]): MenuSectionRecord {
  return {
    id: text(row.id),
    name: text(row.name),
    description: nullableText(row.description),
    position: number(row.position),
    items: itemRows
      .filter((item) => text(item.section_id) === text(row.id))
      .map(mapMenuItem)
      .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name) || a.id.localeCompare(b.id)),
  };
}

export function mapPublishedMenu(
  row: DataRow,
  sectionRows: DataRow[],
  itemRows: DataRow[],
  now = new Date()
): MenuRecord | null {
  const verifiedAt = nullableText(row.verified_at);
  const expiresAt = nullableText(row.expires_at);
  const sourceUrl = validatePublicEvidenceUrl(row.source_url);
  if (
    text(row.status) !== "published" ||
    !verifiedAt ||
    !isFresh(expiresAt, now) ||
    !sourceUrl
  ) return null;

  return {
    id: text(row.id),
    venueSlug: text(row.venue_slug),
    title: text(row.title),
    version: number(row.version, 1),
    status: "published",
    sourceUrl,
    sourceLabel: text(row.source_label),
    capturedAt: text(row.captured_at),
    verifiedAt,
    expiresAt,
    sections: sectionRows
      .filter((section) => text(section.menu_id) === text(row.id))
      .map((section) => mapMenuSection(section, itemRows))
      .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name) || a.id.localeCompare(b.id)),
  };
}
