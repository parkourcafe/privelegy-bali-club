import type {
  ActionKind,
  SafeActionEventPayload,
  VenueActionCapabilityRecord,
} from "../contracts/menu-action";
import { isFresh, type DataRow } from "./menu";

const ACTION_KINDS = new Set<ActionKind>([
  "reserve", "delivery", "takeaway", "preorder", "website", "whatsapp", "maps",
]);
const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export function isSafePublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function mapPublishedActionCapability(
  row: DataRow,
  now = new Date()
): VenueActionCapabilityRecord | null {
  const kind = text(row.kind) as ActionKind;
  const url = text(row.url);
  const verifiedAt = text(row.verified_at);
  const expiresAt = text(row.expires_at) || null;
  if (
    text(row.status) !== "confirmed" ||
    !ACTION_KINDS.has(kind) ||
    !verifiedAt ||
    !isFresh(expiresAt, now) ||
    !isSafePublicUrl(url)
  ) return null;

  return {
    id: text(row.id),
    venueSlug: text(row.venue_slug),
    kind,
    provider: text(row.provider),
    url,
    label: text(row.label) || null,
    status: "confirmed",
    priority: Number(row.priority) || 0,
    confirmationRequired: Boolean(row.confirmation_required),
    sourceUrl: text(row.source_url),
    sourceLabel: text(row.source_label),
    capturedAt: text(row.captured_at),
    verifiedAt,
    expiresAt,
  };
}

export function sortActionCapabilities(
  records: VenueActionCapabilityRecord[]
): VenueActionCapabilityRecord[] {
  return [...records].sort(
    (a, b) => a.priority - b.priority || a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id)
  );
}

export function safeActionEventPayload(input: SafeActionEventPayload): SafeActionEventPayload | null {
  if (!ACTION_KINDS.has(input.action)) return null;
  const provider = text(input.provider).slice(0, 80);
  const venueSlug = text(input.venueSlug).slice(0, 120);
  const capabilityId = text(input.capabilityId).slice(0, 120);
  if (!provider || !venueSlug) return null;
  return { action: input.action, provider, venueSlug, ...(capabilityId ? { capabilityId } : {}) };
}
