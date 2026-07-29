#!/usr/bin/env node
// Stage 8 — keyword/SERP validation.
//
// Only candidates whose SERP was actually researched receive a serp_opportunity
// score. Everything else stays 0 with serp_status=UNKNOWN, per
// `unknown_search_volume: UNKNOWN` and the ban on inventing evidence.
// No search volume is recorded anywhere: no verified volume source was available.

import { writeFileSync } from 'node:fs';
import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

/**
 * Observed SERP evidence. Every URL below appeared in a live search run on
 * 2026-07-29 via the configured web search tool. Nothing here is recalled.
 */
const RESEARCHED = {
  'OB-CAN-0011': {
    query_variants: ['romantic restaurants Ubud', 'best romantic dinner Ubud', 'Ubud date night restaurants', 'romantic dinner Bali Ubud view'],
    serp_intent: 'commercial-investigational: pick a specific restaurant for a couple occasion',
    top_urls: [
      'https://sayanvalley.com/romantic-restaurants-in-ubud/',
      'https://www.karolinagenova.com/bali-blog/romantic-restaurants-ubud',
      'https://indonesia.tripcanvas.co/bali/ubud-restaurants/',
      'https://thesamaya.com/ubud/dining',
      'https://www.kubuatmandapa.com/',
    ],
    interactive_tools_ranking: 'NONE observed',
    content_format: 'editorial listicle (top-5 / top-10 / top-25) plus venue-owned pages',
    market: 'global English-language travel search; results skew to Bali-resident bloggers and venue sites',
    seasonality: 'UNKNOWN (no verified seasonality source)',
    zero_click_risk: 'MODERATE — listicles attract featured snippets, but the choice itself needs a page visit',
    cannibalization_risk: 'REAL — repo already exposes /bali/[district]/date-night via lib/intents.ts; a new tool must reuse that intent, not duplicate it',
    score: 9,
    rationale: 'No interactive decision tool ranks at all; the entire first page is static editorial and venue marketing. '
      + 'This is squarely Other Bali\'s owned territory (selection, editorial verdict, Best for / Not ideal for). '
      + 'Held at 9 not 10 because listicle incumbency is strong and cannibalization against the existing date-night spoke is real.',
  },
  'OB-CAN-0007': {
    query_variants: ['breakfast open before 7am Canggu', 'early morning coffee Canggu', 'cafes open 6am Bali'],
    serp_intent: 'local-practical: find somewhere actually open at a specific early hour',
    top_urls: [
      'https://loopbali.com/early-morning-coffee-canggu',
      'https://loopbali.com/breakfast-canggu',
      'https://www.kayumacoffee.com/',
      'https://local-coffee.goto-where.com/',
    ],
    interactive_tools_ranking: 'NONE observed',
    content_format: 'single venue running programmatic SEO against the exact query, plus individual venue pages',
    market: 'Canggu/Pererenan-local English search',
    seasonality: 'UNKNOWN (no verified seasonality source)',
    zero_click_risk: 'HIGH — Google Maps answers "open now" natively without a click',
    cannibalization_risk: 'LOW — no existing Other Bali route owns opening-hours filtering',
    score: 6,
    rationale: 'No tool ranks, and the top result openly admits "hours can drift, check Google Maps on the morning you go", '
      + 'which is a genuine freshness gap Other Bali\'s last_verified_at could close. Scored only 6 because zero-click risk '
      + 'is high and opening-hours filtering sits adjacent to AGENTS.md guardrail 1 (no Google Maps clone).',
  },
  'OB-CAN-0018': {
    query_variants: ['laptop friendly cafe Canggu', 'best wifi cafe Bali work', 'cafes with power outlets Canggu'],
    serp_intent: 'commercial-investigational: pick a cafe to work from today',
    top_urls: [
      'https://geronimo-ai.com/best-cafes/bali-canggu/ruko-cafe',
      'https://geronimo-ai.com/best-cafes/bali-canggu/amolas',
      'https://baliuntold.com/destinations/canggu/laptop-friendly-cafes/',
      'https://loopbali.com/work-friendly-cafe-canggu',
    ],
    interactive_tools_ranking: 'YES — geronimo-ai.com ranks a comparison tool with per-cafe work scores, measured WiFi Mbps and feature tables',
    content_format: 'structured comparison tool plus long-form listicle',
    market: 'digital-nomad English search, Canggu-centric',
    seasonality: 'UNKNOWN (no verified seasonality source)',
    zero_click_risk: 'MODERATE',
    cannibalization_risk: 'REAL — repo exposes /bali/[district]/work-cafe via lib/intents.ts',
    score: 5,
    rationale: 'An interactive tool already occupies this SERP and competes on measured WiFi speed, a datum Other Bali does '
      + 'not hold and cannot invent. Entering here would mean losing on the incumbent\'s axis.',
  },
};

const COLUMNS = [
  'canonical_intent_id', 'canonical_name', 'serp_status', 'query_variants', 'serp_intent',
  'top_urls', 'interactive_tools_ranking', 'content_format', 'market', 'seasonality',
  'search_volume', 'zero_click_risk', 'cannibalization_risk',
  'serp_opportunity_score', 'rationale', 'observed_at', 'generator', 'source_version',
];

const { records: shortlist } = readCsv(paths.shortlist);

const rows = shortlist.map((c) => {
  const r = RESEARCHED[c.canonical_intent_id];
  if (!r) {
    return {
      canonical_intent_id: c.canonical_intent_id,
      canonical_name: c.canonical_name,
      serp_status: 'UNKNOWN',
      query_variants: '', serp_intent: '', top_urls: '', interactive_tools_ranking: '',
      content_format: '', market: '', seasonality: 'UNKNOWN',
      search_volume: 'UNKNOWN', zero_click_risk: 'UNKNOWN', cannibalization_risk: 'UNKNOWN',
      serp_opportunity_score: 0,
      rationale: 'SERP not researched in this run; scored 0 rather than estimated (unknown_search_volume: UNKNOWN)',
      observed_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
    };
  }
  return {
    canonical_intent_id: c.canonical_intent_id,
    canonical_name: c.canonical_name,
    serp_status: 'RESEARCHED',
    query_variants: r.query_variants.join(' | '),
    serp_intent: r.serp_intent,
    top_urls: r.top_urls.join(' | '),
    interactive_tools_ranking: r.interactive_tools_ranking,
    content_format: r.content_format,
    market: r.market,
    seasonality: r.seasonality,
    search_volume: 'UNKNOWN',
    zero_click_risk: r.zero_click_risk,
    cannibalization_risk: r.cannibalization_risk,
    serp_opportunity_score: r.score,
    rationale: r.rationale,
    observed_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  };
});

writeCsv(paths.serpScorecard, rows, COLUMNS);

// Fold the SERP score back into the shortlist totals.
const serpById = new Map(rows.map((r) => [r.canonical_intent_id, Number(r.serp_opportunity_score)]));
const updated = shortlist.map((c) => {
  const serp = serpById.get(c.canonical_intent_id) ?? 0;
  const prevSerp = Number(c.serp_opportunity) || 0;
  const total = Number(c.total_score) - prevSerp + serp;
  return { ...c, serp_opportunity: serp, total_score: total };
}).sort((a, b) => b.total_score - a.total_score);
writeCsv(paths.shortlist, updated, Object.keys(updated[0]));

const notes = `# SERP Research Notes V0.1

**Observed:** ${nowIso()} · live web search via the configured tool
**Researched:** ${Object.keys(RESEARCHED).length} of ${shortlist.length} shortlisted candidates

## Method and its limits

Three candidates were researched against live SERPs. The remaining ${shortlist.length - Object.keys(RESEARCHED).length}
carry \`serp_status=UNKNOWN\` and \`serp_opportunity_score=0\`. They are **not** scored low on merit —
they are unscored. Estimating them would breach \`forbidden_behaviors: invent_evidence\`.

**No search volume is recorded anywhere in this artifact.** No verified volume source was available,
so every \`search_volume\` cell reads \`UNKNOWN\` per \`unknown_search_volume: UNKNOWN\`.

## Findings

${Object.entries(RESEARCHED).map(([id, r]) => `### ${id} — score ${r.score}/10

- **SERP intent:** ${r.serp_intent}
- **Content format:** ${r.content_format}
- **Interactive tools ranking:** ${r.interactive_tools_ranking}
- **Zero-click risk:** ${r.zero_click_risk}
- **Cannibalization risk:** ${r.cannibalization_risk}
- **Seasonality:** ${r.seasonality}
- **Top URLs observed:**
${r.top_urls.map((u) => `  - ${u}`).join('\n')}

${r.rationale}
`).join('\n')}

## Cross-cutting observation

The decisive difference between these three is **whether an interactive tool already ranks**.

For romantic dinner in Ubud the entire first page is static editorial and venue marketing, and the
job is an editorial-verdict decision — the exact territory \`AGENTS.md\` §5 assigns to Other Bali
("selection · editorial verdict · Best for / Not ideal for").

For laptop-friendly cafés an incumbent tool already competes on measured WiFi throughput, a datum
Other Bali does not hold. Competing there would mean losing on the incumbent's axis or inventing
measurements.

For early breakfast the gap is real — the top-ranking page itself tells readers to re-check Google
Maps because hours drift — but the job sits close to guardrail 1 (no Google Maps clone) and carries
high zero-click risk because Maps answers "open now" natively.
`;
writeFileSync(paths.serpNotes, notes, 'utf8');

const state = readState() ?? {};
state.state = 'SELECT_PILOT';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'KEYWORD_SERP'])];
writeState(state);

appendDecision(`
## ${nowIso()} — KEYWORD_SERP: ${Object.keys(RESEARCHED).length} of ${shortlist.length} researched

Live SERP research run for the three highest-scoring candidates. The remaining
${shortlist.length - Object.keys(RESEARCHED).length} are \`UNKNOWN\`, scored 0, explicitly not estimated.

No search volume was recorded: no verified volume source was available.

Key discriminator: an interactive tool already ranks for laptop-friendly cafés (geronimo-ai.com,
competing on measured WiFi Mbps that Other Bali does not hold), while the Ubud romantic-dinner SERP
contains no tool at all and is pure editorial territory.
`);

appendEvent({
  stage: 'KEYWORD_SERP',
  status: 'PASS',
  inputs: [rel(paths.shortlist)],
  outputs: [rel(paths.serpScorecard), rel(paths.serpNotes)],
  checks: [`researched=${Object.keys(RESEARCHED).length}`, `unknown=${shortlist.length - Object.keys(RESEARCHED).length}`,
    'search_volume=UNKNOWN for all rows'],
  decisions: Object.entries(RESEARCHED).map(([id, r]) => `${id}=serp:${r.score}`),
  next_state: 'SELECT_PILOT',
});

console.log(`researched: ${Object.keys(RESEARCHED).length}; unknown: ${shortlist.length - Object.keys(RESEARCHED).length}`);
for (const r of updated.slice(0, 5)) console.log(`  ${r.total_score}  ${r.canonical_intent_id}  ${r.canonical_name.slice(0, 52)}`);
console.log('-> SELECT_PILOT');
