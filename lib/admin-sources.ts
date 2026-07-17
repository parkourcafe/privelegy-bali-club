import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";
import { listAttributionSources } from "./admin-attribution";

// Founder-facing source breakdown for the field/QR + campaign channels (P0-1).
// Reads the events table directly (service role, admin-gated) and aggregates by
// acquisition source over a window. No PII: events hold only type, source,
// venue_slug and a timestamp.

export type SourceRow = {
  source: string; // "(none)" for events with no bound source
  issued: boolean; // registered in attribution_sources
  scan: number;
  landing: number;
  card: number;
  directions: number;
  reserve: number;
  redeem: number;
  other: number;
  total: number;
};

export type SourceBreakdown = {
  days: number;
  eventsScanned: number;
  truncated: boolean;
  rows: SourceRow[];
};

const ROW_CAP = 20000;

const CARD_TYPES = new Set([
  "venue_card_open",
  "venue_card_click",
  "venue_detail_view",
]);
const RESERVE_TYPES = new Set(["reservation_click", "booking_click"]);

function emptyRow(source: string, issued: boolean): SourceRow {
  return {
    source,
    issued,
    scan: 0,
    landing: 0,
    card: 0,
    directions: 0,
    reserve: 0,
    redeem: 0,
    other: 0,
    total: 0,
  };
}

function bucket(row: SourceRow, type: string): void {
  row.total += 1;
  if (type === "source_scan") row.scan += 1;
  else if (type === "landing_open") row.landing += 1;
  else if (CARD_TYPES.has(type)) row.card += 1;
  else if (type === "direction_click") row.directions += 1;
  else if (RESERVE_TYPES.has(type)) row.reserve += 1;
  else if (type === "redemption") row.redeem += 1;
  else row.other += 1;
}

export async function getSourceBreakdown(days = 30): Promise<SourceBreakdown | null> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return null;

  const window = Math.max(1, Math.min(days, 180));
  const sinceIso = new Date(Date.now() - window * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from("events")
    .select("type,source,ts")
    .gte("ts", sinceIso)
    .order("ts", { ascending: false })
    .limit(ROW_CAP);
  if (error || !data) return null;

  // Seed rows for every issued source so villa_canggu_01…20 appear even at zero.
  const issued = await listAttributionSources();
  const rows = new Map<string, SourceRow>();
  for (const s of issued) rows.set(s.id, emptyRow(s.id, true));

  for (const raw of data as { type?: unknown; source?: unknown }[]) {
    const type = typeof raw.type === "string" ? raw.type : "";
    const source =
      typeof raw.source === "string" && raw.source.length > 0 ? raw.source : "(none)";
    if (!type) continue;
    let row = rows.get(source);
    if (!row) {
      row = emptyRow(source, false);
      rows.set(source, row);
    }
    bucket(row, type);
  }

  const list = [...rows.values()].sort((a, b) => {
    // Sources with activity first, then issued-but-idle, "(none)" last.
    if (a.source === "(none)") return 1;
    if (b.source === "(none)") return -1;
    if (b.total !== a.total) return b.total - a.total;
    return a.source.localeCompare(b.source);
  });

  return {
    days: window,
    eventsScanned: data.length,
    truncated: data.length >= ROW_CAP,
    rows: list,
  };
}
