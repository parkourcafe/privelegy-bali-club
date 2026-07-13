export type QueueSeverity = "blocker" | "warning" | "info";

export type FreshnessIssue = {
  code: string;
  severity: QueueSeverity;
  entity: "menu" | "action" | "venue";
  entityId: string;
  venueSlug: string;
  message: string;
};

export type AdminMenuRow = {
  id: string;
  venue_slug: string;
  status: string;
  source_url: string | null;
  source_label: string | null;
  captured_at: string | null;
  verified_at: string | null;
  expires_at: string | null;
  section_count?: number;
  item_count?: number;
};

export type AdminActionRow = {
  id: string;
  venue_slug: string;
  kind: string;
  status: string;
  url: string | null;
  source_url: string | null;
  source_label: string | null;
  captured_at: string | null;
  verified_at: string | null;
  expires_at: string | null;
};

export type AdminVenueRow = {
  slug: string;
  status: string | null;
  publication_status: string | null;
  gmaps_url: string | null;
  last_verified_at: string | null;
};

const DAY = 86_400_000;
const EXAMPLE_HOSTS = new Set(["example.com", "www.example.com", "tablepilot.example"]);

function timestamp(value: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isPublishableHttpsUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !EXAMPLE_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function evidenceIssues(
  row: { source_url: string | null; source_label: string | null; captured_at: string | null; verified_at: string | null },
  entity: "menu" | "action",
  entityId: string,
  venueSlug: string
): FreshnessIssue[] {
  const issues: FreshnessIssue[] = [];
  if (!isPublishableHttpsUrl(row.source_url) || !row.source_label?.trim() || !timestamp(row.captured_at) || !timestamp(row.verified_at)) {
    issues.push({ code: "missing_evidence", severity: "blocker", entity, entityId, venueSlug, message: "Source, capture and verification evidence is incomplete or non-publishable." });
  }
  return issues;
}

export function evaluateMenus(rows: AdminMenuRow[], now = new Date()): FreshnessIssue[] {
  const nowMs = now.getTime();
  return rows.flatMap((row) => {
    const issues = evidenceIssues(row, "menu", row.id, row.venue_slug);
    const expiry = timestamp(row.expires_at);
    if (row.status === "published" && expiry !== null && expiry <= nowMs) {
      issues.push({ code: "stale_menu", severity: "blocker", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: "Published menu is expired and must be suppressed or archived." });
    } else if (expiry !== null && expiry <= nowMs + 14 * DAY) {
      issues.push({ code: "menu_expiring", severity: "warning", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: "Menu expires within 14 days." });
    }
    if ((row.section_count ?? 0) < 1 || (row.item_count ?? 0) < 1) {
      issues.push({ code: "empty_menu", severity: "blocker", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: "Menu needs at least one section and item before publication." });
    }
    if (row.status === "draft" || row.status === "review") {
      issues.push({ code: "menu_needs_review", severity: "info", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: `Menu is ${row.status}; the current published version remains unchanged.` });
    }
    return issues;
  });
}

export function evaluateActions(rows: AdminActionRow[], now = new Date()): FreshnessIssue[] {
  const nowMs = now.getTime();
  return rows.flatMap((row) => {
    const issues = evidenceIssues(row, "action", row.id, row.venue_slug);
    if (!isPublishableHttpsUrl(row.url)) {
      issues.push({ code: "invalid_provider_url", severity: "blocker", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: "Provider handoff URL is invalid, non-HTTPS or an example domain." });
    }
    const expiry = timestamp(row.expires_at);
    if (row.status === "confirmed" && expiry !== null && expiry <= nowMs) {
      issues.push({ code: "stale_action", severity: "blocker", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: "Confirmed action is expired and must be suppressed or archived." });
    } else if (expiry !== null && expiry <= nowMs + 14 * DAY) {
      issues.push({ code: "action_expiring", severity: "warning", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: "Action expires within 14 days." });
    }
    if (row.status !== "confirmed" && row.status !== "archived" && row.status !== "disabled") {
      issues.push({ code: "unconfirmed_action", severity: "info", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: `Action is ${row.status}; it is not public.` });
    }
    return issues;
  });
}

export function evaluateVenues(rows: AdminVenueRow[]): FreshnessIssue[] {
  return rows.flatMap((row) => {
    const issues: FreshnessIssue[] = [];
    if (row.status !== "active" || row.publication_status !== "published") {
      issues.push({ code: "venue_publication_blocker", severity: "blocker", entity: "venue", entityId: row.slug, venueSlug: row.slug, message: "Parent venue is not active and published." });
    }
    if (!isPublishableHttpsUrl(row.gmaps_url) || !timestamp(row.last_verified_at)) {
      issues.push({ code: "missing_verified_maps", severity: "blocker", entity: "venue", entityId: row.slug, venueSlug: row.slug, message: "Venue lacks a verified HTTPS Google Maps handoff." });
    }
    return issues;
  });
}

export function sortFreshnessIssues(issues: FreshnessIssue[]): FreshnessIssue[] {
  const rank: Record<QueueSeverity, number> = { blocker: 0, warning: 1, info: 2 };
  return [...issues].sort((a, b) => rank[a.severity] - rank[b.severity] || a.venueSlug.localeCompare(b.venueSlug) || a.code.localeCompare(b.code));
}

