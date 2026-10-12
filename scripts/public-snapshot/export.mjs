// Refreshes data/public-snapshot/ — the published rows public pages render
// from (see lib/data/public-snapshot.ts). It reads with the anon key, so RLS
// decides exactly which rows a visitor may see, the same as a live read.
//
//   NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… npm run snapshot:public
//
// Then review the diff, commit and deploy. Nothing is written if any table
// fails to read, so a partial snapshot can never replace a complete one.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
  process.exit(2);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const OUT = path.join(process.cwd(), "data", "public-snapshot");
const PAGE = 500;

const VENUE_COLUMNS =
  "id,slug,name,category,district,address,gmaps_url,official_url,instagram_url,opening_hours_json,opening_hours,price_min_idr,price_max_idr,price_text,google_place_id,tier,status,is_sponsored,vibe_tags,price_anchor,what_to_order,photo_url,photo_status,area,why_its_here,best_for,not_for,practical_tags,jobs,owner_note,publication_status,wellness_categories,last_verified_at,latitude,longitude,price_band,phone,full_address";

async function readAll(label, build) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) throw new Error(`${label}: ${error.message ?? JSON.stringify(error)}`);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

const venues = await readAll("venues", () =>
  sb.from("venues").select(VENUE_COLUMNS)
    .eq("status", "active").eq("publication_status", "published")
    .order("district").order("name").order("id"));

const catalog = {
  plan_entries: await readAll("plan_entries", () =>
    sb.from("plan_entries").select("district,venue_slug,slot,rank,blurb").order("district").order("rank").order("venue_slug")),
  routes: await readAll("routes", () =>
    sb.from("routes").select("slug,district,title,subtitle,rank").order("rank").order("slug")),
  route_stops: await readAll("route_stops", () =>
    sb.from("route_stops").select("route_slug,venue_slug,rank,note").order("route_slug").order("rank")),
  districts: await readAll("districts", () => sb.from("districts").select("slug,status").order("slug")),
  venue_action_capabilities: await readAll("venue_action_capabilities", () =>
    sb.from("venue_action_capabilities")
      .select("id,venue_slug,kind,provider,url,label,status,priority,confirmation_required,source_url,source_label,captured_at,verified_at,expires_at")
      .eq("status", "confirmed").order("venue_slug").order("priority").order("id")),
  menus: await readAll("menus", () =>
    sb.from("menus")
      .select("id,venue_slug,title,version,status,completeness,kind,source_url,source_label,captured_at,verified_at,expires_at")
      .order("venue_slug").order("kind").order("version", { ascending: false }).order("status").order("id")),
  menu_sections: await readAll("menu_sections", () =>
    sb.from("menu_sections").select("id,menu_id,name,description,position").order("menu_id").order("position").order("id")),
};

const menuItems = await readAll("menu_items", () =>
  sb.from("menu_items")
    .select("id,menu_id,section_id,name,description,price_minor,currency,price_text,dietary_tags,verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,availability_note,position")
    .order("menu_id").order("section_id").order("position").order("id"));

if (venues.length === 0) {
  console.error("No published venues came back; refusing to write an empty snapshot.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const write = (name, value) => writeFileSync(path.join(OUT, name), `${JSON.stringify(value)}\n`);
write("venues.json", venues);
write("catalog.json", catalog);
write("menu-items.json", menuItems);
const counts = {
  venues: venues.length,
  ...Object.fromEntries(Object.entries(catalog).map(([k, v]) => [k, v.length])),
  menu_items: menuItems.length,
  perks: 0,
};
writeFileSync(
  path.join(OUT, "meta.json"),
  `${JSON.stringify({ exportedAt: new Date().toISOString(), role: "anon", project: new URL(url).hostname.split(".")[0], counts }, null, 2)}\n`,
);
console.log(counts);
