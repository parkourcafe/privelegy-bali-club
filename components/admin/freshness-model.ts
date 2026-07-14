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
  completeness: string;
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
  provider?: string | null;
  label?: string | null;
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
  name?: string | null;
  status: string | null;
  publication_status: string | null;
  gmaps_url: string | null;
  last_verified_at: string | null;
};

const DAY = 86_400_000;
const EXAMPLE_HOSTS = new Set(["example.com", "www.example.com", "tablepilot.example"]);
const PROVIDER_HOSTS: Record<string, readonly string[]> = {
  tablepilot: ["tablepilot-id.vercel.app"],
  whatsapp: ["wa.me", "whatsapp.com"],
  grabfood: ["grab.com", "grab.onelink.me"],
  gofood: ["gofood.co.id", "gofood.link", "gojek.com", "gojek.page.link"],
  shopeefood: ["shopee.co.id", "shopeefood.co.id"],
  sevenrooms: ["sevenrooms.com"],
  tablecheck: ["tablecheck.com"],
  chope: ["chope.co", "chope.co.id"],
  resdiary: ["resdiary.com"],
  dishcult: ["dishcult.com"],
};

function safeHttpsUrl(value: string | null): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password ||
      EXAMPLE_HOSTS.has(url.hostname.toLowerCase())
    ) return null;
    return url;
  } catch {
    return null;
  }
}

function hostMatches(hostname: string, allowedHost: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  const allowed = allowedHost.toLowerCase().replace(/\.$/, "");
  return host === allowed || host.endsWith(`.${allowed}`);
}

function timestamp(value: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isPublishableHttpsUrl(value: string | null): boolean {
  return safeHttpsUrl(value) !== null;
}

export function isPublishableActionTarget(row: Pick<AdminActionRow, "kind" | "provider" | "url" | "source_url">): boolean {
  const target = safeHttpsUrl(row.url);
  const source = safeHttpsUrl(row.source_url);
  const provider = row.provider?.trim().toLowerCase() ?? "";
  if (!target || !source) return false;

  const kindAllowed =
    (provider === "tablepilot" && row.kind === "reserve") ||
    (provider === "whatsapp" && row.kind === "whatsapp") ||
    (["grabfood", "gofood", "shopeefood"].includes(provider) && ["delivery", "takeaway"].includes(row.kind)) ||
    (["sevenrooms", "tablecheck", "chope", "resdiary", "dishcult"].includes(provider) && row.kind === "reserve") ||
    (provider === "official" && ["reserve", "delivery", "takeaway", "preorder", "website"].includes(row.kind));
  if (!kindAllowed) return false;

  if (provider === "official") {
    return hostMatches(target.hostname, source.hostname) || hostMatches(source.hostname, target.hostname);
  }
  return (PROVIDER_HOSTS[provider] ?? []).some((host) => hostMatches(target.hostname, host));
}

function evidenceIssues(
  row: { source_url: string | null; source_label: string | null; captured_at: string | null; verified_at: string | null },
  entity: "menu" | "action",
  entityId: string,
  venueSlug: string,
  requiresVerification: boolean,
): FreshnessIssue[] {
  const issues: FreshnessIssue[] = [];
  if (!isPublishableHttpsUrl(row.source_url) || !row.source_label?.trim() || !timestamp(row.captured_at)) {
    issues.push({ code: "missing_evidence", severity: "blocker", entity, entityId, venueSlug, message: "Source and capture evidence is incomplete or non-publishable." });
  }
  if (requiresVerification && !timestamp(row.verified_at)) {
    issues.push({ code: "missing_verification", severity: "blocker", entity, entityId, venueSlug, message: "This reviewed/public record has no real operator verification timestamp." });
  }
  return issues;
}

export function evaluateMenus(rows: AdminMenuRow[], now = new Date()): FreshnessIssue[] {
  const nowMs = now.getTime();
  return rows.flatMap((row) => {
    const issues = evidenceIssues(row, "menu", row.id, row.venue_slug, row.status !== "draft");
    if (row.completeness !== "full") {
      issues.push({ code: "partial_menu", severity: "blocker", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: "This record is a partial menu extract and cannot be published as a verified full menu." });
    }
    const expiry = timestamp(row.expires_at);
    if (["review", "published"].includes(row.status) && expiry === null) {
      issues.push({ code: "missing_expiry", severity: "blocker", entity: "menu", entityId: row.id, venueSlug: row.venue_slug, message: "Reviewed/public menu has no mandatory freshness expiry." });
    } else if (row.status === "published" && expiry !== null && expiry <= nowMs) {
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
    const issues = evidenceIssues(row, "action", row.id, row.venue_slug, row.status === "confirmed");
    if (!isPublishableActionTarget(row)) {
      issues.push({ code: "invalid_provider_url", severity: "blocker", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: "Provider handoff URL is invalid, non-HTTPS or an example domain." });
    }
    const expiry = timestamp(row.expires_at);
    if (row.status === "confirmed" && expiry === null) {
      issues.push({ code: "missing_expiry", severity: "blocker", entity: "action", entityId: row.id, venueSlug: row.venue_slug, message: "Confirmed action has no mandatory freshness expiry." });
    } else if (row.status === "confirmed" && expiry !== null && expiry <= nowMs) {
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
