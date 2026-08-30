# Recorded workflow — one Other Bali venue

Use the phases in order. Update the venue's `RUNLOG.md` after every phase,
including failed attempts and deliberate skips. The log is the handoff record;
chat history is not.

## Phase 0 — Bind scope and authority

Record the repository, branch/worktree, baseline commit, venue name, intended
district, current user authorization and prohibited mutations. Classify the
run:

- `existing_public_card`;
- `existing_unpublished_record`;
- `new_candidate`;
- `identity_unknown`.

Do not assume access to database, deployment, paid AI systems or publication.

Exit: one venue and one run folder are unambiguously bound.

## Phase 1 — Resolve identity and duplicates

Match the venue using at least name plus one stronger identifier: official
domain, official Maps URL/Place ID, exact address or partner record. Check:

- public Other Bali place URLs;
- places sitemap;
- relevant guides;
- repository artifacts;
- unpublished database rows when exact project binding and read access exist.

Record alternate names and branch/outlet scope. Public absence is
`NO_PUBLIC_MATCH_FOUND`, not proof of database absence.

Create `entity-consistency.json`. Compare name, category/type, official URL,
address, coordinates/Maps identity, phone, opening status, hours and connected
profiles across the official venue source, Other Bali, Maps/GBP when available,
Instagram and the booking provider. Record conflicts; do not choose a winner by
majority vote.

Exit: exact record/slug is bound, or identity remains `HOLD`.

## Phase 2 — Capture the before-state

Save the current public URL/HTTP status, title, canonical, robots state,
sitemap membership, visible card fields, structured data and internal links.
Inspect the database row separately when available. Record fields that exist in
storage but are not selected, mapped or rendered.

If a public card exists, capture a free/manual AI baseline before changing it.
Reuse the approved site/district prompt library and add only a small
venue-specific layer. Store raw responses outside summary files. Do not launch
a paid multi-platform run without explicit spend approval.

Exit: factual baseline with public, repository and database evidence kept
separate.

## Phase 3 — Preserve primary evidence

Capture official pages and provider handoffs before interpreting them. Add each
source to `source-manifest.json` with URL, source type, capture time, supported
fields and limitations. For volatile facts, record `verifiedAt` and a planned
review date. Refresh on a factual change, detected conflict or stale threshold;
never bump a date only to make the page look fresh.

Source order:

1. official venue website and first-party structured data;
2. official booking/menu/contact/provider pages linked by the venue;
3. owner or partner submission;
4. recorded Other Bali editorial research;
5. licensed structured sources where repository policy allows them.

Review platforms, directory clones, search snippets and AI answers do not
become publication provenance.

Exit: raw evidence is durable and every candidate claim can name its source.

## Phase 4 — Build the fact matrix

For identity, geography, category, hours, menu, prices, actions, policies,
media and distinctive facts, assign one state:

- `VERIFIED` — source directly supports the value;
- `VERIFIED_OWNER_CLAIM` — first-party marketing/biography claim;
- `VERIFIED_PARTIAL` — source supports only part of the needed field;
- `HOLD` — evidence conflicts or required precision is missing;
- `UNKNOWN` — no acceptable evidence;
- `STALE` — evidence exists but is outside its review window;
- `REJECTED` — source/value failed acceptance, with reason.

Resolve conflicts conservatively. A useful but unsupported field stays null.

For restaurants, repeat one schedule across all operating days and represent a
day off with an empty interval. When the verified rule is `until late` or
`until the last guest`, retain that open-ended human-readable value and omit a
structured closing time. Do not turn it into an invented clock time.

Exit: no proposed public fact lacks a state and source decision.

## Phase 5 — Measure card coverage

Compare the record with Other Bali Tier A requirements:

- identity and location;
- category/type;
- `why_its_here`, `best_for`, `not_for`;
- price band/anchor;
- hours/status;
- primary action;
- key fit warnings;
- approved hero media;
- verification date.

Then verify each stored field crosses all three gates: selected in the public
read, mapped to the domain object and rendered. Do not collect more data when
the real problem is invisible existing data.

Exit: a field-level gap list ranked by decision value and evidence risk.

## Phase 6 — Draft the venue record

Use the venue-record standard. Write short English public copy with one fact per
sentence. Keep owner claims distinguishable from Other Bali editorial
judgement. Use exact numbers when sourced; do not convert adjectives into
invented ranges.

Hard rules:

- `what_to_order` requires current menu evidence;
- `price_anchor` requires current price evidence;
- `opening_hours_json` requires exact per-day hours;
- a locality is not a street address;
- `not_for` is fit context, not a quality complaint;
- `last_verified_at` changes only after a real source re-check.

Link every non-null critical field to source IDs in `fieldEvidence`.

Exit: `draft-venue-record.json` is complete enough to review and unsupported
fields remain null.

## Phase 7 — Prepare actions and media

Capture only provider handoffs controlled or linked by the venue. Mark actions
`draft`; distinguish `reserve`, `directions`, `website`, `whatsapp`, delivery
and takeaway. Confirm that Maps resolves to the same venue before promotion.

Record photo source and rights state. Fallback artwork must never look like
venue photography.

When video can materially answer a traveller question, distinguish:

- first-party venue video;
- Other Bali field/editorial video;
- independent third-party coverage.

Record the video URL, speaker/owner, capture date, transcript URL or transcript
availability and the exact claim it supports. A video without accessible text
is weaker retrieval evidence; an Other Bali video is not independent coverage.

Exit: primary action and media are verified, or their blockers are explicit.

## Phase 8 — Review extractability

Check that a reader or retrieval system can lift each sentence independently:

- the venue is named;
- the location and category are explicit;
- distinctive facts are concrete;
- prices/hours appear only when exact;
- limitations sit beside the affected claim;
- important facts are visible in server-rendered HTML, not hidden behind a
  click or image-only menu.

The first visible venue description should answer what the restaurant is,
where it is and why it is useful before background narrative. A 40–80 word
answer capsule is an optional editorial test, not an algorithmic threshold and
not a reason to duplicate good existing card copy. Use lists/tables only when
the content is genuinely a sequence or comparison.

Do not add `llms.txt`, invented “AI schema” or duplicate markdown pages without
a specific consumer and evidence that the change is needed.

Exit: the draft is clear and attributable, not merely keyword-rich.

## Phase 9 — Review schema and technical SEO

Apply the schema-markup standard. Confirm category-to-schema type, conditional
address, hours, geo, phone, image, map and sameAs gates. Structured data must
match visible content. Never emit Google `aggregateRating` or unsupported
facts.

Check intended canonical, noindex/snippet controls, SSR HTML, sitemap policy and
robots/CDN behavior. Crawler access is diagnostic evidence, not citation proof.

Exit: proposed public representation is internally consistent and has refusal
tests for missing/invalid facts.

## Phase 10 — Decide guide and internal-link placement

Guide inclusion is an editorial decision, not an automatic consequence of a
complete record. Confirm distinct fit, guide intent, cannibalization risk and
slug-gated rendering. Follow the district pipeline if a URL or guide structure
changes.

Record useful links from the guide/district page to the venue and from the venue
back to the relevant discovery surface. Never imply paid placement or
pay-to-rank.

Create `citation-source-map.json` from the actual prompt baseline when one
exists. Classify repeatedly cited URLs as official sites, directories, media,
guides, communities, video or other. Prioritise the pages already cited for the
relevant Bali query cluster; do not apply a generic US platform checklist.

Independent coverage, community participation, mentions/backlinks and honest
review collection are optional owner/editor-led opportunities. Other Bali may
record them and prepare research, but must not fabricate participation,
prescribe review wording or present its own guide as an independent source.
Wikipedia/Wikidata remains eligibility-only, never a routine venue tactic.

Site-level aggregates can strengthen guides, not individual cards. Publish
them only with definitions, period, sample, calculation and limitations; never
manufacture a statistic for one venue.

Exit: approved placement plan or a recorded editorial `HOLD`.

## Phase 11 — Prepare the exact change

Only after evidence and editorial review, prepare a one-record guarded change.
Use the Supabase-write skill before any database mutation. Verify exact slug/ID,
before-image, expected affected-row count and rollback path. Run a dry-run or
non-mutating plan first.

Keep branch/PR, database write, publication, guide inclusion, deploy and
production verification as separate authorization layers.

Exit: `IMPLEMENTATION_READY`, not published.

## Phase 12 — Run local and preview QA

Run the smallest supported gates for the files changed, then the repository
quality gates required by `AGENTS.md`. For a public venue/guide change verify:

- visible facts and missing-field behavior;
- schema success and refusal cases;
- canonical, robots and sitemap behavior;
- internal links and mobile rendering;
- guide-page checker when a guide is affected;
- no unrelated diff and no secrets.

Record commands and exact outcomes. A check not run is `NOT_RUN`, never passed.

Exit: reviewable change with all errors resolved or a precise blocker.

## Phase 13 — Verify production separately

After separately authorized publication/deployment, inspect the live venue URL.
Confirm HTTP status, visible content, canonical, robots, sitemap, JSON-LD,
actions and guide membership. Use Rich Results Test for structured data.

Repository, CI and preview success do not prove production state.

Exit: `PUBLIC_CARD_VERIFIED` with dated live evidence.

## Phase 14 — Measure AI visibility

Create a stable prompt library covering discovery, comparison, fit, practical
facts and branded correction. Fix market, language, platform, date and
personalization state. Save raw responses and cited URLs.

Use two layers:

1. a shared, versioned Other Bali library for district/category/scenario
   queries;
2. a small venue-specific set for identity, factual correction and distinctive
   fit.

Do not repeat a full project-scale prompt library for every restaurant. Record
the shared library version, venue-specific prompts, cohort ID, change date and
comparable control URLs in `measurement-plan.json`.

Measure separately:

- presence;
- citations and cited pages;
- factual accuracy;
- message match;
- referral traffic when observable;
- crawler activity as diagnostic only;
- the actual cited-source mix in `citation-source-map.json`.

Keep platform results separate. When available and authorized, join prompt
monitoring with Search Console, analytics, server/CDN logs, web mentions and
business outcomes. These signals have different coverage and must not be
collapsed into one unexplained score.

Offer a free/manual baseline separately from paid multi-system measurement.
Repeat on the same prompt set and conditions after an agreed observation
window. Change one cohort at a time where practical; preserve controls and the
change date. One answer is not a trend.

Exit: `AI_MEASUREMENT_ACTIVE`; use `AI_CITATION_OBSERVED` only for a saved,
dated grounded answer that cites the Other Bali venue or guide URL.
