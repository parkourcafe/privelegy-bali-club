#!/usr/bin/env node
// Read-only probe: does the live dataset actually evidence the four modifiers?
//
// GET-only, anon key, RLS-constrained. Credentials are read from the environment
// and never written to disk or echoed. Writes only a tag-vocabulary report under
// docs/intent-os/data-readiness/.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT } from './lib.mjs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
if (!url || !anonKey) { console.error('BLOCKED: anon credentials absent'); process.exit(2); }

const base = url.replace(/\/+$/, '');
const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' };

const select = ['slug', 'name', 'district', 'jobs', 'vibe_tags', 'practical_tags', 'best_for', 'why_its_here', 'publication_status'].join(',');
const res = await fetch(`${base}/rest/v1/venues?select=${select}&limit=2000`, { method: 'GET', headers });
if (!res.ok) { console.error(`GET failed: ${res.status}`); process.exit(2); }
const all = await res.json();

const published = all.filter((v) => v.publication_status === 'published');
const norm = (j) => (j ?? []).map((x) => String(x).replace(/-/g, '_'));
const dateNight = published.filter((v) => norm(v.jobs).includes('date_night_special'));
const ubudDateNight = dateNight.filter((v) => v.district === 'ubud');

// Full tag vocabulary across published venues.
const vibe = {}; const practical = {};
for (const v of published) {
  for (const t of (v.vibe_tags ?? [])) vibe[t] = (vibe[t] ?? 0) + 1;
  for (const t of (v.practical_tags ?? [])) practical[t] = (practical[t] ?? 0) + 1;
}

// Candidate token sets per modifier. A modifier is SUPPORTED only if at least
// one token actually occurs on date-night venues.
const CANDIDATES = {
  quiet: ['quiet', 'calm', 'peaceful', 'intimate', 'no_loud_music', 'low_key', 'serene', 'tranquil'],
  sunset_view: ['sunset', 'sunset_view', 'view', 'valley_view', 'ocean_view', 'rice_field_view', 'golden'],
  secluded: ['secluded', 'private', 'hidden', 'tucked_away', 'jungle', 'romantic'],
  special_occasion: ['special_occasion', 'celebration', 'birthday', 'anniversary', 'occasion'],
};

const report = {};
for (const [mod, tokens] of Object.entries(CANDIDATES)) {
  const hits = {};
  for (const tok of tokens) {
    const n = dateNight.filter((v) => [...(v.vibe_tags ?? []), ...(v.practical_tags ?? [])]
      .some((t) => String(t).toLowerCase().replace(/[- ]/g, '_').includes(tok))).length;
    const nUbud = ubudDateNight.filter((v) => [...(v.vibe_tags ?? []), ...(v.practical_tags ?? [])]
      .some((t) => String(t).toLowerCase().replace(/[- ]/g, '_').includes(tok))).length;
    if (n > 0) hits[tok] = { date_night: n, ubud_date_night: nUbud };
  }
  // special_occasion also has its own job slug.
  if (mod === 'special_occasion') {
    const n = dateNight.filter((v) => norm(v.jobs).includes('special_occasion')).length;
    const nUbud = ubudDateNight.filter((v) => norm(v.jobs).includes('special_occasion')).length;
    if (n > 0) hits['jobs:special_occasion'] = { date_night: n, ubud_date_night: nUbud };
  }
  report[mod] = { tokens_with_hits: hits, supported: Object.keys(hits).length > 0 };
}

const out = {
  observed_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  read_only: true, mutating_verbs_used: [],
  published_venues: published.length,
  date_night_published: dateNight.length,
  ubud_date_night_published: ubudDateNight.length,
  modifier_evidence: report,
  vibe_tag_vocabulary: Object.fromEntries(Object.entries(vibe).sort((a, b) => b[1] - a[1]).slice(0, 60)),
  practical_tag_vocabulary: Object.fromEntries(Object.entries(practical).sort((a, b) => b[1] - a[1]).slice(0, 60)),
};
mkdirSync(join(REPO_ROOT, 'docs/intent-os/data-readiness'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'docs/intent-os/data-readiness/MODIFIER_EVIDENCE_PROBE.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');

console.log(`published=${published.length} date_night=${dateNight.length} ubud_date_night=${ubudDateNight.length}`);
for (const [mod, r] of Object.entries(report)) {
  console.log(`${r.supported ? 'SUPPORTED' : 'UNSUPPORTED'}  ${mod}`);
  for (const [tok, c] of Object.entries(r.tokens_with_hits)) console.log(`    ${tok}: date_night=${c.date_night} ubud=${c.ubud_date_night}`);
}
