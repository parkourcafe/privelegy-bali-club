import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";
import type { PartnerNotes, PartnerReport } from "./types";

export type OperatorPartnerReport = {
  report: PartnerReport | null;
  notes: PartnerNotes | null;
  fallbackCount: number | null;
};

export async function getOperatorPartnerReport(venueSlug: string): Promise<OperatorPartnerReport> {
  await requireAdminRequest();
  const slug = venueSlug.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { report: null, notes: null, fallbackCount: null };
  }
  const client = serviceClient();
  if (!client) return { report: null, notes: null, fallbackCount: null };

  const [reportResult, notesResult, countResult] = await Promise.all([
    client.rpc("partner_report", { p_venue_slug: slug }),
    client.rpc("partner_notes", { p_venue_slug: slug }),
    client.rpc("venue_redemption_count", { p_venue_slug: slug }),
  ]);

  const reportRow = !reportResult.error && reportResult.data
    ? reportResult.data as Record<string, unknown>
    : null;
  const notesRow = !notesResult.error && notesResult.data
    ? notesResult.data as Record<string, unknown>
    : null;
  const report: PartnerReport | null = reportRow ? {
    venueCardOpens: Number(reportRow.venue_card_opens ?? 0),
    perkOpens: Number(reportRow.perk_opens ?? 0),
    redemptions: Number(reportRow.redemptions ?? 0),
    externallyAttributed: Number(reportRow.externally_attributed ?? 0),
    inVenue: Number(reportRow.in_venue ?? 0),
    creator: Number(reportRow.creator ?? 0),
  } : null;
  const notes: PartnerNotes | null = notesRow ? {
    bySource: (notesRow.by_source ?? {}) as Record<string, number>,
    repeat: Number(notesRow.repeat ?? 0),
  } : null;

  return {
    report,
    notes,
    fallbackCount: report ? null : (!countResult.error && typeof countResult.data === "number" ? countResult.data : null),
  };
}
