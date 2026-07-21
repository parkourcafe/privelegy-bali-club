import { createHash } from "node:crypto";
import { extname } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const inputPath = process.argv[2] || "/Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv";
const outputJsonPath = process.argv[3] || "data/data-ops/chope-607/db-aware-dedup-input.json";
const outputSqlPath = process.argv[4] || "data/data-ops/chope-607/db-aware-dedup-readonly.sql";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function hashRow(row) {
  return createHash("sha256").update(JSON.stringify(row)).digest("hex").slice(0, 16);
}

function normalizeText(value) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
}

function normalizeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function readCsv(path) {
  if (extname(path).toLowerCase() !== ".csv") {
    throw new Error(`Expected CSV input, got: ${path}`);
  }
  const [headers, ...records] = parseCsv(readFileSync(path, "utf8")).filter((r) => r.some((v) => v.trim() !== ""));
  return records.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

const rows = readCsv(inputPath);
const candidates = rows.map((row, index) => ({
  candidate_id: `chope-607-${String(index + 1).padStart(3, "0")}`,
  source_hash: hashRow(row),
  name: normalizeText(row.name),
  normalized_name: normalizeText(row.name)?.toLowerCase() ?? null,
  proposed_slug: slugify(row.name || row.source_directory_name),
  district: slugify(row.area_inferred || row.address_locality || "needs-verification") || "needs-verification",
  address: normalizeText(row.street_address),
  latitude: normalizeNumber(row.latitude),
  longitude: normalizeNumber(row.longitude),
  chope_url: normalizeText(row.chope_url || row.url),
  branch_identity: normalizeText(row.source_directory_name),
  publication_guard: {
    can_publish: false,
    reason: "DB-aware dedup is read-only; publication remains blocked until verification, editorial QA, SEO QA and photo rights are complete.",
  },
}));

const sql = `-- Chope-607 DB-aware dedup, read-only.
-- Generated from ${inputPath}
-- This query performs SELECT-only classification against public.venues.
-- It does not insert, update, delete, publish, or mutate production data.

with candidates as (
  select *
  from jsonb_to_recordset($json$${JSON.stringify(candidates)}$json$::jsonb)
    as c(
      candidate_id text,
      source_hash text,
      name text,
      normalized_name text,
      proposed_slug text,
      district text,
      address text,
      latitude double precision,
      longitude double precision,
      chope_url text,
      branch_identity text,
      publication_guard jsonb
    )
),
venue_signals as (
  select
    id,
    slug,
    name,
    lower(trim(name)) as normalized_name,
    trim(both '-' from regexp_replace(lower(coalesce(name, '')), '[^a-z0-9]+', '-', 'g')) as name_slug,
    district,
    coalesce(full_address, address) as address,
    latitude,
    longitude,
    google_place_id,
    official_url,
    instagram_url,
    status,
    publication_status,
    editorial_status
  from public.venues
),
scored as (
  select
    c.candidate_id,
    c.name as candidate_name,
    c.proposed_slug,
    c.district as candidate_district,
    c.address as candidate_address,
    c.latitude as candidate_latitude,
    c.longitude as candidate_longitude,
    v.id as venue_id,
    v.slug as venue_slug,
    v.name as venue_name,
    v.district as venue_district,
    v.status as venue_status,
    v.publication_status as venue_publication_status,
    (
      case when v.slug = c.proposed_slug then 55 else 0 end +
      case when v.name_slug = c.proposed_slug then 45 else 0 end +
      case when v.normalized_name = c.normalized_name then 45 else 0 end +
      case when v.district = c.district then 10 else 0 end +
      case when c.address is not null and v.address is not null and lower(v.address) = lower(c.address) then 25 else 0 end +
      case when c.latitude is not null and c.longitude is not null and v.latitude is not null and v.longitude is not null
        and (sqrt(power((c.latitude - v.latitude) * 111320, 2) + power((c.longitude - v.longitude) * 111320 * cos(radians(c.latitude)), 2)) <= 80) then 35 else 0 end
    ) as score,
    array_remove(array[
      case when v.slug = c.proposed_slug then 'slug_exact' end,
      case when v.name_slug = c.proposed_slug then 'name_slug_exact' end,
      case when v.normalized_name = c.normalized_name then 'name_exact' end,
      case when v.district = c.district then 'district_match' end,
      case when c.address is not null and v.address is not null and lower(v.address) = lower(c.address) then 'address_exact' end,
      case when c.latitude is not null and c.longitude is not null and v.latitude is not null and v.longitude is not null
        and (sqrt(power((c.latitude - v.latitude) * 111320, 2) + power((c.longitude - v.longitude) * 111320 * cos(radians(c.latitude)), 2)) <= 80) then 'geo_80m' end
    ], null) as evidence
  from candidates c
  join venue_signals v
    on v.slug = c.proposed_slug
    or v.name_slug = c.proposed_slug
    or v.normalized_name = c.normalized_name
    or (
      c.latitude is not null and c.longitude is not null and v.latitude is not null and v.longitude is not null
      and (sqrt(power((c.latitude - v.latitude) * 111320, 2) + power((c.longitude - v.longitude) * 111320 * cos(radians(c.latitude)), 2)) <= 80)
    )
),
ranked as (
  select *, row_number() over (partition by candidate_id order by score desc, venue_status = 'active' desc, venue_publication_status = 'published' desc, venue_slug) as rn
  from scored
  where score > 0
),
classified as (
  select
    c.candidate_id,
    c.name,
    c.proposed_slug,
    c.district,
    c.address,
    c.latitude,
    c.longitude,
    r.venue_id,
    r.venue_slug,
    r.venue_name,
    r.venue_status,
    r.venue_publication_status,
    coalesce(r.score, 0) as match_score,
    coalesce(r.evidence, array[]::text[]) as evidence,
    case
      when r.score >= 80 then 'matched'
      when r.score >= 45 then 'possible_match'
      when c.name is null or c.proposed_slug is null or c.district = 'needs-verification' then 'needs_review'
      else 'new_candidate'
    end as dedup_bucket,
    case
      when r.score >= 80 then 'update_existing'
      when r.score >= 45 then 'hold'
      when c.name is null or c.proposed_slug is null or c.district = 'needs-verification' then 'hold'
      else 'create_new'
    end as suggested_action,
    'draft' as publication_status,
    'verification_pending' as verification_status,
    'editorial_pending' as editorial_status,
    'hold' as seo_status,
    'not_contacted' as partner_status,
    'not_granted' as photo_permission_status,
    false as can_publish
  from candidates c
  left join ranked r on r.candidate_id = c.candidate_id and r.rn = 1
)
select jsonb_pretty(jsonb_build_object(
  'generated_at', now(),
  'source_rows', (select count(*) from candidates),
  'venue_catalogue_rows', (select count(*) from venue_signals),
  'counts_by_bucket', (
    select jsonb_object_agg(dedup_bucket, count order by dedup_bucket)
    from (select dedup_bucket, count(*)::int as count from classified group by dedup_bucket) s
  ),
  'counts_by_suggested_action', (
    select jsonb_object_agg(suggested_action, count order by suggested_action)
    from (select suggested_action, count(*)::int as count from classified group by suggested_action) s
  ),
  'publishable', (select count(*)::int from classified where can_publish),
  'sample_matches', (
    select jsonb_agg(to_jsonb(x))
    from (
      select candidate_id, name, dedup_bucket, suggested_action, venue_slug, venue_name, match_score, evidence
      from classified
      where dedup_bucket in ('matched', 'possible_match')
      order by match_score desc, name
      limit 30
    ) x
  ),
  'sample_new_candidates', (
    select jsonb_agg(to_jsonb(x))
    from (
      select candidate_id, name, district, suggested_action
      from classified
      where dedup_bucket = 'new_candidate'
      order by name
      limit 30
    ) x
  )
)) as result
from classified
limit 1;
`;

writeFileSync(outputJsonPath, JSON.stringify({ input_path: inputPath, rows: candidates }, null, 2) + "\n");
writeFileSync(outputSqlPath, sql);
console.log(JSON.stringify({ input_rows: rows.length, output_json: outputJsonPath, output_sql: outputSqlPath }));
