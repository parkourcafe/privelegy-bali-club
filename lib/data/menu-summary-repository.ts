import { cache as reactCache } from "react";
import { unstable_cache } from "next/cache";
import type { MenuKind, MenuRecord, MenuSectionRecord } from "../contracts/menu-action";
import { mapPublishedMenu, type DataRow } from "../domain/menu";
import { anonClient, isSupabaseConfigured } from "../supabase/server";
import {
  PUBLIC_CACHE_REVALIDATE_SECONDS,
  PUBLIC_CACHE_TAGS,
} from "./public-cache";

const MENU_COLUMNS =
  "id,venue_slug,title,version,status,completeness,kind,source_url,source_label,captured_at,verified_at,expires_at";
const SECTION_COLUMNS = "id,menu_id,name,description,position";
const ITEM_COLUMNS =
  "id,section_id,name,description,price_minor,currency,price_text,dietary_tags,verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,availability_note,position";

export type PublicMenuSectionSummary = MenuSectionRecord & {
  itemCount: number;
  deferred: boolean;
};

export type PublicMenuSummary = Omit<MenuRecord, "sections"> & {
  sections: PublicMenuSectionSummary[];
};

// The first section always renders inline regardless of size (it's the
// above-the-fold content). Beyond that, only sections large enough to matter
// for HTML weight are deferred to a client fetch on expand — a small drinks
// or sides section (a handful of items) costs nothing to render inline and
// gains nothing from an extra round-trip, so it stays fully server-rendered
// and crawlable. Tune this threshold if real menus show it's off.
const LARGE_SECTION_ITEM_THRESHOLD = 12;

async function fetchPublishedMenuSummary(
  venueSlug: string,
  kind: MenuKind = "food",
): Promise<PublicMenuSummary | null> {
  if (!venueSlug || !isSupabaseConfigured()) return null;
  const client = anonClient();
  if (!client) return null;
  try {
    const { data: menus, error } = await client
      .from("menus")
      .select(MENU_COLUMNS)
      .eq("venue_slug", venueSlug)
      .eq("kind", kind)
      .eq("status", "published")
      .eq("completeness", "full")
      .order("version", { ascending: false })
      .limit(1);
    if (error || !menus?.[0]) return null;
    const menu = menus[0] as DataRow;
    const { data: sectionRows, error: sectionError } = await client
      .from("menu_sections")
      .select(SECTION_COLUMNS)
      .eq("menu_id", menu.id)
      .order("position");
    if (sectionError) return null;
    const sections = (sectionRows ?? []) as DataRow[];

    // Fetch every item row up front. This whole call is shared across all
    // guests via the 5-minute unstable_cache below, so the marginal Supabase
    // cost of full item rows (vs. a lightweight id-only count) is negligible —
    // it lets small sections stay eagerly rendered instead of guessing from a
    // count alone.
    const { data: itemRows, error: itemError } = await client
      .from("menu_items")
      .select(ITEM_COLUMNS)
      .eq("menu_id", menu.id)
      .order("position");
    if (itemError) return null;

    const mapped = mapPublishedMenu(menu, sections, (itemRows ?? []) as DataRow[]);
    if (!mapped) return null;

    return {
      ...mapped,
      sections: mapped.sections.map((section, index) => {
        const itemCount = section.items.length;
        const deferred = index > 0 && itemCount > LARGE_SECTION_ITEM_THRESHOLD;
        return {
          ...section,
          itemCount,
          deferred,
          // Only genuinely large sections have their items withheld from the
          // initial HTML; everything else stays fully server-rendered.
          items: deferred ? [] : section.items,
        };
      }),
    };
  } catch {
    return null;
  }
}

const getCachedPublishedMenuSummary = unstable_cache(
  fetchPublishedMenuSummary,
  ["published-menu-summary-v1"],
  {
    revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.menus],
  },
);

export const getPublishedMenuSummary = reactCache(
  getCachedPublishedMenuSummary,
);

// A hotel/resort venue may carry several published menus at once (rooms,
// dining, spa, day pass) -- fetched in parallel, one per kind, reusing the
// exact same cached/gated reader as the single-menu case (migration 0051).
export type HotelMenusByKind = {
  rooms: PublicMenuSummary | null;
  dining: PublicMenuSummary | null;
  spa: PublicMenuSummary | null;
  dayPass: PublicMenuSummary | null;
};

async function fetchPublishedMenusForVenue(
  venueSlug: string,
): Promise<HotelMenusByKind> {
  const [dining, rooms, spa, dayPass] = await Promise.all([
    getCachedPublishedMenuSummary(venueSlug, "food"),
    getCachedPublishedMenuSummary(venueSlug, "rooms"),
    getCachedPublishedMenuSummary(venueSlug, "spa"),
    getCachedPublishedMenuSummary(venueSlug, "day_pass"),
  ]);
  return { rooms, dining, spa, dayPass };
}

export const getPublishedMenusForVenue = reactCache(fetchPublishedMenusForVenue);

async function fetchPublishedMenuSection(
  venueSlug: string,
  menuId: string,
  sectionId: string,
): Promise<MenuSectionRecord | null> {
  if (!venueSlug || !menuId || !sectionId || !isSupabaseConfigured()) return null;
  const client = anonClient();
  if (!client) return null;
  try {
    const { data: menu, error: menuError } = await client
      .from("menus")
      .select(MENU_COLUMNS)
      .eq("id", menuId)
      .eq("venue_slug", venueSlug)
      .eq("status", "published")
      .eq("completeness", "full")
      .maybeSingle();
    if (menuError || !menu) return null;
    const [{ data: section, error: sectionError }, { data: items, error: itemError }] =
      await Promise.all([
        client
          .from("menu_sections")
          .select(SECTION_COLUMNS)
          .eq("id", sectionId)
          .eq("menu_id", menuId)
          .maybeSingle(),
        client
          .from("menu_items")
          .select(ITEM_COLUMNS)
          .eq("menu_id", menuId)
          .eq("section_id", sectionId)
          .order("position"),
      ]);
    if (sectionError || itemError || !section) return null;
    return (
      mapPublishedMenu(
        menu as DataRow,
        [section as DataRow],
        (items ?? []) as DataRow[],
      )?.sections[0] ?? null
    );
  } catch {
    return null;
  }
}

const getCachedPublishedMenuSection = unstable_cache(
  fetchPublishedMenuSection,
  ["published-menu-section-v1"],
  {
    revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.menus],
  },
);

export const getPublishedMenuSection = reactCache(
  getCachedPublishedMenuSection,
);
