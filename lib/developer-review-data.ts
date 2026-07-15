import "server-only";

import compiledCapabilities from "@/data/data-ops/compiled/capabilities.json";
import compiledMenus from "@/data/data-ops/compiled/menus.json";
import type {
  ActionKind,
  MenuItemRecord,
  MenuRecord,
  MenuSectionRecord,
  VenueActionCapabilityRecord,
} from "@/lib/contracts/menu-action";
import { requirePhotoReviewRequest } from "@/lib/photo-review-request-auth";

type ReviewCatalogueSignal = {
  hasPreparedMenu: boolean;
  preparedActionKinds: ActionKind[];
};

type DeveloperReviewVenueExtension = ReviewCatalogueSignal & {
  menu: MenuRecord | null;
  actionCapabilities: VenueActionCapabilityRecord[];
};

type UnknownRow = Record<string, unknown>;

const actionKinds = new Set<ActionKind>([
  "reserve",
  "delivery",
  "takeaway",
  "preorder",
  "website",
  "whatsapp",
  "maps",
]);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown): string | null {
  return text(value) || null;
}

function integer(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : fallback;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function safeHttpsUrl(value: unknown): string | null {
  const raw = text(value);
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

function mapItem(row: UnknownRow): MenuItemRecord | null {
  const id = text(row.id);
  const name = text(row.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    description: nullableText(row.description),
    priceMinor: row.priceMinor == null ? null : integer(row.priceMinor),
    currency: nullableText(row.currency),
    priceText: nullableText(row.priceText),
    dietaryTags: stringList(row.dietaryTags),
    verifiedAllergenTags: stringList(row.verifiedAllergenTags),
    partnerRecommended: Boolean(row.partnerRecommended),
    editorialPick: Boolean(row.editorialPick),
    editorialNote: nullableText(row.editorialNote),
    availabilityNote: nullableText(row.availabilityNote),
    position: integer(row.position),
  };
}

function mapSection(row: UnknownRow): MenuSectionRecord | null {
  const id = text(row.id);
  const name = text(row.name);
  if (!id || !name) return null;
  const itemRows = Array.isArray(row.items) ? row.items as UnknownRow[] : [];
  return {
    id,
    name,
    description: nullableText(row.description),
    position: integer(row.position),
    items: itemRows.flatMap((item) => {
      const mapped = mapItem(item);
      return mapped ? [mapped] : [];
    }),
  };
}

function mapMenu(row: UnknownRow): MenuRecord | null {
  const id = text(row.id);
  const venueSlug = text(row.venueSlug);
  const sourceUrl = safeHttpsUrl(row.sourceUrl);
  const capturedAt = text(row.capturedAt);
  if (!id || !venueSlug || !sourceUrl || !capturedAt) return null;
  const sectionRows = Array.isArray(row.sections) ? row.sections as UnknownRow[] : [];
  return {
    id,
    venueSlug,
    title: text(row.title) || "Prepared menu",
    version: integer(row.version, 1),
    status: row.status === "review" ? "review" : "draft",
    completeness: row.completeness === "full" ? "full" : "partial",
    sourceUrl,
    sourceLabel: text(row.sourceLabel) || "Official venue source",
    capturedAt,
    verifiedAt: null,
    expiresAt: null,
    sections: sectionRows.flatMap((section) => {
      const mapped = mapSection(section);
      return mapped ? [mapped] : [];
    }),
  };
}

function mapCapability(row: UnknownRow): VenueActionCapabilityRecord | null {
  const id = text(row.id);
  const venueSlug = text(row.venueSlug);
  const kind = text(row.kind) as ActionKind;
  const url = safeHttpsUrl(row.url);
  const sourceUrl = safeHttpsUrl(row.sourceUrl);
  const capturedAt = text(row.capturedAt);
  if (!id || !venueSlug || !actionKinds.has(kind) || !url || !sourceUrl || !capturedAt) return null;
  return {
    id,
    venueSlug,
    kind,
    provider: text(row.provider),
    url,
    label: nullableText(row.label),
    status: row.status === "review" ? "review" : "draft",
    priority: integer(row.priority),
    confirmationRequired: Boolean(row.confirmationRequired),
    sourceUrl,
    sourceLabel: text(row.sourceLabel) || "Official venue source",
    capturedAt,
    verifiedAt: null,
    expiresAt: null,
  };
}

const preparedMenus = (compiledMenus.menus as unknown as UnknownRow[])
  .flatMap((row) => {
    const mapped = mapMenu(row);
    return mapped ? [mapped] : [];
  });

const preparedCapabilities = (compiledCapabilities.capabilities as unknown as UnknownRow[])
  .flatMap((row) => {
    const mapped = mapCapability(row);
    return mapped ? [mapped] : [];
  });

const menusBySlug = new Map(preparedMenus.map((menu) => [menu.venueSlug, menu] as const));
const capabilitiesBySlug = new Map<string, VenueActionCapabilityRecord[]>();
for (const capability of preparedCapabilities) {
  const rows = capabilitiesBySlug.get(capability.venueSlug) ?? [];
  rows.push(capability);
  capabilitiesBySlug.set(capability.venueSlug, rows);
}

function signalForSlug(slug: string): ReviewCatalogueSignal {
  const capabilities = capabilitiesBySlug.get(slug) ?? [];
  return {
    hasPreparedMenu: menusBySlug.has(slug),
    preparedActionKinds: [...new Set(capabilities.map((capability) => capability.kind))],
  };
}

export async function getDeveloperReviewCatalogueSignals(): Promise<Map<string, ReviewCatalogueSignal>> {
  await requirePhotoReviewRequest();
  const slugs = new Set([...menusBySlug.keys(), ...capabilitiesBySlug.keys()]);
  return new Map([...slugs].map((slug) => [slug, signalForSlug(slug)] as const));
}

export async function getDeveloperReviewVenueExtension(
  venueSlug: string,
): Promise<DeveloperReviewVenueExtension> {
  await requirePhotoReviewRequest();
  const actionCapabilities = [...(capabilitiesBySlug.get(venueSlug) ?? [])]
    .sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
  return {
    menu: menusBySlug.get(venueSlug) ?? null,
    actionCapabilities,
    ...signalForSlug(venueSlug),
  };
}
