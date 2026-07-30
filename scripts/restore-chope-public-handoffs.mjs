import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const reportDir = join(process.cwd(), "reports/chope-public-handoff-restoration");
const snapshotPath = join(reportDir, "ROLLBACK_SNAPSHOT.json");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const expectedHost = "egkdapqwkfprtyqvvnso.supabase.co";

if (!url || !key || new URL(url).hostname !== expectedHost) {
  throw new Error("Expected Other Bali production credentials");
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function readAll(table, columns) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

function isChopeUrl(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === "chope.co" ||
      host.endsWith(".chope.co") ||
      host === "chope.co.id" ||
      host.endsWith(".chope.co.id")
    );
  } catch {
    return false;
  }
}

const [venues, actions] = await Promise.all([
  readAll("venues", "slug,status,publication_status"),
  readAll(
    "venue_action_capabilities",
    "id,venue_slug,kind,provider,version,url,status,verified_at,expires_at,updated_at",
  ),
]);

const venueBySlug = new Map(venues.map((venue) => [venue.slug, venue]));
const confirmedVenueSlugs = new Set(
  actions
    .filter(
      (action) =>
        action.kind === "reserve" &&
        action.provider === "chope" &&
        action.status === "confirmed",
    )
    .map((action) => action.venue_slug),
);

const latestArchivedByVenue = new Map();
for (const action of actions) {
  if (
    action.kind !== "reserve" ||
    action.provider !== "chope" ||
    action.status !== "archived"
  ) {
    continue;
  }
  const current = latestArchivedByVenue.get(action.venue_slug);
  if (!current || action.version > current.version) {
    latestArchivedByVenue.set(action.venue_slug, action);
  }
}

const now = Date.now();
const eligible = [...latestArchivedByVenue.values()]
  .filter((action) => {
    const venue = venueBySlug.get(action.venue_slug);
    return (
      !confirmedVenueSlugs.has(action.venue_slug) &&
      venue?.status === "active" &&
      venue?.publication_status === "published" &&
      Boolean(action.verified_at) &&
      Boolean(action.expires_at) &&
      Date.parse(action.expires_at) > now &&
      isChopeUrl(action.url)
    );
  })
  .sort((left, right) => left.venue_slug.localeCompare(right.venue_slug));

await mkdir(reportDir, { recursive: true });
try {
  await readFile(snapshotPath, "utf8");
} catch {
  await writeFile(
    snapshotPath,
    `${JSON.stringify({
      capturedAt: new Date().toISOString(),
      projectRef: "egkdapqwkfprtyqvvnso",
      rows: eligible.map((action) => ({
        id: action.id,
        venueSlug: action.venue_slug,
        version: action.version,
        previousStatus: action.status,
        previousUpdatedAt: action.updated_at,
      })),
    }, null, 2)}\n`,
  );
}

const journal = {
  startedAt: new Date().toISOString(),
  mode: apply ? "apply" : "dry-run",
  archivedChopeRows: [...latestArchivedByVenue.values()].length,
  alreadyConfirmedVenues: confirmedVenueSlugs.size,
  eligibleRows: eligible.length,
  restoredIds: [],
};

if (apply) {
  for (let offset = 0; offset < eligible.length; offset += 100) {
    const ids = eligible.slice(offset, offset + 100).map((action) => action.id);
    const { data, error } = await supabase
      .from("venue_action_capabilities")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .in("id", ids)
      .eq("status", "archived")
      .select("id");
    if (error) throw error;
    journal.restoredIds.push(...data.map((row) => row.id));
  }
}

journal.completedAt = new Date().toISOString();
await writeFile(
  join(reportDir, "APPLY_JOURNAL.json"),
  `${JSON.stringify(journal, null, 2)}\n`,
);

console.log(JSON.stringify({
  mode: journal.mode,
  archivedChopeRows: journal.archivedChopeRows,
  alreadyConfirmedVenues: journal.alreadyConfirmedVenues,
  eligibleRows: journal.eligibleRows,
  restoredRows: journal.restoredIds.length,
}, null, 2));
