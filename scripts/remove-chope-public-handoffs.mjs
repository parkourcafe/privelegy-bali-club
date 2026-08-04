import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const reportDir = join(process.cwd(), "reports/chope-public-handoff-removal");
const snapshotPath = join(reportDir, "ROLLBACK_SNAPSHOT.json");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || new URL(url).hostname !== "egkdapqwkfprtyqvvnso.supabase.co") {
  throw new Error("Expected Other Bali production credentials");
}
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function readAll(table, columns) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}
const isChopeUrl = (value) => {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === "chope.co" || host.endsWith(".chope.co") ||
      host === "chope.co.id" || host.endsWith(".chope.co.id");
  } catch {
    return false;
  }
};

const [venues, actions] = await Promise.all([
  readAll("venues", "id,slug,name,booking_url,status,publication_status"),
  readAll("venue_action_capabilities", "*"),
]);
const affectedVenues = venues.filter((row) => isChopeUrl(row.booking_url));
const affectedActions = actions.filter((row) =>
  row.status === "confirmed" && (row.provider === "chope" || isChopeUrl(row.url)));

await mkdir(reportDir, { recursive: true });
try {
  await readFile(snapshotPath, "utf8");
} catch {
  await writeFile(snapshotPath, `${JSON.stringify({
    capturedAt: new Date().toISOString(),
    venues: affectedVenues,
    actions: affectedActions,
  }, null, 2)}\n`);
}

const journal = {
  startedAt: new Date().toISOString(),
  mode: apply ? "apply" : "dry-run",
  venueBookingUrlsToClear: affectedVenues.length,
  confirmedActionsToArchive: affectedActions.length,
  clearedVenueIds: [],
  archivedActionIds: [],
};
if (apply) {
  for (const row of affectedVenues) {
    const { error } = await supabase.from("venues").update({ booking_url: null }).eq("id", row.id);
    if (error) throw error;
    journal.clearedVenueIds.push(row.id);
  }
  for (const row of affectedActions) {
    const { error } = await supabase.from("venue_action_capabilities")
      .update({ status: "archived" }).eq("id", row.id).eq("status", "confirmed");
    if (error) throw error;
    journal.archivedActionIds.push(row.id);
  }
}
await writeFile(join(reportDir, "APPLY_JOURNAL.json"), `${JSON.stringify(journal, null, 2)}\n`);
console.log(JSON.stringify({
  mode: journal.mode,
  venueBookingUrls: affectedVenues.length,
  confirmedActions: affectedActions.length,
  productionWrites: journal.clearedVenueIds.length + journal.archivedActionIds.length,
}, null, 2));
