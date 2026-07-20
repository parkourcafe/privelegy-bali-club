import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";
import { buildCoverageReport, type CoverageReport } from "./coverage-model";

export type {
  CoverageCell,
  CoverageRow,
  CoverageReport,
} from "./coverage-model";

// Operator data-coverage report: how many venues we hold per district × per
// category, split published vs. in-review, so it's obvious at a glance where
// the catalogue is thin or a category is missing entirely. Reads EVERY venue
// row (published + review/draft) via the service role, which bypasses RLS —
// the public anon reads only ever see published rows, so they can't answer
// "what's missing". Aggregate-only, no venue identities beyond counts.
export async function getCoverageReport(): Promise<CoverageReport | null> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return null;

  const { data, error } = await client
    .from("venues")
    .select("category,district,status,publication_status")
    .limit(5000);
  if (error || !Array.isArray(data)) return null;

  return buildCoverageReport(data as Record<string, unknown>[]);
}
