import type {
  ActionKind,
  SafeActionEventPayload,
} from "../contracts/menu-action";
import type { SafeEventPayload, SafeMenuEventPayload } from "./event-payload";

export const ALLOWED_EVENT_TYPES = [
  "landing_open",
  "venue_card_open",
  "perk_open",
  "direction_click",
  "reservation_click",
  "similar_open",
  "district_open",
  "district_page_view",
  "editorial_page_view",
  "venue_detail_view",
  "venue_card_click",
  "booking_click",
  "official_website_click",
  "instagram_click",
  "menu_click",
  "partner_offer_click",
  "guide_form_started",
  "guide_form_submitted",
  "whatsapp_guide_click",
  "internal_guide_click",
  "menu_open",
  "menu_item_open",
  "action_handoff",
  "delivery_click",
  "takeaway_click",
  "preorder_click",
] as const;

export type AllowedEventType = (typeof ALLOWED_EVENT_TYPES)[number];

export type ParsedEvent = {
  type: AllowedEventType;
  venueSlug: string | null;
  payload: SafeEventPayload | null;
};

export type EventParseResult =
  | { ok: true; event: ParsedEvent }
  | { ok: false };

const ALLOWED_EVENTS = new Set<string>(ALLOWED_EVENT_TYPES);
const ACTIONS = new Set<ActionKind>([
  "reserve",
  "delivery",
  "takeaway",
  "preorder",
  "website",
  "whatsapp",
  "maps",
]);
const ACTION_EVENT_TYPES = new Set<AllowedEventType>([
  "action_handoff",
  "delivery_click",
  "takeaway_click",
  "preorder_click",
]);
const MENU_EVENT_TYPES = new Set<AllowedEventType>([
  "menu_open",
  "menu_item_open",
]);
const SPECIFIC_ACTIONS: Partial<Record<AllowedEventType, ActionKind>> = {
  delivery_click: "delivery",
  takeaway_click: "takeaway",
  preorder_click: "preorder",
};

const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EVENT_SUBJECT = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const PROVIDER = /^[a-z0-9][a-z0-9_-]*$/;
const CAPABILITY_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const MENU_ENTITY_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const MAX_VENUE_SLUG_LENGTH = 120;
const MAX_EVENT_SUBJECT_LENGTH = 120;
const MAX_PROVIDER_LENGTH = 64;
const MAX_CAPABILITY_ID_LENGTH = 120;
const MAX_MENU_ENTITY_ID_LENGTH = 120;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isBoundedMatch(value: unknown, max: number, pattern: RegExp): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= max && pattern.test(value);
}

function isVenueSlug(value: unknown): value is string {
  return isBoundedMatch(value, MAX_VENUE_SLUG_LENGTH, VENUE_SLUG);
}

function isEventSubject(value: unknown): value is string {
  return isBoundedMatch(value, MAX_EVENT_SUBJECT_LENGTH, EVENT_SUBJECT);
}

function parseActionPayload(value: unknown): SafeActionEventPayload | null {
  if (!isRecord(value)) return null;
  if (
    hasOwn(value, "source") ||
    hasOwn(value, "acquisitionSource")
  ) {
    return null;
  }

  const { action, provider, capabilityId, venueSlug } = value;
  if (typeof action !== "string" || !ACTIONS.has(action as ActionKind)) return null;
  if (!isBoundedMatch(provider, MAX_PROVIDER_LENGTH, PROVIDER)) return null;
  if (!isVenueSlug(venueSlug)) return null;
  if (
    capabilityId !== undefined &&
    !isBoundedMatch(capabilityId, MAX_CAPABILITY_ID_LENGTH, CAPABILITY_ID)
  ) {
    return null;
  }

  return {
    action: action as ActionKind,
    provider,
    ...(capabilityId === undefined ? {} : { capabilityId }),
    venueSlug,
  };
}

function parseMenuPayload(
  value: unknown,
  requiresItem: boolean
): SafeMenuEventPayload | null {
  if (!isRecord(value)) return null;
  if (hasOwn(value, "source") || hasOwn(value, "acquisitionSource")) return null;

  const { venueSlug, menuId, menuItemId } = value;
  if (!isVenueSlug(venueSlug)) return null;
  if (!isBoundedMatch(menuId, MAX_MENU_ENTITY_ID_LENGTH, MENU_ENTITY_ID)) return null;
  if (requiresItem) {
    if (!isBoundedMatch(menuItemId, MAX_MENU_ENTITY_ID_LENGTH, MENU_ENTITY_ID)) return null;
  } else if (menuItemId !== undefined) {
    return null;
  }

  return {
    venueSlug,
    menuId,
    ...(requiresItem ? { menuItemId: menuItemId as string } : {}),
  };
}

export function parseEventRequest(input: unknown): EventParseResult {
  if (!isRecord(input)) return { ok: false };
  if (hasOwn(input, "source") || hasOwn(input, "acquisitionSource")) {
    return { ok: false };
  }

  const { type, venueSlug, payload } = input;
  if (typeof type !== "string" || !ALLOWED_EVENTS.has(type)) return { ok: false };

  const parsedType = type as AllowedEventType;
  const parsedVenueSlug = venueSlug === undefined ? null : venueSlug;

  if (MENU_EVENT_TYPES.has(parsedType)) {
    if (!isVenueSlug(parsedVenueSlug)) return { ok: false };
    const parsedPayload = parseMenuPayload(payload, parsedType === "menu_item_open");
    if (!parsedPayload || parsedPayload.venueSlug !== parsedVenueSlug) return { ok: false };
    return {
      ok: true,
      event: { type: parsedType, venueSlug: parsedVenueSlug, payload: parsedPayload },
    };
  }

  if (!ACTION_EVENT_TYPES.has(parsedType)) {
    if (parsedVenueSlug !== null && !isEventSubject(parsedVenueSlug)) return { ok: false };
    if (payload !== undefined && payload !== null) return { ok: false };
    return {
      ok: true,
      event: { type: parsedType, venueSlug: parsedVenueSlug, payload: null },
    };
  }

  if (!isVenueSlug(parsedVenueSlug)) return { ok: false };
  const parsedPayload = parseActionPayload(payload);
  if (!parsedPayload || parsedPayload.venueSlug !== parsedVenueSlug) return { ok: false };

  const requiredAction = SPECIFIC_ACTIONS[parsedType];
  if (requiredAction && parsedPayload.action !== requiredAction) return { ok: false };

  return {
    ok: true,
    event: {
      type: parsedType,
      venueSlug: parsedVenueSlug,
      payload: parsedPayload,
    },
  };
}
