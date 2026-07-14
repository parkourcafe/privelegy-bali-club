import type {
  ActionKind,
  SafeActionEventPayload,
  VenueActionBarProps,
  VenueActionCapabilityRecord,
} from "../contracts/menu-action";
import {
  normalizeActionProvider,
  parseSafeHttpsUrl,
  providerLabel as getProviderLabel,
  validateExternalProviderUrl,
  validateOfficialFallbackUrl,
} from "../integrations/external-ordering";
import { validateGoogleMapsUrl } from "../integrations/google-maps";
import {
  buildTablePilotReservationUrl,
  tablePilotSlugFromUrl,
} from "../integrations/tablepilot";
import {
  buildWhatsAppHandoff,
  validateWhatsAppPhone,
  whatsAppPhoneFromUrl,
} from "../integrations/whatsapp";
import type {
  CanonicalActionProvider,
  ResolveVenueActionsOptions,
  ResolvedVenueAction,
  RejectedVenueAction,
  VenueActionResolution,
} from "./types";

export type {
  ResolveVenueActionsOptions,
  ResolvedVenueAction,
  VenueActionResolution,
} from "./types";

const ACTION_LABELS: Record<ActionKind, string> = {
  reserve: "Reserve",
  delivery: "Delivery",
  takeaway: "Takeaway",
  preorder: "Request pre-order",
  website: "Website",
  whatsapp: "WhatsApp",
  maps: "Open in Google Maps",
};

const ACTION_KIND_RANK: Record<ActionKind, number> = {
  reserve: 0,
  delivery: 1,
  takeaway: 2,
  preorder: 3,
  website: 4,
  whatsapp: 5,
  maps: 6,
};

const COMMERCE_ACTIONS = new Set<ActionKind>([
  "reserve",
  "delivery",
  "takeaway",
  "preorder",
]);
const CAPABILITY_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;

function timestamp(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolutionNow(value: ResolveVenueActionsOptions["now"]): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : Date.now();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : Date.now();
  }
  return Date.now();
}

function capabilityEligibility(
  record: VenueActionCapabilityRecord,
  venueSlug: string,
  now: number
): string | null {
  if (!CAPABILITY_ID.test(record.id)) return "invalid_capability_id";
  if (record.venueSlug !== venueSlug) return "venue_mismatch";
  if (record.status !== "confirmed") return "not_confirmed";
  if (!record.sourceLabel.trim()) return "missing_source_label";
  if (!parseSafeHttpsUrl(record.sourceUrl)) return "invalid_source_url";
  if (!Number.isSafeInteger(record.priority) || record.priority < 0) {
    return "invalid_priority";
  }

  const capturedAt = timestamp(record.capturedAt);
  const verifiedAt = timestamp(record.verifiedAt);
  if (capturedAt === null) return "invalid_captured_at";
  if (verifiedAt === null) return "not_verified";
  if (capturedAt > now || verifiedAt > now) return "future_evidence";
  if (verifiedAt < capturedAt) return "verification_before_capture";

  if (record.expiresAt === null) return "missing_expiry";
  const expiresAt = timestamp(record.expiresAt);
  if (expiresAt === null) return "invalid_expiry";
  if (expiresAt <= now) return "expired";
  return null;
}

function disclosure(provider: CanonicalActionProvider, kind: ActionKind): string {
  const label = getProviderLabel(provider);
  if (provider === "tablepilot") return "Booking handled by TablePilot";
  if (provider === "google_maps") return "Opens the stored Google Maps handoff";
  if (provider === "whatsapp") return "Opens WhatsApp to message the venue";
  if (provider === "official") {
    if (kind === "reserve") return "Opens the venue's official booking page";
    if (kind === "website") return "Opens the venue's official website";
    return "Request handled by the venue";
  }
  if (kind === "reserve") return `Booking handled by ${label}`;
  return `Continue with ${label}`;
}

function resolvedAction(input: {
  id: string;
  kind: ActionKind;
  provider: CanonicalActionProvider;
  href: string;
  confirmationRequired: boolean;
  priority: number;
  source: "capability" | "fallback";
  venueSlug: string;
  capabilityId?: string;
}): ResolvedVenueAction {
  const eventPayload: SafeActionEventPayload = {
    action: input.kind,
    provider: input.provider,
    ...(input.capabilityId ? { capabilityId: input.capabilityId } : {}),
    venueSlug: input.venueSlug,
  };
  return {
    id: input.id,
    kind: input.kind,
    provider: input.provider,
    providerLabel: getProviderLabel(input.provider),
    href: input.href,
    label: ACTION_LABELS[input.kind],
    disclosure: disclosure(input.provider, input.kind),
    confirmationRequired: input.confirmationRequired,
    priority: input.priority,
    source: input.source,
    eventPayload,
  };
}

function resolveCapability(
  record: VenueActionCapabilityRecord,
  props: VenueActionBarProps,
  options: ResolveVenueActionsOptions
): ResolvedVenueAction | null {
  const provider = normalizeActionProvider(record.provider);
  if (!provider) return null;

  let href: string | null = null;
  if (provider === "tablepilot") {
    if (record.kind !== "reserve" || props.coverageMode !== "active_deep") return null;
    const slug = tablePilotSlugFromUrl(record.url, options.tablepilotBaseUrl);
    href = slug
      ? buildTablePilotReservationUrl(slug, options.tablepilotBaseUrl)
      : null;
  } else if (provider === "google_maps") {
    if (record.kind !== "maps") return null;
    href = validateGoogleMapsUrl(record.url);
  } else if (provider === "whatsapp") {
    if (!["reserve", "delivery", "takeaway", "preorder", "whatsapp"].includes(record.kind)) {
      return null;
    }
    const phone = whatsAppPhoneFromUrl(record.url);
    href = phone
      ? buildWhatsAppHandoff({
          phone,
          venueName: props.venueName,
          kind: record.kind,
        })
      : null;
  } else {
    href = validateExternalProviderUrl({
      provider,
      kind: record.kind,
      url: record.url,
      sourceUrl: record.sourceUrl,
      officialUrls: [props.fallbacks.websiteUrl, props.fallbacks.officialMenuUrl],
    });
  }
  if (!href) return null;

  return resolvedAction({
    id: record.id,
    kind: record.kind,
    provider,
    href,
    confirmationRequired: record.confirmationRequired,
    priority: record.priority,
    source: "capability",
    venueSlug: props.venueSlug,
    capabilityId: record.id,
  });
}

function compareActions(left: ResolvedVenueAction, right: ResolvedVenueAction): number {
  return (
    left.priority - right.priority ||
    ACTION_KIND_RANK[left.kind] - ACTION_KIND_RANK[right.kind] ||
    left.id.localeCompare(right.id)
  );
}

function uniqueActions(actions: ResolvedVenueAction[]): ResolvedVenueAction[] {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const key = `${action.kind}|${action.provider}|${action.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function resolveVenueActions(
  props: VenueActionBarProps,
  options: ResolveVenueActionsOptions = {}
): VenueActionResolution {
  const now = resolutionNow(options.now);
  const rejected: RejectedVenueAction[] = [];
  const capabilityActions: ResolvedVenueAction[] = [];

  for (const record of props.capabilities) {
    const reason = capabilityEligibility(record, props.venueSlug, now);
    if (reason) {
      rejected.push({ id: record.id, reason });
      continue;
    }
    const action = resolveCapability(record, props, options);
    if (action) capabilityActions.push(action);
    else rejected.push({ id: record.id, reason: "invalid_provider_handoff" });
  }

  const actions = [...capabilityActions];
  const has = (kind: ActionKind, provider?: CanonicalActionProvider) =>
    actions.some((action) => action.kind === kind && (!provider || action.provider === provider));

  if (
    props.coverageMode === "active_deep" &&
    props.fallbacks.tablepilotSlug &&
    !has("reserve", "tablepilot")
  ) {
    const href = buildTablePilotReservationUrl(
      props.fallbacks.tablepilotSlug,
      options.tablepilotBaseUrl
    );
    if (href) {
      actions.push(
        resolvedAction({
          id: "fallback-tablepilot",
          kind: "reserve",
          provider: "tablepilot",
          href,
          confirmationRequired: true,
          priority: 10,
          source: "fallback",
          venueSlug: props.venueSlug,
        })
      );
    } else rejected.push({ id: "fallback-tablepilot", reason: "invalid_tablepilot_fallback" });
  }

  if (props.fallbacks.websiteUrl && !has("website")) {
    const href = validateOfficialFallbackUrl(props.fallbacks.websiteUrl);
    if (href) {
      actions.push(
        resolvedAction({
          id: "fallback-website",
          kind: "website",
          provider: "official",
          href,
          confirmationRequired: false,
          priority: 800,
          source: "fallback",
          venueSlug: props.venueSlug,
        })
      );
    } else rejected.push({ id: "fallback-website", reason: "invalid_website_fallback" });
  }

  if (props.fallbacks.whatsapp && !has("whatsapp", "whatsapp")) {
    const phone = validateWhatsAppPhone(props.fallbacks.whatsapp);
    const href = phone
      ? buildWhatsAppHandoff({
          phone,
          venueName: props.venueName,
          kind: "whatsapp",
        })
      : null;
    if (href) {
      actions.push(
        resolvedAction({
          id: "fallback-whatsapp",
          kind: "whatsapp",
          provider: "whatsapp",
          href,
          confirmationRequired: true,
          priority: 900,
          source: "fallback",
          venueSlug: props.venueSlug,
        })
      );
    } else rejected.push({ id: "fallback-whatsapp", reason: "invalid_whatsapp_fallback" });
  }

  if (props.fallbacks.googleMapsUrl && !has("maps")) {
    const href = validateGoogleMapsUrl(props.fallbacks.googleMapsUrl);
    if (href) {
      actions.push(
        resolvedAction({
          id: "fallback-google-maps",
          kind: "maps",
          provider: "google_maps",
          href,
          confirmationRequired: false,
          priority: 1000,
          source: "fallback",
          venueSlug: props.venueSlug,
        })
      );
    } else rejected.push({ id: "fallback-google-maps", reason: "invalid_maps_fallback" });
  }

  const sorted = uniqueActions(actions.sort(compareActions));
  const maps = sorted.find((action) => action.kind === "maps") ?? null;
  const nonMaps = sorted.filter((action) => action.kind !== "maps");
  const primary =
    nonMaps.find((action) => COMMERCE_ACTIONS.has(action.kind)) ?? nonMaps[0] ?? null;
  const alternatives = nonMaps.filter((action) => action.id !== primary?.id);
  const all = [...nonMaps, ...(maps ? [maps] : [])];

  return { primary: primary ?? null, alternatives, maps, all, rejected };
}
