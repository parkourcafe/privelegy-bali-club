import { requireAdminRequest } from "@/lib/admin-request-auth";
import { serviceClient } from "@/lib/supabase/service";
import {
  evaluateActions, evaluateMenus, evaluateVenues, sortFreshnessIssues,
  type AdminActionRow, type AdminMenuRow, type AdminVenueRow, type FreshnessIssue,
} from "../../../components/admin/freshness-model";

export type AdminMenuItemReview = {
  id: string;
  name: string;
  description: string | null;
  price_minor: number | null;
  currency: string | null;
  dietary_tags: string[];
  verified_allergen_tags: string[];
  partner_recommended: boolean;
  editorial_pick: boolean;
  editorial_note: string | null;
  availability_note: string | null;
  position: number;
};

export type AdminMenuSectionReview = {
  id: string;
  name: string;
  description: string | null;
  position: number;
  items: AdminMenuItemReview[];
};

export type AdminMenuReview = AdminMenuRow & {
  title: string;
  version: number;
  venue_name: string;
  sections: AdminMenuSectionReview[];
};

export type FreshnessQueueResult = {
  configured: boolean;
  issues: FreshnessIssue[];
  error: string | null;
  counts: { menus: number; actions: number; venues: number };
  menus: AdminMenuReview[];
  actions: AdminActionRow[];
  venues: AdminVenueRow[];
};

const EMPTY_COUNTS = { menus: 0, actions: 0, venues: 0 };

function emptyResult(configured: boolean, error: string | null = null): FreshnessQueueResult {
  return { configured, issues: [], error, counts: EMPTY_COUNTS, menus: [], actions: [], venues: [] };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown): string | null {
  return text(value) || null;
}

function number(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function getFreshnessQueue(): Promise<FreshnessQueueResult> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return emptyResult(false);
  const [menuResult, sectionResult, itemResult, actionResult, venueResult] = await Promise.all([
    client.from("menus").select("id,venue_slug,title,version,status,source_url,source_label,captured_at,verified_at,expires_at").neq("status", "archived").order("venue_slug").order("version", { ascending: false }),
    client.from("menu_sections").select("id,menu_id,name,description,position").order("position"),
    client.from("menu_items").select("id,menu_id,section_id,name,description,price_minor,currency,dietary_tags,verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,availability_note,position").order("position"),
    client.from("venue_action_capabilities").select("id,venue_slug,kind,provider,label,status,url,source_url,source_label,captured_at,verified_at,expires_at"),
    client.from("venues").select("slug,name,status,publication_status,gmaps_url,last_verified_at"),
  ]);
  const firstError = menuResult.error ?? sectionResult.error ?? itemResult.error ?? actionResult.error ?? venueResult.error;
  if (firstError) return emptyResult(true, firstError.message);

  const venues = (venueResult.data ?? []) as AdminVenueRow[];
  const venueNames = new Map(venues.map((venue) => [venue.slug, venue.name?.trim() || venue.slug]));
  const sectionsByMenu = new Map<string, AdminMenuSectionReview[]>();
  const itemsBySection = new Map<string, AdminMenuItemReview[]>();

  for (const row of itemResult.data ?? []) {
    const sectionId = text(row.section_id);
    const items = itemsBySection.get(sectionId) ?? [];
    items.push({
      id: text(row.id),
      name: text(row.name),
      description: nullableText(row.description),
      price_minor: row.price_minor == null ? null : number(row.price_minor),
      currency: nullableText(row.currency),
      dietary_tags: stringArray(row.dietary_tags),
      verified_allergen_tags: stringArray(row.verified_allergen_tags),
      partner_recommended: Boolean(row.partner_recommended),
      editorial_pick: Boolean(row.editorial_pick),
      editorial_note: nullableText(row.editorial_note),
      availability_note: nullableText(row.availability_note),
      position: number(row.position),
    });
    itemsBySection.set(sectionId, items);
  }

  for (const row of sectionResult.data ?? []) {
    const menuId = text(row.menu_id);
    const sections = sectionsByMenu.get(menuId) ?? [];
    sections.push({
      id: text(row.id),
      name: text(row.name),
      description: nullableText(row.description),
      position: number(row.position),
      items: (itemsBySection.get(text(row.id)) ?? []).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)),
    });
    sectionsByMenu.set(menuId, sections);
  }

  const menus = (menuResult.data ?? []).map((row): AdminMenuReview => {
    const id = text(row.id);
    const sections = (sectionsByMenu.get(id) ?? []).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
    return {
      id,
      venue_slug: text(row.venue_slug),
      venue_name: venueNames.get(text(row.venue_slug)) ?? text(row.venue_slug),
      title: text(row.title),
      version: number(row.version, 1),
      status: text(row.status),
      source_url: nullableText(row.source_url),
      source_label: nullableText(row.source_label),
      captured_at: nullableText(row.captured_at),
      verified_at: nullableText(row.verified_at),
      expires_at: nullableText(row.expires_at),
      section_count: sections.length,
      item_count: sections.reduce((total, section) => total + section.items.length, 0),
      sections,
    };
  });
  const actions = (actionResult.data ?? []) as AdminActionRow[];
  return {
    configured: true,
    issues: sortFreshnessIssues([...evaluateMenus(menus), ...evaluateActions(actions), ...evaluateVenues(venues)]),
    error: null,
    counts: { menus: menus.length, actions: actions.length, venues: venues.length },
    menus,
    actions,
    venues,
  };
}
