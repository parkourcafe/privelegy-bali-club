import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw new Error("Usage: node script input.csv output.sql");

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ""; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift().map((x) => x.replace(/^\uFEFF/, ""));
  return rows.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

const clean = (v) => {
  const x = String(v ?? "").trim();
  return /^(null\s*)+$/i.test(x) ? "" : x;
};
const q = (v) => clean(v) ? `'${clean(v).replaceAll("'", "''")}'` : "null";
const num = (v) => clean(v) && /^\d+(\.\d+)?$/.test(clean(v).replaceAll(",", "")) ? clean(v).replaceAll(",", "") : "null";
const slugify = (v) => v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const normalizeUrl = (v, kind) => {
  const x = clean(v);
  if (!x) return "";
  if (x.startsWith("http://") || x.startsWith("https://")) return x;
  if (kind === "instagram") return `https://www.instagram.com/${x.replace(/^@/, "").replace(/\/$/, "")}/`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(x)) return `https://${x}`;
  return x;
};
const digits = (v) => clean(v).replace(/\D/g, "");

const source = parseCsv(fs.readFileSync(input, "utf8"));
const open = source.filter((r) => clean(r.status).toLowerCase() === "open");
const grouped = new Map();
for (const r of open) {
  const key = `${clean(r.name).toLowerCase()}|${clean(r.district).toLowerCase()}`;
  const current = grouped.get(key);
  if (!current) grouped.set(key, { ...r, categories: [clean(r.category).toLowerCase()] });
  else if (!current.categories.includes(clean(r.category).toLowerCase())) current.categories.push(clean(r.category).toLowerCase());
}

const rows = [...grouped.values()].sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name));
const values = rows.map((r) => {
  const cats = r.categories;
  const preferred = ["yoga", "fitness", "spa", "beauty"].find((c) => cats.includes(c)) ?? cats[0];
  const slug = `${slugify(r.name)}-${slugify(r.district)}`;
  const maps = clean(r.google_maps_search);
  const official = normalizeUrl(r.website);
  const instagram = normalizeUrl(r.instagram, "instagram");
  return `  (${q(slug)}, ${q(r.name)}, ${q(preferred)}, ${q(r.district.toLowerCase().replaceAll(" ", "-"))}, ${q(r.area)}, ${q(maps)}, ${q(official)}, ${q(instagram)}, ${q(r.opening_hours)}, ${q(r.price)}, ${q(r.phone)}, ${q(digits(r.whatsapp))}, ${q(r.email)}, ${num(r.google_rating)}, ${num(r.google_reviews)}, ${q(clean(r.rating_is_google_proxy).toLowerCase() === "yes" ? "proxy" : "google_pin")}, array[${cats.map(q).join(", ")} ]::text[])`;
}).join(",\n");

const sql = `-- Other Bali wellness & beauty import — generated from IMPORT_108.
-- Source rows: ${source.length}; imported open rows: ${open.length}; unique venues: ${rows.length}.
-- Excluded: ${source.length - open.length} non-open row(s). Multi-category venues remain one venue with wellness_categories[].

begin;

alter table public.venues add column if not exists phone text;
alter table public.venues add column if not exists email text;
alter table public.venues add column if not exists google_rating numeric(2,1);
alter table public.venues add column if not exists google_reviews integer;
alter table public.venues add column if not exists rating_source text;
alter table public.venues add column if not exists price_text text;
alter table public.venues add column if not exists wellness_categories text[];

drop table if exists public.wellness_import_stage;
create table public.wellness_import_stage (
  slug text, name text, category text, district text, area text,
  gmaps_url text, official_url text, instagram_url text, opening_hours text,
  price_text text, phone text, whatsapp text, email text,
  google_rating numeric(2,1), google_reviews integer, rating_source text,
  wellness_categories text[]
);

insert into public.wellness_import_stage (
  slug, name, category, district, area, gmaps_url, official_url,
  instagram_url, opening_hours, price_text, phone, whatsapp, email,
  google_rating, google_reviews, rating_source, wellness_categories
)
values
${values}
;

-- Enrich an existing physical venue first (notably the prior Ubud wellness pass).
update public.venues v set
  category = i.category,
  area = coalesce(i.area, v.area),
  gmaps_url = coalesce(i.gmaps_url, v.gmaps_url),
  official_url = coalesce(i.official_url, v.official_url),
  instagram_url = coalesce(i.instagram_url, v.instagram_url),
  opening_hours = coalesce(i.opening_hours, v.opening_hours),
  price_text = coalesce(i.price_text, v.price_text),
  phone = coalesce(i.phone, v.phone),
  whatsapp = coalesce(i.whatsapp, v.whatsapp),
  email = coalesce(i.email, v.email),
  google_rating = coalesce(i.google_rating, v.google_rating),
  google_reviews = coalesce(i.google_reviews, v.google_reviews),
  rating_source = coalesce(i.rating_source, v.rating_source),
  wellness_categories = i.wellness_categories,
  status = 'active', publication_status = 'published', last_verified_at = date '2026-07-13'
from public.wellness_import_stage i
where lower(btrim(v.name)) = lower(btrim(i.name)) and v.district = i.district;

insert into public.venues (
  id, slug, name, category, district, area, address, gmaps_url, official_url,
  instagram_url, opening_hours, price_text, phone, whatsapp, email,
  google_rating, google_reviews, rating_source, wellness_categories,
  tier, is_sponsored, status, publication_status, last_verified_at
)
select
  gen_random_uuid()::text, slug, name, category, district, area, area, gmaps_url,
  official_url, instagram_url, opening_hours, price_text, phone, whatsapp, email,
  google_rating, google_reviews, rating_source, wellness_categories,
  'editorial_seed', false, 'active', 'published', date '2026-07-13'
from public.wellness_import_stage i
where not exists (
  select 1 from public.venues v
  where v.slug = i.slug
     or (lower(btrim(v.name)) = lower(btrim(i.name)) and v.district = i.district)
)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  district = excluded.district,
  area = excluded.area,
  address = excluded.address,
  gmaps_url = excluded.gmaps_url,
  official_url = excluded.official_url,
  instagram_url = excluded.instagram_url,
  opening_hours = excluded.opening_hours,
  price_text = excluded.price_text,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  google_rating = excluded.google_rating,
  google_reviews = excluded.google_reviews,
  rating_source = excluded.rating_source,
  wellness_categories = excluded.wellness_categories,
  status = 'active',
  publication_status = 'published',
  last_verified_at = excluded.last_verified_at;

drop table public.wellness_import_stage;

commit;
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, sql);
console.log(`Wrote ${rows.length} unique venues to ${output}`);
